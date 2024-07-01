import request from '@/utils/request'

// 查询列表 - 放款标识
export function listInfo(query) {
  return request({
    url: '/loan/identify/list',
    method: 'get',
    params: query
  })
}

// 查询列表 - 放款列表
export function listLoan(query) {
  return request({
    url: '/loan/identify/loan',
    method: 'get',
    params: query
  })
}

// 查询详细 新增
export function getInfo(id) {
  return request({
    url: '/loan/identify/query/' + id,
    method: 'post',
    headers:{repeatSubmit:false}
  })
}

// 查询详细 修改
export function getIdentify(id) {
  return request({
    url: '/loan/identify/detail/' + id,
    method: 'post',
    headers:{repeatSubmit:false}
  })
}

// 新增
export function addInfo(data) {
  return request({
    url: '/loan/identify/add',
    method: 'post',
    data: data
  })
}

// 编辑
export function updateInfo(data) {
  return request({
    url: '/loan/identify/edit',
    method: 'post',
    data: data
  })
}

// 删除
export function delInfo(id) {
  return request({
    url: '/loan/identify/remove/' + id,
    method: 'post'
  })
}
