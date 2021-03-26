<template>
  <div id="app">
    <!-- 一级路由插座 -->
    <router-view></router-view>
  </div>
</template>

<style lang="less">
// 公共样式
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  margin: 0 auto;
  color: #333;
  background-color: #fbedcf;
}

// 图片大小 100%
.auto-img {
  width: 100%;
  display: block;
}

// 多出截断用'...'表示
.one-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

</style>
