import request from '@/utils/request'
import { parseStrEmpty } from "@/utils/sinosoft";

// 查询模板列表
export function listTemplet(query) {
  return request({
    url: '/system/templet/list',
    method: 'get',
    params: query
  })
}

// 查询模板详细
export function getTempletDetail(templetId) {
  return request({
    url: '/system/templet/detailList/' + templetId,
    method: 'get'
  })
}

// 新增模板
export function addTempletDetail(data) {
  return request({
    url: '/system/templet/addDetail',
    method: 'post',
    data: data
  })
}

// 新增模板
export function addTemplet(data) {
  return request({
    url: '/system/templet',
    method: 'post',
    data: data
  })
}

// 修改模板
export function updateTemplet(data) {
  return request({
    url: '/system/templet',
    method: 'put',
    data: data
  })
}

// 删除模板
export function delTemplet(templetIds) {
  return request({
    url: '/system/templet/' + templetIds,
    method: 'delete'
  })
}
