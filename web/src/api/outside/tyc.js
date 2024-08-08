import request from "@/utils/request";

// 天眼查详情 逻辑
export function tycInfo(query) {
	return request({
		url: "/tyc/baseInfo",
		method: "get",
		params: query
	});
}
