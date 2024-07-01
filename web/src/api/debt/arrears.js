import request from '@/utils/request'

// 查询应收账款要素调整列表
export function listArrears(query) {
  return request({
    url: '/debt/arrears/list',
    method: 'get',
    params: query
  })
}

// 查询应收账款要素调整详细
export function getArrears(id) {
  return request({
    url: '/debt/arrears/detail/' + id,
    method: 'post',
    headers:{repeatSubmit:false}
  })
}

// 新增应收账款要素调整
export function addArrears(data) {
  return request({
    url: '/debt/arrears/add',
    method: 'post',
    data: data
  })
}

// 修改应收账款要素调整
export function updateArrears(data) {
  return request({
    url: '/debt/arrears/edit',
    method: 'post',
    data: data
  })
}




// 删除应收账款要素调整
export function delArrears(id) {
  return request({
    url: '/debt/arrears/remove/' + id,
    method: 'post'
  })
}
