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
import store from "./store/index";
import "./filters";
import "./directives";
import "mint-ui/lib/style.css";
import "./assets/style/cover-style.css";
import "./assets/style/animate.css";
import router from "./router";
import promise from "es6-promise";
import "./registerServiceWorker";
import "./components";
import Qrcode from "vux/src/components/qrcode";
promise.polyfill();
Vue.use(InfiniteScroll);
// Vue.use(MintUI)
// Vue.mixin(shouldLoginMixin) // 混入微信config注册与微信分享初始化
Vue.mixin(shareMixin);
Vue.use(Vuex);
Vue.config.productionTip = false;
Vue.component(Qrcode.name, Qrcode);
// fastclick.attach(document.body) // 防止用户在手机端的点击穿透
/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  store,
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
