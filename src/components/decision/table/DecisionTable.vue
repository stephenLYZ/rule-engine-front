<template>
  <div>
    <el-form ref="searchForm" :inline="true" :model="search.form" label-width="60px">
      <el-form-item label="名称" prop="name">
        <el-input v-model="search.form.name"/>
      </el-form-item>
      <el-form-item label="编码" prop="code">
        <el-input v-model="search.form.code"/>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="search.form.status"
                   placeholder="请选择数据 ">
          <el-option label="全部" :value="null"/>
          <el-option label="编辑中" value="0"/>
          <el-option label="待发布" value="1"/>
          <el-option label="已发布" value="2"/>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="list()" icon="el-icon-search">搜索</el-button>
        <el-button type="reset" @click="reset('searchForm')">重置</el-button>
      </el-form-item>
    </el-form>

    <el-button type="primary" @click="create()">新建决策表</el-button>


    <el-table
      v-loading="loading"
      :data="tableData"
      style="width: 100%"
      height="calc(100vh - 260px)"
      :default-sort="{prop: 'id', order: 'descending'}">
      <el-table-column
        prop="id"
        label="编号"
        sortable
        width="120">
      </el-table-column>
      <el-table-column
        prop="name"
        min-width="200"
        label="名称">
      </el-table-column>

      <el-table-column
        prop="code"
        label="编码"
        width="230">
      </el-table-column>

      <el-table-column
        prop="createUserName"
        label="创建人"
        width="180">
      </el-table-column>

      <el-table-column
        label="状态"
        width="180">
        <template slot-scope="scope">
          <!-- !scope.row.isPublish 防止消息队列延迟-->
          <el-tag v-if="scope.row.publishVersion!==null" @click="show(scope.row)"
                  size="medium" effect="plain" style="cursor: pointer">
            （ 已发布 ）
          </el-tag>
          <el-tag v-if="scope.row.status===0" @click="edit(scope.row)" type="warning" size="medium" effect="plain"
                  style="cursor: pointer">
            （ 编辑中 ）
          </el-tag>
          <el-tag v-else-if="scope.row.status===1" @click="edit(scope.row)" type="success" size="medium" effect="plain"
                  style="cursor: pointer">
            （ 待发布 ）
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column
        prop="createTime"
        sortable
        width="180"
        label="创建日期">
      </el-table-column>

      <el-table-column
        fixed="right"
        label="操作"
        width="120">
        <template slot-scope="scope">
          <el-button @click="edit(scope.row)" type="text" size="small">编辑</el-button>
          <el-button @click="deleteRow(scope.row)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <br>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page.pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="page.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="page.total">
    </el-pagination>

  </div>
</template>

<script>
    export default {
        name: "DecisionTable",
        data() {
            return {
                search: {
                    form: {
                        name: null,
                        code: null,
                        status: null
                    }
                },
                tableData: [],
                loading: false,
                page: {
                    pageIndex: 1,
                    pageSize: 10,
                    total: 0
                },
            }
        }, methods: {
            create() {
                this.$router.push("/DecisionTableDefinition")
            },
            reset(formName) {
                this.search.form.status = null;
                this.$refs[formName].resetFields();
                this.list();
            },
            edit(row) {
                // 可执行｜已发布
                if (row.status === 1 || row.status === 2) {
                    this.$router.push({path: '/DecisionTableViewAndTest', query: {decisionTableId: row.id}});
                    return;
                }
                this.$router.push({path: '/DecisionTableConfig', query: {decisionTableId: row.id}});
            },
            deleteRow(row) {
                this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.post("/ruleEngine/decisionTable/delete", {
                        "id": row.id
                    }).then(res => {
                        let da = res.data;
                        if (da) {
                            this.$message({
                                showClose: true,
                                message: '删除成功',
                                type: 'success'
                            });
                            this.list();
                        }
                    }).catch(function (error) {
                        console.log(error);
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            show(row) {
                this.$router.push({path: '/DecisionTableViewPublish', query: {decisionTableId: row.id}});
            },
            list() {
                this.loading = true;
                this.$axios.post("/ruleEngine/decisionTable/list", {
                    "page": {
                        "pageSize": this.page.pageSize,
                        "pageIndex": this.page.pageIndex
                    },
                    "query": {
                        "name": this.search.form.name,
                        "code": this.search.form.code,
                        "status": this.search.form.status,
                    },
                    "orders": [
                        {
                            "columnName": "id",
                            "desc": true
                        }
                    ]
                }).then(res => {
                    if (res.data != null) {
                        this.tableData = res.data.rows;

                        this.page.total = res.data.page.total;
                    } else {
                        this.tableData = [];
                    }
                    this.loading = false;
                }).catch(function (error) {
                    console.log(error);
                });
            },
            handleSizeChange(val) {
                this.page.pageSize = val;
                this.list();
            },
            handleCurrentChange(val) {
                this.page.pageIndex = val;
                this.list();
            },
        }, mounted() {
            this.list();
        }
    }
</script>

<style scoped>
  .el-tag {
    padding: 0;
  }
</style>
