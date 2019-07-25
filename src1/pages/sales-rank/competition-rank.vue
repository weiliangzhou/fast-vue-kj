<!-- 排行榜 -->
<template>
  <section id="rank-container">
    <div class="time-label">
      {{title}}
    </div>
    <ul
      v-if="topThreeList.length"
      class="top-three"
    >
      <li
        v-for="item in topThreeList"
        :key="item.uid"
      >
        <div
          class="logo-container"
          :style="{backgroundImage:`url(${item.avatar||'https://img.mall.xc2018.com.cn/mall/upload/20190513/140756_99_gxee.png'})`}"
        >
          <img :src="item.badge" />
        </div>
        <span class="ellipsis_1">{{item.realName}}</span>
        <span class="ellipsis_1">{{item.count}}人</span>
      </li>
    </ul>
    <div class="list-container">
      <ul
        infinite-scroll-disabled="isLoading"
        :infinite-scroll-immediate-check="true"
        infinite-scroll-distance="10"
      >
        <li
          v-if="selfRank.cellPhone"
          class="hiddenAfter"
          style="flex: none;margin:0 0 0.26667rem 0; padding-bottom: 0.32rem;border-radius: 0.106667rem"
        >
          <label
            for=""
            class="ellipsis_1"
          >{{selfRank.ranking}}</label>
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
            <div class="logo-container helpImg"></div>
            <span>{{`${selfRank.count}人`}}</span>
            <i
              :class="`iconfont ${['icon-s','icon-x','icon-p'][selfRank.state]}`"
              :style="`color: ${['#dda657','rgb(31, 189, 92)', 'rgb(186, 186, 186)'][selfRank.state]}`"
            ></i>
          </div>
        </li>
        <li
          v-for="item in currentList"
          :key="item.uid"
        >
          <label
            for=""
            class="ellipsis_1"
          >{{item.ranking}}</label>
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
            <div class="logo-container helpImg"></div>
            <span>{{item.count}}人</span><i
              :class="`iconfont ${['icon-shang','icon-xia','icon-p'][item.state]}`"
              :style="`color: ${['#dda657','rgb(31, 189, 92)', 'rgb(186, 186, 186)'][item.state]}`"
            ></i>
          </div>
        </li>
      </ul>
    </div>
    <div
      v-if="timeLabel"
      class="count-down"
    >
      <div class="referrer-container">
        <h5>{{name}}</h5>
        <h6 class="ellipsis_3">{{timeLabel}}</h6>
      </div>
    </div>
  </section>
