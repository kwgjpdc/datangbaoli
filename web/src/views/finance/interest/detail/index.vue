<template>
	<div class="app-container info-form-container" v-loading="loading" ref="appContainerView">
		<div class="content">
			<div class="operate-button" v-if="!routerQueryObj.approveFlag">
				<el-row :gutter="10" justify="end">
					<el-col :span="1.5" v-if="!routerQueryObj.viewFlag">
						<el-button type="primary" icon="List" @click="submitForm(1)">暂存</el-button>
					</el-col>
					<el-col :span="1.5" v-if="!routerQueryObj.viewFlag">
						<el-button type="primary" icon="Checked" @click="submitForm(2)">提交</el-button>
					</el-col>
					<el-col :span="1.5">
						<el-button type="primary" icon="CircleCloseFilled" @click="closePage">返回</el-button>
					</el-col>
				</el-row>
			</div>
			<div class="content-item-scroll">
				<el-form class="info-form" ref="elForm" :model="formData" :rules="rules" label-width="140px"
					:disabled="routerQueryObj.viewFlag" :validate-on-rule-change="false">
					<el-collapse v-model="activeNames">
						<el-collapse-item title="预提利息信息" name="1">
							<el-row :gutter="15" style="margin-right: 30px;">
								<el-col :xl="6" :lg="8" :sm="12" :xs="24">
									<el-form-item label="放款编号" prop="loanNo">
										<CustomerSelect :option="loanNo.option" :showValue="formData.loanNo"
											:queryPropList="loanNo.queryPropList" :tablePropList="loanNo.tablePropList"
											@selectRow="getLoanInfo"></CustomerSelect>
									</el-form-item>
								</el-col>
								<el-col :xl="6" :lg="8" :sm="12" :xs="24">
									<el-form-item label="业务合同号" prop="contractNo">
										<el-input v-model="formData.contractNo" placeholder="请输入业务合同号" maxlength="60" disabled/>
									</el-form-item>
								</el-col>
								<el-col :xl="6" :lg="8" :sm="12" :xs="24">
									<el-form-item label="业务产品" prop="bussProduct">
										<el-select v-model="formData.bussProduct" placeholder="请选择" disabled>
											<el-option v-for="item in lend_buss_product" :key="item.value"
												:label="item.label" :value="item.value">
											</el-option>
										</el-select>
									</el-form-item>
								</el-col>
								<el-col :xl="6" :lg="8" :sm="12" :xs="24">
									<el-form-item label="结息方式" prop="settleInterestWay">
										<el-select v-model="formData.settleInterestWay" placeholder="请选择" disabled>
											<el-option v-for="item in cont_interest_settlement" :key="item.value"
												:label="item.label" :value="item.value">
											</el-option>
										</el-select>
									</el-form-item>
								</el-col>
								<el-col :xl="6" :lg="8" :sm="12" :xs="24">
									<el-form-item label="核心客户名称" prop="coreEnterpriseName">
										<el-input v-model="formData.coreEnterpriseName" placeholder="请输入核心客户名称" disabled
											maxlength="60" />
									</el-form-item>
								</el-col>
								<el-col :xl="6" :lg="8" :sm="12" :xs="24">
									<el-form-item label="保理申请人名称" prop="factoringApplicantName">
										<el-input v-model="formData.factoringApplicantName" placeholder="请输入保理申请人名称" disabled
											maxlength="60" />
									</el-form-item>
								</el-col>
								<el-col :xl="6" :lg="8" :sm="12" :xs="24">
									<el-form-item label="放款金额" prop="loanAmount">
										<ElPriceInput :form="formData" prop="loanAmount" :rules="rules.loanAmount" disabled
											:placeholder="'请输入放款金额'">
										</ElPriceInput>
									</el-form-item>
								</el-col>
								<el-col :xl="6" :lg="8" :sm="12" :xs="24">
									<el-form-item label="放款余额" prop="loanBalance">
										<ElPriceInput :form="formData" prop="loanBalance" :rules="rules.loanBalance" disabled
											:placeholder="'请输入放款余额'">
										</ElPriceInput>
									</el-form-item>
								</el-col>
								<el-col :xl="6" :lg="8" :sm="12" :xs="24">
									<el-form-item label="放款日" prop="loanExpectDate">
										<el-date-picker v-model="formData.loanExpectDate" type="date" disabled
											value-format="YYYY-MM-DD" placeholder="请选择放款日"></el-date-picker>
									</el-form-item>
								</el-col>
								<el-col :xl="6" :lg="8" :sm="12" :xs="24">
									<el-form-item label="到期日" prop="loanExpireDate">
										<el-date-picker v-model="formData.loanExpireDate" type="date" disabled
											value-format="YYYY-MM-DD" placeholder="请选择到期日"></el-date-picker>
									</el-form-item>
								</el-col>
								<el-col :xl="6" :lg="8" :sm="12" :xs="24">
									<el-form-item label="实际还款日" prop="payBackDate">
										<el-date-picker v-model="formData.payBackDate" type="date" disabled
											value-format="YYYY-MM-DD" placeholder="请选择实际还款日"></el-date-picker>
									</el-form-item>
								</el-col>
								<el-col :xl="6" :lg="8" :sm="12" :xs="24">
									<el-form-item label="预提日" prop="totalAppropriation">
										<el-date-picker v-model="formData.extractionDate" type="daterange" :disabled="routerQueryObj.viewFlag"
											value-format="YYYY-MM-DD" start-placeholder="起始日期" end-placeholder="结束日期"
											@change="extractionChange"></el-date-picker>
									</el-form-item>
								</el-col>
								<el-col :xl="6" :lg="8" :sm="12" :xs="24">
									<el-form-item label="预提天数" prop="extractionDays">
										<el-input v-model="formData.extractionDays" placeholder="请输入预提天数" maxlength="9" disabled>
											<template #suffix><span>天</span></template>
										</el-input>
									</el-form-item>
								</el-col>
								<el-col :xl="6" :lg="8" :sm="12" :xs="24">
									<el-form-item label="预提利息" prop="extractionAmount">
										<ElPriceInput :form="formData" prop="extractionAmount" :disabled="routerQueryObj.viewFlag"
											:rules="rules.extractionAmount" :placeholder="'请输入预提利息'">
										</ElPriceInput>
									</el-form-item>
								</el-col>
							</el-row>
						</el-collapse-item>
					</el-collapse>
				</el-form>
				<div class="content-item-scroll" v-if="!routerQueryObj.viewFlag">
				    <flow-search id="flowSearch" ref="flowSearchRef" :routerQueryObj="routerQueryObj" :needUser="false"></flow-search>
				</div>
			</div>

		</div>

	</div>
