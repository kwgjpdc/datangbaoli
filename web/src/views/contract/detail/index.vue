<template>
	<div
		class="app-container"
		v-loading.fullscreen.lock="loading"
		ref="appContainerView"
	>
		<div class="content">
			<div class="operate-button" v-if="!routerQueryObj.approveFlag">
				<el-row :gutter="10" class="mb8" justify="end">
					<template v-if="!isView">
						<el-col :span="1.5">
							<el-button type="primary" icon="List" @click="submitForm(1)">
								暂存
							</el-button>
						</el-col>
						<el-col :span="1.5">
							<el-button type="primary" icon="Checked" @click="submitForm(2)">
								提交
							</el-button>
						</el-col>
					</template>
					<el-col :span="1.5">
						<el-button
							type="primary"
							icon="CircleCloseFilled"
							@click="closePage"
						>
							取消
						</el-button>
					</el-col>
				</el-row>
			</div>
			<div class="content-item-scroll">
				<el-tabs v-model="activePaneName">
					<!-- <el-tab-pane label="基本信息" name="base-pane">
						<basePane
							ref="basePaneRef"
							v-model:data="data"
							v-model:loading="loading"
							:routerQueryObj="routerQueryObj"
						/>
					</el-tab-pane> -->

					<!-- <el-tab-pane label="客户信息" name="client-pane">
						<customerPane
							ref="customerPaneRef"
							v-model:data="data"
							v-model:loading="loading"
							:routerQueryObj="routerQueryObj"
						/>
					</el-tab-pane> -->

					<el-tab-pane label="业务合同" name="special-pane">
						<spacialPane
							ref="specialPaneRef"
							v-model:data="data"
							v-model:loading="loading"
							:routerQueryObj="routerQueryObj"
						/>
					</el-tab-pane>
				</el-tabs>
			</div>
			<div class="content-item-scroll" v-if="!routerQueryObj.viewFlag">
				<flow-search
					id="flowSearch"
					ref="flowSearchRef"
					:routerQueryObj="routerQueryObj"
					:needUser="true"
				></flow-search>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, onBeforeMount, watch } from "vue";
import {
	getContract,
	addContract,
	updateContract
} from "@/api/contract/index.js";
import basePane from "./base/index.vue";
import customerPane from "./customer/index.vue";
import spacialPane from "./special/index.vue";
import FlowSearch from "@/views/flowable/search/index.vue";
// 当前组件对象
const { proxy } = getCurrentInstance();

// 是否显示loading
const loading = ref(false);

// 显示的Tab
const activePaneName = ref("special-pane");

