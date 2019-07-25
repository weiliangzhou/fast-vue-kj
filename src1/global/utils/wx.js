import wx from 'weixin-js-sdk'
import config from '@/conf/config'

import { axios } from '@/global'

// import './static/jweixin1.4.0'
// import {
//     Authorization
// } from '@/api'
let Authorization = () => {}
// 微信相关配置与信息api
// 获取微信配置
export const getWXConfig = (data) => {
    return axios.request({
        url: '/qudao-member/saas/member/getGzhJsApiToken',
        method: 'post',
        data: data
    })
}

// import Vconsole from 'vconsole'
//  new Vconsole();
const appId = config.appId;
/**
 * 判断是否在微信端
 */
const isWX = navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == "micromessenger";

// 微信分享功能
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
export const wxShare = (param) => {
    let referrer = window.localStorage.getItem('userId') || "";
    let {
        title = "微商夜大",
        desc = "微商夜大让微商创业再也没有秘密",
        link = `${window.location.origin}/home?referrer=${referrer}`,
        type = "link",
        imgUrl = "http://chuang-saas.oss-cn-hangzhou.aliyuncs.com/upload/image/20180906/6929b166cdef4903ab15958fe7d0f784.jpg",
        success = () => { },
        cancel = () => { }
    } = param || {}
    let shareData = {
        title,
        desc,
        link,
        type,
        imgUrl,
        success,
        cancel
    }
    // 获取“分享到朋友圈”按钮点击状态及自定义分享内容接口（即将废弃）
    wx.onMenuShareTimeline(shareData)
    // 获取“分享给朋友”按钮点击状态及自定义分享内容接口（即将废弃）
    wx.onMenuShareAppMessage(shareData)
    // 获取“分享到QQ”按钮点击状态及自定义分享内容接口（即将废弃）
    wx.onMenuShareQQ(shareData);
    // 获取“分享到QQ空间”按钮点击状态及自定义分享内容接口（即将废弃）
    wx.onMenuShareQZone(shareData);
}
// 获取微信用户授权
export const authorization = (code) => {
    let data = {
        code,
        busCode: 2, // 1：是小程序 2：h5授权
        wechatMobile: '',
        nickName: '',
        logoUrl: '',
        referrer: ''
    }
    return new Promise((resolve, reject) => {
        if (window.localStorage.getItem('token') && window.localStorage.getItem('userId')) {
            resolve();
        } else {
            Authorization(data).then(res => {
                if (res.code == "200") {
                    if (res.data.token) {
                        // 获取成功userId与token
                        window.localStorage.setItem('token', res.data.token)
                    } else {
                        // 获取失败，重新去授权获取
                        AuthorizationToLogin()
                    }
                } else {
                   // tips('帐号授权失败', 200)
                }
                resolve();
            }, rej => {
                console.log(rej)
                // tips('帐号授权失败')
                resolve();
            })
        }
    })
}
// 获取链接上的参数
export const getQueryString = (name) => {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    let r = window.location.search.substr(1).match(reg);
    if (r != null) return r[2];
    return '';
}

// 分割重写的登录与用户信息获取等通用方法
/**
 * 用户跳转登录逻辑
 * @param {} redirectUri 登录后需要重定向跳转的页面不传默认返回来源页
 */
export const login = (redirectUri) => {
    // encodeURIComponent(redirectUri || `${window.location.href}`); //有传参则使用传参，没有则获取当调用该方法页面作为callback页面
    // 解析url参数获取出参数内容拼接使用
    // let reUri = window.document.createElement('a');
    // reUri.href = redirectUri || window.location.href;
    // window.localStorage.setItem('loginCallBack', `${reUri.pathname}${reUri.search}`)
    // if (isWX&&false) {
    //     // 如果在微信体制内则跳转到微信公众号授权后登录，在微信授权后用手机号码登录
    //     // window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${window.location.origin}/channel-login&response_type=code&scope=snsapi_userinfo&state=login#wechat_redirect`
    //     window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${window.location.origin}/login&response_type=code&scope=snsapi_userinfo&state=login#wechat_redirect`
    // } else {
    //     // 在微信体制外登录则不需要跳转到微信授权，直接通过手机号码登录
    //     window.location.href = `${window.location.origin}/login`
    // }
    window.location.href = `${window.location.origin}/login`
}
/**
 * 业务员跳转登录逻辑
 */
export const salesmanLogin = () => {
    if (isWX) {
        // 如果在微信体制内则跳转到微信公众号授权后登录，在微信授权后用手机号码登录
        window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${window.location.origin}/salesman-login&response_type=code&scope=snsapi_userinfo&state=login#wechat_redirect`
    } else {
        // 在微信体制外登录则不需要跳转到微信授权，直接通过手机号码登录
        window.location.href = `${window.location.origin}/salesman-login`
    }
}
/**
 * 跳转微信授权
 */
