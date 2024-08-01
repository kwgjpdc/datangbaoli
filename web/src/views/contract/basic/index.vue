<template>
	<div class="app-container" v-loading="loading">
		<!-- 查询条件 -->
		<el-form
			:model="queryParams"
			ref="queryRef"
			:inline="true"
			v-show="showSearch"
			label-width="110px"
		>
			<!-- 卖方客户名称 -->
			<el-form-item label="保理申请人名称" prop="sellCustomerName">
				<CustomerSelect
					:option="customer.optiona"
					:showValue="customer.showValueSell"
					:queryPropList="customer.queryPropList"
					:tablePropList="customer.tablePropList"
					@selectRow="customerSelectSell"
					style="width: 240px"
				></CustomerSelect>
			</el-form-item>
			<!-- 买方客户名称 -->
			<el-form-item label="核心企业名称" prop="coreEnterpriseName">
				<el-input
					v-model="queryParams.params.coreEnterpriseName"
					placeholder="请输入核心企业名称"
					clearable
					@keyup.enter="handleQuery"
					:style="formItemContentStyle"
				/>
				<!-- <CustomerSelect :option="customer.optionb" :showValue="customer.showValueBuy"
                                :queryPropList="customer.queryPropList" :tablePropList="customer.tablePropList"
                                @selectRow="customerSelectBuy" style="width:240px;"></CustomerSelect> -->
			</el-form-item>
			<!-- 项目名称 -->
			<el-form-item label="项目名称" prop="projectName">
				<el-input
					v-model="queryParams.projectName"
					placeholder="请输入项目名称"
					readonly
					@keyup.enter="handleQuery"
					suffix-icon="el-icon-search"
					:style="formItemContentStyle"
					@click="openProjectNoDialog()"
				/>
			</el-form-item>
			<!-- 客户经理 -->
			<el-form-item label="客户经理" prop="customerManagerName">
				<el-input
					v-model="queryParams.params.customerManagerName"
					placeholder="请输入客户经理"
					clearable
					@keyup.enter="handleQuery"
					:style="formItemContentStyle"
				/>
			</el-form-item>
			<!-- 录入开始日期 -->
			<el-form-item label="录入开始日期" prop="beginCreateTime">
				<el-date-picker
					v-model="queryParams.params.beginCreateTime"
					type="date"
					value-format="YYYY-MM-DD"
					clearable
					placeholder="日期选择"
					:style="formItemContentStyle"
				/>
			</el-form-item>
			<!-- 录入截止日期 -->
			<el-form-item label="录入截止日期" prop="endCreateTime">
				<el-date-picker
					v-model="queryParams.params.endCreateTime"
					type="date"
					value-format="YYYY-MM-DD"
					clearable
					placeholder="日期选择"
					:style="formItemContentStyle"
				/>
			</el-form-item>
			<!-- 合同状态 -->
			<el-form-item label="合同状态" prop="statusList">
				<el-checkbox-group v-model="statusList">
					<el-checkbox
						v-for="dict in contract_status"
						:label="dict.value"
						:name="dict.value"
						:key="dict.value"
					>
						{{ dict.label }}
					</el-checkbox>
				</el-checkbox-group>
			</el-form-item>
			<!-- 是否有效 -->
			<el-form-item label="是否有效" prop="validFlag">
				<el-select
					v-model="queryParams.validFlag"
					placeholder="请选择是否有效"
					clearable
					:style="formItemContentStyle"
				>
					<el-option
						v-for="dict in sys_yes_no"
						:key="dict.value"
						:label="dict.label"
						:value="dict.value"
					/>
				</el-select>
			</el-form-item>
			<!-- 查询按钮 -->
			<el-form-item>
				<el-button type="primary" icon="Search" @click="handleQuery"
					>搜索</el-button
				>
				<el-button icon="Refresh" @click="resetQuery">重置</el-button>
			</el-form-item>
		</el-form>
		<!-- 操作区 -->
		<el-row :gutter="10" class="mb8">
			<el-col :span="1.5">
				<el-button
					type="primary"
					plain
					icon="Plus"
					@click="handleAdd"
					v-hasPermi="['contract:info:add']"
				>
					新增
				</el-button>
			</el-col>

			<el-col :span="1.5">
				<el-button
					:disabled="!tableSelectedRows.length"
					type="primary"
					plain
					icon="Plus"
					@click="handleSupp"
					v-hasPermi="['contract:info:add']"
				>
					补录合同
				</el-button>
			</el-col>
			<right-toolbar v-model:showSearch="showSearch" @queryTable="getList" />
		</el-row>
		<!-- 表格 -->
		<el-table :data="contractList" @selection-change="handleTableSelectedRows">
			<el-table-column type="selection" width="40" align="center" />
			<el-table-column fixed label="序号" width="55" align="center">
				<template #default="scope">
					{{ scope.$index + 1 }}
				</template>
			</el-table-column>
			<el-table-column fixed label="合同编号" width="200" align="center">
				<template #default="scope">
					<el-button link type="primary" @click="handleView(scope.row)">{{
						scope.row.contractNo
					}}</el-button>
				</template>
			</el-table-column>
			<el-table-column
				fixed
				label="合同名称"
				width="200"
				align="center"
				prop="otherContractName"
			/>
			<el-table-column
				label="保理申请人名称"
				width="200"
				align="center"
				prop="factoringApplicantName"
			/>
			<el-table-column
				label="核心企业名称"
				width="200"
				align="center"
				prop="coreEnterpriseName"
			/>
			<el-table-column
				label="首次审批时间"
				width="200"
				align="center"
				prop="firstApproveDate"
			/>
			<el-table-column
				label="用印时间"
				width="200"
				align="center"
				prop="baseSealTime"
			/>
			<el-table-column
				label="签约状态"
				width="200"
				align="center"
				prop="baseSignStatus"
			/>
			<el-table-column
				label="签约意见"
				width="200"
				align="center"
				prop="baseSignOpinion"
			/>
			<el-table-column label="上会时间" width="200" align="center" prop="" />
			<el-table-column
				label="审批状态"
				width="200"
				align="center"
				prop="status"
			>
				<template #default="scope">
					<dict-tag :options="contract_status" :value="scope.row.status" />
				</template>
			</el-table-column>
			<el-table-column
				label="操作"
				align="center"
				class-name="small-padding fixed-width"
				fixed="right"
				width="200"
			>
				<template #default="scope">
					<div class="button-display">
						<el-button
							link
							type="primary"
							icon="Edit"
							@click="handleUpdate(scope.row)"
							v-hasPermi="['project:Contract:edit']"
							v-if="scope.row.status == 1"
						>
							修改
						</el-button>
						<el-button
							link
							type="primary"
							icon="Delete"
							@click="handleDelete(scope.row)"
							v-hasPermi="['project:Contract:remove']"
							v-if="scope.row.status == 1"
						>
							删除
						</el-button>

						<el-button
							link
							type="primary"
							icon="Download"
							@click="handleDownload(scope.row)"
							v-hasPermi="['demo:info:export']"
							>导出</el-button
						>

						<el-dropdown v-if="scope.row.status == 3">
							<el-button type="primary" link>
								更多<el-icon class="el-icon--right"><arrow-down /></el-icon>
							</el-button>
							<template #dropdown>
								<el-dropdown-menu>
									<el-dropdown-item>
										<el-button
											link
											type="primary"
											icon="Operation"
											@click="handleUpdate(scope.row)"
										>
											合同要素调整
										</el-button>
									</el-dropdown-item>
									<!-- <el-dropdown-item>
                                        <el-button 
                                            link 
                                            type="primary" 
                                            icon="Histogram" 
                                            @click="handleAdjust(scope.row)"
                                        >
                                            生成要素调整上会报告
                                        </el-button>
                                    </el-dropdown-item> -->
								</el-dropdown-menu>
							</template>
						</el-dropdown>
					</div>
				</template>
			</el-table-column>
		</el-table>
		<!-- 分页 -->
		<pagination
			v-show="total > 0"
			:total="total"
			v-model:page="queryParams.pageNum"
			v-model:limit="queryParams.pageSize"
			@pagination="getList"
		/>
		<!-- Dialog -->
		<DialogTableMulti
			v-model:multiQuery="multiQuery"
			v-model:open="multiQuery.open"
			v-model:tableData="tableDataMulti"
			v-model:prop="propMulti"
			@selectRow="selectRowMulti"
			@pageChange="pageChangeMulti"
		/>
		<!-- dialog：补录合同信息 -->
		<DialogSuppContract
			v-model:open="dialogSuppIsOpen"
			:tableSelectedRows="tableSelectedRows"
			@updateList="getList"
		/>
	</div>
