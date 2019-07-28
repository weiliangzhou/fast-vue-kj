<template>
  <div id="app">
    <transition name="router-fade" mode="out-in">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
    </transition>
    <transition name="router-fade" mode="out-in">
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    </transition>
    <section v-if="shareContextIsShow" class="dialogs" @touchMove.native="stopEvent" @wheel.native="stopEvent" @click="setShareContext(false)">
      <div class="share-container">
        <h5>邀请好友</h5>
        <p>每邀请1位好友注册赠送100GH/S</p>
        <ul>
          <li @click="showShareTips"><svg :style="{width: '40px', height: '40px'}" class="icon icon-svg" aria-hidden="true">
              <use xlink:href="#iconWeChat"></use>
            </svg><span>微信</span></li>
          <li @click="showShareTips"><svg :style="{width: '40px', height: '40px'}" class="icon icon-svg" aria-hidden="true">
              <use xlink:href="#iconpyq"></use>
            </svg><span>朋友圈</span></li>
          <li @click="copyShareUrl($event,copyContent)" id="tag-copy" :data-clipboard-text="copyContent">
            <svg class="icon icon-svg" aria-hidden="true" :style="{cursor: 'pointer', width: '40px', height: '40px'}" data-clipboard-text='http://kj.yizhidao9.com'>
              <use xlink:href="#iconlink"></use>
            </svg>
            <span>复制链接</span>
          </li>
        </ul>
        <button @click="setShareContext(false)"><span>取消</span></button>
      </div>
    </section>

      <div id="share" v-if="shareTipsImgIsShow" @click="shareTipsImgIsShow = false">
    <img :src="shareImg" alt="">
  </div>

  </div>
</template>

<script>

import Clipboard from 'clipboard';
import shareImg from "./shareImg.png"
import { copyTextToClipboard, getUserInfo } from "@/global"
export default {
  data() {
    return {
      shareContextIsShow: false,
      shareTipsImgIsShow: false,
      shareImg: shareImg,
      copyContent: ''
    }
  },
  name: 'App',
  methods: {
        stopEvent(e) {
        e = e || window.event;
        e.preventDefault? e.preventDefault() : e.returnValue = false
        if (e.stopPropagation) {
            e.stopPropagation();
            e.stopImmediatePropagation()
        } else {
            e.cancelBubble = true;
        }
    },
   showShareTips() {
     this.shareContextIsShow = false;
     this.shareTipsImgIsShow = true;
   },
    setShareContext(flag = false) {
      this.shareContextIsShow = flag;
    },
    copyShareUrl(e, text) {

       const clipboard = new Clipboard(e.currentTarget, { text: () => text })
      clipboard.on('success', e => {
        console.log({ type: 'success', message: '复制成功' })
        // 释放内存
        clipboard.off('error')
        clipboard.off('success')
        clipboard.destroy()
      })
      clipboard.on('error', e => {
        // 不支持复制
       console.log({ type: 'waning', message: '该浏览器不支持自动复制' })
        // 释放内存
        clipboard.off('error')
        clipboard.off('success')
        clipboard.destroy()
      })
      clipboard.onClick(e)
    }
  },
  mounted() {
          let user = getUserInfo()
      this.copyContent = window.location.origin+"/home/index?referUid=" + user.id
  },
  computed: {}
}
</script>
<style lang="less" scoped>
.dialogs {
  position: fixed;
  z-index: 10;
  top: 0;
  right: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  box-sizing: border-box;
  background: rgba(0, 0, 0, 0.45);
  .share-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
    position: relative;
    width: 100%;
    background: #fff;
    h5 {
      font-family: PingFangSC-Medium;
      font-size: 32px;
      color: #202437;
      letter-spacing: 0;
      text-align: justify;
      height: 45px;
      line-height: 45px;
      margin: 40px 0 10px;
    }

    p {
      font-family: PingFangSC-Regular;
      font-size: 28px;
      color: #c6c8d1;
      letter-spacing: 0;
      text-align: justify;
      height: 40px;
      line-height: 40px;
    }
    ul {
      display: flex;
      justify-content: space-around;
      width: 100%;
      li {
        display: flex;
        flex-direction: column;
        align-items: center;
        svg {
          width: 80px;
          height: 80px;
          margin-bottom: 14px;
        }
        span {
          font-family: PingFangSC-Regular;
          font-size: 24px;
          color: #515666;
          letter-spacing: 0;
          text-align: justify;
          height: 33px;
          line-height: 33px;
        }
      }
    }
    & > button {
      background: #fff;
      box-sizing: border-box;
      border-width: 0;
      width: 100%;
      height: 97px;
      margin-top: 44px;
      border-top: 1px solid #E1E2E6; /* no */
      padding: 26px 0;
      span {
        font-family: PingFangSC-Regular;
        font-size: 32px;
        color: #515666;
        letter-spacing: 0;
        text-align: justify;
        height: 45px;
        line-height: 45px;
      }
    }
  }
}

#share {
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 100vh;
  position: fixed;
  top: 0;
  img {
    width: 80%;
    display: block;
    margin: 40px auto 0;
  }
}
</style>


<style lang="less">
html {
  min-height: 100%;
  background: #fff;
  // -webkit-user-select:none;
  //   -moz-user-select:none;
  //   -ms-user-select:none;
  //   user-select:none;
}
* {
  margin: 0;
  padding: 0;
  font-family: 'PingFang SC', 'Helvetica Neue', 'STHeiti', 'Microsoft Yahei',
    '微软雅黑', 'Tahoma', 'Simsun', 'sans-serif';
  -webkit-text-size-adjust: none;
}
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100vw;
  min-height: 100vh;
  box-sizing: border-box;
  margin: 0 auto;
  //   display: flex;
  //   flex-direction: column;
  // overflow: hidden;
  // overflow-y: scroll;
  font-family: 'Helvetica Neue', Helvetica, Arial, 'PingFang SC',
    'Hiragino Sans GB', 'Heiti SC', 'Microsoft YaHei', 'WenQuanYi Micro Hei',
    sans-serif;
}
ul,
li {
  list-style: none; /* 去掉ul前面的符号 */
}
video {
  width: 100%;
}
.box img {
  width: 100%;
  display: block;
}
.richText {
  // 富文本样式
  p,
  img {
    display: block;
    width: 100%;
  }
}
.hide {
  display: none !important;
}
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
}
.ellipsis_1 {
  .ellipsis;
  white-space: nowrap;
  -webkit-line-clamp: 1;
  display: inline-block;
}

.ellipsis_2 {
  .ellipsis;
  -webkit-line-clamp: 2;
  word-break: break-all;
}

.ellipsis_3 {
  .ellipsis;
  -webkit-line-clamp: 3;
  word-break: break-all;
}

// .router-fade-enter-active,
// .router-fade-leave-active {
//   transition: opacity 0.3s;
// }
// .router-fade-enter,
// .router-fade-leave-active {
//   opacity: 0;
// }

// label > * { pointer-events: none; }
</style>
