<template>
	<el-form class="info-form" ref="elForm" :model="formData" :rules="rules" label-width="140px"
		:disabled="props.routerQueryObj.viewFlag">
		<el-collapse v-model="activeNames" style="border-top: 0;">
			<el-collapse-item title="客户额度" name="6">
				<el-row :gutter="15" style="margin-right: 30px;">
					<el-col :xl="6" :lg="8" :sm="12" :xs="24">
						<el-form-item label="授信性质" prop="creditNature">
							<el-radio-group v-model="formData.creditNature">
								<el-radio v-for="dict in cust_credit_quality" :label="dict.value" :name="dict.value" :key="dict.value">{{dict.label }}</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
					<el-col :xl="6" :lg="8" :sm="12" :xs="24">
						<el-form-item label="额度种类组" prop="quotaTypeGroup">
							<el-select v-model="formData.quotaTypeGroup" filterable placeholder="请选择">
								<el-option v-for="item in cust_credit_type" :key="item.value" :label="item.label"
									:value="item.value">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :xl="6" :lg="8" :sm="12" :xs="24">
						<el-form-item label="币种" prop="currency">
							<el-select v-model="formData.currency" filterable placeholder="请选择">
								<el-option v-for="item in sys_currency_type" :key="item.value" :label="item.label"
									:value="item.value">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :xl="6" :lg="8" :sm="12" :xs="24">
						<el-form-item label="额度上限" prop="quotaCeiling">
							<ElPriceInput v-model:form="formData" prop="quotaCeiling" :rules="rules"
								:disabled="props.routerQueryObj.viewFlag" :placeholder="'请输入'">
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
						<el-form-item label="额度是否循环" prop="quotaIsCycle">
							<el-radio-group v-model="formData.quotaIsCycle">
								<el-radio v-for="dict in sys_true_or_false" :label="dict.value" :name="dict.value"
									:key="dict.value">
									{{ dict.label }}
								</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
					<el-col :xl="6" :lg="8" :sm="12" :xs="24">
						<el-form-item label="额度有效期限" prop="quotaDate">
							<el-date-picker clearable v-model="quotaDate" type="daterange" value-format="YYYY-MM-DD"
								start-placeholder="额度生效日" end-placeholder="额度到期日">
							</el-date-picker>
						</el-form-item>
						</el-col>
					<el-col :xl="6" :lg="8" :sm="12" :xs="24">
						<el-form-item label="总额度" prop="totalAmount">
							<ElPriceInput v-model:form="formData" prop="totalAmount" :rules="rules"
								:disabled="props.routerQueryObj.viewFlag" :placeholder="'请输入'">
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
						<el-form-item label="已使用额度" prop="usedAmount">
							<ElPriceInput v-model:form="formData" prop="usedAmount" :rules="rules"
								:disabled="props.routerQueryObj.viewFlag" :placeholder="'请输入'">
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
						<el-form-item label="可使用额度" prop="mayAmount">
							<ElPriceInput v-model:form="formData" prop="mayAmount" :rules="rules"
								:disabled="props.routerQueryObj.viewFlag" :placeholder="'请输入'">
								<template #prefix>
									<span> ￥ </span>
								</template>
								<template #suffix>
									<span> 元 </span>
								</template>
							</ElPriceInput>
						</el-form-item>
					</el-col>
				</el-row>
			</el-collapse-item>

			<el-collapse-item title="客户财报信息" name="7">
				<el-table v-loading="loading" :data="formData.commonFileList" >
				  <el-table-column label="文件类型" align="center" prop="fileType" :min-width="80" />
				  <el-table-column label="文件名称" align="center" prop="fileName" :min-width="240" />
				  <!-- <el-table-column label="oss上文件存储地址" align="center" prop="fileUrl" /> -->
				  <el-table-column label="文件大小" align="center" prop="fileSize" :min-width="120">
				
				    <template #default="scope">
				      <span>{{ formatFileSize(scope.row.fileSize) }}</span>
				    </template>
				  </el-table-column>
				
				  <el-table-column label="附件类型" align="center" prop="bizType" :min-width="120">
				    <template #default="scope">
				      <el-select v-model="scope.row.bizType" filterable placeholder="请选择" :disabled="true">
				        <el-option v-for="item in cust_file_type" :key="item.value" :label="item.label" :value="item.value">
				        </el-option>
				      </el-select>
				    </template>
				  </el-table-column>
				  <el-table-column label="附件来源" align="center" prop="fileSource" :min-width="120">
				    <template #default="scope">
				      <el-select v-model="scope.row.fileSource" placeholder="请选择" :disabled="true">
				        <el-option v-for="item in sys_file_source" :key="item.value" :label="item.label" :value="item.value">
				        </el-option>
				      </el-select>
				    </template>
				  </el-table-column>
				  <el-table-column label="操作人" align="center" prop="createBy" :min-width="120" />
				  <el-table-column label="操作时间" align="center" prop="createTime" :min-width="160">
				
				    <template #default="scope">
				      <span>{{ parseTime(scope.row.updateTime, '{y}-{m}-{d}') }}</span>
				    </template>
				  </el-table-column>
				  <el-table-column label="最近修改人" align="center" prop="updateBy" :min-width="120" />
				  <el-table-column label="最近修改时间" align="center" prop="updateTime" :min-width="160">
				
				    <template #default="scope">
				      <span>{{ parseTime(scope.row.updateTime, '{y}-{m}-{d}') }}</span>
				    </template>
				  </el-table-column>
				</el-table>
			</el-collapse-item>
		</el-collapse>
	</el-form>
