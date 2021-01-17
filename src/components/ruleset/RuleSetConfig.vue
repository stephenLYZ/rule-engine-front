<template>
  <div id="RuleSetConfig">
    <el-steps :active="2" align-center>
      <el-step title="规则集定义" icon="el-icon-edit"/>
      <el-step title="规则集配置" icon="el-icon-connection"/>
      <el-step title="规则集预览" icon="el-icon-view" class="stepp"/>
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
                <span>规则集</span>
                <i class="el-icon-circle-plus-outline pointer" @click="addRuleSet()"
                   style="float: right; padding: 14px 10px;color: #5ba0f8;"/>
              </div>
              <div>
                <el-form :model="form" ref="form">
                  <el-card class="box-card ruleSetCard" v-for="(rs,index) in form.ruleSet" :key="rs.id"
                           :body-style="{ padding: '6px 6px 0px 6px' }"
                           :draggable="ruleSetDraggable"
                           v-on:dragstart.native="handleDragStartRuleSet($event, rs)"
                           v-on:dragover.prevent.native="handleDragOverRuleSet($event)"
                           v-on:dragenter.native="handleDragEnterRuleSet($event, rs, ruleSet)"
                           v-on:dragend.native="handleDragEndRuleSet($event)">
                    <div slot="header" class="box-card-header">
                      <span><el-input v-model="rs.name" style="width: 200px;margin-left: -20px;"/></span>
                      <i class="el-icon-delete pointer" @click="deleteRuleSet(rs)"
                         style="float: right; padding: 14px 0;color: #5ba0f8;"/>
                      <i class="el-icon-rank pointer" style="float: right; padding: 14px 8px;color: #5ba0f8;"
                         @mouseover="ruleSetDraggable=true"
                         @mouseleave="ruleSetDraggable=false"/>
                    </div>
                    <el-card class="box-card" style="margin-bottom: 7px;">
                      <div slot="header" class="box-card-header">
                        <span>条件集</span>
                        <i class="el-icon-circle-plus-outline pointer" @click="addConditionGroup(rs)"
                           style="float: right; padding: 14px 10px;color: #5ba0f8;"/>
                      </div>
                      <div>
                        <el-card v-for="cg in rs.conditionGroup" class="box-card conditionGroupCard" :key="cg.id"
                                 :body-style="{ padding: '6px 6px 6px 6px' }"
                                 :draggable="conditionGroupDraggable"
                                 v-on:dragstart.native="handleDragStartCG($event, cg)"
                                 v-on:dragover.prevent.native="handleDragOverCG($event)"
                                 v-on:dragenter.native="handleDragEnterCG($event, cg, rs.conditionGroup)"
                                 v-on:dragend.native="handleDragEndCG($event)">
                          <div slot="header" class="box-card-header">
                            <span><el-input v-model="cg.name" style="width: 200px;margin-left: -20px;"/></span>
                            <i class="el-icon-delete pointer" @click="deleteConditionGroup(rs,cg)"
                               style="float: right; padding: 14px 0;color: #5ba0f8;"/>
                            <i class="el-icon-circle-plus-outline pointer" @click="addCondition(cg)"
                               style="float: right; padding: 14px 10px;color: #5ba0f8;"/>
                            <i class="el-icon-rank pointer" style="float: right; padding: 14px 4px;color: #5ba0f8;"
                               @mouseover="conditionGroupDraggable=true"
                               @mouseleave="conditionGroupDraggable=false"/>
                          </div>

                          <el-alert
                            style="padding: 6px 0 8.5px 0"
                            :id="c.id" class="item"
                            v-for="c in cg.conditionGroupCondition"
                            :key="c.id"
                            :closable="false"

                            draggable="true"
                            v-on:dragstart.native="handleDragStart($event, c,cg.id)"
                            v-on:dragover.prevent.native="handleDragOver($event)"
                            v-on:dragenter.native="handleDragEnter($event, c, cg.conditionGroupCondition,cg.id)"
                            v-on:dragend.native="handleDragEnd($event)">

                            <el-tag style="height: 22px;line-height: 22px;padding: 0 2px 0 2px;font-size: 13px;">
                              （{{c.condition.name}}）
                            </el-tag>
                            &nbsp;

                            <el-tag type="success" style="height: 22px;line-height: 22px;padding: 0 2px 0 2px;">
                              {{getConditionNamePrefix(c.condition.config.leftValue.type)}}
                            </el-tag>
                            <span style="color: #606266">  {{c.condition.config.leftValue.valueName}}</span>

                            &nbsp;
                            <el-tag type="warning" style="height: 22px;line-height: 22px;padding: 0 2px 0 2px;">
                              {{$common.getSymbolExplanation(c.condition.config.symbol)}}
                            </el-tag>

                            &nbsp;
                            <el-tag type="success" style="height: 22px;line-height: 22px;padding: 0 2px 0 2px;">
                              {{ getConditionNamePrefix(c.condition.config.rightValue.type)}}
                            </el-tag>


                            <span style="color: #606266">   {{c.condition.config.rightValue.valueName}}</span>

                            <i class="el-alert__closebtn el-icon-close" style="color: rgb(91, 160, 248)"
                               @click="removeCondition(cg.conditionGroupCondition,c.condition.id)"/>
                          </el-alert>
                        </el-card>
                      </div>
                    </el-card>

                    <el-card class="box-card" style="margin-bottom: 7px;">
                      <div slot="header" class="box-card-header">
                        <span>结果</span>
                      </div>
                      <div>

                        <el-form-item :prop="'ruleSet.' + index + '.action.type'" class="el-col-6"
                                      :rules="{required: true, message: '请选择结果类型', trigger:  ['blur', 'change']}">
                          <el-select v-model="rs.action.type" @change="actionTypeChange(rs)">
                            <el-option label="元素" :value="0"/>
                            <el-option label="变量" :value="1"/>
                            <el-option label="字符串" :value="2" @click.native="rs.action.valueType='STRING'"/>
                            <el-option label="布尔" :value="3" @click.native="rs.action.valueType='BOOLEAN'"/>
                            <el-option label="数值" :value="4" @click.native="rs.action.valueType='NUMBER'"/>
                            <el-option label="集合" :value="5" @click.native="rs.action.valueType='COLLECTION'"/>
                          </el-select>
                        </el-form-item>

                        <el-form-item class="el-col-1">
                          &nbsp;
                        </el-form-item>

                        <el-form-item :prop="'ruleSet.' + index + '.action.value'" class="el-col-17"
                                      :rules="{required: true, message: '请输入结果值', trigger: 'blur'}">

                          <el-select v-if="rs.action.type===3" v-model="rs.action.value"
                                     :disabled="rs.action.type==null">
                            <el-option label="true" value="true"/>
                            <el-option label="false" value="false"/>
                          </el-select>

                          <el-select v-else-if="rs.action.type===0||rs.action.type===1"
                                     v-model="rs.action.valueName"
                                     filterable
                                     :disabled="rs.action.type==null"
                                     remote
                                     placeholder="请输入关键词"
                                     :remote-method="(query)=>{actionRemoteMethod(query,rs)}"
                                     :loading="actionLoading">
                            <el-option
                              v-for="item in actionOptions"
                              :key="item.id"
                              :label="item.name"
                              :value="item.id"
                              @click.native="actionSelectClick(rs,item)">
                            </el-option>
                          </el-select>

                          <div v-else-if="rs.action.valueType==='NUMBER'">
                            <el-input-number v-model="rs.action.value" :controls="false"
                                             :disabled="rs.action.type==null"
                                             style="width: 100%"/>
                          </div>

                          <el-input v-else v-model="rs.action.value" :disabled="rs.action.type==null"/>

                        </el-form-item>
                      </div>
                    </el-card>
                  </el-card>
                </el-form>
              </div>
            </el-card>
            <br> <br>
            <el-card class="box-card">
              <div slot="header" class="box-card-header">
                <span>默认规则</span>
              </div>
              <div>
                <el-form ref="defaultRule" :model="defaultRule">
                  <el-switch v-model="enableDefaultRule" :active-value="0" :inactive-value="1"/>
                  <br>
                  <br>
                  <el-form-item prop="action.valueType" class="el-col-6"
                                :rules="enableDefaultRule===0? {required: true, message: '请选择结果类型', trigger:  ['blur', 'change']}:{}">
                    <el-select v-model="defaultRule.action.type"
                               @change="defaultRuleTypeChange()">
                      <el-option label="元素" :value="0"/>
                      <el-option label="变量" :value="1"/>
                      <el-option label="字符串" :value="2"
                                 @click.native="defaultRule.action.valueType='STRING'"/>
                      <el-option label="布尔" :value="3"
                                 @click.native="defaultRule.action.valueType='BOOLEAN'"/>
                      <el-option label="数值" :value="4"
                                 @click.native="defaultRule.action.valueType='NUMBER'"/>
                      <el-option label="集合" :value="5"
                                 @click.native="defaultRule.action.valueType='COLLECTION'"/>
                    </el-select>
                  </el-form-item>
                  <el-form-item class="el-col-1">
                    &nbsp;
                  </el-form-item>
                  <el-form-item prop="action.value" class="el-col-17"
                                :rules="enableDefaultRule===0?{required: true, message: '请输入结果值', trigger: 'blur'}:{}">

                    <el-select v-if="defaultRule.action.type===3" v-model="defaultRule.action.value"
                               :disabled="defaultRule.action.type==null">
                      <el-option label="true" value="true"/>
                      <el-option label="false" value="false"/>
                    </el-select>

                    <el-select v-else-if="defaultRule.action.type===1||defaultRule.action.type===0"
                               v-model="defaultRule.action.valueName"
                               filterable
                               remote
                               :disabled="defaultRule.action.type==null"
                               placeholder="请输入关键词"
                               :remote-method="defaultRuleRemoteMethod"
                               :loading="actionLoading">
                      <el-option
                        v-for="item in actionOptions"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                        @click.native="defaultRuleSelectClick(item)">
                      </el-option>
                    </el-select>


                    <div v-else-if="defaultRule.action.valueType==='NUMBER'">
                      <el-input-number v-model="defaultRule.action.value" :controls="false"
                                       :disabled="defaultRule.action.type==null"
                                       style="width: 100%"/>
                    </div>

                    <el-input v-else v-model="defaultRule.action.value" :disabled="defaultRule.action.type==null"/>
                  </el-form-item>
                </el-form>
              </div>
            </el-card>
            <br> <br>
            <el-card class="box-card">
              <div slot="header" class="box-card-header">
                <span>设置</span>
              </div>
              <el-form label-width="70px">
                <el-form-item label="执行策略">
                  <el-select v-model="strategyType">
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
        <br> <br>
        <el-row>
          <el-col :span="1">&nbsp;</el-col>
          <el-col :span="22">
            <el-button type="primary" @click="nextStep()" style="float: right;margin-left: 20px">下 一 步</el-button>
            <el-button type="primary" @click="previous()" style="float: right;margin-left: 20px">上 一 步</el-button>
            <el-button type="primary" @click="update()" style="float: right;">保存</el-button>
          </el-col>
          <el-col :span="1">&nbsp;</el-col>
        </el-row>

      </el-col>
      <el-col :span="5">
        <el-card class="box-card" :body-style="{ padding: '28px 12px 6px 12px' }" v-if="condition.dialogFormVisible">
          <div slot="header" class="box-card-header">
            <span>选择条件</span>
            <i class="el-icon-close pointer" @click="condition.dialogFormVisible=false "
               style="float: right; padding: 14px 0;color: #5ba0f8;"/>
          </div>
          <div>
            <el-select
              style="width: 100%"
              v-model="condition.value"
              filterable
              remote
              reserve-keyword
              placeholder="请输入关键词搜索"
              :remote-method="conditionRemoteMethod"
              :loading="condition.loading">
              <el-option
                v-for="item in condition.options"
                :key="item.id"
                :label="item.name"
                :value="item.id"
                @click.native="selectCondition(item)">
              </el-option>
            </el-select>
            <br>
            <br>
          </div>
        </el-card>
      </el-col>

    </el-row>
    <br><br>
    <el-backtop/>
  </div>
