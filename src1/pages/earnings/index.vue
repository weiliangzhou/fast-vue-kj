<!-- 收益 -->
<template>
  <section id="earnings-page" v-bind:style="{ minHeight: earningsViewType==='promise'? '100vh' : 'auto' }">
    <!-- <ul
      class="tabs-container"
      v-if="tabsOptions.length > 1"
    >
      <li
        class="test-tab"
        v-for="item in tabsOptions"
        :key="item.id"
      >
        <input
          type="radio"
          :id="item.id"
          name="test-radio"
          :value="item.key"
          v-model="earningsType"
          @change="checkedChange"
        >
        <label :for="item.id"><span>{{item.label}}</span></label>
      </li>
    </ul> -->
    <div class="top-bar-container">
      <button v-if="earningsViewType==='promise'" @click="regularTipsIsShow=true"><span>收益说明</span><span>?</span></button>
      <h6>{{currentStatisLabel.totalLabel}}</h6>
      <h4>{{currentStatis.totalCount}}{{eraningsUnit}}</h4>
      <!-- <p>历史总收益 ¥{{currentStatis.}}</p> -->
      <ul>
        <!-- <li><span>在线购买VIP</span><span>12</span></li> -->
        <li><span>{{currentStatisLabel.todayLabel}}</span><span>{{currentStatis.todayCount}}{{eraningsUnit}}</span></li>
        <li><span>{{currentStatisLabel.monthLabel}}</span><span>{{currentStatis.monthCount}}{{eraningsUnit}}</span></li>
      </ul>
    </div>
    <sticky
      ref="sticky"
      top="0"
      left="0"
    >
      <div class="list-title">
        <span>{{listTitle}}</span>
        <span style="flex: 1"> </span>
        <select
          class="select-option"
          v-model="tempMonth"
          @change="typeChanged"
          :size="1"
        >
          <option
            value=""
            selected
          >全部</option>
          <option
            v-for="(option, index) in monthOptions"
            v-bind:value="option"
            :key="index"
          >
            {{ option }}
          </option>
        </select>
      </div>
    </sticky>
    <div class="list-container">
      <ul
        v-show="currentList.length"
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="isLoading"
        :infinite-scroll-immediate-check="true"
        infinite-scroll-distance="10"
      >
      <!-- 产品收益的列表结构 -->
        <template v-if="earningsType==`promise`" >
          <ol v-for="item in currentList" :key="item.id" @click="goDetail(item)" class="promise">
            <li>
              <span class="ellipsis_1">{{item.userName}}</span>
              <span>{{item.levelName}}</span>
              <span style="flex:1"></span>
              <span>{{item.count}}{{eraningsUnit}}</span>
            </li>
            <li><span style="flex:1">{{item.productName}}</span><span v-if="Number(item.state || 0) > 2" style="color: #989898;">{{item.stateDesc}}</span></li>
            <li><span>{{item.createdAt}}</span><span></span>
            </li>
          </ol>
        </template>
<!-- 非产品收益的列表结构 -->
        <template v-else>
          <ol v-for="item in currentList" :key="item.id" @click="goDetail(item)" class="not-promise">
            <li>
              <span class="ellipsis_1">{{item.userName}}</span>
              <span>{{item.levelName}}</span>
              <span style="flex:1"></span>
              <span>{{item.createdAt | dataFormat("MM/dd")}}</span>
            </li>
            <li>
              <span>{{item.productName}}</span>
              <span>{{item.count}}{{eraningsUnit}}</span>
            </li>
          </ol>
        </template>
        <p v-show="listTotal!==-1">没有更多的数据了</p>
      </ul>
      <no-more v-show="currentList.length === 0"></no-more>
    </div>
    <p class="staticAllMOney">{{tempMonth?'当月':''}}{{currentMonthMoney}}{{eraningsUnit}}</p>
    <section
      v-if="regularTipsIsShow"
      class="pop-container"
    >
      <div class="regular-container">
        <h5>收益说明</h5>
        <ul>
          <li>1 . 每笔收益是分销商直属用户购买之后第二天进行统计。</li>
          <li>2 . 该数据供分销商作为预估收益统计 , 以下数据为分销商直属用户成交对账明细。</li>
        </ul>
        <button @click="regularTipsIsShow=false;">知道了</button>
      </div>
    </section>
  </section>
