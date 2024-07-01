<template>
    <div class="app-container" v-loading="loading" ref="appContainerView">
        <div class="content">
            <div class="operate-button" v-if="!routerQueryObj.approveFlag">
                <el-row :gutter="10" class="mb8 " justify="end">
                    <!-- <div class=""> -->
                    <!--  -->
                    <!-- <el-col :span="1.5" v-if="!routerQueryObj.viewFlag">
                        <el-button type="primary" icon="List" @click="submitForm(1)">暂存</el-button>
                    </el-col> -->
                    <el-col :span="1.5" v-if="!routerQueryObj.viewFlag">
                        <el-button type="primary" icon="Checked" @click="submitForm(2)">提交</el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button type="primary" icon="CircleCloseFilled" @click="closePage">取消</el-button>
                    </el-col>
                </el-row>
            </div>
            <div class="zhanwei"></div>
            <div class="content-item-scroll" v-if="infoPage">
                <basic-info id="basicInfo" :diligenceInfo="diligenceInfo" :adjustListObject="adjustListObject" ref="basicInfoRef" :diligenceId="diligenceId"
                    :routerQueryObj="routerQueryObj"></basic-info>
				<flow-search id="flowSearch"  v-if="!routerQueryObj.viewFlag" ref="flowSearchRef" :routerQueryObj="routerQueryObj" :needUser="true"></flow-search>
            </div>

        </div>

    </div>
</template>
<script setup>
import { ref, computed, onBeforeMount, watch } from "vue";
import FlowSearch from '@/views/flowable/search/index.vue'
import { getAdjustDiligence, updateAdjustDiligence } from "@/api/project/diligence.js"
import basicInfo from './projDilAdjustBasicInfo.vue'
const { proxy } = getCurrentInstance();
const diligenceId = ref("");
const route = useRoute();
const router = useRouter();
const loading = ref(false);
const infoPage = ref(false);
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
	adjustListObject: null

});
const { diligenceInfo,adjustListObject } = toRefs(data);
let routerQueryObj = ref({});
const props = defineProps({
	approveId: {
		type: Number
	}
})
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
	console.log(routerQueryObj.value.approveFlag)
}, { immediate: true });
/** 修改的时候查询客户基本信息列表 */
function getProjInfoPage() {
    if (diligenceId.value) {
        loading.value = true;
		infoPage.value = false;
        getAdjustDiligence(diligenceId.value).then(response => {
			let infoData = response[0].jdInfo;
			let infoNewData = response[1].jdysInfo;
			if(infoNewData){
				let newData = {}
				newData = {
					adjustId:infoNewData.adjustId,
					businessType:infoNewData.businessTypeNew,
					businessTypeOther:infoNewData.businessTypeOtherNew,
					confirmationMethod:infoNewData.confirmationMethodNew,
					contractType:infoNewData.contractTypeNew,
					contractTypeOther:infoNewData.contractTypeOtherNew,
					createBy:infoNewData.createBy,
					createById:infoNewData.createById,
					createTime:infoNewData.createTime,
					creditEnhancementMethod:infoNewData.creditEnhancementMethodNew,
					creditEnhancementMethodOther:infoNewData.creditEnhancementMethodOtherNew,
					defaultInterestRate:infoNewData.defaultInterestRateNew,
					delFlag:infoNewData.delFlag,
					diligenceAdjustId:infoNewData.diligenceAdjustId,
					dueId:infoNewData.dueId,
					factoringPeriod:infoNewData.factoringPeriodNew,
					financeLimitAmount:infoNewData.financeLimitAmountNew,
					financeLimitPeriod:infoNewData.financeLimitPeriodNew,
					financeLimitType:infoNewData.financeLimitTypeNew,
					flowId:infoNewData.flowId,
					gracePeriod:infoNewData.gracePeriodNew,
					gracePeriodInterestRate:infoNewData.gracePeriodInterestRateNew,
					interestPayer:infoNewData.interestPayerNew,
					interestPayerOther:infoNewData.interestPayerOtherNew,
					interestPaymentMethod:infoNewData.interestPaymentMethodNew,
					interestPaymentMethodOther:infoNewData.interestPaymentMethodOtherNew,
					managementPaymentMethod:infoNewData.managementPaymentMethodNew,
					managementPaymentMethodOther:infoNewData.managementPaymentMethodOtherNew,
					managementRate:infoNewData.managementRateNew,
					normalTermInterestRate:infoNewData.normalTermInterestRateNew,
					payingParty:infoNewData.payingPartyNew,
					payingPartyOther:infoNewData.payingPartyOtherNew,
					principalRepaymentMethod:infoNewData.principalRepaymentMethodNew,
					principalRepaymentMethodOther:infoNewData.principalRepaymentMethodOtherNew,
					remark:infoNewData.remark,
					settlementAccount:infoNewData.settlementAccountNew,
					status:infoNewData.status,
					supplementaryInformation:infoNewData.supplementaryInformationNew,
					updateBy:infoNewData.updateBy,
					updateById:infoNewData.updateById,
					updateTime:infoNewData.updateTime,
					userIds:infoNewData.userIds
				}
				if(routerQueryObj.value.approveFlag){
					diligenceInfo.value = infoData;
					adjustListObject.value = newData;
				}else{
					for(var i in infoData){
						if(!newData[i]){
							newData[i] = infoData[i];
						}
					}
					diligenceInfo.value = newData;
				}
			}else{
				diligenceInfo.value = infoData;
			}
            loading.value = false;
			infoPage.value = true;
        });
    }
}
// 表单验证


