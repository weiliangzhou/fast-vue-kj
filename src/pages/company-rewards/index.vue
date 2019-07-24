<template>
  <div class="wrap flex-col flex-st">
    <section class="explain">
      <p>账单说明 : 每月规定5日打款，分销当日24小时内查收 银行卡款项是否到账;</p>
    </section>
    <section class="conetnt">
      <nav class="nav flex-row flex-ar">
        <span>时间</span>
        <span>奖励金额</span>
        <span>扣税</span>
        <span>应发金额</span>
        <span>状态</span>
      </nav>
      <mt-loadmore
        :bottom-method="loadBottom"
        :bottom-all-loaded="billList.total!==-1"
        ref="loadmore"
        v-if="billList.list.length"
      >
        <ul class="list">
          <li
            v-for="item in billList.list"
            :key="item.id"
            class="flex-row flex-ar"
          >
            <span class="ellipsis_1">{{item.createdAt | dataFormat}}</span>
            <span class="ellipsis_1">+{{item.billPriceDesc}}</span>
            <span class="ellipsis_1">-{{item.takDesc}}</span>
            <span class="ellipsis_1">{{item.acquirePriceDesc}}</span>
            <span class="ellipsis_1">{{item.remark}}</span>
          </li>
        </ul>
      </mt-loadmore>

      <div
        v-else
        class="nodata"
      ></div>
    </section>

    <div class="overflow flex-col flex-be"></div>
  </div>
</template>

<script>
import { saleBillList } from "@/api";
import { Loadmore } from "mint-ui";
import { Toast, MyError } from "@/global" // resolveTimeout, rejectTimeout,  class="ellipsis_1"getObject
export default {
  data() {
    return {
      billList: { // 我的打款记录（公司给我的打款记录）
        isLoading: false,
        list: [],
        pageNum: 0,
        total: -1
      }
    };
  },
  components: {
    [Loadmore.name]: Loadmore
  },
  mounted() {
    this.fetchList(true);
  },

  methods: {
    // 加载更多
    loadBottom() {
      let { isLoading = false, total = -1 } = this.billList;
      if (!isLoading && total === -1) {
        this.fetchList()
          .catch(err => Toast(err))
          .then(res => this.$refs.loadmore.onBottomLoaded());
      } else {
        // this.$refs.loadmore.onBottomLoaded()
      }
    },
    // 获取记录列表
    fetchList(isReset = false) {
      let content = this.billList
      let {
        isLoading = false,
        list = [],
        pageNum = 0,
        total = -1
      } = content;
      if (!isReset && isLoading) {
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
        return saleBillList({
          pageSize: 15,
          pageNum: pageNum + 1,
        })
          .then(res => {
            let tempList = [...list, ...res];
            Object.assign(content, {
              list: tempList,
              pageNum: res.length ? pageNum + 1 : pageNum,
              total: res.length > 14 ? -1 : tempList.length,
              isLoading: false
            });
          })
          .catch(err => {
             Toast(err)
            content.isLoading = false;
          });
      }
    }
  }
};
</script>
<style lang='less' scoped>
@import url("../../assets/style/base.less");
.wrap {
  height: 100vh;
  background: #f7f7f7;
}
// header{ height: 80px; box-sizing: border-box; padding: 21px 0 14px 0; border-bottom: 1px solid #E0E0E0; background: #fff;}
// header span{ display: inline-block; width: 50%; position: relative; text-align: center; font-size: 32px; color: rgba(101,101,101,1)}
// header span.active{ font-weight: 600; color: #323232; }
// header span.active::after{ display: block; content: ""; overflow: hidden; width: 20%; height: 4px; background: #C7000A;
//     position: absolute; bottom: -12px; left: 40%;}
.label {
  padding: 32px;
  box-sizing: border-box;
  color: #fff;
  background: #fff;
  flex-wrap: wrap;
}
.label .item {
  width: 45%;
  height: 60px;
  border-radius: 8px;
  text-align: center;
  line-height: 60px;
  font-size: 26px;
  color: #fff;
}
.label .item:nth-child(1) {
  margin-bottom: 24px;
  background: #eb6060;
}
.label .item:nth-child(2) {
  margin-bottom: 24px;
  background: #f99f56;
}
.label .item:nth-child(3) {
  background: #84d8a7;
}
.label .item:nth-child(4) {
  background: #80b3e8;
}
.swiperContent {
  background: #fff;
  height: 96px;
  border-bottom: 1px solid #e0e0e0;
}
.mySwiper {
  width: 80%;
  height: 40px;
  text-align: center;
  margin: 28px auto;
  box-sizing: border-box;
}
.swiper-slide {
  line-height: 60px;
  font-size: 28px;
}
.swiper-button-next,
.swiper-container-rtl .swiper-button-prev {
  background-image: url(http://chuang-saas.oss-cn-hangzhou.aliyuncs.com/upload/image/20181122/277110436cc442a8b1f06daaf2af144f.png);
  right: 10px;
  left: auto;
}
.swiper-button-prev,
.swiper-container-rtl .swiper-button-next {
  background-image: url(http://chuang-saas.oss-cn-hangzhou.aliyuncs.com/upload/image/20181122/94b69fb4806d44a0b8000370895f7e93.png);
  left: 10px;
  right: auto;
}
.swiper-button-prev,
.swiper-button-next {
  position: absolute;
  top: 50%;
  width: 26px;
  height: 46px;
  margin-top: -22px;
  z-index: 10;
  cursor: pointer;
  background-size: 27px 44px;
  background-position: center;
  background-repeat: no-repeat;
}
.explain {
  padding: 16px 32px;
  background: #f7f7f7;
  box-sizing: border-box;
}
.explain p {
  opacity: 1;
  font-size: 28px;
  font-family: PingFangSC;
  font-weight: Regular;
  color: rgba(152, 152, 152, 1);
  line-height: 40px;
  letter-spacing: 0.34px;
}
.explain p span {
  color: #951520;
  font-weight: bold;
}
.conetnt nav {
  height: 66px;
  background: #474747;
  font-size: 28px;
  color: #fff;
  line-height: 66px;
}
.conetnt nav span {
  display: block;
  width: 24%;
  text-align: center;
}
.conetnt .list {
  background: #fff;
  padding-bottom: 24px;
}
.conetnt .list li {
  padding: 24px 28px 0 28px;
  box-sizing: border-box;
}
.conetnt .list li span {
  width: 24%;
  text-align: center;
}
.nodata {
  width: 163px;
  height: 243px;
  background: url(http://chuang-saas.oss-cn-hangzhou.aliyuncs.com/upload/image/20181122/a830aeaccf214f98bab1c1b90f35dec0.png)
    no-repeat center center;
  background-size: contain;
  margin: 0 auto;
  margin-top: 110px;
}
</style>
