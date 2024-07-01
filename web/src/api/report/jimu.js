import request from '@/utils/request'
export function indexUrl(query) {
  return request({
    url: '/report/jimu/index',
    method: 'get'
  })
}
// 预览
export function view(query) {
  return request({
    url: '/report/jimu/view',
    method: 'get'
  })
}
