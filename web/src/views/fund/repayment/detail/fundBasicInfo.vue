<template>
    <div>
        <el-row :gutter="15" justify="center">
            <el-col :span="24" :xs="24">
                <el-form ref="elForm" :model="formData" :rules="rules" label-width="140px" :inline="true"
                    v-loading="loading" :disabled="props.routerQueryObj.viewFlag">



                    <el-collapse v-model="activeNames" @change="handleChange">





                        <el-collapse-item title="基本信息" name="1">

                            <el-card class="box-card">
                                <!-- contractId -->
                                <el-form-item label="资金池编号" prop="fundNo">
                                    <template #default="scope">
                                        <el-input v-model="formData.fundNo" 
                                        placeholder="请选择资金池编号"
                        suffix-icon="el-icon-search"
                        readonly
                        @click="openFundIdDialog(scope.row)" 
                                            :style="{ width: '240px' }"  ></el-input>
                                        </template>
                                </el-form-item>
                                <el-form-item label="资金来源" prop="fundResource">
                                    <el-select v-model="formData.fundResource" filterable placeholder="请选择"
                                        :style="{ width: '240px' }" disabled>
                                        <el-option v-for="item in fund_resource" :key="item.value"
                                            :label="item.label" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="资金编号" prop="payNo">
                                    <div >
                                        <el-input v-model="formData.payNo"  disabled
                                            :style="{ width: '240px' }" placeholder="请输入资金编号" ></el-input>
                                    </div>
                                </el-form-item>
                                <el-form-item label="资金池到期日" prop="poolEndDate">
                                <el-date-picker disabled v-model="formData.poolEndDate" type="date"
                                    value-format="YYYY-MM-DD" placeholder="请选择到期日" :style="{ width: '240px' }">
                                </el-date-picker>

                            </el-form-item>
                            <el-form-item label="资金池总金额(元)" prop="poolAmount">
                                <div >
									<ElPriceInput v-model:form="formData" prop="poolAmount" :disabled="true" :width="240" :placeholder="'请输入资金池总金额'"></ElPriceInput>
<!-- 									<el-input v-model="formData.poolAmount"  disabled
										:style="{ width: '240px' }"  placeholder="请输入资金池总金额"></el-input> -->
								</div>
                            </el-form-item>
                            <el-form-item label="资金池可用余额(元)" prop="poolRemainAmount">
                                <div >
									<ElPriceInput v-model:form="formData" prop="poolRemainAmount" :disabled="true" :width="240" :placeholder="'请输入资金池可用余额'"></ElPriceInput>
