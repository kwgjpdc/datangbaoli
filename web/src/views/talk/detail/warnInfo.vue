<template>
    <div>
        <el-row :gutter="15">
            <el-col :span="24" :xs="24">
                <el-form ref="elForm" :model="formData" :rules="rules" label-width="140px" :inline="true" :disabled="props.routerQueryObj.viewFlag">
                    <el-collapse v-model="activeNames" @change="handleChange">
                        <el-collapse-item title="预警信息" name="1">
                            <!--  联系方式表格-->
                            <el-card class="box-card">
                                <template #header v-if="!props.routerQueryObj.viewFlag">
                                    <!-- <span>联系方式</span> -->
                                    <el-button style="float: right; padding: 3px 0" type="primary" link
                                        @click="addContact()">新增</el-button>
                                    <el-button style="float: right; padding: 3px 0;margin-right: 20px;" type="primary" link
                                        @click="handleDelete()" :disabled="single">删除</el-button>
                                </template>
                                <el-table :data="formData.warningList" @selection-change="handleSelectionChange">
                                    <el-table-column type="selection" width="55" align="center" />
                                    <el-table-column label="预警流水号" align="center" prop="warningNo" />
                                    <!-- <el-table-column label="地址" align="center" prop="contactAddr" /> -->
                                    <!-- <el-table-column label="项目名称" align="center" prop="projectName" />
                                    <el-table-column label="客户名称" align="center" prop="customerName"> -->
                                    <!-- </el-table-column> -->
                                    <el-table-column label="预警类型" align="center" prop="warningType">
                                        <!-- cust_warning_status cust_warning_category cust_warning_type cust_warning_level -->
                                        <template #default="scope">
                                            <dict-tag :options="cust_warning_type" :value="scope.row.warningType" />
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="预警级别" align="center" prop="warningLevel">
                                        <template #default="scope">
                                            <dict-tag :options="cust_warning_level" :value="scope.row.warningCategory" />
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="预警分类名称" align="center" prop="warningCategory">
                                        <template #default="scope">
                                            <dict-tag :options="cust_warning_category" :value="scope.row.warningCategory" />
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="预警消息内容" align="center" prop="content"></el-table-column>
                                    <el-table-column label="预警状态" align="center" prop="status">
                                        <!-- cust_warning_status cust_warning_category -->
                                        <template #default="scope">
                                            <dict-tag :options="cust_warning_status" :value="scope.row.status" />
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="预警发起人" align="center" prop="createBy" />
                                    <el-table-column label="预警发起日期" align="center" prop="createTime" >
                                         <template #default="scope">
                                            <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
                                        </template>
                                    </el-table-column>
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
        <DialogTable v-model:open="open" v-model:tableData="tableData" v-model:title="title" :total=100 />
        <!-- 添加或修改用户配置对话框 -->
        <el-dialog :title="预警触发" :model-value="openWarnAdd" width="800px" @closed="closeWarnAdd(false)">
            <el-form ref="formInput" label-width="110px" :model="warnFormInput" :rules="warnAddrules" v-loading="loading">
                <el-row>
                    <el-col :span="12">
                        <!-- todo 新增默认值 -->
                        <el-form-item label="预警流水号" prop="warningNo">
                            <el-input placeholder="请输入预警流水号" maxlength="30" v-model="warnFormInput.warningNo"
                                :style="{ width: '240px' }" disabled></el-input>
                        </el-form-item>
                    </el-col>

                    <!-- <el-col :span="12">
                        <el-form-item label="当前机构" prop="deptId">
                            <el-input maxlength="30" v-model="warnFormInput.deptId" :style="{ width: '240px' }"
                                disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="客户名称 " prop="customerName">
                            <div @click="openDiag('customerName')">
                                        <el-input v-model="warnFormInput.customerName" placeholder="请选择客户名称" clearable
                                            :style="{ width: '240px' }" readonly></el-input>
                                    </div>
                           
                        </el-form-item>
                    </el-col> -->
                    <el-col :span="12">
                        <el-form-item label="项目名称" prop="projectName">
                            <div @click="openDiagMulti('projectName')">
                                        <el-input v-model="warnFormInput.projectName" placeholder="请选择项目名称" clearable
                                            :style="{ width: '240px' }" readonly  suffix-icon="el-icon-search"></el-input>
                                    </div>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="预警分类名称" prop="warningCategory">
                            <el-select v-model="warnFormInput.warningCategory" filterable placeholder="请选择"
                                :style="{ width: '240px' }">
                                <el-option v-for="item in cust_warning_category" :key="item.value" :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="预警类型" prop="warningType">
                            <el-select v-model="warnFormInput.warningType" filterable placeholder="请选择"
                                :style="{ width: '240px' }">
                                <el-option v-for="item in cust_warning_type" :key="item.value" :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="预警级别" prop="warningLevel">
                            <!-- cust_warning_level  -->
                            <el-select v-model="warnFormInput.warningLevel" filterable placeholder="请选择"
                                :style="{ width: '240px' }">
                                <el-option v-for="item in cust_warning_level" :key="item.value" :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="预警消息内容" prop="content">
                            <el-input placeholder="请输入预警消息内容" maxlength="30" v-model="warnFormInput.content" type="textarea"
                                :style="{ width: '240px' }"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item>
                            <el-button type="primary" @click="saveWarnItem">保存</el-button>
                            <el-button type="primary" @click="closeWarnAdd(false)">取消</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-dialog>
        <DialogTable v-model:open="opendialog" v-model:tableData="tableData" v-model:title="titleDia"  :total="totalDia" @selectRow="selectRow" @pageChange="pageChange"/>
        <DialogTableMulti v-model:multiQuery="multiQuery" v-model:open="multiQuery.open" v-model:tableData="tableDataMulti"
            v-model:prop="propMulti" @selectRow="selectRowMulti" @pageChange="pageChangeMulti" />
    </div>
