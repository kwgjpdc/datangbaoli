import request from '@/utils/request'

// 查询应收账款要素调整列表
export function listAdjust(query) {
  return request({
    url: '/debt/info/adjustList',
    method: 'get',
    params: query
  })
}

// 查询应收账款要素调整详细
export function getAdjust(id) {
  return request({
    url: '/debt/info/adjust/' + id,
    method: 'post',
    headers:{repeatSubmit:false}
  })
}

// 新增应收账款要素调整
export function addAdjust(data) {
  return request({
    url: '/debt/info/adjust/add',
    method: 'post',
    data: data
  })
}

// 修改应收账款要素调整
export function updateAdjust(data) {
  return request({
    url: '/debt/info/adjust',
    method: 'post',
    data: data
  })
}




// 删除应收账款要素调整
export function delAdjust(id) {
  return request({
    url: '/debt/info/adjust/remove/' + id,
    method: 'post'
  })
}
