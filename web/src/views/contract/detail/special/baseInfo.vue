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
			<el-form-item label="项目尽调编号" prop="projectNo">
				<div class="form-item__block">
					<CustomerSelect
						:showValue="formData.projectNo"
						:option="config.option"
						:queryPropList="config.queryPropList"
						:tablePropList="config.tablePropList"
						@selectRow="configSelectRow"
					/>
				</div>
			</el-form-item>
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
	projectNo: [
		{
			required: true,
			message: "尽调编号不能为空",
			trigger: "change"
		}
	]
});

const dataScope = reactive({
	config: {
		option: {
			inputW: "100%",
			dialogW: "1000px",
			placeholder: "请选择尽调信息",
			dialogTitle: "尽调信息",
			queryUrl: "/project/diligence/list"
		},
		queryPropList: [
			{
				prop: "dueNo",
				label: "尽调编号"
			},
			{
				prop: "name",
				label: "项目名称"
			}
		],
		tablePropList: [
			{
				prop: "dueNo",
				label: "尽调编号"
			},
			{
				prop: "name",
				label: "项目名称"
			}
		]
	} // 客户
});
const { config } = toRefs(dataScope);

function configSelectRow(rows) {
	formData.projectDueId = rows.id;
	formData.projectNo = rows.dueNo;
	formData.projectName = rows.name;
	formData.bussProduct = rows.businessType;
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
