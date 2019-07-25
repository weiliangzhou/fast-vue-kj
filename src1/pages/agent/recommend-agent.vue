
<template>
  <section class="mine-container">
    <ul>
      <li><label class="required" for="">姓名</label><input
          type="text"
          :disabled="!!isDisabled.userName||true"
          :class="[!!isDisabled.userName? 'disabledStyle':'']"
          v-model.trim="inputObj.userName"
          placeholder="姓名"
        >
      </li>
      <li style="position: relative;"><label class="required" for="">手机号</label><input
          type="tel"
          :disabled="!!isDisabled.cellPhone||true"
          :class="[!!isDisabled.cellPhone? 'disabledStyle':'']"
          v-model.trim="inputObj.cellPhone"
          placeholder="手机号"
        ><button @click="selectAgent" style="margin: auto; position: absolute; top:50%;transform:translateY(-50%); border-radius: 12px; right: 10px; box-sizing: border-box; background: #D7B686; color:#fff; padding: 0.16rem 0.24rem;">查找分销商</button></li>
         <li class="afterIcon">

        <label class="required" for="">分销</label>
        <select
          @change="changeAgent"
          v-model="inputObj.agentLevel"
          class="select-after"
          :class="[!!isDisabled.agentLevel? 'disabledStyle':'']"
          :disabled="!!isDisabled.agentLevel&&false"
        >
          <option
            disabled
            selected
            value=""
          >请选择</option>
          <option
            v-for="(item, index) in agentOptions"
            :value="item.level"
            :key="index"
          >{{item.levelName}}</option>
        </select>
      </li>
    </ul>
        <ul>
      <li><label class="required" for="">供应商姓名</label><input
          type="text"
          :disabled="!!isDisabled.referrerName||true"
          :class="[!!isDisabled.referrerName? 'disabledStyle':'']"
          v-model.trim="inputObj.referrerName"
          placeholder="姓名"
        >
      </li>
      <li><label class="required" for="">供应商手机</label><input
          type="tel"
          :disabled="!!isDisabled.referrerPhone||true"
          :class="[!!isDisabled.referrerPhone? 'disabledStyle':'']"
          v-model.trim="inputObj.referrerPhone"
          placeholder="手机号"
        ></li>

         <li>
        <label class="required" for="">供应商级别</label>
        <select
          v-model="inputObj.referrerLevel"
          class="select-after"
          :class="[!!isDisabled.referrerLevel? 'disabledStyle':'']"
          :disabled="!!isDisabled.referrerLevel||true"
        >
          <option
            disabled
            selected
            value=""
          >请选择</option>
          <option
            v-for="(item, index) in referrerLevelOptions"
            :value="item.level"
            :key="index"
          >{{item.levelName}}</option>
        </select>
      </li>
    </ul>
    <button @click="submitAction">确定</button>
  </section>
</template>
<script>
import { validataFun } from "./validate";
import { Toast, getObject, MyError } from "@/global" // resolveTimeout, rejectTimeout
import { checkIsActive, requestReferrer, getRefUpSaleUserInfoVo, getSaleUserInfoVo } from "@/api"
import { Indicator } from 'mint-ui';
const levelOptions = [{levelName: "VIP", level: 100}, {levelName: "教练", level: 200}, {levelName: "院长", level: 300}, {levelName: "校长", level: 400}, {levelName: "小镇", level: 600}, {levelName: "分公司", level: 700}]

