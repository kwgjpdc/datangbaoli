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
					<el-collapse-item title="附件基本信息" name="baseInfo">
						<baseInfo
							ref="baseInfoRef"
							v-model:data="data"
							:routerQueryObj="props.routerQueryObj"
							v-model:loading="loading"
						/>
					</el-collapse-item>

					<el-collapse-item
						title="应收账款转让明细表（附件一）"
						name="annexOne"
					>
						<annexOne
							ref="annexOneRef"
							:proDetail="projectDetail"
							v-model:data="data"
							:routerQueryObj="props.routerQueryObj"
							v-model:loading="loading"
						/>
					</el-collapse-item>

					<el-collapse-item title="保理业务同意书（附件二）" name="annexTwo">
						<annexTwo
							ref="annexTwoRef"
							v-model:data="data"
							:routerQueryObj="props.routerQueryObj"
							v-model:loading="loading"
						/>
					</el-collapse-item>

					<template v-if="data.contractType && data.contractType !== '2'">
						<el-collapse-item
							title="应收账款转让通知书（附件三）"
							name="annexThree"
						>
							<annexThree
								ref="annexThreeRef"
								v-model:data="data"
								:routerQueryObj="props.routerQueryObj"
								v-model:loading="loading"
							/>
						</el-collapse-item>
					</template>

					<template v-if="data.contractType && data.contractType !== '2'">
						<el-collapse-item title="签收回执（附件四）" name="annexFour">
							<annexFour
								ref="annexFourRef"
								v-model:data="data"
								:routerQueryObj="props.routerQueryObj"
								v-model:loading="loading"
							/>
						</el-collapse-item>
					</template>
				</el-collapse>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, onBeforeMount, watch } from "vue";
import {
	addContFileInfo,
	editContFileInfo,
	getContFileInfoDetail
} from "@/api/contract/annex";

import { getDiligence } from "@/api/project/diligence.js";

import baseInfo from "./baseInfo.vue";
import annexOne from "./annexOne.vue";
import annexTwo from "./annexTwo.vue";
import annexThree from "./annexThree.vue";
import annexFour from "./annexFour.vue";

// 当前组件对象
const { proxy } = getCurrentInstance();

// 展开的折叠配置
const activeCollapseNames = reactive([
	"baseInfo",
	"annexOne",
	"annexTwo",
	"annexThree",
	"annexFour"
]);

// 是否显示loading
const loading = ref(false);

// 尽调详情
const projectDetail = ref({});

// router参数
const routerQueryObj = ref(history.state);
const props = defineProps({ approveId: Number });

// temp 临时id处理
const conSignReceiptVoId = ref(null);
const contractAgreeFileVoId = ref(null);

// 数据对象
const data = ref({
	// 业务数据
	dueNo: null, // 尽调编号 --尽调维护
	contractType: null, // 合同类型 两方合同1 三方合同2 池保理合同3 其他4  --尽调维护
	businessType: null, // 业务产品 --尽调维护
	factoringTarget: null, // 标的 电费补贴2 --合同维护

	pddId: null,

	// 总：

	contractFileId: null, // 合同附件id
	contractId: null, // 合同id
	projDueDiligenceId: null, // 项目尽调id

	// 附件1：

	receivableNumber: null, // 应收账款转让明细表 【编号】
	customerName: null, // 保理申请人
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

	contractAgreeFileVo: {
		id: null,

		contractNum: null, // 合同编号

		financingNum: null, // 保理融资本金

		receivableType: null, // 保理融资期限选项
		receivableEndDate: null, // 保理融资期限-关联应收账款转让明细表中的应收
		receivablePayDate: null, // 保理融资款拨付日 （解释：其中一个选项）
		pjEndDate: null, // 保理融资票据日期

		interestGraceDate: null, //利息支付宽限期-从项目尽调中带入 （尽调无）

		payBackGraceDate: null, //还款宽限期-从项目尽调中带入 （尽调有，带入）

		manageCost: null, // 管理费率 （尽调有，可修改）
		financingCost: null, // 保理融资利率 （尽调无）
		graceCost: null, // 宽限期利率 （尽调有，可修改）

		managePayType: null, // 管理费支付方式
		manageMonthEndDate: null, // 每季度末支付日
		managePayTypeWrite: null, // 管理费支付方式 【其他】选项手写内容

		financingCostPayType: null, // 保理融资利息支付方式-除了其他方式以外
		lxMonthEndDate: null, // 每季度末支付日
		financingCostPayTypeOther: null, // 其他

		defaultInterestRate: null, //违约金利率-从尽调中取值，尽调中的违约利 （尽调有）

		obligorGuaranteeAmount: null, //应收账款债务人付款担保额度-与保理融资本金一致

		payType: null, // 支付方式

		paymentsType: null, //保理融资款收取账户选项
		paymentsAccountName: null, //保理融资款收取账户-户名填写内容
		paymentsAccount: null, //保理融资款收取账户-账号填写内容
		paymentsAccountBank: null //保理融资款收取账户-开户行名称
	},

	// 附件3

	crtList: [
		{
			id: null,
			conReceivableTransferNum: null, // 附件3 【编号】
			debtorPerson: null, // 债务人名称
			transferName: null, // 转让人名称
			accountName: null, // 户名
			accountNum: null, // 账号
			accountBank: null, // 开户行
			zbPersonName: null, // 主办人名称
			zbPersonTel: null, // 主办人电话
			payBackGraceDate: null // 还款宽限期 【附件2从尽调带入，并在这里展示】
		},
		{
			id: null,
			conReceivableTransferNum: null, // 附件3 【编号】
			debtorPerson: null, // 债务人名称
			transferName: null, // 转让人名称
			accountName: null, // 户名
			accountNum: null, // 账号
			accountBank: null, // 开户行
			zbPersonName: null, // 主办人名称
			zbPersonTel: null, // 主办人电话
			payBackGraceDate: null // 还款宽限期 【附件2从尽调带入，并在这里展示】
		}
	],

	// 附件4

	conSignReceiptVo: {
		id: null,
		usePerson: null, // 转让人
		conReceivableTransferNum: null, //【应收账款转让通知书】编号 （附件三编号）
		transactionContNumName: null, // 基础交易合同编号及名称
		customerName: null, // 客户公司名称
		sendAddress: null, // 送达地址
		contactsName: null, // 联系人名称
		mobilePhone: null, // 联系人电话
		emial: null, // 联系人电子邮箱
		foxNum: null // 联系人传真
	}
});

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

