<template>
    <section id="home-view">
        <div class="top-container">
            <div class="part1">
                <h6>实时挖矿收益</h6>
                <p>{{btcInfo}}</p>
                <!-- <button><span>提币</span></button> -->
            </div>
            <div class="part2">
                <div class="text-container">
                    <p>S17S算力云矿机<span>100天</span></p>
                    <div class="right-container">
                        <span>预计最高产量</span><span>0.1 BTC</span>
                    </div>
                </div>
                <ul class="boll-container">
                    <li
                            v-for="item in bollTasks"
                            :class="['common_animate',item.pos]"
                            :key="item.id"
                            @click="completeTask(item.id)"
                    >
                        <!-- <p><span :style="{fontSize: item.type==3?'12px': '16px'}">{{item.type==3?item.title:"+"+item.hours}}</span></p><span>{{item.type==3?"":item.title}}</span> -->
                        <p><span>{{"+"+item.hours}}</span></p><span>{{item.title}}</span>
                    </li>
                </ul>
            </div>

            <div class="part3">
                <div id="jdt">
                    <mt-progress  :value="percentAge" :bar-height="18">
                        <div slot="end" style="color: white;font-size: 12px">&nbsp;{{percentAge}}%</div>
                    </mt-progress>
                </div>
                <div class="label-container">
                    <div>
                        当前电力可用时间：
                        &nbsp;
                        <span>{{TimeFormatHour}}</span>
                        <span>:</span>
                        <span>{{TimeFormatMinute}}</span>
                        <span>:</span>
                        <span>{{TimeFormatSecond}}</span>
                    </div>
                </div>
                <div id="cd_btn_div"
                     @touchstart="onTouchStart"
                     @touchend="onTouchEnd"
                >
                    <span v-show="btnActive_1" id="cd_btn_true"></span>
                    <span v-show="btnActive_2" id="cd_btn_false"></span>
                </div>
            </div>
        </div>
        <div class="task-container">
            <ul>
                <h5>
                    <p>提升算力，挖矿速度飙升</p><span>{{currentPower}}GH/S</span>
                </h5>
                <li @click="showShare">
                    <img
                            :src="iconList[0]"
                            alt=""
                    >
                    <div>
                        <h6>提升算力</h6>
                        <p>邀请一位好友注册赠送<br>100GH/S</p>
                    </div>
                    <button><span>立即领取</span></button>
                </li>
            </ul>

            <ul>
                <h5>
                    <p>完成任务赢电力</p><span></span>
                </h5>
                <li
                        v-for="(item, index) in myTaskInfoList"
                        :key="index"
                        :style="{
            background: item.color
          }"
                >
                    <img
                            :src="item.icoUrl"
                            alt=""
                    >
                    <div>
                        <h6>{{item.title}}</h6>
                        <p>{{item.desc}}</p>
                    </div>
                    <button @click="completeTask(item.id)"><span :style="{
            color: item.color
          }">{{item.btnName}}</span></button>
                </li>
            </ul>
            <div class="tips">
                <h4><img
                        src="./activity_title.png"
                        alt=""
                ></h4>
                <div>
                    <h5><span>活动描述</span></h5>
                    <p>1. 挖矿分为算力和电力两部分组成
                        2. 算力：用户初始默认算力为500GH/S，算力可以通过邀请好友得到算力，算力越高，挖矿的速度越快
                        3. 电力：用户可以通过参与活动得到电力，电力越多，挖矿的时间越长，最长电力峰值24小时。电力不足时挖矿停止。</p>
                    <h5><span>算力增减规则</span></h5>
                    <p>邀请好友数量得到的算力，在矿机停止运行时间超过一天则算力失效。降至初始算力。</p>
                </div>
            </div>
        </div>

    </section>
