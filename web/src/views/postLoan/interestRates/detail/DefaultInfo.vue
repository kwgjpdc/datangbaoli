<template>
  <el-collapse class="info-form"
               v-model="activeNames"
               style="border-top: 0;">
    <el-collapse-item title="违约利率"
                      name="1">
      <el-card class="box-card">
        <template #header
                  v-if="!props.routerQueryObj.viewFlag">
          <div class="card-header"
               align="right">
            <el-button type="primary"
                       plain
                       @click="handleAdd">新增</el-button>
            <el-button type="warning"
                       plain
                       :disabled="!single"
                       @click="handleModify">修改</el-button>
            <el-button plain
                       @click="handleDelete"
                       :disabled="!deleteFlag">删除</el-button>
          </div>
        </template>
        <el-table :data="subList"
                  @selection-change="handleSelectionChange">
          <el-table-column type="selection"
                           width="55"
                           align="center"
                           fixed=""
                           :disabled="props.routerQueryObj.viewFlag" />
          <el-table-column label="执行方"
                           align="center"
                           prop="executeParty"
                           min-width="240px" />
          <el-table-column label="违约起始天数"
                           align="center"
                           prop="startDays"
                           min-width="120px" />
          <el-table-column label="违约截止天数"
                           align="center"
                           prop="dueDays"
                           min-width="120px" />
          <el-table-column label="违约利率周期"
                           align="center"
                           prop="cycle"
                           min-width="120px">
            <template #default="scope">
              <dict-tag :options="cont_branch_interest_cycle"
                        :value="scope.row.cycle" />
            </template>
          </el-table-column>
          <el-table-column label="违约罚息方式"
                           align="center"
                           prop="penaltyWay"
                           min-width="120px">
            <template #default="scope">
              <dict-tag :options="default_penalty_method"
                        :value="scope.row.penaltyWay" />
            </template>
          </el-table-column>
          <el-table-column label="违约利率上浮比例"
                           align="center"
                           prop="floatRatio"
                           min-width="180px">
            <template #default="scope">
              <span>{{ formatPercent(scope.row.floatRatio) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="违约罚息率"
                           align="center"
                           prop="penaltyRate"
                           min-width="180px">
            <template #default="scope">
              <span>{{ formatPercent(scope.row.penaltyRate) }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-collapse-item>
    <!-- 违约利率信息 -->
    <el-dialog class="info-dialog"
               v-model="dialogVisible"
               :title="dialog.title"
               :width="dialog.width">
      <el-form ref="elForm"
               :model="interestRateForm"
               :rules="rules"
               label-width="140px">
        <el-row :gutter="15"
                style="margin-right: 30px;">
          <el-col :lg="12"
                  :xs="24">
            <el-form-item label="利率执行方"
                          prop="executeParty">
              <CustomerSelect :showValue="executePartyDom.showValue"
                              :option="executePartyDom.option"
                              :queryPropList="executePartyDom.queryPropList"
                              :tablePropList="executePartyDom.tablePropList"
                              @selectRow="executePartySelect"></CustomerSelect>
            </el-form-item>
          </el-col>
          <el-col :lg="12"
                  :xs="24">
            <el-form-item label="违约利率周期"
                          prop="cycle">
              <el-select v-model="interestRateForm.cycle"
                         filterable
                         placeholder="请选择">
                <el-option v-for="item in cont_branch_interest_cycle"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :lg="12"
                  :xs="24">
            <el-form-item label="违约起始天数"
                          prop="startDays">
              <el-input v-model="interestRateForm.startDays"
                        oninput="value=value.replace(/[^0-9]/g,'')"
                        placeholder="请输入违约起始天数"
                        maxlength="9">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :lg="12"
                  :xs="24">
            <el-form-item label="违约截止天数"
                          prop="dueDays">
              <el-input v-model="interestRateForm.dueDays"
                        oninput="value=value.replace(/[^0-9]/g,'')"
                        placeholder="请输入违约截止天数"
                        maxlength="9">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :lg="12"
                  :xs="24">
            <el-form-item label="违约罚息方式"
                          prop="penaltyWay">
              <el-radio-group v-model="interestRateForm.penaltyWay">
                <el-radio v-for="item in default_penalty_method"
                          :key="item.value"
                          :label="item.value">{{ item.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :lg="12"
                  :xs="24"
                  v-if="interestRateForm.penaltyWay === '2'">
            <el-form-item label="违约罚息率"
                          prop="penaltyRate">
              <el-input v-model="interestRateForm.penaltyRate"
                        oninput="value=value.replace(/[^0-9.]/g,'')"
                        placeholder="请输入违约罚息率"
                        maxlength="9">
                <template #append>%</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :lg="12"
                  :xs="24"
                  v-else>
            <el-form-item label="违约利率上浮比例"
                          prop="floatRatio">
              <el-input v-model="interestRateForm.floatRatio"
                        oninput="value=value.replace(/[^0-9.]/g,'')"
                        placeholder="请输入违约利率上浮比例"
                        maxlength="9">
                <template #append>%</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button v-if="!props.routerQueryObj.viewFlag"
                     type="primary"
                     @click="handleEdit">确 定</el-button>
          <el-button @click="handleClose">取 消</el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 违约利率信息 end-->
  </el-collapse>
</template>

<script setup>
import { deepClone } from "@/utils/index"
import { formatMoney, formatPercent } from "@/utils/formatMoney"
import CustomerSelect from "@/components/CustomerSelect"
const { proxy } = getCurrentInstance();
const props = defineProps({
  infoData: {
    type: Object,
    default: null,
  },
  routerQueryObj: {
    type: Object,
    default: null,
  }
});
const activeNames = ref(['1', '2']);//tab打开状态
const loading = ref(false);
const dialogVisible = ref(false)

const selections = ref([])
const single = ref(false)
const editIndex = ref("")
const deleteFlag = ref(false)
const deletedList = ref([])


const dataScope = reactive({
  rules: {
    "executeParty": [
      { required: true, message: "利率执行方不能为空", trigger: "blur" },
    ],
    "cycle": [
      { required: true, message: "违约利率周期不能为空", trigger: "blur" },
    ],
    "startDays": [
      { required: true, message: "违约起始天数不能为空", trigger: "blur" },
    ],
    "dueDays": [
      { required: true, message: "违约截止天数不能为空", trigger: "blur" },
    ],
    "floatRatio": [
      { required: true, message: "违约利率上浮比例不能为空", trigger: "blur" },
    ],
    "penaltyRate": [
      { required: true, message: "违约罚息率不能为空", trigger: "blur" },
    ],
  },//验证规律
  interestRateForm: {
    "delFlag": 0,
    "loanInterestRateChangeId": props.id,
    "loanInterestRateChangeSubId": "",
    "executeParty": "",
    "cycle": "",
    "startDays": "",
    "dueDays": "",
    "penaltyWay": "2",
    "floatRatio": "",
    "penaltyRate": ""
  },
  executePartyDom: {
    showValue: "",
    option: {
      inputW: "100%",
      placeholder: "请选择利率执行方",
      dialogTitle: "利率执行方",
      queryUrl: "/cust/customer/list"
    },
    queryPropList: [
      {
        prop: "customerNo",
        label: "执行方编号"
      },
      {
        prop: "customerName",
        label: "执行方名称"
      }
    ],
    tablePropList: [
      {
        prop: "customerNo",
        label: "执行方编号"
      },
      {
        prop: "customerName",
        label: "执行方名称"
      }
    ]
  },
  dialog: {
    title: "违约利率信息",
    with: ""
  },
  subList: []
});

const { rules, interestRateForm, executePartyDom, dialog, subList } = toRefs(dataScope);
const { default_penalty_method, cont_branch_interest_cycle } = proxy.useDict("default_penalty_method", "cont_branch_interest_cycle");//下拉框字典
let formData = ref({});//不能修改const 定义的数据

watch(() => props.infoData, (newValue, oldValue) => {
  // console.log(newValue);
  if (newValue) {
    const infoData = deepClone(newValue)
    if (infoData.po && infoData.po.subList && infoData.po.subList.length > 0) {
      subList.value = deepClone(infoData.po.subList)
      formData.value.subList = deepClone(infoData.po.subList)
    }
  }
}, { immediate: true, deep: true })

watch(() => subList, (newValue, oldValue) => {
  if (newValue) {
    // console.log('subList.value改变', newValue)
    // const dataList = deepClone(subList.value)
    formData.value.subList = []
    formData.value.subList = deepClone(subList.value)
    // if (deletedList.value.length > 0) {
    //   deletedList.value.forEach((item) => {
    //     formData.value.subList.push(item)
    //   })
    // }
    // console.log('formData.subList', formData.value.subList)
  }
}, { deep: true })


// 多选框选中数据
function handleSelectionChange(selection) {
  selections.value = selection;
  single.value = selection.length == 1;
  deleteFlag.value = selection.length > 0;
}

function executePartySelect(row) {
  executePartyDom.value.showValue = row.customerName
  interestRateForm.value.executeParty = row.customerName
  if (interestRateForm.value.executeParty && interestRateForm.value.executeParty !== "") {
    proxy.$refs['elForm'].clearValidate('executeParty')
  }
}

// 表单验证
function validForm() {
  let result = false
  proxy.$refs['elForm'].validate((valid) => { console.log(valid); result = valid })
  return result
}

// 新增
function handleAdd() {
  dialogVisible.value = true
}
// 修改
function handleModify() {
  interestRateForm.value = deepClone(selections.value[0])
  executePartyDom.value.showValue = interestRateForm.value.executeParty
  dialogVisible.value = true
  selections.value.forEach((changeSub) => {
    const index = subList.value.indexOf(changeSub);
    if (index !== -1) {
      editIndex.value = index
    } else {
      editIndex.value = ""
    }
    // console.log('编辑的下标', editIndex.value)
  });
}
// 删除
function handleDelete() {
  proxy.$modal.confirm('是否确认删除选择的数据项？').then(() => {
    selections.value.forEach((changeSub) => {
      const index = subList.value.indexOf(changeSub);
      if (index !== -1) {
        // if (changeSub.loanInterestRateChangeSubId !== "") {
        //   changeSub.delFlag = 1
        //   deletedList.value.push(changeSub)
        // }
        subList.value.splice(index, 1);
      }
    });
    // console.log('删除列表', deletedList.value)
    selections.value = []
    proxy.$message.success(`删除成功！`)
  }).catch((e) => {
    console.log(e)
  });
}
// 弹窗 确定操作
function handleEdit() {
  const elForm = new Promise((resolve, reject) => {
    proxy.$refs['elForm'].validate(valid => {
      valid ? resolve(valid) : reject(valid)
    })
  })
  Promise.all([elForm]).then(() => {
    let listItem = deepClone(interestRateForm.value)
    // 修改
    if (editIndex.value !== "") {
      Object.assign(subList.value[editIndex.value], listItem)
    } else { //新增
      subList.value.push(listItem)
    }
    // console.log('新的subList', subList.value)
    handleClose()
  })
}
// 弹窗 取消操作
function handleClose() {
  interestRateForm.value = {
    "delFlag": 0,
    "loanInterestRateChangeId": props.id,
    "loanInterestRateChangeSubId": "",
    "executeParty": "",
    "cycle": "",
    "startDays": "",
    "dueDays": "",
    "penaltyWay": "2",
    "floatRatio": "",
    "penaltyRate": ""
  }
  editIndex.value = ""
  executePartyDom.value.showValue = ""
  proxy.resetForm("elForm")
  dialogVisible.value = false
}
defineExpose({
  formData
});
</script>