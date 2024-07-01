<template>
    <div>
        <el-row :gutter="15" justify="center">
            <el-col :span="24" :xs="24">
                <el-form ref="elForm" :model="formData" :rules="rules" label-width="150px" :inline="true"
                    v-loading="loading" :disabled="props.routerQueryObj.viewFlag">



                    <el-collapse v-model="activeNames" @change="handleChange">


                        <el-collapse-item title="基本信息" name="0">
                            <el-form-item label="客户名称" prop="customerName">
                                <div @click="openDiagMulti('customerName')">
                                    <el-input v-model="formData.customerName" placeholder="请选择客户名称" readonly
                                        suffix-icon="el-icon-search" :style="{ width: '240px' }" disabled></el-input>
                                </div>
                            </el-form-item>


                            <el-form-item label="审议编号" prop="dueNo">
                                <el-input v-model="formData.dueNo" placeholder="系统自动生成" disabled
                                    :style="{ width: '240px' }" />
                            </el-form-item>

                            <el-form-item label="项目名称" prop="name" v-if="!props.dilligenceId">
                                <el-input v-model="formData.name" placeholder="请输入项目名称" :style="{ width: '240px' }"
                                    disabled />
                            </el-form-item>


                            <el-form-item label="总期" prop="totalPeriod">
                                <el-input v-model="formData.totalPeriod" placeholder="系统自动生成" :style="{ width: '240px' }"
                                    disabled />
                            </el-form-item>
                            <el-form-item label="审议日期" prop="reviewDate">
                                <el-date-picker clearable v-model="formData.reviewDate" type="date"
                                    value-format="YYYY-MM-DD" placeholder=" 系统自动生成,支持修改,授信生效日期向后顺延365天"
                                    :style="{ width: '240px' }" disabled>
                                </el-date-picker>
                            </el-form-item>

                            <el-form-item label="提交部门" prop="submitDepartment">
                                <el-select v-model="formData.submitDepartment" filterable placeholder="请选择"
                                    :style="{ width: '240px' }" disabled>
                                    <el-option label="业务部门" value="业务部门">
                                    </el-option>
                                </el-select>

                            </el-form-item>

                            <el-form-item label="年期" prop="currentYear">
                                <el-input v-model="formData.currentYear" placeholder="系统自动生成" :style="{ width: '240px' }"
                                    type="number" disabled />

                            </el-form-item>


                            <el-form-item label="主办人" prop="sponsor">
                                <el-input v-model="formData.sponsor" placeholder="请输入主办人" :style="{ width: '240px' }"
                                    disabled />
                            </el-form-item>




                        </el-collapse-item>


                        <el-collapse-item title="授信要素" name="1">



                            <el-form-item label="核心企业" prop="coreEnterpriseName">
                                <el-input v-model="formData.coreEnterpriseName" placeholder="请选择核心企业" clearable disabled
                                    suffix-icon="el-icon-search" :style="{ width: '240px' }"></el-input>
                            </el-form-item>
                            <!-- factoringApplicantName -->
                            <el-form-item label="保理申请人" prop="factoringApplicantNo">
                                <el-input v-model="formData.factoringApplicantName" placeholder="请选择保理申请人" clearable
                                    readonly suffix-icon="el-icon-search" :style="{ width: '240px' }" disabled></el-input>
                            </el-form-item>
                            <!-- debtorName -->
                            <el-form-item label="债务人" prop="debtorNo">
                                <el-input v-model="formData.debtorName" placeholder="请选择保理债务人" clearable readonly
                                    suffix-icon="el-icon-search" :style="{ width: '240px' }" disabled></el-input>
                            </el-form-item>
                            <el-form-item label="备注" prop="remark">
                                <el-input v-model="formData.remark" :style="{ width: '240px' }" disabled></el-input>
                            </el-form-item>


                            <attach-info id="attachInfo" ref="attachInfoRef" :commonFileList="formData.commonFileList"
                                :routerQueryObj="routerQueryObj" :dilligenceId="dilligenceId"></attach-info>
                        </el-collapse-item>







                        <el-collapse-item title="要素调整" name="2">


                            <el-card class="box-card">
                                <el-table :data="elementlist" @selection-change="handleSelectionChange"
                                    style="margin-bottom: 20px;">
                                    <!-- <el-table-column type="selection" width="55" align="center" /> -->

                                    <el-table-column label="序号" align="center" type="index" width="80" />

                                    <el-table-column label="调整要素" align="center" prop="title" width="200" />

                                    <!-- <el-table-column label="oss上文件存储地址" align="center" prop="fileUrl" /> -->
                                    <el-table-column label="原要素内容" align="center" prop="value">
                                        <template #default="scope">
                                            <div v-if="scope.row.type == 'option'">
                                                <el-select v-model="formData[scope.row.value[0]]" disabled
                                                    :style="{ width: '115px' }">
                                                    <el-option v-for="item in scope.row.dict" :key="item.value"
                                                        :label="item.label" :value="item.value">
                                                    </el-option>
                                                </el-select>
                                                <el-input v-if="scope.row.dictLength" v-model="formData[scope.row.value[1]]"
                                                    :style="{ width: '115px', marginLeft: '10px' }" disabled />
                                            </div>
                                            <div v-if="scope.row.type == 'input'">
                                                <el-input v-model="formData[scope.row.value[0]]" clearable disabled
                                                    :style="{ width: '240px' }">
                                                    <template #suffix>
                                                        <span> {{ scope.row.suffix }}</span>
                                                    </template>
                                                </el-input>
                                            </div>
                                            <div v-if="scope.row.type == 'radio'">
                                                <el-radio-group v-model="formData[scope.row.value[0]]" disabled>
                                                    <el-radio v-for="item in scope.row.dict" :key="item.value"
                                                        :label="item.value"> {{ item.label }}</el-radio>

                                                </el-radio-group>
                                            </div>


                                            <PriceInput v-model:form="formData" :width="240" label=""
                                                :prop="scope.row.value[0]" :disabled="true" :rules="rules"
                                                v-if="scope.row.type == 'price'"
                                                :style="{ marginRight: '0px', marginBottom: '0px' }">
                                                <!-- <template #prefix>
                                        <span class="iconfont icon-tubiaozhizuomoban