// 尽调列表
// watch(
// 	() => data.value.pddId,
// 	val => {
// 		apiContPddList(val);
// 	}
// );

watch(
	() => data.value.projDueDiligenceId,
	() => {
		getDiligenceInfo(data.value.projDueDiligenceId);
	}
);

// --------------------以上是 ref watch  computed 等状态数据------------------------------------------------------------------------------------------

// 获取 【尽调详情】接口
function getDiligenceInfo(id) {
	getDiligence(id).then(response => {
		if (response.code !== 200) {
			proxy.$modal.msgSuccess("尽调获取失败！");
		}

		projectDetail.value = response.data;

		// 附件2
		const _contractAgreeFileVo = {
			...data.value.contractAgreeFileVo,
			payBackGraceDate: response.data.gracePeriod, // 还款宽限期
			manageCost: response.data.managementRate, // 管理费率
			graceCost: response.data.gracePeriodInterestRate // 宽限期利率
		};

		// 附件3
		const _crtList = data.value.crtList.map(item => {
			item.payBackGraceDate = response.data.gracePeriod;
			item.zbPersonName = response.data.sponsor;
			return item;
		});

		data.value = Object.assign(data.value, {
			contractType: response.data.contractType, // 合同类型
			businessType: response.data.businessType, // 业务产品
			contractAgreeFileVo: _contractAgreeFileVo,
			crtList: _crtList
		});
	});
}

// 新增附件数据
function apiAddContFileInfo(data) {
	loading.value = true;

	addContFileInfo(data)
		.then(() => {
			proxy.$modal.msgSuccess("新增成功");
			closePage();
		})
		.finally(() => {
			loading.value = false;
		});
}

// 更新附件数据
function apiEditContFileInfo(data) {
	loading.value = true;
	editContFileInfo(data)
		.then(() => {
			proxy.$modal.msgSuccess("编辑成功");
			closePage();
		})
		.finally(() => {
			loading.value = false;
		});
}

// 获取合同附件数据
function getDetailData(id) {
	loading.value = true;
	getContFileInfoDetail(id)
		.then(response => {
			// 详情数据
			const repData = response.data;

			contractAgreeFileVoId.value = repData.contractAgreeFileVo.id;
			conSignReceiptVoId.value = repData.conSignReceiptVo.id;

			// 附件1
			const carList = repData.carList;

			const data1 = {
				receivableNumber: carList[0].receivableNumber, // 附件一编号
				contractNum: carList[0].contractNum, // 保理主合同编号
				customerName: carList[0].customerName, //保理申请人
				carList
			};

			// 附件2
			const contractAgreeFileVo = repData.contractAgreeFileVo;

			// 附件3
			const crtList = repData.crtList;

			const data3 = {
				crtList
			};

			// 附件4
			const conSignReceiptVo = repData.conSignReceiptVo;

			data.value = Object.assign(
				data.value,
				data1,
				contractAgreeFileVo,
				data3,
				conSignReceiptVo,
				{
					contractFileId: repData.id, // 附件id
					contractId: repData.contractId, // 合同id
					projDueDiligenceId: repData.projDueDiligenceId, // 项目尽调id
					factoringTarget: repData.factoringTarget, // 合同-标的
					dueNo: repData.dueNo, // 尽调-尽调No
					contractType: repData.contractType, // 尽调-合同类型
					businessType: repData.businessType // 尽调-业务产品
				}
			);
		})
		.finally(() => {
			loading.value = false;
		});
}

