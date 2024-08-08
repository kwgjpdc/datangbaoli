<template>
	<el-card>
		<el-form
			ref="elFormRef"
			:model="formData.conSignReceiptVo"
			:rules="isView ? {} : rules"
			:inline="true"
			label-width="160px"
			:disabled="isView"
		>
			<el-form-item label="应收账款转让通知书" prop="conReceivableTransferNum">
				<div class="form-item__block">
					<el-input
						disabled
						v-model="formData.conSignReceiptVo.conReceivableTransferNum"
						:placeholder="showPlaceholder('自动生成')"
						clearable
						:style="formItemContentStyle"
						maxlength="32"
					/>
				</div>
			</el-form-item>

			<el-form-item
				label="基础交易合同编号及名称"
				prop="transactionContNumName"
			>
				<div class="form-item__block">
					<el-input
						disabled
						v-model="formData.conSignReceiptVo.transactionContNumName"
						:placeholder="showPlaceholder('自动生成')"
						clearable
						:style="formItemContentStyle"
						maxlength="32"
					/>
				</div>
			</el-form-item>

			<el-row>
				<el-form-item label="客户公司名称" prop="customerName">
					<div class="form-item__block">
						<CustomerSelect
							:showValue="formData.conSignReceiptVo.customerName"
							:option="configSelect.option"
							:queryPropList="configSelect.queryPropList"
							:tablePropList="configSelect.tablePropList"
							@selectRow="configSelectRow"
						/>
					</div>
				</el-form-item>

				<el-form-item label="送达地址" prop="sendAddress">
					<div class="form-item__block">
						<el-input
							v-model="formData.conSignReceiptVo.sendAddress"
							:placeholder="showPlaceholder('请输入送达地址')"
							clearable
							:style="formItemContentStyle"
							maxlength="32"
						/>
					</div>
				</el-form-item>

				<el-form-item label="联系人名称" prop="contactsName">
					<div class="form-item__block">
						<el-input
							disabled
							v-model="formData.conSignReceiptVo.contactsName"
							:placeholder="showPlaceholder('自动生成')"
							clearable
							:style="formItemContentStyle"
							maxlength="32"
						/>
					</div>
				</el-form-item>

				<el-form-item label="联系人电话" prop="mobilePhone">
					<div class="form-item__block">
						<el-input
							disabled
							v-model="formData.conSignReceiptVo.mobilePhone"
							:placeholder="showPlaceholder('选择客户公司带入')"
							clearable
							:style="formItemContentStyle"
							maxlength="32"
						/>
					</div>
				</el-form-item>

				<el-form-item label="联系人电子邮箱" prop="emial">
					<div class="form-item__block">
						<el-input
							disabled
							v-model="formData.conSignReceiptVo.emial"
							:placeholder="showPlaceholder('自动生成')"
							clearable
							:style="formItemContentStyle"
							maxlength="32"
						/>
					</div>
				</el-form-item>

				<el-form-item label="联系人传真" prop="foxNum">
					<div class="form-item__block">
						<el-input
							v-model="formData.conSignReceiptVo.foxNum"
							:placeholder="showPlaceholder('请输入联系人传真')"
							clearable
							:style="formItemContentStyle"
							maxlength="32"
						/>
					</div>
				</el-form-item>
			</el-row>
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
const rules = ref({
	customerName: [
		{
			required: true,
			message: "客户公司名称不能为空",
			trigger: "change"
		}
	],
	sendAddress: [
		{
			required: true,
			message: "送达地址不能为空",
			trigger: "change"
		}
	],
	contactsName: [
		{
			required: true,
			message: "联系人不能为空",
			trigger: "change"
		}
	],
	mobilePhone: [
		{
			required: true,
			message: "联系电话不能为空",
			trigger: "change"
		}
	]
});

const dataScope = reactive({
	configSelect: {
		option: {
			inputW: "100%",
			dialogW: "1000px",
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
			}
		]
	}
});
const { configSelect } = toRefs(dataScope);

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
	formData.conSignReceiptVo.customerName = row.customerName; // 客户名称
	formData.conSignReceiptVo.sendAddress = row.applySendAddress; // 地址
	formData.conSignReceiptVo.contactsName = row.applyPersonName; // 联系人
	formData.conSignReceiptVo.mobilePhone = row.applyPersonMobileNumber; // 联系电话
	formData.conSignReceiptVo.emial = row.applyPersonEmail; // 传真
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
.el-form {
	:deep(.el-form-item--default .el-form-item__label) {
		white-space: pre-line;
		line-height: 20px;
		display: flex;
		align-items: center;
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
