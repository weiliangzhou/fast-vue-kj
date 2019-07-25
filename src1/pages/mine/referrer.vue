<!-- 我的海报 -->
<template>
  <transition
    enter-active-class="animated zoomIn"
    leave-active-class="animated zoomOut"
  >
    <div
      class="superiors-cotainer"
      v-if="superiorsIsShow"
    >

      <section
        class="my-superiors"
        v-if="superiorsIsShow"
      >
        <div>
          <ul class="header-container">
            <li
              class="test-tab"
              v-for="item in typesOption"
              :key="item.id"
            >
              <input
                type="radio"
                :id="item.id"
                name="test-radio"
                :value="item.value"
                v-model="referrerType"
              >
              <label :for="item.id">{{item.label}}</label>
            </li>
          </ul>
          <div
            v-if="curentReferrerInfo.cellPhone"
            class="referrer-container"
          >
            <img
              :src="curentReferrerInfo.avatar || 'https://img.mall.xc2018.com.cn/mall/upload/20190513/140756_99_gxee.png'"
              alt=""
            >
            <h6>{{curentReferrerInfo.nickName}}</h6>
            <span>{{curentReferrerInfo.cellPhone}}</span>
            <div style="flex:1"></div>
            <button @click="superiorsIsShow=false">我知道了</button>
          </div>
          <div
            v-else
            class="referrer-container"
          >
            <div style="flex:1"></div><span style="font-size: 26px;line-height: 28px;color: #000;">暂无数据</span>
            <div style="flex:1"></div><button @click="superiorsIsShow=false">我知道了</button>
          </div>
        </div>
      </section>
    </div>
  </transition>
</template>

<script>
import { getMyReferrer } from "@/api";
export default {
  data() {
    return {
      typesOption: [
        // 我的供货商两个tab选项
        { label: "供应商", id: 1, value: "saleUserInfo" },
        { label: "我的推广人", id: 2, value: "referrerInfo" }
      ],
      superiorsIsShow: false, // 我的上级弹框是否显示
      saleUser: {
        // 上级/引荐人等信息对象
        isLoaded: false,
        referrerInfo: {},
        saleUserInfo: {}
      },
      referrerType: "saleUserInfo" // 我的供货商显示哪个tab对应的v-model
    };
  },
  computed: {
    curentReferrerInfo() {
      return this.saleUser[this.referrerType] || this.saleUserInfo;
    }
  },
  methods: {
    triggerReferrerStatus(flag) {
      if (this.saleUser.isLoaded) {
        if (flag == undefined) {
          this.superiorsIsShow = !this.superiorsIsShow;
        } else {
          this.superiorsIsShow = flag;
        }
      } else {
        getMyReferrer()
          .then(res => {
            Object.assign(this.saleUser, res, { isLoaded: true });
            this.superiorsIsShow = true;
          })
          .catch(err => {
            // Toast(err)
          });
      }
    }
  }
};
</script>
<style lang='less' scoped>
.superiors-cotainer {
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

  .my-superiors {
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    // background: rgba(0, 0, 0, 0.45);

    & > div {
      display: flex;
      flex-direction: column;
      background: #fff;
      border-radius: 12px;
      overflow: hidden;
      align-items: center;
      width: 100%;
      box-sizing: border-box;
      padding: 30px 34px 66px;
      .header-container {
        display: flex;
        justify-content: space-around;
        background: rgba(255, 255, 255, 1);
        // border-bottom: 2px solid rgb(218, 216, 216);
        padding: 20px 32px 10px;
        box-sizing: border-box;
        height: 90px;
        width: 100%;
        & > li {
          display: inline-block;
          position: relative;
          width: 50%;
          label {
            display: inline-block;
            text-align: center;
            font-size: 32px;
            line-height: 34px;
            box-sizing: border-box;
            opacity: 1;
            font-size: 32px;
            font-weight: 400;
            width: 100%;
            color: rgba(101, 101, 101, 1);
          }
        }
        input {
          position: absolute;
          top: 0;
          right: 0;
          box-sizing: border-box;
          width: 100%;
          height: 100%;
          border-width: 0;
          opacity: 0;
          &:checked ~ label {
            position: relative;
            display: inline-block;
            text-align: center;
            font-size: 32px;
            line-height: 34px;
            box-sizing: border-box;
            opacity: 1;
            font-size: 32px;
            font-weight: 600;
            color: rgba(50, 50, 50, 1);
            &:after {
              width: 52px;
              content: "";
              height: 10px;
              bottom: -18px;
              background: #d7b686;
              border-radius: 10px;
              display: block;
              position: absolute;
              right: 50%;
              transform: translate(50%, 50%); /* 使用css3的transform来实现 */
            }
          }
        }
      }
    }
    .referrer-container {
      display: flex;
      flex-direction: column;
      overflow: hidden;
      align-items: center;
      width: 100%;
      box-sizing: border-box;
      height: 6.2rem;
      h5 {
        font-size: 32px;
        line-height: 34px;
        color: RGB(199, 0, 10);
        font-weight: 700;
      }
      img {
        width: 156px;
        height: 156px;
        border-radius: 50%;
        background: rgba(0, 0, 0, 0.3);
        margin: 52px 0 36px;
      }
      h6 {
        color: RGB(54, 54, 54);
        font-size: 34px;
        line-height: 36px;
        font-weight: 700;
      }
      span {
        font-size: 30px;
        line-height: 32px;
        font-weight: 400;
        color: RGB(152, 152, 152);
        margin: 24px 0 54px;
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
}
.top-button-group {
  position: absolute;
  top: 32px;
  left: 32px;
  button {
    display: block;
    border-radius: 6px;
    border-width: 0;
    background: transparent;
    border: 1px solid transparent; // 解决安卓字体不居中问题
    box-sizing: border-box;
    font-size: 28px;
    font-family: PingFangSC;
    color: rgba(170, 128, 58, 1);
    line-height: 40px;
    letter-spacing: 0.45px;
  }
}
</style>
