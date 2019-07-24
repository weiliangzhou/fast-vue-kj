<!-- 我的海报 -->
<template>
  <transition>
    <section ref="advertContainer" v-show="adIsShow" class="dialogs">
      <div class="referrer-container">
          <span class="timer">{{count}}s</span>
        <img @click="jumpPosterUrl" :src="posterPicture" alt="">
        <div class="button-group">
          <button @click="stopCount" class="close-button"></button>
        </div>
      </div>
    </section>
  </transition>
</template>

<script>
import { getSalePoster } from "@/api";
export default {
  data() {
    return {
      adIsShow: false,
      count: "",
      timer: null,
      posterPicture: "",
      posterUrl: ''
    };
  },
  computed: {},
  methods: {
    preventDefaultEvent(e) {
        e = e || window.event;
        e.preventDefault? e.preventDefault() : e.returnValue = false
        if (e.stopPropagation) {
            e.stopPropagation();
            e.stopImmediatePropagation()
        } else {
            e.cancelBubble = true;
        }
    },
    triggerReferrerStatus(flag) {
        let lastTime = localStorage.advertLastShowTime || 0
        return getSalePoster()
          .then(res => {
            if (Date.now()-lastTime > 24*60*60*1000) {
              localStorage.advertLastShowTime = Date.now();
              this.adIsShow = true;
              this.posterPicture = res.posterPicture;
              this.posterUrl = res.posterUrl;
              this.startCount()
            }
            return res;
          })
          .catch(err => {
            // Toast(err)
          });
    },
    jumpPosterUrl() {
      if (this.posterUrl) {
        location.href = this.posterUrl
      }
    },
    stopCount() {
        let advert = this.$refs.advertContainer
        advert.removeEventListener('mousewheel', this.preventDefaultEvent, {passive: false})
        advert.removeEventListener('touchmove', this.preventDefaultEvent, {passive: false})
        this.adIsShow = false;
        clearInterval(this.timer);
        this.timer = null;
    },
    startCount() {
      let total = 9;
      let advert = this.$refs.advertContainer
      advert.addEventListener('mousewheel', this.preventDefaultEvent, {passive: false})
      advert.addEventListener('touchmove', this.preventDefaultEvent, {passive: false})
      this.timer = setInterval(() => {
        --total;
        if (total <= 0) {
          this.stopCount();
        }
        this.count = total;
      }, 1000);
    }
  },
  beforeDestroy() {
      this.stopCount()
  }
};
</script>
<style lang='less' scoped>
.dialogs {
  position: absolute;
  z-index: 10;
  top: 0;
  right: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  background: rgba(0, 0, 0, 0.45);
  .referrer-container {
    display: flex;
    flex-direction: column;
    border-radius: 12px;
    align-items: center;
    box-sizing: border-box;
    position: relative;
    img {
      width: 600px;
      height: 850px;
      border-radius: 12px;
      background: rgba(0, 0, 0, 0.3);
    }
    .timer {
        position: absolute;
        top: 26px;
        right: 18px;
        padding: 6px 24px;
        color: white;
        border-radius: 6px;
        overflow: hidden;
        background: rgba(0,0,0,0.3);
        height: 37px;
        opacity: 1;
        font-size: 26px;
        color: rgba(255,255,255,1);
        line-height: 37px;
        letter-spacing: 0.63px;
    }
    // & > div {
    //     display: flex;
    //     flex-direction: row;
    //     span {
    //     font-size: 30px;
    //     line-height: 32px;
    //     font-weight: 400;
    //     color: RGB(152, 152, 152);
    //     margin: 24px 0 54px;
    //     }
    // }
    & > button {
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
      margin-top: 44px;
    }

    .button-group {
      position: absolute;
      bottom: -100px;
      background: rgba(0, 0, 0, 0);
      &:after {
          display: inline-block;
          position: absolute;
          content: " ";
          height: 100px;
          width: 2px;
          margin: 0 auto;
          background: #fff;
          right: 50%;
          top: -100px;
      }
      .back-button {
        position: relative;
        height: 45px;
        opacity: 1;
        font-size: 32px;
        font-family: PingFangSC;
        color: rgba(255, 255, 255, 1);
        line-height: 45px;
        letter-spacing: 0.94px;
        background: rgba(0, 0, 0, 0);
        border: none;
        padding: 10px 30px;
        box-sizing: content-box;
        &:after {
          display: inline-block;
          content: " ";
          height: 22px;
          width: 22px;
          border-width: 2px 2px 0 0;
          border-color: rgba(255, 255, 255, 1);
          border-style: solid;
          transform: matrix(
            -0.71,
            -0.71,
            0.71,
            -0.71,
            0,
            0
          ); // rotate(-135deg);
          position: absolute;
          top: 50%;
          left: -25px;
          margin-top: -12px;
        }
      }
      .close-button {
        width: 46px;
        height: 46px;
        box-sizing: content-box;
        position: relative;
        background: rgba(0, 0, 0, 0);
        border: 3px solid #fff;
        overflow: hidden;
        border-radius: 50%;
        padding: 6px;
        &:after {
          display: inline-block;
          position: absolute;
          content: " ";
          height: 4px;
          width: 70%;
          background: #fff;
          border-radius: 12px;
          top: 30px;
          // right: -50%;
          right: 0;
          margin: 0 15%;
          transform: rotate(45deg);
        }

        &:before {
          display: inline-block;
          position: absolute;
          content: " ";
          height: 4px;
          width: 70%;
          background: #fff;
          border-radius: 12px;
          top: 30px;
          // right: -50%;
          right: 0;
          margin: 0 15%;
          transform: rotate(-45deg);
        }
      }
    }
  }
}
</style>
