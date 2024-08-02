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
			<el-table-column label="合同编号" align="center" prop="contractNum" />
			<el-table-column label="合同名称" align="center" prop="contractName" />
			<el-table-column
				label="操作"
				align="center"
				class-name="small-padding"
				width="250"
			>
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
						<!-- <el-button
							link
							type="primary"
							icon="Delete"
							@click="handleDelete(scope.row)"
							v-hasPermi="['demo:info:remove']"
							>删除</el-button
						> -->
						<el-button
							link
							type="primary"
							icon="Download"
							@click="handleDownload(scope.row)"
							v-hasPermi="['demo:info:export']"
							>导出</el-button
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
	getContFileList,
	delContFileInfo,
	contFileExportWord
} from "@/api/contract/annex";
import { deepClone } from "@/utils/index";
import QueryParams from "@/components/QueryParams";
import { ElMessage } from "element-plus";

const { proxy } = getCurrentInstance();
const route = useRoute();
const router = useRouter();

const infoList = ref([]);
const loading = ref(true);
const showSearch = ref(true);
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
			label: "合同编号",
			prop: "contractNum",
			placeholder: "请输入合同编号"
		},
		{
			type: "text",
			label: "合同名称",
			prop: "contractName",
			placeholder: "请输入合同名称"
		}
	]
});

const { queryParams, paramsItems, form } = toRefs(data);

const uniqueId = ref("");

// ------------------------------------------------------------------------

onActivated(() => {
	const time = route.query.t;

	if (time != null && time != uniqueId.value) {
		uniqueId.value = time;
		queryParams.value.pageNum = Number(route.query.pageNum);

		proxy.resetForm("queryRef");
		getList();
	}
});

// 附件导出
function handleDownload(row) {
	loading.value = true;
	contFileExportWord(row.id)
		.then(res => {
			if (!res.code) {
				if (!res || res.size == 0) {
					ElMessage({
						message: "无附件合同信息",
						type: "error"
					});
					return;
				}
				const elink = document.createElement("a");
				elink.href = window.URL.createObjectURL(new Blob([res]));
				elink.style.display = "none";
				elink.setAttribute("download", "附件合同" + ".docx");
				document.body.appendChild(elink);
				elink.click();
				document.body.removeChild(elink);
			} else if (res.code == 500) {
				ElMessage({
					message: "无附件合同信息",
					type: "error"
				});
			} else {
				ElMessage({
					message: "无附件合同信息",
					type: "error"
				});
			}
		})
		.finally(() => {
			loading.value = false;
		});
}

/* 列表 */
function getList() {
	loading.value = true;
	let paramsData = deepClone(queryParams.value);
	getContFileList(paramsData).then(response => {
		infoList.value = response.rows;
		total.value = response.total;
		loading.value = false;
	});
}

// 表单重置
function reset() {
	form.value = {};
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
		path: "/contract/annex/detail",
		query: {
			pageNum: queryParams.value.pageNum
		}
	});
}

/** 修改按钮操作 */
function handleUpdate(row) {
	reset();
	const contractFileId = row.id;
	router.push({
		name: "Annex/detail",
		state: {
			contractFileId,
			editFlag: true,
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
		path: "/contract/annex/detail",
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
	const id = row.id;
	proxy.$modal
		.confirm("确认是否删除？")
		.then(function () {
			return delContFileInfo(id);
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