</template>
<script>
import { Indicator } from "mint-ui";
import { findFierceTigerListDataPage, findFierceTigerGoodsInfo } from "@/api";
import { Toast, MyError } from "@/global"; // resolveTimeout, rejectTimeout
let first = 'https://img.mall.xc2018.com.cn/mall/upload/20190423/095832_94_y453.png';
let second = 'https://img.mall.xc2018.com.cn/mall/upload/20190423/095904_53_69ir.png';
let third = 'https://img.mall.xc2018.com.cn/mall/upload/20190423/095933_33_v8l0.png';
export default {
  data() {
    return {
      title: "",
      items: [first, second, third],
      deadline: new Date(2019, 1, 2, 20, 0),
      selfRank: {},
      timer: null,
      currentDate: null,
      timeLabel: "",
      name: "",
      countdownDate: 0,
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
      return list.filter(item => !item.badge);
    },
    topThreeList() {
      let { list = [] } = this["rankList"];
      return list.filter(item => item.badge);
    },
    isLoading() {
      // let { isLoading, total } = this["rankList"];
      return true; // isLoading || total !== -1;
    }
  },
  mounted() {},
  methods: {
    Loadmore() {},
    saveInfo(data = {}) {
      let { date, name, startTime, endTime } = data;
      // date = "2019-07-01 18:11:02"
      Object.assign(this, {
        name,
        title: startTime + " 至 " + endTime,
        deadline: new Date(startTime),
        currentDate: new Date(date)
      });
      if (this.deadline.getTime() - new Date(date).getTime() > 0) {
        this.timeStart();
      } else {
        this.fetchList(true);
      }
    },
    getTimeDown() {
      let { deadline, currentDate } = this;
      var diff = -480 - currentDate.getTimezoneOffset(); // 是北京时间和当地时间的时间差
      var leave =
        deadline.getTime() -
        currentDate.getTime() -
        this.countdownDate++ * 1000 +
        diff * 60000;
      if (leave <= 0) {
        return [];
      } else {
        var day = Math.floor(leave / (1000 * 60 * 60 * 24));
        var hour = Math.floor(leave / (1000 * 3600)) - day * 24;
        var minute =
          Math.floor(leave / (1000 * 60)) - day * 24 * 60 - hour * 60;
        var second =
          Math.floor(leave / 1000) -
          day * 24 * 60 * 60 -
          hour * 60 * 60 -
          minute * 60;
        return [
          day ? day + "天" : "",
          hour ? hour + "时" : "",
          minute ? minute + "分" : "",
          second ? second + "秒" : ""
        ];
      }
    },
    timeStart() {
      this.timer = setInterval(() => {
        this.timeLabel = this.getTimeDown().join("");
        if (!this.timeLabel) {
          clearInterval(this.timer);
          this.timer = null;
          this.fetchList(true);
        }
      }, 1000);
    },
    fetchList(isReset = false) {
      let content = this["rankList"];
      let { isLoading = false, list = [], pageNum = 0, total = -1 } = content;
      if (!isReset && isLoading) {
        return Promise.reject(new MyError("不能重复请求", 1));
      } else if (!isReset && total !== -1) {
        return Promise.reject(new MyError("已经没有数据", 1));
      } else {
        Indicator.open();
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
        return findFierceTigerListDataPage({
          pageSize: 20,
          pageNum: pageNum + 1,
          level: 200,
          searchDate: "2019-2",
          type: 0
        })
          .then(res => {
            Indicator.close();
            if (res.length) {
               this.selfRank = res.pop();
               if (res.length && res[res.length-1].uid === this.selfRank.uid) {
                   res.pop()
               }
            }
            res = res.map(item => {
              if (["1", "2", "3"].includes(item.ranking)) {
                item.badge = [first, second, third][item.ranking - 1];
              }
              return item;
            });
            let tempList = [...list, ...res];
            Object.assign(content, {
              list: tempList,
              pageNum: res.length ? pageNum + 1 : pageNum,
              total: res.length ? -1 : tempList.length,
              isLoading: false
            });
          })
          .catch(err => {
            Indicator.close();
            Toast(err);
            content.isLoading = false;
          });
      }
    }
  },
  beforeRouteEnter(from, to, next) {
    findFierceTigerGoodsInfo()
      .then(res => {
        next(vm => vm.saveInfo(res));
      })
      .catch(err => {
        Toast(err);
        if (!from.name) {
          next({ name: "home" });
        }
      });
  },
  destroyed() {
    clearInterval(this.timer);
    this.timer = null;
  }
};
</script>
<style lang='less' scoped>
@import url("../../assets/style/base.less");
@import url("./rank.less");
#rank-container {
  padding: 0 0 24px 0;
}
.badage {
  margin: 0 32px !important;
  width: 40px !important;
  height: 60px !important;
  border-radius: 8px !important;
  box-sizing: content-box !important;
  margin-right: 32px !important;
}
.helpImg {
  // background: none !important;
  margin: 0 0 !important;
  width: 24px !important;
  height: 36px !important;
  border-radius: 12px !important;
  box-sizing: content-box !important;
  margin-right: 8px !important;
  background: url("https://img.mall.xc2018.com.cn/mall/upload/20190516/114448_62_xbd2.png") no-repeat center / cover !important;
  &:after {
    background: none !important;
  }
}
.time-label {
  height: 40px;
  font-size: 28px;
  font-family: PingFangSC;
  color: rgba(152, 152, 152, 1);
  line-height: 40px;
  letter-spacing: 0px;
  border-radius: 8px;
  font-weight: 600;
  padding: 32px 0 24px 32px;
  box-sizing: content-box;
}
.count-down {
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
  background: rgba(255, 255, 255, 1);
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
      color: rgba(101, 101, 101, 1);
      font-weight: 700;
      margin: 24px 0;
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
      color: RGB(199, 0, 10);
      font-weight: 400;
    }
  }
}
</style>
