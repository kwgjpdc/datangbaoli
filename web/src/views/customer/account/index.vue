<template>
	<div class="app-container">
		<!-- 查询表单组件 -->
		<QueryParams
			:queryParams="queryParams"
			:paramsItems="paramsItems"
			:showSearch="showSearch"
			@handleQuery="handleQuery"
			@resetQuery="resetQuery"
		></QueryParams>
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

			<el-table-column label="客户名称" align="center" prop="customerName">
				<template #default="scope">
					<el-button link type="primary" @click="handleView(scope.row)">
						{{ scope.row.customerName }}
					</el-button>
				</template>
			</el-table-column>

			<el-table-column label="客户种类" align="center" prop="customerType">
				<template #default="scope">
					<dict-tag :options="customer_type" :value="scope.row.customerType" />
				</template>
			</el-table-column>

			<el-table-column label="债务人名称" align="center" prop="obligorName" />

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
import { delInfo } from "@/api/customer/index";

import {
	customerAcontInfoList, // 客户账号管理-列表
	delCustomerAcont // 删除
} from "@/api/customer/customerAccount";

import { deepClone } from "@/utils/index";
import QueryParams from "@/components/QueryParams";

const { proxy } = getCurrentInstance();

const { customer_type } = proxy.useDict("customer_type");

const route = useRoute();

const router = useRouter();

const infoList = ref([]);
const loading = ref(true);
const showSearch = ref(true);
let custSelection = ref({});
let selectId = ref("");
let radio = ref("");
const total = ref(0);

const data = reactive({
	form: {},
	queryParams: {
		pageNum: 1,
		pageSize: 10,
		accountInfo: null,
		customerName: null,
		obligorName: null
	},
	paramsItems: [
		{
			type: "text",
			label: "客户名称",
			prop: "customerName",
			placeholder: "请输入客户名称"
		},
		{
			type: "text",
			label: "债务人名称",
			prop: "obligorName",
			placeholder: "请输入债务人名称"
		},
		{
			type: "text",
			label: "银行账号",
			prop: "accountInfo",
			placeholder: "请输入银行账号"
		}
	]
});

const { queryParams, paramsItems, form } = toRefs(data);

const uniqueId = ref("");

onActivated(() => {
	const time = route.query.t;

	if (time != null && time != uniqueId.value) {
		uniqueId.value = time;
		queryParams.value.pageNum = Number(route.query.pageNum);

		proxy.resetForm("queryRef");
		getList();
	}
});

/** 查询客户账号管理 - 列表 */
function getList() {
	loading.value = true;
	let paramsData = deepClone(queryParams.value);
	customerAcontInfoList(paramsData).then(response => {
		infoList.value = response.rows;
		total.value = response.total;
		loading.value = false;
	});
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

/** 新增按钮操作 */
function handleAdd() {
	reset();
	router.push({
		path: "/customer/account/detail",
		query: {
			pageNum: queryParams.value.pageNum
		}
	});
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

// 查看页面
function handleView(row) {
	reset();
	const customerId = row.customerId;
	const obligorId = row.obligorId;
	router.push({
		path: "/customer/account/detail",
		query: {
			customerId,
			obligorId,
			viewFlag: true,
			pageNum: queryParams.value.pageNum
		}
	});
}

/** 删除按钮操作 */
function handleDelete(row) {
	const customerIds = row.customerId;
	const obligorId = row.obligorId;
	proxy.$modal
		.confirm("确认是否删除？")
		.then(function () {
			return delCustomerAcont(customerIds, obligorId);
		})
		.then(() => {
			getList();
			proxy.$modal.msgSuccess("删除成功");
		})
		.catch(() => {});
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
