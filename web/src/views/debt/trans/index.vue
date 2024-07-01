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
            <el-row :gutter="15" justify="center">
                <el-col :span="24" :xs="24">
                    <el-form ref="elForm" :model="debtInfo" :rules="rules" label-width="140px" :inline="true"
                        v-loading="loading" :disabled="routerQueryObj.viewFlag">



                        <el-card class="box-card">
                            <template #header>
                                <span>凭证转让</span>
                            </template>
                            <el-form-item label="总凭证笔数" prop="contractNo">

                                <el-input v-model="debtInfo.contractNo" placeholder="请选择业务合同号" clearable
                                    :style="{ width: '240px' }" disabled suffix-icon="el-icon-search"></el-input>


                            </el-form-item>
                            <el-form-item label="总应收账款金额" prop="contractName">
                                <el-input v-model="debtInfo.contractName" clearable :style="{ width: '240px' }"
                                    disabled></el-input>

                            </el-form-item>
                            <el-form-item label="本次扣款总金额" prop="coreEnterpriseName">
                                <el-input v-model="debtInfo.coreEnterpriseName" clearable :style="{ width: '240px' }"
                                    disabled></el-input>


                            </el-form-item>

                            <el-table v-loading="loading" :data="debtInfo.voucherList"
                                @selection-change="handleSelectionChange" style="margin-bottom: 50px;margin-top: 30px;">
                                <!-- <el-table-column type="selection" width="55" align="center" /> -->

                                <el-table-column label="序号" align="center" type="index" width="60" fixed />
                                <!-- <el-table-column label="oss上文件存储地址" align="center" prop="fileUrl" /> -->
                                <!-- factoringApplicantNo -->
                                <el-table-column label="账号类型" align="center" prop="factoringApplicantName">

                                </el-table-column>
                                <el-table-column label="收支对象名称" align="center" prop="factoringApplicantName" />
                                <el-table-column label="收支账号" align="center" prop="factoringApplicantName" />
                                <el-table-column label="收支金额" align="center" prop="factoringApplicantName" />
                            </el-table>

                            <el-form-item label="批量修改"></el-form-item>
                            <el-form-item label="融资比例（%）" prop="financingRatio">
                                <el-input v-model="financingRatio" clearable :style="{ width: '240px' }"></el-input>


                            </el-form-item>
                            <el-form-item label="本次转让是否有折让" prop="isDiscount">
                                <el-checkbox v-model="isDiscount" true-label="Y" false-label="N"></el-checkbox>
                            </el-form-item>


                            <el-table v-loading="loading" :data="debtInfo.voucherList"
                                @selection-change="handleSelectionChange" style="margin-bottom: 30px;margin-top: 30px;">
                                <!-- <el-table-column type="selection" width="55" align="center" /> -->

                                <el-table-column label="序号" align="center" type="index" width="60" fixed />
                                <!-- <el-table-column label="oss上文件存储地址" align="center" prop="fileUrl" /> -->
                                <!-- factoringApplicantNo -->
                                <el-table-column label="保理申请人" align="center" prop="factoringApplicantName" width="300"
                                    fixed>
                                    <template #default="scope">
                                        <div @click="openDiag('factoringApplicantName', scope.row)">
                                            <el-input v-model="scope.row.factoringApplicantName" placeholder="请选择保理申请人"
                                                clearable :style="{ width: '240px' }" readonly
                                                suffix-icon="el-icon-search"></el-input>
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column label="凭证号码" align="center" prop="voucherNo" width="300">
                                    <template #default="scope">
                                        <el-input v-model="scope.row.voucherNo" placeholder="请输入" clearable
                                            :style="{ width: '240px' }" />
                                    </template>
                                </el-table-column>
                                <el-table-column label="凭证金额" align="center" prop="voucherAmount" width="300">
                                    <template #default="scope">
                                        <el-input v-model="scope.row.voucherAmount" placeholder="请输入" clearable
                                            :style="{ width: '240px' }" />
                                    </template>
                                </el-table-column>
                                <el-table-column label="应收账款金额" align="center" prop="debtReceivableAmount" width="300">
                                    <template #default="scope">
                                        <el-input v-model="scope.row.debtReceivableAmount" placeholder="请输入" clearable
                                            :style="{ width: '240px' }" />
                                    </template>
                                </el-table-column>
                                <el-table-column label="融资比例" align="center" prop="financingRatio" width="300">
                                    <template #default="scope">
                                        <el-input v-model="scope.row.financingRatio" placeholder="请输入" clearable
                                            :style="{ width: '240px' }" />
                                    </template>
                                </el-table-column>


                                <el-table-column label="折让金额" align="center" prop="discountAmount" width="300"
                                    v-if="isDiscount == 'Y'">
                                    <template #default="scope">
                                        <el-input v-model="scope.row.discountAmount" placeholder="请输入" clearable
                                            type="number" :style="{ width: '240px' }" />
                                    </template>
                                </el-table-column>
                                <el-table-column label="开票日" align="center" prop="invoiceDate" width="300">
                                    <template #default="scope">
                                        <el-date-picker clearable v-model="scope.row.invoiceDate" type="date"
                                            value-format="YYYY-MM-DD" placeholder="请选择开票日" :style="{ width: '240px' }">
                                        </el-date-picker>
                                    </template>
                                </el-table-column>
                                <el-table-column label="到期日" align="center" prop="baseContractEndDate" width="300">
                                    <template #default="scope">
                                        <el-date-picker clearable v-model="scope.row.baseContractEndDate" type="date"
                                            value-format="YYYY-MM-DD" placeholder="请选择到期日" :style="{ width: '240px' }">
                                        </el-date-picker>
                                    </template>
                                </el-table-column>


                                <!-- voucherProviderNo -->
                                <el-table-column label="凭证提供方" align="center" prop="voucherProviderName" width="300">
                                    <template #default="scope">
                                        <div @click="openDiag('voucherProviderName', scope.row)">
                                            <el-input v-model="scope.row.voucherProviderName" placeholder="请选择凭证提供方"
                                                clearable :style="{ width: '240px' }" readonly
                                                suffix-icon="el-icon-search"></el-input>
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column label="煤炭吨数" align="center" prop="coalTon" width="300">
                                    <template #default="scope">
                                        <el-input v-model="scope.row.coalTon" placeholder="请输入" clearable
                                            :style="{ width: '240px' }" />
                                    </template>
                                </el-table-column>

                                <el-table-column label="单价(元/吨)" align="center" prop="price" min-width="300">
                                    <template #default="scope">
                                        <el-input v-model="scope.row.price" placeholder="请输入" clearable
                                            :style="{ width: '240px' }" />
                                    </template>
                                </el-table-column>
                                <el-table-column label="备注" align="center" prop="remark" min-width="300">
                                    <template #default="scope">
                                        <el-input v-model="scope.row.remark" placeholder="请输入" clearable type="textarea"
                                            :style="{ width: '240px' }" />
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-card>
                    </el-form>
                </el-col>
            </el-row>
        </div>




    </div>
