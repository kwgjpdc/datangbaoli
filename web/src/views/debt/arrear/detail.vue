<template>
    <div class="app-container" v-loading="loading" ref="appContainerView">


        <div class="content">
            <div class="operate-button">
                <el-row :gutter="10" class="mb8 " justify="end">
                    <!-- <div class=""> -->
                    <!--  -->
                    <!--  <el-col :span="1.5" v-if="!routerQueryObj.viewFlag">
                        <el-button type="primary" icon="List" @click="submitForm('1')">暂存</el-button>
                    </el-col>-->
                    <el-col :span="1.5" v-if="!routerQueryObj.viewFlag">
                        <el-button type="primary" icon="Checked" @click="submitForm('2')">提交</el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button type="primary" icon="CircleCloseFilled" @click="closePage">返回</el-button>
                    </el-col>

                </el-row>
            </div>
            <div class="zhanwei"></div>
            <el-row :gutter="15" justify="center">
                <el-col :span="24" :xs="24">
                    <el-form ref="elForm" :model="arrEarsInfo" :rules="rules" label-width="140px" :inline="true"
                        :disabled="routerQueryObj.viewFlag" v-loading="loading">


                        <el-collapse v-model="activeNames" @change="handleChange">
                        <el-collapse-item title="基本信息" name="1">
                       
                            <el-form-item label="业务合同号" prop="otherContractNo">

                                <el-input v-model="arrEarsInfo.otherContractNo" placeholder="请输入" clearable
                                    :style="{ width: '240px' }" disabled></el-input>


                            </el-form-item>
                            <el-form-item label="业务产品" prop="bussProduct">
                                <el-select v-model="arrEarsInfo.bussProduct" filterable placeholder="请选择" :style="{ width: '240px' }" disabled >
                                    <el-option v-for="item in lend_buss_product" :key="item.value" :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>

                            </el-form-item>



                            <el-form-item label="保理申请人" prop="factoringApplicantName">
                                <el-input v-model="arrEarsInfo.factoringApplicantName" clearable :style="{ width: '240px' }"
                                    disabled />
                            </el-form-item>
                            <el-form-item label="币种" prop="otherCurrencyType">
                                <el-select v-model="arrEarsInfo.otherCurrencyType" filterable placeholder="请选择" :style="{ width: '240px' }" disabled>
                                    <el-option v-for="item in sys_currency_type" :key="item.value" :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>


                            <el-form-item label="入账日期" prop="entryDate">
                                <el-date-picker clearable v-model="arrEarsInfo.entryDate" type="date" value-format="YYYY-MM-DD"
                                    placeholder="请选择到入账日期" :style="{ width: '240px' }">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item label="入账账号" prop="entryAccount">
                                <el-input v-model="arrEarsInfo.entryAccount" :style="{ width: '240px' }" oninput="value=value.replace(/[^0-9]/g,'')" placeholder="请输入入账账号" maxlength="32" />
                            </el-form-item>




                            <el-form-item label="备注" prop="remark">
                                <el-input v-model="arrEarsInfo.remark" placeholder="请输入备注" clearable type="textarea"
                                    :style="{ width: '240px' }" maxlength="125"/>
                            </el-form-item>



                        </el-collapse-item>
                        <el-collapse-item title="扣款账号信息" name="2">



                            <div class="header-button-operate" v-if="!routerQueryObj.viewFlag">
                                <el-button type="primary" @click="addItem('deductionNo')">新增</el-button>
                                <!-- <el-button>修改</el-button>
    <el-button>删除</el-button> -->
                            </div>
                            <el-table :data="arrEarsInfo.deductionList" @selection-change="handleSelectionChange"
                                style="margin-bottom: 50px;margin-top: 30px;">
                                <el-table-column type="selection" width="55" align="center" />
                                <el-table-column label="扣款账号" align="center" prop="deductionAccount">
									<template #default="scope">
										{{formatMoney(scope.row.deductionAccount)}}
									</template>
                                </el-table-column>
                                <el-table-column label="扣款金额" align="center" prop="deductionAmount">
									<template #default="scope">
										{{formatMoney(scope.row.deductionAmount)}}
									</template>
								</el-table-column>
                                <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                                    <template #default="scope">
                                        <el-button link type="primary" icon="Edit"
                                            @click="handleUpdate(scope.row, 'deductionNo')">修改</el-button>
                                        <el-button link type="primary" icon="Delete"
                                            @click="handleDelete(scope.row, 'deductionNo')">删除</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>



                        </el-collapse-item>
                        </el-collapse>
                    </el-form>
                </el-col>
            </el-row>
        </div>


        <el-dialog :title="title" v-model="open" width="500px" append-to-body>
            <el-form ref="resultRef" :model="form" :rules="rules" label-width="80px" style="justify-content:center;display: flex;
    flex-wrap: wrap;" inline>
                <el-form-item label="扣款账号" prop="deductionAccount">
                    <el-input v-model="form.deductionAccount" placeholder="请输入扣款账号" :style="{ width: '240px' }" oninput="value=value.replace(/[^0-9]/g,'')" maxlength="32"/>
                </el-form-item>

                <!-- <el-form-item label="开票金额" prop="billAmount">
                        <el-input v-model="form.billAmount" placeholder="请输入开票金额" />
                    </el-form-item> -->
                <PriceInput v-model:form="form" :width="240" label="扣款金额" :placeholder="'请输入扣款金额'" prop="deductionAmount" :rules="rules">
                </PriceInput>




            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="primary" @click="submitFormEdit">确 定</el-button>
                    <el-button @click="cancel">取 消</el-button>
                </div>
            </template>
        </el-dialog>




    </div>
