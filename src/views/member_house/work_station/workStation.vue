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
										<el-form-item label="名称">
											<el-input placeholder="请输入工作站名称"
											          size="mini"
											          v-model="searchForm.searchKey"></el-input>
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
								           @click="addWorkStation">添加
								</el-button>
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
					<el-table-column prop="avatar"
					                 label="工作站图片"
					                 width="150"
					                 align="center">
						<template slot-scope="scope">
							<img :src="API.ServerUrl + scope.row.avatar">
						</template>
					</el-table-column>
					<el-table-column v-for="(item,index) in tableHeader"
					                 show-overflow-tooltip
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
							   @click="updateWorkStation(scope.row)">修改</a>
							<a class="item-success"
							   @click="changeStatus(scope.row)"
							   v-if="scope.row.enabled == '可用'">停用</a>
							<a class="item-warning"
							   @click="changeStatus(scope.row)"
							   v-if="scope.row.enabled == '不可用'">启用</a>
							<a v-if="$route.meta.delete"
							   class="item-danger"
							   @click="deleteWorkStation(scope.row)">删除</a>
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
				<!--添加修改弹框-->
				<el-dialog :title="form.title"
				           :visible.sync="addFormVisible"
				           top="50px"
				           :before-close="handleClose">
					<el-form ref="form"
					         :model="form"
					         :rules="rules"
					         label-width="120px">
						<el-row :gutter="20">
							<el-col :span="12">
								<el-form-item label="工作站名称"
								              prop="name">
									<el-input type="text"
									          v-model="form.name"
									          :maxlength="20"></el-input>
								</el-form-item>
								<el-form-item label="工作站联系人"
								              prop="linkman">
									<el-input type="text"
									          v-model="form.linkman"></el-input>
								</el-form-item>
								<el-form-item label="工作站联系方式"
								              prop="telephone">
									<el-input type="text"
									          v-model="form.telephone"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item label="工作站图片"
								              prop="avatar">
									<el-upload
											class="avatar-uploader"
											:action=uploadImageServer
											:show-file-list="false"
											:on-success="handleAvatarSuccess"
											:before-upload="beforeAvatarUpload"
											:auto-upload="true"
											accept="image/*"
									>
										<div class="setBorder">
											<!--<img v-if="form.avatar" :src="this.API.ServerUrl + form.avatar" class="avatar">-->
											<img v-if="this.currentAvatarUrl"
											     :src="this.currentAvatarUrl"
											     class="avatar">
											<i v-else
											   class="el-icon-plus avatar-uploader-icon"></i>
										</div>
										<div slot="tip"
										     class="el-upload__tip">只能上传jpg/png文件，且不超过2MB
										</div>
									</el-upload>
								</el-form-item>
							</el-col>
						</el-row>
						<el-form-item label="工作站描述">
							<el-input type="textarea"
							          v-model="form.description"
							          :maxlength="200"></el-input>
						</el-form-item>
						<el-form-item label="工作站地址"
						              prop="address">
							<div class="amap-page-container">
								<el-amap-search-box class="search-box"
								                    :search-option="searchOption"
								                    :on-search-result="onSearchResult"></el-amap-search-box>
								<el-amap vid="amapDemo"
								         :center="mapCenter"
								         :zoom="16"
								         class="amap-demo"
								         :events="events">
									<el-amap-marker v-for="(marker,index) in markers"
									                :position="marker"
									                :key="index"></el-amap-marker>
								</el-amap>
								<div class="toolbar">
									当前经纬度: [{{ lng }}, {{ lat }}] 当前地址: {{ address }}
								</div>
							</div>
						</el-form-item>
					</el-form>
					<div slot="footer"
					     class="dialog-footer">
						<el-button @click="resetForm('form')">取 消</el-button>
						<el-button type="primary"
						           @click="confirmAddOrUpdate('form')">确 定
						</el-button>
					</div>
				</el-dialog>
			</template>
		</el-card>
		<!-- 分页 -->
	</div>
