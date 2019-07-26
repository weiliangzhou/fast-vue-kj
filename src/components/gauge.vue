<!--  -->
<template>
  <canvas ref="gauge">
    <slot />
  </canvas>
</template>

<script>
export default {
  name: 'gauge',
  data() {
    return {
      lineWidth: 2,
      nowrange: 0.4,
      range: 0.4,
      nowdata: 0,
      sp: 0, // 周期偏移量
      data: 20 // 数据量
    }
  },
  props: {
          radius: {
            type: Number,
            default: 80
          }
  },
  components: {},

  computed: {
    cR() {
      return this.radius - this.radius * 0.08 * this.lineWidth
    }
  },

  mounted() {
    var canvas = this.$refs.gauge
    var ctx = canvas.getContext('2d')
    this.ctx = ctx
    canvas.width = this.radius * 2
    canvas.height = this.radius * 2
    // 大半径
    ctx.beginPath()
    ctx.lineWidth = this.lineWidth

    // 圆动画初始参数
    var arcStack = [] // 圆栈
    var bR = this.radius - this.radius * 0.08 * 0.8 * this.lineWidth
    var soffset = -(Math.PI / 2) // 圆动画起始位置
    // circleLock = true // 起始动画锁
    // 获取圆动画轨迹点集
    for (
      var i = soffset;
      i < soffset + 2 * Math.PI;
      i += 1 / (this.radius * 0.08 * 0.8 * Math.PI)
    ) {
      arcStack.push([
        this.radius + bR * Math.cos(i),
        this.radius + bR * Math.sin(i)
      ])
    }
    // 圆起始点
    var cStartPoint = arcStack.shift()
    ctx.strokeStyle = '#1c86d1'
    ctx.moveTo(cStartPoint[0], cStartPoint[1])
    // 开始渲染
    this.updateCanvas()
  },
  beforeDestroy() {
    window.cancelAnimationFrame(this.animation)
    this.animation = null
    this.ctx = null
  },
  methods: {
    drawSine() {
      var ctx = this.ctx
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
    },
    drawText() {
      var ctx = this.ctx
      ctx.globalCompositeOperation = 'source-over'
      var size = 0.4 * this.cR
      ctx.font = 'bold ' + size + 'px Microsoft Yahei'
      var txt = (this.nowdata.toFixed(2) * 100).toFixed(0) + '%'
      ctx.fillStyle = '#f6b71e'
      ctx.textAlign = 'center'
      ctx.fillText(
        txt,
        this.radius + this.radius * 0.04,
        this.radius + this.radius * 0.16
      )
    },
    // 最外面淡黄色圈
    drawCircle() {
      var ctx = this.ctx
      ctx.beginPath()
      ctx.lineWidth = (this.radius * 3) / 25
      ctx.strokeStyle = '#fff89d'
      ctx.arc(
        this.radius,
        this.radius,
        this.cR + (this.radius * 7) / 125,
        0,
        2 * Math.PI
      )
      ctx.stroke()
      ctx.restore()
    },
    // 灰色圆圈
    grayCircle() {
      var ctx = this.ctx
      ctx.beginPath()
      ctx.lineWidth = this.radius * 0.08
      ctx.strokeStyle = '#eaeaea'
      ctx.arc(
        this.radius,
        this.radius,
        this.cR - this.radius * 0.04,
        0,
        2 * Math.PI
      )
      ctx.stroke()
      ctx.restore()
      ctx.beginPath()
    },
    // 橘黄色进度圈
    orangeCircle() {
      var ctx = this.ctx
      ctx.beginPath()
      ctx.strokeStyle = '#fbdb32'
      // 使用这个使圆环两端是圆弧形状
      ctx.lineCap = 'round'
      ctx.arc(
        this.radius,
        this.radius,
        this.cR - this.radius * 0.04,
        0 * (Math.PI / 180.0) - Math.PI / 2,
        this.nowdata * 360 * (Math.PI / 180.0) - Math.PI / 2
      )
      ctx.stroke()
      ctx.save()
    },
    // 裁剪中间水圈
    clipCircle() {
      var ctx = this.ctx
      ctx.beginPath()
      ctx.arc(
        this.radius,
        this.radius,
        this.cR - this.radius * 0.08,
        0,
        2 * Math.PI,
        false
      )
      ctx.clip()
    },
    updateCanvas() {
      var ctx = this.ctx
      var waveupsp = 0.006 // 水波上涨速度
      var range = 0.4
      var data = ~~this.data / 100
      var nowdata = this.nowdata
      ctx.clearRect(0, 0, this.radius * 2, this.radius * 2)
      // 最外面淡黄色圈
      this.drawCircle()
      // 灰色圆圈
      this.grayCircle()
      // 橘黄色进度圈
      this.orangeCircle()
      // 裁剪中间水圈
      this.clipCircle()
      // 控制波幅
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
      this.drawText()
      this.animation = requestAnimationFrame(this.updateCanvas)
      // setTimeout(()=>window.cancelAnimationFrame(id), 3000)
    }
  }
}
</script>
<style lang='less' scoped>
canvas {
   pointer-events: none;
}
</style>
