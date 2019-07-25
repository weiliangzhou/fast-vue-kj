<!--  -->
<template>
  <section id="course-container">
  </section>
</template>

<script>
import {
  findOfflineProductList,
  findOnlineProductList,
  countMyOrder
} from '@/api'
import { Toast, MyError } from '@/global' // resolveTimeout, rejectTimeout
export default {
  data() {
    return {}
  },
  computed: {
    currentList() {
      let type = this.courseType
      let { list = [] } = this[type + 'Course']
      return list
    },
    isLoading() {
      let type = this.courseType
      let { isLoading, total } = this[type + 'Course']
      return isLoading || total !== -1
    }
  },

  mounted() {},

  methods: {
    refresh(callback) {
      Promise.all([
        this.fetchList(true).catch(err => {}),
        countMyOrder()
          .then(res => {
            Object.assign(this.countMyOrder, res || {})
          })
          .catch(err => {})
      ]).then(res => {
        callback && callback()
      })
    },

    changeAndShowReword(rewards) {
      this.rewardList = rewards || []
      if (this.rewardList.length > 1) {
        this.reward = true
      }
    },
    // 下拉加载更多
    loadMore() {
      if (this.$route.name !== this.currentRouteName) {
        return
      }
      let { isLoading = false, total = -1 } = this[this.courseType + 'Course']
      if (!isLoading && total === -1) {
        this.fetchList()
      }
    },
    // tab 切换时重新拉去数据
    changeTab() {
      let { list = [], total = -1 } = this[this.courseType + 'Course']
      if (list.length === 0 && total === -1) {
        this.fetchList()
      }
    },
    // 下单
    buyAction(item) {
      let { id: goodsId, productId, retailPriceDesc: price = 0, name = '' } =
        item || {}
      this.$router.push({
        name: 'buy',
        query: { goodsId, productId, price, title: name }
      })
    },
    // 生成海报
    goPoster(item) {
      let {
        productId = '',
        productType,
        id: goodsId,
        name = '',
        topLine,
        posterImg,
        goodsSn
      } = item || {}
      this.$router.push({
        name: 'poster',
        hash: '#' + productId,
        query: {
          productId,
          productType,
          goodsId,
          name,
          topLine,
          posterImg,
          goodsSn
        }
      })
    },
    // 拉起列表数据
    fetchList(isReset = false) {
      let content = this[this.courseType + 'Course']
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
        let pageSize = 15
        return Promise.resolve()
          .then(res => {
            if (this.courseType === 'online') {
              return findOnlineProductList({
                pageSize,
                pageNum: pageNum + 1
              })
            } else {
              return findOfflineProductList({
                pageSize,
                pageNum: pageNum + 1
              })
            }
          })
          .then(res => {
            let tempList = [...list, ...res]
            Object.assign(content, {
              list: tempList,
              pageNum: res.length ? pageNum + 1 : pageNum,
              total: res.length >= 1 ? -1 : tempList.length,
              isLoading: false
            })
          })
          .catch(err => {
            Toast(err)
            content.isLoading = false
          })
      }
    }
  },
  watch: {
    courseType() {
      this.changeTab()
    }
  },
  activated() {}
}
</script>
<style lang='less' scoped>
section[id='course-container'] {
  width: 100vw;
  min-height: 100%;
  flex: 1;
  box-sizing: border-box;
  background: rgba(247, 247, 247, 1);
  display: flex;
  flex-direction: column;
  -webkit-overflow-scrolling: touch;
  & > h5 {
    height: 40px;
    font-size: 28px;
    color: rgba(152, 152, 152, 1);
    line-height: 40px;
    letter-spacing: 0.68px;
    margin-left: 24px;
    margin-bottom: 16px;
  }
  .list-container {
    display: flex;
    flex: 1;
    position: relative;
    ul {
      padding-bottom: 24px;
      box-sizing: border-box;
      height: 100%;
      flex: 1;
      width: 100%;
      li {
        display: flex;
        padding: 32px;
        background: rgba(255, 255, 255, 1);
        margin-bottom: 20px;
        .logo-container {
          position: relative;
          width: 245px;
          height: 150px;
          box-sizing: border-box;
          background: RGB(121, 141, 173);
          margin-right: 16px;
          overflow: hidden;
          border-radius: 8px;
          &:after {
            position: absolute;
            left: 0;
            top: 0;
            display: block;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.05);
            content: attr(data-text);
            transition: all 1s ease;
            transform: translate(0%, 0%);
            color: #fff;
          }
        }
        .detail-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          width: 0;
          .top,
          .bottom {
            display: flex;
            justify-content: space-between;
          }
          .middle {
            font-size: 28px;
            font-weight: 400;
            color: rgba(152, 152, 152, 1);
            line-height: 40px;
            letter-spacing: 0.34px;
          }
          .top {
            overflow: hidden;
            h5 {
              opacity: 1;
              font-size: 32px;
              font-family: PingFangSC;
              font-weight: 400;
              color: rgba(54, 54, 54, 1);
              line-height: 36px;
              flex: 1;
            }
            span {
              margin-left: 10px;
              font-size: 24px;
              font-weight: 400;
              color: rgba(152, 152, 152, 1);
              line-height: 33px;
            }
          }
          .bottom {
            display: flex;
            & > div {
              flex: 1;
              width: 0;
              display: flex;
              margin-right: 12px;
              span {
                flex: 1;
                font-size: 28px;
                font-weight: 400;
                color: rgba(235, 43, 52, 1);
                line-height: 42px;
                letter-spacing: 0px;
              }
              i {
                font-size: 14px;
                color: rgba(152, 152, 152, 1);
              }
            }
            button {
              width: 106px;
              height: 37px;
              opacity: 1;
              font-size: 26px;
              font-family: PingFangSC;
              font-weight: 400;
              color: rgba(255, 255, 255, 1);
              line-height: 37px;
              letter-spacing: 0.42px;
              border: none;
              width: 137px;
              height: 44px;
              opacity: 1;
              background: #d7b686;
              border-radius: 6px;
            }
          }
        }
      }
    }
  }
}
.reward-container {
  background: #fff;
  padding: 32px;
  border-radius: 20px 20px 0 0;
  overflow-y: auto;
  h5 {
    font-size: 36px;
    font-family: PingFangSC;
    color: rgba(56, 56, 56, 1);
    line-height: 50px;
    letter-spacing: 0.58px;
    margin-bottom: 20px;
  }
  ul {
    li {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
      span:first-of-type {
        height: 45px;
        font-size: 32px;
        font-family: PingFangSC;
        color: rgba(101, 101, 101, 1);
        line-height: 45px;
        letter-spacing: 0px;
        flex: 1;
        width: 0;
        margin-right: 12px;
      }
      span:last-of-type {
        height: 44px;
        opacity: 1;
        font-size: 32px;
        font-family: PingFangSC;
        color: rgba(235, 43, 52, 1);
        line-height: 45px;
        letter-spacing: 0px;
      }
    }
    & > p {
      height: 40px;
      opacity: 1;
      font-size: 28px;
      font-family: PingFangSC;
      color: rgba(152, 152, 152, 1);
      line-height: 40px;
      letter-spacing: 0.45px;
    }
  }
}
.product-container {
  height: 384px;
  box-sizing: border-box;
  background-image: linear-gradient(
    left,
    rgba(215, 182, 134, 1),
    rgba(235, 210, 165, 1)
  );
  background-clip: content-box;
  display: flex;
  padding-bottom: 130px;
  position: relative;
  overflow: visible;
  & > div {
    flex: 1;
    height: 352px;
    border-width: 32px 24px 0 24px;
    border-style: transparent;
    margin-top: 32px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 2px 4px 12px 0px rgba(229, 229, 229, 0.5); /* no */
    border-radius: 12px;
    overflow: hidden;
    position: absolute;
    top: 0;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    h6 {
      height: 45px;
      font-size: 32px;
      color: rgba(152, 152, 152, 1);
      line-height: 45px;
      letter-spacing: 0.77px;
      margin: 32px 36px 24px 40px;
    }
    h4 {
      height: 100px;
      opacity: 1;
      font-size: 72px;
      color: rgba(54, 54, 54, 1);
      line-height: 100px;
      letter-spacing: 1.74px;
      margin: 0 36px 0 40px;
    }
    ul {
      margin: 24px 0 24px;
      display: flex;
      li {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        & > span:first-of-type {
          height: 40px;
          font-size: 28px;
          color: rgba(152, 152, 152, 1);
          line-height: 40px;
          letter-spacing: 0.68px;
        }
        & > span:last-of-type {
          height: 56px;
          font-size: 40px;
          color: rgba(54, 54, 54, 1);
          line-height: 56px;
          letter-spacing: 0.97px;
          margin-top: 4px;
          font-weight: 600;
        }
      }
    }
    button {
      width: 123px;
      height: 56px;
      background: rgba(215, 182, 134, 1);
      border-radius: 24px;
      border: none;
      position: absolute;
      top: 32px;
      right: 36px;
      overflow: hidden;
      span {
        height: 45px;
        font-size: 32px;
        color: rgba(255, 255, 255, 1);
        line-height: 45px;
        letter-spacing: 0.77px;
      }
    }
  }
  margin-bottom: 20px;
}

.button-menus {
  display: flex;
  height: 96px;
  box-shadow: 2px 4px 12px 0px rgba(232, 232, 232, 0.5);
  border-radius: 6px;
  margin-bottom: 32px;
  margin: 0 24px 18px;

  a {
    background: rgba(255, 255, 255, 1);
    padding: 20px 0;
    flex: 1;
    display: flex;
    display: flex;
    justify-content: center;
    text-decoration: none;
    position: relative;
    align-items: center;
    i {
      color: rgba(221, 166, 87, 1);
      font-size: 48px;
    }
    span {
      height: 45px;
      font-size: 32px;
      color: rgba(54, 54, 54, 1);
      line-height: 45px;
      letter-spacing: 0.52px;
      font-weight: 600;
      margin-left: 40px;
    }
  }
  p {
    display: block;
    width: 1px; /* no */
    height: 64px;
    border-radius: 10px;
    background: #d7b686;
    margin: auto;
  }
  .vip {
    margin-left: 20px;
  }
  .agent {
  }
}
</style>
<style>
.reward-popup .vux-popup-dialog {
  background: none;
  border-radius: 0.266667rem 0.266667rem 0 0;
}
</style>
