<template>
	<el-card>
		<el-form
			ref="elFormRef"
			:model="formData"
			:rules="isView ? {} : rules"
			:inline="true"
			label-width="160px"
			:disabled="isView"
		>
			<el-form-item label="编号" prop="receivableNumber">
				<div class="form-item__block">
					<el-input
						disabled
						v-model="formData.receivableNumber"
						:placeholder="showPlaceholder('保存后自动生成')"
						clearable
						:style="formItemContentStyle"
						maxlength="32"
					/>
				</div>
			</el-form-item>

			<el-form-item label="保理合同编号" prop="contractNum">
				<div class="form-item__block">
					<CustomerSelect
						:showValue="formData.contractNum"
						:option="config.option"
						:queryPropList="config.queryPropList"
						:tablePropList="config.tablePropList"
						@selectRow="configSelectRow"
					/>
				</div>
			</el-form-item>

			<el-form-item label="保理申请人" prop="customerName">
				<div class="form-item__block">
					<el-input
						disabled
						v-model="formData.customerName"
						:placeholder="showPlaceholder('请先选择保理主合同标号')"
						clearable
						:style="formItemContentStyle"
						maxlength="32"
					/>
				</div>
			</el-form-item>

			<el-card shadow="never">
				<template #header>
					<span>明细表</span>
					<el-button
						:disabled="formData.carList.length"
						style="float: right; padding: 3px 0; margin-right: 20px"
						type="primary"
						link
						@click="dialogAdd()"
						>新增</el-button
					>
				</template>

				<el-table
					:data="formData.carList"
					@selection-change="handleSelectionChange"
				>
					<el-table-column
						label="基础交易合同编号及名称"
						align="center"
						prop="transactionContNumName"
					>
					</el-table-column>

					<el-table-column label="债务人名称" align="center" prop="debtName">
					</el-table-column>

					<el-table-column
						label="应收账款金额"
						align="center"
						prop="receivableNum"
					>
					</el-table-column>

					<el-table-column
						label="发票号码凭证号码"
						align="center"
						prop="invoiceNum"
					>
					</el-table-column>

					<el-table-column
						label="应收账款到期日"
						align="center"
						prop="receivableEndDate"
					>
					</el-table-column>

					<el-table-column label="备注" align="center" prop="remark">
					</el-table-column>

					<el-table-column
						label="操作"
						align="center"
						fixed="right"
						width="150"
						class-name="small-padding fixed-width"
						v-if="!props.routerQueryObj.viewFlag"
					>
						<template #default="scope">
							<el-button
								link
								type="primary"
								icon="Edit"
								@click="handleUpdate(scope.row)"
								v-hasPermi="['cust:contact:edit']"
								title="修改"
							></el-button>

							<el-button
								link
								type="primary"
								icon="Delete"
								@click="handleDelete(scope.row)"
								v-hasPermi="['cust:contact:remove']"
								title="删除"
							></el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-card>
		</el-form>

		<!-- 添加或修改用户配置对话框 -->
		<el-dialog
			title="明细"
			:model-value="openAccountAdd"
			width="800px"
			@closed="closeAccountAdd(false)"
		>
			<el-form
				ref="formInput"
				label-width="200px"
				label-position="top"
				:model="dialogFormData"
				:rules="dialogRules"
			>
				<el-row>
					<el-col :span="12">
						<el-form-item
							label="基础交易合同编号及名称"
							prop="transactionContNumName"
						>
							<el-input
								v-model="dialogFormData.transactionContNumName"
								maxlength="100"
								placeholder="请输入基础交易合同编号及名称"
								:style="{ width: '80%' }"
							/>
						</el-form-item>
					</el-col>

					<el-col :span="12">
						<el-form-item label="债务人名称" prop="debtName">
							<el-input
								v-model="dialogFormData.debtName"
								maxlength="100"
								placeholder="请输入债务人名称"
								:style="{ width: '80%' }"
							/>
						</el-form-item>
					</el-col>

					<el-col :span="12">
						<el-form-item label="应收账款金额" prop="receivableNum">
							<el-input
								placeholder="请输入应收账款金额"
								maxlength="100"
								v-model="dialogFormData.receivableNum"
								:style="{ width: '80%' }"
							></el-input>
						</el-form-item>
					</el-col>

					<el-col :span="12">
						<el-form-item label="发票号码凭证号码" prop="invoiceNum">
							<el-input
								placeholder="请输入账号"
								maxlength="100"
								v-model="dialogFormData.invoiceNum"
								:style="{ width: '80%' }"
							></el-input>
						</el-form-item>
					</el-col>

					<el-col :span="12">
						<el-form-item label="应收账款到期日" prop="receivableEndDate">
							<el-date-picker
								v-model="dialogFormData.receivableEndDate"
								placeholder="请选择到期日"
								type="date"
								value-format="YYYY-MM-DD"
								:style="{ width: '80%' }"
							/>
						</el-form-item>
					</el-col>

					<el-col :span="12">
						<el-form-item label="备注" prop="remark">
							<el-input
								placeholder="请输入备注"
								maxlength="1000"
								v-model="dialogFormData.remark"
								:style="{ width: '80%' }"
							></el-input>
						</el-form-item>
					</el-col>

					<el-col :span="24">
						<el-row justify="end">
							<el-button type="primary" @click="saveDialog">保存</el-button>
							<el-button type="primary" @click="closeAccountAdd(false)"
								>取消</el-button
							>
						</el-row>
					</el-col>
				</el-row>
			</el-form>
		</el-dialog>
	</el-card>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { StrUtil } from "@/utils/StrUtil";
