import request from '@/utils/request'
import { parseStrEmpty } from "@/utils/sinosoft";

// 查询业务组列表
export function listAgroup(query) {
  return request({
    url: '/system/agroup/list',
    method: 'get',
    params: query
  })
}

// 查询业务组详细
export function getAgroup(agroupId) {
  return request({
    url: '/system/agroup/' + parseStrEmpty(agroupId),
    method: 'get'
  })
}

// 新增业务组
export function addAgroup(data) {
  return request({
    url: '/system/agroup',
    method: 'post',
    data: data
  })
}

// 修改业务组
export function updateAgroup(data) {
  return request({
    url: '/system/agroup',
    method: 'put',
    data: data
  })
}

// 删除业务组
export function delAgroup(agroupIds) {
  return request({
    url: '/system/agroup/' + agroupIds,
    method: 'delete'
  })
}

// 查询业务组列表
export function getRoleUser(roleName) {
  return request({
    url: '/system/user/getRoleUser/' + roleName,
    method: 'get'
  })
}
