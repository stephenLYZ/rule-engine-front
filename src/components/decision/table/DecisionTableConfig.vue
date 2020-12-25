<template>
  <div>
    <el-steps :active="2" align-center>
      <el-step title="决策表定义" icon="el-icon-edit"/>
      <el-step title="决策表配置" icon="el-icon-connection"/>
      <el-step title="决策表预览" icon="el-icon-view" class="stepp"/>
    </el-steps>
    <br>
    <br>

    <el-table
      :data="tableData"
      border
      style="width: 100%"
      max-height="500">
      <el-table-column
        prop="id"
        label="编号"
        width="90">
      </el-table-column>

      <el-table-column
        prop="priority"
        label="优先级"
        width="90">

        <template slot="header" slot-scope="scope">
          <el-popover
            placement="right"
            width="400"
            trigger="click">
            123
            <span slot="reference">优先级</span>
          </el-popover>
        </template>

      </el-table-column>

      <el-table-column
        prop="condition"
        label="条件"
        min-width="200" v-for="(cch,index) in collConditionHeads" :key="cch.uuid">
        <template slot="header" slot-scope="scope">
          <el-popover
            placement="right"
            width="400"
            trigger="click"
            @show="handlePopover(cch)">
            <div>
              <br>
              <el-form label-width="70px">
                <el-form-item label="条件名称">
                  <el-input v-model="cch.name"/>
                </el-form-item>
                <el-form-item label="左值类型">
                  <el-select v-model="cch.leftValue.type" placeholder="请选择数据类型"
                             @change="leftValueTypeChange(cch)">
                    <el-option label="元素" :value="0"/>
                    <el-option label="变量" :value="1"/>
                    <el-option label="字符串" :value="5"
                               @click.native="cch.leftValue.valueType='STRING'"/>
                    <el-option label="布尔" :value="6"
                               @click.native="cch.leftValue.valueType='BOOLEAN'"/>
                    <el-option label="数值" :value="7"
                               @click.native="cch.leftValue.valueType='NUMBER'"/>
                    <el-option label="集合" :value="8"
                               @click.native="cch.leftValue.valueType='COLLECTION'"/>
                  </el-select>
                </el-form-item>
                <el-form-item label="左值">
                  <el-input-number v-if="cch.leftValue.type===7" v-model="cch.leftValue.value"
                                   :controls="false" :max="10000000000000"
                                   style="width: 330px"/>

                  <el-select v-else-if="cch.leftValue.type===6" v-model="cch.leftValue.value"
                             placeholder="请选择数据 ">
                    <el-option label="true" value="true"/>
                    <el-option label="false" value="false"/>
                  </el-select>

                  <el-select
                    v-else-if="cch.leftValue.type===0||cch.leftValue.type===1"
                    v-model="cch.leftValue.valueName"
                    filterable
                    remote
                    reserve-keyword
                    placeholder="请输入关键词"
                    :remote-method="(query)=>{leftRemoteMethod(query,cch)}"
                    :loading="leftSelect.loading"
                    @change="leftValueChange()">
                    <el-option
                      v-for="item in leftSelect.options"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                      @click.native="leftSelectClick(item)">
                    </el-option>
                  </el-select>

                  <el-input v-else v-model="cch.leftValue.value"/>

                </el-form-item>

                <el-form-item label="运算符" style="margin-top: 18px">
                  <el-col :span="9">
                    <el-select v-model="cch.symbol">
                      <el-option
                        v-for="item in symbolSelect.options"
                        :key="item.name"
                        :label="item.explanation"
                        :value="item.name">
                      </el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="15">
                    &nbsp;
                  </el-col>
                </el-form-item>
              </el-form>
              <el-button type="primary" size="mini" style="float: right;">确认</el-button>
              <el-button size="mini" style="float: right;margin-right: 12px;">取消</el-button>
            </div>

            <span slot="reference">
              （{{cch.name}}）
             <el-tag type="success" v-if="cch.leftValue.type!=null"
                     style="height: 22px;line-height: 22px;padding: 0 2px 0 2px;" disable-transitions>
                 {{getConditionNamePrefix(cch.leftValue.type)}}
              </el-tag>
            {{cch.leftValue.valueName!=null?cch.leftValue.valueName:cch.leftValue.value}}

              <el-tag v-if="cch.symbol!=null" type="warning"
                      style="height: 22px;line-height: 22px;padding: 0 2px 0 2px;">
                  {{cch.symbol}}
              </el-tag>

             <el-tag type="warning" v-if="cch.leftValue.type==null&&cch.leftValue.value==null&&cch.symbol==null"
                     style="height: 22px;line-height: 22px;padding: 0 2px 0 2px;" disable-transitions>
                 未配置
              </el-tag>
                <el-tag type="warning" v-else-if="cch.leftValue.type==null||cch.leftValue.value==null||cch.symbol==null"
                        style="height: 22px;line-height: 22px;padding: 0 2px 0 2px;" disable-transitions>
                 待补全
              </el-tag>
              </span>
          </el-popover>
        </template>

        <template slot-scope="scope">
          <el-tag
            type="success"
            style="height: 22px;line-height: 22px;padding: 0 2px 0 2px;"
            disable-transitions>固定值
          </el-tag>
          11
        </template>
      </el-table-column>

      <el-table-column
        prop="result"
        label="结果"
        width="200">
      </el-table-column>
    </el-table>

    <br><br>
    <el-row>
      <el-col :span="1">&nbsp;</el-col>
      <el-col :span="22">
        <el-button type="primary" @click="nextStep()" style="float: right;margin-left: 20px">下 一 步</el-button>
        <el-button type="primary" @click="previous()" style="float: right;margin-left: 20px">上 一 步</el-button>
        <el-button type="primary" @click="update()" style="float: right;">保存</el-button>
      </el-col>
      <el-col :span="1">&nbsp;</el-col>
    </el-row>
  </div>
