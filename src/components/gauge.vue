<!--   @touchstart.prevent="onTouchstart" -->
<template>
<div :style="`width: ${this.radius*2}px; height: ${this.radius*2}px;background-image: url(${backgroundImg});`" ref="container">
  <canvas ref="gauge">
    <slot />
  </canvas>
</div>

</template>

<script>
import red from './red.png'
import blue from './blue.png'
import green from './green.png'
import { resolveImg } from "@/global"
export default {
  name: 'gauge',
  data() {
    return {
      lineWidth: 0,
      nowrange: 0.4,
      range: 0.4,
      nowdata: 0,
      sp: 0, // 周期偏移量
      imgs: []
    }
  },
  props: {
          radius: {
            type: Number,
            default: 80
          },
          timeDown: {
            type: Number,
            default: 0
          },
  },
  components: {},
  
  computed: {
    data() {
      return this.timeDown/(24*36)
    },
    cR() {
      return this.radius - this.radius * 0.08 * this.lineWidth
    },
    backgroundImg() {
    var imgIndex = 0
    if(this.timeDown>3600*12) {
      imgIndex = 2;
    } else if (this.timeDown > 3600) {
      imgIndex = 1;
    } else {
      imgIndex = 0;
    }
    return  [red,blue, green][imgIndex]
    }
  },

  mounted() {
    var canvas = this.$refs.gauge
    var ctx = canvas.getContext('2d')
    this.ctx = ctx
    canvas.width = this.radius * 2
    canvas.height = this.radius * 2

    let width = canvas.width,height=canvas.height;
    if (window.devicePixelRatio) {
      canvas.style.width = this.radius * 2 + "px";
      canvas.style.height = this.radius * 2 + "px";
      canvas.height = height * window.devicePixelRatio;
      canvas.width = width * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    this.drawTask()
  },
  beforeDestroy() {
    window.cancelAnimationFrame(this.animation)
    this.animation = null
    this.ctx = null
  },
  methods: {
    drawTask() {// 控制帧率
      var fps = 60;
      var now;
      var then = Date.now();
      var interval = 1000/fps;
      var delta;
      let tick = ()=>{
      　　this.animation=requestAnimationFrame(tick);
      　　now = Date.now();
      　　delta = now - then;
      　　if (delta > interval) {
      　　　　// 这里不能简单then=now，否则还会出现上边简单做法的细微时间差问题。例如fps=10，每帧100ms，而现在每16ms（60fps）执行一次draw。16*7=112>100，需要7次才实际绘制一次。这个情况下，实际10帧需要112*10=1120ms>1000ms才绘制完成。
      　　　　then = now - (delta % interval);
            this.updateCanvas(); // ... Code for Drawing the Frame ...
      　　}
      }
      tick();
    },
    drawSine() {
      var ctx = this.ctx
      ctx.globalAlpha =0.6;
      var xoffset = this.radius * 0.08 * 0.8 * this.lineWidth // x 轴偏移量
      var axisLength = 2 * this.radius - xoffset * 2 // Sin 图形长度
      var unit = axisLength / 9 // 波浪宽
      var nowdata = this.nowdata
      ctx.beginPath()
      ctx.save()
      var Stack = [] // 记录起始点和终点坐标
      for (var i = xoffset; i <= xoffset + axisLength; i += 20 / axisLength) {
        var x = this.sp + (xoffset + i) / unit
        var y = Math.sin(x) * this.nowrange
        var dx = i
        var dy =
          2 * this.cR * (1 - nowdata) + (this.radius - this.cR) - unit * y
        ctx.lineTo(dx, dy)
        Stack.push([dx, dy])
      }
      // 获取初始点和结束点
      var startP = Stack[0]
      ctx.lineTo(xoffset + axisLength, this.radius * 2)
      ctx.lineTo(xoffset, this.radius * 2)
      ctx.lineTo(startP[0], startP[1])
      ctx.fillStyle = '#fbec99'
      ctx.fill()
      ctx.restore()
      ctx.globalAlpha =1;
    },
    updateCanvas() {
      var ctx = this.ctx
      var waveupsp = 0.006 // 水波上涨速度
      var range = 0.4
      var data = ~~this.data / 100
      var nowdata = this.nowdata
      ctx.clearRect(0, 0, this.radius * 2, this.radius * 2)
      var nowrange = this.nowrange
      if (data >= 0.85) {
        if (nowrange > range / 4) {
          var t = range * 0.01
          nowrange -= t
        }
      } else if (data <= 0.1) {
        if (nowrange < range * 1.5) {
          var t = range * 0.01
          nowrange += t
        }
      } else {
        if (nowrange <= range) {
          var t = range * 0.01
          nowrange += t
        }
        if (nowrange >= range) {
          var t = range * 0.01
          nowrange -= t
        }
      }
      if (data - nowdata > 0) {
        nowdata += waveupsp
      }
      if (data - nowdata < 0) {
        nowdata -= waveupsp
      }
      this.nowdata = nowdata
      this.nowrange = nowrange
      this.sp += 0.07
      // 开始水波动画
      this.drawSine()
      // 写字
      //this.drawText()
      //this.animation = requestAnimationFrame(this.updateCanvas)
      // setTimeout(()=>window.cancelAnimationFrame(id), 3000)
    }
  }
}
</script>
<style lang='less' scoped>
div {

  background-repeat: no-repeat;
  background-size: 100% 100%;
  border-radius: 50%;
  overflow: hidden;
 // border: 8px solid #eaeaea; /* no */
  box-sizing: border-box;
}
canvas {
   pointer-events: none;
}
</style>
