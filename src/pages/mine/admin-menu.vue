<template>
  <section class="mine-container">
    <ul>
      <li class="avatar-container">
        <label for="">头像</label><img :src="avatar" alt="">
      </li>
    </ul>
    <ul>
      <li>
        <label for="">当前等级</label>
        <button><span>{{agentLevel | LevelToName}}</span></button>
      </li>
        <li v-if="agentLevel==600">
        <label for="">新增业务员</label>
        <button @click="addSalesMan"><span style="color:red;margin-right:6px">新增</span><i class="iconfont font30 icon-qianjinx"></i></button>
      </li>
        <li v-if="isAdmin">
        <label for="">数据报表</label>
        <button @click="toDataReport"><span style="color:red;margin-right:6px">查看</span><i class="iconfont font30 icon-qianjinx"></i></button>
      </li>
      <li v-if="agentLevel==700">
        <label for="">奖励卡</label>
        <button @click="changePage('reward-card')"><span style="color:red;margin-right:6px">发卡</span><i class="iconfont font30 icon-qianjinx"></i></button>
      </li>
       <li v-if="isAdmin">
        <label for="">排行榜</label>
        <button @click="changePage('salesRank')"><span style="color:red;margin-right:6px">查看</span><i class="iconfont font30 icon-qianjinx"></i></button>
      </li>
    </ul>
    <button @click="backPage">返回</button>
  </section>
</template>
<script>
import { getUserInfo } from "@/global"
import { getSetUpInfoVo } from "@/api"
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
      agentLevel: "",
      binkCardNum: "" // 银行卡
    }
  },
  methods: {
    backPage() {
      this.$router.go(-1)
    },
    updateUserInfo(paramter = {}) {
      Object.assign(this, paramter)
    },
    addSalesMan () {
      this.$router.push({
        name: "add-salesman"
      })
    },
    toDataReport () {
      this.$router.push({
        name: "data-report"
      })
    },
    changePage(routerName) {
        this.$router.push({
        name: routerName
      })
    }
  },
  beforeRouteEnter(to, from, next) {
     let { userRoles = [] } = getUserInfo()
     let isAdmin = !!userRoles.find(({roleName}) => roleName == 'admin');
    if (isAdmin) {
        getSetUpInfoVo().then(res => {
        next(vm => vm.updateUserInfo({...res, isAdmin}))
      }).catch(err => {
        next(vm => vm.updateUserInfo({isAdmin}))
        })
    } else {
      getSetUpInfoVo().then(res => {
        next(vm => vm.updateUserInfo({...res, isAdmin}))
      }).catch(err => {
        if (!from.name) {
          next({name: "home"})
        }
      })
    }
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
        padding: 26px;
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
</style>