import { deepClone } from "@/utils/index";
import CustomerSelect from "@/components/CustomerSelect";

// 组件属性
const props = defineProps({
	data: {
		type: Object,
		default: {}
	},
	proDetail: {
		type: Object,
		default: {}
	},
	routerQueryObj: {
		type: Object,
		default: {}
	}
});

let openAccountAdd = ref(false); //新增账号弹窗

// 组件事件
const emit = defineEmits(["update:data"]);

// vue实例对象
const { proxy } = getCurrentInstance();

// 表单对象
const elFormRef = ref(null);

// 表单数据
const formData = reactive(props.data);

// 表单验证规则
const rules = ref({
	projectNo: [
		{
			required: true,
			message: "尽调编号不能为空",
			trigger: "change"
		}
	]
});

// dialog 表单
let dialogFormData = ref({
	transactionContNumName: null, // 基础交易合同编号及名称
	debtName: null, //债务人名称
	receivableNum: null, //应收账款金额
	invoiceNum: null, // 发票号码
	receivableEndDate: null, //应收账款到期日
	remark: null
}); //后面要进行修改的对象用let定义

const dialogType = ref("add"); // add新增 edit编辑

const dataScope = reactive({
	dialogRules: {
		transactionContNumName: [
			{
				required: true,
				message: "基础交易合同编号及名称不能为空",
				trigger: "change"
			}
		],
		debtName: [
			{ required: true, message: "债务人名称不能为空", trigger: "change" }
		],
		receivableNum: [
			{ required: true, message: "应收账款金额不能为空", trigger: "change" }
		],
		invoiceNum: [
			{ required: true, message: "发票号码不能为空", trigger: "change" }
		],
		receivableEndDate: [
			{ required: true, message: "应收账款到期日为空", trigger: "change" }
		]
	},
	config: {
		option: {
			inputW: "100%",
			dialogW: "1000px",
			placeholder: "请选择合同信息",
			dialogTitle: "合同信息",
			queryUrl: "/cont/list"
		},
		queryPropList: [
			{
				prop: "contractNo",
				label: "合同编号"
			},
			{
				prop: "otherContractName",
				label: "合同名称"
			},
			{
				prop: "factoringApplicantName",
				label: "申请人"
			}
		],
		tablePropList: [
			{
				prop: "contractNo",
				label: "合同编号"
			},
			{
				prop: "otherContractName",
				label: "合同名称"
			},
			{
				prop: "factoringApplicantName",
				label: "申请人"
			}
		]
	}
});
const { dialogRules, config } = toRefs(dataScope);

