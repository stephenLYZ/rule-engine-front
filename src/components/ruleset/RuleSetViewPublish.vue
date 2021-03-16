<template>
  <div id="ruleSetViewPublish">
    <el-steps :active="3" align-center>
      <el-step title="规则集定义" icon="el-icon-edit"/>
      <el-step title="规则集配置" icon="el-icon-connection"/>
      <el-step title="规则集预览" icon="el-icon-view"/>
    </el-steps>
    <br>
    <br>

    <el-row v-loading="loading">
      <el-col :span="5">
        &nbsp;
      </el-col>
      <el-col :span="14">
        <el-row>
          <el-col :span="1">&nbsp;</el-col>
          <el-col :span="22">
            <el-card class="box-card">
              <div slot="header" class="box-card-header">
                <span>配置信息</span>
              </div>
              <el-card class="box-card" v-for="rs in ruleSet" :key="rs.id" style="margin-bottom: 7px">
                <div slot="header" class="box-card-header">
                  <span>{{ rs.name }}</span>
                </div>
                <div>
                  <el-timeline>
                    <el-timeline-item
                      style="padding-bottom: 0"
                      color="#afd792"
                      :size="cgi===0?'large':'normal'"
                      v-for="(cg, cgi) in rs.conditionGroup" :key="cg.id">
                      <span style="color: #606266;font-size: 14px;" v-if="0===cgi">如果</span>
                      <span style="color: #606266;font-size: 14px;" v-else>或者</span>
                      <div v-for="(c,ci) in cg.conditionGroupCondition" style="margin-left: 20px;">
                        <el-tag class="item" type="info" effect="plain" style="margin-top: 2px">
                          <el-tag type="success" style="height: 22px;line-height: 22px;padding: 0 2px 0 2px;">
                            {{ getConditionNamePrefix(c.condition.config.leftValue.type) }}
                          </el-tag>
                          <span
                            style="color: #606266">{{
                              c.condition.config.leftValue.variableValue != null ? c.condition.config.leftValue.variableValue : c.condition.config.leftValue.valueName
                            }}</span>

                          &nbsp;
                          <el-tag type="warning" style="height: 22px;line-height: 22px;padding: 0 2px 0 2px;">
                            {{ c.condition.config.symbol }}
                          </el-tag>

                          &nbsp;
                          <el-tag type="success" style="height: 22px;line-height: 22px;padding: 0 2px 0 2px;">
                            {{ getConditionNamePrefix(c.condition.config.rightValue.type) }}
                          </el-tag>
                          <span
                            style="color: #606266"> {{
                              c.condition.config.rightValue.variableValue != null ? c.condition.config.rightValue.variableValue : c.condition.config.rightValue.valueName
                            }}</span>
                        </el-tag>

                        <br>
                        <span
                          style="color: #606266;font-size: 14px;">   {{
                            cg.conditionGroupCondition.length - 1 === ci ? '' : '并且'
                          }}</span>
                      </div>
                    </el-timeline-item>
                  </el-timeline>

                  <span style="color: #606266;font-size: 14px;">返回</span>
                  <br>
                  <div style="margin-left: 20px;">
                    <el-alert :closable="false" type="success" style="padding: 6px 0 8px 0">
                      {{
                        rs.action.variableValue != null ? rs.action.variableValue : (rs.action.valueName === '' ? '空' : rs.action.valueName)
                      }}
                    </el-alert>
                  </div>
                </div>
              </el-card>
              <span v-if="ruleSet.length===0" style="color: #606266;font-size: 14px;">返回</span>
              <span v-else>
                  <br>
                  <span style="color: #606266;font-size: 14px;">否则返回</span>
                </span>
              <br>
              <div style="margin-left: 20px;">
                <el-alert :closable="false" type="warning" style="padding: 6px 0 8px 0">
                  {{
                    enableDefaultRule === 0 ? (defaultRule.action.variableValue != null ? defaultRule.action.variableValue : (defaultRule.action.valueName === '' ? '空' : defaultRule.action.valueName)) : 'null'
                  }}
                </el-alert>
              </div>
            </el-card>
            <br>
            <br>
            <el-card class="box-card">
              <div slot="header" class="box-card-header">
                <span>设置信息</span>
              </div>
              <el-form label-width="70px">
                <el-form-item label="执行策略">
                  <el-select :value="strategyType">
                    <el-option label="顺序执行所有规则" :value="1"/>
                    <el-option label="当有规则被命中时终止" :value="2"/>
                    <el-option label="只执行第一个规则" :value="3"/>
                    <el-option label="当有规则不成立时终止" :value="4"/>
                  </el-select>
                </el-form-item>
              </el-form>
            </el-card>
          </el-col>
          <el-col :span="1">&nbsp;</el-col>
        </el-row>
      </el-col>
      <el-col :span="5">

        <el-card class="box-card" :body-style="{ padding: '28px 12px 0px 12px' }">
          <div slot="header" class="box-card-header">
            <span>接口地址/参数</span>
            <i class="el-icon-document-copy pointer"
               @click="$common.copy($event,(request.url + ' \n' + request.requestJson))"
               style="float: right; padding: 14px 0;color: #5ba0f8;"/>
          </div>
          <div>
            <el-form label-width="40px">
              <el-form-item label="接口" style="margin-top: -8px;">
                <el-input v-model="request.url" :readonly="true"/>
              </el-form-item>
              <el-form-item label="入参" style="margin-top: -8px;">
                <el-input type="textarea" autosize :autosize="{ maxRows: 10}" v-model="request.requestJson"
                          :readonly="true"/>
              </el-form-item>
            </el-form>
          </div>
        </el-card>

        <br><br>
        <el-card class="box-card" :body-style="{ padding: '28px 12px 0px 12px' }">
          <div slot="header" class="box-card-header">
            <span>模拟运行</span>

            <i class="el-icon-video-play pointer"
               style="float: right; padding: 14px 0;color: #5ba0f8;" @click="run"/>

            <i class=" el-icon-back pointer"
               style="float: right; padding: 14px 9px;color: #5ba0f8;" @click="runGoBack" v-if="runEnd"/>
          </div>

          <div style="min-height: 150px" v-if="!runEnd">

            <el-form label-width="0px" v-if="runPercentage===10">
              <div style="min-height: 150px;text-align: center;font-size: 15px;color: #606266;"
                   v-if="request.param.length===0">
                无入参
              </div>
              <el-form-item v-else style="margin-top: -18px;" v-for="param in request.param" :key="param.code">
                {{ param.name }}
                <div v-if="param.valueType==='NUMBER'">
                  <el-input-number v-model="param.value" :controls="false"
                                   style="width: 100%"/>
                </div>
                <div v-else-if="param.valueType==='BOOLEAN'">
                  <el-select v-model="param.value">
                    <el-option label="true" value="true"/>
                    <el-option label="false" value="false"/>
                  </el-select>
                </div>

                <div v-else-if="param.valueType==='COLLECTION'">
                  <el-input type="textarea" :autosize="{ minRows: 2,maxRows:6}" v-model="param.value"/>
                </div>

                <div v-else-if="param.valueType==='DATE'">
                  <el-date-picker
                    v-model="param.value"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择日期时间"
                    align="right"
                    style="width: 100%"
                    :picker-options="$common.datePickerOptions()">
                  </el-date-picker>
                </div>

                <el-input v-model="param.value" v-else max="1000"/>
              </el-form-item>
            </el-form>

            <div v-else style="text-align: center">
              <el-progress type="circle" :percentage="runPercentage"/>
            </div>

          </div>

          <div style="min-height: 150px" v-else>
            <el-form label-width="40px">
              <el-form-item label="结果" style="margin-top: -8px;">
                <el-input type="textarea" :autosize="{ minRows: 5.5}" v-model="runData.value"
                          :readonly="true"/>
              </el-form-item>
            </el-form>
          </div>

        </el-card>

      </el-col>
    </el-row>

    <el-backtop/>
  </div>
