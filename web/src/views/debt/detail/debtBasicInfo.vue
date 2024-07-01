<template>
	<div>
		<el-row :gutter="15" justify="center">
			<el-col :span="24" :xs="24">
				<el-form ref="elForm" :model="formData" :rules="rules" label-width="140px" :inline="true"
					v-loading="loading" :disabled="props.routerQueryObj.viewFlag">
					<el-collapse v-model="activeNames" @change="handleChange">
						<el-collapse-item title="基本信息" name="1">

							<el-card class="box-card">
								<!-- contractId -->
								<el-form-item label="业务合同号" prop="otherContractNo">
									<div @click="openDiag('otherContractNo')">
										<el-input v-model="formData.otherContractNo" placeholder="请选择业务合同号"
											clearable :style="{ width: '240px' }" readonly
											suffix-icon="el-icon-search"></el-input>
									</div>

								</el-form-item>
								<el-form-item label="合同名称" prop="otherContractName">
									<el-input v-model="formData.otherContractName" placeholder="请输入合同名称"
										clearable :style="{ width: '240px' }" disabled></el-input>

								</el-form-item>
								<el-form-item label="核心客户名称" prop="coreEnterpriseName">
									<el-input v-model="formData.coreEnterpriseName" placeholder="请输入核心客户名称"
										clearable :style="{ width: '240px' }" disabled></el-input>


								</el-form-item>

								<el-form-item label="业务产品" prop="bussProduct">
									<!-- lend_buss_product -->
									<el-select v-model="formData.bussProduct" filterable placeholder="自动生成"
										:style="{ width: '240px' }" disabled>
										<el-option v-for="item in lend_buss_product" :key="item.value"
											:label="item.label" :value="item.value">
										</el-option>
									</el-select>


								</el-form-item>

								<el-form-item label="币种" prop="otherCurrencyType">
									<el-select v-model="formData.otherCurrencyType" filterable
										placeholder="自动生成" :style="{ width: '240px' }" disabled>
										<el-option v-for="item in sys_currency_type" :key="item.value"
											:label="item.label" :value="item.value">
										</el-option>
									</el-select>
								</el-form-item>


							</el-card>

						</el-collapse-item>



						<el-collapse-item title="应收账款管理" name="2">





							<!-- <el-form-item label="保理申请人" prop="factoringApplicantName">
								<div @click="openDiag('factoringApplicantName', formDataPiliang)">
									<el-input v-model="formDataPiliang.factoringApplicantName" placeholder="请选择保理申请人"
										clearable :style="{ width: '240px' }" readonly
										suffix-icon="el-icon-search"></el-input>
								</div>

							</el-form-item>


							<el-form-item label="凭证提供方" prop="voucherProviderName">
								<div @click="openDiag('voucherProviderName', formDataPiliang)">
									<el-input v-model="formDataPiliang.voucherProviderName" placeholder="请选择凭证提供方"
										clearable :style="{ width: '240px' }" readonly
										suffix-icon="el-icon-search"></el-input>
								</div>

							</el-form-item>


							<el-form-item label="开票日" prop="invoiceDate">
								<el-date-picker clearable v-model="formDataPiliang.invoiceDate" type="date"
									value-format="YYYY-MM-DD" placeholder="请选择开票日" :style="{ width: '240px' }">
								</el-date-picker>

							</el-form-item>
							<el-form-item label="到期日" prop="dueDate">
								<el-date-picker clearable v-model="formDataPiliang.dueDate" type="date"
									value-format="YYYY-MM-DD" placeholder="请选择到期日" :style="{ width: '240px' }">
								</el-date-picker>

							</el-form-item> -->




							<div class="header-button-operate" v-if="!props.routerQueryObj.viewFlag">
								<el-button type="text" @click="handleAddVoucherList()"
									v-hasPermi="['sys:file:export']">新增</el-button>
								<!-- <el-button type="primary" link @click="handleDeleteLoanList()" :disabled="single">删除</el-button> -->

							</div>
							<el-table v-loading="loading" :data="formData.voucherList"
								@selection-change="handleSelectionChange" style="margin-bottom: 20px;">
								<!-- <el-table-column type="selection" width="55" align="center" /> -->

								<el-table-column label="序号" align="center" type="index" width="60" fixed />
								<!-- <el-table-column label="oss上文件存储地址" align="center" prop="fileUrl" /> -->
								<!-- factoringApplicantNo -->
								<el-table-column label="保理申请人" align="center" prop="factoringApplicantName" width="300"
									fixed>
									<template #default="scope">
										<div @click="openDiag('factoringApplicantName', scope.row)">
											<el-input v-model="scope.row.factoringApplicantName" placeholder="请选择保理申请人"
												clearable :style="{ width: '240px' }" readonly
												suffix-icon="el-icon-search"></el-input>
										</div>
									</template>
								</el-table-column>
								<el-table-column label="凭证号码" align="center" prop="voucherNo" width="300">
									<template #default="scope">
										<el-input v-model="scope.row.voucherNo" placeholder="请输入" clearable
											:style="{ width: '240px' }" maxlength="32" />
									</template>
								</el-table-column>
								<el-table-column label="凭证金额" align="center" prop="voucherAmount" width="300">
									<template #default="scope">
										<ElPriceInput v-model:form="scope.row" prop="voucherAmount" :rules="rules"
											:placeholder="'请输入'"></ElPriceInput>
										<!-- <el-input v-model="scope.row.voucherAmount" placeholder="请输入" clearable
                                            :style="{ width: '240px' }" /> -->
									</template>
								</el-table-column>
								<el-table-column label="应收账款金额" align="center" prop="debtReceivableAmount" width="300">
									<template #default="scope">
										<ElPriceInput v-model:form="scope.row" prop="debtReceivableAmount"
											:rules="rules" :placeholder="'请输入'"></ElPriceInput>
										<!-- <el-input v-model="scope.row.debtReceivableAmount" placeholder="请输入" clearable
                                            :style="{ width: '240px' }" /> -->
									</template>
								</el-table-column>
								<el-table-column label="开票日" align="center" prop="invoiceDate" width="300">
									<template #default="scope">
										<el-date-picker clearable v-model="scope.row.invoiceDate" type="date"
											value-format="YYYY-MM-DD" placeholder="请选择开票日" :style="{ width: '240px' }">
										</el-date-picker>
									</template>
								</el-table-column>
								<el-table-column label="到期日" align="center" prop="dueDate" width="300">
									<template #default="scope">
										<el-date-picker clearable v-model="scope.row.dueDate" type="date"
											value-format="YYYY-MM-DD" placeholder="请选择到期日" :style="{ width: '240px' }">
										</el-date-picker>
									</template>
								</el-table-column>


								<!-- voucherProviderNo -->
								<el-table-column label="凭证提供方" align="center" prop="voucherProviderName" width="300">
									<template #default="scope">
										<div @click="openDiag('voucherProviderName', scope.row)">
											<el-input v-model="scope.row.voucherProviderName" placeholder="请选择凭证提供方"
												clearable :style="{ width: '240px' }" readonly
												suffix-icon="el-icon-search"></el-input>
										</div>
									</template>
								</el-table-column>
								<el-table-column label="煤炭吨数" align="center" prop="coalTon" width="300">
									<template #default="scope">
										<ElPriceInput v-model:form="scope.row" prop="coalTon" :rules="rules"
											:placeholder="'请输入'"></ElPriceInput>
										<!-- <el-input v-model="scope.row.coalTon" placeholder="请输入" clearable
											:style="{ width: '240px' }" maxlength="32" /> -->
									</template>
								</el-table-column>

								<el-table-column label="单价(元/吨)" align="center" prop="price" min-width="300">
									<template #default="scope">
										<ElPriceInput v-model:form="scope.row" prop="price" :rules="rules" 
											:placeholder="'请输入'"></ElPriceInput>
										<!-- <el-input v-model="scope.row.price" placeholder="请输入" clearable
                                            :style="{ width: '240px' }" /> -->
									</template>
								</el-table-column>
								<el-table-column label="备注" align="center" prop="remark" min-width="300">
									<template #default="scope">
										<el-input v-model="scope.row.remark" placeholder="请输入" clearable type="textarea"
											:style="{ width: '240px' }" maxlength="125" />
									</template>
								</el-table-column>
								<el-table-column label="操作" align="center" class-name="small-padding fixed-width"
									fixed='right' v-if="!props.routerQueryObj.viewFlag">
									<template #default="scope">
										<el-button link type="primary" icon="Delete"
											@click="handleDeleteVoucherList(scope.row)">删除</el-button>
									</template>
								</el-table-column>
							</el-table>


						</el-collapse-item>

					</el-collapse>

				</el-form>
			</el-col>
		</el-row>
		<DialogTableMulti v-model:multiQuery="multiQuery" v-model:open="multiQuery.open" v-model:tableData="tableData"
			v-model:prop="propMulti" @selectRow="selectRow" @pageChange="pageChange" />
	</div>
