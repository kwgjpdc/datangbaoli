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
							<el-button type="primary" icon="Checked" @click="submitForm">
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
				<el-collapse v-model="activeCollapseNames">
					<el-collapse-item title="应收账款信息（附件一）" name="annexOne">
						<annexOne
							ref="annexOneRef"
							:proDetail="projectDetail"
							v-model:data="data"
							:routerQueryObj="props.routerQueryObj"
							v-model:loading="loading"
						/>
					</el-collapse-item>

					<el-collapse-item title="应收账款信息（附件二）" name="annexTwo">
						<annexTwo
							ref="annexTwoRef"
							v-model:data="data"
							:routerQueryObj="props.routerQueryObj"
							v-model:loading="loading"
						/>
					</el-collapse-item>

					<el-collapse-item title="应收账款信息（附件三）" name="annexThree">
						<annexThree
							ref="annexThreeRef"
							v-model:data="data"
							:routerQueryObj="props.routerQueryObj"
							v-model:loading="loading"
						/>
					</el-collapse-item>

					<el-collapse-item title="签收回执（附件四）" name="annexFour">
						444
					</el-collapse-item>
				</el-collapse>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, onBeforeMount, watch } from "vue";
// import { getContract, updateContract } from "@/api/contract/index.js";

import { addContFileInfo } from "@/api/contract/annex.js";
import { getDiligence } from "@/api/project/diligence.js";

import baseInfo from "./baseInfo.vue";
import annexOne from "./annexOne.vue";
import annexTwo from "./annexTwo.vue";
import annexThree from "./annexThree.vue";

// 当前组件对象
const { proxy } = getCurrentInstance();

// 展开的折叠配置
const activeCollapseNames = reactive([
	"annexOne",
	"annexTwo",
	"annexThree",
	"annexFour"
]);

// 是否显示loading
const loading = ref(false);

// 数据对象
const data = ref({
	// 总：
	contractId: null, // 合同主键id
	projDueDiligenceId: null, // 项目尽调主键id

	// 附件1：
	contractId: null, // 保理合同主键id
	projDueDiligenceId: null, // 项目尽调主键id
	contractFileId: null, //保理附件主键id

	receivableNumber: null, //应收账款转让明细表 【编号】
	customerName: null, //保理申请人
	contractNum: null, // 保理主合同编号

	carList: [
		// transactionContNumName: null, //基础交易合同编号及名称
		// debtName: null, //债务人名称
		// receivableNum: null, //应收账款金额
		// invoiceNum: null, // 发票号码
		// receivableEndDate: null, // 应收账款到期日
		// remark: null, // 备注
	],

	// 附件2：
	contractId: null, // 主合同id
	contractNum: null, // 主合同编号
	projDueDiligenceId: null, // 项目尽调主键id
	contractFileId: null, // 附件id

	financingNum: null, // 保理融资本金

	receivableEndDate: [], //保理融资期限-关联应收账款转让明细表中的应收
	receivablePayDate: null, //保理融资款拨付日 （解释：其中一个选项）

	interestGraceDate: null, //利息支付宽限期-从项目尽调中带入 （尽调无）
	payBackGraceDate: null, //还款宽限期-从项目尽调中带入 （尽调有，带入）

	manageCost: null, // 管理费率 （尽调有，可修改）
	financingCost: null, // 保理融资利率 （尽调无）
	graceCost: null, // 宽限期利率 （尽调有，可修改）

	managePayType: [], //管理费支付方式
	//【缺失参数】 每季度末月？日前
	managePayTypeWrite: null, //管理费支付方式 【其他】选项手写内容

	financingCostPayType: [], //保理融资利息支付方式-除了其他方式以外
	//【【缺失参数】 每季度末月？日前】
	// 缺失其他补充参数

	defaultInterestRate: null, //违约金利率-从尽调中取值，尽调中的违约利 （尽调有）

	obligorGuaranteeAmount: null, //应收账款债务人付款担保额度-与保理融资本金一致

	paymentsType: [], //保理融资款收取账户选项
	paymentsAccountName: null, //保理融资款收取账户-户名填写内容
	paymentsAccount: null, //保理融资款收取账户-账号填写内容
	paymentsAccountBank: null, //保理融资款收取账户-开户行名称

	// 附件3
	projDueDiligenceId: null, //项目尽调主键id
	contractId: null, //保理业务合同主键id
	contractFileId: null, //保理附件主键id

	conAccountsReceivableId: null, //应收账款转让明细表主键id
	conReceivableTransferNum: null, //应收账款转让通知书编号

	customerName: null, //债务人名称
	transferName: null, //转让人名称
	receivableNumber: null, //应收账款转让明细表编号
	accountName: null, //户名
	accountNum: null, //账号
	accountBank: null, //开户行
	zbPersonName: null, //主办人名称
	zbPersonTel: null, //主办人电话
	payBackGraceDate: null, //还款宽限期-从项目尽调中带入

	crtList: [],

	// 附件4
	conSignReceiptVo: {
		projDueDiligenceId: null, //项目尽调主键id
		contractNum: null, //保理主合同编号
		contractId: null, //保理业务合同主键id
		contractFileId: null, //保理附件主键id
		financingNum: null, //保理融资本金
		receivableEndDate: null, //保理融资期限-关联应收账款转让明细表中的应收账款到期
		receivablePayDate: null, //保理融资款拨付日
		interestGraceDate: null, //利息宽限期-从项目尽调中带入
		payBackGraceDate: null, //还款宽限期-从项目尽调中带入
		manageCost: null, //管理费率
		financingCost: null, //保理融资利率
		graceCost: null, //宽限期利率
		managePayType: null, //管理费支付方式
		managePayTypeWrite: null, //管理费支付方式填写内容
		financingCostPayType: null, //保理融资利息支付方式-除了其他方式以外都从尽调
		defaultInterestRate: null, //违约金利率-从尽调中取值，尽调中的违约利率改为百
		obligorGuaranteeAmount: null, //应收账款债务人付款担保额度-与保理融资本金
		paymentsType: null, //保理融资款收取账户选项
		paymentsAccountName: null, //保理融资款收取账户-户名填写内容
		paymentsAccount: null, //保理融资款收取账户-账号填写内容
		paymentsAccountBank: null //保理融资款收取账户-开户行名称
	}
});

