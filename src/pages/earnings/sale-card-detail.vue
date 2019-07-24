<!--  -->
<template>
  <section>
      <div class="top-container">
         <p><span>{{cardNum}}</span><span>张</span></p>
      </div>
      <div class="middle">
            <ul>
              <li><label for="">收卡人姓名</label><span style="flex: 1"></span><span>{{buyerRealName}}</span></li>
              <li><label for="">收卡人等级</label><span style="flex: 1"></span><span>{{levelName}}</span></li>
              <li><label for="">收卡人手机号</label><span style="flex: 1"></span><span>{{buyerCellPhone}}</span></li>
              <li><label for="">售卡明细</label><span style="flex: 1"></span><span>销售卡:{{vCardNum || 0}} &nbsp;&nbsp;奖励卡:{{jCardNum || 0}} &nbsp;&nbsp;赠送卡:{{zCardNum || 0}}</span></li>
              <li><label for="">创建时间</label><span style="flex: 1"></span><span>{{createdAt}}</span></li>
          </ul>
      </div>
      <div class="bottom">
        <h5>打款截图（点击图片放大查看）</h5>
        <img @click="showImg" :src="remittanceImg" alt="">
      </div>
  </section>
</template>
<script>
import { Toast, isWX } from "@/global"; // resolveTimeout, rejectTimeout, getObject,
import wx from 'weixin-js-sdk'
import { getCardOrderDetail } from '@/api'
export default {
  data() {
    return {
        "vCardNum": 0,
        "buyUid": 0,
        "remittanceImg": "",
        "buyerCellPhone": "",
        "createdAt": "",
        "cardNum": 0,
        "buyerLevelName": "",
        "levelName": "",
        "buyerRealName": "",
        "zCardNum": 0,
        "realName": "",
        "jCardNum": 0,
        "phone": ""
    };
  },
  computed: {},

  mounted() {
   
  },

  methods: {
    showImg() {
        let imgs = this.remittanceImg
      if (isWX) {
          imgs = (imgs || '').split(',').filter(url => url)
            if (imgs.length) {
                wx.previewImage({"urls": imgs, "current": imgs[0]});
          }
      } else {
        Toast("只能在微信中预览")
      }
    }
  },
  beforeRouteEnter(to, from, next) {
      let { id } = to.query;
      if (id) {
        getCardOrderDetail(id).then(res => {
            next(vm => {
                Object.assign(vm, res)
            })
        })
      }  
  }
};
</script>

<style lang="less" scoped>
section {
  width: 100vw;
  box-sizing: border-box;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background: #F7F7F7;
  padding-bottom: 96px;
  min-height: 100vh;
  // height: calc(100vh - 94px);
  flex: 1;
}
div[class="top-container"] {
    position: relative;
    width:100%;
    height:302px;
    background:url('https://img.mall.xc2018.com.cn/mall/upload/20190530/144121_16_usj2.png')  no-repeat center / cover;
    box-shadow:0px 4px 15px 0px rgba(229,229,229,0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    p {
        &>span:first-of-type {
            height:140px;
            font-size:120px;
            font-family:DINAlternate-Bold;
            font-weight:bold;
            color:rgba(255,255,255,1);
            line-height:140px;
            margin-right: 15px;
        }
        &>span:last-of-type {
            height:45px;
            font-size:32px;
            font-family:PingFangSC-Semibold;
            font-weight:600;
            color:rgba(255,255,255,1);
            line-height:45px;
        }
    }
}

div[class='middle'] {
    margin: 20px 0;
    background: #fff;
    ul {
        li {
            padding: 32px 24px;
            display: flex;
            align-items: center;
            label {
                max-width:180px;
                height:40px;
                font-size:28px;
                font-family:PingFangSC-Regular;
                font-weight:400;
                color:rgba(54,54,54,1);
                line-height:40px;
            }
            span {
                height:40px;
                font-size:28px;
                font-family:PingFangSC-Regular;
                font-weight:400;
                color:rgba(152,152,152,1);
                line-height:40px;
            }
 
            position: relative;
            &:after {
                    content: "";
                    display: block;
                    position: absolute;
                    height: 1px; /* no */
                    right: 0;
                    bottom: 0;
                    background: #E5E5E5;
                    width:696px;
            }
            &:last-child {
                &:after {
                    display: none;
                }
            }

        }
    }
}

div[class='bottom'] {
    padding: 20px 0 40px 32px;
    background: #fff;
    h5 {
        height:48px;
        font-size:34px;
        font-family:PingFangSC-Medium;
        font-weight:500;
        color:rgba(51,51,51,1);
        line-height:48px;
        margin-bottom: 20px;
    }
    img {
        width:181px;
        height:236px;
        border-radius:12px;
        display: block;
        background: rgba(229,229,229,0.5);
    }
}
</style>
