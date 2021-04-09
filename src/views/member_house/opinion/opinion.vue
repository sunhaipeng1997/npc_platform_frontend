<template>
	<div class="table-demo">
		<el-card class="list-content"
		         shadow="hover">
			<template v-if="$route.meta.check">
				<!--搜索条-->
				<div class="searchBar">
					<el-form ref="form"
					         :model="searchForm"
					         label-width="80px">
						<el-row :gutter="50">
							<el-col :span="18">
								<el-row :gutter="20">
									<el-col :span="6">
										<el-form-item label="手机号">
											<el-input placeholder="请输入提议人手机号"
											          size="mini"
											          v-model="searchForm.mobile"></el-input>
										</el-form-item>
									</el-col>
									<el-col :span="6">
										<el-form-item label="接受人">
											<el-input placeholder="请输入接受人"
											          size="mini"
											          v-model="searchForm.memberName"></el-input>
										</el-form-item>
									</el-col>
								</el-row>
							</el-col>
							<el-col :span="6">
								<el-col :span="5">
									<el-button type="primary"
									           size="mini"
									           @click="getData(0,$event)">搜索
									</el-button>
								</el-col>
								<el-col :span="5">
									<el-dropdown size="mini"
									             @command="exportOpinion">
										<el-button type="primary"
										           size="mini">导出<i class="el-icon-arrow-down el-icon--right"></i>
										</el-button>
										<el-dropdown-menu slot="dropdown">
											<el-dropdown-item command="0">导出本页</el-dropdown-item>
											<el-dropdown-item command="1">导出全部</el-dropdown-item>
										</el-dropdown-menu>
									</el-dropdown>
								</el-col>
							</el-col>
						</el-row>
					</el-form>
				</div>
				<!--表格-->
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
					/>
					<el-table-column label="操作"
					                 width="180"
					                 align="center"
					                 class-name="operation">
						<template slot-scope="scope">
							<a @click.prevent=""
							   class="item"
							   @click="viewDetail(scope.row)">查看详情</a>
							<a class="item-danger"
							   @click.prevent="deleteOpinion(scope.row)">删除</a>
							<el-dialog :visible.sync="dialogVisible"
							           style="text-align: left;height: 90%;">
								<el-row>
									<el-col :span="12">
										<div class="grid-content ">
											<el-form ref="form"
											         class="dialog-left showForm"
											         :model="form"
											         label-width="80px">
												<el-form-item label="提出时间">
													<p>{{form.createTime}}</p>

												</el-form-item>
												<el-form-item label="提议人">
													<p>{{form.senderName}}</p>
												</el-form-item>
												<el-form-item label="提出地点">
													<p>{{form.senderAddress}}</p>
												</el-form-item>
												<el-form-item label="接收人">
													<p>{{form.memberName}}</p>
												</el-form-item>

												<el-form-item label="意见内容">
													<el-input type="textarea"
													          readonly
													          v-model="form.contents">{{form.contents}}
													</el-input>
												</el-form-item>

												<el-form-item label="附件图片">
													<div class="demo-image">
														<div class="block"
														     v-for="item in form.images"
														     :key="item">
															<el-image :src= "API.ServerUrl+item" style="width: 120px; height:120px;margin-right: 10px" ></el-image>
														</div>
													</div>
												</el-form-item>
											</el-form>
										</div>
									</el-col>
									<el-col :span="12">
										<div class="grid-content ">
											<span v-if="form.status==1">暂无回复</span>
											<el-timeline v-else>
												<el-timeline-item
														v-for="(activity, index) in form.replayVoList"
														:key="index"
														:timestamp="activity.time">
													{{activity.content}}
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

							<!--	<el-button type="danger"
													 v-if="$route.meta.delete"
													 @click="deleteItem(scope.$index)"
													 v-popover:popover1
								>
									删除
								</el-button>-->

						</template>
					</el-table-column>
				</el-table>


				<!--分页-->
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
	import {exportExcel} from "@/assets/utils/exportExcel";

	export default {
		data() {
			return {
				tableLoading: false,
				tableHeader: {
					createTime: '时间',
					senderName: '提议人',
					mobile: '提议人手机号',
					memberName: '接受人',
					contents: '意见内容',
					unitName: '意见地点'
				},
				tableData: [],

				dialogVisible: false,
				activities: [
					{
						content: '活动按期开始',
						timestamp: '2018-04-15',
					},
					{
						content: '通过审核',
						timestamp: '2018-04-13',
					},
					{
						content: '创建成功',
						timestamp: '2018-04-11',
					},
					{
						content: '创建成功',
						timestamp: '2018-04-11',
					},
					{
						content: '创建成功',
						timestamp: '2018-04-11',
					},
					{
						content: '创建成功',
						timestamp: '2018-04-11',
					},
					{
						content: '创建成功',
						timestamp: '2018-04-11',
					},
				],

				form: {
					createTime: '',
					senderName: '',
					memberName: '',
					contents: '',
				},

				url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',

				searchForm: {
					senderName: "",
					memberName: "",
					mobile: null,
				},
				pageSize: 20,
				currentPage: 1,
				total: 0,
			};
		},
		mounted() {
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

			// 请求数据
			getData(times,event) {
				if(event){
					this.currentPage = 1;
				}
				this.tableLoading = true;
				setTimeout(() => {
					this.$request.httpRequest({
						method: 'get',
						url: "/member_house/opinion/opinionPage",
						noLoading: true,
						params: {

							memberName: this.searchForm.memberName,
							mobile: this.searchForm.mobile,

							page: this.currentPage,
							size: this.pageSize,
							property: 'createTime',
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
							this.$message({
								type: 'warning',
								message: '查询失败!',
							});

						},
					});
				});
			},

			//导出意见，type: 0 导出本页； 1 导出全部
			exportOpinion(type) {
				let size = type === "0" ? this.pageSize : 9999;
				let page = type === "0" ? this.currentPage : 1;
				let params = {
					memberName: this.searchForm.memberName,
					mobile: this.searchForm.mobile,
					page: page,
					size: size,
					property: 'createTime',
					direction: 'desc',
				};

				exportExcel(this.API.ExportOpinion, params, this);
			},

			// 查看详情
			viewDetail(row) {
				this.dialogVisible = true;
				this.form = row;
			},

			// 打开模态框, 查看大图
			open(url) {
				this.$alert('<img class="" src="' + url + '" alt="">', '标题名称', {
					confirmButtonText: '确定',
					dangerouslyUseHTMLString: true,
				});
			},

			// 删除意见
			deleteOpinion(row) {
				this.$confirm('确认删除该意见吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
				})
					.then(() => {
						this.$request.httpRequest({
							method: 'delete',
							url: "/member_house/opinion/deleteOpinion",
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
								this.tableLoading = false;
								this.$message({
									type: 'warning',
									message: '删除失败!',
								});

							},
						});
					});

			},

		},
	};
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

	.table-img {
		width: 80px;
		height: 80px;
	}

	.showForm p {
		margin: 0;
	}

</style>
