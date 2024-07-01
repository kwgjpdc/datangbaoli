import request from '@/utils/request'

// 查询列表
export function listInfo(query) {
  return request({
    url: '/loan/change/list',
    method: 'get',
    params: query
  })
}

// 查询详细
export function getInfo(id) {
  return request({
    url: '/loan/change/detail/' + id,
    method: 'post',
    headers:{repeatSubmit:false}
  })
}

// 新增
export function addInfo(data) {
  return request({
    url: '/loan/change/add',
    method: 'post',
    data: data
  })
}

// 编辑
export function updateInfo(data) {
  return request({
    url: '/loan/change/edit',
    method: 'post',
    data: data
  })
}

// 删除应收账款回款冲销
// export function delEntry(id) {
//   return request({
//     url: '/debt/entry/remove/' + id,
//     method: 'post'
//   })
// }
