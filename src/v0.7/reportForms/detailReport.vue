<template>
  <section>
    <div class="topBox">
      <p>筛选</p>
      <button :class="{focus: currentChecked === 1}"><i style="padding: 0; color: #B3B3B3;" class="iconfont font22 icon-iconrili"></i><span class="monthLabel">{{currentLabel}}</span><i @click="popupVisible = true" class="iconfont font22 icon-jiantou-copy"></i></button>
      <mt-popup v-model="popupVisible" position="bottom" class="mint-popup-4">
        <div class="picker-toolbar">
          <span class="mint-datetime-action mint-datetime-cancel" @click="popupVisible=false">取消</span>
          <span class="mint-datetime-action mint-datetime-confirm" @click="fetchData">确定</span>
        </div>
        <mt-picker ref="address" :slots="dateSlots" @change="onDateChange" :visible-item-count="5"></mt-picker>
      </mt-popup>
    </div>
    <div class="table-container" v-if="dataList1.length">
        <table class="detailReportContainer">
      <caption align="top">分销权益包数据</caption>
      <tr>
        <th v-for="(item, index) in titleList1" :key="index" v-html="item"></th>
      </tr>
      <tr v-for="(rowData, index) in dataList1" :key="index">
        <td v-for="(columnData, rowIndex) in rowData" :key="rowIndex">{{columnData}}</td>
      </tr>
    </table>
    </div>

     <div class="table-container" v-if="dataList2.length">
        <table class="detailReportContainer">
      <caption align="top">399与418会员赠送权益包数据</caption>
      <tr>
        <th v-for="(item, index) in titleList2" :key="index" v-html="item"></th>
      </tr>
      <tr v-for="(rowData, index) in dataList2" :key="index">
        <td v-for="(columnData, rowIndex) in rowData" :key="rowIndex">{{columnData}}</td>
      </tr>
    </table>
    </div>

     <div class="table-container" v-if="dataList3.length">
        <table class="detailReportContainer">
      <caption align="top">350权益包购买数据</caption>
      <tr>
        <th v-for="(item, index) in titleList3" :key="index" v-html="item"></th>
      </tr>
      <tr v-for="(rowData, index) in dataList3" :key="index">
        <td v-for="(columnData, rowIndex) in rowData" :key="rowIndex">{{columnData}}</td>
      </tr>
    </table>
    </div>
  </section>
</template>

<script>
import { getVipBenefitInfo } from '@/api'
import { Picker, Popup } from 'mint-ui'
export default {
  data: () => ({
    vipBenefit350List: [], // 350权益包表格数据
    salesList: [], // 分销权益包表格数据
    othersList: [], // 399与418会员赠送权益包数据
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    popupVisible: false,
    currentChecked: 1,
    tempYear: new Date().getFullYear(),
    tempMonth: new Date().getMonth() + 1,
    dateSlots: [
      {
        flex: 1,
        values: [2018, 2019, 2020],
        className: 'slot1',
        textAlign: 'center'
      },
      {
        divider: true,
        content: '-',
        className: 'slot2'
      },
      {
        flex: 1,
        values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        className: 'slot3',
        textAlign: 'center'
      }
    ]
  }),
  components: {
    [Picker.name]: Picker,
    [Popup.name]: Popup
  },
  methods: {
    onDateChange(picker, values) {
      this.tempYear = values[0]
      this.tempMonth = values[1]
    },
    fetchData() {
      this.popupVisible = false
      this.year = this.tempYear
      this.month = this.tempMonth
      getVipBenefitInfo({ type: 1, year: this.year, month: this.month }).then(res => {
        this.salesList = res || []
      })
       getVipBenefitInfo({ type: 2, year: this.year, month: this.month }).then(res => {
        this.othersList = res || []
      })
       getVipBenefitInfo({ type: 5, year: this.year, month: this.month }).then(res => {
        this.vipBenefit350List = res || []
      })
    }
  },
  computed: {
    currentLabel() {
      return this.year ? this.year + '-' + this.month : '未选条件'
    },
    tableTitle() {
      let { type } = { ...this.$route.params, ...this.$route.query }
      return (
        { 'sales': '分销权益包数据', vipBenefit350: '350权益包购买数据' }[type] ||
        '399与418会员赠送权益包数据'
      )
    },
    titleList1() {
      const [first] = this.salesList
      return first || []
    },
    dataList1() {
      const [, ...reset] = this.salesList
      return reset || []
    },
     titleList2() {
      const [first] = this.othersList
      return first || []
    },
    dataList2() {
      const [, ...reset] = this.othersList
      return reset || []
    }, 
    titleList3() {
      const [first] = this.vipBenefit350List
      return first || []
    },
    dataList3() {
      const [, ...reset] = this.vipBenefit350List
      return reset || []
    }
  },
  mounted() {
    let { year, month } = { ...this.$route.params, ...this.$route.query }
    let [{ values: years = [] }, , { values: months = [] }] = this.dateSlots

    if (years.includes(Number(year)) && months.includes(Number(month))) {
      this.tempYear = year
      this.tempMonth = month
    }
    this.fetchData()
  },
  beforeRouteLeave (to, from, next) {
    let { year, month } = this.$route.query;
    if (year && month && !to.params.year&&!to.params.month) {
      next({name: to.name, params: {year, month}, replace: true})
    } else {
      next()
    }
  }
}
</script>

<style lang="less" scoped>
section {
    background: #F5F5F5;
    width: 100vw;
    height: 100vh;
    overflow: scroll;
}
.table-container {
  width: calc(100vw - 32px);
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.05);
  border-radius: 12px;
  padding: 32px 16px;
  margin: 16px;
  box-sizing: border-box;
}
table[class='detailReportContainer'] {
  border-collapse: collapse;
  border-spacing: 0px;
    width: 100%;
  caption {
    padding-bottom: 32px;
    height: 45px;
    font-size: 32px;
    font-family: PingFangSC-Medium;
    font-weight: 500;
    color: rgba(53, 53, 53, 1);
    line-height: 45px;
    text-align: left;
    background: #fff;
  }
  tr {
    th {
      height: 96px;
      border: 1px solid #c7c7c7;
      & > span {
        display: block;
      }
    }
    th:not(:first-of-type) {
      background: #ffeaea;
    }
    td {
      text-align: center;
      height: 80px;
      border: 1px solid #c7c7c7;
        font-size:28px;
        font-family:PingFangSC-Medium;
        font-weight:500;
        color:rgba(53,53,53,1);
        line-height:40px;
    }
    td:first-child {
      background: #ffefda;
      width: 3.12rem;
        height:40px;
        font-size:28px;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:rgba(98,64,16,1);
        line-height:40px;
    }
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
    padding-left: 30px;
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
</style>

<style>
.detailReportContainer tr th span:first-of-type {
  display: block;
  font-size: 28px;
  font-family: PingFangSC-Regular;
  font-weight: 400;
  color: rgba(53, 53, 53, 1);
  line-height: 40px;
}

.detailReportContainer tr th span:last-of-type {
  display: block;
  font-size: 28px;
  font-family: PingFangSC-Regular;
  font-weight: 400;
  color: #e02020;
  line-height: 40px;
}
</style>
