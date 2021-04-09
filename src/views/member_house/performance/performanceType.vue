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
                                            <el-input placeholder="请输类型名称" size="mini"
                                                      v-model="searchForm.name"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-form-item label="状态" size="mini">
                                            <el-select v-model="searchForm.status" placeholder="请选择状态">
                                                <el-option label="全部" value=""></el-option>
                                                <el-option label="启用" value="1"></el-option>
                                                <el-option label="未启用" value="2"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-col>
                            <el-col :span="6">
                                <el-button type="primary" size="mini" @click="getData(0,$event)">搜索</el-button>
                                <el-button type="primary" size="mini" @click="addType">添加</el-button>
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
                            <a v-if="$route.meta.edit && scope.row.isDefault" class="item-gray">修改</a>
                            <a v-if="$route.meta.edit && !scope.row.isDefault" class="item" @click="updateType(scope.row)">修改</a>
                            <a v-if="$route.meta.edit && scope.$index == 0" class="item-gray">上移</a>
                            <a v-if="$route.meta.edit && scope.$index != 0" class="item"
                               @click="changeSequence(scope.row,1)">上移</a>
                            <a v-if="$route.meta.edit && scope.$index+1 == tableData.length" class="item-gray">下移</a>
                            <a v-if="$route.meta.edit && scope.$index+1 != tableData.length" class="item"
                               @click="changeSequence(scope.row,2)">下移</a>
                            <a v-if="$route.meta.edit && scope.row.status == 2" class="item-warning" @click="changeStatus(scope.row,1)">启用</a>
                            <a v-if="$route.meta.edit && scope.row.status == 1" class="item-success" @click="changeStatus(scope.row,2)">停用</a>
                            <a v-if="$route.meta.delete && scope.row.isDefault" class="item-gray">删除</a>
                            <a v-if="$route.meta.delete  && !scope.row.isDefault" class="item-danger" @click="deleteType(scope.row)">删除</a>
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
                    <el-form :model="form" :rules="rules" ref="form" >
                        <el-form-item label="类型名称" :label-width="formLabelWidth" prop="name">
                            <el-col :span="12">
                                <el-input v-model="form.name" autocomplete="off"></el-input>
                            </el-col>
                        </el-form-item>
                        <el-form-item label="类型说明" :label-width="formLabelWidth">
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
                    name: '类型名称',
                    statusName: '状态',
                    sequence: '排序',
                    remark: '备注',
                },
                tableData: [],

                searchForm: {
                    name: "",
                    status: ""
                },
                pageSize: 20,
                currentPage: 1,
                total: 0,

                addFormVisible: false,
                formLabelWidth: '100px',
                form: {
                    title: '',
                    uid: '',
                    name: '',
                    remark: ''
                },
                rules: {
                    name: [
                        {required: true, message: '类型名称不能为空', trigger: 'blur'}
                    ],
                    remark: [
                        { max: 200, message: '长度在 200 个字符以内', trigger: 'blur' }
                    ]
                }
            }
        },
        mounted() {
            this.getData(0)
        },
        methods: {
            handleClose() {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        this.resetForm('form');
                        this.form.uid= '';
                        this.form.title= '';
                        this.form.name= '';
                        this.form.remark= '';
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
                        url: "/member_house/performance/performanceType",
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
                this.form.title = '添加类型';
                this.showForm();
            },

            updateType(item) {
                this.form.title = '修改类型';
                this.form.uid = item.uid;
                this.form.name = item.name;
                this.form.remark = item.remark;
                this.showForm();
            },

            confirmAddOrUpdate(formName) {
                let that = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        that.$request.httpRequest({
                            method: 'post',
                            url: "/member_house/performance/addOrUpdatePerformanceType",
                            noLoading: true,
                            params: {
                                uid: that.form.uid,
                                name: that.form.name,
                                remark: that.form.remark
                            },
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
                                    message: (this.form.uid?'修改失败! ':'添加失败! ')+e.message
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

            changeStatus(row, status) {
                this.$request.httpRequest({
                    method: 'post',
                    url: "/member_house/performance/changeTypeStatus",
                    noLoading: true,
                    params: {
                        uid: row.uid,
                        status: status
                    },
                    success: data => {
                        this.$message({
                            type: 'success',
                            message: status==1?'启用成功!':'停用成功'
                        });
                        this.getData();
                    },
                    error: e => {
                        this.$message({
                            type: 'warning',
                            message: status==1?'启用失败!':'停用失败'
                        });
                        this.getData();
                    }
                })
            },

            changeSequence(row, type) {
                this.$request.httpRequest({
                    method: 'post',
                    url: "/member_house/performance/changeTypeSequence",
                    noLoading: true,
                    params: {
                        uid: row.uid,
                        type: type
                    },
                    success: data => {
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

            deleteType(row) {
                this.$confirm('确认删除该类型吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$request.httpRequest({
                        method: 'delete',
                        url: "/member_house/performance/deletePerformanceType",
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

            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.form.remark = '';
                this.form.title = '';
                this.form.uid = '';
                this.form.name = '';
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
