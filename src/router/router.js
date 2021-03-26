// Main组件的二级路由
const MainRouets = [{
        path: '/home',
        alias: '/',
        name: 'Home',
        component: () =>
            import ('../views/Home.vue')
    },
    {
        path: '/menu',
        name: 'Menu',
        component: () =>
            import ('../views/Menu.vue')
    },
    {
        path: '/shopbag',
        name: 'Shopbag',
        component: () =>
            import ('../views/Shopbag.vue')
    },
    {
        path: '/my',
        name: 'My',
        component: () =>
            import ('../views/My.vue')
    },
]

// 导出路由
export const routes = [{
    path: '/',
    name: 'Main',
    component: () =>
        import ('../views/Main.vue'),
    // 二级路由
    children: MainRouets
}, {
    path: '/login',
    name: 'Login',
    component: () =>
        import ('../views/Login.vue')
}, {
    path: '/detail/:pid',
    name: 'Detail',
    component: () =>
        import ('../views/Detail.vue')
}, {
    path: '/addressList',
    name: 'AddressList',
    component: () =>
        import ('../views/AddressList.vue')
}, {
    path: '/address/:aid?', // ? => 问号表示参数可有可无
    name: 'Address',
    component: () =>
        import ('../views/Address.vue')
}, {
    path: '/pay',
    name: 'Pay',
    component: () =>
        import ('../views/Pay.vue')
}, {
    path: '/order',
    name: 'Order',
    component: () =>
        import ('../views/Order.vue')
}, {
    path: '/personalData',
    name: 'PersonalData',
    component: () =>
        import ('../views/PersonalData.vue')
}, {
    path: '/collection',
    name: 'Collection',
    component: () =>
        import ('../views/Collection.vue')
}, {
    path: '/securityCenter',
    name: 'SecurityCenter',
    component: () =>
        import ('../views/SecurityCenter.vue')
}, {
    path: '/search',
    name: 'Search',
    component: () =>
        import ('../views/Search.vue')
} ]