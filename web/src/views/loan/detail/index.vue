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
                <basic-info id="basicInfo" :loanInfo="loanInfo" ref="basicInfoRef" :debtId="debtId"
                    :routerQueryObj="routerQueryObj"></basic-info>
            </div>
			<div class="content-item-scroll" v-if="!routerQueryObj.viewFlag">
			    <flow-search id="flowSearch" ref="flowSearchRef" :routerQueryObj="routerQueryObj" :needUser="false"></flow-search>
			</div>

        </div>

    </div>
</template>
<script setup>
import { ref, computed, onBeforeMount, watch } from "vue";
import { getLoan, addLoan, updateLoan } from "@/api/debt/loan.js"
import basicInfo from './loanBasicInfo.vue'
import FlowSearch from '@/views/flowable/search/index.vue'
const { proxy } = getCurrentInstance();
const debtId = ref("");
const route = useRoute();
const router = useRouter();
const loading = ref(false);
const data = reactive({
    loanInfo: {
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
        loan:[],
        accountList:[],
    },       //客户信息

});
const props = defineProps({
	approveId: {
		type: Number
	}
})
const { loanInfo } = toRefs(data);
let routerQueryObj = ref({});
watch(route, (newRoute) => {
    console.log(newRoute.query);
	if(props.approveId){
		routerQueryObj.value.viewFlag = true;
		routerQueryObj.value.approveFlag = true;
		debtId.value = props.approveId;
	}else{
		// debtId.value = newRoute.query && newRoute.query.debtId;//{customerId:"queryParam0"}
		// routerQueryObj.value.viewFlag = newRoute.query && newRoute.query.viewFlag;
		debtId.value = history.state && history.state.debtId;//{customerId:"queryParam0"}
		routerQueryObj.value.viewFlag = history.state && history.state.viewFlag;
	}
}, { immediate: true });
/** 修改的时候查询客户基本信息列表 */
function getProjInfoPage() {
    if (debtId.value) {
        loading.value = true;
        getLoan(debtId.value).then(response => {
			let data = response.data;
			let loanList = data.loanList;
			let loanNo = "";
			if(loanList){
				for(var i in loanList){
					if(i == 0){
						loanNo = loanList[i].loanNo;
					}else{
						loanNo += ',' + loanList[i].loanNo;
					}
				}
			}
			data.loanNo = loanNo;
            loanInfo.value = data;
            loading.value = false;
        });
    }
}
// 表单验证

function submitForm(statusFlag) {
	const flowForm = new Promise((resolve, reject) => {
	    proxy.$refs['flowSearchRef'].$refs['elForm'].validate(valid => {
	        valid ? resolve(valid) : reject(valid)
	    })
	});
	if (statusFlag != 1) {
		const basicInfoRefForm = new Promise((resolve, reject) => {
			proxy.$refs['basicInfoRef'].$refs['elForm'].validate(valid => {
				valid ? resolve(valid) : reject(valid)
			})
		})
		Promise.all([basicInfoRefForm,flowForm]).then(() => {
			saveFormData(statusFlag)
		})
	} else {
		saveFormData(statusFlag)
	}


}

function saveFormData(statusFlag) {
    // 暂存不需要校验；
    const formKeys = ['basicInfoRef'];
    let loanInfoSave = {};
    formKeys.map(formKey => {
        const partFormData = proxy.$refs[formKey].formData
        Object.assign(loanInfoSave, partFormData)
    })

    let loanVoucherList = ref([]);
    proxy.$refs['basicInfoRef'].ids.forEach(element => {
        loanVoucherList.value.push({
            voucherId:element
        })
    });


    // loanInfoSave.loanVoucherList = loanInfo.value.voucherList.filter((ele)=>{
    //     return proxy.$refs['basicInfoRef'].ids.indexOf(ele.voucherId) >-1 
    // })
    // loanInfoSave.loanVoucherList = loanVoucherList.value;
    loanInfoSave.loanVoucherList = loanInfo.value.voucherList;
    loanInfoSave.status = statusFlag;
    loanInfoSave.contractId = loanInfo.value.contractId;
    loanInfoSave.debtId = Number(debtId.value);
	loanInfoSave.id = Number(debtId.value);
	loanInfoSave.flowId = proxy.$refs['flowSearchRef'].formData.flowId;
	loanInfoSave.userIds = proxy.$refs['flowSearchRef'].formData.userIds;
	loanInfoSave.loanCurrency = loanInfo.value.contract.otherCurrencyType;

    console.log(loanInfoSave);
    if (!loanInfo.value.loan) {
        //新增
        addLoan(loanInfoSave).then(response => {
            proxy.$modal.msgSuccess("新增成功");
            loading.value = false;
            closePage()
        });
    } else {
        //修改
        //修改
        updateLoan(loanInfoSave).then(response => {
            proxy.$modal.msgSuccess("新增成功");
            loading.value = false;
            closePage()
        });
    }
}


function closePage() {
    const obj = { path: "/debt/loan/basic/index", query: { t: Date.now(), pageNum: history.state.pageNum } };
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
  