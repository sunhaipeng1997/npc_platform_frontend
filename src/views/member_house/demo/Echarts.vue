<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i>代表履职统计</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div id="myChart" ref="echart":style="{width: '100%', height: '600px'}"></div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="back">确 定</el-button>
            </span>

        </div>





    </div>
</template>

<script>

    import qs from 'qs'
    export default {
        name: 'basetable',
        data() {
            return {

                msg: "",
                charts: '',
                opinion: {},
                opinionData: [10, 52, 200, 334, 390, 330, 220,220],


            }
        },

        created:function(){
            this.uid = this.$route.query.uid;
            this.opinion =this.$route.query.analysis
        },
        mounted:function(){
            var arr = [];
            var obj = this.opinion;
            for (let i in obj) {
                arr.push(obj[i]); //属性
            }
            console.log(arr)
            this.opinionData = arr;
            this.drawLine();

        },
        methods: {

            back(){
                this.$router.go(-1);
            },

            drawLine(){
                // 基于准备好的dom，初始化echarts实例
                let myChart = this.$echarts.init(document.getElementById('myChart'));
                // 绘制图表
                myChart.setOption({
                    color: ['#3398DB'],
                    title: { text: this.uid + '代表履职统计' },
                    tooltip: {},
                    xAxis : [
                        {
                            type : 'category',
                            data : ['参加人大会议次数','参加其他会议次数','参加小组活动次数','联系选民次数', '提出建议次数', '持证视察次数', '帮扶工作次数', '为民办实事次数'],
                            axisTick: {
                                alignWithLabel: true
                            }
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value'
                        }
                    ],
                    series : [
                        {
                            name:'代表履职',
                            type:'bar',
                            barWidth: '60%',
                            label: {
                                normal: {
                                    show: true,
                                    position: 'top'
                                }
                            },
                            data:this.opinionData
                        }
                    ]
                });
                setTimeout(function (){
                    window.onresize = function () {
                        myChart.resize();
                    }
                },200)
            }
        },

    }

</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }
    .del-dialog-cnt{
        font-size: 16px;
        text-align: center
    }
</style>
