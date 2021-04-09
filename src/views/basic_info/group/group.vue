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
                                        <el-form-item label="小组名称">
                                            <el-input placeholder="请输小组名称" size="mini"
                                                      v-model="searchForm.searchKey"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-button type="primary" size="mini" @click="getData(0,$event)">搜索</el-button>
                                        <el-button type="primary" size="mini" @click="addGroup">添加</el-button>
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
                    <el-table-column prop="village" label="包含选区/村"  width="220" align="center">
                        <template slot-scope="scope">
                            <div v-if="index<4" v-for="(item,index) in scope.row.villages">{{index<3?item.name:index<4?'...':''}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="230" align="center" class-name="operation">
                        <template slot-scope="scope">
                            <a v-if="$route.meta.edit" class="item" @click="viewGroupMember(scope.row)">查看小组成员详情</a>
                            <a v-if="$route.meta.edit" class="item" @click="updateGroup(scope.row)">修改</a>
                            <a v-if="$route.meta.delete" class="item" @click="deleteGroup(scope.row)">删除</a>
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
                <el-dialog :title="form.title" :visible.sync="addFormVisible" :before-close="handleClose">
                    <el-form :model="form" :rules="rules" ref="form" >
                        <el-form-item label="小组名称" :label-width="formLabelWidth" prop="name">
                            <el-col :span="12">
                                <el-input v-model="form.name" autocomplete="off"></el-input>
                            </el-col>
                        </el-form-item>
                        <el-form-item label="小组简介" :label-width="formLabelWidth" prop="description">
                            <el-input type="textarea" v-model="form.description" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="包含选区/村" prop="villages">
                            <el-checkbox-group v-model="form.villages" v-if="!this.form.uid">
                                <el-checkbox v-for="item in optional" :label="item.uid" :key="item.uid">
                                    {{item.name}}
                                </el-checkbox>
                            </el-checkbox-group>
                            <el-checkbox-group v-model="form.villages" v-if="this.form.uid">
                                <el-checkbox v-for="item in modifiable" :label="item.uid" :key="item.uid">
                                    {{item.name}}
                                </el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="resetForm('form')">取 消</el-button>
                        <el-button type="primary" @click="confirmAddOrUpdate('form')">确 定</el-button>
                    </div>
                </el-dialog>

                <!--查看成员详情弹框-->
                <el-dialog :title="title" :visible.sync="showMemberDetailsVisible">
                    <el-table v-loading="tableLoading" border size="mini" :header-row-style="{ 'font-size':'15px'}"
                              :data="DetailsTableData" style="width: 100%" class="table-content">
                        <el-table-column type="index" label="序号" align="center" sortable width="60"/>
                        <el-table-column v-for="(item,variable) in DetailsTableHeader" :key="variable"
                                         :prop="variable" sortable :label="item" align="center"/>
                    </el-table>
                </el-dialog>
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
        title:"查看成员详情",
        form: {
          title:'',
          uid:'',
          name: '',
          description: '',
          villages:[],  //提交时复选框中包含的村
        },
        villages:[],  //该小组已选择的村
        optional:[],  //添加小组时复选框显示的村
        modifiable:[],  //修改小组时复选框显示的村
        addFormVisible: false,
        showMemberDetailsVisible: false,
        formLabelWidth: '100px',
        rules: {
          name: [
            {required: true, message: '小组名称不能为空', trigger: 'blur'}
          ],
          description: [
            { max: 200, message: '长度在 200 个字符以内', trigger: 'blur' }
          ],
        },
        tableLoading: false,
        tableHeader: {
          name: '小组名称',
          description: '小组简介',
          memberCount:'小组人数',
        },
        DetailsTableHeader: {
          name: '姓名',
          // avatar: '头像',
          gender: '性别',
          mobile: '联系方式',
        },
        tableData: [],
        DetailsTableData:[],
        searchForm: {
          searchKey: '',
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
        handleClose() {
            this.$confirm('确认关闭？')
                .then(_ => {
                    this.resetForm('form');
                })
                .catch(_ => {});
        },
      reqOptional(){
        this.$request.httpRequest({
          method: 'get',
          url: "/manager/village/optional",
          noLoading: true,
          returnFullData:false,
          success: data => {
            console.log(data);
            this.optional = data;
            console.log(this.optional);
          },
          error: e => {
          }
        })
      },
      confirmAddOrUpdate(formName) {
        let that = this;
        let regUrl = that.form.uid ? "/manager/group/update" : "/manager/group/add";
        // console.log("这是uid:" + that.form.uid);
        this.$refs[formName].validate((valid) => {
          if (that.form.villages.length == 0) {
            this.$message({
              type: 'warning',
              message: "包含选区或者村不能为空"
            });
            return false;
          }
          if (valid) {
            that.$request.httpRequest({
              method:"post",
              url: regUrl,
              noLoading: true,
              params: {
                uid: that.form.uid,
                name: that.form.name,
                description: that.form.description,
                villages: that.form.villages + "",
              },
              success: data => {
                this.$message({
                  type: 'success',
                  message: that.form.uid?'修改成功!':'添加成功!'
                });
                that.resetForm('form');
                that.getData();
              },
              error: e => {
              }
            })
          } else {
            return false;
          }
        });
      },
      addGroup() {
        this.form.title = '添加小组';
        this.form.uid = '';
        this.form.name = "";
        this.form.description = "";
        this.form.villages = [];
        this.reqOptional();
        this.showForm();
      },
      updateGroup(item) {
        this.form.title = '修改小组';
        console.log(item.uid);
        this.form.uid = item.uid;
        this.form.name = item.name;
        this.form.description = item.description;
        this.$request.httpRequest({
          method: 'get',
          url: "/manager/village/modifiable",
          params: {
            uid: item.uid
          },
          noLoading: true,
          returnFullData:false,
          success: data => {
            for(var i = 0; i < data[0].length; i++){
              this.form.villages.push(data[0][i].uid)
            };
            // this.form.villages = data[0];
            this.modifiable = data[1];
            // console.log(this.modifiable);
            // console.log(this.form.villages);
          },
          error: e => {
          }
        })
        this.showForm();
      },
      viewGroupMember(item) {
        // alert("来了来了");
        this.DetailsTableData = item.members;
        this.showDetailsForm();
      },
      showForm() {
        this.addFormVisible = true;
      },
      showDetailsForm() {
        this.showMemberDetailsVisible = true;
      },
      deleteGroup(row) {
        this.$confirm('确认删小组吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$request.httpRequest({
            method: 'delete',
            url: "/manager/group/delete",
            noLoading: true,
            params: {
              uid: row.uid
            },
            success: data => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.getData();
            },
            error: (data, e) => {
              this.getData();
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      handleCurrentChange(val) {
        this.currentPage = val
        this.getData()
      },
      handleSizeChange(val) {
        this.pageSize = val
        this.getData()
      },
      getData(times,event) {
          if(event){
              this.currentPage = 1;
          }
        this.tableLoading = true
        setTimeout(() => {
          this.$request.httpRequest({
            method: 'get',
            url: '/manager/group/page',
            noLoading: true,
            returnFullData: false,
            params: {
              searchKey: this.searchForm.searchKey,
              page: this.currentPage,
              size: this.pageSize,
              property: 'id',
              direction: 'asc'
            },
            success: data => {
              // console.log(data, data)
              this.tableData = data.content;
              this.villages = data.content.villages;
              this.total = data.totalElements;
              this.tableLoading = false
            },
            error: e => {
              this.tableLoading = false
            }
          })
        })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
          this.form.uid='';
          this.form.title='';
          this.form.uid='';
          this.form.name= '';
          this.form.description= '';
          this.form.villages=[];  //提交时复选框中包含的村
        this.addFormVisible = false
      },
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
