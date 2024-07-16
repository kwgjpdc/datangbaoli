<template>
	<div
		class="app-container info-form-container"
		v-loading="loading"
		ref="appContainerView"
	>
		<div class="content">
			<div class="operate-button">
				<el-row :gutter="10" justify="end">
					<el-col :span="1.5" v-if="!routerQueryObj.viewFlag">
						<el-button type="primary" icon="List" @click="submitForm"
							>保存</el-button
						>
					</el-col>
					<el-col :span="1.5">
						<el-button
							type="primary"
							icon="CircleCloseFilled"
							@click="closePage"
							>返回</el-button
						>
					</el-col>
				</el-row>
			</div>
			<div class="content-item-scroll" ref="formCon">
				<!-- 基础信息 -->
				<basic-information
					id="basicInformation"
					ref="basicInformationRef"
					:infoData="customerBankInfo"
					:customerId="customerId"
					:routerQueryObj="routerQueryObj"
				></basic-information>

				<!-- 客户银行账号信息  -->
				<bank-info
					id="bankInfo"
					ref="bankInfoRef"
					:infoData="customerBankInfo.bankInfoList"
					:customerId="customerId"
					:routerQueryObj="routerQueryObj"
				></bank-info>

				<!-- 上传附件 -->
				<!-- <client-file
					id="clientFile"
					ref="clientFileRef"
					:infoData="customerBankInfo.commonFileList2"
					:customerId="customerId"
					:routerQueryObj="routerQueryObj"
				></client-file> -->
			</div>
		</div>
	</div>
</template>

<script setup name="customerDetail">
import {
	addCustomerAcont,
	updateCustomerAcont,
	customerAcontDetail
} from "@/api/customer/customerAccount";

import { onMounted } from "vue";

import basicInformation from "./basicInformation";
import bankInfo from "./bankInfo";
// import clientFile from "./clientFile";

const { proxy } = getCurrentInstance();
const route = useRoute();
const router = useRouter();
const active = ref(0);
const customerId = ref(""); //客户信息id
const loading = ref(false);
let routerQueryObj = ref({}); //路由地址所带参数
const basicInformationRef = ref(null);
const invoiceInfoRef = ref(null);

const data = reactive({
	customerBankInfo: {
		remark: null,
		customerName: null,
		customerId: null,
		customerType: null,
		obligorName: null,
		obligorId: null,
		bankInfoList: [],
		commonFileList: []
	} //客户账号管理信息
});

const { customerBankInfo } = toRefs(data);

watch(
	route,
	newRoute => {
		customerId.value = newRoute.query && newRoute.query.customerId; //{customerId:"queryParam0"}
		routerQueryObj.value.viewFlag =
			newRoute.query &&
			newRoute.query.viewFlag &&
			newRoute.query.viewFlag === "true"
				? true
				: false;
	},
	{ immediate: true }
);

/* 修改的时候查询客户基本信息列表 */
// function getInfoPage() {
// 	// 原代码留，不知道做什么，看上去有点重要！
// 	if (!customerId.value) {
// 		customerBankInfo.value.deptId = useUserStore().dept.deptId;
// 		customerBankInfo.value.deptName = useUserStore().dept.deptName;
// 		return;
// 	}
// 	loading.value = true;
// 	getInfo(customerId.value).then(response => {
// 		customerBankInfo.value = response.data;
// 		loading.value = false;
// 	});
// }

