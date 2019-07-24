
<template>
  <div id="login">
    <div class="loginTitle">
      登录
    </div>
    <div class="input phone">
      <!-- <div class="areaCode">+86</div> -->
      <!-- <div class="area_code_one" @click="checkAreaCode"><span>+{{areaCode}}</span> <i class="iconfont icon-Pathx"></i></div> -->
      <area-code v-model="areaCode" @change="phonenNmberVaildate"></area-code>
      <input type="tel" placeholder="请输入手机号" v-model="phoneNmber" @input="phonenNmberVaildate" @paste="pastePhoneName">
      <label class="getCode" :class="{disabled: !isgetCode}" for="phoneCode" @click="verify">{{codeText}}</label>
    </div>
    <div class="input code">
      <div class="checkCode">验证码</div>
      <input type="tel" placeholder="请输入验证码" v-model="phoneCode" @input="phoneCodeVaildate" @paste="pastePhoneCode">
    </div>
    <div v-if="refName" class="invite-tips">{{refName}}诚邀您一起加入</div>
    <div class="login-btn" :class="{ok: loginBtnStatus}" @click="doLogin">
      <span>{{loginLabel}}</span>
    </div>
    <p class="tips" v-if="false">收不到验证码？<span>点击联系客服</span></p>
  </div>
</template>

