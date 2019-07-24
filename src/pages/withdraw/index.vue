<!-- 提现首页 -->
<template>
  <section id="withdraw-page">
    <div class="top-bar-container">
        <button @click="regularTipsIsShow=true"><span>提现规则</span><span>?</span></button>
        <h6>累计可提现 (元)</h6>
        <h4>{{extract}}</h4>
        <p>历史总收益 ¥{{history}}</p>
        <ul>
            <!-- <li><span>在线购买VIP</span><span>12</span></li> -->
            <li><span>知识付费</span><span>¥{{knowledge}}</span></li>
            <li><span>产品课程</span><span>¥{{course}}</span></li>
        </ul>
    </div>
    <div class="list-title">
      <span>日期</span>
      <span>状态</span>
      <span>金额</span>
      <span>查看</span>
      <span> </span>
    </div>
    <div class="list-container">
      <ul
        v-show="currentList.length"
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="isLoading"
        :infinite-scroll-immediate-check="true"
        infinite-scroll-distance="10"
      >
        <li
          v-for="item in currentList"
          :key="item.id"
        >
        <label for=""><span>{{item.year}}-{{item.month}}</span></label>
          <label for=""><span>{{['未出账','已出账','审核中', '已提现'][item.state]}}</span></label>
          <label for="" class="ellipsis_1"><span>{{item.money | Yuan }}</span></label>
          <label for=""><span @click="goEarningsDetail(item.year+'-'+item.month)">明细</span></label>
          <label class="list-item"><input
              name="draw-select"
              v-model="selected"
              type="checkbox"
              :value="item.id"
              :disabled="item.state !== 1"
            /><span></span></label>
        </li>
      </ul>
      <no-more v-show="currentList.length === 0"></no-more>
    </div>
    <div class="bottom-container">
      <button @click="pushRoute('withdraw-record')"><span>提现记录</span></button>
      <button @click="ApplicationWithdrawal" :disabled="!selected.length" :style="{background: selected.length?'':'#d7b68657'}"><span>申请提现</span></button>
    </div>
    <section v-if="regularTipsIsShow" class="pop-container">
        <div class="regular-container">
            <h5>提现规则</h5>
            <ul>
                <li>1 . 提现会扣除相应税收。</li>
                <li>2 . 用户可以随时申请提现, 财务统一每自然月15日统一打款。</li>
                <li>3 . 已出账处于用户结算完成, 可正常提现。</li>
                <li>4 . 未出账正处于用户结算中, 不能进行提现。</li>
                <li>5 . 已提现, 用户已经完成提现, 用户自行查看银行卡对账。</li>
                <li>6 . 审核中, 该笔账单正在提现审核中, 请耐心等待。</li>
            </ul>
            <button @click="regularTipsIsShow=false;">知道了</button>
        </div>
    </section>
       <section v-if="bindBankIsShow&&!regularTipsIsShow" class="pop-container">
        <div class="bindBank-tips-container">
            <img src="https://img.mall.xc2018.com.cn/mall/upload/20190325/162753_45_frie.png" alt="">
            <p>你还未绑定银行卡 , 请先绑定银行卡</p>
            <button @click="pushRoute('binding-bankCard')">去绑定银行卡</button>
        </div>
    </section>
  </section>
</template>

