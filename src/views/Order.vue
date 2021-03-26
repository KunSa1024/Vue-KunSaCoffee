<template>
    <div class="order">
        <van-nav-bar
        title="我的订单"
        left-text="返回"
        left-arrow
        @click-left="back"
        />

        <Bg>
            <van-tabs
            v-model="activeTabIndex"
            swipeable
            :line-height="2"
            color="#71210e"
            title-active-color="#71210e"
            @change="changeOrderStatus"
            >
                <van-tab
                v-for="(item, index) in tabs"
                :key="index"
                :title="item.title"
                >
                    <div class="tab-content">
                        <div v-if="orderData.length > 0">
                            <div
                            class="tab-box"
                            v-for="(item, index) in orderData"
                            :key="index">
                                <PayBox :pro-info="item.proInfo">
                                    <template #pay-title>
                                        <div class="pay-title-box">
                                            <div class="pay-t">{{ item.oid }}</div>
                                            <div class="pay-s" v-if="item.status === 2" @click="removeOrder(item, index)">
                                                <div class="pay-text">已完成</div>
                                                <van-icon class="pay-icon" name="delete-o" />
                                            </div>
                                            <div class="pay-s" v-else-if="item.status === 1">
                                                <div class="pay-text" @click="confirmOrder(item, index)">确认订单</div>
                                            </div>
                                        </div>
                                    </template>
                                    <template #order-item>
                                        <OrderItem
                                        v-for="(items, indexs) in item.data"
                                        :key="indexs"
                                        :product="items"
                                        ></OrderItem>
                                    </template>
                                </PayBox>
                            </div>
                        </div>

                        <div v-else>
                            <van-empty description="没有该状态的订单" />
                        </div>
                    </div>
                </van-tab>
            </van-tabs>
        </Bg>
    </div>
</template>

<script>
import Bg from '../components/Bg';
import PayBox from '../components/PayBox';
import OrderItem from '../components/OrderItem';

    export default {
        naem: 'Order',

        components: {
            Bg,
            PayBox,
            OrderItem
        },

        data () {
            return {
                // 标签页切换下标
                activeTabIndex: 0,

                tabs: [
                    {
                        title: '全部',
                        status: 0
                    },
                    {
                        title: '进行中',
                        status: 1
                    },
                    {
                        title: '已完成',
                        status: 2
                    },
                ],

                // 订单数据
                orderData: []
            }
        },

        created () {
            // 获取订单数据
            this.getOrderData(0)
        },

        methods: {
            // 返回
            back() {
                this.$router.go(-1);
            },

            // 获取订单数据
            getOrderData(status) {
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
                    url: this.baseUrl + '/findOrder',
                    // 如果是GET请求, 参数需要挂载到params
                    params: {
                        appkey: this.appkey,
                        tokenString: tokenString,
                        status
                    }
                }).then(res => { // 成功
                    // console.log('成功res 获取订单数据 ==> ', res);
                    this.$toast.clear();

                    if (res.data.code === 700) {    // 没有登录
                        this.$toast({
                            message: res.data.msg,
                            forbidClick: true,
                            duration: 3000,
                        });

                        // 跳转到登录页面
                        return this.$router.push({name: 'Login'});

                    } else if (res.data.code === 70000) { // 查询订单成功
                        let products = [];
                        let oids = [];

                        // 先找出oid
                        res.data.result.forEach(v => {
                            v.small_img = v.smallImg;
                            if (oids.indexOf(v.oid) === -1) {
                                let o = {
                                    oid: v.oid,
                                    status: v.status,
                                    proInfo: {
                                        date: v.createdAt,
                                        count: 0,
                                        total: 0,
                                    },
                                    data: []
                                };
                                oids.push(v.oid);
                                products.push(o);
                            };
                        });

                        // 通过oid查找相应的订单商品
                        products.forEach(value => {

                            res.data.result.forEach(item => {
                                if (value.oid === item.oid) {
                                    value.data.push(item);
                                    value.proInfo.count += item.count;
                                    value.proInfo.total += item.count * item.price;
                                }
                            })
                        })

                        // console.log('oids ==> ', oids);
                        // console.log('products ==> ', products);

                        this.orderData = products;

                    }
                }).catch(err => {   // 失败
                    console.log('失败err ==> ', err);
                });
            },

            // 切换订单状态
            changeOrderStatus(name, title) {
                // console.log('name ==> ', name);
                // console.log('title ==> ', title);

                // 获取订单数据
                this.getOrderData(name);
            },

            // 确认订单
            confirmOrder(item, index) {

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
                    method: 'POST',
                    url: this.baseUrl + '/receive',
                    // 如果是POST请求, 参数需要挂载到data
                    data: {
                        appkey: this.appkey,
                        tokenString,
                        oid: item.oid
                    }
                }).then(res => { // 成功
                    // console.log('成功res 确认订单 ==> ', res);
                    this.$toast.clear();

                    if (res.data.code === 700) {    // 没有登录
                        // 跳转到登录页面
                        return this.$router.push({name: 'Login'});

                    } else if (res.data.code === 80000) { // 已收货成功
                        item.status = 2;

                        if (this.activeTabIndex === 1) {
                            // 移除当前 tab 的订单数据
                            this.orderData.splice(index, 1);
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

            // 删除订单
            removeOrder(item, index) {
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
                    method: 'POST',
                    url: this.baseUrl + '/removeOrder',
                    // 如果是POST请求, 参数需要挂载到data
                    data: {
                        appkey: this.appkey,
                        tokenString,
                        oid: item.oid
                    }
                }).then(res => { // 成功
                    // console.log('成功res 删除订单 ==> ', res);
                    this.$toast.clear();

                    if (res.data.code === 700) {    // 没有登录
                        // 跳转到登录页面
                        return this.$router.push({name: 'Login'});

                    } else if (res.data.code === 90000) { // 删除订单成功
                        // 移除当前 tab 的订单数据
                        this.orderData.splice(index, 1);

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
            }
        }
    }
</script>

<style lang="less" scoped>
@import '../assets/less/order.less';
</style>