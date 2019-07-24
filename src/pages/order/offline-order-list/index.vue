<!-- 线下订单列表 -->
<template>
    <div id="offlineOrderList">
        <topbar :arr="topbarArr" :index="topbarIndex" @check="changeTopbar"></topbar>
        <search-bar @search='searchOrderList'></search-bar>
        <div v-if="!tabClick">
            <ul v-if="dataList.length > 0">
                <li v-for="(item, index) in dataList" :key="index">
                    <div class="top">
                        <img class="cover" :src="item.avatar || 'https://img.mall.xc2018.com.cn/mall/upload/20190513/140756_99_gxee.png'" alt="">
                        <span class="name">{{item.userName}}</span>
                        <span class="phone">{{item.userPhone}}</span>
                        <!-- <span class="orderStatus">{{item.orderStatusDesc}}</span> -->
                        <!-- 上方注释游东方的锅 -->
                    </div>
                    <div class="center">
                        <img class="goodsImg" :src="item.picUrl" alt="">
                        <div class="goodsinfo">
                            <div class="goodsTitle">{{item.name}}</div>
                            <div class="classAddress">{{item.brief}}</div>
                            <div class="creatOrderTime">{{item.createdAt.split(' ')[0]}}</div>
                        </div>
                        <div class="orderInfo">
                            <div class="price">&yen;{{item.actualPriceDesc}}</div>
                            <div class="goodsNum">x1</div>
                            <!-- 上方注释游东方的锅 -->
                            <div class="goodsStatus">{{item.orderStatusDesc}}</div>
                        </div>
                    </div>
                    <div class="bottom" v-if="item.orderStatus==1||item.orderStatus==10||item.remark">
                        <div class="btn upOrder" v-if="item.orderStatus==1" @click='upOrder(item.orderSn)'>上传付款凭证</div>
                        <div class="btn upOrder" v-else-if="item.orderStatus==10" @click='upOrder(item.orderSn)'>重新上传凭证</div>
                        <div class="btn checkOrder" v-if="item.remark" @click="showImg(item.remark)">查看付款凭证</div>
                    </div>
                </li>
            </ul>
            <div class="noList" v-if="dataList.length == 0">
                <img src="http://chuang-saas.oss-cn-hangzhou.aliyuncs.com/upload/image/20181210/97d2f80eb1a644f9869e98ba994bcd65.jpeg" alt=""><br> 暂无记录
            </div>
        </div>
        <!-- <div class="loading iconfont icon-loading" :class="{'hide': !loading}">加载中...</div> -->
        <div v-transfer-dom>
            <x-dialog :show.sync="showRemark" class="dialog-demo">
                <div class="img-box" @click="showRemark=false">
                    <img :src="remarkUrl" style="max-width:100%">
                </div>
            </x-dialog>
        </div>
    </div>
</template>

<script>
import topbar from '../topbar/topbar.vue'
import searchBar from '../search-bar/index.vue'
import { findOfflineProductOrderListPage } from '@/api'
import { XDialog, TransferDomDirective as TransferDom } from 'vux'

