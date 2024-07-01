<template>
    <div>
        <el-row :gutter="15" justify="center">
            <el-col :span="24" :xs="24">
                <el-form ref="elForm" :model="formData" :rules="rules" label-width="150px" :inline="true"
                    v-loading="loading" :disabled="props.routerQueryObj.viewFlag">



                    <el-collapse v-model="activeNames" @change="handleChange">


                        <el-collapse-item title="基本信息" name="0">
                            <el-form-item label="业务合同号" prop="contractNo">
                                <!-- <div @click="openDiagMulti('loanNo')"> -->
                                <el-input v-model="formData.contractNo" placeholder="系统自动生成" suffix-icon="search"
                                    :style="{ width: '240px' }" disabled />
                                <!-- </div> -->

                            </el-form-item>

                            <el-form-item label="业务产品" prop="bussProduct">
                                <el-select v-model="formData.bussProduct" filterable placeholder="请选择业务产品"
                                    :style="{ width: '240px' }" disabled>
                                    <el-option v-for="item in lend_buss_product" :key="item.value" :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="保理申请人" prop="factoringApplicantName">
                                <el-input v-model="formData.factoringApplicantName" placeholder="系统自动生成" disabled
                                    :style="{ width: '240px' }" />
                            </el-form-item>

                            <el-form-item label="债务人" prop="agreeDebtorName">
                                <el-input v-model="formData.agreeDebtorName" placeholder="系统自动生成" disabled
                                    :style="{ width: '240px' }" />
                            </el-form-item>

                            <br>

                            <el-form-item label="入账冲销项目" prop="entryItem">

                                <el-checkbox-group v-model="formData.entryList[0].entryItem">
                                    <el-checkbox v-for="dict in payment_reverse_item" :label="dict.value" :name="dict.value"
                                        :key="dict.value">{{ dict.label }}</el-checkbox>
                                </el-checkbox-group>

                            </el-form-item>


                            <el-form-item label="入账日期" prop="entryList.0.entryDate">
                                <el-date-picker clearable v-model="formData.entryList[0].entryDate" type="date"
                                    value-format="YYYY-MM-DD" :style="{ width: '240px' }" placeholder="请选择入账日期">
                                </el-date-picker>
                            </el-form-item>

							<el-form-item label="扣账金额" prop="deductionAmount">
								<ElPriceInput v-model:form="formData.entryList[0]" :width="240" prop="deductionAmount" :rules="rules" :placeholder="'请输入扣账金额'"></ElPriceInput>
							</el-form-item>
							<el-form-item label="尾款金额" prop="finalPaymentAmount">
								<ElPriceInput v-model:form="formData.entryList[0]" :width="240" prop="finalPaymentAmount" :rules="rules" :placeholder="'请输入尾款金额'"></ElPriceInput>
							</el-form-item>
                            <!-- <PriceInput v-model:form="formData.entryList[0]" :width="240" label="扣账金额"
                                prop="deductionAmount" :rules="rules">

                            </PriceInput>


                            <PriceInput v-model:form="formData.entryList[0]" :width="240" label="尾款金额"
                                prop="finalPaymentAmount" :rules="rules">

                            </PriceInput> -->



                            <el-form-item label="入账账号" prop="entryList.0.entryAccount">
                                <el-select v-model="formData.entryList[0].entryAccount" filterable placeholder="请选择入账账号"
                                    :style="{ width: '240px' }">
                                    <el-option v-for="item in cont_pay" :key="item.value" :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>


                            <el-form-item label="延迟付款原因" prop="reason">
                                <el-select v-model="formData.entryList[0].reason" filterable placeholder="请选择延迟付款原因"
                                    :style="{ width: '240px' }">
                                    <el-option v-for="item in cont_pay" :key="item.value" :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>










                            <el-form-item label="备注" prop="remark">
                                <el-input v-model="formData.entryList[0].remark" placeholder="请输入备注" clearable
                                    :style="{ width: '240px' }" maxlength="255" />
                            </el-form-item>







                        </el-collapse-item>



                        <el-collapse-item title="凭证信息" name="1">



                            <el-table v-loading="loading" :data="formData.entryList[0].loanVoucherList"
                                @selection-change="handleSelectionChange" style="margin-bottom: 50px;margin-top: 30px;">
                                <!-- <el-table-column type="selection" width="55" align="center" /> -->

                                <el-table-column label="序号" align="center" type="index" width="60" fixed />

                                <el-table-column label="操作" width="240" align="center">
                                    <div class="button-display">
                                        <el-tag>凭证明细</el-tag>
                                        <el-tag>单证查询</el-tag>
                                        <el-tag>发票查询</el-tag>

                                    </div>

                                </el-table-column>
                                <el-table-column label="凭证号码" align="center" prop="voucherNo"> <template #default="scope">
                                        <el-input v-model="scope.row.voucherNo" placeholder="请输入" clearable
                                            disabled></el-input>
                                    </template>
                                </el-table-column>


                                <el-table-column label="应收账款余额" align="center" prop="debtReceivableBalance"><template
                                        #default="scope">
                                        <el-input v-model="scope.row.debtReceivableBalance" placeholder="请输入" clearable
                                            disabled></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column label="担保付款金额" align="center" prop="debtReceivableAmount"><template
                                        #default="scope">
                                        <el-input v-model="scope.row.debtReceivableAmount" placeholder="请输入" clearable
                                            disabled></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column label="放款余额" align="center" prop="debtReceivableAmountNew"><template
                                        #default="scope">
                                        <el-input v-model="scope.row.debtReceivableAmountNew" placeholder="请输入"
                                            clearable></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column label="本次冲销应收账款" align="center" prop="debtReceivableBalanceNew">
                                    <template #default="scope">
                                        <el-input v-model="scope.row.debtReceivableBalanceNew" placeholder="请输入"
                                            clearable></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column label="本次冲销担保付款" align="center" prop="loanRatio"><template
                                        #default="scope">
                                        <el-input v-model="scope.row.loanRatio" placeholder="请输入" clearable></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column label="本次入账金额" align="center" prop="coalTon"><template #default="scope">
                                        <el-input v-model="scope.row.coalTon" placeholder="请输入" clearable
                                            type="number"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column label="应收账款到期日" align="center" prop="dueDate" width="240">
                                    <template #default="scope">
                                        <el-date-picker clearable v-model="scope.row.dueDate" type="date"
                                            value-format="YYYY-MM-DD" placeholder="请选择到期日">
                                        </el-date-picker>
                                    </template>
                                </el-table-column>
                                <el-table-column label="风险敞口" align="center" prop="price"><template #default="scope">
                                        <el-input v-model="scope.row.price" placeholder="请输入" clearable></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column label="尚欠利息" align="center" prop="price"><template #default="scope">
                                        <el-input v-model="scope.row.price" placeholder="请输入" clearable></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column label="是否调整利息" prop="bussProduct">
                                    <el-select v-model="formData.bussProduct" filterable placeholder="请选择"
                                        :style="{ width: '240px' }" disabled>
                                        <el-option v-for="item in sys_yes_no" :key="item.value" :label="item.label"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-table-column>
                                <el-table-column label="尚欠违约金" align="center" prop="price"><template #default="scope">
                                        <el-input v-model="scope.row.price" placeholder="请输入" clearable></el-input>
                                    </template>
                                </el-table-column>

                            </el-table>




                        </el-collapse-item>

                        <el-collapse-item title="回款信息" name="2">


                            <el-form-item label="入账方式" prop="entryWay">
                                <el-select v-model="formData.entryList[0].entryWay" filterable placeholder="请选择入账方式"
                                    :style="{ width: '240px' }">
                                    <el-option v-for="item in payment_incoming_way" :key="item.value" :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
