<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i>代表履职统计</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div id="myChart"  style="width: 100%;height: 300px"></div>
            <div style="width: 100%;height: 35px;"></div>
            <div class="handle-box">
                <el-button type="primary" icon="search" @click="search('ALL')">全部</el-button>
                <el-button type="primary" icon="search" @click="search('MONTH')">本月</el-button>
                <el-button type="primary" icon="search" @click="search('YEAR')">本年</el-button>
                <el-date-picker
                        v-model="starttime"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择开始时间"
                        :picker-options="pickerOptions0"
                        >
                </el-date-picker>
                至
                <el-date-picker
                        v-model="endtime"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择结束时间"
                        :picker-options="pickerOptions1"
                        >
                </el-date-picker>
                <!--<el-date-picker-->
                        <!--v-model="form.time"-->
                        <!--type="datetimerange"-->
                        <!--@change="getTime"-->
                        <!--value-format="yyyy-MM-dd HH:mm"-->
                        <!--range-separator="至"-->
                        <!--start-placeholder="开始日期"-->
                        <!--end-placeholder="结束日期">-->
                <!--</el-date-picker>-->
                <el-input v-model="select_word" placeholder="代表名称" class="handle-input mr10"></el-input>
                <el-select v-model="gourp" placeholder="请选择小组">
                    <el-option
                            v-for="item in options"
                            :key="item.uid"
                            :label="item.name"
                            :value="item.uid"
                    >
                    </el-option>
                </el-select>
                <el-button type="primary" icon="search" @click="searchs('')">搜索</el-button>
                <a id="dao">
                    <el-button type="success" icon="search" @click="daochu">
                        导出


                    </el-button>
                </a>

            </div>
            <el-table :data="tableData" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">

                <el-table-column prop="name" label="代表名称" width="140" align="center">
                </el-table-column>
                <el-table-column prop="opsCount" label="收到意见次数" width="140" align="center">
                </el-table-column>
                <el-table-column prop="sugsCount" label="提出建议次数" width="140" align="center">
                </el-table-column>
                <el-table-column prop="npcMeetingCount" label="参加人大会议次数" width="140" align="center">
                </el-table-column>
                <el-table-column prop="otherMeetingCount" label="参加其他会议次数" width="140" align="center">
                </el-table-column>
                <el-table-column prop="motionCount" label="培训学习次数" width="140" align="center">
                </el-table-column>
                <el-table-column prop="inspectCount" label="视察调研次数" width="140" align="center">
                </el-table-column>
                <el-table-column prop="groupActivityCount" label="参加小组活动次数" width="140" align="center">
                </el-table-column>
                <el-table-column prop="contactPeopleCount" label="联系选民次数" width="140" align="center">
                </el-table-column>
                <el-table-column prop="helpWorkCount" label="帮扶工作次数" width="140" align="center">
                </el-table-column>
                <el-table-column prop="solvePeopleProblemCount" label="为民办事次数"   align="center">
                </el-table-column>


                <!--<el-table-column label="操作"  align="center" >-->
                    <!--<template slot-scope="scope">-->
                        <!--<el-button size="small" type="success" @click="handleSee(scope.$index, scope.row)">查看图表</el-button>-->
                    <!--</template>-->
                <!--</el-table-column>-->
            </el-table>
            <div class="pagination">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"  :page-sizes="[10,20,50,100, 200, 300, 400]" layout="total, sizes, prev, pager, next, jumper" :total="totalPages">
                </el-pagination>
            </div>
        </div>



    </div>
</template>

