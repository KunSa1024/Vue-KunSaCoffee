<template>
    <div class="securityCenter">
        <van-nav-bar
        title="安全中心"
        left-text="返回"
        left-arrow
        @click-left="back"
        />

        <Bg>
            <van-cell title="修改密码" is-link @click="show = true" />
            <van-cell title="注销账号" is-link @click="cancelAccount = true" />
        </Bg>

        <van-button
        type="primary"
        block
        round
        class="btn"
        @click="logOffAndLogOut('logout')"
        >
            退出登录
        </van-button>

        <!-- 修改密码 -->
        <van-popup
        v-model="show"
        position="bottom"
        closeable
        >
            <div class="changePassword-box">
                <div class="title">
                    修改密码
                </div>
                <div class="password-box">
                    <van-field
                    v-model="usedPassword"
                    :type="newLook ? 'password' : 'text'"
                    label="旧密码"
                    :right-icon="newLook ? 'closed-eye' : 'eye-o'"
                    placeholder="旧密码(首字符必须为字母)"
                    @click-right-icon="newLook =! newLook"
                     />
                    <van-field
                    v-model="newPassword"
                    :type="usedLook ? 'password' : 'text'"
                    label="新密码"
                    :right-icon="usedLook ? 'closed-eye' : 'eye-o'"
                    placeholder="新密码(首字符必须为字母)"
                    @click-right-icon="usedLook =! usedLook"
                     />
                </div>
                <van-button
                type="primary"
                block
                round
                class="submit"
                @click="upChangePassword"
                >
                    提交
                </van-button>
            </div>
        </van-popup>

        <!-- 注销账号 -->
        <van-popup v-model="cancelAccount">
            <div class="cancelAccount-box">
                <div class="cancelAccount-title">注销账号</div>
                <div class="cancelAccount-content">是否确定注销账号，—旦注销无法恢复!
</div>
                <div class="cancelAccount-btn">
                    <div @click="cancelAccount = false">取消</div>
                    <div class="determine" @click="logOffAndLogOut('destroyAccount')">确定</div>
                </div>
            </div>
        </van-popup>
    </div>
</template>

<script>
import Bg from '../components/Bg';

import {utils} from '../assets/js/utils.js';

    export default {
        name: 'SecurityCenter',

        components: {
            Bg
        },

        data () {
            return {
                // 是否显示修改密码框
                show: false,

                // 新密码
                newPassword: '',

                // 旧密码
                usedPassword: '',

                // 看新密码
                newLook: true,

                // 看旧密码
                usedLook: true,

                // 是否显示注销账号框
                cancelAccount: false
            }
        },

        methods: {
            // 返回
            back() {
                this.$router.go(-1);
            },

            // 修改密码
            upChangePassword() {
                let o = {
                    password: {
                        value: this.newPassword,
                        reg: /^[A-Za-z]\w{5,15}$/,
                        errorMsg: '密码支持字母数字_组合且首字必须为字母'
                    },
                    password: {
                        value: this.usedPassword,
                        reg: /^[A-Za-z]\w{5,15}$/,
                        errorMsg: '密码支持字母数字_组合且首字必须为字母'
                    },
                };

                // 验证表单
                if (!utils.validForm(o)) {
                    return;
                }

                // 判断新密码是否更旧密码一样
                if (this.newPassword = this.usedPassword) {
                    this.newPassword = '';
                    return this.$toast({
                        message: '新密码不能和旧密码一样',
                        forbidClick: true,
                        duration: 1000,
                    });
                }


                // 获取 cookies 里面的 tokenString值
                let tokenString = this.$cookies.get('tokenString');
                // console.log('tokenString ==> ', tokenString);

                if (!tokenString) {
                    console.log('浏览器tokenString不存在');
                    return this.$router.push({name: 'Login'});
                }

                // 加载图标
                this.$toast.loading({
                    message: '加载中...',
                    forbidClick: true,
                    duration: 0,
                });

                this.axios({
                    // 请求方式
                    method: 'POST',
                    url: this.baseUrl + '/updatePassword',
                    // 如果是POST请求, 参数需要挂载到data
                    data: {
                        appkey: this.appkey,
                        tokenString,
                        password: this.newPassword,
                        oldPassword: this.usedPassword
                    }
                }).then(res => { // 成功
                    console.log('成功res 修改密码 ==> ', res);
                    this.$toast.clear();

                    if (res.data.code === 700) {    // 没有登录
                        this.$toast({
                            message: res.data.msg,
                            forbidClick: true,
                            duration: 1000,
                        });

                        // 跳转到登录页面
                        return this.$router.push({name: 'Login'});

                    } else if (res.data.code === 'E001') { // 修改密码成功
                        this.show = false;
                    }
                    this.$toast({
                        message: res.data.msg,
                        forbidClick: true,
                        duration: 1000,
                    });

                }).catch(err => {   // 失败
                    console.log('失败err ==> ', err);
                });
            },

            // 注销账号 和 退出登录
            logOffAndLogOut(address) {
                // 获取 cookies 里面的 tokenString值
                let tokenString = this.$cookies.get('tokenString');
                // console.log('tokenString ==> ', tokenString);

                if (!tokenString) {
                    console.log('浏览器tokenString不存在');
                    return this.$router.push({name: 'Login'});
                }

                // 加载图标
                this.$toast.loading({
                    message: '加载中...',
                    forbidClick: true,
                    duration: 0,
                });

                this.axios({
                    // 请求方式
                    method: 'POST',
                    url: this.baseUrl + '/' + address,
                    // 如果是POST请求, 参数需要挂载到data
                    data: {
                        appkey: this.appkey,
                        tokenString,
                    }
                }).then(res => { // 成功
                    console.log('成功res 注销账号 和 退出登录 ==> ', res);
                    this.$toast.clear();

                    if (res.data.code === 700) {    // 没有登录
                        this.$toast({
                            message: res.data.msg,
                            forbidClick: true,
                            duration: 1000,
                        });

                        // 跳转到登录页面
                        return this.$router.push({name: 'Login'});

                    } else if (res.data.code === 'F001') { // 退出登录成功
                        // 跳转到登录页面
                        return this.$router.push({name: 'Login'});

                    } else if (res.data.code === 'G001') { // 注销账号成功
                        this.cancelAccount = false;



                        // 跳转到登录页面
                        return this.$router.push({name: 'Login'});
                    }
                    this.$toast({
                        message: res.data.msg,
                        forbidClick: true,
                        duration: 1000,
                    });

                }).catch(err => {   // 失败
                    console.log('失败err ==> ', err);
                });
            }
        }
    }
</script>

<style lang="less" scoped>
@import '../assets/less/securityCenter.less';
</style>