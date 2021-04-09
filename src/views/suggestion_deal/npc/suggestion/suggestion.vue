<template>
	<div class="table-demo">
		<el-card class="list-content"
		         shadow="hover">
			<template v-if="$route.meta.check">

				<div class="searchBar">
					<el-form ref="form"
					         :model="searchForm"
					         label-width="80px">
						<el-row :gutter="50">
							<el-col :span="18">
								<el-row :gutter="20">
									<el-col :span="6">
										<el-form-item label="建议业务">
											<el-select v-model="searchForm.type"
											           placeholder="请选择建议业务"
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
										<el-form-item label="建议代表">
											<el-input placeholder="请输入建议代表名称"
											          size="mini"
											          v-model="searchForm.name"></el-input>
										</el-form-item>
									</el-col>
									<el-col :span="6">
										<el-form-item label="手机号">
											<el-input placeholder="请输入建议代表手机号"
											          size="mini"
											          v-model="searchForm.mobile"></el-input>
										</el-form-item>
									</el-col>
								</el-row>
							</el-col>

							<el-col :span="6">
								<el-button type="primary"
								           size="mini"
								           @click="getData(0,$event)">搜索
								</el-button>
<!--								<el-dropdown class="ml-10"-->
<!--								             @command="exportData">-->
<!--									<el-button type="primary"-->
<!--									           size="mini">导出<i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>-->
<!--									</el-button>-->
<!--									<el-dropdown-menu slot="dropdown">-->
<!--										<el-dropdown-item command="0">导出本页</el-dropdown-item>-->
<!--										<el-dropdown-item command="1">导出全部</el-dropdown-item>-->
<!--									</el-dropdown-menu>-->
<!--								</el-dropdown>-->
							</el-col>

							<el-col :span="18">
								<el-row>
									<el-col :span="6">
										<el-form-item label="建议状态">
											<el-select v-model="searchForm.status"
													   placeholder="请选择建议状态"
													   size="mini">
												<el-option label="全部"
														   value=""></el-option>
												<el-option v-for="item in sugStatus"
														   :key="item.id"
														   :label="item.value"
														   :value="item.id"></el-option>
											</el-select>
										</el-form-item>
									</el-col>

									<el-col :span="18">
											<el-form-item label="建议日期">
												<el-col :span="5">
												<el-date-picker type="date"
												                value-format="yyyy-MM-dd"
												                size="mini"
												                placeholder="选择开始日期"
												                v-model="searchForm.dateStart"
												                style="width: 100%;"></el-date-picker>
											</el-col>
											<el-col class="line el-col-md-offset-1"
											        :span="1"><b>至</b></el-col>
											<el-col :span="5">
												<el-date-picker type="date"
												                value-format="yyyy-MM-dd"
												                size="mini"
												                placeholder="选择结束日期"
												                v-model="searchForm.dateEnd"
												                style="width: 100%;"></el-date-picker>
											</el-col>
											</el-form-item>
										</el-col>
								</el-row>
							</el-col>
						</el-row>
					</el-form>
				</div>

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
					                 width="60" />
					<el-table-column v-for="(item,index) in tableHeader"
					                 show-overflow-tooltip
					                 :key="index"
					                 :prop="index"
					                 sortable
					                 :label="item"
					                 align="center"
					                 show-overflow-tooltip />
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
							   @click="test(scope.row)">删除</a>
							<!--弹框-->
<!--							<el-dialog :visible.sync="dialogVisible"-->
<!--							           style="text-align: left;height: 90%;">-->
<!--								<el-row>-->
<!--									<el-col :span="12">-->
<!--										<div class="grid-content ">-->
<!--											<el-form ref="form"-->
<!--											         class="dialog-left showForm"-->
<!--											         :model="form"-->
<!--											         label-width="100px">-->
<!--												<el-form-item label="建议标题">-->
<!--													<p>{{form.title}}</p>-->
<!--												</el-form-item>-->

