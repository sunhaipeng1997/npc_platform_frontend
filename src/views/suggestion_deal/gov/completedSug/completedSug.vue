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
                        <el-option v-for="item in unitList" :key="item.uid" :label="item.name" :value="item.uid"></el-option>
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
                    <el-form-item label="办结日期">
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
              <a v-if="$route.meta.edit" class="item" @click="suggestionDetail(scope.row)">查看详情</a>
              <!--              <a v-if="$route.meta.delete" class="item" @click="test(scope.row)">删除</a>-->
            </template>
          </el-table-column>
        </el-table>
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
      <el-divider content-position="center"><h3>办理单位</h3></el-divider>
      <el-row class="item-data">
        <!--              <el-col :span="3">-->
        <!--                  <span><b>办理单位：</b></span>-->
        <!--              </el-col>-->
        <el-col :span="24">
          <el-collapse v-model="activeName" accordion>
            <el-collapse-item v-for="(item,index) in suggestion.unitSugDetailVos" :title="item.unitVo.name +' ('+item.unitTypeName+')'" :name="index">
              <el-row class="item-data">
                <el-col :span="12">
                  <span><b>单位业务：</b> {{item.unitVo.businessName}}</span>
                </el-col>
                <el-col :span="12">
                  <span><b>开办时间：</b> {{item.acceptTime}}</span>
                </el-col>
              </el-row>
              <el-row class="item-data">
                <el-collapse v-model="processName" accordion>
                  <el-collapse-item title="办理流程" name="1">
                    <el-col :span="24">
                                          <span><b>办理流程：</b>
                                              <span v-if="!item.processes">无</span>
                                              <el-timeline  v-else>
                                                <el-timeline-item  v-for="(process, index) in item.processes" :timestamp="process.handleTime" placement="top">
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
                  <el-collapse-item title="办理结果" name="2">
                    <el-col :span="24">
                      <el-row class="item-data"  v-if="item.resultVo">
                        <el-col :span="24">
                          <span><b>结果说明：</b> {{item.resultVo.result}}</span>
                        </el-col>
                      </el-row>
                      <el-row class="item-data">
                        <el-col :span="24">
                                                  <span><b>结果附件：</b>
                                                        <span v-if="!item.resultVo.images">无</span>
                                                         <div v-else class="img-lsit" v-for="(img,index) in item.resultVo.images" :key="index">
                                                            <el-image class="image" :src="API.ServerUrl + img" :preview-src-list="addAddress(item.resultVo.images)"></el-image>
                                                        </div>
                                                  </span>
                        </el-col>
                      </el-row>
                    </el-col>
                  </el-collapse-item>
                </el-collapse>
              </el-row>
            </el-collapse-item>
          </el-collapse>
        </el-col>
      </el-row>

      <el-divider content-position="center" v-if="suggestion.resultVo"><h3>办理结果</h3></el-divider>
      <el-row class="item-data"  v-if="suggestion.resultVo">
        <el-col :span="24">
          <span><b>结果说明：</b> {{suggestion.resultVo.result}}</span>
        </el-col>
      </el-row>
      <el-row class="item-data"  v-if="suggestion.resultVo">
        <el-col :span="24">
                  <span><b>结果附件：</b>
                        <span v-if="!suggestion.resultVo.images">无</span>
                         <div v-else class="img-lsit" v-for="(img,index) in suggestion.resultVo.images" :key="index">
                            <el-image class="image" :src="API.ServerUrl + img" :preview-src-list="addAddress(suggestion.resultVo.images)"></el-image>
                        </div>
                  </span>
        </el-col>
      </el-row>

      <el-divider content-position="center" v-if="suggestion.appraiseVo"><h3>评价</h3></el-divider>
      <el-row class="item-data"  v-if="suggestion.appraiseVo">
        <el-col :span="12">
          <el-row>
            <el-col :span="6">
              <span><b>办理结果：</b></span>
            </el-col>
            <el-col :span="12">
              <el-rate disabled="disabled" v-model="suggestion.appraiseVo.result"></el-rate>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="12">
          <el-row>
            <el-col :span="6">
              <span><b>办理态度：</b></span>
            </el-col>
            <el-col :span="12">
              <el-rate disabled="disabled" v-model="suggestion.appraiseVo.attitude"></el-rate>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row class="item-data" v-if="suggestion.appraiseVo">
        <el-col :span="24">
                  <span><b>评价说明：</b>
                        <span>{{suggestion.appraiseVo.reason}}</span>
                  </span>
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
          unitName: '主办单位',
          coUnitName: '协办单位',
          content: '建议内容',
          accomplishTime:'办结时间'
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
        unitList:[],
        suggestion:{},
        viewVisible:false,
        activeName:[],
        processName:[]
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
            unit:this.searchForm.unit,
            dateStart:this.searchForm.dateStart,
            dateEnd:this.searchForm.dateEnd,
            searchType:6,//表示查询已办结的建议
            page: this.currentPage,
            size: this.pageSize
          },
          success: data => {
            this.tableData = data.content;
            this.total = data.totalElements;
          },
          error: e => {
          }
        })
      },
      //获取单位列表
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

      suggestionDetail(row) {
        this.viewVisible = true;
        this.suggestion = row;
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
