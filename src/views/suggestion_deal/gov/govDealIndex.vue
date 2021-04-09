<template>
  <div class="cardZone">
    <el-row :gutter="20">
      <el-col :span="8"
              v-for="(item,index) in overview"
              style="margin-bottom: 20px;">
        <el-card shadow>
          <el-row>
            <el-col :span="8"
                    class="overviewZone"><p class="overview-label">{{item.name}}</p></el-col>
            <el-col :span="16"
                    class="overviewZone"><p class="overview-content"><span>{{item.count}}</span>条</p></el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12"
              style="margin-bottom: 20px;">
        <el-card shadow>
          <div class="chart"
               id="getSugCount"
               ref="getSugCount"></div>
        </el-card>
      </el-col>
      <el-col :span="12"
              style="margin-bottom: 20px;">
        <el-card shadow>
          <div class="chart"
               id="sugBusinessLine"
               ref="sugBusinessLine"></div>
        </el-card>
      </el-col>
      <el-col :span="12"
              style="margin-bottom: 20px;">
        <el-card shadow>
          <div class="chart"
               id="sugUnitDealingLine"
               ref="sugUnitDealingLine"></div>
        </el-card>
      </el-col>
      <el-col :span="12"
              style="margin-bottom: 20px;">
        <el-card shadow>
          <div class="chart"
               id="sugUnitCompletedLine"
               ref="sugUnitCompletedLine"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import echarts from 'echarts';

  export default {
    name: "index",
    data() {
      return {
        overview: [
          {
            name: '本月新增建议',
            count: 2323,
          },
          {
            name: '本月办结数量',
            count: 432,
          },
          {
            name: '办理中的数量',
            count: 23213,
          }],
        suggestion: {
          title: {
            text: "代表建议统计"
          },
          itemStyle: {
            color: "#D84315"
          },
          tooltip: {},
          xAxis: {
            data: [
              "一月",
              "二月",
              "三月",
              "四月",
              "五月",
              "六月",
              "七月",
              "八月",
              "九月",
              "十月",
              "十一月",
              "十二月"]

          },
          yAxis: {},
          series: [
            {
              name: "数量",
              type: "line",
              data: [
                5,
                20,
                36,
                10,
                10,
                20,
                36,
                10,
                10,
                20,
                36,
                20]
            }]

        },
        performance: {
          title: {
            text: "代表履职统计"
          },
          itemStyle: {
            color: "#304FFE"
          },
          tooltip: {},
          xAxis: {
            data: [
              "一月",
              "二月",
              "三月",
              "四月",
              "五月",
              "六月",
              "七月",
              "八月",
              "九月",
              "十月",
              "十一月",
              "十二月"]
          },
          yAxis: {},
          series: [
            {
              name: "数量",
              type: "line",
              data: [
                5,
                20,
                36,
                10,
                10,
                20,
                36,
                10,
                10,
                20,
                36,
                20]
            }]
        },
        performanceType: {
          title: {
            text: "履职类型统计"
          },
          itemStyle: {
            color: "#2979FF"
          },
          tooltip: {},
          xAxis: {
            data: [
              "人大会议",
              "集中学习",
              "视察调研",
              "代表培训",]
          },
          yAxis: {},
          series: [
            {
              name: "数量",
              type: "bar",
              data: [
                5,
                20,
                36,
                20]
            }]
        },

      };
    },
    methods: {

      // 今日新增
      getSugNumber() {
        setTimeout(() => {
          this.$request.httpRequest({
            method: 'get',
            url: "/suggestion_deal/index/getGovSugNumber",
            noLoading: true,
            success: data => {
              let key = Object.keys(data);
              for (let i = 0; i < key.length; i++) {
                this.overview[i].count = data[key[i]];
              }
            },
            error: e => {
              this.tableLoading = false;
            }
          });
        });
      },

      // 本月意见
      getSugCount() {
        setTimeout(() => {
          this.$request.httpRequest({
            method: 'get',
            url: "/suggestion_deal/index/getGovSugCount",
            noLoading: true,
            success: data => {
              this.loadCharts(data.xaxis, data.yaxis,'getSugCount','line','建议数量');
            },
          });
        });
      },

      // 建议类型
      sugBusinessLine() {
        setTimeout(() => {
          this.$request.httpRequest({
            method: 'get',
            url: "/suggestion_deal/index/sugGovBusinessLine",
            noLoading: true,
            success: data => {
              this.loadCharts(data.xaxis, data.yaxis,'sugBusinessLine','bar','建议类型统计');
            },
          });
        });

      },

      // 单位办理中
      sugUnitDealingLine() {
        setTimeout(() => {
          this.$request.httpRequest({
            method: 'get',
            url: "/suggestion_deal/index/sugGovUnitDealingLine",
            noLoading: true,
            success: data => {
              this.loadCharts(data.xaxis, data.yaxis,'sugUnitDealingLine','bar','办理中的建议');
            },
          });
        });
      },

      // 单位办结
      sugUnitCompletedLine() {
        setTimeout(() => {
          this.$request.httpRequest({
            method: 'get',
            url: "/suggestion_deal/index/sugGovUnitCompletedLine",
            noLoading: true,
            success: data => {
              this.loadCharts(data.xaxis, data.yaxis,'sugUnitCompletedLine','bar','办结的建议');
            },
          });
        });

      },

      // 请求图表数据
      getCharts() {
        this.getSugNumber();
        this.getSugCount();
        this.sugBusinessLine();
        this.sugUnitDealingLine();
        this.sugUnitCompletedLine();
      },

      // 装载图表数据
      loadCharts(xArr, yArr, id, type,text) {
        let chartOpinion = echarts.init(document.getElementById(id));
        chartOpinion.setOption({
          title: {
            text: text
          },
          itemStyle: {
            color: "#0288D1"
          },
          tooltip: {},
          xAxis: {
            data: xArr,
          },
          yAxis: {},
          series: [
            {
              name: "数量",
              type: type,
              data: yArr
            }]

        });
      }
    },
    mounted() {
      this.getCharts();
    }
  };
</script>

<style scoped>
  .overviewZone {
    height : 40px;
  }

  .overview-label {
    font-size   : 24px;
    line-height : 40px;
    margin      : 0;
  }

  .overview-content {
    text-align  : center;
    font-size   : 20px;
    line-height : 40px;
    margin      : 0;
  }

  .overview-content > span {
    color     : #1482f0;
    font-size : 36px;
  }

  .cardZone {
    padding : 25px;
  }

  .chart {
    width  : 100%;
    height : 300px;
  }
</style>
