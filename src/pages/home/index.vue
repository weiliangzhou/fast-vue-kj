<!--  -->
<template>
  <section id="home-container">
    <div style="width: 100%;" ref="homeContainer">
      <transition>
        <keep-alive>
          <router-view v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
      </transition>
      <transition>
        <router-view v-if="!$route.meta.keepAlive"></router-view>
      </transition>
    </div>
    <footer class="tabs-container">
      <template v-if="$route.name=='home'">
        <router-link to="/home/index" replace>
          <svg class="icon" aria-hidden="true">
            <use xlink:href='#iconhome_color'></use>
          </svg>
          <span>首页</span>
        </router-link>
        <router-link to="/home/personal#123" replace>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#iconmy"></use>
          </svg>
          <span>我的</span>
        </router-link>
      </template>
      <template v-else>
        <router-link to="/home/index" replace>
          <svg class="icon" aria-hidden="true">
            <use xlink:href='#iconhome'></use>
          </svg>
          <span>首页</span>
        </router-link>
        <router-link to="/home/personal#123" replace>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#iconmy1"></use>
          </svg>
          <span>我的</span>
        </router-link>
      </template>
    </footer>
  </section>
</template>
<script>
export default {
  data() {
    return {
      posX: 0,
      startX: 0
    }
  },
  computed: {},

  mounted() {
    // this.addOrRemoveEvent("add")
  },

  methods: {
    addOrRemoveEvent(type) {
      let homeContainer = this.$refs.homeContainer
      homeContainer[type + 'EventListener']('touchstart', this.ontouchstart)
      homeContainer[type + 'EventListener']('touchmove', this.ontouchmove)
      homeContainer[type + 'EventListener']('touchend', this.ontouchend)
    },
    ontouchstart(e) {
      this.startX = e.touches[0].pageX
      this.$refs.homeContainer.style.transform = `translateX(${this.posX}px)`
      this.$refs.homeContainer.style.WebkitTransform = `translateX(${this.posX}px)`
    },
    ontouchmove(e) {
      var moveEndX = e.changedTouches[0].pageX
      var X = moveEndX - this.startX
      this.posX = X
      this.$refs.homeContainer.style.transform = `translateX(${this.posX}px)`
      this.$refs.homeContainer.style.WebkitTransform = `translateX(${this.posX}px)`
    },
    ontouchend(e) {
      let routers = ['/home/index', '/home/personal']
      var router = this.$router
      let routerIndex = routers.indexOf(router.currentRoute.path)
      if (this.posX < -50 && routerIndex !== 2 && routerIndex > -1) {
        router.replace(routers[routerIndex + 1])
      } else if (this.posX > 50 && routerIndex > 0) {
        router.replace(routers[routerIndex - 1])
      }
      this.posX = 0
      this.$refs.homeContainer.style.transform = `unset`
      this.$refs.homeContainer.style.WebkitTransform = `unset`
    }
  },
  beforeDestroy() {
    // this.addOrRemoveEvent("remove")
  }
}
</script>

<style lang="less" scoped>
#home-container {
  width: 100vw;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  //   padding: 0 24px 0;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background: rgba(244, 244, 244, 1);
  align-items: center;
  position: relative;
  padding-bottom: 96px;
  min-height: 100vh;
  // height: calc(100vh - 94px);
  flex: 1;
}
.tabs-container {
  height: 96px;
  display: flex;
  justify-content: space-around;
  box-sizing: content-box;
  background: rgba(251, 251, 251, 1);
  width: 100vw;
  border-radius: 6px;
  overflow: hidden;
  position: fixed;
  bottom: 0;
  right: 0;
  padding-top: 6px;
  border-top: 1px solid #E5E5E5;/*no*/
  & > a {
    display: flex;
    flex-direction: column;
    flex: 1;
    justify-content: center;
    align-items: center;
    text-decoration: none;
    font-size: 22px;
    color: rgba(199, 199, 199, 1);
    line-height: 30px;
    letter-spacing: 0.53px;
    span {
      margin-top: 10px;
      font-family: PingFangSC-Regular;
      font-size: 24px;
      color: #C6C8D1;
      letter-spacing: 0;
      height: 33px;
      line-height: 33px;
    }
    svg {
      width: 40px; /* no */
      height: 40px; /* no */
    }
  }
  .router-link-active {
    text-decoration: none;
    color: rgb(220, 170, 95);
  }
}

.slide-down-enter,
.slide-down-leave-to {
  transform: translate3d(0, -100%, 0);
}
.slide-down-enter-to,
.slide-down-leave,
.slide-up-enter-to,
.slide-up-leave {
  transform: translate3d(0, 0, 0);
}
.slide-down-enter-active,
.slide-down-leave-active,
.slide-up-enter-active,
.slide-up-leave-active,
.fade-enter-active,
.fade-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.3s linear;
}
.slide-up-enter,
.slide-up-leave-to {
  transform: translate3d(0, px2rem(108), 0);
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-to,
.fade-leave {
  opacity: 1;
}
.slide-right-enter,
.slide-right-leave-to {
  transform: translate3d(-100%, 0, 0);
}
</style>
