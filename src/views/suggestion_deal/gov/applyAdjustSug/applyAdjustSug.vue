<template>
  <div class="table-demo">
    <el-card class="list-content" shadow="hover">
      <template v-if="$route.meta.check">
        <div class="searchBar">
          <el-form ref="form" :model="searchForm" label-width="80px">
            <el-row :gutter="20">
              <el-col :span="18">
                <el-row :gutter="20">
                  <el-col :span="6">
                    <el-form-item label="建议标题">
                      <el-input placeholder="请输入建议标题" size="mini" v-model="searchForm.title"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="建议类型">
                      <el-select v-model="searchForm.business" placeholder="请选择建议类型" size="mini">
                        <el-option label="全部" value=""></el-option>
                        <el-option v-for="item in businessList" :key="item.uid" :label="item.name" :value="item.uid"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="提出代表">
                      <el-input placeholder="请输入提出代表" size="mini" v-model="searchForm.member"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="办理单位">
                      <el-select v-model="searchForm.unit" placeholder="请选择办理单位"  size="mini">
                        <el-option label="全部" value=""></el-option>
                        <el-option v-for="item in allUnits" :key="item.uid" :label="item.name" :value="item.uid"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-col>
              <el-col :span="6">
                <el-button type="primary" size="mini" @click="getData()">搜索</el-button>
