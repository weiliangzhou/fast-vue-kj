<!--  -->
<template>
  <section id="person-container">
    <transition
      enter-active-class="animated slideInDown"
      leave-active-class="animated slideOutUp"
    >
      <section
        v-if="userInfo"
        class="top-container"
      >
        <div>
          <section>
            <img
              :src="userInfo.avatar"
              alt=""
            >
            <ul>
              <h5>{{userInfo.nickname}}</h5>
              <li>
                <button><span>{{userInfo.levelName}}</span></button>
                <p>学号{{userInfo.username}}</p>
              </li>
            </ul>
          </section>
          <li><i class="iconfont font22 icon-riqicopyx1"></i>
            <p>开启知识新零售创业的第<span>{{activeDay}}</span>天</p>
          </li>
        </div>
      </section>
    </transition>
    <h5>我的权益</h5>
    <transition
      enter-active-class="animated slideInUp"
      leave-active-class="animated slideOutUp"
    >
    <div class="list-container">
      <ul
        v-show="currentList.length"
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="isLoading"
        :infinite-scroll-immediate-check="true"
        infinite-scroll-distance="10"
      >
        <li
          v-for="item in currentList"
          :key="item.id"
        >
          <div
            class="logo-container"
            :style="{background:`url(${item.picUrl}) no-repeat center / cover`}"
          >
          </div>

            <div class="middle-container">
              <h5 class="ellipsis_1">{{item.name}}</h5>
              <span class="ellipsis_1">{{item.brief}}</span>
            </div>
            
            <div class="right-container">
                <button v-if="item.isBuy" disabled>已开通</button>
                <template  v-else>
                    <button @click="toOpenInterest(item)">去开权益</button>
                    <button @click="buy(item.id)">商城购买</button>
                </template>
          </div>
        </li>
      </ul>
      <no-more v-show="currentList.length === 0"></no-more>
    </div>
    </transition>
  </section>
</template>

<script>
import { findMyVipBenefitList } from "@/api";
import { Toast, getUserInfo } from "@/global"; // resolveTimeout, rejectTimeout

export default {
  data() {
    return {
      userInfo: null,
      activeDay: 0,
      isAdmin: false,
      interestList: { // 线上课程列表
        isLoading: false,
        list: [],
        pageNum: 0,
        total: -1
      }

    };
  },

  computed: {
      currentList() {
          return this.interestList.list
      }
  },

  mounted() {
    let userInfo = getUserInfo();
    let {userRoles = []} = userInfo;
    this.isAdmin = !!userRoles.find(({ roleName }) => roleName == "admin");
    this.userInfo = userInfo;
    let createdTime = this.userInfo.createdAt;
    let dd = Date.now() - (new Date(createdTime.replace(/-/g, "/"))).getTime()
    this.activeDay = Math.ceil(Math.abs(dd)/(1000*60*60*24))
    this.fetchList(true)
  },
  methods: {
      toOpenInterest(item) {
          this.pushRoute({name: 'open-interest', query: {agentId: this.userInfo.uid, btId: item.btId}})
      },
    buy(id) { // 跳到商城的反馈
        this.jumpMall(`equityDetail?id=${id}`);
    },
         // 下拉加载更多
    loadMore() {
      let { isLoading = false, total = -1 } = this.interestList;
      if (!isLoading && total === -1) {
        this.fetchList();
      }
    },
     // tab 切换时重新拉去数据
    changeTab() {
      let { list = [], total = -1 } = this.interestList;
      if (list.length === 0 && total === -1) {
        this.fetchList();
      }
    },
     // 拉起列表数据
    fetchList(isReset = false) {
      let content = this.interestList;
      let { isLoading = false, list = [], pageNum = 0, total = -1 } = content;
      if (!isReset && isLoading) {
        return Promise.reject(new MyError("不能重复请求", 1));
      } else if (!isReset && total !== -1) {
        return Promise.reject(new MyError("已经没有数据", 1));
      } else {
        if (isReset) {
          list = [];
          pageNum = 0;
          Object.assign(content, {
              list: [...list],
              pageNum,
              total: -1
          });
        }
        content.isLoading = true;
        let pageSize = 15

        return findMyVipBenefitList({
          pageSize,
          pageNum: pageNum + 1
        })
          .then(res => {
            let tempList = [...list, ...res];
            Object.assign(content, {
              list: tempList,
              pageNum: res.length ? pageNum + 1 : pageNum,
              total: res.length >= pageSize ? -1 : tempList.length,
              isLoading: false
            });
          })
          .catch(err => {
            Toast(err);
            content.isLoading = false;
          });
      }
    }
  },
  activated() {
  }
};
</script>
<style lang='less' scoped>
section[id="person-container"] {
  width: 100vw;
  min-height: 100vh;
  flex: 1;
  box-sizing: border-box;
  background: rgba(247, 247, 247, 1);
  // display: flex;
  flex-direction: column;
  & > h5 {
    margin: 40px 24px 0;
    height:50px;
    font-size:36px;
    font-weight:600;
    color:rgba(54,54,54,1);
    line-height:50px;
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

  .list-container {
    display: flex;
    flex: 1;
    position: relative;
    ul {
      padding: 24px 24px;
      box-sizing: border-box;
      height: 100%;
      flex: 1;
      width: 100%;
      li {
        display: flex;
        padding: 36px 28px;
        background: rgba(255, 255, 255, 1);
        margin-bottom: 22px;
        border-radius:12px;
        border:1px solid rgba(229,229,229,1) /* no */;
        overflow: hidden;
        .logo-container {
          position: relative;
          width: 112px;
          height: 112px;
          box-sizing: border-box;
          background: RGB(121, 141, 173);
          margin-right: 16px;
          overflow: hidden;
          border-radius: 8px;
          &:after {
            position: absolute;
            left: 0;
            top: 0;
            display: block;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.05);
            content: attr(data-text);
            transition: all 1s ease;
            transform: translate(0%, 0%);
            color: #fff;
          }
        }
          .middle-container {
            overflow: hidden;
            display: flex;
            justify-content: space-between;
            flex-direction: column;
            flex: 1;
            margin: 4px 20px;
            h5 {
                flex: 1;
                height:48px;
                font-size:34px;
                font-weight:500;
                color:rgba(54,54,54,1);
                line-height:48px;
            }
            span {
                height:40px;
                font-size:28px;
                font-family:PingFangSC-Regular;
                font-weight:400;
                color:rgba(152,152,152,1);
                line-height:40px;
            }
          }
          .right-container {
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            align-items: center;
            button {
              border: none;
              border-radius: 6px;
                height:33px;
                font-size:24px;
                font-family:PingFangSC-Regular;
                font-weight:400;
                color:rgba(221,166,87,1);
                line-height:33px;
                background: none;
                position: relative;
                &:after {
                content: "";
                display: block;
                position: absolute;
                height: 1px; /* no */
                background: #DDA657;
                width: 100%;
                right: 0;
                bottom: 4px;
              }
            }
            button[disabled] {
                height:40px;
                font-size:28px;
                font-weight:400;
                color:rgba(101,101,101,1);
                line-height:40px;
                &:after {
                  display: none;
                }
            }
          }
      }
    }
  }
</style>
