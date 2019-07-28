// wxShareMixins.js
import wx from "weixin-js-sdk";
import config from "@/conf/config";
import { getWXConfig } from "@/api";
import { isWX, isIos } from "./tools";
import { getUserInfo } from "./localUser";
/**
 *
 * @param {title} shareData 分享内容的标题
 * @param {desc} shareData 分享内容的描述/副标题
 * @param {link} shareData 分享页面的链接
 * @param {imgUrl} shareData 分享卡片的小图片
 * @param {type} shareData 分享类型,music、video或link，不填默认为link
 * @param {success:(){}} shareData // 用户点击了分享后执行的回调函数
 * @param {cancel:(){}} shareData // 用户取消分享后执行的回调函数
 */
const wxShare = param => {
  let user = getUserInfo();
  let referUid = user.id;
  let {
    title = "免费真实挖矿",
    desc = "真实免费获取BTC，最高可获得0.1BTC",
    link = `${window.location.origin}/home?referUid=${referUid}`,
    type = "link",
    imgUrl = 'https://img.mall.xc2018.com.cn/mall/upload/20190728/220256_62_0gpf.jpg',
    success = () => {},
    cancel = () => {}
  } = param || {};
  let shareData = {
    title,
    desc,
    link,
    type,
    imgUrl,
    success,
    cancel
  };
  wx.showOptionMenu();
  // 获取“分享到朋友圈”按钮点击状态及自定义分享内容接口（即将废弃）
  wx.onMenuShareTimeline(shareData);
  // 获取“分享给朋友”按钮点击状态及自定义分享内容接口（即将废弃）
  wx.onMenuShareAppMessage(shareData);
  // 获取“分享到QQ”按钮点击状态及自定义分享内容接口（即将废弃）
  wx.onMenuShareQQ(shareData);
  // 获取“分享到QQ空间”按钮点击状态及自定义分享内容接口（即将废弃）
  wx.onMenuShareQZone(shareData);
};

/*
 * 首先将微信config需要的参数调用接口异步和注册异步，用一个Promise连起来，方便使用
 *
 */
const WXconfigPromise = () => {
  return new Promise((resolve, reject) => {
    getWXConfig(
      window.location.href.split("#")[0] // encodeURIComponent(window.location.href.split("#")[0])
    )
      .then(({ wxJsapiSignature = {}, jsApiList = [] }) => {
        wx.config({
          debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: wxJsapiSignature.appId || config.appId, // 必填，公众号的唯一标识
          timestamp: wxJsapiSignature.timestamp, // 必填，生成签名的时间戳
          nonceStr: wxJsapiSignature.nonceStr, // 必填，生成签名的随机串
          signature: wxJsapiSignature.signature, // 必填，签名
          jsApiList: jsApiList || [
            "onMenuShareTimeline",
            "onMenuShareAppMessage",
            "chooseWXPay"
          ] // 必填，需要使用的JS接口列表
        });
        wx.ready(() => {
          resolve("OK");
        });
        wx.error(res => {
          reject(res);
        });
      })
      .catch(rej => {
        reject(new Error("获取微信配置失败"));
      });
  });
};

/*
这个方法主要是为了优化ios的分享注册流程,　ios的单页应用就算是history 模式只需要注册一次，后面直接设置分享就好了，所以是用来缓存ios的注册结果
*/
export const getWXConfigPromise = (() => {
  let wxConfigTemp = null; // 用来保存ios　主要该注册异步处于pending的时候，返回之前pending中的Promise, 而不需要重复注册
  let wxConfigResult = null; //　由于ios只需要注册一次，所以这个是用来保存注册成功之后缓存成功的Promise
  return () => {
    if (isIos) {
      // 是ios
      if (wxConfigResult) {
        // 之前成功过了
        return wxConfigResult;
      } else if (wxConfigTemp) {
        // 之前处于pending, 直接返回上次pending的那个
        return wxConfigTemp;
      } else {
        // 否则重新创建并缓存在内存中（存在变量里）
        wxConfigTemp = WXconfigPromise()
          .then(res => {
            wxConfigResult = Promise.resolve(res); // 缓存结果
            wxConfigTemp = null; // 成功清空零时的变量，下次直接用 resolve的结果
            return res;
          })
          .catch(err => {
            wxConfigTemp = null; // 失败了，清空变量，下次好再次重新创建
            throw err; //对于失败的清空只是为了清空wxConfigTemp变量，错误还是要往后抛
          });
        return wxConfigTemp; // 创建完之后直接返回刚才创建的Promise
      }
    } else {
      //　安卓就不在做这种了　因为history模式　router一变　它就需要重新注册， hash模式可以不用重新注册
      return WXconfigPromise();
    }
  };
})();

