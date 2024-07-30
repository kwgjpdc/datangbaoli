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
			<el-form-item label="编号" prop="2编号">
				<div class="form-item__block">
					<el-input
						disabled
						v-model="formData.contractNum"
						:placeholder="showPlaceholder('自动生成')"
						clearable
						:style="formItemContentStyle"
						maxlength="32"
					/>
				</div>
			</el-form-item>

			<el-form-item label="保理主合同标号" prop="contractNum">
				<div class="form-item__block">
					<el-input
						disabled
						v-model="formData.contractNum"
						:placeholder="showPlaceholder('请输入保理主合同标号')"
						clearable
						:style="formItemContentStyle"
						maxlength="32"
					/>
				</div>
			</el-form-item>

			<el-form-item label="应收账款转让明细表编号" prop="receivableNumber">
				<div class="form-item__block">
					<el-input
						disabled
						v-model="formData.receivableNumber"
						:placeholder="showPlaceholder('请输入应收账款转让明细表编号')"
						clearable
						:style="formItemContentStyle"
						maxlength="32"
					/>
				</div>
			</el-form-item>

			<el-form-item label="保理融资本金" prop="financingNum">
				<div class="form-item__block">
					<el-input
						v-model="formData.financingNum"
						:placeholder="showPlaceholder('请输入保理融资本金')"
						clearable
						:style="formItemContentStyle"
						maxlength="32"
					/>
				</div>
			</el-form-item>

			<el-row>
				<el-form-item label="融资期限" prop="receivableEndDate">
					<el-radio-group v-model="formData.receivableEndDate">
						<el-radio label="1" name="type"
							>自保理融资款拨付之日至{{
								(formData.carList[0] &&
									formData.carList[0].receivableEndDate) ||
								"-"
							}}</el-radio
						>
						<el-radio label="2" name="type">
							自保理融资款拨付之日起
							<el-input
								size="small"
								v-model="formData.receivablePayDate"
								style="width: 80px"
							/>
							天
						</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-row>

			<el-form-item label="利息支付宽限期" prop="interestGraceDate">
				<div class="form-item__block">
					<el-input
						v-model="formData.interestGraceDate"
						:placeholder="showPlaceholder('请输入利息支付宽限期')"
						clearable
						:style="formItemContentStyle"
						maxlength="32"
					/>
				</div>
			</el-form-item>

			<el-form-item label="还款宽限期" prop="payBackGraceDate">
				<div class="form-item__block">
					<el-input
						v-model="formData.payBackGraceDate"
						:placeholder="showPlaceholder('尽调自动获取')"
						clearable
						:style="formItemContentStyle"
						maxlength="32"
					/>
				</div>
			</el-form-item>

			<el-form-item label="管理费率" prop="manageCost">
				<div class="form-item__block">
					<el-input
						v-model="formData.manageCost"
						:placeholder="showPlaceholder('请输入管理费率')"
						clearable
						:style="formItemContentStyle"
						maxlength="32"
					/>
				</div>
			</el-form-item>

			<el-form-item label="保理融资利率" prop="financingCost">
				<div class="form-item__block">
					<el-input
						v-model="formData.financingCost"
						:placeholder="showPlaceholder('请输入保理融资利率')"
						clearable
						:style="formItemContentStyle"
						maxlength="32"
					/>
				</div>
			</el-form-item>

			<el-form-item label="宽限期利率" prop="graceCost">
				<div class="form-item__block">
					<el-input
						v-model="formData.graceCost"
						:placeholder="showPlaceholder('请输入宽限期利率')"
						clearable
						:style="formItemContentStyle"
						maxlength="32"
					/>
				</div>
			</el-form-item>

			<el-row>
				<el-form-item label="管理费支付方式" prop="managePayType">
					<el-radio-group v-model="formData.managePayType">
						<el-radio label="1" name="type"
							>在甲方支付保理融资前由乙方一次性支付</el-radio
						>
						<el-radio label="2" name="type">每季度支付一次</el-radio>
						<el-radio label="3" name="type" @change="otherChange">
							其他方式
							<el-input
								size="small"
								v-if="formData.managePayType.includes('3')"
								v-model="formData.managePayTypeWrite"
								placeholder="请输入其他方式"
							/>
						</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-row>

			<el-row>
				<el-form-item label="保理融资利息支付方式" prop="financingCostPayType">
					<el-radio-group v-model="formData.financingCostPayType">
						<el-radio label="1" name="type"
							>在甲方支付保理融资前由乙方一次性支付</el-radio
						>
						<el-radio label="2" name="type">每季度支付一次</el-radio>
						<el-radio label="3" name="type"
							>甲方在收到的应收账款中直接扣收</el-radio
						>
						<el-radio label="4" name="type" @change="otherChange2">
							其他方式
							<el-input
								size="small"
								v-if="formData.financingCostPayType.includes('4')"
								v-model="formData.managePayTypeWrite"
								placeholder="请输入其他方式"
							/>
						</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-row>

			<el-form-item label="违约金利率" prop="defaultInterestRate">
				<div class="form-item__block">
					<el-input
						v-model="formData.defaultInterestRate"
						:placeholder="showPlaceholder('请输入违约金利率')"
						clearable
						:style="formItemContentStyle"
						maxlength="32"
					/>
				</div>
			</el-form-item>

			<el-form-item
				label="应收账款债务人付款担保额度"
				prop="obligorGuaranteeAmount"
			>
				<div class="form-item__block">
					<el-input
						v-model="formData.obligorGuaranteeAmount"
						:placeholder="showPlaceholder('请输入应收账款债务人付款担保额度')"
						clearable
						:style="formItemContentStyle"
						maxlength="32"
					/>
				</div>
			</el-form-item>

			<el-row>
				<el-form-item label="保理融资款收取账户" prop="paymentsType">
					<div class="radio-column">
						<el-radio-group v-model="formData.paymentsType">
							<el-radio label="1" name="type"
								>乙方确认，本次保理融资款收取账户为本合同专用条款约定的收款账户</el-radio
							>
							<el-radio label="2" name="type">
								乙方确认，本次保理融资款收取账户如下：
							</el-radio>

							<div>
								<el-row>
									<el-form-item label="户名" prop="paymentsAccountName">
										<BankAccountSelect
											:showValue="formData.paymentsAccountName"
											:option="customerConfig.option"
											:queryPropList="customerConfig.queryPropList"
											:tablePropList="customerConfig.tablePropList"
											:queryDefault="queryDefault"
											@selectRow="customerConfigSelectRow"
										/>
									</el-form-item>

									<el-form-item label="账号" prop="paymentsAccount">
										<el-input disabled v-model="formData.paymentsAccount" />
									</el-form-item>

									<el-form-item label="开户行" prop="paymentsAccountBank">
										<el-input disabled v-model="formData.paymentsAccountBank" />
									</el-form-item>
								</el-row>
							</div>
						</el-radio-group>
					</div>
				</el-form-item>
			</el-row>
		</el-form>
	</el-card>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import BankAccountSelect from "@/components/BankAccountSelect";
