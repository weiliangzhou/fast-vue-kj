<template>
  <section id="home-view">
    <div class="top-bar-container">
      <div class="userInfo-container">
        <div class="userInfo">
          <img
            :src="myInfo.user.avatar || 'https://img.mall.xc2018.com.cn/mall/upload/20190513/140756_99_gxee.png'"
            alt=""
          >
          <span class="ellipsis_1">{{myInfo.user.nickName}}</span>
        </div>
        <div class="level-container">
          <h5>{{myInfo.user.levelName}}</h5>
          <span
            v-if="depositIsShow == 1"
            class="identity-logo"
          ></span>
        </div>
        <span class="ellipsis_1">学号: {{myInfo.user.userName}}</span>
        <!-- <div class="top-button-group">
          <button @click="pushRoute('authorization')"><span>授权书</span><i class="iconfont font22 icon-ChevronCopyx"></i></button>
          <button
            v-if="isAdmin||currentLevel>=600"
            class="margin-top12"
            @click="toAdminMenu"
          ><span>管理员后台</span><i class="iconfont font22 icon-ChevronCopyx"></i></button>
        </div> -->
      </div>
      <ul class="statistics-container">
        <li
          v-for="(item, index) in statisticsData"
          :key="index"
        >
          <span>{{item.label}}</span>
          <em>{{item.count}}</em>
        </li>
      </ul>
    </div>
    <div ref="swiperContainer" class="swiper-container">
      <span></span>
      <div class="swiper-item-container">
        <swiper
          auto
          :height="swiperHeight"
          direction="vertical"
          :interval=4000
          class="text-scroll"
          :show-dots="false"
          :min-moving-distance=100
        >
          <swiper-item>
            <div class="swiper-content">
              <div class="content-container">
                <h5>小创商学院素材库</h5>
                <p>海量资源，免费下载</p>
              </div>
              <button @click="goCloudDrive"><span>立即查看</span><i class="iconfont font30 icon-ChevronCopyx"></i></button>
            </div>
          </swiper-item>
          <swiper-item v-if="depositIsShow == 0">
            <div class="swiper-content">
              <div class="content-container">
                <h5>缴纳保证金</h5>
                <p>保证金信誉保障，合作共赢</p>
              </div>
              <button @click="goEarnest"><span>立即缴纳</span><i class="iconfont font30 icon-ChevronCopyx"></i></button>
            </div>
          </swiper-item>
          <swiper-item>
            <div class="swiper-content">
              <div class="content-container">
                <h5>出售产品 赚钱</h5>
                <p>知识新零售创业教育平台</p>
              </div>
              <button @click="goCoursePage"><span>立即出售</span><i class="iconfont font30 icon-ChevronCopyx"></i></button>
            </div>
          </swiper-item>
          <swiper-item v-if="posterInfo.posterUrl">
            <div class="swiper-content">
              <div class="content-container">
                <h5>{{posterInfo.posterName}}</h5>
                <p class="ellipsis_1">{{posterInfo.posterContent}}</p>
              </div>
              <button @click="changeHref(posterInfo.posterUrl)"><span>立即查看</span><i class="iconfont font30 icon-ChevronCopyx"></i></button>
            </div>
          </swiper-item>
        </swiper>
      </div>
    </div>
    <ul class="agent-menu">
         <router-link  class="vip" :to="{
        name: 'agent-add',
        query: { type: 1 }
      }">
       <i></i>
       <span>+新增创客</span>
      </router-link>
      <p></p>
       <router-link class="agent" :to="{
        name: 'agent-add',
        query: { type: 0 }
      }">
       <i></i>
       <span>+新增分销</span>
      </router-link>
    </ul>
    <ul class="home-menu">
         <router-link :to="{name:'agent', params: {active: 'agent'}}">
       <i class="iconfont icon-yonghux1"></i>
       <span>分销商</span>
      </router-link>
       <router-link :to="{name:'agent', params: {active: 'referrer'}}">
      <i class="iconfont icon-bijix1"></i>
       <span>托管分销</span>
      </router-link>
        <router-link to="/statics-report/card">
      <i class="iconfont icon-qushix1"></i>
       <span>我的报表</span>
      </router-link>
    </ul>
    <div class="linep-sp"></div>
             <div class="bottom-continer">
          <div class="sticky-container" v-show="stickyIsShow">
            <sticky
              top="0"
              :left="left"
              ref="stickyComponent"
            >
              <div class="filter-options" ref="sticky">
                <div class="header-info">
                  <select
                    class="select-option"
                    v-model="agentLevel"
                    @change="typeChanged"
                  >
                    <option
                      value=""
                      selected
                    >全部({{totalCount}})人</option>
                    <option
                      v-for="(option, index) in selectOptions"
                      v-bind:value="option.level"
                      :key="index"
                    >
                      {{ option.levelName }}
                    </option>
                  </select>
                <div class="searchPhone">
                  <button
                    id="searchInput"
                    type="button"
                    @click="searchAction"
                    placeholder="请输入手机号"
                  ><span>手机号搜索</span><i class="iconfont icon-sousuocopyx1"></i></button>
                </div>
              </div>
              </div>
            </sticky>
          </div>

          <agent-list
            v-bind="userListInfo"
            :scrollDisabled="scrollDisabled"
            :type="type"
            :shouldShowAddress="false"
            @loadBottom="loadBottom"
          ></agent-list>
        </div>
        <advert ref="advert"></advert>
        </section>
