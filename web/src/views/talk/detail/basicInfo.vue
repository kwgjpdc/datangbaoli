<template>
    <div>
        <el-row :gutter="15" justify="center">
            <el-col :span="24" :xs="24">
                <el-form ref="elForm" :model="formData" :rules="rules" label-width="140px" :inline="true"
                    v-loading="loading" :disabled="props.routerQueryObj.viewFlag">
                    <el-collapse v-model="activeNames" @change="handleChange">
                        <el-collapse-item title="基本信息" name="1">
                            <!-- <el-card class="box-card">

                            <el-form ref="elFormbasic" :model="formData" :rules="rules" size="small" label-width="140px"
                                :inline="true">
                                
                            </el-form>
                        </el-card> -->
                            <el-card class="box-card">
                                <el-form-item label="客户访谈记录编号" prop="interactNo">
                                    <el-input v-model="formData.interactNo" placeholder="客户访谈记录编号保存后生成" clearable
                                        :style="{ width: '240px' }" disabled></el-input>
                                </el-form-item>
                                <el-form-item label="访谈人" prop="createBy">
                                    <el-input v-model="formData.createBy" placeholder="请输入访谈人" disabled
                                        :style="{ width: '240px' }"></el-input>
                                </el-form-item>
                                <el-form-item label="客户编号" prop="customerNo">
                                    <div @click="openDiag('customerNo')">
                                        <el-input v-model="formData.customerNo" placeholder="请选择客户编号" clearable
                                            :style="{ width: '240px' }" readonly  suffix-icon="el-icon-search"></el-input>
                                    </div>
                                </el-form-item>
                                <el-form-item label="客户名称" prop="customerName">

                                    <el-input v-model="formData.customerName" :style="{ width: '240px' }"
                                        disabled></el-input>

                                </el-form-item>
                                <el-form-item label="项目编号" prop="projectNo">
                                    <div @click="openDiagMulti('projectNo')">
                                        <el-input v-model="formData.projectNo" placeholder="请选择项目编号" clearable
                                            :style="{ width: '240px' }" readonly  suffix-icon="el-icon-search"></el-input>
                                    </div>
                                    
                                </el-form-item>
                                <el-form-item label="项目名称" prop="projectName">
                                    <!-- <div @click="openDiagMulti('projectName')"> -->
                                        <el-input v-model="formData.projectName" placeholder="请选择项目名称" clearable
                                            :style="{ width: '240px' }" disabled></el-input>
                                    <!-- </div> -->
                                </el-form-item>
                                <el-form-item label="对方联系人" prop="contacts">
                                    <el-input v-model="formData.contacts" placeholder="请输入联系人"
                                        :style="{ width: '240px' }" />
                                </el-form-item>
                                <el-form-item label="联系方式" prop="contactsWay">
                                    <el-input v-model="formData.contactsWay" placeholder="请输入联系方式"
                                        :style="{ width: '240px' }" />
                                </el-form-item>
                                <el-form-item label="访谈日期" prop="interviewDate">
                                    <el-date-picker clearable v-model="formData.interviewDate" type="date"
                                        value-format="YYYY-MM-DD" placeholder="请选择访谈日期" :style="{ width: '240px' }">
                                    </el-date-picker>
                                </el-form-item>
                                <el-form-item label="访谈开始时间" prop="interviewStartTime">
                                    <el-time-picker v-model="formData.interviewStartTime" placeholder="选择访谈开始时间"
                                        :style="{ width: '240px' }" format="HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss">
                                    </el-time-picker>

                                </el-form-item>
                                <el-form-item label="访谈结束时间" prop="interviewEndTime">
                                    <el-time-picker v-model="formData.interviewEndTime" placeholder="选择访谈结束时间"
                                        :style="{ width: '240px' }" format="HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss">
                                    </el-time-picker>

                                </el-form-item>
                                <el-form-item label="摘要" prop="interactAbstract">
                                    <el-input v-model="formData.interactAbstract" placeholder="请输入摘要"
                                        :style="{ width: '240px' }" />
                                </el-form-item>
                                <el-form-item label="交互方式" prop="interviewWay">
                                    <!-- cust_interview_way -->
                                    <el-select v-model="formData.interviewWay" filterable placeholder="请选择"
                                        :style="{ width: '240px' }">
                                        <el-option v-for="item in cust_interview_way" :key="item.value" :label="item.label"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="访谈内容记录" prop="content">
                                    <el-input v-model="formData.content" type="textarea" placeholder="请输入内容"
                                        :style="{ width: '240px' }" />
                                </el-form-item>
                                <el-form-item label="通知范围" prop="noticeScope">
                                    <el-select v-model="formData.noticeScope" multiple placeholder="请选择"
                                        :style="{ width: '240px' }" filterable>
                                        <el-option v-for="item in userList" :key="item.userId"
                                            :label="item.userName" :value="item.userId">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-card>

                        </el-collapse-item>
                    </el-collapse>
                </el-form>
            </el-col>
        </el-row>
        <DialogTable v-model:open="opendialog" v-model:tableData="tableData" v-model:title="titleDia" :total=totalDia
            @selectRow="selectRow" @pageChange="pageChange" />
            <DialogTableMulti v-model:multiQuery="multiQuery" v-model:open="multiQuery.open" v-model:tableData="tableDataMulti"
            v-model:prop="propMulti" @selectRow="selectRowMulti" @pageChange="pageChangeMulti" />
    </div>
