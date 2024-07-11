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
						<el-button type="primary" icon="Checked" @click="submitForm(2)"
							>提交</el-button
						>
					</el-col>
					<el-col :span="1.5">
						<el-button
							type="primary"
							icon="CircleCloseFilled"
							@click="closePage"
							>取消</el-button
						>
					</el-col>
				</el-row>
			</div>
			<div class="content-item-scroll">
				<basic-info
					id="basicInfo"
					:institutionInfo="institutionInfo"
					ref="basicInfoRef"
					:institutionId="institutionId"
					:routerQueryObj="routerQueryObj"
				></basic-info>
			</div>
		</div>
	</div>
</template>
<script setup>
import {
	getInstitutionInfo,
	addInstitutionInfo,
	updateInstitutionInfo
} from "@/api/institution/info.js";
import basicInfo from "./institutionBasicInfo.vue";
const { proxy } = getCurrentInstance();
const institutionId = ref("");
const route = useRoute();
const router = useRouter();
const loading = ref(false);

const data = reactive({
	institutionInfo: {
		institutionId: null,
		institutionName: null,
		registerCode: null,
		registeredCapital: null,
		contribution: null,
		legalRepresentative: null,
		createBy: null,
		createById: null,
		updateBy: null,
		updateById: null,
		delFlag: null,
		createTime: null,
		updateTime: null
	} //客户信息
});
const { institutionInfo } = toRefs(data);
let routerQueryObj = ref({});
watch(
	route,
	newRoute => {
		routerQueryObj.value.viewFlag = history.state && history.state.viewFlag;
		routerQueryObj.value.pageNum = history.state && history.state.pageNum;
		institutionId.value = history.state && history.state.institutionId;
	},
	{ immediate: true }
);
/** 修改的时候查询客户基本信息列表 */
function getInstitutionInfoPage() {
	if (institutionId.value) {
		loading.value = true;
		getInstitutionInfo(institutionId.value).then(response => {
			institutionInfo.value = response.data;
			console.log(institutionInfo.value);
			loading.value = false;
		});
	}
}
// 表单验证

function submitForm(statusFlag) {
	const basicInfoRefForm = new Promise((resolve, reject) => {
		proxy.$refs["basicInfoRef"].$refs["elForm"].validate(valid => {
			valid ? resolve(valid) : reject(valid);
		});
	});

	Promise.all([basicInfoRefForm]).then(() => {
		const formKeys = ["basicInfoRef"];
		let institutionInfoSave = institutionInfo.value;
		formKeys.map(formKey => {
			const partFormData = proxy.$refs[formKey].formData;
			Object.assign(institutionInfoSave, partFormData);
		});
		console.log(institutionInfoSave);
		institutionInfoSave.status = statusFlag;
		if (!institutionId.value) {
			//新增
			addInstitutionInfo(institutionInfoSave).then(response => {
				proxy.$modal.msgSuccess("新增成功");
				loading.value = false;
				closePage();
			});
		} else {
			//修改
			updateInstitutionInfo(institutionInfoSave).then(response => {
				proxy.$modal.msgSuccess("修改成功");
				loading.value = false;
				closePage();
			});
		}
	});
}
function closePage() {
	const obj = {
		path: "/organ/institution/info",
		query: { t: Date.now(), pageNum: routerQueryObj.value.pageNum }
	};
	proxy.$tab.closeOpenPage(obj);
}

getInstitutionInfoPage();
</script>
<style lang="scss" scoped>
@import "../../../../assets/styles/infoForm.scss";
</style>