</template>
<script>
    import {Toast} from "@/global";
    import {completeTask, energyConsume, energyInfo, homepageInfo} from "@/api";
    import yaoqing from "./icon_yaoqing.png";

    export default {
        data() {
            return {
                iconList: [yaoqing],
                btcInfo: 0,
                btcInfoDesc: "0",
                currentEnergyExpireSecond: 0,
                currentPower: 0,
                currentSpeedRate: 0,
                currentSpeedRateDesc: "0",
                myTaskInfoList: [],
                btnActive_1: true,
                btnActive_2: false,
                percentAge: 0,
                cdStatus: null,
                startToEndTime: '',// 长按时间的开始时间
                timer1: '', // 长按开始的计时器
            };
        },
        computed: {
            bollTasks() {
                return this.myTaskInfoList.filter(
                    item =>  !item.complete
                );
            },
            TimeFormatHour() {
                let s = this.currentEnergyExpireSecond;
                var hour = Math.floor(s / 3600);
                return hour;
            },
            TimeFormatMinute() {
                let s = this.currentEnergyExpireSecond;
                var hour = Math.floor(s / 3600);
                var minute = Math.floor(s / 60) - hour * 60;
                return minute > 9 ? minute : "0" + minute;
            },
            TimeFormatSecond() {
                let s = this.currentEnergyExpireSecond;
                var second = s % 60;
                return second > 9 ? second : "0" + second;
            }
        },
        mounted() {
            homepageInfo().then(({myTaskInfoList, ...others}) => {
                let colors = ["#FFB400", "#00C0AC", "#FF461A", "#6868E7"];
                let pos = ["fenxiang-pos", "yaoqing-pos", "qiandao-pos", "renwu-pos"];
                myTaskInfoList = myTaskInfoList.map((item, index) => {
                    item["color"] = colors[index % 4];
                    item.pos =
                        pos[index % 4] + " " + "animate" + (parseInt(Math.random() * 10) % 8);
                    return item;
                });
                Object.assign(this, {myTaskInfoList, ...others});
                this.startTimeDown();
                this.percentAge = Math.floor(this.currentEnergyExpireSecond / (24 * 36));
                if (this.percentAge >= 0 & this.percentAge < 20) {
                    this.cdStatus = "exception";
                } else if (this.percentAge >= 20 & this.percentAge < 80) {
                    this.cdStatus = null;
                } else if (this.percentAge >= 80) {
                    this.cdStatus = "success";
                }
            });
        },
        methods: {
            showToast1(text) {
                let container = document.createElement("section");
                container.setAttribute("class", "toast1");
                let span = document.createElement("span");
                span.innerText = text;
                let div = document.createElement("div");
                div.appendChild(span);
                container.appendChild(div);
                document.body.appendChild(container);
                setTimeout(() => {
                    // debugger;
                    document.body.removeChild(container);
                }, 1500);
            },
            //长按事件
            onTouchStart() {
                let time1 = new Date();
                this.startToEndTime = time1;
                this.btnActive_1 = false;
                this.btnActive_2 = true;
                this.increaseLastUpdate = 0;
                let energyConsumeCount = 0
                this.timer1 = setTimeout(() => {
                    if (!this.touchStartTime) {
                        this.stopTimeDown();
                        this.touchStartTime = setInterval(() => {
                            let increase = 30 + parseInt(Math.random() * 10);
                            this.increaseLastUpdate += increase;
                            if (this.increaseLastUpdate >= 3600) {
                                this.increaseLastUpdate -= 3600;
                                energyConsume(1)
                                    .then(res => {
                                        energyConsumeCount ++
                                    })
                                    .catch(err => {
                                        // Toast(err);
                                        if(energyConsumeCount>0) {
                                            Toast("充了: "+energyConsumeCount+" 小时电, 电力不足")
                                        } else {
                                            Toast(err)
                                        }
                                        this.increaseLastUpdate = 0;
                                        this.clearTouchTask();
                                    })
                                    .then(() => {
                                        energyInfo().then(res => {
                                            this.currentEnergyExpireSecond = res || 0;
                                            this.percentAge = Math.floor(this.currentEnergyExpireSecond / (24 * 36));
                                            if (this.percentAge >= 0 & this.percentAge < 20) {
                                                this.cdStatus = "exception";
                                            } else if (this.percentAge >= 80) {
                                                this.cdStatus = "success";
                                            }
                                        });
                                    });
                            }
                            this.currentEnergyExpireSecond += increase;
                        }, 20);
                    }
                }, 500)
            },
            clearTouchTask() {
                clearInterval(this.touchStartTime);
                this.touchStartTime = null;
                this.startTimeDown();
            },
            // 长按松开事件
            onTouchEnd() {
                let time2 = new Date();
                let result = time2 - this.startToEndTime;
                // 当按钮弹起时，如果result的时间小于500毫秒，那么清除touchstart事件触发发this.timer1
                if(result < 500) {
                    clearTimeout(this.timer1);
                    Toast('请长按充电');
                    return;
                }
                this.btnActive_1 = true;
                this.btnActive_2 = false;
                this.clearTouchTask();
                let energyConsumeCount = Math.ceil(energyConsumeCount/3600)
                if (this.increaseLastUpdate % 3600) {
                    this.increaseLastUpdate = 0;
                    energyConsume(1)
                        .then(res => {
                            if(energyConsumeCount>0) {
                                Toast("充了: "+energyConsumeCount+" 小时电")
                            }
                        })
                        .catch(err => {
                            Toast(err);
                            this.clearTouchTask();
                             if(--energyConsumeCount>0) {
                                Toast("充了: "+energyConsumeCount+" 小时电")
                            }
                        })
                        .then(res => {
                            energyInfo().then(res => {
                                this.currentEnergyExpireSecond = res || 0;
                                this.percentAge = Math.floor(this.currentEnergyExpireSecond / (24 * 36));
                                if (this.percentAge >= 0 & this.percentAge < 20) {
                                    this.cdStatus = "exception";
                                } else if (this.percentAge >= 80) {
                                    this.cdStatus = "success";
                                }
                            });
                        });
                }else {
                     if(energyConsumeCount>0) {
                                Toast("充了: "+energyConsumeCount+" 小时电")
                            }
                }
            },
            completeTask(taskId) {
                let currentTask = this.myTaskInfoList.findIndex(
                    item => item.id == taskId
                );
                completeTask(taskId).then(res => {
                    this.myTaskInfoList[currentTask].complete = true;
                    this.myTaskInfoList[currentTask].btnName = "已完成";
                    if (this.myTaskInfoList[currentTask].hours) {
                        this.showToast1("电力+" + this.myTaskInfoList[currentTask].hours);
                    }

                });
                if (currentTask !== -1 && this.myTaskInfoList[currentTask].hrefUrl) {
                    location.href = this.myTaskInfoList[currentTask].hrefUrl;
                }
                // else if (
                //     currentTask !== -1 &&
                //     this.myTaskInfoList[currentTask].complete == false
                // ) {
                //
                // }
            },
            startTimeDown() {
                if (!this.btcInfoTime && this.currentEnergyExpireSecond > 0) {
                    this.btcInfoTime = setInterval(() => {
                        if (this.currentEnergyExpireSecond > 0) {
                            let current = new Number(
                                Number(this.btcInfo) + Number(this.currentSpeedRate)
                            );
                            this.btcInfo = current.toFixed(10);
                            this.currentEnergyExpireSecond--;
                        } else {
                            this.stopTimeDown();
                        }
                    }, 1000);
                }
            },
            stopTimeDown() {
                clearInterval(this.btcInfoTime);
                this.btcInfoTime = null;
            },
            showShare() {
                this.$root.$children[0].setShareContext(true);
            }
        },
        activated() {
        },
        beforeRouteLeave(to, from, next) {
            this.stickyIsShow = false;
            next();
        }
    };