<!-- 
                            <PriceInput v-model:form="formData" :width="240" label="冲销应收账款总金额"
                                prop="entryList.0.chargeAgainstAmount" :rules="rules">

                            </PriceInput> -->
                            <PriceInput v-model:form="formData.entryList[0]" :width="240" label="冲销应收账款总金额"
                                prop="chargeAgainstAmount" propslot="entryList.0.chargeAgainstAmount" :placeholder="'请输入冲销应收账款总金额'" :rules="rules">

                            </PriceInput>

                            <PriceInput v-model:form="formData.entryList[0]" :width="240" label="入账总金额" prop="entryAmount" :placeholder="'请输入入账总金额'" propslot="entryList.0.entryAmount" 
                                :rules="rules">

                            </PriceInput>
                            <!-- <PriceInput v-model:form="formData" :width="240" label="入账总金额" prop="entryList.0.entryAmount"
                                :rules="rules">

                            </PriceInput> -->

                            <el-form-item>
                                <el-button>自动分配</el-button>
                            </el-form-item>
                        </el-collapse-item>




                        <el-collapse-item title="费用信息" name="3">




                            <el-table v-loading="loading" :data="formData.entryList[0].feeList"
                                v-if="formData.feeList && formData.feeList.length" style="margin-bottom: 20px;">
                                <!-- <el-table-column type="selection" width="55" align="center" /> -->

                                <el-table-column label="序号" align="center" type="index" width="80" />
                                <el-table-column label="费用名目" align="center" prop="feeName">


                                </el-table-column>
                                <el-table-column label="是否本次收取" align="center" prop="isCharge" min-width="300">
                                    <template #default="scope">
                                        <el-select v-model="scope.row.isCharge" filterable placeholder="请选择">
                                            <el-option v-for="item in sys_yes_no" :key="item.value" :label="item.label"
                                                :value="item.value">
                                            </el-option>
                                        </el-select>

                                    </template>
                                </el-table-column>
                                <el-table-column label="币种" align="center" prop="feeType" min-width="300">
                                    <template #default="scope">
                                        <el-select v-model="scope.row.feeType" filterable placeholder="请选择">
                                            <el-option v-for="item in sys_currency_type" :key="item.value"
                                                :label="item.label" :value="item.value">
                                            </el-option>
                                        </el-select>

                                    </template>
                                </el-table-column>
                                <el-table-column label="费用总金额" align="center" prop="customerId" min-width="300">
                                    <template #default="scope">
                                        <el-input v-model="scope.row.customerId" placeholder="请输入" clearable></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column label="收费/支付对象" align="center" prop="customerId" min-width="300">
                                    <template #default="scope">
                                        <el-input v-model="scope.row.customerId" placeholder="请输入" clearable></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column label="支付方式" prop="feePayment" min-width="300">
                                    <!-- proj_dd_credit_enhancement -->
                                    <template #default="scope">
                                        <el-select v-model="scope.row.feePayment" filterable placeholder="请选择"
                                            :style="{ width: '115px' }">
                                            <el-option v-for="item in cont_fee_payment" :key="item.value"
                                                :label="item.label" :value="item.value">
                                            </el-option>
                                        </el-select>
                                        <el-input v-model="scope.row.feePaymentOther" placeholder="请输入" clearable
                                            :style="{ width: '115px', marginLeft: '10px' }"
                                            :disabled="scope.row.feePayment != 4" />
                                    </template>
                                </el-table-column>

                                <el-table-column label="计费方式" align="center" prop="feeBilling" min-width="300">
                                    <!-- cont_fee_type -->
                                    <template #default="scope">
                                        <el-radio-group v-model="scope.row.feeBilling">
                                            <el-radio v-for="dict in cont_fee_billing" :key="dict.value"
                                                :label="dict.value">{{ dict.label }}</el-radio>
                                        </el-radio-group>
                                    </template>
                                </el-table-column>


                                <el-table-column label="管理费金额/比例" align="center" prop="feeRate" width="300">
                                    <template #default="scope">
                                        <el-input v-model="scope.row.feeRate" placeholder="请输入" clearable
                                            :style="{ width: '240px' }" />
                                    </template>
                                </el-table-column>


                            </el-table>
                        </el-collapse-item>
                        <el-collapse-item title="积欠费用" name="4">



                            <el-table :data="formData.entryList[0].feeList" style="margin-bottom: 50px;margin-top: 30px;">


                                <el-table-column label="费用名目" align="center" prop="factoringApplicantName">

                                </el-table-column>
                                <el-table-column label="费用币种" align="center" prop="factoringApplicantName" />
                                <el-table-column label="费用金额" align="center" prop="factoringApplicantName" />
                                <el-table-column label="尚欠金额" align="center" prop="factoringApplicantName" />
                                <el-table-column label="本次收取金额" align="center" prop="factoringApplicantName" />

                            </el-table>



                        </el-collapse-item>

                    </el-collapse>



                </el-form>
            </el-col>
        </el-row>



    </div>