// 数据对象
const data = ref({
	status: null,
	contractNo: null,
	bussProduct: null,
	projectDueId: null,
	projectNo: null,
	projectName: null,
	baseContractStartDate: null,
	baseContractEndDate: null,
	baseSealTime: null,
	baseGraceDays: null,
	baseChargeInterestWay: "1",
	baseSettleInterestWay: null,
	basePrincipalConfirmParty: null,
	baseProvince: null,
	baseIndustryType: null,
	baseItem: null,
	baseRemark: null,
	baseSignStatus: null,
	baseSignOpinion: null,
	agreeDebtorName: null,
	agreeCompanyNo: null,
	agreeSettlement: "1",
	agreePaymentLimit: null,
	agreePaymentStartDate: null,
	agreePaymentEndDate: null,
	agreePaymentVerify: null,
	agreeStartDate: null,
	agreePaymentMaxLimit: null,
	agreeAdvance: "2",
	agreeAdvanceGraceDays: null,
	agreeAdvancePercentage: null,
	agreeGuaranteePaymentLimit: null,
	agreePay: null,
	agreeBuyerPoolCeiling: null,
	agreeOverrun: null,
	agreeInform: null,
	agreeInformOther: null,
	agreeTransferPart: null,
	branchCustomerId: null,
	branchType: null,
	branchInterestCycle: null,
	branchFineRate: null,
	accountType: null,
	accountName: null,
	accountCustomerName: null,
	accountDebtorName: null,
	accountBankName: null,
	accountBankAccount: null,
	accountRemark: null,
	repayLoan: null,
	otherContractNo: null,
	otherContractName: null,
	otherCurrencyType: null,
	otherContractAmount: null,
	otherQuotaCeiling: null,
	otherQuotaCircle: null,
	otherContractStartDate: null,
	otherContractEndDate: null,
	otherRemark: null,
	feeList: [],
	interestList: [],
	paymentSequenceList: [],
	customerCardList: [],
	customerShareholderList: [],
	customerResidenceList: [],
	customerSeniorExecutiveList: [],
	customerTaxList: [],
	// 以下是专用条款
	institutionId: null, // 保理商机构主键id
	institutionName: null, // 保理商名称
	registAddress: null, // 保理商注册地址
	legalRepresentative: null, // 保理商-法定代表人/委托代理人
	applyInstitutionId: null,
	applyInstitutionName: null,
	applyRegistAddress: null,
	applyLegalRepresentative: null,
	contractWriteOnPlace: null, //签订地点

	replayType: null, // 回款方式（直接，间接） 111
	customerBankName: null, // 客户开户行
	customerAccountName: null, // 客户户名
	customerAccountNum: null, // 客户账号
	blBankName: null, // 保理公司开户行
	blAccountName: null, // 保理公司户名
	blAccountNum: null, // 保理公司账号

	earlyReplatType: null, // 提前还款选项 111

	cooperationType: null, // 合作方式：明保理or暗保理 11
	sendType: [], // 送达方式-可复选以逗号分割
	sendTypeOther: null, // 送达方式-其他输入框

	measuresType: null, // 是否有增信措施0.无-1.有
	measuresUseType: null,
	measuresNum1: null, // 增信措施合同编号1
	measuresName1: null, // 增信措施合同名称1
	guarantee1: null, // 增信措施担保方式1
	guaranteePerson1: null, // 增信措施担保人1
	measuresNum2: null, // 增信措施合同编号2
	measuresName2: null, // 增信措施合同名称2
	guarantee2: null, // 增信措施担保方式2
	guaranteePerson2: null, // 增信措施担保人2

	fairType: null, // 是否执行强制公正

	approvalPersonAddress: "北京市西城区菜市口大街1号院2号楼中融信托大厦10层", //审批人送达地址
	approvalPerson: null, // 审批人联系人
	approvalPersonMobile: null, // 审批人电话
	approvalPersonEmail: "dtbllaw@cdt-zbkg.com", // 审批人电子邮箱
	applyPersonAddress: null, // 保理申请人送达地址
	applyPerson: null, // 保理申请人联系人
	applyPersonMobile: null, // 保理申请人电话
	applyPersonEmail: null, // 保理申请人电子邮箱

	supplementInfo: "不适用", // 补充条款内容

	countNumber: null, // 合同总份数
	jcountNumber: null, // 甲方合同份数
	ycountNumber: null // 乙方合同份数
});

// router参数
const routerQueryObj = ref(history.state);
const props = defineProps({ approveId: Number });

// 基本信息页面
const basePaneRef = ref(null);
const specialPaneRef = ref(null);

// 页面是View状态
const isView = computed(() => {
	let result = false;
	if (
		routerQueryObj.value.viewFlag === undefined ||
		routerQueryObj.value.viewFlag === null
	) {
		result = false;
	} else {
		result = routerQueryObj.value.viewFlag;
	}
	return result;
});

// 页面是Edit状态
const isEdit = computed(() => {
	let result = false;
	if (
		routerQueryObj.value.editFlag === undefined ||
		routerQueryObj.value.editFlag === null
	) {
		result = false;
	} else {
		result = routerQueryObj.value.editFlag;
	}
	return result;
});

