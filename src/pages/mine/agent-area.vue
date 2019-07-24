
<template>
  <section class="mine-container">
    <!-- <div style="padding:15px;">
      <x-button @click.native="showPlugin3" type="primary"> {{ 'Call prompt by using plugin' }} </x-button>
    </div> -->
    <ul>
      <li><label for=""><span style="color:red; font-size: 0.4rem" class="">*</span>省</label><button
          :disabled="!!isDisabled.province"
          :class="[!!isDisabled.province? 'disabledStyle':'']"
          @click="showSelectAddress=true"
        >{{provinceLabel}}</button>
      </li>
       <li><label for=""><span style="color:red; font-size: 0.4rem" class="">*</span>市</label><button
          :disabled="!!isDisabled.city"
          :class="[!!isDisabled.city? 'disabledStyle':'']"
          @click="showSelectAddress=true"
        >{{cityLabel}}</button>
      </li>
       <li><label for=""><span style="color:red; font-size: 0.4rem" class="">*</span>区</label><button
          :disabled="!!isDisabled.prefecture"
          :class="[!!isDisabled.prefecture? 'disabledStyle':'']"
          @click="showSelectAddress=true"
        >{{prefectureLabel}}</button>
      </li>
       <x-address
          style="display:none;"
          @on-hide="hidenSelect"
          @on-shadow-change="onShadowChange"
          title="title"
          v-model="address"
          :list="addressData"
          placeholder="请选择地址"
          :show.sync="showSelectAddress"
        ></x-address>
      <p class="tips-text">分销区域是唯一判定分销归属的区域凭证 , 只能设置一 次 , 请真实填写</p>
    </ul>
    <button v-show="!isDisabled.province" @click="submitAction">确定</button>
  </section>
</template>
<script>
import { XAddress, ChinaAddressV4Data } from "vux";
import { validataFun } from "./validate";
import { Toast, getObject } from "@/global" // resolveTimeout, rejectTimeout
import agentAreaMixin from "@/mixins/agent-area"
import { updateAgentArea, getAgentArea } from "@/api"
export default {
  components: {
    XAddress
  },
  data() {
    return {
      address: [],
      addressData: ChinaAddressV4Data,
      showSelectAddress: false, // 选地址的组件是否显示
      addressLabels: [],
      isDisabled: {
        province: "",
        city: "",
        prefecture: "",
      },
      validate: {
        province: "",
        city: "",
        prefecture: "",
      },
      inputObj: {
        city: "", // 市
        prefecture: "", // 县
        province: "", // 省
      }
    };
  },
  mixins: [ agentAreaMixin ],
  methods: {
    validateForm() {
      let arr = this.validateOptions;
      arr.forEach(key => {
        validataFun(this, key);
      });
      return Object.values(this.validate).filter(item => item)
    },
     // 提交表单
    submitAction() {
      let validate = this.validateForm()
      if (validate.length == 0) {
        let data = getObject(this.inputObj, this.validateOptions)
        updateAgentArea(data).then(res => {
          Toast("保存成功")
          Object.assign(this.inputObj, data)
          Object.assign(this.isDisabled, data)
          this.$router.replace({name: "home", replace: true})
        }).catch(err => {
          Toast(err)
        })
      } else {
         Toast(new MyError(validate[0], 3))
      }
    },
     // 选择地址 确定 按钮回调
    hidenSelect(shouldSave) {
      if (shouldSave) {
        let address = this.addressLabels;
        let [province = "", city = "", prefecture = ""] = address;
        ({province = "", city = "", prefecture = ""} = getObject({province, city, prefecture}, ["province", "city", "prefecture"], ["", "--"]))
        city = city || province
        prefecture = prefecture || city
        Object.assign(this.inputObj, { province, city, prefecture });
      }
    },
    onShadowChange(ids, names) {
      this.addressLabels = ids;
    }
  },
  mounted() {
    getAgentArea().then(res => { // 获取代理区域信息
        let data = getObject(res, this.validateOptions)
         Object.assign(this.inputObj, data)
         Object.assign(this.isDisabled, data)
    })
  },
  computed: {
    validateOptions() {
      return [ "province", "city", "prefecture" ];
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
       &>span {
        font-size: 32px;
        color: rgba(101,101,101,1);
        line-height: 34px;
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
</style>