<template>
  <div>

    <el-form ref="searchForm" :inline="true" :model="search.form" label-width="75px">
      <el-form-item label="请求ID" prop="requestId">
        <el-input v-model="search.form.requestId"/>
      </el-form-item>
      <el-form-item label="用户" prop="username">
        <el-input v-model="search.form.username"/>
      </el-form-item>
      <el-form-item label="请求地址" prop="requestUrl">
        <el-input v-model="search.form.requestUrl"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="list()" icon="el-icon-search">搜索</el-button>
        <el-button type="reset" @click="reset('searchForm')">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table
      v-loading="loading"
      :data="tableData"
      style="width: 100%"
      :default-sort="{prop: 'id', order: 'descending'}">
      <el-table-column
        prop="id"
        label="编号"
        sortable
        width="120">
      </el-table-column>
      <el-table-column
        prop="username"
        min-width="120"
        label="用户">
      </el-table-column>

      <el-table-column
        prop="ip"
        label="IP地址"
        width="200">
      </el-table-column>

      <el-table-column
        prop="browser"
        label="浏览器"
        width="200">
        <template slot-scope="scope">
          {{ scope.row.browser + " - " + scope.row.browserVersion }}
        </template>
      </el-table-column>

      <el-table-column
        prop="system"
        label="系统"
        width="200">
      </el-table-column>

      <el-table-column
        prop="requestUrl"
        label="请求URL"
        width="180">
      </el-table-column>

      <el-table-column
        prop="requestId"
        label="请求ID"
        width="180">
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
          <el-button @click="info(scope.row)" type="text" size="small">详情</el-button>
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
  name: "SystemLog",
  data() {
    return {
      search: {
        form: {
          requestId: null,
          username: "",
          requestUrl: ""
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
    info() {

    },
    deleteRow() {

    },
    reset(formName) {
      this.$refs[formName].resetFields();
      this.list();
    },
    list() {
      this.loading = true;
      this.$axios.post("/system/log/list", {
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

</style>
