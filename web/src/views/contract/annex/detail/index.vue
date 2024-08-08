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

const annexThreeRef = ref(null);

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
	// 前端逻辑处理 数据
	pddId: null, // 合同关联的 尽调ids
	loanList: [], // 放款接点列表

	// 业务数据
	dueNo: null, // 尽调编号 --尽调维护
	contractType: null, // 合同类型 两方合同1 三方合同2 池保理合同3 其他4  --尽调维护
	businessType: null, // 业务产品 --尽调维护
	factoringTarget: null, // 标的 电费补贴2 --合同维护

	loanNodeBasisName: null, // 放款依据名称
	
	loanNodeBasis: null, // 放款节点依据
	oanNodeBasisOther: null, // 放款节点依据-其他
	loanRatio: null, // 放款比例
	confirmationSeal: null, // 确权章
	confirmationSealOther: null, // 确权章其他

	// 总：
	contractFileId: null, // 合同附件id
	contractId: null, // 合同id
	projDueDiligenceId: null, // 项目尽调id

	// 附件1：

	receivableNumber: null, // 应收账款转让明细表 【编号】
	customerName: null, // 保理申请人
	contractNum: null, // 保理主合同编号

	carList: [
		// id
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

		interestGraceDate: null, //利息支付宽限期-从项目尽调中带入

		payBackGraceDate: null, //还款宽限期-从项目尽调中带入

		manageCost: null, // 管理费率
		financingCost: null, // 保理融资利率
		graceCost: null, // 宽限期利率

		managePayType: null, // 管理费支付方式
		manageMonthEndDate: null, // 每季度末支付日
		managePayTypeWrite: null, // 管理费支付方式 【其他】选项手写内容

		financingCostPayType: null, // 保理融资利息支付方式-除了其他方式以外
		lxMonthEndDate: null, // 每季度末支付日
		financingCostPayTypeOther: null, // 其他

		defaultInterestRate: null, //违约金利率

		obligorGuaranteeAmount: null, //应收账款债务人付款担保额度

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

watch(
	() => data.value.projDueDiligenceId,
	() => {
		getDiligenceInfo(data.value.projDueDiligenceId);
	}
);

watch(
	() => data.value.loanRatio,
	() => {
		data.value.contractAgreeFileVo.financingNum =
			(data.value.contractAgreeFileVo.obligorGuaranteeAmount *
				data.value.loanRatio) /
			100;
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

		const resData = response.data;

		// 附件2
		const _contractAgreeFileVo = {
			...data.value.contractAgreeFileVo,

			// 保理融资利率
			financingCost: resData.normalTermInterestRate,
			// 违约金利率
			defaultInterestRate: resData.defaultInterestRate,
			// 应收账款债务人付款担保额度
			obligorGuaranteeAmount: resData.financeLimitAmount,
			// 还款宽限期
			payBackGraceDate: resData.gracePeriod,
			// 管理费率
			manageCost: resData.managementRate,
			// 宽限期利率
			graceCost: resData.gracePeriodInterestRate
		};

		// 附件3
		const _crtList = data.value.crtList.map(item => {
			item.payBackGraceDate = resData.gracePeriod;
			item.zbPersonName = resData.sponsorName; // 主办人
			item.zbPersonTel = resData.sponsorPhone; // 主办人联系方式
			return item;
		});

		data.value = Object.assign(data.value, {
			contractType: resData.contractType, // 合同类型
			businessType: resData.businessType, // 业务产品
			factoringTarget: resData.baseItem, // 标的
			contractAgreeFileVo: _contractAgreeFileVo, // 附件2
			crtList: _crtList // 附件3
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

			const data2 = {
				contractAgreeFileVo
			};

			// 附件3
			const crtList = repData.crtList;

			const data3 = {
				crtList
			};

			// 附件4
			const conSignReceiptVo = repData.conSignReceiptVo;

			const data4 = { conSignReceiptVo };

			data.value = Object.assign(data.value, data1, data2, data3, data4, {
				contractFileId: repData.id, // 附件id
				contractId: repData.contractId, // 合同id
				projDueDiligenceId: repData.projDueDiligenceId, // 项目尽调id
				factoringTarget: repData.factoringTarget, // 合同-标的
				dueNo: repData.dueNo, // 尽调-尽调No
				contractType: repData.contractType, // 尽调-合同类型
				businessType: repData.businessType // 尽调-业务产品
			});
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

	const contractAgreeFileVo = data.value.contractAgreeFileVo;

	// 附件3
	const crtList =
		formData.factoringTarget && formData.factoringTarget === "2"
			? formData.crtList
			: [formData.crtList[0]];

	// 附件4

	const conSignReceiptVo = data.value.conSignReceiptVo;

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
async function submitForm() {
	// let baseInfoValid = proxy.$refs["baseInfoRef"].elFormRef.validate();
	const baseInfoValid = proxy.$refs["baseInfoRef"].elFormRef.validate();
	const annexOneValid = proxy.$refs["annexOneRef"].elFormRef.validate();
	const annexTwoValid = proxy.$refs["annexTwoRef"].elFormRef.validate();

	const annexThree1Valid =
		data.value.contractType && data.value.contractType !== "2"
			? proxy.$refs["annexThreeRef"].elFormRef1.validate()
			: true;

	const annexThree2Valid =
		data.value.contractType &&
		data.value.contractType !== "2" &&
		data.value.factoringTarget &&
		data.value.factoringTarget === "2"
			? proxy.$refs["annexThreeRef"].elFormRef2.validate()
			: true;

	const annexFourValid =
		data.value.contractType && data.value.contractType !== "2"
			? proxy.$refs["annexFourRef"].elFormRef.validate()
			: true;

	const haha = await Promise.all([
		baseInfoValid,
		annexOneValid,
		annexTwoValid,
		annexThree1Valid,
		annexThree2Valid,
		annexFourValid
	]);

	let handleData = handleParams();

	if (isEdit.value) {
		// 编辑
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
