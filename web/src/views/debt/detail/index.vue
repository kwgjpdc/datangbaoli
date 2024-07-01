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
                <basic-info id="basicInfo" :debtInfo="debtInfo" ref="basicInfoRef" :debtId="debtId"
                    :routerQueryObj="routerQueryObj"></basic-info>
            </div>


            <div class="content-item-scroll">
                <attach-info id="attachInfo" ref="attachInfoRef" :commonFileList="debtInfo.commonFileList"
                    :routerQueryObj="routerQueryObj" :debtId="debtId"></attach-info>
            </div>
			<div class="content-item-scroll" v-if="!routerQueryObj.viewFlag">
			    <flow-search id="flowSearch" ref="flowSearchRef" :routerQueryObj="routerQueryObj" :needUser="false"></flow-search>
			</div>
        </div>




    </div>
</template>
<script setup>
import { ref, computed, onBeforeMount, watch } from "vue";
import { getDebtInfo, addDebtInfo, updateDebtInfo } from "@/api/debt/info.js"
import basicInfo from './debtBasicInfo.vue'
import attachInfo from './debtAttachInfo.vue'
import FlowSearch from '@/views/flowable/search/index.vue'
const { proxy } = getCurrentInstance();
const debtId = ref("");
const contractId = ref("");
const route = useRoute();
const router = useRouter();
const loading = ref(false);

const data = reactive({
    debtInfo: {

        id: null,
        contractNo: null,
        contractName: null,
        coreEnterpriseName: null,
        accountDebtorName: null,
        businessType: null,
        businessTypeOther: null,
        currencyType: null,
        status: [],
        createBy: null,
        createById: null,
        updateBy: null,
        updateById: null,
        delFlag: null,
        createTime: null,
        updateTime: null,
        voucherList: [],
        contract:{
            "createBy": null,
            "createById": null,
            "createTime": null,
            "updateBy": null,
            "updateById": null,
            "updateTime": null,
            "delFlag": null,
            "remark": null,
            "contractId": null,
            "contractNo": "",
            "bussProduct": null,
            "projectNo": "",
            "projectName": "",
            "baseContractStartDate": null,
            "baseContractEndDate": null,
            "baseSealTime": null,
            "baseGraceDays": null,
            "baseChargeInterestWay": null,
            "baseSettleInterestWay": null,
            "basePrincipalConfirmParty": null,
            "baseProvince": null,
            "baseIndustryType": null,
            "baseItem": null,
            "baseRemark": null,
            "baseSignStatus": null,
            "baseSignOpinion": null,
            "agreeDebtorName": "",
            "agreeCompanyNo": null,
            "agreeSettlement": null,
            "agreePaymentLimit": null,
            "agreePaymentStartDate": null,
            "agreePaymentEndDate": null,
            "agreePaymentVerify": null,
            "agreeStartDate": "",
            "agreePaymentMaxLimit": null,
            "agreeAdvance": null,
            "agreeAdvanceGraceDays": null,
            "agreeAdvancePercentage": null,
            "agreeGuaranteePaymentLimit": null,
            "agreePay": null,
            "agreeBuyerPoolCeiling": null,
            "agreeOverrun": null,
            "agreeInform": null,
            "agreeInformOther": null,
            "agreeTransferPart": null,
            "branchCustomerId": null,
            "branchType": null,
            "branchInterestCycle": null,
            "branchFineRate": null,
            "accountType": null,
            "accountName": null,
            "accountCustomerName": null,
            "accountDebtorName": null,
            "accountBankName": null,
            "accountBankAccount": null,
            "accountRemark": null,
            "repayLoan": null,
            "otherContractNo": "",
            "otherContractName": "",
            "otherCurrencyType": null,
            "otherContractAmount": null,
            "otherQuotaCeiling": null,
            "otherQuotaCircle": null,
            "otherRemark": null,
            "validFlag": null,
            "feeList": null,
            "interestList": null,
            "commonFileList": []
        },
        "commonFileList": [],

    },       //客户信息

});
const props = defineProps({
	approveId: {
		type: Number
	}
})
const { debtInfo } = toRefs(data);
let routerQueryObj = ref({});
watch(route, (newRoute) => {
	if(props.approveId){
		routerQueryObj.value.viewFlag = true;
		routerQueryObj.value.approveFlag = true;
		debtId.value = props.approveId;
	}else{
		routerQueryObj.value.viewFlag = history.state && history.state.viewFlag;
		routerQueryObj.value.pageNum = history.state && history.state.pageNum;
		debtId.value = history.state && history.state.debtId;
		// contractId.value = history.state && history.state.contractId;
	}
}, { immediate: true });
/** 修改的时候查询客户基本信息列表 */
function getDebtInfoPage() {
    if (debtId.value) {
        loading.value = true;
        getDebtInfo(debtId.value).then(response => {
			let debtInfoMsg = response.data;
			debtInfoMsg.otherContractNo = debtInfoMsg.contractNo;
			debtInfoMsg.otherContractName = debtInfoMsg.contractName;
            debtInfo.value = debtInfoMsg;
			// console.log(debtInfo)
			// debtInfo.value = response.data;
            loading.value = false;
        });
    }
}
// 表单验证

function submitForm(statusFlag) {
    // if (proxy.$refs['attachInfoRef'].formData.commonFileList.length != 1) {
    //     proxy.$modal.msgError('请上传文件再保存');
    //     return;
    // }

	const flowForm = new Promise((resolve, reject) => {
	    proxy.$refs['flowSearchRef'].$refs['elForm'].validate(valid => {
	        valid ? resolve(valid) : reject(valid)
	    })
	});
    let voucherListValidate = true;
    proxy.$refs['basicInfoRef'].formData.voucherList.forEach((item)=>{
        if(!item.factoringApplicantNo) voucherListValidate = false;
    })
	// if(debtInfo.value.voucherList.length<1){
	// 	proxy.$modal.msgError('应收账款管理数据不能为空！');
	// 	return;
	// }
    if(!voucherListValidate) {
        proxy.$modal.msgError('请检查应收账款管理数据保理申请人是否为空！');
        return;
    }


    const basicInfoRefForm = new Promise((resolve, reject) => {
        proxy.$refs['basicInfoRef'].$refs['elForm'].validate(valid => {
            valid ? resolve(valid) : reject(valid)

        })
    })




    Promise.all([basicInfoRefForm,flowForm]).then(() => {
        const formKeys = ['basicInfoRef', 'attachInfoRef'];
        let debtInfoSave = debtInfo.value;
        formKeys.map(formKey => {
            const partFormData = proxy.$refs[formKey].formData
            Object.assign(debtInfoSave, partFormData)
        })
        console.log(debtInfoSave);
        debtInfoSave.status = statusFlag;
		debtInfoSave.flowId = proxy.$refs['flowSearchRef'].formData.flowId;
		debtInfoSave.userIds = proxy.$refs['flowSearchRef'].formData.userIds;
        if (!debtId.value) {
            //新增
            addDebtInfo(debtInfoSave).then(response => {
                proxy.$modal.msgSuccess("新增成功");
                loading.value = false;
                closePage()
            });
        } else {
            //修改
            updateDebtInfo(debtInfoSave).then(response => {
                proxy.$modal.msgSuccess("修改成功");
                loading.value = false;
                closePage()
            });
        }
    })


}
function closePage() {
    const obj = { path: "/debt/debt/info/index", query: { t: Date.now(), pageNum: routerQueryObj.value.pageNum } };
    proxy.$tab.closeOpenPage(obj);
}


getDebtInfoPage();


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
  