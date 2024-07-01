<template>
    <div>
        <el-row :gutter="15" justify="center">
            <el-col :span="24" :xs="24">
                <el-form ref="elForm" :model="formData" :rules="rules" label-width="140px" :inline="true"
                    v-loading="loading" :disabled="props.routerQueryObj.viewFlag">



                    <el-collapse v-model="activeNames" @change="handleChange">





                        <el-collapse-item title="财务报表" name="1">

                            <el-card class="box-card">
                                <el-form-item label="客户编号" prop="customerNo">
                                    <div @click="openDiag('customerNo')">
                                        <el-input v-model="formData.customerNo" placeholder="请选择客户编号" clearable
                                            :style="{ width: '240px' }" readonly  suffix-icon="el-icon-search"></el-input>
                                    </div>

                                </el-form-item>
                                <el-form-item label="客户名称" prop="customerName">
                                    <el-input v-model="formData.customerName" placeholder="请输入客户名称" clearable :style="{ width: '240px' }"
                                        disabled></el-input>

                                </el-form-item>
                                <el-form-item label="报表类型" prop="reportType">
                                    <!-- cust_report_type -->
                                    <el-select v-model="formData.reportType" filterable placeholder="请选择报表类型"
                                        :style="{ width: '240px' }">
                                        <el-option v-for="item in cust_report_type" :key="item.value" :label="item.label"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>

                                </el-form-item>
                               
                                <el-form-item label="财务周期（年）">
                                  
                                        <el-date-picker v-model="formData.reportYear" type="year" placeholder="请选择年" :style="{ width: '240px' }" />
                                   

                                </el-form-item>


                                <el-form-item label="财务周期（季）" v-if="formData.reportType &&formData.reportType ==2">
                                   
                                    
                                        <el-select v-model="formData.reportQuarter" class="m-2" placeholder="请选择季" :style="{ width: '240px' }">
                                            <el-option v-for="item in Array.from({length: 4}, (val, i) => i+1)" :key="item" :label="item"
                                                :value="item"  />
                                        </el-select>
                                    

                                </el-form-item>
                                <el-form-item label="财务周期（月）" v-if="formData.reportType &&formData.reportType ==1">
                                   
                                        <el-select v-model="formData.reportMonth" class="m-2" placeholder="请选择月" :style="{ width: '240px' }">
                                            <el-option v-for="item in Array.from({length: 12}, (val, i) => i+1)" :key="item" :label="item"
                                                :value="item" />
                                        </el-select>
                                    

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
import { listInfo as getUserList } from "@/api/customer/index"
const props = defineProps({
    reportInfo: {
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
const activeNames = ref(['1']);//tab打开状态
const loading = ref(false);
const dataScope = reactive({
    rules:
    {
        customerNo: [
            { required: true, message: "客户编号不能为空", trigger: "change" }
        ],
    },//验证规律
});

const { rules } = toRefs(dataScope);


const { cust_report_type } = proxy.useDict("cust_report_type");//下拉框字典

let formData = ref({});//不能修改const 定义的数据

watch(() => props.reportInfo, (newValue, oldValue) => {
    console.log(newValue);
    if (newValue) {
        formData.value = Object.assign({}, newValue);
        delete formData.value.commonFileList;
    }
    if( formData.value.reportYear) {
        formData.value.reportYear = new Date(formData.value.reportYear,1,1);
    }
   

  

}, { immediate: true, deep: true })


watch(() => formData.value.reportType, (newValue, oldValue) => {
    if(newValue == 2) {
        // 季
        formData.value.reportMonth = null;
    }else if(newValue == 3) {
        // 年
        formData.value.reportMonth = null;
   
        formData.value.reportQuarter = null;
    } else if (newValue == 1){
        // 月
        formData.value.reportQuarter = null;
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
                // item.parentCustomerName = item.companyInfo.parentCustomerName;
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
    if (options == 'customerNo') {
        multiQuery.value.title = "客户信息";
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
            // item.parentCustomerName = item.companyInfo.parentCustomerName;
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

    if (checkItem.value == 'customerNo') {
        formData.value.customerName = rows.customerName
        formData.value.customerNo = rows.customerNo
		formData.value.customerId = rows.customerId
    }
    // propMulti.value.forEach(element => {
    //   queryParams.value[element.value] = rows[element.value];
    // });


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
</style>
  