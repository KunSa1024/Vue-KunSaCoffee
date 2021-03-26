<template>
    <div class="rx-nav">
        <van-nav-bar left-arrow>
            <!-- v-slot 可以写成 # -->
            <template #left>
                <div class="left-title">
                    <div class="logo">
                        <img class="auto-img" src="../assets/images/login_img/logo.png" alt="">
                    </div>
                    <div class="logo-title">KunSa Coffee</div>
                </div>
            </template>

            <template #right>
                <div class="right-title" @click="goPage">
                    先逛一逛
                </div>
            </template>
        </van-nav-bar>
    </div>
</template>

<script>


    export default {
        name: 'RXnav',
        methods: {
            // 跳转到首页
            goPage() {
                this.$router.push({name: 'Home'});
            }
        }
    }
</script>

<style lang="less" scoped>
@import '../assets/less/rxnav.less';
</style>
