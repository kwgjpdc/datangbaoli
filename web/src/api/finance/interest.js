import request from '@/utils/request'

// 列表查询
export function listData(query) {
  return request({
    url: '/loan/extraction/list',
    method: 'get',
    params: query
  })
}

// 发送凭证
export function send(data) {
  return request({
    url: '/loan/extraction/send',
    method: 'post',
    data: data
  })
}

// 生成当月预提数据
export function listMonth(query) {
  return request({
    url: '/loan/extraction/listMonth',
    method: 'get',
    params: query
  })
}

// 导出数据
export function exportInfo(data) {
  return request({
    url: '/loan/extraction/export',
    method: 'post',
    data:data
  })
}

// 信息详情
export function getInfo(id) {
  return request({
    url: '/loan/extraction/detail/' + id,
    method: 'post',
    headers:{repeatSubmit:false}
  })
}

// 删除预提信息
export function delInfo(extractionIds) {
  return request({
    url: '/loan/extraction/remove/' + extractionIds,
    method: 'post'
  })
}

// 新增数据
export function addInfo(data) {
  return request({
    url: '/loan/extraction/add',
    method: 'post',
    data: data
  })
}

// 编辑数据
export function updateInfo(data) {
  return request({
    url: '/loan/extraction/edit',
    method: 'post',
    data: data
  })
}

