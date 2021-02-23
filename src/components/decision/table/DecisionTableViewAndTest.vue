<template>
  <div id="decisionTableViewAndTest">
    <el-steps :active="3" align-center>
      <el-step title="决策表定义" icon="el-icon-edit"/>
      <el-step title="决策表配置" icon="el-icon-connection"/>
      <el-step title="决策表预览" icon="el-icon-view"/>
    </el-steps>
    <br>
    <br>
    <div style="font-size: 20px;">
      &nbsp;&nbsp;
      <el-popover
        placement="right"
        width="400"
        trigger="click">
        <div>
          <br>
          <el-form label-width="70px">
            <el-form-item label="执行策略">
              <el-select :value="strategyType">
                <el-option label="返回所有优先级命中的结果" :value="1"/>
                <el-option label="返回最高优先级命中的第一个结果" :value="2"/>
                <el-option label="返回最高优先级命中的所有结果" :value="3"/>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <i class="el-icon-setting" slot="reference" style="cursor: pointer;color:#909399 "></i>
      </el-popover>
      &nbsp;
      <el-popover
        placement="right"
        width="400"
        trigger="click">

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
              <el-form-item v-else style="margin-top: -18px;text-align: left;" v-for="param in request.param"
                            :key="param.code">
                <span>{{param.name.trim()}}</span>
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

                <el-date-picker
                  v-else-if="param.valueType==='DATE'"
                  v-model="param.value"

                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选择日期时间"
                  align="right"
                  :picker-options="$common.datePickerOptions()">
                </el-date-picker>

                <div v-else-if="param.valueType==='COLLECTION'">
                  <el-input type="textarea" :autosize="{ minRows: 2,maxRows:6}" v-model="param.value"/>
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

        <i class="el-icon-video-play" slot="reference" style="cursor: pointer;color:#909399 "></i>
      </el-popover>
    </div>
    <br>
    <el-table
      v-loading="loading"
      :data="tableData.rows"
      border
      style="width: 100%"
      max-height="600">
      <el-table-column
        type="index"
        label="编号"
        width="90">
      </el-table-column>

      <el-table-column
        prop="priority"
        label="优先级"
        sortable
        width="90">

        <template slot-scope="scope">
          <span style="width:100%;height: 30px;display:block;line-height: 30px;">{{scope.row.priority}}</span>
        </template>

      </el-table-column>

      <el-table-column
        prop="condition"
        label="条件"
        show-overflow-tooltip
        :index="index"
        min-width="200" v-for="(cch,index) in tableData.collConditionHeads" :key="index">
        <template slot="header" slot-scope="scope">
           <span style="width:100%;height: 30px;display:block;line-height: 30px;">
              <el-tag style="height: 22px;line-height: 22px;padding: 0 2px 0 2px;font-size: 13px;">
              （{{tableData.collConditionHeads[index].name}}）
              </el-tag>
             <el-tag type="success" v-if="tableData.collConditionHeads[index].leftValue.type!=null"
                     style="height: 22px;line-height: 22px;padding: 0 2px 0 2px;">
                 {{getConditionNamePrefix(tableData.collConditionHeads[index].leftValue.type)}}
              </el-tag>
               {{viewConfig(tableData.collConditionHeads[index].leftValue)}}
              <el-tag v-if="tableData.collConditionHeads[index].symbol!=null" type="warning"
                      style="height: 22px;line-height: 22px;padding: 0 2px 0 2px;">
                {{$common.getSymbolExplanation(tableData.collConditionHeads[index].symbol)}}
              </el-tag>
              </span>
        </template>

        <template slot-scope="scope">
           <span style="width:100%;height: 30px;display:block;line-height: 30px;">
                  <el-tag type="success"
                          v-if="scope.row.conditions[index].type!=null"
                          style="height: 22px;line-height: 22px;padding: 0 2px 0 2px;"
                          disable-transitions>
                    {{getConditionNamePrefix(scope.row.conditions[index].type)}}
                  </el-tag>
                  {{viewConfig(scope.row.conditions[index])}}
            </span>
        </template>
      </el-table-column>

      <el-table-column
        prop="result"
        label="结果"
        width="200">

        <template slot="header" slot-scope="scope">
            <span style="width:100%;height: 30px;display:block;line-height: 30px;">
              结果
            </span>
        </template>
        <template slot-scope="scope">
           <span style="width:100%;height: 30px;display:block;line-height: 30px;">
                  <el-tag
                    type="success"
                    v-if="scope.row.result.type!=null"
                    style="height: 22px;line-height: 22px;padding: 0 2px 0 2px;"
                    disable-transitions>
                    {{getConditionNamePrefix(scope.row.result.type)}}
                  </el-tag>
                  {{viewConfig(scope.row.result)}}
            </span>
        </template>
      </el-table-column>
    </el-table>

    <br><br>
    <el-row>
      <el-col :span="1">&nbsp;</el-col>
      <el-col :span="22">
        <el-button type="primary" @click="publish()" style="float: right;margin-left: 20px;">发 布
        </el-button>
        <el-button type="primary" @click="previous()" style="float: right;margin-left: 20px;">上 一 步
        </el-button>
      </el-col>
      <el-col :span="1">&nbsp;</el-col>
    </el-row>

    <el-backtop/>

  </div>