<script>
import { findSaleUserBillList, addUserDraw, getBankInfo, getUserWallet } from "@/api"
import { MyError, Toast } from "@/global"; // resolveTimeout, rejectTimeout, getObject, Toast
export default {
  data() {
    return {
      extract: 0, // 累计可提现
      course: 0, // 用户课程收费
      history: 0, // 用户总收益
      knowledge: 0,
      withdrawList: {
        // 预估收益
        isLoading: false, // 是否在请求中
        list: [], // 数据保存数组
        pageNum: 0, // 当前页码
        total: -1
      },
      selected: [],
      regularTipsIsShow: false,
      bindBankIsShow: false,
    };
  },
  components: {},

  computed: {
    currentList() {
      let { list = [] } = this["withdrawList"];
      return list;
    },
    isLoading() {
      let { isLoading, total } = this["withdrawList"];
      return isLoading || total !== -1;
    }
  },

  mounted() {
    this.fetchList().finally(res => {
       getBankInfo().then(res => {
        if (!res.bankCard || res.isPact === 0) {
          this.bindBankIsShow = true;
        }
    })
    })
    getUserWallet().then(res => {
      Object.assign(this, res)
    })
  },

  methods: {
    ApplicationWithdrawal() {
      if (this.selected.length) {
         addUserDraw(this.selected).then(({id}) => {
            this.$router.push({name: "do-withdraw", query: { withdrawId: id }})
         }).catch(err => {
           if ([3517, 3544].includes(err.errno)) {
              this.bindBankIsShow = true;
           } else {
             Toast(err)
           }
         })
      }
    },
    goEarningsDetail(date) {
        this.$router.push({name: "product-earnings", query: { date }})
    },
    // product-earnings
    loadMore() {
      let { isLoading = false, total = -1 } = this["withdrawList"];
      if (!isLoading && total === -1) {
        this.fetchList();
      }
    },
    // 拉起列表数据
    fetchList(isReset = false) {
      let content = this["withdrawList"];
      let { isLoading = false, list = [], pageNum = 0, total = -1 } = content;
      if (!isReset && isLoading) {
        return Promise.reject(new MyError("不能重复请求", 1));
      } else if (!isReset && total !== -1) {
        return Promise.reject(new MyError("已经没有数据", 1));
      } else {
        if (isReset) {
          list = [];
          pageNum = 0;
           Object.assign(content, {
              list: [...list],
              pageNum,
              total: -1
          });
        }
        content.isLoading = true;
            return findSaleUserBillList({
              pageSize: 15,
              pageNum: pageNum + 1
            })
          .then(res => {
            let tempList = [...list, ...res];
            Object.assign(content, {
              list: tempList,
              pageNum: res.length ? pageNum + 1 : pageNum,
              total: res.length ? -1 : tempList.length,
              isLoading: false
            });
          })
          .catch(err => {
            Toast(err);
            content.isLoading = false;
          });
      }
    }
  }
};
</script>
<style lang='less' scoped>
#withdraw-page {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 32px 24px 0;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background: rgba(244, 244, 244, 1);
  align-items: center;
  position: relative;
}
.top-bar-container {
  width: 100%;
  height: 360px;
  box-sizing: border-box;
  box-shadow: 4px 8px 32px 0px rgba(229, 207, 164, 1);
  border-radius: 24px;
  overflow: hidden;
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
  border-radius: 0 0 16px 16px;
  & > button {
    position: absolute;
    background: transparent;
    border: none;
    right: 32px;
    top: 28px;
    font-size: 26px;
    color: rgba(255,255,255,1);
    padding: 16px;
    line-height: 37px;
    letter-spacing: 0.34px;
    display: flex;
    align-items: center;
      &>span:last-of-type {
        border-radius: 50%;
        width: 26px;
        height: 26px;
        text-align: center;
        line-height: 26px;
        box-sizing: content-box;
         border: 1px solid rgba(237,237,237,1); /* no */
         margin-left: 10px;

      }
  }
  h6 {
        height: 42px;
        font-size: 30px;
        color: rgba(255,255,255,1);
        line-height: 42px;
        letter-spacing: 0.39px;
        margin: 42px 0 16px;
  }
  h4{
    height: 78px;
    opacity: 1;
    font-size: 56px;
    font-family: PingFangSC;
    color: rgba(255,255,255,1);
    line-height: 78px;
    letter-spacing: 1.19px;
  }
  p {
    height: 40px;
    font-size: 26px;
    color: rgba(255,255,255,1);
    line-height: 37px;
    letter-spacing: 0.34px;
    margin: 5px 20px;
  }
  ul {
      display: flex;
      height: 112px;
      box-sizing: border-box;
      background: rgba(220,177,107,1);
      width: 100%;
      li {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          align-items: center;
          margin: 20px auto 16px;
          &>span:nth-of-type(1){
            height: 33px;
            font-size: 24px;
            color: rgba(243,230,208,1);
            line-height: 33px;
            letter-spacing: 0.51px;
          }
          &>span:nth-of-type(2) {
            height: 40px;
            font-size: 24px;
            color: rgba(255,255,255,1);
            line-height: 33px;
            letter-spacing: 0.59px;
          }
      }
  }
}
.list-container {
  display: flex;
  flex: 1;
  position: relative;
  width: 100%;
    overflow-y: scroll; //该属性随着手指离开立即停止
  -webkit-overflow-scrolling: touch; //该属性随着手指离开还会保持滚动
  ul {
    padding-bottom: 24px;
    box-sizing: border-box;
    height: 100%;
    flex: 1;
    position: absolute;
    width: 100%;
    li {
      display: flex;
      padding: 36px 40px 36px 24px;
      background: rgba(255, 255, 255, 1);
      margin-bottom: 24px;
        height: 113px;
        box-shadow: 1px 2px 8px 0px rgba(225,225,225,0.5);
        box-sizing: border-box;
        align-items: center;
        overflow: hidden;
      label {
          flex: 4;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
      }
      &>label:nth-of-type(1) {
        height: 40px;
        font-size: 28px;
        color: rgba(101,101,101,1);
        line-height: 40px;
        letter-spacing: 0.69px;
      }
       &>label:nth-of-type(1) {
        height: 40px;
        font-size: 28px;
        color: rgba(101,101,101,1);
        line-height: 40px;
        letter-spacing: 0.69px;
      }
       &>label:nth-of-type(1) {
        height: 40px;
        font-size: 28px;
        color: rgba(101,101,101,1);
        line-height: 40px;
        letter-spacing: 0.69px;
      }
       &>label:nth-of-type(2) {
        height: 40px;
        font-size: 28px;
        color: rgba(101,101,101,1);
        line-height: 40px;
        letter-spacing: 0.69px;
      }
       &>label:nth-of-type(3) {
        height: 40px;
        font-size: 24px;
        color: rgba(250,79,78,1);
        line-height: 33px;
        letter-spacing: 0.8px;
      }
       &>label:nth-of-type(4) {
        height: 37px;
        font-size: 26px;
        color: rgba(221,166,87,1);
        line-height: 37px;
        letter-spacing: 0.86px;
      }

      &>label:nth-of-type(5) {
        flex: 2;
      }
    }
  }
}
.list-item {
  position: relative;
  display: flex;
  justify-content: flex-end;
  & > input[type="checkbox"] {
    width: 40px;
    height: 40px;
    opacity: 0;
  }

  span {
    position: absolute;
    right: 0;
    top: 0;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 1px solid #999; /*no*/
    box-sizing: border-box;
  }

  input:checked + span {
    background-color: #d7b686;
    border: 1px solid #d7b686; /*no*/
    box-sizing: border-box;
  }
   input:disabled + span {
    border: 1px solid #d7b68645; /*no*/
    box-sizing: border-box;
  }
  input:checked + span::after {
    position: absolute;
    content: "";
    width: 10px;
    height: 20px;
    top: 3px;
    left: 9px;
    border: 4px solid #fff;
    border-top: none;
    border-left: none;
    transform: rotate(45deg);
  }
}
.list-title {
  display: flex;
  align-items: center;
  width: 100%;
  margin: 54px 0 24px;
  padding: 0 40px 0 24px;
  box-sizing: border-box;
  span {
    flex: 4;
    font-size: 28px;
    color: rgba(101, 101, 101, 1);
    line-height: 40px;
    letter-spacing: 0.69px;
    text-align: center;
    &:last-child {
      flex: 2;
      height: 40px;
    }
  }
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
}
.regular-container {
    width: 100%;
    height: 700px;
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
        color: rgba(54,54,54,1);
        line-height: 56px;
        letter-spacing: 0.44px;
        margin: 40px 0 48px;
    }
    ul {
        padding: 0 62px 22px;
        overflow-y: scroll; //该属性随着手指离开立即停止
        -webkit-overflow-scrolling: touch; //该属性随着手指离开还会保持滚动
        border-bottom: 1px solid rgba(237,237,237,1); /* no */
        flex: 1;
        height: 0;
        li {
            font-size: 32px;
            font-family: PingFangSC;
            color: rgba(101,101,101,1);
            line-height: 45px;
            letter-spacing: 0.35px;
            margin: 4px 0;
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
.bindBank-tips-container {
    width: 100%;
    background: #fff;
    border-radius: 12px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    img {
          width: 125px;
          height: 125px;
          border-radius: 50%;
          background: #fff;
          margin-top: 97px;
          display: block;
    }
   p {
        font-size: 36px;
        color: rgba(101,101,101,1);
        line-height: 50px;
        letter-spacing: 0.87px;
        padding: 40px 70px 84px 66px;
         border-bottom: 1px solid rgba(237,237,237,1); /* no */
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
</style>
