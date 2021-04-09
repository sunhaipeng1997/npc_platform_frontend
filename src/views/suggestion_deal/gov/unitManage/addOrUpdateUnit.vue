<template>
  <div class="table-demo">
    <el-card class="list-content"
             shadow="hover">
      <template v-if="$route.meta.check">
        <el-card class="steps">
          <el-row>
          <el-col :span="6">
            <el-page-header @back="goBack"></el-page-header>
          </el-col>
          <el-col :span="14">
            <el-steps :active="active" finish-status="success">
              <el-step title="单位基本信息"></el-step>
              <el-step title="单位人员信息"></el-step>
            </el-steps>
          </el-col>
        </el-row>
        </el-card>
        <div class="stepContent" v-if="active === 0">
          <el-form ref="form"
                   :model="form"
                   :rules="rules"
                   label-width="120px">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="单位名称"
                              prop="name"
                size="mini">
                  <el-input type="text"
                            v-model="form.name"
                            :maxlength="20"></el-input>
                </el-form-item>
                <el-form-item label="单位业务">
                  <el-select v-model="form.business" size="mini" placeholder="请选择单位业务" >
                    <el-option label="请选择" value=""></el-option>
                    <el-option v-for="item in businessList"
                               :key="item.uid"
                               :label="item.name"
                               :value="item.uid"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="联系方式" size="mini"
                              prop="mobile">
                  <el-input type="text"
                            v-model="form.mobile"></el-input>
                </el-form-item>
                <el-form-item label="单位图片" prop="avatar">
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
                      <img v-if="this.currentAvatarUrl"
                           :src="this.currentAvatarUrl"
                           class="unitAvatar">
                      <i v-else
                         class="el-icon-plus avatar-uploader-icon"></i>
                    </div>
                    <div slot="tip"
                         class="el-upload__tip">只能上传jpg/png文件，且不超过2MB
                    </div>
                  </el-upload>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="单位描述">
                  <el-input type="textarea"
                            v-model="form.comment"
                            :maxlength="200"></el-input>
                </el-form-item>
                <el-form-item label="单位地址"
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
              </el-col>
            </el-row>

          </el-form>
        </div>

        <div class="stepContent" v-if="active == 1">
          <div class="searchBar">
            <el-form ref="form" :model="searchForm" label-width="80px">
              <el-row>
                <el-col :span="18">
                  <el-row :gutter="20">
                    <el-col :span="6">
                      <el-form-item label="姓名">
                        <el-input placeholder="请输入姓名" size="mini" v-model="searchForm.name"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="手机号">
                        <el-input placeholder="请输手机号" size="mini" v-model="searchForm.mobile"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="登录账号">
                        <el-input placeholder="请输登录账号" size="mini" v-model="searchForm.username"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-col>
                <el-col :span="6">
                  <el-button type="primary" size="mini" @click="getUnitUser()">搜索</el-button>
                  <el-button type="primary" size="mini" @click="addUnitUser">添加</el-button>
                </el-col>
              </el-row>
            </el-form>
          </div>
          <el-table border size="mini" :header-row-style="{ 'font-size':'15px'}"
                    :data="tableData" style="width: 100%" class="table-content">
            <el-table-column type="index" label="序号" align="center" sortable width="60"/>
            <el-table-column prop="avatar" label="照片" width="150" align="center">
              <template slot-scope="scope">
                <img width="120" height="150" :src="API.ServerUrl + scope.row.avatar">
              </template>
            </el-table-column>
            <el-table-column v-for="(item,index) in tableHeader" show-overflow-tooltip :key="index"
                             :prop="index" sortable :label="item" align="center"/>
            <el-table-column label="操作" width="230" align="center" class-name="operation">
              <template slot-scope="scope">
                <a v-if="$route.meta.edit" class="item" @click="updateUnitUser(scope.row)">修改</a>
                <a v-if="$route.meta.edit" class="item" @click="resetPwd(scope.row)">重置密码</a>
                <a v-if="$route.meta.delete" class="item-danger" @click="deleteUnitUser(scope.row)">删除</a>
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

          <!--添加修改人员弹框-->
          <el-dialog :title="addForm.title"
                     :visible.sync="addFormVisible"
                     top="50px"
                     :before-close="handleClose">
            <el-form ref="addForm"
                     :model="addForm"
                     :rules="addRules"
                     label-width="120px">
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="姓名"
                                prop="name">
                    <el-input type="text"
                              v-model="addForm.name"
                              :maxlength="20"></el-input>
                  </el-form-item>
                  <el-form-item size="mini"
                                label="性别"
                                prop="gender">
                    <el-radio-group v-model="addForm.gender">
                      <el-radio :label=1>男</el-radio>
                      <el-radio :label=2>女</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="联系方式" prop="mobile">
                    <el-input type="text" v-model="addForm.mobile"></el-input>
                  </el-form-item>
                  <el-form-item label="登录账号" prop="username" v-if="!addForm.uid">
                    <el-input type="text" v-model="addForm.username"></el-input>
                  </el-form-item>
                  <el-form-item label="密码" prop="password" v-if="!addForm.uid">
                    <el-input type="password" v-model="addForm.password"></el-input>
                  </el-form-item>
                  <el-form-item label="确认密码" prop="confirmPwd" v-if="!addForm.uid">
                    <el-input type="password" v-model="addForm.confirmPwd"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="图片"
                                prop="avatar">
                    <el-upload
                            class="avatar-uploader"
                            :action=uploadAvatarServer
                            :show-file-list="false"
                            :on-success="handleUserAvatarSuccess"
                            :before-upload="beforeAvatarUpload"
                            :auto-upload="true"
                            accept="image/*"
                    >
                      <div class="setBorder">
                        <!--<img v-if="addForm.avatar" :src="this.API.ServerUrl + addForm.avatar" class="avatar">-->
                        <img v-if="this.userAvatarUrl"
                             :src="this.userAvatarUrl"
                             class="avatar">
                        <i v-else
                           class="el-icon-plus user-avatar-uploader-icon"></i>
                      </div>
                      <div slot="tip"
                           class="el-upload__tip">只能上传jpg/png文件，且不超过2MB
                      </div>
                    </el-upload>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="简介">
                <el-input type="textarea"
                          v-model="addForm.comment"
                          :maxlength="200"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer"
                 class="dialog-footer">
              <el-button @click="resetForm('addForm')">取 消</el-button>
              <el-button type="primary" @click="confirmAddOrUpdateUser('addForm',false)">确 定</el-button>
              <el-button type="primary" @click="confirmAddOrUpdateUser('addForm',true)">确定并返回</el-button>
            </div>
          </el-dialog>

        </div>
        <div class="stepFoot">
          <el-row>
            <el-col :offset="10" :span="2">
              <el-button v-if="active==0" type="primary" @click="addOrUpdateUnit('form',true)">下一步</el-button>
              <el-button v-if="active==1" type="primary" @click="backToUnit">上一步</el-button>
            </el-col>
            <el-col :span="2">
              <el-button v-if="active==0" type="primary" @click="addOrUpdateUnit('form',false)">保存并返回</el-button>
              <el-button v-if="active==1" type="primary" @click="goBack">保存并返回</el-button>
            </el-col>
          </el-row>
        </div>
      </template>
    </el-card>
    <!-- 分页 -->
  </div>
