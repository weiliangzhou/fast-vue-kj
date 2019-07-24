<template>
  <section class="mine-container">
    <!-- <div style="padding:15px;">
      <x-button @click.native="showPlugin3" type="primary"> {{ 'Call prompt by using plugin' }} </x-button>
    </div> -->
    <div class="input-group">
      <ul>
        <li><label class="required" for="">姓名</label><input type="text" :disabled="!!isDisabled.realName" :class="[!!isDisabled.realName? 'disabledStyle':'']" v-model.trim="inputObj.realName" placeholder="请输入身份证上姓名">
        </li>
        <li><label class="required" for="">手机号</label><input type="text" :disabled="!!isDisabled.phone" :class="[!!isDisabled.phone? 'disabledStyle':'']" v-model.trim="inputObj.phone" placeholder="请输入手机号"></li>
        <li class="afterIcon">
          <label class="required" for="">证件类型</label>
          <select v-model.number="inputObj.idCardType" class="select-after" :class="[!!isDisabled.idCardType? 'disabledStyle':'']" :disabled="!!isDisabled.idCardType">
            <option value="1">身份证</option>
            <option value="2">港澳台身份证</option>
            <option value="3">护照</option>
          </select>
        </li>
        <li><label class="required" for="">证件号</label><input type="text" @blur="scrollBottom" :disabled="!!isDisabled.idCardNum" :class="[!!isDisabled.idCardNum? 'disabledStyle':'']" v-model.trim="inputObj.idCardNum" placeholder="请输入对应证件号" @click="fc"></li>
      </ul>
      <ul>
        <li class="afterIcon"><label for=""><span style="color:red; font-size: 0.4rem" class="">*</span>省</label><button :disabled="!!isDisabled.province" :class="[!!isDisabled.province? 'disabledStyle':'']" @click="showSelectAddress=true">{{provinceLabel}}</button>
        </li>
        <li class="afterIcon"><label for=""><span style="color:red; font-size: 0.4rem" class="">*</span>市</label><button :disabled="!!isDisabled.city" :class="[!!isDisabled.city? 'disabledStyle':'']" @click="showSelectAddress=true">{{cityLabel}}</button>
        </li>
        <li class="afterIcon"><label for=""><span style="color:red; font-size: 0.4rem" class="">*</span>区</label><button :disabled="!!isDisabled.prefecture" :class="[!!isDisabled.prefecture? 'disabledStyle':'']" @click="showSelectAddress=true">{{prefectureLabel}}</button>
        </li>
        <x-address style="display:none;" @on-hide="hidenSelect" @on-shadow-change="onShadowChange" title="title" v-model="address" :list="addressData" placeholder="请选择地址" :show.sync="showSelectAddress"></x-address>
      </ul>
      <ul>
        <li>
          <textarea @blur="scrollBottom" style="" :disabled="!!isDisabled.detailAddress" v-model="inputObj.detailAddress" placeholder="收货地址"></textarea>
        </li>
        <p class="tips-text">请完善基础资料 , 激活分销资格</p>
      </ul>
    </div>
    <button v-show="!isDisabled.detailAddress" @click="submitAction">下一步</button>
  </section>
