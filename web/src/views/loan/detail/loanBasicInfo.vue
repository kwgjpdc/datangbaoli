<template>
    <div>
        <el-row :gutter="15" justify="center">
            <el-col :span="24" :xs="24">
                <el-form ref="elForm" :model="formData" :rules="rules" label-width="150px" :inline="true"
                    v-loading="loading" :disabled="props.routerQueryObj.viewFlag">



                    <el-collapse v-model="activeNames" @change="handleChange">


                        <el-collapse-item title="放款信息" name="0">
                            <el-form-item label="业务合同号" prop="otherContractNo">
                                <el-input v-model="props.loanInfo.contract.otherContractNo
" placeholder="系统自动生成" disabled
                                    :style="{ width: '240px' }" />
                            </el-form-item>

                            <el-form-item label="业务产品" prop="bussProduct">
                               
                                <el-select v-model="props.loanInfo.contract.bussProduct" filterable placeholder="请选择"
                                    :style="{ width: '240px' }" disabled>
                                    <el-option v-for="item in lend_buss_product" :key="item.value" :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="保理申请人" prop="factoringApplicantName">
                                <el-input v-model="props.loanInfo.factoringApplicantName" placeholder="系统自动生成" disabled
                                    :style="{ width: '240px' }" />
                            </el-form-item>
                            <el-form-item label="放款币种" prop="loanCurrency">
                                <el-select v-if="props.loanInfo.loan" v-model="props.loanInfo.loan.loanCurrency" filterable placeholder="请选择"
                                    :style="{ width: '240px' }" disabled>
                                    <el-option v-for="item in sys_currency_type" :key="item.value" :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                                <el-select v-else v-model="props.loanInfo.contract.otherCurrencyType" filterable placeholder="请选择"
                                    :style="{ width: '240px' }" disabled>
                                    <el-option v-for="item in sys_currency_type" :key="item.value" :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                                
                            </el-form-item>
                            <el-form-item label="放款编号" prop="loanNo">
                                <el-input v-model="props.loanInfo.loanNo" placeholder="系统自动生成" disabled
                                    :style="{ width: '240px' }" />
                            </el-form-item>
                            <el-form-item label="债务人" prop="agreeDebtorName">
                                <el-input v-model="props.loanInfo.contract.agreeDebtorName" placeholder="系统自动生成" disabled
                                    :style="{ width: '240px' }" />
                            </el-form-item>
                            <el-form-item label="应收账款同意书编号" prop="agreementNo">
                                <el-input v-model="props.loanInfo.agreementNo" placeholder="系统自动生成" disabled
                                    :style="{ width: '240px' }" />
                            </el-form-item>

                            <el-form-item label="已申请未受理金额" prop="applyNotAcceptAmount">
                                <el-input v-model="formData.applyNotAcceptAmount" placeholder="系统自动生成" disabled
                                    :style="{ width: '240px' }" />
                            </el-form-item>
                            <el-form-item label="最高可放款金额" prop="mostLoanAmount">
                                <el-input v-model="formData.mostLoanAmount" placeholder="系统自动生成" disabled
                                    :style="{ width: '240px' }" />
                            </el-form-item>
                            <el-form-item label="放款方式" prop="loanWay">
                                <el-select v-if="props.loanInfo.loan" v-model="props.loanInfo.loan.loanWay" placeholder="请选择"
                                    :style="{ width: '240px' }" disabled>
                                    <el-option v-for="item in cont_pay" :key="item.value" :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                                <el-select v-else v-model="props.loanInfo.contract.agreePay" placeholder="请选择"
                                    :style="{ width: '240px' }" disabled>
                                    <el-option v-for="item in cont_pay" :key="item.value" :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="利息收取方式" prop="baseChargeInterestWay">
                                <el-radio-group v-if="props.loanInfo.loan" v-model="props.loanInfo.loan.chargeInterestWay" :style="{ width: '240px' }" disabled>
                                            <el-radio v-for="dict in cont_interest_pay" :key="dict.value"
                                                :label="dict.value">{{ dict.label }}</el-radio>
                                        </el-radio-group>
                                        <el-radio-group v-else v-model="props.loanInfo.contract.baseChargeInterestWay" :style="{ width: '240px' }" disabled>
                                            <el-radio v-for="dict in cont_interest_pay" :key="dict.value"
                                                :label="dict.value">{{ dict.label }}</el-radio>
                                        </el-radio-group>
                            </el-form-item>
                            <el-form-item label="结息方式" prop="settleInterestWay">
                                <el-select v-if="props.loanInfo.loan"  v-model="props.loanInfo.loan.settleInterestWay" filterable placeholder="请选择"
                                    :style="{ width: '240px' }" disabled>
                                    <el-option v-for="item in cont_interest_settlement" :key="item.value"
                                        :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>
                                <el-select v-else  v-model="props.loanInfo.contract.baseSettleInterestWay" filterable placeholder="请选择"
                                    :style="{ width: '240px' }" disabled>
                                    <el-option v-for="item in cont_interest_settlement" :key="item.value"
                                        :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="利息扣收" prop="interestDeduction">
                                <el-input v-model="formData.interestDeduction" placeholder="系统自动生成" disabled
                                    :style="{ width: '240px' }" />
                            </el-form-item>
                            <el-form-item label="费用扣收" prop="feeDeduction">
                                <el-input v-model="formData.feeDeduction" placeholder="系统自动生成" disabled
                                    :style="{ width: '240px' }" />
                            </el-form-item>
                            <el-form-item label="单据号/发票号" prop="invoiceNumber">
                                <el-input v-model="formData.invoiceNumber" placeholder="系统自动生成" disabled
                                    :style="{ width: '240px' }" />
                            </el-form-item>
                            <el-form-item label="单据类型" prop="documentType">
                                <el-select v-model="formData.documentType" filterable placeholder="请选择"
                                    :style="{ width: '240px' }">
                                    <el-option v-for="item in lend_doc_type" :key="item.value" :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>

                            <el-form-item label="执行利率（%）" prop="strikeRate">
                                <el-input v-model="formData.strikeRate" placeholder="系统自动生成" disabled
                                    :style="{ width: '240px' }" />
                            </el-form-item>
                            <el-form-item label="宽限期利率（%）" prop="gracePeriodInterestRate">
                                <el-input v-model="formData.gracePeriodInterestRate" placeholder="系统自动生成" disabled
                                    :style="{ width: '240px' }" />
                            </el-form-item>
                            <el-form-item label="保理标的" prop="factoringTarget">
                                <el-select v-if="props.loanInfo.loan"  v-model="props.loanInfo.loan.factoringTarget" filterable placeholder="请选择"
                                    :style="{ width: '240px' }" disabled>
                                    <el-option v-for="item in lend_item" :key="item.value" :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>

                                <el-select v-else v-model="props.loanInfo.contract.baseItem" filterable placeholder="请选择"
                                    :style="{ width: '240px' }" disabled>
                                    <el-option v-for="item in lend_item" :key="item.value" :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>

                            </el-form-item>

                            <el-form-item label="预收利息" prop="interest">
                                <el-input v-model="formData.interest" placeholder="系统自动生成" 
                                    :style="{ width: '240px' }" />
                            </el-form-item>
                            <el-form-item label="预计放款日" prop="loanExpectDate">
                                <el-date-picker clearable v-model="formData.loanExpectDate" type="date"
                                    value-format="YYYY-MM-DD" placeholder="请选择预计放款日" :style="{ width: '240px' }">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item label="放款到期日" prop="loanExpireDate">
                                <el-date-picker clearable v-model="formData.loanExpireDate" type="date"
                                    value-format="YYYY-MM-DD" placeholder="请选择放款到期日" :style="{ width: '240px' }">
                                </el-date-picker>
                            </el-form-item>


                            <el-form-item label="宽限期天数" prop="gracePeriodInterestDay">
                                <el-input v-if="props.loanInfo.loan" v-model="props.loanInfo.loan.gracePeriodInterestDay" placeholder="系统自动生成" disabled
                                    :style="{ width: '240px' }" />
                                    <el-input v-else v-model="props.loanInfo.contract.baseGraceDays" placeholder="系统自动生成" disabled
                                    :style="{ width: '240px' }" />
                            </el-form-item>


                            <!-- <el-form-item label="转让区间" prop="transferList">
                                <el-date-picker clearable v-model="transferList" type="daterange" range-separator="-"
          start-placeholder="开始日期" end-placeholder="结束日期"
                                    value-format="YYYY-MM-DD" :style="{ width: '240px' }">
                                </el-date-picker>
                            </el-form-item> -->

                            <el-form-item label="转让区间，开始" prop="transferStart">
                                <!-- <el-date-picker clearable v-model="formData.transferStart" type="date"
                                    value-format="YYYY-MM-DD" placeholder="请输入转让区间，开始" :style="{ width: '240px' }">
                                </el-date-picker> -->
                                <el-input v-model="formData.transferStart" maxlength="32"
                                    :style="{ width: '240px' }" />
                            </el-form-item>
                            <el-form-item label="转让区间，结束" prop="transferEnd">
                                <!-- <el-date-picker clearable v-model="formData.transferEnd" type="date"
                                    value-format="YYYY-MM-DD" placeholder="转让区间，结束" :style="{ width: '240px' }">
                                </el-date-picker> -->
                                <el-input v-model="formData.transferEnd" maxlength="32"
                                    :style="{ width: '240px' }" />
                            </el-form-item> 

                            <el-form-item label="是否定向付款" prop="isDirect">


                                <el-radio-group v-model="formData.isDirect" :style="{ width: '240px' }">
                                            <el-radio v-for="dict in sys_yes_no" :key="dict.value"
                                                :label="dict.value">{{ dict.label }}</el-radio>
                                        </el-radio-group>
                              
                            </el-form-item>
							<el-form-item label="可转让金额" prop="transferAmount">
								<ElPriceInput  v-model:form="formData" prop="transferAmount" :width="240" :rules="rules" :placeholder="'请输入'">
								</ElPriceInput>
							</el-form-item>
                            <!-- <PriceInput v-model:form="formData" :width="240" label="可转让金额" prop="transferAmount"> -->
                                <!-- <template #suffix>
                                    <span> 万元 </span>
                                </template> -->
                            <!-- </PriceInput> -->
                            <!-- <el-form-item label="客户名称" prop="customerName">
                                <div @click="openDiagMulti('customerName')">
                                    <el-input v-model="formData.customerName" placeholder="请选择客户名称" readonly
                                        suffix-icon="el-icon-search" :style="{ width: '240px' }"></el-input>
                                </div>
                            </el-form-item> -->


                            <el-form-item label="收款账号" prop="paymentAccount" v-if="formData.isDirect=='N'">
                                <el-input v-model="formData.paymentAccount" oninput="value=value.replace(/[^0-9]/g,'')" maxlength="32" :style="{ width: '240px' }" />
                            </el-form-item>


                            <el-form-item label="定向付款人名称" prop="directName" v-if="formData.isDirect=='Y'">
                                <el-input v-model="formData.directName" placeholder="请输入定向付款人名称" maxlength="32"
                                    :style="{ width: '240px' }" />
                            </el-form-item>
                            <el-form-item label="定向付款账号开户行" prop="directBank" v-if="formData.isDirect=='Y'">
                                <el-input v-model="formData.directBank" placeholder="请输入定向付款账号开户行" clearable maxlength="32"
                                    :style="{ width: '240px' }" />
                            </el-form-item>
                            <el-form-item label="定向付款账号" prop="directAccount" v-if="formData.isDirect=='Y'">
                                <el-input v-model="formData.directAccount" placeholder="请输入定向付款账号" clearable maxlength="32"
                                    :style="{ width: '240px' }" />
                            </el-form-item>


                            <PriceInput v-model:form="formData" :width="240" label="实际入账金额" prop="actualAmountReceived"
                                :rules="rules">
                                <!-- <template #suffix>
                                    <span> 万元 </span>
                                </template> -->
                            </PriceInput>

                            <PriceInput v-model:form="formData" :width="240" label="本次申请放款金额" prop="loanAmountApply"
                                :rules="rules">
                                <!-- <template #suffix>
                                    <span> 万元 </span>
                                </template> -->
                            </PriceInput>

                            <el-form-item label="综合收益" prop="comprehensiveIncome">
                                <el-input v-model="formData.comprehensiveIncome" placeholder="请输入综合收益" oninput="value=value.replace(/[^0-9]/g,'')" maxlength="32" clearable  :style="{ width: '240px' }" />
                            </el-form-item>


                            <el-form-item label="备注" prop="remark">
                                <el-input v-model="formData.remark" type="textarea" placeholder="请输入备注" clearable maxlength="125" :style="{ width: '240px' }" />
                            </el-form-item>

                            <div class="header-button-operate" v-if="!props.routerQueryObj.viewFlag">
                                <el-button type="primary" @click="addAccountList()">新增</el-button>
                                
                            </div>

                            <el-table v-loading="loading" :data="formData.accountList"
                               style="margin-bottom: 50px;margin-top: 30px;">
                                <!-- <el-table-column type="selection" width="55" align="center" /> -->

                                <el-table-column label="序号" align="center" type="index" width="60" fixed />
                                <!-- <el-table-column label="oss上文件存储地址" align="center" prop="fileUrl" /> -->
                                <!-- factoringApplicantNo -->
                                <el-table-column label="账号类型" align="center" prop="accountType">
                                    <template #default="scope">
										<el-select v-model="scope.row.accountType" filterable placeholder="请选择账号类型"
										    :style="{ width: '240px' }">
										    <el-option v-for="item in cust_account_type" :key="item.value" :label="item.label"
										        :value="item.value">
										    </el-option>
										</el-select>
										<!-- <el-input v-model="scope.row.accountType" placeholder="请输入账号类型" clearable  :style="{ width: '240px' }" /> -->
                                    </template>
                                </el-table-column>
                                <el-table-column label="收支对象名称" align="center" prop="targetName" > 
                                    <template #default="scope">
                                    <el-input v-model="scope.row.targetName" placeholder="请输入收支对象名称" clearable  :style="{ width: '240px' }" />
                                    </template>
                                </el-table-column>
                                <el-table-column label="收支账号" align="center" prop="account" >
                                    <template #default="scope">
                                    <el-input v-model="scope.row.account" placeholder="请输入收支账号" clearable  :style="{ width: '240px' }" />
                                    </template>
                                    </el-table-column>
                                <el-table-column label="收支金额" align="center" prop="amount" >
                                    <template #default="scope">
										<ElPriceInput v-model:form="scope.row" prop="amount" :width="240" :placeholder="'请输入'"></ElPriceInput>
										<!-- <el-input v-model="scope.row.amount" placeholder="请输入收支金额" clearable  :style="{ width: '240px' }" /> -->
                                    </template>
                                    </el-table-column>
                                <el-table-column label="操作" width="240" align="center">
                                    <template #default="scope">
                                    <div class="button-display">
                                        <el-button type="primary" icon="Delete" link @click="deleteAccountList(scope.row)"></el-button>
                                    </div>
                                    </template>

                                </el-table-column>
                            </el-table>

                            <div class="header-button-operate" v-if="!props.routerQueryObj.viewFlag">
                                <el-button type="primary" @click="confirmSelect()">确定选择</el-button>
                                <el-button @click="selectVoucherList()">重新选择</el-button>
                            </div>

                            <el-table v-loading="loading" :data="props.loanInfo.voucherList" @selection-change="handleSelectionChange"
                                style="margin-bottom: 50px;margin-top: 30px;">
                                <el-table-column type="selection" width="55" align="center" :selectable="selectedVouFlagfun"  />

                                <el-table-column label="序号" align="center" type="index" width="60" fixed />
                                <!-- <el-table-column label="oss上文件存储地址" align="center" prop="fileUrl" /> -->
                                <!-- factoringApplicantNo -->
                                <el-table-column label="操作" width="240" align="center">
                                    <div class="button-display">
                                        <el-tag>凭证明细</el-tag>
                                        <el-tag style="margin-left:5px">单证查询</el-tag>
                                        <el-tag style="margin-left:5px">发票查询</el-tag>
                                    </div>

                                </el-table-column>
                                <el-table-column label="凭证号码" align="center" prop="voucherNo"> 
                                    <!-- <template #default="scope">
                                        <el-input v-model="scope.row.voucherNo" placeholder="请输入" clearable
                                            disabled></el-input>
                                    </template> -->
                                </el-table-column>
                                <el-table-column label="到期日" align="center" prop="dueDate" width="240">
                                    <template #default="scope">
                                        <span>{{ parseTime(scope.row.dueDate,'{y}-{m}-{d}') }}</span>
                                        <!-- <el-date-picker clearable
                                            v-model="scope.row.dueDate" type="date"
                                            value-format="YYYY-MM-DD" placeholder="请选择到期日">
                                        </el-date-picker> -->
                                    </template>
                                </el-table-column>
                                <el-table-column label="应收账款金额" align="center" prop="debtReceivableAmount">
                                    <template #default="scope">
										{{formatMoney(scope.row.debtReceivableAmount)}}
                                        <!-- <el-input v-model="scope.row.debtReceivableAmount" placeholder="请输入" clearable
                                            disabled></el-input> -->
                                    </template>
                                </el-table-column>
                                <el-table-column label="应收账款余额" align="center" prop="debtReceivableBalance">
                                    <template #default="scope">
										{{formatMoney(scope.row.debtReceivableBalance)}}
                                        <!-- <el-input v-model="scope.row.debtReceivableBalance" placeholder="请输入" clearable
                                            disabled></el-input> -->
                                    </template>
                                </el-table-column>
                                <el-table-column label="融资比例" align="center" prop="financingRatio">
                                    <!-- <template #default="scope">
                                        <el-input v-model="scope.row.financingRatio"
                                            placeholder="请输入" clearable></el-input>
                                    </template> -->
                                </el-table-column>
                                <el-table-column label="可融资金额" align="center" prop="voucherAmount">
                                    <template #default="scope">
										{{formatMoney(scope.row.voucherAmount)}}
                                       <!-- <el-input v-model="scope.row.voucherAmount"
                                            placeholder="请输入" clearable></el-input> -->
                                    </template>
                                </el-table-column>
                                <el-table-column label="可融资余额" align="center" prop="coalTon">
                                    <template #default="scope">
										{{formatMoney(scope.row.coalTon)}}
                                        <!-- <el-input v-model="scope.row.coalTon"
                                            placeholder="请输入" clearable type="number"></el-input> -->
                                    </template>
                                </el-table-column>
                                <el-table-column label="本次融资金额" align="center" prop="financingAmount">
									<template #default="scope">
										<ElPriceInput v-model:form="scope.row" prop="financingAmount" :placeholder="'请输入'"></ElPriceInput>
                                        <!-- <el-input v-model="scope.row.financingAmount"
                                            placeholder="请输入" clearable></el-input> -->
                                    </template>
                                </el-table-column>

                            </el-table>
                        </el-collapse-item>



                        <el-collapse-item title="费用信息" name="1">



                            <el-table v-loading="loading" :data="formData.feeList" v-if="formData.feeList && formData.feeList.length"
                               style="margin-bottom: 20px;">
                                <!-- <el-table-column type="selection" width="55" align="center" /> -->

                                <el-table-column label="序号" align="center" type="index" width="80" />
                                <el-table-column label="费用名目" align="center" prop="feeName">

                                    
                                </el-table-column>
                                <el-table-column label="是否本次收取" align="center" prop="isCharge" min-width="300">
                                    <template #default="scope">
                                        <el-select v-model="scope.row.isCharge" filterable placeholder="请选择"
                                             >
                                            <el-option v-for="item in sys_yes_no" :key="item.value" :label="item.label"
                                                :value="item.value">
                                            </el-option>
                                        </el-select>

                                    </template>
                                </el-table-column>
                                <el-table-column label="收费/支付对象" align="center" prop="customerName" min-width="300">
                                    <template #default="scope">
										<div @click="openDiagMulti('customerId')">
										    <el-input v-model="formData.customerName" placeholder="请选择客户名称" readonly
										        suffix-icon="el-icon-search" :style="{ width: '240px' }"></el-input>
										</div>
                                       <!-- <el-input v-model="scope.row.customerId"
                                            placeholder="请输入" clearable></el-input> -->
                                    </template>
                                </el-table-column>
                                <el-table-column label="收/支类型" align="center" prop="feeType" min-width="300">
                                    <!-- cont_fee_type -->
                                    <template #default="scope">
                                        <el-radio-group v-model="scope.row.feeType">
                                            <el-radio v-for="dict in cont_fee_type" :key="dict.value" :label="dict.value">{{
                                                dict.label }}</el-radio>
                                        </el-radio-group>
                                    </template>
                                </el-table-column>



                                <el-table-column label="支付方式" prop="feePayment" min-width="300">
                                    <!-- proj_dd_credit_enhancement -->
                                    <template #default="scope">
                                    <el-select v-model="scope.row.feePayment" filterable placeholder="请选择"
                                        :style="{ width: '115px' }">
                                        <el-option v-for="item in cont_fee_payment" :key="item.value" :label="item.label"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>
                                    <el-input v-model="scope.row.feePaymentOther" placeholder="请输入" clearable
                                        :style="{ width: '115px', marginLeft: '10px' }"
                                        :disabled="scope.row.feePayment!=4" />
                                    </template>
                                </el-table-column>

                                <el-table-column label="计费方式" align="center" prop="feebilling" min-width="300">
                                    <!-- cont_fee_type -->
                                    <template #default="scope">
                                        <el-radio-group v-model="scope.row.feebilling" >
                                            <el-radio v-for="dict in cont_fee_billing" :key="dict.value"
                                                :label="dict.value">{{ dict.label }}</el-radio>
                                        </el-radio-group>
                                    </template>
                                </el-table-column>


                                <el-table-column label="管理费金额/比例" align="center" prop="feeRate" width="300">
                                    <template #default="scope">
                                        <el-input v-model="scope.row.feeRate" placeholder="请输入" clearable maxlength="10" oninput="value=value.replace(/[^0-9]/g,'')"
                                            :style="{ width: '240px' }" />
                                    </template>
                                </el-table-column>


                            </el-table>
                        </el-collapse-item>
                    </el-collapse>


                    <attach-info id="attachInfo" ref="attachInfoRef" :commonFileList="formData.commonFileList"
                        :routerQueryObj="routerQueryObj" :loanId="loanId"></attach-info>
                </el-form>
            </el-col>
        </el-row>

        <DialogTableMulti v-model:multiQuery="multiQuery" v-model:open="multiQuery.open" v-model:tableData="tableDataMulti"
            v-model:prop="propMulti" @selectRow="selectRowMulti" @pageChange="pageChangeMulti" />
    </div>
