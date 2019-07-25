<!--  -->
<template>
  <section id="person-container">

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
    this.isAdmin = !!userRoles.find(({ roleName }) => roleName == "admin");
    this.userInfo = userInfo;
    this.testSlide = true;
    this.menusIsShow = true;
    let createdTime = this.userInfo.createdAt;
    let dd = Date.now() - (new Date(createdTime.replace(/-/g, "/"))).getTime()
    this.activeDay = Math.ceil(Math.abs(dd)/(1000*60*60*24))
    checkIsActive().then(res => {
        this.currentLevel = res.agentLevel;
    })
    this.triggerScoll()
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
        countMessageIsNotRead().then(({ totalNum = 0 } = {}) => {
        this.badge = totalNum;
      });
  }
};
</script>
<style lang='less' scoped>
section[id="person-container"] {
  width: 100vw;
  height: 100%;
  flex: 1;
  box-sizing: border-box;
  background: rgba(247, 247, 247, 1);
  // display: flex;
  flex-direction: column;
  .menu-container {
    display: block;
    flex: 1;
    flex-direction: column;
    margin: 0 24px;
    background: rgba(255, 255, 255, 1);
    padding: 0 24px 56px;
    box-sizing: border-box;
    border-radius: 6px;
    box-shadow: 2px 4px 8px 0px rgba(232, 232, 232, 0.5);
    overflow: hidden;
    a,
    button,
    li {
      height: 118px;
      box-sizing: border-box;
      display: flex;
      justify-items: center;
      text-decoration: none;
      p {
        margin: auto;
        margin-right: 20px;
        i {
          color: rgba(221, 166, 87, 1);
          font-size: 40px;
        }
      }
      div {
        flex: 1;
        height: 100%;
        border-bottom: 1px solid rgba(229, 229, 229, 1); /* no */
        display: flex;
        box-sizing: border-box;
        justify-content: space-between;
        align-items: center;
        span {
          height: 45px;
          font-size: 32px;
          color: rgba(54, 54, 54, 1);
          line-height: 45px;
          letter-spacing: 0.77px;
        }
        i {
          color: rgba(212, 212, 212, 1);
          font-size: 28px;
        }
      }
    }
  }
}
.top-container {
  height: 326px;
  box-sizing: border-box;
  background-image: linear-gradient(
    left,
    rgba(215, 182, 134, 1),
    rgba(235, 210, 165, 1)
  );
  background-clip: content-box;
  display: flex;
  padding-bottom: 130px;
  position: relative;
  overflow: visible;
  & > div {
    flex: 1;
    height: 294px;
    width: calc(100% - 48px);
    margin-top: 32px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 2px 4px 12px 0px rgba(229, 229, 229, 0.5); /* no */
    border-radius: 12px;
    overflow: hidden;
    position: absolute;
    top: 0;
    right: 24px;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    padding: 0 32px;
    & > section {
      flex: 1;
      display: flex;
      align-items: center;
      img {
        display: block;
        width: 120px;
        height: 120px;
        background: rgba(0, 0, 0, 0.3);
        border-radius: 50%;
        margin-right: 20px;
      }
      & > ul {
        h5 {
          height: 56px;
          font-size: 40px;
          color: rgba(54, 54, 54, 1);
          line-height: 56px;
          letter-spacing: 0.48px;
          overflow: hidden;
          margin-bottom: 14px;
        }
        & > li {
          display: flex;
          button {
            border: none;
            padding: 0 12px;
            height: 42px;
            opacity: 1;
            background: rgba(215, 182, 134, 1);
            display: flex;
            align-items: center;
            border-radius: 6px;
            overflow: hidden;
            margin-right: 16px;
            span {
              height: 33px;
              font-size: 24px;
              color: rgba(255, 255, 255, 1);
              line-height: 33px;
              letter-spacing: 0.29px;
            }
          }
          p {
            height: 40px;
            font-size: 28px;
            color: rgba(101, 101, 101, 1);
            line-height: 40px;
            letter-spacing: 0.34px;
          }
        }
      }
    }
    & > li {
      height: 86px;
      border-top: 1px solid rgba(229, 229, 229, 1); /* no */
      display: flex;
      align-items: center;
      p {
        height: 48px;
        font-size: 30px;
        color: rgba(119, 119, 119, 1);
        line-height: 48px;
        letter-spacing: 0.36px;
        span {
          color: rgba(239, 208, 164, 1);
        }
      }
      i {
        color: rgba(215, 182, 134, 1);
        font-size: 36px;
        margin-right: 22px;
      }
    }
  }
  margin-bottom: 20px;
}

.button-menus {
  display: flex;
  height: 96px;
  box-shadow: 2px 4px 12px 0px rgba(232, 232, 232, 0.5);
  border-radius: 6px;
  margin-bottom: 32px;
  margin: 0 24px 40px;

  a,
  li {
    background: rgba(255, 255, 255, 1);
    padding: 20px 0;
    flex: 1;
    display: flex;
    display: flex;
    justify-content: center;
    text-decoration: none;
    position: relative;
    align-items: center;
    span {
      height: 45px;
      font-size: 32px;
      color: rgba(54, 54, 54, 1);
      line-height: 45px;
      letter-spacing: 0.52px;
      font-weight: 600;
      margin-left: 40px;
    }
  }
  p {
    display: block;
    width: 1px; /* no */
    height: 64px;
    border-radius: 10px;
    background: #d7b686;
    margin: auto;
  }
  .vip {
    margin-left: 20px;
    i {
      width: 46px;
      height: 48px;
      display: inline-block;
      background: rgba(0, 0, 0, 0.3);
      background: url("https://img.mall.xc2018.com.cn/mall/upload/20190516/114144_41_2h6b.svg") no-repeat center;
      background-size: 46px 48px;
    }
  }
  .agent {
    i {
      width: 46px;
      height: 48px;
      display: inline-block;
      background: rgba(0, 0, 0, 0.3);
      background: url("https://img.mall.xc2018.com.cn/mall/upload/20190516/114209_26_flu3.svg") no-repeat center;
      background-size: 46px 48px;
    }
  }
}
.suggest {
    width: 100%;
    border: none;
    background: #fff;
    outline: none;
    height: 118px;
    align-items: center;
    p {
      width: 38px;
      height: 34px;
      margin-right: 20px;
      display: inline-block;
      border: none;
      outline: none;
      background: url("./fankui.png") no-repeat center;
      background-size: 38px 34px;
    }
    div {
        display: inline-flex !important;
        height: 118px !important;
        box-sizing: border-box;
    }
}
.suggest1 {
    width: 100%;
    border: none;
    background: #fff;
    outline: none;
    height: 118px;
    align-items: center;
    p {
      width: 36px;
      height: 40px;
      margin-right: 20px;
      display: inline-block;
      border: none;
      outline: none;
      background: url("./interest.png") no-repeat center;
      background-size: 100% 100%;
    }
    div {
        display: inline-flex !important;
        height: 118px !important;
        box-sizing: border-box;
    }
}
.messagePoint {
    position: relative;
    &:after {
        display: block;
        position: absolute;
        content: " ";
        width: 6px; /* no */
        height: 6px; /* no */
        border-radius: 50%;
        top: -3px;  /* no */
        right: -3px; /* no */
        background: rgba(199,0,10,1);
    }
}
</style>
<style>
.reward-popup .vux-popup-dialog {
  background: none;
  border-radius: 0.266667rem 0.266667rem 0 0;
}
</style>
