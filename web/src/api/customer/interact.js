import request from '@/utils/request'

// 查询interact列表
export function listInteract(query) {
  return request({
    url: '/cust/interact/list',
    method: 'get',
    params: query
  })
}

// 查询interact详细
export function getInteract(interactId) {
  return request({
    url: '/cust/interact/detail/' + interactId,
    method: 'get'
  })
}

// 新增interact
export function addInteract(data) {
  return request({
    url: '/cust/interact/add',
    method: 'post',
    data: data
  })
}

// 修改interact
export function updateInteract(data) {
  return request({
    url: '/cust/interact/edit',
    method: 'post',
    data: data
  })
}

// 删除interact
export function delInteract(interactId) {
  return request({
    url: '/cust/interact/remove/' + interactId,
    method: 'post'
  })
}


// interact新增获取编号
export function getInteractSeq() {
  return request({
    url: '/cust/interact/seq',
    method: 'get'
  })
}

