<!-- 我的海报 -->
<template>
  <div id="poster">
    <canvas id="postreCtx">您的手机系统版本暂时不支持该功能</canvas>
    <img :src="myPoster" alt="">
  </div>
</template>

<script>
import { Qrcode } from "vux";
import { getUserInfo, resolveImg } from "@/global"; // resolveTimeout, rejectTimeout
let background =
  "http://img.mall.xc2018.com.cn/mall/upload/20190411/123727_67_4b52.jpg";

export default {
  data() {
    return {
      qrLink: window.location.href,
      myPoster: ""
    };
  },

  components: {
    Qrcode
  },
  mounted() {
    this.canvasFn();
  },
  methods: {
    canvasFn(n = 0) {
      let userInfo = getUserInfo();
      let nickName = userInfo.nickname || "没有名称";
      let userName = userInfo.username;
      let levelName = userInfo.levelName;
      let createdAt = "2019年"; //  userInfo.createdAt ||
      // let idCardNum = userInfo.idCardNum;
      createdAt = createdAt.split(" ")[0];
      let canvas = document.getElementById("postreCtx");
      let ctx = canvas.getContext("2d");
      let nWidth = 1182;
      let nHeight = 1672;

      canvas.width = nWidth;
      canvas.height = nHeight;
      resolveImg(background)
        .then(bg => {
          ctx.drawImage(bg, 0, 0, nWidth, nHeight);
          ctx.save();
          // 头像下面的文字
          ctx.textAlign = "center";
          ctx.font = "28px Arial";
          ctx.fillStyle = "#000";
          ctx.fillText(nickName, nWidth / 2 - 140, 730, nWidth);
          ctx.textAlign = "center";
          ctx.font = "bold 80px Arial";
          ctx.fillText(levelName, nWidth / 2 - 20, 880, nWidth);
          // 画头像
          ctx.textAlign = "left";
          ctx.font = "normal 30px Arial";
          ctx.fillText(userName, nWidth / 2 + 100, 1350, nWidth);
          // ctx.fillText(idCardNum, nWidth / 2 + 100, 1405, nWidth);
          ctx.fillText(createdAt, nWidth / 2 + 100, 1405, nWidth);

          let _imgSrc = canvas.toDataURL("image/png", 1);
          canvas.style.display = "none";
          this.myPoster = _imgSrc;
        })
        .catch(err => {
          console.log(err.message, 121, err);
        });
    }
  }
};
</script>
<style lang='less' scoped>
#poster {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 0 32px;
  box-sizing: border-box;
  canvas {
    position: fixed;
    top: -1000px;
    right: -1000px;
  }
  & > img {
    display: block;
    width: 100%;
    box-sizing: border-box;
    border-radius: 12px;
  }
}
</style>