<!--                <el-button type="primary" size="mini" @click="">导出</el-button>-->
              </el-col>
              <el-col :span="18">
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item label="申请日期">
                      <el-col :span="10">
                        <el-date-picker type="datetime"
                                        value-format="yyyy-MM-dd HH:mm:ss"
                                        size="mini"
                                        placeholder="选择开始日期"
                                        v-model="searchForm.dateStart"
                                        style="width: 100%;"></el-date-picker>
                      </el-col>
                      <el-col class="el-col-md-offset-1" :span="1"><b>至</b></el-col>
                      <el-col :span="10">
                        <el-date-picker type="datetime" value-format="yyyy-MM-dd HH:mm:ss" size="mini"
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


        <el-table v-loading="tableLoading" border size="mini" :header-row-style="{ 'font-size':'15px'}" :data="tableData" style="width: 100%" class="table-content">
          <el-table-column type="index" label="序号" align="center" sortable width="60"/>
          <el-table-column v-for="(item,index) in tableHeader" :key="index" :prop="index" sortable :label="item" align="center" show-overflow-tooltip/>
          <el-table-column label="操作" width="230" align="center" class-name="operation">
            <template slot-scope="scope">
              <a v-if="$route.meta.edit" class="item" @click="convey(scope.row)">重新转办</a>
              <a v-if="$route.meta.check" class="item" @click="suggestionDetail(scope.row)">查看详情</a>
            </template>
          </el-table-column>
        </el-table>
        <!--添加修改弹框-->
        <el-dialog title="重新转办建议"
                   :before-close="handleClose"
                   :visible.sync="formVisible">
          <div class="line">
            <el-row :gutter="20">
              <el-col :span="9" :offset="1">
                <span><b>建议标题：</b> {{conveyForm.title}}</span>
              </el-col>
              <el-col :span="5">
                <span><b>建议类型：</b> {{conveyForm.businessName}}</span>
              </el-col>
              <el-col :span="7">
                <span><b>是否展示所有单位：</b>
                  <el-switch
                          v-model="conveyForm.allType"
                          @change="changeUnitList"
                          active-text="是"
                          inactive-text="否">
                  </el-switch>
                  <el-popover
                          placement="right-end"
                          trigger="hover"
                          content="关闭时，展示与建议类型相同的单位信息，打开时展示所有单位信息">
                      <svg-icon icon-class="wenhao" style="height:16px; margin-left: 10px;" slot="reference"/>
                  </el-popover>
                </span>
              </el-col>
            </el-row>
            </div>
          <div class="line">

            <el-row :gutter="20">
              <el-col :span="9" :offset="1">
                <span><b>申请单位：</b> {{conveyForm.applyUnit}}</span>
              </el-col>
              <el-col :span="5">
                <span><b>单位类型：</b> {{conveyForm.unitBusiness}}</span>
              </el-col>
              <el-col :span="7">
                <span><b>单位性质：</b> {{conveyForm.unitTypeName}}
                </span>
              </el-col>

            </el-row>
          </div>
          <div class="line">
            <el-row :gutter="20">
              <el-col :span="24" :offset="1">
                <span><b>申请理由：</b> {{conveyForm.remark}}</span>
              </el-col>

            </el-row>
          </div>
          <el-divider></el-divider>
          <el-form :model="conveyForm" :rules="rules" ref="conveyForm">
            <el-form-item label="新的办理单位：" :label-width="formLabelWidth" prop="unit">
              <el-select v-model="conveyForm.unit" placeholder="请选择">
                <el-option v-for="item in unitList" :key="item.uid" :label="item.name" :value="item.uid">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item size="mini" :label-width="formLabelWidth" label="调整说明：" prop="desc">
              <el-input type="textarea" v-model="conveyForm.desc" :maxlength="250"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="resetForm">取 消</el-button>
            <el-button type="primary" v-if="conveyForm.unitType === 2" @click="confirmConvey(true)">不重新分配办理单位</el-button>
            <el-button type="primary" @click="confirmConvey(false)">确 定</el-button>
          </div>
        </el-dialog>
      </template>

      <div v-else class="no-data">
        您暂时没有查看的权限
      </div>
    </el-card>

    <el-dialog title="查看建议" :visible.sync="viewVisible" width="45%">
      <el-row>
        <el-col :span="12">
          <span><b>建议标题：</b> {{suggestion.title}}</span>
        </el-col>
        <el-col :span="12">
          <span><b>建议类型：</b> {{suggestion.businessName}}</span>
        </el-col>
      </el-row>
      <el-row class="item-data">
        <el-col :span="12">
          <span><b>提出人：</b> {{suggestion.memberName}}</span>
        </el-col>
        <el-col :span="12">
          <span><b>提出时间：</b> {{suggestion.raiseTime}}</span>
        </el-col>
      </el-row>
      <el-row class="item-data">
        <el-col :span="2">
          <span><b>建议内容:</b></span>
        </el-col>
        <el-col :span="22">
          <span>{{suggestion.content}}</span>
        </el-col>
      </el-row>
      <el-row class="item-data">
        <el-col :span="24">
                  <span><b>建议图片：</b>
                        <span v-if="!suggestion.images">无</span>
                        <div class="img-lsit" v-else v-for="(item,index) in suggestion.images" :key="index">
                            <el-image
                                    class="image"
                                    :src="API.ServerUrl + item"
                                    :preview-src-list="addAddress(suggestion.images)">
                             </el-image>
                        </div>
                  </span>
        </el-col>
      </el-row>
      <el-row class="item-data">
        <el-col :span="24">
                  <span><b>附议人：</b>
                      <span>{{suggestion.seconded}}</span>
                  </span>
        </el-col>
      </el-row>
      <el-row class="item-data">
        <el-col :span="12">
          <span><b>审核人：</b> {{suggestion.auditor}}</span>
        </el-col>
        <el-col :span="12">
          <span><b>审核时间：</b> {{suggestion.auditTime}}</span>
        </el-col>
      </el-row>
      <el-row class="item-data">
        <el-col :span="12">
          <span><b>申请单位：</b> {{suggestion.unit}}</span>
        </el-col>
        <el-col :span="12">
          <span><b>单位性质：</b> {{suggestion.typeName}}</span>
        </el-col>
      </el-row>
      <el-row class="item-data">
        <el-col :span="12" v-if="suggestion.unitVo">
          <span><b>单位类型：</b> {{suggestion.unitVo.businessName}}</span>
        </el-col>
        <el-col :span="12">
          <span><b>申请时间：</b> {{suggestion.unitDealTime}}</span>
        </el-col>
      </el-row>
      <el-row class="item-data">
        <el-col :span="2">
          <span><b>申请理由:</b></span>
        </el-col>
        <el-col :span="22">
          <span>{{suggestion.remark}}</span>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="viewVisible = false">确 定</el-button>
  </span>
    </el-dialog>


    <!-- 分页 -->
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
  </div>
