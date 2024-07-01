import request from '@/utils/request'

// 查询资产管理列表
export function listAbs(query) {
    return request({
        url: '/abs/info/list',
        method: 'get',
        params: query
    })
}

// 查询资产管理详细
export function getAbs(id) {
    return request({
        url: '/abs/info/' + id,
        method: 'get'
    })
}

// 新增资产管理
export function addAbs(data) {
    return request({
        url: '/abs/info/add',
        method: 'post',
        data: data
    })
}

// 修改资产管理
export function updateAbs(data) {
    return request({
        url: '/abs/info/edit',
        method: 'post',
        data: data
    })
}

// 删除资产管理
export function delAbs(id) {
    return request({
        url: '/abs/info/remove/' + id,
        method: 'post'
    })
}

// 关联资产 全部资产信息
export function listAssociation(query) {
  return request({
      url: '/abs/association/list',
      method: 'get',
      params: query
  })
}

// 关联资产 全部资产信息 单条新增
export function addAssociation(data) {
  return request({
      url: '/abs/association/addOne',
      method: 'post',
      data: data
  })
}
// 关联资产 全部资产信息 单条编辑
export function updateAssociationOne(data) {
  return request({
      url: '/abs/association/editOne',
      method: 'post',
      data: data
  })
}

// 关联资产 已关联的资产信息列表
export function getAssociationList(id) {
  return request({
      url: '/abs/association/detail/' + id,
      method: 'post'
  })
}

// 关联资产 新增或修改关联资产
export function updateAssociation(data) {
  return request({
      url: '/abs/association/addOrUpdate',
      method: 'post',
      data: data
  })
}

/**
 * 资产查询
 */
// 获取详情操作
export function getAssets(id) {
  return request({
      url: '/abs/association/detailOne/'+id,
      method: 'post'
  })
}
// 新增操作
export function addAssets(data) {
  return request({
      url: '/abs/association/addOne',
      method: 'post',
      data: data
  })
}
// 编辑操作
export function updateAssets(data) {
  return request({
      url: '/abs/association/editOne',
      method: 'post',
      data: data
  })
}
// 删除操作
export function deleteAssets(id) {
  return request({
      url: '/abs/association/remove/'+id,
      method: 'post'
  })
}