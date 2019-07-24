
<template>
  <div>
    <section
      class="mine-container"
    >
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
        <li>
          <label
            class="required"
            for=""
          >
            <area-code
              :isDisabled="true"
              v-model="inputObj.areaCode"
            ></area-code>
          </label>
          <input
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
        >
          <label
            class="required"
            for=""
          >权益包</label>
          <select
            v-model="inputObj.btId"
            class="select-after"
            :class="['']"
          >
            <option
              disabled="disabled"
              value=""
            >请选择</option>
            <option
              v-for="(item, index) in agentOptions"
              :value="item.btId"
              :key="index"
            >{{item.name}}</option>
          </select>
        </li>
        <li><label
            class="required"
            for=""
          >会员卡数</label><input
            type="tel"
            :class="[!!isDisabled.cardNum? 'disabledStyle':'']"
            :disabled="true"
            v-model.trim="inputObj.cardNum"
            placeholder="将消耗的卡数"
          ></li>
        <p class="tips-text">剩余卡数：{{cardRes}}张  将消耗您{{inputObj.cardNum}}张卡开通权益包</p>
      </ul>
      <div v-if="!isSelf" class="upload">
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
      <div
        class="recharge-record"
        v-if="rechargeRecord.length"
      >
        <h5 class="title">开通记录</h5>
        <ul>
          <li
            v-for="(item, index) in rechargeRecord"
            :key="index"
          >
            <span>{{item.createdAt}}</span>
            <span>{{item.name}}</span>
          </li>
        </ul>
      </div>
      <button @click="submitAction">确定</button>
        <div
        v-if="tipsDialogIsShow"
        class="add-success-tips"
      >
        <div class="tips-container">
          <h4>温馨提醒</h4>
          <p>吃水不忘挖井人 , 别忘了给
            好友(推广人/托管人)<span>{{referrerUser.nickName}} {{referrerUser.referrerPhone}}</span> 奖励 <span>{{reward}}</span> 元</p>
          <p></p>
          <button @click="hiddenTips">知道了</button>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import axios from "axios";
