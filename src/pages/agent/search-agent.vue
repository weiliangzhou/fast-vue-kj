<!-- 查找我的直系代理 -->
<template>
  <section class="agent-container">
    <div class="serch-container">
      <div class="search-box">
        <form action="" @submit.prevent="onSubmit"><input
            type="search"
            autocomplete="off"
            v-model.trim="searchInput"
            placeholder="请输入分销手机号搜索"
            ref = "searchInput"
          /></form><button @click="onCancel">取消</button>
      </div>
      <agent-list
        v-bind="userListInfo"
        :scrollDisabled="scrollDisabled"
        type="agent"
        @loadBottom="loadBottom"
      ></agent-list>
    </div>
  </section>
</template>
<script>
import { createNamespacedHelpers } from "vuex";
import AgentList from "./agent-list";
import { Indicator } from "mint-ui"
import { Toast, resolveTimeout } from "@/global"; // resolveTimeout, rejectTimeout  getObject, MyError
const {
  mapActions,
  mapMutations
} = createNamespacedHelpers("salesData/agent");
export default {
  data() {
    return {
      isSearch: false, // 标记是否处于搜索
      searchInput: "", // 关键字
      routerFrom: "", // 前一个页面
      type: "searchAgent" // 标识 vuex里的存储key
    };
  },
  components: {
    AgentList,
  },
  mounted() {
    this.clearAgent(this.type)
  },
  computed: {
    userListInfo() {
      return this.$store.state.salesData.agent[this.type].userListInfo;
    },
    scrollDisabled() {
      return this.userListInfo.total !== -1 || this.userListInfo.isLoading;
    },
    serchList() {
      return this.$store.state.salesData.agent[this.type].userListInfo
        .searchList;
    },
    searchViewIsShow() {
      return this.$store.state.salesData.agent[this.type].showSearch;
    }
  },
  methods: {
    ...mapMutations({
        "clearAgent": "clearAgent"
    }),
     // search 事件回调
    onSubmit() {
      Indicator.open()
      Promise.all([this.fetchList({
        isReset: true,
        agentLevel: this.agentLevel,
        isSearch: this.isSearch,
        searchKey: this.searchInput,
        type: this.type,
        options: { startTime: this.startTime, endTime: this.endTime }
      }), resolveTimeout(1)]).then(res => {
        Indicator.close()
      }).catch(err => {
        Toast(err)
        Indicator.close()
      });
    },
     // 取消回调
    onCancel() {
      if (this.searchInput) {
        this.searchInput = "";
        this.$refs.searchInput.focus()
      } else {
          this.$router.go(-1)
      }
    },
    ...mapActions({
      fetchList: "fetchAgentList",
    }),
     // 下来加载
    loadBottom() {
      let { isLoading = false, total = -1, list = [] } = this.userListInfo;
      if (!isLoading && total === -1 && list.length) {
        this.fetchList({
          isSearch: this.isSearch,
          agentLevel: this.agentLevel,
          searchKey: this.searchInput,
          type: this.type,
          options: { startTime: this.startTime, endTime: this.endTime }
        });
      } else {
        // this.$refs.loadmore.onBottomLoaded()
      }
    }
  },
   activated() {
    this.$nextTick().then(res => {
       this.clearAgent(this.type)
    });
  }
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
  width: 100vw;
  .serch-container {
    width: 100%;
    min-height: 100vh;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    background: rgba(247, 247, 247, 1);
    .search-box {
      width: 100%;
      display: flex;
      background: rgba(225, 225, 225, 0.5);
      padding: 14px 16px;
      overflow: hidden;
      box-sizing: border-box;
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
<style>
.weui-search-bar__input {
  pointer-events: none !important;
  -webkit-user-select: auto !important;
}
</style>
