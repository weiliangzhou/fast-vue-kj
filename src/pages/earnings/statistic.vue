<template>
  <section id="statistic-view">
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
import {
  findAgencyRegionStatisticsVo,
  findAgentNumStatistics,
  checkIsActive
} from "@/api";

export default {
  data() {
    return {
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
      barMax: 0,
      barInfo: [
        {
          max: 0,
          title: "",
          list: []
        }
      ],
      sectorData: []
    };
  },
  components: {
    VChart,
    VLine,
    VArea,
    VTooltip,
    VLegend,
    VBar,
    VPie,
    VScale,
  },
  mounted() {
    if (this.type === "agent") {
      checkIsActive().then(res => {
        this.currentLevel = res.agentLevel;
      });
    }
    this.fetchData()
  },
  methods: {
    fetchData() {
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
    }
  },
  activated() {

  }
};
</script>
<style lang='less' scoped>
section[id="statistic-view"] {
  flex: 1;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background: rgba(247, 247, 247, 1);
  width: 100%;
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
