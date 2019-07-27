<template>
  <section id="home-view">
    <div class="top-container">
      <div class="part1">
        <h6>实时挖矿收益</h6>
        <p>0.00000103</p>
        <button><span>提币</span></button>
      </div>
      <div class="part2">
        <div class="text-container">
          <p>S17S算力云矿机<span>100天</span></p>
          <div class="right-container">
            <span>预计最高产量</span><span>0.1 BTC</span>
          </div>
        </div>
        <ul class="boll-container">
          <li class="qiandao-pos">
            <p><span>+3</span></p><span>签到打卡</span>
          </li>
          <li class="fenxiang-pos">
            <p><span>+3</span></p><span>分享活动</span>
          </li>
          <li class="yaoqing-pos">
            <p><span>+3</span></p><span>新用户奖励</span>
          </li>
        </ul>
      </div>
      <div style="flex: 1"></div>
      <div class="part3">
        <gauge :radius="60"></gauge>
      </div>
    </div>
    <div class="task-container">
      <ul>
        <h5>
          <p>提升算力，挖矿速度飙升</p><span>500GH/S</span>
        </h5>
        <li @click="showShare">
          <img :src="iconList[0]" alt="">
          <div>
            <h6>提升算力</h6>
            <p>邀请一位好友注册赠送<br>100GH/S</p>
          </div>
          <button><span>立即领取</span></button>
        </li>
      </ul>

      <ul>
        <h5>
          <p>完成任务赢电力</p><span>0GH</span>
        </h5>
        <li v-for="(item, index) in myTaskInfoList" :key="index" :style="{
            background: item.color
          }">
          <img :src="item.icoUrl" alt="">
          <div>
            <h6>{{item.title}}</h6>
            <p>{{item.desc}}</p>
          </div>
          <button @click="completeTask(item.id)"><span :style="{
            color: item.color
          }">{{item.btnName}}</span></button>
        </li>
      </ul>
      <div class="tips">
        <h4><img src="./activity_title.png" alt=""></h4>
        <div>
          <h5><span>活动描述</span></h5>
          <p>1. 挖矿分为算力和电力两部分组成
            2. 算力：用户初始默认算力为500GH/S，算力可以通过邀请好友得到算力，算力越高，挖矿的速度越快
            3. 电力：用户可以通过参与活动得到电力，电力越多，挖矿的时间越长，最长电力峰值24小时。电力不足时挖矿停止。</p>
          <h5><span>算力增减规则</span></h5>
          <p>邀请好友数量得到的算力，在矿机停止运行时间超过一天则算力失效。降至初始算力。</p>
        </div>
      </div>
    </div>

  </section>
</template>
<script>
import { Toast, setUserInfo } from '@/global' // getObject copyTextToClipboard
import { energyInfo, homepageInfo, completeTask } from '@/api'
// import { menus } from "@/conf/static";
import fenxiang from './icon_fenxiang.png'
import qiandao from './icon_qiandao.png'
import yaoqing from './icon_yaoqing.png'
import zhuce from './icon_zhuce.png'
import xiazai from './icon_xiazai.png'

import { MessageBox } from 'mint-ui'

