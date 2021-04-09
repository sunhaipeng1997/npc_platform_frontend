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
										<el-form-item label="文件名">
											<el-input placeholder="请输文件名称"
											          size="mini"
											          v-model="searchForm.name"></el-input>
										</el-form-item>
									</el-col>
									<el-col :span="6">
										<el-form-item label="文件类型"
										              size="mini">
											<el-select v-model="searchForm.uid"
											           placeholder="请选择文件类型">
												<el-option label="全部"
												           value=""></el-option>
												<el-option
														v-for="(item,index) in typeList"
														:label="item.name"
														:value="item.uid">
												</el-option>
											</el-select>
										</el-form-item>
									</el-col>
									<el-col :span="6">
										<el-form-item label="状态"
													  size="mini">
											<el-select v-model="searchForm.status"
													   placeholder="请选择状态">
												<el-option label="全部"
														   value=""></el-option>
												<el-option label="启用"
														   value="1"></el-option>
												<el-option label="未启用"
														   value="2"></el-option>
											</el-select>
										</el-form-item>
									</el-col>
								</el-row>
							</el-col>
							<el-col :span="6">
								<el-button type="primary"
								           size="mini"
								           @click="getData(0,$event)">搜索
								</el-button>
								<el-button type="primary"
								           size="mini"
								           @click="addType">添加
								</el-button>
							</el-col>

						</el-row>
					</el-form>
				</div>

				<!--表-->
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
					<el-table-column v-for="(item,index) in tableHeader" show-overflow-tooltip  show-overflow-tooltip
					                 :key="index"
					                 :prop="index"
					                 sortable
					                 :label="item"
					                 align="center" />
					<el-table-column label="操作"
					                 width="230"
					                 align="center"
					                 class-name="operation">
						<template slot-scope="scope">
							<a v-if="$route.meta.edit"
							   class="item"
							   @click="updateType(scope.row)">修改</a>
							<a v-if="$route.meta.edit && scope.$index == 0"
							   class="item-gray">上移</a>
							<a v-if="$route.meta.edit && scope.$index != 0"
							   class="item"
							   @click="changeSequence(scope.row,1)">上移</a>
							<a v-if="$route.meta.edit && scope.$index+1 == tableData.length"
							   class="item-gray">下移</a>
							<a v-if="$route.meta.edit && scope.$index+1 != tableData.length"
							   class="item"
							   @click="changeSequence(scope.row,2)">下移</a>
							<a v-if="$route.meta.edit && scope.row.status == 2" class="item-warning" @click="changeStudyStatus(scope.row,1)">启用</a>
							<a v-if="$route.meta.edit && scope.row.status == 1" class="item-success" @click="changeStudyStatus(scope.row,2)">停用</a>
							<a v-if="$route.meta.delete" class="item-danger" @click="deleteStudy(scope.row)">删除</a>
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

				<!--添加修改弹框-->
				<el-dialog :title="form.title"
						   :before-close="handleClose"
				           :visible.sync="addFormVisible">
					<el-form :model="form"
					         :rules="rules"
					         ref="form">
						<el-form-item label="文件名称"
						              :label-width="formLabelWidth"
						              prop="name">
							<el-col :span="12">
								<el-input v-model="form.name"
								          autocomplete="off"></el-input>
							</el-col>
						</el-form-item>

						<el-form-item label="文件类型"
						              :label-width="formLabelWidth"
						              prop="type"
						>
							<el-select v-model="form.type"
							           placeholder="请选择">
								<el-option
										v-for="item in typeList"
										:key="item.uid"
										:label="item.name"
										:value="item.uid">
								</el-option>
							</el-select>
						</el-form-item>

						<el-form-item label="文件说明"
						              :label-width="formLabelWidth">
							<el-input type="textarea"
							          v-model="form.remark"
							          autocomplete="off"></el-input>
						</el-form-item>
						<el-form-item label="上传文件"
						              :label-width="formLabelWidth">
							<el-upload
									class="upload-demo"
									ref="upload"
									:action="this.API.ServerUrl + '/api/manager/study/uploadStudyFile'"
									:accept="'.pdf,.excel,.xls,.word,.dox,.docx,.ppt'"
									drag
									:before-upload="handleBeforeUpload"
									:on-success="getFileUrl"
									:on-preview="handlePreview"
									:on-remove="handleRemove"
									:on-change="handleChange"
									:on-exceed="handleExceed"
									prop="file"
									:file-list="fileList">
								<i class="el-icon-upload"></i>
								<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
								<!--
								<el-button slot="trigger"
								           size="small"
								           type="primary">选取文件
								</el-button>
								<el-button style="margin-left: 10px;"
								           size="small"
								           type="success"
								           @click="submitUpload">上传到服务器
								</el-button>
								-->
								<div slot="tip"
								     class="el-upload__tip">{{formTip}}
								</div>
							</el-upload>
						</el-form-item>
					</el-form>
					<div slot="footer"
					     class="dialog-footer">
						<el-button @click="resetForm('form')">取 消</el-button>
						<el-button type="primary"
						           @click="addOrUpdateStudy('form')">确 定
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
				tableHeader: {
					name: '文件名',
					typeName: '文件类型',
					remark: '文件说明',
					sequence: "排序",
				},
				tableData: [],
				studyType: "",

				typeList: [],

				// 测试数据
				testData: [],

				searchForm: {
					name: "",
					uid: "",
					status:""
				},
				pageSize: 20,
				currentPage: 1,
				total: 0,

				// 文件上传
				fileList: [],
				canUpdateSequence: false,
				addFormVisible: false,
				formLabelWidth: '100px',

				uploadImageServer: this.API.UploadImage,

				form: {
					title: '',
					uid: '',
					name: '',
					type: '',
					remark: '',
					url: '',
				},
				formTip: '只能上传pdf文件',
				rules: {
					name: [
						{
							required: true,
							message: '文件名称不能为空',
							trigger: 'blur'
						}],
					type: [
						{
							required: true,
							message: '必须选择文件类型',
							trigger: 'blur'
						}],
					remark: [
						{
							max: 200,
							message: '长度在 200 个字符以内',
							trigger: 'blur'
						}],
					file: [
						{
							required: true,
							message: '必须上传文件',
							trigger: 'blur'
						}],
				},
				fileType:[
					'application/msword',
					'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
					'application/vnd.ms-powerpoint',
					'application/vnd.openxmlformats-officedocument.presentationml.presentation',
					'application/vnd.ms-excel',
					'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
					'application/pdf'
				]
			};
		},
		mounted() {
			this.getData(0);
			this.getType();
		},
		methods: {
			handleClose() {
				this.$confirm('确认关闭？')
						.then(_ => {
							this.resetForm('form');
						})
						.catch(_ => {});
			},
			handleCurrentChange(val) {
				this.currentPage = val;
				this.getData(0);
			},
			handleSizeChange(val) {
				this.pageSize = val;
				this.getData(0);
			},

			// 获取学习文件
			getData(times,event) {
				if(event){
					this.currentPage = 1;
				}
				this.tableLoading = true;
				setTimeout(() => {
					this.$request.httpRequest({
						method: 'get',
						url: "/manager/study/findStudy",
						noLoading: true,
						params: {
							name: this.searchForm.name,
							status: this.searchForm.status,
							studyType: this.searchForm.uid,
							page: this.currentPage,
							size: this.pageSize,
							property: 'sequence',
							direction: 'asc'
						},
						success: data => {
							this.tableData = data.content;
							this.total = data.totalElements;
							this.tableLoading = false;
							if (this.searchForm.uid) {
								this.canUpdateSequence = true;
							} else {
								this.canUpdateSequence = false;
							}
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

			// 获取类型下拉列表
			getType() {
				this.tableLoading = true;
				setTimeout(() => {
					this.$request.httpRequest({
						method: 'get',
						url: "/manager/study/studyTypeList",
						noLoading: true,
						success: data => {
							this.typeList = data;
						},
						error: e => {
							this.tableLoading = false;
						}
					});
				});
			},

			addType() {
				this.form.title = '添加文件';
				this.showForm();
			},

			updateType(item) {
				this.formTip = '已有文件上传';
				this.form.title = '修改类型';
				this.form.uid = item.uid;
				this.form.name = item.name;
				this.form.type = item.type;
				this.form.remark = item.remark;
				this.form.url = item.url;
				this.showForm();
			},

			handleDialogClose() {
				this.form = {
					title: '',
					uid: '',
					name: '',
					type: '',
					remark: '',
					url: '',
				};
				this.formTip = '只能上传pdf文件';
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
							message: status == 1 ? '启用成功!' : '停用成功'
						});
						this.getData();
					},
					error: e => {
						this.$message({
							type: 'warning',
							message: status == 1 ? '启用失败!' : '停用失败'
						});
						this.getData();
					}
				});
			},

			deleteType(row) {
				this.$confirm('确认删除该类型吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				})
				    .then(() => {
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
							    this.$message({
								    type: 'warning',
								    message: '删除失败!'
							    });
							    this.getData();
						    }
					    });
				    })
				    .catch(() => {
					    this.$message({
						    type: 'info',
						    message: '已取消删除'
					    });
				    });
			},

			resetForm(formName) {
				this.$refs[formName].resetFields();
				this.form.title = '';
				this.form.uid = '';
				this.form.name = '';
				this.form.type = '';
				this.form.remark = '';
				this.form.url = '';
				this.fileList = [];
				this.addFormVisible = false;
			},

			// 文件上传相关
			submitUpload() {
				this.$refs.upload.submit();
				console.log(this.fileList);
			},
			handleBeforeUpload(file) {
				const isLt25M = file.size / 1024 / 1024 < 25;
				if (this.fileType.indexOf(file.type) == -1) {
					this.$message.error('只能上传office支持的文件!');
				}
				if (!isLt25M) {
					this.$message.error('文件大小不能超过 25MB!');
					this.fileList = [];
				}
			},
			handleRemove(file, fileList) {
				console.log(file, fileList);
			},
			handleChange(file, fileList) {
				if (fileList.length > 0) this.fileList = [fileList[fileList.length - 1]];
			},
			handlePreview(file) {
				console.log(file);
			},
			handleExceed(file, fileList) {
				// this.fileList = [];
				// this.fileList.push(file);
				// console.log(this.fileList);
			},

			// 获取上传后文件返回路径
			getFileUrl(res, file, fileList) {
				this.form.url = res.data.url;
			},

			// 添加or修改文件
			addOrUpdateStudy(formName) {
				let that = this;

				this.$refs[formName].validate((valid) => {
					if (valid) {
						if (this.form.url == '') {
							this.$message('必须上传文件!');
							return;
						}
						that.$request.httpRequest({
							method: 'post',
							url: "/manager/study/addOrUpdateStudy",
							noLoading: true,
							params: {
								uid:that.form.uid,
								studyType: that.form.type,
								name: that.form.name,
								remark: that.form.remark,
								url: that.form.url,
							},
							success: data => {
								this.$message({
									type: 'success',
									message: that.form.uid ? '修改成功!' : '添加成功!'
								});
								this.fileList = [];
								that.resetForm('form');
								that.getData();
							},
							error: e => {
								this.$message({
									type: 'warning',
									message: (this.form.uid ? '修改失败! ' : '添加失败! ') + e.message
								});
							}
						});
					} else {
						return false;
					}
				});
			},

			// 删除文件
			deleteStudy(row) {
				this.$confirm('确认删除该文件吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				})
				    .then(() => {
					    this.$request.httpRequest({
						    method: 'delete',
						    url: "/manager/study/deleteStudy",
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
							    this.$message({
								    type: 'warning',
								    message: '删除失败!'
							    });
							    this.getData();
						    }
					    });
				    })
				    .catch(() => {
					    this.$message({
						    type: 'info',
						    message: '已取消删除'
					    });
				    });
			},

			// 修改排序
			changeSequence(row, type) {
				if (!this.canUpdateSequence) {
					this.$message({
						type: 'warning',
						message: '按类型筛选后才能修改排序!'
					});
					return;
				}
				this.$request.httpRequest({
					method: 'post',
					url: "/manager/study/changeStudySequence",
					noLoading: true,
					params: {
						uid: row.uid,
						type: type,
						studyType: this.searchForm.uid,
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
				});
			},

			// 更改文件状态
			changeStudyStatus(row, status) {
				this.$request.httpRequest({
					method: 'post',
					url: "/manager/study/changeStudyStatus",
					noLoading: true,
					params: {
						uid: row.uid,
						status: status
					},
					success: data => {
						this.$message({
							type: 'success',
							message: status == 1 ? '启用成功!' : '停用成功'
						});
						this.getData();
					},
					error: e => {
						this.$message({
							type: 'warning',
							message: status == 1 ? '启用失败!' : '停用失败'
						});
						this.getData();
					}
				});
			},

		}
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


</style>
