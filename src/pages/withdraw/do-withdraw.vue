<!-- 提现具体操作页面 -->
<template>
  <section id="do-withdraw-page">
    <div class="bank-card-container">
        <img src="https://img.mall.xc2018.com.cn/mall/upload/20190325/162753_45_frie.png" alt="">
        <div>
            <h5>{{["", "中国银行", "建设银行", "农业银行", "储蓄银行", "工商银行","农商银行"][bankInfo.bankType]}}</h5>
            <p>尾号{{bankInfo.bankCard? bankInfo.bankCard.substr(-4) : ""}} 储蓄卡</p>
        </div>
    </div>
    <div class="list-container">
        <p>提现金额</p>
        <h4>¥{{money}}</h4>
        <p>提现明细</p>
      <ul
      >
        <li
          v-for="item in userBills"
          :key="item.id"
        >
          <span>{{item.year}}-{{item.month}}</span>
          <span>{{item.money | Yuan}}</span>
        </li>
      </ul>
      <no-more v-show="userBills.length === 0"></no-more>
    </div>
    <ul class="tips-container">
        <p>1 . 提现之前请完善资料绑定您的银行卡</p>
        <p>2 . 提现会扣除相应税收</p>
        <p>3 . 用户可以随时申请提现, 财务统一每自然月15日统一打款</p>
    </ul>
    <div class="bottom-container">
      <button @click="showConfirm=true"><span>申请提现</span></button>
    </div>
    <section v-if="showConfirm" class="pop-container">
        <div>
            <ul>
                <li><span>提现金额</span><span>¥{{money}}</span></li>
                <li><span>扣除税收</span><span>¥{{taxMoney}}</span></li>
                <li><span>实际到账金额</span><span>¥{{actualMoney}}</span></li>
            </ul>
            <button @click="doDraw">确认提现</button>
        </div>
    </section>
  </section>