</script>

<style lang='less' scoped>
    #home-view {
        width: 100vw;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        background: rgba(244, 244, 244, 1);
        align-items: center;
        position: relative;
        overflow-y: scroll; //该属性随着手指离开立即停止
        -webkit-overflow-scrolling: touch; //该属性随着手指离开还会保持滚动
        min-height: 100%;
        flex: 1;
    }

    .top-container {
        margin-bottom: 20px;
        padding: 50px 30px 0;
        width: 100%;
        height: 1108px;
        box-sizing: border-box;
        overflow: hidden;
        background: rgba(146, 146, 146, 0.5);
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        background: url("http://fast-mining.oss-cn-hangzhou.aliyuncs.com/upload/image/20190729/a42775d2858846f685b7c11934f5d362.png");
        background-repeat: no-repeat;
        background-size: 100% 100%;

        .part1 {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 156px;
            background: rgba(32, 0, 70, 1);
            border: 3px solid rgba(0, 208, 255, 1);
            border-radius: 20px;
            position: relative;
            padding-top: 30px;
            box-sizing: border-box;

            h6 {
                width: 400px;
                height: 60px;
                background: rgb(53, 0, 120);
                border: 3px solid rgba(0, 255, 255, 1);
                font-size: 32px;
                font-family: PingFangSC-Medium;
                letter-spacing: 1.28px;
                border-radius: 40px;
                text-align: center;
                line-height: 60px;
                box-sizing: border-box;
                color: white;
                position: absolute;
                top: 0;
                right: 50%;
                transform: translate(50%, -50%);
            }

            p {
                font-family: PingFangSC-Semibold;
                font-size: 60px;
                font-weight: 600;
                height: 84px;
                letter-spacing: 3px;
                color: white;
            }

            button {
                width: 100px;
                height: 40px;
                border: 1px solid rgb(0, 56, 143);
                position: absolute;
                top: 16px;
                right: 16px;
                border-radius: 20px;
                overflow: hidden;
                display: flex;
                justify-content: center;
                align-items: center;
                background-image: linear-gradient(to bottom,
                rgb(0, 148, 234) 0%,
                rgb(0, 56, 164) 100%);

                span {
                    color: white;
                    font-family: PingFangSC-Semibold;
                    font-size: 20px;
                    letter-spacing: 0.8px;
                    height: 20px;
                    margin-bottom: 4px;
                }
            }
        }


        .part3 {
            display: flex;
            position: relative;
            background: rgba(0, 0, 0, 0.30);
            border-radius: 20px;
            border-radius: 20px;
            height: 170px;
            top: 3%;

            #jdt {
                width: 428px;
                margin-top: 40px;
                margin-left: 8%;
            }

            #cd_btn_div {
                display: flex;
                position: absolute;
                margin-top: 35px;
                left: 77%;

                #cd_btn_true {
                    width: 100*1.2px;
                    height: 92*1.2px;
                    background-image: url('http://fast-mining.oss-cn-hangzhou.aliyuncs.com/upload/image/20190729/3e0332c8664948e9b62c2bd217e8f49a.png');
                    background-repeat: no-repeat;
                    background-size: 100% 100%;
                }

                #cd_btn_false {
                    width: 100*1.2px;
                    height: 92*1.2px;
                    background-image: url('http://fast-mining.oss-cn-hangzhou.aliyuncs.com/upload/image/20190729/3188b908281f44e3b56ccc526fce6f08.png');
                    background-repeat: no-repeat;
                    background-size: 100% 100%;
                }

            }

            .label-container {
                div {
                    ont-family: PingFangSC-Regular;
                    font-size: 24px;
                    color: #FFFFFF;
                    letter-spacing: 0;
                    display: flex;
                    position: absolute;
                    top: 50%;
                    left:  8%;
                }


            }
        }

        .part2 {
            display: flex;
            align-items: center;
            flex-direction: column;

            .text-container {
                padding: 28px 83px 23px;
                box-sizing: border-box;
                display: flex;
                justify-content: space-between;
                align-items: center;
                width: 100%;
                flex-direction: row;

                & > p {
                    font-family: PingFangSC-Medium;
                    font-size: 28px;
                    color: #ffffff;
                    letter-spacing: 0;
                    text-align: center;
                    height: 40px;
                    line-height: 40px;
                    position: relative;

                    span {
                        font-family: PingFangSC-Medium;
                        font-size: 24px;
                        color: #ffffff;
                        letter-spacing: 0;
                        text-align: center;
                        line-height: 33px;
                        position: absolute;
                        top: -40%;
                        right: -90px;
                        width: 80px;
                        height: 36px;
                        background: url("./dayBg.png");
                        background-repeat: no-repeat;
                        background-size: 80px 36px;
                    }
                }

                .right-container {
                    display: flex;
                    flex-direction: column;

                    & > span:first-of-type {
                        font-family: PingFangSC-Medium;
                        font-size: 20px;
                        color: #999999;
                        letter-spacing: 0;
                        text-align: center;
                        height: 28px;
                        line-height: 28px;
                    }

                    & > span:last-of-type {
                        font-family: PingFangSC-Medium;
                        font-size: 32px;
                        color: #ffffff;
                        letter-spacing: 0;
                        text-align: center;
                        height: 45px;
                        line-height: 45px;
                        font-weight: 600;
                    }
                }
            }

            .boll-container {
                height: 536px;
                position: relative;
                width: 100%;

                li {
                    display: flex;
                    flex-direction: column;
                    position: absolute;

                    p {
                        width: 104px;
                        height: 104px;
                        border-radius: 50%;
                        overflow: hidden;
                        background: green;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background-repeat: no-repeat;
                        background-size: 104px 104px;

                        span {
                            font-family: PingFangSC-Semibold;
                            font-size: 36px;
                            color: #ffffff;
                            letter-spacing: 0.5px;
                            text-align: center;
                            height: 50px;
                            line-height: 50px;
                        }
                    }

                    span {
                        font-family: PingFangSC-Regular;
                        font-size: 24px;
                        color: #ffffff;
                        letter-spacing: 0;
                        text-align: center;
                        /*margin-top: 6px;*/
                        line-height: 33px;
                        height: 33px;
                    }
                }

                .qiandao-pos {
                    left: 46px;
                    top: 5px;

                    & > p {
                        background: url("./icon_fudongY.png");
                        background-repeat: no-repeat;
                        background-size: 104px 104px;
                    }
                }

                .fenxiang-pos {
                    right: 173px;
                    bottom: 121px;

                    p {
                        background: url("./icon_fudongB.png");
                        background-repeat: no-repeat;
                        background-size: 104px 104px;
                    }
                }

                .renwu-pos {
                    right: 53px;
                    bottom: 41px;

                    p {
                        background: url("./icon3.png");
                        background-repeat: no-repeat;
                        background-size: 104px 104px;
                    }
                }

                .yaoqing-pos {
                    top: 56px;
                    right: 70px;

                    p {
                        background: url("./icon_fudongC.png");
                        background-repeat: no-repeat;
                        background-size: 104px 104px;
                    }
                }
            }
        }
    }

    .task-container {
        padding: 16px 20px 0;
        background: #fff;
        width: 100%;
        box-sizing: border-box;

        ul {
            margin-top: 44px;

            h5 {
                display: flex;
                padding: 0 20px 0 24px;
                margin-bottom: 16px;

                p {
                    font-family: PingFangSC-Medium;
                    font-size: 28px;
                    color: #333333;
                    letter-spacing: 0;
                    height: 40px;
                    line-height: 40px;
                    flex: 1;
                    margin-right: 20px;
                }

                span {
                    font-family: PingFangSC-Medium;
                    font-size: 28px;
                    color: #009cff;
                    letter-spacing: 0;
                    height: 40px;
                    line-height: 40px;
                }
            }

            li {
                height: 200px;
                background: #FF3043;
                box-shadow: 0 8px 0 0 rgba(0, 0, 0, 0.1);
                border-radius: 16px;
                display: flex;
                align-items: center;
                padding: 0 40px;
                margin-bottom: 28px;

                img {
                    display: block;
                    width: 120px;
                    height: 120px;
                    margin-right: 40px;
                    background: rgba(0, 0, 0, 0.3);
                    border-radius: 50%;
                }

                & > div {
                    flex: 1;
                    margin-right: 20px;

                    h6 {
                        height: 37px;
                        font-family: PingFangSC-Medium;
                        font-size: 26px;
                        color: #ffffff;
                        letter-spacing: 0;
                        line-height: 37px;
                    }

                    p {
                        font-family: PingFangSC-Regular;
                        font-size: 22px;
                        color: #ffffff;
                        letter-spacing: 0;
                        height: 32px;
                        line-height: 30px;
                    }
                }

                button {
                    background: #ffffff;
                    border-radius: 20px;
                    padding: 6px 34px;
                    border: none;

                    span {
                        font-family: PingFangSC-Regular;
                        font-size: 22px;
                        color: #ffb400;
                        letter-spacing: 0;
                        height: 30px;
                        line-height: 30px;
                        font-weight: 600;
                    }
                }
            }
        }
    }

    .tips {
        h4 {
            padding: 56px 0 40px;

            img {
                width: 384px;
                display: block;
                margin: auto;
            }
        }

        & > div {
            background: #8c73e4;
            box-shadow: 0 8px 0 0 rgba(0, 0, 0, 0.1);
            border-radius: 16px;
            padding: 30px 26px 30px 34px;
            box-sizing: border-box;
            white-space: pre-line;

            p {
                white-space: pre-line;
                font-family: PingFangSC-Regular;
                font-size: 22px;
                color: #ffffff;
                letter-spacing: 0;
                line-height: 34px;
            }

            h5 {
                text-align: center;
                margin: 32px 0 16px;

                span {
                    background: #7659da;
                    border-radius: 24px;
                    height: 18.5px;
                    line-height: 18.5px;
                    font-family: PingFangSC-Semibold;
                    font-size: 26px;
                    color: #ffffff;
                    letter-spacing: 0;
                    text-align: center;
                    padding: 8px 24px;
                }
            }
        }
    }


