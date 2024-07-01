<template>
	<div class="app-container info-form-container" v-loading="loading">
		<div class="content">
			<div class="operate-button">
				<el-row :gutter="10" justify="end">
					<el-col :span="1.5" v-if="!routerQueryObj.viewFlag">
						<el-button type="primary" icon="List" @click="submitForm(1)">保存</el-button>
					</el-col>
					<!-- <el-col :span="1.5" v-if="!routerQueryObj.viewFlag">
						<el-button type="primary" icon="Checked" @click="submitForm(2)">提交</el-button>
					</el-col> -->
					<el-col :span="1.5">
						<el-button type="primary" icon="CircleCloseFilled" @click="closePage">返回</el-button>
					</el-col>
				</el-row>
			</div>
			<div class="content-item-scroll">
				<basic-info v-if="infoFlag" ref="basicInfoRef" :infoData="repayInfo"
					:routerQueryObj="routerQueryObj"></basic-info>

				<payback-info v-if="infoFlag" ref="paybackInfoRef" :infoData="repayInfo.po"
					:routerQueryObj="routerQueryObj"></payback-info>

				<fee-info v-if="infoFlag" ref="feeInfoRef" :infoData="repayInfo.po"
					:routerQueryObj="routerQueryObj"></fee-info>
			</div>

		</div>

	</div>
</template>
<script setup>
	import {
		getRepay,
		addRepay,
		updateRepay
	} from "@/api/postLoan/financing"
	import {
		getInfo as getUserId
	} from "@/api/customer/index";
	import BasicInfo from "./BasicInfo"
	import PaybackInfo from "./PaybackInfo"
	import FeeInfo from "./FeeInfo"
	import {
		deepClone
	} from "@/utils/index"

	const {
		proxy
	} = getCurrentInstance();
	const route = useRoute();
	const router = useRouter();
	const loading = ref(true);
	const infoFlag = ref(false);

	const data = reactive({
		repayInfo: {
			loanId: null,
			debtId: null,
			contractNo: null,
			bussProduct: null,
			factoringApplicantName: null,
			loanCurrency: "1",
			po: {
				entryItem: "",
				entryDate: null,
				deductionAmount: null,
				entryAccount: "",
				repaymentSource: null,
				entryAmount: null,
				subList: [],
				feeList: []
			}
		}
	});
	const {
		repayInfo
	} = toRefs(data);

	const loanId = ref("");
	let routerQueryObj = ref({});
	watch(route, (newRoute) => {
		loanId.value = newRoute.query && newRoute.query.loanId;
		routerQueryObj.value.viewFlag = newRoute.query && newRoute.query.viewFlag && newRoute.query.viewFlag ===
			'true' ? true : false;
		routerQueryObj.value.pageNum = newRoute.query && newRoute.query.pageNum;
	}, {
		immediate: true
	});

	onBeforeMount(() => {
		getProjInfoPage()
	})

	/** 获取金融回款冲销信息详情 */
	function getProjInfoPage() {
		if (loanId.value) {
			loading.value = true;
			getRepay(loanId.value).then(response => {
				// console.log('获取金融回款冲销信息详情',response.data)
				let dataInfo = response.data;
				let feeList = dataInfo.feeList;
				if (!dataInfo.po.feeList || dataInfo.po.feeList.length < 1) {
					if (feeList) {
						dataInfo.po.feeList = feeList;
					}
				}
				repayInfo.value = deepClone(dataInfo);
				loading.value = false;
				infoFlag.value = true;
				let customerId = dataInfo.po.feeList[0].customerId;
				if(customerId){
					getUserId(customerId).then((res) => {
						repayInfo.value.po.feeList[0].customerName = res.data.customerName;
					});
				}
			});
		}
	}

	// 表单验证
	function submitForm(statusFlag) {
		loading.value = true
		const basicInfoRefForm = new Promise((resolve, reject) => {
			proxy.$refs['basicInfoRef'].$refs['elForm'].validate(valid => {
				valid ? resolve(valid) : reject(valid)
			})
		})
		const paybackInfoRefForm = new Promise((resolve, reject) => {
			proxy.$refs['paybackInfoRef'].$refs['elForm'].validate(valid => {
				valid ? resolve(valid) : reject(valid)
			})
		})
		const feeInfoRefForm = new Promise((resolve, reject) => {
			proxy.$refs['feeInfoRef'].$refs['elForm'].validate(valid => {
				valid ? resolve(valid) : reject(valid)
			})
		})
		Promise.all([basicInfoRefForm, paybackInfoRefForm, feeInfoRefForm]).then(() => {
			saveFormData(statusFlag)
		}).catch(() => {
			loading.value = false
		})
	}

	function saveFormData(statusFlag) {
		const formKeys = ['basicInfoRef', 'paybackInfoRef', 'feeInfoRef'];
		let repayInfoSave = repayInfo.value;
		// console.log('repayInfo', repayInfoSave)
		formKeys.map(formKey => {
			const partFormData = proxy.$refs[formKey].formData
			if (formKey === 'paybackInfoRef') {
				repayInfoSave.po.entryAmount = partFormData.entryAmount
				repayInfoSave.po.subList = partFormData.subList
			} else if (formKey === 'feeInfoRef') {
				repayInfoSave.po.feeList = partFormData.feeList
			} else {
				repayInfoSave = deepClone(partFormData)
			}
		})
		repayInfoSave.po.status = statusFlag;
		repayInfoSave.po.loanId = loanId.value;
		repayInfoSave.po.debtId = repayInfoSave.debtId ? repayInfoSave.debtId : ""
		// 接口只需要 repayInfoSave.po 部分 ；
		// repayInfoSave.po.id原来有值是修改 没值是新增；
		if (repayInfoSave.po.entryItem && repayInfoSave.po.entryItem.length) {
			repayInfoSave.po.entryItem = repayInfoSave.po.entryItem.join(',')
		} else {
			repayInfoSave.po.entryItem = "";
		}
		console.log('repayInfoSave.po', repayInfoSave);
		if (!repayInfoSave.po.id) {
			//新增
			addRepay(repayInfoSave.po).then(response => {
				proxy.$modal.msgSuccess("新增成功");
				loading.value = false;
				closePage()
			}).catch(() => {
				loading.value = false
			});
		} else {
			//修改
			updateRepay(repayInfoSave.po).then(response => {
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
			path: "/postLoan/financing",
			query: {
				t: Date.now(),
				pageNum: route.query.pageNum
			}
		};
		proxy.$tab.closeOpenPage(obj);
	}


	// 取消按钮
	function cancel() {
		open.value = false;
		reset();
	}

	// getProjInfoPage()
</script>
<style lang="scss" scoped>
	@import '../../../../assets/styles/infoForm.scss';
</style>