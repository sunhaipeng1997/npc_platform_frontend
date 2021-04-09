<template>
    <el-row >
        <el-col :span="24" style="margin-top: 25px">

                    <div style="padding-left: 10px;padding-top: 0;padding-right: 25px;border: 0;border-radius: 10px;">


                                <el-card class="list-content" shadow="hover">
                                    <template v-if="$route.meta.check">
                                        <!--搜索查询表单-->
                                        <div class="searchBar">
                                            <el-form ref="form" :model="searchNotificationForm" tab-position="left">
                                                <!--type="flex"  justify="space-between"-->
                                                <el-row :gutter="20" >
                                                    <el-col :span="8">
                                                        <el-form-item label="通知标题" label-width="70px" size="mini" >
                                                            <el-input placeholder="输入标题"  v-model="searchNotificationForm.title" ></el-input>
                                                        </el-form-item>
                                                    </el-col>

                                                    <el-col :span="5" >
                                                        <el-form-item label="签署部门" label-width="70px" size="mini" >
                                                            <el-input placeholder="输入部门"  v-model="searchNotificationForm.department" ></el-input>
                                                        </el-form-item>
                                                    </el-col>


                                                    <el-col :span="6" >
                                                        <el-form-item label="状态" label-width="40px" size="mini" >
                                                            <el-select v-model="searchNotificationForm.status" placeholder="选择状态" >
                                                                <el-option
                                                                        v-for="(item,index) in notificationStatusOptions"
                                                                        :key="index"
                                                                        :label="item.name"
                                                                        :value="item.value">
                                                                </el-option>
                                                            </el-select>
                                                        </el-form-item>
                                                    </el-col>

                                                    <el-col :span="5" style="text-align: right">
                                                        <el-button size="mini" @click="searchNotification()">搜索</el-button>
                                                        <el-button type="primary" size="mini" @click="goAddNotificationPage">添加</el-button>
                                                    </el-col>
                                                </el-row>
                                            </el-form>
                                        </div>

                                        <el-table v-loading="notificationTableLoading" border size="mini" :header-row-style="{ 'font-size':'15px'}" :data="notificationTableData" style="width: 100%" class="table-content">
                                            <el-table-column label="序号" fixed type="index"  align="center"  width="60"/>

                                            <el-table-column v-for="(item,index) in notificationTableHeader" :key="index" :prop="index" sortable
                                                             :label="item" align="center"/>

                                            <el-table-column label="操作" fixed="right"  width="230" align="center" class-name="operation">
                                                <template slot-scope="scope">
                                                    <a v-if="$route.meta.edit && (scope.row.status === 1 || scope.row.status === 3)" class="item" @click="toReview(scope.row)">提交审核</a>
                                                    <a v-if="$route.meta.edit && scope.row.status === 4" class="item" @click="publish(scope.row)">发布</a>
                                                    <a v-if="$route.meta.edit && scope.row.status !== 2" class="item" @click="goUpdateNotification(scope.row)">修改</a>
                                                    <a v-if="$route.meta.edit" class="item" @click="goNotificationDetailsPage(scope.row)">查看</a>
                                                    <a v-if="$route.meta.delete && scope.row.status !== 2" class="item-danger" @click="deleteNotification(scope.row)">删除</a>
                                                </template>
                                            </el-table-column>
                                        </el-table>


                                        <el-pagination v-if="$route.meta.check" :total="totalNotification" :pager-count="5" :page-sizes="[10, 20, 30, 50]"
                                                       :page-size="notificationListPageSize" :current-page="notificationListCurrentPage" background layout="total, sizes, prev, pager, next, jumper"
                                                       class="pagination"
                                                       @size-change="handleNotificationListPageSizeChange"
                                                       @current-change="handleNotificationListCurrentPage"
                                        />

                                    </template>

                                    <div v-else class="no-data">
                                        <i class="fa fa-danger"></i>
                                        您暂时没有查看的权限！！！
                                    </div>
                                </el-card>

                    </div>
        </el-col>

    </el-row>

</template>

