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
                <basic-info id="basicInfo" :entryInfo="entryInfo" ref="basicInfoRef" :entryId="entryId"
                    :routerQueryObj="routerQueryObj"></basic-info>
            </div>

        </div>

    </div>
</template>
<script setup>
import { getEntry, addEntry, updateEntry } from "@/api/debt/entry.js"
import basicInfo from './entryBasicInfo.vue'
const { proxy } = getCurrentInstance();
const entryId = ref("");
const route = useRoute();
const router = useRouter();
const loading = ref(false);
const data = reactive({
    entryInfo: {
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
        "loanResult": null
    },

});
const { entryInfo } = toRefs(data);
let routerQueryObj = ref({});
watch(route, (newRoute) => {
    entryId.value = history.state && history.state.entryId;
    routerQueryObj.value.viewFlag = history.state && history.state.viewFlag;
}, { immediate: true });
/** 修改的时候查询客户基本信息列表 */
function getProjInfoPage() {
    if (entryId.value) {
        loading.value = true;
        getEntry(entryId.value).then(response => {
            entryInfo.value = response.data;
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
    let entryInfoSave = entryInfo.value;
    formKeys.map(formKey => {
        const partFormData = proxy.$refs[formKey].formData
        Object.assign(entryInfoSave, partFormData)
    })


    entryInfoSave.entryList[0].status = statusFlag;
    entryInfoSave.entryList[0].loanId = entryInfo.value.loanId;
    //    接口只需要 loanResult 部分 ；
    // loanResult原来有值是修改 没值是新增；


    if (entryInfoSave.entryList[0].entryItem && entryInfoSave.entryList[0].entryItem.length) {
        entryInfoSave.entryList[0].entryItem = entryInfoSave.entryList[0].entryItem.join(',')
    } else {
        entryInfoSave.entryList[0].entryItem = "";
    }
    console.log(entryInfoSave);
    if (!entryInfoSave.entryList[0].id) {
        //新增
        addEntry(entryInfoSave.entryList[0]).then(response => {
            proxy.$modal.msgSuccess("新增成功");
            loading.value = false;
            closePage()
        });
    } else {
        //修改
        updateEntry(entryInfoSave.entryList[0]).then(response => {
            proxy.$modal.msgSuccess("修改成功");
            loading.value = false;
            closePage()
        });
    }
}


function closePage() {
    const obj = { path: "/debt/entry/basic/index", query: { t: Date.now(), pageNum: history.state.pageNum } };
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
  