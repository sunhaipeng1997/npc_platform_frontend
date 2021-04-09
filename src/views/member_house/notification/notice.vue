<template>
    <div style="padding-left: 10px;padding-top: 0;padding-right: 25px">
        <el-card class="list-content" shadow="hover">
            <template v-if="$route.meta.check">

                <div class="searchBar">
                    <el-form ref="form" :model="searchForm" label-width="70px">
                        <el-row>
                            <el-col :span="18">
                                <el-form-item label="公告标题" size="mini" style="width: 250px">
                                    <el-input placeholder="搜索公告"  v-model="searchForm.name" >
                                        <el-button slot="append" icon="el-icon-search" @click="getData"></el-button>
                                    </el-input>
                                </el-form-item>
                            </el-col>

                            <el-col :span="6" style="text-align: right">
                                <el-button size="mini" @click="getData">搜索</el-button>
                                <el-button type="primary" size="mini" @click="addData">添加</el-button>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>

                <el-table v-loading="tableLoading" border size="mini" :header-row-style="{ 'font-size':'15px'}" :data="tableData" style="width: 100%" class="table-content">
                    <el-table-column type="index" label="顺序" align="center" sortable width="60"/>
                    <el-table-column v-for="(item,index) in tableHeader" show-overflow-tooltip  :key="index" :prop="index" sortable :label="item" align="center"/>

                    <el-table-column label="操作" width="230" align="center" class-name="operation">
                        <template slot-scope="scope">
                            <a v-if="$route.meta.edit" class="item" @click="updateData(scope.row)">修改</a>
                            <a v-if="$route.meta.delete" class="item" @click="deleteData(scope.row)">删除</a>

                            <a v-if="$route.meta.edit && scope.row.status == 1" class="item" @click="changeStatus(scope.row,2)">停用</a>
                            <a v-if="$route.meta.edit && scope.row.status == 2" class="item" @click="changeStatus(scope.row,1)">启用</a>


                        </template>
                    </el-table-column>
                </el-table>

                <!--添加/修改公告弹框-->
                <el-dialog :title="form.dialogTitle" :visible.sync="addFormVisible" width="30%" :before-close="handleClose">
                    <el-form :model="form" :rules="rules" ref="form" label-position="top" size="mini">
                        <el-form-item label="类型/标题" required>
                            <el-col :span="24" >
                                <el-input placeholder="请输入公告标题" v-model="form.name" class="input-with-select">
                                    <el-select v-model="form.type" slot="prepend" placeholder="公告类型" style="width: 110px">
                                        <el-option v-for="(item,index) in noticeTypeList" :label="item.name" :value="item.type"></el-option>
                                    </el-select>
                                </el-input>
                            </el-col>
                        </el-form-item>


                        <el-form-item label="简要内容" required>
                            <el-input v-model="form.content" autocomplete="off" type="textarea" ></el-input>
                        </el-form-item>
                    </el-form>

                    <div slot="footer" class="dialog-footer">
                        <el-button @click="resetForm('form')" size="mini">取 消</el-button>
                        <el-button @click="confirmAddOrUpdate('form')" type="primary" size="mini">确 定</el-button>
                    </div>
                </el-dialog>

                <el-pagination v-if="$route.meta.check" :total="total" :pager-count="5" :page-sizes="[10, 20, 30, 50]"
                               :page-size="pageSize" :current-page="currentPage" background layout="total, sizes, prev, pager, next, jumper"
                               class="pagination"
                               @size-change="handleSizeChange"
                               @current-change="handleCurrentChange"
                />

            </template>

            <div v-else class="no-data">
                <i class="fa fa-danger"></i>
                您暂时没有查看的权限！！！
            </div>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: "notice",
        data(){
            return {
                //-------关于公告提示的变量------------------
                searchForm: {
                    name: "",
                    status: ""
                },
                tableLoading: false,
                tableHeader: {
                    name: '通知标题',
                    statusName: '状态',
                    publishAt:'发布时间'
                },
                tableData: [],

                addFormVisible: false,
                form: {
                    dialogTitle: '',
                    uid: '',
                    title: '',
                    type:'',
                    content: ''
                },
                noticeTypeList:[
                    {name:'浮动公告',type:1},
                    {name:'更新提示',type:2}
                ],
                rules: {
                    name: [
                        {required: false, message: '公告标题不能为空', trigger: 'blur'}
                    ],
                    content: [
                        {required: true, max: 200, message: '长度在 200 个字符以内', trigger: 'blur' }
                    ]
                },

                pageSize: 10,
                currentPage: 1,
                total: 0,

                //-------关于浮动公告的变量 end--------------------
            }
        },
        created(){

        },
        mounted() {

        },
        method:{
            /*
            * 第一级tab标签栏的点击事件触发
            * 也就是左侧做外层的纵向标签：公告提示、代表通知、审核进度
            */
            handleLevelOneTabClick(tab, event){
                console.log(tab, event);
                this.notificationTableData = {};
                let queryConditions = {};

                if(tab.name === 'notificationTypeSetting'){
                    this.getData();
                }

                if(tab.name === 'articleManagement'){
                    queryConditions = {};
                    switch (this.activeNotificationTabName) {
                        case "rotatingNotification":
                            queryConditions.whereShow = 2;
                            this.getNotificationList(queryConditions);
                            break
                        case "topNotification":
                            queryConditions.whereShow = 1;
                            this.getNotificationList(queryConditions);
                            break
                        case "allNotification":
                            // 将搜索表单作为条件去查询通知
                            this.queryNotification();
                            break
                    }
                }

                if(tab.name === 'queryProgress'){
                    queryConditions = {};
                    switch (this.activeQueryProgressTabName) {
                        case "underReview":
                            queryConditions.status = 2;
                            break
                        case "notApproved":
                            queryConditions.status = 3;
                            break
                        case "releasable":
                            queryConditions.status = 4;
                            queryConditions.published = false;
                            break
                    }
                    this.getNotificationList(queryConditions);
                }

            },

            handleCurrentChange(val) {
                this.currentPage = val;
                this.getData()
            },
            handleSizeChange(val) {
                this.pageSize = val;
                this.getData()
            },

            //显示弹窗表单
            showForm() {
                this.addFormVisible = true;
            },

            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.form.content = '';
                this.addFormVisible = false
            },

            /*
            * 触发弹窗-增加通知公告
            */
            addData() {
                this.form.dialogTitle = '添加公告';
                this.form.uid = null;//为空时表示增加通知公告，uid由后端生成
                this.form.isBillboard = true;
                this.showForm();
            },

            /*
            * 触发弹窗-修改通知公告
            */
            updateData(item) {
                this.form.dialogTitle = '修改公告';
                this.form.uid = item.uid;
                this.form.title = item.title;
                this.form.content = item.content;
                this.showForm();
            },

            /*
            * 确认添加/修改公告
            */
            confirmAddOrUpdate(formName) {
                let that = this;
                let httpMethod = 'post';
                let params = {
                    name: that.form.name,
                    content: that.form.content,
                    isBillboard:that.form.isBillboard
                };
                if(that.form.uid){//表示更新
                    httpMethod = 'put';
                    params.uid = that.form.uid;
                }

                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        that.$request.httpRequest({
                            method: httpMethod,
                            url: "/manager/notification",
                            noLoading: true,
                            params: params,
                            success: data => {
                                this.$message({
                                    type: 'success',
                                    message: that.form.uid?'修改成功!':'添加成功!'
                                });
                                that.resetForm('form');
                                that.getData();
                            },
                            error: e => {
                                this.$message({
                                    type: 'warning',
                                    message: (that.form.uid?'修改失败! ':'添加失败! ')+e.message
                                });
                            }
                        })
                    } else {
                        return false;
                    }
                });
            },

            /*
            * 删除通知公告
            */
            deleteData(row) {
                this.$confirm('确认删除该公告吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$request.httpRequest({
                        method: 'delete',
                        url: "/manager/notification_type/"+row.uid,
                        noLoading: true,
                        params: { },
                        success: data => {
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            this.getData();
                        },
                        error: e => {
                            this.$message({
                                type: 'warning',
                                message: '删除失败!'
                            });
                            this.getData();
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
            * 获取通知的列表
            */
            getData() {
                this.tableLoading = true;
                setTimeout(() => {
                    this.$request.httpRequest({
                        method: 'get',
                        url: "/manager/notification_type",
                        noLoading: true,
                        params: {
                            name: this.searchForm.name,
                            status: this.searchForm.status,
                            page: this.currentPage,
                            size: this.pageSize,
                            property: 'sequence',
                            direction: 'asc'
                        },
                        success: data => {
                            console.log(data, data)
                            this.tableData = data.content;
                            this.total = data.totalElements;
                            this.tableLoading = false;
                        },
                        error: e => {
                            this.tableLoading = false
                        }
                    })
                })
            },

            /*
            * 改变通知公告的状态：启用 和 未用
            */
            changeStatus(row,status){
                this.$request.httpRequest({
                    method: 'put',
                    url: "/manager/notification_type",
                    noLoading: true,
                    params: {
                        uid:row.uid,
                        name:row.name,
                        content:row.content,
                        status:status
                    },
                    success: data => {
                        console.log(data, data);
                        this.$message({
                            type: 'success',
                            message: status === 1 ? '启用成功!':'停用成功'
                        });
                        this.getData();
                    },
                    error: e => {
                        this.$message({
                            type: 'warning',
                            message: status === 1 ? '启用失败!':'停用失败'
                        });
                        this.getData();
                    }
                })
            },
        }
    }

</script>

<style scoped>

</style>
