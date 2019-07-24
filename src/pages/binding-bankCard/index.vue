<template>
  <section class="mine-container">
    <!-- <div style="padding:15px;">
      <x-button @click.native="showPlugin3" type="primary"> {{ 'Call prompt by using plugin' }} </x-button>
    </div> -->
    <ul>
      <li><label class="required" for="">姓名</label><input
          type="text"
          :disabled="!!isDisabled.realName"
          :class="[!!isDisabled.realName? 'disabledStyle':'']"
          v-model.trim="inputObj.realName"
          placeholder="请输入身份证上姓名"
        >
      </li>
      <p class="tips-text" style="margin-bottom: 0.1333rem">填写身份证真实姓名</p>
      <li><label class="required" for="">手机号</label><input
          type="text"
          :disabled="!!isDisabled.phone"
          :class="[!!isDisabled.phone? 'disabledStyle':'']"
          v-model.trim="inputObj.phone"
          placeholder="请输入手机号"
        ></li>
         <li><label class="required" for="">身份证</label><input
          type="text"
          :disabled="!!isDisabled.identityCard"
          :class="[!!isDisabled.identityCard? 'disabledStyle':'']"
          v-model.trim="inputObj.identityCard"
          placeholder="请输入身份证"
        ></li>
    </ul>
    <ul>
         <li class="afterIcon">
        <label class="required" for="">开户行</label>
        <select
          v-model="inputObj.bankType"
          class="select-after"
          :class="[!!isDisabled.bankType? 'disabledStyle':'']"
          :disabled="!!isDisabled.bankType"
        >
          <option
            disabled
            selected
            value=""
          >请选择开户行</option>
          <option
            v-for="(item, index) in bankOptions"
            :value="item.value"
            :key="index"
          >{{item.label}}</option>
        </select>
      </li>
      <li><label class="required" for="">银行卡</label><input
          type="tel"
          :class="[!!isDisabled.bankCard? 'disabledStyle':'']"
          :disabled="!!isDisabled.bankCard"
          v-model.trim="inputObj.bankCard"
          placeholder="请输入银行卡号"
        ></li>
    </ul>
      <ul>
       <li><label for="">开户城市</label><input
          type="text"
          :class="[!!isDisabled.bankCity? 'disabledStyle':'']"
          :disabled="!!isDisabled.bankCity"
          v-model.trim="inputObj.bankCity"
          placeholder="请输入开户城市"
        ></li>
      <li>
        <textarea
          style=""
          :disabled="!!isDisabled.bankBranck"
          v-model="inputObj.bankBranck"
          placeholder="请输入开户支行"
        ></textarea>
      </li>
      <p class="tips-text">注: 姓名 / 身份证 / 银行卡号 对应信息一致才可以正常提现目前只支持中国大陆公民身份绑定银行卡</p>
    </ul>
    <button v-show="!isDisabled.bankBranck" @click="submitAction">确定</button>
     <button v-show="isDisabled.bankBranck" @click="backAction">返回</button>
  </section>
</template>
<script>
import { validataFun } from "./validate";
import { Toast, getObject, MyError } from "@/global" // resolveTimeout, rejectTimeout
import { getBankInfo, addBankInfo } from "@/api"
export default {
  data() {
    return {
      bankOptions: [ // 待选的四大银行
        {
            label: "中国银行",
            value: 1,
        },
        {
            label: "建设银行",
            value: 2,
        },
        {
            label: "农业银行",
            value: 3,
        },
        {
            label: "储蓄银行",
            value: 4,
        },
         {
            label: "工商银行",
            value: 5,
        },
        {
            label: "农商银行",
            value: 6,
        },
      ],
      isDisabled: {
        id: "",
        realName: "",
        phone: "",
        identityCard: "",
        bankCard: "",
        bankCity: "",
        bankBranck: "",
        bankType: ""
      },
      validate: {
        id: "",
        realName: "",
        phone: "",
        identityCard: "",
        bankCard: "",
        bankCity: "",
        bankBranck: "",
        bankType: ""
      },
      inputObj: {
        id: "", // 该条信息的id
        realName: "", // 姓名
        phone: "", // 手机号
        identityCard: "", // 身份证
        bankCard: "", // 银行卡
        bankCity: "", // 开户城市
        bankBranck: "", // 开户支行
        bankType: "" // 四大银行之一
      }
    };
  },
  methods: {
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
        let data = getObject(this.inputObj, this.validateOptions)
        addBankInfo(data).then(res => {
          if (this.inputObj.id) {
            Toast("修改成功");
          } else {
            Toast("保存成功");
          }
         Object.assign(this.inputObj, data)
         // Object.assign(this.isDisabled, data)
         if (res.pact == 0) {
           window.location.href = res.pactHtmlUrl;
         } else {
           this.$router.go(-1)
         }
        }).catch(err => {
          Toast(err)
        })
      } else {
        Toast(new MyError(validate[0], 3))
      }
    },
  },
  mounted() {
    // 获取已绑定的银行卡信息
    document.title = "绑定银行卡";
    getBankInfo().then(res => {
         let data = getObject(res, this.validateOptions)
         Object.assign(this.inputObj, data)
         if (res.isPact) {
          Object.assign(this.isDisabled, { realName: true,
        phone: true,
        identityCard: true,
        bankCard: true,
        bankCity: true,
        bankBranck: true,
        bankType: true})
         }
    })
  },
  computed: {
    validateOptions() {
      let arr = [
        "realName",
        "phone",
       "bankCard",
        "identityCard",
        // "bankCity",
        // "bankBranck",
        "bankType",
        "id"
      ];
      return arr;
    },
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
        width: 160px;
        margin-right: 30px;
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
    color: rgba(152, 152, 152, 1);
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
      color: rgba(51,51,51,1);
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
   .recharge-record {
    display: flex;
    flex-direction: column;
    background: #fff;
    box-sizing: border-box;
    padding: 0 48px 48px;
    margin-bottom: 50px;
    h5 {
      padding: 20px 0;
      box-sizing: border-box;
      font-size: 34px;
      font-weight: 600;
      color: rgba(51,51,51,1);
      line-height: 48px;
    }
    ul {
      li {
       display: flex;
       justify-content: space-between;
       margin-bottom: 20px;
       &>span {
        font-size: 32px;
        color: rgba(101,101,101,1);
        line-height: 34px;
       }
       &:last-child {
         margin-bottom: 0;
       }
      }

      }
      display: flex;
      flex-direction: column;
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
.required {
    &:before {
        content: "*";
        color:red;
        font-size: 0.42rem
    }
}
</style>
