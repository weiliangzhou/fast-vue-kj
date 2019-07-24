
<template>
    <section class="mine-container">
        <!-- <div style="padding:15px;">
      <x-button @click.native="showPlugin3" type="primary"> {{ 'Call prompt by using plugin' }} </x-button>
    </div> -->
        <ul>
            <li>
                <label class="required" for="">姓名</label><input type="text" :disabled="!!isDisabled.name" :class="[!!isDisabled.name? 'disabledStyle':'']" v-model.trim="inputObj.name" placeholder="请输入身份证上姓名">
            </li>
            <li>
                <label class="required" for=""><area-code v-model="inputObj.areaCode"></area-code></label>
                <input type="tel" :disabled="!!isDisabled.phone" :class="[!!isDisabled.phone? 'disabledStyle':'']" v-model.trim="inputObj.phone" placeholder="请输入手机号"></li>
            <li>
                <label class="required" for="">课程单价</label><input type="tel" :class="['disabledStyle']" :disabled="true" v-model.trim="saleMoney" placeholder="价格"></li>
        </ul>
         <ul class="earnest-card">
            <h5>收款账户</h5>
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
            <li class="afterIcon">
                <label class="required" for="">打款方式</label>
                <select v-model="inputObj.serialType" :disabled="!!isDisabled.serialType" :class="[!!isDisabled.serialType? 'disabledStyle':'']" class="select-after">
                    <option value="2">银行卡</option>
                    <option value="3">支付宝</option>
                </select>
            </li>
            <li>
                <li>
                    <label class="required" for="">流水号</label><input type="tel" :class="[!!isDisabled.serialNum? 'disabledStyle':'']" :disabled="!!isDisabled.serialNum" v-model.trim="inputObj.serialNum" placeholder="请输入打款流水号"></li>
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
</template>
<script>
import { validataFun } from "./validate";
import { Toast, getObject, MyError, uploadFile } from "@/global"; // resolveTimeout, rejectTimeout
import { getOrderBaseInfo, buyOffline } from "@/api";
import { Indicator } from "mint-ui"
export default {
    data() {
        return {
            saleMoney: 0, // 课程价格
            isUploading: false, // 打卡记录是否在上传中
            isDisabled: {
                name: "",
                phone: "",
                serialNum: "",
                serialImg: "",
                productId: "",
                goodsId: "",
                serialType: "",
                orderNo: "",
            },
            validate: {
                name: "",
                phone: "",
                serialNum: "",
                serialImg: "",
                productId: "",
                goodsId: "",
                serialType: "",
                orderNo: "",
            },
            inputObj: {
                name: "", // 给（谁）下单的人名字
                phone: "", // 手机号
                serialNum: "", // 打款流水号
                serialImg: "", // 打款记录（图片地址）
                productId: "", // 课程id
                goodsId: "", //
                serialType: "2", // 打款方式
                orderNo: "", // 订单号
                areaCode: "86"
            }
        };
    },
    methods: {
         // 表单验证
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
                let data = getObject(this.inputObj, this.validateOptions);
                buyOffline(data)
                    .then(res => {
                        Toast(this.inputObj.orderNo ? "修改成功" : "下单成功");
                        this.$router.go(-1)
                    })
                    .catch(err => {
                        Toast(err);
                    });
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
        }
    },
    mounted() {
        let { goodsId, productId, price, title, orderNo } = {
            ...this.$route.params,
            ...this.$route.query
        };
        if (orderNo) { // 晚上打款凭证
            this.inputObj.orderNo = orderNo;
            getOrderBaseInfo({ orderNo }).then(res => {
                let { title = "上传凭证", price = 0 } = res;
                this.saleMoney = price
                document.title = title || "上传凭证"
                let data = getObject(res, ["name",
                    "phone",
                    "serialNum",
                    "serialImg",
                    "productId",
                    "goodsId",
                    "serialType",
                    "areaCode"]);
                Object.assign(this.inputObj, data)
                Object.assign(this.isDisabled, data)
            })
        } else { // 下单
            document.title = title;
            Object.assign(this.inputObj, {
                productId,
                goodsId
            });
            this.saleMoney = price;
        }
    },
    computed: {
         // 根据打款方式 显示不同的打款账户信息
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
        },
         // 需验证字段 有orderNo 就是补充打款记录，否则就是下单
        validateOptions() {
            return this.inputObj.orderNo ? ["orderNo", "serialType", "serialImg", "serialNum"] : [
                "name",
                "phone",
                "serialNum",
                "serialImg",
                "productId",
                "goodsId",
                "serialType",
                "areaCode"
            ];
        }
    },
    beforeRouteEnter(to, from, next) {
        let { goodsId, productId, price, title, orderNo } = {
            ...to.params,
            ...to.query
        };
        if (orderNo) {
            next();
        } else if (goodsId && productId && price && title) {
            next();
        } else {
            Toast("参数缺失")
            if (!from.name) {
                next({ name: "home" })
            }
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
        padding: 5px 32px;
        height: 36px;
        opacity: 1;
        font-size: 34px;
        font-family: PingFangSC;
        color: rgba(54,54,54,1);
        line-height: 36px;
        letter-spacing: 0.55px;
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
.area_code_one {
      width: 185px;
      height: 48px;
      font-size: 34px;
      color: rgba(54, 54, 54, 1);
      line-height: 48px;
      flex: 1;
      span {
        float: left;
      }
      i {
        float: left;
        font-size: 16px;
        line-height: 44px;
        transform: scale(0.7);
      }
    }
</style>
