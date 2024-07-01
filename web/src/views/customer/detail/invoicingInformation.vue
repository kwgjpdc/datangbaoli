<template>
    <div>
        <el-row :gutter="15">
            <el-col :span="24" :xs="24">
                <el-collapse v-model="activeNames" @change="handleChange">
                    <el-collapse-item title="开票信息" name="1" :style="{fontWeight:700}">
                        <el-card class="box-card">
                            <el-form ref="elForm" :model="formData" :rules="rules"  label-width="140px"
                                :inline="true" :disabled="props.routerQueryObj.viewFlag">
                                <el-form-item label="纳税人类型" prop="invoiceInfo.taxpayerType">
                                    <el-select v-model="formData.invoiceInfo.taxpayerType" filterable placeholder="请选择" :style="{ width: '240px' }">
                                        <el-option v-for="item in cust_taxpayer_type" :key="item.value" :label="item.label"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>

                                </el-form-item>
                                <el-form-item label="发票抬头" prop="invoiceInfo.invoiceTitle">
                                    <el-input v-model="formData.invoiceInfo.invoiceTitle" placeholder="" clearable
                                        :style="{ width: '240px' }"></el-input>
                                </el-form-item>
                                
                                <el-form-item label="电话" prop="invoiceInfo.taxpayerPhoneNo">
                                    <el-input v-model="formData.invoiceInfo.taxpayerPhoneNo" placeholder="" clearable
                                        :style="{ width: '240px' }" type="tel"></el-input>
                                </el-form-item>
                                <el-form-item label="开户行名称" prop="invoiceInfo.bankName">
                                    <el-input v-model="formData.invoiceInfo.bankName" placeholder="" clearable
                                        :style="{ width: '240px' }"></el-input>
                                </el-form-item>
                                <el-form-item label="开户行账户" prop="invoiceInfo.bankAccountNo">
                                    <el-input v-model="formData.invoiceInfo.bankAccountNo" placeholder="" clearable
                                        :style="{ width: '240px' }"></el-input>
                                </el-form-item>
                                <el-form-item label="纳税人识别号" prop="invoiceInfo.taxpayerIdNo">
                                    <el-input v-model="formData.invoiceInfo.taxpayerIdNo" placeholder="" clearable
                                        :style="{ width: '240px' }"></el-input>
                                </el-form-item>
                                <el-form-item label="邮箱" prop="invoiceInfo.taxpayerEmail">
                                    <el-input v-model="formData.invoiceInfo.taxpayerEmail" placeholder="" clearable
                                        :style="{ width: '240px' }" type="email"></el-input>
                                </el-form-item>
                                <el-form-item label="地址" prop="invoiceInfo.taxpayerAddr">
                                    <el-input v-model="formData.invoiceInfo.taxpayerAddr" placeholder="" clearable
                                        :style="{ width: '240px' }"  autosize type="textarea"></el-input>
                                </el-form-item>

                                <el-form-item label="备注" prop="remark">
                                    <el-input v-model="formData.invoiceInfo.remark" placeholder="" clearable :style="{ width: '240px' }"
                                        autosize type="textarea"></el-input>
                                </el-form-item>
                            </el-form>
                        </el-card>
                    </el-collapse-item>
                </el-collapse>
            </el-col>
        </el-row>
    </div>
</template>
<script setup>
const { proxy } = getCurrentInstance();
const activeNames = ref(['1']);//tab打开状态
const props = defineProps({
    invoiceInfo: {
        type: Object,
        default: null,
    },
    customerId: {
        type:String,
        default:"",
    },routerQueryObj:{
        type: Object,
        default: null,
    }
});
const dataScope = reactive({
    // formData: {},
    rules:{invoiceInfo:
    {
        customerId: [
        { required: true, message: "客户id不能为空", trigger: "blur" }
    ],
    taxpayerType: [
        { required: true, message: "纳税人类型不能为空", trigger: "change" }
    ],
    invoiceTitle: [
        { required: true, message: "发票抬头不能为空", trigger: "blur" }
    ],
    taxpayerAddr: [
        { required: true, message: "纳税人地址不能为空", trigger: "blur" }
    ],
    taxpayerPhoneNo: [
        { required: true, message: "纳税人电话号码不能为空", trigger: "blur" }
    ],
    bankName: [
        { required: true, message: "开户行名称不能为空", trigger: "blur" }
    ],
    bankAccountNo: [
        { required: true, message: "开户行账号不能为空", trigger: "blur" }
    ],
    taxpayerIdNo: [
        { required: true, message: "纳税人识别号不能为空", trigger: "blur" }
    ],
    taxpayerEmail: [
        { required: true, message: "纳税人邮箱不能为空", trigger: "blur" }
    ],
    }},//验证规律
   
});


const {  rules } = toRefs(dataScope);
let formData = ref( 
    {invoiceInfo:{"invoiceId": "",
"customerId": "",
"taxpayerType": "",
"invoiceTitle": "",
"taxpayerAddr": "",
"taxpayerPhoneNo": "",
"bankName": "",
"bankAccountNo": "",
"taxpayerIdNo": "",
"taxpayerEmail": ""}

});//不能修改const 定义的数据

const {cust_taxpayer_type} = proxy.useDict("cust_taxpayer_type");//下拉框字典
watch(() => props.invoiceInfo, (newValue, oldValue) => {
    if(newValue) {
        
        formData.value.invoiceInfo = Object.assign({}, newValue);

    }
    if(!props.customerId) {
        setTimeout(()=>{
        formData.value.invoiceInfo.taxpayerType = cust_taxpayer_type.value[0].value;
        },500)
    }
}, { immediate: true, deep: true })

function handleChange(val) {
    console.log(val);
}
// 表单验证
function validForm() {
    let result = false
    this.$refs['elForm'].validate((valid) => {  console.log("inf" + valid);result = valid })
    return result
}
defineExpose({
formData,
  validForm,
});

</script>