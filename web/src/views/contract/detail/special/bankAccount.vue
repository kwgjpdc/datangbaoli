<template>
	<el-card>
		<el-form
			class="content"
			ref="elFormRef"
			:model="formData"
			:rules="isView ? {} : rules"
			:inline="true"
			label-width="160px"
			:disabled="isView"
		>
			<el-row>
				<el-form-item label="回款方式" prop="replayType">
					<div class="form-item__block">
						<el-radio-group v-model="formData.replayType">
							<el-radio label="1">直接回款</el-radio>
							<el-radio label="2">间接回款</el-radio>
						</el-radio-group>
					</div>
				</el-form-item>
			</el-row>

			<template v-if="formData.replayType === '1'">
				<el-card shadow="never">
					<template #header>客户账户信息</template>

					<el-form-item label="开户行" prop="customerBankName">
						<div class="form-item__block">
							<BankAccountSelect
								:showValue="formData.customerBankName"
								:option="bankAccount.option"
								:queryPropList="bankAccount.queryPropList"
								:tablePropList="bankAccount.tablePropList"
								:queryDefault="queryDefault"
								@selectRow="bankAccountSelectRow"
							/>
						</div>
					</el-form-item>

					<el-form-item label="户名" prop="customerAccountName">
						<div class="form-item__block">
							<el-input
								disabled
								v-model="formData.customerAccountName"
								:placeholder="showPlaceholder('请输入户名')"
								clearable
								:style="formItemContentStyle"
								maxlength="32"
							/>
						</div>
					</el-form-item>

					<el-form-item label="账号" prop="customerAccountNum">
						<div class="form-item__block">
							<el-input
								disabled
								v-model="formData.customerAccountNum"
								:placeholder="showPlaceholder('账号')"
								clearable
								:style="formItemContentStyle"
								maxlength="32"
							/>
						</div>
					</el-form-item>
				</el-card>

				<el-card shadow="never" style="margin-top: 20px">
					<template #header>保理公司账号信息</template>

					<el-form-item label="开户行" prop="blBankName">
						<div class="form-item__block">
							<CustomerSelect
								:showValue="formData.blBankName"
								:option="factoringInstitution.option"
								:queryPropList="factoringInstitution.queryPropList"
								:tablePropList="factoringInstitution.tablePropList"
								@selectRow="factoringInstitutionSelectRow"
							/>
						</div>
					</el-form-item>

					<el-form-item label="户名" prop="blAccountName">
						<div class="form-item__block">
							<el-input
								disabled
								v-model="formData.blAccountName"
								:placeholder="showPlaceholder('请输入户名')"
								clearable
								:style="formItemContentStyle"
								maxlength="32"
							/>
						</div>
					</el-form-item>

					<el-form-item label="账号" prop="blAccountNum">
						<div class="form-item__block">
							<el-input
								disabled
								v-model="formData.blAccountNum"
								:placeholder="showPlaceholder('请输入账号')"
								clearable
								:style="formItemContentStyle"
								maxlength="32"
							/>
						</div>
					</el-form-item>
				</el-card>
			</template>

			<template v-if="formData.replayType === '2'">
				<el-card shadow="never">
					<template #header>客户账号信息</template>

					<el-form-item label="开户行" prop="customerBankName">
						<div class="form-item__block">
							<el-input
								v-model="formData.customerBankName"
								:placeholder="showPlaceholder('请输入开户行')"
								clearable
								:style="formItemContentStyle"
								maxlength="32"
							/>
						</div>
					</el-form-item>

					<el-form-item label="户名" prop="customerAccountName">
						<div class="form-item__block">
							<el-input
								disabled
								v-model="formData.customerAccountName"
								:placeholder="showPlaceholder('请输入户名')"
								clearable
								:style="formItemContentStyle"
								maxlength="32"
							/>
						</div>
					</el-form-item>

					<el-form-item label="账号" prop="customerAccountNum">
						<div class="form-item__block">
							<el-input
								disabled
								v-model="formData.customerAccountNum"
								:placeholder="showPlaceholder('账号')"
								clearable
								:style="formItemContentStyle"
								maxlength="32"
							/>
						</div>
					</el-form-item>
				</el-card>

				<el-card shadow="never" style="margin-top: 20px">
					<template #header>保理公司账号信息</template>

					<el-form-item label="开户行" prop="blBankName">
						<div class="form-item__block">
							<el-input
								v-model="formData.blBankName"
								:placeholder="showPlaceholder('请输入开户行')"
								clearable
								:style="formItemContentStyle"
								maxlength="32"
							/>
						</div>
					</el-form-item>

					<el-form-item label="户名" prop="blAccountName">
						<div class="form-item__block">
							<el-input
								disabled
								v-model="formData.blAccountName"
								:placeholder="showPlaceholder('请输入户名')"
								clearable
								:style="formItemContentStyle"
								maxlength="32"
							/>
						</div>
					</el-form-item>

					<el-form-item label="账号" prop="blAccountNum">
						<div class="form-item__block">
							<el-input
								disabled
								v-model="formData.blAccountNum"
								:placeholder="showPlaceholder('账号')"
								clearable
								:style="formItemContentStyle"
								maxlength="32"
							/>
						</div>
					</el-form-item>
				</el-card>
			</template>
		</el-form>
	</el-card>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { StrUtil } from "@/utils/StrUtil";

