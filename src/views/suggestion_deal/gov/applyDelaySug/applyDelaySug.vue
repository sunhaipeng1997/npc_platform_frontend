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
                        <el-date-picker type="datetime" value-format="yyyy-MM-dd HH:mm:ss" size="mini" placeholder="选择开始日期" v-model="searchForm.dateStart" style="width: 100%;"></el-date-picker>
                      </el-col>
                      <el-col class="el-col-md-offset-1" :span="1"><b>至</b></el-col>
                      <el-col :span="10">
                        <el-date-picker type="datetime" value-format="yyyy-MM-dd HH:mm:ss" size="mini" placeholder="选择结束日期" v-model="searchForm.dateEnd" style="width: 100%;"></el-date-picker>
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
              <a v-if="$route.meta.edit" class="item" @click="delay(scope.row)">处理延期</a>
              <a v-if="$route.meta.check" class="item" @click="suggestionDetail(scope.row)">查看详情</a>
            </template>
          </el-table-column>
        </el-table>
        <!--添加修改弹框-->
        <el-dialog title="建议延期处理" :before-close="handleClose" :visible.sync="formVisible">
          <div class="line">
            <el-row :gutter="20">
              <el-col :span="9" :offset="1">
                <span><b>建议标题：</b> {{delayForm.title}}</span>
              </el-col>
              <el-col :span="5">
                <span><b>建议类型：</b> {{delayForm.businessName}}</span>
              </el-col>
              <el-col :span="7">
                <span><b>单位性质：</b> {{delayForm.unitTypeName}}</span>
              </el-col>
            </el-row>
          </div>
          <div class="line">

            <el-row :gutter="20">
              <el-col :span="9" :offset="1">
                <span><b>申请单位：</b> {{delayForm.applyUnit}}</span>
              </el-col>
              <el-col :span="5">
                <span><b>单位类型：</b> {{delayForm.unitBusiness}}</span>
              </el-col>
              <el-col :span="7">
                <span><b>申请时间：</b> {{delayForm.createTime}}</span>
              </el-col>

            </el-row>
          </div>
          <div class="line">
            <el-row :gutter="20">
              <el-col :span="8" :offset="1" v-if="delayForm.unitSugDetailVo">
                <span><b>预计办完日期：</b> {{delayForm.unitSugDetailVo.expectDate}}</span>
              </el-col>
              <el-col :span="8" :offset="1">
                <span><b>期望延期日期：</b> {{delayForm.applyTime}}</span>
              </el-col>
            </el-row>
          </div>
          <div class="line">
            <el-row :gutter="20">
              <el-col :span="14" :offset="1">
                <span><b>申请理由：</b> {{delayForm.reason}}</span>
              </el-col>
            </el-row>
          </div>
          <el-divider></el-divider>
          <el-form :model="delayForm" :rules="rules" ref="delayForm">
            <el-row>
              <el-col :span="10">
                <el-form-item label="是否同意延期：" :label-width="formLabelWidth" prop="result">
                  <el-switch v-model="delayForm.result" active-text="同意" inactive-text="不同意"></el-switch>
                </el-form-item>
              </el-col>
              <el-col :span="8" v-if="delayForm.result">
                <el-form-item label="实际完成日期：" :label-width="formLabelWidth" prop="delayDate">
                  <el-date-picker type="datetime" value-format="yyyy-MM-dd HH:mm:ss" size="mini" placeholder="实际完成日期" v-model="delayForm.delayDate" style="width: 100%;"></el-date-picker>
                </el-form-item>

              </el-col>
            </el-row>
            <el-form-item size="mini" :label-width="formLabelWidth" label="延期处理说明：" prop="remark">
              <el-input type="textarea" v-model="delayForm.remark" :maxlength="250"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="resetForm">取 消</el-button>
            <el-button type="primary" @click="confirmDelay(false)">确 定</el-button>
          </div>
        </el-dialog>
      </template>
      <div v-else class="no-data">
        您暂时没有查看的权限
      </div>
    </el-card>


    <el-dialog title="查看建议" :visible.sync="viewVisible" width="45%" v-if="suggestion.suggestionVo && suggestion.unitSugDetailVo">
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
          <span><b>提出时间：</b> {{suggestion.suggestionVo.raiseTime}}</span>
        </el-col>
      </el-row>
      <el-row class="item-data">
        <el-col :span="24">
          <span><b>建议内容：</b> {{suggestion.suggestionVo.content}}</span>
        </el-col>
      </el-row>
      <el-row class="item-data">
        <el-col :span="24">
                  <span><b>建议图片：</b>
                        <span v-if="!suggestion.suggestionVo.images">无</span>
                        <div class="img-lsit" v-else v-for="(item,index) in suggestion.suggestionVo.images" :key="index">
                            <el-image
                                    class="image"
                                    :src="API.ServerUrl + item"
                                    :preview-src-list="addAddress(suggestion.suggestionVo.images)">
                             </el-image>
                        </div>
                  </span>
        </el-col>
      </el-row>
      <el-row class="item-data">
        <el-col :span="24">
                  <span><b>附议人：</b>
                      <span>{{suggestion.suggestionVo.seconded}}</span>
                  </span>
        </el-col>
      </el-row>
      <el-row class="item-data">
        <el-col :span="12">
          <span><b>审核人：</b> {{suggestion.suggestionVo.auditor}}</span>
        </el-col>
        <el-col :span="12">
          <span><b>审核时间：</b> {{suggestion.suggestionVo.auditTime}}</span>
        </el-col>
      </el-row>
      <el-divider content-position="center"><h3>办理单位</h3></el-divider>
      <el-row class="item-data">
        <!--              <el-col :span="3">-->
        <!--                  <span><b>办理单位：</b></span>-->
        <!--              </el-col>-->
        <el-col :span="24">
          <el-collapse v-model="activeName" accordion>
            <el-collapse-item :title="suggestion.unitSugDetailVo.unitVo.name +' ('+suggestion.unitTypeName+')'">
              <el-row class="item-data">
                <el-col :span="12">
                  <span><b>单位业务：</b> {{suggestion.unitSugDetailVo.unitVo.businessName}}</span>
                </el-col>
                <el-col :span="12">
                  <span><b>开办时间：</b> {{suggestion.unitSugDetailVo.acceptTime}}</span>
                </el-col>
              </el-row>
              <el-row class="item-data">
                <el-col :span="12">
                  <span><b>预计完成：</b> {{suggestion.expectDate}}</span>
                </el-col>
                <el-col :span="12">
                  <span><b>申请延期：</b> {{suggestion.applyTime}}</span>
                </el-col>
              </el-row>
              <el-row class="item-data">
                <el-col :span="24">
                  <span><b>申请理由：</b> {{suggestion.reason}}</span>
                </el-col>
              </el-row>
              <el-row class="item-data">
                <el-collapse v-model="processName" accordion>
                  <el-collapse-item title="办理流程" name="1">
                    <el-col :span="24">
                      <span><b>办理流程：</b>
                          <span v-if="!suggestion.unitSugDetailVo.processes">无</span>
                          <el-timeline  v-else>
                            <el-timeline-item  v-for="(process, index) in suggestion.unitSugDetailVo.processes" :timestamp="process.handleTime" placement="top">
                              <el-card>
                                <div class="img-lsit" v-for="(img,index) in process.images" :key="index">
                                    <el-image class="image" :src="API.ServerUrl + img" :preview-src-list="addAddress(process.images)"></el-image>
                                </div>
                                <p>{{process.description}}</p>
                              </el-card>
                            </el-timeline-item>
                          </el-timeline>
                      </span>
                    </el-col>
                  </el-collapse-item>
                </el-collapse>
              </el-row>
            </el-collapse-item>
          </el-collapse>
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
          applyUnit: '办理单位',
          unitTypeName: '单位性质',
          createTime: '申请日期',
          applyTime: '期望延期日期',
          reason: '申请理由'
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
        delayForm:{
          uid:'',//建议的uid
          title:'',//建议标题
          businessName:'',//建议类型
          applyUnit:'',//办理单位
          unitBusiness:'',//单位性质
          unitType:'',//单位类型  主办、协办
          unitTypeName:'',//单位性质 主办、协办
          allType:false,//是否展示所有类型
          unit:'',//办理单位单位
          createTime:'',//申请时间
          applyTime:'',//期望延期时间
          reason:'',//申请理由
          result:true,//是否同意延期
          delayDate:'',//实际延期时间
          remark:''//延期说明
        },
        rules: {delayDate: [{required: true, message: '实际完成日期不能为空', trigger: 'blur'}]},
        allUnits:[],
        unitList:[],
        suggestion:{},
        imgPreview:[],
        viewVisible:false,
        activeName:[],
        processName:[],
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
          url: '/suggestion_deal/gov_suggestion/applyDelay',
          noLoading: true,
          params: {
            title:this.searchForm.title,
            business:this.searchForm.business,
            member:this.searchForm.member,
            unit:this.searchForm.unit,
            dateStart:this.searchForm.dateStart,
            dateEnd:this.searchForm.dateEnd,
            searchType:3,//表示查询申请延期的建议
            page: this.currentPage,
            size: this.pageSize
          },
          success: data => {
            this.tableData = data.content;
            this.tableData.forEach(data =>{
              data.title = data.suggestionVo.title;//标题
              data.business = data.suggestionVo.suggestionBusiness.uid;//建议类型
              data.businessName = data.suggestionVo.suggestionBusiness.name;//建议类型
              data.memberName = data.suggestionVo.memberName;//提出人
              data.applyUnit = data.unitSugDetailVo.unitVo.name;//办理单位
              data.unitBusiness = data.unitSugDetailVo.unitVo.businessName;//单位业务
              data.unitType = data.unitSugDetailVo.unitType;//单位类型  主办、协办
              data.unitTypeName = data.unitSugDetailVo.unitTypeName;//单位性质 主办、协办
            });
            this.total = data.totalElements;
          },
        })
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
      delay(row) {
        this.delayForm.uid = row.uid;//延期uid
        this.delayForm.title = row.title;//建议标题
        this.delayForm.business = row.business;//建议类型
        this.delayForm.businessName = row.businessName;//建议类型名称
        this.delayForm.applyUnit = row.applyUnit;//申请单位名称
        this.delayForm.unitBusiness = row.unitBusiness;//单位性质
        this.delayForm.unitType = row.type;//单位性质
        this.delayForm.unitTypeName = row.unitTypeName;//单位性质
        this.delayForm.createTime = row.createTime;//申请时间
        this.delayForm.applyTime = row.applyTime;//期望延期日期
        this.delayForm.delayDate = row.applyTime;//实际延期日期
        this.delayForm.reason = row.reason;//申请理由
        this.formVisible = true;
      },
      confirmDelay(notValid){
        this.$refs['delayForm'].validate((valid) => {
          if (valid || notValid) {
            this.$request.httpRequest({
              method: 'post',
              url: '/suggestion_deal/gov_suggestion/delaySuggestion',
              params: {
                uid: this.delayForm.uid,
                result: this.delayForm.result,
                delayDate: this.delayForm.delayDate,//调整单位
                remark:this.delayForm.remark,//调整说明
              },
              noLoading: true,
              success: data => {
                this.$message({
                  type: 'success',
                  message: '处理延期成功!',
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
        this.suggestion = row;
        this.imgPreview = row.images;
        console.log(this.suggestion)
        this.viewVisible = true;
      },
      resetForm(){
        this.delayForm.title = '';
        this.delayForm.type = '';
        this.delayForm.unit = '';
        this.delayForm.desc = '';
        this.$refs['delayForm'].resetFields();
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