</template>
<script setup>
import { getferenceDebtInfo, addDebtInfo, transferenceDebtInfo } from "@/api/debt/info.js"

const { proxy } = getCurrentInstance();
const debtId = ref("");
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
        "commonFileList": [],

    },       //客户信息

});
const { debtInfo } = toRefs(data);
let routerQueryObj = ref({});
watch(route, (newRoute) => {
    routerQueryObj.value.viewFlag = history.state && history.state.viewFlag;
    debtId.value = history.state && history.state.debtId;
    routerQueryObj.value.pageNum = history.state && history.state.pageNum;
}, { immediate: true });
/** 修改的时候查询客户基本信息列表 */
function getferenceDebtInfoPage() {
    if (debtId.value) {
        loading.value = true;
        getferenceDebtInfo(debtId.value).then(response => {
            debtInfo.value = response.data;
            loading.value = false;
        });
    }
}
// 表单验证

let financingRatio = ref("");
watch(() => financingRatio.value, (newValue, oldValue) => {
    debtInfo.value.voucherList.forEach((item) => {
        item.financingRatio = newValue;
    })
}, { deep: true })

let isDiscount = ref("N");
watch(() => isDiscount.value, (newValue, oldValue) => {
    debtInfo.value.voucherList.forEach((item) => {
        item.isDiscount = newValue;
        if (newValue == 'N') {
            item.discountAmount = null;
        }
    })
}, { deep: true })

function submitForm(statusFlag) {

    let voucherListValidate = true;
    debtInfo.value.voucherList.forEach((item) => {
        if (!item.factoringApplicantNo) voucherListValidate = false;
    })

    if (!voucherListValidate) {
        proxy.$modal.msgError('请检查应收账款管理数据保理申请人是否为空！');
        return;
    }
    // debtInfo.value.transferenceStatus = statusFlag;
    let params = {};
    params.transferenceStatus = statusFlag;
    debtInfo.value.params = params;
    //修改
    transferenceDebtInfo(debtInfo.value).then(response => {
        proxy.$modal.msgSuccess("保存成功");
        loading.value = false;
        if (statusFlag == 2) {
            toTransRestultPage()
        } else {
            closePage()
        }
    });

}
function toTransRestultPage() {
    router.push({ name: 'Debt/trans/result', state: { debtId: debtId.value, pageNum: routerQueryObj.value.pageNum } });
}
function closePage() {
    const obj = { path: "/debt/info", query: { t: Date.now(), pageNum: routerQueryObj.value.pageNum } };
    proxy.$tab.closeOpenPage(obj);
}


getferenceDebtInfoPage();


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
  