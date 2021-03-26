<template>
    <div class="main">

        <div>
            <!-- 二级路由 -->
            <router-view></router-view>
        </div>

        <van-tabbar
        v-model="activeIndex"
        active-color="#71210e"
        inactive-color="#646566"
        route
        >
            <van-tabbar-item
            v-for="(item, index) in tabbarData"
            :key="index"
            :badge="item.badge > 0 ? item.badge : ''"
            :dot="item.dot"
            :to="item.to"
            >
                <span>{{ item.title }}</span>
                <template #icon="props">
                    <img :src="props.active ? item.icon.active : item.icon.inactive" />
                </template>
            </van-tabbar-item>
        </van-tabbar>
    </div>
</template>

<script>

import { mapState, mapMutations } from 'vuex';

    export default {
        name: 'Main',
        data() {
            return {
                activeIndex: 0,
            }
        },

        computed: {
            // 获取购物车数量
            ...mapState(['shopbagCount', 'isLoadShopBagCount']),

            // 标题栏数据
            tabbarData() {
                return [
                    {
                        title: '首页',
                        icon: {
                            active: require('../assets/images/login_img/logo.png'),
                            inactive: require('../assets/images/login_img/logos.png')
                        },
                        to: '/'
                    },
                    {
                        title: '菜单',
                        icon: {
                            active: require('../assets/images/menu_active.png'),
                            inactive: require('../assets/images/menu.png')
                        },
                        to: '/menu'
                    },
                    {
                        title: '购物袋',
                        icon: {
                            active: require('../assets/images/shopbag_active.png'),
                            inactive: require('../assets/images/shopbag.png')
                        },
                        badge: this.shopbagCount,    // 徽章
                        to: '/shopbag'
                    },
                    {
                        title: '我的',
                        icon: {
                            active: require('../assets/images/my_active.png'),
                            inactive: require('../assets/images/my.png')
                        },
                        // dot:　true,  // 红点
                        to: '/my'
                    }
                ];
            }
        },

        created () {
            console.log('this.shopbagCount ==> ', this.shopbagCount);

            // 获取购物袋的数目(不是产品总数量)
            this.getShopbagtCount();
        },

        methods: {

            // 解构mapMutations里面的changeShopbagCount, isLoadShopBagCount
            // 写法一:
            ...mapMutations(['changeShopbagCount', 'changIsLoadShopBagCount']),

            // 写法二:
            // changeShopbagCount(data) {
            //     this.$store.commit('changeShopbagCount', data);
            // },

            // 获取购物袋的数目(不是产品总数量)
            getShopbagtCount() {

                if (this.isLoadShopBagCount) {
                    console.log('Main 已经加载过购物袋数量, 不再请求');
                    return;
                }

                // 获取 cookies 里面的 tokenString值
                let tokenString = this.$cookies.get('tokenString');
                // console.log('tokenString ==> ', tokenString);

                // 加载图标
                this.$toast.loading({
                    message: '加载中...',
                    forbidClick: true,
                    duration: 0,
                });

                this.axios({
                    // 请求方式
                    method: 'GET',
                    url: this.baseUrl + '/shopcartRows',
                    // 如果是GET请求, 参数需要挂载到params
                    params: {
                        appkey: this.appkey,
                        tokenString: tokenString
                    }
                }).then(res => { // 成功
                    // console.log('成功res ==> ', res);
                    this.$toast.clear();

                    // 没有登录
                    if (res.data.code === 700) {
                        this.$toast({
                            message: res.data.msg,
                            forbidClick: true,
                            duration: 1500,
                        });

                        // 跳转到登录页面
                        // return this.$router.push({name: 'Login'});
                    }

                    // 查询成功
                    if (res.data.code === 8000) {
                        // 提交购物车数量
                        // 写法一:
                        // 提交changeShopbagCount的mutations
                        // this.$store.commit('changeShopbagCount', res.data.result);

                        // 写法二:
                        this.changeShopbagCount(res.data.result);

                        this.changIsLoadShopBagCount(true);
                    }
                }).catch(err => {   // 失败
                    console.log('失败err ==> ', err);
                });
            },
        }
    }
</script>

<style lang="less" scoped>
.main {
    padding-bottom: 50px;
}
</style>