import { StrUtil } from "@/utils/StrUtil";
import { deepClone } from "@/utils/index";

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

// 表单对象
const elFormRef = ref(null);

// 表单数据
const formData = reactive(props.data);

const dataScope = reactive({
	customerConfig: {
		option: {
			inputW: "100%",
			dialogW: "1000px",
			placeholder: "请选择银行账号信息",
			dialogTitle: "银行账号信息",
			queryUrl: "/customeraccount/info/detial"
		},
		queryPropList: [
			{
				prop: "customerName",
				label: "客户名称"
			},
			{
				prop: "accountBankInfo",
				label: "银行名称"
			},
			{
				prop: "accountName",
				label: "银行户名"
			},
			{
				prop: "accountInfo",
				label: "银行账号"
			}
		],
		tablePropList: [
			{
				prop: "customerName",
				label: "客户名称"
			},
			{
				prop: "accountBankInfo",
				label: "银行名称"
			},
			{
				prop: "accountName",
				label: "银行户名"
			},
			{
				prop: "accountInfo",
				label: "银行账号"
			}
		]
	}
});

const { customerConfig } = toRefs(dataScope);

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

// Form item 内容的统一宽度
const formItemContentStyle = { width: "100%" };

// 管理费支付方式 【其他】选项逻辑处理；
function otherChange(val) {
	if (!val) {
		formData.managePayTypeWrite = null;
	}
}

// 管理费支付方式 【其他】选项逻辑处理；
function otherChange2(val) {
	if (!val) {
		formData.managePayTypeWrite = null;
	}
}

function customerConfigSelectRow(row) {
	formData.paymentsAccountBank = row.accountBankInfo;
	formData.paymentsAccountName = row.accountName;
	formData.paymentsAccount = row.accountInfo;
}

// 显示placeholder占位字符
function showPlaceholder(txt) {
	return isView.value ? " " : txt;
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
.el-form {
	:deep(.el-form-item--default .el-form-item__label) {
		white-space: pre-line;
		line-height: 20px;
		display: flex;
		align-items: center;
	}
}

.radio-column {
	:deep(.el-radio-group) {
		display: flex;
		flex-direction: column;
		align-items: start;
	}
}

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