</template>
<script setup>
const { proxy } = getCurrentInstance();
import {deepClone} from "@/utils/index"
import { listInfo } from "@/api/customer/index"
import { getWarningSeq } from "@/api/customer/warn"
import { listProjInfo } from "@/api/project/info";
const props = defineProps({
    warningList: {
        type: Array,
        default: [],
    }, 
    interactId: {
        type: String,
        default: "",
    },
    deptId: {
        type: Number,
        default: null,
    },
    routerQueryObj:{
        type: Object,
        default: null,
    }
});
// 用户组件弹窗的变量
const loading = ref(false);
const totalDia = ref(0);
const titleDia = ref("客户信息");
const opendialog = ref(false);
const checkItem = ref("");
const tableData = ref([]);
const title = ref("客户信息");
const open = ref(false);//选择客户信息弹窗
const activeNames = ref(['1']);//tab打开状态
const fileUrl = ref("");
const ids = ref([]);
let openWarnAdd = ref(false);//新增联系人弹窗
const total = ref(0);//表格页数
const single = ref(true);
const multiple = ref(true);
const dataScope = reactive({
    // formData: {},
    rules:
    {
        warningList: {
            // warningNo: [
            //     { required: true, message: "预警流水号不能为空", trigger: "blur" }
            // ],
            customerName: [
                { required: true, message: "客户名称不能为空", trigger: "blur" }
            ], 
            warningCategory: [
                { required: true, message: "预警分类名称不能为空", trigger: "blur" }
            ],
            warningType: [
                { required: true, message: "预警类型不能为空", trigger: "blur" }
            ],
            warningLevel: [
                { required: true, message: "预警级别不能为空", trigger: "blur" }
            ],
            content: [
                { required: true, message: "预警消息内容不能为空", trigger: "blur" }
            ],
        }
    },//验证规律
    warnAddrules: {
        // warningNo: [
        //     { required: true, message: "预警流水号不能为空", trigger: "blur" }
        // ],
        // customerName: [
        //     { required: true, message: "客户名称不能为空", trigger: "blur" }
        // ],
         warningCategory: [
            { required: true, message: "预警分类名称不能为空", trigger: "blur" }
        ],
        warningType: [
            { required: true, message: "预警类型不能为空", trigger: "blur" }
        ],
        warningLevel: [
            { required: true, message: "预警级别不能为空", trigger: "blur" }
        ],
        content: [
            { required: true, message: "预警消息内容不能为空", trigger: "blur" }
        ],
    },
    queryParams: {
         pageNum: 1,
      pageSize: 10,
      warningNo: null,
      deptId: null,
      customerId: null,
      customerName: null,
      projectId: null,
      projectName: null,
      warningCategory: null,
      warningType: null,
      warningLevel: null,
      status: null,
      content: null,
      createById: null,
      updateById: null,
    },//表格分页数据
});


const { warnAddrules, rules, queryParams } = toRefs(dataScope);
let formData = ref({

    "warningList": [
    
    ],
});//不能修改const 定义的数据
let warnFormInput = ref({
        warningId: null,
        warningNo: null,
        deptId: null,
        // customerId: null,
        customerName: null,
        projectId: null,
        projectName: null,
        warningCategory: null,
        warningType: null,
        warningLevel: null,
        status: null,
        content: null,
        createBy: null,
        createById: null,
        updateBy: null,
        updateById: null,
        updateTime: null,
        createTime: null,
        delFlag: null
    })//后面要进行修改的对象用let定义
