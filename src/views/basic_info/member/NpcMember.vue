<template>
	<div class="table-demo">
		<el-card class="list-content"
		         shadow="hover">
			<template v-if="$route.meta.check">
				<div class="searchBar">
					<el-form ref="form"
					         :model="searchForm"
					         label-width="80px">
						<el-row :gutter="20">
							<el-col :span="18">
								<el-row :gutter="20">
									<el-col :span="6">
										<el-form-item label="代表姓名">
											<el-input placeholder="代表姓名"
											          size="mini"
											          v-model="searchForm.name"></el-input>
										</el-form-item>
									</el-col>
									<el-col :span="6">
										<el-form-item label="手机号码">
											<el-input placeholder="代表手机号"
											          size="mini"
											          v-model="searchForm.mobile"></el-input>
										</el-form-item>
									</el-col>
									<el-col :span="12">
										<el-form-item label="出生日期">
											<el-col :span="10">
												<el-date-picker type="date"
												                value-format="yyyy-MM-dd"
												                size="mini"
												                placeholder="选择开始日期"
												                v-model="searchForm.bornDateStart"
												                style="width: 100%;"></el-date-picker>
											</el-col>
											<!-- <el-col class="line el-col-md-offset-1" :span="1"><b>至</b></el-col>
											 <el-col :span="10">
												 <el-date-picker type="date" value-format="yyyy-MM-dd" size="mini"
																 placeholder="选择结束日期"
																 v-model="searchForm.bornDateEnd"
																 style="width: 100%;"></el-date-picker>
											 </el-col>-->
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
								           @click="addNpcMember">添加
								</el-button>
							</el-col>

							<el-col :span="18">
								<el-row :gutter="20">
									<el-col :span="6">
										<el-form-item label="职务类型">
											<el-select v-model="searchForm.jobType"
											           placeholder="职务类型"
											           size="mini">
												<el-option label="全部"
												           value=""></el-option>
												<el-option
														v-for="item in jobTypeOptions"
														:key="item.uid"
														:label="item.name"
														:value="item.uid">
												</el-option>
											</el-select>
										</el-form-item>
									</el-col>
									<el-col :span="6">
										<el-form-item label="所属分组"
										              prop="workUnit"
										              size="mini">
											<el-select v-model="searchForm.workUnit"
											           placeholder="请选择">
												<el-option label="全部"
												           value=""></el-option>
												<el-option
														v-for="item in workUnitOptions"
														:key="item.uid"
														:label="item.name"
														:value="item.uid"
												>
												</el-option>
											</el-select>
										</el-form-item>
									</el-col>
									<el-col :span="6">
										<el-form-item label="任职届期">
											<el-select v-model="searchForm.sessionUid"
											           placeholder="任职届期"
											           size="mini"
													   @change="getData(0)">
												<el-option label="全部"
												           value=""></el-option>
												<el-option
														v-for="item in sessionOptions"
														:key="item.uid"
														:label="item.name"
														:value="item.uid"
												>
												</el-option>
											</el-select>
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
					<el-table-column v-for="(item,variable,index) in tableHeader"
					                 v-if="index < 1"
					                 :key="variable"
					                 :prop="variable"
					                 sortable
					                 :label="item"
					                 align="center" />
					<el-table-column label="头像"
					                 align="center">
						<template slot-scope="scope"
						          v-if="scope.row.avatar">
							　　　　<img :src="API.ServerUrl+scope.row.avatar"
							         width="120"
							         height="160"
							         class="head_pic" />
							　　
						</template>
					</el-table-column>
					<el-table-column v-for="(item,variable,index) in tableHeader"
					                 v-if="index > 1 && index < 6"
					                 :key="variable"
					                 :prop="variable"
					                 sortable
					                 :label="item"
					                 align="center" />
					<el-table-column label="任职届期"
					                 align="center">
						　　
						<template slot-scope="scope"
						          v-if="scope.row.sessions">
							　　
							<div v-for="(item,ind) in scope.row.sessions">
								<span v-if="ind < 5">{{item.name}}</span>
								<span v-if="ind == 5">...</span>
							</div>
							　　
						</template>
					</el-table-column>
					<el-table-column v-for="(item,variable,index) in tableHeader"
					                 v-if="index >6"
					                 :key="variable"
					                 :prop="variable"
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
							   @click="updateMember(scope.row)">修改</a>
							<a v-if="$route.meta.delete"
							   class="item-danger	"
							   @click="deleteMember(scope.row)">删除</a>
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

		<!--添加代表对话框-->
		<el-dialog :title="title"
		           :visible.sync="addMemberDialogVisible"
		           width="45%"
				   :before-close="handleClose"
		           top="50px">
			<el-form :model="addForm"
			         :rules="rules"
			         ref="addForm"
			         label-position="right"
			         label-width="100px">
				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item size="mini"
						              label="代表姓名"
						              prop="name">
							<div style="width: 250px">
								<el-input v-model="addForm.name"></el-input>
							</div>
						</el-form-item>
						<el-form-item size="mini"
						              label="性别"
						              prop="gender">
							<el-radio-group v-model="addForm.gender">
								<el-radio :label=1>男</el-radio>
								<el-radio :label=2>女</el-radio>
							</el-radio-group>
						</el-form-item>
						<el-form-item size="mini"
						              label="联系方式"
						              prop="mobile">
							<div style="width: 250px">
								<el-input v-model="addForm.mobile"></el-input>
							</div>
						</el-form-item>
						<el-form-item size="mini"
						              label="代表证号"
						              prop="code">
							<div style="width: 250px">
								<el-input v-model="addForm.code"></el-input>
							</div>
						</el-form-item>
						<el-form-item size="mini"
						              label="身份证号"
						              prop="idcard">
							<div style="width: 250px">
								<el-input v-model="addForm.idcard"></el-input>
							</div>
						</el-form-item>
						<el-form-item size="mini"
						              label="出生日期"
						              prop="bornAt">
							<el-date-picker
									v-model="addForm.bornAt"
									value-format="yyyy-MM-dd"
									placeholder="选择日期">
							</el-date-picker>
						</el-form-item>
						<el-form-item size="mini"
						              label="民族"
						              prop="nation">
							<el-select v-model="addForm.nation"
							           placeholder="请选择">
								<el-option
										v-for="item in nationOptions"
										:key="item.uid"
										:label="item.name"
										:value="item.uid"
								>
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item size="mini"
						              label="任职类别"
						              prop="jobType">
							<el-select v-model="addForm.jobType"
							           placeholder="请选择">
								<el-option
										v-for="item in jobTypeOptions"
										:key="item.uid"
										:label="item.name"
										:value="item.uid">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="代表头像"
						              prop="avatar"
						              style="margin-bottom: 40px;">
							<el-upload
									class="avatar-uploader"
									:action=uploadImageServer
									:show-file-list="false"
									:on-success="handleAvatarSuccess"
									:before-upload="beforeAvatarUpload"
									:auto-upload="true"
									accept=".jpg,.jpeg,.png"
							>
								<div class="setBorder">
									<img v-if="addForm.avatar"
									     :src="this.API.ServerUrl + addForm.avatar"
									     class="avatar">
									<i v-else
									   class="el-icon-plus avatar-uploader-icon"></i>
								</div>
								<div slot="tip"
								     class="el-upload__tip">只能上传jpg/png文件，且不超过2MB
								</div>
							</el-upload>
						</el-form-item>
						<el-form-item size="mini"
						              label="文化程度"
						              prop="education">
							<el-select v-model="addForm.education"
							           placeholder="请选择">
								<el-option
										v-for="item in educationOptions"
										:key="item.uid"
										:label="item.name"
										:value="item.uid"
								>
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item size="mini"
						              label="所属分组"
						              prop="workUnit">
							<el-select v-model="addForm.workUnit"
							           placeholder="请选择">
								<el-option
										v-for="item in workUnitOptions"
										:key="item.uid"
										:label="item.name"
										:value="item.uid"
								>
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item size="mini"
						              label="政治面貌"
						              prop="political">
							<el-select v-model="addForm.political"
							           placeholder="请选择">
								<el-option
										v-for="item in politicalOptions"
										:key="item.uid"
										:label="item.name"
										:value="item.uid"
								>
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-form-item size="mini"
				              label="代表简介"
				              prop="remark">
					<el-input type="textarea"
					          v-model="addForm.remark"
					          :maxlength="250"></el-input>
				</el-form-item>
				<el-form-item size="mini"
				              label="任职届期"
				              prop="session">
					<el-checkbox-group v-model="addForm.session">
						<el-checkbox v-for="item in sessionOptions"
						             :label="item.uid"
						             :key="item.uid">{{item.name}}
						</el-checkbox>
					</el-checkbox-group>
				</el-form-item>
				<el-form-item size="mini"
				              label="备注"
				              prop="comment">
					<el-input type="textarea"
					          v-model="addForm.comment"
					          :maxlength="250"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer"
			     class="dialog-footer">
				<el-button @click="resetForm('addForm')">取 消</el-button>
				<el-button type="primary"
				           @click="confirmSubmit('addForm')">确 定
				</el-button>
			</div>
		</el-dialog>

	</div>