import { createNamespacedHelpers } from 'vuex'
const { mapActions, mapMutations } = createNamespacedHelpers('salesData/agent')
export default {
  data() {
    return {
      iconList: [yaoqing, zhuce, xiazai, qiandao, fenxiang],
      btcInfo: 0.0000375303,
      btcInfoDesc: '0.0000375303',
      currentEnergyExpireSecond: 0,
      currentPower: 700,
      currentSpeedRate: 1.6e-10,
      currentSpeedRateDesc: '0.00000000016',
      myTaskInfoList: [
        // {
        //   label: '注册赢电力',
        //   desc: '新用户一次性赠送120\n小时电力',
        //   buttonText: '立即领取',
        //   color: '#FFB400'
        // },
        // {
        //   label: '下载赢电力',
        //   desc: '下载APP，注册领取\n300USDT',
        //   buttonText: '立即领取',
        //   color: '#00C0AC'
        // },
        // {
        //   label: '每日签到',
        //   desc: '签到打卡领取电力',
        //   buttonText: '立即领取',
        //   color: '#FF461A'
        // },
        //      [
        // ]
        // {
        //   label: '每日分享',
        //   desc: '每日可分享一次加电力',
        //   buttonText: '立即分享',
        //   color: '#6868E7'
        // }
      ]
    }
  },
  computed: {},

  mounted() {
    energyInfo().then(res => {})
    homepageInfo().then(({ myTaskInfoList, ...others }) => {
      let colors = ['#FFB400', '#FF461A', '#00C0AC', '#6868E7']
      myTaskInfoList = myTaskInfoList.map(item => {
        item['color'] = colors[item.id - 1]
        return item
      })
      Object.assign(this, { myTaskInfoList, ...others })
    })
  },
  methods: {
    completeTask(taskId) {
      let currentTask = this.myTaskInfoList.findIndex(item=>item.id==taskId)
      if(currentTask!==-1&&this.myTaskInfoList[currentTask].complete == false) {
         completeTask(taskId).then(res => {
           this.myTaskInfoList[currentTask].complete = true;
        this.myTaskInfoList[currentTask].btnName = "已完成"
      })
      }
     
    },
    showShare() {
      this.$root.$children[0].setShareContext(true)
    },
    onTouchStart() {
      e.preventDefault()
      this.state.int = setInterval(() => {
        this.showLeftTime(60)
      }, 20)
    },
    // 长按松开事件
    onTouchEnd() {
      const { currentEnergyExpireSecond, replaceEnergy } = this.state
      /**
       * 得到加了多少时间，如果增加时间大于0小时，就调用充电接口
       *  */
      let hours = Number(currentEnergyExpireSecond) - Number(replaceEnergy)
      if (hours != 0) {
        let result = hours / 3600
        let splitLen =
          result.toString().split('.')[1] &&
          result.toString().split('.')[1].length
        if (splitLen) {
          let res = result.toFixed()
          this.chargeData(res + 1)
        } else {
          let res2 = result.toFixed()
          this.chargeData(res2)
        }
      }
      // 松开后时间不是0就开始倒计时，并清除时间加定时器
      if (this.state.currentEnergyExpireSecond != 0) {
        this.countDown(1)
        clearInterval(this.state.int)
      }
    }
  },
  activated() {},
  beforeRouteLeave(to, from, next) {
    this.stickyIsShow = false
    next()
  }
}
</script>

