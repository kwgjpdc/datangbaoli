<template>
    <div>
        <el-row :gutter="15" justify="center">
            <el-col :span="24" :xs="24">
                <el-form ref="elForm" :model="formData" :rules="rules" label-width="150px" :inline="true"
                    v-loading="loading" :disabled="props.routerQueryObj.viewFlag">



                    <el-collapse v-model="activeNames" @change="handleChange">


                        <el-collapse-item title="基本信息" name="0">
                            <el-form-item label="放款编号" prop="loanNo">
                                <!-- <div @click="openDiagMulti('loanNo')"> -->
                                    <el-input v-model="formData.loanNo" placeholder="系统自动生成"  suffix-icon="search"
                                    :style="{ width: '240px' }" disabled />
                                <!-- </div> -->
                              
                            </el-form-item>

                            <el-form-item label="业务产品" prop="bussProduct">
                                <el-select v-model="formData.bussProduct" filterable placeholder="请选择"
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

                            <el-form-item label="费用扣收" prop="feeDeduction">
                                <el-select v-model="formData.feeDeduction" filterable placeholder="请选择"
                                    :style="{ width: '240px' }" disabled>
                                    <el-option v-for="item in cont_interest_pay" :key="item.value" :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>


                            <el-form-item label="放款方式" prop="loanWay">
                                <el-select v-model="formData.loanWay" filterable placeholder="请选择"
                                    :style="{ width: '240px' }" disabled>
                                    <el-option v-for="item in cont_pay" :key="item.value" :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>





                            <PriceInput v-model:form="formData" :width="240" label="放款金额" prop="loanAmountApply"
                                :rules="rules" disabled>
                                <!-- <template #suffix>
                                    <span> 万元 </span>
                                </template> -->
                            </PriceInput>

                            <PriceInput v-model:form="formData" :width="240" label="实际入账金额" prop="actualAmountReceived"
                                :rules="rules" disabled>
                                <!-- <template #suffix>
                                    <span> 万元 </span>
                                </template> -->
                            </PriceInput>
                            <el-form-item label="申请放款日" prop="createTime">
                                <el-date-picker clearable v-model="formData.createTime" type="date"
                                    value-format="YYYY-MM-DD" :style="{ width: '240px' }" disabled>
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item label="放款到期日" prop="loanExpireDate">
                                <el-date-picker clearable v-model="formData.loanExpireDate" type="date"
                                    value-format="YYYY-MM-DD" placeholder="请选择放款到期日" :style="{ width: '240px' }" disabled>
                                </el-date-picker>
                            </el-form-item>


                            <el-form-item label="宽限期天数" prop="gracePeriodInterestDay">
                                <el-input v-model="formData.gracePeriodInterestDay" placeholder="系统自动生成" disabled
                                    :style="{ width: '240px' }" />
                            </el-form-item>



                            <el-form-item label="放款日" prop="loanResult.loanDate">
                                <el-date-picker clearable v-model="formData.loanResult.loanDate" type="date"
                                    value-format="YYYY-MM-DD" placeholder="请选择放款日" :style="{ width: '240px' }">
                                </el-date-picker>
                            </el-form-item>



                            <el-form-item label="放款结果" prop="loanResult">
                                <el-select v-model="formData.loanResult.loanResult" filterable placeholder="请选择"
                                    :style="{ width: '240px' }">
                                    <el-option v-for="item in loan_result" :key="item.value" :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>




                            <el-form-item label="借据号" prop="documentNumber">
                                <el-input v-model="formData.loanResult.documentNumber" placeholder="请输入借据号"
                                    :style="{ width: '240px' }" maxlength="32" oninput="value=value.replace(/[^0-9]/g,'')"/>
                            </el-form-item>



                            <el-form-item label="收款账号" prop="paymentAccount">
                                <el-input v-model="formData.paymentAccount" :style="{ width: '240px' }" disabled />
                            </el-form-item>
                            <el-form-item label="放款账号" prop="loanResult.loanAccount">
                                <el-input v-model="formData.loanResult.loanAccount" placeholder="请输入放款账号" :style="{ width: '240px' }" maxlength="32" oninput="value=value.replace(/[^0-9]/g,'')" />
                            </el-form-item>




                            <el-form-item label="备注" prop="remark">
                                <el-input v-model="formData.remark" placeholder="请输入备注" clearable disabled
                                    :style="{ width: '240px' }" />
                            </el-form-item>







                        </el-collapse-item>



                        <el-collapse-item title="资金信息" name="1">



                            <div class="header-button-operate" v-if="!props.routerQueryObj.viewFlag">
                                <el-button @click="addItem('fundPoolNo')" type="primary">新增</el-button>
                                <el-button @click="delItems" :disabled="deleteIsDisabled">删除</el-button>
                                <el-button>查看</el-button>
                                <el-button>查看已维护数据</el-button>
                            </div>
                            <el-table :data="formData.fundList"
                                @selection-change="handleSelectionChange($event,'fundPoolNo')" style="margin-bottom: 50px;margin-top: 30px;">
                                <el-table-column type="selection" width="55" align="center" prop="choice" />


                                <el-table-column label="资金池编号" align="center" prop="fundPoolNo">

                                </el-table-column>
                                <el-table-column label="资金编号" align="center" prop="fundNo" />
                                <el-table-column label="资金来源" align="center" prop="fundResource" />
                                <el-table-column label="资金金额" align="center" prop="fundAmount" />
                                <el-table-column label="关联金额" align="center" prop="relatedAmount" />
                                <el-table-column label="到期日" align="center" prop="dueDate" />
                            </el-table>



                        </el-collapse-item>


                        <el-collapse-item title="票据信息" name="2">



                            <div class="header-button-operate" v-if="!props.routerQueryObj.viewFlag">
                                <el-button type="primary" @click="addItem('billNo')">新增</el-button>
                                <!-- <el-button>修改</el-button>
                                <el-button>删除</el-button> -->
                            </div>
                            <el-table :data="formData.loanResult.billList"
                                @selection-change="handleSelectionChange" style="margin-bottom: 50px;margin-top: 30px;">
                                <el-table-column type="selection" width="55" align="center" />


                                <el-table-column label="票据号码" align="center" prop="billNo">

                                </el-table-column>
                                <el-table-column label="开票金额" align="center" prop="billAmount">
									<template #default="scope">
										{{formatMoney(scope.row.billAmount)}}
									</template>
								</el-table-column>
                                <el-table-column label="出票日" align="center" prop="draftDate" />
                                <el-table-column label="到期日" align="center" prop="dueDate" />
                                <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                                    <template #default="scope">
                                        <el-button link type="primary" icon="Edit"
                                            @click="handleUpdate(scope.row, 'billNo')">修改</el-button>
                                        <el-button link type="primary" icon="Delete"
                                            @click="handleDelete(scope.row, 'billNo')">删除</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>



                        </el-collapse-item>


                        <el-collapse-item title="文件信息" name="2">



                            <div class="header-button-operate" v-if="!props.routerQueryObj.viewFlag">
                                <el-button type="primary" @click="addItem('fileNo')">新增</el-button>
                                <!-- <el-button>修改</el-button>
                                <el-button>删除</el-button> -->
                            </div>
                            <el-table  :data="formData.loanResult.fileList"
                                @selection-change="handleSelectionChange" style="margin-bottom: 50px;margin-top: 30px;">
                                <el-table-column type="selection" width="55" align="center" />


                                <el-table-column label="文件号" align="center" prop="fileNo">

                                </el-table-column>
                                <el-table-column label="开证金额" align="center" prop="issuingAmount">
									<template #default="scope">
										{{formatMoney(scope.row.issuingAmount)}}
									</template>
								</el-table-column>
                                <el-table-column label="开证日" align="center" prop="issueDate" />
                                <el-table-column label="到期日" align="center" prop="dueDate" />
                                <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                                    <template #default="scope">
                                        <el-button link type="primary" icon="Edit"
                                            @click="handleUpdate(scope.row, 'fileNo')">修改</el-button>
                                        <el-button link type="primary" icon="Delete"
                                            @click="handleDelete(scope.row, 'fileNo')">删除</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>



                        </el-collapse-item>
                        <!-- <attach-info id="attachInfo" ref="attachInfoRef" :commonFileList="formData.commonFileList"
                            :routerQueryObj="routerQueryObj" :loanId="loanId"></attach-info> -->
                        <el-collapse-item title="费用信息" name="3">



                            <div class="header-button-operate start">
                                本次放款费用
                            </div>
                            <el-table  :data="formData.loanResult.feeList" @selection-change="handleSelectionChange"
                                style="margin-bottom: 50px;margin-top: 30px;">


                                <el-table-column label="费用名目" align="center" prop="factoringApplicantName">

                                </el-table-column>
                                <el-table-column label="费用币种" align="center" prop="factoringApplicantName" />
                                <el-table-column label="尚欠金额" align="center" prop="factoringApplicantName" />
                                <el-table-column label="实际收取日" align="center" prop="factoringApplicantName" />
                                <el-table-column label="费用到期日" align="center" prop="factoringApplicantName" />
                                <el-table-column label="本次收取金额" align="center" prop="factoringApplicantName" />
                            </el-table>


                            <div class="header-button-operate start">
                                累计积欠费用
                            </div>
                            <el-table :data="debtInfo" @selection-change="handleSelectionChange"
                                style="margin-bottom: 50px;margin-top: 30px;">


                                <el-table-column label="费用名目" align="center" prop="factoringApplicantName">

                                </el-table-column>
                                <el-table-column label="费用币种" align="center" prop="factoringApplicantName" />
                                <el-table-column label="尚欠金额" align="center" prop="factoringApplicantName" />
                                <el-table-column label="实际收取日" align="center" prop="factoringApplicantName" />
                                <el-table-column label="费用到期日" align="center" prop="factoringApplicantName" />
                                <el-table-column label="本次收取金额" align="center" prop="factoringApplicantName" />

                            </el-table>



                        </el-collapse-item>

                    </el-collapse>



                </el-form>
            </el-col>
        </el-row>


        <el-dialog :title="title" v-model="open" width="800px" append-to-body>
            <el-form ref="resultRef" :model="form" :rules="rules" label-width="80px" style="justify-content:center;display: flex;
    flex-wrap: wrap;" inline>
				<template v-if="addType == 'fundPoolNo'">
					<el-table v-loading="loading" :data="fundList" style="width: 100%" border>
					  <el-table-column label="资金池编号" align="center" prop="fundNo" width="110" />
					  <el-table-column label="资金编号" align="center" prop="drawNo" width="110" />
					  <!-- <el-table-column label="资金来源" align="center" prop="fundResource" width="100" /> -->
					  <el-table-column label="资金来源" align="center" prop="fundResource" >
					    <template #default="scope">
					      <dict-tag :options="fund_resource" :value="scope.row.fundResource"/>
					    </template>
					  </el-table-column>
					  <el-table-column label="资金金额" align="center" prop="amount" width="100" />
					  <el-table-column label="关联金额" align="center" prop="availableAmount" width="100" />
					  <el-table-column label="到期日" align="center" width="120" prop="endDate" />
					  <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
					    <template #default="scope">
					      <el-button size="small" link type="primary" icon="EditOutline" @click="handleStartProcess(scope.row)">新增</el-button>
					    </template>
					  </el-table-column>
					</el-table>
					
					<pagination
					  v-show="fundTotal>0"
					  :total="fundTotal"
					  v-model:page="queryParams.pageNum"
					  v-model:limit="queryParams.pageSize"
					  @pagination="infoFundList"
					/>
				</template>
				
                <template v-if="addType == 'billNo'">
                    <el-form-item label="票据号码" prop="billNo">
                        <el-input v-model="form.billNo" placeholder="请输入票据号码" maxlength="64" oninput="value=value.replace(/[^0-9]/g,'')" :style="{ width: '240px' }" />
                    </el-form-item>

                    <!-- <el-form-item label="开票金额" prop="billAmount">
                        <el-input v-model="form.billAmount" placeholder="请输入开票金额" />
                    </el-form-item> -->
                    <PriceInput v-model:form="form" :width="240" label="开票金额" :placeholder="'请输入开票金额'"  prop="billAmount" :rules="rules">
                    </PriceInput>


                    <el-form-item label="出票日" prop="draftDate">
                        <el-date-picker clearable v-model="form.draftDate" type="date" value-format="YYYY-MM-DD"
                            placeholder="请选择出票日"  :style="{ width: '240px' }">
                        </el-date-picker>
                    </el-form-item>

                    <el-form-item label="到期日" prop="dueDate">
                        <el-date-picker clearable v-model="form.dueDate" type="date" value-format="YYYY-MM-DD"
                            placeholder="请选择到期日"  :style="{ width: '240px' }">
                        </el-date-picker>
                    </el-form-item>
                </template>

                <template v-if="addType == 'fileNo'">
                    <el-form-item label="文件号" prop="fileNo">
                        <el-input v-model="form.fileNo" placeholder="请输入文件号" maxlength="32" oninput="value=value.replace(/[^0-9]/g,'')" :style="{ width: '240px' }" />
                    </el-form-item>

                    <!-- <el-form-item label="开证金额" prop="issuingAmount">
                        <el-input v-model="form.issuingAmount" placeholder="请输入开证金额" />
                    </el-form-item> -->
                    <PriceInput v-model:form="form" :width="240" label="开证金额" :placeholder="'请输入开证金额'" prop="issuingAmount" :rules="rules">
                    </PriceInput>

                    <el-form-item label="开证日" prop="issueDate" >
                        <el-date-picker clearable v-model="form.issueDate" type="date" value-format="YYYY-MM-DD"
                            placeholder="请选择开证日"  :style="{ width: '240px' }">
                        </el-date-picker>
                    </el-form-item>

                    <el-form-item label="到期日" prop="dueDate"  >
                        <el-date-picker clearable v-model="form.dueDate" type="date" value-format="YYYY-MM-DD"
                            placeholder="请选择到期日" :style="{ width: '240px' }">
                        </el-date-picker >
                    </el-form-item>
                </template>

            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="primary" @click="submitForm" v-if="addType != 'fundPoolNo'">确 定</el-button>
                    <el-button @click="cancel">取 消</el-button>
                </div>
            </template>
        </el-dialog>

        <DialogTableMulti v-model:multiQuery="multiQuery" v-model:open="multiQuery.open" v-model:tableData="tableDataMulti"
            v-model:prop="propMulti" @selectRow="selectRowMulti" @pageChange="pageChangeMulti" />
    </div>