</template>
<script setup>
import { reactive, ref } from "vue";
import { deepClone } from "@/utils/index"
const { proxy } = getCurrentInstance();
import { listUser } from "@/api/system/user";
import { listInfo as getUserList } from "@/api/customer/index"
import useUserStore from '@/store/modules/user'
const props = defineProps({
    entryInfo: {
        type: Object,
        default: null,
    },
    // 新增为空
    paymentId: {
        type: String,
        default: "",
    },
    routerQueryObj: {
        type: Object,
        default: null,
    }

});
let multiQuery = ref({
    title: "客户信息",//标题
    open: false,
    currentPage: 1,
    total: 1,
    pageSize: 10,
});
const propMulti = ref([{
    label: '客户编号',
    value: 'customerNo'
}, {
    label: '客户名称',
    value: 'customerName'
}]);
const activeNames = ref(['1', '2', '0', '3']);//tab打开状态
const single = ref(true);
const multiple = ref(true);
const ids = ref([]);
const loading = ref(false);
const title = ref("");
const open = ref(false);
const dataScope = reactive({
    rules:
    {
        // 基本信息：
        
            'entryList.0.entryDate': [
                { required: true, message: "入账日期不能为空", trigger: "change" }
            ],
            'entryList.0.entryAccount': [
                { required: true, message: "入账账号不能为空", trigger: "change" }
            ],
            'entryList.0.entryWay': [
                { required: true, message: "入账方式不能为空", trigger: "change" }
            ],
            'entryList.0.deductionAmount': [
                {
                    pattern: /^1000000000$|^1000000000.0$|^1000000000.00$|^[+]{0,1}(\d{0,9})$|^[+]{0,1}(\d{0,9}\.\d{1,2})$/,
                    message: ' 请输入 0-10亿 的正数，可保留两位小数',
                    trigger: 'blur',
                },
                // { required: true, message: "扣账金额不能为空", trigger: "blur" }
            ],
'deductionAmount': [
                {
                    pattern: /^1000000000$|^1000000000.0$|^1000000000.00$|^[+]{0,1}(\d{0,9})$|^[+]{0,1}(\d{0,9}\.\d{1,2})$/,
                    message: ' 请输入 0-10亿 的正数，可保留两位小数',
                    trigger: 'blur',
                },
                // { required: true, message: "扣账金额不能为空", trigger: "blur" }
            ],

finalPaymentAmount: [
                {
                    pattern: /^1000000000$|^1000000000.0$|^1000000000.00$|^[+]{0,1}(\d{0,9})$|^[+]{0,1}(\d{0,9}\.\d{1,2})$/,
                    message: ' 请输入 0-10亿 的正数，可保留两位小数',
                    trigger: 'blur',
                },
                // { required: true, message: "尾款金额不能为空", trigger: "blur" }
            ],finalPaymentAmount: [
                {
                    pattern: /^1000000000$|^1000000000.0$|^1000000000.00$|^[+]{0,1}(\d{0,9})$|^[+]{0,1}(\d{0,9}\.\d{1,2})$/,
                    message: ' 请输入 0-10亿 的正数，可保留两位小数',
                    trigger: 'blur',
                },
                // { required: true, message: "尾款金额不能为空", trigger: "blur" }
            ],
            'entryList.0.finalPaymentAmount': [
                {
                    pattern: /^1000000000$|^1000000000.0$|^1000000000.00$|^[+]{0,1}(\d{0,9})$|^[+]{0,1}(\d{0,9}\.\d{1,2})$/,
                    message: ' 请输入 0-10亿 的正数，可保留两位小数',
                    trigger: 'blur',
                },
                // { required: true, message: "尾款金额不能为空", trigger: "blur" }
            ],
            chargeAgainstAmount: [
                {
                    pattern: /^1000000000$|^1000000000.0$|^1000000000.00$|^[+]{0,1}(\d{0,9})$|^[+]{0,1}(\d{0,9}\.\d{1,2})$/,
                    message: ' 请输入 0-10亿 的正数，可保留两位小数(冲销应收账款总金额不能为空)',
                    trigger: 'blur',
                },
                { required: true, message: "冲销应收账款总金额不能为空", trigger: "blur" }
            ],
            'entryList.0.chargeAgainstAmount': [
                {
                    pattern: /^1000000000$|^1000000000.0$|^1000000000.00$|^[+]{0,1}(\d{0,9})$|^[+]{0,1}(\d{0,9}\.\d{1,2})$/,
                    message: ' 请输入 0-10亿 的正数，可保留两位小数',
                    trigger: 'blur',
                },
                { required: true, message: "冲销应收账款总金额不能为空", trigger: "blur" }
            ],

            entryAmount: [
                {
                    pattern: /^1000000000$|^1000000000.0$|^1000000000.00$|^[+]{0,1}(\d{0,9})$|^[+]{0,1}(\d{0,9}\.\d{1,2})$/,
                    message: ' 请输入 0-10亿 的正数，可保留两位小数',
                    trigger: 'blur',
                },
                { required: true, message: "入账总金额不能为空", trigger: "blur" }
            ],
            'entryList.0.entryAmount': [
                {
                    pattern: /^1000000000$|^1000000000.0$|^1000000000.00$|^[+]{0,1}(\d{0,9})$|^[+]{0,1}(\d{0,9}\.\d{1,2})$/,
                    message: ' 请输入 0-10亿 的正数，可保留两位小数',
                    trigger: 'blur',
                },
                { required: true, message: "入账总金额不能为空", trigger: "blur" }
            ],
        

    },//验证规律
    form: {},
});

