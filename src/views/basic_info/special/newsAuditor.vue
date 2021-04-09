<template>
	<div class="table-demo">
		<el-card class="list-content"
		         shadow="hover">
			<template v-if="$route.meta.check">
				<!--content-->
				<div class="block">


					<el-row>
						<div>
							<el-col :span="4"
							        :offset="8">
								<p class="demonstration ">设置新闻发布审核人员:

								</p></el-col>
							<el-col :span="8">
								<el-cascader
										:show-all-levels="false"
										:options="options"
										:props="props"
										@change="setUids"
										v-model="modalNews"
										@visible-change="handleChange(2,$event)"
										@remove-tag="handleRemove(2,$event)"

								></el-cascader>
							</el-col>
						</div>
					</el-row>




				</div>

				<!--履职登记审核人员-->
				<el-dialog :title="'设置'+formData.name+'审核人员'"
				           :visible.sync="addFormVisible">
					<el-form :model="form"
					         :rules="rules"
					         ref="form">

						<el-form-item label="具体人员"
						              :label-width="formLabelWidth">
							<el-cascader
									v-model="form.personUid"
									:options="formData.members"

									:props="{ expandTrigger: 'hover',label:'name',value:'uid' }"
									@change="handleChange"></el-cascader>
						</el-form-item>
					</el-form>
					<div slot="footer"
					     class="dialog-footer">
						<el-button @click="formCancel">取 消</el-button>
						<el-button type="primary"
						           @click="formSubmit">确 定
						</el-button>
					</div>
				</el-dialog>

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
	export default {
		data() {
			return {
				tableLoading: false,

				dialogVisible: false,

				value: [],
				labels: [
					'设置新闻发布审核人员',],
				options: [],
				groupAuditValue: '',
				groupAudit: [],
				groupNow: [],

				isGroupAudit: true,
				pageSize: 20,
				currentPage: 1,
				total: 0,

				addFormVisible: false,
				formLabelWidth: '100px',
				form: {
					index: '',
					townUid: '',
					personUid: '',
				},
				rules: {
					name: [
						{
							required: true,
							message: '类型名称不能为空',
							trigger: 'blur'
						}],
					remark: [
						{
							max: 200,
							message: '长度在 200 个字符以内',
							trigger: 'blur'
						}]
				},
				checkedUids: [],
				data: [],

				props: {
					multiple: true,
					expandTrigger: 'hover',
					label: 'name',
					value: 'uid',
					children: 'members'
				},
				settingConfig: '',
				modalAdvice: '',
				modalNotification: '',
				modalNews: '',
				modalPerformance: '',
				uids: [],
				formData: '',
			};
		},
		mounted() {
			this.getNpcMemberList();
			this.getSettings();
		},
		methods: {
			setUids(value) {
				this.uids = [];
				value.forEach(item => {
					this.uids.push(item[1]);
				});
			},

			handleChange(index, value) {
				if (value == false) {
					if (this.uids.length === 0) return;
					switch (Number(index)) {
						case 0:
							this.$confirm('是否确认更改建议接收人?', {
								confirmButtonText: '确定',
								cancelButtonText: '取消',
								type: 'warning'
							})
							    .then(() => {
								    this.setAdviceReveiver();
								    this.$message({
									    type: 'success',
									    message: '更改成功!'
								    });
							    })
							    .catch(() => {
							    	this.getSettings()
								    this.$message({
									    type: 'info',
									    message: '已取消'
								    });
							    });
							break;
						case 1:
							this.$confirm('是否确认更改通知审核人?', {
								confirmButtonText: '确定',
								cancelButtonText: '取消',
								type: 'warning'
							})
							    .then(() => {
								    this.setNotificationAuditor();
								    this.$message({
									    type: 'success',
									    message: '更改成功!'
								    });
							    })
							    .catch(() => {
							    	this.getSettings()
								    this.$message({
									    type: 'info',
									    message: '已取消'
								    });
							    });
							break;
						case 2:
							this.$confirm('是否确认更改新闻发布审核人?', {
								confirmButtonText: '确定',
								cancelButtonText: '取消',
								type: 'warning'
							})
							    .then(() => {
								    this.setNewsAuditor();
								    this.$message({
									    type: 'success',
									    message: '更改成功!'
								    });
							    })
							    .catch(() => {
							    	this.getSettings()
								    this.$message({
									    type: 'info',
									    message: '已取消'
								    });
							    });
							break;
						case 3:
							this.$confirm('是否确认更改履职登记审核人?', {
								confirmButtonText: '确定',
								cancelButtonText: '取消',
								type: 'warning'
							})
							    .then(() => {
								    this.setPerformanceAuditorManager();
								    this.$message({
									    type: 'success',
									    message: '更改成功!'
								    });
							    })
							    .catch(() => {
							    	this.getSettings()

							    });
							break;

					}
				}
			},

			handleRemove(index, value) {
				switch (Number(index)) {
					case 0:
						if (this.modalAdvice.length == 1) {
							this.$alert('至少需要一位审核人', {
								confirmButtonText: '确定',
								type: 'warning',
								callback: action => {
								}
							});
							this.getSettings();
							return;
						}

						this.$confirm('是否确认更改建议接收人?', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						})
						    .then(() => {
							    this.setUids(this.modalAdvice);

							    this.setAdviceReveiver();
							    this.$message({
								    type: 'success',
								    message: '更改成功!'
							    });
						    })
						    .catch(() => {
							    this.getSettings();
							    console.log(this.modalAdvice);
							    this.$message({
								    type: 'info',
								    message: '已取消'
							    });
						    });
						break;
					case 1:
						if (this.modalNotification.length == 1) {
							this.$alert('至少需要一位审核人', {
								confirmButtonText: '确定',
								type: 'warning',
								callback: action => {
								}
							});
							this.getSettings();
							return;
						}
						this.$confirm('是否确认更改通知审核人?', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						})
						    .then(() => {
							    this.setUids(this.modalNotification);

							    this.setNotificationAuditor();
							    this.$message({
								    type: 'success',
								    message: '更改成功!'
							    });
						    })
						    .catch(() => {
							    this.getSettings();
							    this.$message({
								    type: 'info',
								    message: '已取消'
							    });
						    });
						break;
					case 2:
						if (this.modalNews.length == 1) {
							this.$alert('至少需要一位审核人', {
								confirmButtonText: '确定',
								type: 'warning',
								callback: action => {
								}
							});
							this.getSettings();
							return;
						}
						this.$confirm('是否确认更改新闻发布审核人?', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						})
						    .then(() => {
							    this.setUids(this.modalNews);

							    this.setNewsAuditor();
							    this.$message({
								    type: 'success',
								    message: '更改成功!'
							    });
						    })
						    .catch(() => {
							    this.getSettings();
							    this.$message({
								    type: 'info',
								    message: '已取消'
							    });
						    });
						break;
					case 3:
						if (this.modalPerformance.length == 1) {
							this.$alert('至少需要一位审核人', {
								confirmButtonText: '确定',
								type: 'warning',
								callback: action => {
								}
							});
							this.getSettings();
							return;
						}
						this.$confirm('是否确认更改履职登记审核人?', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						})
						    .then(() => {
							    this.setUids(this.modalPerformance);

							    this.setPerformanceAuditorManager();
							    this.$message({
								    type: 'success',
								    message: '更改成功!'
							    });
						    })
						    .catch(() => {
							    this.getSettings();
							    this.$message({
								    type: 'info',
								    message: '已取消'
							    });
						    });
						break;

				}

			},

			// 小组审核开关
			handleSwitch() {
				if (this.isGroupAudit) {
					this.$confirm('是否开启小组审核人员?', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					})
					    .then(() => {
						    this.setAuditorSwitcher();
						    this.$message({
							    type: 'success',
							    message: '已开启小组审核人员'
						    });
						    this.getSettings();
					    })
					    .catch(() => {
						    this.isGroupAudit = !this.isGroupAudit;
						    this.$message({
							    type: 'info',
							    message: '取消操作'
						    });
					    });
				} else {
					this.$confirm('是否关闭小组审核人员?', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					})
					    .then(() => {
						    this.setAuditorSwitcher();
						    this.$message({
							    type: 'success',
							    message: '已关闭小组审核人员'
						    });
					    })
					    .catch(() => {
						    this.isGroupAudit = !this.isGroupAudit;
						    this.$message({
							    type: 'info',
							    message: '取消操作'
						    });
					    });
				}
			},

			// 模态框处理
			showForm(i) {
				this.addFormVisible = true;
				this.formData = this.options[i];
				this.form.townUid = this.options[i].uid;
			},

			formCancel(e) {
				this.addFormVisible = false;
			},

			formSubmit() {
				this.setPerformanceTownAuditor();
			},

			// 审核人员列表
			getNpcMemberList(times) {
				this.tableLoading = true;
				setTimeout(() => {
					this.$request.httpRequest({
						method: 'get',
						url: "/manager/member/npcMemberList",
						noLoading: true,
						params: {

							page: this.currentPage,
							size: this.pageSize,
							property: 'createTime',
							direction: 'desc'
						},
						success: data => {
							this.tableLoading = false;

							this.options = data;

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
					});
				});
			},

			// 获取之前设置好的特殊职能代表
			getSettings(times) {
				this.tableLoading = true;
				setTimeout(() => {
					this.$request.httpRequest({
						method: 'get',
						url: "/member_house/special_function/getSettings",
						noLoading: true,
						params: {

							page: this.currentPage,
							size: this.pageSize,
							property: 'createTime',
							direction: 'desc'
						},
						success: data => {
							this.tableLoading = false;
							this.settingConfig = data;
							this.isGroupAudit = data.SWITCHS;
							this.modalAdvice = data.SUGGESTION_RECEIVER;
							this.modalNotification = data.NOTICE_AUDITOR;
							this.modalNews = data.NEWS_AUDITOR;
							this.modalPerformance = data.PERFORMANCE_GENERAL_AUDITOR;
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
					});
				});
			},





			// 设置新闻发布审核人
			setNewsAuditor(times) {
				this.tableLoading = true;
				setTimeout(() => {
					this.$request.httpRequest({
						method: 'post',
						url: "/member_house/special_function/newsAuditor",
						noLoading: true,
						params: {
							uids: this.uids
						},
						success: data => {
							this.tableLoading = false;
							if (times == 0) {
								this.$message({
									type: 'success',
									message: '新闻发布审核人设置成功'
								});
							}
						},
						error: e => {
							this.tableLoading = false;

						}
					});
				});
			},







		}
	};
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

	.table-img {
		width: 80px;
		height: 80px;
	}

	.showForm p {
		margin: 0;
	}

	.block {
		max-width: 1200px;
		min-width: 950px;
	}

	.demonstration {
		text-align: right;
		margin-right: 10px;
		font-size: 13px
	}

	.el-col {
		margin-bottom: 20px;
	}

	.el-button {
		margin-bottom: 10px;
	}
</style>