</template>
<script setup>
	import ElPriceInput from "@/components/ElPriceInput"
	import { formatFileSize } from "@/utils/index"
	const {
		proxy
	} = getCurrentInstance();
	const props = defineProps({
		infoData: {
			type: Object,
			default: null,
		},
		customerId: {
			type: String,
			default: "",
		},
		routerQueryObj: {
			type: Object,
			default: null,
		}
	});
	const loading = ref(false);
	const activeNames = ref(['6','7'])
	const quotaDate = ref([]);
	const dataScope = reactive({
		rules: {
			creditNature: [{
				required: true,
				message: "授信性质不能为空",
				trigger: "change"
			}],
			quotaTypeGroup: [{
				required: true,
				message: "额度种类组不能为空",
				trigger: "change"
			}],
			currency: [{
				required: true,
				message: "币种不能为空",
				trigger: "change"
			}],
			quotaIsCycle: [{
				required: true,
				message: "额度是否循环不能为空",
				trigger: "change"
			}],
			quotaCeiling: [{
				pattern: /^1000000000$|^1000000000.0$|^1000000000.00$|^[+]{0,1}(\d{0,9})$|^[+]{0,1}(\d{0,9}\.\d{1,2})$/,
				message: ' 请输入 0-10亿 的正数，可保留两位小数',
				trigger: 'blur',
			}],
			totalAmount: [{
				pattern: /^1000000000$|^1000000000.0$|^1000000000.00$|^[+]{0,1}(\d{0,9})$|^[+]{0,1}(\d{0,9}\.\d{1,2})$/,
				message: ' 请输入 0-10亿 的正数，可保留两位小数',
				trigger: 'blur',
			}],
			usedAmount: [{
				pattern: /^1000000000$|^1000000000.0$|^1000000000.00$|^[+]{0,1}(\d{0,9})$|^[+]{0,1}(\d{0,9}\.\d{1,2})$/,
				message: ' 请输入 0-10亿 的正数，可保留两位小数',
				trigger: 'blur',
			}],
			mayAmount: [{
				pattern: /^1000000000$|^1000000000.0$|^1000000000.00$|^[+]{0,1}(\d{0,9})$|^[+]{0,1}(\d{0,9}\.\d{1,2})$/,
				message: ' 请输入 0-10亿 的正数，可保留两位小数',
				trigger: 'blur',
			}],

		}, //验证规律
	});

	const {
		rules
	} = toRefs(dataScope);

	const {
		cust_credit_quality,
		sys_currency_type,
		cust_credit_type,
		sys_true_or_false,
		cust_file_type,
		sys_file_source
	} = proxy.useDict("cust_credit_quality", "sys_currency_type", "cust_credit_type", "sys_true_or_false","cust_file_type","sys_file_source"); //下拉框字典

	let formData = ref({
		creditNature: null,
		quotaTypeGroup: "",
		currency: "1",
		quotaCeiling: "",
		quotaIsCycle: null,
		quotaEffectiveDate: "",
		quotaDueDate: "",
		totalAmount: "",
		usedAmount: "",
		mayAmount: ""
	}); //不能修改const 定义的数据
	watch(() => props.infoData, (newValue, oldValue) => {
		// console.log(newValue);
		// formData.value = Object.assign({}, newValue);
		if (newValue) {
			formData.value.creditNature = newValue.creditNature
			formData.value.quotaTypeGroup = newValue.quotaTypeGroup
			formData.value.currency = newValue.currency
			formData.value.quotaCeiling = newValue.quotaCeiling
			formData.value.quotaIsCycle = newValue.quotaIsCycle
			formData.value.quotaEffectiveDate = newValue.quotaEffectiveDate
			formData.value.quotaDueDate = newValue.quotaDueDate
			formData.value.totalAmount = newValue.totalAmount
			formData.value.usedAmount = newValue.usedAmount
			formData.value.mayAmount = newValue.mayAmount
			formData.value.commonFileList = newValue.commonFileList;
			// console.log(newValue.commonFileList)
		}
		// 额度有效期限初始化
		if (formData.value.quotaEffectiveDate && formData.value.quotaEffectiveDate !== '' &&
			formData.value.quotaDueDate && formData.value.quotaDueDate !== '') {
			quotaDate.value = [formData.value.quotaEffectiveDate, formData.value.quotaDueDate]
		}
		delete formData.value.companyInfo;
		// delete formData.value.commonFileList;
		delete formData.value.bankInfoList;
		// console.log('客户额度',formData.value)
	}, {
		immediate: true,
		deep: true
	})

	watch(quotaDate, (newValue, oldValue) => {
		formData.value.quotaEffectiveDate = newValue[0]
		formData.value.quotaDueDate = newValue[1]
		// console.log('读取公司信息',formData.value.companyInfo)
	}, {
		deep: true
	})


	function handleChange(val) {
		console.log(val);
	}

	// 表单验证
	function validForm() {
		let result = false
		this.$refs['elForm'].validate((valid) => {
			console.log(valid);
			result = valid
		})
		return result
	}

	defineExpose({
		formData,
		validForm,
	});
</script>