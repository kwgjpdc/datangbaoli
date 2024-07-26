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
                                        suffix-icon="el-icon-search" :style="{ width: '240px' }"></el-input>
                                </div>
                            </el-form-item>


                            <el-form-item label="审议编号" prop="dueNo">
                                <el-input v-model="formData.dueNo" placeholder="系统自动生成" disabled
                                    :style="{ width: '240px' }" />
                            </el-form-item>

                            <el-form-item label="项目名称" prop="name" v-if="!props.dilligenceId">
                                <el-input v-model="formData.name" placeholder="请输入项目名称" :style="{ width: '240px' }" maxlength="32" />
                            </el-form-item>


                            <el-form-item label="总期" prop="totalPeriod">
                                <el-input v-model="formData.totalPeriod" placeholder="系统自动生成" :style="{ width: '240px' }"
                                    disabled />
                            </el-form-item>
                            <el-form-item label="审议日期" prop="reviewDate">
                                <el-date-picker clearable v-model="formData.reviewDate" type="date"
                                    value-format="YYYY-MM-DD" placeholder="系统自动生成" :style="{ width: '240px' }" disabled>
                                </el-date-picker>
                            </el-form-item>

                            <el-form-item label="提交部门" prop="submitDepartment">
                                <el-select v-model="formData.submitDepartment" filterable placeholder="请选择"
                                    :style="{ width: '240px' }">
                                    <el-option label="业务部门" value="业务部门">
                                    </el-option>
                                </el-select>

                            </el-form-item>

                            <el-form-item label="年期" prop="currentYear">
                                <el-input v-model="formData.currentYear" placeholder="系统自动生成" :style="{ width: '240px' }"
                                    type="number" disabled />

                            </el-form-item>

                            <el-form-item label="保理融资额度到期日" prop="financeLimitExpireDate">
                                <el-date-picker clearable v-model="formData.financeLimitExpireDate" type="date"
                                    value-format="YYYY-MM-DD" placeholder="授信生效日期向后顺延365天" :style="{ width: '240px' }">
                                </el-date-picker>

                            </el-form-item>

                            <el-form-item label="主办人" prop="sponsor">
                                <div @click="openAddDialog()">
                                    <el-input v-model="formData.sponsorName" placeholder="请输入主办人" readonly
                                        suffix-icon="el-icon-search" :style="{ width: '240px' }"></el-input>
                                </div>
                                <el-input v-model="formData.sponsor" v-show="false" ></el-input>
                            </el-form-item>


                            <attach-info id="attachInfo" ref="attachInfoRef" :commonFileList="formData.commonFileList"
                                :routerQueryObj="routerQueryObj" :dilligenceId="dilligenceId"></attach-info>
                        </el-collapse-item>

                        <el-collapse-item title="保理项目方案要素" name="1">

                            <el-card class="box-card">

                                <el-form-item label="核心企业" prop="coreEnterpriseName">
                                    <!-- coreEnterpriseName -->
                                    <div @click="openDiagMulti('coreEnterpriseName')">
                                        <el-input v-model="formData.coreEnterpriseName" placeholder="请选择核心企业" clearable
                                            readonly suffix-icon="el-icon-search" :style="{ width: '240px' }"></el-input>
                                    </div>
                                </el-form-item>
                                <!-- factoringApplicantName -->
                                <el-form-item label="保理申请人" prop="factoringApplicantNo">
                                    <div @click="openDiagMulti('factoringApplicantName')">
                                        <el-input v-model="formData.factoringApplicantName" placeholder="请选择保理申请人" clearable
                                            readonly suffix-icon="el-icon-search" :style="{ width: '240px' }"></el-input>
                                    </div>
                                </el-form-item>
                                <!-- debtorName -->
                                <el-form-item label="债务人" prop="debtorNo">
                                    <div @click="openDiagMulti('debtorName')">
                                        <el-input v-model="formData.debtorName" placeholder="请选择保理债务人" clearable readonly
                                            suffix-icon="el-icon-search" :style="{ width: '240px' }"></el-input>
                                    </div>
                                </el-form-item>
                                <PriceInput v-model:form="formData" :width="240" label="保理融资额度金额" prop="financeLimitAmount"
                                    :rules="rules">
                                    <template #prefix>
                                        <span class="iconfont icon-tubiaozhizuomoban
