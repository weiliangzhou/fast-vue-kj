<template>
  <section id='container'>
    <section class="top-container">
      <div class="topBox">
        <p>日期</p>
        <button :class="{focus: currentChecked === 'all'}" @click="changeType('all')"><span>全部</span></button>
        <button :class="{focus: currentChecked === 'yesterday'}" @click="changeType('yesterday')"><span>昨日</span></button>
        <button :class="{focus: currentChecked === 'month'}"><span class="monthLabel" @click="selectCurrentMonth">{{currentLabel}}</span><i @click="selectMonth" class="iconfont font22 icon-jiantou-copy"></i></button>
        <button class="search-button" @click="toSearchPage"><i class="iconfont icon-sousuocopyx1"></i><span>搜索</span></button>
        <mt-popup v-model="popupVisible" position="bottom" class="mint-popup-4">
          <div class="picker-toolbar">
            <span class="mint-datetime-action mint-datetime-cancel" @click="popupVisible=false">取消</span>
            <span class="mint-datetime-action mint-datetime-confirm" @click="searchFetch">确定</span>
          </div>
          <mt-picker ref="address" :slots="dateSlots" @change="onDateChange" :visible-item-count="5"></mt-picker>
        </mt-popup>
      </div>
      <div class="middleBox">
        <p>筛选</p>
        <select class="select-option" v-model="searchInput.productType">
          <option v-for="(option, index) in typeOptions" :value="option.value" :key="index">{{ option.label }}</option>
        </select>
        <select class="select-option" v-model="searchInput.orderBy">
          <option v-for="(option, index) in keyOptions" :value="option.value" :key="index">{{ option.label }}</option>
        </select>
        <button @click="fetchList(true)"><span>确定</span></button>
      </div>
      <ul>
        <li><h5>学习人数</h5><span>{{statis.studyPeopleNum}}人</span></li>
        <li><h5>学习时长</h5><span>{{statis.studyTime | TimeFormat}}</span></li>
        <li><h5>销量</h5><span>{{statis.orderNum}}个</span></li>
        <li><h5>交易金额</h5><span>{{statis.amount | Yuan}}</span></li>
      </ul>
    </section>
    <ul v-show="currentList.length" v-infinite-scroll="loadMore" infinite-scroll-disabled="isLoading" :infinite-scroll-immediate-check="true" infinite-scroll-distance="10">
      <li v-for="(item,index) in currentList" :key="item.id">
        <div class="title-container"><span :class="{first:index==0,second:index==1,third:index==2}">{{index + 1}}</span>
          <h5 class="ellipsis_1">{{item.goodsName}}</h5>
        </div>
        <div class="statis-container">
          <p :class="{focus: currentType === '1'}"><span>学习人数： {{item.studyPeopleNum}}人</span></p>
          <p :class="{focus: currentType === '2'}"><span>学习时长： {{item.studyTime | TimeFormat}}</span></p>
          <p :class="{focus: currentType === '3'}"><span>销量： {{item.orderNum}}个</span></p>
          <p :class="{focus: currentType === '4'}"><span>交易金额： {{item.amount | Yuan}}</span></p>
        </div>
      </li>
    </ul>
    <no-more v-show="currentList.length === 0"></no-more>
    <footer-bar></footer-bar>
  </section>