</template>

<script>
// import { findSaleUserBillList, addUserDraw, getBankInfo, getUserWallet } from "@/api"
import { Toast, MyError } from "@/global"; // resolveTimeout, rejectTimeout, getObject,
import Sticky from "@/components/sticky";
import {
  getOrderStatis,
  getCardStatis,
  findOrderAllotList,
  getAllCardOrderList,
  getMonthTotalMoney,
  findExtendCardOrderList,
  getExtendCardCount
} from "@/api";
let initYear = 2018;
let currentDate = new Date();
// let curMonth = [currentDate.getFullYear(), currentDate.getMonth() + 1].join(
//   "-"
// );
let years = currentDate.getFullYear() - initYear;
let allMonths = Array.from({ length: years > 0 ? years : 0 }, (item, index) => {
  let currentMonth = new Date().getMonth() + 1;
  let curMonths = Array.from({ length: currentMonth }, (month, idx) => [
    initYear + index + 1,
    idx + 1
  ]);
  return curMonths;
})
  .reduce(
    (prevalue, item) => {
      return [...prevalue, ...item];
    },
    [[2018, 12]]
  )
  .map(item => item.join("-")).reverse();
export default {
  props: {
    earningsViewType: {
      type: String,
      required: true,
      default: "card"
    }
  },
  data() {
    return {
      regularTipsIsShow: false,
      active: "",
      typesOption: [
        { label: "产品收益", key: "promise" },
        { label: "售卡收益", key: "card" },
        { label: "托管收益", key: "referrer" }
      ],
      earningsType: "promise", // 收益类型标注
      promise_earnings: {
        // 预估收益
        isLoading: false, // 是否在请求中
        list: [], // 数据保存数组
        pageNum: 0, // 当前页码
        statsDate: "", // 当前月份
        total: -1, // 数据总数 标识分页是否还有数据， -1 表示还有下一页
        totalMoneyCurrentMonth: 0, // 当前月份的总统计
        statis: {
          todayCount: 0, // 当前收益类型的昨日收益
          monthCount: 0, // 当前收益类型的本月
          totalCount: 0 // 当前收益类型的总收益
        }
      },
      card_earnings: {
        // 售卡收益
        isLoading: false,
        list: [],
        pageNum: 0,
        statsDate: "",
        total: -1,
        totalMoneyCurrentMonth: 0,
        statis: {
          todayCount: 0,
          monthCount: 0,
          totalCount: 0
        }
      },
      referrer_earnings: {
        // 推广收益
        isLoading: false,
        list: [],
        pageNum: 0,
        statsDate: "",
        total: -1,
        totalMoneyCurrentMonth: 0,
        statis: {
          todayCount: 0,
          monthCount: 0,
          totalCount: 0
        }
      },
      popupVisible: false, // 选择日期的是否显示
      tempMonth: "", // 保存当前月份
      monthOptions: [...allMonths]
    };
  },
  components: { Sticky },

  computed: {
    currentDate() {
      let type = this.earningsType;
      let { statsDate } = this[type + "_earnings"];
      return statsDate;
    },
    currentList() {
      let type = this.earningsType;
      let { list = [] } = this[type + "_earnings"];
      return list;
    },
    // 当前类型收益是否在加载中
    isLoading() {
      let type = this.earningsType;
      let { isLoading, total } = this[type + "_earnings"];
      return isLoading || total !== -1;
    },
    listTotal() {
      let type = this.earningsType;
      let { total } = this[type + "_earnings"];
      return total;
    },
    currentMonthMoney() {
      let type = this.earningsType;
      let { totalMoneyCurrentMonth } = this[type + "_earnings"];
      return totalMoneyCurrentMonth;
    },
    tabsOptions() {
      return this.earningsViewType == "card"
        ? [
            { label: "售卡收益", key: "card" },
            { label: "托管收益", key: "referrer" }
          ]
        : [{ label: "产品收益", key: "promise" }];
    },
    // 收益类型对应的统计单位
    eraningsUnit() {
      return {
        promise: "元",
        card: "张",
        referrer: "张"
      }[this.earningsType];
    },
    listTitle() {
      return {
        promise: "收益列表",
        card: "售卡列表",
        referrer: "托管列表"
      }[this.earningsType];
    },
    // 当前收益类型的 文本显示
    currentStatis() {
      let type = this.earningsType;
      return this[type + "_earnings"].statis;
    },
    currentStatisLabel() {
      let type = this.earningsType;
      let labels = {
        promise: ["昨日收益", "本月收益", "历史收益"],
        card: ["今日开卡数", "本月开卡数", "历史开卡数"],
        referrer: ["今日开卡数", "本月开卡数", "历史开卡数"]
      }[type];
      return {
        todayLabel: labels[0],
        monthLabel: labels[1],
        totalLabel: labels[2]
      };
    }
  },

  mounted() {
    if (this.earningsViewType == "card") {
      this.earningsType = this.$route.hash == "#referrer" ? "referrer" : "card";
      this.navActive();
    } else {
      let { date } = this.$route.query;
      if (date) {
        date = date
          .split("-")
          .map(Number)
          .join("-");
        if (allMonths.includes(date)) {
          this.tempMonth = date
          this.promise_earnings.statsDate = date;
        }
      }
      this.earningsType = this.earningsViewType;
      this.navActive();
    }
  },

  methods: {
    checkedChange() {
      let orderKey = this.earningsType + "_earnings";
      let { statsDate } = this[orderKey];
      this.setCurrentStatsDate(statsDate);
      this.navActive();
    },
    goDetail({ id, orderSn, money }) {
      if (this.earningsViewType == "card") {
        this.$router.push({name: "sale-card-detail", query: {id}})
      } else if (this.earningsViewType == "promise") {
        this.$router.push({name: "earnings-detail", query: {orderSn, money}})
      }
    },
    typeChanged() {
      this.saveStatsDate();
    },
    // 保存当前统计的月份条件
    saveStatsDate() {
      this.popupVisible = false;
      let type = this.earningsType;
      this[type + "_earnings"].statsDate = this.tempMonth;
      this.fetchList(true);
      this.fetchTotalStats();
    },
    fetchTotalStats() {
      let type = this.earningsType;
      let urls = {
        promise: "/api/orderAllot/getMonthTotalMoney",
        card: "/api/user/order/getMonthTotalCardNum",
        referrer: "/api/user/cardRefAward/getMonthCardRefAward"
      };
      getMonthTotalMoney(
        { statsDate: this[type + "_earnings"].statsDate },
        urls[type]
      ).then(res => {
        this[type + "_earnings"].totalMoneyCurrentMonth = res || 0;
      });
    },
    // 改变月份条件
    changeStatsDate(picker, values) {
      this.tempMonth = values[0];
    },
    // 重置月份条件
    setCurrentStatsDate(value1) {
      this.tempMonth = value1;
    },
    loadMore() {
      this.fetchList();
    },
    // 获取列表数据
    fetchList(isReset) {
      let state = this;
      let type = this.earningsType;
      let orderKey = type + "_earnings";
      let content = state[orderKey]
      let { total, list, isLoading, statsDate, pageNum } = content;
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
        return Promise.resolve()
          .then(res => {
            let fetchFun = {
              promise: findOrderAllotList,
              card: getAllCardOrderList,
              referrer: findExtendCardOrderList
            };
            return fetchFun[type]({
              pageNum: pageNum + 1,
              pageSize: 15,
              statsDate
            });
          })
          .then((earnings = []) => {
            Object.assign(content, {
              isLoading: false,
              list: [...list, ...earnings],
              pageNum: earnings.length ? content.pageNum + 1 : pageNum,
              total: earnings.length >= 15 ? -1 : earnings.length
            });
            content.isLoading = false;
            
            return earnings;
          })
          .catch(err => {
            Toast(err);
            content.isLoading = false;
            throw err;
          });
      }
    },
    // 选中某一项
    navActive() {
      let orderKey = this.earningsType + "_earnings";
      let { list, total } = this[orderKey];
      if (list.length === 0 && total === -1) {
        // this.setCurrentStatsDate(statsDate); // 将月份过滤选成当前类型的月份
        this.fetchList(true); // 请求列表数据
      }

      this.fetchTotalStats();

      let fetchFuns = {
        promise: getOrderStatis,
        card: getCardStatis,
        referrer: getExtendCardCount
      };
      fetchFuns[this.earningsType]().then(res => {
        Object.assign(this[orderKey].statis, { ...res });
      });
    }
  }
};
</script>
<style lang='less' scoped>
#earnings-page {
  width: 100vw;
  flex: 1;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 0 24px 0;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background: rgba(244, 244, 244, 1);
  align-items: center;
  position: relative;
  padding-top: 24px;
}
.tabs-container {
  display: flex;
  justify-content: space-around;
  background: rgba(255, 255, 255, 1);
  padding: 12px 0;
  box-sizing: content-box;
  width: 100%;
  margin: 24px 0;
  border-radius: 6px;
  overflow: hidden;
  & > li {
    display: inline-block;
    position: relative;
    width: 33.3%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height: 56px;
    label {
      text-align: center;
      box-sizing: border-box;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 1;
      span {
        height: 40px;
        font-size: 28px;
        color: rgba(152, 152, 152, 1);
        line-height: 40px;
        letter-spacing: 0.34px;
        width: 100%;
      }
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
      background: rgba(248, 248, 248, 1);
      span {
        font-weight: 600;
        height: 40px;
        opacity: 1;
        font-size: 28px;
        font-family: PingFangSC;
        color: rgba(50, 50, 50, 1);
        line-height: 40px;
        letter-spacing: 0.34px;
      }

      //   &:after {
      //     width: 52px;
      //     content: "";
      //     border-radius: 10px;
      //     display: block;
      //     position: absolute;
      //     right: 50%;
      //     transform: translate(50%, 0); /* 使用css3的transform来实现 */
      //     height: 4px;
      //     background: #d7b686;
      //     bottom: 1px;
      //   }
    }
  }
}
.select-option {
  width: 232px;
  background: rgba(255, 255, 255, 1);
  border: 1px solid rgba(215, 182, 134, 1);
  border-radius: 8px;
  box-shadow: 0px 2px 0px 0px rgba(225, 225, 225, 0.5);
  font-size: 30px;
  line-height: 32px;
  color: rgba(54, 54, 54, 1);
  font-weight: 600;
  box-sizing: border-box;
  height: 52px;
  border-radius: 6px;
  overflow: hidden;
  border: rgba(215, 182, 134, 1);
  color: rgba(215, 182, 134, 1);
  font-size: 28px;
  line-height: 40px;
  letter-spacing: 0.69px;
}
.top-bar-container {
  width: 100%;
  height: 360px;
  box-sizing: border-box;
  box-shadow: 4px 8px 32px 0px rgba(229, 207, 164, 1);
  border-radius: 24px;
  // overflow: hidden;
  background: rgba(146, 146, 146, 0.5);
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  background: url("https://img.mall.xc2018.com.cn/mall/upload/20190511/192644_2_sx5e.jpg");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  align-items: center;
  justify-content: space-between;
  position: relative;
  & > button {
    position: absolute;
    background: transparent;
    border: none;
    right: 32px;
    top: 28px;
    font-size: 26px;
    color: rgba(255, 255, 255, 1);
    padding: 16px;
    line-height: 37px;
    letter-spacing: 0.34px;
    display: flex;
    align-items: center;
    & > span:last-of-type {
      border-radius: 50%;
      width: 32px;
      height: 32px;
      text-align: center;
      line-height: 32px;
      box-sizing: border-box;
      border: 1px solid rgba(237, 237, 237, 1); /* no */
      margin-left: 10px;
    }
  }
  h6 {
    height: 42px;
    font-size: 30px;
    color: rgba(255, 255, 255, 1);
    line-height: 42px;
    letter-spacing: 0.39px;
    margin: 42px 0 16px;
  }
  h4 {
    height: 78px;
    opacity: 1;
    font-size: 56px;
    font-family: PingFangSC;
    color: rgba(255, 255, 255, 1);
    line-height: 78px;
    letter-spacing: 1.19px;
  }
  p {
    height: 40px;
    font-size: 26px;
    color: rgba(255, 255, 255, 1);
    line-height: 37px;
    letter-spacing: 0.34px;
    margin: 5px 20px;
  }
  ul {
    display: flex;
    height: 112px;
    box-sizing: border-box;
    background: rgba(220, 177, 107, 1);
    width: 100%;
    border-radius: 0 0 16px 16px;
    overflow: hidden;
    li {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      position: relative;
      & > span:nth-of-type(1) {
        height: 33px;
        font-size: 24px;
        color: rgba(243, 230, 208, 1);
        line-height: 33px;
        letter-spacing: 0.51px;
      }
      & > span:nth-of-type(2) {
        height: 40px;
        font-size: 24px;
        color: rgba(255, 255, 255, 1);
        line-height: 33px;
        letter-spacing: 0.59px;
      }
      &:first-child {
        &:after {
          content: "";
          border-radius: 10px;
          display: block;
          position: absolute;
          right: 0;
          top: -50%;
          // transform: translate(0, -50%); /* 使用css3的transform来实现 */
          background: #fff;
          width: 1px; /* no */
          height: 70%;
          top: 50%;
          transform: translate(0, -50%);
        }
      }
    }
  }
}
.list-container {
  display: flex;
  flex: 1;
  position: relative;
  width: 100%;
  margin-bottom: 34px;
  // -webkit-overflow-scrolling: touch; //该属性随着手指离开还会保持滚动
  ul {
    padding-bottom: 24px;
    box-sizing: border-box;
    // height: 100%;
    // flex: 1;
    width: 100%;
    & > p {
      margin: 16px 0;
      font-size: 28px;
      text-align: center;
    }
  }
}

 ol[class='promise'] {
      margin-bottom: 24px;
      padding: 20px 24px;
      background: rgba(255, 255, 255, 1);
      box-shadow: 1px 2px 8px 0px rgba(225, 225, 225, 0.5);
      li {
        display: flex;
        box-sizing: border-box;
        align-items: center;
        overflow: hidden;
        margin-bottom: 10px;
        & > span {
          height:33px;
          font-size:24px;
          font-family:PingFangSC-Regular;
          font-weight:400;
          color:rgba(53,53,53,1);
          line-height:33px;
          }
        &:first-child {
          & > span:nth-of-type(1) {
            font-weight: 600;
            max-width: 30%;
            height:40px;
            font-size:28px;
            font-family:PingFangSC-Semibold;
            font-weight:600;
            color:rgba(54,54,54,1);
            line-height:40px;
            margin-right: 10px;
          }
          & > span:nth-of-type(2) {
            height: 37px;
            font-size: 26px;
            color: rgba(215, 182, 134, 1);
            line-height: 37px;
            letter-spacing: 0.31px;
          }
          & > span:nth-of-type(4) {
              font-weight: 600;
              height:40px;
              font-size:28px;
              font-family:PingFangSC-Semibold;
              font-weight:600;
              color:rgba(54,54,54,1);
              line-height:40px;
          }
        }

        &:last-child {
          display: flex;
          justify-content: space-between;
          & > span:nth-of-type(1) {
              height:33px;
              font-size:24px;
              font-family:PingFangSC-Regular;
              font-weight:400;
              color:rgba(152,152,152,1);
              line-height:33px;
          }
          & > span:nth-of-type(2) {
            height: 40px;
            font-size: 28px;
            color: rgba(250, 79, 78, 1);
            line-height: 40px;
            letter-spacing: 0.34px;
          }
        }
        &:last-child {
          margin-bottom: 0;
        }
      }
    }

 ol[class='not-promise'] {
      margin-bottom: 24px;
      padding: 20px 24px;
      background: rgba(255, 255, 255, 1);
      box-shadow: 1px 2px 8px 0px rgba(225, 225, 225, 0.5);
      li {
        display: flex;
        box-sizing: border-box;
        align-items: center;
        overflow: hidden;
        margin-bottom: 14px;
        &:first-child {
          & > span:nth-of-type(1) {
            font-weight: 600;
            max-width: 30%;
            height: 40px;
            font-size: 28px;
            color: rgba(54, 54, 54, 1);
            line-height: 40px;
            letter-spacing: 0.34px;
            margin-right: 10px;
          }
          & > span:nth-of-type(2) {
            height: 37px;
            font-size: 26px;
            color: rgba(215, 182, 134, 1);
            line-height: 37px;
            letter-spacing: 0.31px;
          }
          & > span:nth-of-type(4) {
            height: 37px;
            font-size: 26px;
            color: rgba(152, 152, 152, 1);
            line-height: 37px;
            letter-spacing: 0.31px;
          }
        }

        &:last-child {
          display: flex;
          justify-content: space-between;
          & > span:nth-of-type(1) {
            height: 40px;
            opacity: 1;
            font-size: 28px;
            font-family: PingFangSC;
            color: rgba(101, 101, 101, 1);
            line-height: 40px;
            letter-spacing: 0.34px;
          }
          & > span:nth-of-type(2) {
            height: 40px;
            font-size: 28px;
            color: rgba(250, 79, 78, 1);
            line-height: 40px;
            letter-spacing: 0.34px;
          }
        }
      }
      &:last-child {
        margin-bottom: 0;
      }
    }

