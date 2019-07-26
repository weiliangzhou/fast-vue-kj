<!--  -->
<template>
  <section id="person-container">
    <div class="userInfo"><img src="" alt="">
    <h5>sdfsdfsadfadf</h5></div>
    <div class="accountBalance">
      <span>账户资金(BTC)</span>
      <h5>0.00009452</h5>
      <button>去提现</button>
    </div>
    <ul class="menu-container">
      <li class="menu-item">
        <img src="" alt="">
        <p>电力记录</p>
        <span>二师兄公众号</span>
      </li>
        <li class="menu-item">
        <img src="" alt="">
        <p>算力值</p>
        <span>二师兄公众号</span>
      </li>
        <li class="menu-item">
        <img src="" alt="">
        <p>提币记录</p>
        <span>二师兄公众号</span>
      </li>
    </ul>

     <ul class="bottom-container">
      <li class="menu-item">
        <img src="" alt="">
        <p>电力记录</p>
        <span>二师兄公众号</span>
      </li>
      <div style="flex: 1"></div>
      <p class="tips">客服电话：0571-62888888</p>
    </ul>
  </section>
</template>

<script>
import { checkIsActive, countMessageIsNotRead } from "@/api";
import { Toast, getUserInfo } from "@/global"; // resolveTimeout, rejectTimeout

export default {

  data() {
    return {
      userInfo: null,
      testSlide: false,
      menusIsShow: false,
      currentLevel: "",
      activeDay: 0,
      badge: 0,
      isAdmin: false

    };
  },
  computed: {},

  mounted() {
    let userInfo = getUserInfo();
    let {userRoles = []} = userInfo;
  },
  methods: {
    triggerSupplier() {
      this.$refs.referrer.triggerReferrerStatus();
    },
    // 九宫格选项的点击事件
    goMaterialLibrary() {
      let currentLevel = this.currentLevel || 0;
      if (currentLevel < 200) {
        Toast("VIP没权限查看");
      } else {
        let origin = "http://tmall.xc2018.com.cn";
        if (location.origin.indexOf("//sales") !== -1) {
          origin = "https://mall.xc2018.com.cn";
        }
        window.location.href = `${origin}/material-library`;
      }
    },
    goSuggest() { // 跳到商城的反馈
        let origin = "http://tmall.xc2018.com.cn";
        if (location.origin.indexOf("//sales") !== -1) {
          origin = "https://mall.xc2018.com.cn";
        }
        window.location.href = `${origin}/feedback`;
    }
  },
  activated() {
  
  }
};
</script>
<style lang='less' scoped>
section[id="person-container"] {
  width: 100vw;
  min-height: 94vh;
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
    width: 84px;
    height: 84px;
    border-radius: 50%;
    margin-right: 20px;
    background: rgba(0, 0, 0, 0.3);
  }
  h5 {
   font-family: PingFangSC-Medium;
font-size: 40px;
color: #202437;
letter-spacing: 0;
height: 56px;
line-height: 56px;
flex: 1;
  }
}

.accountBalance {
  height: 200px;
  padding: 50px 40px 42px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  position: relative;
  background: rebeccapurple;
  border-radius: 20px;
  span {
    font-family: PingFangSC-Regular;
font-size: 24px;
color: #FFFFFF;
letter-spacing: 0;
height: 33px;
line-height: 33px;
  }
  h5 {
    font-family: PingFangSC-Medium;
font-size: 52px;
color: #FFFFFF;
letter-spacing: 2px;
height: 72px;
line-height: 72px;
  }
  button {
    border: 1px solid #FFFFFF; /* no */
border-radius: 6px;
position: absolute;
top: 50px; right: 40px;
padding: 10px 18px;
color: #fff;
  }
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 30px 0;
  img {
    display: block;
    margin-right: 8px;
    width: 48px;
    height: 48px;
    background: rgba(0, 0, 0, 0.3);

  }

      p {
      font-family: PingFangSC-Regular;
font-size: 32px;
color: #202437;
letter-spacing: 0;
height: 44px;
line-height: 44px;
    }
    span {
      flex: 1;
      font-family: PingFangSC-Regular;
font-size: 28px;
color: #A0A3AF;
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
  border-top: 20px solid #F6F7FB;
}
.tips {
  height: 33px;
  line-height: 33px;
  font-family: PingFangSC-Regular;
font-size: 24px;
color: #C6C8D1;
letter-spacing: 0;
text-align: center;
margin-bottom: 20px;
}
</style>
<style>
.reward-popup .vux-popup-dialog {
  background: none;
  border-radius: 0.266667rem 0.266667rem 0 0;
}
</style>
