<template>
    <div class="personalData">
        <van-nav-bar
        title="个人资料"
        left-text="返回"
        left-arrow
        @click-left="back"
        />

        <Bg>
            <div class="userData-box">
                <van-cell title="头像" >
                    <template #right-icon>
                        <div class="img">
                            <img class="auto-img" :src="userData.userImg" alt="">
                            <div class="up-img">
                                <van-uploader
                                :max-size="500 * 1024"
                                :after-read="uploadAvatar"
                                />
                            </div>
                        </div>
                    </template>
                </van-cell>
                <van-cell title="用户ID" :value="userData.userId" />
                <van-cell
                title="昵称"
                :value="userData.nickName"
                @click="modificationOfInformation('昵称', 'updateNickName', 'nickName')"
                 />
                <van-cell
                title="简介"
                :value="userData.desc ? userData.desc : '这家伙很懒, 什么也没留下!'"
                @click="modificationOfInformation('简介', 'updateDesc', 'desc')"
                 />
            </div>
        </Bg>

        <van-popup
        v-model="isOpen"
        position="bottom"
        closeable
        >
            <div class="register-box">
                <div class="register-form">
                    <van-cell-group>
                        <van-field
                        v-model="inputValue"
                        :label="registerData.title"
                        :placeholder="`请输入${registerData.title}`"
                         />
                    </van-cell-group>
                </div>
                <div class="btn-box">
                    <van-button
                    round
                    block
                    color="#0c34ba"
                    @click="confirmModification(registerData)"
                    >
                    确认
                    </van-button>
                </div>
            </div>
        </van-popup>
    </div>
</template>

<script>
import Bg from '../components/Bg';

    export default {
        name: 'PersonalData',

        components: {
            Bg
        },

        data () {
            return {
                // 用户资料
                userData: {},

                // 是否显示修改框
                isOpen: false,

                // 修改信息
                registerData: {
                    title: '',  // 标题
                    value: '',  // 值
                    address: '',    // 地址
                    propertyName: ''    // 属性名
                },

                // 修改框的值
                inputValue: ''
            }
        },

        created () {
            // 个人资料
            this.personalData();
        },

        methods: {
            // 返回
            back() {
                this.$router.go(-1);
            },

            // 个人资料
            personalData() {
                // 获取 cookies 里面的 tokenString值
                let tokenString = this.$cookies.get('tokenString');
                // console.log('tokenString ==> ', tokenString);

                // 判断有没有登录
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
                    method: 'GET',
                    url: this.baseUrl + '/findAccountInfo',
                    // 如果是GET请求, 参数需要挂载到params
                    params: {
                        appkey: this.appkey,
                        tokenString: tokenString
                    }
                }).then(res => { // 成功
                    console.log('成功res 个人资料 ==> ', res);
                    this.$toast.clear();

                    if (res.data.code === 700) {    // 没有登录
                        this.$toast({
                            message: res.data.msg,
                            forbidClick: true,
                            duration: 3000,
                        });

                        // 跳转到登录页面
                        return this.$router.push({name: 'Login'});

                    } else if (res.data.code === 'B001') { // 查询账号管理信息成功
                        this.userData = res.data.result[0];
                    }

                }).catch(err => {   // 失败
                    console.log('失败err ==> ', err);
                });
            },

            // 上传头像
            uploadAvatar(file) {
                // 限制上传文件类型
                let types = ['png', 'gif', 'jpg', 'jpeg'];

                //截取上传图片的类型
                let type = file.file.type.split('/')[1];

                if (types.indexOf(type) === -1) {
                    return this.$toast.loading({
                        message: `文件类型只支持 ${types.join(',')}`,
                        forbidClick: true,
                        duration: 0,
                    });
                }

                // 处理 base64
                let base64 = file.content.replace(/data:image\/[A-Za-z]+;base64,/, '');


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
                    url: this.baseUrl + '/updateAvatar',
                    // 如果是POST请求, 参数需要挂载到data
                    data: {
                        appkey: this.appkey,
                        tokenString,
                        imgType: type,
                        serverBase64Img: base64
                    }
                }).then(res => { // 成功
                    // console.log('成功res 上传头像 ==> ', res);
                    this.$toast.clear();

                    if (res.data.code === 700) {    // 没有登录
                        this.$toast({
                            message: res.data.msg,
                            forbidClick: true,
                            duration: 3000,
                        });

                        // 跳转到登录页面
                        return this.$router.push({name: 'Login'});

                    } else if (res.data.code === 'H001') { // 上传头像图片成功

                        if (res.data.result[0] === 1) {
                            this.userData.userImg = res.data.userImg;
                        }

                    }
                    this.$toast({
                        message: res.data.msg,
                        forbidClick: true,
                        duration: 3000,
                    });

                }).catch(err => {   // 失败
                    console.log('失败err ==> ', err);
                });
            },

            // 修改资料
            modificationOfInformation(title, address, propertyName) {
                this.registerData.title = title;
                this.registerData.address = address;
                this.registerData.propertyName = propertyName;
                this.isOpen = true;
            },

            // 确认修改
            confirmModification(item) {
                // 获取 cookies 里面的 tokenString值
                let tokenString = this.$cookies.get('tokenString');
                // console.log('tokenString ==> ', tokenString);

                if (!tokenString) {
                    console.log('浏览器tokenString不存在');
                    return this.$router.push({name: 'Login'});
                }

                let data = {
                    appkey: this.appkey,
                    tokenString
                }
                data[item.propertyName] = this.inputValue;

                // console.log('data ==> ', data);

                // 加载图标
                this.$toast.loading({
                    message: '加载中...',
                    forbidClick: true,
                    duration: 0,
                });

                this.axios({
                    // 请求方式
                    method: 'POST',
                    url: this.baseUrl + '/' + item.address,
                    // 如果是POST请求, 参数需要挂载到data
                    data
                }).then(res => { // 成功
                    console.log('成功res 修改资料 ==> ', res);
                    this.$toast.clear();

                    if (res.data.code === 700) {    // 没有登录
                        this.$toast({
                            message: res.data.msg,
                            forbidClick: true,
                            duration: 3000,
                        });

                        // 跳转到登录页面
                        return this.$router.push({name: 'Login'});

                    } else if (res.data.code === 'C001') { // 修改昵称成功

                        this.userData.nickName = res.data.nickName;
                        this.isOpen = false;

                    } else if (res.data.code === 'D001') { // 修改简介成功
                        this.userData.desc = res.data.desc;
                        this.isOpen = false;

                    }

                    this.inputValue = '';

                    this.$toast({
                        message: res.data.msg,
                        forbidClick: true,
                        duration: 3000,
                    });

                }).catch(err => {   // 失败
                    console.log('失败err ==> ', err);
                });
            }
        },

        watch: {
            // 关闭修改框 清空里面的值
            isOpen: function(value) {
                if (!value) {
                    this.inputValue = '';
                }
            }
        }

    }
</script>

<style lang="less" scoped>
@import '../assets/less/personalData.less';
</style>