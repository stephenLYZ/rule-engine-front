<template>
  <div>
    <br>
    <!--    <el-row>
          <el-col :span="4">
            <el-card class="box-card" shadow="hover" :body-style="{ padding: '12px 12px 6px 12px' }">
              <div slot="header" class="clearfix box-card-header">
                <span>系统变量</span>
              </div>
            </el-card>
          </el-col>
          <el-col :span="1">&nbsp;</el-col>
          <el-col :span="4">
            <el-card class="box-card" shadow="hover" :body-style="{ padding: '12px 12px 6px 12px' }">
              <div slot="header" class="clearfix box-card-header">
                <span>普通规则</span>
              </div>
            </el-card>
          </el-col>
          <el-col :span="1">&nbsp;</el-col>
          <el-col :span="4">
            <el-card class="box-card" shadow="hover" :body-style="{ padding: '12px 12px 6px 12px' }">
              <div slot="header" class="clearfix box-card-header">
                <span>规则集</span>
              </div>
            </el-card>
          </el-col>
          <el-col :span="1">&nbsp;</el-col>
          <el-col :span="4">
            <el-card class="box-card" shadow="hover" :body-style="{ padding: '12px 12px 6px 12px' }">
              <div slot="header" class="clearfix box-card-header">
                <span>决策表</span>
              </div>
            </el-card>
          </el-col>
          <el-col :span="1">&nbsp;</el-col>
          <el-col :span="4">
            <el-card class="box-card" shadow="hover" :body-style="{ padding: '12px 12px 6px 12px' }">
              <div slot="header" class="clearfix box-card-header">
                <span>评分卡</span>
              </div>
            </el-card>
          </el-col>
        </el-row>-->
    <el-card class="box-card" shadow="hover" :body-style="{ padding: '12px 12px 6px 12px' }">
      <div style="width: 100%;height: 400px;" id="drawLine">
        折线图
      </div>
    </el-card>
    <br>
    <br>
    <!--    <div class="block">
          <el-timeline>
            <el-timeline-item timestamp="2021/2/18" placement="top">
              <el-card>
                <h4>增加日期类型</h4>
                <p>网友在GitHub提出希望增加时间类型的支持 <a href="https://github.com/rule-engine/rule-engine/issues/6">issues#6</a></p>
              </el-card>
            </el-timeline-item>

            <el-timeline-item timestamp="2020/12/28" placement="top">
              <el-card>
                <h4>规则集</h4>
                <p>规则集正式开始开发</p>
              </el-card>
            </el-timeline-item>

            <el-timeline-item timestamp="2020/12/19" placement="top">
              <el-card>
                <h4>决策表</h4>
                <p>决策表正式开始开发</p>
              </el-card>
            </el-timeline-item>
            <el-timeline-item timestamp="2020/11/21" placement="top">
              <el-card>
                <h4>引入工作空间</h4>
                <p>增加工作空间</p>
              </el-card>
            </el-timeline-item>
            <el-timeline-item timestamp="2020/9/26" placement="top">
              <el-card>
                <h4>第一次提交</h4>
                <p>在今天12:48作者丁乾文提交了第一次代码</p>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </div>-->
  </div>
</template>

<script>

import * as echarts from 'echarts';

export default {
  name: "home",
  data() {
    return {}
  },
  created() {

  },
  methods: {
    drawLine(option) {
      let drawLine = echarts.init(document.getElementById('drawLine'))
      option && drawLine.setOption(option);
    }
  },
  mounted() {
    this.drawLine({
      title: {
        // text: '普通规则'
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['编辑中', '待发布', '已发布']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '编辑中',
          type: 'line',
          color: '#e6a23c',
          data: [120, 132, 101, 134, 90, 230, 210]
        },
        {
          name: '待发布',
          type: 'line',
          color: '#67c23a',
          data: [220, 182, 191, 234, 290, 330, 310]
        },
        {
          name: '已发布',
          type: 'line',
          color: '#409eff',
          data: [150, 232, 201, 154, 190, 330, 410]
        }
      ]
    });
  }
}
</script>

<style scoped>
.box-card-header {
  margin-top: -20px;
  line-height: 46px;
  height: 24px;
}
</style>