</template>
<script>
	import {BmControl, BmView, BmAutoComplete, BmLocalSearch, BmMarker} from 'vue-baidu-map'
	import {isvalidPhoneNumber} from '../../../assets/utils/validate'

	var validPhoneNumber = (rule, value, callback) => {
		if (!value) {
			callback(new Error('请输入内容'))
		}
		else if (value != "无" && !isvalidPhoneNumber(value)) {
			callback(new Error('请输入正确的手机号码'))
		}
		else {
			callback()
		}
	};
	export default {
		data() {
			let self = this;
			return {
				currentAvatarUrl: '',
				uploadImageServer: this.API.ServerUrl + this.API.UploadWorkStationImage,
				events: {
					click(e) {
						let {lng, lat} = e.lnglat;
						self.lng = lng;
						self.lat = lat;
						self.markers = [
							[
								self.lng,
								self.lat,
							],
						];

						// 这里通过高德 SDK 完成。
						var geocoder = new AMap.Geocoder({
							radius: 1000,
							extensions: "all",
						});
						geocoder.getAddress([
							lng,
							lat,
						], function (status, result) {
							if (status === 'complete' && result.info === 'OK') {
								if (result && result.regeocode) {
									self.address = result.regeocode.formattedAddress;
									self.$nextTick();
								}
							}
						});
					},
				},
				lng: 0,
				lat: 0,
				markers: [
					[
						103.919033,
						30.752225,
					],
				],
				mapCenter: [
					103.919033,
					30.752225,
				],
				searchOption: {
					city: '',
					citylimit: true,
				},
				form: {
					title: '',
					uid: '',
					name: '',
					avatar: '',
					description: '',
					address: '',
					longitude: '',
					latitude: '',
					linkman: '',
					telephone: '',
				},
				address: '',
				addFormVisible: false,
				formLabelWidth: '100px',
				rules: {
					name: [
						{
							required: true,
							message: '请输入工作站名称',
							trigger: 'blur',
						},
					],
					telephone: [
						{
							required: true,
							message: '工作站联系方式格式不正确',
							trigger: 'blur',
							validator: validPhoneNumber,
						},
					],
					description: [
						{
							required: true,
							message: '请输入工作站简介',
							trigger: 'blur',
						},
					],
					linkman: [
						{
							required: true,
							message: '请输入工作站联系人',
							trigger: 'blur',
						},
					],
				},
				tableLoading: false,
				tableHeader: {
					name: '工作站名称',
					address: '工作站地址',
					linkman: '工作站联系人',
					telephone: '工作站联系方式',
					description: '工作站简介',
					enabled: '是否可用',
				},
				tableData: [],
				searchForm: {
					searchKey: '',
				},
				pageSize: 20,
				currentPage: 1,
				total: 0,
			}
		},
		mounted() {
			this.getData()
		},
		methods: {
			handleClose() {
				this.$confirm('确认关闭？')
					.then(_ => {
						this.resetForm('form');
					})
					.catch(_ => {
					});
			},
			//上传工作站图片成功的回调
			handleAvatarSuccess(res) {
				this.form.avatar = res.data
				this.currentAvatarUrl = this.API.ServerUrl + this.form.avatar;
			},

			//上传图片之前的回调
			beforeAvatarUpload(file) {
				const isJPGorPNG = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png'
				const isLt2M = file.size / 1024 / 1024 < 2

				if (!isJPGorPNG) {
					this.$message.error('上传图片只能是 JPG或PNG 格式!');
				}
				if (!isLt2M) {
					this.$message.error('上传图片大小不能超过 2MB!');
				    alert('上传图片大小不能超过 2MB!');
				}
				return isJPGorPNG && isLt2M
			},
			onSearchResult(pois) {
				let latSum = 0;
				let lngSum = 0;
				if (pois.length > 0) {
					pois.forEach(poi => {
						let {lng, lat} = poi;
						lngSum += lng;
						latSum += lat;

					});
					let center = {
						lng: lngSum / pois.length,
						lat: latSum / pois.length,
					};
					this.markers = [
						[
							center.lng,
							center.lat,
						],
					];
					this.lng = center.lng;
					this.lat = center.lat;
					this.address = pois[0].name;
					this.mapCenter = [
						center.lng,
						center.lat,
					];
				}
			},
			confirmAddOrUpdate(formName) {
				let that = this;
				this.$refs[formName].validate((valid) => {
					if (valid) {
						that.$request.httpRequest({
							method: "post",
							url: "/member_house/work_stations/addOrUpdate",
							noLoading: true,
							params: {
								uid: that.form.uid,
								name: that.form.name,
								description: that.form.description,
								avatar: that.form.avatar,
								address: that.address,
								linkman: that.form.linkman,
								telephone: that.form.telephone,
								longitude: that.lng,
								latitude: that.lat,
							},
							success: data => {
								this.$message({
									type: 'success',
									message: that.form.uid ? '修改成功!' : '添加成功!',
								});
								that.resetForm('form');
								that.getData();
							},
							error: e => {
								this.$message({
									type: 'warning',
									message: (this.form.uid ? '修改失败! ' : '添加失败! ') + e.message,
								});
							},
						})
					}
					else {
						return false;
					}
				});
			},
			addWorkStation() {
				this.form.title = '添加工作站';
				this.form.uid = '';
				this.form.name = '';
				this.form.description = '';
				this.form.linkman = '';
				this.form.telephone = '无';
				this.currentAvatarUrl = '';
				this.showForm();
			},
			updateWorkStation(item) {
				this.form.title = '修改工作站';
				this.form.uid = item.uid;
				this.form.name = item.name;
				this.form.address = item.address;
				this.form.description = item.description;
				this.form.linkman = item.linkman;
				this.form.telephone = item.telephone;
				this.form.longitude = item.longitude;
				this.form.latitude = item.latitude;
				this.form.avatar = item.avatar;
				this.currentAvatarUrl = this.API.ServerUrl + item.avatar;
				this.showForm();
			},
			showForm() {
				this.addFormVisible = true;
			},
			deleteWorkStation(row) {
				this.$confirm('确认删工作站吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
				})
					.then(() => {
						this.$request.httpRequest({
							method: 'delete',
							url: "/member_house/work_stations/delete",
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
								this.$message({
									type: 'warning',
									message: '删除失败!',
								});
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
			changeStatus(row) {
				this.$request.httpRequest({
					method: 'post',
					url: "/member_house/work_stations/changeStatus",
					noLoading: true,
					params: {
						uid: row.uid,
					},
					success: data => {
						this.$message({
							type: 'success',
							message: '状态修改成功!',
						});
						this.getData();
					},
					error: e => {
						this.$message({
							type: 'warning',
							message: '状态修改失败!',
						});
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
				if(event){
					this.currentPage = 1;
				}
				this.tableLoading = true;
				setTimeout(() => {
					this.$request.httpRequest({
						method: 'get',
						url: '/member_house/work_stations/page',
						noLoading: true,
						returnFullData: false,
						params: {
							searchKey: this.searchForm.searchKey,
							page: this.currentPage,
							size: this.pageSize,
							property: 'id',
							direction: 'asc',
						},
						success: data => {
							this.tableData = data.content;
							this.villages = data.content.villages;
							this.total = data.totalElements;
							this.tableLoading = false
						},
						error: e => {
							this.tableLoading = false
						},
					})
				})
			},
			resetForm(formName) {
				this.$refs[formName].resetFields();
				this.form.title = '';
				this.form.uid = '';
				this.form.name = '';
				this.form.description = '';
				this.form.linkman = '';
				this.form.telephone = '无';
				this.currentAvatarUrl = '';
				this.addFormVisible = false
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
		width: 150px;
		height: 190px;
		display: block;
	}

	.avatar-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		width: 150px;
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
