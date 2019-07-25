
<template>
    <div>
    <section class="mine-container" v-show="auditState == 2">
        <ul>
             <li>
                <label for="">保证金</label><button>{{shouldMoney/100}}元</button>
            </li>
            <li class="afterIcon">
                <label class="required" for="">打款方式</label>
                <select v-model="inputObj.serialType" :disabled="!!isDisabled.serialType" :class="[!!isDisabled.serialType? 'disabledStyle':'']" class="select-after">
                    <option value="2" selected>银行卡</option>
                    <option value="3">支付宝</option>
                </select>
            </li>
        </ul>
          <ul class="earnest-card">
            <!-- <h5>保证金收款账户</h5> -->
             <div class="card-item">
                <span>户名&emsp;: {{earnestInfo.userName}}</span>
            </div>
             <div class="card-item">
                <span>帐号&emsp;：{{earnestInfo.cardNum}}</span>
            </div>
            <div class="card-item"  v-if="inputObj.serialType == 2">
                <span>开户行：{{earnestInfo.bankTitle}}</span>
            </div>
        </ul>
        <ul>
            <li>
                <label class="required" for="">流水号</label>
                <input type="tel" :class="[!!isDisabled.serialNum? 'disabledStyle':'']" :disabled="!!isDisabled.serialNum" v-model.trim="inputObj.serialNum" placeholder="请输入打款流水号">
            </li>
            <p class="tips-text">请输入支付宝/银行打款流水号</p>
        </ul>
        <div class="upload">
            <h5 class="title required">打款记录</h5>
            <ul class="picture">
                <li class="positive">
                    <img :src="inputObj.serialImg">
                    <input :disabled="isUploading" type="file" @change="uploadpositiveFile($event)" accept="image/*" />
                </li>
            </ul>
        </div>
        <button @click="submitAction">确定</button>
    </section>
    <section v-show="auditState == 1" class="dialogs">
            <div class="referrer-container">
              <img
                :src="'http://chuang-saas.oss-cn-hangzhou.aliyuncs.com/upload/image/20190116/f358b0b8b7854db890fe8fd7cbb56664.png'"
                alt=""
              >
              <h6 class="ellipsis_3">保证金审核失败, 驳回原因：{{remark || "未填写"}}</h6>
              <div style="flex:1"></div>
              <button @click="reSubmit">重新提交</button>
              <div class="button-group">
                  <button class="back-button" @click="backToHome">返回首页</button>
              </div>
            </div>
    </section>
     <section v-show="auditState == 3" class="dialogs">
            <div class="referrer-container">
              <img
                :src="'http://chuang-saas.oss-cn-hangzhou.aliyuncs.com/upload/image/20190116/f67927cdfd7540a0ba6d98b4bc1e17ae.png'"
                alt=""
              >
              <h6>保证金提交成功</h6>
              <h6>等待1个工作日审核</h6>
              <div style="flex:1"></div>
              <button @click="backToHome">返回首页</button>
              <!-- <div class="button-group">
                  <button class="close-button"></button>
              </div> -->
            </div>
    </section>
    </div>