" style="color: var(--el-input-icon-color,var(--el-text-color-placeholder));"></span>
                                    </template> -->
                                                <template #suffix>
                                                    <span> {{ scope.row.suffix }}</span>
                                                </template>
                                            </PriceInput>


                                        </template>
                                    </el-table-column>

                                    <el-table-column label="新要素内容" align="center" prop="value">
                                        <template #default="scope">
                                            <div v-if="scope.row.type == 'option'">
                                                <el-select v-model="adjustListObject[scope.row.value[0]]"
                                                    :style="{ width: '115px' }" placeholder="请选择">
                                                    <el-option v-for="item in scope.row.dict" :key="item.value"
                                                        :label="item.label" :value="item.value">
                                                    </el-option>
                                                </el-select>
                                                <el-input v-if="scope.row.dictLength" v-model="adjustListObject[scope.row.value[1]]"
                                                    :style="{ width: '115px', marginLeft: '10px' }" placeholder="请输入"
                                                    :disabled="adjustListObject[scope.row.value[0]] != scope.row.dictLength" />
                                            </div>
                                            <div v-if="scope.row.type == 'input'">
                                                <el-input v-model="adjustListObject[scope.row.value[0]]" clearable
                                                    :style="{ width: '240px' }"
                                                    :placeholder="'请输入' + scope.row.title"><template #suffix>
                                                        <span> {{ scope.row.suffix }}</span>
                                                    </template>
                                                </el-input>
                                            </div>
                                            <div v-if="scope.row.type == 'radio'">
                                                <el-radio-group v-model="adjustListObject[scope.row.value[0]]">
                                                    <!-- :style="{ width: '480px' }" -->
                                                    <el-radio v-for="item in scope.row.dict" :key="item.value"
                                                        :label="item.value"> {{ item.label }}</el-radio>

                                                </el-radio-group>
                                            </div>



                                            <PriceInput v-model:form="adjustListObject" :width="240" label=""
                                                :prop="scope.row.value[0]" :rules="rules" v-if="scope.row.type == 'price'"
                                                :style="{ marginRight: '0px', marginBottom: '0px' }">
                                                <!-- <template #prefix>
                                        <span class="iconfont icon-tubiaozhizuomoban
