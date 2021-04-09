<template>
    <div class="table-demo">
        <el-card class="list-content" shadow="hover">
            <template v-if="$route.meta.check">
                <!-- 搜索栏 -->
                <div class="searchBar">
                    <el-form ref="form"
                             :model="searchForm"
                             label-width="80px">
                        <el-row :gutter="50">
                            <el-col :span="18">
                                <el-row :gutter="20">
                                    <el-col :span="6">
                                        <el-form-item label="建议类型">
                                            <el-select v-model="searchForm.businessUid"
                                                       placeholder="请选择建议类型"
                                                       size="mini">
                                                <el-option label="全部"
                                                           value=""></el-option>
                                                <el-option v-for="item in typeList"
                                                           :key="item.uid"
                                                           :label="item.name"
                                                           :value="item.uid"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-form-item label="建议标题">
                                            <el-input placeholder="请输入建议标题"
                                                      size="mini"
                                                      v-model="searchForm.title"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-form-item label="提议代表">
                                            <el-input placeholder="请输入代表姓名"
                                                      size="mini"
                                                      v-model="searchForm.memberName"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-form-item label="代表手机">
                                            <el-input placeholder="请输入代表手机号"
                                                      size="mini"
                                                      v-model="searchForm.memberMobile"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-col>

                            <el-col :span="6">
                                <el-button type="primary"
                                           size="mini"
                                           @click="getData(0,$event)">搜索
                                </el-button>
                                <el-dropdown class="ml-10"
                                             @command="exportData">
                                    <el-button type="primary"
                                               size="mini">导出<i class="el-icon-arrow-down el-icon--right"></i>
                                    </el-button>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item command="0">导出本页</el-dropdown-item>
                                        <el-dropdown-item command="1">导出全部</el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </el-col>

                            <el-col :span="15">
                                <el-row>
                                    <el-col :span="14">
                                    <el-form-item label="转办日期">
                                            <el-col :span="10">
                                                <el-date-picker type="date"
                                                                value-format="yyyy-MM-dd"
                                                                size="mini"
                                                                placeholder="选择开始日期"
                                                                v-model="searchForm.dateStart"
                                                                style="width: 100%;"></el-date-picker>
                                            </el-col>
                                            <el-col class="line el-col-md-offset-1"
                                                    :span="1"><b>至</b></el-col>
                                            <el-col :span="10">
                                                <el-date-picker type="date"
                                                                value-format="yyyy-MM-dd"
                                                                size="mini"
                                                                placeholder="选择结束日期"
                                                                v-model="searchForm.dateEnd"
                                                                style="width: 100%;"></el-date-picker>
                                            </el-col>
                                    </el-form-item>
                                    </el-col>

                                    <!--办理类型-->
                                    <el-col :span="10">
                                        <el-form-item label="办理类型">
                                            <el-select v-model="searchForm.unitType"
                                                       placeholder="请选择办理类型"
                                                       size="mini">
                                                <el-option v-for="item in unitTypeList"
                                                           :key="item.value"
                                                           :label="item.name"
                                                           :value="item.value"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-col>

                        </el-row>
                    </el-form>
                </div>

                <!-- 表格数据 -->
                <el-table v-loading="tableLoading"
                          border
                          size="mini"
                          :header-row-style="{ 'font-size':'15px'}"
                          :data="tableData"
                          style="width: 100%"
                          class="table-content">
                    <el-table-column type="index"
                                     label="序号"
                                     align="center"
                                     sortable
                                     width="60"/>
                    <el-table-column v-for="(item,index) in tableHeader"
                                     show-overflow-tooltip
                                     :key="index"
                                     :prop="index"
                                     sortable
                                     :label="item"
                                     align="center"
                                     show-overflow-tooltip/>
                    <el-table-column label="操作"
                                     width="230"
                                     align="center"
                                     class-name="operation">

                        <template slot-scope="scope">
                            <a @click.prevent=""
                               class="item"
                               @click="viewDetail(scope.row)">查看详情</a>
                            <a v-if="$route.meta.delete"
                               class="item-danger"
                               @click="applyAdjust(scope.row)">申请调整</a>
                            <a v-if="$route.meta.edit"
                               class="item-success"
                               @click="startDealing(scope.row)">开始办理</a>
                        </template>

                    </el-table-column>
                </el-table>

                <!-- 分页选择器 -->
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

                <!-- 申请调整办理单位弹框 -->
                <el-dialog :visible.sync="showApply" title="申请调整" style="text-align: left;height: 90%;">
                  <el-row>
                    <el-col :span="12">
                      <div class="grid-content ">
                        <el-form ref="form"
                                 class="dialog-left showForm"
                                 label-width="100px">

                          <el-form-item label="申请原因">
                            <el-input type="textarea" :autosize="{ minRows: 5, maxRows: 10}" show-word-limit
                                      v-model="adjustReason">
                            </el-input>
                          </el-form-item>

                        </el-form>
                      </div>
                    </el-col>
                  </el-row>

                  <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="cancelAdjust">取 消</el-button>
                    <el-button type="success" @click="confirmAdjust">确 认</el-button>
                  </span>
                </el-dialog>

                <!-- 查看建议详情 -->
                <el-dialog title="建议详情" :visible.sync="showDetail" v-if="sugDetail.suggestion" width="45%">
                    <el-row>
                        <el-col :span="12">
                            <span><b>建议标题：</b> {{sugDetail.suggestion.title}}</span>
                        </el-col>
                        <el-col :span="12">
                            <span><b>建议类型：</b> {{sugDetail.suggestion.businessName}}</span>
                        </el-col>
                    </el-row>
                    <el-row class="item-data">
                        <el-col :span="12">
                            <span><b>提议代表：</b> {{sugDetail.suggestion.memberName}}</span>
                        </el-col>
                        <el-col :span="12">
                            <span><b>提议时间：</b> {{sugDetail.suggestion.raiseTime}}</span>
                        </el-col>
                    </el-row>
                    <el-row class="item-data">
                        <el-col :span="24">
                            <span><b>建议内容：</b> {{sugDetail.suggestion.content}}</span>
                        </el-col>
                    </el-row>
                    <el-row class="item-data">
                        <el-col :span="24">
                          <span><b>建议图片：</b>
                                <span v-if="!sugDetail.suggestion.images">无</span>
                                <div class="img-lsit" v-else v-for="(item,index) in sugDetail.suggestion.images" :key="index">
                                    <el-image
                                            class="image"
                                            :src="API.ServerUrl + item">
                                     </el-image>
                                </div>
                          </span>
                        </el-col>
                    </el-row>
                    <el-row class="item-data">
                        <el-col :span="24">
                          <span><b>附议人：</b>
                              <span>{{sugDetail.suggestion.seconded}}</span>
                          </span>
                        </el-col>
                    </el-row>
                    <el-row class="item-data">
                        <el-col :span="12">
                            <span><b>转办政府：</b> {{sugDetail.govName}}</span>
                        </el-col>
                        <el-col :span="12">
                            <span><b>转办时间：</b> {{sugDetail.receiveTime}}</span>
                        </el-col>
                    </el-row>

                    <el-button type="primary" @click="closeDetail">确 定</el-button>
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
    import {exportExcel} from "@/assets/utils/exportExcel";

    export default {
        data() {
            return {
                tableLoading: false,
                tableHeader: {
                    businessName: '建议类型',
                    title: '建议标题',
                    conveyTime: '转办日期',
                    memberName: '提议代表',
                    memberMobile: '代表手机号',
                    unitTypeName: '办理类型',
                },
                tableData: [],

                //搜索栏
                searchForm: {
                    title: '',//建议标题
                    businessUid: '',//建议类型Uid
                    memberName: '',//建议代表姓名
                    memberMobile: '',//建议代表手机号
                    dateStart: null,//建议日期开始
                    dateEnd: null,//建议日期结束
                    unitType: 0 //办理类型，主办/协办
                },
                //建议类型列表
                typeList: [],
                unitTypeList: [{
                    name: "全部",
                    value: 0
                },{
                    name: "主办",
                    value: 1
                },{
                    name: "协办",
                    value: 2
                }],
                pageSize: 20,
                currentPage: 1,
                total: 0,

                // 查看详情弹框
                showDetail: false,
                sugDetail: {},
                form: {},

                //申请调整弹框
                showApply: false,
                //申请调整的建议uid
                adjustSugUid: "",
                adjustReason: "",
            }
        },

        mounted() {
            this.getTypeList();
            this.getData(0);
        },

        methods: {
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getData();
            },
            handleSizeChange(val) {
                this.pageSize = val;
                this.getData();
            },

            //查询建议类型
            getTypeList() {
                this.$request.httpRequest({
                    method: 'get',
                    url: "/suggestion_deal/unit_suggestion/sug_type",
                    noLoading: true,
                    returnFullData: false,
                    success: data => {
                        this.typeList = data;
                    },
                    error: e => {
                        this.$message({
                            type: 'warning',
                            message: '获取类型失败!',
                        });
                    },
                })
            },

            //查询数据
            getData(times) {
                /*if(event){
                        this.currentPage = 1;
                      }*/
                this.tableLoading = true;
                setTimeout(() => {
                    this.$request.httpRequest({
                        method: 'get',
                        url: "/suggestion_deal/unit_suggestion/page_to_deal",
                        noLoading: true,
                        params: {
                            title: this.searchForm.title,
                            businessUid: this.searchForm.businessUid,
                            dateStart: this.searchForm.dateStart,
                            dateEnd: this.searchForm.dateEnd,
                            memberName: this.searchForm.memberName,
                            memberMobile: this.searchForm.memberMobile,
                            unitType: this.searchForm.unitType,
                            page: this.currentPage,
                            size: this.pageSize,
                        },
                        success: data => {
                            this.tableData = data.content;
                            this.total = data.totalElements;
                            this.tableLoading = false;
                            if (times === 0) {
                                this.$message({
                                    type: 'success',
                                    message: '查询成功!',
                                });
                            }
                        },
                        error: e => {
                            this.tableLoading = false;
                            this.$message({
                                type: 'warning',
                                message: '网络状态不佳，请稍后重试',
                            });
                        },
                    });
                })
            },

            exportData(type) {
                let size = type === "0" ? this.pageSize : 9999;
                let page = type === "0" ? this.currentPage : 1;
                let params = {
                    flag: true,
                    title: this.searchForm.title,
                    suggestionBusiness: this.searchForm.type,
                    auditStart: this.searchForm.dateStart,
                    auditEnd: this.searchForm.dateEnd,
                    name: this.searchForm.name,
                    mobile: this.searchForm.mobile,
                    page: page,
                    size: size,
                    property: 'auditTime',
                    direction: 'desc',
                };

                exportExcel(this.API.ExportSuggestion, params, this);
            },

            //弹出申请调整框
            applyAdjust(row) {
                this.showApply = true;
                this.adjustSugUid = row.uid;
            },

            //取消申请调整
            cancelAdjust() {
                //关闭弹框，重置字段
                this.showApply = false;
                this.adjustSugUid = "";
                this.adjustReason = "";
            },

            //确认申请调整
            confirmAdjust() {
                this.$request.httpRequest({
                    method: 'post',
                    url: "/suggestion_deal/unit_suggestion/adjust/" + this.adjustSugUid,
                    noLoading: true,
                    params: {
                        adjustReason: this.adjustReason
                    },
                    success: () => {
                        this.tableLoading = false;
                        this.$message({
                            type: 'success',
                            message: '申请成功!',
                        });
                        //关闭弹窗
                        this.cancelAdjust();
                        //刷新数据
                        this.getData();
                    },
                    error: e => {
                        this.tableLoading = false;
                        this.$message({
                            type: 'error',
                            message: '网络状态不佳，请稍后重试',
                        });
                    },
                });
            },

            //接受转办，开始办理
            startDealing(row) {
                this.$confirm('确认开始办理?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info',
                }).then(() => {
                    this.$request.httpRequest({
                        method: 'post',
                        url: "/suggestion_deal/unit_suggestion/receive/" + row.uid,
                        noLoading: true,
                        params: {},
                        success: () => {
                            this.tableLoading = false;
                            this.$message({
                                type: 'success',
                                message: '操作成功!',
                            });

                            this.getData();
                        },
                        error: e => {
                            this.tableLoading = false;
                            this.$message({
                                type: 'error',
                                message: '网络状态不佳，请稍后重试',
                            });
                        },
                    });
                }).catch(() => {
                    //nothing
                });
            },

            //查看详情
            viewDetail(row) {
                this.showDetail = true;
                // this.form = row;

                //发送查询详情的请求
                this.$request.httpRequest({
                    method: 'get',
                    url: "/suggestion_deal/unit_suggestion/to_deal/detail/" + row.uid,
                    noLoading: true,
                    params: {},
                    success: data => {
                        this.tableLoading = false;

                        this.sugDetail = data;
                    },
                    error: e => {
                        this.tableLoading = false;
                        this.$message({
                            type: 'error',
                            message: '网络状态不佳，请稍后重试',
                        });
                    },
                });
            },

            //关闭详情弹框
            closeDetail() {
                this.showDetail = false;
                this.sugDetail = {};
            }
        }
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

    .ml-10 {
        margin-left: 10px;
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

    .table-img {
        width: 80px;
        height: 80px;
    }

    .showForm p {
        margin: 0;
    }

    .text-danger{
        color: red;
    }

    .text-warning{
        color: orange;
    }

    .item-data{
        margin-top: 20px;
    }

    .img-lsit{
        display: inline-block;
    }

    .image{
        width: 100px;
        height: 100px;
        margin-top: 20px;
        margin-right: 20px;
    }
</style>