</template>
<script>
import { validataFun } from "./validate";
import { Toast, getObject, MyError, uploadFile } from "@/global"; // resolveTimeout, rejectTimeout
import { getCurrentUserDeposit, paymentDeposit } from "@/api";
import { Indicator } from "mint-ui"
export default {
    data() {
        return {
            newLevel: "",
            sourceLevel: 100,
            auditState: 2, // 保证金的审核状态 包括需要不要交
            shouldMoney: 0, // 应缴额度(分)
            isUploading: false, // 是否正在上传
            remark: "", // 不通过理由
            isDisabled: {
                serialNum: "",
                serialImg: "",
                serialType: "",
            },
            validate: {
                serialNum: "",
                serialImg: "",
                serialType: "",
            },
            inputObj: {
                serialNum: "", //  流水号
                serialImg: "", // 打卡记录（图片地址）
                serialType: "2", // 打款方式
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
         //  提交表单数据
        submitAction() {
            let validate = this.validateForm();
            if (validate.length == 0) { // 表单验证通过
                let data = getObject(this.inputObj, this.validateOptions);
                paymentDeposit(data)
                .then(res => {
                    Toast("提交成功");
                    this.auditState = 3;
                        // this.$router.go(-1)
                    })
                    .catch(err => {
                        Toast(err);
                    });
            } else {
                Toast(new MyError(validate[0], 3))
            }
        },
         // 上传
        uploadpositiveFile(event) {
          if (event.target.files.length) {
            this.isUploading = true;
            Indicator.open();
            uploadFile(event.target.files[0])
            .then(res => {
                this.inputObj.serialImg = res
            })
            .catch(err => {
                Toast(err);
            })
            .then(res => {
            this.isUploading = false;
                Indicator.close();
            });
          }
        },
         // 返回首页
        backToHome() {
            this.$router.replace({name: "home"})
        },
         // 设置当前页面的数据
        setPageData(res) {
            let { paymentImg: serialImg = "", paymentNo: serialNum = "", paymentType: serialType = "" } = res;
            Object.assign(this, res)
            Object.assign(this.inputObj, {serialImg, serialNum, serialType: serialType || 2})
            Object.assign(this.isDisabled, {serialImg, serialNum, serialType})
        },
         // 重新提交， 重置一些状态
        reSubmit() {
            this.auditState = 2;
            Object.assign(this.isDisabled, {
                serialNum: "",
                serialImg: "",
                serialType: "",
            })
        }
    },
    computed: {
        phoneLabel() {
            return this.phone;
        },
        validateOptions() {
            return ["serialType", "serialImg", "serialNum"]
        },
         // 根据打款类型显示不同的打款账户信息
        earnestInfo() {
            return {
                "2": {
                    bankTitle: "中国建设银行义乌市分行",
                    cardNum: "33001676235053053986",
                    userName: "浙江微谷企业管理咨询有限公司"
                },
                "3": {
                    bankTitle: "支付宝",
                    cardNum: "wegoo888@163.com",
                    userName: "浙江微谷企业管理咨询有限公司"
                }
            }["" + this.inputObj.serialType] || {}
        }

    },
     // 路由拦截 ，查询下是否有需要操作保证金相关的信息
    beforeRouteEnter(to, from, next) {
        Indicator.open()
        getCurrentUserDeposit().then(res => {
            if (res) {
                if (res.auditState!== 0) {
                    next(vm => {
                        vm.setPageData(res)
                    })
                } else {
                    throw new MyError("无需交保证金", 3)
                }
            } else {
                throw new MyError("获取保证金信息失败", 3)
            }
        }).catch(err => {
            Toast(err)
            if (!from.name) {
                next({name: "home", replace: true})
            }
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
      border-bottom: 1px solid rgba(247, 247, 247, 1);
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
  .required {
        &:before {
            content: "*";
            color:red;
            font-size: 0.42rem
        }
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

.earnest-card {
    h5 {
        padding: 28px 32px;
        height: 48px;
        opacity: 1;
        font-size: 34px;
        font-family: PingFangSC;
        color: rgba(54,54,54,1);
        line-height: 48px;
        letter-spacing: 0.55px;
        background: #fff;
        border-bottom: 1px solid rgba(247, 247, 247, 1);
    }
    .card-item {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      padding: 0 32px;
      position: relative;
      border-bottom: 1px solid rgba(247, 247, 247, 1);
      span {
        opacity: 1;
        font-weight: Regular;
        line-height: 48px;
        margin-right: 30px;
        padding: 4px 0;
        font-size: 28px;
        font-family: PingFangSC;
        color: rgba(152,152,152,1);
        line-height: 40px;
      }
    }
}

.dialogs{
    position: absolute;
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
    .referrer-container {
        display: flex;
        flex-direction: column;
        background: #fff;
        border-radius: 12px;
        align-items: center;
        width: 100%;
        box-sizing: border-box;
        padding: 30px 34px 66px;
        position: relative;
        h5 {
          font-size: 32px;
          line-height: 34px;
          color: RGB(199, 0, 10);
          font-weight: 700;
        }
        img {
          width: 156px;
          height: 156px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.3);
          margin: 52px 0 36px;
        }
        h6 {
          font-size: 34px;
          line-height: 36px;
          margin-bottom: 36px;
          color: rgba(101,101,101,1);
          font-weight: 400;
        }
        // & > div {
        //     display: flex;
        //     flex-direction: row;
        //     span {
        //     font-size: 30px;
        //     line-height: 32px;
        //     font-weight: 400;
        //     color: RGB(152, 152, 152);
        //     margin: 24px 0 54px;
        //     }
        // }
        & > button {
          font-size: 28px;
          color: rgba(255, 255, 255, 1);
          letter-spacing: 0.45px;
          opacity: 1;
          background: #D7B686;
          box-sizing: border-box;
          border-radius: 8px;
          border-width: 0;
          width: 100%;
          height: 70px;
          margin-top: 44px;
        }

        .button-group{
            position: absolute;
            bottom: -100px;
            background: rgba(0, 0, 0, 0);
            .back-button {
                position: relative;
                height: 45px;
                opacity: 1;
                font-size: 32px;
                font-family: PingFangSC;
                color: rgba(255,255,255,1);
                line-height: 45px;
                letter-spacing: 0.94px;
                background: rgba(0, 0, 0, 0);
                border: none;
                padding: 10px 30px;
                box-sizing: content-box;
                &:after {
                    display: inline-block;
                    content: " ";
                    height: 22px;
                    width: 22px;
                    border-width: 4px 4px 0 0;
                    border-color: rgba(255,255,255,1);
                    border-style: solid;
                    transform: matrix(-0.71,-0.71,0.71,-0.71,0,0); // rotate(-135deg);
                    position: absolute;
                    top: 50%;
                    left: -25px;
                    margin-top: -12px;
                }
            }
            .close-button {
               width: 56px;
               height: 56px;
                box-sizing: content-box;
                position: relative;
                background: rgba(0, 0, 0, 0);
                border: 3px solid #fff;
                overflow: hidden;
                border-radius: 50%;
                padding: 6px;
                &:after {
                    display: inline-block;
                    position: absolute;
                    content: " ";
                    height: 8px;
                    width: 70%;
                    background: #fff;
                    border-radius: 12px;
                    top: 30px;
                    // right: -50%;
                    right: 0;
                    margin: 0 15%;
                    transform: rotate(45deg);
                }

                 &:before {
                    display: inline-block;
                    position: absolute;
                    content: " ";
                    height: 8px;
                     width: 70%;
                    background: #fff;
                    border-radius: 12px;
                    top: 30px;
                    // right: -50%;
                    right: 0;
                    margin: 0 15%;
                    transform: rotate(-45deg);
                }
            }
        }
      }
}
</style>