<!-- 									<el-input v-model="formData.poolRemainAmount"  disabled
										:style="{ width: '240px' }" placeholder="请输入资金池可用余额" ></el-input> -->
								</div>
                                </el-form-item>
                            </el-card>

                        </el-collapse-item>

                        <el-collapse-item title="资金来源信息" name="2">
                            <el-card class="box-card">
                                <el-form-item label="银行代号" prop="bankCode">
                                    <div >
                                        <el-input v-model="formData.bankCode"  clearable
                                            :style="{ width: '240px' }" placeholder="请输入银行代号" maxlength="32"></el-input>
                                    </div>
                                </el-form-item>
                                <el-form-item label="银行名称" prop="bankName">
                                    <div >
                                        <el-input v-model="formData.bankName"  clearable
                                            :style="{ width: '240px' }" placeholder="请输入银行名称" maxlength="32" ></el-input>
                                    </div>

                                </el-form-item>
                            </el-card>
                        </el-collapse-item>

                        <el-collapse-item title="资金合同信息" name="3">
                            <el-card class="box-card">
                                <el-form-item label="借款合同号" prop="contractNo">
                                    <div>
                                        <el-input v-model="formData.contractNo"  clearable
                                            :style="{ width: '240px' }" placeholder="请输入借款合同号" maxlength="32" oninput="value=value.replace(/[^0-9]/g,'')" ></el-input>
                                    </div>
                                </el-form-item>

                                <el-form-item label="授信品种" prop="creditType">
                                <el-select v-model="formData.creditType" filterable placeholder="请选择"
                                        :style="{ width: '240px' }">
                                        <el-option v-for="item in fund_credit_type" :key="item.value"
                                            :label="item.label" :value="item.value">
                                        </el-option>
                                    </el-select>
                            </el-form-item>

                            <el-form-item label="结息方式" prop="interestSettlement">
                                <el-select v-model="formData.interestSettlement" filterable placeholder="请选择"
                                        :style="{ width: '240px' }">
                                        <el-option v-for="item in fund_interest_settlement" :key="item.value"
                                            :label="item.label" :value="item.value">
                                        </el-option>
                                    </el-select>
                            </el-form-item>

                            <el-form-item label="借据号" prop="receiptCode">
                                    <div>
                                        <el-input v-model="formData.receiptCode"  clearable
                                            :style="{ width: '240px' }" placeholder="请输入借据号" maxlength="32" oninput="value=value.replace(/[^0-9]/g,'')"></el-input>
                                    </div>
                                </el-form-item>

                            <el-form-item label="提款账号" prop="account">
                                <div>
                                        <el-input v-model="formData.account"  clearable
                                            :style="{ width: '240px' }" placeholder="请输入提款账号" maxlength="32" oninput="value=value.replace(/[^0-9]/g,'')"></el-input>
                                    </div>
                            </el-form-item>

                            </el-card>
                        </el-collapse-item>
                        <el-collapse-item title="资金池信息" name="4">
                            <el-card class="box-card">

                                <el-form-item label="币种" prop="currencyType">
                                <el-select v-model="formData.currencyType" filterable placeholder="请选择"
                                        :style="{ width: '240px' }">
                                        <el-option v-for="item in sys_currency_type" :key="item.value"
                                            :label="item.label" :value="item.value">
                                        </el-option>
                                    </el-select>

                            </el-form-item>

                            <el-form-item label="资金金额 (元)" prop="amount">
                                <div >
									<ElPriceInput v-model:form="formData" prop="amount" :width="240" :placeholder="'请输入资金金额'"></ElPriceInput>
<!-- 									<el-input v-model="formData.amount"  clearable
										:style="{ width: '240px' }" placeholder="请输入资金金额" ></el-input> -->
								</div>
                            </el-form-item>

                            <el-form-item label="资金余额 (元)" prop="remainAmount">
                                <div >
									<ElPriceInput v-model:form="formData" prop="remainAmount" :disabled="true" :width="240" :placeholder="'请输入资金余额'"></ElPriceInput>
