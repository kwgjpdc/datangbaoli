import request from '@/utils/request'

// 查询客户开票信息列表
export function listInvoice(query) {
  return request({
    url: '/cust/invoice/list',
    method: 'get',
    params: query
  })
}

// 查询客户开票信息详细
export function getInvoice(invoiceId) {
  return request({
    url: '/cust/invoice/' + invoiceId,
    method: 'get'
  })
}

// 新增客户开票信息
export function addInvoice(data) {
  return request({
    url: '/cust/invoice',
    method: 'post',
    data: data
  })
}

// 修改客户开票信息
export function updateInvoice(data) {
  return request({
    url: '/cust/invoice',
    method: 'put',
    data: data
  })
}

// 删除客户开票信息
export function delInvoice(invoiceId) {
  return request({
    url: '/cust/invoice/' + invoiceId,
    method: 'delete'
  })
}
