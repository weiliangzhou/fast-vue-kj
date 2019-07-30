// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import Vuex from "vuex";
import App from "./App";
import { InfiniteScroll } from "mint-ui";
import { shareMixin } from "./global/utils/wxShare";
import "lib-flexible";
// import fastclick from 'fastclick'
import { shouldLoginMixin } from "./mixins";
import "mint-ui/lib/style.css";
import "./assets/style/cover-style.css";
import "./assets/style/animate.css";
import router from "./router";
import promise from "es6-promise";
import "./registerServiceWorker";
import "./components";
import "./iconfont";
import { Progress } from 'mint-ui';
import '../static/css/mint-ui.scss'
promise.polyfill();
Vue.use(InfiniteScroll);
Vue.component(Progress.name, Progress);
Vue.mixin(shouldLoginMixin); // 混入微信config注册与微信分享初始化
Vue.mixin(shareMixin);
Vue.use(Vuex);
Vue.config.productionTip = false;
// fastclick.attach(document.body) // 防止用户在手机端的点击穿透
// localStorage.userInfo = JSON.stringify({
//   token: "01f74d291940425095cfe01820aa1757",
//   id: 64,
//   outOpenId: "684a2f83b29f45e0b777a196003754f8",
//   headImgUrl:
//     "http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLCicuzbbgGgEnXCXJAXjibMicXicd7jrfbwibzgbKpkeTllPXqPXPM282pSyuhkPicnawicDloLHiagz6Mag/132",
//   nickName: "爱在浪里",
//   registerFrom: 1,
//   createTime: "2019-07-25 11:46:23",
//   updateTime: "2019-07-25 11:46:23",
//   sex: 1
// });
/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  components: { App },
  // template: '<App/>',
  render(h) {
    return h(App);
  }
});

if (process.env.NODE_ENV !== "production") {
  /* eslint-disable no-new */
  Promise.resolve(require("vconsole")).then(VConsole => new VConsole());
}
// localStorage.userInfo=JSON.stringify({
//     id:58,
//     token:"4d13fbc5df4c4e149b4c6cdead106604"
// })