const { rules, form } = toRefs(dataScope);
const { lend_buss_product, cont_pay, sys_currency_type, cont_interest_pay, cont_interest_settlement, loan_doc_type, loan_item, sys_yes_no, loan_result, payment_reverse_item, cont_fee_billing, payment_incoming_way } = proxy.useDict("lend_buss_product", "cont_pay", "sys_currency_type", "cont_interest_pay", "cont_interest_settlement", "loan_doc_type", "loan_item", "sys_yes_no", "loan_result", "payment_reverse_item", "cont_fee_billing", "payment_incoming_way");//下拉框字典
let formData = ref({});//不能修改const 定义的数据

watch(() => props.entryInfo, (newValue, oldValue) => {
    console.log(newValue);
    if (newValue) {
        if (!newValue.entryList || newValue.entryList.length == 0) {
            newValue.entryList = ref([{
                "remark": null,
                "debtId": null,
                "entryItem": null,
                "entryDate": null,
                "deductionAmount": null,
                "finalPaymentAmount": null,
                "entryAccount": null,
                "reason": null,
                "entryWay": null,
                "chargeAgainstAmount": null,
                "entryAmount": null,
                "status": "1",
                "loanVoucherList": null,
                "feeList": null
            }]
            )
        }
        formData.value = deepClone(newValue);
        if (formData.value.entryList[0].entryItem && formData.value.entryList[0].entryItem.length) {
            formData.value.entryList[0].entryItem = formData.value.entryList[0].entryItem.split(',');
        } else {
            formData.value.entryList[0].entryItem = [];
        }
    }


}, { immediate: true, deep: true })


