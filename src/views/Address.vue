<template>
    <div class="address">
        <van-nav-bar
        :title="aid ? '编辑地址' : '新增地址'"
        left-text="返回"
        left-arrow
        @click-left="back"
        />

        <Bg>
            <!-- !! => 非非快速将一个值转换成布尔值 -->
            <van-address-edit
            :area-list="areaList"
            show-postal
            :show-delete="!!aid"
            show-set-default
            show-search-result
            :detail-maxlength="30"
            :area-columns-placeholder="['请选择', '请选择', '请选择']"
            @save="onSave"
            @delete="onDelete"
            :address-info="originAddressInfo"
            />
        </Bg>
    </div>
</template>

<script>
import Bg from '../components/Bg';

import areaList from '../assets/js/area';

    export default {
        name: 'Address',

        data () {
            return {
                // 省市区数据
                areaList,

                // 编辑地址的aid
                aid: '',

                // 编辑地址初始值
                originAddressInfo: {}
            }
        },

        components: {
            Bg
        },

        created () {
            // 截取路由参数
            this.aid = this.$route.params.aid;
            console.log('this.aid ==> ', this.aid);

            // 根据 aid 获取地址数据
            if (this.aid) {
                this.getAddressDataByAid();
            }
        },

        methods: {
            // 返回
            back() {
                this.$router.go(-1);
            },

            // 保存地址
            onSave(value) {

                if (this.aid) {
                    // 编辑地址
                    this.edit(value);
                } else {
                    // 新增地址
                    this.add(value);
                }
            },

            // 根据 aid 获取地址数据
            getAddressDataByAid() {
                // 查询地址数据
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
                    url: this.baseUrl + '/findAddressByAid',
                    // 如果是GET请求, 参数需要挂载到params
                    params: {
                        appkey: this.appkey,
                        tokenString,
                        aid: this.aid
                    }
                }).then(res => { // 成功
                    // console.log('成功res 根据 aid 获取地址数据 ==> ', res);
                    this.$toast.clear();

                    if (res.data.code === 700) {    // 没有登录
                        this.$toast({
                            message: res.data.msg,
                            forbidClick: true,
                            duration: 3000,
                        });

                        // 跳转到登录页面
                        return this.$router.push({name: 'Login'});

                    } else if (res.data.code === 40000) { // 查询地址成功
                        let data = res.data.result[0];
                        data.isDefault = !!data.isDefault

                        this.originAddressInfo = data;
                        // console.log('this.originAddressInfo ==> ', this.originAddressInfo);
                    }
                }).catch(err => {   // 失败
                    console.log('失败err ==> ', err);
                });
            },

            // 删除
            onDelete(value) {

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
                    url: this.baseUrl + '/deleteAddress',
                    // 如果是POST请求, 参数需要挂载到data
                    data: {
                        tokenString,
                        appkey: this.appkey,
                        aid: value.aid
                    }
                }).then(res => { // 成功
                    // console.log('成功res 删除 ==> ', res);
                    this.$toast.clear();

                    if (res.data.code === 700) {    // 没有登录

                        // 跳转到登录页面
                        return this.$router.push({name: 'Login'});

                    } else if (res.data.code === 10000) { // 新增地址成功
                        // 如果添加地址成功就跳转到地址列表
                        this.$router.push({name: 'AddressList'});

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

            // 新增地址
            add(value) {
                // 获取 cookies 里面的 tokenString值
                let tokenString = this.$cookies.get('tokenString');
                // console.log('tokenString ==> ', tokenString);

                // 判断有没有登录
                if (!tokenString) {
                    console.log('浏览器tokenString不存在');
                    return this.$router.push({name: 'Login'});
                }

                let data = {
                    ...value,
                    tokenString,
                    appkey: this.appkey
                };  // 复制value
                data.isDefault = Number(value.isDefault);  // 把布尔转数字
                delete data.country;    // 删除对象属性
                // console.log('data ==> ', data);


                // 加载图标
                this.$toast.loading({
                    message: '加载中...',
                    forbidClick: true,
                    duration: 0,
                });

                this.axios({
                    // 请求方式
                    method: 'POST',
                    url: this.baseUrl + '/addAddress',
                    // 如果是POST请求, 参数需要挂载到data
                    data
                }).then(res => { // 成功
                    // console.log('成功res 保存地址 ==> ', res);
                    this.$toast.clear();

                    if (res.data.code === 700) {    // 没有登录
                        // 跳转到登录页面
                        return this.$router.push({name: 'Login'});

                    } else if (res.data.code === 9000) { // 新增地址成功
                        // 如果添加地址成功就跳转到地址列表
                        this.$router.go(-1);

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

            // 编辑地址
            edit(value) {

                let isEdit = true;

                for (let key in this.originAddressInfo) {
                    if (this.originAddressInfo[key] !== value[key]) {
                        // 只要有一个数据不同,则表明用户已经需改数据
                        isEdit = true;
                        break;
                    }
                }

                if (isEdit) {
                    // 发起编辑地址请求
                    // console.log('发起编辑地址请求');

                    // 获取 cookies 里面的 tokenString值
                    let tokenString = this.$cookies.get('tokenString');
                    // console.log('tokenString ==> ', tokenString);

                    // 判断有没有登录
                    if (!tokenString) {
                        console.log('浏览器tokenString不存在');
                        return this.$router.push({name: 'Login'});
                    }

                    // 复制value数据
                    let address = {};
                    address.aid = this.aid;
                    address.name = value.name;
                    address.tel = value.tel;
                    address.province = value.province;
                    address.city = value.city;
                    address.county = value.county;
                    address.addressDetail = value.addressDetail;
                    address.areaCode = value.areaCode;
                    address.postaode = value.postaode;
                    address.isDefault = Number(value.isDefault);
                    // console.log('address ==> ', address);

                    // 加载图标
                    this.$toast.loading({
                        message: '加载中...',
                        forbidClick: true,
                        duration: 0,
                    });

                    this.axios({
                        // 请求方式
                        method: 'POST',
                        url: this.baseUrl + '/editAddress',
                        // 如果是POST请求, 参数需要挂载到data
                        data: {
                            tokenString,
                            appkey: this.appkey,
                            ...address
                        }
                    }).then(res => { // 成功
                        // console.log('成功res 编辑地址 ==> ', res);
                        this.$toast.clear();

                        if (res.data.code === 700) {    // 没有登录

                            // 跳转到登录页面
                            return this.$router.push({name: 'Login'});

                        } else if (res.data.code === 30000) { // 编辑地址成功
                            // 如果编辑地址成功就跳转到地址列表
                            this.$router.push({name: 'AddressList'});

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

                } else {
                    this.$router.push({name: 'AddressList'});
                }
            }
        }
    }
</script>

<style lang="less" scoped>

@import '../assets/less/address.less';

</style>