function submitForm() {
	if (!proxy.$refs["bankInfoRef"].formData.bankInfoList.length) {
		return proxy.$message.error(
			"【客户银行账号信息】不能为空，请添加一条【客户银行账号信息】！"
		);
	}

	loading.value = true;
	const basicInformationForm = new Promise((resolve, reject) => {
		proxy.$refs["basicInformationRef"].$refs["elForm"].validate(valid => {
			valid ? resolve(valid) : reject(valid);
		});
	});

	// 账户管理不需要在外层校验；
	Promise.all([basicInformationForm])
		.then(() => {
			const formKeys = ["basicInformationRef", "bankInfoRef"];
			let custCustomerlnfoSave = customerBankInfo;

			formKeys.map(formKey => {
				const partFormData = proxy.$refs[formKey].formData;
				Object.assign(custCustomerlnfoSave, partFormData);
			});

			const customerId = custCustomerlnfoSave.customerId;
			const customerName = custCustomerlnfoSave.customerName;
			const customerType = custCustomerlnfoSave.customerType;
			const obligorId = custCustomerlnfoSave.obligorId;
			const obligorName = custCustomerlnfoSave.obligorName;
			const remark = custCustomerlnfoSave.remark;
			const commonFileList = custCustomerlnfoSave.commonFileList;

			const customerAccountManageList = custCustomerlnfoSave.bankInfoList.map(
				item => {
					return {
						...item,
						customerId,
						customerName,
						customerType,
						obligorId,
						obligorName,
						remark,
						commonFileList
					};
				}
			);

			// const customerId = route.query.customerId;
			// const obligorId = route.query.obligorId;

			debugger;
			if (!route.query.customerId) {
				// add
				addCustomerAcont({ customerAccountManageList })
					.then(response => {
						proxy.$modal.msgSuccess("新增成功");
						loading.value = false;
						closePage();
					})
					.catch(() => {
						loading.value = false;
					});
			} else {
				// update
				updateCustomerAcont({ customerAccountManageList })
					.then(response => {
						proxy.$modal.msgSuccess("修改成功");
						loading.value = false;
						closePage();
					})
					.catch(() => {
						loading.value = false;
					});
			}
		})
		.catch(() => {
			const errDom = proxy.$refs["formCon"].querySelectorAll(
				".is-error"
			)[0] || {
				scrollIntoView: () => {}
			};
			errDom.scrollIntoView({ block: "center", behavior: "smooth" });
			loading.value = false;
		});
}

function goAnchor(id) {
	var anchor = document.getElementById(id);
	anchor.scrollIntoView({
		behavior: "smooth",
		block: "start",
		inline: "nearest"
	});
}

// 滚动监听器
function onScroll() {
	// 获取所有锚点元素
	const navContents = document.querySelectorAll(
		".content div.content-item-scroll"
	);
	// 所有锚点元素的 offsetTop
	const offsetTopArr = [];
	navContents.forEach(item => {
		offsetTopArr.push(item.offsetTop);
	});
	// 获取当前文档流的 scrollTop
	const scrollTop = proxy.$refs["appContainerView"].scrollTop;
	// 定义当前点亮的导航下标
	let navIndex = 0;
	for (let n = 0; n < offsetTopArr.length; n++) {
		// 如果 scrollTop 大于等于第 n 个元素的 offsetTop 则说明 n-1 的内容已经完全不可见
		// 那么此时导航索引就应该是 n 了
		if (scrollTop >= offsetTopArr[n]) {
			navIndex = n;
		}
	}
	// 把下标赋值给 vue 的 data
	console.log(navIndex);
	active.value = navIndex;
}

// 关闭详情标签页
function closePage() {
	const obj = {
		path: "/customer/account/info",
		query: { t: Date.now(), pageNum: route.query.pageNum }
	};
	proxy.$tab.closeOpenPage(obj);
}

onMounted(() => {
	const customerId = route.query.customerId;
	const obligorId = route.query.obligorId;

	if (customerId && obligorId) {
		customerAcontDetail({
			customerId,
			obligorId
		})
			.then(response => {
				const customerName = response.data[0].customerName;
				const customerId = response.data[0].customerId;
				const obligorName = response.data[0].customerName;
				const obligorId = response.data[0].obligorId;
				const customerType = response.data[0].customerType;
				const remark = response.data[0].remark;

				const bankInfoList = response.data.map(item => ({
					accountType: item.accountType,
					currencyType: item.currencyType,
					accountBankInfo: item.accountBankInfo,
					accountInfo: item.accountInfo,
					accountName: item.accountName,
					accountCapitalInfo: item.accountCapitalInfo
				}));

				customerBankInfo.value = {
					customerName,
					customerId,
					obligorName,
					obligorId,
					customerType,
					remark,
					bankInfoList
				};
			})
			.catch(err => {
				console.log(err);
			})
			.finally(() => {
				loading.value = false;
			});
	}
});

// getInfoPage();
</script>

<style lang="scss" scoped>
@import "../../../../assets/styles/infoForm.scss";
</style>