<script>
// 18069997896 测试库小镇账号
import { Actionsheet } from 'vux'
import { loginApi, sendMsgCode, captchaStart } from '@/api'
import { getQueryString, trimIn, Toast, phoneValidate, setUserInfo, checkIsLogined, randomWord, resolveTimeout } from '@/global'
import { Indicator } from "mint-ui"
import "./gt.js"
export default {
  data() {
    return {
      areaCode: '86', // 手机号码区号，默认86
      phoneNmber: '',
      phoneCode: '',
      isgetCode: false,
      loginBtnStatus: false,
      codeText: '获取验证码',
      timeOutNow: false,
      refName: "",
      ref: "",
      clientId: 'c' + new Date().getTime() + randomWord(false, 3),
      captchaObj: null,
    };
  },
  components: {
    Actionsheet
  },

  computed: {
    loginLabel() {
      return this.ref ? "下一步" : "登录"
    }
  },

  mounted() {
    // if (isWX && !getQueryString('code')) {
    //     salesmanLogin();
    // }
    let { refName = "",
      ref = "" } = {
        ...this.$route.params,
        ...this.$route.query
      };
    Object.assign(this, { refName, ref })
    this.captchaInit()
  },

  watch: {
    phoneCode(newValue, oldValue) {
      this.$nextTick().then(() => this.filterPhoneCode())
    }
  },
  methods: {
    captchaInit() {
      const that = this
      captchaStart({ clientId: this.clientId }).then(resp => {
        const data = resp
        window.initGeetest({
          // 以下配置参数来自服务端 SDK
          gt: data.gt,
          challenge: data.challenge,
          offline: !data.success,
          new_captcha: true,
          product: 'bind',
          width: '40px'
        }, (captchaObj) => {
          // 这里可以调用验证实例 captchaObj 的实例方法
          captchaObj.appendTo('#captchaBox')
          captchaObj.onReady(() => {
            that.captchaObj = captchaObj
          }).onSuccess(() => {
            // 用户验证成功后，进行实际的提交行为
            console.log('verify success')
            // 验证通过倒计时开始
            this.isgetCode = this.phoneTestReturn()
            this.getCodeText = `59s后获取`
           this.getcode()
            // 验证通过倒计时开始
          }).onError(() => {
            // your code
          })
        })
      })
    },
    phoneTestReturn() {
      return phoneValidate(this.areaCode, this.phoneNmber)
    },

    relNameVaildate() {
      this.$nextTick(() => {
        this.loginStatus()
      })
    },
    filterPhoneCode() {
      let phoneCode = "" + this.phoneCode;
      let middl = phoneCode.length / 2;
      if (phoneCode && [8, 12].includes(phoneCode.length) && (phoneCode.substr(0, middl) == phoneCode.substr(middl, middl))) {
        this.phoneCode = phoneCode.substr(0, middl)
      }
    },
    phonenNmberVaildate() {
      this.phoneNmber = trimIn(this.phoneNmber);
      this.$nextTick(() => {
        this.loginStatus()
        if (this.timeOutNow) return
        this.isgetCode = this.phoneTestReturn()
      })
    },
    phoneCodeVaildate() {
      this.$nextTick(() => {
        this.$nextTick().then(() => this.filterPhoneCode())
        this.loginStatus()
      })
    },
    pastePhoneName() {
      // 粘贴手机号
      this.$nextTick(() => {
        this.phoneNmber = trimIn(this.phoneNmber);
        // if (!this.phoneTestReturn()) {
        //   Toast("手机号码格式不对")
        //   return false
        // }
        this.loginStatus()
      })
    },
    pastePhoneCode() {
      // 粘贴验证码
      this.$nextTick(() => {
        this.loginStatus()
      })
    },
    loginStatus() {
      this.loginBtnStatus = (this.phoneNmber && this.phoneTestReturn() && this.phoneCode);
    },
    verify() {
      if (this.isgetCode && this.captchaObj) {
        this.captchaObj.verify()
      }
    },
    getcode() {
      if (!this.isgetCode && !this.captchaObj) return false
      this.isgetCode = false;
      this.timeOutNow = true;
      this.codeText = `59秒后获取`
      this.countDownBySecond(
        59,
        1000,
        (t) => {
          this.codeText = `${t}秒后获取`;
        },
        () => {
          this.isgetCode = true;
          this.timeOutNow = false;
          this.codeText = `获取验证码`;
          this.captchaObj.reset();
        }
      )
      // post请求
      var { geetest_challenge: challenge, geetest_seccode: seccode, geetest_validate: validate } = this.captchaObj.getValidate()
      sendMsgCode({ phone: this.phoneNmber, areaCode: this.areaCode, challenge, seccode, validate }).then((res) => {
        // window.location.href = this.callbackUrl
        Toast("发送成功");
      }, (rej) => {
        Toast(rej)
      })
    },
    doLogin() {
      if (this.loginBtnStatus) {
        Indicator.open()
        Promise.all([loginApi({
          areaCode: this.areaCode,
          phone: this.phoneNmber,
          msgCode: this.phoneCode,
          wechatCode: getQueryString("code")
        }), resolveTimeout(1)]).then(([res]) => {
          setUserInfo(res)
          this.$router.push({ name: "perfect-userInfo", replace: true });
        }).catch((rej) => {
          Toast(rej)
        }).then(res => {
          Indicator.close()
        })
      }
    },
    /**
     * [countDownBySecond 倒计时]
     * @param  {[Int]} restSeconds   [剩余秒数，必填]
     * @param  {[Int]} timeInterval   [时间间隔，非必填，默认1000ms]
     * @param  {[Function]} func   [每倒计时一次，就需要执行一次的回调函数名，非必填]
     * @param  {[Function]} endFun [倒计时结束需要执行的函数名，非必填]
     * @return {[null]}        [无返回值]
     */
    countDownBySecond(restSeconds, timeInterval, func, endCallback) {
      let timer = null
      let total = restSeconds
      timeInterval = timeInterval || 1000
      timer = setInterval(() => {
        --total
        if (total <= 0) {
          clearInterval(timer)
          endCallback && endCallback()
        } else {
          func && func(total)
        }
      }, timeInterval)
    }
  },
  beforeDestroy() {
   if (this.captchaObj) {
      this.captchaObj.reset();
      this.captchaObj = null;
    }
  },
  beforeRouteEnter(to, from, next) {
    sessionStorage.clear();
    if (checkIsLogined()) {
      next({ name: "home", replace: true })
    } else {
        localStorage.clear()
      next()
    }
  },
}

var animal = {
  name: "dog",
  speak: () => {
    return () => {
      console.log(this.name)
    }
  }
}
animal.speak()
</script>

<style lang='less' scoped>
@import url("../login/style.less");
#login .name input {
  width: 340px;
}
.ps {
  margin-left: 30px;
  font-size: 28px;
  color: #adadad;
  margin-top: 30px;
}
</style>
