import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// 修改state唯一途径,通过mutations

export default new Vuex.Store({
    state: {
        // 购物袋数量
        shopbagCount: 0,

        // 是否加载购物袋数量
        isLoadShopBagCount: false,
    },

    mutations: {
        changeShopbagCount(state, data) {
            // state: vuex状态(state对象)
            // data: 载荷(传递过来的参数)
            // console.log('state ==> ', state);
            // console.log('data ==> ', data);

            state.shopbagCount = data;
            console.log('state.shopbagCount => ', state.shopbagCount)
        },

        changIsLoadShopBagCount(state, data) {
            state.isLoadShopBagCount = data;
            console.log('修改成功');
        }
    }
})