</template>

<script setup>
import { ref, onBeforeMount } from "vue";
import { listContract, delContract, exportWord } from "@/api/contract";
import { listDiligence } from "@/api/project/diligence";
import CustomerSelect from "@/components/CustomerSelect";
import DialogSuppContract from "./dialogSuppContract";

import { ElMessage } from "element-plus";

const customer = ref({
	showValueSell: "",
	sellCustomerName: "",
	buyCustomerName: "",
	optiona: {
		inputW: "100%",
		placeholder: "请选择保理申请人名称",
		dialogTitle: "保理申请人名称",
		queryUrl: "/cust/customer/list"
	},
	optionb: {
		inputW: "100%",
		placeholder: "请选择核心企业名称",
		dialogTitle: "核心企业名称",
		queryUrl: "/cust/customer/list"
	},
	queryPropList: [
		{
			prop: "customerNo",
			label: "客户编号"
		},
		{
			prop: "customerName",
			label: "客户名称"
		}
	],
	tablePropList: [
		{
			prop: "customerNo",
			label: "客户编号"
		},
		{
			prop: "customerName",
			label: "客户名称"
		}
	]
});

// 当前组件对象
const { proxy } = getCurrentInstance();

// 路由对象
const router = useRouter();

// Form item 内容的统一宽度
const formItemContentStyle = { width: "240px" };