</template>

<script>
    import uuidv1 from 'uuid/v1'

    export default {
        name: "RuleSetConfig",
        data() {
            return {
                loading: false,
                ruleSetDraggable: null,
                currentRuleSetDragging: null,
                currentRuleSetId: null,
                conditionGroupDraggable: null,
                condition: {
                    dialogFormVisible: false,
                    value: null,
                    options: null
                },
                currentConditionGroup: {
                    conditionGroupCondition: []
                },
                form: {
                    ruleSet: [],
                },
                strategyType: 1,
                abnormalAlarm: {
                    enable: false,
                    email: "",
                },
                actionOptions: [],
                actionLoading: false,
                enableDefaultRule: false,
                defaultRule: {
                    id: null,
                    name: "默认规则",
                    conditionGroup: [], //扩展
                    action: {
                        value: undefined,
                        valueName: null,
                        valueType: null,
                        type: null,
                    }
                }
            }
        },
        methods: {
            defaultRuleTypeChange() {
                this.actionOptions = [];
                this.defaultRule.action.value = undefined;
                this.defaultRule.action.valueName = null;
            },
            defaultRuleSelectClick(item) {
                this.defaultRule.action.valueType = item.valueType;
                this.defaultRule.action.value = item.id.toString();
            },
            defaultRuleRemoteMethod(query) {
                if (query !== '') {
                    this.actionLoading = true;
                    this.actionOptions = [];
                    let type = this.defaultRule.action.type;
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
                            this.actionOptions = res.data.rows;
                        }
                        this.actionLoading = false;
                    }).catch(function (error) {
                        console.log(error);
                    });
                } else {
                    this.actionLoading = [];
                }
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
            selectCondition(item) {
                let newOrderNo = 1;
                // 如果存在条件组与条件的关系
                if (this.currentConditionGroup.conditionGroupCondition != null) {
                    if (this.currentConditionGroup.conditionGroupCondition[this.currentConditionGroup.conditionGroupCondition.length - 1] !== undefined) {
                        newOrderNo = this.currentConditionGroup.conditionGroupCondition[this.currentConditionGroup.conditionGroupCondition.length - 1].orderNo + 1;
                    }
                } else {
                    // 初始化
                    this.currentConditionGroup.conditionGroupCondition = [];
                }
                this.currentConditionGroup.conditionGroupCondition.push({
                    orderNo: newOrderNo,
                    condition: {
                        id: item.id,
                        name: item.name,
                        config: item.config
                    }
                });
                this.condition.dialogFormVisible = false;
                this.condition.value = null;
                this.condition.options = [];
            },
            conditionRemoteMethod(query) {
                if (query !== '') {
                    this.condition.loading = true;
                    this.condition.options = [];
                    let url = "/ruleEngine/condition/list";
                    this.$axios.post(url, {
                        "page": {
                            "pageSize": 10,
                            "pageIndex": 1
                        },
                        "query": {
                            "name": query
                        },
                        "orders": []
                    }).then(res => {
                        if (res.data != null) {
                            this.condition.options = res.data.rows;
                        }
                        this.condition.loading = false;
                    }).catch(function (error) {
                        console.log(error);
                    });
                } else {
                    this.condition.options = [];
                }
            },
            previous() {
                this.$router.push({path: '/RuleSetDefinition', query: {ruleSetId: this.id}});
            },
            nextStep() {
                // 先更新规则set，到待发布
                this.$refs["form"].validate((valid) => {
                    if (valid) {
                        this.$refs["defaultRule"].validate((valid) => {
                            if (valid) {
                                this.$axios.post("/ruleEngine/ruleSet/generationRelease", {
                                    "id": this.id,
                                    "ruleSet": this.form.ruleSet,
                                    "enableDefaultRule": this.enableDefaultRule,
                                    "strategyType": this.strategyType,
                                    "abnormalAlarm": {
                                        "enable": this.abnormalAlarm.enable,
                                        "email": this.abnormalAlarm.email.split(",")
                                    },
                                    "defaultRule": {
                                        id: this.defaultRule.id,
                                        name: this.defaultRule.name,
                                        conditionGroup: this.defaultRule.conditionGroup, //扩展
                                        action: {
                                            "value": this.defaultRule.action.value,
                                            "type": this.defaultRule.action.type > 1 ? 2 : this.defaultRule.action.type,
                                            "valueType": this.defaultRule.action.valueType
                                        }
                                    },
                                }).then(res => {
                                    let da = res.data;
                                    if (da) {
                                        this.$router.push({
                                            path: '/RuleSetViewAndTest',
                                            query: {ruleSetId: this.id}
                                        });
                                    }
                                }).catch(function (error) {
                                    console.log(error);
                                });
                            }
                        });
                    }
                });
            },
            update() {
                this.$axios.post("/ruleEngine/ruleSet/updateRuleSet", {
                    "id": this.id,
                    "ruleSet": this.form.ruleSet,
                    "enableDefaultRule": this.enableDefaultRule,
                    "strategyType": this.strategyType,
                    "abnormalAlarm": {
                        "enable": this.abnormalAlarm.enable,
                        "email": this.abnormalAlarm.email.split(",")
                    },
                    "defaultRule": {
                        id: this.defaultRule.id,
                        name: this.defaultRule.name,
                        conditionGroup: this.defaultRule.conditionGroup, //扩展
                        action: {
                            "value": this.defaultRule.action.value,
                            "type": this.defaultRule.action.type > 1 ? 2 : this.defaultRule.action.type,
                            "valueType": this.defaultRule.action.valueType
                        }
                    },
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
            actionRemoteMethod(query, rs) {
                if (query !== '') {
                    this.actionOptions = true;
                    this.actionOptions = [];
                    let type = rs.action.type;
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
                            this.actionOptions = res.data.rows;
                        }
                        this.actionLoading = false;
                    }).catch(function (error) {
                        console.log(error);
                    });
                } else {
                    this.actionOptions = [];
                }
            },
            actionSelectClick(rs, item) {
                rs.action.valueType = item.valueType;
                rs.action.value = item.id.toString();
            },
            actionTypeChange(rs) {
                rs.action.options = [];
                rs.action.value = undefined;
                rs.action.valueName = null;
            },
            handleDragStartRuleSet(e, item) {
                this.currentRuleSetDragging = item;
            },
            handleDragOverRuleSet(e) {
                // 在dragenter中针对放置目标来设置!
                e.dataTransfer.dropEffect = 'move';
            },
            handleDragEnterRuleSet(e, item, ruleSet) {
                //为需要移动的元素设置dragstart事件
                e.dataTransfer.effectAllowed = "move";
                if (item === this.currentRuleSetDragging) {
                    return;
                }
                let no = item.orderNo;
                let orderNo = this.currentRuleSetDragging.orderNo;
                ruleSet.forEach((e) => {
                    let uniqueMarkE = this.getUniqueMark(e);
                    let uniqueMarkItem = this.getUniqueMark(item);
                    if (uniqueMarkE === uniqueMarkItem) {
                        e.orderNo = orderNo;
                    } else if (uniqueMarkE === this.getUniqueMark(this.currentRuleSetDragging)) {
                        e.orderNo = no;
                    }
                });
                //页面显示排序
                ruleSet.sort(function (a, b) {
                    return a.orderNo - b.orderNo
                });
            },
            handleDragEndRuleSet(e) {
                this.currentRuleSetDragging = null;
            },
            getUniqueMark(value) {
                if (value.id != null) {
                    return value.id;
                }
                return value.uuid;
            },
            addRuleSet() {
                let newOrderNo = 1;
                if (this.form.ruleSet != null) {
                    let length = this.form.ruleSet.length;
                    let ruleSetElement = this.form.ruleSet[length - 1];
                    if (ruleSetElement !== undefined) {
                        newOrderNo = ruleSetElement.orderNo + 1;
                    }
                } else {
                    this.form.ruleSet = [];
                }
                let newRuleSet = {
                    id: null,
                    uuid: uuidv1(),
                    name: "规则",
                    orderNo: newOrderNo,
                    conditionGroup: [],
                    action: {
                        value: undefined,
                        valueName: null,
                        valueType: null,
                        type: null,
                    }
                };
                this.form.ruleSet.push(newRuleSet);
            },
            deleteRuleSet(rs) {
                this.form.ruleSet.forEach((value, index) => {
                    if (this.getUniqueMark(value) === this.getUniqueMark(rs)) {
                        this.form.ruleSet.splice(index, 1);
                    }
                });
            },
            handleDragStartCG(e, item) {
                this.currentConditionDraggingCG = item;
            },
            handleDragEndCG(e) {
                this.currentConditionDraggingCG = null;
            },
            //首先把div变成可以放置的元素，即重写dragenter/dragover
            handleDragOverCG(e) {
                // 在dragenter中针对放置目标来设置!
                e.dataTransfer.dropEffect = 'move';
            },
            handleDragEnterCG(e, item, conditions) {
                //为需要移动的元素设置dragstart事件
                e.dataTransfer.effectAllowed = "move";
                if (item === this.currentConditionDraggingCG) {
                    return;
                }
                let no = item.orderNo;
                let orderNo = this.currentConditionDraggingCG.orderNo;
                conditions.forEach((e) => {
                    let uniqueMarkE = this.getUniqueMark(e);
                    let uniqueMarkItem = this.getUniqueMark(item);
                    if (uniqueMarkE === uniqueMarkItem) {
                        e.orderNo = orderNo;
                    } else if (uniqueMarkE === this.getUniqueMark(this.currentConditionDraggingCG)) {
                        e.orderNo = no;
                    }
                });
                //页面显示排序
                conditions.sort(function (a, b) {
                    return a.orderNo - b.orderNo
                });
            },
            deleteConditionGroup(rs, cg) {
                // 删除
                rs.conditionGroup.forEach((value, index) => {
                    if (this.getUniqueMark(value) === this.getUniqueMark(cg)) {
                        rs.conditionGroup.splice(index, 1);
                    }
                });
            },
            addCondition(cg) {
                // 选择，或者创建
                this.condition.dialogFormVisible = true;
                this.currentConditionGroup = cg;
            },
            handleDragStart(e, item, cgId) {
                this.currentConditionDragging = item;
                this.currentConditionCgId = cgId;
            },
            handleDragEnd(e) {
                this.currentConditionDragging = null;
                this.currentConditionCgId = null;
            },
            //首先把div变成可以放置的元素，即重写dragenter/dragover
            handleDragOver(e) {
                // 在dragenter中针对放置目标来设置!
                e.dataTransfer.dropEffect = 'move'
            },
            handleDragEnter(e, item, conditions, cgId) {
                // 如果一个条件组的条件移动到另一个条件组，阻止
                if (cgId !== this.currentConditionCgId) {
                    return;
                }
                //为需要移动的元素设置dragstart事件
                e.dataTransfer.effectAllowed = "move";
                // if (item.id === this.currentConditionDragging.id) {
                //   return;
                // }
                let no = item.orderNo;
                let orderNo = this.currentConditionDragging.orderNo;
                conditions.forEach((e) => {
                    if (e.condition.id === item.condition.id) {
                        e.orderNo = orderNo;
                    } else if (e.condition.id === this.currentConditionDragging.condition.id) {
                        e.orderNo = no;
                    }
                });
                //页面显示排序
                conditions.sort(function (a, b) {
                    return a.orderNo - b.orderNo
                });
            },
            removeCondition(conditionGroupCondition, id) {
                // 删除
                conditionGroupCondition.forEach((value, index) => {
                    if (value.condition.id === id) {
                        conditionGroupCondition.splice(index, 1);
                    }
                });
            },
            addConditionGroup(rs) {
                let newOrderNo = 1;
                if (rs.conditionGroup != null) {
                    let length = rs.conditionGroup.length;
                    let conditionGroupElement = rs.conditionGroup[length - 1];
                    if (conditionGroupElement !== undefined) {
                        newOrderNo = conditionGroupElement.orderNo + 1;
                    }
                } else {
                    rs.conditionGroup = [];
                }
                let newConditionGroup = {
                    id: null,
                    uuid: uuidv1(),
                    name: "条件组",
                    orderNo: newOrderNo,
                    conditionGroupCondition: []
                };
                rs.conditionGroup.push(newConditionGroup);
            },
            getRuleSetConfig() {
                this.loading = true;
                this.$axios.post("/ruleEngine/ruleSet/getRuleSetConfig", {
                    "id": this.id
                }).then(res => {
                    let da = res.data;
                    if (da != null) {
                        this.id = da.id;
                        this.name = da.name;
                        this.code = da.code;
                        this.description = da.description;
                        // condition group
                        this.form.ruleSet = da.ruleSet;
                        this.strategyType = da.strategyType;
                        // default rule
                        this.enableDefaultRule = da.enableDefaultRule;
                        this.defaultRule = da.defaultRule;
                        if (da.abnormalAlarm != null) {
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
            }
        }, mounted() {
            this.id = this.$route.query.ruleSetId;
            this.getRuleSetConfig();
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
  .box-card-header {
    margin-top: -20px;
    line-height: 46px;
    height: 24px;
  }

  .ruleSetCard {
    margin-bottom: 12px;
  }

  .conditionGroupCard {
    margin-bottom: 12px;
  }

  .conditionGroupCard:last-child {
    margin-bottom: 0;
  }

</style>
