<template>
    <div class="detail">
        <van-nav-bar
        title="商品详情"
        left-text="返回"
        left-arrow
        @click-left="onClickLeft"
        />

        <div>
            <img class="auto-img" :src="datailData.large_img" alt="">
        </div>

        <div class="pro-info">
            <!-- 标题 -->
            <div class="pro-box">
                <div class="pro-name">
                    <div class="ch-name">{{ datailData.name }}</div>
                    <div class="en-name">{{ datailData.enname }}</div>
                </div>
                <div class="pro-price">&yen;{{ datailData.price }}</div>
            </div>

            <!-- 规格 -->
            <div class="rules">
                <div class="rule" v-for="(v1, i1) in datailData.rulesData" :key="i1">
                    <div class="rule-title">{{ v1.title }}</div>
                    <div class="rule-items">
                        <div :class="{active: v1.currentIndex === i2}" v-for="(v2, i2) in v1.rule" :key="i2" @click="selectRule(v1, i2)">{{ v2.title }}</div>
                    </div>
                </div>
            </div>

            <!-- 数量 -->
            <div class="count-box">
                <div class="count-title">选择数量</div>
                <van-stepper v-model="count" theme="round" button-size="22" disable-input />
            </div>

            <!-- 描述 -->
            <div class="desc">
                <div class="desc-title">商品描述</div>
                <div class="desc-text">
                    <div v-for="(v3, i3) in datailData.desc" :key="i3">{{ i3+1 }}、{{ v3 }}</div>
                </div>
            </div>

            <van-goods-action>
                <van-goods-action-icon
                icon="bag"
                text="购物袋"
                :badge="shopbagCount >  0 ? shopbagCount : ''"
                color="#666"
                @click="goShopbag"
                />

                <van-goods-action-icon
                icon="like"
                :text="likeStatus ? '已收藏' : ' 收藏'"
                @click="likeAndNotLike"
                :color="likeStatus ? '#71210e' : '#666'"
                />

                <van-goods-action-button
                color="#b28850"
                type="warning"
                text="加入购物袋"
                @click="addShopbag"
                />

                <van-goods-action-button
                color="#71210e"
                type="danger"
                text="立即购买"
                @click="buyNow"
                />
            </van-goods-action>
        </div>
    </div>
</template>

<script>
// import '../assets/less/detail.less'