<!--												<el-form-item label="建议类型">-->
<!--													<p>{{form.businessName}}</p>-->
<!--												</el-form-item>-->

<!--												<el-form-item label="建议内容">-->
<!--													<el-input type="textarea"-->
<!--													          readonly-->
<!--													          v-model="form.content">{{form.reply}}-->
<!--													</el-input>-->
<!--												</el-form-item>-->

<!--												<el-form-item label="建议日期">-->
<!--													<p>{{form.createTime}}</p>-->
<!--												</el-form-item>-->

<!--												<el-form-item label="建议代表">-->
<!--													<p>{{form.memberName}}</p>-->
<!--												</el-form-item>-->

<!--												<el-form-item label="代表手机号">-->
<!--													<p>{{form.memberMobile}}</p>-->
<!--												</el-form-item>-->

<!--												<el-form-item label="审核人">-->
<!--													<p>{{form.auditor}}</p>-->
<!--												</el-form-item>-->

<!--												<el-form-item label="附件图片">-->
<!--													<div class="demo-image">-->
<!--														<div class="block">-->
<!--															<el-image-->
<!--																	v-for="(item,index) in form.images"-->
<!--																	:key="index"-->
<!--																	style="width: 120px; height: 120px;margin-right: 10px"-->
<!--																	:src="API.ServerUrl+item"></el-image>-->
<!--														</div>-->
<!--													</div>-->
<!--												</el-form-item>-->
<!--											</el-form>-->
<!--										</div>-->
<!--									</el-col>-->
<!--									<el-col :span="12">-->
<!--										<div class="grid-content ">-->
<!--											<span v-if="form.suggestionBusiness==1">暂无回复</span>-->
<!--											<el-timeline v-else>-->
<!--												<el-timeline-item-->
<!--														v-for="(activity, index) in form.suggestionReplyVos"-->
<!--														:key="index"-->
<!--														:timestamp="activity.createTime">-->
<!--													{{activity.reply}}-->
<!--												</el-timeline-item>-->
<!--											</el-timeline>-->
<!--										</div>-->
<!--									</el-col>-->
<!--								</el-row>-->

