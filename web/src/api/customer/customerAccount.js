import request from "@/utils/request";

// 查询用户账号列表
export function customerAcontInfoList(query) {
	return request({
		url: "/customeraccount/info/list",
		method: "get",
		params: query
	});
}

// 查询客户账号详细
export function customerAcontDetail(data) {
	return request({
		url: "/customeraccount/info/detial",
		method: "post",
		data: data
	});
}

// 新增客户银行账户信息
export function addCustomerAcont(data) {
	return request({
		url: "/customeraccount/info/add",
		method: "post",
		data: data
	});
}

// 修改客户银行账户信息
export function updateCustomerAcont(data) {
	return request({
		url: "/customeraccount/info/edit",
		method: "post",
		data: data
	});
}

// 删除客户银行账户信息
export function delCustBankInfo(accountId) {
	return request({
		url: "/cust/bank/" + accountId,
		method: "delete"
	});
}
