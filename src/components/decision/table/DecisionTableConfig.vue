<template>
  <div id="decisionTableConfig">
    <el-steps :active="2" align-center>
      <el-step title="决策表定义" icon="el-icon-edit"/>
      <el-step title="决策表配置" icon="el-icon-connection"/>
      <el-step title="决策表预览" icon="el-icon-view" class="stepp"/>
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
              <el-select v-model="strategyType">
                <el-option label="返回所有优先级命中的结果" :value="1"/>
                <el-option label="返回最高优先级命中的第一个结果" :value="2"/>
                <el-option label="返回最高优先级命中的所有结果" :value="3"/>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <i class="el-icon-setting" slot="reference" style="cursor: pointer;color:#909399 "></i>
      </el-popover>

    </div>
    <br>
    <el-table
      v-loading="loading"
      :data="tableData.rows"
      @row-contextmenu="rightClick"
      @header-contextmenu="headerRightClick"
      @cell-click="cellClick"
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
          <el-popover
            placement="right"
            width="180"
            trigger="click">
            <el-input-number v-model="scope.row.priority" controls-position="right" :min="1" :max="10"
                             @change="(value)=>{handlePriorityChange(value,scope.row)}"/>
            <span slot="reference"
                  style="width:100%;height: 30px;display:block;line-height: 30px;cursor: pointer">{{
                scope.row.priority
              }}</span>
          </el-popover>
        </template>

      </el-table-column>

      <el-table-column
        prop="condition"
        label="条件"
        show-overflow-tooltip
        :index="index"
        min-width="200" v-for="(cch,index) in tableData.collConditionHeads" :key="index">
        <template slot="header" slot-scope="scope">
          <el-popover
            placement="right"
            width="400"
            v-model="tableData.collConditionHeads[index].visible"
            @show="handlePopover(tableData.collConditionHeads[index])">
            <div>
              <br>
              <el-form label-width="70px">
                <el-form-item label="条件名称">
                  <el-input v-model="tableData.collConditionHeads[index].name"/>
                </el-form-item>
                <el-form-item label="类型">
                  <el-select v-model="tableData.collConditionHeads[index].leftValue.type" placeholder="请选择数据类型"
                             @change="leftValueTypeChange(tableData.collConditionHeads[index],index)">
                    <el-option label="元素" :value="0"/>
                    <el-option label="变量" :value="1"/>
                    <el-option label="字符串" :value="5"
                               @click.native="tableData.collConditionHeads[index].leftValue.valueType='STRING'"/>
                    <el-option label="布尔" :value="6"
                               @click.native="tableData.collConditionHeads[index].leftValue.valueType='BOOLEAN'"/>
                    <el-option label="数值" :value="7"
                               @click.native="tableData.collConditionHeads[index].leftValue.valueType='NUMBER'"/>
                    <el-option label="集合" :value="8"
                               @click.native="tableData.collConditionHeads[index].leftValue.valueType='COLLECTION'"/>
                  </el-select>
                </el-form-item>
                <el-form-item label="值">
                  <el-input-number v-if="tableData.collConditionHeads[index].leftValue.type===7"
                                   v-model="tableData.collConditionHeads[index].leftValue.value"
                                   :disabled="tableData.collConditionHeads[index].leftValue.type==null"
                                   :controls="false"
                                   style="width: 330px"/>

                  <el-select v-else-if="tableData.collConditionHeads[index].leftValue.type===6"
                             v-model="tableData.collConditionHeads[index].leftValue.value"
                             :disabled="tableData.collConditionHeads[index].leftValue.type==null"
                             placeholder="请选择数据 ">
                    <el-option label="true" value="true"/>
                    <el-option label="false" value="false"/>
                  </el-select>

                  <el-select
                    v-else-if="tableData.collConditionHeads[index].leftValue.type===0||tableData.collConditionHeads[index].leftValue.type===1"
                    v-model="tableData.collConditionHeads[index].leftValue.valueName"
                    :disabled="tableData.collConditionHeads[index].leftValue.type==null"
                    filterable
                    remote
                    placeholder="请输入关键词"
                    :remote-method="(query)=>{leftRemoteMethod(query,tableData.collConditionHeads[index].leftValue.type,null,null)}"
                    :loading="leftSelect.loading"
                    @clear="tableData.collConditionHeads[index].leftValue.valueName=null"
                    @change="headConditionValueChange(tableData.collConditionHeads[index],index)">
                    <el-option
                      v-for="item in leftSelect.options"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                      @click.native="leftSelectClick(item,tableData.collConditionHeads[index].leftValue)">
                    </el-option>
                  </el-select>

                  <el-input v-else v-model="tableData.collConditionHeads[index].leftValue.value"
                            :disabled="tableData.collConditionHeads[index].leftValue.type==null"/>

                </el-form-item>

                <el-form-item label="运算符" style="margin-top: 18px">
                  <el-col :span="9">
                    <el-select v-model="tableData.collConditionHeads[index].symbol"
                               :disabled="tableData.collConditionHeads[index].leftValue.valueType==null">
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
              <el-button type="primary" size="mini" style="float: right;"
                         @click="tableData.collConditionHeads[index].visible = false">确认
              </el-button>
              <el-button size="mini" style="float: right;margin-right: 12px;"
                         @click="tableData.collConditionHeads[index].visible = false">取消
              </el-button>
            </div>

            <span slot="reference" style="width:100%;height: 30px;display:block;line-height: 30px;cursor: pointer">
              <el-tag style="height: 22px;line-height: 22px;padding: 0 2px 0 2px;font-size: 13px;">
              （{{ tableData.collConditionHeads[index].name }}）
              </el-tag>
             <el-tag type="success" v-if="tableData.collConditionHeads[index].leftValue.type!=null"
                     style="height: 22px;line-height: 22px;padding: 0 2px 0 2px;">
                 {{ getConditionNamePrefix(tableData.collConditionHeads[index].leftValue.type) }}
              </el-tag>
            {{
                tableData.collConditionHeads[index].leftValue.valueName != null ? tableData.collConditionHeads[index].leftValue.valueName : tableData.collConditionHeads[index].leftValue.value
              }}

              <el-tag v-if="tableData.collConditionHeads[index].symbol!=null" type="warning"
                      style="height: 22px;line-height: 22px;padding: 0 2px 0 2px;">
                {{ $common.getSymbolExplanation(tableData.collConditionHeads[index].symbol) }}
              </el-tag>
              </span>
          </el-popover>
        </template>

        <template slot-scope="scope">
          <el-popover
            placement="right"
            width="326"
            :disabled="tableData.collConditionHeads[index].leftValue.valueType==null">
            <el-form class="conditionRowFrom">
              <el-form-item class="el-col-7">
                <el-select v-model="scope.row.conditions[index].type"
                           clearable
                           @clear="scope.row.conditions[index].type=null"
                           @change="valueTypeChange(scope.row.conditions[index])">
                  <el-option label="变量" :value="1"/>
                  <el-option label="字符串" :value="5"
                             v-if="isRightTypeSelectView('STRING',tableData.collConditionHeads[index])"
                             @click.native="scope.row.conditions[index].valueType='STRING'"/>
                  <el-option label="布尔" :value="6"
                             v-if="isRightTypeSelectView('BOOLEAN',tableData.collConditionHeads[index])"
                             @click.native="scope.row.conditions[index].valueType='BOOLEAN'"/>
                  <el-option label="数值" :value="7"
                             v-if="isRightTypeSelectView('NUMBER',tableData.collConditionHeads[index])"
                             @click.native="scope.row.conditions[index].valueType='NUMBER'"/>
                  <el-option label="集合" :value="8"
                             v-if="isRightTypeSelectView('COLLECTION',tableData.collConditionHeads[index])"
                             @click.native="scope.row.conditions[index].valueType='COLLECTION'"/>
                </el-select>
              </el-form-item>
              <el-form-item class="el-col-1">
                &nbsp;
              </el-form-item>
              <el-form-item class="el-col-16">
                <el-input-number v-if="scope.row.conditions[index].type===7"
                                 v-model="scope.row.conditions[index].value"
                                 :disabled="scope.row.conditions[index].type==null"
                                 :controls="false"
                                 style="width: 217px"/>

                <el-select v-else-if="scope.row.conditions[index].type===6"
                           v-model="scope.row.conditions[index].value"
                           clearable
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
                  clearable
                  placeholder="请输入关键词"
                  :remote-method="(query)=>{leftRemoteMethod(query,scope.row.conditions[index].type,tableData.collConditionHeads[index].leftValue.valueType,tableData.collConditionHeads[index].symbol)}"
                  :loading="leftSelect.loading">
                  <el-option
                    v-for="item in leftSelect.options"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                    @click.native="conditionCollSelectClick(item,scope.row.conditions[index])">
                  </el-option>
                </el-select>
                <el-input v-else v-model="scope.row.conditions[index].value"
                          :disabled="scope.row.conditions[index].type==null" style="width: 217px"/>
              </el-form-item>
            </el-form>
            <span slot="reference" style="width:100%;height: 30px;display:block;line-height: 30px;cursor: pointer">
                  <el-tag type="success"
                          v-if="scope.row.conditions[index].type!=null"
                          style="height: 22px;line-height: 22px;padding: 0 2px 0 2px;"
                          disable-transitions>
                    {{ getConditionNamePrefix(scope.row.conditions[index].type) }}
                  </el-tag>
              {{
                scope.row.conditions[index].variableValue != null ? scope.row.conditions[index].variableValue : (scope.row.conditions[index].valueName == null ? scope.row.conditions[index].value : scope.row.conditions[index].valueName)
              }}
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
            v-model="tableData.collResultHead.visible">
            <div>
              <br>
              <el-form label-width="70px">
                <el-form-item label="类型">
                  <el-select v-model="tableData.collResultHead.type" placeholder="请选择数据类型"
                             @change="actionValueTypeChange(tableData.collResultHead)">
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
                <el-form-item label="默认结果">
                  <el-switch v-model="tableData.collResultHead.defaultAction.enableDefaultAction" :active-value="0"
                             :inactive-value="1"/>
                </el-form-item>
                <el-form-item label="默认类型">
                  <el-select v-model="tableData.collResultHead.defaultAction.type" placeholder="请选择数据类型"
                             clearable
                             @clear="tableData.collResultHead.defaultAction.type=null"
                             :disabled="tableData.collResultHead.type==null"
                             @change="valueTypeChange(tableData.collResultHead.defaultAction)">
                    <el-option label="元素" :value="0"/>
                    <el-option label="变量" :value="1"/>
                    <el-option label="字符串" :value="5"
                               v-if="tableData.collResultHead.valueType==='STRING'"
                               @click.native="tableData.collResultHead.defaultAction.valueType='STRING'"/>
                    <el-option label="布尔" :value="6"
                               v-if="tableData.collResultHead.valueType==='BOOLEAN'"
                               @click.native="tableData.collResultHead.defaultAction.valueType='BOOLEAN'"/>
                    <el-option label="数值" :value="7"
                               v-if="tableData.collResultHead.valueType==='NUMBER'"
                               @click.native="tableData.collResultHead.defaultAction.valueType='NUMBER'"/>
                    <el-option label="集合" :value="8"
                               v-if="tableData.collResultHead.valueType==='COLLECTION'"
                               @click.native="tableData.collResultHead.defaultAction.valueType='COLLECTION'"/>
                  </el-select>
                </el-form-item>

                <el-form-item label="默认值">
                  <el-input-number v-if="tableData.collResultHead.defaultAction.type===7"
                                   v-model="tableData.collResultHead.defaultAction.value"
                                   :disabled="tableData.collResultHead.defaultAction.type==null"
                                   :controls="false"
                                   style="width: 330px"/>

                  <el-select v-else-if="tableData.collResultHead.defaultAction.type===6"
                             clearable
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
                    clearable
                    placeholder="请输入关键词"
                    :remote-method="(query)=>{leftRemoteMethod(query,tableData.collResultHead.defaultAction.type,tableData.collResultHead.valueType,null)}"
                    :loading="leftSelect.loading">
                    <el-option
                      v-for="item in leftSelect.options"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                      @click.native="conditionCollSelectClick(item,tableData.collResultHead.defaultAction)">
                    </el-option>
                  </el-select>
                  <el-input v-else v-model="tableData.collResultHead.defaultAction.value"
                            :disabled="tableData.collResultHead.defaultAction.type==null"/>
                </el-form-item>
              </el-form>
              <el-button type="primary" size="mini" style="float: right;"
                         @click="tableData.collResultHead.visible = false">确认
              </el-button>
              <el-button size="mini" style="float: right;margin-right: 12px;"
                         @click="tableData.collResultHead.visible = false">取消
              </el-button>
            </div>

            <span slot="reference" style="width:100%;height: 30px;display:block;line-height: 30px;cursor: pointer">
              结果
              </span>
          </el-popover>
        </template>
        <template slot-scope="scope">
          <el-popover
            placement="right"
            width="326"
            :disabled="tableData.collResultHead.valueType==null">
            <el-form class="resultRow">
              <el-form-item class="el-col-7">

                <el-select v-model="scope.row.result.type"
                           clearable
                           @clear="scope.row.result.type=null"
                           @change="valueTypeChange(scope.row.result)">
                  <el-option label="变量" :value="1"/>
                  <el-option label="字符串" :value="5"
                             v-if="tableData.collResultHead.valueType==='STRING'"
                             @click.native="scope.row.result.valueType='STRING'"/>
                  <el-option label="布尔" :value="6"
                             v-if="tableData.collResultHead.valueType==='BOOLEAN'"
                             @click.native="scope.row.result.valueType='BOOLEAN'"/>
                  <el-option label="数值" :value="7"
                             v-if="tableData.collResultHead.valueType==='NUMBER'"
                             @click.native="scope.row.result.valueType='NUMBER'"/>
                  <el-option label="集合" :value="8"
                             v-if="tableData.collResultHead.valueType==='COLLECTION'"
                             @click.native="scope.row.result.valueType='COLLECTION'"/>
                </el-select>
              </el-form-item>
              <el-form-item class="el-col-1">
                &nbsp;
              </el-form-item>
              <el-form-item class="el-col-16">
                <el-input-number v-if="scope.row.result.type===7" v-model="scope.row.result.value"
                                 :controls="false"
                                 :disabled="scope.row.result.type==null"
                                 style="width: 217px"/>

                <el-select v-else-if="scope.row.result.type===6" v-model="scope.row.result.value"
                           clearable
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
                  clearable
                  placeholder="请输入关键词"
                  :remote-method="(query)=>{leftRemoteMethod(query,scope.row.result.type,tableData.collResultHead.valueType,null)}"
                  :loading="leftSelect.loading">
                  <el-option
                    v-for="item in leftSelect.options"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                    @click.native="conditionCollSelectClick(item,scope.row.result)">
                  </el-option>
                </el-select>
                <el-input v-else v-model="scope.row.result.value" :disabled="scope.row.result.type==null"
                          style="width: 217px"/>
              </el-form-item>
            </el-form>
            <span slot="reference" style="width:100%;height: 30px;display:block;line-height: 30px;cursor: pointer">
                  <el-tag
                    type="success"
                    v-if="scope.row.result.type!=null"
                    style="height: 22px;line-height: 22px;padding: 0 2px 0 2px;"
                    disable-transitions>
                    {{ getConditionNamePrefix(scope.row.result.type) }}
                  </el-tag>
                  {{
                scope.row.result.variableValue != null ? scope.row.result.variableValue : (scope.row.result.valueName == null ? scope.row.result.value : scope.row.result.valueName)
              }}
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

    <div id="contextmenu"
         v-show="menuVisible"
         class="menu">
      <div class="contextmenu__item" @click="addRowOn()">上添加一行
      </div>
      <div class="contextmenu__item" @click="addRowBelow()">下添加一行
      </div>
      <div class="contextmenu__item" @click="removeRow()" v-if="this.tableData.rows.length > 1">删除此行
      </div>
    </div>


    <div id="headerContextmenu"
         v-show="headerMenuVisible"
         class="headerMenu">
      <div class="contextmenu__item" @click="addOneColumnToTheLeft()">左添加一列
      </div>
      <div class="contextmenu__item" @click="addAColumnToTheRight()">右添加一列
      </div>
      <div class="contextmenu__item" @click="removeColumn()" v-if="this.tableData.collConditionHeads.length > 1">删除此列
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DecisionTableConfig",
  data() {
    return {
      menuVisible: false,
      headerMenuVisible: false,
      currentRow: null,
      currentColumn: null,
      id: null,
      strategyType: 1,
      loading: false,
      tableData: {
        collConditionHeads: [],
        collResultHead: {
          type: null,
          valueType: null,
          visible: false,
          defaultAction: {
            type: null,
            variableValue: null,
            enableDefaultAction: 1,
            value: undefined,
            valueName: null,
          },
        },
        rows: [{
          id: null,
          priority: null,
          conditions: [],
          result: {
            value: undefined,
            valueName: null,
            variableValue: null,
            valueType: null,
            type: null,
          }
        }]
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
  },
  methods: {
    getConditionHeadInfo() {

    },
    getNewColl() {
      return {
        "name": "条件",
        "visible": false,
        "symbol": null,
        "leftValue": {
          "type": null,
          "value": undefined,
          "valueName": null,
          "variableValue": null,
          "valueType": null
        }
      };
    },
    addOneColumnToTheLeft() {
      let index = this.currentColumn.index;
      this.tableData.collConditionHeads.splice(index, 0, this.getNewColl());
      let rowsLength = this.tableData.rows.length;
      for (let i = 0; i < rowsLength; i++) {
        let conditions = this.tableData.rows[i].conditions;
        for (let j = 0; j < conditions.length; j++) {
          if (j === index) {
            const newCondition = {
              value: undefined,
              valueName: null,
              variableValue: null,
              valueType: null,
              type: null,
            };
            conditions.splice(index, 0, newCondition);
            break;
          }
        }
      }
    },
    removeColumn() {
      let index = this.currentColumn.index;
      this.tableData.collConditionHeads.splice(index, 1);
    },
    addAColumnToTheRight() {
      let index = this.currentColumn.index;
      this.tableData.collConditionHeads.splice(index + 1, 0, this.getNewColl());
      let rowsLength = this.tableData.rows.length;
      for (let i = 0; i < rowsLength; i++) {
        let conditions = this.tableData.rows[i].conditions;
        for (let j = 0; j < conditions.length; j++) {
          if (j === index) {
            const newCondition = {
              value: undefined,
              valueName: null,
              variableValue: null,
              valueType: null,
              type: null,
            };
            conditions.splice(index + 1, 0, newCondition);
            break;
          }
        }
      }
    },
    getNewRow(row) {
      return {
        id: 1,
        priority: 1,
        conditions: Array.from(row.conditions).map(m => ({
          value: undefined,
          valueName: null,
          valueType: null,
          variableValue: null,
          type: null,
        })),
        result: {
          value: undefined,
          valueName: null,
          variableValue: null,
          valueType: null,
          type: null,
        }
      };
    },
    addRowOn() {
      for (let i = 0; i < this.tableData.rows.length; i++) {
        if (this.tableData.rows[i] === this.currentRow) {
          this.tableData.rows.splice(i, 0, this.getNewRow(this.tableData.rows[i]));
          return;
        }
      }
    },
    removeRow() {
      for (let i = 0; i < this.tableData.rows.length; i++) {
        if (this.tableData.rows[i] === this.currentRow) {
          this.tableData.rows.splice(i, 1);
          return;
        }
      }
    },
    addRowBelow() {
      for (let i = 0; i < this.tableData.rows.length; i++) {
        if (this.tableData.rows[i] === this.currentRow) {
          this.tableData.rows.splice(i + 1, 0, this.getNewRow(this.tableData.rows[i]));
          return;
        }
      }
    },
    cellClick(row, column, cell, event) {
    },
    headerRightClick(column, event) {
      event.preventDefault(); //关闭浏览器右键默认事件
      if (column.property === "condition") {
        this.menuVisible = false;
        this.headerMenuVisible = true; // 显示模态窗口，跳出自定义菜单栏
        this.currentColumn = column;
        var menu = document.querySelector('.headerMenu');
        this.styleMenu(menu, event)
      }
    },
    rightClick(row, column, event) {
      this.headerMenuVisible = false;
      this.menuVisible = true; // 显示模态窗口，跳出自定义菜单栏
      event.preventDefault(); //关闭浏览器右键默认事件
      this.currentRow = row;
      var menu = document.querySelector('.menu');
      this.styleMenu(menu, event)
    },
    foo() {
      // 取消鼠标监听事件 菜单栏
      this.menuVisible = false;
      this.headerMenuVisible = false;
      document.removeEventListener('click', this.foo) // 关掉监听，
    },
    styleMenu(menu, event) {
      if (event.clientX > 1800) {
        menu.style.left = event.clientX - 100 + 'px'
      } else {
        menu.style.left = event.clientX + 1 + 'px'
      }
      document.addEventListener('click', this.foo); // 给整个document新增监听鼠标事件，点击任何位置执行foo方法
      if (event.clientY > 700) {
        menu.style.top = event.clientY - 30 + 'px'
      } else {
        menu.style.top = event.clientY - 10 + 'px'
      }
    },
    /**
     * 优先级默认值0
     * @param value
     * @param row
     */
    handlePriorityChange(value, row) {
      if (value === undefined || value === '') {
        row.priority = 0;
      }
    },
    headConditionValueChange(cch, index) {
      // 清除运算符
      cch.symbol = null;
      // 条件头修改后，此列下所有单元格清空 此次待优化，如果valueType没有修改，则不会执行以下代码
      this.tableData.rows.forEach((f) => {
        this.$set(f.conditions, index, {
          value: null,
          valueName: null,
          valueType: null,
          variableValue: null,
          type: null,
        });
      });
    },
    handlePopover(cch) {
      this.symbolSelect.options = [];
      if (cch.leftValue.valueType != null) {
        this.symbolSelect.options = this.$common.getSymbolByValueType(cch.leftValue.valueType);
      }
    },
    update() {
      let collConditionHeadsLength = this.tableData.collConditionHeads.length;
      for (let i = 0; i < collConditionHeadsLength; i++) {
        let collConditionHead = this.tableData.collConditionHeads[i];
        if (collConditionHead.leftValue.type == null) {
          continue;
        }
        collConditionHead.leftValue.type = collConditionHead.leftValue.type > 1 ? 2 : collConditionHead.leftValue.type;
      }
      if (this.tableData.collResultHead.type != null) {
        this.tableData.collResultHead.type = this.tableData.collResultHead.type > 1 ? 2 : this.tableData.collResultHead.type;
      }
      let rowsLength = this.tableData.rows.length;
      for (let i = 0; i < rowsLength; i++) {
        let row = this.tableData.rows[i];
        if (row.result.type == null) {
          continue;
        }
        row.result.type = row.result.type > 1 ? 2 : row.result.type;
        for (let j = 0; j < row.conditions.length; j++) {
          let condition = row.conditions[j];
          condition.type = condition.type > 1 ? 2 : condition.type;
        }
      }
      this.$axios.post("/ruleEngine/decisionTable/updateDecisionTable", {
        "id": this.id,
        "strategyType": this.strategyType,
        "tableData": this.tableData
      }).then(res => {
        let da = res.data;
        if (da) {
          this.$message({
            showClose: true,
            message: '保存成功',
            type: 'success'
          });
        }
      }).catch(function (error) {
        console.log(error);
      });
    },
    nextStep() {
      let collConditionHeadsLength = this.tableData.collConditionHeads.length;
      for (let i = 0; i < collConditionHeadsLength; i++) {
        let collConditionHead = this.tableData.collConditionHeads[i];
        if (collConditionHead.leftValue.type == null) {
          this.$message({
            showClose: true,
            message: '表头第' + (i + 1) + '列条件类型不能为空',
            type: 'warning'
          });
          return;
        }
        if (collConditionHead.leftValue.value == null) {
          this.$message({
            showClose: true,
            message: '表头第' + (i + 1) + '列条件值不能为空',
            type: 'warning'
          });
          return;
        }
        if (collConditionHead.symbol == null) {
          this.$message({
            showClose: true,
            message: '表头第' + (i + 1) + '列条件运算符不能为空',
            type: 'warning'
          });
          return;
        }
        collConditionHead.leftValue.type = collConditionHead.leftValue.type > 1 ? 2 : collConditionHead.leftValue.type;
      }
      if (this.tableData.collResultHead.type == null) {
        this.$message({
          showClose: true,
          message: '表头结果类型不能为空',
          type: 'warning'
        });
        return;
      }
      this.tableData.collResultHead.type = this.tableData.collResultHead.type > 1 ? 2 : this.tableData.collResultHead.type;

      let rowsLength = this.tableData.rows.length;
      for (let i = 0; i < rowsLength; i++) {
        let row = this.tableData.rows[i];
        if (row.result.type == null) {
          this.$message({
            showClose: true,
            message: '单元格第' + (i + 1) + '行结果值类型不能为空',
            type: 'warning'
          });
          return;
        }
        if (row.result.value == null) {
          this.$message({
            showClose: true,
            message: '单元格第' + (i + 1) + '行结果值不能为空',
            type: 'warning'
          });
          return;
        }
        row.result.type = row.result.type > 1 ? 2 : row.result.type;
        for (let j = 0; j < row.conditions.length; j++) {
          let condition = row.conditions[j];
          condition.type = condition.type > 1 ? 2 : condition.type;
        }
      }

      this.$axios.post("/ruleEngine/decisionTable/generationRelease", {
        "id": this.id,
        "strategyType": this.strategyType,
        "tableData": this.tableData
      }).then(res => {
        let da = res.data;
        if (da) {
          this.$router.push({
            path: '/DecisionTableViewAndTest',
            query: {decisionTableId: this.id}
          });
        }
      }).catch(function (error) {
        console.log(error);
      });
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
    actionValueTypeChange(da) {
      da.defaultAction.type = null;
      da.value = undefined;
      da.valueName = null;
      // 如果是变量或者元素
      if (da.type === 1 || da.type === 0) {
        da.valueType = null;
      }
      this.leftSelect.options = [];
      this.tableData.rows.forEach((f) => {
        f.result = {
          value: undefined,
          valueName: null,
          variableValue: null,
          valueType: null,
          type: null,
        };
      });
    },
    leftValueTypeChange(cch, index) {
      if (cch.leftValue.valueType != null) {
        // 条件头修改后，此列下所有单元格清空
        this.tableData.rows.forEach((f) => {
          this.$set(f.conditions, index, {
            value: null,
            valueName: null,
            valueType: null,
            variableValue: null,
            type: null,
          });
        });
      }
      cch.leftValue.value = undefined;
      cch.leftValue.valueName = null;
      // 如果是变量或者元素
      if (cch.leftValue.type === 1 || cch.leftValue.type === 0) {
        cch.leftValue.valueType = null;
      } else {
        //变更运算符
        this.symbolSelect.options = this.$common.getSymbolByValueType(this.getValueTypeByType(cch.leftValue.type));
      }
      this.leftSelect.options = [];
      cch.symbol = null;
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
      cch.variableValue = item.variableValue;
    },
    leftSelectClick(item, cch) {
      cch.valueType = item.valueType;
      cch.value = item.id;
      cch.valueName = item.name;
      cch.variableValue = item.value;
      // 变更运算符
      this.symbolSelect.options = this.$common.getSymbolByValueType(item.valueType);
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
    getType(type, valueType) {
      if (type > 1) {
        if (valueType === "COLLECTION") {
          return 5;
        } else if (valueType === "STRING") {
          return 2;
        } else if (valueType === "BOOLEAN") {
          return 3;
        } else if (valueType === "NUMBER") {
          return 4;
        }
      }
      return type;
    },
    getDecisionTableConfig() {
      this.loading = true;
      this.$axios.post("/ruleEngine/decisionTable/getDecisionTableConfig", {
        "id": this.id
      }).then(res => {
        let da = res.data;
        if (da != null) {
          this.id = da.id;
          this.name = da.name;
          this.code = da.code;
          this.description = da.description;
          this.strategyType = da.strategyType;
          {
            let collConditionHeadsLength = da.tableData.collConditionHeads.length;
            for (let i = 0; i < collConditionHeadsLength; i++) {
              let collConditionHead = da.tableData.collConditionHeads[i];
              if (collConditionHead.leftValue.type == null) {
                continue;
              }
              collConditionHead.leftValue.type = this.getType(collConditionHead.leftValue.type, collConditionHead.leftValue.valueType);
            }
            if (da.tableData.collResultHead.type != null) {
              da.tableData.collResultHead.type =  this.getType(da.tableData.collResultHead.type, da.tableData.collResultHead.valueType);
            }
            let rowsLength = da.tableData.rows.length;
            for (let i = 0; i < rowsLength; i++) {
              let row = da.tableData.rows[i];
              if (row.result.type == null) {
                continue;
              }
              row.result.type = this.getType(row.result.type, row.result.valueType);
              for (let j = 0; j < row.conditions.length; j++) {
                let condition = row.conditions[j];
                condition.type = this.getType(condition.type, condition.valueType);
              }
            }
          }
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

#decisionTableConfig .el-table th {
  padding: 10px 0 10px 0;
}

#decisionTableConfig .el-table td {
  padding: 8px 0 8px 0;
}

.box-card-header .el-input__inner {
  border: none;
  height: 36px;
  font-size: 16px;
  color: #303133;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
}
</style>
<style scoped>

.box-card-header {
  margin-top: -20px;
  line-height: 46px;
  height: 24px;
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

.conditionRowFrom .el-form-item, .resultRow .el-form-item {
  margin-bottom: 0;
}
</style>
