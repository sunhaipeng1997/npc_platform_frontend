<template>
    <div class="cardZone">
        <el-row :gutter="20">
            <el-col :span="8"
                    v-for="(item) in overview"
                    style="margin-bottom: 20px;">
                <el-card shadow>
                    <el-row>
                        <el-col :span="8"
                                class="overviewZone"><p class="overview-label">{{item.name}}</p></el-col>
                        <el-col :span="16"
                                class="overviewZone"><p class="overview-content"><span>{{item.count}}</span>条</p>
                        </el-col>
                    </el-row>
                </el-card>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="12"
                    style="margin-bottom: 20px;">
                <el-card shadow>
                    <div class="chart"
                         id="adminNewSugNum"
                         ref="adminNewSugNum"></div>
                </el-card>
            </el-col>
            <el-col :span="12"
                    style="margin-bottom: 20px;">
                <el-card shadow>
                    <div class="chart"
                         id="adminSugBusinessLine"
                         ref="adminSugBusinessLine"></div>
                </el-card>
            </el-col>
            <el-col :span="12"
                    style="margin-bottom: 20px;">
                <el-card shadow>
                    <div class="chart"
                         id="adminSugNumGroupBySubordinate_1"
                         ref="adminSugNumGroupBySubordinate_1"></div>
                </el-card>
            </el-col>
            <el-col :span="12"
                    style="margin-bottom: 20px;">
                <el-card shadow>
                    <div class="chart"
                         id="adminSugNumGroupBySubordinate_2"
                         ref="adminSugNumGroupBySubordinate_2"></div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
  import echarts from 'echarts'

  export default {
    name: 'index',
    data() {
      return {
        overview: [
          {
            name: '本月新增建议',
            count: 2323
          }
        ],
        suggestion: {
          title: {
            text: '代表建议统计'
          },
          itemStyle: {
            color: '#D84315'
          },
          tooltip: {},
          xAxis: {
            data: [
              '一月',
              '二月',
              '三月',
              '四月',
              '五月',
              '六月',
              '七月',
              '八月',
              '九月',
              '十月',
              '十一月',
              '十二月']

          },
          yAxis: {},
          series: [
            {
              name: '数量',
              type: 'line',
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
            text: '代表履职统计'
          },
          itemStyle: {
            color: '#304FFE'
          },
          tooltip: {},
          xAxis: {
            data: [
              '一月',
              '二月',
              '三月',
              '四月',
              '五月',
              '六月',
              '七月',
              '八月',
              '九月',
              '十月',
              '十一月',
              '十二月']
          },
          yAxis: {},
          series: [
            {
              name: '数量',
              type: 'line',
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
            text: '履职类型统计'
          },
          itemStyle: {
            color: '#2979FF'
          },
          tooltip: {},
          xAxis: {
            data: [
              '人大会议',
              '集中学习',
              '视察调研',
              '代表培训']
          },
          yAxis: {},
          series: [
            {
              name: '数量',
              type: 'bar',
              data: [
                5,
                20,
                36,
                20]
            }]
        }

      }
    },
    methods: {

      // 本月新增
      adminGetSugNumber() {
        setTimeout(() => {
          this.$request.httpRequest({
            method: 'get',
            url: '/suggestion_deal/index/adminGetSugNumber',
            noLoading: true,
            success: data => {
              let key = Object.keys(data)
              for (let i = 0; i < key.length; i++) {
                this.overview[i].count = data[key[i]]
              }
            },
            error: e => {
              this.tableLoading = false
            }
          })
        })
      },

      // 本年新增审核通过建议数量
      adminNewSugNum() {
        setTimeout(() => {
          this.$request.httpRequest({
            method: 'get',
            url: '/suggestion_deal/index/adminNewSugNum',
            noLoading: true,
            success: data => {
              this.loadChartsInterval1(data.xaxis, data.yaxis, 'adminNewSugNum', 'line', '建议数量')
            }
          })
        })
      },

      // 建议类型
      adminSugBusinessLine() {
        setTimeout(() => {
          this.$request.httpRequest({
            method: 'get',
            url: '/suggestion_deal/index/adminSugBusinessLine',
            noLoading: true,
            success: data => {
              this.loadChartsInterval0(data.xaxis, data.yaxis, 'adminSugBusinessLine', 'bar', '各类型建议数量')
            }
          })
        })

      },

      // 下属镇或组的建议数量
      adminSugNumGroupBySubordinate(type) {
        setTimeout(() => {
          this.$request.httpRequest({
            method: 'get',
            url: '/suggestion_deal/index/adminSugNumGroupBySubordinate',
            params: {
              type: type
            },
            noLoading: true,
            success: data => {
              if (type == 1) {
                this.loadChartsInterval0(data.xaxis, data.yaxis, 'adminSugNumGroupBySubordinate_1', 'bar', data.level)
              } else {
                this.loadChartsInterval0(data.xaxis, data.yaxis, 'adminSugNumGroupBySubordinate_2', 'bar', data.level)
              }
            }
          })
        })
      },

      // 请求图表数据
      getCharts() {
        this.adminGetSugNumber()
        this.adminNewSugNum()
        this.adminSugBusinessLine()
        this.adminSugNumGroupBySubordinate(1)
        this.adminSugNumGroupBySubordinate(2)
      },

      // 装载图表数据
      loadChartsInterval0(xArr, yArr, id, type, text) {
        let chartOpinion = echarts.init(document.getElementById(id))
        chartOpinion.setOption({
          title: {
            text: text
          },
          itemStyle: {
            color: '#0288D1'
          },
          tooltip: {},
          xAxis: {
            data: xArr,
            axisLabel: {
              interval: 0
            }
          },
          yAxis: {},
          series: [
            {
              name: '数量',
              type: type,
              data: yArr
            }]

        })
      },

      // 装载图表数据
      loadChartsInterval1(xArr, yArr, id, type, text) {
        let chartOpinion = echarts.init(document.getElementById(id))
        chartOpinion.setOption({
          title: {
            text: text
          },
          itemStyle: {
            color: '#0288D1'
          },
          tooltip: {},
          xAxis: {
            data: xArr,
          },
          yAxis: {},
          series: [
            {
              name: '数量',
              type: type,
              data: yArr
            }]

        })
      }
    },
    mounted() {
      this.getCharts()
    }
  }
</script>

<style scoped>
    .overviewZone {
        height: 40px;
    }

    .overview-label {
        font-size: 24px;
        line-height: 40px;
        margin: 0;
    }

    .overview-content {
        text-align: center;
        font-size: 20px;
        line-height: 40px;
        margin: 0;
    }

    .overview-content > span {
        color: #1482f0;
        font-size: 36px;
    }

    .cardZone {
        padding: 25px;
    }

    .chart {
        width: 100%;
        height: 300px;
    }
</style>
