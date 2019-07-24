<!-- 我的海报 -->
<template>
    <div id="poster">
        <canvas id="postreCtx">您的手机系统版本暂时不支持该功能</canvas>
        <qrcode class="hide" :value="qrLink" ref='qrcodeImg' type='img'></qrcode>
        <img :src="myPoster" alt="">
         <button class="back-button" v-if="showBackButton" @click="backAction"></button>
    </div>
</template>

<script>
import { Qrcode } from "vux";
import { getUserInfo, resolveImg } from "@/global"; // resolveTimeout, rejectTimeout
let defualtAvatar = 'https://img.mall.xc2018.com.cn/mall/upload/20190513/140756_99_gxee.png'
let background = 'https://img.mall.xc2018.com.cn/mall/upload/20190411/114249_31_kfo2.png'
let ref = 'https://img.mall.xc2018.com.cn/mall/upload/20190411/114339_44_3r1u.jpg'
export default {
    data() {
        return {
            qrLink: window.location.href,
            myPoster: "",
            showBackButton: false
        };
    },

    components: {
        Qrcode
    },

    computed: {},

    mounted() {
        // let goodsId = http://xcx.wegoo.cn/offline-detail?productId=${goodsId}productType=${productType}
        let { productId = "", productType = "", type = "", goodsId = "", goodsSn = "", topLine = 0, posterImg = "" } = {
            ...this.$route.params,
            ...this.$route.query
        };
        let userInfo = getUserInfo();
        let uid = "";
        if (userInfo.uid) {
            uid = userInfo.uid;
        }
        
        if (type === "agent-add") {
            let name = userInfo.nickname;
            let goodsIdRes = `${location.origin}/login?refName=${name}&ref=${uid}`;
            this.qrLink = goodsIdRes;
            this.canvasFn(1);
            this.showBackButton = true;
        } else {
            let origin = "http://tmall.xc2018.com.cn";
            if (location.origin.indexOf("//sales")!==-1) {
                origin = "https://mall.xc2018.com.cn"
            }
            let routePath = productType == 2 ? "online-detail": "offline-detail"
            let goodsSnObj = {
                "9q49cdwswt4bpqptnl07404h": `${origin}/dredge?ref=${uid}`,
                "default": `${origin}/${routePath}?productId=${productId}&productType=${productType}&ref=${uid}&goodsId=${goodsId}`,
                "dongyao_quanyibao": `${origin}/equityDetail?id=${goodsId}&ref=${uid}`,
                "douyin_quanyibao": `${origin}/equityDetail?id=${goodsId}&ref=${uid}`,
                'daqi_quanyibao': `${origin}/equityDetail?id=${goodsId}&ref=${uid}`,
            }
            this.qrLink = goodsSnObj[goodsSn] || goodsSnObj['default'];
            if (goodsSn == "9q49cdwswt4bpqptnl07404h" || goodsSn == 'dongyao_quanyibao') {
                this.canvasFn2(Number(!!topLine), "https://img.mall.xc2018.com.cn/mall/upload/20190419/151831_60_gf2v.jpg")
            } else {
                if (!posterImg) {
                    posterImg = "http://chuang-saas.oss-cn-hangzhou.aliyuncs.com/upload/image/20190318/4a3a8019a8124bdf8179bb1eea3ce701.png"
                }
                posterImg ? this.canvasFn1(Number(!!topLine), posterImg) : this.canvasFn(Number(!!topLine), posterImg);
            }
        }
    },
    methods: {
        // 邀请海报
        canvasFn(n = 0, bg = "") {
            let userInfo = getUserInfo();
            let nickName = userInfo.nickname || userInfo.username || "没有名称";
            let avatar = userInfo.avatar;
            let canvas = document.getElementById("postreCtx");
            let ctx = canvas.getContext("2d");
            let nWidth = 570;
            let nHeight = 970;
            canvas.width = nWidth;
            canvas.height = nHeight;
            let backgroundTemp = [background, ref][n];
            Promise.all([resolveImg(bg || backgroundTemp), resolveImg(avatar || defualtAvatar)])
            .then(([bgimg, headerimg]) => {
                this.myDrawImage({img: bgimg, type: "img", width: bgimg.width, height: bgimg.height}, ctx)
                this.myDrawText({text: nickName, x: nWidth / 2, font: "28px Arial", y: 162, type: "text"}, ctx)
                let r = 50;
                this.myDrawImage({img: headerimg, x: nWidth/2- r, y: 30, type: "cirle-img", width: 2*r, height: 2*r}, ctx)
                return resolveImg(this.$refs.qrcodeImg.imgData).then(qrcode => {
                    let length = 140;
                    this.myDrawImage({img: qrcode, type: "qrcode-img", x: nWidth / 2 - length - 40, y: nHeight - length - 95, width: length, height: length}, ctx)
                }).then(res => {
                    let _imgSrc = canvas.toDataURL("image/png", 1);
                    canvas.style.display = "none";
                    this.myPoster = _imgSrc;
                })
            })
            .catch(err => {
                console.log(err.message, 121, err);
            });
        },
        // 产品海报
        canvasFn1(n = 0, bg = "") {
            let userInfo = getUserInfo();
            let nickName = userInfo.nickname || userInfo.username || "没有名称";
            let avatar = userInfo.avatar;
            let canvas = document.getElementById("postreCtx");
            let ctx = canvas.getContext("2d");
            let nWidth = 570;
            let nHeight = 970;
            canvas.width = nWidth;
            canvas.height = nHeight;
            let backgroundTemp = [background, ref][n];
            Promise.all([resolveImg(bg || backgroundTemp), resolveImg(avatar || defualtAvatar)])
            .then(([bgimg, headerimg]) => {
                this.myDrawImage({img: bgimg, type: "img", width: bgimg.width, height: bgimg.height}, ctx)
                this.myDrawText({text: nickName, x: nWidth / 2 - 145, font: "28px Arial", y: 790, type: "text"}, ctx)
                let r = 50;
                this.myDrawImage({img: headerimg, x: nWidth/2- 145 - r, y: nHeight * 0.66, type: "cirle-img", width: 2*r, height: 2*r}, ctx)
                return resolveImg(this.$refs.qrcodeImg.imgData).then(qrcode => {
                    let length = 160;
                    this.myDrawImage({img: qrcode, type: "qrcode-img", x: nWidth - length - 60, y: nHeight - length - 145, width: length, height: length}, ctx)
                }).then(res => {
                    let _imgSrc = canvas.toDataURL("image/png", 1);
                    canvas.style.display = "none";
                    this.myPoster = _imgSrc;
                })
            })
            .catch(err => {
                console.log(err.message, 121, err);
            });
        },
        // 399
        canvasFn2(n = 0, bg = "") {
            let userInfo = getUserInfo();
            let nickName = userInfo.nickname || userInfo.username || "没有名称";
            let avatar = userInfo.avatar;
            let canvas = document.getElementById("postreCtx");
            let ctx = canvas.getContext("2d");
            let nWidth = 1080;
            let nHeight = 1920;
            canvas.width = nWidth;
            canvas.height = nHeight;
            let backgroundTemp = [background, ref][n];
            Promise.all([resolveImg(bg || backgroundTemp), resolveImg(avatar || defualtAvatar)])
            .then(([bgimg, headerimg]) => {
                this.myDrawImage({img: bgimg, type: "img", width: bgimg.width, height: bgimg.height}, ctx)
                this.myDrawText({text: nickName, x: nWidth / 4, y: nHeight - 70, type: "text"}, ctx)
                let r = 100;
                this.myDrawImage({img: headerimg, x: nWidth/4 - r, y: nHeight -2*r -160, type: "cirle-img", width: 2*r, height: 2*r}, ctx)
                 resolveImg(this.$refs.qrcodeImg.imgData).then(qrcode => {
                    let length = 270;
                    this.myDrawImage({img: qrcode, type: "qrcode-img", x: nWidth*3/4 - length/2, y: nHeight - length - 70, width: length, height: length}, ctx)
                    let _imgSrc = canvas.toDataURL("image/png", 1);
                    canvas.style.display = "none";
                    this.myPoster = _imgSrc;
                 })
            })
            .catch(err => {
                console.log(err.message, 121, err);
            });
        },
        /*
            { img: null, url: "", x: 0, y: 0, width: 0, height: 0, type: "cirle-img" | "qrcode", shadowBlur: 0, shadowColor: "#000" }
        */
        myDrawImage(options, ctx) { // cirle-img, qrcode-img, img
            let { img = null, x = 0, y = 0, width = 0, height = 0, type = "cirle-img", shadowBlur = 0, shadowColor = "#000" } = options
            ctx.save();
            ctx.beginPath();
            if (type === "cirle-img") {
                Object.assign(ctx, { shadowColor, shadowBlur, })
                if (width == height) {
                    ctx.arc(x + width/2, y + height/2, width/2, 0, 2 * Math.PI);
                    ctx.closePath();
                    ctx.clip();
                }
            }
            let padding = 0
            if (type === "qrcode-img") {
                padding = 10
                ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
                ctx.strokeStyle = "#fff";
                ctx.fillRect(x - padding, y - padding, width + 2 * padding, height + 2 * padding);
                ctx.closePath();
            }
            ctx.drawImage(img, x, y, width, height);
            ctx.restore();
            ctx.shadowBlur = 0;
        },
          /*
            { x: 0, y: 0, width: 0, height: 0, type: "text", shadowBlur: 0, shadowColor: "#000" }
        */
        myDrawText(options, ctx) { // text
            let { x = 0, y = 0, textAlign = "center", font, type = "text", fillStyle = "#000", text = "" } = options
            if (type == "text") {
                ctx.textAlign = "center";
                ctx.font = "48px Arial";
                ctx.fillStyle = "#000";
                Object.assign(ctx, { textAlign, font, fillStyle })
                ctx.fillText(text, x, y);
            }
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
  padding: 0 32px;
  box-sizing: border-box;
  canvas {
    position: fixed;
    top: -100000px; /* no */
    right: -100000px;/* no */
  }
  img {
    display: block;
    width: 90%;
    box-sizing: border-box;
    border-radius: 12px;
  }
}
.back-button {
    height: 76px;
    width: 153px;
    border: none;
    font-size: 28px;
    color: rgba(255,255,255,1);
    line-height: 30px;
    letter-spacing: 0.34px;
    padding: 0 20px;
    border-radius: 16px;
    overflow: hidden;
    position: fixed;
    left: 0;
    bottom: 200px;
    background: url('https://img.mall.xc2018.com.cn/mall/upload/20190516/152726_18_diyh.png') no-repeat center / cover;
}
</style>
