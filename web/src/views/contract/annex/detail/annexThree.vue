<template>
	<el-card>
		<el-form
			ref="elFormRef"
			:model="formData.crtList[0]"
			:rules="isView ? {} : rules0"
			:inline="true"
			label-width="160px"
			:disabled="isView"
		>
			<el-form-item label="编号" prop="conReceivableTransferNum">
				<div class="form-item__block">
					<el-input
						disabled
						v-model="formData.crtList[0].conReceivableTransferNum"
						:placeholder="showPlaceholder('自动生成')"
						clearable
						:style="formItemContentStyle"
						maxlength="32"
					/>
				</div>
			</el-form-item>

			<el-form-item label="债务人" prop="debtorPerson">
				<div class="form-item__block">
					<el-input
						v-model="formData.crtList[0].debtorPerson"
						:placeholder="showPlaceholder('请输入债务人')"
						clearable
						:style="formItemContentStyle"
						maxlength="32"
					/>
				</div>
			</el-form-item>

			<el-form-item label="转让人" prop="transferName">
				<div class="form-item__block">
					<el-input
						v-model="formData.crtList[0].transferName"
						:placeholder="showPlaceholder('请输入转让人')"
						clearable
						:style="formItemContentStyle"
						maxlength="32"
					/>
				</div>
			</el-form-item>

			<el-form-item label="受让人户名" prop="accountName">
				<div class="form-item__block">
					<CustomerSelect
						:showValue="formData.crtList[0].accountName"
						:option="factoringConfig.option"
						:queryPropList="factoringConfig.queryPropList"
						:tablePropList="factoringConfig.tablePropList"
						@selectRow="factoringConfigSelectRow"
					/>
				</div>
			</el-form-item>

			<el-form-item label="受让人账号" prop="accountNum">
				<div class="form-item__block">
					<el-input
						disabled
						v-model="formData.crtList[0].accountNum"
						:placeholder="showPlaceholder('自动生成')"
						clearable
						:style="formItemContentStyle"
						maxlength="32"
					/>
				</div>
			</el-form-item>

			<el-form-item label="受让人开户行" prop="accountBank">
				<div class="form-item__block">
					<el-input
						disabled
						v-model="formData.crtList[0].accountBank"
						:placeholder="showPlaceholder('自动生成')"
						clearable
						:style="formItemContentStyle"
						maxlength="32"
					/>
				</div>
			</el-form-item>

			<el-form-item label="主办人名称" prop="zbPersonName">
				<div class="form-item__block">
					<el-input
						v-model="formData.crtList[0].zbPersonName"
						:placeholder="showPlaceholder('请输入主办人名称')"
						clearable
						:style="formItemContentStyle"
						maxlength="32"
					/>
				</div>
			</el-form-item>

			<el-form-item label="主办人电话" prop="zbPersonTel">
				<div class="form-item__block">
					<el-input
						v-model="formData.crtList[0].zbPersonTel"
						:placeholder="showPlaceholder('请输入主办人电话')"
						clearable
						:style="formItemContentStyle"
						maxlength="32"
					/>
				</div>
			</el-form-item>

			<el-form-item label="还款期限" prop="payBackGraceDate">
				<div class="form-item__block">
					<el-input
						disabled
						v-model="formData.crtList[0].payBackGraceDate"
						:placeholder="showPlaceholder('自动生成')"
						clearable
						:style="formItemContentStyle"
						maxlength="32"
					>
						<template #suffix>
							<span>日</span>
						</template>
					</el-input>
				</div>
			</el-form-item>

			<el-card shadow="never">
				<template #header>
					<span>明细表</span>
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
				</el-table>
			</el-card>
		</el-form>
	</el-card>

	<el-card
		v-if="formData.factoringTarget && formData.factoringTarget === '2'"
		style="margin-top: 20px"
	>
		<el-form
			ref="elFormRef"
			:model="formData.crtList[1]"
			:rules="isView ? {} : rules1"
			:inline="true"
			label-width="160px"
			:disabled="isView"
		>
			<el-form-item label="编号" prop="conReceivableTransferNum">
				<div class="form-item__block">
					<el-input
						disabled
						v-model="formData.crtList[1].conReceivableTransferNum"
						:placeholder="showPlaceholder('自动生成')"
						clearable
						:style="formItemContentStyle"
						maxlength="32"
					/>
				</div>
			</el-form-item>

			<el-form-item label="债务人" prop="debtorPerson">
				<div class="form-item__block">
					<el-input
						v-model="formData.crtList[1].debtorPerson"
						:placeholder="showPlaceholder('请输入债务人')"
						clearable
						:style="formItemContentStyle"
						maxlength="32"
					/>
				</div>
			</el-form-item>

			<el-form-item label="转让人" prop="transferName">
				<div class="form-item__block">
					<el-input
						v-model="formData.crtList[1].transferName"
						:placeholder="showPlaceholder('请输入转让人')"
						clearable
						:style="formItemContentStyle"
						maxlength="32"
					/>
				</div>
			</el-form-item>

			<el-form-item label="受让人户名" prop="accountName">
				<div class="form-item__block">
					<CustomerSelect
						:showValue="formData.crtList[1].accountName"
						:option="factoringConfig.option"
						:queryPropList="factoringConfig.queryPropList"
						:tablePropList="factoringConfig.tablePropList"
						@selectRow="factoringConfigSelectRowSecond"
					/>
				</div>
			</el-form-item>

			<el-form-item label="受让人账号" prop="accountNum">
				<div class="form-item__block">
					<el-input
						disabled
						v-model="formData.crtList[1].accountNum"
						:placeholder="showPlaceholder('自动生成')"
						clearable
						:style="formItemContentStyle"
						maxlength="32"
					/>
				</div>
			</el-form-item>

			<el-form-item label="受让人开户行" prop="accountBank">
				<div class="form-item__block">
					<el-input
						disabled
						v-model="formData.crtList[1].accountBank"
						:placeholder="showPlaceholder('自动生成')"
						clearable
						:style="formItemContentStyle"
						maxlength="32"
					/>
				</div>
			</el-form-item>

			<el-form-item label="主办人名称" prop="zbPersonName">
				<div class="form-item__block">
					<el-input
						v-model="formData.crtList[1].zbPersonName"
						:placeholder="showPlaceholder('请输入主办人名称')"
						clearable
						:style="formItemContentStyle"
						maxlength="32"
					/>
				</div>
			</el-form-item>

			<el-form-item label="主办人电话" prop="zbPersonTel">
				<div class="form-item__block">
					<el-input
						v-model="formData.crtList[1].zbPersonTel"
						:placeholder="showPlaceholder('请输入主办人电话')"
						clearable
						:style="formItemContentStyle"
						maxlength="32"
					/>
				</div>
			</el-form-item>

			<el-form-item label="还款期限" prop="payBackGraceDate">
				<div class="form-item__block">
					<el-input
						disabled
						v-model="formData.crtList[1].payBackGraceDate"
						:placeholder="showPlaceholder('自动生成')"
						clearable
						:style="formItemContentStyle"
						maxlength="32"
					>
						<template #suffix>
							<span>日</span>
						</template>
					</el-input>
				</div>
			</el-form-item>

			<el-card shadow="never">
				<template #header>
					<span>明细表</span>
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
				</el-table>
			</el-card>
		</el-form>
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

