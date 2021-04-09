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
<!--                  <el-col :span="6">-->
<!--                    <el-form-item label="代表电话">-->
<!--                      <el-input placeholder="请输入代表电话" size="mini" v-model="searchForm.mobile"></el-input>-->
<!--                    </el-form-item>-->
<!--                  </el-col>-->
                </el-row>
              </el-col>
              <el-col :span="6">
                <el-button type="primary" size="mini" @click="getData()">搜索</el-button>
<!--                <el-button type="primary" size="mini" @click="">导出</el-button>-->
              </el-col>
              <el-col :span="18">
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item label="审核日期">
                      <el-col :span="10">
                        <el-date-picker type="datetime"
                                        value-format="yyyy-MM-dd HH:mm:ss"
                                        size="mini"
                                        placeholder="选择开始日期"
                                        v-model="searchForm.dateStart"
                                        style="width: 100%;"></el-date-picker>
                      </el-col>
                       <el-col class="line el-col-md-offset-1" :span="1"><b>至</b></el-col>
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
              <a v-if="$route.meta.edit" class="item" @click="convey(scope.row)">转办</a>
              <a v-if="$route.meta.check" class="item" @click="suggestionDetail(scope.row)">查看详情</a>
            </template>
          </el-table-column>
        </el-table>
        <!--添加修改弹框-->
        <el-dialog title="转办建议"
                   :before-close="handleClose"
                   :visible.sync="formVisible">
          <div>
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
          <el-divider></el-divider>
          <el-form :model="conveyForm"
                   :rules="rules"
                   ref="conveyForm">
            <el-form-item label="主办单位：" :label-width="formLabelWidth" prop="mainUnit">
                <el-select v-model="conveyForm.mainUnit" placeholder="请选择">
                  <el-option
                          v-for="item in unitList"
                          :key="item.uid"
                          :label="item.name"
                          :value="item.uid">
                  </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="协办单位：" :label-width="formLabelWidth">
                <el-select v-model="conveyForm.coUnits" multiple placeholder="请选择">
                  <el-option
                          v-for="item in unitList"
                          :key="item.uid"
                          :label="item.name"
                          :value="item.uid">
                  </el-option>
                </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer"
               class="dialog-footer">
            <el-button @click="resetForm">取 消</el-button>
            <el-button type="primary"
                       @click="confirmConvey">确 定
            </el-button>
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
        <el-col :span="24">
          <span><b>建议内容：</b> {{suggestion.content}}</span>
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
  data() {
    return {
      tableLoading: false,
      tableHeader: {
        title: '标题',
        businessName: '建议类型',
        memberName: '提出人',
        auditor: '审核人',
        auditTime: '审核日期',
        content: '建议内容'
      },
      tableData: [],
      searchForm:{
        title:'',
        business:'',
        member:'',
        mobile:'',
        dateStart:'',
        dateEnd:'',
      },
      businessList:[],
      pageSize: 20,
      currentPage: 1,
      total: 0,
      formVisible:false,
      formLabelWidth:'121px',
      searchByType:true,
      conveyForm:{
        uid:'',//建议的uid
        title:'',//建议标题
        business:'',//建议类型
        allType:false,//是否展示所有类型
        mainUnit:'',//主办单位
        coUnits:[]//协办单位
      },
      rules: {
        mainUnit: [
          {
            required: true,
            message: '主办单位不能为空',
            trigger: 'blur',
          },
        ],
      },
      unitList:[],
      suggestion:{},
      imgPreview:[],
      viewVisible:false,
    }
  },
  mounted() {
    this.getSugType();
    this.getData();
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
        url: '/suggestion_deal/gov_suggestion/getGovSuggestion',
        noLoading: true,
        params: {
          title:this.searchForm.title,
          business:this.searchForm.business,
          member:this.searchForm.member,
          mobile:this.searchForm.mobile,
          dateStart:this.searchForm.dateStart,
          dateEnd:this.searchForm.dateEnd,
          searchType:1,//表示查询待转办的建议
          page: this.currentPage,
          size: this.pageSize
        },
        success: data => {
          this.tableData = data.content;
          this.total = data.totalElements;
        },
      })
    },

    changeUnitList(){
      if (this.conveyForm.allType){
        this.getUnitList();
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
          this.unitList = data;
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
      this.conveyForm.uid = row.uid;
      this.conveyForm.title = row.title;
      this.conveyForm.businessName = row.suggestionBusiness.name;
      this.conveyForm.business = row.suggestionBusiness.uid;
      this.getUnitListByType();
      this.formVisible = true;
    },
    confirmConvey(){
      if (this.conveyForm.coUnits.indexOf(this.conveyForm.mainUnit) !== -1){
        this.$message({
          type: 'warning',
          message: '不能将主办单位添加为协办单位!',
        });
      }else {
        this.$request.httpRequest({
          method: 'post',
          url: '/suggestion_deal/gov_suggestion/conveySuggestion',
          params: {
            uid: this.conveyForm.uid,
            mainUnit: this.conveyForm.mainUnit,
            coUnits: this.conveyForm.coUnits+"",
          },
          noLoading: true,
          success: data => {
            this.$message({
              type: 'success',
              message: '转办成功!',
            });
            this.resetForm();
            this.getData();
            this.formVisible = false;
          },
        })
      }
    },
    suggestionDetail(row){
      this.viewVisible = true;
      this.suggestion = row;
      this.imgPreview = row.images;
    },
    resetForm(){
      this.conveyForm.title = '';
      this.conveyForm.type = '';
      this.conveyForm.mainUnit = '';
      this.conveyForm.coUnits = [];
      this.conveyForm.allType = false;
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
