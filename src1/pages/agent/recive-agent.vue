<!-- 下级的推荐列表 -->
<template>
  <section class="agent-container">
      <agent-list @rejectAgent="rejectItem" v-bind="userListInfo" type="agent" :scrollDisabled="scrollDisabled" @loadBottom="loadBottom"></agent-list>
      <button @click="backToAgent"></button>
  </section>
</template>
<script>
import { findPendingReferrerListByUid, disposeReferrer } from '@/api'
import { MessageBox, Indicator } from 'mint-ui';
import AgentList from "./recive-list"
export default {
  data() {
    return {
      agentLevel: "",
      routerFrom: "",
      currentLevel: "",
      userListInfo: {
            isLoading: false,
            list: [],
            pageNum: 0,
            total: -1
        },
    };
  },
  components: {
    AgentList,
  },
  computed: {
  scrollDisabled() {
      return false
  }
  },
   mounted() {
      if (this.type === "agent") {
      checkIsActive().then(res => {
        this.currentLevel = res.agentLevel;
      })
    }
    this.fetchList({ isReset: true, type: "agentUser" });
  },
  activated() {

  },
  methods: {
    // 拒绝引荐
    rejectItem(id) {
      let { list = [] } = this.userListInfo;
      let currentItem = list.findIndex(({saleReferrerAsk = {}} = {}) => saleReferrerAsk.id == id)
      if (currentItem!==-1) {
        Indicator.open()
        disposeReferrer({ askId: id }).then(res => {
          Indicator.close()
          list[currentItem].saleReferrerAsk.acceptState = 0;
          this.userListInfo.list = list;
          return MessageBox.alert('你已拒绝该引荐')
        }).catch(err => {
          Indicator.close()
        })
      }
    },
     fetchList(
        {
          userId = "",
          isReset = false,
          isSearch = false,
          options = {},
          type = "agent", // agent | agentUser,
          searchKey = ""
        } = {}
      ) {
        let content = this.userListInfo
        let {
            isLoading = false,
            list = [],
            pageNum = 0,
            total = -1,
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
            let pageSize = 500;
            return findPendingReferrerListByUid({
              pageSize,
              pageNum: pageNum + 1
            })
              .then(res => {
                let tempList = [...list, ...res];
                Object.assign(content, {
                  list: tempList,
                  pageNum: res.length ? pageNum + 1 : pageNum,
                  total: res.length&&res.length>=pageSize ? -1 : tempList.length, //
                  isLoading: false
                });
              })
              .catch(err => {
                content.isLoading = false;
                throw err;
              });
          }
      },
    backToAgent() {
      this.$router.go(-1)
    },
    loadBottom() {
      let { isLoading = false, total = -1 } = this.userListInfo;
      if (!isLoading && total === -1) {
        this.fetchList({});
      } else {
        // this.$refs.loadmore.onBottomLoaded()
      }
    }
  },
};
</script>
<style lang='less' scoped>
section[class="agent-container"] {
  width: 100%;
  min-height: 100vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background: rgba(247, 247, 247, 1);
  .graph-container {
    background: #fff;
    width: 100%;
    display: flex;
    flex-direction: column;
    border-bottom: 2px solid rgba(224, 224, 224, 1);
    height: 6rem;
    overflow: hidden;
  }
    .header-info {
      width: 100vw;
      background: rgba(247,247,247,1);
      display: flex;
      justify-content: center;
      align-items: center;
      box-sizing: border-box;
      padding: 16px 32px;
      margin-bottom: 6px;
      & > select {
        width: 232px;
        height: 72px;
        opacity: 1;
        background: rgba(255, 255, 255, 1);
        border: 1px solid rgba(239, 239, 239, 1);
        border-radius: 8px;
        box-shadow: 0px 2px 0px 0px rgba(225, 225, 225, 0.5);
        font-size: 30px;
        line-height: 32px;
        color: rgba(54,54,54,1);
        font-weight: 600;
      }
      & > button {
        height: 60px;
        border: none;
        font-size: 28px;
        color: rgba(255,255,255,1);
        line-height: 30px;
        letter-spacing: 0.34px;
        background: rgba(199,0,10,1);
        padding: 0 20px;
        border-radius: 6px;
        overflow: hidden;
      }
    }
      & > button {
        height: 76px;
        width: 153px;
        border: none;
        font-size: 28px;
        color: rgba(255,255,255,1);
        line-height: 30px;
        letter-spacing: 0.34px;
        padding: 0 20px;
        border-radius: 16px;
        overflow: hidden;
        position: fixed;
        left: 0;
        bottom: 200px;
        background: url('https://img.mall.xc2018.com.cn/mall/upload/20190516/152726_18_diyh.png') no-repeat center / cover;
      }
}

@keyframes backOpacity {
  0% {
    opacity: 1;
  }
  25% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
  75% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}
.animation_opactiy {
  animation: backOpacity 2s ease-in-out infinite;
}
</style>
