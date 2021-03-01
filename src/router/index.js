import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import Home from '@/components/Home'

import Login from '@/components/Login.vue'
import Page500 from '@/components/500.vue'
import Page404 from '@/components/404.vue'

import Condition from '@/components/basic/Condition'
import Element from '@/components/basic/Element.vue'
import ElementGroup from "../components/basic/ElementGroup";
import Function from '@/components/basic/Function.vue'
import Variable from '@/components/basic/Variable.vue'

import GeneralRule from '@/components/generalrule/GeneralRule.vue'
import GeneralRuleConfig from '@/components/generalrule/GeneralRuleConfig.vue'
import GeneralRuleViewAndTest from '@/components/generalrule/GeneralRuleViewAndTest.vue'
import GeneralRuleViewPublish from '@/components/generalrule/GeneralRuleViewPublish.vue'
import GeneralRuleDefinition from '@/components/generalrule/GeneralRuleDefinition.vue'

import SystemSetting from '@/components/setting/SystemSetting.vue'
import PersonalSettings from '@/components/setting/PersonalSettings.vue'

import ScoreCard from '@/components/score/ScoreCard.vue'

import DecisionTree from '@/components/decision/tree/DecisionTree'
import DecisionTable from '@/components/decision/table/DecisionTable'
import DecisionTableDefinition from '@/components/decision/table/DecisionTableDefinition'
import DecisionTableConfig from '@/components/decision/table/DecisionTableConfig'
import DecisionTableViewAndTest from "../components/decision/table/DecisionTableViewAndTest";
import DecisionTableViewPublish from "../components/decision/table/DecisionTableViewPublish";

import Workspace from '@/components/authority/Workspace'

import RuleSet from "../components/ruleset/RuleSet";
import RuleSetDefinition from "../components/ruleset/RuleSetDefinition";
import RuleSetConfig from "../components/ruleset/RuleSetConfig";
import RuleSetViewAndTest from "../components/ruleset/RuleSetViewAndTest";
import RuleSetViewPublish from "../components/ruleset/RuleSetViewPublish";

const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
};

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/',
      name: 'Index',
      component: Index,
      redirect: '/home',
      children: [
        {
          path: '/home',
          name: 'Home',
          component: Home
        },
        {
          path: '/condition',
          name: 'Condition',
          component: Condition
        },
        {
          path: '/element',
          name: 'Element',
          component: Element
        },
        {
          path: '/function',
          name: 'Function',
          component: Function
        },
        {
          path: '/variable',
          name: 'Variable',
          component: Variable
        },
        {
          path: '/generalRule',
          name: 'GeneralRule',
          component: GeneralRule
        },
        {
          path: '/generalRuleConfig',
          name: 'GeneralRuleConfig',
          component: GeneralRuleConfig
        },
        {
          path: '/generalRuleViewAndTest',
          name: 'GeneralRuleViewAndTest',
          component: GeneralRuleViewAndTest
        },
        {
          path: '/generalRuleViewPublish',
          name: 'GeneralRuleViewPublish',
          component: GeneralRuleViewPublish
        },
        {
          path: '/generalRuleDefinition',
          name: 'GeneralRuleDefinition',
          component: GeneralRuleDefinition
        },
        {
          path: '/systemSetting',
          name: 'SystemSetting',
          component: SystemSetting
        },
        {
          path: '/personalSettings',
          name: 'PersonalSettings',
          component: PersonalSettings
        },
        {
          path: '/scoreCard',
          name: 'ScoreCard',
          component: ScoreCard
        },
        {
          path: '/decisionTree',
          name: 'DecisionTree',
          component: DecisionTree
        },
        {
          path: '/decisionTable',
          name: 'DecisionTable',
          component: DecisionTable
        },
        {
          path: '/decisionTableDefinition',
          name: 'DecisionTableDefinition',
          component: DecisionTableDefinition
        },
        {
          path: '/decisionTableConfig',
          name: 'DecisionTableConfig',
          component: DecisionTableConfig
        },
        {
          path: '/decisionTableViewAndTest',
          name: 'DecisionTableViewAndTest',
          component: DecisionTableViewAndTest
        },
        {
          path: '/decisionTableViewPublish',
          name: 'DecisionTableViewPublish',
          component: DecisionTableViewPublish
        },
        {
          path: '/workspace',
          name: 'Workspace',
          component: Workspace
        },
        {
          path: '/elementGroup',
          name: 'ElementGroup',
          component: ElementGroup
        },
        {
          path: '/ruleSet',
          name: 'RuleSet',
          component: RuleSet
        },
        {
          path: '/ruleSetDefinition',
          name: 'RuleSetDefinition',
          component: RuleSetDefinition
        },
        {
          path: '/ruleSetConfig',
          name: 'RuleSetConfig',
          component: RuleSetConfig
        },
        {
          path: '/ruleSetViewAndTest',
          name: 'RuleSetViewAndTest',
          component: RuleSetViewAndTest
        },
        {
          path: '/ruleSetViewPublish',
          name: 'RuleSetViewPublish',
          component: RuleSetViewPublish
        },
      ]
    },
    {
      path: '/500',
      name: 'Page500',
      component: Page500,
    },
    {
      path: '*',
      name: 'Page404',
      component: Page404
    }
  ]
})