import { mapState, mapMutations } from 'vuex';

    export default {
        name: 'Detail',
        data() {
            return {
                // 商品id
                pid: '',

                // 商品详情数据
                datailData: {},

                // 收藏状态
                likeStatus: false,

                // 选择数量
                count: 1,
            }
        },
        created () {
            this.pid = this.$route.params.pid;
            // console.log(pid);

            // 获取商品详情数据
            this.getDatailData();

            // 查询当前收藏产品
            this.getLikeProduct();

            // 获取购物袋的数目(不是产品总数量)
            this.getShopbagtCount();
        },

        computed: {
            // 获取购物车数量
            ...mapState(['shopbagCount', 'isLoadShopBagCount']),

        },

        methods: {
            // 解构mapMutations里面的changeShopbagCount
            ...mapMutations(['changeShopbagCount', 'changIsLoadShopBagCount']),

            // 返回
            onClickLeft() {
                this.$router.go(-1);
            },

            // 获取商品详情数据
            getDatailData() {
                // 加载图标
                this.$toast.loading({
                    message: '加载中...',
                    forbidClick: true,
                    duration: 0,
                });

                this.axios({
                    // 请求方式
                    method: 'GET',
                    url: this.baseUrl + '/productDetail',
                    // 如果是GET请求, 参数需要挂载到params
                    params: {
                        appkey: this.appkey,
                        pid: this.pid
                    }
                }).then(res => { // 成功
                    // console.log('成功res ==> ', res);
                    this.$toast.clear();

                    if (res.data.code === 600) {
                        let data = res.data.result[0];

                        // 处理规格的数据
                        let rules = ['cream', 'tem', 'sugar', 'milk'];
                        data.rulesData = [];
                        rules.forEach(v => {
                            // 如果不存在规格, 则不添加到data.rulesData
                            if (!data[v]) {
                                return;
                            }
                            let currentRule = {
                                title: data[v + '_desc'],   // 子类
                                rule: [],   // 父类
                                currentIndex: 0 // 默认选项
                            };
                            let rulesText = data[v].split('/');
                            rulesText.forEach(item => {
                                let o = {
                                    title: item
                                };
                                currentRule.rule.push(o);
                            });
                            data.rulesData.push(currentRule);
                        })

                        // 处理商品描述信息
                        data.desc = data.desc.split(/\n/);

                        // console.log(data);
                        this.datailData = data;
                    } else {
                        this.$$toast({
                            message: res.data.msg,
                            forbidClick: true,
                            duration: 1000
                        })
                    }
                }).catch(err => {   // 失败
                    console.log('失败err ==> ', err);
                });
            },

            // 点击切换选择规格
            selectRule(item, index) {
                item.currentIndex = index;
            },

            // 收藏 或者 取消收藏
            likeAndNotLike() {
                if (this.likeStatus) {
                    // 取消收藏
                    this.notLike();
                } else {
                    // 收藏
                    this.like();
                }
            },

            // 收藏
            like() {
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
                    url: this.baseUrl + '/like',
                    // 如果是GET请求, 参数需要挂载到params
                    data: {
                        appkey: this.appkey,
                        pid: this.pid,
                        tokenString: tokenString
                    }
                }).then(res => { // 成功
                    // console.log('成功res ==> ', res);
                    this.$toast.clear();

                    if (res.data.code === 700) {    // 没有登录点击收藏会跳转到登录页面
                        this.$toast({
                            message: res.data.msg,
                            forbidClick: true,
                            duration: 1000,
                        });

                        // 跳转到登录页面
                        return this.$router.push({name: 'Login'});

                    } else if (res.data.code === 800) { // 已收藏
                        this.$toast({
                            message: res.data.msg,
                            forbidClick: true,
                            duration: 1000,
                        });

                        // 已收藏
                        this.likeStatus = true;

                    } else {
                        this.$toast({
                            message: res.data.msg,
                            forbidClick: true,
                            duration: 1000
                        });
                    }
                }).catch(err => {   // 失败
                    console.log('失败err ==> ', err);
                });
            },

            // 查询当前收藏产品
            getLikeProduct() {
                // 获取 cookies 里面的 tokenString值
                let tokenString = this.$cookies.get('tokenString');

                this.axios({
                    // 请求方式
                    method: 'GET',
                    url: this.baseUrl + '/findlike',
                    // 如果是GET请求, 参数需要挂载到params
                    params: {
                        appkey: this.appkey,
                        pid: this.pid,
                        tokenString,
                    }
                }).then(res => { // 成功
                    // console.log('成功res ==> ', res);
                    this.$toast.clear();

                    if (res.data.code == 700) { // 没有登录
                        // return this.$router.push({name: 'Login'});
                    } else if (res.data.code == 1000) { // 查询商品成功

                        if (res.data.result.length > 0) {
                            this.likeStatus = true;
                        }
                    }

                }).catch(err => {   // 失败
                    console.log('失败err ==> ', err);
                });
            },

            // 取消收藏
            notLike() {
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
                    method: 'POST',
                    url: this.baseUrl + '/notlike',
                    // 如果是GET请求, 参数需要挂载到params
                    data: {
                        appkey: this.appkey,
                        pid: this.pid,
                        tokenString: tokenString
                    }
                }).then(res => { // 成功
                    // console.log('成功res ==> ', res);
                    this.$toast.clear();

                    if (res.data.code === 900) {    // 取消收藏
                        this.$toast({
                            message: res.data.msg,
                            forbidClick: true,
                            duration: 1000,
                        });

                        if (res.data.result === 1) {
                            // 取消收藏
                            this.likeStatus = false;
                        }
                    }
                }).catch(err => {   // 失败
                    console.log('失败err ==> ', err);
                });
            },

            // 添加购物袋
            addShopbag(isBuy) {
                // 获取 cookies 里面的 tokenString值
                let tokenString = this.$cookies.get('tokenString');
                // console.log('tokenString ==> ', tokenString);

                if (!tokenString) {
                    console.log('浏览器tokenString不存在');
                    return this.$router.push({name: 'Login'});
                }

                // 获取要加入产品的规格
                let rules = [];
                this.datailData.rulesData.forEach(v => {
                    rules.push(v.rule[v.currentIndex].title);
                })
                // console.log("rules ==> ", rules);

                // 加载图标
                this.$toast.loading({
                    message: '加载中...',
                    forbidClick: true,
                    duration: 0,
                });

                this.axios({
                    // 请求方式
                    method: 'POST',
                    url: this.baseUrl + '/addShopcart',
                    // 如果是POST请求, 参数需要挂载到data
                    data: {
                        pid: this.pid,
                        count: this.count,
                        rule: rules.join('/'),
                        appkey: this.appkey,
                        tokenString: tokenString
                    }
                }).then(res => { // 成功
                    // console.log('成功res 添加购物袋 ==> ', res);
                    this.$toast.clear();

                    // 加入购物车成功
                    if (res.data.code === 3000) {
                        // 在同商品不同规格, 购物袋就会添加1条数据
                        // 在不同商品也会添加1条数据
                        if (res.data.status === 1) {
                            this.changeShopbagCount(this.shopbagCount + 1);

                        }
                        console.log('isBuy ==> ', isBuy);
                        if (!isBuy) {
                            // 跳转到订单结算页面
                            this.$router.push({name: 'Pay', query: {sids: res.data.sid}});
                        }

                    } else {
                        this.$toast({
                            message: res.data.msg,
                            forbidClick: true,
                            duration: 3000,
                        });
                    }

                }).catch(err => {   // 失败
                    console.log('失败err ==> ', err);
                });
            },

            // 跳转到购物袋
            goShopbag() {
                this.$router.push({name: 'Shopbag'});
            },

            // 获取购物袋的数目(不是产品总数量)
            getShopbagtCount() {

                if (this.isLoadShopBagCount) {
                    console.log('Main 已经加载过购物袋数量, 不再请求');
                    return;
                }

                // 获取 cookies 里面的 tokenString值
                let tokenString = this.$cookies.get('tokenString');

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
                    console.log('成功res 获取购物袋的数目 ==> ', res);
                    this.$toast.clear();

                    // 没有登录
                    if (res.data.code === 700) {
                        this.$toast({
                            message: res.data.msg,
                            forbidClick: true,
                            duration: 1000,
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

            // 立即购买
            buyNow() {
                // 添加购物袋
                this.addShopbag(false);
            }
        }
    }
</script>

<style lang="less" scoped>
@import '../assets/less/detail.less';
</style>