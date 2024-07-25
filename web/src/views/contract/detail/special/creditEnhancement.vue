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
			<el-row>
				<el-form-item label="有无增信措施" prop="measuresType">
					<div class="form-item__block">
						<el-radio-group
							v-model="formData.measuresType"
							@change="radioChange"
						>
							<el-radio label="0">无</el-radio>
							<el-radio label="1">有</el-radio>
						</el-radio-group>
					</div>
				</el-form-item>
			</el-row>
			<el-row v-if="formData.measuresType === '1'">
				<el-form-item label="增信措施方式" prop="measuresUseType">
					<div class="radio-column">
						<el-radio-group
							v-model="formData.measuresUseType"
							@change="typeRadioChange"
						>
							<el-radio label="1">
								编号
								<el-input
									v-model="formData.measuresNum1"
									style="width: 150px"
									size="small"
								/>
								的《
								<el-input
									v-model="formData.measuresName1"
									style="width: 150px"
									size="small"
								/>
								合同 》，担保方式为
								<el-input
									v-model="formData.guarantee1"
									style="width: 150px"
									size="small"
								/>
								，担保人为
								<el-input
									v-model="formData.guaranteePerson1"
									style="width: 150px"
									size="small"
								/>
								。
							</el-radio>
							<el-radio label="2">
								编号
								<el-input
									v-model="formData.measuresNum2"
									style="width: 150px"
									size="small"
								/>
								的《
								<el-input
									v-model="formData.measuresName2"
									style="width: 150px"
									size="small"
								/>
								合同 》，担保方式为
								<el-input
									v-model="formData.guarantee2"
									style="width: 150px"
									size="small"
								/>
								，担保人为
								<el-input
									v-model="formData.guaranteePerson2"
									style="width: 150px"
									size="small"
								/>
								。
							</el-radio>
							<el-radio label="3">浮动抵押担保</el-radio>
							<el-radio label="4">让与担保</el-radio>
						</el-radio-group>
					</div>
				</el-form-item>
			</el-row>
		</el-form>
	</el-card>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { StrUtil } from "@/utils/StrUtil";

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

// 有/无 radio change
function radioChange(val) {
	if (val === "1") {
		formData.measuresNum1 = null;
		formData.measuresName1 = null;
		formData.guarantee1 = null;
		formData.guaranteePerson1 = null;
		formData.measuresNum2 = null;
		formData.measuresName2 = null;
		formData.guarantee2 = null;
		formData.guaranteePerson2 = null;
	}
}

// 增信措施 change
function typeRadioChange(val) {
	if (val === "1") {
		formData.measuresNum2 = null;
		formData.measuresName2 = null;
		formData.guarantee2 = null;
		formData.guaranteePerson2 = null;
	}

	if (val === "2") {
		formData.measuresNum1 = null;
		formData.measuresName1 = null;
		formData.guarantee1 = null;
		formData.guaranteePerson1 = null;
	}

	if (val === "3" || val === "4") {
		formData.measuresNum1 = null;
		formData.measuresName1 = null;
		formData.guarantee1 = null;
		formData.guaranteePerson1 = null;
		formData.measuresNum2 = null;
		formData.measuresName2 = null;
		formData.guarantee2 = null;
		formData.guaranteePerson2 = null;
	}
}

// Form item 内容的统一宽度
const formItemContentStyle = { width: "100%" };

// 系统字典
const {
	cont_settlement,
	day,
	cont_advance,
	cont_pay,
	cont_overrun,
	proj_dd_type,
	cont_transfer_part
} = proxy.useDict(
	"cont_settlement",
	"day",
	"cont_advance",
	"cont_pay",
	"cont_overrun",
	"proj_dd_type",
	"cont_transfer_part"
);

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

.radio-column {
	:deep(.el-radio-group) {
		flex-direction: column;
		align-items: start;
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