</template>
<script>
import { validataFun } from "./validate";
import { XAddress, ChinaAddressV4Data } from "vux";
import { checkIsActive, importUserInfo } from '@/api'
import { Indicator } from "mint-ui"
import { Toast, getObject, MyError } from "@/global" // resolveTimeout, rejectTimeout
import { selectAddressFixedMixin } from "@/mixins"
import agentAreaMixin from "@/mixins/agent-area"
export default {
  components: {
    XAddress
  },
  mixins: [selectAddressFixedMixin, agentAreaMixin],
  data() {
    return {
        address: [],
        addressData: ChinaAddressV4Data,
        showSelectAddress: false,
        addressLabels: [],
        addressText: "",
      isDisabled: {
        id: "",
        realName: "",
        phone: "",
        idCardNum: "",
        province: "",
        city: "",
        prefecture: "",
        detailAddress: "",
        idCardType: ""
      },
      validate: {
        id: "",
        realName: "",
        phone: "",
        idCardNum: "",
        province: "",
        city: "",
        prefecture: "",
        detailAddress: "",
        idCardType: ""
      },
      inputObj: {
        id: "",
        realName: "", // 姓名
        phone: "", // 手机号
        idCardNum: "", // 身份证
        province: "", // 省
        city: "", // 市（县）
        prefecture: "", // 区
        detailAddress: "", // 详细地址
         idCardType: "1" // 证件类型
      }
    };
  },
  methods: {
    fc(e) {
      this.scollFlag = false
      this.$nextTick(() => {
        e.target.blur()
        e.target.focus()
        this.scollFlag = true
      })
    },
     // 验证表单数据
    validateForm() {
      let arr = this.validateOptions;
      arr.forEach(key => {
        validataFun(this, key);
      });
     return Object.values(this.validate).filter(item => item)
    },
     // 滚动一下， 解决fixed 被键盘顶起不会自己下来问题
    scrollBottom() {
      if (this.scollFlag) {
        document.body.scrollTop = document.body.scrollHeight
      }
      // let scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
    },
     // 选择地址 确定 回调
     hidenSelect(shouldSave) {
      if (shouldSave) { // 按确定的时候更新到实际保存的变量里
        let address = this.addressLabels;
        let [province = "", city = "", prefecture = ""] = address;
        ({ province = "", city = "", prefecture = "" } = getObject({ province, city, prefecture }, ["province", "city", "prefecture"], ["", "--"]))
        city = city || province
        prefecture = prefecture || city
        Object.assign(this.inputObj, { province, city, prefecture });
        if (address) {
          this.addressText = address.join(" ");
          this.inputObj.address = address.join(" ");
        }
      }
    },
    // 地区改变的时候自动更新地址信息 
    onShadowChange(ids, names) {
      this.addressLabels = ids;
    },
     // 确定 -- 提交按钮回调
    submitAction() {
      let validate = this.validateForm()
      if (validate.length == 0) { // 验证通过
        Indicator.open()
        let data = getObject(this.inputObj, this.validateOptions)
        data.idCardType = Number(data.idCardType); // 后端非要前端转数字类型
        importUserInfo(data).then(res => {
          if (this.inputObj.id) {
            Toast("修改成功");
          } else {
            Toast("保存成功");
          }
         Object.assign(this.inputObj, data)
         // Object.assign(this.isDisabled, data)
          // 提交成功之后重新调用下 是否已激活接口 刷新在内存中对该接口的缓存
         return checkIsActive(true).then(res => {
            this.$router.replace({name: "agent-area", replace: true})
         })
        }).catch(err => {
          Toast(err)
        }).then(res => {
          Indicator.close()
        })
      } else { // 验证不通过
        Toast(new MyError(validate[0], 3))
      }
    },
  },
  watch: {
    showSelectAddress() { // 改变选地址组件的显示的时候重新触发下渲染
      this.triggerSomeEleRerender()
    }
  },
  computed: {
    // 要验证并提交的表单字段说明
    validateOptions() {
      let arr = [
        "realName",
        "phone",
        "idCardNum",
        "province",
        "prefecture",
        "detailAddress",
        "city",
        "idCardType"
      ];
      return arr;
    },
  },
  // 页面路由拦截 只有没有激活才能进来完善信息
  beforeRouteEnter(to, from, next) {
    Indicator.open()
    checkIsActive().then(res => {
      if (!res.isActive) {
        next(vm => {
          let { cellPhone: phone, nickName: realName } = res;
          Object.assign(vm.inputObj, { phone, realName })
          Object.assign(vm.isDisabled, { phone })
        })
      } else {
        throw new Error("已完善过信息")
      }
    }).catch(err => {
      next({ name: "home", replace: true })
    }).then(res => {
      Indicator.close()
    })
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
  overflow-y: scroll;
  /* 增加该属性，可以增加弹性 */
  -webkit-overflow-scrolling: touch;

  .input-group {
    display: flex;
    flex-direction: column;
    flex: 1;
    ul {
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
        color: rgba(51, 51, 51, 1);
        line-height: 48px;
      }
      ul {
        li {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
          & > span {
            font-size: 32px;
            color: rgba(101, 101, 101, 1);
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
    // position: absolute;
    // bottom: 0;
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
    color: red;
    font-size: 0.42rem;
  }
}
</style>
