<!--  -->
<template>
  <div class="data-detail">
    <detail-top></detail-top>
    <div class="main">
      <!-- 卡片概括 -->
      <div class="data cardData" v-if="cardData1.length">
        <h4>—— 新增卡片趋势 ——</h4>
        <v-chart prevent-default :data="cardData1">
          <v-scale x :tick-count="6" />
          <v-scale y :tick-count="15" />
          <v-line shape="smooth" series-field="type" />
        </v-chart>
      </div>
      <!-- 卡片概括 -->
      <!-- <div class="data cardData">
        <h4>—— 发卡概况 ——</h4>
        <v-chart prevent-default :data="cardData2">
          <v-scale x :tick-count="6" />
          <v-scale y :tick-count="15" />
          <v-line shape="smooth" series-field="type" />
        </v-chart>
      </div> -->
      <!-- 交易金额 -->
      <div class="data orderData">
        <h4>—— 新增交易金额趋势 ——</h4>
        <div class="goodsId">
          <select name="goodsId" v-model='selectData'>
            <option v-for="(item, index) in goodsIdOption" :key="index" :value="item.key">{{item.value}}</option>
          </select>
        </div>
        <v-chart ref="demo" :data="orderData">
          <v-bar />
          <v-scale x :tick-count="6" />
          <v-scale y :tick-count="15" />
          <v-tooltip :show-item-marker="false" />
        </v-chart>
      </div>
      <!-- 登记概括 -->
      <!-- <div class="data levelData">
        <h4>—— 等级概况 ——</h4>
        <v-chart :data="levelData" :padding="['auto', 'auto']" ref="levelData">
          <v-tooltip :disabled="true" />
          <v-scale y :options="yOptions" />
          <v-pie :radius="0.85" :inner-radius="0.7" series-field="name" :colors="['#FE5D4D','#3BA4FF','#737DDE','#E175E2']" />
          <v-legend :options="legendOptions" />
        </v-chart>
      </div> -->

    </div>
    <!-- <div class="main hide">
      <div class="cardMain">
        <h4>—— 数据总览 ——</h4>
        <ul>
          <li>
            <p>{{totalData.activateCard}}</p>
            <span>开卡数(张)</span>
          </li>
          <li>
            <p>{{totalData.sendCard}}</p>
            <span>发卡数(张)</span>
          </li>
          <li>
            <p>{{totalData.xzNum}}</p>
            <span>校长数(人)</span>
          </li>
          <li>
            <p>{{totalData.yzNum}}</p>
            <span>院长数(人)</span>
          </li>
          <li>
            <p>{{totalData.cyjlNum}}</p>
            <span>教练数(人)</span>
          </li>
          <li>
            <p>{{totalData.vipNum}}</p>
            <span>VIP会员数(人)</span>
          </li>
          <li>
            <p>{{totalData.orderNum}}</p>
            <span>订单数(个)</span>
          </li>
          <li>
            <p>{{totalData.orderAmount}}</p>
            <span>交易金额数(元)</span>
          </li>
          <li>
            <p>{{totalData.preBindingNum}}</p>
            <span>预约绑定用户数(人)</span>
          </li>
          <li>
            <p>{{totalData.registerNum}}</p>
            <span>用户数(人)</span>
          </li>
        </ul>
      </div>
    </div> -->
    <mine-footer></mine-footer>
  </div>
</template>

<script>
import { getGoodsList, getTradeDetail } from "@/api";
import { Toast, getUserInfo } from "@/global"
import MineFooter from '../tabs.vue'
import detailTop from '@/v0.7/reportForms/data-detail/detailTop.vue'
import { VChart, VLine, VArea, VBar, VPie, VPoint, VScale, VAxis, VGuide, VTooltip, VLegend } from 'vux'

