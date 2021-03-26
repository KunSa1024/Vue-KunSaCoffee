<template>
    <div class="addressList">
        <van-nav-bar
        title="地址列表"
        left-text="返回"
        left-arrow
        @click-left="back"
        />

        <Bg>
            <van-address-list
            :list="list"
            default-tag-text="默认"
            @add="onAdd"
            @edit="onEdit"
            :switchable="false"
            />
        </Bg>

        
    </div>
</template>

<script>
import Bg from '../components/Bg';

    export default {
        name: 'AddressList',

        components: {
            Bg
        },

        data() {
            return {
                chosenAddressId: '1',

                // 地址列表数据
                list: []
            };
        },

        created () {
            // 查询用户地址列表
            this.getAddressListData();
        },

        methods: {
            // 返回
            back() {
                this.$router.push({name: 'My'});
            },

            // 跳转到新增地址
            onAdd() {
                this.$router.push({name: 'Address'});
            },

            // 编辑
            onEdit({aid}) { // {aid} => 解构对象获取 aid
                this.$router.push({name: 'Address', params: {aid}});
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
                        })
                        this.list = res.data.result;

                        // console.log('this.list => ', this.list);
                    }
                }).catch(err => {   // 失败
                    console.log('失败err ==> ', err);
                });
            }

        }
    }
</script>

<style lang="less" scoped>
@import '../assets/less/addressList.less';

</style>