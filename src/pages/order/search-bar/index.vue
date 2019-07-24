<!-- 头部的搜索框 -->
<template>
    <div id='searchBar' class="hide">
        <div class="choose-type">
            <select name="type" v-model="chooseType">
                <option value="0">时间</option>
                <option value="1">姓名</option>
                <option value="2">手机</option>
            </select>
            <span>{{typeOption[chooseType]}}</span>
            <i class="iconfont icon-xiala"></i>
        </div>
        <div class="time" v-if='chooseType==0'>
            <div class="start-time" @click="chooseTime('start-time')">
                {{showTimeDate.start}}
            </div>
            <div class="end-time" @click="chooseTime('end-time')">
                {{showTimeDate.end}}
            </div>
        </div>
        <div class="name" v-if='chooseType==1'>
            <input type="text" placeholder="请输入用户名" v-model="name">
        </div>
        <div class="phone" v-if='chooseType==2'>
            <input type="tel" placeholder="请输入手机号码" v-model="phone">
        </div>
        <div class="search iconfont icon-sousuo" @click="search"></div>
        <template>
            <mt-datetime-picker ref="picker" type="date" v-model="pickerValue" year-format="{value} 年" month-format="{value} 月" date-format="{value} 日" @confirm="handleConfirm" :startDate="startDate" :endDate="endDate">
            </mt-datetime-picker>
        </template>
    </div>
</template>

<script>
import { DatetimePicker } from 'mint-ui';
let nowDate = new Date()
let oldTen = nowDate.getTime() - 24 * 60 * 60 * 1000 * 365 * 20 // 往前20年
let newTen = nowDate.getTime() + 24 * 60 * 60 * 1000 * 365 * 20 // 往后20年
export default {
    data() {
        return {
            typeOption: ['时间', '姓名', '手机'], // 查询类型数组
            startTimeDate: '', // 开时间选择完了之后会去变化这个值，最小选择时间
            endTimeDate: '', // 结束时间选择完了之后会去变化这个值，最小选择时间
            startTime: '2018-12-21', // 开始时间
            endTime: '2018-12-22', // 结束时间
            dateTimeStatus: 'start', // 当前是选择开始时间
            pickerValue: '2018-12-25', // 时间选择器选完后的数据动态绑定
            chooseType: '0', // 当前select类型 0: 时间／1:姓名／2:手机
            name: '', // 按照姓名查询
            phone: '', // 按照手机查询
            startDate: new Date(oldTen), // 时间选择器能够选择的最小时间
            endDate: new Date(newTen), // 时间选择器能够选择的最大时间
            showTimeDate: {
                start: '请选择',
                end: '请选择'
            }
        }
    },

    components: { [DatetimePicker.name]: DatetimePicker },

    computed: {},

    mounted() {
        let timeDate = new Date()
        let year = timeDate.getFullYear()
        let month = timeDate.getMonth() + 1
        let day = timeDate.getDate()
        this.startTime = `${year}-${month}-${day - 1}`
        this.endTime = `${year}-${month}-${day}`
    },

    methods: {
        chooseTime(status) {
            // 打开时间选择权
            this.$refs.picker.open();
            this.dateTimeStatus = status;
            let stdate = this.startTimeDate ? new Date(this.startTimeDate) : new Date()
            let eddate = this.endTimeDate ? new Date(this.endTimeDate) : new Date()
            if (status == 'start-time') {
                this.startDate = new Date(stdate.getTime() - 24 * 60 * 60 * 1000 * 365 * 20)
                this.endDate = new Date(eddate)
                this.$nextTick(() => {
                    this.pickerValue = this.startTime
                })
            } else {
                this.startDate = stdate
                this.endDate = new Date(eddate.getTime() + 24 * 60 * 60 * 1000 * 365 * 20)
                this.$nextTick(() => {
                    this.pickerValue = this.endTime
                })
            }
        },
        closePicker() {
            this.$refs.picker.close();
        },
        handleConfirm(status) {
            let timeDate = new Date(status)
            let year = timeDate.getFullYear()
            let month = timeDate.getMonth() + 1
            let day = timeDate.getDate()
            if (this.dateTimeStatus == 'start-time') {
                this.startTimeDate = status
                this.$nextTick(() => {
                    this.startTime = `${year}-${month}-${day}`
                    this.showTimeDate.start = `${year}-${month}-${day}`
                })
            } else {
                this.endTimeDate = status
                this.$nextTick(() => {
                    this.endTime = `${year}-${month}-${day}`
                    this.showTimeDate.end = `${year}-${month}-${day}`
                })
            }
        },
        search() {
            if (this.showTimeDate.start == '请选择' || this.showTimeDate.end == '请选择') {
                this.$emit('search', {
                    type: this.chooseType,
                    name: this.name,
                    phone: this.phone
                })
                return false
            }
            this.$emit('search', {
                type: this.chooseType,
                name: this.name,
                phone: this.phone,
                startTime: this.startTime,
                endTime: this.endTime
            })
        }
    }
}
</script>
<style lang='less' scoped>
#searchBar {
  width: 100%;
  height: 110px;
  position: fixed;
  top: 74px;
  right: 0;
  left: 0;
  background: #f7f7f7;
  display: flex;
  align-items: center;
  align-content: center;
  z-index: 2;
  .choose-type {
    width: 132px;
    height: 72px;
    margin-left: 32px;
    background: #fff;
    border-radius: 8px;
    font-size: 28px;
    line-height: 72px;
    position: relative;
    overflow: hidden;
    select {
      width: 164px;
      height: 100%;
      opacity: 0;
      padding: 0;
      border: none;
      background: #fff;
      color: #989898;
      appearance: none;
      -moz-appearance: none;
      -webkit-appearance: none;
      position: relative;
      z-index: 99;
    }
    span {
      color: #989898;
      position: absolute;
      display: block;
      width: 90px;
      height: 100%;
      text-align: center;
      line-height: 78px;
      top: 0;
      left: 0;
    }
    i {
      position: absolute;
      right: 10px;
      top: 0;
      display: block;
      font-size: 48px;
      height: 100%;
      line-height: 78px;
      color: #989898;
    }
  }
  .time {
    width: 470px;
    display: flex;
    div {
      width: 220px;
      height: 72px;
      background: #fff;
      border-radius: 8px;
      color: #656565;
      line-height: 72px;
      text-align: center;
      font-size: 28px;
    }
    .start-time {
      margin-left: 16px;
    }
    .end-time {
      margin-left: 16px;
    }
  }
  .name,
  .phone {
    width: 470px;
    height: 72px;
    background: #fff;
    margin-left: 16px;
    text-align: center;
    line-height: 72px;
    input {
      border: none;
      background: #fff;
      padding: 0;
      margin: 0;
      display: block;
      width: 90%;
      padding-left: 16px;
      height: 100%;
      font-size: 28px;
    }
  }
  .search {
    margin-left: 24px;
    width: 60px;
    height: 60px;
    background: #e21d25;
    font-size: 40px;
    text-align: center;
    line-height: 60px;
    color: #fff;
  }
}
</style>
