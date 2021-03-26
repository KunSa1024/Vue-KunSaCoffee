<template>
    <div class="my">
        <div class="my-bg" :style="{backgroundImage: `url(${userInfo.userBg})`}">
            <van-uploader
            :max-size="1024 * 1024"
            :after-read="uploadUserBackground"
             />
        </div>

        <div class="my-box">
            <div class="my-information-box">
                <div class="headPortrait">
                    <img class="auto-img" :src="userInfo.userImg" alt="">
                    <div class="up-img">
                         <van-uploader
                         :max-size="500 * 1024"
                         :after-read="uploadAvatar"
                          />
                    </div>
                </div>
                <div class="name-box">
                    <div class="name one-text">{{ userInfo.nickName }}</div>
                    <div class="text one-text">{{ userInfo.desc === '' ? '这家伙很懒, 什么也没留下!' : userInfo.desc}}</div>
                </div>
            </div>

            <div class="my-list">
                <van-cell
                v-for="(item, index) in cellData"
                :key="index"
                :title="item.title"
                :to="item.name"
                is-link title-style="color: #666" />
            </div>
        </div>
    </div>
</template>

<script>

    export default {
        name: 'My',
        data () {
            return {
                cellData: [
                    {
                        title: '个人资料',
                        name: 'PersonalData'
                    },
                    {
                        title: '我的订单',
                        name: 'Order'
                    },
                    {
                        title: '我的收藏',
                        name: 'Collection'
                    },
                    {
                        title: '地址管理',
                        name: 'AddressList'
                    },
                    {
                        title: '安全中心',
                        name: 'SecurityCenter'
                    }
                ],

                // 用户数据
                userInfo: {}
            }
        },

        created () {
            // 获取用户信息
            this.getUserInfo()
        },

        methods: {
            // 获取用户信息
            getUserInfo() {
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
                    url: this.baseUrl + '/findMy',
                    // 如果是GET请求, 参数需要挂载到params
                    params: {
                        appkey: this.appkey,
                        tokenString: tokenString
                    }
                }).then(res => { // 成功
                    console.log('成功res 获取用户信息 ==> ', res);
                    this.$toast.clear();

                    if (res.data.code === 700) {    // 没有登录
                        this.$toast({
                            message: res.data.msg,
                            forbidClick: true,
                            duration: 3000,
                        });

                        // 跳转到登录页面
                        return this.$router.push({name: 'Login'});

                    } else if (res.data.code === 'A001') { // 查询我的成功
                        this.userInfo = res.data.result[0];
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
                    console.log('成功res 上传头像 ==> ', res);
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
                            this.userInfo.userImg = res.data.userImg;
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

            // 上传用户背景
            uploadUserBackground(file) {
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
                    url: this.baseUrl + '/updateUserBg',
                    // 如果是POST请求, 参数需要挂载到data
                    data: {
                        appkey: this.appkey,
                        tokenString,
                        imgType: type,
                        serverBase64Img: base64
                    }
                }).then(res => { // 成功
                    // console.log('成功res 上传用户背景 ==> ', res);
                    this.$toast.clear();

                    if (res.data.code === 700) {    // 没有登录
                        this.$toast({
                            message: res.data.msg,
                            forbidClick: true,
                            duration: 3000,
                        });

                        // 跳转到登录页面
                        return this.$router.push({name: 'Login'});

                    } else if (res.data.code === 'I001') { // 上传用户背景图成功

                        if (res.data.result[0] === 1) {
                            this.userInfo.userBg = res.data.userBg;
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
            }
        }
    }
</script>

<style lang="less" scoped>
@import '../assets/less/my.less';


</style>