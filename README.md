#   笔记

```txt
安装cnpm
npm install -g cnpm

查看镜像地址
npm get registry

切换淘宝镜像
npm config set registry http://registry.npm.taobao.org/

切换npm镜像
npm config set registry https://registry.npmjs.org/
```


```txt
项目结构

    node_modules: 第三方模块目录

    public: 公共资源
        |- index.html 宿主页面
        |- favicon.ico 浏览器标签图标

    src: 开发目录
        |- assets: 静态资源(css, js, image, fonts, audio, video...)
        |- components: 非配置路由组件(公共组件)
        |- router: 路由目录
        |- store: vuex目录
        |- views: 路由配置的组件
        |- App.vue: 根组件
        |- main.js: 入口文件
```


```txt
1. 安装vant

    npm i vant --save
    --save 简写 -S
    --save-dev 简写 -D

2. 配置按需导入vant组件
安装 babel-plugin-import插件
    npm i babel-plugin-import -D

3. 配置px转rem
安装 postcss-pxtorem插件
安装 lib-flexible插件
    npm i postcss-pxtorem lib-flexible -D

4. 在项目根目录创建 postcss.config.js文件
    echo test>postcss.config.js
写入一下代码:
    module.exports = {
    plugins: {
        autoprefixer: {
        browsers: ['Android >= 4.0', 'iOS >= 8'],
        },
        'postcss-pxtorem': {
        rootValue: 37.5,
        propList: ['*'],
        },
    },
    };
```


```txt
VSCode 快速生成vue组件插件
Vue VSCode Snippets
代码:
    vBase
```


```txt
插槽简写
    v-slot:插槽名="插槽作用域变量名称(没有可以不写)"

    简写:
        #插槽名="插槽作用域变量名称(没有可以不写)"

没有插槽作用域变量名称写法:
    v-slot:插槽名
    简写:
        #插槽名
```


```txt
主题色
#0c34ba
```


```txt
/deep/ 极限修改样式
```


```txt
安装axios
npm i axios --save

main.js:
    // 导入 axios
    import axios from 'axios';
    import VueAxios from 'vue-axios';
    Vue.use(VueAxios, axios);
```


```txt
安装vue-cookies
npm install vue-cookies --save

main.js:
    import VueCookies from 'vue-cookies'
    Vue.use(VueCookies)
```