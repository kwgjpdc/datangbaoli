<template>
    <div>
        <el-row :gutter="15">
            <el-col :span="24" :xs="24">
                <el-form ref="elForm" :model="formData"  label-width="140px" :inline="true">
                    <el-collapse v-model="activeNames" @change="handleChange">
                        <el-collapse-item title="联系方式" name="1">
                            <!--  联系方式表格-->
                            <el-card class="box-card">
                                <template #header v-if="!props.routerQueryObj.viewFlag">
                                    <!-- <span>联系方式</span> -->
                                    <el-button style="float: right; padding: 3px 0" type="primary" link
                                        @click="addContact()">新增</el-button>
                                    <el-button style="float: right; padding: 3px 0;margin-right: 20px;" type="primary" link
                                        @click="handleDelete()" :disabled="single">删除</el-button>
                                </template>
                                <el-table :data="formData.contactList" @selection-change="handleSelectionChange">
                                    <el-table-column type="selection" width="55" align="center" :disabled="props.routerQueryObj.viewFlag" />
                                    <el-table-column label="联系人姓名" align="center" prop="contactName" />
                                    <!-- <el-table-column label="地址" align="center" prop="contactAddr" /> -->
                                    <el-table-column label="电子邮箱" align="center" prop="contactEmail" />
                                    <el-table-column label="证件类型" align="center" prop="contactIdType">
                                        <template #default="scope">
                                            <dict-tag :options="sys_id_card_type" :value="scope.row.contactIdType" />
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="证件号码" align="center" prop="contactIdCardNo" />
                                    <el-table-column label="职务类别" align="center" prop="contactJobCategory">
                                        <template #default="scope">
                                            <dict-tag :options="cust_contact_job_category"
                                                :value="scope.row.contactJobCategory" />
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="电话" align="center" prop="contactPhoneNo" />
                                    <!-- <el-table-column label="职务" align="center" prop="contactJob" />
                                    <el-table-column label="建立关系日期" align="center" prop="establishDate" width="180">
                                        <template #default="scope">
                                            <span>{{ parseTime(scope.row.establishDate, '{y}-{m}-{d}') }}</span>
                                        </template>
                                    </el-table-column> -->
                                    <el-table-column label="操作" align="center" class-name="small-padding fixed-width" v-if="!props.routerQueryObj.viewFlag">
                                        <template #default="scope">
                                            <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
                                                v-hasPermi="['cust:contact:edit']" title="修改"></el-button>
                                            <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
                                                v-hasPermi="['cust:contact:remove']" title="删除"></el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>

                            </el-card>
                        </el-collapse-item>
                    </el-collapse>
                </el-form>
            </el-col>
        </el-row>
        <!-- 添加或修改用户配置对话框 -->
        <el-dialog title="联系方式" :model-value="openContactAdd" width="800px" @closed="closeContactAdd(false)">
            <el-form ref="formInput" label-width="110px" :model="contactFormInput" :rules="contactAddrules">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="联系人" prop="contactName">
                            <el-input placeholder="请输入联系人" maxlength="30" v-model="contactFormInput.contactName"
                                :style="{ width: '240px' }"></el-input>
                        </el-form-item>
                    </el-col>
                    <!-- <el-col :span="12">
                        <el-form-item label="客户端管理员" prop="isClientAdmin">
                            <el-select v-model="contactFormInput.isClientAdmin" filterable placeholder="请选择"
                                :style="{ width: '240px' }">
                                <el-option v-for="item in sys_true_or_false" :key="item.value" :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col> -->
                    <el-col :span="12">
                        <el-form-item label="证件类型" prop="contactIdType">
                            <el-select v-model="contactFormInput.contactIdType" filterable placeholder="请选择"
                                :style="{ width: '240px' }">
                                <el-option v-for="item in sys_id_card_type" :key="item.value" :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="证件号码 " prop="contactIdCardNo">
                            <el-input placeholder="请输入证件号码" maxlength="30" v-model="contactFormInput.contactIdCardNo"
                                :style="{ width: '240px' }"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="职务类别" prop="contactJobCategory">
                            <el-select v-model="contactFormInput.contactJobCategory" filterable placeholder="请选择"
                                :style="{ width: '240px' }">
                                <el-option v-for="item in cust_contact_job_category" :key="item.value" :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>

                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="电话" prop="contactPhoneNo">
                            <el-input placeholder="请输入联系电话" maxlength="30" v-model="contactFormInput.contactPhoneNo"
                                type="tel" :style="{ width: '240px' }"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="电子邮箱" prop="contactEmail">
                            <el-input placeholder="请输入电子邮箱" maxlength="30" v-model="contactFormInput.contactEmail"
                                type="email" :style="{ width: '240px' }"></el-input>
                        </el-form-item>
                    </el-col>
                    <!-- <el-col :span="12">
                        <el-form-item label="职务" prop="contactJob">
                            <el-input placeholder="请输入职务 " maxlength="30" v-model="contactFormInput.contactJob"
                                :style="{ width: '240px' }"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="建立关系日期" prop="establishDate">

                            <el-date-picker v-model="contactFormInput.establishDate" type="date" placeholder="请输入建立关系日期"
                                :size="small" :style="{ width: '240px' }" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="邮编" prop="postalCode">
                            <el-input placeholder="请输入邮编" maxlength="30" v-model="contactFormInput.postalCode"
                                :style="{ width: '240px' }"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="地址" prop="contactAddr">
                            <el-input placeholder="请输入地址" v-model="contactFormInput.contactAddr" clearable
                                :style="{ width: '240px' }" autosize type="textarea"></el-input>
                        </el-form-item>
                    </el-col> -->
                    <el-col :span="12">
                        <el-form-item>
                            <el-button type="primary" @click="saveContact">保存</el-button>
                            <el-button type="primary" @click="closeContactAdd(false)">取消</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>

        </el-dialog>
    </div>