<!-- 									<el-input v-model="formData.remainAmount"  disabled
										:style="{ width: '240px' }" placeholder="请输入资金余额" ></el-input> -->
								</div>
                            </el-form-item>


                            <el-form-item label="入账日" prop="startDate">
                                <el-date-picker clearable v-model="formData.startDate" type="date"
                                    value-format="YYYY-MM-DD" placeholder="请选择到期日" :style="{ width: '240px' }">
                                </el-date-picker>

                            </el-form-item>

                            <el-form-item label="到期日" prop="endDate">
                                <el-date-picker clearable v-model="formData.endDate" type="date"
                                    value-format="YYYY-MM-DD" placeholder="请选择到期日" :style="{ width: '240px' }">
                                </el-date-picker>

                            </el-form-item>

                            <el-form-item label="期限" prop="term">
                                <el-select v-model="formData.term" filterable placeholder="请选择"
                                        :style="{ width: '240px' }">
                                        <el-option v-for="item in fund_term" :key="item.value"
                                            :label="item.label" :value="item.value">
                                        </el-option>
                                    </el-select>

                            </el-form-item>

                            <el-form-item label="提款品种" prop="drawType">
                                <el-select v-model="formData.drawType" filterable placeholder="请选择"
                                        :style="{ width: '240px' }">
                                        <el-option v-for="item in fund_draw_type" :key="item.value"
                                            :label="item.label" :value="item.value">
                                        </el-option>
                                    </el-select>

                            </el-form-item>

                        </el-card>
                        </el-collapse-item>

                        <el-collapse-item title="资金成本" name="5">
                            <el-card class="box-card">
                                <el-form-item label="综合成本率(%)" prop="costRate">
                                <div>
                                        <el-input v-model="formData.costRate"  clearable oninput="value=value.replace(/[^0-9]/g,'')"
                                            :style="{ width: '240px' }" placeholder="请输入综合成本率" maxlength="32" ></el-input>
                                </div>
                                </el-form-item>

                                <el-form-item label="利率(%)" prop="interestRate">
                                <div>
                                        <el-input v-model="formData.interestRate"  clearable oninput="value=value.replace(/[^0-9]/g,'')"
                                            :style="{ width: '240px' }" placeholder="请输入利率" maxlength="32" ></el-input>
                                </div>
                                </el-form-item>

                                <el-form-item label="起息日" prop="interestStartDate">
                                <el-date-picker clearable v-model="formData.interestStartDate" type="date"
                                    value-format="YYYY-MM-DD" placeholder="请选择到期日" :style="{ width: '240px' }">
                                </el-date-picker>
                                </el-form-item>

                                <el-form-item label="变更后利率(%)" prop="interestRateChanged">
                                <div>
                                        <el-input v-model="formData.interestRateChanged"  clearable oninput="value=value.replace(/[^0-9]/g,'')"
                                            :style="{ width: '240px' }" placeholder="请输入变更后利率" ></el-input>
                                </div>
                                </el-form-item>

                                <el-form-item label="费用成本(元）" prop="feeCost">
                                <div>
									<ElPriceInput v-model:form="formData" prop="feeCost" :width="240" :placeholder="'请输入费用成本'"></ElPriceInput>
<!-- 									<el-input v-model="formData.feeCost"  clearable
										:style="{ width: '240px' }" placeholder="请输入费用成本" ></el-input> -->
                                </div>
                                </el-form-item>

                                <el-form-item label="备注" prop="remark">
                                <div>
                                        <el-input v-model="formData.remark"  clearable
                                            :style="{ width: '240px' }" placeholder="请输入备注"  maxlength="255"></el-input>
                                </div>
                                </el-form-item>

                            </el-card>
                        </el-collapse-item>
                    </el-collapse>

                </el-form>
            </el-col>
        </el-row>
        <DialogTableMulti 
            v-model:multiQuery="multiQuery" 
            v-model:open="multiQuery.open" 
            v-model:tableData="tableDataMulti"
            v-model:prop="propMulti" 
            @selectRow="selectRowMulti" 
            @pageChange="pageChangeMulti"
        />
    </div>
</template>
<script setup>
import { reactive, ref } from "vue";
const { proxy } = getCurrentInstance();
import { listFundPoolInfo } from "@/api/fund/info";
import { getContList } from "@/api/debt/info"
import { listInfo as getUserList } from "@/api/customer/index"
import { deepClone } from "@/utils/index"
const props = defineProps({
    debtInfo: {
        type: Object,
        default: null,
    },
    // 新增为空
    debtId: {
        type: String,
        default: "",
    },
    routerQueryObj: {
        type: Object,
        default: null,
    }

});

