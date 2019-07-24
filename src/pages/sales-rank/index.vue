<!-- 排行榜 -->
<template>
  <section id="rank-container">
    <select
      class="select-option"
      v-model="rankTab"
      @change="typeChanged"
    >
      <option
        v-for="(option, index) in rankTabs"
        v-bind:value="option.type"
        :key="index"
      >
        {{ option.label }}
      </option>
    </select>
      <section class="swiperContent">
            <button @click="popupVisible=true">
                <span>统计月份: {{currentDate}}</span><i style="color:rgba(204,204,204,1)" class="iconfont font22 icon-ChevronCopyx"></i>
            </button>
      </section>
    <ul class="header-container" v-if="rankTypes.length">
      <li
        class="test-tab"
        v-for="item in rankTypes"
        :key="item.level"
      >
        <input
          type="radio"
          :id="item.level"
          name="test-radio"
          :value="item.level"
          v-model="rankType"
        >
        <label :for="item.level">{{item.levelName}}</label>
      </li>
    </ul>

     <div class="list-container">
      <ul
      v-show="rankList.list.length"
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="isLoading"
        :infinite-scroll-immediate-check="true"
        infinite-scroll-distance="10"
      >
       <li
        v-if="rankType==currentLevel&&selfRank.cellPhone"
        class="hiddenAfter"
       style="flex: none;margin:0 0 0.26667rem 0; padding-bottom: 0.32rem;border-radius: 0.106667rem"
        >
        <label for="" class="ellipsis_1">{{selfRank.rankNum==-1?"未上榜":selfRank.rankNum}}</label>
          <div
            class="logo-container"
            :style="{background:`url(${selfRank.avatar||'https://img.mall.xc2018.com.cn/mall/upload/20190513/140756_99_gxee.png'}) no-repeat center / cover`}"
          >
          </div>
          <div class="userInfo">
              <h5 class="ellipsis_1">{{selfRank.realName}}</h5>
              <span>{{selfRank.cellPhone }}</span>
          </div>
          <div style="flex:1"></div>
          <div class="count-container">
              <span>{{rankTab=="0"?`${selfRank.cardNum}张`:`￥${selfRank.orderPriceDesc}`}}</span>
              <i :class="`iconfont ${['icon-s','icon-x','icon-p'][selfRank.state]}`" :style="`color: ${['#dda657','rgb(31, 189, 92)', 'rgb(186, 186, 186)'][selfRank.state]}`"></i>
          </div>
        </li>
        <li
          v-for="item in rankList.list"
          :key="item.id"
        >
        <label for="" class="ellipsis_1">{{item.rankNum==-1?"未上榜":item.rankNum}}</label>
          <div
            class="logo-container"
            :style="{background:`url(${item.avatar||'https://img.mall.xc2018.com.cn/mall/upload/20190513/140756_99_gxee.png'}) no-repeat center / cover`}"
          >
          </div>
          <div class="userInfo">
              <h5 class="ellipsis_1">{{item.realName}}</h5>
              <span>{{item.cellPhone | shadowPhoneOfMiddle }}</span>
          </div>
          <div style="flex:1"></div>
          <div class="count-container">
             <span>{{rankTab=="0"?`${item.cardNum}张`:`￥${item.orderPriceDesc}`}}</span><i :class="`iconfont ${['icon-shang','icon-xia','icon-p'][item.state]}`" :style="`color: ${['#dda657','rgb(31, 189, 92)', 'rgb(186, 186, 186)'][item.state]}`"></i>
          </div>
        </li>
      </ul>
      <no-more v-show="rankList.list.length === 0"></no-more>
              <mt-popup v-model="popupVisible" position="bottom" class="mint-popup-4">
            <div class="picker-toolbar">
                <span class="mint-datetime-action mint-datetime-cancel" @click="popupVisible = false">取消</span>
                <span class="mint-datetime-action mint-datetime-confirm" @click="saveStatsDate">确定</span>
            </div>
            <mt-picker ref="datePicker" :slots="addressSlots" @change="changeStatsDate" :visible-item-count="5"></mt-picker>
        </mt-popup>
    </div>
  </section>