" style="color: var(--el-input-icon-color,var(--el-text-color-placeholder));"></span>
                                    </template> -->
                                                <template #suffix>
                                                    <span> {{ scope.row.suffix }}</span>
                                                </template>
                                            </PriceInput>



                                        </template>
                                    </el-table-column>
                                </el-table>

                                <!-- <div class="header-button-operate" v-if="!props.routerQueryObj.viewFlag">
                                    <el-button type="text" @click="handleAddLoanList()"
                                        v-hasPermi="['sys:file:export']">新增</el-button> -->
                                    <!-- <el-button type="primary" link @click="handleDeleteLoanList()" :disabled="single">删除</el-button> -->

                                <!-- </div> -->
                                <el-table v-loading="loading" :data="formData.loanList"
                                    @selection-change="handleSelectionChange" style="margin-bottom: 20px;">
                                    <!-- <el-table-column type="selection" width="55" align="center" /> -->

                                    <el-table-column label="序号" align="center" type="index" width="80" />
                                    <!-- <el-table-column label="oss上文件存储地址" align="center" prop="fileUrl" /> -->
                                    <el-table-column label="原放款节点依据" align="center" prop="loanNodeBasis" min-width="500">
                                        <template #default="scope">
                                            <el-select v-model="scope.row.loanNodeBasis" filterable placeholder="请选择"
                                                :style="{ width: '315px' }" @visible-change="loanNodeBasisVisibleChange()"
                                                disabled>
                                                <el-option v-for="item in proj_dd_loan_basis" :key="item.value"
                                                    :label="item.label" :value="item.value">
                                                </el-option>
                                            </el-select>
                                            <el-input v-model="scope.row.loanNodeBasisOther" placeholder="请输入" clearable
                                                :style="{ width: '115px', marginLeft: '10px' }" disabled />
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="新放款节点依据" align="center" prop="loanNodeBasis" min-width="500">
                                        <template #default="scope">
                                            <el-select v-model="scope.row.loanNodeBasisNew" filterable placeholder="请选择"
                                                :style="{ width: '315px' }" @visible-change="loanNodeBasisVisibleChange()">
                                                <el-option v-for="item in proj_dd_loan_basis" :key="item.value"
                                                    :label="item.label" :value="item.value" :disabled="item.disabled">
                                                </el-option>
                                            </el-select>
                                            <el-input v-model="scope.row.loanNodeBasisOtherNew" placeholder="请输入" clearable
                                                :style="{ width: '115px', marginLeft: '10px' }"
                                                :disabled="scope.row.loanNodeBasisNew != 15" />
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="原放款比例" align="center" prop="loanRatio" width="300">
                                        <template #default="scope">
                                            <el-input v-model="scope.row.loanRatio" disabled :style="{ width: '240px' }" />
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="新放款比例" align="center" prop="loanRatio" width="300">
                                        <template #default="scope">
                                            <el-input v-model="scope.row.loanRatioNew" placeholder="请输入" clearable
                                                :style="{ width: '240px' }" />
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="原确权章" align="center" prop="confirmationSeal" min-width="500">
                                        <template #default="scope">
                                            <el-select v-model="scope.row.confirmationSeal" filterable placeholder="请选择"
                                                :style="{ width: '315px' }" disabled>
                                                <el-option v-for="item in proj_dd_confirmation_seal" :key="item.value"
                                                    :label="item.label" :value="item.value">
                                                </el-option>
                                            </el-select>
                                            <el-input v-model="scope.row.confirmationSealOther" placeholder="请输入" clearable
                                                :style="{ width: '115px', marginLeft: '10px' }" disabled />
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="新确权章" align="center" prop="confirmationSeal" min-width="500">
                                        <template #default="scope">
                                            <el-select v-model="scope.row.confirmationSealNew" filterable placeholder="请选择"
                                                :style="{ width: '315px' }">
                                                <el-option v-for="item in proj_dd_confirmation_seal" :key="item.value"
                                                    :label="item.label" :value="item.value">
                                                </el-option>
                                            </el-select>
                                            <el-input v-model="scope.row.confirmationSealOtherNew" placeholder="请输入" clearable
                                                :style="{ width: '115px', marginLeft: '10px' }"
                                                :disabled="scope.row.confirmationSealNew != 17" />
                                        </template>
                                    </el-table-column>

                                    <!-- <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                                        <template #default="scope">
                                            <el-button link type="primary" icon="Delete"
                                                @click="handleDeleteLoanList(scope.row)">删除</el-button>
                                        </template>
                                    </el-table-column> -->
                                </el-table>






                                <el-form-item label="原项目方案补充信息" prop="supplementaryInformation">
                                    <el-input v-model="formData.supplementaryInformation" type="textarea" disabled
                                        :style="{ width: '480px' }" />
                                </el-form-item>
                                <el-form-item label="新项目方案补充信息" prop="supplementaryInformation">
                                    <el-input v-model="adjustListObject.supplementaryInformation" type="textarea"
                                        placeholder="请输入内容" :style="{ width: '480px' }" />
                                </el-form-item>

                            </el-card>
                        </el-collapse-item>
                    </el-collapse>












                </el-form>
            </el-col>
        </el-row>

        <DialogTableMulti v-model:multiQuery="multiQuery" v-model:open="multiQuery.open" v-model:tableData="tableDataMulti"
            v-model:prop="propMulti" @selectRow="selectRowMulti" @pageChange="pageChangeMulti" />
    </div>
