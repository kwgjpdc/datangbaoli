import request from '@/utils/request'

// 列表查询
export function listData(query) {
  return request({
    url: '/loan/calculation/list',
    method: 'get',
    params: query
  })
}

// 试算数据查询
export function calculationList(data) {
  return request({
    url: '/loan/calculation/add',
    method: 'post',
    data: data
  })
}

// 清空试算
export function emptyData() {
  return request({
    url: '/loan/calculation/remove',
    method: 'post'
  })
}

// 导出数据
export function exportInfo(data) {
  return request({
    url: '/loan/calculation/export',
    method: 'post',
    data:data
  })
}