const activeNames = ref(['1', '2', '3', '4', '5']);//tab打开状态
const loading = ref(false);
const dataScope = reactive({
    rules:
    {
        interestSettlement: [
            { required: true, message: "结息方式不能为空", trigger: "change" }
        ],
        account: [
            { required: true, message: "提款账号不能为空", trigger: "change" }
        ],
        amount: [
            { required: true, message: "资金金额不能为空", trigger: "change" }
        ],
        startDate: [
            { required: true, message: "入账日不能为空", trigger: "change" }
        ],
        endDate: [
            { required: true, message: "到期日不能为空", trigger: "change" }
        ],
        term: [
            { required: true, message: "期限不能为空", trigger: "change" }
        ],
        drawType: [
            { required: true, message: "提款品种不能为空", trigger: "change" }
        ],
        costRate: [
            { required: true, message: "综合成本率不能为空", trigger: "change" }
        ],
        interestRate: [
            { required: true, message: "利率不能为空", trigger: "change" }
        ],
        interestStartDate: [
            { required: true, message: "起息日不能为空", trigger: "change" }
        ],
        feeCost: [
            { required: true, message: "费用成本不能为空", trigger: "change" }
        ],
    },//验证规律
    formDataPiliang: {
        factoringApplicantNo: null,
        factoringApplicantName: null,
        invoiceDate: null,
        dueDate: null,
        voucherProviderNo: null,
        voucherProviderName: null,
    }
});

const { rules, formDataPiliang } = toRefs(dataScope);


const { sys_currency_type, proj_dd_type, lend_buss_product, fund_resource, fund_if_cycle, fund_credit_type, fund_interest_settlement, fund_account_type, fund_term, fund_draw_type } = proxy.useDict("sys_currency_type", "proj_dd_type", "lend_buss_product", "fund_resource", "fund_if_cycle", "fund_credit_type", "fund_interest_settlement", "fund_account_type", "fund_term", "fund_draw_type");//下拉框字典

let formData = ref({
            "createBy": null,
            "createById": null,
            "createTime": null,
            "updateBy": null,
            "updateById": null,
            "updateTime": null,
            "delFlag": null,
            "fundId": null,
            "fundResource": "",
            "payNo": "",
            "bankCode": "",
            "bankName": "",
            "contractNo": "",
            "creditType": "",
            "interestSettlement": "",
            "receiptCode": "",
            "accountType": "",
            "account": "",
            "currencyType": "",
            "amount": null,
            "remainAmount": null,
            "startDate": null,
            "endDate": null,
            "term": "",
            "drawType": "",
            "costRate": null,
            "interestRate": null,
            "interestStartDate": null,
            "interestRateChanged": null,
            "feeCost": null,
            "remark": "",
            "status": "",
            "commonFileList": [],
            "poolEndDate": null,
            "poolAmount": null,
            "poolRemainAmount": null
});//不能修改const 定义的数据

watch(() => formData.value.amount, (newValue) => {
    const total = formData.value.poolRemainAmount ? parseFloat(formData.value.poolRemainAmount) : 0;
    formData.value.remainAmount =  total + (formData.value.amount ? parseFloat(formData.value.amount) : 0);
});

watch(() => formData.value.poolRemainAmount, (newValue) => {
    const total = formData.value.poolRemainAmount ? parseFloat(formData.value.poolRemainAmount) : 0;
    formData.value.remainAmount =  total + (formData.value.amount ? parseFloat(formData.value.amount) : 0);
});

watch(() => props.debtInfo, (newValue, oldValue) => {
    console.log(newValue);
    if (newValue) {
        formData.value = deepClone(newValue);
        delete formData.value.commonFileList;
    }
}, { immediate: true, deep: true })


watch(() => formDataPiliang.value.factoringApplicantNo, (newValue, oldValue) => {
    formData.value.voucherList.forEach((item) => {
        item.factoringApplicantNo = newValue;
        item.factoringApplicantName = formDataPiliang.value.factoringApplicantName;

    })
}, { deep: true })
watch(() => formDataPiliang.value.voucherProviderNo, (newValue, oldValue) => {
    formData.value.voucherList.forEach((item) => {
        item.voucherProviderNo = newValue;
        item.voucherProviderName = formDataPiliang.value.voucherProviderName;

    })
}, { deep: true })
watch(() => formDataPiliang.value.invoiceDate, (newValue, oldValue) => {
    formData.value.voucherList.forEach((item) => {
        item.invoiceDate = newValue;

    })
}, { deep: true })
watch(() => formDataPiliang.value.dueDate, (newValue, oldValue) => {
    formData.value.voucherList.forEach((item) => {
        item.dueDate = newValue;
    })
}, { deep: true })


