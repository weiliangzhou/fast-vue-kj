import Vue from "vue";
import Router from "vue-router";
import freedrbRouter from "./freedrb-router";
import ly from "./ly-router";
import yf from "./yf-router";
import { checkIsActive, refreshToken, login } from "@/api";
import {
  getUserInfo,
  setUserInfo,
  AuthorizationToLogin,
  checkIsLogined
} from "@/global";
Vue.use(Router);
const router = new Router({
  mode: "history",
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      // if (from.meta.keepAlive) {
      //     from.meta.savedPosition = document.body.scrollTop; // document.documentElement.scrollTop + document.body.scrollTop
      // }
      // return new Promise((resolve, reject) => {
      //     setTimeout(() => resolve({ x: 0, y: to.meta.savedPosition || 0 }), 300)
      // })
      return new Promise((resolve, reject) => {
        setTimeout(() => resolve({ x: 0, y: 0 }), 200);
      });
    }
  },
  // base: process.env.NODE_ENV === 'developmentTest' ? '/devtest81/' : __dirname,
  base: __dirname,
  routes: [
    ...freedrbRouter,
    ...ly,
    ...yf,
    // {
    //     /**
    //      *    courseId 套课id
    //      *
    //      */
    //     path: "/home",
    //     name: "home",
    //     meta: {
    //         keepAlive: true,
    //         title: "首页",
    //         shareInfo: {}
    //     },
    //     component: () =>
    //         import("@/pages/home/home")
    // },
    {
      path: "*",
      redirect: "/home",
      meta: {
        keepAlive: true,
        title: ""
      }
    }
  ]
});
router.beforeEach((to, from, next) => {
  let { code, referUid } = to.query;
  //code = '001aDVFJ1LG8s40XG3IJ1DdOFJ1aDVFO'
  const isLogined = checkIsLogined();
  if (isLogined) {
    next();
  } else if (!isLogined && code) {
    login({ code: code, referUid })
      .then(({ token, userBase = {} }) => {
        setUserInfo({ token, ...userBase });
        next();
      })
      .catch(err => {
        // AuthorizationToLogin()
      });
  } else {
    AuthorizationToLogin();
  }
});
router.afterEach(to => {
  let { meta: { title = "" } = {} } = to;
  if (title) {
    document.title = title;
  }
});
let isRefresh = sessionStorage.getItem("isRefresh") || true;
window.isRefresh = true;
router.onReady(() => {
  if (process.env.NODE_ENV == "production" && !isRefresh) {
    (function() {
      var hm = document.createElement("script");
      hm.src = "https://hm.baidu.com/hm.js?919bee0b8043447f1e2dca1cdf7ab0c4";
      var s = document.getElementsByTagName("script")[0];
      s.parentNode.insertBefore(hm, s);
      sessionStorage.setItem("isRefresh", 1);
    })();
  }
  window.isRefresh = false;
});
export default router;
