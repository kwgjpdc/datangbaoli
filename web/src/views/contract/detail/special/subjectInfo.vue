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
			<el-card shadow="never">
				<template #header>保理商信息</template>

				<el-form-item label="保理商" prop="institutionName">
					<div class="form-item__block">
						<CustomerSelect
							:showValue="formData.institutionName"
							:option="institution.option"
							:queryPropList="institution.queryPropList"
							:tablePropList="institution.tablePropList"
							@selectRow="institutionSelectRow"
						/>
					</div>
				</el-form-item>

				<el-form-item label="注册地址" prop="registAddress">
					<div class="form-item__block">
						<el-input
							disabled
							v-model="formData.registAddress"
							:placeholder="showPlaceholder('请先选择保理商')"
							clearable
							:style="formItemContentStyle"
							maxlength="32"
						/>
					</div>
				</el-form-item>

				<el-form-item label="法定代表人/委托代理人" prop="legalRepresentative">
					<div class="form-item__block">
						<el-input
							disabled
							v-model="formData.legalRepresentative"
							:placeholder="showPlaceholder('请先选择保理商')"
							clearable
							:style="formItemContentStyle"
							maxlength="32"
						/>
					</div>
				</el-form-item>
			</el-card>

			<el-card shadow="never" style="margin-top: 20px">
				<template #header>保理申请人信息</template>

				<el-form-item label="保理申请人" prop="applyInstitutionName">
					<div class="form-item__block">
						<CustomerSelect
							:showValue="formData.applyInstitutionName"
							:option="institution.option"
							:queryPropList="institution.queryPropList"
							:tablePropList="institution.tablePropList"
							@selectRow="applyInstitutionSelectRow"
						/>
					</div>
				</el-form-item>

				<el-form-item label="注册地址" prop="applyRegistAddress">
					<div class="form-item__block">
						<el-input
							disabled
							v-model="formData.applyRegistAddress"
							:placeholder="showPlaceholder('请先选择保理申请人')"
							clearable
							:style="formItemContentStyle"
							maxlength="32"
						/>
					</div>
				</el-form-item>

				<el-form-item
					label="法定代表人/委托代理人"
					prop="applyLegalRepresentative"
				>
					<div class="form-item__block">
						<el-input
							disabled
							v-model="formData.applyLegalRepresentative"
							:placeholder="showPlaceholder('请先选择保理申请人')"
							clearable
							:style="formItemContentStyle"
							maxlength="32"
						/>
					</div>
				</el-form-item>
			</el-card>

			<el-form-item
				label="合同签订地点"
				prop="contractWriteOnPlace"
				style="margin-top: 20px"
			>
				<div class="form-item__block">
					<el-input
						type="textarea"
						v-model="formData.contractWriteOnPlace"
						:placeholder="showPlaceholder('请输入合同签订地点')"
						clearable
						:style="formItemContentStyle"
						maxlength="32"
					/>
				</div>
			</el-form-item>

			<InstitutionSelectDialog open="" />
		</el-form>
	</el-card>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { StrUtil } from "@/utils/StrUtil";
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

// 表单对象
const elFormRef = ref(null);

// 表单数据
const formData = reactive(props.data);

// 表单验证规则
const rules = ref({
	institutionName: [
		{
			required: true,
			message: "保理商",
			trigger: "change"
		}
	],
	legalRepresentative: [
		{
			required: true,
			message: "法定代表人/委托代理人不能为空",
			trigger: "change"
		}
	],
	applyInstitutionName: [
		{
			required: true,
			message: "保理申请人",
			trigger: "change"
		}
	],
	applyLegalRepresentative: [
		{
			required: true,
			message: "法定代表人/委托代理人",
			trigger: "change"
		}
	],
	contractWriteOnPlace: [
		{
			required: true,
			message: "签订地点不能为空",
			trigger: "change"
		}
	]

	// agreeInform: [
	// 	{
	// 		validator: validateInform,
	// 		trigger: "change"
	// 	}
	// ]
});

// start-----机构选择配置
const dataScope = reactive({
	institution: {
		option: {
			inputW: "100%",
			dialogW: "1000px",
			placeholder: "请选择机构信息",
			dialogTitle: "机构信息",
			queryUrl: "/cust/customer/list"
		},
		queryPropList: [
			{
				prop: "customerName",
				label: "公司名称"
			},
			{
				prop: "corporationName",
				label: "法人代表"
			}
		],
		tablePropList: [
			{
				prop: "customerName",
				label: "公司名称"
			},
			{
				prop: "corporationName",
				label: "法人代表"
			},
			{
				prop: "",
				label: "注册地址"
			}
		]
	} // 客户
});
const { institution } = toRefs(dataScope);
function institutionSelectRow(row) {
	formData.customerId = row.customerId;
	formData.institutionName = row.customerName;
	formData.registAddress = row.registAddress;
	formData.legalRepresentative = row.corporationName;
}
function applyInstitutionSelectRow(row) {
	formData.applyInstitutionId = row.customerId;
	formData.applyInstitutionName = row.customerName;
	formData.applyRegistAddress = row.registAddress;
	formData.applyLegalRepresentative = row.corporationName;
}
// end-----机构选择配置

// Form item 内容的统一宽度
const formItemContentStyle = { width: "100%" };

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
watch(formData, newValue => {
	emit("update:data", newValue);
});

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

// 结算方式改变方法
function handleSettlementChange() {
	formData.agreePaymentLimit = null;
	formData.agreePaymentStartDate = null;
	formData.agreePaymentEndDate = null;
	formData.agreePaymentVerify = null;
	formData.agreeStartDate = null;
	formData.agreePaymentMaxLimit = null;
}

// 改变是否垫付
function handleAdvanceChange() {
	formData.agreeAdvanceGraceDays = null;
	formData.agreeAdvancePercentage = null;
}

// 改变业务类型
function handleInformChange() {
	formData.agreeInformOther = null;
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
