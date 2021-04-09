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
										<el-form-item label="履职类型">
											<el-select v-model="searchForm.type"
											           placeholder="请选择履职类型"
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
										<el-form-item label="履职标题">
											<el-input placeholder="请输入履职标题"
											          size="mini"
											          v-model="searchForm.title"></el-input>
										</el-form-item>
									</el-col>
									<el-col :span="6">
										<el-form-item label="履职代表">
											<el-input placeholder="请输入履职代表名称"
											          size="mini"
											          v-model="searchForm.name"></el-input>
										</el-form-item>
									</el-col>
									<el-col :span="6">
										<el-form-item label="手机号">
											<el-input placeholder="请输入履职代表手机号"
											          size="mini"
											          v-model="searchForm.mobile"></el-input>
										</el-form-item>
									</el-col>
								</el-row>
							</el-col>

							<el-col :span="6">
								<el-button type="primary"
								           size="mini"
								           @click="getData(0)">搜索
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

							<el-col :span="18">
								<el-row>
									<el-form-item label="履职日期">
										<el-col :span="22">
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
										</el-col>
									</el-form-item>
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
							   @click="deleteData(scope.row)">删除</a>

							<!--弹框-->
							<el-dialog :visible.sync="dialogVisible"
							           style="text-align: left;height: 90%;">
								<el-row>
									<el-col :span="12">
										<div class="grid-content ">
											<el-form ref="form"
											         class="dialog-left showForm"
											         :model="form"
											         label-width="100px">
												<el-form-item label="履职标题">
													<p>{{form.title}}</p>
												</el-form-item>

												<el-form-item label="履职类型">
													<p>{{form.typeName}}</p>
												</el-form-item>

												<el-form-item label="履职内容">
													<el-input type="textarea"
													          readonly
													          v-model="form.content">{{form.reply}}
													</el-input>
												</el-form-item>

												<el-form-item label="履职日期">
													<p>{{form.createTime}}</p>
												</el-form-item>

												<el-form-item label="履职代表">
													<p>{{form.memberName}}</p>
												</el-form-item>

												<el-form-item label="代表手机号">
													<p>{{form.memberMobile}}</p>
												</el-form-item>

												<el-form-item label="附件图片">
													<div class="demo-image">
														<div class="block">
															<el-image v-for="item in form.images"
																	  :src= "API.ServerUrl+item" style="width: 120px; height:120px;margin-right: 10px" ></el-image>
														</div>
													</div>
												</el-form-item>
											</el-form>
										</div>
									</el-col>
									<el-col :span="12">
										<div class="grid-content ">
											<!--<span v-if="form.status==1">暂无回复</span>-->
											<!--<el-timeline v-else>
												<el-timeline-item
														v-for="(activity, index) in form.replayVoList"
														:key="index"
														:timestamp="activity.time">
													{{activity.content}}
												</el-timeline-item>
											</el-timeline>-->
											<el-form ref="form"
											         class="dialog-left showForm"
											         :model="form"
											         :label-position="'left'"
											         label-width="100px">
											<el-form-item label="审核日期">
												<p>{{form.auditDate}}</p>
											</el-form-item>

											<el-form-item label="审核人">
												<p>{{form.auditor}}</p>
											</el-form-item>
											</el-form>
										</div>
									</el-col>
								</el-row>

								<span slot="footer"
								      class="dialog-footer">
    <el-button type="primary"
               @click="dialogVisible = false">关 闭</el-button>
  </span>
							</el-dialog>
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
					typeName: '履职类型',
					title: '履职标题',
					workAt: '履职日期',
					memberName: '履职代表',
					// memberMobile: '代表手机号',
					auditor: '审核人',
					content: '履职内容',
					unitName:'履职地点',
				},
				tableData: [],

				searchForm: {
					type: '',//类型
					title: '',//履职标题
					name: '',//履职代表姓名
					mobile: '',//履职代表手机号
					dateStart: null,//履职日期开始
					dateEnd: null,//履职日期结束
				},
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
		methods: {
			handleCurrentChange(val) {
				this.currentPage = val;
				this.getData(0)
			},
			handleSizeChange(val) {
				this.currentPage = 1;
				this.pageSize = val;
				this.getData(0)
			},

			// 查看详情
			viewDetail(row) {
				this.dialogVisible = true;
				this.form = row;
				console.log(this.form)
			},

			getTypeList() {
				this.$request.httpRequest({
					method: 'get',
					url: "/member_house/performance/performanceTypeList",
					noLoading: true,
					returnFullData: false,
					success: data => {
						this.typeList = data;
					},
					error: e => {
					},
				})

			},

			getData(times) {
				this.tableLoading = true;
				setTimeout(() => {
					this.$request.httpRequest({
						method: 'get',
						url: "/member_house/performance/findPerformance",
						noLoading: true,
						params: {
						  	flag: true,
							title: this.searchForm.title,
							performanceType: this.searchForm.type,
							workAtStart: this.searchForm.dateStart,
							workAtEnd: this.searchForm.dateEnd,
							name: this.searchForm.name,
							mobile: this.searchForm.mobile,
							page: this.currentPage,
							size: this.pageSize,
							property: 'workAt',
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
					performanceType: this.searchForm.type,
					workAtStart: this.searchForm.dateStart,
					workAtEnd: this.searchForm.dateEnd,
					name: this.searchForm.name,
					mobile: this.searchForm.mobile,
					page: page,
					size: size,
				};

				exportExcel(this.API.ExportPerformance, params, this);
			},

			deleteData(row) {
				this.$confirm('确认删除该履职信息吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
				})
					.then(() => {
						this.$request.httpRequest({
							method: 'delete',
							url: "/member_house/performance/deletePerformance",
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
</style>
