<template>
    <div class="table-demo">
        <el-card class="list-content" shadow="hover">
            <template v-if="$route.meta.check">
                <div class="container">
                    <el-row>
                        <el-form :model="form" status-icon :rules="rules" ref="form" label-width="210px"
                                 class="demo-ruleForm">
                            <el-form-item label="建议办理周期(单位：天)：" prop="expectDate">
                                <el-col :span="4">
                                    <el-input type="text" v-model.number="form.expectDate" autocomplete="off"></el-input>
                                </el-col>
                                <el-popover
                                        placement="right-end"
                                        trigger="hover"
                                        content="转交建议给办理单位时，默认在周期天数内办理完成">
                                    <svg-icon icon-class="wenhao" style="margin-left: 10px;" slot="reference"/>
                                </el-popover>
                            </el-form-item>
                            <el-form-item label="建议催办频率(单位：天/次)：" prop="urgeFre">
                                <el-col :span="4">
                                    <el-input type="text" v-model.number="form.urgeFre" autocomplete="off"></el-input>
                                </el-col>
                                <el-popover
                                        placement="right-end"
                                        trigger="hover"
                                        content="催办建议后，经过设置天数后才能再次催办">
                                    <svg-icon icon-class="wenhao" style="margin-left: 10px;" slot="reference"/>
                                </el-popover>
                            </el-form-item>
                            <el-form-item label="建议临期提醒(单位：天)：" prop="deadline">
                                <el-col :span="4">
                                    <el-input type="text" v-model.number="form.deadline" autocomplete="off"></el-input>
                                </el-col>
                                <el-popover
                                    placement="right-end"
                                    trigger="hover"
                                    content="截止办理周前多久给出快到期提醒">
                                    <svg-icon icon-class="wenhao" style="margin-left: 10px;" slot="reference"/>
                                </el-popover>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="saveSetting()">保存设置</el-button>
                            </el-form-item>
                        </el-form>
                    </el-row>
                </div>
            </template>
            <div v-else class="no-data">
                <i class="fa fa-danger"></i>您暂时没有查看的权限！！！
            </div>
        </el-card>
        <!-- 分页 -->
    </div>
</template>
<script>
    import {isvalidPositiveNumber} from '../../../../assets/utils/validate'

    export default {
        data() {
            return {
                form: {
                    uid: '',
                    expectDate: 90,
                    urgeFre: 3,
                    deadline: 15
                },
                rules: {
                    expectDate: [
                        {required: true, message: '默认办理周期不能为空'},
                        {type: 'integer', min: 0, message: '默认办理周期必须为正整数值'}
                    ],
                    urgeFre: [
                        {required: true, message: '催办频率不能为空'},
                        {type: 'integer', min: 0, message: '催办频率必须为正整数值'}
                    ],
                    deadline: [
                        {required: true, message: '临期提醒不能为空'},
                        {type: 'integer', min: 0, message: '临期提醒必须为正整数值'}
                    ],
                },
                offset: 5,
            }
        },
        mounted() {
            this.getData()
        },
        methods: {
            getData() {
                this.$request.httpRequest({
                    method: 'get',
                    url: '/suggestion_deal/sug_setting/getSetting',
                    noLoading: true,
                    returnFullData: false,
                    success: data => {
                        this.form = data;
                    },
                    error: e => {
                        this.tableLoading = false
                    }
                })
            },

            saveSetting() {
                this.$request.httpRequest({
                    method: 'post',
                    url: '/suggestion_deal/sug_setting/saveSugSetting',
                    params: {
                        uid: this.form.uid,
                        expectDate: this.form.expectDate,
                        deadline: this.form.deadline,
                        urgeFre: this.form.urgeFre,
                    },
                    success: data => {
                        this.getData();
                        this.$message({
                            type: 'success',
                            message: '保存成功!'
                        });
                    },
                    error: e => {
                        this.$message({
                            type: 'warning',
                            message: '保存失败!'
                        });
                    }
                })
            }
        }
    }
</script>
<style lang="scss" scoped>
    @import '~@/styles/table/table';

    .container {
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
