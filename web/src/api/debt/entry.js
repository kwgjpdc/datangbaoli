import request from '@/utils/request'

// 查询应收账款回款冲销列表
export function listEntry(query) {
  return request({
    url: '/debt/entry/list',
    method: 'get',
    params: query
  })
}

// 查询应收账款回款冲销详细
export function getEntry(id) {
  return request({
    url: '/debt/entry/detail/' + id,
    method: 'post',
    headers:{repeatSubmit:false}
  })
}

// 新增应收账款回款冲销
export function addEntry(data) {
  return request({
    url: '/debt/entry/add',
    method: 'post',
    data: data
  })
}

// 修改应收账款回款冲销
export function updateEntry(data) {
  return request({
    url: '/debt/entry/edit',
    method: 'post',
    data: data
  })
}

// 删除应收账款回款冲销
export function delEntry(id) {
  return request({
    url: '/debt/entry/remove/' + id,
    method: 'post'
  })
}