</template>
<script setup>
	import { ref, computed, onBeforeMount, watch } from "vue";
	import {
		getInfo,
		addInfo,
		updateInfo
	} from "@/api/finance/interest"
	import {
		deepClone
	} from "@/utils/index"
	import dayjs from "dayjs"
	import ElPriceInput from "@/components/ElPriceInput"
	import CustomerSelect from "@/components/CustomerSelect"
	import FlowSearch from '@/views/flowable/search/index.vue'

	const {
		proxy
	} = getCurrentInstance();
	const route = useRoute();
	const router = useRouter();
	const loading = ref(false);

	const {
		cont_interest_settlement,
		lend_buss_product
	} = proxy.useDict("cont_interest_settlement", "lend_buss_product")
	const activeNames = ref(['1'])

	const data = reactive({
		loanNo: {
			option: {
				placeholder: "请选择放款编号",
				dialogTitle: "放款信息",
				queryUrl: "/loan/extraction/loan"
			},
			queryPropList: [{
					prop: "contractNo",
					label: "业务合同号"
				},
				{
					prop: "factoringApplicantName",
					label: "保理申请人"
				},
				{
					prop: "coreEnterpriseName",
					label: "核心企业"
				}
			],
			tablePropList: [{
					prop: "loanNo",
					label: "放款编号",
					fixed: "left"
				},
				{
					prop: "contractNo",
					label: "业务合同号",
				},
				{
					prop: "factoringApplicantName",
					label: "保理申请人",
				},
				{
					prop: "coreEnterpriseName",
					label: "核心企业",
				},
				{
					prop: "loanAmount",
					label: "放款金额",
					type: "money"
				},
				{
					prop: "loanBalance",
					label: "放款余额",
					type: "money"
				},
				{
					prop: "loanExpectDate",
					label: "放款日",
					type: "date"
				},
				{
					prop: "loanExpireDate",
					label: "到期日",
					type: "date"
				}
			]
		},
		formData: {
			extractionId: null,
			extractionVoucherId: null,
			loanId: null,
			delFlag: 0,
			loanNo: "",
			contractNo: "",
			bussProduct: "",
			settleInterestWay: "",
			coreEnterpriseName: "",
			factoringApplicantName: "",
			loanAmount: "",
			loanBalance: "",
			loanAmount: "",
			loanExpectDate: "",
			loanExpireDate: "",
			payBackDate: "",
			extractionDate: [],
			extractionStartDate: "",
			extractionEndDate: "",
			extractionDays: "",
			extractionAmount: ""
		},
		rules: {
			loanAmount: [{
				pattern: /^1000000000$|^1000000000.0$|^1000000000.00$|(^[1-9](\d{0,8})?(\.\d{1,2})?$)|(^0$)|(^\d\.\d{1,2}$)/,
				message: ' 请输入 0-10亿 的正数，可保留两位小数',
				trigger: 'blur',
			}],
			loanBalance: [{
				pattern: /^1000000000$|^1000000000.0$|^1000000000.00$|(^[1-9](\d{0,8})?(\.\d{1,2})?$)|(^0$)|(^\d\.\d{1,2}$)/,
				message: ' 请输入 0-10亿 的正数，可保留两位小数',
				trigger: 'blur',
			}],
			extractionAmount: [{
				pattern: /^1000000000$|^1000000000.0$|^1000000000.00$|(^[1-9](\d{0,8})?(\.\d{1,2})?$)|(^0$)|(^\d\.\d{1,2}$)/,
				message: ' 请输入 0-10亿 的正数，可保留两位小数',
				trigger: 'blur',
			}],
			
		}
	});
	const {
		loanNo,
		formData,
		rules
	} = toRefs(data);
	const props = defineProps({
		approveId: {
			type: Number
		}
	})

	const extractionId = ref("");
	let routerQueryObj = ref({});
	watch(route, (newRoute) => {
		if(props.approveId){
			routerQueryObj.value.viewFlag = true;
			routerQueryObj.value.approveFlag = true;
			extractionId.value = props.approveId;
		}else{
			extractionId.value = newRoute.query && newRoute.query.extractionId;
			routerQueryObj.value.viewFlag = newRoute.query && newRoute.query.viewFlag && newRoute.query.viewFlag ===
				'true' ? true : false;
			routerQueryObj.value.pageNum = newRoute.query && newRoute.query.pageNum;
		}
	}, {
		immediate: true
	});

	/** 获取回款信息详情 */
	function getProjInfoPage() {
		if (extractionId.value) {
			loading.value = true;
			getInfo(extractionId.value).then(response => {
				formData.value = deepClone(response.data);
				const extractionStartDate = formData.value.extractionStartDate,
					extractionEndDate = formData.value.extractionEndDate
				if (extractionStartDate && extractionStartDate !== "" && extractionEndDate && extractionEndDate !==
					"") {
					formData.value.extractionDate = [extractionStartDate, extractionEndDate]
				}
				loading.value = false;
			});
		}
	}

	// 表单验证
	function submitForm(statusFlag) {
		loading.value = true
		const elForm = new Promise((resolve, reject) => {
			proxy.$refs['elForm'].validate(valid => {
				valid ? resolve(valid) : reject(valid)
			})
		})
		const flowForm = new Promise((resolve, reject) => {
		    proxy.$refs['flowSearchRef'].$refs['elForm'].validate(valid => {
		        valid ? resolve(valid) : reject(valid)
		    })
		});
		Promise.all([elForm,flowForm]).then(() => {
			saveFormData(statusFlag)
		}).catch(() => {
			loading.value = false
		})
	}

	function saveFormData(statusFlag) {
		let infoSave = deepClone(formData.value);
		infoSave.status = statusFlag;
		infoSave.flowId = proxy.$refs['flowSearchRef'].formData.flowId;
		infoSave.userIds = proxy.$refs['flowSearchRef'].formData.userIds;
		delete infoSave.extractionDate
		if (!infoSave.extractionId) {
			//新增
			addInfo(infoSave).then(response => {
				proxy.$modal.msgSuccess("新增成功");
				loading.value = false;
				closePage()
			}).catch(() => {
				loading.value = false
			});
		} else {
			//修改
			updateInfo(infoSave).then(response => {
				proxy.$modal.msgSuccess("修改成功");
				loading.value = false;
				closePage()
			}).catch(() => {
				loading.value = false
			});
		}
	}

	function closePage() {
		const obj = {
			path: "/finance/interest",
			query: {
				t: Date.now(),
				pageNum: routerQueryObj.value.pageNum
			}
		};
		proxy.$tab.closeOpenPage(obj);
	}

	// 取消按钮
	function cancel() {
		open.value = false;
		reset();
	}

	// 选择放款编号
	function getLoanInfo(row) {
		Object.assign(formData.value, row)
		if (row.extractionStartDate && row.extractionStartDate !== "" && row.extractionEndDate && row.extractionEndDate !==
			"") {
			formData.value.extractionDate = [row.extractionStartDate, row.extractionEndDate]
		}
		if (!(row.payBackDate && row.payBackDate !== "")) {
			formData.value.payBackDate = row.loanExpireDate
		}
		if (!(row.loanBalance && row.loanBalance !== "")) {
			formData.value.loanBalance = row.loanAmount
		}
	}

	// 预提日改变
	function extractionChange(val) {
		let startDate = val[0],
			endDate = val[1]
		let diffDays = dayjs(endDate).diff(startDate, 'day') + 1
		formData.value.extractionDays = diffDays
		formData.value.extractionStartDate = startDate
		formData.value.extractionEndDate = endDate
	}

	getProjInfoPage();
</script>
<style lang="scss" scoped>
	@import '../../../../assets/styles/infoForm.scss';
</style>