" style="color: var(--el-input-icon-color,var(--el-text-color-placeholder));"></span>
                                    </template>
                                    <template #suffix>
                                        <span> 万元 </span>
                                    </template>
                                </PriceInput>
                                <el-form-item label="业务产品" prop="businessType">
                                    <!-- proj_dd_type -->

                                    <el-select v-model="formData.businessType" filterable placeholder="请选择"
                                        :style="{ width: '115px' }">
                                        <el-option v-for="item in proj_dd_type" :key="item.value" :label="item.label"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>

                                    <el-input v-model="formData.businessTypeOther" placeholder="请输入" clearable
                                        :style="{ width: '115px', marginLeft: '10px' }"
                                        :disabled="formData.businessType != 6" maxlength="32" />

                                </el-form-item>
                                <el-form-item label="保理融资额度期限" prop="financeLimitPeriod">
                                    <el-input v-model="formData.financeLimitPeriod" placeholder="请输入保理融资额度期限" clearable maxlength="9"
                                       oninput="value=value.replace(/[^0-9]/g,'')" :style="{ width: '240px' }" >
                                        <template #suffix>
                                            <span> 个月 </span>
                                        </template></el-input>
                                </el-form-item>
                                <el-form-item label="合同类型" prop="contractType">
                                    <!-- proj_dd_contract_type -->

                                    <el-select v-model="formData.contractType" filterable placeholder="请选择"
                                        :style="{ width: '115px' }">
                                        <el-option v-for="item in proj_dd_contract_type" :key="item.value"
                                            :label="item.label" :value="item.value">
                                        </el-option>
                                    </el-select>
                                    <el-input v-model="formData.contractTypeOther" placeholder="请输入" clearable
                                        :style="{ width: '115px', marginLeft: '10px' }"
                                        :disabled="formData.contractType != 4" maxlength="32" />

                                </el-form-item>
                                <el-form-item label="保理融资额度类型" prop="financeLimitType">
                                    <!-- <el-select v-model="formData.contracfinanceLimitTypetType" filterable placeholder="请选择"
                                        :style="{ width: '240px' }">
                                        <el-option v-for="item in proj_dd_quota_type" :key="item.value" :label="item.label"
                                            :value="item.value">
                                        </el-option>
                                    </el-select> -->
                                <el-radio-group v-model="formData.financeLimitType" :style="{ width: '240px' }">
                                        <el-radio v-for="item in proj_dd_quota_type" :key="item.value" :label="item.value"
                                           > {{ item.label }}</el-radio>

                                    </el-radio-group>
                                </el-form-item>
                                <el-form-item label="增信措施" prop="creditEnhancementMethod">
                                    <!-- proj_dd_credit_enhancement -->

                                    <el-select v-model="formData.creditEnhancementMethod" filterable placeholder="请选择"
                                        :style="{ width: '115px' }">
                                        <el-option v-for="item in proj_dd_credit_enhancement" :key="item.value"
                                            :label="item.label" :value="item.value">
                                        </el-option>
                                    </el-select>
                                    <el-input v-model="formData.creditEnhancementMethodOther" placeholder="请输入" clearable
                                        :style="{ width: '115px', marginLeft: '10px' }"
                                        :disabled="formData.creditEnhancementMethod != 6" maxlength="32" />
                                </el-form-item>

                                <el-form-item label="正常期利率" prop="normalTermInterestRate">
                                    <el-input v-model="formData.normalTermInterestRate" placeholder="请输入正常期利率" clearable
                                        oninput="value=value.replace(/[^0-9]/g,'')" :style="{ width: '240px' }" maxlength="9">
                                        <template #suffix>
                                            <span> %/年 </span>
                                        </template></el-input>
                                </el-form-item>
                                <el-form-item label="保理期" prop="factoringPeriod">
                                    <el-input v-model="formData.factoringPeriod" placeholder="请输入保理期" clearable oninput="value=value.replace(/[^0-9]/g,'')" maxlength="9"
                                        :style="{ width: '240px' }" >
                                        <template #suffix>
                                            <span>月</span>
                                        </template></el-input>
                                </el-form-item>
                                <el-form-item label="宽限期利率" prop="gracePeriodInterestRate">
                                    <el-input v-model="formData.gracePeriodInterestRate" placeholder="请输入宽限期利率" clearable oninput="value=value.replace(/[^0-9]/g,'')" maxlength="9"
                                         :style="{ width: '240px' }">
                                        <template #suffix>
                                            <span> %/年 </span>
                                        </template></el-input>
                                </el-form-item>
                                <el-form-item label="宽限期" prop="gracePeriod">
                                    <el-input v-model="formData.gracePeriod" placeholder="请输入宽限期" clearable oninput="value=value.replace(/[^0-9]/g,'')" maxlength="9"
                                        :style="{ width: '240px' }" >
                                        <template #suffix>
                                            <span> 日 </span>
                                        </template></el-input>
                                </el-form-item>
                                <el-form-item label="违约利率" prop="defaultInterestRate">
                                    <el-input v-model="formData.defaultInterestRate" placeholder="请输入违约利率" clearable maxlength="9"
                                        oninput="value=value.replace(/[^0-9]/g,'')" :style="{ width: '240px' }" @input="handleInput($event,'defaultInterestRate')">
                                        <template #suffix>
                                            <span> %/年 </span>
                                        </template></el-input>
                                </el-form-item>
                                <el-form-item label="本金偿还方式" prop="principalRepaymentMethod">
                                    <!-- proj_belong_company -->

                                    <el-select v-model="formData.principalRepaymentMethod" filterable placeholder="请选择"
                                        :style="{ width: '115px' }">
                                        <el-option v-for="item in proj_dd_capital_repay" :key="item.value"
                                            :label="item.label" :value="item.value">
                                        </el-option>
                                    </el-select>
                                    <el-input v-model="formData.principalRepaymentMethodOther" placeholder="请输入" clearable
                                        :style="{ width: '115px', marginLeft: '10px' }"
                                        :disabled="formData.principalRepaymentMethod != 2" maxlength="32" />

                                </el-form-item>
                                <el-form-item label="付息方式" prop="interestPaymentMethod">
                                    <!-- proj_belong_company -->

                                    <el-select v-model="formData.interestPaymentMethod" filterable placeholder="请选择"
                                        :style="{ width: '115px' }">
                                        <el-option v-for="item in proj_dd_interest_payment" :key="item.value"
                                            :label="item.label" :value="item.value">
                                        </el-option>
                                    </el-select>
                                    <el-input v-model="formData.interestPaymentMethodOther" placeholder="请输入" clearable
                                        :style="{ width: '115px', marginLeft: '10px' }"
                                        :disabled="formData.interestPaymentMethod != 5"  maxlength="32"/>

                                </el-form-item>
                                <el-form-item label="付息方" prop="interestPayer">

                                    <el-select v-model="formData.interestPayer" filterable placeholder="请选择"
                                        :style="{ width: '115px' }">
                                        <el-option v-for="item in proj_dd_interest_payer" :key="item.value"
                                            :label="item.label" :value="item.value">
                                        </el-option>
                                    </el-select>
                                    <el-input v-model="formData.interestPayerOther" placeholder="请输入" clearable
                                        :style="{ width: '115px', marginLeft: '10px' }"
                                        :disabled="formData.interestPayer != 4" maxlength="32"/>

                                </el-form-item>
                                <el-form-item label="管理费率" prop="managementRate">
                                    <el-input v-model="formData.managementRate" placeholder="请输入管理费率" clearable
                                        :style="{ width: '240px' }" maxlength="9">
                                        <template #suffix>
                                            <span> %/年 </span>
                                        </template></el-input>
                                </el-form-item>
                                <el-form-item label="管理费支付方式" prop="managementPaymentMethod">

                                    <el-select v-model="formData.managementPaymentMethod" filterable placeholder="请选择"
                                        :style="{ width: '115px' }">
                                        <el-option v-for="item in proj_dd_management_fee" :key="item.value"
                                            :label="item.label" :value="item.value">
                                        </el-option>
                                    </el-select>
                                    <el-input v-model="formData.managementPaymentMethodOther" placeholder="请输入" clearable
                                        :style="{ width: '115px', marginLeft: '10px' }"
                                        :disabled="formData.managementPaymentMethod != 5" maxlength="32" />
                                </el-form-item>
                                <el-form-item label="付费方" prop="payingParty">
                                    <!-- proj_belong_company -->

                                    <el-select v-model="formData.payingParty" filterable placeholder="请选择"
                                        :style="{ width: '115px' }">
                                        <el-option v-for="item in proj_dd_management_fee_payer" :key="item.value"
                                            :label="item.label" :value="item.value">
                                        </el-option>
                                    </el-select>
                                    <el-input v-model="formData.payingPartyOther" placeholder="请输入" clearable
                                        :style="{ width: '115px', marginLeft: '10px' }"
                                        :disabled="formData.payingParty != 4" maxlength="32" />

                                </el-form-item>

                                <div class="header-button-operate" v-if="!props.routerQueryObj.viewFlag">
                                    <el-button type="text" @click="handleAddLoanList()"
                                        v-hasPermi="['sys:file:export']">新增</el-button>
                                    <!-- <el-button type="primary" link @click="handleDeleteLoanList()" :disabled="single">删除</el-button> -->

                                </div>
                                <el-table v-loading="loading" :data="formData.loanList"
                                    @selection-change="handleSelectionChange" style="margin-bottom: 20px;">
                                    <!-- <el-table-column type="selection" width="55" align="center" /> -->

                                    <el-table-column label="序号" align="center" type="index" width="80" />
                                    <!-- <el-table-column label="oss上文件存储地址" align="center" prop="fileUrl" /> -->
                                    <el-table-column label="放款节点依据" align="center" prop="loanNodeBasis" min-width="500">
                                        <template #default="scope">
                                            <el-select v-model="scope.row.loanNodeBasis" filterable placeholder="请选择"
                                                :style="{ width: '315px' }" @visible-change="loanNodeBasisVisibleChange()">
                                                <el-option v-for="item in proj_dd_loan_basis" :key="item.value"
                                                    :label="item.label" :value="item.value" :disabled="item.disabled">
                                                </el-option>
                                            </el-select>
                                            <el-input v-model="scope.row.loanNodeBasisOther" placeholder="请输入" clearable maxlength="32"
                                                :style="{ width: '115px', marginLeft: '10px' }"
                                                :disabled="scope.row.loanNodeBasis != 15" />
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="放款比例" align="center" prop="loanRatio" width="300">
                                        <template #default="scope">
                                            <el-input v-model="scope.row.loanRatio" placeholder="请输入" clearable oninput="value=value.replace(/[^0-9]/g,'')" maxlength="32"
                                                :style="{ width: '240px' }" />
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="确权章" align="center" prop="confirmationSeal" min-width="500">
                                        <template #default="scope">
                                            <el-select v-model="scope.row.confirmationSeal" filterable placeholder="请选择"
                                                :style="{ width: '315px' }">
                                                <el-option v-for="item in proj_dd_confirmation_seal" :key="item.value"
                                                    :label="item.label" :value="item.value">
                                                </el-option>
                                            </el-select>
                                            <el-input v-model="scope.row.confirmationSealOther" placeholder="请输入" clearable
                                                :style="{ width: '115px', marginLeft: '10px' }" maxlength="32"
                                                :disabled="scope.row.confirmationSeal != 17" />
                                        </template>
                                    </el-table-column>

                                    <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                                        <template #default="scope">
                                            <el-button link type="primary" icon="Delete"
                                                @click="handleDeleteLoanList(scope.row)">删除</el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>



                                <el-form-item label="确权方式" prop="confirmationMethod">


                                    <!-- <el-select v-model="formData.confirmationMethod" filterable placeholder="请选择"
                                        :style="{ width: '240px' }">
                                        <el-option v-for="item in proj_dd_confirmation" :key="item.value"
                                            :label="item.label" :value="item.value">
                                        </el-option>
                                    </el-select> -->


                                   <el-radio-group v-model="formData.confirmationMethod" :style="{ width: '480px' }">
                                        <el-radio v-for="item in proj_dd_confirmation" :key="item.value" :label="item.value"
                > {{ item.label }}</el-radio>

                                    </el-radio-group>
                                </el-form-item>
                                <el-form-item label="结算账户" prop="settlementAccount">
                                    <!-- <el-select v-model="formData.settlementAccount" filterable placeholder="请选择"
                                        :style="{ width: '240px' }">
                                        <el-option v-for="item in proj_dd_settlement_account" :key="item.value"
                                            :label="item.label" :value="item.value">
                                        </el-option>
                                    </el-select> -->
                                     <el-radio-group v-model="formData.settlementAccount" :style="{ width: '240px' }">
                                        <el-radio v-for="item in proj_dd_settlement_account" :key="item.value"
                                            :label="item.value"> {{ item.label }}</el-radio>

                                    </el-radio-group>
                                </el-form-item>


                                <el-form-item label="项目方案补充信息" prop="supplementaryInformation">
                                    <el-input v-model="formData.supplementaryInformation" type="textarea"
                                        placeholder="请输入内容" :style="{ width: '240px' }" maxlength="255" />
                                </el-form-item>

                            </el-card>

                        </el-collapse-item>
                    </el-collapse>
                </el-form>
            </el-col>
        </el-row>

        <DialogTableMulti v-model:multiQuery="multiQuery" v-model:open="multiQuery.open" v-model:tableData="tableDataMulti"
            v-model:prop="propMulti" @selectRow="selectRowMulti" @pageChange="pageChangeMulti" />

        
        <!-- Dialog -->
        <DialogTableMulti 
            v-model:multiQuery="zhubanQuery" 
            v-model:open="zhubanQuery.open" 
            v-model:tableData="tableDataZhuban"
            v-model:prop="propZhuban" 
            @selectRow="selectRowZhuban" 
            @pageChange="pageChangeZhuban"
        />

    </div>