export const wxAuthorize = (url) => {
    let uri = url || window.location.href;
    window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${uri}&response_type=code&scope=snsapi_userinfo&state=login#wechat_redirect`
}

// 跳去获取微信用户code,静默授权仅能获取用户的openid与access_token
// Silent login
export const SilentToLogin = () => {
    let redirectUri = window.location.origin + '/login';
    let uri = getQueryString('referrer') ? redirectUri.split('?')[0] + '?referrer=' + getQueryString('referrer') : redirectUri.split('?')[0];
    let redirecturi = encodeURIComponent(uri);
    window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appId + '&redirect_uri=' + redirecturi + '&response_type=code&scope=snsapi_base&state=test#wechat_redirect'
}
// 跳去获取微信用户code，主动触发授权能够获取获取用户的具体信息包括头像，昵称，地址等
// Authorization login
/**
 * redirectUri string
 * 传入当前页面的链接
 */
export const AuthorizationToLogin = () => {
    let str = window.location.search.replace(/code.*?&/, "") || "?"
    let redirectUri = window.location.origin + '/login' + str;
    // let redirectUri = config.env==='production' ? 'http://dy.xc2018.com.cn/login'+str : 'http://xcx.wegoo.cn/devtest81/login'+str;
    // let uri = getQueryString('referrer') ? redirectUri.split('?')[0] + '?referrer=' + getQueryString('referrer') : redirectUri.split('?')[0];
    let redirecturi = encodeURIComponent(redirectUri);
    window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appId + '&redirect_uri=' + redirecturi + '&response_type=code&scope=snsapi_userinfo&state=test#wechat_redirect'
}

// 绑定上下级功能
export const bindReferrer = (referrer) => {
    if (!referrer&& referrer!=="null") {
        referrer = ""
    }
    bindUserReferrer({
        referrer
    }).then(res => {
        if (res.reCode == '200') {
            console.log('绑定用户成功', res);
            window.localStorage.removeItem('referrer');
        }
    }, rej => {
        console.log('绑定用户失败', rej);
    })
}

const WXconfigPromise = () => {
  return new Promise((resolve, reject) => {
    getWXConfig({
      url: window.location.href.split('#')[0] // encodeURIComponent(window.location.href.split("#")[0])
    }).then(res => {
        wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: res.data.appId || appId, // 必填，公众号的唯一标识
            timestamp: res.data.timestamp, // 必填，生成签名的时间戳
            nonceStr: res.data.nonceStr, // 必填，生成签名的随机串
            signature: res.data.signature, // 必填，签名
            jsApiList: res.data.jsApiList || ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone', 'chooseWXPay', 'hideMenuItems'] // 必填，需要使用的JS接口列表
        })
        wx.ready(() => {
            resolve("OK")
        })
        wx.error(res => {
            reject(res);
        })
    }).catch(rej => {
        reject(new Error('获取微信配置失败'))
    })
  })
}

// let wxConfigTemp = null;
export const getWXConfigPromise = () => {
  // if (isIos()&&false) {
  //     if (wxConfigTemp) {
  //         wxConfigTemp = WXconfigPromise();
  //     }
  //     return wxConfigTemp;
  // } else {
  //     return WXconfigPromise();
  // }
  return WXconfigPromise();
}

// 唤起微信h5支付
export const openwechatpay = (config, successCallback, failCallback) => {
    function jsApiCall() {
        let orderNo = config.orderNo;
        delete config.orderNo
        WeixinJSBridge.invoke(
            'getBrandWCPayRequest',
            config,
            function (res) {
                if (res.err_msg == "get_brand_wcpay_request:ok") {
                    successCallback && successCallback({ result: 0, orderNo, message: "支付成功" });
                } else if (res.err_msg == "get_brand_wcpay_request:cancel") {
                    failCallback && failCallback({ result: 1, message: "取消支付" });
                } else {
                    failCallback && failCallback({ result: 2, message: "支付失败" });
                }
            }
        );
    }
    if (typeof WeixinJSBridge == "undefined") {
        if (document.addEventListener) {
            document.addEventListener('WeixinJSBridgeReady', jsApiCall, false);
        } else if (document.attachEvent) {
            document.attachEvent('WeixinJSBridgeReady', jsApiCall);
            document.attachEvent('onWeixinJSBridgeReady', jsApiCall);
        }
    } else {
        jsApiCall();
    }
}

export const openwechatpayPromise = (res) => {
    var config = {
        "appId": res.appid,
        "nonceStr": res.nonceStr,
        "package": res.packageStr,
        "paySign": res.paySign,
        "signType": res.signType,
        "timeStamp": res.timeStamp,
        orderNo: res.orderNo
    }
    return new Promise((resolve, reject) => {
        if (!isWX) {
            // eslint-disable-next-line
            reject({ result: 3, message: "请在微信中使用支付" })
        } else {
            openwechatpay(config, resolve, reject)
        }
    })
}