function handleChange(val) {
    console.log(val);
}

// 表单验证
function validForm() {
    let result = false
    proxy.$refs['elForm'].validate((valid) => { console.log(valid); result = valid })
    return result
}


// 用户组件请求信息(TODO 后期有弹窗选择的时候使用)
const userParams = ref({
    pageNum: 1,
    pageSize: 10,
})
const tableDataMulti = ref([]);
let checkItemMult = ref("")
let tableDataMultiCoreEnterpriseName = ref([]);
let tableDataMultiOther = ref([]);

// 打开用户信息选择框 请求用户信息
function openDiagMulti(options) {
    console.log(tableDataMulti.value);
    multiQuery.value.currentPage = 1;
    userParams.value.pageNum = 1;
    if (options == 'coreEnterpriseName' && tableDataMultiCoreEnterpriseName.value.length) {
        tableDataMulti.value = tableDataMultiCoreEnterpriseName.value;
        setDialogTitle(options);
        multiQuery.value.open = true;
    } else if (options != 'coreEnterpriseName' && tableDataMultiOther.value.length) {
        tableDataMulti.value = tableDataMultiOther.value;
        setDialogTitle(options);
        multiQuery.value.open = true;
    } else {
        if (options == 'coreEnterpriseName') {
            userParams.value.isCoreEnterprise = 1;
        } else {
            if (userParams.value.isCoreEnterprise) {
                delete userParams.value.isCoreEnterprise;
            }

        }
        loading.value = true;
        getUserList(userParams.value).then(response => {
            tableDataMulti.value = [];
            loading.value = 0;
            response.rows.map((item) => {
                item.parentCustomerName = item.companyInfo.parentCustomerName;
                tableDataMulti.value.push(item)
                if (options == 'coreEnterpriseName') {
                    tableDataMultiCoreEnterpriseName.value.push(item);
                } else {
                    tableDataMultiOther.value.push(item);
                }

            });
            multiQuery.value.total = response.total;

            setDialogTitle(options);
            multiQuery.value.open = true;
        });
    }
    checkItemMult.value = options;
}

