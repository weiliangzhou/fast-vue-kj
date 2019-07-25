<template>
  <section id="agent-container">
    <ul class="header-container">
      <li
        class="test-tab"
        v-for="item in typesOption"
        :key="item.id"
      >
        <input
          type="radio"
          :id="item.id"
          name="test-radio"
          :value="item.value"
          v-model="active"
        >
        <label :for="item.id">{{item.label}}</label>
      </li>
    </ul>
    <mt-tab-container
      class="page-tabbar-tab-container column-flex"
      v-model="active"
    >
      <mt-tab-container-item
        id="agent"
        class="column-flex"
      >
        <div class="bottom-continer">
          <div class="sticky-container">
            <sticky
              ref="sticky"
              top="0"
              left="0"
            >
              <div class="filter-options">
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
                  <div style="flex: 1;"></div>
                  <button @click="addagent(1)">新增VIP</button><button
                    v-if="currentLevel>200"
                    @click="addagent(0)"
                  >新增分销</button>
                </div>
                <div class="searchPhone">
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
      </mt-tab-container-item>
      <mt-tab-container-item id="referrer">
        <div class="bottom-continer">
          <div class="sticky-container">
            <sticky
              ref="sticky"
              top="0"
              left="0"
            >
              <div class="filter-options">
                <div class="header-info">
                  <h5>总数{{referrerList.totalNum}}人</h5>
                  <div style="flex: 1;"></div>
                  <button
                    @click="goReciveAgent"
                    style="position: relative; overflow: visible"
                  >审核托管
                    <span
                      v-if="badge"
                      class="badge"
                      style="font-size: 12px;height: 16px;line-height: 16px;border-radius: 8px;padding: 0 4px;"
                    >{{badge}}</span>
                  </button>
                  <button @click="goReferrerRecord">申请托管</button>
                </div>
              </div>
            </sticky>
          </div>
          <agent-list
            v-bind="referrerList"
            :scrollDisabled="referrerListScrollDisabled"
            :type="type"
            @loadBottom="loadBottomReferrer"
            :shouldShowAddress="false"
          ></agent-list>
        </div>
      </mt-tab-container-item>
      <mt-tab-container-item id="statis">
        <div class="static-container">
          <div class="bar-container">
            <ul
              v-for="(barItem, idx) in barInfo"
              :key="idx"
            >
              <h5>{{barItem.title}}</h5>
              <li
                v-for="(item, index) in barItem.list"
                class="bar-item"
                :key="index"
              >
                <div>
                  <div :style="`background: rgba(98,170,252,1);flex: ${item.count};`"></div>
                  <div :style="`flex: ${barMax-item.count}`"></div>
                </div>
                <span class="ellipsis_1">{{item.label}} {{item.count}}人</span>
              </li>
            </ul>
          </div>
        </div>
        <div
          class="graph-container"
          v-if="sectorData.length"
        >
          <h5>我的分销城市主要分布</h5>
          <v-chart :data="sectorData">
            <v-scale
              y
              :options="yOptions"
            />
            <v-tooltip />
            <v-pie
              :radius="0.80"
              series-field="areaLabel"
            />
            <v-legend :options="legendOptions" />
          </v-chart>
        </div>
      </mt-tab-container-item>
    </mt-tab-container>
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
import { TabContainer, TabContainerItem } from 'mint-ui';
import { createNamespacedHelpers } from "vuex";
import {
  checkIsActive,
  findPendingReferrerNumByUid,
  getMyDirectAgentList,
  findAgencyRegionStatisticsVo,
  findAgentNumStatistics
} from "@/api";
import AgentList from "./agent-list";
const { mapActions, mapMutations } = createNamespacedHelpers("salesData/agent");
export default {
  data() {
    return {
      badge: 0,
      active: "agent",
      type: "agent",
      routerFrom: "",
      currentLevel: "",
      typesOption: [
        { label: "我的分销商", id: 1, value: "agent" },
        { label: "托管分销", id: 2, value: "referrer" },
        { label: "分销报表", id: 3, value: "statis" }
      ],
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
      barMax: 0,
      barInfo: [
        {
          max: 0,
          title: "",
          list: []
        }
      ],
      sectorData: [],
      referrerList: {
        isSearch: false,
        isLoading: false,
        startTime: "",
        endTime: "",
        list: [],
        pageNum: 0,
        total: -1,
        totalNum: 0
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
    AgentList,
    [TabContainer.name]: TabContainer,
    [TabContainerItem.name]: TabContainerItem
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
    // referrerList() {
    //   return this.referrerList;
    // }
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
    beforeToggle() {
      console.log("siema");
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
    goReferrerRecord() {
      this.$router.push({
        name: "referrer-record"
      });
    },
    searchAction() {
      this.$router.push({ name: "search-agent" });
    },
    loadBottomReferrer() {
      let { isLoading = false, total = -1, list = [] } = this.userListInfo;
      if (!isLoading && total === -1 && list.length) {
        this.fetchReferrerList({ type: this.type });
      } else {
        // this.$refs.loadmore.onBottomLoaded()
      }
    },
    loadBottom() {
      if (this.$route.name !== "agent") {
          return;
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
    // 获取托管列表
    fetchReferrerList({ isReset = false } = {}) {
      let content = this.referrerList
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
        return getMyDirectAgentList(
          {
            pageSize,
            pageNum: pageNum + 1,
            agentLevel: -1,
            searchKey: ""
          },
          true
        )
          .then(({ items: res = [], totalNum = 0, ...reset }) => {
            res = res.map(({ saleUser, ...resetOptions }) => {
              return { ...saleUser, ...resetOptions, isIntroduced: true };
            });

            let tempList = [...list, ...res];
            Object.assign(content, {
              list: tempList,
              pageNum: res.length ? pageNum + 1 : pageNum,
              total:
                res.length && res.length >= pageSize ? -1 : tempList.length, //
              isLoading: false,
              totalNum: totalNum
            });
          })
          .catch(err => {
            content.isLoading = false;
            throw err;
          });
      }
    }
  },
  activated() {
      var hash = this.$route.params.active;
      if (['agent', 'referrer', 'statis'].includes(hash)) {
        this.active = hash;
      }
    this.$nextTick().then(res => {
      // let { list = [] } = this.userListInfo;
      // if (this.routerFrom === "agent-add" || this.routerFrom === "agent-add" || list.length === 0) {
      //   this.fetchStatistics();
      // }
      this.fetchStatistics();
      findPendingReferrerNumByUid().then(res => {
        this.badge = Number(res);
      });
      this.fetchReferrerList({ isReset: true });
      this.fetchList({ isReset: true, type: "agent" });
      findAgentNumStatistics().then(res => {
        this.barInfo = res;
        this.barMax = Math.max.apply(
          null,
          res.reduce((prev, cur) => {
            return [...prev, ...cur.list.map(item => item.count)];
          }, [])
        );
      })
      findAgencyRegionStatisticsVo().then(res => {
        let sum = res.reduce((prev, cur) => {
            return prev + cur.areaCount;
          }, 0)
        this.sectorData = res.map(item => {
          item.areaLabel = `${item.areaName}: ${item.areaCount}`
          item.percent = item.areaCount / sum;
          return item;
        }).slice(0, 7);
      })
    });
  }
};
</script>
<style lang='less' scoped>
section[id="agent-container"] {
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
    height: 8rem;
    overflow: hidden;
    h5 {
      height: 37px;
      font-size: 26px;
      font-family: PingFangSC;
      color: rgba(54,54,54,1);
      line-height: 37px;
      letter-spacing: 0.31px;
      margin: 32px 0 0 24px;
    }
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
      background: rgba(247, 247, 247, 1);
      // border-top: 16px solid rgba(247, 247, 247, 1);
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
        margin: 20px 0 0;
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
          background: #fff;
          margin-right: 30px;
          margin-left: 30px;
          border-radius: 12px;
          border: 1px solid #e9e9e9; /* no */
        }
      }
    }
  }
}
.badge {
  display: inline-block;
  text-align: center;
  background: #f74c31;
  color: rgba(199, 0, 10, 1);
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
  transform: translate(50%, -50%);
  border: 1px solid rgba(197, 197, 197, 1); /*no*/
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

.column-flex {
  display: flex;
  flex-direction: column;
  flex: 1;
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
.header-container {
  display: flex;
  justify-content: space-around;
  background: rgba(255, 255, 255, 1);
  border-bottom: 1px solid rgb(218, 216, 216);
  padding: 20px 32px 0px;
  box-sizing: border-box;
  height: 90px;
  & > li {
    display: inline-block;
    position: relative;
    width: 33.3%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    label {
      display: inline-block;
      text-align: center;
      font-size: 32px;
      line-height: 50px;
      box-sizing: border-box;
      opacity: 1;
      font-weight: 400;
      color: rgba(101, 101, 101, 1);
      height: 100%;
    }
  }
  input {
    position: absolute;
    top: 0;
    right: 0;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    border-width: 0;
    opacity: 0;
    &:checked ~ label {
      position: relative;
      display: inline-block;
      text-align: center;
      font-size: 32px;
      line-height: 34px;
      box-sizing: border-box;
      opacity: 1;
      line-height: 50px;
      font-weight: 600;
      color: rgba(50, 50, 50, 1);
      height: 100%;
      &:after {
        width: 52px;
        content: "";
        border-radius: 10px;
        display: block;
        position: absolute;
        right: 50%;
        transform: translate(50%, 0); /* 使用css3的transform来实现 */
        height: 4px;
        background: #D7B686;
        bottom: 1px;
      }
    }
  }
}

.static-container {
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  .bar-container {
    margin: 20px 0;
    border-radius: 12px;
    background: rgba(255, 255, 255, 1);
    padding: 32px;
    ul {
      margin-bottom: 20px;
      h5 {
        height: 37px;
        opacity: 1;
        font-size: 26px;
        font-family: PingFangSC;
        color: rgba(54, 54, 54, 1);
        line-height: 37px;
        margin-left: 26px;
        margin-bottom: 6px;
      }
      li {
        margin-bottom: 16px;
        height: 34px;
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
}
.bar-item {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  & > div {
    flex: 1;
    display: flex;
    height: 100%;
    background: rgba(153, 153, 153, 0.3);
  }
  & > span {
      width: 230px;
      height: 100%;
      opacity: 1;
      font-size: 24px;
      font-family: PingFangSC;
      color: rgba(152, 152, 152, 1);
      line-height: 33px;
      margin-left: 12px;
  }
}
</style>

<style>
#agent-container >>> .mint-tab-container-wrap {
  display: flex;
  flex-direction: column;
  flex: 1;
}
</style>