<style lang='less' scoped>
#home-view {
  width: 100vw;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background: rgba(244, 244, 244, 1);
  align-items: center;
  position: relative;
  overflow-y: scroll; //该属性随着手指离开立即停止
  -webkit-overflow-scrolling: touch; //该属性随着手指离开还会保持滚动
  min-height: 100%;
  flex: 1;
}
.top-container {
  margin-bottom: 20px;
  padding: 88px 30px 0;
  width: 100%;
  height: 1274px;
  box-sizing: border-box;
  overflow: hidden;
  background: rgba(146, 146, 146, 0.5);
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  background: url('../../img/pic_ditu@2x.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;

  .part1 {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 156px;
    background: rgba(32, 0, 70, 1);
    border: 3px solid rgba(0, 208, 255, 1);
    border-radius: 20px;
    position: relative;
    padding-top: 30px;
    box-sizing: border-box;
    h6 {
      width: 400px;
      height: 60px;
      background: rgb(53, 0, 120);
      border: 3px solid rgba(0, 255, 255, 1);
      font-size: 32px;
      font-family: PingFangSC-Medium;
      letter-spacing: 1.28px;
      border-radius: 40px;
      text-align: center;
      line-height: 60px;
      box-sizing: border-box;
      color: white;
      position: absolute;
      top: 0;
      right: 50%;
      transform: translate(50%, -50%);
    }

    p {
      font-family: PingFangSC-Semibold;
      font-size: 60px;
      font-weight: 600;
      height: 84px;
      letter-spacing: 3px;
      color: white;
    }
    button {
      width: 100px;
      height: 40px;
      border: 1px solid rgb(0, 56, 143);
      position: absolute;
      top: 16px;
      right: 16px;
      border-radius: 20px;
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
      background-image: linear-gradient(
        to bottom,
        rgb(0, 148, 234) 0%,
        rgb(0, 56, 164) 100%
      );
      span {
        color: white;
        font-family: PingFangSC-Semibold;
        font-size: 20px;
        letter-spacing: 0.8px;
        height: 20px;
        margin-bottom: 4px;
      }
    }
  }

  .part3 {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .part2 {
    display: flex;
    align-items: center;
    flex-direction: column;
    .text-container {
      padding: 28px 83px 23px;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      flex-direction: row;
      & > p {
        font-family: PingFangSC-Medium;
        font-size: 28px;
        color: #ffffff;
        letter-spacing: 0;
        text-align: center;
        height: 40px;
        line-height: 40px;
        position: relative;

        span {
          font-family: PingFangSC-Medium;
          font-size: 24px;
          color: #ffffff;
          letter-spacing: 0;
          text-align: center;
          line-height: 33px;
          position: absolute;
          top: -40%;
          right: -90px;
          width: 80px;
          height: 36px;
          background: url('./dayBg.png');
          background-repeat: no-repeat;
          background-size: 80px 36px;
        }
      }
      .right-container {
        display: flex;
        flex-direction: column;
        & > span:first-of-type {
          font-family: PingFangSC-Medium;
          font-size: 20px;
          color: #999999;
          letter-spacing: 0;
          text-align: center;
          height: 28px;
          line-height: 28px;
        }
        & > span:last-of-type {
          font-family: PingFangSC-Medium;
          font-size: 32px;
          color: #ffffff;
          letter-spacing: 0;
          text-align: center;
          height: 45px;
          line-height: 45px;
          font-weight: 600;
        }
      }
    }
    .boll-container {
      height: 536px;
      position: relative;
      width: 100%;
      li {
        display: flex;
        flex-direction: column;
        position: absolute;
        p {
          width: 104px;
          height: 104px;
          border-radius: 50%;
          overflow: hidden;
          background: green;
          display: flex;
          align-items: center;
          justify-content: center;
          background-repeat: no-repeat;
          background-size: 104px 104px;
          span {
            font-family: PingFangSC-Semibold;
            font-size: 36px;
            color: #ffffff;
            letter-spacing: 0.5px;
            text-align: center;
            height: 50px;
            line-height: 50px;
          }
        }
        span {
          font-family: PingFangSC-Regular;
          font-size: 24px;
          color: #ffffff;
          letter-spacing: 0;
          text-align: center;
          margin-top: 12px;
          line-height: 33px;
          height: 33px;
        }
      }
      .qiandao-pos {
        left: 46px;
        top: 5px;
        & > p {
          background: url('./icon_fudongY.png');
          background-repeat: no-repeat;
          background-size: 104px 104px;
        }
      }
      .fenxiang-pos {
        right: 173px;
        bottom: 121px;
        p {
          background: url('./icon_fudongB.png');
          background-repeat: no-repeat;
          background-size: 104px 104px;
        }
      }
      .yaoqing-pos {
        top: 56px;
        right: 70px;
        p {
          background: url('./icon_fudongC.png');
          background-repeat: no-repeat;
          background-size: 104px 104px;
        }
      }
    }
  }
}
.task-container {
  padding: 16px 20px 0;
  background: #fff;
  width: 100%;
  box-sizing: border-box;
  ul {
    margin-top: 44px;
    h5 {
      display: flex;
      padding: 0 20px 0 24px;
      margin-bottom: 16px;
      p {
        font-family: PingFangSC-Medium;
        font-size: 28px;
        color: #333333;
        letter-spacing: 0;
        height: 40px;
        line-height: 40px;
        flex: 1;
        margin-right: 20px;
      }
      span {
        font-family: PingFangSC-Medium;
        font-size: 28px;
        color: #009cff;
        letter-spacing: 0;
        height: 40px;
        line-height: 40px;
      }
    }
    li {
      height: 200px;
      background: #ffb400;
      box-shadow: 0 8px 0 0 rgba(0, 0, 0, 0.1);
      border-radius: 16px;
      display: flex;
      align-items: center;
      padding: 0 40px;
      margin-bottom: 28px;
      img {
        display: block;
        width: 120px;
        height: 120px;
        margin-right: 40px;
        background: rgba(0, 0, 0, 0.3);
        border-radius: 50%;
      }

      & > div {
        flex: 1;
        margin-right: 20px;
        h6 {
          height: 37px;
          font-family: PingFangSC-Medium;
          font-size: 26px;
          color: #ffffff;
          letter-spacing: 0;
          line-height: 37px;
        }
        p {
          font-family: PingFangSC-Regular;
          font-size: 22px;
          color: #ffffff;
          letter-spacing: 0;
          height: 32px;
          line-height: 30px;
        }
      }

      button {
        background: #ffffff;
        border-radius: 20px;
        padding: 6px 34px;
        border: none;
        span {
          font-family: PingFangSC-Regular;
          font-size: 22px;
          color: #ffb400;
          letter-spacing: 0;
          height: 30px;
          line-height: 30px;
        }
      }
    }
  }
}
.tips {
  h4 {
    padding: 56px 0 40px;
    img {
      width: 384px;
      height: 48px;
      display: block;
      margin: auto;
    }
  }
  & > div {
    background: #8c73e4;
    box-shadow: 0 8px 0 0 rgba(0, 0, 0, 0.1);
    border-radius: 16px;
    padding: 30px 26px 30px 34px;
    box-sizing: border-box;
    white-space: pre-line;
    p {
      white-space: pre-line;
      font-family: PingFangSC-Regular;
      font-size: 22px;
      color: #ffffff;
      letter-spacing: 0;
      line-height: 34px;
    }
    h5 {
      text-align: center;
      margin: 32px 0 16px;
      span {
        background: #7659da;
        border-radius: 24px;
        height: 18.5px;
        line-height: 18.5px;
        font-family: PingFangSC-Semibold;
        font-size: 26px;
        color: #ffffff;
        letter-spacing: 0;
        text-align: center;
        padding: 8px 24px;
      }
    }
  }
}
</style>
