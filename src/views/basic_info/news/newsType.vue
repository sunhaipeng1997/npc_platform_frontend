<template>
    <div style="padding: 25px">
        <el-card class="list-content" shadow="hover">
            <template v-if="$route.meta.check">

                <div class="searchBar">
                    <el-form ref="form" :model="searchForm" label-width="70px">
                        <el-row>
                            <el-col :span="18">
                                <el-form-item label="栏目名称" size="mini" style="width: 250px">
                                    <el-input placeholder="搜索新闻栏目"  v-model="searchForm.name" >
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


                            <a v-if="$route.meta.edit && scope.$index == 0" class="item-gray">上移</a>
                            <a v-if="$route.meta.edit && scope.$index != 0" class="item" @click="changeSequence(scope.row,0)">上移</a>

                            <a v-if="$route.meta.edit && scope.$index+1 == tableData.length" class="item-gray">下移</a>
                            <a v-if="$route.meta.edit && scope.$index+1 != tableData.length" class="item" @click="changeSequence(scope.row,1)">下移</a>
                            <a v-if="$route.meta.edit && scope.row.status == 1" class="item-success" @click="changeStatus(scope.row,2)">停用</a>
                            <a v-if="$route.meta.edit && scope.row.status == 2" class="item-warning" @click="changeStatus(scope.row,1)">启用</a>
                            <a v-if="$route.meta.delete" class="item-danger" @click="deleteData(scope.row)">删除</a>
                        </template>
                    </el-table-column>
                </el-table>

                <!--添加/修改新闻栏目弹框-->
                <el-dialog :title="form.title" :visible.sync="addFormVisible" width="30%" :before-close="handleClose">
                    <el-form :model="form" :rules="rules" ref="form" label-position="top" size="mini">
                        <el-form-item label="栏目名称" prop="name">
                            <el-input v-model="form.name" autocomplete="off" ></el-input>
                        </el-form-item>

                        <el-form-item label="简要描述" >
                            <el-input v-model="form.remark" autocomplete="off" type="textarea" ></el-input>
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
        name: "newsType",
        data() {
            return {
                //-------关于栏目设置的变量------------------
                searchForm: {
                    name: "",
                    status: ""
                },
                tableLoading: false,
                tableHeader: {
                    name: '栏目名称',
                    remark: '简要描述',
                    statusName: '状态'
                },
                tableData: [],

                addFormVisible: false,
                form: {
                    title: '',
                    uid: '',
                    name: '',
                    remark: ''
                },
                rules: {
                    name: [
                        {required: true, message: '栏目名称不能为空', trigger: 'blur'}
                    ],
                    remark: [
                        {max: 200, message: '长度在 200 个字符以内', trigger: 'blur'}
                    ]
                },

                pageSize: 10,
                currentPage: 1,
                total: 0,
            }
        },

        mounted() {
            //加载新闻栏目
            this.getData();
        },

        methods: {
            handleClose() {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        this.resetForm('form');
                        this.form.uid='',
                            this.form.name= '',
                            this.form.startDate= null,
                            this.form.endDate= null,
                            this.form.remark= ''
                    })
                    .catch(_ => {});
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
                this.form.remark = '';
                this.addFormVisible = false
            },

            /*
            * 触发弹窗-增加新闻栏目
            */
            addData() {
                this.form.title = '添加栏目';
                this.form.uid = null;//为空时表示增加新闻栏目，uid由后端生成
                this.showForm();
            },

            /*
            * 触发弹窗-修改新闻栏目
            */
            updateData(item) {
                this.form.title = '修改栏目';
                this.form.uid = item.uid;
                this.form.name = item.name;
                this.form.remark = item.remark;
                this.showForm();
            },

            /*
            * 修改新闻栏目
            */
            confirmAddOrUpdate(formName) {
                let that = this;

                let httpRequestUrl = "/manager/news_type";

                let params = {
                    name: that.form.name,
                    remark: that.form.remark
                };
                if(that.form.uid){//表示更新
                    httpRequestUrl = "/manager/news_type/update";
                    params.uid = that.form.uid;
                }

                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        that.$request.httpRequest({
                            method: 'post',
                            url: httpRequestUrl,
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
            * 删除新闻栏目
            */
            deleteData(row) {
                this.$confirm('确认删除该栏目吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$request.httpRequest({
                        method: 'delete',
                        url: "/manager/news_type/"+row.uid,
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
            * 获取新闻栏目的列表
            */
            getData(event) {
                console.log(event)
                if(event){
                    this.currentPage = 1;
                }
                this.tableLoading = true;
                setTimeout(() => {
                    this.$request.httpRequest({
                        method: 'get',
                        url: "/manager/news_type",
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
                            this.tableData = data.content;

                            let tyList = JSON.parse(JSON.stringify(data.content));
                            if(tyList){
                                tyList.unshift({name:'全部',uid:''});
                            }
                            this.newsTypeOptions = tyList;

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
            * 改变新闻栏目的状态：启用 和 未用
            */
            changeStatus(row,status){
                this.$request.httpRequest({
                    method: 'post',
                    url: "/manager/news_type/update",
                    noLoading: true,
                    params: {
                        uid:row.uid,
                        name:row.name,
                        remark:row.remark,
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

            /*
            * 改变新闻栏目的顺序
            */
            changeSequence(row,direction){
                this.$request.httpRequest({
                    method: 'post',
                    url: "/manager/news_type/change_sequence",
                    noLoading: true,
                    params: {
                        uid:row.uid,
                        direction:direction
                    },
                    success: data => {
                        console.log(data, data);
                        this.$message({
                            type: 'success',
                            message: '修改排序成功!'
                        });
                        this.getData();
                    },
                    error: e => {
                        this.$message({
                            type: 'warning',
                            message: '修改排序失败!'
                        });
                        this.getData();
                    }
                })
            },
        }
    }
</script>

<style lang="scss" scoped>
    @import '~@/styles/table/table'
</style>