</template>
<script>
import { Indicator, Popup, Picker } from "mint-ui";
import { checkIsActive, findRankListPage, getMyRank } from "@/api";
import { Toast, MyError } from "@/global"; // resolveTimeout, rejectTimeout
let initYear = 2018;
let currentDate = new Date();
let curMonth = [currentDate.getFullYear(), currentDate.getMonth() + 1].join("-");
let years = currentDate.getFullYear() - initYear;
let dd = Array.from({ length: years > 0 ? years : 0 }, (item, index) => {
    let currentMonth = new Date().getMonth() + 1;
    let curMonths = Array.from({ length: currentMonth }, (month, idx) => [initYear + index + 1, idx + 1])
    return curMonths
}).reduce((prevalue, item) => {
    return [...prevalue, ...item]
}, [[2018, 12]]).map(item => item.join("-"))
export default {
  components: {
    [Popup.name]: Popup,
    [Picker.name]: Picker,
  },
  data() {
    return {
      rankTab: "1",
      rankType: "200",
      currentLevel: "200",
      popupVisible: false,
      tempMonth: "", // 保存当前月份
       statsDate: {
         date0: curMonth,
         date1: curMonth
      },
      addressSlots: [ // 月份选择生产
          {
              flex: 1,
              values: [...dd],
              className: "slot1",
              textAlign: "center"
          }
      ],
      selfRanks: [],
      rankTypes: [{levelName: "教练", level: 200}, {levelName: "院长", level: 300}, {levelName: "校长", level: 400}, {levelName: "小镇", level: 600}],
      rankTabs: [{ label: "个人销卡排行榜", id: 0, type: "0" }, { label: "个人产品销售排行", id: 1, type: "1" }],
      rankList: {
        isLoading: false,
        list: [],
        pageNum: 0,
        total: -1
      }
    };
  },
  computed: {
    currentList() {
      let { list = [] } = this["rankList"];
      return list;
    },
    isLoading() {
      let { isLoading, total } = this["rankList"];
      return isLoading || total !== -1;
    },
    selfRank() {
      return this.selfRanks[Number(this.rankTab)] || {}
    },
    currentDate() {
      let key = this.rankTab;
       return this.statsDate["date"+key]
    }
  },
  mounted() {
    getMyRank({ searchDate: this.statsDate["date"+this.rankTab] }).then(res => {
      this.selfRanks = res;
    })
  },

  methods: {
    // 保存当前统计的月份条件
      saveStatsDate() {
          this.popupVisible = false
          this.statsDate["date"+this.rankTab] = this.tempMonth;
          getMyRank({ searchDate: this.statsDate["date"+this.rankTab] }).then(res => {
              this.selfRanks = res;
          })
          this.changeTab()
      },
        // 改变月份条件
      changeStatsDate(picker, values) {
          this.tempMonth = values[0]
      },
        // 重置月份条件
      setCurrentStatsDate(value1) {
          this.$refs.datePicker.setSlotValue(0, value1)
      },
    typeChanged() {
        if (this.rankTypes.length) {
            if (this.rankType != this.rankTypes[0].level) {
                this.rankType = this.rankTypes[0].level;
            } else {
                this.changeTab()
            }
        }
        this.setCurrentStatsDate(this.statsDate["date"+this.rankTab])
    },
    setCurrentAgent(currentLevel) {
        this.currentLevel = currentLevel;
        this.rankTypes = this.rankTypes.filter(({level}) => currentLevel>=level)
        if (this.rankTypes.length) {
          this.rankType = this.rankTypes[0].level;
        }
    },
     // 下拉加载更多
    loadMore() {
      let { isLoading = false, total = -1 } = this["rankList"];
      if (!isLoading && total === -1) {
        this.fetchList();
      }
    },
     // tab 切换时重新拉去数据
    changeTab() {
    //   let { list = [], total = -1 } = this["rankList"];
    //   if (list.length === 0 && total === -1) {
        Indicator.open();
         this.fetchList(true).then(res => Indicator.close());
    // }
    },
     // 拉起列表数据
    fetchList(isReset = false) {
      let content = this["rankList"];
      let { rankTab, rankType } = this;
      let { isLoading = false, list = [], pageNum = 0, total = -1 } = content;
      if (!isReset && isLoading) {
        return Promise.reject(new MyError("不能重复请求", 1));
      } else if (!isReset && total !== -1) {
        return Promise.reject(new MyError("已经没有数据", 1));
      } else {
        if (isReset) {
          list = [];
          pageNum = 0;
          Object.assign(content, {
              list: [...list],
              pageNum,
              total: -1
          });
        }
        content.isLoading = true;
        return findRankListPage({
            pageSize: 15,
            pageNum: pageNum + 1,
            type: rankTab,
            level: rankType,
            searchDate: this.statsDate["date"+this.rankTab]
        }).then(res => {
            let tempList = [...list, ...res];
            Object.assign(content, {
              list: tempList,
              pageNum: res.length ? pageNum + 1 : pageNum,
              total: res.length ? -1 : tempList.length,
              isLoading: false
            });
          })
          .catch(err => {
            Toast(err);
            content.isLoading = false;
          });
      }
    }
  },
  watch: {
    rankType() {
      this.changeTab();
    }
  },
  beforeRouteEnter(from, to, next) {
       checkIsActive().then(res => {
           if (res.agentLevel > 100) {
               next(vm => {
                   vm.setCurrentAgent(res.agentLevel)
               })
           } else {
               Toast("VIP无法查看");
               if (!from.name) {
                   next({name: "home"})
               }
           }
      });
  }
};
</script>
<style lang='less' scoped>
@import url("../../assets/style/base.less");
@import url("./rank.less");
</style>