</template>
<script>
import { getUserDrawInfo, affirmUserDraw } from "@/api"
import { Toast } from "@/global"; // resolveTimeout, rejectTimeout, getObject, Toast
export default {
  data() {
    return {
      showConfirm: false,
      userBills: [],
        "money": 0,
        "taxMoney": 0,
        actualMoney: 0,
      bankInfo: {}
    };
  },
  mounted() {},

  methods: {
    doDraw() {
      affirmUserDraw(this.$route.query.withdrawId).then(res => {
        Toast("申请成功，等待审核")
        this.$router.go(-1)
      }).catch(err => {
        Toast(err)
      })
    }
  },
  beforeRouteEnter(to, from, next) {
   let { withdrawId } = { ...to.params, ...to.query }
   if (withdrawId) {
      getUserDrawInfo(withdrawId).then(({userBills, ...reset}) => {
       next(vm => {
          Object.assign(vm, {userBills, ...reset})
       })
    }).catch(err => {
      if (!from.name) {
        next({name: "withdraw"})
      } else {
        Toast(err)
      }
    })
   } else {
      if (!from.name) {
        next({name: "withdraw"})
      } else {
        Toast("参数丢失")
      }
   }
  },
};
</script>
<style lang='less' scoped>
#do-withdraw-page {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 0 24px;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background: rgba(244, 244, 244, 1);
  align-items: center;
  position: relative;
}
.bank-card-container {
    display: flex;
    margin: 24px 0;
    width: 100%;
    border-radius: 6px;
    height: 156px;
    background: rgba(255,255,255,1);
    overflow: hidden;
    justify-content: flex-start;
    align-items: center;
    box-sizing: border-box;
    padding: 32px 0 32px 24px;
    img {
        width: 92px;
        height: 92px;
        display: block;
        border-radius: 50%;
        overflow: hidden;
        background: rgba(225,225,225,1);
        margin-right: 20px;
        display: block;
    }
    & > div {
        h5 {
            height: 48px;
            font-size: 34px;
            font-family: PingFangSC;
            color: rgba(54,54,54,1);
            line-height: 48px;
            letter-spacing: 0.55px;
        }
        p {
            height: 40px;
            font-size: 28px;
            font-family: PingFangSC;
            color: rgba(152,152,152,1);
            line-height: 40px;
            letter-spacing: 0.45px;
        }
    }
}
.list-container {
  display: flex;
  flex: 1;
  position: relative;
      padding: 32px 24px;
  width: 100%;
  flex-direction: column;
  box-sizing: border-box;
  background: #fff;
      p {
        height: 42px;
        font-size: 30px;
        color: rgba(152,152,152,1);
        line-height: 42px;
        letter-spacing: 0.48px;
    }
    h4 {
        height: 78px;
        font-size: 40px;
        color: rgba(250,79,78,1);
        line-height: 56px;
        letter-spacing: 0.9px;
        padding: 22px 0;
        border-bottom: 1px solid rgba(229,229,229,1); /* no */
    }
    &>p:nth-of-type(2) {
        margin: 32px 0 24px;
    }
  ul {
    padding-bottom: 24px;
    box-sizing: border-box;
    height: 100%;
    flex: 1;
    width: 100%;
      overflow-y: scroll; //该属性随着手指离开立即停止
  -webkit-overflow-scrolling: touch; //该属性随着手指离开还会保持滚动
    li {
      display: flex;
      background: rgba(255, 255, 255, 1);
      margin-bottom: 24px;
        box-sizing: border-box;
        align-items: center;
        justify-content: space-between;
        overflow: hidden;
       &>span:nth-of-type(1) {
        height: 41px;
        font-size: 29px;
        color: rgba(101,101,101,1);
        line-height: 41px;
        letter-spacing: 0.72px;
      }
       &>span:nth-of-type(2) {
        height: 40px;
        font-size: 24px;
        color: rgba(250,79,78,1);
        line-height: 33px;
        letter-spacing: 0.8px;
      }
    }
  }
}
.tips-container {
    margin: 24px 0 56px;
    width: 100%;
    font-size: 28px;
    color: rgba(152,152,152,1);
    line-height: 40px;
    letter-spacing: 0.45px;
}
.bottom-container {
  width: 100vw;
  height: 120px;
  padding: 16px 24px;
  box-sizing: border-box;
  background: #fff;
  display: flex;
  justify-content: space-around;
  button {
    height: 100%;
    flex: 1;
    color: rgba(215, 182, 134, 1);
    background: rgba(255, 251, 244, 1);
    box-sizing: content-box;
    border: 1px solid rgba(215, 182, 134, 1); /* no */
    border-radius: 6px;
    overflow: hidden;
    span {
      font-size: 36px;
      font-family: PingFangSC;
      line-height: 50px;
      letter-spacing: 0.58px;
      color: #d7b686;
    }
  }
  & > button:last-child {
    margin-left: 24px;
    background: #d7b686;
    span {
      color: white;
    }
  }
}

.pop-container{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
    background: rgba(14,14,14,0.47);
    box-sizing: border-box;
    padding: 0 90px;
    position: absolute;
    top: 0;
    right: 0;
    & >div {
        width: 100%;
        background: #fff;
        border-radius: 12px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        align-items: center;
        ul {
            padding: 126px 0 104px 40px;
            border-bottom: 1px solid rgba(237,237,237,1); /* no */
            flex: 1;
            width: 100%;
            box-sizing: border-box;
            li {
                font-size: 32px;
                font-family: PingFangSC;
                color: rgba(101,101,101,1);
                line-height: 45px;
                letter-spacing: 0.35px;
                display: flex;
                align-items: center;
                margin-bottom: 52px;
                span {
                  font-weight: 600;
                  flex: 1;
                  font-size: 32px;
                  font-family: PingFangSC;
                  color: rgba(54,54,54,1);
                  line-height: 45px;
                  letter-spacing: 0.35px;
                  &:last-child {
                    color: rgba(250,79,78,1);
                  }
                }
                &:last-child {
                  margin-bottom: 0;
                }
            }
        }
        button {
            padding: 22px 32px 24px;
            color: rgba(221,166,87,1);
            border: none;
            background: transparent;
            font-size: 34px;
            color: rgba(221,166,87,1);
            line-height: 48px;
            letter-spacing: 0.37px;
            font-weight: 600;
        }
    }
}
</style>