</template>
<script>
  import {isvalidPhoneNumber} from '../../../../assets/utils/validate'

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
        //单位相关
        currentAvatarUrl: '',
        uploadAvatarServer: this.API.UploadAvatar,
        uploadImageServer: this.API.UploadImage,
        events: {
          click(e) {
            let {lng, lat} = e.lnglat;
            self.lng = lng;
            self.lat = lat;
            self.markers = [[self.lng, self.lat]];
            // 这里通过高德 SDK 完成。
            var geocoder = new AMap.Geocoder({
              radius: 1000,
              extensions: "all",
            });
            geocoder.getAddress([lng, lat], function (status, result) {
              if (status === 'complete' && result.info === 'OK') {
                if (result && result.regeocode) {
                  self.address = result.regeocode.formattedAddress;
                  self.$nextTick();
                }
              }
            });
          },
        },
        lng: 103.919033,
        lat: 30.752225,
        markers: [[103.919033, 30.752225]],
        mapCenter: [103.919033, 30.752225],
        searchOption: {city: '', citylimit: true},
        form: {
          title: '',
          uid: '',
          name: '',
          avatar: '',
          comment: '',
          address: '',
          longitude: '',
          latitude: '',
          business: '',
          mobile: '',
        },
        rules: {
          name: [{required: true, message: '请输入单位名称', trigger: 'blur'}],
          mobile: [{required: true, message: '单位联系方式格式不正确', trigger: 'blur', validator: validPhoneNumber}],
          comment: [{required: true, message: '请输入单位简介', trigger: 'blur'}],
        },
        address: '四川省成都市郫都区合作街道合信路84号龙湖·时代天街',
        businessList: [],
        //单位人员相关
        addForm: {
          title: '',
          uid: '',
          name: '',
          gender: '1',
          mobile: '',
          avatar: '',
          comment: '',
          username: '',
          password: '',
          confirmPwd: '',
        },
        addRules: {
          name: [{required: true, message: '姓名不能为空', trigger: 'blur'}],
          gender: [{required: true, message: '性别不能为空', trigger: 'blur'}],
          mobile: [{required: true, message: '手机号不能为空', trigger: 'blur', validator: validPhoneNumber}],
          username: [{required: true, message: '用户名不能为空', trigger: 'blur'}],
          password: [{required: true, message: '密码不能为空', trigger: 'blur'}],
          confirmPwd: [{required: true, message: '确认密码不能为空', trigger: 'blur'}],
        },
        addFormVisible: false,
        tableHeader: {
          name: '姓名',
          genderName: '性别',
          mobile: '联系方式',
          account: '登录账号',
          comment: '简介',
        },
        tableData: [],
        searchForm: {
          name: '',
          mobile: '',
          username: '',
        },
        userAvatarUrl:'',
        pageSize: 20,
        currentPage: 1,
        total: 0,
        uid: '',
        active: 0
    }
    },
    mounted() {
      this.uid = this.$route.query.uid;
      this.active = parseInt(this.$route.query.step);
      if (this.uid && this.active === 0) {
        this.getUnitDetail();
      }
      if (this.active === 1){
        this.getUnitUser();
      }
      this.getBusiness();
    },
    methods: {
      //*********公共方法***********************************
      //返回单位列表
      goBack(){
        this.$router.push({name: 'unitManage'});
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
      //返回上一步
      backToUnit(){
        this.active = 0;
        this.getUnitDetail();
      },
      //*********单位相关方法*******************************
      //获取单位详细信息
      getUnitDetail(){
        this.$request.httpRequest({
          method: 'get',
          url: '/suggestion_deal/unit_manage/unitDetails',
          noLoading: true,
          returnFullData: false,
          params: {
            uid: this.uid,
          },
          success: data => {
            this.form = data;
            this.currentAvatarUrl = this.API.ServerUrl + data.avatar;
            this.lng=data.longitude;
            this.lat=data.latitude;
            this.address=data.address;
            this.mapCenter=[parseFloat(this.lng),parseFloat(this.lat)];
            this.markers=[[parseFloat(this.lng), parseFloat(this.lat)]];
          },
          error: e => {
          },
        })
      },
      //上传单位图片成功的回调
      handleAvatarSuccess(res) {
        this.form.avatar = res.data;
        this.currentAvatarUrl = this.API.ServerUrl + this.form.avatar;
      },
      //地图搜素
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
      //获取类型
      getBusiness(){
        this.$request.httpRequest({
          method: 'get',
          url: '/suggestion_deal/business/findSugBusiness',
          noLoading: true,
          returnFullData: false,
          success: data => {
            this.businessList = data;
          },
          error: e => {
          },
        })
      },
      //确认添加或修改
      addOrUpdateUnit(formName,next) {
        let that = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            that.$request.httpRequest({
              method: "post",
              url: "/suggestion_deal/unit_manage/addOrUpdateUnit",
              noLoading: true,
              params: {
                uid: that.form.uid,
                name: that.form.name,
                mobile: that.form.mobile,
                comment: that.form.comment,
                avatar: that.form.avatar,
                address: that.address,
                business: that.form.business,
                longitude: that.lng,
                latitude: that.lat,
              },
              success: data => {
                this.$message({
                  type: 'success',
                  message: '保存成功!',
                });
                if (next) {
                  this.active = 1;
                  that.uid = data;
                  that.getUnitUser();
                }else{
                  this.goBack();
                }
              },
              error: e => {
                this.$message({
                  type: 'warning',
                  message: '保存失败! ' + e.message,
                });
              },
            })
          }
          else {
            return false;
          }
        });
      },
      //**********单位人员相关方法****************************
      //获取单位人员信息表格
      getUnitUser(event) {
        if(event){
          this.currentPage = 1;
        }
        setTimeout(() => {
          this.$request.httpRequest({
            method: 'get',
            url: '/suggestion_deal/unit_manage/unitUserPage',
            noLoading: true,
            returnFullData: false,
            params: {
              unit: this.uid,
              name: this.searchForm.name,
              mobile: this.searchForm.mobile,
              username: this.searchForm.username,
              gender: this.searchForm.gender,
              page: this.currentPage,
              size: this.pageSize,
            },
            success: data => {
              this.tableData = data.content;
              this.total = data.totalElements;
            },
            error: e => {
            },
          })
        })
      },
      //关闭弹窗确认
      handleClose() {
        this.$confirm('确认关闭？')
                .then(_ => {
                  this.resetForm('form');

                })
      },
      //点击添加人员按钮
      addUnitUser() {
        this.addForm.title = '添加人员信息';
        this.addForm.uid = '';
        this.addForm.name = '';
        this.addForm.gender = '';
        this.addForm.mobile = '';
        this.addForm.username = '';
        this.addForm.password = '';
        this.addForm.confirmPwd = '';
        this.addForm.comment = '';
        this.addForm.avatar = '';
        this.userAvatarUrl = '';
        this.showForm();
      },
      //点击修改人员按钮
      updateUnitUser(item) {
        this.addForm.title = '修改人员信息';
        this.addForm.uid = item.uid;
        this.addForm.name = item.name;
        this.addForm.gender = item.gender;
        this.addForm.mobile = item.mobile;
        this.addForm.comment = item.comment;
        this.addForm.username = item.account;
        this.addForm.avatar = item.avatar;
        this.userAvatarUrl = this.API.ServerUrl + item.avatar;
        this.showForm();
      },
      //确认添加弹框
      confirmAddOrUpdateUser(formName,isReturn){
        let that = this;
        if (that.addForm.password !== that.addForm.confirmPwd) {
          this.$message({
            type: 'success',
            message: '确认密码必须与账号密码一致!',
          });
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            that.$request.httpRequest({
              method: "post",
              url: "/suggestion_deal/unit_manage/addOrUpdateUnitUser",
              noLoading: true,
              params: {
                unit:that.uid,
                uid: that.addForm.uid,
                name: that.addForm.name,
                gender: that.addForm.gender,
                mobile: that.addForm.mobile,
                username: that.addForm.username,
                password: that.addForm.password,
                confirmPwd: that.addForm.confirmPwd,
                comment: that.addForm.comment,
                avatar: that.addForm.avatar,
              },
              success: data => {
                this.$message({
                  type: 'success',
                  message: '保存成功!',
                });
                this.addFormVisible = false;
                if (isReturn) {
                  this.goBack();
                }else{
                  that.getUnitUser();
                }
              },
              error: e => {
              },
            })
          }
          else {
            return false;
          }
        });
      },
      //上传单位图片成功的回调
      handleUserAvatarSuccess(res) {
        this.addForm.avatar = res.data;
        this.userAvatarUrl = this.API.ServerUrl + this.addForm.avatar;
      },
      //打开添加人员弹框
      showForm() {
        this.addFormVisible = true;
      },
      //删除单位人员
      deleteUnitUser(row) {
        this.$confirm('确认删该人员吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
                .then(() => {
                  this.$request.httpRequest({
                    method: 'delete',
                    url: "/suggestion_deal/unit_manage/deleteUnitUser",
                    noLoading: true,
                    params: {
                      uid: row.uid,
                    },
                    success: data => {
                      this.$message({
                        type: 'success',
                        message: '删除成功!',
                      });
                      this.getUnitUser();
                    },
                    error: e => {
                      this.getUnitUser();
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
      //翻页
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getUnitUser()
      },
      //每页大小改变
      handleSizeChange(val) {
        this.pageSize = val;
        this.getUnitUser()
      },
      //重置人员信息密码
      resetPwd(row){
        this.$confirm('确认重置该用户的密码？').then(_ => {
          this.$request.httpRequest({
            method: 'delete',
            url: "/suggestion_deal/unit_manage/resetPwd",
            noLoading: true,
            params: {
              uid: row.uid,
            },
            success: data => {
              this.$message({
                type: 'success',
                message: '重置成功!',
              });
              this.getUnitUser();
            },
            error: e => {
              this.getUnitUser();
            },
          })
        })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.form.comment = '';
        this.addForm.title = '添加单位人员';
        this.addForm.uid = '';
        this.addForm.name = '';
        this.addForm.gender = '';
        this.addForm.avatar = '';
        this.addForm.mobile = '';
        this.addForm.username = '';
        this.addForm.password = '';
        this.addForm.confirmPwd = '';
        this.userAvatarUrl = '';
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

  .unitAvatar {
    width: 350px;
    height: 190px;
    display: block;
  }

  .avatar {
    width: 150px;
    height: 190px;
    display: block;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 350px;
    height: 190px;
    line-height: 190px;
    text-align: center;
  }

  .user-avatar-uploader-icon {
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

  .steps{
    border: 1px  #99a9bf;
    border-radius: 6px;
    margin-bottom: 50px;
  }

  .stepContent{
    margin-top: 50px;
  }

  .stepFoot{
    text-align: center;
  }

</style>
