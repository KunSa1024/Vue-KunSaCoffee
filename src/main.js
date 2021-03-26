import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 导入 将px转rem文件
import 'lib-flexible/flexible'

// 导入 axios
import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios);

// 导入 vue-cookies
import VueCookies from 'vue-cookies'
Vue.use(VueCookies)



/**
 * NavBar: 导航栏
 * Field: 输入框
 * Button: 按钮
 * Popup: 弹出层
 * Toast: 轻加载
 * Tabbar, TabbarItem: 标签栏
 * Search: 搜索
 * Swipe, SwipeItem: 轮播图
 * Stepper: 步进器
 * GoodsAction, GoodsActionIcon, GoodsActionButton: 商品导航
 * Checkbox, CheckboxGroup: 复选框
 * SubmitBar: 提交订单栏
 * List: 列表
 * Empty: 空状态
 * AddressList: 地址列表
 * AddressEdit: 地址编辑
 * Icon: 图标
 * Tab, Tabs: 标签页
 * Uploader: 文件上传
 * Cell, CellGroup: 单元格
 */
// 导入vant组件
import {
    NavBar,
    Field,
    Button,
    Popup,
    Toast,
    Tabbar,
    TabbarItem,
    Search,
    Swipe,
    SwipeItem,
    Stepper,
    GoodsAction,
    GoodsActionIcon,
    GoodsActionButton,
    Checkbox,
    CheckboxGroup,
    SwipeCell,
    SubmitBar,
    List,
    Empty,
    AddressList,
    AddressEdit,
    Icon,
    Tab,
    Tabs,
    Uploader,
    Cell,
    CellGroup
} from 'vant';
// import { config } from 'vue/types/umd'

// 注册vant组件
Vue.use(NavBar)
    .use(Field)
    .use(Button)
    .use(Popup)
    .use(Toast)
    .use(Tabbar)
    .use(TabbarItem)
    .use(Search)
    .use(Swipe)
    .use(SwipeItem)
    .use(Stepper)
    .use(GoodsAction)
    .use(GoodsActionIcon)
    .use(GoodsActionButton)
    .use(Checkbox)
    .use(CheckboxGroup)
    .use(SwipeCell)
    .use(SubmitBar)
    .use(List)
    .use(Empty)
    .use(AddressList)
    .use(AddressEdit)
    .use(Icon)
    .use(Tab)
    .use(Tabs)
    .use(Uploader)
    .use(Cell)
    .use(CellGroup)

// 请求之前执行, 请求拦截器
axios.interceptors.request.use(config => {
    // console.log('config ==> ', config);

    // 判断请求方式是否等于 post
    if (config.method === 'post') {
        // console.log('修改前:config.data ==> ', config.data);
        // 序列化post请求参数
        let paramsString = '';
        for (let key in config.data) {
            paramsString += `${key}=${config.data[key]}&`;
        }

        config.data = paramsString.slice(0, -1);
        // console.log('需改后:config.data ==> ', config.data)
    }
    // 必须返回config
    return config;
})

Vue.config.productionTip = false;

// 将请求路径和appkey存放在原型属性里面
Vue.prototype.baseUrl = 'http://www.kangliuyong.com:10002';
Vue.prototype.appkey = 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=';


// 定义全局过滤器
Vue.filter('formatDate', (data, format) => {
    // data: 需要进行格式化的数据
    // format: 格式
    // console.log('data ==>', data);
    // console.log('format ==>', format);

    let date = new Date(data);

    // 获取年份
    let year = date.getFullYear().toString();

    if (/(y+)/.test(format)) {
        // 获取匹配组的内容
        let yearContent = RegExp.$1;

        format = format.replace(yearContent, year.slice(year.length - yearContent.length));
    }

    // 替换月日时分秒
    let dateObject = {
        M: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        m: date.getMinutes(),
        s: date.getSeconds()
    }

    for (let key in dateObject) {
        // 生成动态正则表达式
        let reg = new RegExp(`(${key}+)`);

        if (reg.test(format)) {
            // 获取匹配组的内容
            let content = RegExp.$1;

            format = format.replace(content, dateObject[key] >= 10 ? dateObject[key] : content.length === 2 ? '0' + dateObject[key] : dateObject[key]);
        }
    }

    return format;
})


new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')