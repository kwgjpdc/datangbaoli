<template>
    <div>
        <el-row :gutter="15" justify="center">
            <el-col :span="24" :xs="24">
                <el-form ref="elForm" :model="formData" :rules="rules" label-width="140px" :inline="true"
                    v-loading="loading" :disabled="props.routerQueryObj.viewFlag">
                    <el-collapse v-model="activeNames" @change="handleChange">
                        <el-collapse-item title="算法设计" name="1">
                            <!-- <el-card class="box-card">

                            <el-form ref="elFormbasic" :model="formData" :rules="rules" size="small" label-width="140px"
                                :inline="true">
                                
                            </el-form>
                        </el-card> -->
                            <el-card class="box-card">
                                <PriceInput v-model:form="formData" :width="240" label="授信额度(元)" prop="creditLimit"
                                    :rules="rules">
                                    <template #prefix>
                                        <span class="iconfont icon-tubiaozhizuomoban" style="color: var(--el-input-icon-color,var(--el-text-color-placeholder));"></span>
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
                                <el-form-item label=" 融资期限" prop="financingTerm">
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
    </div>
</template>
<script setup>
import { reactive, ref } from "vue";
const { proxy } = getCurrentInstance();
const props = defineProps({
    cacularInfo: {
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
const activeNames = ref(['1']);//tab打开状态
const loading = ref(false);
const dataScope = reactive({
    rules:
    {
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

// TODO
const { cust_interview_way, cust_customer_type, cust_customer_category } = proxy.useDict("cust_interview_way", "cust_customer_type", "cust_customer_category");//下拉框字典

let formData = ref({});//不能修改const 定义的数据
// TODO
watch(() => props.cacularInfo, (newValue, oldValue) => {
    console.log(newValue);
    if (newValue) {
        // formData.value = Object.assign({}, newValue);

        // delete formData.value.commonFileList;
        formData.value.creditLimit = newValue.creditLimit;
        formData.value.lendingDate = newValue.lendingDate;
        formData.value.financingTerm = newValue.financingTerm;
        formData.value.financingRatio = newValue.financingRatio;
        formData.value.creditLimitStartDate = newValue.creditLimitStartDate;
        formData.value.creditLimitEndDate = newValue.creditLimitEndDate;
    }



    // 下拉框默认选中第一个选项
    // proxy.$forceUpdate()
}, { immediate: true, deep: true })


function handleChange(val) {
    console.log(val);
}


// 表单验证
function validForm() {
    let result = false
    this.$refs['elForm'].validate((valid) => { console.log(valid); result = valid })
    return result
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
  