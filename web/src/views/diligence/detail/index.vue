<template>
    <div class="app-container" v-loading="loading" ref="appContainerView">
        <div class="content">
            <div class="operate-button" v-if="!routerQueryObj.approveFlag">
                <el-row :gutter="10" class="mb8 " justify="end">
                    <!-- <div class=""> -->
                    <!--  -->
                    <el-col :span="1.5" v-if="!routerQueryObj.viewFlag">
                        <el-button type="primary" icon="List" @click="submitForm(1)">暂存</el-button>
                    </el-col>
                    <el-col :span="1.5" v-if="!routerQueryObj.viewFlag">
                        <el-button type="primary" icon="Checked" @click="submitForm(2)">提交</el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button type="primary" icon="CircleCloseFilled" @click="closePage">取消</el-button>
                    </el-col>
                </el-row>
            </div>
            <div class="zhanwei"></div>
            <div class="content-item-scroll">
                <basic-info id="basicInfo" :diligenceInfo="diligenceInfo" ref="basicInfoRef" :diligenceId="diligenceId"
                    :routerQueryObj="routerQueryObj"></basic-info>
                <!--
			    <flow-search id="flowSearch" v-if="!routerQueryObj.viewFlag" ref="flowSearchRef" :routerQueryObj="routerQueryObj" :needUser="true"></flow-search>
                -->
            </div>

        </div>

    </div>
</template>
<script setup>
import { ref, computed, onBeforeMount, watch } from "vue";
import FlowSearch from '@/views/flowable/search/index.vue'
import { getDiligence, addDiligence, updateDiligence } from "@/api/project/diligence.js"
import basicInfo from './projDilBasicInfo.vue'
const { proxy } = getCurrentInstance();
const diligenceId = ref("");
const route = useRoute();
const router = useRouter();
const loading = ref(false);
const data = reactive({
    diligenceInfo: {
        id: null,
        dueNo: null,
        name: null,
        tatalPeriod: null,
        reviewDate: null,
        submitDepartment: null,
        currentYear: null,
        financeLimitExpireDate: null,
        sponsor: null,
        coreEnterpriseNo: null,
        coreEnterpriseName: null,
        factoringApplicantNo: null,
        factoringApplicantName: null,
        debtorNo: null,
        debtorName: null,
        financeLimitAmount: null,
        financeLimitPeriod: null,
        financeLimitType: null,
        businessType: null,
        businessTypeOther: null,
        contractType: null,
        contractTypeOther: null,
        creditEnhancementMethod: null,
        creditEnhancementMethodOther: null,
        normalTermInterestRate: null,
        gracePeriodInterestRate: null,
        defaultInterestRate: null,
        managementRate: null,
        factoringPeriod: null,
        gracePeriod: null,
        principalRepaymentMethod: null,
        principalRepaymentMethodOther: null,
        interestPaymentMethod: null,
        interestPaymentMethodOther: null,
        interestPayer: null,
        interestPayerOther: null,
        managementPaymentMethod: null,
        managementPaymentMethodOther: null,
        payingParty: null,
        payingPartyOther: null,
        confirmationMethod: null,
        settlementAccount: null,
        status: [],
        validFlag: null,
        createBy: null,
        createById: null,
        updateBy: null,
        updateById: null,
        delFlag: null,
        createTime: null,
        updateTime: null,
        loanList: [],
        commonfileList: [],

    },       //客户信息

});
const props = defineProps({
	approveId: {
		type: Number
	}
})
const { diligenceInfo } = toRefs(data);
let routerQueryObj = ref({});
watch(route, (newRoute) => {
	console.log(newRoute.query);
	if(props.approveId){
		routerQueryObj.value.viewFlag = true;
		routerQueryObj.value.approveFlag = true;
		diligenceId.value = props.approveId;
	}else{
		// diligenceId.value = newRoute.query && newRoute.query.diligenceId;//{customerId:"queryParam0"}
		// routerQueryObj.value.viewFlag = newRoute.query && newRoute.query.viewFlag;
		diligenceId.value = history.state && history.state.diligenceId;//{customerId:"queryParam0"}
		routerQueryObj.value.viewFlag = history.state && history.state.viewFlag;
	}
}, { immediate: true });
/** 修改的时候查询客户基本信息列表 */
function getProjInfoPage() {
    if (diligenceId.value) {
        loading.value = true;
        getDiligence(diligenceId.value).then(response => {
            diligenceInfo.value = response.data;
            loading.value = false;
        });
    }
}
// 表单验证

