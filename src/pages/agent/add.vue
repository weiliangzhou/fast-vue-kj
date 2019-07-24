
<template>
  <div>
    <section
      v-show="!referrerSelectVisible"
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
              :isDisabled="type==2"
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
        <li v-show="type === 0 && currentLevel == 600"><label
            class="required"
            style="font-size: 0.426667rem"
          >是否业务员</label>
          <div class="checkbox-container">
            <input
              type="checkbox"
              id="isOperator"
              @change="checkboxChanged"
              :class="[!!isOperator? 'disabledStyle':'']"
              v-model="isOperator"
            >
            <label for="isOperator"></label>
          </div>
        </li>
        <li
          class="afterIcon"
          v-show="currentLevel==700"
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

        <li
          class="afterIcon"
          v-show="type!=1"
        >
          <label
            class="required"
            for=""
          >分销</label>
          <select
            v-model="inputObj.agentLevel"
            class="select-after"
            :class="[!!isDisabled.agentLevel? 'disabledStyle':'']"
            :disabled="!!isDisabled.agentLevel"
            @change="changeAgent"
          >
            <option
              disabled="disabled"
              value=""
            >请选择</option>
            <option
              v-for="(item, index) in agentOptions"
              :value="item.level"
              :key="index"
            >{{item.levelName}}</option>
          </select>
        </li>
        <li><label
            class="required"
            for=""
          >会员卡数</label><input
            type="tel"
            :class="[!!isDisabled.saleCardNum? 'disabledStyle':'']"
            :disabled="cardNumInputDisabled"
            v-model.trim="inputObj.saleCardNum"
            :placeholder="cardNumPlaceHold"
            @blur="cardNumBlurValidate"
          ></li>
        <p class="tips-text">剩余卡数：{{cardRes}}张</p>
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
      <div
        class="recharge-record"
        v-if="rechargeRecord.length"
      >
        <h5 class="title">充卡记录</h5>
        <ul>
          <li
            v-for="(item, index) in rechargeRecord"
            :key="index"
          >
            <span>{{item.createdAt}}</span>
            <span>{{item.cardNum}}</span>
          </li>
        </ul>
      </div>
      <ul v-show="type!==2">
        <li><label for="">推广人</label><input
            type="tel"
            :class="[!!isDisabled.referrerPhone? 'disabledStyle':'']"
            :disabled="!!isDisabled.referrerPhone || true"
            v-model.trim="inputObj.referrerPhone"
            placeholder="推广人手机号"
          >
          ><button
            @click="selectReferrer"
            style="margin: auto; position: absolute; top:50%;transform:translateY(-50%); border-radius: 0.08rem; right: 10px; box-sizing: border-box; background: #D7B686; color:#fff; padding: 0.16rem 0.24rem;"
          >查找推广人</button>
        </li>
        <div
          class="tips-text referrerInfo"
          style="color: #000;"
          v-if="referrerUser.cellPhone&&false"
        >
          <p><label for="">用户</label>: <span>{{referrerUser.nickName}}</span></p>
          <p><label for="">级别</label>: <span>{{referrerUser.agentLevel | levelName}}</span></p>
          <p></p>
        </div>
      </ul>
      <button @click="submitAction">确定</button>
      <div
        v-if="tipsDialogIsShow"
        class="add-success-tips"
      >
        <div class="tips-container">
          <h4>温馨提醒</h4>
          <p>吃水不忘挖井人 , 别忘了给
            好友(推广人/托管人)<span>{{referrerUser.nickName}} {{inputObj.referrerPhone}}</span> 奖励 <span>{{reward}}</span> 元</p>
          <p></p>
          <button @click="hiddenTips">知道了</button>
        </div>
      </div>
    </section>

    <section
      class="select-agent-container"
      v-show="referrerSelectVisible"
    >
      <div class="search-box">
        <form
          action=""
          @submit.prevent="onSubmit"
        ><input
            type="search"
            autocomplete="off"
            v-model.trim="searchInput"
            placeholder="请输入手机号搜索"
            ref="searchInput"
          /></form><button @click="onCancel">取消</button>
      </div>
      <ul
        v-show="serchList.length"
        v-infinite-scroll="loadBottom"
        infinite-scroll-disabled="scrollDisabled"
        :infinite-scroll-immediate-check="true"
        infinite-scroll-distance="10"
      >
        <label
          v-for="(item) in serchList"
          :key="item.id"
          :for="item.id"
        >
          <li>
            <div class="img-container">
              <img :src="item.avatar || 'https://img.mall.xc2018.com.cn/mall/upload/20190513/140756_99_gxee.png'">
            </div>
            <div class="user-Info">
              <h5>{{item.nickName || "未设置"}}</h5>
              <span>{{item.agentLevel | LevelToName}}</span>
              <p>{{item.cellPhone}}</p>
            </div>
            <div style="flex: 1;"></div>
            <div class="input-container"> <input
                :id="item.id"
                type="radio"
                :value="item.id"
                v-model="agentSelected"
                name="classCity"
              /><span></span></div>
          </li>
        </label>
        <p v-show="selectListInfo.total!==-1">没有更多</p>
      </ul>
      <no-more v-show="serchList.length === 0"></no-more>
      <button @click="selectedAction">确定</button>
    </section>
  </div>
