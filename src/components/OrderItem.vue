<template>
    <div class="orderItem">
        <div class="img-box">
            <img class="auto-img" :src="product.small_img" alt="">
        </div>
        <div class="content-box">
            <div class="title-box">
                <div class="chname">{{ product.name }}</div>
                <div class="specifications">{{ product.rule }}</div>
            </div>
            <div class="enname">{{ product.enname }}</div>
            <div class="price-box">
                <div class="price">&yen;{{ product.price }}</div>
                <div class="number">x{{ product.count }}</div>
            </div>
        </div>
    </div>
</template>

<script>

    export default {
        name: 'OrderItem',
        props: {
            product: {
                type: Object,
                // 当props的属性为引用类型数据, 每日值必须使用default函数返回
                default() {
                    return {};
                }
            }
        }

    }
</script>

<style lang="less" scoped>
@import '../assets/less/orderItem.less';

</style>