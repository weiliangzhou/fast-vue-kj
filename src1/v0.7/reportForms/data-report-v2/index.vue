<!--  -->

<template>
  <div class="showBox">
      <div class="topBox">
          <p>筛选</p>
          <button :class="{focus: currentChecked === 0}" @click="selectToday"><span>今日数据</span></button>
          <button :class="{focus: currentChecked === 1}"><i style="padding: 0; color: #B3B3B3;" class="iconfont font22 icon-iconrili"></i><span class="monthLabel" @click="selectCurrentMonth">{{currentLabel}}</span><i @click="selectMonth" class="iconfont font22 icon-jiantou-copy"></i></button>
            <mt-popup v-model="popupVisible" position="bottom" class="mint-popup-4">
                <div class="picker-toolbar">
                    <span class="mint-datetime-action mint-datetime-cancel" @click="popupVisible=false">取消</span>
                    <span class="mint-datetime-action mint-datetime-confirm" @click="searchFetch">确定</span>
                </div>
                <mt-picker ref="address" :slots="dateSlots" @change="onDateChange" :visible-item-count="5"></mt-picker>
            </mt-popup>
      </div>
    <div v-if="false" class="data-header">
      <h4>数据概况</h4>
      <div v-if='reportData.recordTime' class="time">数据更新至 {{reportData.recordTime}}</div>
    </div>
    <div class="dataBox">
      <table v-if="currentChecked==0" border="1">
        <tr>
          <th></th>
          <th style="border-right:1px solid rgba(0,0,0,0);">总数</th>
          <th style="border-right:1px solid rgba(0,0,0,0);">今日新增</th>
          <th>昨日新增</th>
        </tr>
        <tr>
          <td>分销开卡数(张)</td>
          <td>{{reportData.totalActivateCardNum}}</td>
          <td :class="{'font-red':reportData.todayNewActivateCardNum>reportData.yesterdayNewActivateCardNum,'font-green':reportData.todayNewActivateCardNum<reportData.yesterdayNewActivateCardNum}">{{reportData.todayNewActivateCardNum}}</td>
          <td>{{reportData.yesterdayNewActivateCardNum}}</td>
        </tr>
      <!-- bengin -->
        <tr>
          <td>h5开卡数(张)</td>
          <td>{{reportData.h5ActivateCardNum}}</td>
          <td :class="{'font-red':reportData.todayNewH5ActivateCardNum>reportData.yesterdayNewH5ActivateCardNum,'font-green':reportData.todayNewH5ActivateCardNum<reportData.yesterdayNewH5ActivateCardNum}">{{reportData.todayNewH5ActivateCardNum}}</td>
          <td>{{reportData.yesterdayNewH5ActivateCardNum}}</td>
        </tr>

        <tr>
          <td>安卓开卡数(张)</td>
          <td>{{reportData.androidActivateCardNum}}</td>
          <td :class="{
            'font-red':reportData.todayNewAndroidActivateCardNum>reportData.yesterdayNewAndroidActivateCardNum,
            'font-green':reportData.todayNewAndroidActivateCardNum<reportData.yesterdayNewAndroidActivateCardNum
            }">{{reportData.todayNewAndroidActivateCardNum}}
          </td>
          <td>{{reportData.yesterdayNewAndroidActivateCardNum}}</td>
        </tr>

        <tr>
          <td>ios开卡数(张)</td>
          <td>{{reportData.iosActivateCardNum}}</td>
          <td :class="{
            'font-red':reportData.todayNewIosActivateCardNum>reportData.yesterdayNewIosActivateCardNum,
            'font-green':reportData.todayNewIosActivateCardNum<reportData.yesterdayNewIosActivateCardNum
            }">{{reportData.todayNewIosActivateCardNum}}
          </td>
          <td>{{reportData.yesterdayNewIosActivateCardNum}}</td>
        </tr>
        <tr>
          <td>350权益包</td>
          <td>{{reportData.totalSaleBenefitNum}}</td>
          <td :class="{'font-red':reportData.todaySaleBenefitNum>reportData.yesterdaySaleBenefitNum,'font-green':reportData.todaySaleBenefitNum<reportData.yesterdaySaleBenefitNum}">{{reportData.todaySaleBenefitNum}}</td>
          <td>{{reportData.yesterdaySaleBenefitNum}}</td>
        </tr>
    <!-- end -->
        <tr>
          <td>发卡数(张)</td>
          <td>{{reportData.totalSendCardNum}}</td>
          <td :class="{'font-red':reportData.todayNewSendCardNum>reportData.yesterdayNewSendCardNum,'font-green':reportData.todayNewSendCardNum<reportData.yesterdayNewSendCardNum}">{{reportData.todayNewSendCardNum}}</td>
          <td>{{reportData.yesterdayNewSendCardNum}}</td>
        </tr>

        <tr>
          <td>会员用户(个)</td>
          <td>{{reportData.totalRegisterNum}}</td>
          <td :class="{'font-red':reportData.todayNewRegisterNum>reportData.yesterdayNewRegisterNum,'font-green':reportData.todayNewRegisterNum<reportData.yesterdayNewRegisterNum}">{{reportData.todayNewRegisterNum}}</td>
          <td>{{reportData.yesterdayNewRegisterNum}}</td>
        </tr>
        <tr>
          <td>VIP会员(个)</td>
          <td>{{reportData.totalVipNum}}</td>
          <td :class="{'font-red':reportData.todayNewVipNum>reportData.yesterdayNewVipNum,'font-green':reportData.todayNewVipNum<reportData.yesterdayNewVipNum}">{{reportData.todayNewVipNum}}</td>
          <td>{{reportData.yesterdayNewVipNum}}</td>
        </tr>
         <tr>
          <td>创客(个)</td>
          <td>{{reportData.totalSaleVipNum}}</td>
          <td :class="{'font-red':reportData.todayNewSaleVipNum>reportData.yesterdayNewSaleVipNum,'font-green':reportData.todayNewSaleVipNum<reportData.yesterdayNewSaleVipNum}">{{reportData.todayNewSaleVipNum}}</td>
          <td>{{reportData.yesterdayNewSaleVipNum  }}</td>
        </tr>
        <tr>
          <td>创业教练(个)</td>
          <td>{{reportData.totalCyjlNum}}</td>
          <td :class="{'font-red':reportData.todayNewCyjlNum>reportData.yesterdayNewCyjlNum,'font-green':reportData.todayNewCyjlNum<reportData.yesterdayNewCyjlNum}">{{reportData.todayNewCyjlNum}}</td>
          <td>{{reportData.yesterdayNewCyjlNum}}</td>
        </tr>
        <tr>
          <td>院长(个)</td>
          <td>{{reportData.totalYzNum}}</td>
          <td :class="{'font-red':reportData.todayNewYzNum>reportData.yesterdayNewYzNum,'font-green':reportData.todayNewYzNum<reportData.yesterdayNewYzNum}">{{reportData.todayNewYzNum}}</td>
          <td>{{reportData.yesterdayNewYzNum}}</td>
        </tr>
        <tr>
          <td>校长(个)</td>
          <td>{{reportData.totalXzNum}}</td>
          <td :class="{'font-red':reportData.todayNewXzNum>reportData.yesterdayNewXzNum,'font-green':reportData.todayNewXzNum<reportData.yesterdayNewXzNum}">{{reportData.todayNewXzNum}}</td>
          <td>{{reportData.yesterdayNewXzNum}}</td>
        </tr>
          <!-- begin -->
         <tr>
          <td>小镇(个)</td>
          <td>{{reportData.totalJdNum}}</td>
          <td :class="{
            'font-red':reportData.todayNewJdNum>reportData.yesterdayNewJdNum,
            'font-green':reportData.todayNewJdNum<reportData.yesterdayNewJdNum
            }">{{reportData.todayNewJdNum}}
          </td>
          <td>{{reportData.yesterdayNewJdNum}}</td>
        </tr>
        <!-- end -->
        <tr>
          <td>预绑定用户(个)</td>
          <td>{{reportData.totalPreBindingNum}}</td>
          <td :class="{'font-red':reportData.todayNewPreBindingNum>reportData.yesterdayNewPreBindingNum,'font-green':reportData.todayNewPreBindingNum<reportData.yesterdayNewPreBindingNum}">{{reportData.todayNewPreBindingNum}}</td>
          <td>{{reportData.yesterdayNewPreBindingNum}}</td>
        </tr>
        <tr>
          <td>订单数(个)</td>
          <td>{{reportData.totalOrderNum}}</td>
          <td :class="{'font-red':reportData.todayNewOrderNum>reportData.yesterdayNewOrderNum,'font-green':reportData.todayNewOrderNum<reportData.yesterdayNewOrderNum}">{{reportData.todayNewOrderNum}}</td>
          <td>{{reportData.yesterdayNewOrderNum}}</td>
        </tr>
        <tr>
          <td>交易金额(元)</td>
          <td>{{reportData.totalTradeAmountY}}</td>
          <td :class="{'font-red':reportData.todayNewTradeAmount>reportData.yesterdayNewTradeAmount,'font-green':reportData.todayNewTradeAmount<reportData.yesterdayNewTradeAmount}">{{reportData.todayNewTradeAmountY}}</td>
          <td>{{reportData.yesterdayNewTradeAmountY}}</td>
        </tr>
          <!-- begin -->
        <tr>
          <td>订单金额(元)</td>
          <td>{{reportData.totalOrderAmountY}}</td>
          <td :class="{
            'font-red':reportData.todayNewOrderAmount>reportData.yesterdayNewOrderAmount,
            'font-green':reportData.todayNewOrderAmount<reportData.yesterdayNewOrderAmount
            }">{{reportData.todayNewOrderAmountY}}</td>
          <td>{{reportData.yesterdayNewOrderAmountY}}</td>
        </tr>
         <tr>
          <td>分佣金额(元)</td>
          <td>{{reportData.totalAllotAmountY}}</td>
          <td :class="{
            'font-red':reportData.todayAllotAmount>reportData.yesterdayAllotAmount,
            'font-green':reportData.todayAllotAmount<reportData.yesterdayAllotAmount
            }">{{reportData.todayAllotAmountY}}</td>
          <td>{{reportData.yesterdayAllotAmountY}}</td>
        </tr>
        <!-- end -->
        <!-- begin -->
         <tr>
          <td>听课人数(个)</td>
          <td>{{reportData.totalStudyCount}}</td>
          <td :class="{
            'font-red':reportData.todayNewStudyCount>reportData.yesterdayNewStudyCount,
            'font-green':reportData.todayNewStudyCount<reportData.yesterdayNewStudyCount
            }">{{reportData.todayNewStudyCount}}
          </td>
          <td>{{reportData.yesterdayNewStudyCount}}</td>
        </tr>
        <tr>
          <td>听课时长(分钟)</td>
           <td>{{reportData.totalDuration}}</td>
          <td :class="{
            'font-red':reportData.todayNewDuration>reportData.yesterdayNewDuration,
            'font-green':reportData.todayNewDuration<reportData.yesterdayNewDuration
            }">{{reportData.todayNewDuration}}
          </td>
          <td>{{reportData.yesterdayNewDuration}}</td>
        </tr>
        <!-- end -->
      </table>

        <table v-else border="1">
        <tr>
          <th></th>
          <th>当月新增</th>
        </tr>
        <tr>
          <td>分销开卡数(张)</td>
          <td><p @click="detailReport('sales')">{{reportData.monthActivateCardNum || 0}}<span>查看</span></p></td>
        </tr>
         <tr>
          <td>h5开卡数(张)</td>
          <td><p @click="detailReport('h5')">{{reportData.monthH5CardNum || 0}}<span>查看</span></p></td>
        </tr>
          <tr>
          <td>安卓开卡数(张)</td>
          <td><p @click="detailReport('android')">{{reportData.monthAndroidCardNum || 0}}<span>查看</span></p></td>
        </tr>
          <tr>
          <td>ios开卡数(张)</td>
          <td><p @click="detailReport('ios')">{{reportData.monthIosCardNum || 0}}<span>查看</span></p></td>
        </tr>
          <tr>
          <td>350权益包</td>
          <td><p @click="detailReport('vipBenefit350')">{{reportData.monthSaleBenefitNum || 0}}<span>查看</span></p></td>
        </tr>
        <tr>
          <td>发卡数(张)</td>
          <td>{{reportData.monthSendCardNum || 0}}</td>
        </tr>
        <tr>
          <td>会员用户(个)</td>
          <td>{{reportData.monthRegisterNum || 0}}</td>
        </tr>
        <tr>
          <td>VIP会员(个)</td>
          <td>{{reportData.monthVipNum || 0}}</td>
        </tr>
        <tr>
          <td>创客(个)</td>
          <td>{{reportData.monthSaleVipNum || 0}}</td>
        </tr>
        <tr>
          <td>创业教练(个)</td>
          <td>{{reportData.monthCyjlNum || 0}}</td>
        </tr>
        <tr>
          <td>院长(个)</td>
          <td>{{reportData.monthYzNum || 0}}</td>
        </tr>
        <tr>
          <td>校长(个)</td>
          <td>{{reportData.monthXzNum || 0}}</td>
        </tr>
        <tr>
          <td>小镇(个)</td>
          <td>{{reportData.monthJdNum || 0}}</td>
        </tr>
        <tr>
          <td>预绑定用户(个)</td>
          <td>{{reportData.monthPreBindingNum || 0}}</td>
        </tr>
        <tr>
          <td>订单数(个)</td>
          <td>{{reportData.monthOrderNum || 0}}</td>
        </tr>
        <tr>
          <td>交易金额(元)</td>
          <td>{{reportData.monthTradeAmountY || 0}}</td>
        </tr>
        <tr>
          <td>订单金额(元)</td>
          <td>{{reportData.monthOrderAmountY || 0}}</td>
        </tr>
        <tr>
          <td>分佣金额(元)</td>
          <td>{{reportData.monthAllotAmountY || 0}}</td>
        </tr>
         <tr>
          <td>听课人数(个)</td>
          <td>{{reportData.monthStudyCount || 0}}</td>
        </tr>
        <tr>
          <td>听课时长(分钟)</td>
          <td>{{reportData.monthDuration || 0}}</td>
        </tr>
      </table>
    </div>
    <mine-footer></mine-footer>
  </div>
