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
			<el-card shadow="never">
				<template #header>甲方信息</template>

				<el-form-item label="联系人" prop="approvalPerson">
					<div class="form-item__block">
						<el-input
							v-model="formData.approvalPerson"
							:placeholder="showPlaceholder('请输入联系人')"
							clearable
							:style="formItemContentStyle"
							maxlength="50"
						/>
					</div>
				</el-form-item>

				<el-form-item label="电话" prop="approvalPersonMobile">
					<div class="form-item__block">
						<el-input
							v-model="formData.approvalPersonMobile"
							:placeholder="showPlaceholder('请输入电话')"
							clearable
							:style="formItemContentStyle"
							maxlength="50"
						/>
					</div>
				</el-form-item>

				<el-form-item label="邮箱" prop="approvalPersonEmail">
					<div class="form-item__block">
						<el-input
							v-model="formData.approvalPersonEmail"
							:placeholder="showPlaceholder('请输入邮箱')"
							clearable
							:style="formItemContentStyle"
							maxlength="50"
						/>
					</div>
				</el-form-item>

				<el-form-item label="送达地址" prop="approvalPersonAddress">
					<div class="form-item__block">
						<el-input
							type="textarea"
							v-model="formData.approvalPersonAddress"
							:placeholder="showPlaceholder('请输入送达地址')"
							clearable
							:style="formItemContentStyle"
							maxlength="500"
						/>
					</div>
				</el-form-item>
			</el-card>

			<el-card shadow="never" style="margin-top: 20px">
				<template #header>乙方信息</template>

				<el-form-item label="联系人" prop="applyPerson">
					<div class="form-item__block">
						<CustomerSelect
							:showValue="formData.applyPerson"
							:option="configSelect.option"
							:queryPropList="configSelect.queryPropList"
							:tablePropList="configSelect.tablePropList"
							@selectRow="configSelectRow"
						/>
					</div>
				</el-form-item>

				<el-form-item label="电话" prop="applyPersonMobile">
					<div class="form-item__block">
						<el-input
							disabled
							v-model="formData.applyPersonMobile"
							:placeholder="showPlaceholder('请输入电话')"
							clearable
							:style="formItemContentStyle"
							maxlength="50"
						/>
					</div>
				</el-form-item>

				<el-form-item label="邮箱" prop="applyPersonEmail">
					<div class="form-item__block">
						<el-input
							disabled
							v-model="formData.applyPersonEmail"
							:placeholder="showPlaceholder('请输入邮箱')"
							clearable
							:style="formItemContentStyle"
							maxlength="50"
						/>
					</div>
				</el-form-item>

				<el-form-item label="送达地址" prop="applyPersonAddress">
					<div class="form-item__block">
						<el-input
							disabled
							type="textarea"
							v-model="formData.applyPersonAddress"
							:placeholder="showPlaceholder('请输入送达地址')"
							clearable
							:style="formItemContentStyle"
							maxlength="1000"
						/>
					</div>
				</el-form-item>
			</el-card>
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
	approvalPerson: [
		{
			required: true,
			message: "联系人不能为空",
			trigger: "change"
		}
	],
	approvalPersonMobile: [
		{
			required: true,
			message: "电话不能为空",
			trigger: "change"
		}
	],
	approvalPersonEmail: [
		{
			required: true,
			message: "邮箱不能为空",
			trigger: "change"
		}
	],
	approvalPersonAddress: [
		{
			required: true,
			message: "地址不能为空",
			trigger: "change"
		}
	],
	applyPerson: [
		{
			required: true,
			message: "联系人不能为空",
			trigger: "change"
		}
	],
	applyPersonMobile: [
		{
			required: true,
			message: "连线电话不能为空",
			trigger: "change"
		}
	],
	applyPersonEmail: [
		{
			required: true,
			message: "电子邮箱不能为空",
			trigger: "change"
		}
	],
	applyPersonAddress: [
		{
			required: true,
			message: "地址不能为空",
			trigger: "change"
		}
	]
});

const dataScope = reactive({
	configSelect: {
		option: {
			inputW: "100%",
			placeholder: "请选择客户信息",
			dialogTitle: "客户信息",
			queryUrl: "/cust/customer/list"
		},
		queryPropList: [
			{
				prop: "customerName",
				label: "客户名称"
			},
			{
				prop: "applyPersonName",
				label: "联系人"
			}
		],
		tablePropList: [
			{
				prop: "customerName",
				label: "客户名称"
			},
			{
				prop: "applyPersonName",
				label: "联系人"
			},
			{
				prop: "applyPersonMobileNumber",
				label: "电话"
			},
			{
				prop: "applyPersonEmail",
				label: "邮箱"
			},
			{
				prop: "applySendAddress",
				label: "地址"
			}
		]
	}
});

const { configSelect } = toRefs(dataScope);

function configSelectRow(row) {
	formData.blBankName = row.depositBank;
	formData.blAccountName = row.accountName;
	formData.blAccountNum = row.paymentAccount;
}

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
