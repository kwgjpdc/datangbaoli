<template>
    <div>
        <el-row :gutter="15" justify="center">
            <el-col :span="24" :xs="24">
                <el-form ref="elForm" :model="formData" :rules="rules" label-width="140px" :inline="true"
                    v-loading="loading" :disabled="props.routerQueryObj.viewFlag">
                  
                      
                       
                    <el-collapse v-model="activeNames" @change="handleChange">


                        <el-collapse-item title="产品信息" name="0">
                            <el-form-item label="机构编码" prop="deptId">
                            <el-input v-model="formData.deptId" placeholder="请输入机构编码" disabled
                                :style="{ width: '240px' }" />
                        </el-form-item>
                        <el-form-item label="机构名称" prop="deptName" v-if="!props.projectId">
                            <el-input v-model="formData.deptName" placeholder="请输入机构名称" disabled
                                :style="{ width: '240px' }" />
                        </el-form-item>
                        <el-form-item label="保理业务发起方" prop="sponsor">
                            <!-- proj_sponsor -->
                            <el-select v-model="formData.sponsor" filterable placeholder="请选择"
                                :style="{ width: '240px' }">
                                <el-option v-for="item in proj_sponsor" :key="item.value" :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="内外部项目" prop="projectType">
                            <!-- proj_type -->
                            <el-select v-model="formData.projectType" filterable placeholder="请选择"
                                :style="{ width: '240px' }">
                                <el-option v-for="item in proj_type" :key="item.value" :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="客户名称" prop="sponsorCustomerName">
                            <div @click="openDiag('sponsorCustomerName')">
                                <el-input v-model="formData.sponsorCustomerName" placeholder="客户名称" clearable
                                    :style="{ width: '240px' }" readonly  suffix-icon="el-icon-search"></el-input>
                            </div>

                        </el-form-item>
                            </el-collapse-item>




                        <el-collapse-item title="项目信息" name="1">
                            <!-- <el-card class="box-card">

                            <el-form ref="elFormbasic" :model="formData" :rules="rules" size="small" label-width="140px"
                                :inline="true">
                                
                            </el-form>
                        </el-card> -->
                            <el-card class="box-card">
                                <el-form-item label="项目编号" prop="projectId">
                                    <el-input v-model="formData.projectId" placeholder="项目编号保存后生成" clearable
                                        :style="{ width: '240px' }" disabled></el-input>
                                </el-form-item>
                                <el-form-item label="项目开始日期" prop="projectBeginDate">
                                    <el-date-picker clearable v-model="formData.projectBeginDate" type="date"
                                        value-format="YYYY-MM-DD" placeholder="请选择项目开始日期" :style="{ width: '240px' }">
                                    </el-date-picker>
                                </el-form-item>
                                <el-form-item label="项目名称" prop="projectName">
                                    <el-input v-model="formData.projectName" placeholder="请输入项目名称" clearable
                                        :style="{ width: '240px' }" />
                                </el-form-item>
                                <el-form-item label="项目来源" prop="projectSource">
                                    <el-select v-model="formData.projectSource" filterable placeholder="请选择"
                                        :style="{ width: '240px' }">
                                        <el-option v-for="item in proj_resource" :key="item.value" :label="item.label"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="来源人" prop="sourceName">
                                    <el-input v-model="formData.sourceName" placeholder="请输入来源人" clearable
                                        :style="{ width: '240px' }" />
                                </el-form-item>
                                <el-form-item label="项目归属公司" prop="projectBelongCompany">
                                    <!-- proj_belong_company -->
                                    <el-select v-model="formData.projectBelongCompany" filterable placeholder="请选择"
                                        :style="{ width: '240px' }">
                                        <el-option v-for="item in proj_belong_company" :key="item.value" :label="item.label"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <!-- firstChargeId -->
                                <el-form-item label="项目主办" prop="firstChargeName">
                                    <el-select v-model="formData.firstChargeName" multiple placeholder="请输入项目主办"
                                        :style="{ width: '240px' }" filterable>
                                        <el-option v-for="item in userList" :key="item.userId"
                                            :label="item.userName" :value="item.userName">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <!-- <el-form-item label="项目主办" prop="firstChargeName">
                                    <el-input v-model="formData.firstChargeName" placeholder="请输入项目主办" clearable
                                        :style="{ width: '240px' }" />
                                </el-form-item> -->
                                <!-- secondChargeId -->
                                <el-form-item label="项目协办" prop="secondChargeName">
                                    <el-select v-model="formData.secondChargeName" multiple placeholder="请输入项目协办"
                                        :style="{ width: '240px' }" filterable>
                                        <el-option v-for="item in userList" :key="item.userId"
                                            :label="item.userName" :value="item.userName">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="主/协办分摊比例" prop="ratio">
                                    <el-input v-model="formData.ratio" placeholder="请输入主/协办分摊比例" clearable
                                        :style="{ width: '240px' }" />
                                </el-form-item>
                                <el-form-item label="主营业务" prop="mainBusiness">
                                    <el-input v-model="formData.mainBusiness" placeholder="请输入主营业务" clearable
                                        :style="{ width: '240px' }" />
                                </el-form-item>
                                <PriceInput v-model:form="formData" :width="240" label="应收账款规模"
                                    prop="accountsReceivableScale" :rules="rules">
                                    <template #prefix>
                                        <span class="iconfont icon-tubiaozhizuomoban
