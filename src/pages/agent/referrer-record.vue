<!-- 下我的引荐记录列表 -->
<template>
  <section>
         <!-- <div class="search-box"  v-if="false">
        <form
          action=""
          @submit.prevent="onSubmit"
        ><input
            type="search"
            autocomplete="off"
            v-model.trim="searchInput"
            placeholder="请输入名称搜索"
            ref="searchInput"
          /></form><button @click="onCancel">取消</button>
      </div> -->
      <div class="top-bar">
        <h5>申请记录</h5>
        <button @click="goRecommendAgent">申请托管</button>
      </div>
    <div class="list-container">
      <ul
        v-show="currentList.length"
        v-infinite-scroll="loadBottom"
        infinite-scroll-disabled="scrollDisabled"
        :infinite-scroll-immediate-check="true"
        infinite-scroll-distance="10"
      >
          <li
            v-for="(item, index) in currentList"
            :key="index"
          >
          <div class="img-container">
            <img :src="item.referrerAvatar || 'https://img.mall.xc2018.com.cn/mall/upload/20190513/140756_99_gxee.png'">
          </div>
            <div class="user-Info">
              <h5  class="ellipsis_1">{{item.referrerName || '未设置'}}</h5>
              <span>{{item.referrerCurrLevel | LevelToName}} -> {{item.referrerLevel | LevelToName}}</span>
              <p>{{item.referrerPhone}}</p>
            </div>
            <div style="flex: 1;"></div>
            <div class="other-info">
              <p class="ellipsis_1">时间{{item.createdAt | dataFormat }}</p>
              <span v-if="false">{{item.pushPhone}}</span>
               <div class="button-group">
                <button :style="`color: ${['rgba(232,29,29,1)','rgba(152,152,152,1)','rgba(255,163,30,1)'][item.acceptState]};border-bottom: none;`">{{["已拒绝", "已同意", "审核中"][item.acceptState]}}</button>
              </div>
            </div>
          </li>
        <p v-show="listInfo.total!==-1">没有更多</p>
      </ul>
      <no-more v-show="currentList.length === 0"></no-more>
    </div>
  </section>
</template>

<script>
import { findMyReferrerListByUid } from "@/api";
// import { Indicator } from "mint-ui";
// import { Toast, resolveTimeout } from "@/global"; // resolveTimeout, rejectTimeout  getObject, MyError
export default {
  data() {
    return {
      searchInput: "", // 搜索的关键字
      listInfo: { // 推荐记录列表信息
        isLoading: false,
        list: [],
        pageNum: 0,
        total: -1
      }
    };
  },
  computed: {
    currentList() {
      return this.listInfo.list;
    },
    scrollDisabled() {
      return this.listInfo.total !== -1 || this.listInfo.isLoading;
    }
  },

  mounted() {
     this.$nextTick().then(res => {
      this.fetchList();
    });
  },
  methods: {
     goRecommendAgent() {
      this.$router.push({
        name: "recommend-agent"
      });
    },
    /*
    onSubmit() {
      Indicator.open();
      Promise.all([
        this.fetchList({
          isReset: true,
          agentLevel: this.agentLevel,
          searchKey: this.searchInput,
        }),
        resolveTimeout(1)
      ])
        .then(res => {
          Indicator.close();
        })
        .catch(err => {
          Toast(err);
          Indicator.close();
        });
    },
    onCancel() {
      if (this.searchInput) {
        this.searchInput = "";
        this.$refs.searchInput.focus();
      } else {
        this.$router.go(-1);
      }
    },
    clearAgent() {
      Object.assign(this.listInfo, {
        isLoading: false,
        list: [],
        searchList: [],
        pageNum: 0,
        total: -1
      });
    },
    */
    loadBottom() {
      let { isLoading = false, total = -1, list = [] } = this.listInfo;
      if (!isLoading && total === -1 && list.length) {
        this.fetchList({
          isSearch: this.isSearch,
          agentLevel: this.agentLevel,
          searchKey: this.searchInput,
          options: { startTime: this.startTime, endTime: this.endTime }
        });
      } else {
        // this.$refs.loadmore.onBottomLoaded()
      }
    },
    fetchList({ isReset = false } = {}) {
      let content = this.listInfo
      let {
        isLoading = false,
        list = [],
        pageNum = 0,
        total = -1
      } = content;

      if (!isReset && isLoading) {
        return Promise.reject(new MyError("不能重复请求", 1));
      } else if (!isReset && total !== -1) {
        return Promise.reject(new MyError("已经没有数据", 1));
      } else {
        if (isReset) {
          pageNum = 0;
          total = -1;
          list = [];
          Object.assign(content, {
              list: [...list],
              pageNum,
              total: -1
          });
        }
        content.isLoading = true;
        let pageSize = 15;
        return findMyReferrerListByUid({
          pageSize,
          pageNum: pageNum + 1,
          searchKey: this.searchInput,
          acceptState: ""
        })
          .then((res) => {
            let tempList = [...list, ...res];
            Object.assign(content, {
              list: tempList,
              pageNum: res.length ? pageNum + 1 : pageNum,
              total:
                res.length && res.length >= pageSize ? -1 : tempList.length,
              isLoading: false
            });
          })
          .catch(err => {
            content.isLoading = false;
            throw err;
          });
      }
    },
  },
  // activated() {
  //   this.$nextTick().then(res => {
  //     this.clearAgent(this.type);
  //     this.fetchList();
  //   });
  // }
};
</script>
<style lang='less' scoped>
section {
  width: 100%;
  min-height: 100vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  position: relative;
  background: rgba(247, 247, 247, 1);
  &>button {
    margin: 0;
    padding: 32px auto 34px;
    border-width: 0;
    width: 100vw;
    font-size: 32px;
    background: #D7B686;
    line-height: 32px;
    height: 100px;
    box-sizing: border-box;
    color: #fff;
    border-radius: 0px;
    position: fixed;
    bottom: 0;
  }
}