.list-title {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100vw;
  padding: 32px;
  background: rgba(244, 244, 244, 1);
  & > span {
    height: 40px;
    font-size: 28px;
    color: rgba(152, 152, 152, 1);
    line-height: 40px;
    letter-spacing: 0.69px;
    text-align: left;
  }
}

.pop-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background: rgba(14, 14, 14, 0.47);
  box-sizing: border-box;
  padding: 0 90px;
  position: absolute;
  top: 0;
  right: 0;
}
.regular-container {
  width: 100%;
  height: 600px;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  h5 {
    height: 56px;
    font-size: 40px;
    font-family: PingFangSC;
    color: rgba(54, 54, 54, 1);
    line-height: 56px;
    letter-spacing: 0.44px;
    margin: 40px 0 48px;
  }
  ul {
    padding: 0 62px 22px;
    overflow-y: scroll; //该属性随着手指离开立即停止
    -webkit-overflow-scrolling: touch; //该属性随着手指离开还会保持滚动
    border-bottom: 1px solid rgba(237, 237, 237, 1); /* no */
    flex: 1;
    height: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    li {
      font-size: 32px;
      font-family: PingFangSC;
      color: rgba(101, 101, 101, 1);
      line-height: 45px;
      letter-spacing: 0.35px;
      margin: 4px 0;
    }
  }
  button {
    padding: 22px 32px 24px;
    color: rgba(221, 166, 87, 1);
    border: none;
    background: transparent;
    font-size: 34px;
    color: rgba(221, 166, 87, 1);
    line-height: 48px;
    letter-spacing: 0.37px;
    font-weight: 600;
  }
}
.staticAllMOney {
  text-align: center;
  font-size: 30px;
  line-height: 32px;
  height: 32px;
  padding: 6px 0;
  background: #fff;
  width: 100vw;
  position: fixed;
  right: 0;
  bottom: 0;
  //   padding: 16px 24px;
  //   box-sizing: border-box;
}
</style>
