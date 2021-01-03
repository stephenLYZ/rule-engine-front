<template>
  <div id="decisionTableViewAndTest">
    <el-steps :active="3" align-center>
      <el-step title="决策表定义" icon="el-icon-edit"/>
      <el-step title="决策表配置" icon="el-icon-connection"/>
      <el-step title="决策表预览" icon="el-icon-view"/>
    </el-steps>
    <br>
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
            {{tableData.collConditionHeads[index].leftValue.valueName!=null?tableData.collConditionHeads[index].leftValue.valueName:tableData.collConditionHeads[index].leftValue.value}}

              <el-tag v-if="tableData.collConditionHeads[index].symbol!=null" type="warning"
                      style="height: 22px;line-height: 22px;padding: 0 2px 0 2px;">
                {{getSymbolExplanation(tableData.collConditionHeads[index].symbol)}}
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
                  {{scope.row.conditions[index].variableValue!=null?scope.row.conditions[index].variableValue:scope.row.conditions[index].value}}
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
                  {{scope.row.result.variableValue!=null?scope.row.result.variableValue:(scope.row.result.valueName==null?scope.row.result.value:scope.row.result.valueName)}}
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
                }
            }
        },
        created() {
        },
        methods: {
            publish() {
                alert("敬请期待")
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
                this.$axios.post("/ruleEngine/decisionTable/getViewDecisionTable", {
                    "id": this.id
                }).then(res => {
                    let da = res.data;
                    if (da != null) {
                        this.id = da.id;
                        this.name = da.name;
                        this.code = da.code;
                        this.description = da.description;
                        this.tableData = da.tableData;
                        if (da.abnormalAlarm != null && da.abnormalAlarm.enable) {
                            this.abnormalAlarm = {
                                "enable": da.abnormalAlarm.enable,
                                "email": da.abnormalAlarm.email.join(',')
                            }
                        }
                    }
                    this.loading = false;
                }).catch(function (error) {
                    console.log(error);
                });
            },
            getSymbolExplanation(name) {
                switch (name) {
                    case "EQ":
                        return "等于";
                    case "NE":
                        return "不等于";
                    case "GT":
                        return "大于";
                    case "LT":
                        return "小于";
                    case "GE":
                        return "大于等于";
                    case "LE":
                        return "小于等于";
                    case "CONTAIN":
                        return "包含";
                    case "NOT_CONTAIN":
                        return "不包含";
                    case "IN":
                        return "在";
                    case "NOT_IN":
                        return "不在";
                    case "STARTS_WITH":
                        return "以..开始";
                    case "ENDS_WITH":
                        return "以..结束";
                }
            }
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
</style>
