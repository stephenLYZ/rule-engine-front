<template>
  <div>
    <el-steps :active="1" align-center>
      <el-step title="决策表定义" icon="el-icon-edit"/>
      <el-step title="决策表配置" icon="el-icon-connection" class="stepp"/>
      <el-step title="决策表预览" icon="el-icon-view" class="stepp"/>
    </el-steps>
    <br>
    <br>

    <el-row v-loading="loading">
      <el-col :span="6">
        &nbsp;
      </el-col>
      <el-col :span="12">
        <el-card class="box-card" :body-style="{ padding: '28px 12px 0px 12px' }">
          <div slot="header" class="box-card-header">
            <span>基本信息</span>
          </div>
          <div>
            <el-form ref="form" :model="form" :rules="rules" label-width="60px">
              <el-form-item label="名称" prop="name">
                <el-input v-model="form.name"/>
              </el-form-item>
              <el-form-item label="编码" prop="code">
                <el-input v-model="form.code" :disabled="form.id!==undefined"/>
              </el-form-item>
              <el-form-item label="说明" prop="description">
                <el-input type="textarea" :autosize="{ minRows: 5}" v-model="form.description"/>
              </el-form-item>
            </el-form>
          </div>
        </el-card>

        <br>
        <br>

        <el-button type="primary" @click="nextStep()" style="float: right;">下 一 步</el-button>

      </el-col>
      <el-col :span="6">
        &nbsp;
      </el-col>
    </el-row>

  </div>
</template>

<script>
    export default {
        name: "DecisionTableDefinition",
        data() {
            return {
                loading: false,
                form: {
                    id: null,
                    name: null,
                    code: null,
                    description: null
                },
                rules: {
                }
            }
        }, methods: {
            nextStep() {
                this.$router.push({path: '/DecisionTableConfig', query: {decisionTableId: 1}});
            }
        }, created() {
        }
    }
</script>

<style scoped>

</style>
