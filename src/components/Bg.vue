<template>
    <div class="bg">
        <div class="bg-box"></div>
        <div class="bg-content">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Bg"
    }
</script>

<style lang="less" scoped>
@import '../assets/less/bg.less';

</style>