// 查询条件对象
const queryParams = ref({
	pageNum: 1,
	pageSize: 10,
	dueNo: null,
	projectDueId: null,
	projectName: null,
	customerManagerName: null,
	beginCreateTime: null,
	endCreateTime: null,
	validFlag: null,
	params: {
		status: "",
		sellCustomerNo: "",
		sellCustomerName: "",
		buyCustomerNo: "",
		buyCustomerName: "",
		coreEnterpriseName: ""
	}
});
const statusList = ref([]);

// 是否展示查询条件
const showSearch = ref(true);

// 系统字典
const { sys_yes_no, contract_status } = proxy.useDict(
	"sys_yes_no",
	"contract_status"
);

// 是否显示loading
const loading = ref(false);

// 合同集合
const contractList = ref([]);

// 查询数据总数
const total = ref(0);

// Dialog配置
const multiQuery = ref({
	title: "项目名称",
	open: false,
	currentPage: 1,
	total: 1,
	pageSize: 10
});

// Dialog表格对象
const tableDataMulti = ref([]);

// Dialog表格列配置
const propMulti = ref([
	{
		label: "审议编号",
		value: "dueNo"
	},
	{
		label: "项目名称",
		value: "name"
	}
]);

// 项目查询参数
const diligenceParamsMulti = ref({
	pageNum: 1,
	pageSize: 10
});

// 补充合同 dialog 显隐控制
const dialogSuppIsOpen = ref(false);
// table选中的rows
const tableSelectedRows = ref([]);

// -----------------------------------------------------

function handleDownload(row) {
	exportWord(row.contractId).then(res => {
		if (!res.code) {
			if (!res || res.size == 0) {
				ElMessage({
					message: "无业务合同信息",
					type: "error"
				});
				return;
			}
			const elink = document.createElement("a");
			elink.href = window.URL.createObjectURL(new Blob([res]));
			elink.style.display = "none";
			elink.setAttribute("download", "业务合同" + ".docx");
			document.body.appendChild(elink);
			elink.click();
			document.body.removeChild(elink);
		} else if (res.code == 500) {
			ElMessage({
				message: "无业务合同信息",
				type: "error"
			});
		} else {
			ElMessage({
				message: "无业务合同信息",
				type: "error"
			});
		}
	});
}

// table获取选中的rows
function handleTableSelectedRows(selectedRows) {
	tableSelectedRows.value = selectedRows;
}