async function submitForm(statusFlag) {
    // const basicInfoRefForm = new Promise((resolve, reject) => {
    //     proxy.$refs['basicInfoRef'].$refs['elForm'].validate(valid => {
    //         valid ? resolve(valid) : reject(valid)

    //     })
    // })




    // Promise.all([basicInfoRefForm]).then(() => {

    // })

    // 判断属性是否为空；
    let isNull = true;

    let diligenceInfoSave = proxy.$refs['basicInfoRef'].adjustListObject;
    let diligenceInfoSavePin = {};
    diligenceInfoSavePin.adjustList = [];
    diligenceInfoSavePin.oldLoanList = [];
    diligenceInfoSavePin.adjustLoanList = [];
    proxy.$refs['basicInfoRef'].formData.loanList.forEach(element => {
        let obj = {};
        if (element.loanNodeBasisNew || element.loanNodeBasisOtherNew || element.loanRatioNew || element.confirmationSealNew || element.confirmationSealOtherNew) {
            diligenceInfoSavePin.oldLoanList.push(element);
            obj.loanId = element.id;
            obj.loanNodeBasis = element.loanNodeBasisNew;
            obj.loanNodeBasisOther = element.loanNodeBasisOtherNew;
            obj.loanRatio = element.loanRatioNew;
            obj.confirmationSeal = element.confirmationSealNew;
            obj.confirmationSealOther = element.confirmationSealOtherNew;
            diligenceInfoSavePin.adjustLoanList.push(obj);
            isNull = false;
        }
    });
    for (let item in diligenceInfoSave) {
        console.log(item);
        if (diligenceInfoSave[item] instanceof Array && diligenceInfoSave[item].length > 0) {
            
            isNull = false;
        } else if (!(diligenceInfoSave[item] instanceof Array) && diligenceInfoSave[item] && item.indexOf('New') ==-1 &&item !='dueId' ) {
            diligenceInfoSave[item+'New'] = diligenceInfoSave[item];
            diligenceInfoSave[item] = diligenceInfo.value[item];
            isNull = false;
        }
    }
    if (isNull) {
        proxy.$modal.confirm('请至少修改一个要素再保存');
        return
    } else {
		const flowForm = new Promise((resolve, reject) => {
		    proxy.$refs['flowSearchRef'].$refs['elForm'].validate(valid => {
		        valid ? resolve(valid) : reject(valid)
		    })
		});
		Promise.all([flowForm]).then(() => {
			diligenceInfoSavePin.status = statusFlag;
			
			diligenceInfoSavePin.adjustList.push(diligenceInfoSave);
			diligenceInfoSavePin.id = diligenceInfo.value.id;
			diligenceInfoSavePin.dueId = diligenceInfo.value.id;// 最外层的dueId
			diligenceInfoSavePin.flowId = proxy.$refs['flowSearchRef'].formData.flowId;
			diligenceInfoSavePin.userIds = proxy.$refs['flowSearchRef'].formData.userIds;
			console.log(diligenceInfoSavePin);
			//新增
			updateAdjustDiligence(diligenceInfoSavePin).then(response => {
				proxy.$modal.msgSuccess("修改成功");
				loading.value = false;
				closePage()
			});
		})
    }

}

function closePage() {
    const obj = { path: "/project/project/diligence/index", query: { t: Date.now(), pageNum: route.query.pageNum } };
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
  