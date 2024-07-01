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
			<div class="content-item-scroll" ref="formCon">
				<el-card style="margin-top: 15px; margin-bottom: 15px;">
					<div class="flex-around-center" style="max-width: 300px;">
						<FinancingDetails></FinancingDetails>
						<InterestDetails></InterestDetails>
						<Course></Course>
					</div>
				</el-card>
				<BasicInfo v-if="infoFlag" ref="basicInfoRef" :infoData="repayInfo" :routerQueryObj="routerQueryObj">
				</BasicInfo>

				<riskInfo v-if="infoFlag" ref="riskInfoRef" :infoData="repayInfo.po" :routerQueryObj="routerQueryObj"
					@handleTotal="interestTotalChange"></riskInfo>
					
				<div class="content-item-scroll" v-if="!routerQueryObj.viewFlag">
				    <flow-search id="flowSearch" ref="flowSearchRef" :routerQueryObj="routerQueryObj" :needUser="false"></flow-search>
				</div>
			</div>

		</div>

	</div>
</template>
<script setup>
	import {
		ref,
		computed,
		onBeforeMount,
		watch
	} from "vue";
	import {
		deepClone
	} from "@/utils/index"
	import {
		getInfo,
		addInfo,
		updateInfo
	} from "@/api/postLoan/risk"
	import BasicInfo from "./BasicInfo";
	import riskInfo from "./riskInfo";
	import FlowSearch from '@/views/flowable/search/index.vue'

	import FinancingDetails from "@/views/popup/FinancingDetails"
	import InterestDetails from "@/views/popup/InterestDetails"
	import Course from "@/views/popup/Course"

	const {
		proxy
	} = getCurrentInstance();
	const route = useRoute();
	const router = useRouter();
	const loading = ref(false);
	const infoFlag = ref(false);

	const data = reactive({
		repayInfo: {},
	});
	const {
		repayInfo
	} = toRefs(data);

	const props = defineProps({
		approveId: {
			type: Number
		}
	})
	const loanId = ref("");
	let routerQueryObj = ref({});
	watch(route, (newRoute) => {
		if(props.approveId){
			routerQueryObj.value.viewFlag = true;
			routerQueryObj.value.approveFlag = true;
			loanId.value = props.approveId;
		}else{
			loanId.value = newRoute.query && newRoute.query.loanId;
			routerQueryObj.value.viewFlag = newRoute.query && newRoute.query.viewFlag && newRoute.query.viewFlag ===
				'true' ? true : false;
			routerQueryObj.value.pageNum = newRoute.query && newRoute.query.pageNum;
		}
	}, {
		immediate: true
	});

	/** 获取金融回款冲销信息详情 */
	function getProjInfoPage() {
		if (loanId.value) {
			loading.value = true;
			getInfo(loanId.value).then(response => {
				infoFlag.value = true
				repayInfo.value = response.data;
				// console.log('信息',repayInfo.value)
				loading.value = false;
			});
		}
	}

	// 调整利息总金额修改
	function interestTotalChange(val) {
		repayInfo.value.interestTotal = repayInfo.value.interestTotal + val
	}

	// 表单验证
	function submitForm(statusFlag) {
		// const interestInfoForm = new Promise((resolve, reject) => {
		//   proxy.$refs['interestInfoRef'].$refs['elForm'].validate(valid => {
		//     valid ? resolve(valid) : reject(valid)
		//   })
		// })
		const flowForm = new Promise((resolve, reject) => {
		    proxy.$refs['flowSearchRef'].$refs['elForm'].validate(valid => {
		        valid ? resolve(valid) : reject(valid)
		    })
		});
		Promise.all([flowForm]).then(() => {
			loading.value = true
			saveFormData(statusFlag)
		})
		// saveFormData(statusFlag)
	}

	function saveFormData(statusFlag) {
		const partFormData = proxy.$refs['riskInfoRef'].formData
		let repayInfoSave = {}
		console.log('提交', partFormData)
		Object.assign(repayInfoSave, partFormData)
		repayInfoSave.loanId = repayInfo.value.loanId
		repayInfoSave.status = statusFlag
		repayInfoSave.flowId = proxy.$refs['flowSearchRef'].formData.flowId;
		repayInfoSave.userIds = proxy.$refs['flowSearchRef'].formData.userIds;
		if (!repayInfoSave.loanRiskId) {
			//新增
			addInfo(repayInfoSave).then(response => {
				proxy.$modal.msgSuccess("新增成功");
				loading.value = false;
				closePage()
			});
		} else {
			//修改
			updateInfo(repayInfoSave).then(response => {
				proxy.$modal.msgSuccess("修改成功");
				loading.value = false;
				closePage()
			});
		}
	}


	function closePage() {
		const obj = {
			path: "/postLoan/risk",
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

	getProjInfoPage();
</script>
<style lang="scss" scoped>
	@import "../../../../assets/styles/infoForm.scss";
</style>