</template>
<script setup>
import { formatMoney } from "@/utils/formatMoney"
import attachInfo from './loanAttachInfo.vue'
import { reactive, ref } from "vue";
import { deepClone } from "@/utils/index"
const { proxy } = getCurrentInstance();
import { listUser } from "@/api/system/user";
import { listInfo as getUserList } from "@/api/customer/index"
import useUserStore from '@/store/modules/user'
const props = defineProps({
    loanInfo: {
        type: Object,
        default: null,
    },
    // 新增为空
    loanId: {
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
        documentType: [
            { required: true, message: "单据类型不能为空", trigger: "change" }
        ],
        loanExpectDate: [
            { required: true, message: "预计放款日不能为空", trigger: "change" }
        ],
        loanExpireDate: [
            { required: true, message: "放款到期日不能为空", trigger: "change" }
        ],
        transferList: [
            { required: true, message: "转让区间不能为空", trigger: "change" }
        ],
        transferStart: [
            { required: true, message: "转让区间，开始不能为空", trigger: "change" }
        ],
        transferEnd: [
            { required: true, message: "转让区间，结束不能为空", trigger: "change" }
        ],
        paymentAccount: [
            { required: true, message: "收款账号不能为空", trigger: "blur" }
        ],
        directName: [
            { required: true, message: "定向付款人名称不能为空", trigger: "blur" }
        ],
        directBank: [
            { required: true, message: "定向付款账号开户行不能为空", trigger: "blur" }
        ],
        directAccount: [
            { required: true, message: "定向付款账号不能为空", trigger: "blur" }
        ],
        comprehensiveIncome: [
            { required: true, message: "综合收益不能为空", trigger: "blur" }
        ],
        transferAmount: [
            {
                pattern: /^1000000000$|^1000000000.0$|^1000000000.00$|^[+]{0,1}(\d{0,9})$|^[+]{0,1}(\d{0,9}\.\d{1,2})$/,
                message: ' 请输入 0-10亿 的正数，可保留两位小数',
                trigger: 'blur',
            },
            { required: true, message: "可转让金额不能为空", trigger: "blur" }
        ],
        actualAmountReceived:[
            {
                pattern: /^1000000000$|^1000000000.0$|^1000000000.00$|^[+]{0,1}(\d{0,9})$|^[+]{0,1}(\d{0,9}\.\d{1,2})$/,
                message: ' 请输入 0-10亿 的正数，可保留两位小数',
                trigger: 'blur',
            },
           
        ],
        loanAmountApply:[
            {
                pattern: /^1000000000$|^1000000000.0$|^1000000000.00$|^[+]{0,1}(\d{0,9})$|^[+]{0,1}(\d{0,9}\.\d{1,2})$/,
                message: ' 请输入 0-10亿 的正数，可保留两位小数',
                trigger: 'blur',
            },
           
        ],
    },//验证规律
});

