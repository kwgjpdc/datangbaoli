<template>
	<div class="app-container">
		<!-- 查询表单组件 -->
		<!-- <QueryParams
			:queryParams="queryParams"
			:paramsItems="paramsItems"
			:showSearch="showSearch"
			@handleQuery="handleQuery"
			@resetQuery="resetQuery"
		></QueryParams> -->
		<!-- 查询表单组件 end-->

		<el-row :gutter="10" class="mb8" style="margin-top: 20px">
			<el-col :span="1.5">
				<el-button
					type="primary"
					plain
					icon="Plus"
					@click="handleAdd"
					v-hasPermi="['customer:account:add']"
					>新增</el-button
				>
			</el-col>

			<right-toolbar
				v-model:showSearch="showSearch"
				@queryTable="getList"
			></right-toolbar>
		</el-row>
		<!-- 查询数据操作 end-->

		<!-- 查询结果 -->
		<el-table
			v-loading="loading"
			:data="infoList"
			style="width: 100%"
			@header-dragend="changeColwidth"
		>
			<el-table-column type="index" align="center" width="100" label="序号" />

			<el-table-column label="客户名称" align="center" prop="customerName" />

			<el-table-column label="客户种类" align="center" prop="customerType" />

			<el-table-column label="债务人名称" align="center" prop="obligorName" />

			<el-table-column label="备注" align="center" prop="remark" />

			<el-table-column label="操作" align="center" class-name="small-padding">
				<template #default="scope">
					<div class="button-display" style="justify-content: center">
						<el-button
							link
							type="primary"
							icon="Edit"
							@click="handleUpdate(scope.row)"
							v-hasPermi="['demo:info:edit']"
							>修改</el-button
						>
						<el-button
							link
							type="primary"
							icon="Delete"
							@click="handleDelete(scope.row)"
							v-hasPermi="['demo:info:remove']"
							>删除</el-button
						>
					</div>
				</template>
			</el-table-column>
		</el-table>
		<pagination
			v-show="total > 0"
			:total="total"
			v-model:page="queryParams.pageNum"
			v-model:limit="queryParams.pageSize"
			@pagination="getList"
		/>
	</div>
</template>

<script setup name="Info">
import {
	listInfo,
	getInfo,
	delInfo,
	addInfo,
	updateInfo,
	getCustomerList,
	saveData
} from "@/api/customer/index";

import {
	customerAcontInfoList // 银行账号列表
} from "@/api/customer/customerAccount";
import { listUser } from "@/api/system/user";
import { deepClone, developTip } from "@/utils/index";
import QueryParams from "@/components/QueryParams";
import { ElMessage } from "element-plus";
import { custExportWord } from "@/api/project/diligence";
const { proxy } = getCurrentInstance();
const route = useRoute();
const router = useRouter();

const infoList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
let custSelection = ref({});
let selectId = ref("");
let radio = ref("");
const total = ref(0);
const title = ref("");
const checkList = ref(["customerManagerName", "createby"]);
const checkItem = ref("");
const openBatch = ref(false);
const batchLoading = ref(true);
const titleBatch = ref("批量导入");
const creditEffectiveDate = ref([]);
let batchCustomerList = ref([]);
const {
	cust_register_country,
	cust_customer_type,
	cust_customer_category,
	sys_true_or_false,
	cust_industry_type,
	sys_pass_status,
	sys_yes_no
} = proxy.useDict(
	"cust_register_country",
	"cust_customer_type",
	"cust_customer_category",
	"sys_true_or_false",
	"cust_industry_type",
	"sys_pass_status",
	"sys_yes_no"
); //下拉框字典