export default {
  data() {
    return {
      id: "",
      currentLevel: "",
      agentOptions: [],
      referrerLevelOptions: [...levelOptions],
      isDisabled: {
        agentId: "",
        userName: "true",
        cellPhone: "true",
        agentLevel: "true",
        referrerName: "true",
        referrerPhone: "true",
        referrerLevel: "true"
      },
      validate: {
        agentId: "",
        userName: "",
        cellPhone: "",
        agentLevel: "",
        referrerName: "",
        referrerPhone: "",
        referrerLevel: ""
      },
      inputObj: {
        agentId: "", // 引荐id
        userName: "", // 引荐人的名字
        cellPhone: "", // 手机号
        agentLevel: "", // 引荐级别
        referrerName: "", // 上级姓名
        referrerPhone: "", // 上级手机号
        referrerLevel: "" // 上级级别
      }
    };
  },
  methods: {
    selectAgent() {
      this.$router.push({name: "select-agent"})
    },
    validateForm() {
      let arr = this.validateOptions;
      arr.forEach(key => {
        validataFun(this, key);
      });
      return Object.values(this.validate).filter(item => item)
    },
    submitAction() {
      let validate = this.validateForm()
      if (validate.length == 0) {
        Indicator.open()
        let data = getObject(this.inputObj, this.validateOptions)
        requestReferrer(data).then(res => {
          Toast("已引荐，等待供应商处理")
          this.$router.go(-1)
        }).catch(err => {
          Toast(err)
        }).then(res => {
          Indicator.close()
        })
      } else {
        Toast(new MyError(validate[0], 3))
      }
    },
     // 代理级别改变的时候
    changeAgent() {
      getRefUpSaleUserInfoVo({level: this.inputObj.agentLevel}).then(({ agentLevel: referrerLevel = "", cellPhone: referrerPhone = "", realName: referrerName = "" }) => {
        Object.assign(this.inputObj, { referrerName, referrerPhone, referrerLevel })
        Object.assign(this.isDisabled, { referrerName, referrerPhone, referrerLevel })
      })
    },
  },

  mounted() {
    let agentId = sessionStorage.getItem("agentId") || "";
    sessionStorage.removeItem("agentId")
    this.inputObj.agentId = agentId
    checkIsActive().then(({agentLevel}) => {
      this.agentOptions = levelOptions.filter(({level = 0}) => level >= agentLevel && level < 700)
      if (this.agentOptions.length && agentId) {
          this.inputObj.agentLevel = this.agentOptions[0].level;
          this.changeAgent()
      }
      if (agentId) {
        return getSaleUserInfoVo({uid: agentId}).then(({realName: userName = "", cellPhone = ""}) => {
          Object.assign(this.inputObj, {userName, cellPhone})
           Object.assign(this.isDisabled, {userName, cellPhone})
        })
      }
    }).catch(err => {
      console.log(err)
    })
  },
  computed: {
    validateOptions() {
        return ["agentLevel", "agentId"];
    }
  },
  beforeRouteEnter(to, from, next) {
    next();
  },

};
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
  position: relative;
  & > ul {
    margin-bottom: 20px;
    li {
      background: #fff;
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
        width: 230px;
        margin-right: 20px;
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
        text-align: left;
        border-width: 0;
        box-sizing: border-box;
        padding: 28px 0;
        background: #fff;
        padding-right: 36px;
        direction: ltr;
      }
      input,
      textarea {
        flex: 1;
        font-size: 32px;
        font-weight: Regular;
        color: rgba(153, 153, 153, 1);
        line-height: 45px;
        letter-spacing: -0.77px;
        text-align: left;
        border-width: 0;
        box-sizing: border-box;
        padding: 28px 0;
        background: #fff;
        padding-right: 36px;
      }
      textarea {
        color: rgb(17, 17, 17);
      }
      border-bottom: 1px solid rgba(247, 247, 247, 1);

      & > li:last-of-type {
        border-bottom: none;
      }
    }
  }
  .tips-text {
    opacity: 1;
    font-size: 26px;
    font-family: PingFangSC;
    font-weight: Regular;
    color: red;
    line-height: 37px;
    margin: 10px 0 0;
    padding: 0 32px;
  }
  .margin-bottom-100 {
    margin-bottom: 100px;
  }
  & > button {
    margin: 0;
    padding: 32px auto 34px;
    border-width: 0;
    width: 100vw;
    font-size: 32px;
    background: #D7B686;
    line-height: 32px;
    height: 100px;
    box-sizing: border-box;
    color: #fff;
    border-radius: 0px;
    position: absolute;
    bottom: 0;
  }
}
.required {
    &:before {
        content: "*";
        color:red;
        font-size: 0.42rem
    }
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
.disabledStyle,
.disabledStyle:disabled {
  background-color: #fff;
  color: rgba(0, 0, 0, 1) !important;
  opacity: 0.5;
  -webkit-opacity: 0.5;
  -webkit-text-fill-color: rgba(0, 0, 0, 1);
}
</style>