<script>

    import qs from 'qs'
    export default {
        name: 'basetable',
        data() {
            let self =this;
            return {
                tableData: [],
                msg: "",//记录每一条的信息，便于取id
                uid: "",//返回新闻id
                seedata: "",
                charts: '',
                opinion: [],
                options:[],
                starttime:"",
                endtime:"",
                pickerOptions0: {
                    disabledDate(time) {
                        if (self.endtime) {
                            self.endtime = self.endtime.replace(new RegExp(/-/gm) ,"/")
                            return time.getTime() > new Date() || time.getTime() > new Date(self.endtime).getTime();
                        } else {
                            return time.getTime() > new Date();
                        }


                    }
                },
                pickerOptions1: {
                    disabledDate: (time) => {
                        if(self.starttime){
                            self.starttime = self.starttime.replace(new RegExp(/-/gm) ,"/")
                            return time.getTime() < new Date(self.starttime).getTime() || time.getTime() > new Date();
                        }else{
                            return time.getTime() > new Date();
                        }
                    }
                },
                opinionData1: [],
                opinionData2: [],
                totalPages: 0,
                cur_page: 1,
                size:10,
                gourp:'',
                multipleSelection: [],
                select_word: '',
                del_list: [],
                editVisible: false,
                form: {
                    name: '',
                    date: '',
                    time: ''
                },
            }
        },
        created() {
            this.getData(0);
            let token = localStorage.getItem('ms_token');
            this.$axios.get('/manager/npc_member_groups/all',{
                headers: {
                    'Authorization':token,
                }
            }).then(res=>{
                this.options=res.data.data;
                this.options.unshift({name:'全部'})
            });
        },
        mounted:function(){
            this.drawLine();
        },
        computed: {
            data() {
                return this.tableData.filter((d) => {
                    let is_del = false;
                    for (let i = 0; i < this.del_list.length; i++) {
                        if (d.name === this.del_list[i].name) {
                            is_del = true;
                            break;
                        }
                    }
                })
            }
        },

        methods: {
            handleSizeChange(val) {
                this.size=val;
                this.getData();
                console.log(`每页 ${val} 条`);
            },
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getData();
            },
            handleSee(index, row) {

                this.editVisible = true;
                this.msg = row;//每一条数据的记录
                this.uid =this.msg.name;
                this.seedata = this.msg.analysis;
                this.$router.push({path:"/echarts",query:{uid:this.uid,analysis:this.seedata}})
            },

            // 获取 easy-mock 的模拟数据
            getData(note) {
                let token = localStorage.getItem('ms_token');
                let start = this.starttime?this.starttime+" 00:00:00":"";
                let end  = this.endtime?this.endtime+" 23:59:59":"";
                this.$axios.get('/manager/analysis/all', {
                    headers: {
                        'Authorization':token,
                    },
                    params: {
                        page: this.cur_page,
                        size: this.size,
                        startAt:start,
                        endAt:end,
                        searchKey: this.select_word,
                        groupId:this.gourp
                    }

                }).then((res) => {
                    // console.log(res.data.data.content)
                    this.tableData = res.data.data.content;
                    this.cur_page = res.data.data.page;
                    this.totalPages = res.data.data.totalElements;
                    if (note == 1){
                        this.$message.success('查询成功');
                    }

                })
            },
            getTime(val){
                if(val == null){
                    this.starttime="";
                    this.endtime="";
                    return;
                }
                this.form.time=val;
                this.starttime = val[0];
                this.endtime = val[1];
            },
            search(TYPE) {

                var type = TYPE || "";
                if( type != 'ALL'&& type != 'MONTH'&& type != 'YEAR'&& this.starttime ==""&& this.select_word ==""){
                    this.$message.error('请选择查询条件');
                    return;
                }
                console.log(type)
                if(type == 'ALL'|| type == 'MONTH'|| type == 'YEAR'){
                    this.starttime =""
                    this.endtime ="";
                    this.form.time=""
                }


                let token = localStorage.getItem('ms_token');
                this.$axios.get('/manager/analysis/all', {
                    headers: {
                        'Authorization':token,
                    },
                    params:
                        {
                            type:type,
                            searchKey: this.select_word
                        }
                }).then(res => {
                    if (res.data.status == 'OK') {
                        this.tableData = res.data.data.content;
                        this.$message.success('查询成功')
                    }

                })

            },
            searchs(TYPE) {

                var type = TYPE || "";
                if(!this.starttime&&!this.endtime){
                    this.starttime="";
                    this.endtime=""
                }

                this.starttime = this.starttime?this.starttime.replace(new RegExp(/\//gm),"-"):"";
                this.endtime = this.endtime?this.endtime.replace(new RegExp(/\//gm) ,"-"):"";
                this.getData(1);
                // let token = localStorage.getItem('ms_token');
                // this.$axios.get('/manager/analysis/all', {
                //     headers: {
                //         'Authorization':token,
                //     },
                //     params:
                //         {
                //             type:type,
                //             startAt:this.starttime,
                //             endAt:this.endtime,
                //             searchKey: this.select_word,
                //             groupId:this.gourp
                //         }
                // }).then(res => {
                //     if (res.data.status == 'OK') {
                //         this.tableData = res.data.data.content;
                //         this.$message.success('查询成功')
                //     }else{
                //         this.$message.error(res.data.message);
                //     }
                //
                // })

            },
            daochu(){
                if(!this.starttime&&!this.endtime){
                    this.starttime="";
                    this.endtime=""
                }
                let start = this.starttime?this.starttime.replace(new RegExp(/\//gm) ,"-")+" 00:00:00":"";
                let end  = this.endtime?this.endtime.replace(new RegExp(/\//gm) ,"-")+" 23:59:59":"";
                let token = localStorage.getItem('ms_token');
                this.$axios.get('/manager/analysis/export',
                    {
                        headers: {
                            'Authorization':token,
                        },
                        responseType: 'blob',
                        params: {startAt:start,endAt:end,searchKey:this.select_word,groupId:this.gourp}}).then(res=>{
                    if(res){

                        var a=document.getElementById("dao");
                        a.href = res.request.responseURL;
                        // console.log(document.getElementById("dao"))// 修复firefox中无法触发click
                        // console.log(res.request.responseURL);
                        a.click();
                        a.href="javascript:void(0);"
                        // window.location.reload();
                        this.$message.success("导出成功")

                    }

                })
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            drawLine(){
                // 基于准备好的dom，初始化echarts实例
                let myChart = this.$echarts.init(document.getElementById('myChart'));
                // 绘制图表
                let token = localStorage.getItem('ms_token');
                this.$axios.get('/manager/analysis/total',{
                    headers: {
                        'Authorization':token,
                    }
                }).then(res=>{

                    this.opinion = res.data.data.xaxis;
                    this.opinionData1 = res.data.data.yaxis[0].data;
                    this.opinionData2 = res.data.data.yaxis[1].data;
                    myChart.setOption({
                        legend: {
                            show: true,
                            data: ['选民意见总数', '代表建议总数']
                        },
                        grid: {
                            left: '3%',
                            right: '4%',
                            bottom: '3%',
                            containLabel: true
                        },
                        tooltip: {
                            trigger: 'axis',
                        },
                        xAxis: {
                            type: 'category',
                            data: this.opinion
                        },
                        yAxis: {
                            type: 'value',
                            axisLabel: {
                                formatter: '{value} '
                            },
                            axisPointer: {
                                snap: true
                            }
                        },
                        series: [{
                            name: '选民意见总数',
                            data: this.opinionData1,
                            type: 'line',
                            smooth: true,
                            itemStyle: {
                                normal: {
                                    color: '#67c23a',
                                }
                            },
                        },{
                            name: '代表建议总数',
                            data: this.opinionData2,
                            type: 'line',
                            smooth: true,
                            itemStyle: {
                                normal: {
                                    color: '#3398DB',
                                }
                            },
                        }
                        ]
                    });
                    setTimeout(function (){
                        window.onresize = function () {
                            myChart.resize();
                        }
                    },200)
                })

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
