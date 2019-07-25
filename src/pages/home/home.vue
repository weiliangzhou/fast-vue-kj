<template>
  <section id="home-view">
  
  </section>
</template>
<script>
import { Toast, setUserInfo } from "@/global"; // getObject copyTextToClipboard
import { getMyInfo, checkIsActive, getAgentArea } from "@/api";
// import { menus } from "@/conf/static";

import { MessageBox } from "mint-ui";

import { createNamespacedHelpers } from "vuex";
const { mapActions, mapMutations } = createNamespacedHelpers("salesData/agent");
export default {
  data() {
    return {
      type: "agent"
    };
  },
  computed: {
  
  },

  mounted() {
   
  },
  methods: {
  },
  activated() {
    // this.fetchPageData();
    // let { userRoles = [] } = getUserInfo();
    // this.isAdmin = !!userRoles.find(({ roleName }) => roleName == "admin");
    // let dom = document.getElementById("home-view");
    // this.triggerSomeDomRerender(dom)
    // this.stickyIsShow = true;

    //   // let { list = [] } = this.userListInfo;
    //   // if (this.routerFrom === "agent-add" || this.routerFrom === "agent-add" || list.length === 0) {
    //   //   this.fetchStatistics();
    //   // }
    //   this.left = '0.32rem'; // ""+ menuContainer.left + "px";
    //   this.fetchStatistics();
    //   this.fetchList({ isReset: true, type: "agent" });
    //   this.$nextTick().then(res => {
    //       // this.$refs.stickyComponent.scrollHandler()
    //   })
  },
  beforeRouteLeave(to, from, next) {
      this.stickyIsShow = false
      next()
  }
};
</script>

<style lang='less' scoped>
@import url("home.less");
.agent-menu {
    width: 100%;
    display: flex;
    height: 96px;
    background: rgba(255,255,255,1);
    box-shadow: 2px 4px 12px 0px rgba(232,232,232,0.5);
    border-radius: 6px;
    margin-bottom: 32px;

    a {
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
            color: rgba(54,54,54,1);
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
        background: #D7B686;
        margin: auto;
    }
    .vip {
        i {
            width: 48px;
            height: 56px;
            display: inline-block;
            background: rgba(0, 0, 0, 0.3);
            background: url('https://img.mall.xc2018.com.cn/mall/upload/20190516/113634_66_ae5n.svg') no-repeat center;
            background-size: 48px 56px;
        }
    }
    .agent {
            i {
            width: 56px;
            height: 52px;
            display: inline-block;
            background: rgba(0, 0, 0, 0.3);
            background: url('https://img.mall.xc2018.com.cn/mall/upload/20190516/113757_26_qmup.svg') no-repeat center;
            background-size: 56px 52px;
        }
    }
}

.home-menu {
    width: 100%;
    display: flex;
    height:88px;
    border-radius: 6px;
    a {
        flex: 1;
        display: flex;
        display: flex;
        justify-content: center;
        text-decoration: none;
        position: relative;
        align-items: center;
        background: rgba(255,255,255,1);
        box-shadow: 2px 4px 12px 0px rgba(232,232,232,0.5);
        margin-right: 18px;
        border-radius: 6px;
        overflow: hidden;
        i {
            font-size: 48px;
            color: rgba(221,166,87,1);
        }
        span {
            height: 40px;
            font-size: 28px;
            color: rgba(54,54,54,1);
            line-height: 40px;
            letter-spacing: 0.68px;
            margin-left: 24px;
        }
        &:last-child {
            margin-right: 0;
        }
    }
}
.linep-sp {
    width: 100%;
    height: 1px; /* no */
    background: rgba(229,229,229,1);
    margin: 20px 0;
}

   .bottom-continer {
    display: flex;
    flex-direction: column;
    flex: 1;

    .filter-options {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      box-sizing: content-box;
      background: #fff;
      // border-top: 16px solid rgba(247, 247, 247, 1);
      border-bottom: 16px solid rgba(247, 247, 247, 1);
      width: 100vw;
      width: calc(100vw - 48px);
    //   margin: 0 32px;
      .header-info {
        width: 100%;
        // background: #fff;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        box-sizing: border-box;
        padding: 16px 24px 16px 20px;
        border: 1px solid #e9e9e9; /* no */
        // background: rgba(255,255,255,1);
        border-radius: 6px;
        h5 {
          height: 42px;
          opacity: 1;
          font-size: 30px;
          font-family: PingFangSC;
          color: rgba(54, 54, 54, 1);
          line-height: 42px;
          letter-spacing: 0.36px;
          margin-left: 22px;
        }
        & > button {
          height: 60px;
          flex: 1;
          flex: 0 0 22%;
          font-size: 28px;
          line-height: 30px;
          letter-spacing: 0.34px;
          color: rgba(215,182,134,1);
          background: rgba(255,251,244,1);
          box-sizing: content-box;
          border: 1px solid rgba(215,182,134,1);/* no */
          border-radius: 6px;
          overflow: hidden;
          padding: 0 20px;
          margin: 0 10px;
        }
      }

      .searchPhone {
        width: 100%;
        display: flex;
        height: 64px;
        button {
          flex: 1;
          height: 64px;
          font-size: 32px;
          font-weight: Regular;
          color: rgba(153, 153, 153, 1);
          line-height: 45px;
          letter-spacing: -0.77px;
          text-align: center;
          border-width: 0;
          box-sizing: border-box;
          background: transparent;
          display: flex;
          justify-content: space-between;
          align-items: center;
          // margin-right: 30px;
          margin-left: 30px;
          // border-radius: 12px;
          border-left: 1px solid rgba(187,187,187,1); /* no */
          padding: 0 0 0 20px;
        }
      }
    }
  }
  .select-option {
  width: 232px;
  height: 60px;
  opacity: 1;
  background: rgba(255, 255, 255, 1);
  border: 1px solid rgba(239, 239, 239, 1);
  border-radius: 8px;
  box-shadow: 0px 2px 0px 0px rgba(225, 225, 225, 0.5);
  font-size: 30px;
  line-height: 32px;
  color: rgba(54, 54, 54, 1);
  font-weight: 600;
  box-sizing: border-box;
}
</style>
<style>
.superiors-cotainer .mint-navbar .mint-tab-item {
  padding: 17px 0;
}

.superiors-cotainer .mint-navbar .mint-tab-item.is-selected {
  border-bottom: 2px solid #26a2ff;
  color: #26a2ff;
  margin-bottom: -2px;
}
.mint-msgbox-btns .mint-msgbox-cancel {
  box-sizing: border-box !important;
}
</style>
