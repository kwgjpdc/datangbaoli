<template>
    <div class="app-container" v-loading="loading" ref="appContainerView">
        <div class="content">
            <div class="operate-button">
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
                <basic-info id="basicInfo" :loanInfo="loanInfo" ref="basicInfoRef" :loanId="loanId"
                    :routerQueryObj="routerQueryObj"></basic-info>
            </div>

        </div>

    </div>
</template>
<script setup>
import { getResult, addResult, updateResult } from "@/api/debt/result.js"
import basicInfo from './allocResBasicInfo.vue'
const { proxy } = getCurrentInstance();
const loanId = ref("");
const route = useRoute();
const router = useRouter();
const loading = ref(false);
const data = reactive({
    loanInfo: {
        "createBy": null,
        "createById": null,
        "createTime": null,
        "updateBy": null,
        "updateById": null,
        "updateTime": null,
        "delFlag": null,
        "remark": null,
        "id": null,
        "loanNo": null,
        "contractId": null,
        "debtId": null,
        "documentType": null,
        "loanCurrency": null,
        "applyNotAcceptAmount": null,
        "mostLoanAmount": null,
        "chargeInterestWay": null,
        "loanWay": "",
        "settleInterestWay": null,
        "interestDeduction": "",
        "feeDeduction": "",
        "invoiceNumber": null,
        "strikeRate": null,
        "gracePeriodInterestRate": null,
        "gracePeriodInterestDay": null,
        "factoringTarget": null,
        "interest": null,
        "loanExpectDate": null,
        "loanExpireDate": null,
        "isDirect": null,
        "directName": null,
        "directBank": null,
        "directAccount": null,
        "transferStart": null,
        "transferEnd": null,
        "transferAmount": null,
        "paymentAccount": "",
        "actualAmountReceived": null,
        "loanAmountApply": null,
        "comprehensiveIncome": null,
        "status": null,
        "loanVoucherList": [],
        "accountList": [],
        "commonFileList": [],
        "contractNo": null,
        "bussProduct": "",
        "factoringApplicantName": "",
        "loanResult":null
    },       

});
const { loanInfo } = toRefs(data);
let routerQueryObj = ref({});
watch(route, (newRoute) => {
    loanId.value = history.state && history.state.loanId;
    routerQueryObj.value.viewFlag = history.state && history.state.viewFlag;
}, { immediate: true });
/** 修改的时候查询客户基本信息列表 */
function getProjInfoPage() {
    if (loanId.value) {
        loading.value = true;
        getResult(loanId.value).then(response => {
			let dataArray = response.data;
			let fundList = [];
			let fundDrawInfoVoList = dataArray.fundDrawInfoVoList;
			for(var i in fundDrawInfoVoList){
				let item = fundDrawInfoVoList[i];
				if(item){
					let msg = {
						fundPoolNo:item.fundNo,
						fundNo:item.drawNo,
						fundResource:item.fundResource,
						fundAmount:item.amount,
						relatedAmount:item.availableAmount,
						dueDate:item.endDate,
						fundId: item.fundId,
						fundDrawId: item.fundDrawId
					}
					fundList.push(msg);
				}
			}
			dataArray.fundList = fundList;
			// console.log(dataArray)
            loanInfo.value = dataArray;//response.data;
            loading.value = false;
        });
    }
}
// 表单验证

function submitForm(statusFlag) {
    if (statusFlag != 1) {
        const basicInfoRefForm = new Promise((resolve, reject) => {
            proxy.$refs['basicInfoRef'].$refs['elForm'].validate(valid => {
                valid ? resolve(valid) : reject(valid)

            })
        })
        Promise.all([basicInfoRefForm]).then(() => {
            saveFormData(statusFlag)
        })
    } else {
         // 暂存不需要校验；
        saveFormData(statusFlag)
    }


}

function saveFormData(statusFlag) {
   
    const formKeys = ['basicInfoRef'];
    let loanInfoSave = loanInfo.value;
    formKeys.map(formKey => {
        const partFormData = proxy.$refs[formKey].formData
        Object.assign(loanInfoSave, partFormData)
    })

    loanInfoSave.loanResult.status = statusFlag;
//    接口只需要 loanResult 部分 ；
// loanResult原来有值是修改 没值是新增；

    console.log(loanInfoSave);
    if (!loanInfoSave.loanResult.loanId) {
        //新增
        loanInfoSave.loanResult.loanId = loanInfoSave.id;
		loanInfoSave.loanResult.fkId = loanInfoSave.id;
        addResult(loanInfoSave.loanResult).then(response => {
            proxy.$modal.msgSuccess("新增成功");
            loading.value = false;
            closePage()
        });
    } else {
        //修改
        //修改
		loanInfoSave.loanResult.fkId = loanInfoSave.id;
        updateResult(loanInfoSave.loanResult).then(response => {
            proxy.$modal.msgSuccess("修改成功");
            loading.value = false;
            closePage()
        });
    }
}


function closePage() {
    const obj = { path: "/debt/result", query: { t: Date.now(), pageNum: history.state.pageNum } };
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
  