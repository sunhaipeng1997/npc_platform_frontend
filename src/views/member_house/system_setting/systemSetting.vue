<template>
    <div class="table-demo">
        <el-card class="list-content" shadow="hover">
            <template v-if="$route.meta.check">

                <div class="container">
                    <el-form ref="form" :model="form" label-width="350px">
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="是否展示区代表在下级单位的履职信息：">
                                    <el-switch
                                            v-model="form.showSubPerformance"
                                            active-color="#13ce66"
                                            inactive-color="#ff4949"
                                            active-text="开启"
                                            inactive-text="关闭">
                                    </el-switch>
                                    <el-popover
                                            placement="right-end"
                                            trigger="hover"
                                            content="开启时，区管理员可以导出区代表在区上和街镇上的建议、意见，履职信息；关闭时，区管理员只能导出区代表在区上的建议、意见、履职信息">
                                        <svg-icon icon-class="wenhao" style="margin-left: 10px;" slot="reference"/>
                                    </el-popover>
                                </el-form-item>
                            </el-col>

                            <el-col :span="8">
                                <el-form-item label="选民是否可以向非本组代表提意见：">
                                    <el-switch
                                            v-model="form.voterOpinionToAll"
                                            active-color="#13ce66"
                                            inactive-color="#ff4949"
                                            active-text="开启"
                                            inactive-text="关闭">
                                    </el-switch>
                                    <el-popover
                                            placement="right-end"
                                            trigger="hover"
                                            content="开启时，选民可以向本镇所有代表提意见；关闭时，选民只能本村所在小组的代表提意见">
                                        <svg-icon icon-class="wenhao" style="margin-left: 10px;" slot="reference"/>
                                    </el-popover>
                                </el-form-item>
                            </el-col>
                        </el-row>

                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="代表是否可以向代表提意见：">
                                    <el-switch
                                            v-model="form.memberOpinionToMember"
                                            active-color="#13ce66"
                                            inactive-color="#ff4949"
                                            active-text="开启"
                                            inactive-text="关闭">
                                    </el-switch>
                                    <el-popover
                                            placement="right-end"
                                            trigger="hover"
                                            content="开启时，代表也拥有提意见的功能；关闭时，代表不能提意见">
                                        <svg-icon icon-class="wenhao" style="margin-left: 10px;" slot="reference"/>
                                    </el-popover>
                                </el-form-item>
                            </el-col>

                            <el-col :span="8">
                                <el-form-item label="是否开启软件更新提示：">
                                    <el-switch
                                            v-model="form.pushUpdate"
                                            active-color="#13ce66"
                                            inactive-color="#ff4949"
                                            disabled="true"
                                            active-text="开启"
                                            inactive-text="关闭">
                                    </el-switch>
                                    <el-popover
                                            placement="right-end"
                                            trigger="hover"
                                            content="开启时，在软件需要更新的时候，将会推送消息给每位用户，让用户提前准备；关闭时，用户不会收到任何消息">
                                        <svg-icon icon-class="wenhao" style="margin-left: 10px;" slot="reference"/>
                                    </el-popover>
                                </el-form-item>
                            </el-col>
                        </el-row>

                        <el-row style="margin-top: 5%">
                            <el-col :offset="offset" :span="8">
                                <el-button type="primary" size="large" style="width: 150px" plain @click="saveSetting">
                                    保存
                                </el-button>
                            </el-col>

                        </el-row>
                    </el-form>
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
    export default {
        data() {
            return {
                form: {
                    uid:'',
                    showSubPerformance: true,//展示履职信息时是否展示下级单位履职
                    voterOpinionToAll: true,//选民是否可以向非本组代表提意见
                    memberOpinionToMember: true,//代表是否可以向代表提意见
                    quickWork: true,//是否开启软件快捷办公
                    floatNotice: true,//是否开启全局浮动公告
                    pushNews: true,//是否开启新闻推送(微信端通过服务号，安卓端通过消息通知)
                    pushStudy: true,//是否开启学习活动推送
                    pushUpdate: true//是否开启软件更新提示
                },
                offset:5
            }
        },
        mounted() {
            this.getData()
        },
        methods: {
            getData() {
                this.$request.httpRequest({
                    method: 'get',
                    url: '/manager/systemSetting/getSystemSetting',
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
                    url: '/manager/systemSetting/saveSystemSetting',
                    params: {
                        uid: this.form.uid,
                        showSubPerformance: this.form.showSubPerformance,
                        voterOpinionToAll: this.form.voterOpinionToAll,
                        memberOpinionToMember: this.form.memberOpinionToMember,
                        quickWork: this.form.quickWork,
                        floatNotice: this.form.floatNotice,
                        pushNews: this.form.pushNews,
                        pushStudy: this.form.pushStudy,
                        pushUpdate: this.form.pushUpdate,
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

    .table-demo {
        padding: 25px;
    }

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
