<template>
    <div class="login">
        <RXnav></RXnav>
        <!-- 登录层 -->
        <div class="login-box">
            <div class="login-title-box">
                <div class="login-title">欢迎回来!</div>
                <div class="login-sob-title">Please login to your accounts</div>
            </div>

            <div class="btn-box">
                <van-button round block color="#71210e" @click="isSignIn =! isSignIn">登录</van-button>
                <van-button round block color="#b28850" @click="closePopup(true)">注册</van-button>
            </div>
        </div>

        <!-- 弹出注册层 -->
        <van-popup
        v-model="isOpen"
        position="bottom"
        :style="{ height: '50%' }"
        closeable
         >
            <div class="register-box">
                <div class="register-title">注册</div>
                <div class="register-form">
                    <van-field
                    v-model="userRegisterInfo.phone"
                     label="手机号"
                     placeholder="输入手机号(11位)"
                      />
                    <van-field
                    v-model="userRegisterInfo.password"
                    label="密码"
                    placeholder="密码必须为字母开头(6-16位)"
                    :type="isText ? 'text' : 'password'"
                    :right-icon="isText ? 'eye-o' : 'closed-eye'" @click-right-icon="toggleType"
                     />
                    <van-field
                    v-model="userRegisterInfo.nickName"
                    label="昵称"
                    placeholder="昵称(1-10位)"
                     />
                </div>
                <div class="btn-box">
                    <van-button
                    round
                    block
                    color="#71210e"
                    @click="register"
                    >
                        注册
                    </van-button>
                </div>
            </div>
        </van-popup>

        <!-- 弹出登录层 -->
        <van-popup
        v-model="isSignIn"
        round
        closeable
        >
            <div class="sign-box">
                <div class="form-box">
                    <van-field
                    v-model="userLoginInfo.phone"
                    label="手机号"
                    placeholder="手机号"
                    />
                    <van-field
                    v-model="userLoginInfo.password"
                    label="密码"
                    placeholder="密码必须为字母开头"
                    :type="isText ? 'text' : 'password'"
                    :right-icon="isText ? 'eye-o' : 'closed-eye'"
                    @click-right-icon="toggleType"
                    />
                </div>
                <div class="forgot">
                    <span @click="showMailbox = true, isSignIn = false, switchToTheNextStep = true, showVerifyBtn = true">
                        忘记密码?
                    </span>
                </div>
                <div class="sign-btn">
                    <van-button round block color="#71210e" @click="login">登录</van-button>
                </div>
            </div>

        </van-popup>

        <!-- 弹出验证邮箱 -->
        <van-popup
        v-model="showMailbox"
        position="bottom"
        closeable
         >
            <div class="showMailbox-box">
                <div class="title">
                    找回密码
                </div>

                <!-- 第一步 -->
                <div v-if="switchToTheNextStep" class="showMailbox-emailVerification">
                    <div class="input-box">
                        <van-field
                        type="mail"
                        v-model="mailboxData"
                        label="邮箱"
                        placeholder="请输入邮箱"
                        />
                        <van-field
                        v-model="verificationCodeData"
                        center
                        clearable
                        label="短信验证码"
                        placeholder="验证码(6个数字)"
                        >
                            <template #button>
                                <van-button
                                size="small"
                                type="primary"
                                v-if="showVerifyBtn"
                                @click="verifyEmail"
                                >
                                    {{ handoverVerification ? '发送验证码' : verificationTime}}
                                </van-button>
                            </template>
                        </van-field>
                    </div>
                    <div class="text-box">
                        <div
                        @click="showMailbox = false, switchToTheNextStep = true, isSignIn = true"
                        >
                            已有账号,立刻登录
                        </div>
                    </div>
                    <div class="btn">
                        <van-button
                        round
                        block
                        color="#71210e"
                        @click="verificationCode"
                        >
                            下一步
                        </van-button>
                    </div>
                </div>

                <!-- 第二步 -->
                <div v-else class="showMailbox-newPassword">
                    <div class="newPassword-input">
                        <van-field
                        v-model="newPasswordTel"
                        type="tel"
                        label="手机号"
                        placeholder="注册时的手机号"
                         />
                        <van-field
                        v-model="newPasswords"
                        label="新密码"
                        placeholder="密码必须为字母开头"
                        :type="isPassword ? 'text' : 'password'"
                        :right-icon="isPassword ? 'eye-o' : 'closed-eye'"
                        @click-right-icon="toggleTypePassword"
                         />
                    </div>
                    <div class="text-box">
                        <div
                        @click="showMailbox = false, switchToTheNextStep = true, isSignIn = true"
                        >
                            已有账号,立刻登录
                        </div>
                    </div>
                    <div class="btn">
                        <van-button
                        round
                        block
                        color="#71210e"
                        @click="submitAndRetrievePassword"
                        >提交</van-button>
                        <van-button
                        round
                        block
                        color="#b28850"
                        >返回</van-button>
                    </div>
                </div>
            </div>
        </van-popup>
    </div>