</template>
<script setup>
import useUserStore from '@/store/modules/user'
import { reactive, ref } from "vue";
import { listUser } from "@/api/system/user";
import { listInfo, getCustomerList } from "@/api/customer/index"
import { listProjInfo } from "@/api/project/info";
const { proxy } = getCurrentInstance();
const props = defineProps({
    interactInfo: {
        type: Object,
        default: null,
    },
    // 新增为空
    interactId: {
        type: String,
        default: "",
    },
    routerQueryObj:{
        type: Object,
        default: null,
    }

});
const activeNames = ref(['1']);//tab打开状态
const loading = ref(false);
let userList = ref([]);
const dataScope = reactive({
    rules:
    {
        // interactNo: [
        //     { required: true, message: "客户访谈记录编号不能为空", trigger: "blur" }
        // ],
        customerNo: [
            { required: true, message: "客户编号不能为空", trigger: "change" }
        ],
        contacts: [
            { required: true, message: "对方联系人不能为空", trigger: "blur" }
        ],
        interviewDate: [
            { required: true, message: "访谈日期不能为空", trigger: "blur" }
        ],
        interactAbstract: [
            { required: true, message: "摘要不能为空", trigger: "blur" }
        ],
        content: [
            { required: true, message: "访谈内容记录不能为空", trigger: "blur" }
        ],
        // interviewStartTime: [
        //     { required: true, message: "访谈开始时间不能为空", trigger: "blur" }
        // ],
        // interviewEndTime: [
        //     { required: true, message: "访谈结束时间不能为空", trigger: "blur" }
        // ]
    },//验证规律
});

const { rules } = toRefs(dataScope);
// 用户组件弹窗的变量
const totalDia = ref(0);
const titleDia = ref("客户信息");
const opendialog = ref(false);
const checkItem = ref("");
const tableData = ref([])
// TODO
const { cust_interview_way, cust_customer_type, cust_customer_category } = proxy.useDict("cust_interview_way", "cust_customer_type", "cust_customer_category");//下拉框字典

