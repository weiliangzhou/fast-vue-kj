// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import { InfiniteScroll } from 'mint-ui'
import 'lib-flexible'
// import fastclick from 'fastclick'
import { shouldLoginMixin } from "./mixins"
import store from './store/index'
import './filters'
import './directives'
import 'mint-ui/lib/style.css'
import './assets/style/cover-style.css'
import './assets/style/animate.css'
import { DatetimePlugin, ConfirmPlugin } from 'vux'
import router from './router'
import promise from 'es6-promise';
import "./registerServiceWorker"
import "./components"
promise.polyfill()
Vue.use(ConfirmPlugin)
Vue.use(DatetimePlugin)
Vue.use(InfiniteScroll)
// Vue.use(MintUI)
Vue.mixin(shouldLoginMixin) // 混入微信config注册与微信分享初始化
Vue.use(Vuex)
Vue.config.productionTip = false
// fastclick.attach(document.body) // 防止用户在手机端的点击穿透
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  // template: '<App/>',
  render (h) {
    return h(App)
  }
})

if (process.env.NODE_ENV !== "production") {
  /* eslint-disable no-new */
  Promise.resolve("ok").then(() => require("vconsole")).then(VConsole => new VConsole())
}
// test
 // localStorage["userInfo"] = '{"userRoles":[{"uid":15373,"roleId":2,"roleName":"vip","mid":1},{"uid":15373,"roleId":200,"roleName":"agency","mid":1},{"uid":15373,"roleId":1,"roleName":"user","mid":1}],"createdAt":"2019-02-18 16:03:28","uid":15373,"mid":1,"expiresAt":"2019-03-13 15:53:09","refreshToken":"5kk4wwiarp47eg4k6bwzfrdyo62fy1oe","token":"fzs25oxpskav2tijzg2gfh898gshs7q2","updatedAt":"2019-03-12 15:53:09","gender":2,"nickname":"销讲运营中心小镇","cellphone":"18606553573","avatar":"https://img.mall.xc2018.com.cn/mall/upload/20190513/140756_99_gxee.png","username":"X15373","idCardNum":"340322198705186028","levelName":"小镇"}'

// online
// localStorage["userInfo"] = '{"userRoles":[{"uid":2,"roleId":1000,"roleName":"admin","mid":1},{"uid":2,"roleId":1,"roleName":"user","mid":1}],"createdAt":"2018-12-14 21:32:49","uid":2,"mid":1,"expiresAt":"2019-03-15 17:17:05","refreshToken":"6j73mbv7m797rj8gls568p06c4yhtnq9","token":"oa4u0nxfdeiegmladolgcnglj6ga4tec","updatedAt":"2019-03-14 17:17:05","gender":1,"nickname":"总部微谷小镇","cellphone":"18966053447","avatar":"https://chuang-saas.oss-cn-hangzhou.aliyuncs.com/linshi/ee1.pic.jpg","username":"X0002","idCardNum":"330600199202122904","levelName":"小镇"}'
// {"userRoles":[{"uid":582,"roleId":200,"roleName":"agency","mid":1},{"uid":582,"roleId":1,"roleName":"user","mid":1}],"createdAt":"2019-01-02 17:45:21","uid":582,"mid":1,"expiresAt":"2019-04-23 17:11:26","refreshToken":"3o8khu8x1c8ctff6h72aihngsgjna0m9","token":"2wbcirwb0ym8av3tllmq6bpgujz0no9m","updatedAt":"2019-04-22 17:11:26","gender":2,"nickname":"余启航","cellphone":"15858991927","avatar":"http://thirdwx.qlogo.cn/mmopen/vi_32/wkyK9eP565NaoVQIx1W8RYSvBxD00jcyFYq3MCk2QU1fbPe64NeiaGcfu5Ou67jwWOTn1BZXQZGxYove8exTmhg/132","vipLevels":[100,110,1],"username":"X0582","idCardNum":"330127199707145311","levelName":"教练"}