</template>
<script setup>
import {deepClone} from "@/utils/index"
const { proxy } = getCurrentInstance();

const props = defineProps({
    contactList: {
        type: Array,
        default: [],
    }, customerId: {
        type: String,
        default: "",
    },routerQueryObj:{
        type: Object,
        default: null,
    }
});
const activeNames = ref(['1']);//tab打开状态
const ids = ref([]);
let openContactAdd = ref(false);//新增联系人弹窗
const single = ref(true);
const multiple = ref(true);
const dataScope = reactive({
  //验证规律
    contactAddrules: {
        // isClientAdmin: [
        //     { required: true, message: "请选择客户端管理员", trigger: "change" }
        // ],
        contactName: [
            { required: true, message: "联系人姓名不能为空", trigger: "blur" }
        ],
        contactEmail: [
            { required: true, message: "联系人电子邮箱不能为空", trigger: "blur" }
        ],
        contactIdType: [
            { required: true, message: "联系人证件类型不能为空", trigger: "change" }
        ],
        contactIdCardNo: [
            { required: true, message: "联系人证件号码不能为空", trigger: "blur" },
                // {
                //     pattern: /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[X])$)$/,
                //     message: ' 请输入正确的身份证号码',
                //     trigger: 'blur',
                // }
        ],
        contactJobCategory: [
            { required: true, message: "职务类别不能为空", trigger: "change" }
        ],
        contactPhoneNo: [
            { required: true, message: "联系电话不能为空", trigger: "blur" }
        ],
    }
});


const { contactAddrules } = toRefs(dataScope);
let formData = ref({

    "contactList": [
        {
            "createBy": "",
            "createTime": "",
            "updateBy": "",
            "updateTime": "",
            "delFlag": 0,
            "remark": "",
            "params": {
                "key": {}
            },
            "contactId": 0,
            "customerId": 0,
            "contactName": "",
            "contactAddr": "",
            "contactEmail": "",
            "contactIdType": "",
            "contactIdCardNo": "",
            "contactJobCategory": "",
            "contactPhoneNo": "",
            "contactJob": "",
            "establishDate": "",
            "postalCode": "",
            "isClientAdmin": ""
        }
    ],
});//不能修改const 定义的数据
let contactFormInput = ref({
    "contactId": 0,
    "customerId": 0,
    "contactName": "",
    "contactAddr": "",
    "contactEmail": "",
    "contactIdType": "",
    "contactIdCardNo": "",
    "contactJobCategory": "",
    "contactPhoneNo": "",
    "contactJob": "",
    "establishDate": "",
    "postalCode": "",
    "isClientAdmin": ""
})//后面要进行修改的对象用let定义
const {  sys_true_or_false, sys_id_card_type,  cust_contact_job_category } = proxy.useDict( "sys_true_or_false", "sys_id_card_type",  "cust_contact_job_category");//下拉框字典
watch(() => props.contactList, (newValue, oldValue) => {
    console.log(newValue);
    if(newValue) {
        formData.value.contactList = deepClone(newValue);
    }
    console.log(formData)
}, { immediate: true, deep: true })



function handleChange(val) {
    console.log(val);
}

// 联系人弹窗打开 
function addContact(row) {
    openContactAdd.value = true;
    console.log("row");
    console.log(row);
    if (!row) {
        //   初始化表单数据
        contactFormInput.value.isClientAdmin = sys_true_or_false.value[0].value;
        contactFormInput.value.contactJobCategory = cust_contact_job_category.value[0].value;
        contactFormInput.value.contactIdType = sys_id_card_type.value[0].value;

    } else {
        contactFormInput.value = row;
        contactFormInput.value.type = '1';
    }
}
// 多选框选中数据
function handleSelectionChange(selection) {
    ids.value = selection.map(item => item.contactName);
    single.value = selection.length != 1;
    multiple.value = !selection.length;
}

// 保存联系人到contactList
function saveContact() {
    proxy.$refs['formInput'].validate(valid => {
        if (!valid) {
            // proxy.$message("")
        } else {
            // TODO 提交表单
            if (contactFormInput.value.type) {
                // x修改
                formData.value.contactList.map((list) => {
                    if (list.contactName == contactFormInput.value.name) {
                        list = contactFormInput.value;
                    }
                })
            } else {
                formData.value.contactList.push(contactFormInput.value);
            }
            resetContactFormInput()
            openContactAdd.value = false;
        }

    })

}
// 重置添加联系人
function resetContactFormInput() {
    contactFormInput.value = {
        "contactId": 0,
        "customerId": 0,
        "contactName": "",
        "contactAddr": "",
        "contactEmail": "",
        "contactIdType": "",
        "contactIdCardNo": "",
        "contactJobCategory": "",
        "contactPhoneNo": "",
        "contactJob": "",
        "establishDate": "",
        "postalCode": "",
        "isClientAdmin": ""
    }
}
// 关闭联系人弹窗
function closeContactAdd() {
    openContactAdd.value = false;
    resetContactFormInput();
}
// 联系人表单修改
function handleUpdate(rows) {
    addContact(rows)
}
// 联系人从contactList中移除
function handleDelete(rows) {
    const contactNames = rows ? [rows.contactName] : ids.value;
    proxy.$modal.confirm('是否确认删除姓名为"' + contactNames + '"的数据项？').then(function () {
        contactNames.forEach((names) => {
            formData.value.contactList = formData.value.contactList.filter((item) => {
                return item.contactName != names;
            })

        })
        single.value = false;
        multiple.value = false;

    }).catch((e) => { console.log(e) });
}

// 暴露方法和formdata
defineExpose({
    formData,
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
  