<template>
  <div id="RuleSetConfig">
    <el-steps :active="2" align-center>
      <el-step title="规则集定义" icon="el-icon-edit"/>
      <el-step title="规则集配置" icon="el-icon-connection"/>
      <el-step title="规则集预览" icon="el-icon-view" class="stepp"/>
    </el-steps>
    <br>
    <br>
  </div>
</template>

<script>
    export default {
        name: "RuleSetConfig",
    }
</script>
<style>
  .box-card-header .el-input__inner {
    border: none;
    height: 36px;
    font-size: 16px;
    color: #303133;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
  }

  .el-input-number .el-input__inner {
    text-align: left;
  }

  .stepp .el-step__title.is-process {
    font-weight: 400;
    color: #C0C4CC;
  }

  .stepp .el-step__icon-inner {
    color: #C0C4CC;
  }
</style>
<style scoped>

</style>