/*
  自定义分享的统一处理
*/
export const shareMixin = {
  methods: {
    // 混入几个跟分享相关的方法
    // 分享函数， to --> 进来的路由信息对象，from ---> 目标路由信息对象(当前页面路由) ,
    // 若有些页面 如子路由的父路由无需分享时，在那个页面的methods里写个 shareMixin来覆盖当前的函数混入，vm为当前页面组件的实例
    // 可以往vm上挂一个key为shareDataPromise的Promise（也就是可以将异步获取的信息）　会优先取这个，　没有的话会到当前路由对象的shareInfo上找
    shareMixin(to, from, vm) {
      // 自定义分享信息函数，需要从router里设置的对象(写在router/index.js里)，对象说明如下
      /* 路由对象item项说明
        {
          path: "/login", // 路径声明
          name: "login",  // 路由别名
          meta: {
              keepAlive: true, // 当前路由是否缓存(暂时不做缓存处理)
              title: "", // 当前页面写死的标题(页面自定义标题，若需要根据后端请求回来的数据来改标题就要在那个相应的回调里设置  document.title = title), 若没有设置 那就是用默认的
              shareInfo: { // 自定义分享信息，若需要根据异步数据来设置，则需要在 页面所对应的组件上挂载一个 Promise => {title,desc}  这样的
                  title: "欢迎来到微商夜大",
                  desc: "从今往后，微商夜大与您同行",
                  paramsKey: [‘productId’] //// 分享时具体页面的需要附带的参数声明，key 为对应路由的name，paramsKey为需要附加上的参数列表的参数key 分享需要从当前路由附加的参数 比如id
              }
          },
          component: () => // 对应组件
              import("@/pageView/login/login")
        },
      */
      // if (!isWX) {
      //   return
      // }

      let {
        path = "/home",
        meta: {
          shareInfo: { paramsKey = [], sharePath = path, ...others } = {}
        } = {}
      } = to;
      let user = getUserInfo();
      let referUid = user.id;
      let shareParams = { referUid };
      if (paramsKey.length) {
        // 需要分享，而且需要附带页面参数的部分
        let params = { ...vm.$route.query, ...vm.$route.params }; // 目标路由的参数 对象
        let paramsObj = Object.entries(params).reduce(
          (prevValue, [key, value]) => {
            // eslint-disable-next-line no-return-assign
            return paramsKey.includes(key)
              ? ((prevValue[key] = value), prevValue)
              : prevValue;
          },
          {}
        ); // 加需要附近的参数key value附加上去
        Object.assign(shareParams, paramsObj);
      }

      let shareParamsStr = Object.entries(shareParams)
        .map(([key, value]) => (value !== "" ? `${key}=${value}` : ""))
        .join("&");
      if (sharePath.startsWith("/")) {
        // 如果是相对路径的分享那就加上window.location.origin
        sharePath = `${window.location.origin}${sharePath}`;
      }
      let link = `${sharePath}${shareParamsStr ? "?" + shareParamsStr : ""}`;
      let shareData = Promise.resolve({ ...others }); // 构造一个空的Promsie

      if (vm.shareDataPromise) {
        shareData = vm.shareDataPromise;
      } // 对于指定的页面去取异步分享数据来替换默认的异步
      Promise.all([shareData, getWXConfigPromise()]).then(
        ([shareRes, shareIsShow]) => {
          debugger;
          wxShare({ ...shareRes, link });
        }
      );
    },
    replaceShareFun(options) {
      // 注册并设置分享
      return getWXConfigPromise().then(() => {
        wxShare({ options });
      });
    },
    getWXConfigPromise() {
      // 注册wxconfig
      return getWXConfigPromise();
    },
    wxShare(options) {
      // 设置微信分享
      wxShare(options);
    }
  },
  beforeRouteEnter(to, from, next) {
    // 在改钩子函数里丢到next回到李做这个
    next(vm => {
      // 这是全局混入的分享注册方式
      vm.shareMixin(to, from, vm);
    });
  }
};

export const AuthorizationToLogin = () => {
  let str = window.location.search.replace(/code.*?&/, "") || "?";
  let redirectUri = window.location.origin + "/login" + str;
  let redirecturi = encodeURIComponent(redirectUri);
  window.location.href =
    "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" +
    appId +
    "&redirect_uri=" +
    redirecturi +
    "&response_type=code&scope=snsapi_userinfo&state=test#wechat_redirect";
};
