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
										<el-form-item label="代表名称">
											<el-input placeholder="请输入代表名称"
											          size="mini"
											          v-model="searchForm.name"></el-input>
										</el-form-item>
									</el-col>
									<el-col :span="6">
										<el-form-item label="工作单位">
											<el-input placeholder="请输入工作单位"
											          size="mini"
											          v-model="searchForm.groupId"></el-input>
										</el-form-item>
									</el-col>
									<el-col :span="12">
										<el-form-item label="建议日期">
											<el-col :span="10">
												<el-date-picker type="date"
												                value-format="yyyy-MM-dd"
												                size="mini"
												                placeholder="选择开始日期"
												                v-model="searchForm.startAt"
												                style="width: 100%;"></el-date-picker>
											</el-col>
											<el-col class="line el-col-md-offset-1"
											        :span="2"><b>至</b></el-col>
											<el-col :span="10">
												<el-date-picker type="date"
												                value-format="yyyy-MM-dd"
												                size="mini"
												                placeholder="选择结束日期"
												                v-model="searchForm.endAt"
												                style="width: 100%;"></el-date-picker>
											</el-col>
										</el-form-item>
									</el-col>
								</el-row>
							</el-col>

							<el-col :span="6">
								<el-button type="primary"
								           size="mini"
								           @click="getData(0,$event)">搜索
								</el-button>
								<el-dropdown class="ml-10" @command="exportData">
									<el-button type="primary"
									           size="mini">导出<i class="el-icon-arrow-down el-icon--right"></i>
									</el-button>
									<el-dropdown-menu slot="dropdown">
										<el-dropdown-item command="0">导出本页</el-dropdown-item>
										<el-dropdown-item command="1">导出全部</el-dropdown-item>
									</el-dropdown-menu>
								</el-dropdown>
							</el-col>

						</el-row>
					</el-form>
				</div>

				<el-table v-loading="tableLoading"
				          border
				          size="mini"
				          :header-row-style="{ 'font-size':'15px'}"
				          :data="dealData"
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

					<!--<el-table-column label="操作"
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
							&lt;!&ndash;弹框&ndash;&gt;
							<el-dialog :visible.sync="dialogVisible"
							           style="text-align: left;height: 90%;">
								<el-row>
									<el-col :span="12">
										<div class="grid-content ">
											<el-form ref="form"
											         class="dialog-left showForm"
											         :model="form"
											         label-width="100px">
												<el-form-item label="建议标题">
													<p>{{form.title}}</p>
												</el-form-item>

												<el-form-item label="建议类型">
													<p>{{form.businessName}}</p>
												</el-form-item>

												<el-form-item label="建议内容">
													<el-input type="textarea"
													          readonly
													          v-model="form.content">{{form.reply}}
													</el-input>
												</el-form-item>

												<el-form-item label="建议日期">
													<p>{{form.createTime}}</p>
												</el-form-item>

												<el-form-item label="建议代表">
													<p>{{form.memberName}}</p>
												</el-form-item>

												<el-form-item label="代表手机号">
													<p>{{form.memberMobile}}</p>
												</el-form-item>

												<el-form-item label="审核人">
													<p>{{form.auditor}}</p>
												</el-form-item>

												<el-form-item label="附件图片">
													<div class="demo-image">
														<div class="block">
															<el-image
																	v-for="(item,index) in form.images"
																	:key="index"
																	:src="API.ServerUrl+item"></el-image>
														</div>
													</div>
												</el-form-item>
											</el-form>
										</div>
									</el-col>
									<el-col :span="12">
										<div class="grid-content ">
											<span v-if="form.suggestionBusiness==1">暂无回复</span>
											<el-timeline v-else>
												<el-timeline-item
														v-for="(activity, index) in form.suggestionReplyVos"
														:key="index"
														:timestamp="activity.createTime">
													{{activity.reply}}
												</el-timeline-item>
											</el-timeline>
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
					</el-table-column>-->
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
					name: '代表姓名',
				},
				tableData: [],
				dealData: [],

				searchForm: {
					name: '', // 代表姓名
					groupId: '', // 所屬單位
					startAt: '', // 提出日期开始
					endAt: '', // 日出日期结束
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
				this.pageSize = val;
				this.getData(0)
			},

			getTypeList() {
				this.$request.httpRequest({
					method: 'get',
					url: "/member_house/suggestion/sugBusList",
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

			getData(times,event) {
				if(event){
					this.currentPage = 1;
				}
				this.tableLoading = true;
				setTimeout(() => {
					this.$request.httpRequest({
						method: 'get',
						url: "/member_house/performance/memberPerformanceCount",
						noLoading: true,
						params: {
							name: this.searchForm.name,
							groupId: this.searchForm.groupId,
							startAt: this.searchForm.startAt,
							endAt: this.searchForm.endAt,


							page: this.currentPage,
							size: this.pageSize,
						},
						success: data => {
							this.dealData = [];
							this.tableData = data.content;
							this.total = data.totalElements;
							this.tableLoading = false;
							if(this.tableData) {
								this.dealTableData();
							}
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

			dealTableData() {
				for (let i = 0; i < this.tableData.length; i++) {
					let count = this.tableData[i].count;
					let obj = {name: this.tableData[i].name};
					if (count) {
						for (let j = 0; j < count.length; j++) {
							let name = 'count' + j;
							if (i === 0) {
								this.tableHeader[name] = count[j].name;
							}
							obj[name] = count[j].count;
						}
					}
					this.dealData.push(obj);
				}
			},

			exportData(type) {
				let size = type === "0" ? this.pageSize : 9999;
				let page = type === "0" ? this.currentPage : 1;
				let params = {
					name: this.searchForm.name,
					groupId: this.searchForm.groupId,
					startAt: this.searchForm.startAt,
					endAt: this.searchForm.endAt,
					page: page,
					size: size,
				};

				exportExcel(this.API.ExportPerformanceCount, params, this);
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
		}
		,
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
