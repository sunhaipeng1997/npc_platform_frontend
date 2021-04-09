<template>
    <div class="table-demo">
        <el-card class="list-content" shadow="hover">
            <template v-if="$route.meta.check">

                <div class="searchBar">
                    <el-form ref="form" :model="searchForm" label-width="80px">
                        <el-row :gutter="50">
                            <el-col :span="18">
                                <el-row :gutter="12">
                                    <el-col :span="6">
                                        <el-form-item label="用户名">
                                            <el-input placeholder="请输用户名" size="mini"
                                                      v-model="searchForm.realname"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-form-item label="手机号">
                                            <el-input placeholder="请输手机号" size="mini"
                                                      v-model="searchForm.mobile"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-button type="primary" size="mini" @click="getData">搜索</el-button>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>

                <el-table v-loading="tableLoading" border size="mini" :header-row-style="{ 'font-size':'15px'}"
                          :data="tableData" style="width: 100%" class="table-content">
                    <el-table-column type="index" label="序号" align="center" sortable width="60"/>
                    <el-table-column v-for="(item,index) in tableHeader" show-overflow-tooltip  :key="index" :prop="index" sortable
                                     :label="item" align="center"/>
                    <el-table-column label="操作" width="230" align="center" class-name="operation">
                        <template slot-scope="scope">
                            <a v-if="$route.meta.edit && scope.row.status == 1" class="item-success"
                               @click="changeStatus(scope.row, 2)">停用</a>
                            <a v-if="$route.meta.edit && scope.row.status == 2" class="item-danger"
                               @click="changeStatus(scope.row, 1)">启用</a>
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
            <div v-else class="no-data">
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
          realname: '名字',
          mobile: '电话号码',
          loginTimes: '登录次数',
          lastLoginTime: '上次登录时间'
        },
        //tableData: [{id:"123",phone:"12312312",name:"idcard",gender:"男",age:"18"},{id:"123",phone:"12312312",name:"idcard",gender:"男",age:"18"},{id:"123",phone:"12312312",name:"idcard",gender:"男",age:"18"}],
        tableData: [],
        searchForm: {
          name: '',
          mobile: '',
          date: ''
        },
        pageSize: 20,
        currentPage: 1,
        total: 0
      }
    },
    mounted() {
      this.getData()
    },
    methods: {
      changeStatus(row, status) {
        this.$request.httpRequest({
          method: 'post',
          url: '/manager/account/changeStatus',
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
            this.getData()
          },
          error: e => {
            this.getData()
          }
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
        this.tableLoading = true
        setTimeout(() => {
          this.$request.httpRequest({
            method: 'get',
            url: '/manager/account/findAccount',
            noLoading: true,
            returnFullData: false,
            params: {
              realname: this.searchForm.realname,
              mobile: this.searchForm.mobile,
              page: this.currentPage,
              size: this.pageSize,
              property: 'loginTimes',
              direction: 'desc'
            },
            success: data => {
              console.log(data, data)
              this.tableData = data.content;
              this.total = data.totalElements;
              this.tableLoading = false
            },
            error: e => {
              this.tableLoading = false
            }
          })
        })
      },
      test(row) {
        console.log('tableRow', row)
      }
    }
  }
</script>
<style lang="scss" scoped>
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
