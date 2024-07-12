<template>
	<el-form
		class="info-form"
		ref="elForm"
		:model="formData"
		:rules="rules"
		label-width="140px"
		:loading="loading"
		:disabled="props.routerQueryObj.viewFlag"
	>
		<el-collapse v-model="activeNames">
			<el-collapse-item title="基本信息" name="1">
				<el-row :gutter="15" style="margin-right: 30px">
					<el-col :xl="6" :lg="8" :sm="12" :xs="24">
						<el-form-item label="客户名称" prop="formData.customerName">
							<CustomerSelect
								:showValue="formData.customerName"
								:option="customerAttr.option"
								:queryPropList="customerAttr.queryPropList"
								:tablePropList="customerAttr.tablePropList"
								@selectRow="customerSelectRow"
							></CustomerSelect>
						</el-form-item>
					</el-col>

					<el-col :xl="6" :lg="8" :sm="12" :xs="24">
						<el-form-item label="客户种类" prop="formData.type">
							<el-input
								class="fixed-width-input"
								v-model="formData.customerName"
								placeholder="请输入客户名称"
								clearable
								maxlength="32"
							></el-input>
						</el-form-item>
					</el-col>
					<el-col :xl="6" :lg="8" :sm="12" :xs="24">
						<el-form-item label="债务人名称" prop="formData.obligorName">
							<CustomerSelect
								:showValue="formData.obligorName"
								:option="obligorAttr.option"
								:queryPropList="obligorAttr.queryPropList"
								:tablePropList="obligorAttr.tablePropList"
								@selectRow="obligorSelectRow"
							></CustomerSelect>
						</el-form-item>
					</el-col>
					<el-col :xs="24">
						<el-form-item label="备注" prop="formData.remark">
							<el-input
								class="fixed-width-input"
								type="textarea"
								v-model="formData.companyInfo.businessScope"
								placeholder="请输入备注"
								clearable
								maxlength="255"
								show-word-limit
							></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-collapse-item>
		</el-collapse>
	</el-form>
</template>

