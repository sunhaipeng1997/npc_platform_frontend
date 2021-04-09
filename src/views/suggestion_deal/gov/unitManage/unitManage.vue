<template>
    <div class="table-demo">
        <el-card class="list-content"
                 shadow="hover">
            <template v-if="$route.meta.check">
                <div class="searchBar">
                    <el-form ref="form" :model="searchForm" label-width="80px">
                        <el-row>
                            <el-col :span="18">
                                <el-row :gutter="20">
                                    <el-col :span="6">
                                        <el-form-item label="单位名称">
                                            <el-input placeholder="请输入单位名称"
                                                      size="mini"
                                                      v-model="searchForm.name"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-form-item label="单位业务">
                                            <el-select v-model="searchForm.business" placeholder="请选择单位业务" size="mini">
                                                <el-option label="全部" value=""></el-option>
                                                <el-option v-for="item in businessList"
                                                           :key="item.uid"
                                                           :label="item.name"
                                                           :value="item.uid"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-form-item label="状态">
                                            <el-select v-model="searchForm.status" placeholder="请选单位状态">
                                                <el-option label="全部" value=""></el-option>
                                                <el-option label="启用" value="1"></el-option>
                                                <el-option label="停用" value="2"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-col>
                            <el-col :span="6">
                                <el-button type="primary"
                                           size="mini"
                                           @click="getData()">搜索
                                </el-button>
                                <el-button type="primary"
                                           size="mini"
                                           @click="addUnit">添加
                                </el-button>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>

                <el-table v-loading="tableLoading" border size="mini" :header-row-style="{ 'font-size':'15px'}"
                          :data="tableData" style="width: 100%" class="table-content">
                    <el-table-column type="index" label="序号" align="center" sortable width="60"/>
                    <el-table-column prop="avatar" label="单位照片" width="200" align="center">
                        <template slot-scope="scope" >
                            <img width="180" height="120" :src="API.ServerUrl + scope.row.avatar">
                        </template>
                    </el-table-column>
                    <el-table-column v-for="(item,index) in tableHeader" show-overflow-tooltip :key="index"
                                     :prop="index" sortable :label="item" align="center"/>
                    <el-table-column label="操作" width="230" align="center" class-name="operation">
                        <template slot-scope="scope">
                            <a v-if="$route.meta.edit" class="item" @click="updateUnit(scope.row,0)">修改</a>
                            <a v-if="$route.meta.edit" class="item" @click="updateUnit(scope.row,1)">维护人员信息</a>
                            <a class="item-success" @click="changeStatus(scope.row,2)" v-if="scope.row.status == 1">停用</a>
                            <a class="item-warning" @click="changeStatus(scope.row,1)" v-if="scope.row.status == 2">启用</a>
                            <a v-if="$route.meta.delete" class="item-danger" @click="deleteWorkStation(scope.row)">删除</a>
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
            </template>
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
                    name: '单位名称',
                    businessName: '单位业务',
                    address: '单位地址',
                    mobile: '单位联系方式',
                    comment: '单位简介',
                    statusName: '状态',
                },
                tableData: [],
                businessList: [],
                searchForm: {
                    name: '',
                    status: '',
                    business: '',
                },
                pageSize: 20,
                currentPage: 1,
                total: 0,
            }
        },
        mounted() {
            this.getData();
            this.getBusiness();
        },
        methods: {
            //添加办理单位
            addUnit() {
                this.$router.push({name: 'addOrUpdateUnit',query: {step:0}});
            },
            updateUnit(row,step) {
                this.$router.push({name: 'addOrUpdateUnit', query: {uid: row.uid,step:step}});
            },
            getBusiness() {
                this.$request.httpRequest({
                    method: 'get',
                    url: '/suggestion_deal/business/findSugBusiness',
                    noLoading: true,
                    returnFullData: false,
                    success: data => {
                        this.businessList = data;
                    },
                    error: e => {
                        this.tableLoading = false
                    },
                })
            },


            deleteWorkStation(row) {
                this.$confirm('确认删单位吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).then(() => {
                    this.$request.httpRequest({
                        method: 'delete',
                        url: "/suggestion_deal/unit_manage/deleteUnit",
                        noLoading: true,
                        params: {
                            uid: row.uid,
                        },
                        success: data => {
                            this.$message({
                                type: 'success',
                                message: '删除成功!',
                            });
                            this.getData();
                        },
                        error: e => {
                            this.getData();
                        },
                    })
                })
                    .catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除',
                        });
                    });
            },
            changeStatus(row, status) {
                this.$request.httpRequest({
                    method: 'post',
                    url: "/suggestion_deal/unit_manage/changeUnitStatus",
                    noLoading: true,
                    params: {
                        uid: row.uid,
                        status: status
                    },
                    success: data => {
                        this.$message({
                            type: 'success',
                            message: status == 1 ? '启用单位成功！' : "停用单位成功！",
                        });
                        this.getData();
                    },
                    error: e => {
                        this.getData();
                    },
                })
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getData()
            },
            handleSizeChange(val) {
                this.pageSize = val;
                this.getData()
            },
            getData(event) {
                if (event) {
                    this.currentPage = 1;
                }
                this.tableLoading = true;
                setTimeout(() => {
                    this.$request.httpRequest({
                        method: 'get',
                        url: '/suggestion_deal/unit_manage/unitPage',
                        noLoading: true,
                        returnFullData: false,
                        params: {
                            name: this.searchForm.name,
                            business: this.searchForm.business,
                            status: this.searchForm.status,
                            page: this.currentPage,
                            size: this.pageSize,
                        },
                        success: data => {
                            this.tableData = data.content;
                            this.total = data.totalElements;
                            this.tableLoading = false
                        },
                        error: e => {
                            this.tableLoading = false
                        },
                    })
                })
            },
        },
    }
</script>
<style lang="scss"
       scoped>
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

    .amap-demo {
        height: 300px;
    }

    .search-box {
        position: absolute;
        top: 25px;
        left: 20px;
    }

    .amap-page-container {
        position: relative;
    }

    .amap-demo {
        width: 100%;
        height: 300px !important;
    }

    .el-upload__tip {
        margin-top: -7px !important;
    }

    .upload-demo .el-upload--text {
        width: 100px !important;
        height: 40px !important;
        border: none !important;
        position: relative;
        background: transparent !important;
    }

    .upload-demo .el-upload {
        width: 100px !important;
        height: 40px !important;
        border: none !important;
        position: relative;
        background: transparent !important;
    }

    .avatar {
        width: 200px;
        height: 150px;
        display: block;
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 350px;
        height: 190px;
        line-height: 190px;
        text-align: center;
    }

    /*上传头像样式*/
    .setBorder {
        border: 1px dashed #99a9bf;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .setBorder:hover {
        border-color: #409EFF;
    }

</style>