let top = 0
export default {
    data() {
        return {
            tabClick: true, // tab是否是在点击状态
            showRemark: false, // 显示付款凭证
            remarkUrl: '', // 付款凭证图片地址
            isHttping: false, // 是否正在http请求中
            hasPage: true, // 还有没有下一页
            loading: false, // 加载更多
            pageAdd: false, // 下拉加载更多数据
            defaultStartTime: '',
            defaultEndTime: '',
            topbarArr: ['全部订单', '未支付', '待审核', '已审核', '审核失败'], // 顶部bar初始化数据
            topbarIndex: 0, // 当前选中的topbar中的index
            orderStatus: -1, // 请求后短的数据，-1:全部订单, 1:待支付, 4:待审核, 10:审核失败, 5:已审核
            pageNum: 1, // 当前页码
            pageSize: 1000, // 每页条数
            queryData: {
                endTime: "",
                name: "",
                phone: "",
                startTime: "",
                type: ""
            }, // 搜索
            dataList: [] // 订单列表
        }
    },
    components: { topbar, searchBar, XDialog, },
    computed: {},
    directives: {
        TransferDom
    },
    mounted() {
        this.getQueryOrderList()
        window.addEventListener('scroll', this.handleScroll)
    },
    destroyed() {
        window.removeEventListener('scroll', this.handleScroll)
    },
    methods: {
        // 滚动到底部后加载更多
        handleScroll() {
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop // 当前滚动距离
            let windowheight = document.compatMode == "CSS1Compat" ? document.documentElement.clientHeight : document.body.clientHeight // 获取到当前窗口的高度
            let bodyScrollHeight = document.body.scrollHeight
            let documentScrollHeight = document.documentElement.scrollHeight
            let scrollheight = (bodyScrollHeight - documentScrollHeight > 0) ? bodyScrollHeight : documentScrollHeight // 获取到当前的页面文档的总高
            if (scrollTop > top) {
                // 向下滚动
                top = scrollTop
                if (scrollTop + windowheight >= scrollheight) {
                    // this.getMorePage()
                }
            } else {
                top = scrollTop
                // 向上滚动
            }
        },

        searchOrderList(data) {
            this.queryData = data
            this.getQueryOrderList()
        }, // 按搜索条件查询

        changeTopbar(i) {
            this.tabClick = true
            this.topbarIndex = i
            if (i == 1) {
                // '未支付',
                this.orderStatus = 1
            } else if (i == 2) {
                //  '待审核',
                this.orderStatus = 4
            } else if (i == 3) {
                // '已审核',
                this.orderStatus = 5
            } else if (i == 4) {
                // '审核失败'
                this.orderStatus = 10
            } else {
                // 全部
                this.orderStatus = -1
            }
            this.getQueryOrderList()
        }, // 按顶部的tab切换查询

        getQueryOrderList() { // 点击放大镜按钮时搜索
            let query
            if (this.queryData.type == 0) {
                // 时间纬度查询
                if (this.queryData.startTime) {
                    query.startDateLimit = this.queryData.startTime
                }
                if (this.queryData.endTime) {
                    query.endDateLimit = this.queryData.endTime
                }
            } else if (this.queryData.type == 1) {
                // 名字纬度查询
                query = {
                    name: this.queryData.name
                }
            } else if (this.queryData.type == 2) {
                // 手机纬度查询
                query = {
                    phone: this.queryData.phone
                }
            } else {
                query = this.queryData
            }
            if (!this.loading) {
                this.loading = true
                findOfflineProductOrderListPage({
                    pageNum: 1,
                    pageSize: 1000,
                    orderStatus: this.orderStatus,
                    ...query
                }).then(res => {
                    this.tabClick = false
                    this.loading = false
                    if (res.currentPage >= res.totalPage) {
                        this.hasPage = false // 没有更多页面了
                    } else {
                        this.hasPage = true // 还有下一页
                        this.pageNum = res.currentPage++ // 页码加一页
                    }
                    this.dataList = res.items
                }, rej => {
                    this.tabClick = false
                    this.loading = false
                    this.hasPage = false
                })
            }
        },
        getMorePage() {
            if (!this.loading && this.hasPage) {
                this.loading = true
                findOfflineProductOrderListPage({
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                    orderStatus: this.orderStatus,
                    ...query
                }).then(res => {
                    this.isHttping = false
                    this.loading = false
                    if (res.currentPage >= res.totalPage) {
                        this.hasPage = false // 没有更多页面了
                    } else {
                        this.hasPage = true // 还有更多页面
                        this.pageNum = res.currentPage++ // 页码加一页
                    }
                    this.dataList.push.apply(this.dataList, res.items)
                }, rej => {
                    this.loading = false
                    this.hasPage = false
                })
            }
        },
        upOrder(orderSn) {
            // 跳转上传付款凭证
            this.$router.push({
                name: 'buy',
                query: {
                    orderNo: orderSn
                }
            })
        },
        showImg(imgUrl) {
            // 查看付款凭证
            this.remarkUrl = imgUrl
            this.showRemark = true
        },
        // 该方法暂时不需要试用
        getTabOrderList() { // 点击tab切换时查询列表
            findOfflineProductOrderListPage({
                pageNum: this.pageNum,
                pageSize: this.pageSize,
                orderStatus: this.orderStatus
            }).then(res => {
                if (this.pageAdd) {
                    this.dataList.push.apply(this.dataList, res.items)
                } else {
                    this.dataList = res.items
                }
            })
        }
    }
}

</script>
<style lang='less' scoped>
#offlineOrderList {
  min-height: 100vh;
  background: #f7f7f7;
  ul {
    padding-top: 80px;
    overflow: hidden;
    width: 750px;
    // background: #fff;
    li {
      width: 718px;
      padding-left: 32px;
      background: #fff;
      float: right;
      margin-bottom: 20px;
      overflow: hidden;
      .top {
        width: 100%;
        height: 64px;
        display: flex;
        border-bottom: 1px solid #e0e0e0; /* no */
        img {
          width: 32px;
          height: 32px;
          overflow: hidden;
          border-radius: 32px;
          margin-top: 16px;
          margin-right: 16px;
        }
        span {
          color: #363636;
          line-height: 64px;
          margin-right: 10px;
        }
        .orderStatus {
          flex: 99;
          text-align: right;
          margin-right: 32px;
        }
      }
      .center {
        display: flex;
        //   width: ;
        height: 150px;
        margin: 24px 0 0;
        padding-bottom: 24px;
        img {
          width: 245px;
          height: 150px;
        }
        .goodsinfo {
          width: 302px;
          margin-left: 16px;
          flex: 2;
          .goodsTitle {
            height: 45px;
            font-size: 32px;
            color: rgba(54, 54, 54, 1);
            line-height: 45px;
            margin-bottom: 15px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .classAddress {
            height: 40px;
            font-size: 28px;
            color: rgba(152, 152, 152, 1);
            line-height: 40px;
            margin-bottom: 23px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .creatOrderTime {
            height: 40px;
            font-size: 24px;
            color: rgba(152, 152, 152, 1);
            line-height: 33px;
          }
        }
        .orderInfo {
          width: 100px;
          text-align: right;
          padding-right: 20px;
          color: #989898;
          .goodsStatus {
            margin-top: 52px;
            color: #fa4f4e;
          }
        }
      }
      .bottom {
        // height: 80px;
        display: flex;
        flex-direction: row-reverse;
        align-items: center;
        align-content: center;
        overflow: hidden;
        border-top: 1px dotted #e0e0e0; /* no */
        div {
          margin: 13px 0;
        }
        .btn {
          width: 187px;
          height: 54px;
          border-radius: 54px;
          text-align: center;
          line-height: 52px;
          margin-right: 32px;
        }
        .checkOrder {
          background: #fff;
          color: #363636;
          border: 1px solid #979797; /* no */
        }
        .upOrder {
          background: linear-gradient(to bottom, #f4554c 0%, #e01721 100%);
          color: #fff;
          border: none;
        }
      }
    }
  }
  .noList {
    text-align: center;
    padding-top: 400px;
    color: #d5d5d5;
    img {
      width: 152px;
      height: 152px;
    }
    font-size: 40px;
  }
}
.loading {
  height: 50px;
  font-size: 24px;
  color: #666666;
  text-align: center;
}
</style>
