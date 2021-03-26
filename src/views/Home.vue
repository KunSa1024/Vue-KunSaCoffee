<template>
    <div class="home">
        <!-- 导航栏 -->
        <van-nav-bar>
            <template #left>
                <div class="home-title">
                    <div>{{ greetings }}</div>
                    <div class="username one-text" @click="goMy">{{ userName }}</div>
                </div>
            </template>
            <template #right>
                <van-search
                placeholder="请输入搜索关键词"
                shape="round"
                @click="goSearch"
                />
            </template>
        </van-nav-bar>

        <!-- 轮播图 -->
        <van-swipe
        @change="changeCurrentIndex"
        :autoplay="5000">
            <van-swipe-item
            v-for="(item, index) in bannerData"
            :key="index"
            >
                <img
                class="auto-img"
                :src="item.bannerImg"
                alt=""
                @click="viewProduct(item.pid)"
                >
            </van-swipe-item>

            <template #indicator>
                <div class="indicator-box">
                    <div
                    class="indicator-item"
                    :class="{active: currentIndex === i}"
                    v-for="(v, i) in bannerData.length"
                    :key="i"
                    ></div>
                </div>
            </template>
        </van-swipe>

        <!-- 热卖推荐 -->
        <div class="product-box">
            <div class="line">
                <span>
                    热卖推荐
                </span>
            </div>
            <div class="product-items">
                <Product
                class="product-item"
                v-for="(item, index) in hotProductData"
                :key="index"
                :product="item"
                >
                    <template #hot>
                        <div class="hot-cion">hot</div>
                    </template>
                </Product>
            </div>
        </div>
    </div>
</template>

<script>
import Product from '../components/Product.vue';


export default {
    name: 'Home',
    data() {
        return {
            currentIndex: 0,

            // 轮播图数据
            bannerData: [],

            // 热卖推荐数据
            hotProductData: [],

            // 当前时间问候语
            greetings: '',

            // 用户名
            userName: ''
        }
    },
    components: {
        Product
    },
    created () {
        // 生成data, 但是没有$el(没有生成<div id="app"></div>)
        this.getBannerData();

        // 获取首页"热卖推荐"商品数据
        this.getHotProduct();

        // 获取当前时间显示问候语
        this.getTheCurrentTime();

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
                this.userName = '游客';
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
                    tokenString
                }
            }).then(res => { // 成功
                // console.log('成功res 获取用户信息 ==> ', res);
                this.$toast.clear();

                if (res.data.code === 'A001') { // 查询我的成功
                    this.userName = res.data.result[0].nickName;
                } else if (res.data.code === 700) {
                    this.userName = '游客';

                    this.$toast({
                        message: '您现在是游客',
                        forbidClick: true,
                        duration: 1500,
                    });
                }

            }).catch(err => {   // 失败
                console.log('失败err ==> ', err);
            });
        },

        // 切换轮播图
        changeCurrentIndex(index) {
            this.currentIndex = index;
        },

        // 获取轮播图数据
        getBannerData() {

            // 发起登录请求 在加载图标
            this.$toast.loading({
                message: '加载中...',
                forbidClick: true,
                duration: 0,
            });

            this.axios({
                // 请求方式
                method: 'GET',
                url: this.baseUrl + '/banner',
                // 如果是GET请求, 参数需要挂载到params
                params: {
                    appkey: this.appkey,
                }
            }).then(res => { // 成功
                // console.log('成功res ==> ', res);
                this.$toast.clear();
                if (res.data.code === 300) {
                    this.bannerData = res.data.result;
                } else {

                }
            }).catch(err => {   // 失败
                console.log('失败err ==> ', err);
            });
        },

        // 获取首页"热卖推荐"商品数据
        getHotProduct() {
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
                // console.log('成功res ==> ', res);
                this.$toast.clear();
                if (res.data.code === 500) {
                    this.hotProductData = res.data.result;
                }
            }).catch(err => {   // 失败
                console.log('失败err ==> ', err);
            });
        },

        // 轮播图查看商品详情
        viewProduct(pid) {
            this.$router.push({name: 'Detail', params: {pid}});
        },

        // 获取当前时间显示问候语
        getTheCurrentTime() {
            // 获取当前 时分
            var h = new Date().getHours();

            if(h < 6){
                this.greetings = "凌晨好";
            }else if (h < 9){
                this.greetings = "早上好";
            }else if (h < 12){
                this.greetings = "上午好";
            }else if (h < 14){
                this.greetings = "中午好";
            }else if (h < 17){
                this.greetings = "下午好";
            }else if (h < 19){
                this.greetings = "傍晚好";
            }else if (h < 22){
                this.greetings = "晚上好";
            }else {
                this.greetings = "夜里好";
            }
        },

        // 跳转到我的
        goMy() {
            this.$router.push({name: 'My'});
        },

        // 跳转到搜索
        goSearch() {
            this.$router.push({name: 'Search'});
        }
    }
}
</script>

<style lang="less" scoped>

@import '../assets/less/home.less';
</style>