<script setup>
import CustomerSelect from "@/components/CustomerSelect";
import { deepClone } from "@/utils/index";
const { proxy } = getCurrentInstance();
const props = defineProps({
	infoData: {
		type: Object,
		default: null
	},
	customerId: {
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
const businessTermDate = ref([]);
const registerArea = ref([]);

let formData = ref({
	customerName: null,
	customerType: null,
	obligorName: null,
	remark: null
}); //不能修改const 定义的数据

const dataScope = reactive({
	customerAttr: {
		option: {
			inputW: "100%",
			placeholder: "请选择客户信息",
			dialogTitle: "客户信息",
			queryUrl: "/cust/customer/list"
		},
		queryPropList: [
			{
				prop: "customerNo",
				label: "客户编号"
			},
			{
				prop: "customerName",
				label: "客户名称"
			}
		],
		tablePropList: [
			{
				prop: "customerNo",
				label: "客户编号"
			},
			{
				prop: "customerName",
				label: "客户名称"
			}
		]
	}, // 客户
	obligorAttr: {
		option: {
			inputW: "100%",
			placeholder: "请选择债务人",
			dialogTitle: "债务人信息",
			queryUrl: "/cust/customer/list"
		},
		queryPropList: [
			{
				prop: "customerNo",
				label: "债务人编号"
			},
			{
				prop: "customerName",
				label: "债务人名称"
			}
		],
		tablePropList: [
			{
				prop: "customerNo",
				label: "债务人编号"
			},
			{
				prop: "customerName",
				label: "债务人名称"
			}
		]
	}, // 债务人
	rules: {
		"customerManager": [
			{ required: true, message: "客户经理不能为空", trigger: "blur" }
		],
		"customerName": [
			{ required: true, message: "客户名称不能为空", trigger: "blur" }
		],
		"name": [{ required: true, message: "简称不能为空", trigger: "blur" }],
		"phone": [
			{
				pattern: /^1[3456789]\d{9}$/,
				message: " 请输入正确的手机号",
				trigger: "blur"
			}
		],
		"companyInfo.businessScope": [
			{ required: true, message: "营业范围不能为空", trigger: "blur" }
		],
		"companyInfo.foundDate": [
			{ required: true, message: "公司成立日不能为空", trigger: "change" }
		],
		"companyInfo.blocCustomer": [
			{ required: true, message: "集团内客户不能为空", trigger: "change" }
		],
		"companyInfo.companyMail": [
			{
				pattern: /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/,
				message: " 请输入正确的客户邮箱",
				trigger: "blur"
			}
		],
		"companyInfo.registerCapital": [
			{
				pattern: /^([0-9]\d{0,8}|1000000000)(\.\d{0,2})?$/,
				message: " 请输入 0-10亿 的正数，可保留两位小数",
				trigger: "blur"
			}
		],
		"companyInfo.realIncomeCapital": [
			{
				pattern: /^([0-9]\d{0,8}|1000000000)(\.\d{0,2})?$/,
				message: " 请输入 0-10亿 的正数，可保留两位小数",
				trigger: "blur"
			}
		],
		"companyInfo.businessScale": [
			{ required: true, message: "经营规模不能为空", trigger: "change" }
		],
		"companyInfo.economicType": [
			{ required: true, message: "经济类型不能为空", trigger: "change" }
		],
		"companyInfo.nationalIndustryClassify": [
			{ required: true, message: "国标行业分类不能为空", trigger: "change" }
		]
	}
});

const { customerAttr, obligorAttr, rules } = toRefs(dataScope);

watch(
	() => props.infoData,
	(newValue, oldValue) => {
		console.log(newValue);
		formData.value = deepClone(newValue);

		// // 上级公司的名称获取
		// const parentCustomerId = formData.value.companyInfo.parentCustomerId;
		// if (parentCustomerId && parentCustomerId !== "") {
		// 	let param = { customerId: parentCustomerId };
		// 	listInfo(param).then(response => {
		// 		if (response.rows && response.rows.length > 0) {
		// 			formData.value.companyInfo.parentCustomerName =
		// 				response.rows[0].customerName;
		// 			customerAttr.value.showValue = response.rows[0].customerName;
		// 		}
		// 	});
		// } else {
		// 	formData.value.companyInfo.parentCustomerName = "";
		// }
		// delete formData.value.commonFileList;
		// delete formData.value.bankInfoList;
		// console.log("基本信息", formData.value);
	},
	{ immediate: true, deep: true }
);

watch(
	registerArea,
	(newValue, oldValue) => {
		formData.value.companyInfo.registerCountry = newValue[0];
		formData.value.companyInfo.registerProvince = newValue[1];
		formData.value.companyInfo.registerCity = newValue[2];
		// console.log('读取地区', formData.value.companyInfo)
	},
	{ deep: true }
);

watch(
	businessTermDate,
	(newValue, oldValue) => {
		formData.value.companyInfo.businessTermStartDate = newValue[0];
		formData.value.companyInfo.businessTermEndDate = newValue[1];
		// console.log('读取公司信息',formData.value.companyInfo)
	},
	{ deep: true }
);

// 客户名称选择
function customerSelectRow(row) {
	formData.value.customerNameId = row.customerId;
	formData.value.customerName = row.customerName;
}

// 债务人名称选择
function obligorSelectRow(row) {
	formData.value.obligorNameId = row.customerId;
	formData.value.obligorName = row.customerName;
}

// 表单验证
function validForm() {
	let result = false;
	this.$refs["elForm"].validate(valid => {
		console.log(valid);
		result = valid;
	});
	return result;
}

defineExpose({
	formData,
	validForm
});
</script>

<style lang="scss" scoped>
.box-card {
	margin-bottom: 20px;
}

.page {
	margin-top: 10px;
}

.fixed-width-input .el-input__inner {
	width: 230px;
}
</style>
