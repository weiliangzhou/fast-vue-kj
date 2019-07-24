<template>
  <div id="app">
    <transition name="router-fade" mode="out-in">
      <keep-alive>
          <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
    </transition>
    <transition name="router-fade" mode="out-in">
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  name: "App",
  methods: {},
  computed: {}
}
</script>

<style lang="less">
html {
  min-height: 100%;
  background: #fff;
  // -webkit-user-select:none;
  //   -moz-user-select:none;
  //   -ms-user-select:none;
  //   user-select:none;
}
* {
  margin: 0;
  padding: 0;
  font-family: "PingFang SC", "Helvetica Neue", "STHeiti", "Microsoft Yahei",
    "微软雅黑", "Tahoma", "Simsun", "sans-serif";
  -webkit-text-size-adjust: none;
}
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100vw;
  min-height: 100vh;
  box-sizing: border-box;
  margin: 0 auto;
//   display: flex;
//   flex-direction: column;
  // overflow: hidden;
  // overflow-y: scroll;
  font-family: "Helvetica Neue", Helvetica, Arial, "PingFang SC",
    "Hiragino Sans GB", "Heiti SC", "Microsoft YaHei", "WenQuanYi Micro Hei",
    sans-serif;
}
ul,
li {
  list-style: none; /* 去掉ul前面的符号 */
}
video {
  width: 100%;
}
.box img {
  width: 100%;
  display: block;
}
.richText {
  // 富文本样式
  p,
  img {
    display: block;
    width: 100%;
  }
}
.hide {
  display: none !important;
}
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
}
.ellipsis_1 {
  .ellipsis;
  white-space: nowrap;
  -webkit-line-clamp: 1;
  display: inline-block;
}

.ellipsis_2 {
  .ellipsis;
  -webkit-line-clamp: 2;
  word-break: break-all;
}

.ellipsis_3 {
  .ellipsis;
  -webkit-line-clamp: 3;
  word-break: break-all;
}

// .router-fade-enter-active,
// .router-fade-leave-active {
//   transition: opacity 0.3s;
// }
// .router-fade-enter,
// .router-fade-leave-active {
//   opacity: 0;
// }

// label > * { pointer-events: none; }
</style>