<script>
    export default {
        name:'notification',
        data() {
            return {
                serverUrl:this.API.ServerUrl,

                //-------关于代表通知的变量 begin------------------
                currentDate: new Date(2020,1,10),
                activeNotificationTabName:"allNotification",

                searchNotificationForm:{
                    title:'',
                    department:'',
                    publishAt:'',
                    status:'',
                    statusName:'',
                },

                notificationTableLoading: false,
                notificationTableHeader: {
                    title: '标题',
                    department: '签署单位',
                    publishAt:'发布时间',
                    statusName:'状态',
                },
                notificationTableData: [],
                notificationStatusOptions:[
                    {name:'全部',value:null},
                    {name:'草稿',value:1},
                    {name:'审核中',value:2},
                    {name:'未通过',value:3},
                    {name:'待发布',value:4},
                    {name:'已发布',value:5}
                ],

                notificationListPageSize:10,
                notificationListCurrentPage:1,
                totalNotification:0,
                //-------关于代表通知的变量 end--------------------

            }
        },
        created(){
            this.queryNotification();
        },

        mounted() {

        },

        methods: {

            /*
            * 处理通知列表的页面大小和当前页变化
            * 并查询
            */
            handleNotificationListCurrentPage(val) {
                this.notificationListCurrentPage = val;
                this.queryNotification();
            },
            handleNotificationListPageSizeChange(val) {
                this.notificationListPageSize = val;
                this.queryNotification();
            },


            searchNotification(event){
                let that = this;
                if(event){
                    this.currentPage = 1;
                }
                // 将搜索表单作为条件去查询
                that.queryNotification();

            },

            /*
            * 将搜索表单作为条件去查询通知
            */
            queryNotification(){
                let queryConditions = {};
                queryConditions = this.searchNotificationForm;
                queryConditions.page =this.notificationListCurrentPage;
                queryConditions.pageSize = this.notificationListPageSize;
                this.getNotificationList(queryConditions);
            },


            /*
            * 根据条件获取通知列表
            */
            getNotificationList(queryConditions){
                let that = this;

                // 按照发布时间降序
                queryConditions.property ='publishAt';
                queryConditions.direction = 'des';

                queryConditions.isBillboard = false;
                queryConditions.type = 3;//常规通知

                return new Promise((resolve, reject)=>{
                    this.$request.httpRequest({
                        method: 'get',
                        url: "/manager/notification",
                        noLoading: true,
                        params: queryConditions,
                        success: data => {
                            that.notificationTableData = data.content;
                            that.totalNotification = data.totalElements;
                            resolve(data.content);
                        },
                        error: e => {
                            reject(e);
                        }
                    })
                });
            },

            /*
            * 跳转到通知编辑页面
            */
            goAddNotificationPage(){
                console.log("转向通知编辑页面");
                this.$router.push({
                    path:'/member_house/editNotification',
                    query:{
                        operation:'add'
                    }
                });
            },


            /*
            * 删除通知
            */
            deleteNotification(notification){
                this.$confirm('确认删除该通知吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$request.httpRequest({
                        method: 'delete',
                        url: "/manager/notification/"+notification.uid,
                        noLoading: true,
                        params: { },
                        success: data => {
                            this.queryNotification();
                            this.$message({
                                type: 'success',
                                message: data.message
                            });

                        },
                        error: e => {
                            this.queryNotification();
                            this.$message({
                                type: 'warning',
                                message: e.message
                            });
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },

            /*
            * 修改通知
            */
            goUpdateNotification(notification){
                this.$router.push({
                    path:'/member_house/editNotification',
                    query:{
                        operation:'update',
                        uid:notification.uid
                    }
                });
            },

            /*
            * 查看通知详情
            */
            goNotificationDetailsPage(notification){
                this.$router.push({
                    path:'/member_house/editNotification',
                    query:{
                        operation:'read',
                        uid:notification.uid
                    }
                });
            },

            /*
            * 提交审核
            */
            toReview(notification){
                this.$confirm('确认提交该通知吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$request.httpRequest({
                        method: 'post',
                        url: "/manager/notification/to_review/"+notification.uid,
                        noLoading: true,
                        params: { },
                        success: data => {
                            this.queryNotification();
                            this.$message({
                                type: 'success',
                                message: data.message
                            });

                        },
                        error: e => {
                            this.$message({
                                type: 'warning',
                                message: e.message
                            });
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消提交审核'
                    });
                });
            },
            //======通知代表通知相关的方法 end=============================================================================

            /*
            * 发布通知
            */
            publish(notification){
                this.$confirm('确认发布该通知吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$request.httpRequest({
                        method: 'post',
                        url: "/manager/notification/publish/"+notification.uid,
                        noLoading: true,
                        params: {},
                        success: data => {
                            this.queryNotification();
                            this.$message({
                                type: 'success',
                                message: data.message
                            });

                        },
                        error: e => {
                            this.$message({
                                type: 'warning',
                                message: e.message
                            });
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消发布'
                    });
                });
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '~@/styles/table/table';

    /*关于浮动公告*/

    .table-demo {
        padding-top: 0;
        padding-left: 10px;
        padding-right: 25px;
    }

    .searchBar {
        /*margin: 10px 5px;*/
        margin-top: 10px;
    }

    .el-row {
        margin-bottom: 20px;
        &:last-child {
            margin-bottom: 0;
        }
    }

    .demo-input-suffix {
        width: 50%;
    }
    /*关于浮动公告 end*/

    /*关于代表通知*/
    .time {
        font-size: 13px;
        color: #999;
    }

    .bottom {
        margin-top: 13px;
        line-height: 12px;
    }

    .button {
        padding: 0;
        float: right;
    }

    .image {
        width: 100%;
        display: block;
    }

    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }

    .clearfix:after {
        clear: both
    }

    .cover-icon {
        font-size: 28px;
        color: #8c939d;
        width: 100%;
        height: 56px;
        line-height: 56px;
        text-align: center;
        border-top: 1px dashed #d9d9d9;
    }

    .small-cover-icon {
        font-size: 44px;
        color: #8c939d;
        width: 100%;
        height: 100%;
        line-height: 100%;
        text-align: center;
    }

    /*关于代表通知 end*/
</style>