import BankAccountSelect from "@/components/BankAccountSelect";
import CustomerSelect from "@/components/CustomerSelect";

// 组件属性
const props = defineProps({
	data: {
		type: Object,
		default: {}
	},
	routerQueryObj: {
		type: Object,
		default: {}
	}
});

// 组件事件
const emit = defineEmits(["update:data"]);

// vue实例对象
const { proxy } = getCurrentInstance();

// Form item 内容的统一宽度
const formItemContentStyle = { width: "100%" };

// 表单对象
const elFormRef = ref(null);

// 表单数据
const formData = reactive(props.data);

// 表单验证规则
const rules = ref({
	agreePaymentLimit: [
		{
			required: true,
			message: "付款期限不能为空",
			trigger: "change"
		}
	],
	agreePaymentStartDate: [
		{
			required: true,
			message: "起日不能为空",
			trigger: "change"
		}
	],
	agreePaymentEndDate: [
		{
			required: true,
			message: "迄日不能为空",
			trigger: "change"
		}
	],
	agreePaymentVerify: [
		{
			required: true,
			message: "对账期限不能为空",
			trigger: "change"
		}
	],
	agreeStartDate: [
		{
			required: true,
			message: "初始日不能为空",
			trigger: "change"
		}
	],
	agreePaymentMaxLimit: [
		{
			required: true,
			message: "最大付款期限不能为空",
			trigger: "change"
		}
	],
	agreeAdvanceGraceDays: [
		{
			required: true,
			message: "垫款宽限期不能为空",
			trigger: "change"
		}
	],
	agreeInform: [
		{
			validator: validateInform,
			trigger: "change"
		}
	]
});

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

const queryDefault = computed(() => {
	return { customerName: formData.applyInstitutionName };
});

// 侦听表单数据变化
watch(formData, newValue => {
	emit("update:data", newValue);
});

const dataScope = reactive({
	bankAccount: {
		option: {
			inputW: "100%",
			placeholder: "请选择银行账号信息",
			dialogTitle: "银行账号信息",
			queryUrl: "/customeraccount/info/detial"
		},
		queryPropList: [
			{
				prop: "accountBankInfo",
				label: "开户行"
			},
			{
				prop: "accountInfo",
				label: "账号"
			},
			{
				prop: "customerName",
				label: "户名"
			}
		],
		tablePropList: [
			{
				prop: "accountBankInfo",
				label: "银行信息"
			},
			{
				prop: "accountInfo",
				label: "账号"
			},
			{
				prop: "accountName",
				label: "户名"
			}
		]
	},
	factoringInstitution: {
		option: {
			inputW: "100%",
			placeholder: "请选择机构信息",
			dialogTitle: "机构信息",
			queryUrl: "/finance/payment/list"
		},
		queryPropList: [
			{
				prop: "accountName",
				label: "户名"
			},
			{
				prop: "paymentAccount",
				label: "银行账号"
			}
		],
		tablePropList: [
			{
				prop: "depositBank",
				label: "开户行"
			},
			{
				prop: "accountName",
				label: "户名"
			},
			{
				prop: "paymentAccount",
				label: "银行账号"
			}
		]
	}
});

const { bankAccount, factoringInstitution } = toRefs(dataScope);

function bankAccountSelectRow(row) {
	formData.customerBankName = row.institutionId;
	formData.customerAccountName = row.institutionName;
	formData.customerAccountNum = row.registAddress;
}
function factoringInstitutionSelectRow(row) {
	formData.blBankName = row.depositBank;
	formData.blAccountName = row.accountName;
	formData.blAccountNum = row.paymentAccount;
}

// 监听 radio
watch(
	() => formData.replayType,
	() => {
		formData.customerBankName = null;
		formData.customerAccountName = null;
		formData.customerAccountNum = null;
		formData.blBankName = null;
		formData.blAccountName = null;
		formData.blAccountNum = null;
	}
);

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

// 显示placeholder占位字符
function showPlaceholder(txt) {
	return isView.value ? " " : txt;
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
