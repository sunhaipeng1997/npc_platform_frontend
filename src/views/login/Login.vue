<template>
    <div class="login-container">
        <el-form
                ref="loginForm"
                :model="loginForm"
                :rules="loginByPswRules"
                class="login-form"
                autocomplete="on"
                label-position="left"
        >
            <div class="title">
                欢迎登录代表之家智慧平台
            </div>
            <el-card shadow="hover" class="login-card">
                <template>

                    <el-form-item prop="username" class="login-input-item">
                        <span class="svg-container">
                          <svg-icon icon-class="account"/>
                        </span>
                        <el-input
                                v-model="loginForm.username"
                                autocomplete="on"
                                name="username"
                                type="text"
                                placeholder="用户名"
                                style="padding-left: 45px"
                        />
                    </el-form-item>

                    <el-form-item prop="password" class="login-input-item">
                        <span class="svg-container">
                          <svg-icon icon-class="password"/>
                        </span>
                        <el-input
                                v-model="loginForm.password"
                                autocomplete="on"
                                show-password
                                name="password"
                                placeholder="请输入密码"
                                style="padding-left: 45px"
                                @paste.native.capture.prevent="() => {return}"
                                @copy.native.capture.prevent="() => {return}"
                                @cut.native.capture.prevent="() => {return}"
                                @keyup.enter.native="handleLogin"
                        />
                    </el-form-item>

                    <el-form-item prop="code" class="login-input-item">
                        <span class="svg-container">
                          <svg-icon icon-class="code"/>
                        </span>
                        <el-input
                                v-model="loginForm.code"
                                autocomplete="off"
                                type="number"
                                name="code"
                                placeholder="验证码"
                                maxlength="6"
                                style="padding-left: 45px"
                                @keyup.enter.native="handleLogin"
                        />
                        <span :style="{ cursor: isOvertime ? 'default' : 'pointer'}" class="code" @click="sendMessage">{{ word }}</span>
                    </el-form-item>

                    <div class="forget-psw">
                        <label @click="$router.push({name: 'ResetPsw'})">忘记密码？</label>
                    </div>
                </template>
                <el-form-item>
                    <el-button
                            :loading="loading"
                            type="primary"
                            style="width:100%;"
                            @click.native.prevent="handleLogin"
                    >
                        登 录
                    </el-button>
                </el-form-item>
            </el-card>
        </el-form>
        <label class="labelPosition"><a href="http://www.beian.miit.gov.cn" target="black">蜀ICP备18024840号-4</a></label>
    </div>
</template>

<script>
    import {isvalidPhoneNumber, isvalidCode} from '@/assets/utils/validate'

    export default {
        name: 'Login',
        data() {
            const validateCode = (rule, value, callback) => {
                if (!isvalidCode(value)) {
                    callback(new Error('请输入正确的验证码'))
                } else {
                    callback()
                }
            };
            return {
                loginForm: {
                    username: '',
                    password: '',
                    code: ''
                },
                loginByPswRules: {
                    username: [{required: true, trigger: 'blur', message: '请输入用户名或手机号码'}],
                    password: [{required: true, trigger: 'blur', message: '请输入用密码'}],
                    code: [{required: true, trigger: 'change', validator: validateCode}]
                },
                loading: false,
                pwdType: 'password',
                redirect: undefined,
                word: '获取验证码',
                isOvertime: false,
                time: 60
            }
        },

        watch: {
            $route: {
                handler: function (route) {
                    this.redirect = route.query && route.query.redirect
                },
                immediate: true
            }
        },

        methods: {
            //发送短信验证码
            sendMessage() {
                if (this.isOvertime) {
                    return false // 还在倒计时，不往下执行
                }
                this.loading = true;
                this.$request.httpRequest({
                    method: 'post',
                    url: this.API.SendSms,
                    params: {
                        username: this.loginForm.username
                    },
                    returnFullData: true,
                    noLoading: true,
                    hideErrorMsg: true,
                    success: (data) => {
                        this.loading = false;
                        this.$message.closeAll();
                        this.$message.success('验证码发送成功，请留意手机短信');
                        const sendTimer = setInterval(() => {
                            this.isOvertime = true;
                            this.word = `${this.time}s后重新获取`;
                            this.time--;
                            if (this.time <= 0) {
                                this.isOvertime = false;
                                this.time = 60;
                                clearInterval(sendTimer);
                                this.word = '获取验证码'
                            }
                        }, 1000)
                    },
                    error: (e) => {
                        this.loading = false
                        const errorMsg = '获取验证码失败';
                        this.$message({
                            message: errorMsg,
                            type: 'error',
                            customClass: 'errorloginwidth',
                            duration: 3000
                        })
                        this.loading = false
                    }
                })
            },

            //显示/隐藏密码
            showPwd() {
                if (this.pwdType === 'password') {
                    this.pwdType = ''
                } else {
                    this.pwdType = 'password'
                }
            },

            //登录操作
            handleLogin() {
                this.$refs.loginForm.validate(valid => {
                    if (valid) {
                        let params = {
                            'username': this.loginForm.username,
                            'password': this.loginForm.password,
                            'code': this.loginForm.code
                        };
                        this.$store.dispatch('Login', params).then(() => {
                            localStorage.removeItem('menus');
                            this.$request.httpRequest({
                                method: 'get',
                                url: '/manager/system/getCacheSystem',
                                returnFullData: false,
                                noLoading: true,
                                hideErrorMsg: true,
                                success: (data) => {
                                    this.loading = false;
                                    this.$message.closeAll();
                                    if (data) {
                                        localStorage.setItem("system",data.uid);
                                        localStorage.setItem("system_name",data.name);
                                        this.$router.push({name: data.url});
                                    } else {
                                        this.$router.push({path: '/guide'});
                                    }
                                },
                                error: (e) => {
                                    this.loading = false
                                    const errorMsg = e.hasOwnProperty('message') ? e.message : '获取系统失败';
                                    this.$message({
                                        message: errorMsg,
                                        type: 'error',
                                        customClass: 'errorloginwidth',
                                        duration: 500
                                    })
                                }
                            })
                        }).catch(() => {
                            this.loading = false
                        })
                    } else {
                        return false
                    }
                })
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss">
    @import '~@/styles/mixin';
    @import '~@/styles/login';

    .login-container {
        width: 100%;
        height: 100%;
        text-align: center;
        background: url("../../assets/images/homeBG.jpg") no-repeat;
    }

    .login-form {
        opacity: 0.8;
    }

    .labelPosition{
        font-family: "微软雅黑";
        font-size: 1em;
        color: #8c939d;
        position: absolute;
        bottom: 5%;
        left: 46%;
    }
</style>