</template>

<script>
	import {isvalidPhoneNumber} from '@/assets/utils/validate'

	export default {
		name: 'NpcMember',
		data() {
			const validatePhoneNumber = (rule, value, callback) => {
				if (!isvalidPhoneNumber(value)) {
					callback(new Error('手机号格式不正确'));
				}
				else {
					callback()
				}
			};
			return {
				tableLoading: false,
				tableHeader: {
					name: '姓名',
					avatar: '头像',
					genderName: '性别',
					mobile: '联系方式',
					birthday: '出生日期',
					workUnitName: '所属分组',
					session: '任职届期',
					typeName: '任职类别',
				},
				tableData: [],

				searchForm: {
					name: '',
					mobile: '',
					bornDateStart: null,
					bornDateEnd: null,
					jobType: null,
					workUnit: null,
					sessionUid: '',
				},

				workUnitOptions: [],//镇代表返回小组数据 区代表返回镇数据
				jobTypeOptions: [
					{//代表身份  普通代表 人大主席 特殊人员
						uid: 1,
						name: '普通代表',
					},
					{
						uid: 2,
						name: '人大主席',
					},
					{
						uid: 3,
						name: '特殊人员',
					},
				],
				sessionOptions: [],//届期信息
				pageSize: 10,
				currentPage: 1,
				total: 0,

				//添加代表
				addMemberDialogVisible: false,
				uploadImageServer: this.API.UploadImage,
				title: '',
				addForm: {
					uid: '',
					name: '',
					avatar: '',
					mobile: '',
					code: '',
					idcard: '',
					bornAt: null,
					gender: 1,
					nation: '',
					education: '',
					political: '',
					session: [],
					jobType: '',
					workUnit: '',
					comment: '',
					remark: '',
				},
				rules: {
					name: [
						{
							required: true,
							message: '姓名不能为空',
							trigger: 'blur',
						},
					],
					avatar: [
						{
							required: true,
							message: '照片不能为空',
							trigger: 'blur',
						},
					],
					mobile: [
						{
							required: true,
							trigger: 'blur',
							validator: validatePhoneNumber,
						},
					],
					session: [
						{
							required: true,
							message: '届期不能为空',
							trigger: 'blur',
						},
					],
					comment: [
						{
							max: 200,
							message: '长度在 200 个字符以内',
							trigger: 'blur',
						},
					],
                    jobType:[{
					    required:true,
                        message:'任职类别必选',
                        trigger:'blur'
                    }],
                    workUnit:[{
					    required:true,
                        message:'所属分组必选',
                        trigger:'blur'
                    }]
				},
				nationOptions: [],
				educationOptions: [],
				politicalOptions: [],
			}
		},

		created() {
			this.getWorkUnits();//所属分组列表 镇代表返回小组数据 区代表返回镇数据
			this.getSessions();//届期列表信息
			this.getCurrentSession();//获取当前届期
			this.getNations();//民族列表
			this.getEducations();//文化程度列表
			this.getPolitics();//政治面貌列表
			this.getJobType();//获取代表类别
		},

		methods: {
			handleClose() {
				this.$confirm('确认关闭？')
						.then(_ => {
							this.resetForm('addForm');
						})
						.catch(_ => {});
			},
			//翻页
			handleCurrentChange(val) {
				this.currentPage = val;
				this.getData(0)
			},

			//分页大小改变
			handleSizeChange(val) {
				this.currentPage = 1;
				this.pageSize = val;
				this.getData(0)
			},

			//代表分页查询数据
			getData(times) {
				setTimeout(() => {
					this.$request.httpRequest({
						method: 'get',
						url: '/manager/member/pageOfNpcMember',
						noLoading: true,
						returnFullData: false,
						params: {
							name: this.searchForm.name,
							phone: this.searchForm.mobile,
							startAt: this.searchForm.bornDateStart,
							endAt: this.searchForm.bornDateEnd,
							workUnitUid: this.searchForm.workUnit,
							jobType: this.searchForm.jobType,
							sessionUid: this.searchForm.sessionUid,
							page: this.currentPage,
							size: this.pageSize,
						},
						success: data => {
							this.tableData = data.content;
							this.total = data.totalElements;
							if (times == 0) {
								this.$message({
									type: 'success',
									message: '查询成功!',
								})
							}
						},
						error: e => {
						},
					})
				})
			},

			//获取所属分组下拉列表
			getWorkUnits() {
				this.$request.httpRequest({
					method: 'get',
					url: '/manager/member/work_units',
					noLoading: true,
					success: data => {
						this.workUnitOptions = data
					},
					error: e => {
						this.tableLoading = false
					},
				})
			},

			//获取届期下拉列表
			getSessions() {
				this.$request.httpRequest({
					method: 'get',
					url: '/manager/session/sessions',
					noLoading: true,
					success: data => {
						this.sessionOptions = data;
					},
					error: e => {
						this.tableLoading = false
					},
				})
			},

			//获取届期下拉列表
			getCurrentSession() {
				this.$request.httpRequest({
					method: 'get',
					url: '/manager/session/getCurrentSession',
					noLoading: true,
					success: data => {
						this.searchForm.sessionUid = data;
						this.getData(0);//代表表格数据
					},
					error: e => {
					},
				})
			},

			//添加按钮点击事件
			addNpcMember() {
				this.title = '添加代表';
				//弹出添加代表对话框
				this.addMemberDialogVisible = true
			},

			// handleChangeSuccess(file){
			//   this.addForm.avatar = URL.createObjectURL(file.raw);
			// },

			//上传头像成功的回调
			handleAvatarSuccess(res, file) {
				this.addForm.avatar = res.data
			},

			//上传图片之前的回调
			beforeAvatarUpload(file) {
				const isJPGorPNG = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png'
				const isLt2M = file.size / 1024 / 1024 < 2

				if (!isJPGorPNG) {
					this.$message.error('上传头像图片只能是 JPG或PNG 格式!')
				}
				if (!isLt2M) {
					this.$message.error('上传头像图片大小不能超过 2MB!')
				}
				return isJPGorPNG && isLt2M
			},

			//获取民族下拉列表
			getNations() {
				this.getList('nation')

			},

			//获取文化水平下拉列表
			getEducations() {
				this.getList('education')
			},

			//获取政治面貌下拉列表
			getPolitics() {
				this.getList('politic')
			},

			//获取代表类别下拉列表
			getJobType() {
				this.$request.httpRequest({
					method: 'get',
					url: '/manager/memberRole/getAddRoles',
					noLoading: true,
					success: data => {
						this.jobTypeOptions = data
					},
					error: e => {
					},
				})
			},

			//根据key值查询下拉
			getList(key) {
				this.$request.httpRequest({
					method: 'get',
					url: '/manager/commonDict/getListByKey',
					noLoading: true,
					params: {
						key: key,
					},
					success: data => {
						if (key == 'nation') {
							this.nationOptions = data
							this.addForm.nation = data.length > 0 ? data[0].uid : ''
						}
						if (key == 'education') {
							this.educationOptions = data
							this.addForm.education = data.length > 0 ? data[0].uid : ''
						}
						if (key == 'politic') {
							this.politicalOptions = data
							this.addForm.political = data.length > 0 ? data[0].uid : ''
						}
					},
					error: e => {
					},
				})
			},

			resetForm(formName) {
				this.$refs[formName].resetFields();
				this.addForm.uid= '';
				this.addForm.name= '';
				this.addForm.avatar= '';
				this.addForm.mobile= '';
				this.addForm.code= '';
				this.addForm.idcard= '';
				this.addForm.bornAt= null;
				this.addForm.gender= 1;
				this.addForm.nation= '';
				this.addForm.education= '';
				this.addForm.political= '';
				this.addForm.session= [];
				this.addForm.jobType= '';
				this.addForm.workUnit= '';
				this.addForm.comment= '';
				this.addForm.remark ='';
				this.addMemberDialogVisible = false
			},

			confirmSubmit(formName) {
				let that = this;
				this.$refs[formName].validate((valid) => {
					if (valid) {
						that.$request.httpRequest({
							method: 'post',
							url: '/manager/member/addOrUpdateNpcMember',
							noLoading: true,
							params: {
								uid: that.addForm.uid,
								name: that.addForm.name.replace(/\s/g, ""),
								idcard: that.addForm.idcard,
								mobile: that.addForm.mobile,
								avatar: that.addForm.avatar,
								email: that.addForm.uid,
								address: that.addForm.uid,
								birthday: that.addForm.bornAt,
								gender: that.addForm.gender,
								type: that.addForm.jobType,
								code: that.addForm.code,
								introduction: that.addForm.remark,
								comment: that.addForm.comment,
								nation: that.addForm.nation,
								education: that.addForm.education,
								political: that.addForm.political,
								sessionUids: that.addForm.session + '',
								workUnitUid: that.addForm.workUnit,
							},
							success: data => {
								that.resetForm('addForm');
								that.getData();
								this.$message({
									type: 'success',
									message: that.addForm.uid ? '修改成功!' : '添加成功!',
								})
							},
							error: e => {
							},
						})
					}
					else {
						return false
					}
				})
			},

			updateMember(item) {
				this.addMemberDialogVisible = true
				let session = []
				for (let i = 0; i < item.sessions.length; i++) {
					session.push(item.sessions[i].uid)
				}
				this.addForm = {
					...item,
					session: session,
				}
			},

			deleteMember(item) {
				this.$confirm('确认删除该代表吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
				})
					.then(() => {
						this.$request.httpRequest({
							method: 'delete',
							url: '/manager/member/delete',
							noLoading: true,
							params: {
								uid: item.uid,
							},
							success: data => {
								this.$message({
									type: 'success',
									message: '删除成功!',
								})
								this.getData()
							},
							error: e => {
								this.getData()
							},
						})
					})
					.catch(() => {
						this.$message({
							type: 'info',
							message: '已取消删除',
						})
					})
			},
		},
	}
</script>

<style scoped
       lang="scss">
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

	.avatar-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		width: 150px;
		height: 190px;
		line-height: 190px;
		text-align: center;
	}

	.avatar {
		width: 150px;
		height: 190px;
		display: block;
	}
</style>
