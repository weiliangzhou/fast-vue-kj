
<template>
<div>
  <section v-show="!referrerSelectVisible" class="mine-container">
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
        <area-code v-model="inputObj.areaCode"></area-code>
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
          :disabled="!!isDisabled.saleCardNum||(type!==2)"
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
    <ul
      v-show="type!==2"
    >
      <li><label for="">供应商</label><input
          type="tel"
          :class="[!!isDisabled.referrerPhone? 'disabledStyle':'']"
          :disabled="!!isDisabled.referrerPhone || true"
          v-model.trim="inputObj.referrerPhone"
          placeholder="供应商手机号"
        >
         ><button @click="selectReferrer" style="margin: auto; position: absolute; top:50%;transform:translateY(-50%); border-radius: 0.08rem; right: 10px; box-sizing: border-box; background: #D7B686; color:#fff; padding: 0.16rem 0.24rem;">查找供应商</button>
        </li>
      <div class="tips-text referrerInfo" style="color: #000;" v-if="referrerUser.cellPhone&&false"><p><label for="">用户</label>: <span>{{referrerUser.nickName}}</span></p><p><label for="">级别</label>: <span>{{referrerUser.agentLevel | levelName}}</span></p> <p></p></div>
    </ul>
    <button @click="submitAction">确定</button>
  </section>

  <section class="select-agent-container" v-show="referrerSelectVisible">
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
import { validataFun } from "./validate";
import { Toast, getObject, resolveTimeout, MyError, uploadFile } from "@/global"; // resolveTimeout, rejectTimeout  base64toImage, toBase64
import { addSalesman, findUpSaleUserList, getLevelList, checkIsActive } from "@/api";
import { levelOptions } from "@/conf/static"
import { Indicator, MessageBox } from "mint-ui";
let formData = {
    cellPhone: "",
    agentLevel: "",
    saleCardNum: "",
    remittanceImg: "",
    userName: "",
    saleType: "",
    agentId: "",
    referrerPhone: "",
    areaCode: ""
};
export default {
  data() {
    return {
      type: 0,
      currentLevel: "",
      isOperator: false,
      searchInput: "",
      referrerSelectVisible: false,
      cardRes: 0,
      agentSelected: "",
      address: [],
      referrerUser: {
        cellPhone: ""
      },
      rechargeRecord: [],
      agentOptions: [],
      isUploading: false,
      isDisabled: {
       ...formData,
        areaCode: "86"
      },
      validate: {
       ...formData
      },
      inputObj: {
        ...formData,
         areaCode: "86"
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
      if (this.selectListInfo.list.length == 0) {
        this.fetchList({isReset: true})
      }
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
        Object.assign(this.referrerUser, {cellPhone: ""});
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
        return findUpSaleUserList({
          pageSize,
          pageNum: pageNum + 1,
          cellPhone: this.searchInput,
          agentLevel: this.inputObj.agentLevel
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
      return Object.values(this.validate).filter(item => item)
    },
    cardNumBlurValidate() {
      if (this.cardRes < this.inputObj.saleCardNum) {
        Toast("当前剩余卡数不足，请先补卡")
        return false;
      }
      return true;
    },
    submitAction() {
      let validate = this.validateForm();
      if (this.cardNumBlurValidate()) {
        if (validate.length == 0) {
          Indicator.open();
          let data = getObject(this.inputObj, this.validateOptions);
          data.userType = Number(this.isOperator)
          Promise.all([addSalesman(data)
            .then(res => {
                  MessageBox({
                  title: '温馨提示',
                  message: "业务员不用发卡 , 卡数由小镇账户自动扣除一张给业务员",
                  confirmButtonText: "知道了"
                }).then(action => {
                  if (action === 'confirm') {
                    this.$router.push({ name: "home" });
                  }
                })
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
      this.inputObj.saleCardNum = 1;
      this.inputObj.referrerPhone = ""
    },
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
    document.title = "新增业务员";
    let type = 0;
      this.agentOptions = [
        ...levelOptions.slice(0, 4)
      ];
      this.inputObj.agentLevel = 100;
      this.changeAgent();
    this.type = Number(type);
    this.inputObj.saleType = "" + type;
      getLevelList({})
      .then(({ cardNum = 0 }) => {
        this.cardRes = cardNum;
      })
     checkIsActive().then(res => {
        this.currentLevel = res.agentLevel;
      });
  },
  computed: {
    serchList() {
      return this.selectListInfo.list;
    },
    scrollDisabled() {
      return this.selectListInfo.total !== -1 || this.selectListInfo.isLoading;
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
      return arr;
    },
  },
  beforeRouteEnter(to, from, next) {
    checkIsActive().then(res => {
        if (res.agentLevel == 600) {
            next()
        } else {
            return Promise.reject(new MyError("无权限操作", 3))
        }
    }).catch(err => {
        Toast(err)
        if (!from.name) {
            next({name: "home"})
        }
    });
  }
};
</script>
<style lang="less" scoped>
@import url("./add.less");
</style>
