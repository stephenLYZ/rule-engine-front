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
      :data="tableData.rows"
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
            <span>待完成</span>
            <span slot="reference">优先级</span>
          </el-popover>
        </template>

      </el-table-column>

      <el-table-column
        prop="condition"
        label="条件"
        min-width="200" v-for="(cch,index) in tableData.collConditionHeads" :key="cch.uuid">
        <template slot="header" slot-scope="scope">
          <el-popover
            placement="right"
            width="400"
            v-model="cch.visible"
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
                                   :disabled="cch.leftValue.type==null"
                                   :controls="false" :max="10000000000000"
                                   style="width: 330px"/>

                  <el-select v-else-if="cch.leftValue.type===6" v-model="cch.leftValue.value"
                             :disabled="cch.leftValue.type==null"
                             placeholder="请选择数据 ">
                    <el-option label="true" value="true"/>
                    <el-option label="false" value="false"/>
                  </el-select>

                  <el-select
                    v-else-if="cch.leftValue.type===0||cch.leftValue.type===1"
                    v-model="cch.leftValue.valueName"
                    :disabled="cch.leftValue.type==null"
                    filterable
                    remote
                    reserve-keyword
                    placeholder="请输入关键词"
                    :remote-method="(query)=>{leftRemoteMethod(query,cch.leftValue.type,null,null)}"
                    :loading="leftSelect.loading"
                    @change="leftValueChange()">
                    <el-option
                      v-for="item in leftSelect.options"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                      @click.native="leftSelectClick(item,cch.leftValue)">
                    </el-option>
                  </el-select>

                  <el-input v-else v-model="cch.leftValue.value" :disabled="cch.leftValue.type==null"/>

                </el-form-item>

                <el-form-item label="运算符" style="margin-top: 18px">
                  <el-col :span="9">
                    <el-select v-model="cch.symbol" :disabled="cch.leftValue.valueType==null">
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
              <el-button type="primary" size="mini" style="float: right;" @click="cch.visible = false">确认</el-button>
              <el-button size="mini" style="float: right;margin-right: 12px;" @click="cch.visible = false">取消
              </el-button>
            </div>

            <span slot="reference">
              <el-tag style="height: 22px;line-height: 22px;padding: 0 2px 0 2px;font-size: 13px;">
              （{{cch.name}}）
              </el-tag>
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
          <el-popover
            placement="right"
            width="400"
            v-model="scope.row.conditions[index].visible">
            <el-form label-width="70px">
              <br>
              <el-form-item label="值类型">
                <el-select v-model="scope.row.conditions[index].type" placeholder="请选择数据类型"
                           @change="valueTypeChange(scope.row.conditions[index])">
                  <el-option label="变量" :value="1"/>
                  <el-option label="字符串" :value="5"
                             v-if="isRightTypeSelectView('STRING',cch)"
                             @click.native="scope.row.conditions[index].valueType='STRING'"/>
                  <el-option label="布尔" :value="6"
                             v-if="isRightTypeSelectView('BOOLEAN',cch)"
                             @click.native="scope.row.conditions[index].valueType='BOOLEAN'"/>
                  <el-option label="数值" :value="7"
                             v-if="isRightTypeSelectView('NUMBER',cch)"
                             @click.native="scope.row.conditions[index].valueType='NUMBER'"/>
                  <el-option label="集合" :value="8"
                             v-if="isRightTypeSelectView('COLLECTION',cch)"
                             @click.native="scope.row.conditions[index].valueType='COLLECTION'"/>
                </el-select>
              </el-form-item>
              <el-form-item label="值">
                <el-input-number v-if="scope.row.conditions[index].type===7" v-model="scope.row.conditions[index].value"
                                 :disabled="scope.row.conditions[index].type==null"
                                 :controls="false" :max="10000000000000"
                                 style="width: 330px"/>

                <el-select v-else-if="scope.row.conditions[index].type===6" v-model="scope.row.conditions[index].value"
                           :disabled="scope.row.conditions[index].type==null"
                           placeholder="请选择数据 ">
                  <el-option label="true" value="true"/>
                  <el-option label="false" value="false"/>
                </el-select>

                <el-select
                  v-else-if="scope.row.conditions[index].type===0||scope.row.conditions[index].type===1"
                  v-model="scope.row.conditions[index].valueName"
                  :disabled="scope.row.conditions[index].type==null"
                  filterable
                  remote
                  reserve-keyword
                  placeholder="请输入关键词"
                  :remote-method="(query)=>{leftRemoteMethod(query,scope.row.conditions[index].type,cch.leftValue.valueType,cch.symbol)}"
                  :loading="leftSelect.loading"
                  @change="leftValueChange()">
                  <el-option
                    v-for="item in leftSelect.options"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                    @click.native="conditionCollSelectClick(item,scope.row.conditions[index])">
                  </el-option>
                </el-select>
                <el-input v-else v-model="scope.row.conditions[index].value"
                          :disabled="scope.row.conditions[index].type==null"/>
              </el-form-item>
            </el-form>
            <span slot="reference">
              <span v-if="cch.leftValue.type!=null&&cch.leftValue.value!=null&&cch.symbol!=null">
                <span>
                  <el-tag
                    type="success"
                    v-if="scope.row.conditions[index].type!=null"
                    style="height: 22px;line-height: 22px;padding: 0 2px 0 2px;"
                    disable-transitions>
                    {{getConditionNamePrefix(scope.row.conditions[index].type)}}
                  </el-tag>
                  {{scope.row.conditions[index].variableValue!=null?scope.row.conditions[index].variableValue:scope.row.conditions[index].value}}
                </span>

                 <el-tag type="warning"
                         v-if="scope.row.conditions[index].type==null&&scope.row.conditions[index].value==null"
                         style="height: 22px;line-height: 22px;padding: 0 2px 0 2px;" disable-transitions>
                     未配置
                  </el-tag>
                    <el-tag type="warning"
                            v-else-if="scope.row.conditions[index].type==null||scope.row.conditions[index].value==null"
                            style="height: 22px;line-height: 22px;padding: 0 2px 0 2px;" disable-transitions>
                     待补全
                  </el-tag>
                  </span>
            </span>
          </el-popover>
        </template>
      </el-table-column>

      <el-table-column
        prop="result"
        label="结果"
        width="200">

        <template slot="header" slot-scope="scope">
          <el-popover
            placement="right"
            width="400"
            v-model="tableData.collResultHead.defaultAction.visible">
            <div>
              <br>
              <el-form label-width="70px">
                <el-form-item label="类型">
                  <el-select v-model="tableData.collResultHead.type" placeholder="请选择数据类型"
                             @change="valueTypeChange(tableData.collResultHead)">
                    <el-option label="字符串" :value="5"
                               @click.native="tableData.collResultHead.valueType='STRING'"/>
                    <el-option label="布尔" :value="6"
                               @click.native="tableData.collResultHead.valueType='BOOLEAN'"/>
                    <el-option label="数值" :value="7"
                               @click.native="tableData.collResultHead.valueType='NUMBER'"/>
                    <el-option label="集合" :value="8"
                               @click.native="tableData.collResultHead.valueType='COLLECTION'"/>
                  </el-select>
                </el-form-item>

                <el-form-item label="默认类型">
                  <el-select v-model="tableData.collResultHead.defaultAction.type" placeholder="请选择数据类型"
                             :disabled="tableData.collResultHead.type==null"
                             @change="valueTypeChange(tableData.collResultHead.defaultAction)">
                    <el-option label="元素" :value="0"/>
                    <el-option label="变量" :value="1"/>
                    <el-option label="字符串" :value="5"
                               v-if="tableData.collResultHead.type===5"
                               @click.native="tableData.collResultHead.defaultAction.valueType='STRING'"/>
                    <el-option label="布尔" :value="6"
                               v-if="tableData.collResultHead.type===6"
                               @click.native="tableData.collResultHead.defaultAction.valueType='BOOLEAN'"/>
                    <el-option label="数值" :value="7"
                               v-if="tableData.collResultHead.type===7"
                               @click.native="tableData.collResultHead.defaultAction.valueType='NUMBER'"/>
                    <el-option label="集合" :value="8"
                               v-if="tableData.collResultHead.type===8"
                               @click.native="tableData.collResultHead.defaultAction.valueType='COLLECTION'"/>
                  </el-select>
                </el-form-item>

                <el-form-item label="默认值">
                  <el-input-number v-if="tableData.collResultHead.defaultAction.type===7"
                                   v-model="tableData.collResultHead.defaultAction.value"
                                   :disabled="tableData.collResultHead.defaultAction.type==null"
                                   :controls="false" :max="10000000000000"
                                   style="width: 330px"/>

                  <el-select v-else-if="tableData.collResultHead.defaultAction.type===6"
                             :disabled="tableData.collResultHead.defaultAction.type==null"
                             v-model="tableData.collResultHead.defaultAction.value"
                             placeholder="请选择数据 ">
                    <el-option label="true" value="true"/>
                    <el-option label="false" value="false"/>
                  </el-select>

                  <el-select
                    v-else-if="tableData.collResultHead.defaultAction.type===0||tableData.collResultHead.defaultAction.type===1"
                    v-model="tableData.collResultHead.defaultAction.valueName"
                    filterable
                    :disabled="tableData.collResultHead.defaultAction.type==null"
                    remote
                    reserve-keyword
                    placeholder="请输入关键词"
                    :remote-method="(query)=>{leftRemoteMethod(query,tableData.collResultHead.defaultAction.type,tableData.collResultHead.valueType,null)}"
                    :loading="leftSelect.loading"
                    @change="leftValueChange()">
                    <el-option
                      v-for="item in leftSelect.options"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                      @click.native="conditionCollSelectClick(item,tableData.collResultHead.defaultAction)">
                    </el-option>
                  </el-select>
                  <el-input v-else v-model="tableData.collResultHead.value"
                            :disabled="tableData.collResultHead.defaultAction.type==null"/>
                </el-form-item>
              </el-form>
              <el-button type="primary" size="mini" style="float: right;"
                         @click="tableData.collResultHead.defaultAction.visible = false">确认
              </el-button>
              <el-button size="mini" style="float: right;margin-right: 12px;"
                         @click="tableData.collResultHead.defaultAction.visible = false">取消
              </el-button>
            </div>

            <span slot="reference">
              结果
              <span
                v-if="tableData.collResultHead.defaultAction.type!=null&&tableData.collResultHead.defaultAction.value!=null">
                  默认（
               <el-tag type="success"
                       style="height: 22px;line-height: 22px;padding: 0 2px 0 2px;" disable-transitions>
                   {{getConditionNamePrefix(tableData.collResultHead.defaultAction.type)}}
                </el-tag>
                 {{tableData.collResultHead.defaultAction.variableValue!=null?tableData.collResultHead.defaultAction.variableValue:tableData.collResultHead.defaultAction.valueName}}
                    ）
              </span>
             <el-tag type="warning" v-if="tableData.collResultHead.type==null"
                     style="height: 22px;line-height: 22px;padding: 0 2px 0 2px;" disable-transitions>
                 未配置
              </el-tag>
              </span>
          </el-popover>
        </template>
        <template slot-scope="scope">
          <el-popover
            placement="right"
            width="400"
            v-model="scope.row.result.visible">
            <el-form label-width="70px">
              <br>
              <el-form-item label="值类型">
                <el-select v-model="scope.row.result.type" placeholder="请选择数据类型"
                           @change="valueTypeChange(scope.row.result)">
                  <el-option label="变量" :value="1"/>
                  <el-option label="字符串" :value="5"
                             v-if="scope.row.result.valueType='STRING'"
                             @click.native="scope.row.result.valueType='STRING'"/>
                  <el-option label="布尔" :value="6"
                             v-if="scope.row.result.valueType='BOOLEAN'"
                             @click.native="scope.row.result.valueType='BOOLEAN'"/>
                  <el-option label="数值" :value="7"
                             v-if="scope.row.result.valueType='NUMBER'"
                             @click.native="scope.row.result.valueType='NUMBER'"/>
                  <el-option label="集合" :value="8"
                             v-if="scope.row.result.valueType='COLLECTION'"
                             @click.native="scope.row.result.valueType='COLLECTION'"/>
                </el-select>
              </el-form-item>
              <el-form-item label="值">
                <el-input-number v-if="scope.row.result.type===7" v-model="scope.row.result.value"
                                 :controls="false" :max="10000000000000"
                                 :disabled="scope.row.result.type==null"
                                 style="width: 330px"/>

                <el-select v-else-if="scope.row.result.type===6" v-model="scope.row.result.value"
                           :disabled="scope.row.result.type==null"
                           placeholder="请选择数据 ">
                  <el-option label="true" value="true"/>
                  <el-option label="false" value="false"/>
                </el-select>

                <el-select
                  v-else-if="scope.row.result.type===0||scope.row.result.type===1"
                  v-model="scope.row.result.valueName"
                  filterable
                  :disabled="scope.row.result.type==null"
                  remote
                  reserve-keyword
                  placeholder="请输入关键词"
                  :remote-method="(query)=>{leftRemoteMethod(query,scope.row.result.type,tableData.collResultHead.valueType,null)}"
                  :loading="leftSelect.loading"
                  @change="leftValueChange()">
                  <el-option
                    v-for="item in leftSelect.options"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                    @click.native="conditionCollSelectClick(item,scope.row.result)">
                  </el-option>
                </el-select>
                <el-input v-else v-model="scope.row.result.value" :disabled="scope.row.result.type==null"/>
              </el-form-item>
            </el-form>
            <span slot="reference">
              <span v-if="tableData.collResultHead.type!=null">
                <span>
                  <el-tag
                    type="success"
                    v-if="scope.row.result.type!=null"
                    style="height: 22px;line-height: 22px;padding: 0 2px 0 2px;"
                    disable-transitions>
                    {{getConditionNamePrefix(scope.row.result.type)}}
                  </el-tag>
                  {{scope.row.result.variableValue!=null?scope.row.result.variableValue:scope.row.result.value}}
                </span>

                 <el-tag type="warning"
                         v-if="scope.row.result.type==null"
                         style="height: 22px;line-height: 22px;padding: 0 2px 0 2px;" disable-transitions>
                     未配置
                  </el-tag>
                  </span>
            </span>
          </el-popover>
        </template>
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

    <el-backtop/>
  </div>