// 尽调详情
const projectDetail = ref({});

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

watch(
	() => data.value.projDueDiligenceId,
	() => {
		getDiligenceInfo(data.value.projDueDiligenceId);
	}
);

// --------------------以上是 ref watch  computed 等状态数据------------------------------------------------------------------------------------------

// 获取 尽调详情接口
function getDiligenceInfo(id) {
	getDiligence(id).then(response => {
		projectDetail.value = response.data;
	});
}

function handleParams() {
	const formData = data.value;

	// 附件1 处理数据
	const carList = formData.carList.map(item => ({
		projDueDiligenceId: formData.projDueDiligenceId, // 尽调id
		contractId: formData.contractId, // 合同id
		contractFileId: formData.contractFileId, // 附件id

		receivableNumber: null, //应收账款转让明细表 【编号】
		customerName: null, //保理申请人
		contractNum: null, // 保理主合同编号

		...item
	}));

	// 附件2 处理数据
	const contractAgreeFileVo = {
		contractId: formData.contractId, // 保理合同主键id
		contractNum: formData.contractNum, // 保理合同编号
		projDueDiligenceId: formData.projDueDiligenceId, // 项目尽调主键id
		contractFileId: null, // 保理附件主键id, 编辑才会有

		financingNum: formData.financingNum, // 保理融资本金

		receivableEndDate: formData.receivableEndDate, // 保理融资期限-关联应收账款转让明细表中的应收
		receivablePayDate: formData.receivablePayDate, // 保理融资款拨付日 （解释：其中一个选项）

		interestGraceDate: formData.interestGraceDate, // 利息支付宽限期-从项目尽调中带入 （尽调无）
		payBackGraceDate: formData.payBackGraceDate, // 还款宽限期-从项目尽调中带入 （尽调有，带入）

		manageCost: formData.manageCost, // 管理费率 （尽调有，可修改）
		financingCost: formData.financingCost, // 保理融资利率 （尽调无）
		graceCost: formData.graceCost, // 宽限期利率 （尽调有，可修改）

		managePayType: formData.managePayType, //管理费支付方式
		//【缺失参数】 每季度末月？日前
		managePayTypeWrite: null, //管理费支付方式 【其他】选项手写内容

		financingCostPayType: formData.financingCostPayType, //保理融资利息支付方式-除了其他方式以外
		//【【缺失参数】 每季度末月？日前】
		// 缺失其他补充参数

		defaultInterestRate: null, //违约金利率-从尽调中取值，尽调中的违约利 （尽调有）

		obligorGuaranteeAmount: null, //应收账款债务人付款担保额度-与保理融资本金一致

		paymentsType: formData.paymentsType, //保理融资款收取账户选项
		paymentsAccountName: null, //保理融资款收取账户-户名填写内容
		paymentsAccount: null, //保理融资款收取账户-账号填写内容
		paymentsAccountBank: null //保理融资款收取账户-开户行名称}
	};

	// 附件3
	const crtList = formData.crtList;

	// 附件4
	const conSignReceiptVo = formData.conSignReceiptVo;

	return {
		contractId: formData.contractId,
		projDueDiligenceId: formData.projDueDiligenceId,
		carList,
		contractAgreeFileVo,
		crtList,
		conSignReceiptVo
	};
}

