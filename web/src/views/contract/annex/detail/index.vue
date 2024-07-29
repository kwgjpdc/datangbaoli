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
				<el-collapse v-model="activeCollapseNames">
					<el-collapse-item title="合同基本信息" name="baseInfo">
						<baseInfo
							ref="baseInfoRef"
							v-model:data="data"
							:routerQueryObj="props.routerQueryObj"
							v-model:loading="loading"
						/>
					</el-collapse-item>
					<el-collapse-item title="应收账款信息（附件一）" name="annexOne">
						<annexOne
							ref="baseInfoRef"
							v-model:data="data"
							:routerQueryObj="props.routerQueryObj"
							v-model:loading="loading"
						/>
					</el-collapse-item>
					<el-collapse-item title="应收账款信息（附件二）" name="annexTwo">
						2222
					</el-collapse-item>
					<el-collapse-item title="应收账款信息（附件三）" name="annexThree">
						333
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
import {
	getContract,
	addContract,
	updateContract
} from "@/api/contract/index.js";

import baseInfo from "./baseInfo.vue";
import annexOne from "./annexOne.vue";

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

// 数据对象
const data = ref({
	// 总：
	contractId: null, // 合同主键id
	projDueDiligenceId: null, // 项目尽调主键id
	// 附件1：
	contractId: null, // 保理合同主键id
	projDueDiligenceId: null, // 项目尽调主键id
	contractFileId: null, // //保理附件主键id

	receivableNumber: null, //应收账款转让明细表 【编号】
	customerName: null, //保理申请人
	contractNum: null, // 保理主合同编号

	// transactionContNumName: null, //基础交易合同编号及名称
	// debtName: null, //债务人名称
	// receivableNum: null, //应收账款金额
	// invoiceNum: null, // 发票号码
	// receivableEndDate: null, // 应收账款到期日
	// remark: null, // 备注

	carList: [], // 附件1

	// 附件2：
	


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

		if (!data.value.projectDueId) {
			return proxy.$message.error("请选择【项目尽调编号】");
		}

		if (!isEdit.value) {
			addContractData(status);
		} else {
			updateContractData(status);
		}
	} else {
		//

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
