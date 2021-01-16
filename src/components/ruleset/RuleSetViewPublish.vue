<template>
  <div id="ruleSetViewPublish">
    <el-steps :active="3" align-center>
      <el-step title="规则集定义" icon="el-icon-edit"/>
      <el-step title="规则集配置" icon="el-icon-connection"/>
      <el-step title="规则集预览" icon="el-icon-view"/>
    </el-steps>
    <br>
    <br>
  </div>
</template>

<script>
    export default {
        name: "RuleSetViewPublish"
    }
</script>

<style scoped>

</style>
