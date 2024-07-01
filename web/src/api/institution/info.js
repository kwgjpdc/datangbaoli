import request from '@/utils/request'

// 查询应收账款查询列表
export function listInstitutionInfo(query) {
  return request({
    url: '/institution/info/list',
    method: 'get',
    params: query
  })
}


export function getInstitutionInfo(id) {
  return request({
    url: '/institution/info/' + id,
    method: 'get'
  })
}


// 新增应收账款查询
export function addInstitutionInfo(data) {
  return request({
    url: '/institution/info/add',
    method: 'post',
    data: data
  })
}


// 修改应收账款查询
export function updateInstitutionInfo(data) {
  return request({
    url: '/institution/info/edit',
    method: 'post',
    data: data
  })
}




export function delInstitutionInfo(id) {
  return request({
    url: '/institution/info/remove/' + id,
    method: 'post'
  })
}