</template>

<script>
    export default {
        name: "DecisionTableViewAndTest",
        data() {
            return {
                menuVisible: false,
                headerMenuVisible: false,
                currentRow: null,
                currentColumn: null,
                id: null,
                code: null,
                name: null,
                workspaceCode: null,
                strategyType: null,
                loading: false,
                tableData: {},
                leftSelect: {
                    loading: false,
                    options: [],
                    query: {
                        name: null,
                    }
                },
                symbolSelect: {
                    options: [],
                },
                runEnd: false,
                runPercentage: 10,
                request: {
                    param: []
                },
                runData: {
                    value: null,
                    valueType: null,
                }
            }
        },
        created() {
        },
        methods: {
            viewConfig(config) {
              return config.variableValue != null ? config.variableValue : (config.valueName == null ? config.value : config.valueName);
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
                    "status": 1,
                    "code": this.code,
                    "workspaceCode": this.workspaceCode,
                    "param": params
                };
                this.runPercentage = 40;
                this.$axios.post("/ruleEngine/decisionTableTest/run", requestJson).then(res => {
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
            runGoBack() {
                this.runPercentage = 10;
                this.runEnd = false;
            },
            publish() {
                this.$confirm('此操作将会改变线上决策表运行, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.post("/ruleEngine/decisionTable/publish",
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
            previous() {
                this.$router.push({path: '/DecisionTableConfig', query: {decisionTableId: this.id}});
            },
            getConditionNamePrefix(type) {
                if (type === 0) {
                    return "元素";
                }
                if (type === 1) {
                    return "变量";
                }
                if (type >= 2) {
                    return "固定值";
                }
            },
            getDecisionTableView() {
                this.loading = true;
                this.$axios.post("/ruleEngine/decisionTable/view", {
                    "id": this.id,
                    "status": 1
                }).then(res => {
                    let da = res.data;
                    if (da != null) {
                        this.id = da.id;
                        this.name = da.name;
                        this.code = da.code;
                        this.description = da.description;
                        this.workspaceCode = da.workspaceCode;
                        this.strategyType = da.strategyType;
                        this.tableData = da.tableData;
                        this.request.param = da.parameters;
                    }
                    this.loading = false;
                }).catch(function (error) {
                    console.log(error);
                });
            },
        },
        mounted() {
            this.id = this.$route.query.decisionTableId;
            this.getDecisionTableView();
        }
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

  #decisionTableViewAndTest .el-table th {
    padding: 10px 0 10px 0;
  }

  #decisionTableViewAndTest .el-table td {
    padding: 8px 0 8px 0;
  }
</style>
<style scoped>

  .el-card {
    border: none;
  }

  .el-card {
    margin: -12px;
  }

  .contextmenu__item {
    display: block;
    line-height: 34px;
    text-align: center;
  }

  .contextmenu__item:not(:last-child) {
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }

  .headerMenu, .menu {
    position: absolute;
    background-color: #fff;
    width: 100px;
    font-size: 13px;
    color: #444040;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    border-radius: 4px;
    border: 1px solid rgba(0, 0, 0, 0.15);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
    white-space: nowrap;
    z-index: 1000;
  }

  .contextmenu__item:hover {
    cursor: pointer;
    /*background: #409eff;*/
    /*border-color: #409eff;*/
    /*color: #fff;*/
  }

  #conditionRowFrom .el-form-item, #resultRow .el-form-item {
    margin-bottom: 0;
  }

  .box-card-header {
    margin-top: -20px;
    line-height: 46px;
    height: 24px;
  }
</style>
