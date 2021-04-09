<template>
    <div class="table-demo">
        <el-card class="list-content" shadow="hover">
            <template v-if="$route.meta.check">

                <div class="searchBar">
                    <el-form ref="form" :model="searchForm" label-width="80px">
                        <el-row :gutter="50">
                            <el-col :span="18">
                                <el-row :gutter="12">
                                    <el-col :span="6">
                                        <el-form-item label="村/社区名">
                                            <el-input placeholder="请输村社区名称" size="mini"
                                                      v-model="searchForm.name"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-form-item label="所属小组">
                                            <el-select v-model="searchForm.group" placeholder="请选择所属小组" size="mini">
                                                <el-option label="全部" value=""></el-option>
                                                <el-option label="未分组" value="-1"></el-option>
                                                <el-option v-for="item in groupList" :key="item.uid" :label="item.name"
                                                           :value="item.uid"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-button type="primary" size="mini" @click="getData()">搜索</el-button>
                                        <el-button type="primary" size="mini" @click="addVillage">添加</el-button>
                                    </el-col>
                                </el-row>
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
                            <a v-if="$route.meta.edit" class="item" @click="updateVillage(scope.row)">修改</a>
                            <a v-if="$route.meta.delete" class="item" @click="deleteVillage(scope.row)">删除</a>
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
                        <el-form-item label="村/社区名称" :label-width="formLabelWidth" prop="name">
                            <el-col :span="12">
                                <el-input v-model="form.name" autocomplete="off"></el-input>
                            </el-col>
                        </el-form-item>
                        <el-form-item label="村/社区简介" :label-width="formLabelWidth">
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
                form: {
                    title: '',
                    uid: '',
                    name: '',
                    remark: ''
                },
                addFormVisible: false,
                formLabelWidth: '100px',
                rules: {
                    name: [
                        {required: true, message: '/社区名称不能为空', trigger: 'blur'}
                    ],
                    remark: [
                        {max: 200, message: '长度在 200 个字符以内', trigger: 'blur'}
                    ]
                },
                tableLoading: false,
                tableHeader: {
                    name: '村/社区名',
                    groupName: '所属小组',
                    introduction: '村/社区简介',
                },
                tableData: [],
                groupList:[],
                searchForm: {
                    name: '',
                    group:'',
                },
                pageSize: 20,
                currentPage: 1,
                total: 0
            }
        },
        mounted() {
            this.getData();
            this.getGroupList();
        },
        methods: {
            handleClose() {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        this.resetForm('form');
                    })
                    .catch(_ => {});
            },
            confirmAddOrUpdate(formName) {
                let that = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        that.$request.httpRequest({
                            method: 'post',
                            url: "/manager/village/addOrUpdateVillage",
                            noLoading: true,
                            params: {
                                uid: that.form.uid,
                                name: that.form.name,
                                introduction: that.form.remark
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

            addVillage() {
                this.form.title = '添加村/社区';
                this.form.uid = '';
                this.form.name = '';
                this.form.remark = '';
                this.showForm();
            },

            updateVillage(item) {
                this.form.title = '修改村/社区';
                this.form.uid = item.uid;
                this.form.name = item.name;
                this.form.remark = item.introduction;
                this.showForm();
            },

            showForm() {
                this.addFormVisible = true;
            },

            deleteVillage(row) {
                this.$confirm('确认删村/社区吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$request.httpRequest({
                        method: 'delete',
                        url: "/manager/village/deleteVillage",
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
                        error: (data, e) => {
                            this.$message({
                                type: 'warning',
                              message: '删除失败!' + data.get("message")
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

            handleCurrentChange(val) {
                this.currentPage = val
                this.getData()
            },

            handleSizeChange(val) {
                this.pageSize = val
                this.getData()
            },

            getData(event) {
                if(event){
                    this.currentPage = 1;
                }
                this.tableLoading = true
                setTimeout(() => {
                    this.$request.httpRequest({
                        method: 'get',
                        url: '/manager/village/findVillage',
                        noLoading: true,
                        returnFullData: false,
                        params: {
                            name: this.searchForm.name,
                            group: this.searchForm.group,
                            page: this.currentPage,
                            size: this.pageSize,
                            property: 'id',
                            direction: 'asc'
                        },
                        success: data => {
                            console.log(data, data)
                            this.tableData = data.content;
                            this.total = data.totalElements;
                            this.tableLoading = false
                        },
                        error: e => {
                            this.tableLoading = false
                        }
                    })
                })
            },

            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.form.title= '';
                this.form.uid= '';
                this.form.name= '';
                this.form.remark = '';
                this.addFormVisible = false
            },

            test(row) {
                console.log('tableRow', row)
            },

            //获取工作单位下拉列表
            getGroupList() {
                this.$request.httpRequest({
                    method: 'get',
                    url: "/manager/member/work_units",
                    noLoading: true,
                    success: data => {
                        this.groupList = data;
                    },
                    error: e => {
                        this.tableLoading = false;
                    }
                });
            },
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