// 组件事件
const emit = defineEmits(["update:data"]);

// vue实例对象
const { proxy } = getCurrentInstance();

// 表单对象
const elFormRef = ref(null);

// 表单数据
const formData = reactive(props.data);

// 表单验证规则
const rules0 = ref({
	debtorPerson: [
		{
			required: true,
			message: "债务人不能为空",
			trigger: "change"
		}
	],
	transferName: [
		{
			required: true,
			message: "转让人不能为空",
			trigger: "change"
		}
	],
	accountName: [
		{
			required: true,
			message: "受让人不能为空",
			trigger: "change"
		}
	],
	accountNum: [
		{
			required: true,
			message: "受让人账号不能为空",
			trigger: "change"
		}
	],
	accountBank: [
		{
			required: true,
			message: "受让人开户行不能为空",
			trigger: "change"
		}
	],
	zbPersonName: [
		{
			required: true,
			message: "主办人不能为空",
			trigger: "change"
		}
	],
	zbPersonTel: [
		{
			required: true,
			message: "主办人电话不能为空",
			trigger: "change"
		}
	],
	payBackGraceDate: [
		{
			required: true,
			message: "还款期限不能为空",
			trigger: "change"
		}
	]
});

const rules1 = ref({
	debtorPerson: [
		{
			required: true,
			message: "债务人不能为空",
			trigger: "change"
		}
	],
	transferName: [
		{
			required: true,
			message: "转让人不能为空",
			trigger: "change"
		}
	],
	accountName: [
		{
			required: true,
			message: "受让人不能为空",
			trigger: "change"
		}
	],
	accountNum: [
		{
			required: true,
			message: "受让人账号不能为空",
			trigger: "change"
		}
	],
	accountBank: [
		{
			required: true,
			message: "受让人开户行不能为空",
			trigger: "change"
		}
	],
	zbPersonName: [
		{
			required: true,
			message: "主办人不能为空",
			trigger: "change"
		}
	],
	zbPersonTel: [
		{
			required: true,
			message: "主办人电话不能为空",
			trigger: "change"
		}
	],
	payBackGraceDate: [
		{
			required: true,
			message: "还款期限不能为空",
			trigger: "change"
		}
	]
});

const dataScope = reactive({
	factoringConfig: {
		option: {
			inputW: "100%",
			placeholder: "请选择银行账号信息",
			dialogTitle: "银行账号信息",
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

const { factoringConfig } = toRefs(dataScope);

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

function factoringConfigSelectRow(row) {
	formData.crtList[0].accountBank = row.depositBank; // 开户行
	formData.crtList[0].accountName = row.accountName; // 户名
	formData.crtList[0].accountNum = row.paymentAccount; // 账号
}

function factoringConfigSelectRowSecond(row) {
	formData.crtList[1].accountBank = row.depositBank; // 开户行
	formData.crtList[1].accountName = row.accountName; // 户名
	formData.crtList[1].accountNum = row.paymentAccount; // 账号
}

// Form item 内容的统一宽度
const formItemContentStyle = { width: "100%" };

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
