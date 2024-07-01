import request from '@/utils/request'

// 查询客户基本信息列表
export function listInfo(query) {
  return request({
    url: '/cust/customer/list',
    method: 'get',
    params: query
  })
}

// 查询客户基本信息详细
export function getInfo(customerId) {
  return request({
    url: '/cust/customer/detail/' + customerId,
    method: 'post'
  })
}

// 新增客户基本信息
export function addInfo(data) {
  return request({
    url: '/cust/customer/add',
    method: 'post',
    data: data
  })
}

// 修改客户基本信息
export function updateInfo(data) {
  return request({
    url: '/cust/customer/edit',
    method: 'post',
    data: data
  })
}

// 删除客户基本信息
export function delInfo(customerId) {
  return request({
    url: '/cust/customer/remove/' + customerId,
    method: 'post'
  })
}

// 查询公司信息
export function getCustomerList() {
  return request({
    url: '/cust/customer/customerList',
    method: 'get'
  })
}

// 导出
export function exportInfo(query) {
  return request({
    url: '/cust/customer/export',
    method: 'post',
    data:data
  })
}


// 导出
export function saveData(data) {
  return request({
    url: '/cust/customer/saveData',
    method: 'post',
    data:data
  })
}