</template>
<script>
import { getTodayDataInfo, getMonthDataInfo } from '@/api'
import MineFooter from '../tabs.vue'
import { getDate, getUserInfo } from '@/global'
import { Picker, Popup } from 'mint-ui';
export default {
  data() {
    return {
      todayReportData: {}, // 今日数据
      monthReportData: {}, // 本月数据
      year: (new Date()).getFullYear(),
      month: (new Date()).getMonth()+1,
      popupVisible: false,
      currentChecked: 0,
      tempYear: (new Date()).getFullYear(),
      tempMonth: (new Date()).getMonth()+1,
      dateSlots: [
          {
            flex: 1,
            values: [2018, 2019, 2020],
            className: 'slot1',
            textAlign: 'center'
          }, {
            divider: true,
            content: '-',
            className: 'slot2'
          }, {
            flex: 1,
            values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            className: 'slot3',
            textAlign: 'center'
          }
        ],
    }
  },
  beforeRouteEnter(to, from, next) {
    // ...
    if (getUserInfo().userRoles.find(item => item.roleName == 'admin')) {
      next()
    } else {
      next({
        name: 'home'
      })
    }
  },
  components: {
    MineFooter,
    [Picker.name]: Picker,
    [Popup.name]: Popup
  },

  computed: {
      currentLabel() {
          return this.year? this.year + '-' + this.month : "未选条件"
      },
      reportData() {
        return this.currentChecked ? this.monthReportData : this.todayReportData
      }
  },

  mounted() {
    let { year, month } = { ...this.$route.params, ...this.$route.query }
    let [{values: years = []}, , {values: months = []}] = this.dateSlots;

    if (years.includes(Number(year)) && months.includes(Number(month))) {
      this.tempYear = year
      this.tempMonth = month
      this.searchFetch()
    } else {
      this.selectToday()
    }  
  },

  methods: {
    selectToday() {
        this.currentChecked = 0;
        getTodayDataInfo().then(res => {
        //   var arr = []
        //   var dd = ''
        //   dd = res.data.recordTime
        //   arr = dd.split(" ")
        //   res.data.recordTime = arr[0]
        this.todayReportData = res.data
        this.todayReportData.recordTime = getDate(new Date().getTime(), 'year')
        })
    },
    selectMonth() {
      this.popupVisible=true;
      this.currentChecked = 1;
       getMonthDataInfo({year: this.year, month: this.month}).then(res => {
        this.monthReportData = res.data
        this.monthReportData.recordTime = getDate(new Date().getTime(), 'year')
        })
    },
    detailReport(type) {
      this.$router.push({name: 'detailReport', query: {type, year: this.year, month: this.month}})
    },
     selectCurrentMonth() {
      // this.popupVisible=true;
      this.currentChecked = 1;
       getMonthDataInfo({year: this.year, month: this.month}).then(res => {
        this.monthReportData = res.data
        this.monthReportData.recordTime = getDate(new Date().getTime(), 'year')
        })
    },
    onDateChange(picker, values) {
     this.tempYear = values[0];
     this.tempMonth = values[1]
    },
    searchFetch() {
        this.currentChecked = 1;
        this.popupVisible = false;
        this.year = this.tempYear;
        this.month = this.tempMonth;
        getMonthDataInfo({year: this.year, month: this.month}).then(res => {
        this.monthReportData = res.data
        this.monthReportData.recordTime = getDate(new Date().getTime(), 'year')
        })
    }
  }
}

