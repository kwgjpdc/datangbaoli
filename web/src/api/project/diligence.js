import request from '@/utils/request'

// 查询项目尽调列表
export function listDiligence(query) {
  return request({
    url: '/project/diligence/list',
    method: 'get',
    params: query
  })
}

// 查询项目尽调详细
export function getDiligence(id) {
  return request({
    url: '/project/diligence/detail/' + id,
    method: 'post'
  })
}

// 新增项目尽调
export function addDiligence(data) {
  return request({
    url: '/project/diligence/add',
    method: 'post',
    data: data
  })
}

// 修改项目尽调
export function updateDiligence(data) {
  return request({
    url: '/project/diligence/edit',
    method: 'post',
    data: data
  })
}

// 删除项目尽调
export function delDiligence(id) {
  return request({
    url: '/project/diligence/remove/' + id,
    method: 'post'
  })
}


// 查询项目尽调详细
export function getAdjustDiligence(id) {
  return request({
    url: '/project/diligence/adjust/' + id,
    method: 'post'
  })
}

// 查询项目尽调详细
export function updateAdjustDiligence(data) {
  return request({
    url: '/project/diligence/adjust',
    method: 'post',
    data: data
  })
}


// 下载合同
export function exportWord(data,id){
	return request({
		url: `/project/diligence/exportWord/${data}/${id}`,
		method: 'get',
		responseType: "blob"
	})
}
// 生成授信上会报告
export function custExportWord(data){
	return request({
		url: `/cust/credit/exportWord/${data}`,
		method: 'get',
		responseType: "blob"
	})
}

// 生成项目尽调要素调整上会报告
export function diligenceExportWord(data,id){
	return request({
		url: `/project/diligence/exportysWord/${data}/${id}`,
		method: 'get',
		responseType: "blob"
	})
}
