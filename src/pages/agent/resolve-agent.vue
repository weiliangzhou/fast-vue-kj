
<!-- 同意下级的推荐页面（激活，给代理充卡） -->
<template>
  <section class="mine-container">
    <ul>
      <li><label class="required" for="">姓名</label><input
          type="text"
          :disabled="!!isDisabled.userName"
          :class="[!!isDisabled.userName? 'disabledStyle':'']"
          v-model.trim="inputObj.userName"
          placeholder="请输入身份证上姓名"
        >
      </li>
      <li><label class="required" for="">手机号</label><input
          type="tel"
          :disabled="!!isDisabled.cellPhone"
          :class="[!!isDisabled.cellPhone? 'disabledStyle':'']"
          v-model.trim="inputObj.cellPhone"
          placeholder="请输入手机号"
        ></li>
    </ul>
    <ul>
       <li
          class="afterIcon"
          v-if="currentLevel==700"
        >
          <label
            class="required"
            for=""
          >卡类型</label>
          <select
            v-model="inputObj.cardType"
            class="select-after"
            :class="[!!isDisabled.cardType? 'disabledStyle':'']"
            :disabled="!!isDisabled.cardType"
          >
            <option
              disabled="disabled"
              value=""
            >请选择</option>
            <option
              v-for="(item, index) in cardTypes"
              :value="item.value"
              :key="index"
            >{{item.label}}</option>
          </select>
        </li>
        <li><label
            class="required"
            for=""
          >升级卡数</label><input
            type="tel"
            :class="[currentLevel!==700? 'disabledStyle':'']"
            :disabled="currentLevel!==700"
            v-model.trim="inputObj.cardNum"
            placeholder="请输入输入卡数"
          ></li>
      <li>
        <label class="required" for="">分销</label><button
          class="select-after"
          :class="[!!isDisabled.agentLevel? 'disabledStyle':'']"
          :disabled="!!isDisabled.agentLevel">{{inputObj.agentLevel | LevelToName}}</button>
      </li>
       <p class="tips-text">当前剩余卡数：{{cardRes}}张 您将消耗{{inputObj.cardNum}}张卡给他升级</p>
    </ul>
    <div class="upload">
      <h5 class="title required">打款记录</h5>
      <ul class="picture">
        <li class="positive">
          <img :src="inputObj.remittanceImg">
          <input
            type="file"
            :disabled="isUploading"
            @change="uploadpositiveFile($event)"
            accept="image/*"
          />
        </li>
      </ul>
    </div>
     <ul class="margin-bottom-100">
      <li><label for="">推广人</label><input
          type="tel"
          :class="[!!isDisabled.referrerPhone? 'disabledStyle':'']"
          :disabled="!!isDisabled.referrerPhone"
          v-model.trim="inputObj.referrerPhone"
          placeholder="请输入推广人手机号"
        ></li>
          <p class="tips-text">无推广人请勿填写,请不要填写自己的手机号</p>
    </ul>
    <button @click="submitAction">确定</button>
  </section>
</template>
<script>
import { validataFun } from "./validate";
import { Toast, getObject, MyError, uploadFile } from "@/global" // resolveTimeout, rejectTimeout
import { disposeReferrer, getLevelList, checkIsActive } from "@/api"
import { Indicator, MessageBox } from "mint-ui"
let formData = {
  cellPhone: "", // 手机号
  agentLevel: "", // 引荐等级
  remittanceImg: "", // 打款记录
  userName: "", // 用户名
  agentId: "", // 推荐记录Id askId
  referrerPhone: "", // 推荐人手机号
  cardNum: "",
  cardType: ''
}
export default {
  data() {
    return {
      cardRes: 0,
      currentLevel: "",
      cardShouldUseNumber: 0,
      isUploading: false,
      cardTypes: [{label: "销售卡", value: "0"}, {label: "奖励卡", value: "1"}, {label: "赠送卡", value: "2"}],
      isDisabled: {
        ...formData
      },
      validate: {
        ...formData
      },
      inputObj: {
        ...formData
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
    // 同意
    submitAction() {
      let validate = this.validateForm()
      if (validate.length == 0) {
        Indicator.open()
        let data = getObject(this.inputObj, this.validateOptions)
        disposeReferrer({askId: data.agentId, acceptState: 1, cardType: data.cardType, remittanceImg: data.remittanceImg, cardNum: data.cardNum}).then(res => {
          Indicator.close()
          return MessageBox.alert('你已同意该引荐').then(action => {
            this.$router.replace({
              name: "poster",
              hash: "#" + data.agentId,
              query: { type: "agent-add" }
              })
          })
        }).catch(err => {
          Indicator.close()
          Toast(err)
        })
      } else {
        Toast(new MyError(validate[0], 3))
      }
    },
    // 上传图片
    uploadpositiveFile(event) {
      if (event.target.files.length) {
        this.isUploading = true;
        Indicator.open();
        uploadFile(event.target.files[0])
        .then(res => {
          this.inputObj.remittanceImg = res
        })
        .catch(err => {
          Toast(err);
        })
        .then(res => {
          this.isUploading = false;
          Indicator.close();
        });
      }
    }
  },
  mounted() {
    let { askId: agentId = "", nickName: userName = "", uid, cellPhone = "", referrerLevel: agentLevel = "", referrerPhone = "" } = { ...this.$route.params, ...this.$route.query };
    Object.assign(this.inputObj, {agentId, userName, cellPhone, agentLevel, referrerPhone})
    Object.assign(this.isDisabled, {agentId, userName, cellPhone, agentLevel, referrerPhone})
    checkIsActive().then(res => {
        this.currentLevel = res.agentLevel;
    });
    getLevelList({ agentId: uid })
      .then(res => {
        let { cardNum = 0, levelList = [] } = res;
        this.cardRes = cardNum;
        let temp = levelList.find(item => agentLevel == item.level)
        if (temp) {
          this.cardShouldUseNumber = temp.currentNum;
          this.inputObj.cardNum = temp.currentNum;
        }
      })
  },
  computed: {
    validateOptions() {
      let arr = ["agentId", "remittanceImg", "cardNum"]
      if (this.currentLevel == 700) {
        arr.unshift("cardType")
      }
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
