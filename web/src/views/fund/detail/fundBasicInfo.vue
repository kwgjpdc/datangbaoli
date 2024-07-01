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
                                    <div >
                                        <el-input v-model="formData.fundNo" placeholder="系统自动生成" disabled
                                            :style="{ width: '240px' }"  ></el-input>
                                    </div>

                                </el-form-item>
                                <el-form-item label="资金来源" prop="fundResource">
                                    <el-select v-model="formData.fundResource" filterable placeholder="请选择"
                                        :style="{ width: '240px' }">
                                        <el-option v-for="item in fund_resource" :key="item.value"
                                            :label="item.label" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-card>
                        </el-collapse-item>

                        <el-collapse-item v-if="formData.fundResource === '3' || formData.fundResource === '4'|| formData.fundResource === '5'" title="资金池来源信息" name="2">
                            <el-card class="box-card">
                                <el-form-item label="资金提供方" prop="provider">
                                    <el-select v-model="formData.provider" filterable placeholder="请选择资金提供方"
                                        :style="{ width: '240px' }">
                                        <el-option v-for="item in fund_provider" :key="item.value"
                                            :label="item.label" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item  v-if="formData.provider === '1'" label="银行代号" prop="providerCode">
                                    <div >
                                        <el-input v-model="formData.providerCode" placeholder="请输入银行代号" clearable maxlength="32"
                                            :style="{ width: '240px' }"  ></el-input>
                                    </div>
                                </el-form-item>

                                <el-form-item v-if="formData.provider === '1'" label="银行名称" prop="providerName">
                                    <div >
                                        <el-input v-model="formData.providerName" placeholder="请输入银行名称" clearable maxlength="32"
                                            :style="{ width: '240px' }"  ></el-input>
                                    </div>
                                </el-form-item>
                                <el-form-item v-if="formData.provider === '1'" label="银行社会信用代码" prop="providerNcCode">
                                    <div >
                                        <el-input v-model="formData.providerNcCode" placeholder="请输入银行社会信用代码" clearable maxlength="32"
                                            :style="{ width: '240px' }"  ></el-input>
                                    </div>
                                </el-form-item>

                                <el-form-item  v-if="formData.provider === '2'" label="集团内部单位名称" prop="providerName">
                                    <div >
                                        <el-input v-model="formData.providerName" placeholder="请输入集团内部单位名称" clearable maxlength="32"
                                            :style="{ width: '240px' }"  ></el-input>
                                    </div>
                                </el-form-item>

                                <el-form-item v-if="formData.provider === '2'" label="NC供应商编码" prop="providerNcCode">
                                    <div >
                                        <el-input v-model="formData.providerNcCode" placeholder="请输入NC供应商编码" clearable maxlength="32"
                                            :style="{ width: '240px' }"  ></el-input>
                                    </div>
                                </el-form-item>

                                <el-form-item  v-if="formData.provider === '3'" label="保理商代号" prop="providerCode">
                                    <div >
                                        <el-input v-model="formData.providerCode" placeholder="请输入保理商代号" clearable maxlength="32"
                                            :style="{ width: '240px' }"  ></el-input>
                                    </div>
                                </el-form-item>

                                <el-form-item v-if="formData.provider === '3'" label="保理商名称" prop="providerName">
                                    <div >
                                        <el-input v-model="formData.providerName" placeholder="请输入保理商名称" clearable maxlength="32"
                                            :style="{ width: '240px' }"  ></el-input>
                                    </div>
                                </el-form-item>
                                <el-form-item v-if="formData.provider === '3'" label="NC供应商编码" prop="providerNcCode">
                                    <div >
                                        <el-input v-model="formData.providerNcCode" placeholder="请输入NC供应商编码" clearable maxlength="32"
                                            :style="{ width: '240px' }"  ></el-input>
                                    </div>
                                </el-form-item>

                                <el-form-item  v-if="formData.provider === '4'" label="客户编号" prop="providerCode">
                                    <div >
                                        <el-input v-model="formData.providerCode" placeholder="请输入客户编号" clearable maxlength="32"
                                            :style="{ width: '240px' }"  ></el-input>
                                    </div>
                                </el-form-item>

                                <el-form-item v-if="formData.provider === '4'" label="客户名称" prop="providerName">
                                    <div >
                                        <el-input v-model="formData.providerName" placeholder="请输入客户名称" clearable maxlength="32"
                                            :style="{ width: '240px' }"  ></el-input>
                                    </div>
                                </el-form-item>
                                <el-form-item v-if="formData.provider === '4'" label="NC供应商编码" prop="providerNcCode">
                                    <div >
                                        <el-input v-model="formData.providerNcCode" placeholder="请输入NC供应商编码" clearable maxlength="32"
                                            :style="{ width: '240px' }"  ></el-input>
                                    </div>
                                </el-form-item>

                                <el-form-item  v-if="formData.provider === '5'" label="资金提供方名称" prop="providerName">
                                    <div >
                                        <el-input v-model="formData.providerName" placeholder="请输入资金提供方名称" clearable maxlength="32"
                                            :style="{ width: '240px' }"  ></el-input>
                                    </div>
                                </el-form-item>

                                <el-form-item v-if="formData.provider === '5'" label="NC供应商编码" prop="providerNcCode">
                                    <div >
                                        <el-input v-model="formData.providerNcCode" placeholder="请输入NC供应商编码" clearable maxlength="32"
                                            :style="{ width: '240px' }"  ></el-input>
                                    </div>
                                </el-form-item>

                                <el-form-item  v-if="formData.provider === '6'" label="委托人名称" prop="providerName">
                                    <div >
                                        <el-input v-model="formData.providerName" placeholder="请输入委托人名称" clearable maxlength="32"
                                            :style="{ width: '240px' }"  ></el-input>
                                    </div>
                                </el-form-item>

                                <el-form-item v-if="formData.provider === '6'" label="NC供应商编码" prop="providerNcCode">
                                    <div >
                                        <el-input v-model="formData.providerNcCode" placeholder="请输入NC供应商编码" clearable maxlength="32"
                                            :style="{ width: '240px' }"  ></el-input>
                                    </div>
                                </el-form-item>

                                <el-form-item  v-if="formData.provider === '7'" label="股东名称" prop="providerName">
                                    <div >
                                        <el-input v-model="formData.providerName" placeholder="请输入股东名称" clearable maxlength="32"
                                            :style="{ width: '240px' }"  ></el-input>
                                    </div>
                                </el-form-item>

                                <el-form-item v-if="formData.provider === '7'" label="NC供应商编码" prop="providerNcCode">
                                    <div >
                                        <el-input v-model="formData.providerNcCode" placeholder="请输入NC供应商编码" clearable maxlength="32"
                                            :style="{ width: '240px' }"  ></el-input>
                                    </div>
                                </el-form-item>
                            </el-card>
                        </el-collapse-item>

                        <el-collapse-item v-if="formData.fundResource === '3' || formData.fundResource === '4'" title="资金合同信息" name="3">
                            <el-card class="box-card">
                                <el-form-item label="借款合同号" prop="contractNo">
                                    <div >
                                        <el-input v-model="formData.contractNo" clearable maxlength="32" placeholder="请输入借款合同号"
                                            :style="{ width: '240px' }"  ></el-input>
                                    </div>
                                </el-form-item>

                                <el-form-item label="授信品种" prop="creditType">
                                    <el-select v-model="formData.creditType" filterable placeholder="请选择授信品种"
                                        :style="{ width: '240px' }">
                                        <el-option v-for="item in fund_credit_type" :key="item.value"
                                            :label="item.label" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-card>
                        </el-collapse-item>

                        <el-collapse-item title="资金池信息" name="4">
                            <el-card class="box-card">
                            <el-form-item label="是否可循环使用" prop="fundIfCycle">
                                <el-select v-model="formData.fundIfCycle" filterable placeholder="请选择是否可循环使用"
                                        :style="{ width: '240px' }">
                                        <el-option v-for="item in fund_if_cycle" :key="item.value"
                                            :label="item.label" :value="item.value">
                                        </el-option>
                                    </el-select>
                            </el-form-item>


                            <el-form-item label="币种" prop="currencyType">
                                <el-select v-model="formData.currencyType" filterable placeholder="请选择币种"
                                        :style="{ width: '240px' }">
                                        <el-option v-for="item in sys_currency_type" :key="item.value"
                                            :label="item.label" :value="item.value">
                                        </el-option>
                                    </el-select>

                            </el-form-item>
                            <el-form-item label="资全池总金额(元)" prop="totalAmount" >
								<ElPriceInput v-model:form="formData" prop="totalAmount" :width="240" :rules="rules"
								  :disabled="props.routerQueryObj.viewFlag" :placeholder="'请输入资全池总金额'"></ElPriceInput>
                                <!-- <div >
                                        <el-input v-model="formData.totalAmount"  clearable type="Number"
                                            :style="{ width: '240px' }"  ></el-input>
                                    </div> -->
                            </el-form-item>

                            <el-form-item label="已使用金额 (元)" prop="usedAmount">
								<ElPriceInput v-model:form="formData" prop="usedAmount" :width="240" :rules="rules"
								  :disabled="true" :placeholder="'请输入已使用金额'"></ElPriceInput>
                                <!-- <div >
                                        <el-input v-model="formData.usedAmount" placeholder="0" disabled
                                            :style="{ width: '240px' }"  ></el-input>
                                    </div> -->
                            </el-form-item>

                            <el-form-item label="资金池可用余额 (元)" prop="availableAmount">
								<ElPriceInput v-model:form="formData" prop="availableAmount" :width="240" :rules="rules"
								  :disabled="true" :placeholder="'请输入资金池可用余额'"></ElPriceInput>
                                <!-- <div >
                                        <el-input v-model="formData.availableAmount" placeholder="系统自动计算" disabled
                                            :style="{ width: '240px' }"  ></el-input>
                                    </div> -->
                            </el-form-item>

                            <el-form-item label="起始日" prop="startDate">
                                <el-date-picker clearable v-model="formData.startDate" type="date"
                                    value-format="YYYY-MM-DD" placeholder="请选择到期日" :style="{ width: '240px' }">
                                </el-date-picker>

                            </el-form-item>

                            <el-form-item label="到期日" prop="endDate">
                                <el-date-picker clearable v-model="formData.endDate" type="date"
                                    value-format="YYYY-MM-DD" placeholder="请选择到期日" :style="{ width: '240px' }">
                                </el-date-picker>

                            </el-form-item>
                            <el-form-item label="备注" prop="remark">
                                <div >
                                        <el-input v-model="formData.remark"  clearable maxlength="125" placeholder="请输入备注"
                                            :style="{ width: '240px' }"  ></el-input>
                                    </div>
                            </el-form-item>

                        </el-card>
                        </el-collapse-item>
                    </el-collapse>
                </el-form>
            </el-col>
        </el-row>
        <DialogTableMulti v-model:multiQuery="multiQuery" v-model:open="multiQuery.open" v-model:tableData="tableData"
            v-model:prop="propMulti" @selectRow="selectRow" @pageChange="pageChange" />
    </div>
