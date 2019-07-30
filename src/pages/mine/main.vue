<!--  -->
<template>
  <section id="person-container">
    <div class="userInfo">
      <img :src="headImgUrl" alt="">
      <div>
        <h5>{{nickName}}</h5>
        <!-- <p>已挖矿50天</p> -->
      </div>

    </div>
    <div class="accountBalance">
      <span>账户资金(BTC)</span>
      <h5>{{balance}}</h5>
      <!-- <button>去提现</button> -->
    </div>
    <ul class="menu-container">
      <li class="menu-item afterIcon" @click="pushRoute('energy')">
        <span>
          <svg class="icon gongzhonghao-icon" aria-hidden="true">
            <use xlink:href="#iconpower" />
          </svg>
        </span>

        <p>电力记录</p>
        <span></span>
      </li>
      <li class="menu-item afterIcon" @click="pushRoute('acalculationPower')">
        <span>
          <svg class="icon gongzhonghao-icon" aria-hidden="true">
            <use xlink:href="#iconCalculation" />
          </svg>
        </span>
        <p>算力记录</p>
        <span></span>
      </li>
      <li class="menu-item afterIcon" @click="pushRoute('extract')">
        <span>
          <svg class="icon gongzhonghao-icon" aria-hidden="true">
            <use xlink:href="#iconbill" />
          </svg>
        </span>
        <p>提币记录</p>
        <span></span>
      </li>
    </ul>

    <ul class="bottom-container">
      <li class="menu-item afterIcon" @click="subscribeImgIsShow=true">
        <span>
          <svg class="icon gongzhonghao-icon" aria-hidden="true">
            <use xlink:href="#iconcenter" />
          </svg>
        </span>
        <p>关注公众号</p>
        <span></span>
      </li>
      <div style="flex: 1"></div>
      <p class="tips">客服电话：0571-62888888</p>
    </ul>

    <transition enter-active-class="animated zoomIn" leave-active-class="animated zoomOut">

      <section v-if="subscribeImgIsShow" class="dialogs">
        <div class="referrer-container">
          <img :src="subscribeImg" alt="">
          <div class="button-group">
            <button class="close-button" @click="subscribeImgIsShow=false"></button>
          </div>
        </div>
      </section>
    </transition>
  </section>
</template>

<script>
import { getCurrentUserInfo } from '@/api'
import { Toast, getUserInfo, isWX, isIos } from '@/global' // resolveTimeout, rejectTimeout
import subscribeImg from './QRcode.png'
export default {
  data() {
    return {
      subscribeImg,
      subscribeImgIsShow: false,
      headImgUrl: '',
      nickName: '',
      balance: 0
    }
  },
  computed: {},

  mounted() {
    let userInfo = getUserInfo()
    let { headImgUrl, nickName } = userInfo
    Object.assign(this, { headImgUrl, nickName })
    getCurrentUserInfo().then(res => {
      this.balance = res || 0
    })
  },
  methods: {},
  beforeRouteEnter(to, from, next) {
    if (isWX && isIos && !sessionStorage.mineRefreshed) {
      sessionStorage.mineRefreshed = '1'
      window.location.href = window.origin + to.fullPath
    } else {
      next()
    }
  },

  beforeRouteLeave(to, from, next) {
    sessionStorage.mineRefreshed = ''
    next()
  }
}
</script>
<style lang='less' scoped>
section[id='person-container'] {
  width: 100vw;
  /*min-height: 94vh;*/
  flex: 1;
  box-sizing: border-box;
  background: #fff;
  display: flex;
  flex-direction: column;
  padding: 0 30px;
  border-bottom: 96px solid transparent;
}
.userInfo {
  display: flex;
  margin: 40px 0 60px;
  align-items: center;
  img {
    display: block;
    width: 104px;
    height: 104px;
    border-radius: 50%;
    margin-right: 20px;
    background: rgba(0, 0, 0, 0.3);
  }
  　& > div {
    h5 {
      font-family: PingFangSC-Medium;
      font-size: 40px;
      color: #202437;
      letter-spacing: 0;
      height: 56px;
      line-height: 56px;
      flex: 1;
    }
    p {
      font-family: PingFangSC-Medium;
      font-size: 26px;
      color: #999999;
      letter-spacing: 0;
      height: 37px;
      line-height: 37px;
      margin-top: 4px;
    }
  }
}