function setDialogTitle(options) {
    if (options == 'customerName') {
        multiQuery.value.title = "客户信息";

    } else if (options == 'coreEnterpriseName') {
        multiQuery.value.title = "核心企业信息";
    } else if (options == 'factoringApplicantName') {
        multiQuery.value.title = "保理申请人信息";
    } else if (options == 'debtorName') {
        multiQuery.value.title = "债务人信息";
    }
}
// 弹出用户信息分页处理
function pageChangeMulti(page) {
    userParams.value.pageNum = page;
    multiQuery.value.currentPage = page;
    loading.value = true;
    getUserList(userParams.value).then(response => {
        loading.value = false;
        tableDataMulti.value = [];
        response.rows.map((item) => {
            item.parentCustomerName = item.companyInfo.parentCustomerName;
            tableDataMulti.value.push(item)
        });
        multiQuery.value.total = response.total;
        setDialogTitle(options);
        multiQuery.value.open = true;
    });
}
// 选择了用户信息；
function selectRowMulti(rows) {
    console.log(rows);

    if (checkItemMult.value == 'customerName') {
        formData.value.customerName = rows.customerName
        formData.value.customerNo = rows.customerNo
    } else if (checkItemMult.value == 'coreEnterpriseName') {
        formData.value.coreEnterpriseName = rows.customerName
        formData.value.coreEnterpriseNo = rows.customerNo
    } else if (checkItemMult.value == 'factoringApplicantName') {
        formData.value.factoringApplicantName = rows.customerName
        formData.value.factoringApplicantNo = rows.customerNo
    } else if (checkItemMult.value == 'debtorName') {
        formData.value.debtorName = rows.customerName
        formData.value.debtorNo = rows.customerNo
    }

}
// 多选框选中数据
function handleSelectionChange(selection) {
    ids.value = selection.map(item => item.loanNodeBasis);
    single.value = selection.length != 1;
    multiple.value = !selection.length;
}

let addType = ref('');//billNo,fileNo
// 表格新增事件
function addItem(type) {
    reset();
    addType.value = type;
    open.value = true;
    title.value = "新增";
    if (type == 'billNo') {
        title.value += '票据信息'
    } else if (type == 'fileNo') {
        title.value += '文件信息'
    }

}
// 表格修改事件
function handleUpdate(row, type) {
    open.value = true;
    addType.value = type;
    title.value = "修改";
    if (type == 'billNo') {
        title.value += '票据信息'
    } else if (type == 'fileNo') {
        title.value += '文件信息'
    }
    if (!row) {
        //   初始化表单数据
    } else {
        debugger;
        form.value = deepClone(row);
        form.value.type = '1';
    }

}

// 表格删除事件
function handleDelete(rows, type) {
    const indexCount = rows ? [rows.indexCount ? rows.indexCount : rows.id] : ids.value;
    let jugeItem = 'id';
    if (!rows.id) {
        jugeItem = 'indexCount';
    }
    let operateList = ref('billList');
    if (addType.value == 'billNo') {
        // 票据信息
        operateList.value = 'billList';
    } else if (addType.value == 'fileNo') {
        // 文件信息
        operateList.value = 'fileList';
    }
    indexCount.forEach((names) => {
        formData.value.loanResult[operateList.value] = formData.value.loanResult[operateList.value].filter((item) => {
            return item[jugeItem] != names;
        })

    })
    single.value = false;
    multiple.value = false;
}


// 新增修改确定按钮
function submitForm() {
    proxy.$refs['resultRef'].validate(valid => {
        if (!valid) {
            // proxy.$message("")
        } else {
            let operateList = ref('billList');
            if (addType.value == 'billNo') {
                // 票据信息
                operateList.value = 'billList';
            } else if (addType.value == 'fileNo') {
                // 文件信息
                operateList.value = 'fileList';
            }
            if (form.value.type) {
                // 修改票据信息
                formData.value.loanResult[operateList.value] = formData.value.loanResult[operateList.value].map((list) => {
                    if (list.indexCount == form.value.indexCount) {
                        console.log(list);
                        return deepClone(form.value);

                    } else {
                        return list
                    }

                })
                console.log(formData.value.loanResult);

            } else {
                // 新增票据信息
                debugger;

                formData.value.loanResult[operateList.value].push(deepClone(form.value));
            }
            reset()
            open.value = false;
        }

    })
}

// 新增form初始化
function reset() {
    form.value = {
        indexCount: Math.random(5),
        id: null,
        billNo: null,
        billAmount: null,
        draftDate: null,
        dueDate: null,
        fileNo: null,
        issuingAmount: null,
        issueDate: null,
    };
    proxy.resetForm("resultRef");
}


// 新增修改弹出页面取消按钮
function cancel() {
    open.value = false;
    reset();
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

.start {
    justify-content: flex-start;
}
</style>
  