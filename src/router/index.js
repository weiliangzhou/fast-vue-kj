import Vue from 'vue'
import Router from 'vue-router'
import freedrbRouter from './freedrb-router'
import ly from './ly-router'
import yf from './yf-router'
import { checkIsActive, refreshToken } from '@/api'
import { getUserInfo, setUserInfo } from '@/global';
Vue.use(Router)
const router = new Router({
    mode: "history",
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            // if (from.meta.keepAlive) {
            //     from.meta.savedPosition = document.body.scrollTop; // document.documentElement.scrollTop + document.body.scrollTop
            // }
            // return new Promise((resolve, reject) => {
            //     setTimeout(() => resolve({ x: 0, y: to.meta.savedPosition || 0 }), 300)
            // })
            return new Promise((resolve, reject) => {
                setTimeout(() => resolve({ x: 0, y: 0 }), 200)
            })
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
        },
    ]
})
router.beforeEach((to, from, next) => {
    if (["login", "perfect-userInfo", "logout"].includes(to.name)||(true)) {
        next()
    } else {
       Promise.resolve().then(() => {
           if (from.name == "login") {
               return "ok"
           } else {
               return refreshToken()
           }
       })
       .then(res => {
           if (getUserInfo().isActive) {
            checkIsActive()
            throw new Error("本地的缓存已经激活过了")
           } else {
            return checkIsActive().then(res => {
                let { isActive } = res;
                setUserInfo({isActive})
                return res
            })
           }
        })
       .then(res => {
            if (!res.isActive) {
                next({name: "perfect-userInfo", replace: true})
            } else {
                throw new Error("请完善信息")
            }
        }).catch(err => {
            next()
        })
    }
})
router.afterEach((to) => {
    let {
        meta: {
            title = ""
        } = {}
    } = to;
    if (title) {
        document.title = title
    }
})
let isRefresh = sessionStorage.getItem("isRefresh");
window.isRefresh = isRefresh
router.onReady(() => {
    if (process.env.NODE_ENV == "production" && !isRefresh) {
        (function() {
        var hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?919bee0b8043447f1e2dca1cdf7ab0c4";
        var s = document.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(hm, s);
        sessionStorage.setItem("isRefresh", 1)
        })();
    }
    window.isRefresh = false;
})
export default router
