<template>
    <div class="search">
        <van-nav-bar
        right-text="搜索"
        left-arrow
        @click-left="onClickLeft"
        @click-right="onSearch"
        >
            <template #title>
                <van-search
                shape="round"
                background="#fff"
                v-model="searchValue"
                placeholder="请输入搜索关键词"
                @search="onSearch"
                @cancel="onCancel"
                 />
            </template>
        </van-nav-bar>

        <!-- 产品 -->
        <div class="product-box">
            <Products :ProductData="switchAssembly ? searchProductData : hotProductData">
                <template #title>
                    <div class="line">
                        <span>
                            {{ switchAssembly ? '搜索结果' : '热门推荐'}}
                        </span>
                    </div>
                </template>
            </Products>
        </div>
        
    </div>
</template>

<script>
import Products from '../components/Products';

    export default {
        naem: 'Search',
        
        components: {
            Products
        },

        data () {
            return {
                // 搜索值
                searchValue: '',

                // 搜索产品数据
                searchProductData: [],

                // 热门推荐
                hotProductData: [],

                // 切换组件
                // false => 热门推荐
                // true  => 搜索结果
                switchAssembly: false
            }
        },

        created () {
            // 获取首页"热卖推荐"商品数据
            this.getHotProduct()
        },

        methods: {
            // 返回
            onClickLeft() {
                this.$router.go(-1);
            },

            // 搜索
            onSearch(value) {
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
                    url: this.baseUrl + '/search',
                    // 如果是GET请求, 参数需要挂载到params
                    params: {
                        appkey: this.appkey,
                        name: value
                    }
                }).then(res => { // 成功
                    // console.log('成功res 搜索 ==> ', res);
                    this.$toast.clear();

                    if (res.data.code === 700) {    // 没有登录
                        this.$toast({
                            message: res.data.msg,
                            forbidClick: true,
                            duration: 3000,
                        });

                        // 跳转到登录页面
                        // return this.$router.push({name: 'Login'});

                    } else if (res.data.code === 'Q001') { // 搜索商品成功
                        // console.log('搜索商品成功 => ', res.data.result);
                        this.searchProductData = res.data.result;
                    }

                }).catch(err => {   // 失败
                    console.log('失败err ==> ', err);
                });
            },

            // 取消
            onCancel() {
                this.searchValue = '';
            },

            // 查看商品详情
            viewProduct(pid) {
                this.$router.push({name: 'Detail', params: {pid}});
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
        },

        watch: {
            // 搜索值
            searchValue: function(newVal) {
                console.log("newVal:", newVal);

                this.switchAssembly = true;

                // 判断搜索框的值是否为空, 是空就显示热门推荐
                if (newVal === "") {
                    this.switchAssembly = false;
                    return;
                }
                this.onSearch(newVal);
            }
        }
    }
</script>

<style lang="less" scoped>
@import '../assets/less/search.less';
</style>