.list-container {
  background: #fff;
  flex: 1;
  display: flex;
  position: relative;
  margin-top: 90px;
  // top: 0;
  // right: 0;
  // background: red;
      ul{
        flex: 1;
        width: 100%;
        min-height: 100%;
        // margin-bottom: 120px;
        // height: 100%;
        // top: 0;
        // right: 0;
        // position: absolute;
        background: rgba(247,247,247,1);
        padding: 20px 32px 20px 28px;
      li {
        display: flex;
        padding: 22px 32px 12px;
        box-sizing: border-box;
        border-radius: 12px;
        border-bottom: 2px solid rgba(224, 224, 224, 1);

        box-shadow: 1px 2px 6px 0px rgba(193,193,193,0.5);
        margin-bottom: 20px;
        background: #fff;
        & > :last-child {
          border-bottom: none;
          margin-bottom: none;
        }
        .img-container{
          display: flex;
          flex-direction: column;
          margin-right: 16px;
          div {
           display: flex;
           justify-content: center;
           align-items: center;
            padding: 5px 5px;
            text-align: center;
            box-sizing: content-box;
            background: rgba(152,152,152,1);
            margin-top: 12px;
            border-radius: 8px;
           span {
            opacity: 1;
            font-size: 22px;
            line-height: 24px;
            color: rgba(255,255,255,1);
            overflow: hidden;
            white-space:nowrap;
           }
          }
          img {
          display: block;
          width: 88px;
          height: 88px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 50%;
          overflow: hidden;
        }
        }

        & > div {
          display: flex;
          flex-direction: column;
        }
        .user-Info {
          display: flex;
          p {
            color: rgba(152,152,152,1);
          }
          span {
            margin: 4px 0 12px;
            color: rgba(101,101,101,1);
          }
        }
        .other-info {
          align-items: flex-end;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          & > h5 {
          }
          & > p{
            color: rgba(152,152,152,1);
          }
          & > span {
            text-align: right;
            margin: 12px 0 10px;
            color: rgba(152,152,152,1);
          }
          .button-group{
            &>button {
              // background: linear-gradient(
              //   left,
              //   rgba(247, 129, 96, 1),
              //   rgba(250, 63, 67, 1)
              // );
              border: none;
              background: none;
              height: 44px;
              font-size: 26px;
              font-weight: Regular;
              color: rgba(199,0,10,1);
              line-height: 37px;
              letter-spacing: 0.42px;
              border-bottom: 2px solid  rgba(199,0,10,1);
              &:last-child {
                margin-left: 20px;
              }
            }
          }
          &> button {
             border: none;
              background: none;
              height: 44px;
              font-size: 26px;
              color: rgba(152,152,152,1);
              line-height: 37px;
              letter-spacing: 0.42px;
          }
        }
      }
      & > p {
        margin: 16px 0 0;
        font-size: 28px;
        text-align: center;
      }
    }
}
.top-bar{
   width: 100%;
    display: flex;
    background: #fff;
    padding: 14px 16px;
    overflow: hidden;
    box-sizing: border-box;
    position: fixed;
    top: 0;
    right: 0;
    align-items: center;
    h5 {
      flex: 1;
      height: 45px;
      opacity: 1;
      font-size: 32px;
      font-family: PingFangSC;
      color: rgba(51,51,51,1);
      line-height: 45px;
      letter-spacing: 0px;
    }
    button {
      height: 60px;
      // flex: 1;
      // flex: 0 0 22%;
      border: none;
      font-size: 28px;
      color: rgba(255, 255, 255, 1);
      line-height: 30px;
      letter-spacing: 0.34px;
      background: #D7B686;;
      padding: 0 20px;
      border-radius: 6px;
      overflow: hidden;
      margin: 0 10px;
    }
}
.search-box {
    width: 100%;
    display: flex;
    background: rgba(225, 225, 225, 0.5);
    padding: 14px 16px;
    overflow: hidden;
    box-sizing: border-box;
    position: fixed;
    top: 0;
    right: 0;
    form {
      flex: 1;
      box-sizing: border-box;
      padding-left: 32px;
      input {
        &::-webkit-search-cancel-button {
          display: none;
        }
        -webkit-appearance: none;
        width: 100%;
        height: 60px;
        opacity: 1;
        background: rgba(255, 255, 255, 1);
        border: 1px solid rgba(239, 239, 239, 1);
        border-radius: 8px;
        box-shadow: 0px 2px 0px 0px rgba(225, 225, 225, 0.5);
        font-size: 30px;
        line-height: 32px;
        color: rgba(54, 54, 54, 1);
        font-weight: 500;
        margin-right: 20px;
      }
    }

    button {
      width: 160px;
      background: transparent;
      border: none;
      font-size: 32px;
      line-height: 34px;
      color: green;
    }
}
</style>