function handleChange(val) {
    console.log(val);
}

// 表单验证
function validForm() {
    let result = false
    proxy.$refs['elForm'].validate((valid) => { console.log(valid); result = valid })
    return result
}


// 用户组件请求信息
const userParams = ref({
    pageNum: 1,
    pageSize: 10,
})
const tableData = ref([]);
const tableDataCont = ref([]);
const tableDataUser = ref([]);
let totalCont = ref([]);
let totalUser = ref([]);
let checkItem = ref("")
let updateItem = ref(null);

function handleAddVoucherList() {

    formData.value.voucherList.push({
        indexCount: Math.random(),
        debtId: props.debtId,
        voucherId: null,
        factoringApplicantNo: null,
        factoringApplicantName: null,
        voucherNo: null,
        voucherAmount: null,
        debtReceivableAmount: null,
        invoiceDate: null,
        dueDate: null,
        voucherProviderNo: null,
        voucherProviderName: null,
        coalTon: null,
        price: null,
        loanRatio: null,
        financingRatio: null,
        isDiscount: null,
        discountAmount: null,
        remark: null,
        status: null,
        transferenceTime: null,
        transferenceStatus: null,
        createBy: null,
        createById: null,
        updateBy: null,
        updateById: null,
        delFlag: null,
        createTime: null,
        updateTime: null
    });
}


function handleDeleteVoucherList(rows) {
    const indexCount = rows ? [rows.voucherId ? rows.voucherId : rows.indexCount] : ids.value;
    let jugeItem = 'voucherId';
    if (!rows.voucherId) {
        jugeItem = 'indexCount';
    }
    indexCount.forEach((names) => {
        formData.value.voucherList = formData.value.voucherList.filter((item) => {
            return item[jugeItem] != names;
        })

    })
    single.value = false;
    multiple.value = false;
}


// Dialog配置
let multiQuery = reactive({
    title: "资金池信息",
    open: false,
    currentPage: 1,
    total: 1,
    pageSize: 10
});
const tableDataMulti = ref([]);
const paramsMulti = reactive({
    pageNum: 1,
    pageSize: 10,
});
const propMulti = reactive([
    {
        label: "资金池编号",
        value: "fundNo"
    }, 
    {
        label: "资金提供方",
        value: "provider"
    }
]);
const currentRow = ref({});
const selectRowMulti = (rows) => {
    console.log("9999999")
    console.log(rows.fundId)
    formData.value.fundNo = rows.fundNo;
    formData.value.fundId = rows.fundId;
    formData.value.poolEndDate = rows.endDate;
    formData.value.fundResource = rows.fundResource;
    formData.value.poolAmount = rows.totalAmount;
    formData.value.poolRemainAmount = rows.availableAmount;
};
const pageChangeMulti = (pageNum) => {
    loading.value = true;
    paramsMulti.pageNum = pageNum;
    listFundPoolInfo(paramsMulti).then(response => {
        console.log(response);
        tableDataMulti.value = response.rows;
        multiQuery.total = response.total;
        multiQuery.open = true;
        loading.value = false;
    });
};
const openFundIdDialog = (row) => {
    currentRow.value = row;
    if (!tableDataMulti.value.length) {
        loading.value = true;
        listFundPoolInfo(paramsMulti).then(response => {
            tableDataMulti.value = response.rows;
            multiQuery.total = response.total;
            multiQuery.open = true;
            loading.value = false;
        });
    } else {
        multiQuery.open = true;
    }
};

defineExpose({
    formData,
    validForm,
});

</script>
<style lang="scss">
.box-card {
    margin-bottom: 20px;
}

.page {
    margin-top: 10px;

}

.header-button-operate {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
}
</style>
  