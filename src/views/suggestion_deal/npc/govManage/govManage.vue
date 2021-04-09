<template>
    <div>
        <div class="container">
            <div class="form-box">
                <el-form ref="govForm" :model="govForm" :rules="rules" label-width="120px">
                    <el-form-item label="政府名称" prop="name">
                        <el-input type="text" v-model="govForm.name" :maxlength="20" ></el-input>
                    </el-form-item>
                    <el-form-item label="管理员账号" prop="account">
                        <el-input type="text" v-model="govForm.account" :maxlength="20" :readonly = has_data></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input type="password" v-model="govForm.password" :maxlength="20" :readonly=has_data></el-input>
                    </el-form-item>
                    <el-form-item label="管理员手机号" prop="mobile">
                        <el-input type="text" v-model="govForm.mobile" :maxlength="20" :readonly=has_data></el-input>
                    </el-form-item>
                    <el-form-item label="简介" prop="description">
                        <el-input type="textarea" v-model="govForm.description" :maxlength="200"></el-input>
                    </el-form-item>

                    <el-form-item label="政府联络地址" prop="address">
                        <div class="amap-page-container">
                            <el-amap-search-box class="search-box" :search-option="searchOption"
                                                :on-search-result="onSearchResult"></el-amap-search-box>
                            <el-amap vid="amapDemo" :center="mapCenter" :zoom="16" class="amap-demo" :events="events">
                                <el-amap-marker v-for="(marker,index) in markers" :position="marker"
                                                :key="index"></el-amap-marker>
                            </el-amap>
                            <div class="toolbar">
                                当前经纬度: [{{ lng }}, {{ lat }}] 当前地址: {{ address }}
                            </div>
                        </div>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit('govForm')">提交</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
  import qs from 'qs'
  import { BaiduMap, BmControl, BmView, BmAutoComplete, BmLocalSearch, BmMarker } from 'vue-baidu-map'

  export default {
    name: 'baseform',
    data: function() {
      let self = this
      return {
        has_data: false,  //请求政府详情接口后是否有数据返回
        dialogVisible: false,
        imgVisible: false,
        options: [],
        anniu1: false,
        anniu2: false,
        anniu: true,
        searchOption: {
          city: '',
          citylimit: true
        },
        markers: [[103.919033, 30.752225]],
        mapCenter: [103.919033, 30.752225],
        zoom: 15,
        address: '',

        events: {
          click(e) {
            let { lng, lat } = e.lnglat
            self.lng = lng
            self.lat = lat
            self.markers = [[self.lng, self.lat]]

            // 这里通过高德 SDK 完成。
            var geocoder = new AMap.Geocoder({
              radius: 1000,
              extensions: 'all'
            })
            geocoder.getAddress([lng, lat], function(status, result) {
              if (status === 'complete' && result.info === 'OK') {
                if (result && result.regeocode) {
                  self.address = result.regeocode.formattedAddress
                  self.$nextTick()
                }
              }
            })
          }
        },
        lng: 0,
        lat: 0,
        govForm: {
          uid: '',
          name: '',
          account: '',
          password: '',
          mobile: '',
          address: '',
          description: ''
        },
        rules: {
          name: [{ required: true, message: '请输入政府名称', trigger: 'blur' }],
          account: [{ required: true, message: '请输入账号', trigger: 'blur' }],
          password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
          mobile: [{ required: true, message: '请输入政府联系方式', trigger: 'blur' }],
          address: [{ required: true, message: '请输入政府联络地址', trigger: 'blur' }],
          description: [{ required: true, message: '请输入政府简介', trigger: 'blur' }]
        }

      }
    },
    watch: {
      value: function(currentValue) {
        this.showMapComponent = currentValue
        if (currentValue) {
          this.keyword = ''
        }
      }
    },
    props: {
      value: Boolean,
      mapHeight: {
        type: Number,
        default: 500
      }
    },
    created() {
      this.getGovDetail();
    },
    methods: {
      getGovDetail() {
        this.$request.httpRequest({
          method: 'get',
          url: '/suggestion_deal/gov/detailGovernment',
          noLoading: true,
          success: data => {
            this.$message({
              type: 'success',
              message: '查询成功!'
            })
            if (data.name != null){
              this.has_data = true;
            }
            this.govForm.uid = data.uid;
            this.govForm.mobile = data.mobile;
            this.govForm.address = data.address;
            this.govForm.name = data.name;
            this.govForm.description = data.description;
            this.govForm.account = data.account;
            this.govForm.password = "123456";
            this.lat = data.latitude;
            this.lng = data.longitude;
            this.mapCenter = [this.lng, this.lat]
            this.markers = [[this.lng, this.lat]]
            this.address = data.address
          },
        })
      },
      onSearchResult(pois) {
        let latSum = 0
        let lngSum = 0
        if (pois.length > 0) {
          pois.forEach(poi => {
            let { lng, lat } = poi
            lngSum += lng
            latSum += lat
          })
          let center = {
            lng: lngSum / pois.length,
            lat: latSum / pois.length
          }
          this.markers = [[center.lng, center.lat]]
          this.lng = center.lng
          this.lat = center.lat
          this.address = pois[0].name
          this.mapCenter = [center.lng, center.lat]
        }
      },

      onSubmit(formName) {
        this.govForm.address = this.address
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$request.httpRequest({
              method: 'post',
              url: this.has_data ? '/suggestion_deal/gov/updateGovernment' :'/suggestion_deal/gov/addGovernment',  //判断是添加还是修改
              noLoading: true,
              params: {
                uid: this.govForm.uid,
                longitude: this.lng,
                latitude: this.lat,
                description: this.govForm.description,
                mobile: this.govForm.mobile,
                name: this.govForm.name,
                address: this.govForm.address,
                account: this.govForm.account,
                password: this.govForm.password,
              },
              success: data => {
                this.$message({
                  type: 'success',
                  message: '添加成功!'
                })
                that.resetForm('form')
                that.getData()
              },
              error: e => {
                this.$message({
                  type: 'warning',
                  message: e.message
                })
              }
            })
          } else {
            return false
          }
        })
      },
      cancel() {
        this.$router.push({ path: '/wtable' })
      }
    }
  }
</script>
<style>
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
        height: 500px !important;
    }

    .form-box {
        width: 800px;
    }

    .crumbs {
        margin: 20px;
    }

    .container {
        padding: 30px;
        background: #fff;
        border: 1px solid #ddd;
        border-radius: 5px;
    }

</style>
