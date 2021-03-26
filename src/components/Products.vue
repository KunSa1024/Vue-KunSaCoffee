<template>
    <div class="products">
        <slot name="title">
        </slot>


        <div
        class="product"
        v-for="(items, indexs) in ProductData"
        :key="indexs"
        @click="viewProduct(items.pid)"
        >
            <div class="img">
                <img class="auto-img" :src="items.smallImg" alt="">
            </div>
            <div class="title-box">
                <div class="title">
                    <div class="name">{{ items.name }}</div>
                    <div class="enname">{{ items.enname }}</div>
                </div>
                <div class="price">&yen;{{ items.price }}</div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'Products',

        props: ['ProductData'],

    methods: {
        // 查看商品详情
        viewProduct(pid) {
            this.$router.push({name: 'Detail', params: {pid}});
        },
    }
    }
</script>

<style lang="less" scoped>
@import '../assets/less/products.less';
</style>