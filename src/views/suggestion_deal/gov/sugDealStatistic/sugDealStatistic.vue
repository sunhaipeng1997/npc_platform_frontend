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
                    <el-form-item label="代表电话">
                      <el-input placeholder="请输入代表电话" size="mini" v-model="searchForm.mobile"></el-input>
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
                    <el-form-item label="审核日期">
                      <el-col :span="10">
                        <el-date-picker type="date"
                                        value-format="yyyy-MM-dd"
                                        size="mini"
                                        placeholder="选择开始日期"
                                        v-model="searchForm.dateStart"
                                        style="width: 100%;"></el-date-picker>
                      </el-col>
                      <el-col class="line el-col-md-offset-1" :span="1"><b>至</b></el-col>
                      <el-col :span="10">
                        <el-date-picker type="date" value-format="yyyy-MM-dd" size="mini"
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
              <a v-if="$route.meta.edit" class="item" @click="test(scope.row)">修改</a>
              <a v-if="$route.meta.delete" class="item" @click="test(scope.row)">删除</a>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <div v-else class="no-data">
        您暂时没有查看的权限
      </div>
    </el-card>
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
          auditAt: '审核日期',
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
        total: 0
      }
    },
    mounted() {
      this.getSugType();
      this.getData()
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
          error: e => {
          }
        })
      },
      test(row) {
        console.log('tableRow', row)
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
</style>
