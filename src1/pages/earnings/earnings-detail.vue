<!--  -->
<template>
  <section>
    <div class="top-container">
      <p><span>{{ earnings | Yuan(undefined, ["", ""]) }}</span><span>元</span></p>
    </div>
    <div class="middle">
      <ul>
        <li><label for="">购买人姓名</label><span class="ellipsis_1">{{name}}</span></li>
        <li><label for="">购买人学号</label><span class="ellipsis_1">{{username}}</span></li>
        <li><label for="">购买人手机号</label><span class="ellipsis_1">{{phone}}</span></li>
        <li><label for="">关系</label><span class="ellipsis_1">{{relation}}</span></li>
        <li><label for="">订单编号</label><span class="ellipsis_1">{{orderNo}}</span></li>
        <li><label for="">商品名称</label><span class="ellipsis_1">{{goodsName}}</span></li>
        <li><label for="">订单金额</label><span class="ellipsis_1">{{priceDesc}}</span></li>
        <li><label for="">创建时间</label><span class="ellipsis_1">{{createdAt}}</span></li>
        <li><label for="">支付时间</label><span class="ellipsis_1">{{payTime}}</span></li>
      </ul>
    </div>
  </section>
</template>
<script>
import { Toast } from '@/global' // resolveTimeout, rejectTimeout, getObject,
import { getOrderDetailInfo } from '@/api'
export default {
  data() {
    return {
      earnings: 0,
      createdAt: '',
      goodsName: '',
      name: '',
      orderNo: '',
      payTime: '',
      phone: '',
      price: '',
      priceDesc: '',
      relation: '',
      username: ''
    }
  },
  computed: {},

  mounted() {},

  methods: {},
  beforeRouteEnter(to, from, next) {
    let { orderSn, money } = to.query
    if (orderSn) {
      getOrderDetailInfo(orderSn).then(res => {
        next(vm => {
          Object.assign(vm, res, {earnings: money})
        })
      }).catch(err => {
          Toast(err)
      })
    }
  }
}
</script>

<style lang="less" scoped>
section {
  width: 100vw;
  box-sizing: border-box;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background: #f7f7f7;
  min-height: 100vh;
  // height: calc(100vh - 94px);
  flex: 1;
}
div[class='top-container'] {
  position: relative;
  width: 100%;
  height: 302px;
  background: url('https://img.mall.xc2018.com.cn/mall/upload/20190530/144121_16_usj2.png')
    no-repeat center / cover;
  box-shadow: 0px 4px 15px 0px rgba(229, 229, 229, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  p {
    & > span:first-of-type {
      height: 140px;
      font-size: 120px;
      font-family: DINAlternate-Bold;
      font-weight: bold;
      color: rgba(255, 255, 255, 1);
      line-height: 140px;
      margin-right: 15px;
    }
    & > span:last-of-type {
      height: 45px;
      font-size: 32px;
      font-family: PingFangSC-Semibold;
      font-weight: 600;
      color: rgba(255, 255, 255, 1);
      line-height: 45px;
    }
  }
}

div[class='middle'] {
  margin: 20px 0;
  background: #fff;
  ul {
    li {
      padding: 32px 24px;
      display: flex;
      align-items: center;
      label {
        max-width: 180px;
        height: 40px;
        font-size: 28px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(54, 54, 54, 1);
        line-height: 40px;
      }
      span {
        height: 40px;
        font-size: 28px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(152, 152, 152, 1);
        line-height: 40px;
        flex: 1;
        text-align: right;
      }

      position: relative;
      &:after {
        content: '';
        display: block;
        position: absolute;
        height: 1px; /* no */
        right: 0;
        bottom: 0;
        background: #e5e5e5;
        width: 696px;
      }
      &:last-child {
        &:after {
          display: none;
        }
      }
    }
  }
}
</style>
