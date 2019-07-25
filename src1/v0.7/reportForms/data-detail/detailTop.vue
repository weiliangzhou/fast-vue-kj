<!--  -->
<template>
  <div class="top-detail">
    <div class="tab">
      <h4>日期范围</h4>
      <span v-for="(tab ,index) in tabs" :key="index" :class="{cur:iscur == index}" class="dada" @click="iscur = index , tabcheck(tab.data)">{{tab.name}}</span>
    </div>
    <div class="searchDate" v-if="searchData.days == 0">
      <input type="searchDateStart" :readonly="searchDate" @click="showPlugin('start')" :placeholder="searchData.startTime" v-model="searchData.startTime">
      <span>至</span>
      <input type="searchDateEnd" :readonly="searchDate" @click="showPlugin('end')" :placeholder="searchData.endTime" v-model="searchData.endTime">
      <button @click="timeSearch">确认</button>
    </div>
  </div>
</template>

<script>
import { getTradeDetail } from '@/api'
import { Toast } from "@/global"
// import { Datetime, Group } from 'vux'
export default {
  data() {
    return {
      defaultDateStart: `2018-04-01`,
      defaultDateEnd: `${new Date().getFullYear()}-${(new Date().getMonth() + 1) < 10 ? '0' + (new Date().getMonth() + 1) : new Date().getMonth() + 1}-${new Date().getDate() - 1}`,
      searchDate: true, // 不能自己手动修改时间选择器中的时间
      iscur: 0,
      tabs: [
        {
          data: 7,
          name: '近7日'
        },
        {
          data: 30,
          name: '近30日'
        },
        {
          data: 0,
          name: '自定义'
        },
      ]
      //   searchData: { // 搜索条件
      //     startTime: '', // 自定义时间 ，开始时间
      //     endTime: '', // 自定义时间 ，结束时间
      //     goodsId: '', // 商品id
      //     days: '' // 近7天／近30天／等等...
      //   }
    }
  },
  props: [],

  components: {
  },

  computed: {
    searchData() {
      return this.$store.state.reportFormsSearchData.searchData
    }
  },
  watch: {
    'searchData.goodsId': {
      handler: (newVal, oldVal) => {
      }
    }
  },

  mounted() {
    this.tabcheck(7)
  },

  methods: {
    showPlugin(flag) {
      this.$vux.datetime.show({
        cancelText: '取消',
        confirmText: '确定',
        format: 'YYYY-MM-DD',
        value: flag == 'start' ? this.searchData.startTime : this.searchData.endTime,
        onConfirm: (val) => {
          if (flag == 'start') {
            this.searchData.startTime = val // new Date(val).getTime()
          } else {
            this.searchData.endTime = val // new Date(val).getTime()
          }
        },
        onShow: () => {
        },
        onHide: () => {
        }
      })
    },
    hidePlugin() {
      this.$vux.datetime.hide()
    },
    tabcheck(value) {
      this.searchData.days = value
      if (value) {
        let data = {
          goodsId: this.searchData.goodsId,
          days: value
        }
        if (!data.goodsId) {
          delete data.goodsId
        }
        this.getData(data)
      }
    },
    timeSearch() {
      let { startTime, endTime } = this.searchData;
      if (startTime) {
          startTime += " 0:0:0"
      }
      if (endTime) {
          endTime += " 0:0:0"
      }

      let data = {
        startTime: new Date(startTime.replace(/-/g, "/")).getTime(),
        endTime: new Date(endTime.replace(/-/g, "/")).getTime(),
        goodsId: this.searchData.goodsId,
      }

      if (!data.goodsId) {
        delete data.goodsId
      }
      this.getData(data)
    },
    getData(data) {
      getTradeDetail(data).then(res => {
        this.$store.state.reportFormsSearchData.doneData = res.data
      }).catch(rej => {
        Toast(rej)
      })
    }
  }
}

</script>
<style lang='less' scoped>
.top-detail {
  margin: 24px auto 20px;
  width: 702px;
  //   height: 186px;
  background-color: #fff;
  border-radius: 16px;
  overflow: hidden;
  .tab {
    margin-left: 24px;
    margin-top: 24px;
    margin-bottom: 30px;
  }
  h4 {
    display: inline-block;
    font-size: 32px;
    color: rgba(54, 54, 54, 1);
  }
}
.dada {
  cursor: pointer;
  display: inline-block;
  font-size: 26px;
  color: rgba(152, 152, 152, 1);
  padding: 3px 14px;
  border: 2px solid rgba(152, 152, 152, 1);
  border-radius: 23px;
  margin-left: 20px;
}
.cur {
  font-size: 26px;
  color: #D7B686;
  padding: 3px 14px;
  border: 1px solid #D7B686; /* no */
  border-radius: 23px;
}
.searchDate {
  margin-left: 24px;
  margin-bottom: 30px;
  color: #656565;
  line-height: 56px;
  overflow: hidden;
  input {
    text-align: center;
    width: 232px;
    height: 56px;
    opacity: 1;
    background: rgba(243, 243, 243, 1);
    border-radius: 8px 8px 8px 8px;
    color: #656565;
    box-shadow: none;
    border: 1px solid #c5c5c5; /* no */
  }
  button {
    border: 1px solid #D7B686; /* no */
    color: #fff;
    background: #D7B686;
    padding: 0 10px;
    margin-left: 28px;
    border-radius: 4px;
    text-align: center;
    font-size: 28px;
  }
}
</style>
