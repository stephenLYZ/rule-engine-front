<template xmlns="">
  <div id="app">

    <el-form ref="searchForm" :inline="true" :model="search.form" label-width="40px">
      <el-form-item label="名称" prop="name">
        <el-input v-model="search.form.name"/>
      </el-form-item>
      <el-form-item label="编码" prop="code">
        <el-input v-model="search.form.code"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="list()" icon="el-icon-search">搜索</el-button>
        <el-button type="reset" @click="reset('searchForm')">重置</el-button>
      </el-form-item>
    </el-form>

    <el-button type="primary" @click="addElementForm">新建元素</el-button>

    <el-dialog :title="form.id===null?'新建元素':'更新元素'" :visible.sync="dialogFormVisible" width="700px">
      <el-form ref="saveOrUpdateForm" :rules="rules" :model="form" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name"/>
        </el-form-item>

        <el-form-item label="编码" prop="code">
          <el-input v-model="form.code" :disabled="form.id!==null"/>
        </el-form-item>

        <el-form-item label="数据类型" prop="valueType">
          <el-select v-model="form.valueType" placeholder="请选择数据类型" :disabled="form.id!==null">
            <el-option label="字符串" value="STRING"/>
            <el-option label="布尔" value="BOOLEAN"/>
            <el-option label="数值" value="NUMBER"/>
            <el-option label="集合" value="COLLECTION"/>
            <el-option label="日期" value="DATE"/>
          </el-select>
        </el-form-item>

        <el-form-item label="说明" prop="description">
          <el-input type="textarea" v-model="form.description"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdateClick('saveOrUpdateForm')">保 存</el-button>
      </div>
    </el-dialog>

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
        label="名称"
        sortable
        width="200">
      </el-table-column>
      <el-table-column
        prop="code"
        label="编码"
        width="200">
      </el-table-column>
      <el-table-column
        prop="valueType"
        label="数据类型">
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
        width="140">
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
        name: "Element",
        data() {
            const patter = /^[a-zA-Z][a-zA-Z0-9_&#\-]*$/;
            const validateIsExists = (rule, value, callback) => {
                // 更新操作跳过此校验
                if (this.form.id !== undefined && this.form.id !== null) {
                    return callback();
                }
                if (!patter.test(value)) {
                    return callback(new Error('字母开头，以及字母数字_&#-组成'));
                }
                this.$axios.post("/ruleEngine/element/codeIsExists",
                    {
                        "param": value
                    }).then(res => {
                    if (res.data) {
                        callback(new Error('元素Code已经存在'));
                    } else {
                        callback();
                    }
                });
            };
            return {
                tableData: [],
                loading: true,
                page: {
                    pageIndex: 1,
                    pageSize: 10,
                    total: 0
                },
                search: {
                    form: {
                        name: null,
                        code: null,
                    }
                },
                dialogFormVisible: false,
                form: {
                    id: null,
                    name: null,
                    code: null,
                    valueType: null,
                    description: null,
                },
                rules: {
                    name: [
                        {required: true, message: '请输入元素名称', trigger: 'blur'},
                        {min: 1, max: 25, message: '长度在 1 到 25 个字符', trigger: 'blur'},
                    ],
                    code: [
                        {required: true, message: '请输入元素编码', trigger: 'blur'},
                        {min: 1, max: 25, message: '长度在 1 到 25 个字符', trigger: 'blur'},
                        {validator: validateIsExists, trigger: 'blur'}
                    ],
                    valueType: [
                        {required: true, message: '请选择元素类型', trigger: ['blur']}
                    ],
                }
            }
        }, methods: {
            saveOrUpdateClick(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$axios.post(this.form.id === null ? "/ruleEngine/element/add" : "/ruleEngine/element/update", this.form)
                            .then(res => {
                                if (res) {
                                    this.list();
                                }
                                this.dialogFormVisible = false;
                            }).catch(function (error) {
                            console.log(error);
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            reset(formName) {
                this.$refs[formName].resetFields();
                this.list();
            },
            handleSizeChange(val) {
                this.page.pageSize = val;
                this.list();
            },
            handleCurrentChange(val) {
                this.page.pageIndex = val;
                this.list();
            },
            list() {
                this.$axios.post("/ruleEngine/element/list", {
                    "page": {
                        "pageSize": this.page.pageSize,
                        "pageIndex": this.page.pageIndex
                    },
                    "query": this.search.form,
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
            edit(row) {
                this.clearValidate();
                this.$axios.post("/ruleEngine/element/get", {
                    "id": row.id
                }).then(res => {
                    let da = res.data;
                    if (da != null) {
                        this.form = da;

                        this.dialogFormVisible = true;
                    }
                }).catch(function (error) {
                    console.log(error);
                });
            },
            clearValidate() {
                let ref = this.$refs['saveOrUpdateForm'];
                if (ref != null) {
                    ref.clearValidate()
                }
            },
            addElementForm() {
                this.clearValidate();
                this.form = {
                    id: null,
                    name: null,
                    code: null,
                    valueType: null,
                    description: null,
                };
                this.dialogFormVisible = true;
            },
            deleteRow(row) {
                this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.post("/ruleEngine/element/delete", {
                        "id": row.id
                    }).then(res => {
                        let da = res.data;
                        if (da) {
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
            }
        }, created() {
            this.list();
        }
    }
</script>

<style scoped>

</style>