const data = reactive({
	form: {},
	queryParams: {
		pageNum: 1,
		pageSize: 10,
		customerNo: null,
		customerName: null,
		name: null,
		creditCode: null,
		customerManagerName: null,
		quotaStatus: "",
		isCredit: "",
		creditEffectiveDate: [],
		params: {
			creditEffectiveStartDate: "",
			creditEffectiveEndDate: ""
		}
	},
	paramsItems: [
		{
			type: "text",
			label: "客户编号",
			prop: "customerNo",
			placeholder: "请输入客户编号"
		},
		{
			type: "text",
			label: "客户名称",
			prop: "customerName",
			placeholder: "请输入客户名称"
		},
		{
			type: "text",
			label: "简称",
			prop: "name",
			placeholder: "请输入简称"
		},
		{
			type: "text",
			label: "工商注册号/\n统一社会信用代码",
			prop: "creditCode",
			placeholder: "请输入工商注册号/统一社会信用代码"
		},
		{
			type: "text",
			label: "客户经理",
			prop: "customerManagerName",
			placeholder: "请输入客户经理"
		},
		{
			type: "select_all",
			label: "是否发起授信",
			prop: "isCredit",
			placeholder: "请选择",
			options: sys_yes_no
		},
		{
			type: "select_all",
			label: "授信状态",
			prop: "quotaStatus",
			placeholder: "请选择",
			options: sys_pass_status
		},
		{
			type: "daterange",
			label: "授信生效日",
			prop: "creditEffectiveDate",
			placeholder: ["开始日期", "结束日期"],
			format: "YYYY-MM-DD"
		}
	]
});

const { queryParams, paramsItems, form } = toRefs(data);

const uniqueId = ref("");
onActivated(() => {
	const time = route.query.t;
	console.log(route.query.t);
	if (time != null && time != uniqueId.value) {
		uniqueId.value = time;
		queryParams.value.pageNum = Number(route.query.pageNum);
		console.log(queryParams.value);
		proxy.resetForm("queryRef");
		getList();
	}
});
/** 查询用户信息列表 */
function getList() {
	loading.value = true;
	radio.value = "";
	custSelection.value = {};
	let paramsData = deepClone(queryParams.value);
	delete paramsData.creditEffectiveDate;
	const creditEffectiveDate = queryParams.value.creditEffectiveDate;
	if (null != creditEffectiveDate && "" != creditEffectiveDate) {
		paramsData.params.creditEffectiveStartDate = creditEffectiveDate[0];
		paramsData.params.creditEffectiveEndDate = creditEffectiveDate[1];
	} else {
		paramsData.params.creditEffectiveStartDate = "";
		paramsData.params.creditEffectiveEndDate = "";
	}
	customerAcontInfoList(paramsData).then(response => {
		infoList.value = response.rows;
		total.value = response.total;
		loading.value = false;
	});
	// getCustomerList().then(response => {
	//   useCompanyStore.setCompanyList(response.rows);
	// });
}

// 获取审议编号
function getCreditNo(row) {
	if (row.creditList && row.creditList.length > 0) {
		return row.creditList[0].creditNo;
	} else {
		return "";
	}
}

// 取消按钮
function cancel() {
	open.value = false;
	reset();
}

// 表单重置
function reset() {
	form.value = {
		customerId: null,
		deptId: null,
		customerNo: null,
		registerCountry: null,
		customerName: null,
		customerType: null,
		customerManagerName: null,
		customerManagerId: null,
		parentCustomerId: null,
		customerCategory: null,
		isCoreEnterprise: null,
		createBy: null,
		updateBy: null,
		isDeleted: null,
		updateTime: null,
		createTime: null
	};
	proxy.resetForm("queryRef");
}

/** 搜索按钮操作 */
function handleQuery(params) {
	if (params) {
		queryParams.value = params;
	}
	queryParams.value.pageNum = 1;
	getList();
}

/** 重置按钮操作 */
function resetQuery(params) {
	handleQuery(params);
}

// 选中数据
function handleSelectionChange(selection) {
	custSelection.value = selection;
	selectId.value = selection.customerId;
	// selectId.value = selection.customerNo;
	// console.log('选择了', selection)
}

/** 新增按钮操作 */
function handleAdd() {
	reset();
	//
	router.push({
		path: "/customer/account/detail",
		query: {
			pageNum: queryParams.value.pageNum
		}
	});
	// open.value = true;
	// title.value = "添加用户信息";
}

