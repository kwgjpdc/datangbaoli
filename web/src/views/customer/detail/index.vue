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
						<el-button type="primary" icon="List" @click="submitForm(1)"
							>保存</el-button
						>
					</el-col>
					<!-- <el-col :span="1.5" v-if="!routerQueryObj.viewFlag">
            <el-button type="primary" icon="Checked" @click="submitForm(2)">提交</el-button>
          </el-col> -->
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
				<basic-information
					id="basicInformation"
					:infoData="customerDetailInfo"
					ref="basicInformationRef"
					:customerId="customerId"
					:routerQueryObj="routerQueryObj"
				></basic-information>

				<!-- 移动端登录认证 -->
				<mobile-login-info
					id="mobileLoginInfo"
					:infoData="customerDetailInfo"
					ref="mobileLoginInfoRef"
					:customerId="customerId"
					:routerQueryObj="routerQueryObj"
				></mobile-login-info>

				<!-- 授信评级信息 -->
				<credit-rating-info
					id="creditRatingInfo"
					:infoData="customerDetailInfo"
					:customerId="customerId"
					ref="creditRatingInfoRef"
					:routerQueryObj="routerQueryObj"
				></credit-rating-info>

				<!-- 法人信息 -->
				<companyInfo
					id="companyInfo"
					:infoData="customerDetailInfo.companyInfo"
					:customerId="customerId"
					:routerQueryObj="routerQueryObj"
					ref="companyInfoRef"
				></companyInfo>

				<!-- 保理申请人 信息 -->
				<applicationInfo
					id="customerDetailInfo"
					:infoData="customerDetailInfo"
					ref="applicationInfoRef"
					:customerId="customerId"
					:routerQueryObj="routerQueryObj"
				></applicationInfo>

				<!-- 上传附件 -->
				<client-file
					id="clientFile"
					ref="clientFileRef"
					:infoData="customerDetailInfo.commonFileList2"
					:customerId="customerId"
					:routerQueryObj="routerQueryObj"
				></client-file>

				<!-- 客户财报信息 -->
				<customer-info
					id="customerInfo"
					ref="customerInfoRef"
					:infoData="customerDetailInfo"
					:customerId="customerId"
					:routerQueryObj="routerQueryObj"
				></customer-info>

				<!-- 客户账号管理 -->
				<!-- <bank-info
					id="bankInfo"
					ref="bankInfoRef"
					v-if="infoMsg"
					:infoData="customerDetailInfo.bankInfoList"
					:customerId="customerId"
					:routerQueryObj="routerQueryObj"
				></bank-info> -->

				<!-- 客户纳税信息 -->
				<tax-info
					id="taxInfo"
					ref="taxInfoRef"
					v-if="infoMsg"
					:customerId="customerId"
					:infoData="customerDetailInfo.custInvoiceInfoList"
					:routerQueryObj="routerQueryObj"
				></tax-info>
			</div>
		</div>
	</div>
</template>

<script setup name="customerDetail">
import {
	addInfo,
	updateInfo,
	getInfo,
	getCustomerList
} from "@/api/customer/index";
import { onMounted, onBeforeUnmount } from "vue";
import useUserStore from "@/store/modules/user";

import basicInformation from "./basicInformation";
import creditRatingInfo from "./creditRatingInfo";
import clientFile from "./clientFile";
import companyInfo from "./companyInfo";
import customerInfo from "./customerInfo";
import bankInfo from "./bankInfo";
import taxInfo from "./taxInfo";
import mobileLoginInfo from "./mobileLoginInfo";
import applicationInfo from "./applicationInfo"; // 保理申请人信息

const { proxy } = getCurrentInstance();
const route = useRoute();
const router = useRouter();
let infoMsg = ref(true);
const active = ref(0);
const customerId = ref(""); //客户信息id
const loading = ref(false);
let routerQueryObj = ref({}); //路由地址所带参数
const basicInformationRef = ref(null);
const invoiceInfoRef = ref(null);

const data = reactive({
	customerDetailInfo: {
		remark: null,
		customerManager: "",
		customerName: "",
		name: "",
		orgName: "保理公司",
		customerNameEn: "",
		rateScore: "",
		rateOrg: "",
		rateLevel: "",
		rateEffectiveDueDate: "",
		creditNature: "",
		quotaTypeGroup: "",
		currency: "1",
		quotaCeiling: "",
		quotaIsCycle: "",
		quotaEffectiveDate: "",
		quotaDueDate: "",
		totalAmount: "",
		usedAmount: "",
		mayAmount: "",
		companyInfo: {
			businessScope: "",
			creditCode: "",
			foundDate: "",
			parentCustomerId: null,
			registerCountry: "",
			registerProvince: "",
			registerCity: "",
			registerAddr: "",
			blocCustomer: "",
			companyPhone: "",
			operateAddr: "",
			companyFax: "",
			listedCompanyMark: "",
			companyMail: "",
			registerCapital: "",
			realIncomeCapital: "",
			businessTermStartDate: "",
			businessTermEndDate: "",
			manageFeature: "",
			industryClassify: "",
			businessState: "",
			registerApprovalDate: "",
			employeeNumber: "",
			businessScale: "",
			economicType: "",
			nationalIndustryClassify: null,
			corporationName: "",
			sex: "",
			birth: "",
			credentialDueDate: "",
			corporationIdCard: "",
			qualification: "",
			mobilePhone: "",
			fixedPhone: "",
			email: "",
			propertyDescription: "",
			currencyType: "1",
			worth: "",
			remark: ""
		},
		loginName: "", // 大唐云端登陆人名称
		phone: "", // 大唐云端登录手机号
		applyPersonName: "", // 保理申请人-联系人名称
		applyPersonMobileNumber: "", // 保理申请人电话
		applyPersonEmail: "", // 保理申请人电子邮箱
		applySendAddress: "", // 保理申请人送达地址
		flowld: "1",
		userIds: "2",
		bankInfoList: [],
		commonFileList: [],
		commonFileList2: [],
		custInvoiceInfoList: []
	} //客户信息
});

