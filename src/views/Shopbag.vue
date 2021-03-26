<template>
    <div class="shopbag">
        <!-- 导航栏 -->
        <van-nav-bar
        title="购物袋"
        left-text="返回"
        left-arrow
        @click-left="onClickLeft"
        >
            <template #right v-if="shopBagData.length > 0">
                <div @click="onClickRight" class="edit">{{ !isEdit ? '编辑' : '完成' }}</div>
            </template>
        </van-nav-bar>

        <div v-if="shopBagData.length > 0">

            <!-- 广告 -->
            <div class="shopbag_bg"></div>

            <!-- 产品 -->
            <div class="shopbag-box">
                <van-list
                v-model="loading"
                :finished="finished"
                finished-text="没有商品啦😜"
                loading-text="别急别急,在加载中👨‍🦽"
                offset="300"
                @load="loadShopBagData"
                >
                    <!-- 滑块删除 -->
                    <van-swipe-cell
                    class="shopbag-cell"
                    :disabled="isEdit"
                    v-for="(item, index) in shopBagData"
                    :key="item.sid"
                    >
                    <div class="shopbag-item">
                        <!-- 单选框 -->
                        <div class="check">
                            <van-checkbox
                            ref="checkbox"
                            v-model="item.isChecked"
                            icon-size="22px"
                            @change="simpleSelect"
                            >
                            </van-checkbox>
                        </div>

                        <div class="pro-info">
                            <div class="pro-img">
                                <img
                                class="auto-img"
                                :src="item.small_img"
                                alt=""
                                >
                            </div>
                            <div class="pro-text">
                                <div class="text-box" @click="goDetall(item.pid)">
                                    <div class="pro-names">
                                        <div class="pro-name one-text">
                                            {{ item.name }}
                                        </div>
                                        <div class="pro-rule one-text">
                                            {{ item.rule }}
                                        </div>
                                    </div>
                                    <div class="pro-enname one-text">
                                        {{ item.enname }}
                                    </div>
                                </div>
                                <div class="count-box">
                                    <div class="pro-price">&yen;{{ item.price }}</div>
                                    <!-- 产品数量 -->
                                    <div class="pro-count">
                                        <van-stepper
                                        v-model="item.count"
                                        theme="round"
                                        button-size="22"
                                        disable-input
                                        @change="upDataShopBagCount(item.sid, item.count)"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <template #right>
                        <van-button
                        square text="删除"
                        type="danger"
                        class="delete-button"
                        @click="removeShopBag([item.sid], index)"
                        />
                    </template>
                    </van-swipe-cell>
                </van-list>
            </div>

        </div>

        <div v-else>
            <van-empty description="购物袋没有商品,赶紧去逛一逛!">
                <div @click="goHome" class="guang">逛一逛</div>
            </van-empty>
        </div>

        <div v-if="shopBagData.length > 0">
            <!-- 提交栏 -->
            <van-submit-bar
            v-show="!isEdit"
            :price="total"
            button-text="提交订单"
            button-color="#71210e"
            @submit="placeOrder"
            >
                <van-checkbox
                v-model="checked"
                @click="allSelect"
                >全选</van-checkbox>
            </van-submit-bar>

            <!-- 删除 -->
            <van-submit-bar
            v-show="isEdit"
            button-text="删除选择"
            button-color="#71210e"
            @submit="removeSelect"
            >
                <van-checkbox
                v-model="checked"
                @click="allSelect"
                >全选</van-checkbox>
            </van-submit-bar>
        </div>
    </div>
</template>

<script>
// import '../assets/less/shopbag.less'