</script>
<style lang='less' scoped>
.data-header {
  overflow: hidden;
  width: 100%;
  background: #f7f7f7;
  h4 {
    float: left;
    margin-top: 32px;
    margin-bottom: 24px;
    font-size: 30px;
    text-align: center;
    font-weight: 400;
    margin-left: 45px;
  }
  .time {
    float: right;
    margin-top: 32px;
    font-size: 30px;
    margin-bottom: 32px;
    color: rgba(176, 176, 176, 1);
    text-align: center;
    margin-right: 32px;
  }
}
.fontSty1 {
  font-size: 50px;
  background: linear-gradient(#6ad4fd, #34bef5);
  -webkit-background-clip: text;
  color: transparent;
}
.fontSty2 {
  font-size: 50px;
  background: linear-gradient(#fb6462, #f53433);
  -webkit-background-clip: text;
  color: transparent;
}
.fontSty3 {
  font-size: 57px;
  background: linear-gradient(#ffc36d, #ffa825);
  -webkit-background-clip: text;
  color: transparent;
}
.fontSty4 {
  font-size: 57px;
  background: linear-gradient(#76eca0, #3fd87e);
  -webkit-background-clip: text;
  color: transparent;
}
.heng {
  display: inline-block;
  width: 20px;
  border-bottom: 3px solid rgba(186, 186, 186, 1);
  margin-bottom: 10px;
}
.clear {
  clear: both;
}
.left {
  float: left;
}
.right {
  float: right;
}
.showBox {
  min-height: 100vh;
  background-color: rgba(247, 247, 247, 1);
  background: #fff;
  overflow: hidden;
  box-sizing: border-box;
  padding-bottom: 110px;
}
.list-box {
  width: 100%;
}
.dataBox {
  padding: 39px 0px;
  background-color: #fff;
  border-radius: 16px;
  width: 100%;
  margin-bottom: 20px;
  table {
    border-collapse: collapse;
    border: 1px solid rgba(0, 0, 0, 0);
    width: 686px;
    margin: 0 auto;
    text-align: left;
    box-sizing: border-box;
  }
  tr {
    border: 1px solid #fff;
    box-sizing: border-box;
  }
  td,
  th {
    border: 1px solid #ccc; /* no */
    box-sizing: border-box;
    height: 78px;
    text-align: center;
    color: #363636;
    font-size: 26px;
    margin: 0 auto;
    color: #363636;
  }
  tr td:nth-child(2),
  tr td:nth-child(3) {
    color: #656565;
    // border-right: 1px solid rgba(0, 0, 0, 0); /* no */
    // border-bottom: 1px solid rgba(0, 0, 0, 0); /* no */
  }
  tr td:nth-child(4) {
    color: #656565;
    // border-bottom: 1px solid rgba(0, 0, 0, 0); /* no */
  }
  tr:last-child td {
    // border-bottom: 1px solid #000; /* no */
  }
  .font-red {
    color: #f63c3b !important;
  }
  .font-green {
    color: #42d980 !important;
  }
}
.red {
  font-size: 32px;
  font-weight: 600;
  color: rgba(246, 57, 56, 1);
  i {
    font-size: 25px;
  }
}
.blue {
  font-size: 32px;
  font-weight: 600;
  color: #56da7c;
  i {
    font-size: 25px;
  }
}
.gray {
  font-size: 32px;
  font-weight: 600;
  color: rgba(186, 186, 186, 1);
  i {
    font-size: 25px;
  }
}

.topBox {
    display: flex;
    padding: 32px;
    align-items: center;
    background: #fff;
    & > p {
         font-size: 32px;
        color: rgba(54, 54, 54, 1);
        font-weight: 400;
        margin-right: 36px;
    }
 button {
  padding: 16px 40px;
  border-radius:10px;
  box-sizing: content-box;
  border:1px solid rgba(230,230,230,1); /* no */
  height:33px;
  font-size:24px;
  font-family:PingFangSC-Medium;
  font-weight:500;
  color:rgba(51,51,51,1);
  line-height:33px;
  background: #fff;
 }
 &>button:nth-last-of-type(1) {
    margin-left: 24px;
 }
 button[class=focus] {
  border: 1px solid #D7B686; /* no */
 }
}
 .mint-popup-4 {
    width: 100%;
    .picker-slot-wrapper,
    .picker-item {
        backface-visibility: hidden;
    }
}
.font22 {
    padding: 10px 24px;
    font-size: 22px;
}
.monthLabel {
  padding: 0 18px;
  border-right: 1px solid #979797; /* no */
}

th:not(:first-of-type) {
  background: #FFEAEA;
}
tr {
  td:first-child {
    background: #FFEFDA;
    width: 3.12rem;
    font-size:26px;
    font-family:PingFangSC-Regular;
    font-weight:400;
    color:rgba(98,64,16,1);
    line-height:37px;
  }
}

tr {
  td {
    p {
      height:40px;
      font-size:28px;
      font-family:PingFangSC-Medium;
      font-weight:500;
      color:rgba(0,123,255,1);
      line-height:40px;
      span {
        height:37px;
        font-size:26px;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:rgba(0,123,255,1);
        line-height:37px;
        margin-left: 28px;
      }
    }
  }
}
</style>

<style>
/* .topBox .mint-popup-bottom {
 width: 100%;
} */
</style>