// 页面是View状态
const isView = computed(() => {
	let result = false;
	if (
		props.routerQueryObj.viewFlag === undefined ||
		props.routerQueryObj.viewFlag === null
	) {
		result = false;
	} else {
		result = props.routerQueryObj.viewFlag;
	}
	return result;
});

// 侦听表单数据变化
watch(
	formData,
	newValue => {
		emit("update:data", newValue);
	},
	{ deep: true }
);

//----------------------- ref, recative, watch --------------------------------------------------------

function configSelectRow(row) {
	// projectDueId  尽调id
	// contractId  合同id
	// otherContractName  项目尽调名称

	formData.contractId = row.contractId; // 合同id
	formData.contractNum = row.contractNo; // 合同编码；
	formData.customerName = row.factoringApplicantName; // 合同申请人
	formData.projDueDiligenceId = row.projectDueId || 52; // 尽调id
	formData.otherContractName = row.otherContractName; // 尽调项目名称
}

// dialog  数据修改
function handleUpdate(rows) {
	dialogAdd(rows);
}

// dialog 数据移除
function handleDelete(rows) {
	proxy.$modal
		.confirm("是否确认数据项？")
		.then(function () {
			formData.carList = formData.carList.filter(item => {
				return item.transactionContNumName !== rows.transactionContNumName;
			});
		})
		.catch(e => {
			console.log(e);
		});
}

// dialog打开
function dialogAdd(row) {
	openAccountAdd.value = true;

	// 根据row 判断 是 【编辑】还是 【新增】
	if (row) {
		dialogType.value = "edit";

		dialogFormData.value = deepClone(row);
	} else {
		dialogType.value = "add";
	}
}
// Form item 内容的统一宽度
const formItemContentStyle = { width: "100%" };

// 重置添加联系人
function resetDialogForm() {
	dialogFormData.value = {
		accountType: null,
		currencyType: null,
		accountBankInfo: null,
		accountName: null,
		accountInfo: null,
		remark: null
	};
	proxy.$refs["formInput"].clearValidate();
}

// dialog 保存
function saveDialog() {
	proxy.$refs["formInput"].validate(valid => {
		if (valid) {
			if (dialogType.value === "edit") {
				// 修改
				formData.carList = formData.carList.map(item => {
					if (
						item.transactionContNumName ==
						dialogFormData.value.transactionContNumName
					) {
						return dialogFormData.value;
					} else {
						return item;
					}
				});
			} else {
				// 新增
				formData.carList.push(dialogFormData.value);
			}

			openAccountAdd.value = false;
			resetDialogForm();
		}
	});
}

// dialog 关闭
function closeAccountAdd() {
	resetDialogForm();
	openAccountAdd.value = false;
}

// 显示placeholder占位字符
function showPlaceholder(txt) {
	return isView.value ? " " : txt;
}

// 验证业务类型
function validateInform(rule, value, callback) {
	if (StrUtil.isBlank(value)) {
		callback(new Error("业务类型不能为空"));
	} else {
		if (
			formData.agreeInform === "6" &&
			StrUtil.isBlank(formData.agreeInformOther)
		) {
			callback(new Error("其他业务类型输入不能为空"));
		} else {
			callback();
		}
	}
}

// 监听input:number的字段长度问题
function handleInput(value, name, len = 32) {
	// 如果输入长度超过5，截取前5位
	if (value.length > len) {
		formData[name] = value.slice(0, len);
	}
}

// 验证表单
async function validate(callback) {
	await elFormRef.value.validate((valid, fields) => {
		callback(valid, fields);
	});
}

// 父组件可以调用的方法
defineExpose({
	validate
});
</script>

<style lang="scss" scoped>
.content {
	:deep(.el-card__body) {
		padding: 10px 0 !important;
	}
}

.form-item__block {
	width: 240px;
}

.form-item__block--half {
	width: 115px;
}

.form-item__placeholder {
	width: 390px;
	height: 30px;
}
</style>