</template>
<script>
import { Toast, setUserInfo } from "@/global"; // getObject copyTextToClipboard
import { getMyInfo, checkIsActive, getAgentArea } from "@/api";
// import { menus } from "@/conf/static";
import { Swiper, SwiperItem } from "vux";
import { MessageBox } from "mint-ui";

import Sticky from "@/components/sticky";
import AgentList from "../agent/agent-list1";
import advert from "./advert";
import { createNamespacedHelpers } from "vuex";
const { mapActions, mapMutations } = createNamespacedHelpers("salesData/agent");
export default {
  data() {
    return {
      type: "agent",
      swiperHeight: "43px",
      left: "0",
      stickyIsShow: false,
      depositIsShow: 0, // 保证金的图标是否显示 -1 不需要交保证金， 0 需要交保证金 1 已经交保证金
      currentLevel: "",
      // menus: menus, // 9宫格菜单选项
      myInfo: {
        // 我的信息对象
        agentNum: "0", // 直属数量
        cardNum: "0", // 当前剩卡数
        saleCaedNum: "0", // 售卡数
        user: {} // 个人信息对象
      },
      posterInfo: {
        posterContent: "",
        posterName: "",
        posterUrl: ""
      },
    };
  },
  components: {
    Swiper,
    SwiperItem,
    Sticky,
    AgentList,
    advert
  },
  computed: {
    statisticsData() {
      let { cardNum = 0, saleCaedNum = 0, agentNum = 0 } = this.myInfo; // agentNum = 0,
      return [
        {
          label: "分销商(人)",
          count: agentNum
        },
        {
          label: "开卡总数(张)",
          count: saleCaedNum
        },
        {
          label: "剩卡数(张)",
          count: cardNum
        }
      ];
    },
    agentLevel: {
      set(value) {
        this.setAgentLevel({ agentLevel: value, type: this.type });
      },
      get() {
        return this.$store.state.salesData.agent[this.type].agentLevel;
      }
    },
    totalCount() {
      let options = this.$store.state.salesData.agent[this.type].selectOptions;
      return options.length ? options[0].totalCount : 0;
    },
    selectOptions() {
      return [...this.$store.state.salesData.agent[this.type].selectOptions];
    },
    chatData() {
      return this.$store.state.salesData.agent[this.type].selectOptions.filter(
        item => item.count
      );
    },
    userListInfo() {
      return this.$store.state.salesData.agent[this.type].userListInfo;
    },
    scrollDisabled() {
      return this.userListInfo.total !== -1 || this.userListInfo.isLoading;
    },
    referrerListScrollDisabled() {
      return this.referrerList.total !== -1 || this.referrerList.isLoading;
    }
  },

  mounted() {
    checkIsActive();
    this.computedSwiperContainer()

    this.fetchPageData();
    let dom = document.getElementById("home-view");
    this.triggerSomeDomRerender(dom)
    this.stickyIsShow = true;

      // let { list = [] } = this.userListInfo;
      // if (this.routerFrom === "agent-add" || this.routerFrom === "agent-add" || list.length === 0) {
      //   this.fetchStatistics();
      // }
      this.left = '0.32rem'; // ""+ menuContainer.left + "px";
      this.fetchStatistics();
      this.fetchList({ isReset: true, type: "agent" });
      this.$nextTick().then(res => {
          // this.$refs.stickyComponent.scrollHandler()
      })
      this.$refs.advert.triggerReferrerStatus().then(res => {
        Object.assign(this.posterInfo, res)
      })
  },
  methods: {
         ...mapMutations({
      setAgentLevel: "setAgentLevel" // 将 `this.add()` 映射为 `this.$store.commit('increment')`
    }),
    ...mapActions({
      fetchStatistics: "fetchStatistics",
      fetchList: "fetchAgentList"
    }),
    typeChanged() {
      this.fetchList({
        isReset: true,
        type: this.type
      });
    },
    beforeToggle(callBack) {
       this.fetchList({ isReset: true, type: "agent" }).finally(() => {
           callBack&&callBack()
       })
    },
    goReferrerRecord() {
      this.$router.push({
        name: "referrer-record"
      });
    },
    searchAction() {
      this.$router.push({ name: "search-agent" });
    },
    loadBottom() {
      if (this.$route.name !== this.currentRouteName) {
        return
      }
      let { isLoading = false, total = -1, list = [] } = this.userListInfo;
      if (!isLoading && total === -1 && list.length) {
        this.fetchList({ type: this.type });
      } else {
        // this.$refs.loadmore.onBottomLoaded()
      }
    },
    addagent(type = 0, userId) {
      let query = { type };
      if (type == 2) {
        query.agentId = userId;
      }
      this.$router.push({
        name: "agent-add",
        query: { ...query }
      });
    },
    computedSwiperContainer() {
      const refs = this.$refs.swiperContainer.getBoundingClientRect()
      this.swiperHeight = refs.height + "px";
      // const menuContainer = this.$refs.sticky.getBoundingClientRect()
      this.left = '0.32rem'; // ""+ menuContainer.left + "px";
    },

    // 显示是否要交保证金的弹框
    goCloudDrive() {
      MessageBox({
        title: "资源地址",
        message: "提取密码: 30tt",
        showCancelButton: true,
        confirmButtonText: "去查看"
      }).then(action => {
        if (action === "confirm") {
          window.location.href =
            "https://pan.baidu.com/s/1naFIBct-xAaNqUxuV-GVEQ";
        } else if (action === "cancel") {
        }
      });
    },
    showEarnestConfirm() {
      MessageBox({
        title: "升级提示",
        message: "您可以升级，是否去提交申请?",
        showCancelButton: true,
        confirmButtonText: "去提交"
      }).then(action => {
        if (action === "confirm") {
          this.goEarnest();
        } else if (action === "cancel") {
        }
      });
    },
    goCoursePage() {
      this.$router.push({ name: "course" });
    },
    goEarnest() {
      this.$router.push({ name: "earnest" });
    },
    // 获取当前页面的信息
    fetchPageData() {
      // 获取我当前用户信息，包括一些统计数据已经个人信息
      getMyInfo()
        .then(res => {
          let { user = {}, idCardNum } = res || {};
          let { levelName, createdAt, nickName } = user || {};
          this.currentLevel = user.agentLevel;
          // 处理是否需要交保证金
          if (user.agentLevel > 200) {
            this.depositIsShow = user.userDeposit;
            // if (user.userDeposit) {
            //   this.showEarnestConfirm()
            // }
          } else {
            this.depositIsShow = -1;
          }
          // 将某些信息更新到我当前用户信息的本地存储里
          let userInfo = { idCardNum, createdAt, levelName };
          if (nickName) {
            userInfo.nickname = nickName;
          }
          setUserInfo(userInfo);
          Object.assign(this.myInfo, res);
        })
        .catch(err => {
          Toast(err);
        });
      getAgentArea().then(({ province = "", city = "", prefecture = "" } = {}) => {
        if (!province || !city) {
          this.pushRoute("agent-area")
        }
      });
    }
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