/** 修改按钮操作 */
function handleUpdate(row) {
	reset();
	const customerId = row.customerId;
	const obligorId = row.obligorId;
	router.push({
		path: "/customer/account/detail",
		query: {
			customerId,
			obligorId,
			pageNum: queryParams.value.pageNum
		}
	});
}
// 发起授信
function handleCredit(row) {
	reset();
	const _customerId = row.customerId;
	let status = row.cstatus;
	if (status == 2) {
		proxy.$modal.msgSuccess("此客户已发起授信流程");
	} else if (status == 3 || status == 4) {
		proxy.$modal
			.confirm("此客户已存在授信结果是否重新发起授信？")
			.then(function () {
				router.push({
					path: "/customer/customer/creditDetail",
					query: {
						customerId: _customerId,
						pageNum: queryParams.value.pageNum
					}
				});
			})
			.catch(() => {});
	} else {
		router.push({
			path: "/customer/customer/creditDetail",
			query: {
				customerId: _customerId,
				pageNum: queryParams.value.pageNum
			}
		});
	}
	// const _customerId = row.customerId
	// router.push({
	// 	path: '/customer/customer/creditDetail',
	// 	query: {
	// 		customerId: _customerId,
	// 		pageNum: queryParams.value.pageNum
	// 	}
	// });
}

function handleCreditView(row) {
	reset();
	const _customerId = row.customerId;
	router.push({
		path: "/customer/customer/creditDetail",
		query: {
			customerId: _customerId,
			viewFlag: true,
			pageNum: queryParams.value.pageNum
		}
	});
}
// 查看页面
function handleView(row) {
	reset();
	const _customerId = row.customerId;
	router.push({
		path: "/customer/customer/detail",
		query: {
			customerId: _customerId,
			viewFlag: true,
			pageNum: queryParams.value.pageNum
		}
	});
}

/** 提交按钮 */
function submitForm() {
	proxy.$refs["infoRef"].validate(valid => {
		if (valid) {
			if (form.value.customerId != null) {
				updateInfo(form.value).then(response => {
					proxy.$modal.msgSuccess("修改成功");
					open.value = false;
					getList();
				});
			} else {
				addInfo(form.value).then(response => {
					proxy.$modal.msgSuccess("新增成功");
					open.value = false;
					getList();
				});
			}
		}
	});
}

/** 删除按钮操作 */
function handleDelete(row) {
	const _customerIds = row.customerId || ids.value;
	proxy.$modal
		.confirm('是否确认删除用户信息编号为"' + _customerIds + '"的数据项？')
		.then(function () {
			return delInfo(_customerIds);
		})
		.then(() => {
			getList();
			proxy.$modal.msgSuccess("删除成功");
		})
		.catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
	let paramsData = deepClone(queryParams.value);
	delete paramsData.creditEffectiveDate;
	const creditEffectiveDate = queryParams.value.creditEffectiveDate;
	if (null != creditEffectiveDate && "" != creditEffectiveDate) {
		paramsData.params.creditEffectiveStartDate = creditEffectiveDate.value[0];
		paramsData.params.creditEffectiveEndDate = creditEffectiveDate.value[1];
	} else {
		paramsData.params.creditEffectiveStartDate = "";
		paramsData.params.creditEffectiveEndDate = "";
	}
	proxy.download(
		"/cust/customer/export",
		{
			...paramsData.value
		},
		`info_${new Date().getTime()}.xlsx`
	);
}

function handleAddBank(row) {
	console.log(row);
	const _customerId = row.customerId || ids.value;
	router.push({
		path: "/customer/customer/custbankinfo",
		query: {
			customerId: _customerId
		}
	});
}

function handleBatch() {
	// console.log("123")
	openBatch.value = true;
}

function handleSaveData() {
	batchLoading.value = true;
	if (batchCustomerList.value.length) {
		batchCustomerList.value.forEach(element => {
			element.contactList = [element.contact];
		});
		saveData({
			customerList: batchCustomerList.value
		}).then(response => {
			batchLoading.value = false;
			proxy.$modal.msgSuccess("导入成功");
			openBatch.value = false;
			getList();
		});
	}
}
// 取消按钮
function cancelSaveData() {
	openBatch.value = false;
	reset();
}

getList();
</script>

<style lang="scss" scoped>
.button-display {
	display: flex;
}

.el-form {
	:deep(.el-form-item--default .el-form-item__label) {
		white-space: pre-line;
		line-height: 20px;
		display: flex;
		align-items: center;
	}
}
</style>
