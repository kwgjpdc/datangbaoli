import request from "@/utils/request";

// 查询合同列表
export function listContract(query) {
	return request({
		url: "/cont/list",
		method: "get",
		params: query
	});
}

// 查询合同详细
export function getContract(id) {
	return request({
		url: "/cont/" + id,
		method: "get"
	});
}

// 新增合同
export function addContract(data) {
	return request({
		url: "/cont/add",
		method: "post",
		data: data
	});
}

// 修改合同
export function updateContract(data) {
	return request({
		url: "/cont/edit",
		method: "post",
		data: data
	});
}

// 删除合同
export function delContract(id) {
	return request({
		url: "/cont/remove/" + id,
		method: "post"
	});
}

// 合同补录
export function insertContractInfo(data) {
	return request({
		url: "/cont/insertContractInfo-1",
		method: "post",
		data: data
	});
}

// 下载合同
export function exportWord(id) {
	return request({
		url: `/cont/exportWord/${id}`,
		method: "get",
		responseType: "blob"
	});
}