</template>
<script setup>
	import {
		reactive,
		ref
	} from "vue";
	const {
		proxy
	} = getCurrentInstance();
	import {
		getContList
	} from "@/api/debt/info"
	import {
		listInfo as getUserList
	} from "@/api/customer/index"
	import {
		deepClone
	} from "@/utils/index"
	const props = defineProps({
		debtInfo: {
			type: Object,
			default: null,
		},
		// 新增为空
		debtId: {
			type: String,
			default: "",
		},
		routerQueryObj: {
			type: Object,
			default: null,
		}

	});
	let multiQuery = ref({
		title: "合同信息", //标题
		open: false,
		currentPage: 1,
		total: 1,
		pageSize: 10,
	});
	const propMulti = ref([{
		label: '业务合同号',
		value: 'otherContractNo'
	}, {
		label: '合同名称',
		value: 'otherContractName'
	}, {
		label: '核心客户名称',
		value: 'coreEnterpriseName'
	}]);
	const activeNames = ref(['1', '2']); //tab打开状态
	const loading = ref(false);
	const dataScope = reactive({
		rules: {
			contractNo: [{
				required: true,
				message: "业务合同号不能为空",
				trigger: "change"
			}],
		}, //验证规律
		formDataPiliang: {
			factoringApplicantNo: null,
			factoringApplicantName: null,
			invoiceDate: null,
			dueDate: null,
			voucherProviderNo: null,
			voucherProviderName: null,
		}
	});

	const {
		rules,
		formDataPiliang
	} = toRefs(dataScope);


	const {
		sys_currency_type,
		proj_dd_type,
		lend_buss_product
	} = proxy.useDict("sys_currency_type", "proj_dd_type", "lend_buss_product"); //下拉框字典

	let formData = ref({
		contract: {
			"createBy": null,
			"createById": null,
			"createTime": null,
			"updateBy": null,
			"updateById": null,
			"updateTime": null,
			"delFlag": null,
			"remark": null,
			"contractId": null,
			"contractNo": "",
			"bussProduct": null,
			"projectNo": "",
			"projectName": "",
			"baseContractStartDate": null,
			"baseContractEndDate": null,
			"baseSealTime": null,
			"baseGraceDays": null,
			"baseChargeInterestWay": null,
			"baseSettleInterestWay": null,
			"basePrincipalConfirmParty": null,
			"baseProvince": null,
			"baseIndustryType": null,
			"baseItem": null,
			"baseRemark": null,
			"baseSignStatus": null,
			"baseSignOpinion": null,
			"agreeDebtorName": "",
			"agreeCompanyNo": null,
			"agreeSettlement": null,
			"agreePaymentLimit": null,
			"agreePaymentStartDate": null,
			"agreePaymentEndDate": null,
			"agreePaymentVerify": null,
			"agreeStartDate": "",
			"agreePaymentMaxLimit": null,
			"agreeAdvance": null,
			"agreeAdvanceGraceDays": null,
			"agreeAdvancePercentage": null,
			"agreeGuaranteePaymentLimit": null,
			"agreePay": null,
			"agreeBuyerPoolCeiling": null,
			"agreeOverrun": null,
			"agreeInform": null,
			"agreeInformOther": null,
			"agreeTransferPart": null,
			"branchCustomerId": null,
			"branchType": null,
			"branchInterestCycle": null,
			"branchFineRate": null,
			"accountType": null,
			"accountName": null,
			"accountCustomerName": null,
			"accountDebtorName": null,
			"accountBankName": null,
			"accountBankAccount": null,
			"accountRemark": null,
			"repayLoan": null,
			"otherContractNo": "",
			"otherContractName": "",
			"otherCurrencyType": null,
			"otherContractAmount": null,
			"otherQuotaCeiling": null,
			"otherQuotaCircle": null,
			"otherRemark": null,
			"validFlag": null,
			"feeList": null,
			"interestList": null,
			"commonFileList": []
		},
	}); //不能修改const 定义的数据

	watch(() => props.debtInfo, (newValue, oldValue) => {
		console.log(newValue);
		if (newValue) {
			formData.value = deepClone(newValue);
			delete formData.value.commonFileList;
		}
	}, {
		immediate: true,
		deep: true
	})


	watch(() => formDataPiliang.value.factoringApplicantNo, (newValue, oldValue) => {
		formData.value.voucherList.forEach((item) => {
			item.factoringApplicantNo = newValue;
			item.factoringApplicantName = formDataPiliang.value.factoringApplicantName;

		})
	}, {
		deep: true
	})
	watch(() => formDataPiliang.value.voucherProviderNo, (newValue, oldValue) => {
		formData.value.voucherList.forEach((item) => {
			item.voucherProviderNo = newValue;
			item.voucherProviderName = formDataPiliang.value.voucherProviderName;

		})
	}, {
		deep: true
	})
	watch(() => formDataPiliang.value.invoiceDate, (newValue, oldValue) => {
		formData.value.voucherList.forEach((item) => {
			item.invoiceDate = newValue;

		})
	}, {
		deep: true
	})
	watch(() => formDataPiliang.value.dueDate, (newValue, oldValue) => {
		formData.value.voucherList.forEach((item) => {
			item.dueDate = newValue;
		})
	}, {
		deep: true
	})


	function handleChange(val) {
		console.log(val);
	}

	// 表单验证
	function validForm() {
		let result = false
		proxy.$refs['elForm'].validate((valid) => {
			console.log(valid);
			result = valid
		})
		return result
	}


	// 用户组件请求信息
	const userParams = ref({
		pageNum: 1,
		pageSize: 10,
	})
	const tableData = ref([]);
	const tableDataCont = ref([]);
	const tableDataUser = ref([]);
	let totalCont = ref([]);
	let totalUser = ref([]);
	let checkItem = ref("")
	let updateItem = ref(null);

	// 打开用户信息选择框 请求用户信息
	function openDiag(options, row) {
		if (row) {
			updateItem.value = row;
		} else {
			updateItem.value = null;
		}
		if (options == 'otherContractNo' && tableDataCont.value.length) {
			tableData.value = tableDataCont.value;
			multiQuery.value.total = totalCont.value;
			setDialogTitle(options);
			multiQuery.value.open = true;
		} else if (options != 'otherContractNo' && tableDataUser.value.length) {
			tableData.value = tableDataUser.value;
			multiQuery.value.total = totalUser.value;
			setDialogTitle(options);
			multiQuery.value.open = true;
		} else {

			loading.value = true;
			if (options == 'otherContractNo') {
				getContList(userParams.value).then(response => {
					tableData.value = [];
					loading.value = false;
					response.rows.map((item) => {
						// item.parentCustomerName = item.companyInfo.parentCustomerName;
						tableData.value.push(item)
					});

					tableDataCont.value = response.rows;
					totalCont.value = response.total;

					multiQuery.value.total = response.total;

					setDialogTitle(options);
					multiQuery.value.open = true;
				});
			} else {
				getUserList(userParams.value).then(response => {
					loading.value = false;
					tableData.value = [];
					response.rows.map((item) => {
						// item.parentCustomerName = item.companyInfo.parentCustomerName;
						tableData.value.push(item)
					});
					tableDataUser.value = response.rows;
					totalUser.value = response.total;
					multiQuery.value.total = response.total;
					setDialogTitle(options);
					multiQuery.value.open = true;
				});
			}
		}
		checkItem.value = options;
	}

	function setDialogTitle(options) {
		if (options == 'otherContractNo') {
			multiQuery.value.title = "合同信息";
			propMulti.value = [{
				label: '业务合同号',
				value: 'otherContractNo'
			}, {
				label: '合同名称',
				value: 'otherContractName'
			}, {
				label: '核心客户名称',
				value: 'coreEnterpriseName'
			}];

		} else {
			multiQuery.value.title = "客户信息";
			propMulti.value = [{
				label: '客户编号',
				value: 'customerNo'
			}, {
				label: '上级公司',
				value: 'parentCustomerName'
			}, {
				label: '客户名称',
				value: 'customerName'
			}];
		}
	}
	// 弹出用户信息分页处理
	function pageChange(page) {
		userParams.value.pageNum = page;
		loading.value = true;
		if (options == 'otherContractNo') {
			getContList(userParams.value).then(response => {
				loading.value = false;
				tableData.value = [];
				response.rows.map((item) => {
					// item.parentCustomerName = item.companyInfo.parentCustomerName;
					tableData.value.push(item)
				});
				multiQuery.value.total = response.total;
				setDialogTitle(options);
				multiQuery.value.open = true;
			});
		} else {
			getUserList(userParams.value).then(response => {
				loading.value = false;
				tableData.value = [];
				response.rows.map((item) => {
					// item.parentCustomerName = item.companyInfo.parentCustomerName;
					tableData.value.push(item)
				});
				multiQuery.value.total = response.total;
				setDialogTitle(options);
				multiQuery.value.open = true;
			});
		}
	}
	// 选择了用户信息；
	function selectRow(rows) {
		if (checkItem.value == 'otherContractNo') {
			formData.value.otherContractNo = rows.otherContractNo
			formData.value.otherContractName = rows.otherContractName
			formData.value.coreEnterpriseName = rows.coreEnterpriseName
			formData.value.otherCurrencyType = rows.otherCurrencyType
			formData.value.bussProduct = rows.bussProduct
			formData.value.contractId = rows.contractId
		} else if (checkItem.value == 'customerNo') {
			formData.value.customerName = rows.customerName
			formData.value.customerNo = rows.customerNo
		} else if (checkItem.value == 'contractNo') {
			formData.value.customerName = rows.customerName
			formData.value.contractNo = rows.customerNo
		} else if (checkItem.value == 'voucherProviderName') {
			updateItem.value.voucherProviderName = rows.customerName
			updateItem.value.voucherProviderNo = rows.customerNo
		} else if (checkItem.value == 'factoringApplicantName') {
			updateItem.value.factoringApplicantName = rows.customerName
			updateItem.value.factoringApplicantNo = rows.customerNo
		}
	}

	function handleAddVoucherList() {

		formData.value.voucherList.push({
			indexCount: Math.random(),
			debtId: props.debtId,
			voucherId: null,
			factoringApplicantNo: null,
			factoringApplicantName: null,
			voucherNo: null,
			voucherAmount: null,
			debtReceivableAmount: null,
			invoiceDate: null,
			dueDate: null,
			voucherProviderNo: null,
			voucherProviderName: null,
			coalTon: null,
			price: null,
			loanRatio: null,
			financingRatio: null,
			isDiscount: null,
			discountAmount: null,
			remark: null,
			status: null,
			transferenceTime: null,
			transferenceStatus: null,
			createBy: null,
			createById: null,
			updateBy: null,
			updateById: null,
			delFlag: null,
			createTime: null,
			updateTime: null
		});
	}


	function handleDeleteVoucherList(rows) {
		const indexCount = rows ? [rows.voucherId ? rows.voucherId : rows.indexCount] : ids.value;
		let jugeItem = 'voucherId';
		if (!rows.voucherId) {
			jugeItem = 'indexCount';
		}
		indexCount.forEach((names) => {
			formData.value.voucherList = formData.value.voucherList.filter((item) => {
				return item[jugeItem] != names;
			})

		})
		single.value = false;
		multiple.value = false;
	}
	defineExpose({
		formData,
		validForm,
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