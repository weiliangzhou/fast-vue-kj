<template>
  <section class="mine-container">
    <ul>
      <li class="avatar-container">
        <label for="">头像</label><img :src="avatar" alt="">
      </li>
    </ul>
    <ul>
      <li>
        <label for="">姓名</label>
        <button @click="showPlugin"><span>{{realName}}</span><i class="iconfont font30 icon-qianjinx"></i></button>
      </li>
      <li><label for="">手机号</label><button><span>{{cellPhone}}</span></button></li>
        <li>
        <label for="">分销区域</label>
        <button @click="changeRouteToAgentArea"><span>{{areaDesc||"未设置"}}</span><i class="iconfont font30 icon-qianjinx"></i></button>
      </li>
        <li>
        <label for="">银行卡</label>
        <button @click="changeRouteToBindBankCard"><span>{{binkCardNum||"未绑定"}}</span><i class="iconfont font30 icon-qianjinx"></i></button>
      </li>
    </ul>
    <ul>
      <li style="align-items: flex-start">
        <label for="">收货地址</label>
        <button><span>{{address}}</span><span>{{detailAddress}}</span></button>
      </li>
    </ul>
    <button @click="logout">退出登录</button>
  </section>
</template>
<script>
import { Toast } from "@/global"; // resolveTimeout, rejectTimeout MyError
// import { Indicator } from "mint-ui"
import { getSetUpInfoVo, updateSaleUser } from "@/api"
export default {
  data() {
    return {
      avatar: 'https://img.mall.xc2018.com.cn/mall/upload/20190513/140756_99_gxee.png', // 头像 并给个默认的地址
      address: "", // 地区
      detailAddress: "", // 详细地址 
      realName: "", //  名字
      cellPhone: "", // 手机号,
      isAdmin: false,
      areaDesc: "",
      binkCardNum: "" // 银行卡
    }
  },
  methods: {
    logout() {
      this.$router.push({ name: "logout" })
    },
    updateUserInfo(paramter = {}) {
      Object.assign(this, paramter)
    },
    changeRouteToAgentArea () {
      this.$router.push({
        name: "agent-area"
      })
    },
    updateSaleUser(realName) {
      if (realName) {
              updateSaleUser({realName}).then(res => {
                Toast("修改成功")
                this.realName = realName
              }).catch(err => {
                Toast(err)
              })
      } else {
        Toast("名字不能为空")
      }
    },
    changeRouteToBindBankCard () {
      this.$router.push({
        name: "binding-bankCard"
      })
    },
    showPlugin () {
       const _this = this
      this.$vux.confirm.prompt('修改姓名', {
        inputAttrs: {
          type: "text",
          maxlength: 8
        },
        title: '修改姓名',
        onShow () {
          _this.$vux.confirm.setInputValue(_this.realName)
        },
        onCancel () {
          console.log('prompt cancel')
        },
        onConfirm (msg) {
          // alert(msg)
           _this.updateSaleUser(msg);
        }
      })
    },
  },
  mounted() {
    getSetUpInfoVo().then(res => this.updateUserInfo(res))
  }
}
</script>
<style lang="less" scoped>
.mine-container {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 0 0 20px 0;
  box-sizing: border-box;
  background: rgba(247, 247, 247, 1);
  ul {
    background: #fff;
    margin-bottom: 20px;
    li {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      padding: 0 32px;
      position: relative;
      label {
        opacity: 1;
        font-size: 34px;
        font-weight: Regular;
        color: rgba(51, 51, 51, 1);
        line-height: 48px;
        letter-spacing: 0.58px;
        padding: 26px 26px 26px 0;
      }
      select {
        flex: 1;
        padding: 32px 0;
        border: none;
        outline: none;
        font-size: 34px;
        color: #363636;
        direction: rtl;
      }
      select {
        font-size: 34px;
        border: none;
        background: none;
        line-height: 48px;
        width: 530px;
        display: block;
        appearance: none;
        -moz-appearance: none;
        -webkit-appearance: none;
        color: #000;
      }
      button,
      select {
        flex: 1;
        font-size: 32px;
        font-weight: Regular;
        color: rgba(153, 153, 153, 1);
        line-height: 45px;
        letter-spacing: -0.77px;
        text-align: right;
        border-width: 0;
        box-sizing: border-box;
        padding: 28px 0;
        background: #fff;
        padding-right: 36px;
      }
      button {
        padding-right: 0;
      }
      border-bottom: 1px solid rgba(247, 247, 247, 1); /* no */

      & > :last-child {
        border-bottom: none;
      }
    }
  }
  &> ul:first-of-type {
      margin-top: 20px;
  }

  .avatar-container {
    padding-right: 48px;
    img {
      width: 88px;
      height: 88px;
      display: block;
      background: rgba(0, 0, 0, 0.3);
      border-radius: 50%;
    }
    padding-top: 16px;
    padding-bottom: 16px;
    &:after {
      display: none;
    }
  }

  & > button {
    margin: 0;
    margin: 32px;
    border-width: 0;
    font-size: 32px;
    background: #D7B686;
    line-height: 32px;
    height: 88px;
    box-sizing: border-box;
    color: #fff;
    border-radius: 6px;
    margin-top: 70px;
  }
}
.afterIcon{
  padding-right: 57px !important;
}
.afterIcon:after {
  display: inline-block;
  content: " ";
  height: 25px;
  width: 25px;
  border-width: 4px 4px 0 0;
  border-color: #c7c7cc;
  border-style: solid;
  transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
  position: absolute;
  top: 50%;
  right: 32px;
  margin-top: -9px;
}
.font30 {
    font-size: 28px;
}
</style>
