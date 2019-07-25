<!-- 编辑未激活的代理页面 -->
<template>
  <section class="mine-container">
    <ul>
      <li><label
          class="required"
          for=""
        >姓名</label><input
          type="text"
          :disabled="!!isDisabled.userName"
          :class="[!!isDisabled.userName? 'disabledStyle':'']"
          v-model.trim="inputObj.userName"
          placeholder="请输入身份证上姓名"
        >
      </li>
      <li><label
          class="required"
          for=""
        > <area-code v-model="inputObj.areaCode"></area-code>
        </label><input
          type="tel"
          :disabled="!!isDisabled.cellPhone"
          :class="[!!isDisabled.cellPhone? 'disabledStyle':'']"
          v-model.trim="inputObj.cellPhone"
          placeholder="请输入手机号"
        ></li>
    </ul>
    <button @click="submitAction">确定</button>
  </section>
</template>
<script>
import { validataFun } from "./validate";
import { Toast, getObject, MyError } from "@/global"; // resolveTimeout, rejectTimeout
import { updateUserInfo, checkIsActive } from "@/api";
import { Indicator } from "mint-ui"; // MessageBox
export default {
  data() {
    return {
      isDisabled: {
        cellPhone: "",
        userName: "",
        agentId: ""
      },
      validate: {
        cellPhone: "",
        userName: "",
        agentId: ""
      },
      inputObj: {
        cellPhone: "", // 代理手机号
        userName: "", // 代理姓名
        agentId: "", // 代理Id
        areaCode: "86"
      }
    };
  },
  methods: {
    areaCodeChoose(menuKey, menuItem) {
      let code = [86, 886, 853, 852, 61, 60, 1, 66][menuKey]
      this.inputObj.areaCode = code || 86;
      // this.checkValue('phone')
    },
    validateForm() {
      let arr = this.validateOptions;
      arr.forEach(key => {
        validataFun(this, key);
      });
      return Object.values(this.validate).filter(item => item)
    },
     // 表单提交
    submitAction() {
      let validate = this.validateForm();
        if (validate.length == 0) {
          Indicator.open();
          let data = getObject(this.inputObj, this.validateOptions);
          updateUserInfo(data)
            .then(res => {
                Indicator.close();
                Toast("修改成功")
                this.$router.go(-1);
            })
            .catch(err => {
              Indicator.close();
                Toast(err);
            })
        } else {
          Toast(new MyError(validate[0], 3));
        }
    },
     // 设置回显字段
    setUserInfo(paramter = {}) {
     Object.assign(this.inputObj, paramter || {})
    }
  },
  mounted() {
     checkIsActive().then(res => {
        this.currentLevel = res.agentLevel;
      });
  },
  computed: {
    validateOptions() {
      let arr = [
        "userName",
        "cellPhone",
        "agentId",
        "areaCode"
      ];
      return arr;
    }
  },
  beforeRouteEnter(to, from, next) {
    let { agentId = 0, realName, cellPhone, areaCode } = { ...to.params, ...to.query };
    let errmsg = "参数错误，请重试";
    if (!agentId) {
        errmsg = "参数丢失";
    } else {
      errmsg = "";
    }
    if (errmsg) {
      Toast(errmsg);
      if (!from.name) {
        next({ name: "home", replace: true });
      }
    } else {
      next(vm => vm.setUserInfo({agentId, userName: realName, cellPhone, areaCode: areaCode || "86"}));
    }
  }
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
    margin-top: 20px;
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
        width: 190px;
        margin-right: 30px;
        display: flex;
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
      border-bottom: 1px solid rgba(247, 247, 247, 1); /* no */

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
  .upload {
    display: flex;
    flex-direction: column;
    background: #fff;
    box-sizing: border-box;
    padding: 0 48px 48px;
    margin-bottom: 40px;
    h5 {
      padding: 20px 0;
      box-sizing: border-box;
      font-size: 34px;
      font-weight: 600;
      color: rgba(51, 51, 51, 1);
      line-height: 48px;
    }
    ul {
      li {
      }
      .positive {
        display: flex;
        flex-direction: column;
        width: 181px;
        height: 236px;
        overflow: hidden;
        opacity: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px solid rgba(151, 151, 151, 1);
        border-radius: 12px;
        background: url("http://chuang-saas.oss-cn-hangzhou.aliyuncs.com/upload/image/20181221/2afe94ae4c9844c4af6459aa9e14719e.png")
          center center no-repeat;
        background-size: 150px;
        position: relative;
        img {
          width: 100%;
        }
        input {
          position: absolute;
          top: 0;
          right: 0;
          width: 100%;
          height: 100%;
          background-color: transparent;
          border: 0;
          opacity: 0;
          -ms-filter: "alpha(opacity=0)";
        }
      }
      display: flex;
      flex-direction: column;
    }
  }
  .margin-bottom-100 {
    margin-bottom: 100px;
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
.required {
  &:before {
    content: "*";
    color: red;
    font-size: 0.42rem;
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
