<!-- 提现首页 -->
<template>
  <section id="withdraw-page">
    <div class="top-bar-container">
      <button @click="regularTipsIsShow=true"><span>?</span></button>
      <h4>{{value}}</h4>
      <p>{{typeLabel}}</p>
    </div>
    <div class="list-container">
        <h5>{{listTitle}}</h5>
        <span v-if="type == 'extract'">提现结果请前往OMEX查询</span>
      <ul v-show="currentList.length" v-infinite-scroll="loadMore" infinite-scroll-disabled="isLoading" :infinite-scroll-immediate-check="true" infinite-scroll-distance="10">
        <component class="bottom-border" v-for="item in currentList" :item="item" :key="item.id" v-bind:is="currentComponent"></component>
      </ul>
      <div v-show="currentList.length === 0" class="no-data" :style="`background-image:url(${noDataImg})`">

      </div>
    </div>
    <div class="bottom-container" v-if="type == 'acalculationPower'">
      <button v-if="type == 'acalculationPower'" @click="showShare"><span>提升算力</span></button>
      <!-- <button v-if="type == 'extract'" @click="pushRoute('withdraw-record')"><span>提现</span></button> -->
    </div>
  </section>
</template>

<script>
import picMoney from '@/img/pic_money.png'
import picPower from '@/img/pic_power.png'
import picSuanli from '@/img/pic_suanli.png'
import item1 from "./item1"
import item2 from "./item2"
import item3 from "./item3"
import { MyError, Toast } from '@/global' // resolveTimeout, rejectTimeout, getObject, Toast
import { acalculationPower, getExtractPage, energyGetPage } from "@/api"
export default {
  props: {
    type: {
      type: String,
    }
  },
  data() {
    return {
      extract: 0, // 累计可提现
      value: '',
      // ['extract','energy','acalculationPower']
      dataList: {
        // 数据
        isLoading: false, // 是否在请求中
        list: [], // 数据保存数组
        pageNum: 0, // 当前页码
        total: -1
      },
    }
  },
  components: {
      item1,
      item2,
      item3
  },

  computed: {
    currentList() {
      let { list = [] } = this['dataList']
      return list
    },
    isLoading() {
      let { isLoading, total } = this['dataList']
      return isLoading || total !== -1
    },
  typeLabel() {
    let type = this.type
    return {
      'extract': "",
      'energy': "剩余电力(小时)",
      'acalculationPower': "当前算力"
    }[type] || ''
  },
  noDataImg() {
     let type = this.type
    return {
      'extract': picMoney,
      'energy': picPower,
      'acalculationPower': picSuanli
    }[type] || ''
  },
  currentComponent() {
    let type = this.type
    return {
      'extract': "item3",
      'energy': "item2",
      'acalculationPower': "item1"
    }[type] || ''
  },
  listTitle() {
    let type = this.type
    return {
      'extract': "提现记录",
      'energy': "电力记录",
      'acalculationPower': "算力记录"
    }[type] || ''
  }
  },

  mounted() {
   this.fetchList(true)
  },

  methods: {
     showShare() {
      this.$root.$children[0].setShareContext(true);
    },
    // product-earnings
    loadMore() {
      let { isLoading = false, total = -1 } = this['dataList']
      if (!isLoading && total === -1) {
        this.fetchList()
      }
    },
    // 拉起列表数据
    fetchList(isReset = false) {
      let content = this['dataList']
      let { isLoading = false, list = [], pageNum = 0, total = -1 } = content
      if (!isReset && isLoading) {
        return Promise.reject(new MyError('不能重复请求', 1))
      } else if (!isReset && total !== -1) {
        return Promise.reject(new MyError('已经没有数据', 1))
      } else {
        if (isReset) {
          list = []
          pageNum = 0
          Object.assign(content, {
            list: [...list],
            pageNum,
            total: -1
          })
        }
        content.isLoading = true
        let shouldFetch = {
      'extract': getExtractPage,
      'energy': energyGetPage,
      'acalculationPower': acalculationPower
    }[this.type] || energyGetPage
       
        return shouldFetch({
          pageSize: 15,
          pageNum: pageNum + 1
        })
          .then(({data, total, records}) => {
            let tempList = [...list, ...records]
            this.value = data;
            Object.assign(content, {
              list: tempList,
              pageNum: records.length ? pageNum + 1 : pageNum,
              total: records.length ? -1 : tempList.length,
              isLoading: false
            })
          })
          .catch(err => {
            Toast(err)
            content.isLoading = false
          })
      }
    }
  }
}
</script>
<style lang='less' scoped>
#withdraw-page {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background: rgba(244, 244, 244, 1);
  align-items: center;
  position: relative;
  background-image: linear-gradient(179deg, #3F415D 0%, #161725 268px);
}
.top-bar-container {
  align-items: center;
  justify-content: space-between;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 80px;
  width: 100%;
  h4 {
      font-family: PingFangSC-Medium;
  font-size: 72px;
  color: #FFFFFF;
  letter-spacing: 0;
  height: 100px;
  line-height: 100px;
  margin: 18px 0 10px;
  }
  p {
    height: 40px;
    line-height: 40px;
    font-family: PingFangSC-Medium;
font-size: 28px;
color: #9C9DAA;
letter-spacing: 0;
  }
  & > button {
    position: absolute;
    background: transparent;
    border: none;
    right: 0px;
    top: 40px;
    background: #D6A655;
    border-radius: 100px 0 0 100px;
    width: 50px;
    height: 40px;
  }
}
.list-container {
  display: flex;
  flex: 1;
  position: relative;
  width: 100%;
  overflow: hidden;
  padding: 156px 30px 0;
  background: #FFFFFF;
border-radius: 60px 60px 0 0;
box-sizing: border-box;
        overflow-y: scroll; //该属性随着手指离开立即停止
    -webkit-overflow-scrolling: touch; //该属性随着手指离开还会保持滚动
  &> h5 {
      position: absolute;
      top: 70px;
      font-family: PingFangSC-Medium;
font-size: 32px;
color: #202437;
letter-spacing: 0;
line-height: 45px;
height: 45px;

  }

  span {
  font-family: PingFangSC-Regular;
font-size: 28px;
color: #A0A3AF;
letter-spacing: 0;
height: 40px;
line-height: 40px;
position: absolute;
right: 30px;
top: 80px;
}
  ul {
    padding-bottom: 24px;
    box-sizing: border-box;
    height: 100%;
    flex: 1;
    position: absolute;
    width:calc(~"100% - 0.8rem");
    .bottom-border {
      border-bottom: 1px solid #E5E5E5;
      &:last-child {
        border-bottom: none;
      }
    }
  }
}
.bottom-container {
  width: 100vw;
  height: 120px;
  padding: 16px 24px;
  box-sizing: border-box;
  background: #fff;
  display: flex;
  justify-content: space-around;
  button {
    height: 100%;
    flex: 1;
   background-image: linear-gradient(270deg, #FFD79F 0%, #D4A452 100%);
border-radius: 62px;
outline: none;
border: none;
    span {
     font-family: PingFangSC-Medium;
font-size: 36px;
color: #FFFFFF;
letter-spacing: 0;
height: 50px;
line-height: 50px;
    }
  }
}

.no-data {
  width: 446px;
  height: 448px;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    margin: auto;
}
</style>