// 新增合同数据
function addContractData(status) {
	data.value.status = status;
	loading.value = true;
	// 单独处理 sendType
	data.value.sendType = data.value.sendType.join();

	data.value.flowId = proxy.$refs["flowSearchRef"].formData.flowId;
	data.value.userIds = proxy.$refs["flowSearchRef"].formData.userIds;

	addContract(data.value)
		.then(() => {
			proxy.$modal.msgSuccess("新增成功");
			closePage();
		})
		.finally(() => {
			loading.value = false;
		});
}

// 更新合同数据
function updateContractData(status) {
	data.value.status = status;
	loading.value = true;

	// 单独处理 sendType
	data.value.sendType = data.value.sendType.join();

	data.value.flowId = proxy.$refs["flowSearchRef"].formData.flowId;
	data.value.userIds = proxy.$refs["flowSearchRef"].formData.userIds;
	// console.log(data.value)
	updateContract(data.value)
		.then(() => {
			proxy.$modal.msgSuccess("更新成功");
			closePage();
		})
		.finally(() => {
			loading.value = false;
		});
}

// 获取合同数据
function getContractData(id) {
	loading.value = true;
	getContract(id).then(response => {
		response.data;

		for (const prop in response.data) {
			// 不处理paymentSequenceList
			if (prop === "paymentSequenceList") {
				continue;
			}

			if (Array.isArray(data.value[prop])) {
				data.value[prop].length = 0;
				if (Array.isArray(response.data[prop])) {
					response.data[prop].forEach(v => {
						data.value[prop].push(v);
					});
				} else {
					if (prop === "sendType") {
						data.value[prop] = response.data[prop].split(",");
					}
				}
			} else {
				data.value[prop] = response.data[prop];
			}
		}
		loading.value = false;
	});
}

// 提交表单
function submitForm(status) {
	if (status === 1) {
		// 暂存
		if (!isEdit.value) {
			addContractData(status);
		} else {
			updateContractData(status);
		}
	} else {
		// const contractForm = new Promise((resolve, reject) => {
		// 	basePaneRef.value.validate(valid => {
		// 		valid ? resolve(valid) : reject(valid);
		// 	});
		// });

		const specialForm = new Promise((resolve, reject) => {
			specialPaneRef.value.validate(valid => {
				valid ? resolve(valid) : reject(valid);
			});
		});

		const flowForm = new Promise((resolve, reject) => {
			proxy.$refs["flowSearchRef"].$refs["elForm"].validate(valid => {
				valid ? resolve(valid) : reject(valid);
			});
		});

		Promise.all([flowForm, specialForm]).then(() => {
			if (!isEdit.value) {
				addContractData(status);
			} else {
				updateContractData(status);
			}
		});
	}
}

// 取消按钮操作
function closePage() {
	const obj = {
		path: "/contract/contract/basic/index",
		query: { t: Date.now(), pageNum: history.state.pageNum }
	};
	proxy.$tab.closeOpenPage(obj);
}

// 在页面挂载前
onBeforeMount(() => {
	if (props.approveId) {
		routerQueryObj.value.contractId = props.approveId;
		routerQueryObj.value.viewFlag = true;
		routerQueryObj.value.approveFlag = true;
	}
	if (isView.value || isEdit.value) {
		getContractData(routerQueryObj.value.contractId);
	}
});
</script>

<style lang="scss" scoped>
.app-container {
	position: relative;
	height: calc(100vh - 85px);
	overflow: scroll;
}

.operate-button {
	position: fixed;
	top: 83px;
	z-index: 100;
	background: #fff;
	right: 0;
	left: 0;
	padding: 5px 15px;
}

.content-item-scroll {
	margin-top: 30px;
}
</style>
<style>
.el-tabs__item {
	font-weight: bold !important;
}
.el-collapse-item__header {
	font-weight: normal !important;
}
.el-form-item__label {
	font-weight: normal !important;
}
.el-table .cell {
	font-weight: normal !important;
}
</style>