<!--								<span slot="footer"-->
<!--								      class="dialog-footer">-->
<!--    <el-button type="primary"-->
<!--               @click="dialogVisible = false">关 闭</el-button>-->
<!--  </span>-->
<!--							</el-dialog>-->

						</template>
					</el-table-column>
				</el-table>
				<el-dialog title="查看建议" :visible.sync="dialogVisible" width="45%">
					<el-row>
						<el-col :span="12">
							<span><b>建议标题：</b> {{form.title}}</span>
						</el-col>
						<el-col :span="12">
							<span><b>建议类型：</b> {{form.businessName}}</span>
						</el-col>
					</el-row>
					<el-row class="item-data">
						<el-col :span="12">
							<span><b>提出人：</b> {{form.memberName}}</span>
						</el-col>
						<el-col :span="12">
							<span><b>提出时间：</b> {{form.raiseTime}}</span>
						</el-col>
					</el-row>
					<el-row class="item-data">
						<el-col :span="24">
							<span><b>建议内容：</b> {{form.content}}</span>
						</el-col>
					</el-row>
					<el-row class="item-data">
						<el-col :span="24">
                  <span><b>建议图片：</b>
                        <span v-if="!form.images">无</span>
                        <div class="img-lsit" v-else v-for="(item,index) in form.images" :key="index">
                            <el-image
									class="image"
									:src="API.ServerUrl + item"
									:preview-src-list="addAddress(form.images)">
                             </el-image>
                        </div>
                  </span>
						</el-col>
					</el-row>
					<el-row class="item-data">
						<el-col :span="24">
                  <span><b>附议人：</b>
                      <span>{{form.seconded}}</span>
                  </span>
						</el-col>
					</el-row>
					<el-row class="item-data">
						<el-col :span="12">
							<span><b>审核人：</b> {{form.auditor}}</span>
						</el-col>
						<el-col :span="12">
							<span><b>审核时间：</b> {{form.auditTime}}</span>
						</el-col>
					</el-row>
					<el-divider content-position="center"><h3>办理单位</h3></el-divider>
					<el-row class="item-data">
						<!--              <el-col :span="3">-->
						<!--                  <span><b>办理单位：</b></span>-->
						<!--              </el-col>-->
						<el-col :span="24">
							<el-collapse v-model="activeName" accordion>
								<el-collapse-item v-for="(item,index) in form.unitSugDetailVos" :title="item.unitVo.name +' ('+item.unitTypeName+')'" :name="index">
									<el-row class="item-data">
										<el-col :span="12">
											<span><b>单位业务：</b> {{item.unitVo.businessName}}</span>
										</el-col>
										<el-col :span="12">
											<span><b>开办时间：</b> {{item.acceptTime}}</span>
										</el-col>
									</el-row>
									<el-row class="item-data">
										<el-collapse v-model="processName" accordion>
											<el-collapse-item title="办理流程" name="1">
												<el-col :span="24">
                                          <span><b>办理流程：</b>
                                              <span v-if="!item.processes">无</span>
                                              <el-timeline  v-else>
                                                <el-timeline-item  v-for="(process, index) in item.processes" :timestamp="process.handleTime" placement="top">
                                                  <el-card>
                                                    <div class="img-lsit" v-for="(img,index) in process.images" :key="index">
                                                        <el-image class="image" :src="API.ServerUrl + img" :preview-src-list="addAddress(process.images)"></el-image>
                                                    </div>
                                                    <p>{{process.description}}</p>
                                                  </el-card>
                                                </el-timeline-item>
                                              </el-timeline>
                                          </span>
												</el-col>
											</el-collapse-item>
											<el-collapse-item title="办理结果" name="2">
												<el-col :span="24">
													<el-row class="item-data"  v-if="item.resultVo">
														<el-col :span="24">
															<span><b>结果说明：</b> {{item.resultVo.result}}</span>
														</el-col>
													</el-row>
													<el-row class="item-data">
														<el-col :span="24">
                                                  <span><b>结果附件：</b>
                                                        <span v-if="!item.resultVo.images">无</span>
                                                         <div v-else class="img-lsit" v-for="(img,index) in item.resultVo.images" :key="index">
                                                            <el-image class="image" :src="API.ServerUrl + img" :preview-src-list="addAddress(item.resultVo.images)"></el-image>
                                                        </div>
                                                  </span>
														</el-col>
													</el-row>
												</el-col>
											</el-collapse-item>
										</el-collapse>
									</el-row>
								</el-collapse-item>
							</el-collapse>
						</el-col>
					</el-row>

					<el-divider content-position="center" v-if="form.resultVo"><h3>办理结果</h3></el-divider>
					<el-row class="item-data"  v-if="form.resultVo">
						<el-col :span="24">
							<span><b>结果说明：</b> {{form.resultVo.result}}</span>
						</el-col>
					</el-row>
					<el-row class="item-data"  v-if="form.resultVo">
						<el-col :span="24">
                  <span><b>结果附件：</b>
                        <span v-if="!form.resultVo.images">无</span>
                         <div v-else class="img-lsit" v-for="(img,index) in form.resultVo.images" :key="index">
                            <el-image class="image" :src="API.ServerUrl + img" :preview-src-list="addAddress(form.resultVo.images)"></el-image>
                        </div>
                  </span>
						</el-col>
					</el-row>

					<el-divider content-position="center" v-if="form.appraiseVo"><h3>评价</h3></el-divider>
					<el-row class="item-data"  v-if="form.appraiseVo">
						<el-col :span="12">
							<el-row>
								<el-col :span="6">
									<span><b>办理结果：</b></span>
								</el-col>
								<el-col :span="12">
									<el-rate disabled="disabled" v-model="form.appraiseVo.result"></el-rate>
								</el-col>
							</el-row>
						</el-col>
						<el-col :span="12">
							<el-row>
								<el-col :span="6">
									<span><b>办理态度：</b></span>
								</el-col>
								<el-col :span="12">
									<el-rate disabled="disabled" v-model="form.appraiseVo.attitude"></el-rate>
								</el-col>
							</el-row>
						</el-col>
					</el-row>
					<el-row class="item-data" v-if="form.appraiseVo">
						<el-col :span="24">
                  <span><b>评价说明：</b>
                        <span>{{form.appraiseVo.reason}}</span>
                  </span>
						</el-col>
					</el-row>
					<span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="viewVisible = false">确 定</el-button>
  </span>
				</el-dialog>

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
			<div v-else
			     class="no-data">
				<i class="fa fa-danger"></i>您暂时没有查看的权限！！！
			</div>
		</el-card>
		<!-- 分页 -->
	</div>
