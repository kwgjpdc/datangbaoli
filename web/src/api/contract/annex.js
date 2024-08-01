import request from "@/utils/request";

// 查询附件列表
export function getContFileList(query) {
	return request({
		url: "/contFileInfo/list",
		method: "get",
		params: query
	});
}

// 查询附件详细
export function getContFileInfoDetail(id) {
	return request({
		url: "/contFileInfo/" + id,
		method: "get"
	});
}

// 附件新增
export function addContFileInfo(data) {
	return request({
		url: "/contFileInfo/add",
		method: "post",
		data: data
	});
}

// 附件编辑
export function editContFileInfo(data) {
	return request({
		url: "/contFileInfo/edit",
		method: "post",
		data: data
	});
}

// 删除附件
export function delContFileInfo(id) {
	return request({
		url: "/contFileInfo/remove/" + id,
		method: "post"
	});
}

// 下载合同
export function contFileExportWord(id) {
	return request({
		url: `/contFileInfo/exportWord/${id}`,
		method: "get",
		responseType: "blob"
	});
}