</template>

<script>
export default {
  name: "RuleSetViewPublish",
  data() {
    return {
      loading: false,
      enableDefaultRule: 1,
      ruleSet: [],
      strategyType: null,
      defaultRule: {},
      runData: {
        value: null,
        valueType: null,
      },
      runEnd: false,
      runPercentage: 10,
      request: {
        url: "http://ruleserver.cn/ruleEngine/ruleSet/execute",
        param: [],
        requestJson: null,
      },
    }
  },
  methods: {
    runGoBack() {
      this.runPercentage = 10;
      this.runEnd = false;
    },
    run() {
      this.runEnd = false;
      this.runPercentage = 20;
      const params = {};
      this.request.param.forEach((e) => {
        params[e.code] = e.value === undefined ? '' : e.value;
      });
      let requestJson = {
        "id": this.id,
        "status": 2,
        "code": this.code,
        "workspaceCode": this.workspaceCode,
        "param": params
      };
      this.runPercentage = 40;
      this.$axios.post("/ruleEngine/ruleSetTest/run", requestJson).then(res => {
        let da = res.data;
        if (da != null) {
          this.runData.value = da.value + "";
          this.runData.valueType = da.valueType;
          this.runPercentage = 100;
          setTimeout(() => {
            this.runEnd = true;
            this.runPercentage = 10;
          }, 1000);
        } else {
          this.runPercentage = 10;
        }
      }).catch(error => {
        this.runPercentage = 10;
        console.log(error);
      });
    },
    previous() {
      this.$router.push({path: '/RuleSetConfig', query: {ruleSetId: this.id}});
    },
    getConditionNamePrefix(type) {
      if (type === 0) {
        return "元素";
      }
      if (type === 1) {
        return "变量";
      }
      if (type === 2) {
        return "固定值";
      }
    },
    publish() {
      this.$confirm('此操作将会改变线上规则集运行, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.post("/ruleEngine/ruleSet/publish",
          {
            id: this.id
          }
        ).then(res => {
          if (res.data) {
            this.$message({
              showClose: true,
              message: '发布成功',
              type: 'success'
            });
          }
        }).catch(error => {
          console.log(error);
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消发布'
        });
      });
    },
    getPublishRuleSet(id) {
      this.loading = true;
      this.$axios.post("/ruleEngine/ruleSet/view", {
        "id": id,
        "status": 2
      }).then(res => {
        let da = res.data;
        if (da != null) {
          this.id = da.id;
          this.name = da.name;
          this.code = da.code;
          this.description = da.description;
          this.workspaceCode = da.workspaceCode;
          // condition group
          this.ruleSet = da.ruleSet;
          this.strategyType = da.strategyType;
          // default rule
          this.enableDefaultRule = da.enableDefaultRule;
          this.defaultRule = da.defaultRule;
          let param = {};
          if (da.parameters != null && da.parameters.length !== 0) {
            da.parameters.forEach((e) => {
              param[e.code] = '略';
            });
          }
          this.request.requestJson = JSON.stringify({
            "code": da.code,
            "workspaceCode": da.workspaceCode,
            "accessKeyId": '略',
            "accessKeySecret": '略',
            "param": param
          }, null, 6);
          this.request.param = da.parameters;
        }
        this.loading = false;
      }).catch(function (error) {
        console.log(error);
      });
    }
  }, mounted() {
    let ruleSetId = this.$route.query.ruleSetId;
    this.getPublishRuleSet(ruleSetId);
  }
}
</script>

<style scoped>

</style>