</template>
<script>
  export default {
    name:'applyAdjustSug',
    data() {
      return {
        tableLoading: false,
        tableHeader: {
          title: '标题',
          businessName: '建议类型',
          memberName: '提出人',
          unit: '办理单位',
          typeName: '单位性质',
          unitDealTime: '申请日期',
          remark: '申请理由'
        },
        tableData: [],
        searchForm:{
          title:'',
          business:'',
          member:'',
          unit:'',
          dateStart:'',
          dateEnd:'',
        },
        businessList:[],
        pageSize: 20,
        currentPage: 1,
        total: 0,
        formVisible:false,
        formLabelWidth:'120px',
        searchByType:true,
        conveyForm:{
          uid:'',//建议的uid
          title:'',//建议标题
          type:'',//建议类型
          applyUnit:'',//办理单位
          unitType:'',//单位性质
          unitTypeName:'',//单位性质
          remark:'',//申请理由
          allType:false,//是否展示所有类型
          unit:'',//办理单位单位
          desc:'',//调整说明
        },
        rules: {unit: [{required: true, message: '办理单位不能为空', trigger: 'blur'}]},
        allUnits:[],
        unitList:[],
        suggestion:{},
        imgPreview:[],
        viewVisible:false,
        activeName:[],
      }
    },
    mounted() {
      this.getSugType();
      this.getData();
      this.getUnitList();
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
      handleClose() {
        this.$confirm('确认关闭？')
                .then(_ => {
                  this.resetForm();
                })
                .catch(_ => {
                });
      },

      getSugType(){
        this.$request.httpRequest({
          method: 'get',
          url: '/suggestion_deal/business/findSugBusiness',
          noLoading: true,
          success: data => {
            this.businessList = data;
          },
        })
      },

      getData() {
        this.$request.httpRequest({
          method: 'get',
          url: '/suggestion_deal/gov_suggestion/applyConvey',
          noLoading: true,
          params: {
            title:this.searchForm.title,
            business:this.searchForm.business,
            member:this.searchForm.member,
            unit:this.searchForm.unit,
            dateStart:this.searchForm.dateStart,
            dateEnd:this.searchForm.dateEnd,
            searchType:2,//表示查询待转办的建议
            page: this.currentPage,
            size: this.pageSize
          },
          success: data => {
            this.tableData = data.content;
            this.tableData.forEach(data =>{
              data.title = data.suggestionVo.title;
              data.businessName = data.suggestionVo.suggestionBusiness.name;
              data.business = data.suggestionVo.suggestionBusiness.uid;
              data.memberName = data.suggestionVo.memberName;
              data.unit = data.unitVo.name;
              data.content = data.suggestionVo.content;
            });
            this.total = data.totalElements;
          },
        })
      },

      changeUnitList(){
        if (this.conveyForm.allType){
          this.unitList = this.allUnits;
        }else{
          this.getUnitListByType();
        }
      },
      getUnitList(){
        this.$request.httpRequest({
          method: 'get',
          url: '/suggestion_deal/unit_manage/unitList',
          noLoading: true,
          success: data => {
            this.allUnits = data;
          },
        })
      },
      getUnitListByType(){
        this.$request.httpRequest({
          method: 'get',
          url: '/suggestion_deal/unit_manage/unitListByType',
          params: {
            uid: this.conveyForm.business
          },
          noLoading: true,
          success: data => {
            this.unitList = data;
          },
        })
      },
      convey(row) {
        this.conveyForm.uid = row.uid;//转办uid
        this.conveyForm.title = row.title;//建议标题
        this.conveyForm.business = row.business;//建议类型
        this.conveyForm.businessName = row.businessName;//建议类型名称
        this.conveyForm.applyUnit = row.unit;//申请单位名称
        this.conveyForm.unitBusiness = row.unitVo.businessName;//单位性质
        this.conveyForm.unitType = row.type;//单位性质
        this.conveyForm.unitTypeName = row.typeName;//单位性质
        this.conveyForm.remark = row.remark;//申请理由
        this.getUnitListByType();
        this.formVisible = true;
      },
      confirmConvey(notValid){
        this.$refs['conveyForm'].validate((valid) => {
            if (valid || notValid) {
              this.$request.httpRequest({
            method: 'post',
            url: '/suggestion_deal/gov_suggestion/adjustConvey',
            params: {
              uid: this.conveyForm.uid,
              unitType: this.conveyForm.unitType,
              unit: this.conveyForm.unit,//调整单位
              dealStatus:notValid?2:1,//2无需验证表单必填，也无需重新分配办理单位   1，需要验证表单必填，也必须重新分配办理单位
              desc:this.conveyForm.desc,//调整说明
            },
            noLoading: true,
            success: data => {
              this.$message({
                type: 'success',
                message: '转办成功!',
              });
              this.getData();
              this.formVisible = false;
            },
          })
              }
            else {
              return false
            }
          })
      },
      suggestionDetail(row){
        this.viewVisible = true;
        this.suggestion = row;
        this.imgPreview = row.images;
      },
      resetForm(){
        this.conveyForm.title = '';
        this.conveyForm.type = '';
        this.conveyForm.unit = '';
        this.conveyForm.desc = '';
        this.$refs['conveyForm'].resetFields();
        this.formVisible = false;
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getData()
      },
      handleSizeChange(val) {
        this.currentPage = 1;
        this.pageSize = val;
        this.getData()
      },
    }
  }
</script>
<style lang="scss" scoped>
  @import '~@/styles/table/table';
  .table-demo {
    padding: 25px;
  }

  .line {
    margin-bottom: 30px;
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