</template>
<script setup>
import attachInfo from './projDilAdjustAttachInfo.vue'
import { reactive, ref, watch } from "vue";
import { deepClone } from "@/utils/index"
const { proxy } = getCurrentInstance();
const props = defineProps({
    diligenceInfo: {
        type: Object,
        default: null,
    },
    // 新增为空
    dilligenceId: {
        type: String,
        default: "",
    },
    routerQueryObj: {
        type: Object,
        default: null,
    },
	adjustListObject: {
		type: Object,
		default: null
	}
});
const { proj_dd_type, proj_dd_contract_type, proj_dd_credit_enhancement, proj_dd_capital_repay, proj_dd_interest_payment, proj_dd_interest_payer, proj_dd_management_fee, proj_dd_management_fee_payer, proj_dd_confirmation, proj_dd_settlement_account, proj_dd_quota_type, proj_dd_loan_basis, proj_dd_confirmation_seal } = proxy.useDict("proj_dd_type", "proj_dd_contract_type", "proj_dd_credit_enhancement", "proj_dd_capital_repay", "proj_dd_interest_payment", "proj_dd_interest_payer", "proj_dd_management_fee", "proj_dd_management_fee_payer", "proj_dd_confirmation", "proj_dd_settlement_account", "proj_dd_quota_type", "proj_dd_loan_basis", "proj_dd_confirmation_seal");//下拉框字典
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
const activeNames = ref(['1', '2', '0']);//tab打开状态
const single = ref(true);
const multiple = ref(true);
const ids = ref([]);
const loading = ref(false);
const dataScope = reactive({
    rules:
    {
        customerName: [
            { required: true, message: "客户名称不能为空", trigger: "change" }
        ],
        name: [
            { required: true, message: "项目名称不能为空", trigger: "change" }
        ],
        // totalPeriod: [
        //     { required: true, message: "总期不能为空", trigger: "blur" }
        // ],
        submitDepartment: [
            { required: true, message: "提交部门不能为空", trigger: "blur" }
        ],
        reviewDate: [
            { required: true, message: "审议日期不能为空", trigger: "change" }
        ],
        // currentYear: [
        //     { required: true, message: "年期不能为空", trigger: "blur" }
        // ],
        financeLimitExpireDate: [
            { required: true, message: "保理融资额度到期日不能为空", trigger: "change" }
        ],
        sponsor: [
            { required: true, message: "主办人不能为空", trigger: "blur" }
        ],
        coreEnterpriseNo: [
            { required: true, message: "核心企业不能为空", trigger: "change" }
        ],
        factoringApplicantNo: [
            { required: true, message: "保理申请人不能为空", trigger: "change" }
        ],
        debtorNo: [
            { required: true, message: "债务人不能为空", trigger: "change" }
        ],
        financeLimitAmount: [
            {
                pattern: /^1000000000$|^1000000000.0$|^1000000000.00$|^[+]{0,1}(\d{0,9})$|^[+]{0,1}(\d{0,9}\.\d{1,2})$/,
                message: ' 请输入 0-10亿 的正数，可保留两位小数',
                trigger: 'blur',
            },
            { required: true, message: "保理融资额度金额不能为空", trigger: "blur" }
        ],
        businessType: [
            { required: true, message: "业务类型不能为空", trigger: "change" }
        ],
        financeLimitPeriod: [
            { required: true, message: "保理融资额度期限不能为空", trigger: "blur" }
        ],
        financeLimitType: [
            { required: true, message: "保理融资额度类型不能为空", trigger: "change" }
        ],
        contractType: [
            { required: true, message: "合同类型不能为空", trigger: "change" }
        ],

        creditEnhancementMethod: [
            { required: true, message: "增信措施不能为空", trigger: "blur" }
        ],
        normalTermInterestRate: [
            { required: true, message: "正常期利率不能为空", trigger: "blur" }
        ],
        factoringPeriod: [
            { required: true, message: "保理期不能为空", trigger: "blur" }
        ],

        gracePeriodInterestRate: [
            { required: true, message: "宽限期利率不能为空", trigger: "blur" }
        ],
        gracePeriod: [
            { required: true, message: "宽限期不能为空", trigger: "blur" }
        ],

        defaultInterestRate: [
            { required: true, message: "违约利率不能为空", trigger: "blur" }
        ],
        principalRepaymentMethod: [
            { required: true, message: "本金偿还方式不能为空", trigger: "change" }
        ],
        interestPaymentMethod: [
            { required: true, message: "付息方式不能为空", trigger: "change" }
        ],
        interestPayer: [
            { required: true, message: "付息方不能为空", trigger: "change" }
        ],
        managementRate: [
            { required: true, message: "管理费率不能为空", trigger: "blur" }
        ],
        managementPaymentMethod: [
            { required: true, message: "管理费支付方式不能为空", trigger: "blur" }
        ],
        payingParty: [
            { required: true, message: "付费方不能为空", trigger: "blur" }
        ],
        confirmationMethod: [
            { required: true, message: "确权方式不能为空", trigger: "blur" }
        ],
        supplementaryInformation: [
            { required: true, message: "项目方案补充信息不能为空", trigger: "blur" }
        ],

        settlementAccount: [
            { required: true, message: "结算账户不能为空", trigger: "blur" }
        ],
        accountsReceivableScale: [{
            pattern: /^1000000000$|^1000000000.0$|^1000000000.00$|^[+]{0,1}(\d{0,9})$|^[+]{0,1}(\d{0,9}\.\d{1,2})$/,
            message: ' 请输入 0-10亿 的正数，可保留两位小数',
            trigger: 'blur',
        },
        { required: true, message: "应收账款规模不能为空", trigger: "blur" }
        ],
        paybackMode: [
            { required: true, message: "结算方式不能为空", trigger: "change" }
        ],
        creditLimit: [
            {
                pattern: /^1000000000$|^1000000000.0$|^1000000000.00$|^[+]{0,1}(\d{0,9})$|^[+]{0,1}(\d{0,9}\.\d{1,2})$/,
                message: ' 请输入 0-10亿 的正数，可保留两位小数',
                trigger: 'blur',
            },
            { required: true, message: "授信额度（元）不能为空", trigger: "blur" }
        ],
        lendingDate: [
            { required: true, message: "预计放款日期不能为空", trigger: "change" }
        ],
        financingTerm: [


            { required: true, message: "融资期限（天）不能为空", trigger: "blur" }
        ],
        financingRatio: [
            {
                pattern: /^([0-9]\d{0,1}|100$)(\.\d{1,2})?$/,
                message: '请输入 0-100 的数字，可保留两位小数',
                trigger: 'blur',
            },
            { required: true, message: "保理融资比例不能为空", trigger: "blur" }
        ],
        creditLimitStartDate: [
            { required: true, message: "授信额度期限开始日期不能为空", trigger: "change" }
        ],
        creditLimitEndDate: [
            { required: true, message: "访谈结束时间不能为空", trigger: "change" }
        ],
    },//验证规律

    elementlist: [{
        title: "业务类型",
        value: ["businessType", "businessTypeOther"],
        dict: proj_dd_type,
        type: "option",
        dictLength: 6,
    }, {
        title: "保理融资额度金额",
        value: ["financeLimitAmount"],
        type: "price",
        suffix: "万元"
    }, {
        title: "保理融资额度期限",
        value: ["financeLimitPeriod"],
        type: "input",
        suffix: "个月"
    }, {
        title: "合同类型",
        value: ["contractType", "contractTypeOther"],
        dict: proj_dd_contract_type,
        type: "option",
        dictLength: 4,
    }, {
        title: "保理融资额度类型",
        value: ["financeLimitType"],
        dict: proj_dd_quota_type,
        type: "radio",
    }, {
        title: "增信措施",
        value: ["creditEnhancementMethod", "creditEnhancementMethodOther"],
        dict: proj_dd_credit_enhancement,
        type: "option",
        dictLength: 6,
    }, {
        title: "正常期利率",
        value: ["normalTermInterestRate"],
        type: "input",
        suffix: "%/年"

    }, {
        title: "保理期",
        value: ["factoringPeriod"],
        type: "input",
        suffix: "月"
    }, {
        title: "宽限期利率",
        value: ["gracePeriodInterestRate"],
        type: "input",
        suffix: "%/年"
    }, {
        title: "宽限期",
        value: ["gracePeriod"],
        type: "input",
        suffix: "日"
    }, {
        title: "违约利率",
        value: ["defaultInterestRate"],
        type: "input",
        suffix: "%/年"
    }, {
        title: "本金偿还方式",
        value: ["principalRepaymentMethod", "principalRepaymentMethodOther"],
        dict: proj_dd_capital_repay,
        type: "option",
        dictLength: 2,
    }, {
        title: "付息方式",
        value: ["interestPaymentMethod", "interestPaymentMethodOther"],
        dict: proj_dd_interest_payment,
        type: "option",
        dictLength: 5,
    }, {
        title: "付息方",
        value: ["interestPayer", "interestPayerOther"],
        dict: proj_dd_interest_payer,
        type: "option",
        dictLength: 4,
    }, {
        title: "管理费率",
        value: ["managementRate"],
        type: "input",
        suffix: "%/年"
    }, {
        title: "管理费支付方式",
        value: ["managementPaymentMethod", "managementPaymentMethodOther"],
        dict: proj_dd_management_fee,
        type: "option",
        dictLength: 5,
    }, {
        title: "付费方",
        value: ["payingParty", "payingPartyOther"],
        dict: proj_dd_management_fee_payer,
        type: "option",
        dictLength: 4,
    }, {
        title: "确权方式",
        value: ["confirmationMethod"],
        dict: proj_dd_confirmation,
        type: "radio",
    }, {
        title: "结算账户",
        value: ["settlementAccount"],
        dict: proj_dd_settlement_account,
        type: "radio",
    }],
    adjustListObject:{
        "createBy": null,
                    "createById": null,
                    "createTime": null,
                    "updateBy": null,
                    "updateById": null,
                    "updateTime": null,
                    "delFlag": 0,
                    "remark": null,
                    "adjustId": null,
                    "financeLimitAmount": null,
                    "financeLimitPeriod": null,
                    "financeLimitType": null,
                    "businessType": null,
                    "businessTypeOther": null,
                    "contractType": null,
                    "contractTypeOther": null,
                    "creditEnhancementMethod": null,
                    "creditEnhancementMethodOther": null,
                    "normalTermInterestRate": null,
                    "gracePeriodInterestRate": null,
                    "defaultInterestRate": null,
                    "managementRate": null,
                    "factoringPeriod": null,
                    "gracePeriod": null,
                    "principalRepaymentMethod": null,
                    "principalRepaymentMethodOther": null,
                    "interestPaymentMethod": null,
                    "interestPaymentMethodOther": null,
                    "interestPayer": null,
                    "interestPayerOther": null,
                    "managementPaymentMethod": null,
                    "managementPaymentMethodOther": null,
                    "payingParty": null,
                    "payingPartyOther": null,
                    "confirmationMethod": null,
                    "settlementAccount": null,
                    "supplementaryInformation": null,
                    "financeLimitAmountNew": null,
                    "financeLimitPeriodNew": null,
                    "financeLimitTypeNew": null,
                    "businessTypeNew": null,
                    "businessTypeOtherNew": null,
                    "contractTypeNew": null,
                    "contractTypeOtherNew": null,
                    "creditEnhancementMethodNew": null,
                    "creditEnhancementMethodOtherNew": null,
                    "normalTermInterestRateNew": null,
                    "gracePeriodInterestRateNew": null,
                    "defaultInterestRateNew": null,
                    "managementRateNew": null,
                    "factoringPeriodNew": null,
                    "gracePeriodNew": null,
                    "principalRepaymentMethodNew": null,
                    "principalRepaymentMethodOtherNew": null,
                    "interestPaymentMethodNew": null,
                    "interestPaymentMethodOtherNew": null,
                    "interestPayerNew": null,
                    "interestPayerOtherNew": null,
                    "managementPaymentMethodNew": null,
                    "managementPaymentMethodOtherNew": null,
                    "payingPartyNew": null,
                    "payingPartyOtherNew": null,
                    "confirmationMethodNew": null,
                    "settlementAccountNew": null,
                    "supplementaryInformationNew": null,
                    "status": null,
                    "adjustLoanList": []
                }
});

const { rules, elementlist , adjustListObject } = toRefs(dataScope);




let formData = ref({});//不能修改const 定义的数据
watch(props.adjustListObject, (newRoute) => {
	console.log(newRoute)
	if(newRoute){
		adjustListObject.value = newRoute;
	}
}, { immediate: true, deep: true });
watch(() => props.diligenceInfo, (newValue, oldValue) => {
    console.log(newValue);
    if (newValue) {
        formData.value = deepClone(newValue);

    }
    adjustListObject.value.dueId = formData.value.id;
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

// 多选框选中数据
function handleSelectionChange(selection) {
    ids.value = selection.map(item => item.loanNodeBasis);
    single.value = selection.length != 1;
    multiple.value = !selection.length;
}

function loanNodeBasisVisibleChange() {
    let selectedLoanList = []
    formData.value.loanList.map((item) => {
        if (item.loanNodeBasis) {
            selectedLoanList.push(item.loanNodeBasis);
        }

    })
    proj_dd_loan_basis.value.map((item) => {
        if (selectedLoanList.indexOf(item.value) == -1 || item.value == 15) {
            item.disabled = false;
        } else {
            item.disabled = true;
        }
    })
}
defineExpose({
    formData,
    validForm,
    adjustListObject
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
}</style>
  