</template>
<script setup>
import attachInfo from './projDilAttachInfo.vue'
import { reactive, ref } from "vue";
import { deepClone } from "@/utils/index"
const { proxy } = getCurrentInstance();
import { listUser } from "@/api/system/user";
import { listInfo as getUserList } from "@/api/customer/index"
import { listAgroup } from "@/api/project/diligence.js"

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
const activeNames = ref(['1', '2', '0']);//tab打开状态
const single = ref(true);
const multiple = ref(true);
const ids = ref([]);
const loading = ref(false);
const dataScope = reactive({
    rules:
    {
        customerName:[
            { required: true, message: "客户名称不能为空", trigger: "change" }
        ],
        name:[
            { required: true, message: "项目名称不能为空", trigger: "change" }
        ],
        // totalPeriod: [
        //     { required: true, message: "总期不能为空", trigger: "blur" }
        // ],
        submitDepartment: [
            { required: true, message: "提交部门不能为空", trigger: "blur" }
        ],
        // reviewDate: [
        //     { required: true, message: "审议日期不能为空", trigger: "change" }
        // ],
        // currentYear: [
        //     { required: true, message: "年期不能为空", trigger: "blur" }
        // ],
        // financeLimitExpireDate: [
        //     { required: true, message: "保理融资额度到期日不能为空", trigger: "change" }
        // ],
        sponsorName: [
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
});

const { rules } = toRefs(dataScope);


const { proj_dd_type, proj_dd_contract_type, proj_dd_credit_enhancement, proj_dd_capital_repay, proj_dd_interest_payment, proj_dd_interest_payer, proj_dd_management_fee, proj_dd_management_fee_payer, proj_dd_confirmation, proj_dd_settlement_account, proj_dd_quota_type, proj_dd_loan_basis, proj_dd_confirmation_seal } = proxy.useDict("proj_dd_type", "proj_dd_contract_type", "proj_dd_credit_enhancement", "proj_dd_capital_repay", "proj_dd_interest_payment", "proj_dd_interest_payer", "proj_dd_management_fee", "proj_dd_management_fee_payer", "proj_dd_confirmation", "proj_dd_settlement_account", "proj_dd_quota_type", "proj_dd_loan_basis", "proj_dd_confirmation_seal");//下拉框字典

let formData = ref({});//不能修改const 定义的数据

watch(() => props.diligenceInfo, (newValue, oldValue) => {
    console.log(newValue);
    if (newValue) {
        formData.value = deepClone(newValue);

    }

    // if (!newValue.id) {
    //     setTimeout(() => {
    //         formData.value.submitDepartment = '业务部门';
    //         formData.value.businessType = proj_dd_type.value[0].value;
    //         formData.value.contractType = proj_dd_contract_type.value[0].value;
    //         formData.value.financeLimitType = proj_dd_quota_type.value[0].value;
    //         formData.value.principalRepaymentMethod = proj_dd_capital_repay.value[0].value;
    //         formData.value.interestPaymentMethod = proj_dd_interest_payment.value[0].value;
    //         formData.value.interestPayer = proj_dd_interest_payer.value[0].value;
    //         formData.value.managementPaymentMethod = proj_dd_management_fee.value[0].value;
    //         formData.value.payingParty = proj_dd_management_fee_payer.value[0].value;
    //         formData.value.confirmationMethod = proj_dd_confirmation.value[0].value;
    //         formData.value.settlementAccount = proj_dd_settlement_account.value[0].value;
    //         formData.value.creditEnhancementMethod = proj_dd_credit_enhancement.value[0].value;

    //     }, 1000)

    // }

}, { immediate: true, deep: true })

let userList = ref([]);
// 项目主办选择
function getUserSelectList() {
    if (!userList.value.length) {
        loading.value = true;
        listUser().then(res => {
            loading.value = false;
            res.rows.forEach(element => {
                element.userId = element.userId + "";
            });
            userList.value = res.rows;
        });
    }
    // useUserStore().getInfo().then(() => {
    //     userName.value =  useUserStore().name;
    //     formData.value.createBy  = userName.value;
    // })
}
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
const tableDataMulti = ref([]);
let checkItemMult = ref("")
let tableDataMultiCoreEnterpriseName = ref([]);
let totalMultiCoreEnterpriseName = ref(0);
let tableDataMultiOther = ref([]);
let totalDataMultiOther = ref(0);

// 打开用户信息选择框 请求用户信息
function openDiagMulti(options) {
    console.log(tableDataMulti.value);
    multiQuery.value.currentPage = 1;
    userParams.value.pageNum = 1;
    if (options == 'coreEnterpriseName' && tableDataMultiCoreEnterpriseName.value.length) {
        tableDataMulti.value = tableDataMultiCoreEnterpriseName.value;
        multiQuery.value.total = totalMultiCoreEnterpriseName.value;
        setDialogTitle(options);
        multiQuery.value.open = true;
    } else if (options != 'coreEnterpriseName' && tableDataMultiOther.value.length) {
        tableDataMulti.value = tableDataMultiOther.value;
        multiQuery.value.total = totalDataMultiOther.value;
        setDialogTitle(options);
        multiQuery.value.open = true;
    } else {
        if (options == 'coreEnterpriseName') {
            userParams.value.isCoreEnterprise = 1;
        } else {
            if(userParams.value.isCoreEnterprise) {
                delete userParams.value.isCoreEnterprise;
            }
             
        }
        loading.value = true;
        getUserList(userParams.value).then(response => {
            tableDataMulti.value = [];
            loading.value = 0;
            response.rows.map((item) => {
                // item.parentCustomerName = item.companyInfo.parentCustomerName;
                tableDataMulti.value.push(item)
                if (options == 'coreEnterpriseName') {
                    tableDataMultiCoreEnterpriseName.value.push(item);
                    totalMultiCoreEnterpriseName.value = response.total;
                } else {
                    tableDataMultiOther.value.push(item);
                    totalDataMultiOther.value =  response.total;
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
            // item.parentCustomerName = item.companyInfo.parentCustomerName;
            tableDataMulti.value.push(item)
        });
        multiQuery.value.total = response.total;
        setDialogTitle(options);
        multiQuery.value.open = true;
    });
}
// 选择了用户信息；
function selectRowMulti(rows) {
    // console.log(rows);

    if (checkItemMult.value == 'customerName') {
        formData.value.customerName = rows.customerName
        formData.value.customerNo = rows.customerNo
		formData.value.customerId = rows.customerId
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

function handleAddLoanList() {
    formData.value.loanList.push({
        indexCount: Math.random(),
        id: null,
        dueId: null,
        loanNodeBasis: null,
        loanNodeBasisOther: null,
        loanRatio: null,
        confirmationSeal: null,
        confirmationSealOther: null,
        createBy: null,
        createById: null,
        updateBy: null,
        updateById: null,
        delFlag: null,
        createTime: null,
        updateTime: null
    });
}
function handleDeleteLoanList(rows) {
    const indexCount = rows ? [rows.indexCount] : ids.value;
    // proxy.$modal.confirm('是否确认删除放款节点依据为"' + loanNodeBasis + '"的数据项？').then(function () {
    indexCount.forEach((names) => {
        formData.value.loanList = formData.value.loanList.filter((item) => {
            return item.indexCount != names;
        })

    })
    single.value = false;
    multiple.value = false;

    // }).catch((e) => { console.log(e) });
}
let loadingloanNodeBasisFilter = ref(false)
let proj_dd_loan_basis_filter = ref([]);

function loanNodeBasisFilter(query) {

    loadingloanNodeBasisFilter.value = true
    let selectedLoanList = []
    formData.value.loanList.map((item) => {
        if (item.loanNodeBasis) {
            selectedLoanList.push(item.loanNodeBasis);
        }
    })
    loadingloanNodeBasisFilter.value = false
    proj_dd_loan_basis.value.map((item) => {
        if (selectedLoanList.indexOf(item.value) == -1) {
            item.disabled = false;
        } else {
            item.disabled = true;
        }
    })

    if (query) {
        proj_dd_loan_basis_filter.value = proj_dd_loan_basis.value.filter((item) => {
            return item.label.toLowerCase().includes(query.toLowerCase())
        })
    }
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

// 监听input:number的字段长度问题
function handleInput(value,name,len = 32){
	// 如果输入长度超过5，截取前5位
	if (value.length > len) {
		formData.value[name] = value.slice(0, len);
	}
}

getUserSelectList();
defineExpose({
    formData,
    validForm,
});

// Dialog配置
let zhubanQuery = reactive({
    title: "应收账款",
    open: false,
    currentPage: 1,
    total: 1,
    pageSize: 10
});

// Dialog表格数据
const tableDataZhuban = ref([]);

// Dialog表格列头
const propZhuban = reactive([
    {
        label: "业务分组名称",
        value: "agroupName"
    }, 
    {
        label: "业务主办",
        value: "mainUserName"
    },
    {
        label: "业务辅办",
        value: "minorUserName"
    },
    {
        label: "分组区域",
        value: "agroupAreas"
    }
]);

// Dialog查询参数
const paramsZhuban = reactive({
    pageNum: 1,
    pageSize: 10,
});

// Dialog表格选中方法
function selectRowZhuban(rows) {
    formData.value.sponsorName = rows.mainUserName + "," + rows.minorUserName;
    formData.value.sponsor = rows.mainUserId + "," + rows.minorUserId;
}

// Dialog表格分页方法
function pageChangeZhuban(pageNum) {
    loading.value = true;
    paramsZhuban.pageNum = pageNum;
    listAgroup(paramsZhuban).then((response) => {
        tableDataZhuban.value = response.rows;
        zhubanQuery.total = response.total;
        zhubanQuery.open = true;
        loading.value = false;
    });
}

// 打开Dialog
function openAddDialog() {
    if (!tableDataZhuban.value.length) {
        loading.value = true;
        listAgroup(paramsZhuban).then((response) => {
            tableDataZhuban.value = response.rows;
            zhubanQuery.total = response.total;
            zhubanQuery.open = true;
            loading.value = false;
        });
    } else {
        zhubanQuery.open = true;
    }
}

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
  