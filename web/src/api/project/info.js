import request from '@/utils/request'

// 查询项目立项列表
export function listProjInfo(query) {
  return request({
    url: '/project/info/list',
    method: 'get',
    params: query
  })
}

// 查询项目立项详细
export function getProjInfo(projectId) {
  return request({
    url: '/project/info/detail/' + projectId,
    method: 'get'
  })
}

// 新增项目立项
export function addProjInfo(data) {
  return request({
    url: '/project/info/add',
    method: 'post',
    data: data
  })
}

// 修改项目立项
export function updateProjInfo(data) {
  return request({
    url: '/project/info/edit',
    method: 'post',
    data: data
  })
}

// 删除项目立项
export function delProjInfo(projectId) {
  return request({
    url: '/project/info/remove/' + projectId,
    method: 'post'
  })
}