</template>
<script setup>
import { ElMessage } from 'element-plus'
import { formatMoney } from "@/utils/formatMoney"
import attachInfo from './allocResAttachInfo.vue'
import { reactive, ref } from "vue";
import { deepClone } from "@/utils/index"
import { listFundDrawInfo } from "@/api/fund/info";
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
// 表格选中行集合
let tableSelectionFund = reactive([]);
// 表格删除按钮状态
const deleteIsDisabled = ref(true);

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
        loanNo: [
            { required: true, message: "放款编号不能为空", trigger: "change" }
        ],
        // 
        loanExpireDate: [
            { required: true, message: "放款到期日不能为空", trigger: "change" }
        ],
        'loanResult.loanDate': [
            { required: true, message: "放款日不能为空", trigger: "change" }
        ],
        'loanResult.loanAccount': [
            { required: true, message: "放款账号不能为空", trigger: "blur" }
        ],
        // 票据信息弹窗校验：
        billNo: [
            { required: true, message: "票据号码不能为空", trigger: "blur" }
        ],
        billAmount: [
            {
                pattern: /^1000000000$|^1000000000.0$|^1000000000.00$|^[+]{0,1}(\d{0,9})$|^[+]{0,1}(\d{0,9}\.\d{1,2})$/,
                message: ' 请输入 0-10亿 的正数，可保留两位小数',
                trigger: 'blur',
            },
            { required: true, message: "开票金额不能为空", trigger: "blur" }
        ],
        draftDate: [
            { required: true, message: "出票日不能为空", trigger: "change" }
        ],
        dueDate: [
            { required: true, message: "到期日不能为空", trigger: "change" }
        ],
        // 文件信息弹窗校验
        fileNo: [
            { required: true, message: "文件号不能为空", trigger: "blur" }
        ],
        issuingAmount: [
            {
                pattern: /^1000000000$|^1000000000.0$|^1000000000.00$|^[+]{0,1}(\d{0,9})$|^[+]{0,1}(\d{0,9}\.\d{1,2})$/,
                message: ' 请输入 0-10亿 的正数，可保留两位小数',
                trigger: 'blur',
            },
            { required: true, message: "开证金额不能为空", trigger: "blur" }
        ],
        issueDate: [
            { required: true, message: "开证日不能为空", trigger: "change" }
        ],
       
    },//验证规律
    form: {},
});
const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    contractNo: null,
    coreEnterpriseName: null,
    accountDebtorName: null,
    factoringApplicantName:null,
    invoiceDate:null,
    dueDate:null,
    validFlag:null,
    status: null,
    params: {},
    contractStatus:null
  }
});
const fundTotal = ref(0);
const fundList = ref([]);