</template>
<script>
import footerBar from "./tabs";
import { Picker, Popup } from "mint-ui";
import { learnReport, getStudyReportInfo } from "@/api";
import { Toast } from "@/global"; // resolveTimeout
export default {
  components: {
    footerBar,
    [Picker.name]: Picker,
    [Popup.name]: Popup
  },
  data() {
    return {
      typeOptions: [
        { label: "全部商品", value: "" },
        { label: "实物", value: 1 },
        // { label: "线上课程", value: 2 },
        { label: "线下课程", value: 3 },
        { label: "权益包", value: 4 },
        { label: "会员", value: 5 },
        { label: "音频", value: 6 },
        { label: "视频", value: 7 },
        { label: "图文", value: 8 },
        { label: "素材", value: 9 },
        { label: "电子书", value: 10 },
        { label: "听书", value: 11 },
        { label: "直播", value: 12 }
      ],
      keyOptions: [
        { label: "学习人数", value: "1" },
        { label: "学习时长", value: "2" },
        { label: "销量", value: "3" },
        { label: "交易金额", value: "4" }
      ],
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      popupVisible: false,
      tempYear: new Date().getFullYear(),
      tempMonth: new Date().getMonth() + 1,
      dateSlots: [
        {
          flex: 1,
          values: [2018, 2019, 2020],
          className: "slot1",
          textAlign: "center"
        },
        {
          divider: true,
          content: "-",
          className: "slot2"
        },
        {
          flex: 1,
          values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
          className: "slot3",
          textAlign: "center"
        }
      ],
      searchInput: {
        date: "",
        productType: "",
        orderBy: "1"
      },
      statis: {
        amount: 0,
        orderNum: 0,
        studyPeopleNum: 0,
        studyTime: 0,
      },
      dataList: {
        isLoading: false,
        list: [],
        pageNum: 0,
        total: 8,
        currentType: ""
      }
    };
  },
  computed: {
    currentLabel() {
      let { date } = this.searchInput;

      return ["all", "yesterday", ""].includes(date)
        ? this.year + "-" + this.month
        : date;
    },
    currentList() {
      let { list = [] } = this["dataList"];
      return list;
    },
    isLoading() {
      let { isLoading, total } = this["dataList"];
      return isLoading || total !== -1;
    },
    currentChecked() {
      let { date } = this.searchInput;
      return ["all", "yesterday"].includes(date) ? date : "month";
    },
    currentType() {
      return this.dataList.currentType
        ? this.dataList.currentType
        : this.searchInput.orderBy;
    }
  },
  methods: {
    changeType(type = "all") {
      this.searchInput.date = type;
    },
    selectMonth() {
      this.popupVisible = true;
      this.changeType(this.year + "-" + this.month);
    },
    selectCurrentMonth() {
      this.changeType(this.year + "-" + this.month);
    },
    onDateChange(picker, values) {
      this.tempYear = values[0];
      this.tempMonth = values[1];
    },
    searchFetch() {
      this.popupVisible = false;
      this.year = this.tempYear;
      this.month = this.tempMonth;
      this.changeType(this.year + "-" + this.month);
    },
    toSearchPage() {
      sessionStorage.reportDate = this.searchInput.date;
      this.$router.push({ name: "search-report" });
    },
    loadMore() {
      console.log("loadMore");
      let { isLoading = false, total = -1, list = [] } = this.dataList;
      if (!isLoading && total === -1 && list.length) {
        this.fetchList();
      } else {
        // this.$refs.loadmore.onBottomLoaded()
      }
    },
    // 拉起列表数据
    fetchList(isReset = false) {
      let content = this.dataList;
      let { isLoading = false, list = [], pageNum = 0, total = -1 } = content;
      if (!isReset && isLoading) {
        return Promise.reject(new MyError("不能重复请求", 1));
      } else if (!isReset && total !== -1) {
        return Promise.reject(new MyError("已经没有数据", 1));
      } else {
        if (isReset) {
          list = [];
          pageNum = 0;
          Object.assign(content, { list: [...list], pageNum, total: -1 });

          getStudyReportInfo({ ...this.searchInput }).then(res => {
            Object.assign(this.statis, res)
          })
        }
        content.isLoading = true;
        let pageSize = 15;
        return learnReport({
          pageSize,
          pageNum: pageNum + 1,
          ...this.searchInput
        })
          .then(res => {
            let tempList = [...list, ...res];
            Object.assign(content, {
              list: tempList,
              pageNum: res.length ? pageNum + 1 : pageNum,
              total: res.length >= pageSize ? -1 : tempList.length,
              isLoading: false,
              currentType: this.searchInput.orderBy
            });
            return res;
          })
          .catch(err => {
            Toast(err);
            content.isLoading = false;
          });
      }
    }
  },
  mounted() {
    let defaultKey = "all";
    let date = sessionStorage.reportDate || defaultKey;
    sessionStorage.removeItem("reportDate");
    if (["all", "yesterday"].includes(date)) {
      this.changeType(date);
    } else {
      let [year, month] = date.split("-").filter(item => item);
      if (year && month) {
        Object.assign(this, { year, month });
        this.changeType(this.year + "-" + this.month);
      } else {
        this.changeType(defaultKey);
      }
    }
    this.fetchList(true);
  }
};
</script>
<style lang="less" scoped>
@import url("./learn-report.less");
section[id="container"] {
  width: 100vw;
  height: 100vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  flex: 1;
  background: #f7f7f7;
}
.topBox {
  display: flex;
  padding: 30px 24px 16px;
  align-items: center;
  background: #f7f7f7;
  justify-content: space-around;
  & > p {
    height: 45px;
    font-size: 32px;
    color: rgba(102, 102, 102, 1);
    line-height: 45px;
  }
  button {
    font-size: 26px;
    color: rgba(104, 104, 104, 1);
    padding: 3px 14px;
    height: 42px;
    border-radius: 23px;
    border: 1px solid rgba(152, 152, 152, 1); /* no */
    background: #fff;
    display: flex;
    align-items: center;
    span {
      height: 37px;
      font-size: 26px;
      font-weight: 400;
      line-height: 37px;
    }
  }
  button[class="focus"] {
    color: #d7b686;
    border: 1px solid #d7b686; /* no */
  }
}
.mint-popup-4 {
  width: 100%;
  .picker-slot-wrapper,
  .picker-item {
    backface-visibility: hidden;
  }
}
.font22 {
  padding: 5px 24px;
  font-size: 22px;
}
.monthLabel {
  padding: 0 18px;
  border-right: 1px solid #979797; /* no */
}
.select-option {
  width: 232px;
  height: 60px;
  opacity: 1;
  background: rgba(255, 255, 255, 1);
  border: 1px solid rgba(239, 239, 239, 1);
  border-radius: 8px;
  box-shadow: 0px 2px 0px 0px rgba(225, 225, 225, 0.5);
  color: rgba(54, 54, 54, 1);
  box-sizing: border-box;

  font-size: 26px;
  color: rgba(104, 104, 104, 1);
  line-height: 37px;
}
.middleBox {
  display: flex;
  align-items: center;
  padding: 16px 24px 20px;
  background: #f7f7f7;
  justify-content: space-around;
   & > p {
    height: 45px;
    font-size: 32px;
    color: rgba(102, 102, 102, 1);
    line-height: 45px;
  }
  button {
    width: 132px;
    height: 60px;
    background: linear-gradient(
      133deg,
      rgba(235, 209, 163, 1) 0%,
      rgba(231, 179, 114, 1) 100%
    );
    border-radius: 6px;
    outline: none;
    border: none;
    span {
      width: 53px;
      height: 37px;
      font-size: 26px;
      font-family: PingFangSC-Medium;
      font-weight: 500;
      color: rgba(255, 255, 255, 1);
      line-height: 37px;
    }
  }
}

.search-button {
  i {
    margin: 5px;
    font-size: 26px;
  }
}

.top-container {
  ul {
    padding: 20px 24px;
    background: #fff;
    border-radius:6px;
    margin: 20px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    li {
      max-width: 25%;
      display: flex;
      flex-direction: column;
      align-items: center;
      h5 {
        height:42px;
        font-size:30px;
        color:rgba(54,54,54,1);
        line-height:42px;
        letter-spacing:1px;
        margin-bottom: 20px;
      }
      span {
        height:33px;
        font-size:24px;
        color:rgba(54,54,54,1);
        line-height:33px;
        letter-spacing:1px;
      }
    }
  }
}
</style>
