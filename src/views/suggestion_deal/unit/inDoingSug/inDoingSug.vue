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
                                        <el-form-item label="受理日期">
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
                    <el-table-column prop="expectDate" label="截止日期"  width="165" align="center">
                        <template slot-scope="scope">
                            <!--              <div>{{scope.row.expectDate}}</div>-->
                            {{scope.row.expectDate}}
                            <el-popover
                                    v-if="scope.row.urge"
                                    placement="right-end"
                                    trigger="hover"
                                    content="建议被催办，请尽快办理！">
                                <svg-icon icon-class="cuiban" style="margin-left: 1px;" slot="reference"/>
                            </el-popover>
                            <el-popover
                                    v-else-if="scope.row.exceedLimit"
                                    placement="right-end"
                                    trigger="hover"
                                    content="建议已经超期，请尽快办理或申请延期！">
                                <svg-icon icon-class="chaoqi" style="margin-left: 1px;" slot="reference"/>
                            </el-popover>
                            <el-popover
                                    v-else-if="scope.row.closeDeadLine"
                                    placement="right-end"
                                    trigger="hover"
                                    content="建议快到期,请尽快办理！">
                                <svg-icon icon-class="linqi" style="margin-left: 1px;" slot="reference"/>
                            </el-popover>
                            <!--              <el-badge value="期" is-dot style="top: 5px;" class="item">{{scope.row.expectDate}}</el-badge>-->
                        </template>
                    </el-table-column>
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
                               @click="applyDelay(scope.row)">申请延期</a>
                            <a v-if="$route.meta.delete"
                               class="item"
                               @click="addProcess(scope.row)">添加流程</a>
                            <a v-if="$route.meta.edit"
                               class="item-success"
                               @click="finish(scope.row)">完成办理</a>
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

                <!-- 申请延期弹框 -->
                <el-dialog :visible.sync="showApply" title="申请延期" style="text-align: left;height: 90%;">
                    <el-row>
                        <el-col :span="12">
                            <div class="grid-content ">
                                <el-form ref="form"
                                         class="dialog-left showForm"
                                         label-width="100px">

                                    <el-form-item label="延期日期">
                                        <el-date-picker
                                                v-model="delayUntil"
                                                type="date"
                                                placeholder="申请延期至"
                                                value-format="yyyy-MM-dd">
                                        </el-date-picker>
                                    </el-form-item>

                                    <el-form-item label="延期原因">
                                        <el-input type="textarea" :autosize="{ minRows: 5, maxRows: 10}" show-word-limit
                                                  v-model="reason">
                                        </el-input>
                                    </el-form-item>

                                </el-form>
                            </div>
                        </el-col>
                    </el-row>

                    <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="cancelDelay">取 消</el-button>
                    <el-button type="success" @click="confirmDelay">确 认</el-button>
                  </span>
                </el-dialog>

                <!-- 添加流程弹框 -->
                <el-dialog :visible.sync="showAdd" title="添加流程"
                           style="text-align: left;height: 90%;">
                    <el-row>
                        <el-col :span="12">
                            <div class="grid-content ">
                                <el-form ref="form"
                                         class="dialog-left showForm"
                                         label-width="100px">

                                    <el-form-item label="开始日期">
                                        <el-date-picker
                                                v-model="handleTime"
                                                type="date"
                                                placeholder="流程开始日期"
                                                value-format="yyyy-MM-dd">
                                        </el-date-picker>
                                    </el-form-item>

                                    <el-form-item label="流程详情">
                                        <el-input type="textarea" :autosize="{ minRows: 5, maxRows: 10}" show-word-limit
                                                  v-model="processDetail">
                                        </el-input>
                                    </el-form-item>

                                    <el-form-item label="流程图片">
                                    <el-upload
                                            class="upload-demo"
                                            :action="this.API.UploadUnitImage"
                                            name="image"
                                            :headers="headers"
                                            :data="{type: 1}"
                                            :multiple="true"
                                            :file-list="imageList"
                                            :on-success="handleSuccess"
                                            list-type="picture">
                                        <el-button size="small" type="primary">点击上传</el-button>
                                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
                                    </el-upload>
                                    </el-form-item>

                                </el-form>
                            </div>
                        </el-col>
                    </el-row>

                    <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="cancelAdd">取 消</el-button>
                    <el-button type="success" @click="confirmAdd">确 认</el-button>
                  </span>
                </el-dialog>

                <!-- 完成办理弹框 -->
                <el-dialog :visible.sync="showFinish" title="完成办理" style="text-align: left;height: 90%;">
                    <el-row>
                        <el-col :span="12">
                            <div class="grid-content ">
                                <el-form ref="form"
                                         class="dialog-left showForm"
                                         label-width="100px">

                                    <el-form-item label="结果详情">
                                        <el-input type="textarea" :autosize="{ minRows: 5, maxRows: 10}" show-word-limit
                                                  v-model="resultDetail">
                                        </el-input>
                                    </el-form-item>

                                    <el-form-item label="结果图片">
                                        <el-upload
                                                class="upload-demo"
                                                :action="this.API.UploadUnitImage"
                                                name="image"
                                                :headers="headers"
                                                :data="{type: 2}"
                                                :multiple="true"
                                                :file-list="imageList"
                                                :on-success="handleResultImageSuccess"
                                                list-type="picture">
                                            <el-button size="small" type="primary">点击上传</el-button>
                                            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
                                        </el-upload>
                                    </el-form-item>

                                </el-form>
                            </div>
                        </el-col>
                    </el-row>

                    <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="cancelFinish">取 消</el-button>
                    <el-button type="success" @click="confirmFinish">确 认</el-button>
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

                    <el-divider content-position="center"><h3>办理单位</h3></el-divider>
                    <el-row class="item-data">
                        <el-col :span="24">
                            <el-collapse v-model="activeName" accordion>
                                <el-collapse-item :title="sugDetail.unitName">
                                    <el-row class="item-data">
                                        <el-col :span="12">
                                            <span><b>开办时间：</b> {{sugDetail.acceptTime}}</span>
                                        </el-col>
                                    </el-row>
                                    <el-row class="item-data">
                                        <el-collapse v-model="processName" accordion>
                                            <el-collapse-item title="办理流程" name="1">
                                                <el-col :span="24">
                                          <span><b>办理流程：</b>
                                              <span v-if="!sugDetail.processes">无</span>
                                              <el-timeline  v-else>
                                                <el-timeline-item  v-for="(process, index) in sugDetail.processes" :timestamp="process.handleTime" placement="top">
                                                  <el-card>
                                                    <div class="img-lsit" v-for="(img,index) in process.images" :key="index">
                                                        <el-image class="image" :src="API.ServerUrl + img"></el-image>
                                                    </div>
                                                    <p>{{process.description}}</p>
                                                  </el-card>
                                                </el-timeline-item>
                                              </el-timeline>
                                          </span>
                                                </el-col>
                                            </el-collapse-item>
                                        </el-collapse>
                                    </el-row>
                                </el-collapse-item>
                            </el-collapse>
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
                    acceptTime: '受理日期',
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
                }, {
                    name: "主办",
                    value: 1
                }, {
                    name: "协办",
                    value: 2
                }],
                pageSize: 20,
                currentPage: 1,
                total: 0,

                //具体操作时选中的行
                row: {},

                //查看详情弹框
                showDetail: false,
                sugDetail: {},
                form: {},

                //申请延期弹框
                showApply: false,
                //申请延期的建议uid
                delaySugUid: "",
                delayUntil: "",
                reason: "",

                //token头，上传图片时用到
                headers: {},
                imageList: [],

                //添加流程弹框
                showAdd: false,
                handleTime: "",
                processDetail: "",
                processImages: [],

                //完成办理弹框
                showFinish: false,
                resultDetail: "",
                resultImages: [],
            }
        },

        mounted() {
            this.getTypeList();
            this.getData(0);
            this.headers.Authorization = localStorage.getItem("TOKEN");
        },

        methods: {
            //添加流程弹框关闭时的回调
           /* handleClose() {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        this.cancelAdd();
                    })
                    .catch(_ => {
                    });
            },*/

            handleCurrentChange(val) {
                this.currentPage = val;
                this.getData(0);
            },
            handleSizeChange(val) {
                this.pageSize = val;
                this.getData(0);
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
                        url: "/suggestion_deal/unit_suggestion/page_in_dealing",
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

            //弹出申请延期框
            applyDelay(row) {
                this.showApply = true;
                this.delaySugUid = row.uid;
                this.delayUntil = row.expectDate;
                //保存选中行的数据
                this.row = row;
            },

            //延期申请取消
            cancelDelay() {
                //关闭弹框，重置字段
                this.showApply = false;
                this.delaySugUid = "";
                this.delayUntil = "";
                this.reason = "";
                this.row = {};
            },

            //确认申请延期
            confirmDelay() {
                //字段检查
                if (this.delayUntil === this.row.expectDate) {
                    this.$message({
                        type: 'warning',
                        message: '请至少延期一天',
                    });
                    return;
                }

                if (!this.reason) {
                    this.$message({
                        type: 'warning',
                        message: '延期原因不能为空',
                    });
                    return;
                }

                //发送延期请求
                this.$request.httpRequest({
                    method: 'post',
                    url: "/suggestion_deal/unit_suggestion/delay/" + this.delaySugUid,
                    noLoading: true,
                    params: {
                        delayUntil: this.delayUntil,
                        reason: this.reason
                    },
                    success: () => {
                        this.tableLoading = false;
                        this.$message({
                            type: 'success',
                            message: '申请成功!',
                        });

                        //关闭弹窗
                        this.cancelDelay();
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

            //添加流程弹框
            addProcess(row) {
                this.showAdd = true;
                this.row = row;
            },

            //取消添加流程
            cancelAdd() {
                this.showAdd = false;
                this.handleTime = "";
                this.processDetail = "";
                this.processImages = [];
                this.imageList = [];  //将图片列表清空
                this.row = {};
            },

            //上传图片成功时的回调
            handleSuccess(res) {
                if (res.status === "OK") {
                    this.processImages.push(res.data);
                } else {
                    this.$message({
                        type: 'error',
                        message: res.message,
                    });
                }
            },

            //确认添加流程
            confirmAdd() {
                //字段检查
                if (!this.handleTime) {
                    this.$message({
                        type: 'warning',
                        message: '开始时间不能为空',
                    });
                    return;
                }

                if (!this.processDetail) {
                    this.$message({
                        type: 'warning',
                        message: '流程详情不能为空',
                    });
                    return;
                }

                // console.log(this.processImages);

                //发送添加流程的请求
                this.$request.httpRequest({
                    method: 'post',
                    url: "/suggestion_deal/unit_suggestion/process",
                    noLoading: true,
                    params: {
                        unitSugUid: this.row.uid,
                        handleTime: this.handleTime,
                        description: this.processDetail,
                        imageUrls: this.processImages + ""
                    },
                    success: () => {
                        this.tableLoading = false;
                        this.$message({
                            type: 'success',
                            message: '添加成功!',
                        });

                        //关闭弹窗
                        this.cancelAdd();
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

            //完成办理弹框
            finish(row) {
                this.showFinish = true;
                this.row = row;
            },

            //结果图片上传成功时的回调
            handleResultImageSuccess(res) {
                if (res.status === "OK") {
                    this.resultImages.push(res.data);
                } else {
                    this.$message({
                        type: 'error',
                        message: res.message,
                    });
                }
            },

            //取消添加流程
            cancelFinish() {
                this.showFinish = false;
                this.resultDetail = "";
                this.resultImages = [];
                this.imageList = [];  //将图片列表清空
                this.row = {};
            },

            confirmFinish() {
                //字段检查
                if (!this.resultDetail) {
                    this.$message({
                        type: 'warning',
                        message: '结果详情不能为空',
                    });
                    return;
                }

                // console.log(this.processImages);

                //发送添加流程的请求
                this.$request.httpRequest({
                    method: 'post',
                    url: "/suggestion_deal/unit_suggestion/finish",
                    noLoading: true,
                    params: {
                        unitSugUid: this.row.uid,
                        result: this.resultDetail,
                        imageUrls: this.resultImages + ""
                    },
                    success: () => {
                        this.tableLoading = false;
                        this.$message({
                            type: 'success',
                            message: '操作成功!',
                        });

                        //关闭弹窗
                        this.cancelFinish();

                        //重载数据
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

            //查看详情
            viewDetail(row) {
                this.showDetail = true;
                // this.form = row;
                this.row = row;

                //发送查询详情的请求
                this.$request.httpRequest({
                    method: 'get',
                    url: "/suggestion_deal/unit_suggestion/detail/" + row.uid,
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
