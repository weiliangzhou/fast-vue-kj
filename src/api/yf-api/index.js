// 获取数据api列表之类的
import {
    axios
} from '@/global'

// 获取线下支付订单列表
export const findOfflineProductOrderListPage = (data) => {
    return axios.request({
        url: '/api/product_order/findOfflineProductOrderListPage',
        method: 'get',
        data
    })
}
// 获取线上支付订单列表
/*
订单状态  -1 全部 1待支付 4、待审核 10 审核失败 5 已审核
private Integer orderStatus;
 手机号码
private String phone;
  用户名
private String name;
  商品名称
private String goodsName;
  订单时间 开始时间
@DateTimeFormat(pattern = "yyyy-MM-dd")
private Date startDateLimit;
  支付方式 0：线上支付 1：线下支付
private Integer payType;
  订单时间 结束时间
@DateTimeFormat(pattern = "yyyy-MM-dd")
private Date endDateLimit;
*/
export const findProductOrderListPage = ({ endDateLimit = "",
orderStatus = "",
name = "",
phone = "",
goodsName = "",
payType = "",
pageNum = 1,
pageSize = 1000,
startDateLimit = ""}) => {
    return axios.request({
        url: '/api/product_order/findProductOrderListPage',
        method: 'get',
        data: {
            // orderStatus: orderStatus || undefined,
           // orderStatus: 5,
            goodsName: goodsName || undefined,
            payType: payType || undefined,
            endDateLimit: endDateLimit || undefined,
            name: name || undefined,
            phone: phone || undefined,
            startDateLimit: startDateLimit || undefined,
            pageNum: pageNum || undefined,
            pageSize: pageSize || undefined,
        }
    })
}
// 获取昨日数据报表
export const getYesterdayInfo = (data) => {
    return axios.request({
        url: '/api/admin/statistics/getYesterdayInfo',
        method: 'get',
        data: data
    })
}

// 数据详情
export const getTradeDetail = (data) => {
    return axios.request({
        url: '/api/admin/statistics/getTradeDetail',
        method: 'get',
        data: data
    })
}

// 下拉框选择商品数据
export const getGoodsList = (data) => {
    return axios.request({
        url: '/api/pub/item/getGoodsList',
        method: 'get',
        data: data
    })
}

// 截止今日数据概览
export const getTodayDataInfo = (data) => {
    return axios.request({
        url: '/api/admin/statistics/getTodayDataInfo',
        method: 'get',
        data: data
    })
}

// 按月获取统计数据
export const getMonthDataInfo = ({year, month}) => {
    return axios.request({
        url: '/api/admin/statistics/getMonthDataInfo',
        method: 'get',
        data: {
            year,
            month
        }
    })
}