export default {
  data() {
    return {
      cardData: [ // 卡片概括数据
        { date: "2010-01-10", type: "能源", value: 99.9 }
      ],
      orderData: [ // 交易金额数据
        { year: '1951 年', sales: 38 }
      ],
      // 底部展示数据
      totalData: {
      },
      //   环图数据
      levelData: [
        { name: '教练', percent: 83.59, a: '1' }
      ],
      Lvmap: {},
      htmlOptions: {
        position: ['50%', '45%'],
        html: `
          <div style="width: 250px;height: 40px;text-align: center;">
            <div style="font-size: 16px">总资产</div>
            <div style="font-size: 24px">133.08 亿</div>
          </div>`
      },
      legendOptions: {
        position: 'left',
        itemFormatter: (val) => {
          return val + " " + this.Lvmap[val]
        }
      },
      yOptions: {
        formatter(val) {
          return val * 100 + '%'
        }
      },
      //   环图数据
      goodsIdOption: [
        {
          key: "",
          value: '全部商品'
        }
      ],
      selectData: ''
    }
  },
  computed: {
    doneData() {
      return this.$store.state.reportFormsSearchData.doneData
    },
    cardData1() {
      return this.cardData.filter(item => item.type === "开卡数")
    },
    cardData2() {
      return this.cardData.filter(item => item.type !== "开卡数")
    }
  },
  watch: {
    selectData(newVal, oldVal) {
      if (newVal != oldVal) {
        this.$store.state.reportFormsSearchData.searchData.goodsId = newVal
        this.getOrdersData()
      }
    },
    doneData(newVal, oldVal) {
      this.totalData = newVal.totalFactsVo // √

      // 格式化cardFactsVoList为可用数据
      let ActivateCardNum = []
      let newSendCardNum = []
      newVal.cardFactsVoList.map((item, index) => {
        //   { date: "2010-01-10", type: "能源", value: 99.9 },
        ActivateCardNum.push({
          date: item.day.split(' ')[0].split("-").slice(1, 3).join("-"),
          type: '开卡数',
          value: item.newActivateCardNum
        })
        newSendCardNum.push({
          date: item.day.split(' ')[0].split("-").slice(1, 3).join("-"),
          type: '发卡数',
          value: item.newSendCardNum
        })
      })
      this.cardData = ActivateCardNum.concat(newSendCardNum) // √
      //   this.orderData = newVal.orderFactsVoList
      //   { year: '1951 年', sales: 38 },
      this.orderData = newVal.orderFactsVoList.map((item, index) => { // √
        return {
          year: item.day.split(" ")[0].split("-").slice(1, 3).join("-"),
          sales: item.amount
        }
      })
      //   this.levelData = newVal.levelFactsVo
      // { name: '现金类', percent: 14.24, a: '1' }
      //   this.levelData = [
      //     { name: '教练', percent: Math.floor(newVal.levelFactsVo.cyjlPercent * 100), a: '1' },
      //     { name: '会员', percent: Math.floor(newVal.levelFactsVo.vipPercent * 100), a: '1' },
      //     { name: '校长', percent: Math.floor(newVal.levelFactsVo.xzPercent * 100), a: '1' },
      //     { name: '院长', percent: Math.floor(newVal.levelFactsVo.yzPercent * 100), a: '1' },
      //   ] // √
      //   this.levelData.map(obj => {
      //     this.Lvmap[obj.name] = obj.percent + '%'
      //   })
      //   this.$refs.levelData.rerender()
    }
  },

  components: {
    MineFooter,
    detailTop,
    VChart,
    VLine,
    VArea,
    VBar,
    VPie,
    VPoint,
    VScale,
    VAxis,
    VGuide,
    VTooltip,
    VLegend
  },
  beforeRouteEnter(to, from, next) {
    // ...
    if (getUserInfo().userRoles.find(item => { return item.roleName == 'admin' })) {
      next()
    } else {
      next({
        name: 'home'
      })
    }
  },
  mounted() {
    //  获取下拉选择商品列表
    getGoodsList({
      productType: 5
    }).then((res) => {
      res.data.map(item => {
        this.goodsIdOption.push(item)
      })
    }).catch((rej) => {

    })
  },

  methods: {
    getOrdersData() {
      let data = {
        startTime: new Date(this.$store.state.reportFormsSearchData.searchData.startTime).getTime(),
        endTime: new Date(this.$store.state.reportFormsSearchData.searchData.endTime).getTime(),
        goodsId: this.$store.state.reportFormsSearchData.searchData.goodsId,
        days: this.$store.state.reportFormsSearchData.searchData.days
      }
      if (data.days) {
        delete data.startTime
        delete data.endTime
      } else {
        delete data.days
      }

      getTradeDetail(data).then(res => {
        this.$store.state.reportFormsSearchData.doneData = res.data
      }).catch((rej) => {
        Toast(rej)
      })
    }
  }
}

</script>
<style lang='less' scoped>
.data-detail {
  background: #f7f7f7;
  overflow: hidden;
  padding-bottom: 110px;
}
.main {
  margin: 0 auto;
  background: #fff;
  text-align: center;
  overflow: hidden;
  margin-bottom: 20px;
  .data {
    width: 702px;
  }
  .data h4 {
    font-size: 34px;
    color: #363636;
    line-height: 48px;
    margin-top: 30px;
  }
}
.cardMain h4 {
  font-size: 34px;
  color: #363636;
  line-height: 48px;
  margin-top: 30px;
  margin-bottom: 34px;
}
.cardMain ul {
  width: 100%;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  li {
    width: 50%;
    flex: 1;
    min-width: 50%;
    max-width: 50%;
    margin-bottom: 64px;
    p {
      opacity: 1;
      font-size: 36px;
      //   font-family: Impact;
      font-weight: bold;
      color: rgba(54, 54, 54, 1);
      line-height: 44px;
    }
    span {
      font-size: 26px;
      font-family: PingFangSC;
      color: rgba(101, 101, 101, 1);
      line-height: 37px;
    }
  }
}
.goodsId {
  text-align: left;
  width: 232px;
  height: 56px;
  opacity: 1;
  background: rgba(243, 243, 243, 1);
  border-radius: 8px 8px 8px 8px;
  border: 1px solid #c5c5c5; /* no */
  margin-left: 24px;
  margin-top: 33px;
  padding-left: 20px;
  select,
  option {
    display: block;
    width: 100%;
    height: 100%;
    background: none;
    border: none;
    box-shadow: none;
    text-align: center;
  }
}
</style>
