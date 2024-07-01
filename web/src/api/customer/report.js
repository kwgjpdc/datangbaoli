import request from '@/utils/request'

// 查询客户财务报表列表
export function listReport(query) {
  return request({
    url: '/cust/report/list',
    method: 'get',
    params: query
  })
}

// 查询客户财务报表详细
export function getReport(reportId) {
  return request({
    url: '/cust/report/detail/' + reportId,
    method: 'get'
  })
}

// 新增客户财务报表
export function addReport(data) {
  return request({
    url: '/cust/report/add',
    method: 'post',
    data: data,
    headers:{"content-type":"multipart/form-data"}
  })
}

// 修改客户财务报表
export function updateReport(data) {
  return request({
    url: '/cust/report/edit',
    method: 'post',
    data: data,
    headers:{"content-type":"multipart/form-data"}
  })
}

// 删除客户财务报表
export function delReport(reportId) {
  return request({
    url: '/cust/report/remove/' + reportId,
    method: 'post'
  })
}