function submitForm(statusFlag) {
    // 改为固定流程ID
    /*
	const flowForm = new Promise((resolve, reject) => {
	    proxy.$refs['flowSearchRef'].$refs['elForm'].validate(valid => {
	        valid ? resolve(valid) : reject(valid)
	    })
	});
    console.log("flowId",proxy.$refs['flowSearchRef'].formData.flowId);
    */

    if (statusFlag != 1) {
        let basicInfoRefForm = new Promise((resolve, reject) => {
            proxy.$refs['basicInfoRef'].$refs['elForm'].validate(valid => {
                valid ? resolve(valid) : reject(valid)
            })
        })

        //不提交流程form，流程id写死到function saveFormData 中
        //Promise.all([basicInfoRefForm,flowForm]).then(() => {
        Promise.all([basicInfoRefForm]).then(() => {
            saveFormData(statusFlag)
        })
    } else {
        saveFormData(statusFlag)
    }

}

function saveFormData(statusFlag) {
    // 暂存不需要校验；
    const formKeys = ['basicInfoRef'];
    let diligenceInfoSave = diligenceInfo.value;
    formKeys.map(formKey => {
        const partFormData = proxy.$refs[formKey].formData
        Object.assign(diligenceInfoSave, partFormData)
    })

    diligenceInfoSave.status = statusFlag;
    diligenceInfoSave.flowId = "flow_nsztl4s7:22:167747";//改为固定流程而不是选择流程 167751 145030 
	//diligenceInfoSave.flowId = proxy.$refs['flowSearchRef'].formData.flowId;
	diligenceInfoSave.userIds = diligenceInfo.value.sponsor;
    
	if(proxy.$refs['basicInfoRef'].$refs['attachInfoRef'].formData){
		diligenceInfoSave.commonFileList = proxy.$refs['basicInfoRef'].$refs['attachInfoRef'].formData.commonFileList;
	}
	// return;
    if (!diligenceId.value) {
        // 新增
        addDiligence(diligenceInfoSave).then(response => {
            proxy.$modal.msgSuccess("新增成功");
            loading.value = false;
            closePage()
        });
    } else {
        // 修改
        updateDiligence(diligenceInfoSave).then(response => {
            proxy.$modal.msgSuccess("修改成功");
            loading.value = false;
            closePage()
        });
    }
    
}


function closePage() {
    const obj = { path: "/project/project/diligence/index", query: { t: Date.now(), pageNum: history.state.pageNum } };
    proxy.$tab.closeOpenPage(obj);
}


getProjInfoPage();


</script>
<style lang="scss" scoped>
.app-container {
    position: relative;
    height: calc(100vh - 85px);
    overflow: scroll;
}

// .fixed-head {
//     position: fixed;
//     top: 50px;
//     right: 50px;
//     left: 50px;
//     z-index: 100;
// }

.nav-bar {
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 200px;
    right: 20px;

    .item {
        padding: 8px 16px;
        color: #606266;
    }

    .active {
        color: #1890ff;
        ;
        // background-color: #e2e2e2;
    }
}

.content-item-scroll {
    margin-bottom: 20px;
}

.zhanwei {
    height: 40px;
    display: block;
}

.operate-button {
    position: fixed;
    top: 83px;
    z-index: 100;
    background: #fff;
    right: 0;
    left: 0;
    padding: 5px 15px;
    // margin: 20px;

}

.card-header {
    display: flex;
    justify-content: space-between;
}
</style>
  