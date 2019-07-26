import wx from 'weixin-js-sdk'
import { checkIsLogined } from "../global/utils/localUser"

export const shouldLoginMixin = {
//   beforeRouteEnter(to, from, next) {
//     if (!checkIsLogined() && ["login"].indexOf(to.name) === -1) {
//       // AuthorizationToLogin()
//       next({name: "login"})
//     } else {
//       next((vm) => {
//         wx.hideOptionMenu()
//         vm.routerFrom = from.name
//         vm.currentRouteName = to.name
//       })
//     }
//   },
//   beforeRouteLeave (to, from, next) {
//   // document.documentElement.scrollTop
//   from.meta.savedPosition = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop || 0;
//   next()
// },
// mounted() {
//   this.isMounted = true;
//   setTimeout(() => { this.isMounted = false }, 0)
// },
  methods: {
    pushRoute(route) {
      if (typeof route == "string") {
        this.$router.push({name: route})
      } else {
        this.$router.push(route)
      }
    },
    triggerSomeDomRerender(dom) {
      if (dom && dom.style) {
        let temp = dom.style.bottom
       dom.style.bottom = "1px"
       dom.style.bottom = temp
      }
    },
    backAction() {
      this.$router.go(-1)
    },
    changeHref(url) {
      if (url&&/(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-.,@?^=%&:/~+#]*[\w\-@?^=%&/~+#])?/.test(url)) {
        location.href = url
      }
    },
    jumpMall(path) { // 跳到商城
      if (path.indexOf("http")===-1) {
        let origin = location.origin.indexOf("//sales") !== -1 ? "https://mall.xc2018.com.cn" : "http://tmall.xc2018.com.cn"
        window.location.href = path&&path[0]==='/'?`${origin}${path}` : `${origin}/${path}`;
      } else {
        window.location.href = path
      }
    },
    triggerScoll() {
      setTimeout(function() {
        var scrollHeight = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop || 0;
        window.scrollTo(0, Math.max(scrollHeight - 1, 0));
      }, 300);
    }
  }
}

export const selectAddressFixedMixin = {
  methods: {
    triggerSomeEleRerender() {
     let dd = document.getElementsByClassName('vux-popup-dialog')[0];
     if (dd && dd.style) {
      //  if (dd.style.zIndex) {
      //    dd.style.zIndex = ""
      //    dd.style.bottom = ""
      //  } else {
      //   dd.style.zIndex=502;
      //  }
       dd.style.bottom = "1px"
       dd.style.bottom = ""
     }
    }
  },

  // beforeRouteEnter (to, from, next) {

  // },
  // beforeRouteUpdate (to, from, next) {

  // },
}
/*
export const authorizeMixins = { // 身份验证
  beforeRouteEnter(to, from, next) {
    let {meta: { roles = [0] } = {}} = to;
    // role -1 没有登录用户， 0 未认证用户 ， 1 认证用户, 2 业务员， 3  工作人员
    let currentRole = localStorage.role || 0;
    if (roles.indexOf(currentRole)!==-1) {
      next()
    } else {
      // 没有访问权限
      next({name: "home", replace: true})
    }

    if (!localStorage["gm-token"] && ["login", "home"].indexOf(to.name) !== -1) {
      AuthorizationToLogin()
    } else {
      next()
    }
  }
}
*/
