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
            var patter = /^[a-zA-Z][a-zA-Z0-9_&#\-]*$/;
            const validateIsExists = (rule, value, callback) => {
                // 更新操作跳过此校验
                if (this.form.id !== undefined && this.form.id !== null) {
                    return callback();
                }
                if (!patter.test(value)) {
                    return callback(new Error('字母开头，以及字母数字_&#-组成'));
                }
                this.$axios.post("/ruleEngine/decisionTable/codeIsExists",
                    {
                        "param": value
                    }).then(res => {
                    if (res.data) {
                        callback(new Error('决策表Code已经存在'));
                    } else {
                        callback();
                    }
                });
            };
            return {
                loading: false,
                form: {
                    id: null,
                    name: null,
                    code: null,
                    description: null
                },
                rules: {
                    name: [
                        {required: true, message: '请输入决策表名称', trigger: 'blur'},
                        {min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur'}
                    ],
                    code: [
                        {required: true, message: '请输入决策表编码', trigger: 'blur'},
                        {min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur'},
                        {validator: validateIsExists, trigger: 'blur'}
                    ],
                }
            }
        }, methods: {
            nextStep() {
                // 先执行保存
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        this.$axios.post("/ruleEngine/decisionTable/saveOrUpdateDecisionTableDefinition", {
                            "id": this.form.id,
                            "code": this.form.code,
                            "name": this.form.name,
                            "description": this.form.description,
                        }).then(res => {
                            let da = res.data;
                            if (da != null) {
                                this.form.id = da;
                                this.$router.push({path: '/DecisionTableConfig', query: {decisionTableId: da}});
                            }
                        }).catch(function (error) {
                            console.log(error);
                        });
                    } else {
                        console.log('error submit!');
                        return false;
                    }
                });
            },
            getDecisionTableDefinition() {
                if (this.form.id === undefined) {
                    return;
                }
                this.loading = true;
                this.$axios.post("/ruleEngine/decisionTable/getDecisionTableDefinition", {
                    "id": this.form.id,
                }).then(res => {
                    let da = res.data;
                    if (da != null) {
                        this.form.name = da.name;
                        this.form.code = da.code;
                        this.form.description = da.description;
                    }
                    this.loading = false;
                }).catch(function (error) {
                    console.log(error);
                });
            }
        },
        mounted() {
            this.form.id = this.$route.query.decisionTableId;
            this.getDecisionTableDefinition();
        }
    }
</script>

<style scoped>

</style>