" style="color: var(--el-input-icon-color,var(--el-text-color-placeholder));"></span>
                                    </template>
                                </PriceInput>

                                <el-form-item label="结算方式" prop="paybackMode">
                                    <!-- proj_payback_mode -->
                                    <el-select v-model="formData.paybackMode" filterable placeholder="请选择"
                                        :style="{ width: '240px' }">
                                        <el-option v-for="item in proj_payback_mode" :key="item.value" :label="item.label"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>


                                <el-form-item label="备注" prop="remark">
                                    <el-input v-model="formData.remark" type="textarea" placeholder="请输入内容"
                                        :style="{ width: '240px' }" />
                                </el-form-item>

                            </el-card>

                        </el-collapse-item>
                    </el-collapse>

                    <el-collapse v-model="activeNames" @change="handleChange">
                        <el-collapse-item title="算法设计" name="2">
                            <!-- <el-card class="box-card">

                            <el-form ref="elFormbasic" :model="formData" :rules="rules" size="small" label-width="140px"
                                :inline="true">
                                
                            </el-form>
                        </el-card> -->
                            <el-card class="box-card">
                                <PriceInput v-model:form="formData" :width="240" label="授信额度(元)" prop="creditLimit"
                                    :rules="rules">
                                    <template #prefix>
                                        <span class="iconfont icon-tubiaozhizuomoban
