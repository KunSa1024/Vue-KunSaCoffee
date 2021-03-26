<template>
    <div class="menu">
        <!-- 搜索框 -->
        <van-search
        shape="round"
        background="#fff"
        placeholder="请输入搜索关键词"
        @click="goSearch"
        />

        <!-- 导航栏 -->
        <van-tabs
        v-model="active"
        animated
        swipeable
        >
            <van-tab
            v-for="(item, index) in titleData"
            :key="index"
            >
                <template #title>
                    <div class="title-box">
                        <div class="img-box">
                            <img class="auto-img" :src="active === index ? item.imgs : item.img" alt="">
                        </div>
                        <div class="title" :style="active === index ? {color:'#71210e'} : {color:'#646566'}">
                            {{ item.title }}
                        </div>
                    </div>
                </template>

                <!-- 产品 -->
                <div class="product-box">
                    <div
                    class="product"
                    v-for="(items, indexs) in titleData[index].product"
                    :key="indexs"
                    @click="viewProduct(items.pid)"
                    >
                        <div class="img">
                            <img class="auto-img" :src="items.smallImg" alt="">
                        </div>
                        <div class="title-box">
                            <div class="title">
                                <div class="name">{{ items.name }}</div>
                                <div class="enname">{{ items.enname }}</div>
                            </div>
                            <div class="price">&yen;{{ items.price }}</div>
                        </div>
                    </div>
                </div>
            </van-tab>
        </van-tabs>

    </div>
</template>

<script>
    export default {
        name: 'Menu',

        data () {
            return {

                // 当前导航栏位置
                active: 0,

                // 导航栏数据
                titleData: [
                    {
                        title: '推荐',
                        img: require('../assets/images/icons_09.gif'),
                        imgs: require('../assets/images/icons_21.gif'),
                        product: []
                    },
                    {
                        title: '拿铁',
                        img: require('../assets/images/icons_05.gif'),
                        imgs: require('../assets/images/icons_19.gif'),
                        type: "latte",
                        product: []
                    },
                    {
                        title: '咖啡',
                        img: require('../assets/images/icons_03.gif'),
                        imgs: require('../assets/images/icons_18.gif'),
                        type: "coffee",
                        product: []
                    },
                    {
                        title: '瑞纳冰',
                        img: require('../assets/images/icons_07.gif'),
                        imgs: require('../assets/images/icons_20.gif'),
                        type: "rena_ice",
                        product: []
                    },
                    {
                        title: '水果茶',
                        img: require('../assets/images/icons_11.gif'),
                        imgs: require('../assets/images/icons_22.png'),
                        type: "fruit_tea",
                        product: []
                    }
                ],
            }
        },

        created () {
            // 获取咖啡类型数据
            this.getCoffeeTypeData();

            // 获取推荐数据
            this.getRecommendedData();
        },

        methods: {
            // 获取咖啡类型数据
            getCoffeeTypeData() {
                // 获取 cookies 里面的 tokenString值
                let tokenString = this.$cookies.get('tokenString');
                // console.log('tokenString ==> ', tokenString);

                // 判断有没有登录
                // if (!tokenString) {
                //     console.log('浏览器tokenString不存在');
                //     return this.$router.push({name: 'Login'});
                // }

                // 加载图标
                this.$toast.loading({
                    message: '加载中...',
                    forbidClick: true,
                    duration: 0,
                });

                for (let i = 1; i < this.titleData.length; i++) {
                    this.axios({
                        // 请求方式
                        method: 'GET',
                        url: this.baseUrl + '/typeProducts',
                        // 如果是GET请求, 参数需要挂载到params
                        params: {
                            appkey: this.appkey,
                            key: 'type',
                            value: this.titleData[i].type
                        }
                    }).then(res => { // 成功
                        // console.log('成功res 获取咖啡类型数据 ==> ', res);
                        this.$toast.clear();

                        if (res.data.code === 700) {    // 没有登录
                            this.$toast({
                                message: res.data.msg,
                                forbidClick: true,
                                duration: 3000,
                            });

                            // 跳转到登录页面
                            // return this.$router.push({name: 'Login'});

                        } else if (res.data.code === 500) { // 查询成功

                            this.titleData[i].product = res.data.result;
                        }
                    }).catch(err => {   // 失败
                        console.log('失败err ==> ', err);
                    });

                }
            },

            // 获取推荐数据
            getRecommendedData() {
                // 获取 cookies 里面的 tokenString值
                let tokenString = this.$cookies.get('tokenString');
                // console.log('tokenString ==> ', tokenString);

                // 判断有没有登录
                // if (!tokenString) {
                //     console.log('浏览器tokenString不存在');
                //     return this.$router.push({name: 'Login'});
                // }

                // 加载图标
                this.$toast.loading({
                    message: '加载中...',
                    forbidClick: true,
                    duration: 0,
                });

                this.axios({
                    // 请求方式
                    method: 'GET',
                    url: this.baseUrl + '/typeProducts',
                    // 如果是GET请求, 参数需要挂载到params
                    params: {
                        appkey: this.appkey,
                        key: 'isHot',
                        value: 1
                    }
                }).then(res => { // 成功
                    // console.log('成功res 获取推荐数据 ==> ', res);
                    this.$toast.clear();

                    if (res.data.code === 700) {    // 没有登录
                        this.$toast({
                            message: res.data.msg,
                            forbidClick: true,
                            duration: 3000,
                        });

                        // 跳转到登录页面
                        // return this.$router.push({name: 'Login'});

                    } else if (res.data.code === 500) { // 查询成功
                        this.titleData[0].product = res.data.result;


                    }
                }).catch(err => {   // 失败
                    console.log('失败err ==> ', err);
                });
            },

            // 查看商品详情
            viewProduct(pid) {
                this.$router.push({name: 'Detail', params: {pid}});
            },

            // 跳转到搜索页面
            goSearch() {
                this.$router.push({name: 'Search'});
            }
        }
    }
</script>

<style lang="less" scoped>
@import '../assets/less/menu.less';
</style>