const { queryParams } = toRefs(data);
const { rules, form } = toRefs(dataScope);
const { lend_buss_product, cont_pay, sys_currency_type, cont_interest_pay, cont_interest_settlement, loan_doc_type, loan_item, sys_yes_no,loan_result,fund_resource } = proxy.useDict("lend_buss_product", "cont_pay", "sys_currency_type", "cont_interest_pay", "cont_interest_settlement", "loan_doc_type", "loan_item", "sys_yes_no","loan_result","fund_resource");//下拉框字典
let formData = ref({});//不能修改const 定义的数据

watch(() => props.loanInfo, (newValue, oldValue) => {
    console.log(newValue);
    if (newValue) {
        if (!newValue.loanResult) {
            newValue.loanResult = ref({
                loanDate: null,
                loanResult: null,
                documentNumber: null,
                loanAccount: null,
                fundList: [],
                billList: [],
                fileList: [],
            })
        }
        formData.value = deepClone(newValue);
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
function handleSelectionChange(selection,code) {
	if(code == 'fundPoolNo'){
		tableSelectionFund = selection
		deleteIsDisabled.value = !(selection.length > 0);
	}else{
		ids.value = selection.map(item => item.loanNodeBasis);
		single.value = selection.length != 1;
		multiple.value = !selection.length;
	}
}

let addType = ref('');//billNo,fileNo
// 表格新增事件
function addItem(type) {
    reset();
    addType.value = type;
    open.value = true;
    title.value = "新增";
	if(type == 'fundPoolNo'){
		title.value += '资金信息'
		infoFundList();
	}else if (type == 'billNo') {
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
                formData.value.loanResult[operateList.value] =  formData.value.loanResult[operateList.value].map((list) => {
                    if (list.indexCount == form.value.indexCount) {
                        console.log(list);
                        return deepClone(form.value);
                        
                    }
                    else {
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

function infoFundList() {
	listFundDrawInfo(queryParams.value).then((res)=>{
		fundList.value = res.rows;
		fundTotal.value = res.total;
	})
}
function handleStartProcess(row){
	proxy.$refs['resultRef'].validate(valid => {
		let operateList = ref('fundList');
		let newFundList = formData.value.fundList || [];
		for(var i in newFundList){
			if(newFundList[i].fundId == row.fundId && newFundList[i].fundDrawId && row.fundDrawId){
				ElMessage({ message: '资金信息已选择', type: 'error' })
				return;
			}
		}
		let msg = {
			fundPoolNo:row.fundNo,
			fundNo:row.drawNo,
			fundResource:row.fundResource,
			fundAmount:row.amount,
			relatedAmount:row.availableAmount,
			dueDate:row.endDate,
			fundId: row.fundId,
			fundDrawId: row.fundDrawId,
			choice: false
		}
		newFundList.push(msg);
		formData.value.fundList = newFundList;
		formData.value.loanResult[operateList.value] = newFundList;
		reset()
		open.value = false;
	})
}

function delItems(){
	// let selectFundList = formData.value.fundList;
	// console.log(selectFundList)
	proxy.$modal.confirm('是否确认删除选择的数据项？').then(() => {
	    tableSelectionFund.forEach((debt) => {
	        const index = formData.value.fundList.indexOf(debt);
	        if (index !== -1) {
	            formData.value.fundList.splice(index, 1);
				formData.value.loanResult["fundList"] = formData.value.fundList;
				console.log(formData.value.fundList)
	        }
	    });
	}).catch((e) => { 
	    console.log(e) 
	});
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
  