let formData = ref({});//不能修改const 定义的数据
let multiQuery = ref({
    title: "项目列表",//标题
    open: false,
    currentPage: 1,
    total: 1,
    pageSize: 10,
});
const propMulti = ref([{
    label: '项目编号',
    value: 'projectNo'
},{
    label: '项目名称',
    value: 'projectName'
}]);
// TODO
watch(() => props.interactInfo, (newValue, oldValue) => {
    console.log(newValue);
    if (newValue) {
        formData.value = Object.assign({}, newValue);
        if (formData.value.noticeScope && formData.value.noticeScope.length) {
            console.log(userList);
            formData.value.noticeScope = formData.value.noticeScope.split(',');
        } else {
            formData.value.noticeScope = [];
        }
        delete formData.value.warningList;
        delete formData.value.commonFileList;
    }

    if (!props.interactId) {
        formData.value.createBy = useUserStore().name;
        setTimeout(() => {
            formData.value.interviewWay = cust_interview_way.value[0].value;
        }, 500)

    }


    // 下拉框默认选中第一个选项
    // proxy.$forceUpdate()
}, { immediate: true, deep: true })


function handleChange(val) {
    console.log(val);
}
// 通知范围选择
function getUserList() {
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
// 用户组件请求信息
const userParams = ref({
    pageNum: 1,
    pageSize: 10,
})
// 打开用户信息选择框 请求用户信息
function openDiag(options) {
    console.log(tableData.value);

    if (!tableData.value.length) {
        loading.value = true;
        listInfo(userParams.value).then(response => {
            tableData.value = [];
            loading.value = false;
            response.rows.map((item) => {
                tableData.value.push({
                    userId: item.customerNo,
                    userName: item.customerName,
                })
            });
            totalDia.value = response.total;
            titleDia.value = "客户基本信息";
            opendialog.value = true;
        });
    } else {
        console.log(options)
        titleDia.value = "客户基本信息";
        opendialog.value = true;
    }
    checkItem.value = options;
}
// 弹出用户信息分页处理
function pageChange(page) {
    userParams.value.pageNum = page;
    loading.value = true;

    listInfo(userParams.value).then(response => {
        loading.value = false;
        tableData.value = [];
        response.rows.map((item) => {
            tableData.value.push({
                userId: item.customerNo,
                userName: item.customerName,
            })
        });
        totalDia.value = response.total;
        titleDia.value = "客户基本信息";
        opendialog.value = true;
    });
}
// 选择了用户信息；
function selectRow(rows) {
    console.log(checkItem.value);
    if (checkItem.value == 'customerNo') {
        formData.value[checkItem.value] = rows.userId;
        formData.value.customerName = rows.userName;
    }

}

// 用户组件请求信息
const userParamsMulti = ref({
    pageNum: 1,
    pageSize: 10,
})
const tableDataMulti = ref([]);
let checkItemMult = ref("")
// 打开用户信息选择框 请求用户信息
function openDiagMulti(options) {
    console.log(tableDataMulti.value);
    if (!tableDataMulti.value.length) {
        loading.value = true;
        listProjInfo(userParamsMulti.value).then(response => {
            tableDataMulti.value = [];
            loading.value = false;
            response.rows.map((item) => {
                
                tableDataMulti.value.push(item)
            });
            multiQuery.value.total = response.total;

            setDialogTitle(options);
            multiQuery.value.open = true;
        });
    } else {
        setDialogTitle(options);
        multiQuery.value.open = true;
    }
    checkItemMult.value = options;
}
function setDialogTitle(options) {
    if (options == 'sponsorCustomerName') {
        multiQuery.value.title = "卖方客户信息";
    }
}
// 弹出用户信息分页处理
function pageChangeMulti(page) {
    userParamsMulti.value.pageNum = page;
    loading.value = true;

    listProjInfo(userParamsMulti.value).then(response => {
        loading.value = false;
        tableDataMulti.value = [];
        response.rows.map((item) => {
            
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

    // if (checkItemMult.value == 'projectName') {
        formData.value.projectName = rows.projectName
        formData.value.projectNo = rows.projectNo
    // }
    // propMulti.value.forEach(element => {
    //   queryParams.value[element.value] = rows[element.value];
    // });


}
// 表单验证
function validForm() {
    let result = false
    this.$refs['elForm'].validate((valid) => { console.log(valid); result = valid })
    return result
}
getUserList();
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

}</style>
  