</template>

<script>
    export default {
        name: "DecisionTableConfig",
        data() {
            return {
                tableData: [{
                    id: 1,
                    priority: 1,
                    result: 200333
                }],
                test: null,
                collConditionHeads: [],
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
            this.collConditionHeads = [
                {
                    uuid: 1,
                    name: "条件",
                    leftValue: {
                        value: undefined,
                        valueName: null,
                        valueType: null,
                        type: null,
                    },
                    symbol: null,
                },
                {
                    uuid: 2,
                    name: "条件",
                    leftValue: {
                        value: undefined,
                        valueName: null,
                        valueType: null,
                        type: null,
                    },
                    symbol: null,
                },
            ];
        },
        methods: {
            handlePopover(cch) {
                this.symbolSelect.options = [];
                if (cch.leftValue.valueType != null) {
                    this.$axios.post("/ruleEngine/symbol/getByType", {
                        "param": cch.leftValue.valueType
                    }).then(res => {
                        if (res.data != null) {
                            this.symbolSelect.options = res.data;
                        }
                    }).catch(function (error) {
                        console.log(error);
                    });
                }
            },
            update() {

            },
            nextStep() {

            },
            previous() {
                this.$router.push({path: '/DecisionTableDefinition', query: {ruleId: this.id}});
            },
            getValueTypeByType(type) {
                if (type === 5) {
                    return "STRING";
                } else if (type === 6) {
                    return "BOOLEAN";
                } else if (type === 7) {
                    return "NUMBER";
                } else if (type === 8) {
                    return "COLLECTION";
                }
            },
            leftValueTypeChange(cch) {
                cch.leftValue.value = undefined;
                cch.leftValue.valueName = null;
                // 如果是变量或者元素
                if (cch.leftValue.type === 1 || cch.leftValue.type === 0) {
                    cch.leftValue.valueType = null;
                } else {
                    //变更运算符
                    this.symbolSelect.options = [];
                    this.$axios.post("/ruleEngine/symbol/getByType", {
                        "param": this.getValueTypeByType(cch.leftValue.type)
                    }).then(res => {
                        if (res.data != null) {
                            this.symbolSelect.options = res.data;
                        }
                    }).catch(function (error) {
                        console.log(error);
                    });
                }
                this.leftSelect.options = [];
                cch.symbol = null;
                //左面发生改变，右边也改变
            },
            leftValueChange() {

            },
            leftSelectClick(item) {
                //变更运算符
                this.symbolSelect.options = [];
                this.$axios.post("/ruleEngine/symbol/getByType", {
                    "param": item.valueType
                }).then(res => {
                    if (res.data != null) {
                        this.symbolSelect.options = res.data;
                    }
                }).catch(function (error) {
                    console.log(error);
                });
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
            leftRemoteMethod(query, cch) {
                if (query !== '') {
                    this.leftSelect.loading = true;
                    this.leftSelect.options = [];
                    let type = cch.leftValue.type;
                    this.$axios.post(type === 1 ? "/ruleEngine/variable/list" : "/ruleEngine/element/list", {
                        "page": {
                            "pageSize": 10,
                            "pageIndex": 1
                        },
                        "query": {
                            "name": query,
                        },
                        "orders": []
                    }).then(res => {
                        if (res.data != null) {
                            this.leftSelect.options = res.data.rows;
                        }
                        this.leftSelect.loading = false;
                    }).catch(function (error) {
                        console.log(error);
                    });
                } else {
                    this.leftSelect.options = [];
                }
            },
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
</style>
<style scoped>

</style>