@keyframes buzz-out {
  0%,
  100%,
  20%,
  50%,
  80% {
    transform: translate3d(0, 0, 0);
  }
  40%,
  43% {
    transform: translate3d(0, -30px, 0);
  }
  70% {
    transform: translate3d(0, -15px, 0);
  }
  90% {
    transform: translate3d(0, -4px, 0);
  }
}
.common_animate {
  animation-fill-mode: both;
  animation-name: buzz-out;
  animation-iteration-count: infinite;
  transform-origin: center bottom;
  cursor: pointer;
}
.animate0 {
    animation-delay: 3s;
    animation-duration: 5s;
}
.animate1 {
    animation-delay: 3s;
    animation-duration: 5s;
}

.animate2 {
    animation-delay: 3s;
    animation-duration: 5s;
}

.animate3 {
    animation-delay: 3s;
    animation-duration: 5s;
}

.animate4 {
    animation-delay: 3s;
    animation-duration: 5s;
}

.animate5 {
    animation-delay: 3s;
    animation-duration: 5s;
}

.animate6 {
    animation-delay: 3s;
    animation-duration: 5s;
}

.animate7 {
    animation-delay: 3s;
    animation-duration: 5s;
}
</style>
<style lang='less'>
    .toast1 {
        position: fixed;
        z-index: 10;
        top: 0;
        right: 0;
        width: 100vw;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;

        div {
            width: 200px;
            height: 190px;
            border-radius: 20px;
            background: url("./icon_toast1.png");
            background-repeat: no-repeat;
            background-size: 100% 100%;
            display: flex;
            justify-content: center;
            align-items: flex-end;

            span {
                font-family: PingFangSC-Medium;
                font-size: 28px;
                color: #2CD781;
                letter-spacing: 0;
                text-align: justify;
                height: 40px;
                line-height: 40px;
                margin-bottom: 28px;
            }
        }
    }
</style>

