import request from '@/utils/request'
import { parseStrEmpty } from "@/utils/sinosoft";

// 查询收款账号列表
export function listPayment(query) {
  return request({
    url: '/finance/payment/list',
    method: 'get',
    params: query
  })
}

// 新增收款账号
export function addPayment(data) {
  return request({
    url: '/finance/payment',
    method: 'post',
    data: data
  })
}

// 修改收款账号
export function updatePayment(data) {
  return request({
    url: '/finance/payment',
    method: 'put',
    data: data
  })
}

// 删除收款账号
export function delPayment(paymentIds) {
  return request({
    url: '/finance/payment/' + paymentIds,
    method: 'delete'
  })
}
