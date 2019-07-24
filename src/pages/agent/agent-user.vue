<template>
  <section class="agent-container">
    <div
      class="graph-container"
      v-if="chatData.length"
    >
      <v-chart :data="chatData">
        <v-scale y :options="yOptions"/>
        <!-- <v-tooltip disabled /> -->
        <v-pie :radius="0.60" series-field="levelLabel"/>
         <v-legend :options="legendOptions" />
      </v-chart>
    </div>
        <sticky ref="sticky" top="0" left="0">
            <div class="header-info">
               <select v-model="agentLevel" @change="typeChanged">
                <option value="" selected>全部({{totalCount}})人</option>
                <option v-for="(option, index) in selectOptions" v-bind:value="option.level" :key="index">
                  {{ option.levelName }}
                </option>
              </select>
              <div style="flex: 1;"></div>
              <button @click="backToAgent">我的分销商</button>
            </div>
        </sticky>
      <agent-list v-bind="userListInfo" :scrollDisabled="scrollDisabled" :type="type" @loadBottom="loadBottom"></agent-list>
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
  VScale,
} from "vux";
import Sticky from "@/components/sticky"
import { createNamespacedHelpers } from 'vuex'
import { checkIsActive } from '@/api'
import AgentList from "./agent-list"
const { mapActions, mapMutations, mapGetters } = createNamespacedHelpers('salesData/agent')
export default {
  data() {
    return {
       results: [],
       type: "agentUser",
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
      },
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
    AgentList,
  },
  computed: {
    agentLevel: {
      set(value) {
        this.setAgentLevel({agentLevel: value, type: this.type})
      },
      get() {
        return this.$store.state.salesData.agent[this.type].agentLevel
      }
    },
    ...mapGetters({
      "agentUser": "agentUser"
    }),
    totalCount() {
      let options = this.$store.state.salesData.agent[this.type].selectOptions
      return options.length? options[0].totalCount: 0;
    },
   selectOptions() {
      return this.$store.state.salesData.agent[this.type].selectOptions;
    },
    chatData() {
      return this.$store.state.salesData.agent[this.type].selectOptions.filter(item => item.count);
    },
    userListInfo() {
      return this.$store.state.salesData.agent[this.type].userListInfo;
    },
    scrollDisabled() {
      return this.userListInfo.total!==-1;
    }
  },
   mounted() {
      if (this.type === "agent") {
      checkIsActive().then(res => {
        this.currentLevel = res.agentLevel;
      })
    }
    let { userId, userName } = { ...this.$route.params, ...this.$route.query };
    document.title = userName || "二级分销"
    this.setAgentUser(userId)
    this.fetchList({ isReset: true, type: "agentUser" });
    this.fetchStatistics({type: "agentUser"});
  },
  activated() {

  },
  methods: {
    //  ...mapActions('d2admin/account', [
    //   'logout'
    // ]),
    ...mapMutations({
      setAgentLevel: 'setAgentLevel', // 将 `this.add()` 映射为 `this.$store.commit('increment')`
      setAgentUser: 'setAgentUser'
    }),
    ...mapActions({
      fetchList: 'fetchAgentList',
       fetchStatistics: "fetchStatistics"
    }),
    typeChanged() {
      // Object.assign(this.userListInfo, {
      //   isSearch: false,
      //   isLoading: false,
      //   pageNum: 0,
      //   total: -1
      // });
      this.searchInput = ""
      this.isSearch = false;
      this.fetchList({ isReset: true, agentLevel: this.agentLevel, isSearch: this.isSearch, searchKey: this.searchInput, type: this.type, options: {startTime: this.startTime, endTime: this.endTime} });
    },
    loadTop() {},
    backToAgent() {
      this.$router.push({name: "agent", replace: true})
    },
    goPoster(isActive = 0, userId) {
      if (this.type === "agent" && !isActive) {
       this.$router.push({
            name: "poster",
            hash: "#" + userId,
            query: { type: "agent-add" }
        })
      }
    },
    openPicker(picker) {
      this.$refs[picker].open();
    },
    searchAction() {
     this.$router.push({name: "search-agent"})
    },
    loadBottom() {
      let { isLoading = false, total = -1 } = this.userListInfo;
      if (!isLoading && total === -1) {
        this.fetchList({ isSearch: this.isSearch, agentLevel: this.agentLevel, searchKey: this.searchInput, type: this.type, options: {startTime: this.startTime, endTime: this.endTime} });
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
