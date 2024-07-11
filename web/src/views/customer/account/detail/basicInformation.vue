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
						<el-form-item label="客户名称" prop="name">
							<el-input
								class="fixed-width-input"
								v-model="formData.customerManager"
								placeholder="请输入客户经理"
								clearable
								maxlength="64"
							></el-input>
						</el-form-item>
					</el-col>
					<el-col :xl="6" :lg="8" :sm="12" :xs="24">
						<el-form-item label="客户种类" prop="type">
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
						<el-form-item label="债务人名称" prop="otherName">
							<el-input
								class="fixed-width-input"
								v-model="formData.name"
								placeholder="请输入简称"
								clearable
								maxlength="32"
							></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24">
						<el-form-item label="备注" prop="companyInfo.businessScope">
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
import { listInfo } from "@/api/customer/index";
import { pcaTextArr } from "element-china-area-data";
import CustomerSelect from "@/components/CustomerSelect";
import ElPriceInput from "@/components/ElPriceInput";
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

const dataScope = reactive({
	parentCustomer: {
		showValue: "",
		option: {
			inputW: "100%",
			placeholder: "请选择上级公司",
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
	},
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
	} //验证规律
});

const { parentCustomer, rules } = toRefs(dataScope);

const {
	cust_economy_type,
	cust_enterprise_size,
	cust_manage_features,
	cust_listed_mark,
	sys_true_or_false,
	cust_industry_type,
	cust_business_status
} = proxy.useDict(
	"cust_economy_type",
	"cust_enterprise_size",
	"cust_manage_features",
	"cust_listed_mark",
	"sys_true_or_false",
	"cust_industry_type",
	"cust_business_status"
); //下拉框字典

let formData = ref({}); //不能修改const 定义的数据

watch(
	() => props.infoData,
	(newValue, oldValue) => {
		console.log(newValue);
		formData.value = deepClone(newValue);
		// 注册地址组件初始化
		if (
			formData.value.companyInfo.registerCountry &&
			formData.value.companyInfo.registerCountry !== "" &&
			formData.value.companyInfo.registerProvince &&
			formData.value.companyInfo.registerProvince !== "" &&
			formData.value.companyInfo.registerCity &&
			formData.value.companyInfo.registerCity !== ""
		) {
			registerArea.value = [
				formData.value.companyInfo.registerCountry,
				formData.value.companyInfo.registerProvince,
				formData.value.companyInfo.registerCity
			];
		}
		// 营业期限初始化
		if (
			formData.value.companyInfo.businessTermStartDate &&
			formData.value.companyInfo.businessTermStartDate !== "" &&
			formData.value.companyInfo.businessTermEndDate &&
			formData.value.companyInfo.businessTermEndDate !== ""
		) {
			businessTermDate.value = [
				formData.value.companyInfo.businessTermStartDate,
				formData.value.companyInfo.businessTermEndDate
			];
		}
		// 上级公司的名称获取
		const parentCustomerId = formData.value.companyInfo.parentCustomerId;
		if (parentCustomerId && parentCustomerId !== "") {
			let param = { customerId: parentCustomerId };
			listInfo(param).then(response => {
				if (response.rows && response.rows.length > 0) {
					formData.value.companyInfo.parentCustomerName =
						response.rows[0].customerName;
					parentCustomer.value.showValue = response.rows[0].customerName;
				}
			});
		} else {
			formData.value.companyInfo.parentCustomerName = "";
		}
		delete formData.value.commonFileList;
		delete formData.value.bankInfoList;
		console.log("基本信息", formData.value);
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

function handleChange(val) {
	console.log(val);
}

// 上级公司选择
function parentCustomerSelect(row) {
	// console.log(row)
	parentCustomer.value.showValue = row.customerName;
	formData.value.companyInfo.parentCustomerId = row.customerId;
	formData.value.companyInfo.parentCustomerName = row.customerName;
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
</style>
<style>
.fixed-width-input .el-input__inner {
	width: 230px;
}
</style>