const { customerDetailInfo } = toRefs(data);
const customerList = ref([]);

// onMounted(() => {
//   const appContainerView = proxy.$refs['appContainerView']
//   appContainerView.addEventListener('scroll', onScroll)
// })
// onBeforeUnmount(() => {
//   const appContainerView = proxy.$refs['appContainerView']
//   appContainerView.removeEventListener('scroll', onScroll)
// })

watch(
	route,
	newRoute => {
		console.log(newRoute.query);
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

/** 修改的时候查询客户基本信息列表 */
function getInfoPage() {
	// 新增不需要去获取原来的数据
	if (!customerId.value) {
		customerDetailInfo.value.deptId = useUserStore().dept.deptId;
		customerDetailInfo.value.deptName = useUserStore().dept.deptName;
		return;
	}
	loading.value = true;
	infoMsg.value = false;
	getInfo(customerId.value).then(response => {
		console.log(response);
		customerDetailInfo.value = response.data;
		loading.value = false;
		infoMsg.value = true;
	});
}

function submitForm(statusFlag) {
	// handleSave();
	// return;
	loading.value = true;
	const basicInformationForm = new Promise((resolve, reject) => {
		proxy.$refs["basicInformationRef"].$refs["elForm"].validate(valid => {
			valid ? resolve(valid) : reject(valid);
		});
	});
	const creditRatingInfoForm = new Promise((resolve, reject) => {
		proxy.$refs["creditRatingInfoRef"].$refs["elForm"].validate(valid => {
			valid ? resolve(valid) : reject(valid);
		});
	});
	const companyInfoForm = new Promise((resolve, reject) => {
		proxy.$refs["companyInfoRef"].$refs["elForm"].validate(valid => {
			valid ? resolve(valid) : reject(valid);
		});
	});
	const customerInfoForm = new Promise((resolve, reject) => {
		proxy.$refs["customerInfoRef"].$refs["elForm"].validate(valid => {
			valid ? resolve(valid) : reject(valid);
		});
	});
	const applicationInfoForm = new Promise((resolve, reject) => {
		proxy.$refs["applicationInfoRef"].$refs["elForm"].validate(valid => {
			valid ? resolve(valid) : reject(valid);
		});
	});

	// const clientFileForm = new Promise((resolve, reject) => {
	//   proxy.$refs['clientFileRef'].$refs['elForm'].validate(valid => {
	//     valid ? resolve(valid) : reject(valid)
	//   })
	// })

	// 账户管理不需要在外层校验；
	Promise.all([
		basicInformationForm,
		companyInfoForm,
		customerInfoForm,
		applicationInfoForm
	])
		.then(() => {
			const formKeys = [
				"basicInformationRef",
				"creditRatingInfoRef",
				"companyInfoRef",
				"customerInfoRef",
				"clientFileRef",
				"bankInfoRef",
				"taxInfoRef", // 纳税信息
				"mobileLoginInfoRef", // 移动端登录认证
				"applicationInfoRef" // 保理申请人信息
			];
			let custCustomerlnfoSave = customerDetailInfo;
			let companyInfo = {};
			formKeys.map(formKey => {
				const partFormData = proxy.$refs[formKey].formData;
				if (formKey === "basicInformationRef" || formKey === "companyInfoRef") {
					Object.assign(companyInfo, partFormData.companyInfo);
				}
				Object.assign(custCustomerlnfoSave, partFormData);
			});

			custCustomerlnfoSave.companyInfo = companyInfo;

			custCustomerlnfoSave.status = statusFlag;
			if (!custCustomerlnfoSave.customerId) {
				//新增
				addInfo(custCustomerlnfoSave)
					.then(response => {
						proxy.$modal.msgSuccess("新增成功");
						loading.value = false;
						closePage();
					})
					.catch(() => {
						loading.value = false;
					});
			} else {
				//修改
				updateInfo(custCustomerlnfoSave)
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
		path: "/customer/customer/basic",
		query: { t: Date.now(), pageNum: route.query.pageNum }
	};
	proxy.$tab.closeOpenPage(obj);
}

getInfoPage();
</script>

<style lang="scss" scoped>
@import "../../../assets/styles/infoForm.scss";
</style>
