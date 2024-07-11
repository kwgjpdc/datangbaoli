<template>
	<el-form
		class="info-form"
		ref="elForm"
		:model="formData"
		:rules="rules"
		label-width="140px"
		:disabled="props.routerQueryObj.viewFlag"
	>
		<el-collapse v-model="activeNames">
			<el-collapse-item title="基本信息" name="1">
				<el-row :gutter="15" style="margin-right: 30px">
					<el-col :xl="6" :lg="8" :sm="12" :xs="24">
						<el-form-item label="机构名称" prop="institutionName">
							<el-input
								v-model="formData.institutionName"
								placeholder="请输入机构名称或保理人名称"
								clearable
								maxlength="64"
							></el-input>
						</el-form-item>
					</el-col>
					<el-col :xl="6" :lg="8" :sm="12" :xs="24">
						<el-form-item label="工商注册号" prop="registerCode">
							<el-input
								v-model="formData.registerCode"
								placeholder="请输入工商注册号"
								clearable
								maxlength="32"
							></el-input>
						</el-form-item>
					</el-col>
					<el-col :xl="6" :lg="8" :sm="12" :xs="24">
						<el-form-item label="注册资本" prop="registeredCapital">
							<ElPriceInput
								v-model:form="formData"
								prop="registeredCapital"
								:rules="rules"
								:placeholder="'请输入'"
							>
								<template #prefix>
									<span> ￥ </span>
								</template>
								<template #suffix>
									<span> 元 </span>
								</template>
							</ElPriceInput>
						</el-form-item>
					</el-col>
					<el-col :xl="6" :lg="8" :sm="12" :xs="24">
						<el-form-item label="出资金额" prop="contribution">
							<ElPriceInput
								v-model:form="formData"
								prop="contribution"
								:rules="rules"
								:placeholder="'请输入'"
							>
								<template #prefix>
									<span> ￥ </span>
								</template>
								<template #suffix>
									<span> 元 </span>
								</template>
							</ElPriceInput>
						</el-form-item>
					</el-col>
					<el-col :xl="6" :lg="8" :sm="12" :xs="24">
						<el-form-item label="法定代表/委托代理" prop="legalRepresentative">
							<el-input
								v-model="formData.legalRepresentative"
								placeholder="请输入法定代表或者委托代理"
								clearable
								maxlength="32"
							></el-input>
						</el-form-item>
					</el-col>
					<!-- 新增：注册地址 -->
					<el-col :xl="6" :lg="8" :sm="12" :xs="24">
						<el-form-item label="注册地址" prop="address">
							<el-input
								v-model="formData.legalRepresentative"
								type="textarea"
								placeholder="请输入注册地址"
								clearable
								maxlength="32"
							></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-collapse-item>
		</el-collapse>
	</el-form>
</template>
<script setup>
import { reactive, ref, watch } from "vue";
const { proxy } = getCurrentInstance();
import ElPriceInput from "@/components/ElPriceInput";
import { getContList } from "@/api/debt/info";
import { listInfo as getUserList } from "@/api/customer/index";
import { deepClone } from "@/utils/index";
const props = defineProps({
	institutionInfo: {
		type: Object,
		default: null
	},
	// 新增为空
	institutionId: {
		type: String,
		default: ""
	},
	routerQueryObj: {
		type: Object,
		default: null
	}
});

const activeNames = ref(["1"]); //tab打开状态
const loading = ref(false);
const dataScope = reactive({
	rules: {
		institutionName: [
			{ required: true, message: "机构名称不能为空", trigger: "blur" }
		],
		registeredCapital: [
			{
				pattern:
					/^1000000000$|^1000000000.0$|^1000000000.00$|^[+]{0,1}(\d{0,9})$|^[+]{0,1}(\d{0,9}\.\d{1,2})$/,
				message: " 请输入 0-10亿 的正数，可保留两位小数",
				trigger: "blur"
			}
		],
		contribution: [
			{
				pattern:
					/^1000000000$|^1000000000.0$|^1000000000.00$|^[+]{0,1}(\d{0,9})$|^[+]{0,1}(\d{0,9}\.\d{1,2})$/,
				message: " 请输入 0-10亿 的正数，可保留两位小数",
				trigger: "blur"
			}
		]
	} //验证规律
});

const { rules } = toRefs(dataScope);

let formData = ref({
	createBy: null,
	createById: null,
	createTime: null,
	updateBy: null,
	updateById: null,
	updateTime: null,
	delFlag: null,
	institutionId: null,
	institutionName: "",
	registerCode: "",
	registeredCapital: null,
	contribution: null,
	legalRepresentative: ""
}); //不能修改const 定义的数据

watch(
	() => props.institutionInfo,
	value => {
		formData.value = value;
	}
);

function handleChange(val) {
	console.log(val);
}

// 表单验证
function validForm() {
	let result = false;
	proxy.$refs["elForm"].validate(valid => {
		console.log(valid);
		result = valid;
	});
	return result;
}

// 用户组件请求信息
const userParams = ref({
	pageNum: 1,
	pageSize: 10
});
const tableData = ref([]);
const tableDataCont = ref([]);
const tableDataUser = ref([]);
let totalCont = ref([]);
let totalUser = ref([]);
let checkItem = ref("");
let updateItem = ref(null);

defineExpose({
	formData,
	validForm
});
</script>
<style lang="scss">
.box-card {
	margin-bottom: 20px;
}

.page {
	margin-top: 10px;
}

.header-button-operate {
	display: flex;
	flex-direction: row;
	justify-content: flex-end;
}
</style>
