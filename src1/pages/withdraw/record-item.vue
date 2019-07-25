<!-- 提现首页 -->
<template>
  <section
    class="details-2"
    @click="trigger"
  >
    <ul><label for=""><span>{{createTime | dataFormat("MM/dd")}}</span></label>
      <label for=""><span>{{['待申请','审核中', '审核成功', '审核失败'][auditResult]}}</span></label>
      <label><span>{{money | Yuan}}</span></label>
      <label><span>{{actualMoney | Yuan}}</span></label>
      <label><span>明细</span></label></ul>
    <div v-show="isOpen" class="collapse-detail">
      <ol v-show="list.length">
          <li v-for="item in list" :key="item.id"><span>{{item.month}}月</span><span>{{item.money | Yuan}}</span></li>
      </ol>
      <ol>
        <li><span>提现金额</span><span>{{money | Yuan}}</span></li>
        <li><span>扣除税收</span><span>¥{{taxDesc}}</span></li>
        <li><span>实际到账金额</span><span>{{actualMoney | Yuan}}</span></li>
      </ol>
    </div>
  </section>
</template>

<script>
import { findSaleUserDrawDetail } from "@/api"
export default {
    name: "withdrawals-item",
  props: {
    auditResult: { // 审核状态
        type: Number,
        required: true
    },
      id: { // id
        type: Number | String,
        required: true
    },
    createTime: { // 创建时间
        type: Number,
        default: 0,
    },
    money: { // 金额
        type: Number,
        default: 0,
    },
    actualMoney: { // 实际到账金额
        type: Number,
        default: 0,
    },
    taxDesc: { // 税额
        type: Number | String,
        default: 0,
    },
  },
  data() {
    return {
      // 预估收益
      isLoaded: false, // 是否在请求中
      list: [], // 数据保存数组,
      isOpen: false
    };
  },
  components: {},

  computed: {},

  mounted() {},

  methods: {
    trigger() {
        if (this.isLoaded) {
            this.isOpen = !this.isOpen;
        } else {
            this.fetchList()
        }
    },
    // 拉起列表数据
    fetchList() {
      if (!this.isLoaded) {
        findSaleUserDrawDetail(this.id).then(res => {
            this.list = res || [];
            this.isLoaded = true;
            this.isOpen = true;
        })
      }
    }
  }
};
</script>
<style lang='less' scoped>
.details-2 {
  padding: 0 24px;
  box-sizing: border-box;
  & > ul {
    display: flex;
    background: rgba(255, 255, 255, 1);
    margin-bottom: 24px;
    height: 113px;
    box-shadow: 1px 2px 8px 0px rgba(225, 225, 225, 0.5);
    box-sizing: border-box;
    label {
      padding: 36px 0;
      flex: 1;
      box-sizing: border-box;
      text-align: center;
    }
    & > label:nth-of-type(1) {
      font-size: 28px;
      color: rgba(101, 101, 101, 1);
      line-height: 40px;
      letter-spacing: 0.69px;
    }
    & > label:nth-of-type(2) {
      font-size: 28px;
      color: rgba(101, 101, 101, 1);
      line-height: 40px;
      letter-spacing: 0.69px;
      text-align: center;
    }
    & > label:nth-of-type(3) {
      font-size: 24px;
      color: rgba(250, 79, 78, 1);
      line-height: 33px;
      letter-spacing: 0.8px;
      text-align: center;
    }
    & > label:nth-of-type(4) {
      font-size: 26px;
      color: rgba(221, 166, 87, 1);
      line-height: 37px;
      letter-spacing: 0.86px;
      text-align: center;
    }
     & > label:nth-of-type(5) {
      font-size: 26px;
      color: rgba(221, 166, 87, 1);
      line-height: 37px;
      letter-spacing: 0.86px;
      text-align: center;
      span {
        text-decoration: underline;
      }
    }

    // &:after {
    //   background: red;
    //   border-radius: 5px;
    //   content: "+";
    //   color: #fff;
    //   float: left;
    //   font-size: 1.5em;
    //   font-weight: bold;
    //   margin: -5px 10px 0 0;
    //   padding: 0;
    //   text-align: center;
    //   width: 20px;
    // }
  }
  // &:not([open]) {
  //   summary::after {
  //     content: "-";
  //   }
  // }
}
.collapse-detail {
  display: flex;
  flex-direction: column;
  padding: 0 24px;
  width: 100%;
  box-sizing: border-box;
  ol {
    border-bottom: 1px solid rgba(224, 224, 224, 1); /* no */
    margin-bottom: 24px;
    li {
      display: flex;
      justify-content: space-between;
      margin-bottom: 24px;
      & > span:first-of-type {
        height: 40px;
        font-size: 28px;
        color: rgba(101, 101, 101, 1);
        line-height: 40px;
        letter-spacing: 0.69px;
      }
      & > span:last-of-type {
        height: 40px;
        opacity: 1;
        font-size: 24px;
        color: rgba(250, 79, 78, 1);
        line-height: 33px;
        letter-spacing: 0.8px;
      }
      &:last-child {
        margin-bottom: 0;
      }
    }
    &:first-child {
      padding-bottom: 24px;
    }
    &:last-child {
      border-bottom: none; /* no */
    }
  }
}
</style>
