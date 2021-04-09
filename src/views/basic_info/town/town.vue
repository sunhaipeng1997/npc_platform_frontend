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
                                        <el-form-item label="镇名称">
                                            <el-input placeholder="请输镇名称" size="mini"
                                                      v-model="searchForm.searchKey"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-button type="primary" size="mini" @click="getData()">搜索</el-button>
                                        <el-button type="primary" size="mini" @click="addTown">添加</el-button>
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
                    <el-table-column prop="village" label="包含小组"  width="220" align="center">
                        <template slot-scope="scope">
<!--                            <div v-if="index<4" v-for="(item,index) in scope.row.groups">{{index<3?item.name:index<4?'...':''}}</div>-->
                            <el-popover trigger="hover" placement="top">
                                <p v-if="scope.row.groups.length > 0" v-for="item in scope.row.groups">
                                    小组名称: {{ item.name }}</p>
                                <p v-if="scope.row.groups.length == 0">未添加小组</p>
                                <div slot="reference">
                                    {{ scope.row.groups.length }}个
                                </div>
                            </el-popover>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="230" align="center" class-name="operation">
                        <template slot-scope="scope">
                            <a v-if="$route.meta.edit" class="item" @click="updateTown(scope.row)">修改</a>
                            <a v-if="$route.meta.delete" class="item-danger" @click="deleteTown(scope.row)">删除</a>
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
                        <el-form-item label="镇/街道名称" :label-width="formLabelWidth" prop="name">
                            <el-col :span="14">
                                <el-input v-model="form.name" autocomplete="off"></el-input>
                            </el-col>
                        </el-form-item>
                        <el-form-item v-if="show"
                                      size="mini"
                                      :label-width="formLabelWidth"
                                      label="镇/街道"
                                      prop="type">
                            <el-radio-group v-model="form.type">
                                <el-radio :label=1>镇</el-radio>
                                <el-radio :label=2>街道</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item v-if="show" label="管理员账号" :label-width="formLabelWidth" prop="account">
                            <el-col :span="14">
                                <el-input v-model="form.account" autocomplete="off"></el-input>
                            </el-col>
                        </el-form-item>
                        <el-form-item v-if="show"  label="账号密码" :label-width="formLabelWidth" prop="password">
                            <el-col :span="14">
                                <el-input type="password" v-model="form.password" autocomplete="off"></el-input>
                            </el-col>
                        </el-form-item>
                        <el-form-item v-if="show" label="确认密码" :label-width="formLabelWidth" prop="rePassword">
                            <el-col :span="14">
                                <el-input type="password" v-model="rePassword" autocomplete="off"></el-input>
                            </el-col>
                        </el-form-item>
                        <el-form-item v-if="show" label="管理员手机号" :label-width="formLabelWidth" prop="mobile">
                            <el-col :span="14">
                                <el-input v-model="form.mobile" autocomplete="off"></el-input>
                            </el-col>
                        </el-form-item>
                        <el-form-item label="镇/街道简介" :label-width="formLabelWidth" prop="description">
                            <el-input type="textarea" v-model="form.description" autocomplete="off"></el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="resetForm('form')">取 消</el-button>
                        <el-button type="primary" @click="confirmAddOrUpdate('form')">确 定</el-button>
                    </div>
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
  import { isvalidPhoneNumber, isvalidCode, isvalidPassword } from '@/assets/utils/validate'
  export default {
    data() {
      const validatePhoneNumber = (rule, value, callback) => {
        if (!isvalidPhoneNumber(value)) {
          callback(new Error('手机号格式不正确'))
        } else {
          callback()
        }
      };
      const validatePass = (rule, value, callback) => {
        if (!isvalidPassword(value)) {
          callback(new Error('密码必须是数字+字母的组合，最少6位，最多20位'))
        } else {
          callback()
        }
      };
      const validaterePass = (rule, value, callback) => {
        if (this.form.password != this.rePassword) {
          callback(new Error('确认密码必须与账号密码一致'))
        } else {
          callback()
        }
      };
      return {
        form: {
          title:'',
          uid:'',
          name: '',
          type: '',
          account: '',
          password: '',
          mobile: '',
          description: '',
        },
        groups:[],
        show:true,
        rePassword:"",
        addFormVisible: false,
        formLabelWidth: '120px',
        rules: {
          name: [{ required: true, message: '镇名称不能为空', trigger: 'blur' }],
          type: [{ required: true, message: '类型必选', trigger: 'blur' }],
          account: [{ required: true, message: '账号名称不能为空', trigger: 'blur' }],
          password: [{ required: true, message: '密码必须是数字+字母的组合，最少6位，最多20位', trigger: 'blur', validator: validatePass }],
          rePassword: [{ required: true, message: '确认密码必须与账号密码一致', trigger: 'blur', validator: validaterePass }],
          mobile: [{ required: true, message: '手机号不能为空', trigger: 'blur', validator: validatePhoneNumber }],
          description: [{ max: 200, message: '长度在 200 个字符以内', trigger: 'blur' }],
        },
        tableLoading: false,
        tableHeader: {
          name: '镇/街道名称',
          typeName: '类型',
          description: '镇/街道简介',
          mobile: '管理员电话'
        },
        tableData: [],
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
            this.$message({
              type: 'warning',
              message: '获取村失败!'
            });
          }
        })
      },
      confirmAddOrUpdate(formName) {
        let that = this;
        let regUrl = that.form.uid ? "/manager/town/update" : "/manager/town/add";
        this.$refs[formName].validate((valid) => {
          if (valid) {
            that.$request.httpRequest({
              method:"post",
              url: regUrl,
              noLoading: true,
              params: {
                uid: that.form.uid,
                name: that.form.name,
                type: that.form.type,
                account: that.form.account,
                password: that.form.password,
                mobile: that.form.mobile,
                description: that.form.description,
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
                this.$message({
                  type: 'warning',
                  message: (this.form.uid?'修改失败! ':'添加失败! ')+e.message
                });
              }
            })
          } else {
            return false;
          }
        });
      },
      addTown() {
        this.form.title = '添加镇';
        this.form.uid = '';
        this.form.name = '';
        this.form.type = '';
        this.form.account = '';
        this.form.password = '';
        this.form.mobile = '';
        this.form.description = '';
        this.show = true;
        this.showForm();
      },
      updateTown(item) {
        this.form.title = '修改镇';
        this.form.uid = item.uid;
        this.form.name = item.name;
        this.form.type = item.type;
        this.form.description = item.description;
        this.show = false;
        this.showForm();
      },
      showForm() {
        this.addFormVisible = true;
      },
      deleteTown(row) {
        this.$confirm('确认删镇吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$request.httpRequest({
            method: 'delete',
            url: "/manager/town/delete",
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
              this.$message({
                type: 'warning',
                message: '删除失败!' + data.get("message")
              });
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
      getData(event) {
          if(event){
              this.currentPage = 1;
          }
        this.tableLoading = true
        setTimeout(() => {
          this.$request.httpRequest({
            method: 'get',
            url: '/manager/town/page',
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
              this.tableData = data.content;
              this.groups = data.content.groups;
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
          this.form.title='';
          this.form.uid='';
          this.form.name= '';
          this.form.account= '';
          this.form.password= '';
          this.form.mobile= '';
          this.form.description= '';
          this.addFormVisible = false
      },
      // test(row) {
      //   console.log('tableRow', row)
      // }
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
