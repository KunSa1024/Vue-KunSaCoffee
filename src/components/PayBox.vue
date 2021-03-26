<template>
    <div class="payBoxing">
        <div>
            <slot name="pay-title">
                <div class="pay-title">订单信息</div>
            </slot>
        </div>

        <div class="pay-middle">
            <slot name="order-item"></slot>
        </div>

        <div class="pay-foot">

            <div class="pay-line">
                <div class="pay-left"></div>
                <div class="pey-right"></div>
            </div>

            <div class="foot-info">
                <div class="order-time" v-if="proInfo.date">{{ proInfo.date | formatDate('yyyy-MM-dd hh:mm:ss') }}</div>
                <div class="inTotal">
                    <div class="number">共计 {{ proInfo.count }} 件</div>
                    <div class="total-price">合计 &yen;{{ proInfo.total }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

    export default {
        name: 'PayBox',
        props: {
            proInfo: {
                type: Object,
                default() {
                    return {
                        count: 0,
                        total: 0,
                        date: ''
                    };
                }
            },
        }
    }
</script>

<style lang="less" scoped>
@import '../assets/less/payBox.less';
</style>