// 查询合同列表
function getList() {
	loading.value = true;
	if (statusList.value.length) {
		queryParams.value.params["status"] = statusList.value.join(",");
	} else {
		queryParams.value.params["status"] = "";
	}
	listContract(queryParams.value)
		.then(response => {
			contractList.value = response.rows;
			total.value = response.total;
			loading.value = false;
		})
		.catch(() => {
			loading.value = false;
		});
}

// 查询按钮操作
function handleQuery() {
	queryParams.value.pageNum = 1;
	getList();
}

// 重置按钮操作
function resetQuery() {
	customer.value.showValue = "";
	queryParams.value.projectDueId = null;
	statusList.value = [];
	queryParams.value.params = {
		customerManagerName: "",
		beginCreateTime: "",
		endCreateTime: "",
		sellCustomerName: "",
		buyCustomerName: "",
		showValue: ""
	};
	customer.value.showValueSell = "";
	customer.value.sellCustomerName = "";
	customer.value.buyCustomerName = "";
	proxy.resetForm("queryRef");
}

// 补录合同按钮操作
function handleSupp() {
	if (tableSelectedRows.value.some(item => item.status !== "3")) {
		return proxy.$message.warning("请检查所选合同是否【已通过审批】！");
	}

	resetQuery();
	dialogSuppIsOpen.value = true;
}

// 新增按钮操作
function handleAdd() {
	resetQuery();
	router.push({
		name: "Contract/detail",
		state: { pageNum: queryParams.value.pageNum }
	});
}

// 删除按钮操作
function handleDelete(row) {
	loading.value = true;
	delContract(row.contractId)
		.then(() => {
			contractList.value.splice(contractList.value.indexOf(row), 1);
			proxy.$modal.msgSuccess("删除成功");
			loading.value = false;
		})
		.catch(() => {
			loading.value = false;
		});
}

// 修改按钮操作
function handleUpdate(row) {
	resetQuery();
	router.push({
		name: "Contract/detail",
		state: {
			contractId: row.contractId,
			editFlag: true,
			pageNum: queryParams.value.pageNum
		}
	});
}

// 查看详细链接操作
function handleView(row) {
	resetQuery();
	router.push({
		name: "Contract/detail",
		state: {
			contractId: row.contractId,
			viewFlag: true,
			pageNum: queryParams.value.pageNum
		}
	});
}

// Dialog表格选择行数据方法
function selectRowMulti(rows) {
	queryParams.value.projectDueId = rows.id;
	queryParams.value.projectName = rows.name;
}

// Dialog表格分页方法
function pageChangeMulti(pageNum) {
	loading.value = true;
	diligenceParamsMulti.pageNum = pageNum;
	listDiligence(diligenceParamsMulti)
		.then(response => {
			tableDataMulti.value = response.rows;
			multiQuery.value.total = response.total;
			multiQuery.value.open = true;
			loading.value = false;
		})
		.catch(() => {
			loading.value = false;
		});
}

// 打开项目Dialog
function openProjectNoDialog() {
	if (!tableDataMulti.value.length) {
		loading.value = true;
		listDiligence(diligenceParamsMulti)
			.then(response => {
				tableDataMulti.value = response.rows;
				multiQuery.value.total = response.total;
				multiQuery.value.open = true;
				loading.value = false;
			})
			.catch(() => {
				loading.value = false;
			});
	} else {
		multiQuery.value.open = true;
	}
}

function customerSelectSell(row) {
	//console.log(row)
	customer.value.showValueSell = row.customerName;
	// queryParams.value.params.sellCustomerNo = row.customerNo
	// queryParams.value.params.sellCustomerName = row.customerName
	queryParams.value.params.accountCustomerName = row.customerName;
}

function customerSelectBuy(row) {
	//console.log(row)
	customer.value.showValueBuy = row.customerName;
	queryParams.value.params.buyCustomerNo = row.customerNo;
	queryParams.value.params.buyCustomerName = row.customerName;
}

getList();
</script>

<style lang="scss" scoped>
.button-display {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-around;

	.el-button + .el-button {
		margin-left: 0;
	}
}
</style>
