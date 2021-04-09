<template>
    <div class="table-demo">
        <el-card class="list-content" shadow="hover">
            <template v-if="$route.meta.check">

                <div class="searchBar">
                    <el-form ref="form" :model="searchForm" label-width="80px">
                        <el-row :gutter="50">
                            <el-col :span="18">
                                <el-row :gutter="20">
                                    <el-col :span="6">
                                        <el-form-item label="名称">
                                            <el-input placeholder="请输届期名称" size="mini"
                                                      v-model="searchForm.name"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-col>
                            <el-col :span="6">
                                <el-button type="primary" size="mini" @click="getData(0,$event)">搜索</el-button>
                                <el-button type="primary" size="mini" @click="addType">添加</el-button>
                                <el-button type="primary" size="mini" @click="clearSession">换届</el-button>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>

                <el-table v-loading="tableLoading" border size="mini" :header-row-style="{ 'font-size':'15px'}"
                          :data="tableData" style="width: 100%" class="table-content">
                    <el-table-column type="index" label="序号" align="center" sortable width="60"/>
                    <el-table-column v-for="(item,index) in tableHeader" show-overflow-tooltip  :key="index" :prop="index" sortable
                                     :label="item" align="center"/>
                    <el-table-column label="操作" width="230" align="center" class-name="operation">
                        <template slot-scope="scope">
                            <a v-if="$route.meta.edit" class="item" @click="updateType(scope.row)">修改</a>
                            <a v-if="$route.meta.delete" class="item-danger" @click="deleteType(scope.row)">删除</a>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                        v-if="$route.meta.check"
                        :total="total"
                        :pager-count="5"
                        :page-sizes="[10, 20, 30, 50]"
                        :page-size="pageSize"
                        :current-page="currentPage"
                        background
                        layout="total, sizes, prev, pager, next, jumper"
                        class="pagination"
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                />

                <!--添加修改弹框-->
                <el-dialog :title="form.title" :visible.sync="addFormVisible" :before-close="handleClose">
                    <el-form :model="form" :rules="rules" ref="form">
                        <el-form-item label="届期名称" :label-width="formLabelWidth" prop="name">
                            <el-col :span="12">
                                <el-input v-model="form.name" size="mini" autocomplete="off"></el-input>
                            </el-col>
                        </el-form-item>
                        <el-row>

                        <el-col :span="24">
                            <el-col :span="7">
                                <el-form-item label="届期日期" :label-width="formLabelWidth" prop="startDate">
                                    <el-col :span="24">
                                        <el-date-picker type="date" value-format="yyyy-MM-dd" size="mini"
                                                        placeholder="选择开始日期"
                                                        v-model="form.startDate"
                                                        style="width: 100%;"/>
                                    </el-col>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">

                            <el-form-item label="至" :label-width="miniLabelWidth" prop="endDate">
                                <el-col :span="24">
                                    <el-date-picker type="date" value-format="yyyy-MM-dd" size="mini"
                                                    placeholder="选择结束日期"
                                                    v-model="form.endDate"
                                                    style="width: 100%;"></el-date-picker>
                                </el-col>
                            </el-form-item>
                            </el-col>
                        </el-col>
                        </el-row>
                        <el-form-item label="届期介绍" :label-width="formLabelWidth">
                            <el-input type="textarea" v-model="form.remark" autocomplete="off"></el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="resetForm('form')">取 消</el-button>
                        <el-button type="primary" @click="confirmAddOrUpdate('form')">确 定</el-button>
                    </div>
                </el-dialog>

            </template>
            <div v-else class="no-data">
                <i class="fa fa-danger"></i>您暂时没有查看的权限！！！
            </div>
        </el-card>
        <!-- 分页 -->
    </div>