// 新增附件数据
function apiAddContFileInfo() {
	loading.value = true;
	const handleData = handleParams();

	addContFileInfo(handleData)
		.then(() => {
			proxy.$modal.msgSuccess("新增成功");
			closePage();
		})
		.finally(() => {
			loading.value = false;
		});
}

// 更新合同数据
// function updateContractData(status) {
// 	data.value.status = status;
// 	loading.value = true;

// 	// 单独处理 sendType
// 	data.value.sendType = data.value.sendType.join();

// 	data.value.flowId = proxy.$refs["flowSearchRef"].formData.flowId;
// 	data.value.userIds = proxy.$refs["flowSearchRef"].formData.userIds;
// 	// console.log(data.value)
// 	updateContract(data.value)
// 		.then(() => {
// 			proxy.$modal.msgSuccess("更新成功");
// 			closePage();
// 		})
// 		.finally(() => {
// 			loading.value = false;
// 		});
// }

// 获取合同数据
// function getContractData(id) {
// 	loading.value = true;
// 	getContract(id).then(response => {
// 		response.data;

// 		for (const prop in response.data) {
// 			// 不处理paymentSequenceList
// 			if (prop === "paymentSequenceList") {
// 				continue;
// 			}

// 			if (Array.isArray(data.value[prop])) {
// 				data.value[prop].length = 0;
// 				if (Array.isArray(response.data[prop])) {
// 					response.data[prop].forEach(v => {
// 						data.value[prop].push(v);
// 					});
// 				} else {
// 					if (prop === "sendType") {
// 						data.value[prop] = response.data[prop].split(",");
// 					}
// 				}
// 			} else {
// 				data.value[prop] = response.data[prop];
// 			}
// 		}
// 		loading.value = false;
// 	});
// }

// 提交表单
function submitForm() {
	apiAddContFileInfo();

	// if (status === 1) {
	// 	// 暂存

	// 	if (!data.value.projectDueId) {
	// 		return proxy.$message.error("请选择【项目尽调编号】");
	// 	}

	// 	if (!isEdit.value) {
	// 		apiAddContFileInfo(status);
	// 	} else {
	// 		updateContractData(status);
	// 	}
	// } else {
	// 	//

	// 	// const contractForm = new Promise((resolve, reject) => {
	// 	// 	basePaneRef.value.validate(valid => {
	// 	// 		valid ? resolve(valid) : reject(valid);
	// 	// 	});
	// 	// });

	// 	const specialForm = new Promise((resolve, reject) => {
	// 		specialPaneRef.value.validate(valid => {
	// 			valid ? resolve(valid) : reject(valid);
	// 		});
	// 	});

	// 	const flowForm = new Promise((resolve, reject) => {
	// 		proxy.$refs["flowSearchRef"].$refs["elForm"].validate(valid => {
	// 			valid ? resolve(valid) : reject(valid);
	// 		});
	// 	});

	// 	Promise.all([flowForm, specialForm]).then(() => {
	// 		if (!isEdit.value) {
	// 			apiAddContFileInfo(status);
	// 		} else {
	// 			updateContractData(status);
	// 		}
	// 	});
	// }
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