</template>
<script setup>
import { formatMoney } from "@/utils/formatMoney"
import { getArrears, updateArrears,addArrears } from "@/api/debt/arrears.js"
import { deepClone } from "@/utils/index"
const { proxy } = getCurrentInstance();
const arrEarsId = ref("");
const route = useRoute();
const router = useRouter();
const loading = ref(false);
const activeNames = ref(['1', '2']);//tab打开状态
const data = reactive({
    arrEarsInfo: [{

        "createBy": null,
        "createById": null,
        "createTime": null,
        "updateBy": "",
        "updateById": null,
        "updateTime": "",
        "delFlag": null,
        "remark": "",
        "id": null,
        "debtId": null,
        "loanId": null,
        "entryDate": "",
        "entryAccount": "",
        "status": "",
        "deductionList": [],
        "otherContractNo": "",
        "bussProduct": "",
        "factoringApplicantName": "",
        "otherCurrencyType": ""

    }],
    rules: {


        deductionAmount: [
            {
                pattern: /^1000000000$|^1000000000.0$|^1000000000.00$|^[+]{0,1}(\d{0,9})$|^[+]{0,1}(\d{0,9}\.\d{1,2})$/,
                message: ' 请输入 0-10亿 的正数，可保留两位小数',
                trigger: 'blur',
            },
            { required: true, message: "扣款金额不能为空", trigger: "blur" }
        ],
        deductionAccount: [
            { required: true, message: "扣款账号不能为空", trigger: "blur" }
        ],
    }
});
const { arrEarsInfo, rules } = toRefs(data);
let formData = ref({})
let routerQueryObj = ref({});
watch(route, (newRoute) => {

    routerQueryObj.value.viewFlag = history.state && history.state.viewFlag;
    arrEarsId.value = history.state && history.state.arrEarsId;
    routerQueryObj.value.pageNum = history.state && history.state.pageNum;
}, { immediate: true });

const { sys_currency_type, lend_buss_product } = proxy.useDict('sys_currency_type', 'lend_buss_product');//下拉框字典
function getAdjustPage() {
    if (arrEarsId.value) {
        loading.value = true;
        getArrears(arrEarsId.value).then(response => {





            arrEarsInfo.value = response.data;
            console.log(arrEarsInfo);



            loading.value = false;
        });
    }
}
// 表单验证