</template>
<script>
    export default {
        data() {
            return {
                tableLoading: false,
                tableHeader: {
                    name: '届期名称',
                    startDate: '开始日期',
                    endDate: '结束日期',
                    remark: '届期介绍',
                },
                tableData: [],

                searchForm: {
                    name: "",
                },
                pageSize: 20,
                currentPage: 1,
                total: 0,

                addFormVisible: false,
                miniLabelWidth: '50px',
                formLabelWidth: '100px',
                form: {
                    uid:'',
                    name: '',
                    startDate: null,
                    endDate: null,
                    remark: '',
                },
                rules: {
                    name: [
                        {required: true, message: '类型名称不能为空', trigger: 'blur'}
                    ],
                    startDate: [
                        {required: true, message: '届期开始日期不能为空', trigger: 'blur'}
                    ],
                    endDate: [
                        {required: true, message: '届期结束日期不能为空', trigger: 'blur'}
                    ],
                    remark: [
                        {max: 200, message: '长度在 200 个字符以内', trigger: 'blur'}
                    ]
                }
            }
        },
        mounted() {
            this.getData(0);
        },
        methods: {
            handleClose() {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        this.resetForm('form');
                    })
                    .catch(_ => {});
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getData(0)
            },
            handleSizeChange(val) {
                this.pageSize = val;
                this.getData(0)
            },
            getData(times,event) {
                if(event){
                    this.currentPage = 1;
                }
                // this.tableLoading = true;
                setTimeout(() => {
                    this.$request.httpRequest({
                        method: 'get',
                        url: "/manager/session/sessionPage",
                        noLoading: true,
                        params: {
                            name: this.searchForm.name,
                            page: this.currentPage,
                            size: this.pageSize,
                            property: 'createTime',
                            direction: 'desc'
                        },
                        success: data => {
                            this.tableData = data.content;
                            this.total = data.totalElements;
                            this.tableLoading = false;
                            if (times == 0) {
                                this.$message({
                                    type: 'success',
                                    message: '查询成功!'
                                });
                            }
                        },
                        error: e => {
                            this.tableLoading = false;

                        }
                    })
                })
            },

            addType() {
                this.form.title = '添加届期';
                this.showForm();
            },

            updateType(item) {
                this.form.title = '修改届期';
                this.form.uid = item.uid;
                this.form.name = item.name;
                this.form.startDate = item.startDate;
                this.form.endDate = item.endDate;
                this.form.remark = item.remark;
                this.showForm();
            },

            confirmAddOrUpdate(formName) {
                let that = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        that.$request.httpRequest({
                            method: 'post',
                            url: "/manager/session/addOrUpdateSession",
                            noLoading: true,
                            params: {
                                uid: that.form.uid,
                                name: that.form.name,
                                startDate: that.form.startDate,
                                endDate: that.form.endDate,
                                remark: that.form.remark
                            },
                            success: data => {
                                this.$message({
                                    type: 'success',
                                    message: that.form.uid ? '修改成功!' : '添加成功!'
                                });
                                that.resetForm('form');
                                that.getData();
                            },
                            error: e => {
                                this.$message({
                                    type: 'warning',
                                    message: (this.form.uid ? '修改失败! ' : '添加失败! ') + e.message
                                });
                            }
                        })
                    } else {
                        return false;
                    }
                });
            },

            showForm() {
                this.addFormVisible = true;

            },

            deleteType(row) {
                this.$confirm('确认删除该届期吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$request.httpRequest({
                        method: 'delete',
                        url: "/manager/session/deleteSessions",
                        noLoading: true,
                        params: {
                            uid: row.uid
                        },
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

            clearSession() {
                this.$confirm('确认要换届吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$request.httpRequest({
                        method: 'post',
                        url: "/manager/session/clearSessions",
                        noLoading: true,
                        success: data => {
                            this.$message({
                                type: 'success',
                                message: '换届成功，往届代表权限已清除!'
                            });
                            this.getData();
                        },
                        error: e => {
                            this.$message({
                                type: 'warning',
                                message: '换届失败!'
                            });
                            this.getData();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消换届'
                    });
                });
            },

            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.form.uid = '';
                this.form.uid='';
                this.form.name= '';
                this.form.startDate= null;
                this.form.endDate= null;
                this.form.remark = '';
                this.addFormVisible = false
            }
        }
    }
</script>
<style lang="scss" scoped>
    @import '~@/styles/table/table';

    .table-demo {
        padding: 25px;
    }

    .searchBar {
        margin: 10px 5px;
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
</style>
