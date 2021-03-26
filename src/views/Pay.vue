<template>
    <div class="pay">
        <van-nav-bar
        title="订单结算"
        left-text="返回"
        left-arrow
        @click-left="back"
        />

        <!-- 地址框 -->
        <div class="pay-box">
            <div class="select-address-box">
                <div class="select">
                    <span @click="showListOfSelectedAddresses">选择地址</span>
                    <van-icon name="arrow" />
                </div>
                <div class="address-box">
                    <div class="name-box">
                        <div class="name">{{ currentAddressInformation.name }}</div>
                        <div class="telephone-number">{{ currentAddressInformation.tel }}</div>
                        <div class="default" v-show="currentAddressInformation.isDefault">默认</div>
                    </div>
                    <div class="address">
                        {{ currentAddressInformation.address }}
                    </div>
                </div>
            </div>
        </div>

        <!-- 订单信息 -->
        <div class="pey-info">
            <PayBox :pro-info="proInfo">
                <template #order-item>
                    <OrderItem
                    v-for="(item, index) in payShopBagData"
                    :key="index"
                    :product="item"
                    ></OrderItem>
                </template>
            </PayBox>
        </div>

        <!-- 选择地址 -->
        <van-popup
        v-model="show"
        position="bottom"
        closeable
        >
            <div class="address-boxing">
                <div class="select-address">选择地址</div>
                <van-address-list
                v-model="chosenAddressId"
                :list="list"
                default-tag-text="默认"
                @add="add"
                @select="selectAddress"
                />
            </div>
        </van-popup>

        <!-- 立即结算 -->
        <div class="pay-btn">
            <van-button
            size="large"
            round
            color="#71210e"
            @click="pay"
            >
            立即结算
            </van-button>
        </div>
    </div>
</template>

<script>
import PayBox from '../components/PayBox';
import OrderItem from '../components/OrderItem';

import {mapState, mapMutations} from 'vuex';

    export default {
        name: 'Pay',

        data () {
            return {
                // 是否显示弹出层
                show: false,

                // 选择的地址ID
                chosenAddressId: '',

                // 地址数据
                list: [],

                // 当前地址信息
                currentAddressInformation: {},

                // 订单商品id
                sids: [],

                // 需要购买的购物袋商品数据
                payShopBagData: [],

                // 商品总数量和总价格
                proInfo: {
                    count: 0,
                    total: 0,
                    date: ''
                },

            }
        },

        components: {
            PayBox,
            OrderItem
        },

        computed: {
            ...mapState(['shopbagCount'])
        },

        created () {

            // 截取查询参数
            this.sids = this.$route.query.sids.split('-');

            // 查询用户地址列表
            this.getAddressListData();

            // 获取订单结算的购物袋商品数据
            this.grtShopBagDataByPay();
        },

        methods: {

            ...mapMutations(['changeShopbagCount']),

            // 返回
            back() {
                this.$router.go(-1);
            },

            // 显示选择地址列表
            showListOfSelectedAddresses() {
                this.show = true;
            },

            // 新增地址
            add() {
                this.$router.push({name: 'Address'})
            },

            // 查询用户地址列表
            getAddressListData() {
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
                    url: this.baseUrl + '/findAddress',
                    // 如果是GET请求, 参数需要挂载到params
                    params: {
                        appkey: this.appkey,
                        tokenString: tokenString
                    }
                }).then(res => { // 成功
                    // console.log('成功res 查询用户地址列表 ==> ', res);
                    this.$toast.clear();

                    if (res.data.code === 700) {    // 没有登录
                        this.$toast({
                            message: res.data.msg,
                            forbidClick: true,
                            duration: 3000,
                        });

                        // 跳转到登录页面
                        return this.$router.push({name: 'Login'});

                    } else if (res.data.code === 20000) { // 查询用户地址列表

                        // 添加 address 属性
                        res.data.result.forEach(v => {
                            v.address = `${v.province}${v.city}${v.county}${v.addressDetail}`;
                            v.isDefault = Boolean(v.isDefault);

                            // 判断给默认地址勾选 再获取地址信息
                            if (v.isDefault) {
                                this.chosenAddressId = v.id;

                                this.currentAddressInformation = {...v}
                            }
                        })
                        this.list = res.data.result;

                        // console.log('this.currentAddressInformation => ', this.currentAddressInformation);
                    }
                }).catch(err => {   // 失败
                    console.log('失败err ==> ', err);
                });
            },

            // 选择地址
            selectAddress(item) {
                this.chosenAddressId = item.id;
                this.currentAddressInformation = {...item};

                // 隐藏 选择地址
                this.show = false;
            },

            // 获取订单结算的购物袋商品数据
            grtShopBagDataByPay() {
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
                    url: this.baseUrl + '/commitShopcart',
                    // 如果是GET请求, 参数需要挂载到params
                    params: {
                        appkey: this.appkey,
                        tokenString: tokenString,
                        sids: JSON.stringify(this.sids)
                    }
                }).then(res => { // 成功
                    // console.log('成功res 获取订单结算的购物袋商品数据 ==> ', res);
                    this.$toast.clear();

                    if (res.data.code === 700) {    // 没有登录
                        this.$toast({
                            message: res.data.msg,
                            forbidClick: true,
                            duration: 3000,
                        });

                        // 跳转到登录页面
                        return this.$router.push({name: 'Login'});

                    } else if (res.data.code === 50000) { // 查询商品成功
                        // 如果订单结束页面没有数据就跳转到首页
                        if (res.data.result.length === 0) {
                            return this.$router.push({path: '/'});
                        }

                        res.data.result.forEach(v => {
                            this.proInfo.count += v.count;
                            this.proInfo.total += v.count * v.price;
                        })

                        this.payShopBagData = res.data.result;

                    }
                }).catch(err => {   // 失败
                    console.log('失败err ==> ', err);
                });
            },

            // 结算订单
            pay() {

                // 判断是否选择地址
                if (!this.currentAddressInformation.aid) {
                    return this.$toast({
                            message: '请选择收货地址',
                            forbidClick: true,
                            duration: 3000,
                        });
                }
                // 获取 cookies 里面的 tokenString值
                let tokenString = this.$cookies.get('tokenString');
                // console.log('tokenString ==> ', tokenString);

                if (!tokenString) {
                    console.log('浏览器tokenString不存在');
                    return this.$router.push({name: 'Login'});
                }

                // 获取数据
                let data = {
                    appkey: this.appkey,
                    tokenString,
                    sids: JSON.stringify(this.sids),
                    phone: this.currentAddressInformation.tel,
                    address: this.currentAddressInformation.address,
                    receiver: this.currentAddressInformation.name
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
                    url: this.baseUrl + '/pay',
                    // 如果是POST请求, 参数需要挂载到data
                    data
                }).then(res => { // 成功
                    // console.log('成功res 结算订单 ==> ', res);
                    this.$toast.clear();

                    if (res.data.code === 700) {    // 没有登录
                        this.$toast({
                            message: res.data.msg,
                            forbidClick: true,
                            duration: 3000,
                        });

                        // 跳转到登录页面
                        return this.$router.push({name: 'Login'});

                    } else if (res.data.code === 60000) { // 结算成功

                        // 修改vuex的购物袋数量
                        this.changeShopbagCount(this.shopbagCount - this.sids.length);

                        // 跳转到订单组件
                        this.$router.push({name: 'Order'});

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
@import '../assets/less/pay.less';

</style>