const { rules } = toRefs(dataScope);
const transferList = ref([]);
const { lend_buss_product, cont_pay, sys_currency_type, cont_interest_pay, cont_interest_settlement, lend_doc_type, loan_item, sys_yes_no,cont_fee_type,cont_fee_payment, cont_fee_billing,cust_account_type} = proxy.useDict("lend_buss_product", "cont_pay", "sys_currency_type", "cont_interest_pay", "cont_interest_settlement", "lend_doc_type", "loan_item", "sys_yes_no","cont_fee_type","cont_fee_payment","cont_fee_billing","cust_account_type");//下拉框字典
let formData = ref({
                "createBy": null,
                "createById": null,
                "createTime": null,
                "updateBy": null,
                "updateById": null,
                "updateTime": null,
                "delFlag": 0,
                "remark": null,
                "id": null,
                "loanNo": null,
				"contract": null,
                "contractId": null,
                "debtId": null,
                "documentType": null,
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
                "paymentAccount": null,
                "actualAmountReceived": null,
                "loanAmountApply": null,
                "comprehensiveIncome": null,
                "status": null,
                "loanVoucherList": [
                ],
                "accountList":[],
                "commonFileList": []
            });//不能修改const 定义的数据

watch(() => props.loanInfo, (newValue, oldValue) => {
    if (newValue.loan) {
        formData.value = Object.assign(formData.value,deepClone(newValue.loan));
    }
    if(!formData.value.feeList || !formData.value.feeList.length) {
        formData.value.feeList = newValue.contract.feeList;
    }
   
}, { immediate: true, deep: true })