const { cust_warning_status, cust_warning_category, cust_warning_type, cust_warning_level } = proxy.useDict("cust_warning_status", "cust_warning_category", "cust_warning_type", "cust_warning_level");//下拉框字典
watch(() => props.warningList, (newValue, oldValue) => {
    console.log(newValue);

    if(newValue){
        
        formData.value.warningList =deepClone(newValue)

    }

    // proxy.$forceUpdate()
    console.log(formData)
}, { immediate: true, deep: true })
// watch(() => formData.value, (newValue, oldValue) => {
//     formData.value.warningList.forEach((item) => {
//         console.log(cust_contact_job_category.value);
//         let selecContactJobCategoryDict = cust_contact_job_category.value.filter((category) => {
//             return category.value == item.contactJobCategory
//         })
//         item.contactJobCategoryLabel = selecContactJobCategoryDict.label;
//         // item.contactIdTypeLabel = sys_id_card_type.value.contactIdType.label;
//     })
// })
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
function handleChange(val) {
    console.log(val);
}

function addContact(row) {
    openWarnAdd.value = true;
    console.log("row");
    console.log(row);
    if (!row) {
        //   初始化表单数据
        loading.value = true;
        getWarningSeq(props.deptId).then(response => {
            console.log(response);
            warnFormInput.value.warningNo = response.msg;
            warnFormInput.value.interactId = props.interactId;
            loading.value = false;
            warnFormInput.value.status = cust_warning_status.value[0].value;
            warnFormInput.value.warningCategory = cust_warning_category.value[0].value;
            warnFormInput.value.warningType = cust_warning_type.value[0].value;
            warnFormInput.value.warningLevel = cust_warning_level.value[0].value;
        });
       
    } else {
        warnFormInput.value = row;
        warnFormInput.value.type = '1';
    }
}
// 多选框选中数据
function handleSelectionChange(selection) {
    ids.value = selection.map(item => item.warningNo);
    single.value = selection.length != 1;
    multiple.value = !selection.length;
}


function saveWarnItem() {
    proxy.$refs['formInput'].validate(valid => {
        if (!valid) {
            // proxy.$message("")
        } else {
            // TODO 提交表单
            if (warnFormInput.value.type) {
                // x修改
                formData.value.warningList.map((list) => {
                    if (list.warningNo == warnFormInput.warningNo) {
                        list = warnFormInput;
                    }
                })
            } else {
                
                formData.value.warningList.push(warnFormInput.value);
            }
            resetWarnFormInput()
            openWarnAdd.value = false;
        }

    })

}
// 重置添加预警信息
function resetWarnFormInput() {
    warnFormInput.value = {
        warningId: null,
        warningNo: null,
        deptId: null,
        // customerId: null,
        customerName: null,
        projectId: null,
        projectName: null,
        warningCategory: null,
        warningType: null,
        warningLevel: null,
        status: null,
        content: null,
        createBy: null,
        createById: null,
        updateBy: null,
        updateById: null,
        updateTime: null,
        createTime: null,
        delFlag: null
    }
}
function closeWarnAdd() {
    openWarnAdd.value = false;
    resetWarnFormInput();
}

function handleUpdate(rows) {
    addContact(rows)
}
function handleDelete(rows) {
    const warningNos = rows ? [rows.warningNo] : ids.value;
    proxy.$modal.confirm('是否确认删除预警流水号为"' + warningNos + '"的数据项？').then(function () {
        warningNos.forEach((warningNo) => {
            formData.value.warningList = formData.value.warningList.filter((item) => {
                return item.warningNo != warningNo;
            })

        })
        single.value = false;
        multiple.value = false;

    }).catch((e) => { console.log(e) });
}
// 表单验证
function validForm() {
    let result = false
    this.$refs['elForm'].validate((valid) => { console.log(valid); result = valid })
    return result
}

// 用户组件请求信息
const userParams = ref({
    pageNum: 1,
    pageSize: 10,
    deptId: null,
    customerNo: null,
    registerCountry: null,
    customerName: null,
    customerType: null,
    customerManagerName: null,
    customerManagerId: null,
    parentCustomerId: null,
    customerCategory: null,
    isCoreEnterprise: null,
    isDeleted: null,
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
            console.log(options)
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
  userParams.pageNum = page;
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
      console.log(options)
      titleDia.value = "客户基本信息";
      opendialog.value = true;
  });
}
// 选择了用户信息；
function selectRow(rows){
  console.log(checkItem.value);
//   if(checkItem.value == 'customerId') {
    warnFormInput.value.customerNo = rows.userId;
    warnFormInput.value.customerName = rows.userName;
//   }

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

    if (checkItemMult.value == 'projectName') {
        warnFormInput.value.projectName = rows.projectName
        warnFormInput.value.projectId = rows.projectId
        warnFormInput.value.projectNo = rows.projectNo
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
  