</template>

<script>
// import '../assets/less/login.less';

import RXnav from '../components/RXnav.vue';

import {utils} from '../assets/js/utils.js';

import {mapMutations} from 'vuex';

    export default {
        name: 'Login',
        components: {
            RXnav
        },
        data() {
            return {
                // 用户登录信息
                userLoginInfo: {
                    phone: '',  // 手机号
                    password: '',   // 密码
                },

                // 用户注册信息
                userRegisterInfo: {
                    phone: '',  // 手机号
                    password: '',   // 密码
                    nickName: '',   // 昵称
                },

                // 是否显示弹出层
                isOpen: false,

                // 是否显示密码框内容和睁开眼睛的图标
                isText: false,

                // 是否显示登录层
                isSignIn: false,

                // 找回密码
                // 1.是否显示邮箱
                showMailbox: false,

                // 邮箱值
                mailboxData: '',

                // 验证码
                verificationCodeData: '',

                // 验证时间
                verificationTime: 60,

                // 是否显示隐藏 发送验证码按钮
                showVerifyBtn: true,

                // 切换验证
                handoverVerification: true,

                // 切换到下一步
                // true => 邮箱验证
                // false => 输入新密码
                switchToTheNextStep: true,

                // 找回密码里面的 手机号
                newPasswordTel: '',

                // 找回密码里面的 密码
                newPasswords: '',

                // 找回密码里面的 查看密码
                isPassword: false,
            }
        },

        created () {
            this.changeShopbagCount(0);
            this.changIsLoadShopBagCount(false);
        },

        methods: {
            ...mapMutations(['changeShopbagCount', 'changIsLoadShopBagCount']),

            // 关闭弹出层
            closePopup(value) {
                this.isOpen = value;
            },

            // 切换密码框显示内容
            toggleType() {
                this.isText =! this.isText;
            },

            // 注册
            register() {
                let o = {
                    phone: {
                        value: this.userRegisterInfo.phone,
                        reg: /^1[3-9]\d{9}$/,
                        errorMsg: '手机号格式不正确'
                    },
                    password: {
                        value: this.userRegisterInfo.password,
                        reg: /^[A-Za-z]\w{5,15}$/,
                        errorMsg: '密码支持字母数字_组合且首字必须为字母'
                    },
                    nickName: {
                        value: this.userRegisterInfo.nickName,
                        reg: /^[\u4e00-\u9fa5A-Za-z0-9]{1,10}$/,
                        errorMsg: '昵称支持汉字字母数字组合'
                    }
                };

                // 验证表单
                if (!utils.validForm(o)) {
                    return;
                }

                // 发起注册请求 在加载图标
                this.$toast.loading({
                    message: '加载中...',
                    forbidClick: true,
                    duration: 0,
                });

                this.axios({
                    // 请求方式
                    method: 'POST',
                    url: this.baseUrl + '/register',

                    // 如果是POST请求, 参数需要挂载到data
                    data: {
                        appkey: this.appkey,
                        nickName: this.userRegisterInfo.nickName,
                        password: this.userRegisterInfo.password,
                        phone: this.userRegisterInfo.phone
                    }
                }).then(res => { // 成功
                    console.log('成功res ==> ', res);
                    this.$toast.clear();
                    if (res.data.code == 100) {

                        // 关闭注册
                        this.isOpen = false;

                        // 清除用户注册信息
                        for (let key in this.userRegisterInfo) {
                            this.userRegisterInfo[key] = '';
                        }
                    } else {
                        // 提示 '手机号已被注册'
                        this.$toast({
                            message: res.data.msg,
                            forbidClick: true,
                            duration: 1500,
                        });
                    };
                }).catch(err => {   // 失败
                    console.log('失败err ==> ', err);
                    this.$toast.clear();
                });

                // console.log(this.userRegisterInfo)
            },

            // 登录
            login() {
                let o = {
                    phone: {
                        value: this.userLoginInfo.phone,
                        reg: /^1[3-9]\d{9}$/,
                        errorMsg: '手机号格式不正确'
                    },
                    password: {
                        value: this.userLoginInfo.password,
                        reg: /^[A-Za-z]\w{5,15}$/,
                        errorMsg: '密码支持字母数字_组合且首字必须为字母'
                    }
                };

                // 验证表单
                if (!utils.validForm(o)) {
                    return;
                }

                // 发起登录请求 在加载图标
                this.$toast.loading({
                    message: '加载中...',
                    forbidClick: true,
                    duration: 0,
                });

                this.axios({
                    // 请求方式
                    method: 'POST',
                    url: this.baseUrl + '/login',

                    // 如果是POST请求, 参数需要挂载到data
                    data: {
                        appkey: this.appkey,
                        password: this.userLoginInfo.password,
                        phone: this.userLoginInfo.phone
                    }
                }).then(res => { // 成功
                    // console.log('成功res ==> ', res);
                    this.$toast.clear();

                    // 判断是否登录成功
                    if (res.data.code === 200) {
                        // 初始化值
                        this.userLoginInfo.phone = '';
                        this.userLoginInfo.password = '';

                        // 登录成功
                        // 存储tokenString, 用于下次访问有关于用户信息界面的登录标记
                        this.$cookies.set('tokenString', res.data.token, '1d');

                        // 跳转到其他界面
                        this.$router.push({name: 'Home'});
                    } else {
                        // 提示 '手机号已被登录'
                        this.$toast({
                            message: res.data.msg,
                            forbidClick: true,
                            duration: 1500,
                        });
                    };
                }).catch(err => {   // 失败
                    console.log('失败err ==> ', err);
                    this.$toast.clear();
                });
            },

            // 找回密码
            // 1. 邮箱
            verifyEmail() {

                // 判断邮箱是否填写
                if (this.mailboxData === '') {
                    return this.$toast({
                            message: '邮箱不能为空',
                            forbidClick: true,
                            duration: 1000,
                        });
                }

                let o = {
                    mail: {
                        value: this.mailboxData,
                        reg: /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/,
                        errorMsg: '邮箱格式不正确'
                    }
                };

                // 验证表单
                if (!utils.validForm(o)) {
                    return;
                }

                this.countDown();

                // 发起登录请求 在加载图标
                this.$toast.loading({
                    message: '加载中...',
                    forbidClick: true,
                    duration: 0,
                });

                this.axios({
                    // 请求方式
                    method: 'POST',
                    url: this.baseUrl + '/emailValidCode',

                    // 如果是POST请求, 参数需要挂载到data
                    data: {
                        appkey: this.appkey,
                        email: this.mailboxData
                    }
                }).then(res => { // 成功
                    console.log('成功res 验证邮箱 ==> ', res);
                    this.$toast.clear();

                    // 判断是否登录成功
                    if (res.data.code === 'J001') {
                        
                    } else {
                        // 提示 '手机号已被登录'
                        this.$toast({
                            message: res.data.msg,
                            forbidClick: true,
                            duration: 1000,
                        });
                    };
                }).catch(err => {   // 失败
                    console.log('失败err ==> ', err);
                    this.$toast.clear();
                });
            },

            // 2. 验证码倒计时
            countDown() {
                this.handoverVerification = false;
                let time = setInterval(() => {
                    this.verificationTime--;
                    console.log('this.verificationTime ==> ', this.verificationTime);

                    // 小于0 关闭计时器
                    if (this.verificationTime <= 0) {
                        clearInterval(time);
                        this.handoverVerification = true;
                        this.verificationTime = 60;
                    }

                    // 验证成功 关闭计时器
                    if (!this.showVerifyBtn) {
                        clearInterval(time);
                        this.handoverVerification = true;
                        this.verificationTime = 60;
                    }
                }, 1000)
            },

            // 3. 验证验证码
            verificationCode() {
                // 验证 验证码是否为空
                if (this.verificationCodeData === '') {
                    return this.$toast({
                            message: '验证码不能为空',
                            forbidClick: true,
                            duration: 1000,
                        });
                }

                let o = {
                    mail: {
                        value: this.verificationCodeData,
                        reg: /^[0-9]{6}$/,
                        errorMsg: '请输入正确验证码'
                    }
                };

                // 验证表单
                if (!utils.validForm(o)) {
                    return;
                }

                // 发起登录请求 在加载图标
                this.$toast.loading({
                    message: '加载中...',
                    forbidClick: true,
                    duration: 0,
                });

                this.axios({
                    // 请求方式
                    method: 'POST',
                    url: this.baseUrl + '/checkValidCode',

                    // 如果是POST请求, 参数需要挂载到data
                    data: {
                        appkey: this.appkey,
                        validCode: this.verificationCodeData
                    }
                }).then(res => { // 成功
                    console.log('成功res 验证邮箱 ==> ', res);
                    this.$toast.clear();

                    // 判断是否登录成功
                    if (res.data.code === 'K001') { // 验证码验证成功
                        this.switchToTheNextStep = false;

                        // 隐藏 发送验证码按钮
                        this.showVerifyBtn = false;

                        this.$toast({
                            message: res.data.msg,
                            forbidClick: true,
                            duration: 1000,
                        });
                    } else {
                        this.$toast({
                            message: res.data.msg,
                            forbidClick: true,
                            duration: 1000,
                        });
                    };
                }).catch(err => {   // 失败
                    console.log('失败err ==> ', err);
                    this.$toast.clear();
                });
            },

            // 4. 找回密码 是否显示密码
            toggleTypePassword() {
                this.isPassword = !this.isPassword;
            },

            // 5. 提交找回密码
            submitAndRetrievePassword() {
                // 验证 验证码是否为空
                if (this.newPasswordTel === '') {
                    return this.$toast({
                            message: '手机不能为空',
                            forbidClick: true,
                            duration: 1000,
                        });
                } else if (this.newPassword === '') {
                    return this.$toast({
                            message: '新密码不能为空',
                            forbidClick: true,
                            duration: 1000,
                        });
                }

                let o = {
                    phone: {
                        value: this.newPasswordTel,
                        reg: /^1[3-9]\d{9}$/,
                        errorMsg: '手机号格式不正确'
                    },
                    password: {
                        value: this.newPasswords,
                        reg: /^[A-Za-z]\w{5,15}$/,
                        errorMsg: '密码支持字母数字_组合且首字必须为字母'
                    }
                };

                // 验证表单
                if (!utils.validForm(o)) {
                    return;
                }

                // 发起登录请求 在加载图标
                this.$toast.loading({
                    message: '加载中...',
                    forbidClick: true,
                    duration: 0,
                });

                this.axios({
                    // 请求方式
                    method: 'POST',
                    url: this.baseUrl + '/retrievePassword',

                    // 如果是POST请求, 参数需要挂载到data
                    data: {
                        appkey: this.appkey,
                        phone: this.newPasswordTel,
                        password: this.newPasswords
                    }
                }).then(res => { // 成功
                    console.log('成功res 提交找回密码 ==> ', res);
                    this.$toast.clear();

                    // 判断是否登录成功
                    if (res.data.code === 'L001') { // 找回密码成功
                        // 隐藏找回密码
                        this.showMailbox = false;

                        // 显示登录
                        this.isSignIn = true;

                        this.$toast({
                            message: res.data.msg,
                            forbidClick: true,
                            duration: 1000,
                        });
                    } else {
                        this.$toast({
                            message: res.data.msg,
                            forbidClick: true,
                            duration: 1000,
                        });
                    };
                }).catch(err => {   // 失败
                    console.log('失败err ==> ', err);
                    this.$toast.clear();
                });
            }
        }
    }
</script>

<style lang="less" scoped>
@import '../assets/less/login.less';
</style>