// 表单字段处理
function handleParams() {
	const formData = data.value;
	// 附件1 处理数据
	const carList = formData.carList.map(item => ({
		...item,
		receivableNumber: formData.receivableNumber, // 编号（应收账款转让明细表）
		customerName: formData.customerName, // 保理申请人
		contractNum: formData.contractNum // 保理合同编号
	}));

	// 附件2 处理数据
	const contractAgreeFileVo = {
		contractNum: formData.contractNum, // 保理合同编号

		financingNum: formData.financingNum, // 保理融资本金

		receivableType: formData.receivableType, // 保理融资期限选项
		receivableEndDate: formData.receivableEndDate, // 保理融资期限-关联应收账款转让明细表中的应收
		receivablePayDate: formData.receivablePayDate, // 保理融资款拨付日 （解释：其中一个选项）
		pjEndDate: formData.pjEndDate, // 保理融资票据日期

		interestGraceDate: formData.interestGraceDate, // 利息支付宽限期-从项目尽调中带入 （尽调无）
		payBackGraceDate: formData.payBackGraceDate, // 还款宽限期-从项目尽调中带入 （尽调有，带入）

		manageCost: formData.manageCost, // 管理费率 （尽调有，可修改）
		financingCost: formData.financingCost, // 保理融资利率 （尽调无）
		graceCost: formData.graceCost, // 宽限期利率 （尽调有，可修改）

		managePayType: formData.managePayType, // 管理费支付方式
		manageMonthEndDate: formData.manageMonthEndDate, // 每季度末支付日
		managePayTypeWrite: formData.managePayTypeWrite, // 管理费支付方式 【其他】选项手写内容

		financingCostPayType: formData.financingCostPayType, //保理融资利息支付方式-除了其他方式以外
		lxMonthEndDate: formData.lxMonthEndDate, // 每季度末支付日
		financingCostPayTypeOther: formData.financingCostPayTypeOther, // 其他 手写内容

		defaultInterestRate: formData.defaultInterestRate, //违约金利率-从尽调中取值，尽调中的违约利 （尽调有）

		obligorGuaranteeAmount: formData.obligorGuaranteeAmount, //应收账款债务人付款担保额度-与保理融资本金一致

		payType: formData.payType, // 支付方式

		paymentsType: formData.paymentsType, //保理融资款收取账户选项
		paymentsAccountName: formData.paymentsAccountName, //保理融资款收取账户-户名填写内容
		paymentsAccount: formData.paymentsAccount, //保理融资款收取账户-账号填写内容
		paymentsAccountBank: formData.paymentsAccountBank //保理融资款收取账户-开户行名称}
	};

	// 附件3
	const crtList =
		formData.factoringTarget && formData.factoringTarget === "2"
			? formData.crtList
			: [formData.crtList[0]];

	// 附件4
	const conSignReceiptVo = {
		// projDueDiligenceId: formData.projDueDiligenceId, // 项目尽调主键id
		// contractId: formData.contractId, // 保理业务合同主键id
		// contractFileId: formData.contractFileId, // 保理附件主键id

		conReceivableTransferNum: formData.conReceivableTransferNum, //【应收账款转让通知书】编号
		transactionContNumName: formData.transactionContNumName, // 基础交易合同编号及名称 【？】

		customerName: formData.customerName, // 客户公司名称
		sendAddress: formData.sendAddress, // 送达地址
		contactsName: formData.contactsName, // 联系人名称
		mobilePhone: formData.mobilePhone, // 联系人电话
		emial: formData.emial, // 联系人电子邮箱
		foxNum: formData.foxNum // 联系人传真
	};

	return {
		contractFileId: formData.contractFileId, // 附件id
		contractId: formData.contractId, // 合同id
		projDueDiligenceId: formData.projDueDiligenceId, // 尽调id
		factoringTarget: formData.factoringTarget, // 合同-标的
		dueNo: formData.dueNo, // 尽调-尽调No
		contractType: formData.contractType, // 尽调-合同类型
		businessType: formData.businessType, // 尽调-业务产品

		carList, // 附件1
		contractAgreeFileVo, // 附件2
		crtList, // 附件3
		conSignReceiptVo // 附件4
	};
}

// 提交表单
function submitForm() {
	let handleData = handleParams();

	if (isEdit.value) {
		// 编辑
		handleData.contractAgreeFileVo.id = contractAgreeFileVoId.value;
		handleData.conSignReceiptVo.id = conSignReceiptVoId.value;
		apiEditContFileInfo(handleData);
	} else {
		apiAddContFileInfo(handleData);
	}
}

// 取消按钮操作
function closePage() {
	const obj = {
		path: "/contract/annex",
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
		getDetailData(routerQueryObj.value.contractFileId);
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
