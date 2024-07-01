// 客户发起授信接口
import request from '@/utils/request'
// 获取授信详情
export function getInfo(customerId) {
  return request({
    url: '/cust/credit/detail/' + customerId,
    method: 'post'
  })
}

// 授信新增保存接口
export function addInfo(data) {
  return request({
    url: '/cust/credit/add',
    method: 'post',
    data: data
  })
}

// 授信编辑保存接口
export function updateInfo(data) {
  return request({
    url: '/cust/credit/edit',
    method: 'post',
    data: data
  })
}