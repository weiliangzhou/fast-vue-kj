<!--  -->

<template>
  <div class="showBox">
    <div class="dataBox">
      <div class="list-box">
        <div class="smallBox left">
          <i class="iconfont icon-qiacopyx1 fontSty1"></i>
          <div>
            <h4>{{reportData.activateCardNum}}</h4>
            <span :class="classSty1">{{(reportData.newActivateCardNum<0) ? Math.abs(reportData.newActivateCardNum):reportData.newActivateCardNum}} <i class="iconfont icon-sheng" v-if="reportData.newActivateCardNum>0"></i>
                <i class="heng" v-if="reportData.newActivateCardNum == 0"></i><i class="iconfont icon-jiang" v-if="reportData.newActivateCardNum < 0"></i>
            </span>
            <p>新增开卡数</p>
          </div>
        </div>
        <div class="smallBox right">
          <i class="iconfont icon-qiacopyx fontSty1"></i>
          <div>
            <h4>{{reportData.sendCardNum}}</h4>
            <span :class="classSty2">{{reportData.newSendCardNum<0?Math.abs(reportData.newSendCardNum):reportData.newSendCardNum}} <i class="iconfont icon-sheng" v-if="reportData.newSendCardNum>0"></i>
                <i class="heng" v-if="reportData.newSendCardNum == 0"></i><i class="iconfont icon-jiang" v-if="reportData.newSendCardNum < 0"></i>
            </span>
            <p>新增发卡数</p>
          </div>
        </div>
      </div>
      <div class="list-box">
        <div class="smallBox left">
          <i class="iconfont icon-rencopyx fontSty2"></i>
          <div>
            <h4>{{reportData.xzNum}}</h4>
            <span :class="classSty3">{{reportData.newXzNum<0?Math.abs(reportData.newXzNum):reportData.newXzNum}} <i class="iconfont icon-sheng" v-if="reportData.newXzNum>0"></i>
                <i class="heng" v-if="reportData.newXzNum == 0"></i><i class="iconfont icon-jiang" v-if="reportData.newXzNum < 0"></i>
            </span>
            <p>新增校长数</p>
          </div>
        </div>
        <div class="smallBox right">
          <i class="iconfont icon-rencopyx fontSty2"></i>
          <div>
            <h4>{{reportData.yzNum}}</h4>
            <span :class="classSty4">{{reportData.newYzNum<0?Math.abs(reportData.newYzNum):reportData.newYzNum}} <i class="iconfont icon-sheng" v-if="reportData.newYzNum>0"></i>
                <i class="heng" v-if="reportData.newYzNum == 0"></i><i class="iconfont icon-jiang" v-if="reportData.newYzNum < 0"></i>
            </span>
            <p>新增院长数</p>
          </div>
        </div>
      </div>
      <div class="list-box">
        <div class="smallBox left">
          <i class="iconfont icon-rencopyx fontSty2"></i>
          <div>
            <h4>{{reportData.cyjlNum}}</h4>
            <span :class="classSty5">{{reportData.newCyjlNum<0?Math.abs(reportData.newCyjlNum):reportData.newCyjlNum}} <i class="iconfont icon-sheng" v-if="reportData.newCyjlNum>0"></i>
                <i class="heng" v-if="reportData.newCyjlNum == 0"></i><i class="iconfont icon-jiang" v-if="reportData.newCyjlNum < 0"></i>
            </span>
            <p>新增教练数</p>
          </div>
        </div>
        <div class="smallBox right">
          <i class="iconfont icon-vipcopyx fontSty3"></i>
          <div>
            <h4>{{reportData.vipNum}}</h4>
            <span :class="classSty6">{{reportData.newVipNum<0?Math.abs(reportData.newVipNum):reportData.newVipNum}} <i class="iconfont icon-sheng" v-if="reportData.newVipNum>0"></i>
                <i class="heng" v-if="reportData.newVipNum == 0"></i><i class="iconfont icon-jiang" v-if="reportData.newVipNum < 0"></i>
            </span>
            <p>新增VIP会员数</p>
          </div>
        </div>
      </div>
      <div class="list-box">
        <div class="smallBox left">
          <i class="iconfont icon-dingdancopyx fontSty3"></i>
          <div>
            <h4>{{reportData.totalOrderNum}}</h4>
            <span :class="classSty7">{{reportData.newTotalOrderNum<0?Math.abs(reportData.newTotalOrderNum):reportData.newTotalOrderNum}} <i class="iconfont icon-sheng" v-if="reportData.newTotalOrderNum>0"></i>
                <i class="heng" v-if="reportData.newTotalOrderNum == 0"></i><i class="iconfont icon-jiang" v-if="reportData.newTotalOrderNum < 0"></i>
            </span>
            <p>新增订单数</p>
          </div>
        </div>
        <div class="smallBox right">
          <i class="iconfont icon-jinbicopyx fontSty3"></i>
          <div>
            <h4>{{reportData.totalOrderAmountY}}</h4>
            <span :class="classSty8">{{reportData.newTotalOrderAmountY<0?Math.abs(reportData.newTotalOrderAmountY) : reportData.newTotalOrderAmountY}} <i class="iconfont icon-sheng" v-if="reportData.newTotalOrderAmountY>0"></i>
                <i class="heng" v-if="reportData.newTotalOrderAmountY == 0"></i><i class="iconfont icon-jiang" v-if="reportData.newTotalOrderAmountY < 0"></i>
            </span>
            <p>新增交易金额数</p>
          </div>
        </div>
      </div>
      <div class="list-box">
        <div class="smallBox left">
          <i class="iconfont icon-rencopyx1 fontSty4"></i>
          <div>
            <h4>{{reportData.preBindingNum}}</h4>
            <span :class="classSty9">{{reportData.newPreBindingNum<0?Math.abs(reportData.newPreBindingNum):reportData.newPreBindingNum}} <i class="iconfont icon-sheng" v-if="reportData.newPreBindingNum>0"></i>
                <i class="heng" v-if="reportData.newPreBindingNum == 0"></i><i class="iconfont icon-jiang" v-if="reportData.newPreBindingNum < 0"></i>
            </span>
            <p>新增预绑定用户数</p>
          </div>
        </div>
        <div class="smallBox right">
          <i class="iconfont icon-yonghucopyx fontSty4"></i>
          <div>
            <h4>{{reportData.registerNum}}</h4>
            <span :class="classSty10">{{reportData.newRegisterNum<0?Math.abs(reportData.newRegisterNum):reportData.newRegisterNum}} <i class="iconfont icon-sheng" v-if="reportData.newRegisterNum>0"></i>
                <i class="heng" v-if="reportData.newRegisterNum == 0"></i><i class="iconfont icon-jiang" v-if="reportData.newRegisterNum < 0"></i>
            </span>
            <p>新增用户数</p>
          </div>
        </div>
      </div>
      <div class="clear"></div>
    </div>
    <div class="time">数据更新至{{reportData.recordTime}}</div>
    <mine-footer></mine-footer>
  </div>