import { validataFun } from "./validate";
import { Toast, getObject, resolveTimeout, MyError, uploadFile } from "@/global"; // resolveTimeout, rejectTimeout  base64toImage, toBase64
import { getLevelList, createVipBenefit, findEnableVipBenefitList, findVipBenefitOrderList, checkIsActive } from "@/api";
import { Indicator, MessageBox } from "mint-ui";
let Form = { cellPhone: "", agentId: "", cardNum: 0, remittanceImg: "", areaCode: "", userName: "", btId: "" }
export default {
  data() {
    return {
      isSelf: false,
      reward: 0,
      tipsDialogIsShow: false,
      referrerUser: {
        nickName: "",
        referrerPhone: ""
      },
      cardRes: 0,
      rechargeRecord: [],
      agentOptions: [],
      isUploading: false,
      isDisabled: {
      ...Object.keys(Form).reduce((pre, key) => ({...pre, [key]: true}), {})
      },
      validate: {
       ...Form
      },
      inputObj: {
       ...Form
      }
    };
  },
  methods: {
    validateForm() {
      let arr = this.validateOptions;
      arr.forEach(key => {
        validataFun(this, key);
      });

      let validate = Object.entries({ ...this.validate }).reduce(
        (prevalue, [key, value]) => {
          if (value) {
            prevalue.push(value);
          }
          return prevalue;
        },
        []
      );
      return validate;
    },
    hiddenTips() {
        this.$router.replace({ name: "poster", hash: "#" + 12, query: { type: "agent-add" } });
    },
    submitAction() {
        if (this.isUploading) {
        return;
        }
        let validate = this.validateForm();
        if (validate.length == 0) {
            Indicator.open();
            let data = getObject(this.inputObj, this.validateOptions);
            Promise.all([createVipBenefit(data)
            .then(res => {
              Toast("开通权益成功", {doration: 3000});
              if (!this.isSelf && this.inputObj.cardNum && this.referrerUser.referrerPhone) {
                this.reward = 59;
                this.tipsDialogIsShow = true;
              } else {
                this.$router.go(-1)
              }
            })
            .catch(err => {
                // Indicator.close();
                if (err.errno == 3509) {
                    MessageBox({
                    title: '提示',
                    message: err.message || "您需要先交保证金才能进行该操作",
                    showCancelButton: true,
                    confirmButtonText: "交保证金"
                }).then(action => {
                    if (action === 'confirm') {
                    this.$router.push({ name: "earnest" });
                    } else if (action === 'cancel') {

                    }
                })
                } else {
                Toast(err);
                }
            }), resolveTimeout(1)])
            .then(res => {
                Indicator.close();
            });
        } else {
            Toast(new MyError(validate[0], 3));
        }
    },
    uploadpositiveFile(event) {
        try {
            if (event.target.files.length) {
                this.isUploading = true;
                Indicator.open();
                uploadFile(event.target.files[0])
                .then(res => {
                    this.inputObj.remittanceImg = res
                    if (res) {
                        resolveTimeout(0.3).then(() => Toast("上传成功"))
                    }
                })
                .catch(err => {
                    resolveTimeout(0.3).then(() => Toast(err))
                })
                .then(res => {
                this.isUploading = false;
                Indicator.close();
                });
            } else {
                throw new Error("取消选择")
            }
        } catch (err) {
            var errmsg = err&&err.stack ? err.stack : err
            let errFormData = new FormData(); // 创建form对象
            errFormData.append("error", errmsg); // 对应后台接收图片名
            axios
            .post(" http://47.98.55.127:5000/pushError", errFormData)
            .catch(res => {})
        }
    }
  },
  mounted() {
    let { agentId } = { ...this.$route.params, ...this.$route.query };
    document.title = "开通权益";

    findVipBenefitOrderList(agentId)
        .then(res => {
          this.inputObj.cardNum = Number(res.length !== 0)
          this.rechargeRecord = res;
        })
        .catch(err => {
          Toast(err);
        });
    getLevelList({ agentId })
      .then(res => {
        let { cardNum } = res;
        // let { cellPhone = "", nickName: userName = "", areaCode = "86" } = saleUser;
        // Object.assign(this.inputObj, { cellPhone, userName, areaCode: areaCode || "86" });
        // Object.assign(this.isDisabled, { cellPhone, userName });
        this.cardRes = cardNum;
        // this.agentOptions = levelList;
      }).catch(err => {
        Toast(err);
      });
      findEnableVipBenefitList(agentId)
      .then(res => {
        this.agentOptions = res;
      }).catch(err => {
        Toast(err);
      });
  },
  computed: {
    validateOptions() {
      return this.isSelf?[
        "agentId",
        "btId",
      ] : [
        "agentId",
        "btId",
        "remittanceImg",
      ]
    },
  },
  beforeRouteEnter(to, from, next) {
    let { agentId = "", referrerPhone = "", userName, areaCode, btId, cellPhone, referrerNickName } = { ...to.params, ...to.query };
    let errmsg = "";
    if (!agentId) {
        errmsg = "参数丢失";
    }
    if (errmsg) {
      Toast(errmsg);
      if (!from.name) {
        next({ name: "home", replace: true });
      }
    } else {
      checkIsActive().then(res => {
        next(vm => {
          let isSelf = res.uid == agentId
          if (isSelf) {
            userName = res.realName || res.nickName
            cellPhone = res.cellPhone
            areaCode = res.areaCode
          }
          Object.assign(vm, { isSelf: isSelf });
          Object.assign(vm.inputObj, {userName, areaCode, btId, agentId, cellPhone});
          Object.assign(vm.referrerUser, {referrerPhone, nickName: referrerNickName});
        })
      });
    }
  }
};
</script>
<style lang="less" scoped>
@import url("./add.less");
.add-success-tips {
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  padding: 0 114px;
  background: rgba(0, 0, 0, 0.45);
  z-index: 1;
  & > div {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    align-items: center;
    width: 100%;
    box-sizing: border-box;
    height: 6.2rem;
    background: #fff;
    justify-content: space-around;
    padding: 10px 22px;
    border-radius: 8px;
    overflow: hidden;
    h4 {
      font-size: 32px;
      line-height: 34px;
      color: RGB(199, 0, 10);
      font-weight: 700;
    }
    p {
      font-size: 30px;
      line-height: 32px;
      font-weight: 400;
      color: RGB(152, 152, 152);
      word-break: break-all;
      span {
        margin: 0 12px;
        color: rgba(240, 31, 35, 1);
      }
    }
    button {
      font-size: 28px;
      color: rgba(255, 255, 255, 1);
      letter-spacing: 0.45px;
      opacity: 1;
      background: #d7b686;
      box-sizing: border-box;
      border-radius: 8px;
      border-width: 0;
      width: 100%;
      height: 70px;
    }
  }
}
</style>