</template>

<script>
    export default {
        name: "DecisionTableConfig",
        data() {
            return {
                id: null,
                tableData: {
                    collPriorityHead: {},
                    collConditionHeads: [],
                    collResultHead: {
                        type: null,
                        valueType: null,
                        defaultAction: {
                            visible: false,
                            variableValue: null,
                            enableDefaultAction: 1,
                            value: undefined,
                            valueName: null,
                            valueType: null,
                        },
                    },
                    rows: [{
                        id: 1,
                        priority: 1,
                        conditions: [
                            {
                                value: undefined,
                                valueName: null,
                                valueType: null,
                                variableValue: null,
                                type: null,
                                visible: false
                            },
                            {
                                value: undefined,
                                valueName: null,
                                valueType: null,
                                variableValue: null,
                                type: null,
                                visible: false
                            }
                        ],
                        result: {
                            value: undefined,
                            valueName: null,
                            variableValue: null,
                            valueType: null,
                            type: null,
                            visible: false
                        }
                    }, {
                        id: 2,
                        priority: 1,
                        conditions: [{
                            value: undefined,
                            valueName: null,
                            variableValue: null,
                            valueType: null,
                            type: null,
                            visible: false
                        }, {
                            value: undefined,
                            valueName: null,
                            variableValue: null,
                            valueType: null,
                            type: null,
                            visible: false
                        }],
                        result: {
                            value: undefined,
                            valueName: null,
                            variableValue: null,
                            valueType: null,
                            type: null,
                            visible: false
                        }
                    }],
                },
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
            this.tableData.collConditionHeads = [
                {
                    uuid: 1,
                    name: "条件",
                    visible: false,
                    leftValue: {
                        value: undefined,
                        valueName: null,
                        variableValue: null,
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
                        variableValue: null,
                        valueType: null,
                        type: null,
                    },
                    symbol: null,
                },
            ];
        },
        methods: {
            handlePopover(cch) {
                // todo 待优化
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
                alert("敬请期待");
            },
            nextStep() {
                alert("敬请期待");
            },
            previous() {
                this.$router.push({path: '/DecisionTableDefinition', query: {decisionTableId: this.id}});
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
            valueTypeChange(da) {
                da.value = undefined;
                da.valueName = null;
                // 如果是变量或者元素
                if (da.type === 1 || da.type === 0) {
                    da.valueType = null;
                }
                this.leftSelect.options = [];
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
            isRightTypeSelectView(valueType, cch) {
                if (cch.leftValue.valueType === null) {
                    return false;
                }
                if (cch.leftValue.valueType === valueType) {
                    return true;
                }
                // 如果左值为集合时
                if (cch.leftValue.valueType === 'COLLECTION') {
                    if (cch.symbol === null) {
                        return true;
                    }
                    // 并且 只有左值为CONTAIN/NOT_CONTAIN 返回所有的类型
                    return cch.symbol === 'CONTAIN' || cch.symbol === 'NOT_CONTAIN';
                }
            },
            conditionCollSelectClick(item, cch) {
                cch.valueType = item.valueType;
                cch.value = item.id;
                cch.valueName = item.name;
                cch.variableValue = item.value;
            },
            leftSelectClick(item, cch) {
                cch.valueType = item.valueType;
                cch.value = item.id;
                cch.valueName = item.name;
                cch.variableValue = item.value;
                // 变更运算符
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
            leftRemoteMethod(query, type, valueType, symbol) {
                if (query !== '') {
                    this.leftSelect.loading = true;
                    this.leftSelect.options = [];
                    this.$axios.post(type === 1 ? "/ruleEngine/variable/list" : "/ruleEngine/element/list", {
                        "page": {
                            "pageSize": 10,
                            "pageIndex": 1
                        },
                        "query": {
                            "name": query,
                            "valueType": this.getRValueType(valueType, symbol)
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
            getDecisionTableConfig() {

            },
            getRValueType(valueType, symbol) {
                if (valueType == null) {
                    return [];
                }
                // 如果左值为集合时
                if (valueType === 'COLLECTION' && symbol != null) {
                    // 并且 只有左值为CONTAIN/NOT_CONTAIN 返回所有的类型
                    if (symbol === 'CONTAIN' || symbol === 'NOT_CONTAIN') {
                        return ["STRING", "NUMBER", "BOOLEAN", "COLLECTION"];
                    }
                } else {
                    return new Array(valueType);
                }
            },
        },
        mounted() {
            this.id = this.$route.query.decisionTableId;
            this.getDecisionTableConfig();
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