watch(() => arrEarsInfo.value, (newValue, oldValue) => {
    if (newValue) {
        formData.value = deepClone(newValue);
    }

}, { deep: true })



function submitForm(statusFlag) {


    let saveInfo = arrEarsInfo.value;
    // saveInfo.adjustVoucherList = [];
    // arrEarsInfo.value.forEach((item) => {
    //     if (item && item.status != 1) {
    //         delete item.debtAdjustId;
    //     }

    //     saveInfo.adjustVoucherList.push(item);
    // }

    // )
    saveInfo.status = statusFlag;

    if(!saveInfo.id) {
         //修改
    addArrears(saveInfo).then(response => {
        proxy.$modal.msgSuccess("保存成功");
        loading.value = false;
        if (statusFlag == '2') {
            closePage()
        } else {
            closePage()
        }
    });
    } else {
         //修改
    updateArrears(saveInfo).then(response => {
        proxy.$modal.msgSuccess("保存成功");
        loading.value = false;
        if (statusFlag == '2') {
            closePage()
        } else {
            closePage()
        }
    });
    }


   

}

function closePage() {
    const obj = { path: "/debt/debt/arrear/index", query: { t: Date.now(), pageNum: routerQueryObj.value.pageNum } };
    proxy.$tab.closeOpenPage(obj);
}



function handleAllEdit() {
    arrEarsInfo.value.forEach((item) => {
        item.loanRatio = formdata.value.loanRatio;
        item.dueDate = formdata.value.dueDate;
    })
}

let open = ref(false);
let form = ref({});
let title = ref('扣款账号信息');
// 表格新增事件
function addItem(type) {
    reset();
    open.value = true;
}
// 表格修改事件
function handleUpdate(row, type) {
    open.value = true;

    if (!row) {
        //   初始化表单数据
    } else {
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
    
    indexCount.forEach((names) => {
        arrEarsInfo.value.deductionList = arrEarsInfo.value.deductionList.filter((item) => {
            return item[jugeItem] != names;
        })

    })
    single.value = false;
    multiple.value = false;
}


// 新增修改确定按钮
function submitFormEdit() {
    proxy.$refs['resultRef'].validate(valid => {
        if (!valid) {
            // proxy.$message("")
        } else {
           
            
            if (form.value.type) {
                // 修改票据信息
                arrEarsInfo.value.deductionList = arrEarsInfo.value.deductionList.map((list) => {
                    if (list.indexCount == form.value.indexCount) {
                        console.log(list);
                        return deepClone(form.value);
                    } else {
                        return list
                    }

                })

            } else {
                // 新增票据信息
                if(!arrEarsInfo.value.deductionList) {
                    arrEarsInfo.value.deductionList = [];
                }

                arrEarsInfo.value.deductionList.push(deepClone(form.value));
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
        deductionAccount: null,
        deductionAmount: null,
    };
    proxy.resetForm("resultRef");
}


// 新增修改弹出页面取消按钮
function cancel() {
    open.value = false;
    reset();
}


getAdjustPage();


</script>
<style lang="scss" scoped>
.app-container {
    position: relative;
    height: calc(100vh - 85px);
    overflow: scroll;
}

// .fixed-head {
//     position: fixed;
//     top: 50px;
//     right: 50px;
//     left: 50px;
//     z-index: 100;
// }

.nav-bar {
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 200px;
    right: 20px;

    .item {
        padding: 8px 16px;
        color: #606266;
    }

    .active {
        color: #1890ff;
        ;
        // background-color: #e2e2e2;
    }
}

.content-item-scroll {
    margin-bottom: 20px;
}

.zhanwei {
    height: 40px;
    display: block;
}

.operate-button {
    position: fixed;
    top: 83px;
    z-index: 100;
    background: #fff;
    right: 0;
    left: 0;
    padding: 5px 15px;
    // margin: 20px;

}

.card-header {
    display: flex;
    justify-content: space-between;
}


.button-display {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;

    .el-button+.el-button {
        margin-left: 0;
    }
}


.header-button-operate {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
}

</style>
  