</template>
<script>
	import { exportExcel } from "@/assets/utils/exportExcel";

	export default {
		data() {
			return {
				tableLoading: false,
				tableHeader: {
					businessName: '建议类型',
					title: '建议标题',
					createTime: '建议日期',
					memberName: '建议代表',
					auditor: '审核人',
					content: '建议内容',
					statusName: '建议状态',
					unitName:'建议地点',
				},
				tableData: [],
				activeName:[],
				processName:[],
				searchForm: {
					type: '',//类型
					title: '',//建议标题
					name: '',//建议代表姓名
					mobile: '',//建议代表手机号
					dateStart: null,//建议日期开始
					dateEnd: null,//建议日期结束
				},
				sugStatus:[
					{id:3,value:"待转交"},
					{id:4,value:"办理单位待接受"},
					{id:5,value:"办理中"},
					{id:6,value:"办理完成"},
					{id:7,value:"办结"},
					{id:8,value:"自行办理"}
				],
				typeList: [],
				pageSize: 20,
				currentPage: 1,
				total: 0,

				// 查看详情弹框
				dialogVisible: false,
				form: {},
			}
		},
		mounted() {
			this.getTypeList();
			this.getData(0);
		},
		computed:{
			addAddress:function () {
				return function (imgList) {
					if (imgList) {
						let dealImg = [];
						for (let img of imgList) {
							dealImg.push(this.API.ServerUrl + img);
						}
						return dealImg;
					}
				}
			}
		},
		methods: {
			handleCurrentChange(val) {
				this.currentPage = val;
				this.getData(0)
			},
			handleSizeChange(val) {
				this.pageSize = val;
				this.getData(0)
			},

			getTypeList() {
				this.$request.httpRequest({
					method: 'get',
					url: "/suggestion_deal/npc_suggestion/sugBusList",
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

			getData(times) {
				if(event){
					this.currentPage = 1;
				}
				this.tableLoading = true;
				setTimeout(() => {
					this.$request.httpRequest({
						method: 'get',
						url: "/suggestion_deal/npc_suggestion/findSuggestion",
						noLoading: true,
						params: {
                          	flag: true,
							title: this.searchForm.title,
							suggestionBusiness: this.searchForm.type,
							auditStart: this.searchForm.dateStart,
							auditEnd: this.searchForm.dateEnd,
							name: this.searchForm.name,
							mobile: this.searchForm.mobile,
							status: this.searchForm.status,
							page: this.currentPage,
							size: this.pageSize,
							property: 'auditTime',
							direction: 'desc',
						},
						success: data => {
							this.tableData = data.content;
							this.total = data.totalElements;
							this.tableLoading = false;
							if (times == 0) {
								this.$message({
									type: 'success',
									message: '查询成功!',
								});
							}
						},
						error: e => {
							this.tableLoading = false;
						},
					})
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

				exportExcel(this.API.ExportDealSuggestion, params, this);
			},

			test(row) {
				console.log('tableRow', row)
			},

			// 查看详情
			viewDetail(row) {
				this.dialogVisible = true;
				this.form = row;
				console.log(this.form)
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