.accountBalance {
  height: 200px;
  width: 690px;
  padding: 50px 40px 42px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  position: relative;
  background-image: url('http://fast-mining.oss-cn-hangzhou.aliyuncs.com/upload/image/20190730/c5d66c6c4cb8441abe29c6c611c2572d.png');
  background-repeat: no-repeat;
  background-size: 690px 200px;
  border-radius: 20px;
  span {
    font-family: PingFangSC-Regular;
    font-size: 24px;
    color: #ffffff;
    letter-spacing: 0;
    height: 33px;
    line-height: 33px;
  }
  h5 {
    font-family: PingFangSC-Medium;
    font-size: 52px;
    color: #ffffff;
    letter-spacing: 2px;
    height: 72px;
    line-height: 72px;
  }
  button {
    border: 1px solid #ffffff; /* no */
    border-radius: 6px;
    position: absolute;
    top: 50px;
    right: 40px;
    padding: 10px 18px;
    color: #fff;
    background: transparent;
  }
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 30px 0;
  & > span:first-of-type {
    margin-right: 16px;
  }
  p {
    font-family: PingFangSC-Regular;
    font-size: 32px;
    color: #202437;
    letter-spacing: 0;
    height: 44px;
    line-height: 44px;
  }
  & > span:last-of-type {
    flex: 1;
    font-family: PingFangSC-Regular;
    font-size: 28px;
    color: #a0a3af;
    letter-spacing: 0;
    height: 40px;
    line-height: 40px;
    text-align: right;
  }
}
.bottom-container {
  background: #fff;
  flex: 1;
  display: flex;
  flex-direction: column;
  border-top: 20px solid #f6f7fb;
}
.tips {
  height: 33px;
  line-height: 33px;
  font-family: PingFangSC-Regular;
  font-size: 24px;
  color: #c6c8d1;
  letter-spacing: 0;
  text-align: center;
  margin-bottom: 20px;
}

.afterIcon {
  position: relative;
  padding-right: 46px;
  box-sizing: border-box;
}
.afterIcon:after {
  display: inline-block;
  content: ' ';
  height: 22px;
  width: 22px;
  border-width: 3px 3px 0 0;
  border-color: #c7c7cc;
  border-style: solid;
  transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
  position: absolute;
  top: 50%;
  right: 20px;
  margin-top: -16px;
}

.dialogs {
  position: absolute;
  z-index: 10;
  top: 0;
  right: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  background: rgba(0, 0, 0, 0.45);
  padding: 0 20px 60px;
  .referrer-container {
    display: flex;
    flex-direction: column;
    border-radius: 12px;
    align-items: center;
    box-sizing: border-box;
    position: relative;
    margin-right: 40px;
    img {
      width: 75vw;
      height: auto;
      border-radius: 12px;
    }
    & > button {
      font-size: 28px;
      color: rgba(255, 255, 255, 1);
      letter-spacing: 0.45px;
      opacity: 1;
      background: #d7b686;
      box-sizing: border-box;
      border-radius: 8px;
      border-width: 0;
      width: 100%;
      height: 70px;
      margin-top: 44px;
    }

    .button-group {
      position: absolute;
      bottom: -100px;
      background: rgba(0, 0, 0, 0);
      &:after {
        display: inline-block;
        position: absolute;
        content: ' ';
        height: 100px;
        width: 2px;
        margin: 0 auto;
        background: #fff;
        right: 50%;
        top: -100px;
      }
      .back-button {
        position: relative;
        height: 45px;
        opacity: 1;
        font-size: 32px;
        font-family: PingFangSC;
        color: rgba(255, 255, 255, 1);
        line-height: 45px;
        letter-spacing: 0.94px;
        background: rgba(0, 0, 0, 0);
        border: none;
        padding: 10px 30px;
        box-sizing: content-box;
        &:after {
          display: inline-block;
          content: ' ';
          height: 22px;
          width: 22px;
          border-width: 2px 2px 0 0;
          border-color: rgba(255, 255, 255, 1);
          border-style: solid;
          transform: matrix(
            -0.71,
            -0.71,
            0.71,
            -0.71,
            0,
            0
          ); // rotate(-135deg);
          position: absolute;
          top: 50%;
          left: -25px;
          margin-top: -12px;
        }
      }
      .close-button {
        width: 46px;
        height: 46px;
        box-sizing: content-box;
        position: relative;
        background: rgba(0, 0, 0, 0);
        border: 3px solid #fff;
        overflow: hidden;
        border-radius: 50%;
        padding: 6px;
        &:after {
          display: inline-block;
          position: absolute;
          content: ' ';
          height: 4px;
          width: 70%;
          background: #fff;
          border-radius: 12px;
          top: 30px;
          // right: -50%;
          right: 0;
          margin: 0 15%;
          transform: rotate(45deg);
        }

        &:before {
          display: inline-block;
          position: absolute;
          content: ' ';
          height: 4px;
          width: 70%;
          background: #fff;
          border-radius: 12px;
          top: 30px;
          // right: -50%;
          right: 0;
          margin: 0 15%;
          transform: rotate(-45deg);
        }
      }
    }
  }
}
</style>