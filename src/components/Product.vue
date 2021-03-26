<template>
    <div class="prduct">
        <div class="img-box" @click="goDetail(product.pid)">
            <img class="auto-img" :src="product.smallImg" alt="">
            <slot name="hot"></slot>
        </div>
        <div class="pro-info">
            <div class="pro-name one-text">{{ product.name }}</div>
            <div class="pro-enname one-text">{{ product.enname }}</div>
            <div class="pro-price">
                <div class="price">&yen;{{ product.price }}</div>
                <div class="delete-cion">
                    <slot name="delete"></slot>
                </div>
            </div>
        </div>
    </div>
</template>

<script>


    export default {
        name: 'Product',
        props: {
            product: {
                type: Object,
                default() {
                    return {};
                }
            }
        },
        methods: {
            // 跳转到产品详情页面
            goDetail(pid) {
                this.$router.push({name: 'Detail', params: {pid}});
            }
        }
    }
</script>

<style lang="less" scoped>
@import '../assets/less/prduct.less';
</style>