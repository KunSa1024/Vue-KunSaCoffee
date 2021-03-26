<template>
    <div class="collection">
        <van-nav-bar
        title="我的收藏"
        left-text="返回"
        left-arrow
        @click-left="back"
        />

        <Bg>
            <div class="product-items">
                <Product
                class="product-item"
                v-for="(item, index) in collectData"
                :key="index"
                :product="item"
                >
                    <template #delete>
                        <van-icon class="del" name="delete-o" @click="deleteCollection(item.pid, index)" />
                    </template>
                </Product>
            </div>

        </Bg>
    </div>
</template>

<script>
import Bg from '../components/Bg';
import Product from '../components/Product.vue';

    export default {
        name: 'Collection',

        components: {
            Bg,
            Product
        },

        data () {
            return {
                // 收藏数据
                collectData: []
            }
        },

        created () {
            // 获取收藏数据
            this.getCollectData()
        },

        methods: {
            // 返回
            back() {
                this.$router.go(-1);
            },

            // 获取收藏数据
            getCollectData() {
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
                    url: this.baseUrl + '/findAllLike',
                    // 如果是GET请求, 参数需要挂载到params
                    params: {
                        appkey: this.appkey,
                        tokenString: tokenString
                    }
                }).then(res => { // 成功
                    console.log('成功res 收藏数据 ==> ', res);
                    this.$toast.clear();

                    if (res.data.code === 700) {    // 没有登录
                        this.$toast({
                            message: res.data.msg,
                            forbidClick: true,
                            duration: 3000,
                        });

                        // 跳转到登录页面
                        return this.$router.push({name: 'Login'});

                    } else if (res.data.code === 2000) { // 查询用户所有收藏商品成功
                        this.collectData = res.data.result;
                    }

                }).catch(err => {   // 失败
                    console.log('失败err ==> ', err);
                });
            },

            // 删除收藏
            deleteCollection(pid, index) {
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
                    url: this.baseUrl + '/notlike',
                    // 如果是POST请求, 参数需要挂载到data
                    data: {
                        appkey: this.appkey,
                        tokenString,
                        pid
                    }
                }).then(res => { // 成功
                    console.log('成功res 删除收藏 ==> ', res);
                    this.$toast.clear();

                    if (res.data.code === 700) {    // 没有登录
                        this.$toast({
                            message: res.data.msg,
                            forbidClick: true,
                            duration: 3000,
                        });

                        // 跳转到登录页面
                        return this.$router.push({name: 'Login'});

                    } else if (res.data.code === 900) { // 已取消收藏

                        if (res.data.result === 1) {
                            this.collectData.splice(index, 1);
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
@import '../assets/less/Collection.less';
</style>