watch(() => transferList.value, (newValue, oldValue) => {
    console.log(transferList.value)
    formData.value.transferStart = newValue[0];
    formData.value.transferEnd =  newValue[1];
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
                // item.parentCustomerName = item.companyInfo.parentCustomerName;
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
    }else if(options == 'customerId'){
		multiQuery.value.title = "收费/支付对象";
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
    }else if (checkItemMult.value == 'customerId'){
		formData.value.customerName = rows.customerName
		formData.value.customerId = rows.customerNo
	}

}
// 多选框选中数据
function handleSelectionChange(selection) {
    ids.value = selection.map(item => item.voucherId);
    single.value = selection.length != 1;
    multiple.value = !selection.length;
}
let selectedVouFlag = ref(false)
function selectedVouFlagfun(){
    return selectedVouFlag.value == false;
}
function confirmSelect() {
    console.log(selectedVouFlag.value);
    selectedVouFlag.value = true;
}
function selectVoucherList() {
    selectedVouFlag.value = false;
}


function addAccountList() {

formData.value.accountList.push({
    indexCount: Math.random(),
    // loanId:
    accountType:null,
    targetName: null,
    account: null,
    amount: null,
});
}


function deleteAccountList(rows) {
const indexCount = rows ? [rows.loanId ? rows.loanId : rows.indexCount] : ids.value;
let jugeItem = 'loanId';
if (!rows.loanId) {
    jugeItem = 'indexCount';
}
indexCount.forEach((names) => {
    formData.value.accountList = formData.value.accountList.filter((item) => {
        return item[jugeItem] != names;
    })

})
}

// getUserSelectList();
defineExpose({
    formData,
    validForm,
    ids,
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
    justify-content: flex-start;
}
.button-display{
  display: flex;flex-wrap: wrap;
    justify-content: space-around;

    .el-button+.el-button {
        margin-left: 0;
    }
}
</style>
  