</template>

<script>
import { getYesterdayInfo } from '@/api'
import { getUserInfo } from "@/global"
import MineFooter from '@/v0.7/reportForms/data-report/tab-buttom.vue'
export default {
  data() {
    return {
      reportData: {}
    }
  },
  beforeRouteEnter(to, from, next) {
    // ...
    if (getUserInfo().userRoles.find(item => item.roleName == 'admin')) {
      next()
    } else if (!from.name) {
      next({
        name: 'home'
      })
    }
  },
  components: {
    MineFooter
  },

  computed: {
    classSty1() {
      if (this.reportData.newActivateCardNum < 0) {
        return 'blue'
      } else if (this.reportData.newActivateCardNum == 0) {
        return 'gray'
      } else {
        return 'red'
      }
    },
    classSty2() {
      if (this.reportData.newSendCardNum < 0) {
        return 'blue'
      } else if (this.reportData.newSendCardNum == 0) {
        return 'gray'
      } else {
        return 'red'
      }
    },
    classSty3() {
      if (this.reportData.newXzNum < 0) {
        return 'blue'
      } else if (this.reportData.newXzNum == 0) {
        return 'gray'
      } else {
        return 'red'
      }
    },
    classSty4() {
      if (this.reportData.newYzNum < 0) {
        return 'blue'
      } else if (this.reportData.newYzNum == 0) {
        return 'gray'
      } else {
        return 'red'
      }
    },
    classSty5() {
      if (this.reportData.newCyjlNum < 0) {
        return 'blue'
      } else if (this.reportData.newCyjlNum == 0) {
        return 'gray'
      } else {
        return 'red'
      }
    },
    classSty6() {
      if (this.reportData.newVipNum < 0) {
        return 'blue'
      } else if (this.reportData.newVipNum == 0) {
        return 'gray'
      } else {
        return 'red'
      }
    },
    classSty7() {
      if (this.reportData.newTotalOrderNum < 0) {
        return 'blue'
      } else if (this.reportData.newTotalOrderNum == 0) {
        return 'gray'
      } else {
        return 'red'
      }
    },
    classSty8() {
      if (this.reportData.newTotalOrderAmountY < 0) {
        return 'blue'
      } else if (this.reportData.newTotalOrderAmountY == 0) {
        return 'gray'
      } else {
        return 'red'
      }
    },
    classSty9() {
      if (this.reportData.newPreBindingNum < 0) {
        return 'blue'
      } else if (this.reportData.newPreBindingNum == 0) {
        return 'gray'
      } else {
        return 'red'
      }
    },
    classSty10() {
      if (this.reportData.newRegisterNum < 0) {
        return 'blue'
      } else if (this.reportData.newRegisterNum == 0) {
        return 'gray'
      } else {
        return 'red'
      }
    }
  },

  mounted() {
    getYesterdayInfo().then(res => {
      var arr = []
      var dd = ''
      dd = res.data.recordTime
      arr = dd.split(" ")
      res.data.recordTime = arr[0]
      this.reportData = res.data
    })
  },

  methods: {}
}

</script>
<style lang='less' scoped>
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
.time {
  margin-top: 32px;
  font-size: 30px;
  color: rgba(176, 176, 176, 1);
  text-align: center;
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
  padding: 24px 24px 100px 24px;
  background-color: rgba(247, 247, 247, 1);
  overflow: hidden;
  box-sizing: border-box;
  padding-bottom: 110px;
}
.list-box {
  width: 100%;
}
.dataBox {
  padding: 10px 0px;
  background-color: #fff;
  border-radius: 16px;
  width: 100%;
  margin-bottom: 20px;
  .smallBox {
    width: 35%;
    padding: 42.5px 50px;
    align-items: center;
    display: flex;
    div {
      display: inline-block;
      margin-left: 15px;
      h4 {
        font-size: 36px;
      }
      p {
        width: 190px;
        font-size: 26px;
        color: rgba(101, 101, 101, 1);
      }
    }
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
</style>