</template>
<script>
import axios from "axios";
import { validataFun } from "./validate";
import { Toast, getObject, resolveTimeout, MyError, uploadFile } from "@/global"; // resolveTimeout, rejectTimeout  base64toImage, toBase64
import { getLevelList, addUser, getRechargeRecord, findMyTeamAgent, findMyVip, checkIsActive } from "@/api";
import { Indicator, MessageBox } from "mint-ui";
export default {
  data() {
    return {
      type: 0,
      currentLevel: "",
      isOperator: false,
      searchInput: "",
      reward: 0,
      referrerSelectVisible: false,
      tipsDialogIsShow: false,
      cardRes: 0,
      agentSelected: "",
      address: [],
      cardTypes: [{label: "销售卡", value: "0"}, {label: "奖励卡", value: "1"}, {label: "赠送卡", value: "2"}],
      referrerUser: {
        cellPhone: "",
        nickName: ""
      },
      rechargeRecord: [],
      agentOptions: [],
      isUploading: false,
      isDisabled: {
        cellPhone: "",
        agentLevel: "",
        saleCardNum: "",
        salePrice: "",
        remittanceImg: "",
        userName: "",
        saleType: "",
        referrerPhone: "",
        cardType: ""
      },
      validate: {
        cellPhone: "",
        agentLevel: "",
        saleCardNum: "",
        remittanceImg: "",
        userName: "",
        saleType: "",
        agentId: "",
        referrerPhone: "",
        cardType: ""
      },
      inputObj: {
        cellPhone: "",
        agentLevel: "",
        saleCardNum: "",
        remittanceImg: "",
        userName: "",
        saleType: "",
        agentId: "",
        referrerPhone: "",
        areaCode: "",
        cardType: ""
      },
      selectListInfo: {
        isLoading: false,
        list: [],
        searchList: [],
        pageNum: 0,
        total: -1
      }
    };
  },
  methods: {
    areaCodeChoose(menuKey, menuItem) {
      let codes = [86, 886, 853, 852, 61, 60, 1, 66]
      this.inputObj.areaCode = codes[menuKey] || codes.shift();
      // this.checkValue('phone')
    },
    checkboxChanged() {
      if (this.isOperator) {
        MessageBox.alert('选择业务员 , 不用发卡 , 卡数由小镇账户自动扣除一张给业务员').then(action => {
            this.inputObj.saleCardNum = "0"
          }).catch(res => {
            this.isOperator = false;
             this.changeAgent();
          })
      } else {
         this.changeAgent();
      }
    },
    loadBottom() {
       let { isLoading = false, total = -1, list = [] } = this.selectListInfo;
      if (!isLoading && total === -1 && list.length) {
        this.fetchList({
          isSearch: this.isSearch,
          agentLevel: this.agentLevel,
          searchKey: this.searchInput,
          options: { startTime: this.startTime, endTime: this.endTime }
        });
      }
    },
    selectReferrer() {
      this.referrerSelectVisible = true;
      this.fetchList({isReset: true})
    },
      onSubmit() {
      Indicator.open()
      Promise.all([this.fetchList({
        isReset: true,
        agentLevel: this.agentLevel,
        isSearch: this.isSearch,
        searchKey: this.searchInput,
        type: this.type,
        options: { startTime: this.startTime, endTime: this.endTime }
      }), resolveTimeout(1)]).then(res => {
        Indicator.close()
      }).catch(err => {
        Toast(err)
        Indicator.close()
      });
    },
    onCancel() {
      if (this.searchInput) {
        this.searchInput = "";
        this.$refs.searchInput.focus()
      } else {
         this.referrerSelectVisible = false;
      }
    },
    selectedAction() {
      let currentItem = this.selectListInfo.list.find(item => item.id === this.agentSelected);
      if (currentItem) {
        // let { uid } = currentItem;
        this.inputObj.referrerPhone = currentItem.cellPhone;
        Object.assign(this.referrerUser, currentItem);
      }
      this.referrerSelectVisible = false;
    },
    fetchList({ isReset = false } = {}) {
      let content = this.selectListInfo
      let {
        isLoading = false,
        list = [],
        pageNum = 0,
        total = -1
      } = content;
      if (isReset) {
        this.inputObj.referrerPhone = "";
        Object.assign(this.referrerUser, {cellPhone: "", nickName: ""});
      }
      if ((!isReset && isLoading) || this.type == 2) {
        return Promise.reject(new MyError("不能重复请求", 1));
      } else if (!isReset && total !== -1) {
        return Promise.reject(new MyError("已经没有数据", 1));
      } else {
        if (isReset) {
          pageNum = 0;
          total = -1;
          list = [];
          Object.assign(content, {
            list: [...list],
            pageNum,
            total: -1
          });
        }
        content.isLoading = true;
        let pageSize = 15;
        return [findMyTeamAgent, findMyVip][this.type]({
          pageSize,
          pageNum: pageNum + 1,
          searchKey: this.searchInput,
          state: 0
        })
          .then((res) => {
            let tempList = [...list, ...res];
            Object.assign(content, {
              list: tempList,
              pageNum: res.length ? pageNum + 1 : pageNum,
              total:
                res.length && res.length >= pageSize ? -1 : tempList.length,
              isLoading: false
            });
          })
          .catch(err => {
            content.isLoading = false;
            throw err;
          });
      }
    },
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
    cardNumBlurValidate() {
      let item = this.agentOptions.find(
      item => item.level == this.inputObj.agentLevel);
      if (this.cardRes == 0) {
        Toast("当前剩余卡数不足，请先补卡")
        return false;
      } else if (this.cardRes < this.inputObj.saleCardNum) {
        Toast("当前剩余卡数不足，请先补卡")
        return false;
      } else if (this.currentLevel!==700&&this.type == 2&&item&&item.currentNum > this.inputObj.saleCardNum) {
        Toast("卡数不能少于"+item.currentNum)
        return false
      }
      return true;
    },
    hiddenTips() {
      if (Number(this.type) == 2) {
        this.$router.go(-1)
      } else {
        this.$router.replace({
          name: "poster",
          hash: "#" + 12,
          query: { type: "agent-add" },
          replace: true
        });
      }
    },
    submitAction() {
      if (this.isUploading) {
        return;
      }
      let validate = this.validateForm();
      if (this.cardNumBlurValidate()) {
        if (validate.length == 0) {
          Indicator.open();
          let data = getObject(this.inputObj, this.validateOptions);
          data.userType = Number(this.isOperator)
          Promise.all([addUser(data)
            .then(res => {
              let titles = ["新增分销", "新增vip", "充卡"];
              if (Number(this.type) == 1 && this.referrerUser.agentLevel) {
                this.reward = 59;
              } else {
                this.reward = this.inputObj.saleCardNum * 20;
              }
              if (!this.inputObj.referrerPhone || this.isOperator) {
                  Toast(titles[this.type] + "成功");
                  this.$router.replace({
                  name: "poster",
                  hash: "#" + 12,
                  query: { type: "agent-add" },
                  replace: true
                });
              } else if (this.inputObj.referrerPhone) {
                this.tipsDialogIsShow = true;
              }
            })
            .catch(err => {
              // Indicator.close();
              if (err.errno == 3509) {
                  MessageBox({
                  title: '提示',
                  message: err.message || "您需要先交保证金才能进行改操作",
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
      }
    },
    changeAgent() {
      let item = this.agentOptions.find(
        item => item.level == this.inputObj.agentLevel
      );
      if (this.isOperator) {
        this.inputObj.saleCardNum = "0"
      } else if (item) {
        this.inputObj.saleCardNum = item.currentNum;
      } else {
        this.inputObj.saleCardNum =""
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
    let titles = ["新增分销", "新增vip", "充卡"];
    let { type, agentId, referrerPhone, nickName } = { ...this.$route.params, ...this.$route.query };
    document.title = titles[type];
    this.areaCodeChoose(0)
    if (type == 1) {
      this.agentOptions = [
        {
          buyPrice: 300,
          createdAt: "2018-12-03 10:12:36",
          description: "VIP账号不能卖卡和进卡但是可以卖课程",
          effectDate: "2018-12-03 10:12:36",
          id: 1,
          level: 100,
          levelName: "VIP",
          outDate: "9999-12-31 23:59:59",
          replenishNum: 10,
          upCond: 10,
          upLevel: 200,
          currentNum: 1
        }
      ];
      this.inputObj.agentLevel = 100;
      this.changeAgent();
    } else if (type == 2) {
      this.inputObj.agentId = agentId;
      this.inputObj.referrerPhone = referrerPhone;
      Object.assign(this.referrerUser, {referrerPhone, nickName})
      getRechargeRecord({ uid: agentId })
        .then(res => {
          this.rechargeRecord = res;
        })
        .catch(err => {
          Toast(err);
        });
    }
    this.type = Number(type);
    this.inputObj.saleType = "" + type;
    getLevelList({ agentId })
      .then(res => {
        let { cardNum, levelList = [], saleUser = {} } = res;
        let { cellPhone = "", nickName: userName = "", agentLevel, areaCode = "86" } = saleUser;
        Object.assign(this.inputObj, { cellPhone, userName, areaCode: areaCode || "86" });
        Object.assign(this.isDisabled, { cellPhone, userName });
        this.cardRes = cardNum;
        this.agentOptions =
          type === 2
            ? levelList.map(item => {
                if (agentLevel === item.level) {
                  item.currentNum = item.replenishNum;
                } else {
                  item.levelName = "升级" + item.levelName;
                }
                return item;
              })
            : levelList;
            if (type == 2 && this.agentOptions.length) {
              this.inputObj.agentLevel = this.agentOptions[0].level
              this.changeAgent()
            }
      })
      .catch(err => {
        Toast(err);
      });
    // this.selectedAddress(["230000", "230100"]);
     checkIsActive().then(res => {
        this.currentLevel = res.agentLevel;
        if (res.agentLevel == 700) {
          this.inputObj.cardType = "0";
        }
      });
  },
  computed: {
    serchList() {
      return this.selectListInfo.list;
    },
    cardNumInputDisabled() {
      if (this.currentLevel == 700) {
        return !!this.isDisabled.saleCardNum||(this.type == 1)
      } else {
        return !!this.isDisabled.saleCardNum||(this.type!==2)
      }
    },
    scrollDisabled() {
      // return this.selectListInfo.total !== -1 || this.selectListInfo.isLoading;
      return true;
    },
    cardNumPlaceHold() {
      let item = this.agentOptions.find(
        item => item.level == this.inputObj.agentLevel);
      if (this.type == 2&&item) {
        return "最低卡数" + item.currentNum
      } else {
        return "请输入卡数"
      }
    },
    validateOptions() {
      let arr = [
        "userName",
        "saleType",
        "cellPhone",
        "agentLevel",
        "saleCardNum",
        "remittanceImg",
        "referrerPhone",
        "areaCode"
      ];
      if (this.type == 0) {
        // arr.splice(3, 1);
      } else if (this.type == 2) {
        arr = ["saleCardNum", "agentId", "remittanceImg"];
      }
      if (this.currentLevel == 700) {
        arr.unshift("cardType")
      }
      return arr;
    },
  },
  watch: {
  },
  beforeRouteEnter(to, from, next) {
    let { type, agentId = 23 } = { ...to.params, ...to.query };
    let errmsg = "参数错误，请重试";
    if ([0, 1, 2].includes(Number(type))) {
      errmsg = "";
      if (type == 2 && !agentId) {
        errmsg = "参数丢失";
      }
    } else {
      errmsg = "参数丢失";
    }
    if (errmsg) {
      Toast(errmsg);
      if (!from.name) {
        next({ name: "home", replace: true });
      }
    } else {
      next();
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