" style="color: var(--el-input-icon-color,var(--el-text-color-placeholder));"></span>
                                    </template>
                                </PriceInput>
                                <!-- <el-form-item label="授信额度" prop="creditLimit">
                                    <el-input v-model="formData.creditLimit" placeholder="请输入授信额度" clearable
                                        :style="{ width: '240px' }" ></el-input>
                                </el-form-item> -->
                                <el-form-item label="预计放款日期" prop="lendingDate">
                                    <el-date-picker clearable v-model="formData.lendingDate" type="date"
                                        value-format="YYYY-MM-DD" placeholder="请选择预计放款日期" :style="{ width: '240px' }">
                                    </el-date-picker>
                                </el-form-item>
                                <el-form-item label="融资期限（天）" prop="financingTerm">
                                    <el-input v-model="formData.financingTerm" placeholder="请输入融资期限（天）" type="number"
                                        :style="{ width: '240px' }" />
                                </el-form-item>
                                <el-form-item label="保理融资比例" prop="financingRatio">

                                    <el-input v-model="formData.financingRatio" :style="{ width: '240px' }"
                                        placeholder="请输入保理融资比例"> <template #suffix>
                                            <span class="iconfont icon-baifenbi"></span>
                                        </template>
                                    </el-input>

                                </el-form-item>
                                <el-form-item label="授信额度期限由" prop="creditLimitStartDate">
                                    <el-date-picker clearable v-model="formData.creditLimitStartDate" type="date"
                                        value-format="YYYY-MM-DD" placeholder="请选择授信额度期限开始日期" :style="{ width: '240px' }">
                                    </el-date-picker>
                                </el-form-item>
                                <el-form-item label="至" prop="creditLimitEndDate">
                                    <el-date-picker clearable v-model="formData.creditLimitEndDate" type="date"
                                        value-format="YYYY-MM-DD" placeholder=" 请选择授信额度期限结束日期" :style="{ width: '240px' }">
                                    </el-date-picker>
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
import { reactive, ref } from "vue";
const { proxy } = getCurrentInstance();
import { listUser } from "@/api/system/user";
import { listInfo as getUserList } from "@/api/customer/index"
import useUserStore from '@/store/modules/user'
const props = defineProps({
    projectInfo: {
        type: Object,
        default: null,
    },
    // 新增为空
    projectId: {
        type: String,
        default: "",
    },
    routerQueryObj: {
        type: Object,
        default: null,
    }

});
let multiQuery = ref({
    title: "卖方客户信息",//标题
    open: false,
    currentPage: 1,
    total: 1,
    pageSize: 10,
});
const propMulti = ref([{
    label: '客户编号',
    value: 'customerNo'
}, {
    label: '上级公司',
    value: "parentCustomerName"
}, {
    label: '客户名称',
    value: 'customerName'
}]);
const activeNames = ref(['1','2','0']);//tab打开状态
const loading = ref(false);
const dataScope = reactive({
    rules:
    {   sponsor: [
            { required: true, message: "保理业务发起方不能为空", trigger: "change" }
        ],
        projectType: [
            { required: true, message: "内外部项目不能为空", trigger: "change" }
        ],
        sponsorCustomerName: [
            { required: true, message: "卖方客户名称不能为空", trigger: "change" }
        ],
        projectBeginDate: [
            { required: true, message: "项目开始日期不能为空", trigger: "change" }
        ],
        projectName: [
            { required: true, message: "项目名称不能为空", trigger: "blur" }
        ],
        projectSource: [
            { required: true, message: "项目来源不能为空", trigger: "change" }
        ],
        projectBelongCompany: [
            { required: true, message: "项目归属公司不能为空", trigger: "change" }
        ],
        firstChargeName: [
            { required: true, message: "项目主办不能为空", trigger: "blur" }
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


const { proj_payback_mode, proj_resource, proj_belong_company ,proj_sponsor, proj_type} = proxy.useDict("proj_payback_mode", "proj_resource", "proj_belong_company","proj_sponsor", "proj_type");//下拉框字典

let formData = ref({});//不能修改const 定义的数据

watch(() => props.projectInfo, (newValue, oldValue) => {
    console.log(newValue);
    if (newValue) {
        formData.value = Object.assign({}, newValue);
        if (formData.value.firstChargeName && formData.value.firstChargeName.length) {
            formData.value.firstChargeName = formData.value.firstChargeName.split(',');
        } else {
            formData.value.firstChargeName = [];
        }
        if (formData.value.secondChargeName && formData.value.secondChargeName.length) {
            formData.value.secondChargeName = formData.value.secondChargeName.split(',');
        } else {
            formData.value.secondChargeName = [];
        }
        delete formData.value.commonFileList;
    }

    if (!props.projectId) {
        setTimeout(() => {
            formData.value.paybackMode = proj_payback_mode.value[0].value;
            formData.value.projectSource = proj_resource.value[0].value;
            formData.value.projectBelongCompany = proj_belong_company.value[0].value;
            formData.value.sponsor = proj_sponsor.value[0].value;
            formData.value.projectType = proj_type.value[0].value;
            formData.value.deptId = useUserStore().dept.deptId;
            formData.value.deptName = useUserStore().dept.deptName;
        }, 500)

    }

}, { immediate: true, deep: true })

let userList = ref([]);
// 项目主办选择
function getUserSelectList() {
    if (!userList.value.length) {
        loading.value = true;
        listUser().then(res => {
            loading.value = false;
            res.rows.forEach(element => {
                element.userId = element.userId+"";
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
const tableData = ref([]);
let checkItem = ref("")
// 打开用户信息选择框 请求用户信息
function openDiag(options) {
    console.log(tableData.value);
    if (!tableData.value.length) {
        loading.value = true;
        getUserList(userParams.value).then(response => {
            tableData.value = [];
            loading.value = false;
            response.rows.map((item) => {
                item.parentCustomerName = item.companyInfo.parentCustomerName;
                tableData.value.push(item)
            });
            multiQuery.value.total = response.total;

            setDialogTitle(options);
            multiQuery.value.open = true;
        });
    } else {
        setDialogTitle(options);
        multiQuery.value.open = true;
    }
    checkItem.value = options;
}
function setDialogTitle(options) {
    if (options == 'sponsorCustomerName') {
        multiQuery.value.title = "卖方客户信息";
    }
}
// 弹出用户信息分页处理
function pageChange(page) {
    userParams.value.pageNum = page;
    loading.value = true;

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
// 选择了用户信息；
function selectRow(rows) {
    console.log(rows);

    if (checkItem.value == 'sponsorCustomerName') {
        formData.value.sponsorCustomerName = rows.customerName
        formData.value.sponsorCustomerId = rows.customerId
    }
    // propMulti.value.forEach(element => {
    //   queryParams.value[element.value] = rows[element.value];
    // });


}
getUserSelectList();
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
</style>
  