</template>
<script setup>
import { reactive, ref, watch } from "vue";
const { proxy } = getCurrentInstance();
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

let multiQuery = ref({
    title: "合同信息",//标题
    open: false,
    currentPage: 1,
    total: 1,
    pageSize: 10,
});
const propMulti = ref([{
    label: '业务合同号',
    value: 'otherContractNo'
}, {
    label: '合同名称',
    value: 'otherContractName'
}, {
    label: '核心客户名称',
    value: 'coreEnterpriseName'
}]);
const activeNames = ref(['1', '2', '3', '4']);//tab打开状态
const loading = ref(false);
const dataScope = reactive({
    rules:
    {
        fundResource: [
            { required: true, message: "资金来源不能为空", trigger: "change" }
        ],
        totalAmount: [
            { required: true, message: "资全池总金额不能为空", trigger: "change" }
        ],
        startDate: [
            { required: true, message: "起始日不能为空", trigger: "change" }
        ],
        endDate: [
            { required: true, message: "到期日不能为空", trigger: "change" }
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


const { sys_currency_type, proj_dd_type, lend_buss_product, fund_resource, fund_if_cycle, fund_provider, fund_credit_type } = proxy.useDict("sys_currency_type", "proj_dd_type", "lend_buss_product", "fund_resource", "fund_if_cycle", "fund_provider", "fund_credit_type");//下拉框字典

let formData = ref({
            "createBy": null,
            "createById": null,
            "createTime": null,
            "updateBy": null,
            "updateById": null,
            "updateTime": null,
            "delFlag": null,
            "fundId": null,
            "fundNo": "",
            "fundResource": "",
            "provider": "",
            "providerCode": "",
            "providerName": "",
            "providerNcCode": "",
            "contractNo": "",
            "creditType": "",
            "fundIfCycle": "",
            "currencyType": "",
            "totalAmount": null,
            "usedAmount": null,
            "availableAmount": null,
            "startDate": null,
            "endDate": null,
            "remark": "",
            "status": "",
            "commonFileList": []
});//不能修改const 定义的数据

watch(() => formData.value.totalAmount, (newValue) => {
    const total = newValue ? parseFloat(newValue) : 0;
    // console.log(total);
    // console.log(formData.value.usedAmount ? parseFloat(formData.value.usedAmount) : 0);
	formData.value.usedAmount = formData.value.usedAmount ? parseFloat(formData.value.usedAmount) : 0;
    formData.value.availableAmount =  total - (formData.value.usedAmount ? parseFloat(formData.value.usedAmount) : 0);
    // console.log(formData.value.availableAmount);
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
    this.$refs['elForm'].validate((valid) => { console.log(valid); result = valid })
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

// 打开用户信息选择框 请求用户信息
function openDiag(options, row) {
    if (row) {
        updateItem.value = row;
    } else {
        updateItem.value = null;
    }
    if (options == 'otherContractNo' && tableDataCont.value.length) {
        tableData.value = tableDataCont.value;
        multiQuery.value.total = totalCont.value;
        setDialogTitle(options);
        multiQuery.value.open = true;
    } else if (options != 'otherContractNo' && tableDataUser.value.length) {
        tableData.value = tableDataUser.value;
        multiQuery.value.total = totalUser.value;
        setDialogTitle(options);
        multiQuery.value.open = true;
    } else {

        loading.value = true;
        if (options == 'otherContractNo') {
            getContList(userParams.value).then(response => {
                tableData.value = [];
                loading.value = false;
                response.rows.map((item) => {
                    // item.parentCustomerName = item.companyInfo.parentCustomerName;
                    tableData.value.push(item)
                });

                tableDataCont.value = response.rows;
                totalCont.value = response.total;

                multiQuery.value.total = response.total;

                setDialogTitle(options);
                multiQuery.value.open = true;
            });
        } else {
            getUserList(userParams.value).then(response => {
                loading.value = false;
                tableData.value = [];
                response.rows.map((item) => {
                    item.parentCustomerName = item.companyInfo.parentCustomerName;
                    tableData.value.push(item)
                });
                tableDataUser.value = response.rows;
                totalUser.value = response.total;
                multiQuery.value.total = response.total;
                setDialogTitle(options);
                multiQuery.value.open = true;
            });
        }


    }
    checkItem.value = options;

}
function setDialogTitle(options) {
    if (options == 'otherContractNo') {
        multiQuery.value.title = "合同信息";
        propMulti.value = [{
            label: '业务合同号',
            value: 'otherContractNo'
        }, {
            label: '合同名称',
            value: 'otherContractName'
        }, {
            label: '核心客户名称',
            value: 'coreEnterpriseName'
        }];

    } else {
        multiQuery.value.title = "客户信息";
        propMulti.value = [{
            label: '客户编号',
            value: 'customerNo'
        }, {
            label: '上级公司',
            value: 'parentCustomerName'
        }, {
            label: '客户名称',
            value: 'customerName'
        }];
    }
}
// 弹出用户信息分页处理
function pageChange(page) {
    userParams.value.pageNum = page;
    loading.value = true;
    if (options == 'otherContractNo') {
    getContList(userParams.value).then(response => {
        loading.value = false;
        tableData.value = [];
        response.rows.map((item) => {
            // item.parentCustomerName = item.companyInfo.parentCustomerName;
            tableData.value.push(item)
        });
        multiQuery.value.total = response.total;
        setDialogTitle(options);
        multiQuery.value.open = true;
    });
} else {
    getUserList(userParams.value).then(response => {
        loading.value = false;
        tableData.value = [];
        response.rows.map((item) => {
            item.parentCustomerName = item.companyInfo.parentCustomerName;
            tableData.value.push(item)
        });
        multiQuery.value.total = response.total;
        setDialogTitle(options);
        multiQuery.value.open = true;
    });
}
}
// 选择了用户信息；
function selectRow(rows) {
    console.log(rows);

    if (checkItem.value == 'otherContractNo') {
        formData.value.otherContractNo = rows.otherContractNo
        formData.value.otherContractName = rows.otherContractName
        formData.value.coreEnterpriseName = rows.coreEnterpriseName
        formData.value.otherCurrencyType = rows.otherCurrencyType
        formData.value.bussProduct = rows.bussProduct
        formData.value.contractId = rows.contractId
    } else if (checkItem.value == 'customerNo') {
        formData.value.customerName = rows.customerName
        formData.value.customerNo = rows.customerNo
    } else if (checkItem.value == 'contractNo') {
        formData.value.customerName = rows.customerName
        formData.value.contractNo = rows.customerNo

    } else if (checkItem.value == 'voucherProviderName') {
        updateItem.value.voucherProviderName = rows.customerName
        updateItem.value.voucherProviderNo = rows.customerNo
    }
    else if (checkItem.value == 'factoringApplicantName') {
        updateItem.value.factoringApplicantName = rows.customerName
        updateItem.value.factoringApplicantNo = rows.customerNo
    }
}
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
  