import {mapState, mapMutations} from 'vuex';


    export default {
        name: 'Shopbag',
        data () {
            return {
                // 编辑 和 完成 切换
                isEdit: false,

                // 全选或者取消全选
                checked: false,

                // 购物袋所有数据
                shopBagAllData: [],

                // 购物袋数据
                shopBagData: [],

                // 开始截取位置
                start: 0,

                // 每次获取7条数据
                count: 7,

                // 是否加载, 首次不触发懒加载
                loading: true,

                // 是否全部加载完毕
                finished: false,

                // 总金额
                total: 0
            }
        },

        created () {
            // 获取购物袋商品数据
            this.getShopBagData();
        },

        computed: {
            ...mapState(['shopbagCount'])
        },

        methods: {

            ... mapMutations(['changeShopbagCount']),

            // 返回
            onClickLeft() {
                this.$router.go(-1);
            },

            // 编辑
            onClickRight() {
                this.isEdit = !this.isEdit;
            },

            // 获取购物袋商品数据
            getShopBagData() {

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
                    url: this.baseUrl + '/findAllShopcart',
                    // 如果是GET请求, 参数需要挂载到params
                    params: {
                        appkey: this.appkey,
                        tokenString: tokenString
                    }
                }).then(res => { // 成功
                    // console.log('成功res 获取购物袋商品数据 ==> ', res);
                    this.$toast.clear();

                    if (res.data.code === 700) {    // 没有登录
                        this.$toast({
                            message: res.data.msg,
                            forbidClick: true,
                            duration: 3000,
                        });

                        // 跳转到登录页面
                        return this.$router.push({name: 'Login'});

                    } else if (res.data.code === 5000) { // 查询数据成功

                        // 展开数据　添加一个isChecked:false　默认为false
                        this.shopBagAllData = res.data.result.map(v=>{
                            return {...v, isChecked:false}
                        });

                        this.shopBagData = this.shopBagAllData.slice(
                            this.start,
                            this.start + this.count
                            );
                        this.start += this.count;
                        this.loading = false;   // 下次触底懒加载


                        // 如果全部数据小于获取的数据 就不执行获取数据
                        if (this.shopBagAllData.length < this.count) {

                            this.finished = true;
                            return;
                        }

                    } else {
                        this.$toast({
                            message: res.data.msg,
                            forbidClick: true,
                            duration: 3000
                        });
                    }
                }).catch(err => {   // 失败
                    console.log('失败err ==> ', err);
                });
            },

            // 加载购物袋数据
            loadShopBagData() {

                setTimeout(() => {
                    console.log('加载中...');

                    // 每次加载获取7条数据存储到 data
                    let data = this.shopBagAllData.slice(
                        this.start,
                        this.start + this.count
                        );

                    // 把data展开,一条一条的存储到this.shopBagData
                    this.shopBagData.push(...data);

                    this.start += this.count;

                    // 取消全选
                    if (data.length > 0) {
                        this.checked = false;
                    }

                    // 如果本次截取不足this.count条数据,下次不可能有数据
                    if (data.length < this.count) {
                        console.log('已经加载完数据...');
                        this.finished = true;
                        return;
                    }

                    this.loading = false;   // 下次触底懒加载
                }, 1500)


            },

            // 修改购物袋数量
            upDataShopBagCount(sid, count) {

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
                    url: this.baseUrl + '/modifyShopcartCount',
                    // 如果是POST请求, 参数需要挂载到data
                    data: {
                        appkey: this.appkey,
                        tokenString,
                        sid,
                        count
                    }
                }).then(res => { // 成功
                    // console.log('成功res ==> ', res);
                    this.$toast.clear();

                    if (res.data.code === 700) {    // 没有登录
                        this.$toast({
                            message: res.data.msg,
                            forbidClick: true,
                            duration: 3000,
                        });

                        // 跳转到登录页面
                        return this.$router.push({name: 'Login'});

                    } else if (res.data.code === 6000) { // 修改数量成功

                        this.sum(); // 计算价格

                    }
                }).catch(err => {   // 失败
                    console.log('失败err ==> ', err);
                });
            },

            // 全选
            allSelect() {
                // 遍历所有数据的复选框状态, 给它赋值当前全选复选框状态
                this.shopBagData.forEach(v => {
                    v.isChecked = this.checked;
                })

                this.sum(); // 计算价格
            },

            // 单选
            simpleSelect() {
                this.sum(); // 计算价格

                // 只要有一个单选没有勾选, 则全选不能勾选
                for (let i = 0; i < this.shopBagData.length; i++) {
                    if (!this.shopBagData[i].isChecked) {
                        this.checked = false;
                        return;
                    }
                }
                this.checked = true;
            },

            // 滑动删除
            removeShopBag(sids, index) {
                // sids => 商品id
                // index => 下标

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
                    url: this.baseUrl + '/deleteShopcart',
                    // 如果是POST请求, 参数需要挂载到data
                    data: {
                        appkey: this.appkey,
                        tokenString,
                        sids: JSON.stringify(sids)
                    }
                }).then(res => { // 成功
                    console.log('成功res 滑动删除 ==> ', res);
                    this.$toast.clear();

                    if (res.data.code === 700) {    // 没有登录
                        this.$toast({
                            message: res.data.msg,
                            forbidClick: true,
                            duration: 3000,
                        });
                        // 跳转到登录页面
                        return this.$router.push({name: 'Login'});
                    } else if (res.data.code == 7000) { // 删除数据成功
                        if (index != undefined) {   // 单个删除
                            this.shopBagData.splice(index, 1);
                            this.changeShopbagCount(this.shopbagCount - 1);
                            this.simpleSelect();    // 执行一下单选
                        } else {    // 多个删除
                            for (let i = 0; i < this.shopBagData.length; i++) {
                                if (this.shopBagData[i].isChecked) {
                                    this.shopBagData.splice(i, 1);
                                    i--;
                                }
                            }

                            // 产品数量 = 原本数量 - 需要删除的数量
                            this.changeShopbagCount(this.shopbagCount - sids.length);

                            this.sum();   // 计算价格
                        }

                        this.$nextTick(() => {
                            let cells = document.querySelectorAll(".shopbag-cell");
                            console.log('cells ==> ', cells);

                            if (cells.length === 0 && this.shopBagData.length < this.shopBagAllData.length) {
                                // 触发懒加载
                                this.loadShopBagData();
                            } else {
                                // 获取最后一个节点尺寸
                                let cellSzie = cells[cells.length - 1].getBoundingClientRect();

                                // 获取最后一个节点的高度
                                let distance = cellSzie.top;

                                // 获取最后一个节点的高度
                                let cellHeight = cellSzie.height;
                                
                                // 获取屏幕高度
                                let innerHeight = window.innerHeight;

                                if (distance + cellHeight - innerHeight <= 50) {
                                    // 触发懒加载
                                    this.loadShopBagData();
                                }
                            }
                        });

                    } else {
                        this.$toast({
                            message: res.data.msg,
                            forbidClick: true,
                            duration: 3000
                        });

                    }
                }).catch(err => {   // 失败
                    console.log('失败err ==> ', err);
                });
            },

            // 删除选择的购物袋商品
            removeSelect() {
                // 获取勾选的 sid
                let sids = [];
                this.shopBagData.forEach(v => {
                    if (v.isChecked) {
                        sids.push(v.sid);
                    }
                })

                // 没有选择商品 就return
                if (sids.length === 0) {
                    this.$toast({
                        message: '未选择删除商品',
                        forbidClick: true,
                        duration: 3000,
                    });
                    return;
                }

                this.removeShopBag(sids);
            },

            // 计算勾选的商品总金额
            sum() {
                let total = 0;
                this.shopBagData.forEach(v => {
                    if (v.isChecked) {
                        total += (v.price * v.count);
                    }
                })

                this.total = total * 100;
            },

            // 逛一逛
            goHome() {
                this.$router.push({name: 'Home'})
            },

            // 提交订单
            placeOrder() {
                // 获取勾选的 sid
                let sids = [];
                this.shopBagData.forEach(v => {
                    if (v.isChecked) {
                        sids.push(v.sid);
                    };
                });

                // 没有选择商品 就return
                if (sids.length === 0) {
                    this.$toast({
                        message: '未选择下单的商品',
                        forbidClick: true,
                        duration: 3000,
                    });
                    return;
                };

                // 跳转到订单页面
                this.$router.push({name: 'Pay', query: {sids: sids.join('-')}});
            },

            // 跳转到产品详情
            goDetall(pid) {
                this.$router.push({name: 'Detail', params: {pid}});
            }

        }
    }
</script>


<style lang="less" scoped>
@import '../assets/less/shopbag.less';

</style>