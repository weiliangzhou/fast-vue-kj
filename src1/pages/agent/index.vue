<template>
  <section class="agent-container">
    <div
      class="graph-container"
      v-if="chatData.length"
    >
      <v-chart :data="chatData">
        <v-scale
          y
          :options="yOptions"
        />
        <!-- <v-tooltip disabled /> -->
        <v-pie
          :radius="0.60"
          series-field="levelLabel"
        />
        <v-legend :options="legendOptions" />
      </v-chart>
    </div>
    <div class="bottom-continer">
      <div class="sticky-container">
        <sticky
          ref="sticky"
          top="0"
          left="0"
        >
          <div class="filter-options">
            <div class="header-info">
              <div style="flex: 1;"></div>
              <button @click="goReciveAgent" style="position: relative; overflow: visible">审核分销
                <span v-if="badge" class="badge" style="font-size: 12px;height: 16px;line-height: 16px;border-radius: 8px;padding: 0 4px;">{{badge}}</span>
                </button><button @click="goRecommendAgent">申请分销</button>
              <button @click="addagent(1)">新增VIP</button><button v-if="currentLevel>=200" @click="addagent(0)">新增分销</button>
            </div>
            <div class="searchPhone">
                              <select
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
              <button
                id="searchInput"
                type="button"
                @click="searchAction"
                placeholder="请输入手机号"
              >手机号搜索</button>
            </div>
          </div>
        </sticky>
      </div>
      <agent-list
        v-bind="userListInfo"
        :scrollDisabled="scrollDisabled"
        :type="type"
        @loadBottom="loadBottom"
      ></agent-list>
    </div>
  </section>
</template>
<script>
import {
  VChart,
  VLine,
  VArea,
  VTooltip,
  VLegend,
  VBar,
  VPie,
  VScale
} from "vux";
import Sticky from "@/components/sticky";
import { createNamespacedHelpers } from "vuex";
import { checkIsActive, findPendingReferrerNumByUid } from "@/api";
import AgentList from "./agent-list";
const { mapActions, mapMutations } = createNamespacedHelpers("salesData/agent");
export default {
  data() {
    return {
      badge: 0,
      type: "agent",
      routerFrom: "",
      currentLevel: "",
      legendOptions: {
        position: "right",
        itemFormatter(val) {
          return val;
        }
      },
      yOptions: {
        formatter(val) {
          return val * 100 + "%";
        }
      }
    };
  },
  components: {
    Sticky,
    VChart,
    VLine,
    VArea,
    VTooltip,
    VLegend,
    VBar,
    VPie,
    VScale,
    AgentList
  },
  mounted() {
    if (this.type === "agent") {
      checkIsActive().then(res => {
        this.currentLevel = res.agentLevel;
      });
    }
  },
  computed: {
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
      return [...this.$store.state.salesData.agent[this.type].selectOptions, {levelName: "托管分销商", level: -1}];
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
      return this.userListInfo.total !== -1;
    },
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
    goPoster(isActive = 0, userId) {
      if (this.type === "agent" && !isActive) {
        this.$router.push({
          name: "poster",
          hash: "#" + userId,
          query: { type: "agent-add" }
        });
      }
    },
    goReciveAgent() {
       this.$router.push({
          name: "recive-agent"
        });
    },
    goRecommendAgent() {
       this.$router.push({
          name: "recommend-agent"
        });
    },
    searchAction() {
      this.$router.push({ name: "search-agent" });
    },
    loadBottom() {
      let { isLoading = false, total = -1, list = [] } = this.userListInfo;
      if (!isLoading && total === -1 && list.length) {
        this.fetchList({type: this.type});
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
    }
  },
  activated() {
    this.$nextTick().then(res => {
      let { list = [] } = this.userListInfo;
      if (this.routerFrom === "agent-add" || list.length === 0) {
        //
      }
      this.fetchStatistics();
      findPendingReferrerNumByUid().then(res => {
        this.badge = Number(res)
      })
      this.fetchList({ isReset: true, type: "agent" });
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
  height: 100%;
  .graph-container {
    background: #fff;
    width: 100%;
    display: flex;
    flex-direction: column;
    border-bottom: 2px solid rgba(224, 224, 224, 1);
    height: 6rem;
    overflow: hidden;
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
      padding: 16px 0;
      border-top: 16px solid rgba(247, 247, 247, 1);
      border-bottom: 16px solid rgba(247, 247, 247, 1);
      width: 100vw;
      .header-info {
        width: 100%;
        background: #fff;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        box-sizing: border-box;
        padding: 16px 20px;
        & > button {
          height: 60px;
          flex: 1;
          flex: 0 0 22%;
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

      .searchPhone {
        width: 100%;
        display: flex;
        height: 72px;
        background: #fff;
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
          color: rgba(54, 54, 54, 1);
          font-weight: 600;
        }
        button {
          flex: 1;
          height: 72px;
          font-size: 32px;
          font-weight: Regular;
          color: rgba(153, 153, 153, 1);
          line-height: 45px;
          letter-spacing: -0.77px;
          text-align: center;
          border-width: 0;
          box-sizing: border-box;
          background: #fff;
          margin-right: 30px;
          margin-left: 20px;
          border-radius: 12px;
          background: rgba(242, 242, 242, 1);
        }
      }
    }
  }
}
.badge {
  display: inline-block;
    text-align: center;
    background: #D7B686;
    background: #fff;
    font-size: 12px;
    height: 16px;
    line-height: 16px;
    border-radius: 8px;
    padding: 0 6px;
    // background-clip: padding-box;
    vertical-align: middle;
    position: absolute;
    top: 0;
    right: 0;
    transform:translate(50%, -50%);
    // border: 1px solid rgba(197,197,197,1); /*no*/
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
