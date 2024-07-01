<template>
  <el-collapse class="info-form"
               v-model="activeNames"
               style="border-top: 0;">
    <el-collapse-item title="正常利率"
                      name="1">
      <el-row :gutter="15">
        <el-col :span="24"
                :xs="24">
          <el-table :data="interestRateList"
                    style="margin-bottom: 25px;margin-top: 15px;">
            <el-table-column label="操作"
                             width="120"
                             align="center"
                             fixed>
              <div class="button-display">
                <el-tag class="table-btn"
                        v-if="props.routerQueryObj.viewFlag"
                        @click="handleNormal">查看</el-tag>
                <el-tag class="table-btn"
                        v-else
                        @click="handleNormal">修改</el-tag>
              </div>
            </el-table-column>
            <el-table-column label="执行方"
                             align="center"
                             prop="executePartyNormal"
                             min-width="240px" />
            <el-table-column label="利率类型"
                             align="center"
                             prop="typeNormal"
                             min-width="180px">
              <template #default="scope">
                <dict-tag :options="cont_interest_type"
                          :value="scope.row.typeNormal" />
              </template>
            </el-table-column>
            <el-table-column label="固定利率"
                             align="center"
                             prop="fixedRateNormal"
                             min-width="180px">
              <template #default="scope">
                <span>{{ formatPercent(scope.row.fixedRateNormal) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="利率种类"
                             align="center"
                             prop="rateCategoryNormal"
                             min-width="180px">
              <template #default="scope">
                <dict-tag :options="postloan_rate_type"
                          :value="scope.row.rateCategoryNormal" />
              </template>
            </el-table-column>
            <el-table-column label="基准利率"
                             align="center"
                             prop="benchmarkRateNormal"
                             min-width="180px">
              <template #default="scope">
                <span>{{ formatPercent(scope.row.benchmarkRateNormal) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="变动/锁定标志"
                             align="center"
                             prop="changeLockFlagNormal"
                             min-width="180px">
              <template #default="scope">
                <dict-tag :options="cont_interest_floating_lock"
                          :value="scope.row.changeLockFlagNormal" />
              </template>
            </el-table-column>
            <el-table-column label="利率周期"
                             align="center"
                             prop="rateCycleNormal"
                             min-width="180px">
              <template #default="scope">
                <dict-tag :options="cont_interest_cycle"
                          :value="scope.row.rateCycleNormal" />
              </template>
            </el-table-column>
            <el-table-column label="加减码"
                             align="center"
                             prop="isAddOrSubNormal"
                             min-width="180px">
              <template #default="scope">
                <span v-if="scope.row.isAddNormal && scope.row.isAddNormal !== ''">加码</span>
                <span v-else-if="scope.row.isSubNormal && scope.row.isSubNormal !== ''">减码</span>
                <dict-tag v-else
                          :options="cont_if_plus_minus"
                          :value="scope.row.isAddOrSubNormal" />
              </template>
            </el-table-column>
            <el-table-column label="加减码浮动方式"
                             align="center"
                             prop="floatMethodNormal"
                             min-width="180px">
              <template #default="scope">
                <dict-tag :options="cont_plus_minus_floating"
                          :value="scope.row.floatMethodNormal" />
              </template>
            </el-table-column>
            <el-table-column label="执行利率"
                             align="center"
                             prop="executeRateNormal"
                             min-width="180px">
              <template #default="scope">
                <span>{{ formatPercent(scope.row.executeRateNormal) }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-collapse-item>

    <el-collapse-item title="宽限期利率"
                      name="2">
      <el-row :gutter="15">
        <el-col :span="24"
                :xs="24">
          <el-table :data="interestRateList"
                    style="margin-bottom: 25px;margin-top: 15px;">
            <el-table-column label="操作"
                             width="120"
                             align="center"
                             fixed>
              <div class="button-display">
                <el-tag class="table-btn"
                        v-if="props.routerQueryObj.viewFlag"
                        @click="handleGrace">查看</el-tag>
                <el-tag class="table-btn"
                        v-else
                        @click="handleGrace">修改</el-tag>
              </div>
            </el-table-column>
            <el-table-column label="执行方"
                             align="center"
                             prop="executeParty"
                             min-width="240px" />
            <el-table-column label="利率类型"
                             align="center"
                             min-width="180px">
              <template #default="scope">
                <dict-tag :options="cont_interest_type"
                          :value="scope.row.type" />
              </template>
            </el-table-column>
            <el-table-column label="固定利率"
                             align="center"
                             prop="fixedRate"
                             min-width="180px">
              <template #default="scope">
                <span>{{ formatPercent(scope.row.fixedRate) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="利率种类"
                             align="center"
                             prop="rateCategory"
                             min-width="180px">
              <template #default="scope">
                <dict-tag :options="postloan_rate_type"
                          :value="scope.row.rateCategory" />
              </template>
            </el-table-column>
            <el-table-column label="基准利率"
                             align="center"
                             prop="benchmarkRate"
                             min-width="180px">
              <template #default="scope">
                <span>{{ formatPercent(scope.row.benchmarkRate) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="变动/锁定标志"
                             align="center"
                             prop="changeLockFlag"
                             min-width="180px">
              <template #default="scope">
                <dict-tag :options="cont_interest_floating_lock"
                          :value="scope.row.changeLockFlag" />
              </template>
            </el-table-column>
            <el-table-column label="利率周期"
                             align="center"
                             prop="rateCycle"
                             min-width="180px">
              <template #default="scope">
                <dict-tag :options="cont_interest_cycle"
                          :value="scope.row.rateCycle" />
              </template>
            </el-table-column>
            <el-table-column label="加减码"
                             align="center"
                             prop="isAddOrSub"
                             min-width="180px">
              <template #default="scope">
                <span v-if="scope.row.isAdd && scope.row.isAdd !== ''">加码</span>
                <span v-else-if="scope.row.isSub && scope.row.isSub !== ''">减码</span>
                <dict-tag v-else
                          :options="cont_if_plus_minus"
                          :value="scope.row.isAddOrSub" />
              </template>
            </el-table-column>
            <el-table-column label="加减码浮动方式"
                             align="center"
                             prop="floatMethod"
                             min-width="180px">
              <template #default="scope">
                <dict-tag :options="cont_plus_minus_floating"
                          :value="scope.row.floatMethod" />
              </template>
            </el-table-column>
            <el-table-column label="执行利率"
                             align="center"
                             prop="executeRate"
                             min-width="180px">
              <template #default="scope">
                <span>{{ formatPercent(scope.row.executeRate) }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-collapse-item>
    <!-- 利率信息弹窗 -->
    <el-dialog class="info-dialog"
               v-model="dialogVisible"
               :title="dialog.title"
               :width="dialog.width">
      <el-form ref="elForm"
               :model="interestRateForm"
               :rules="rules"
               label-width="140px"
               :disabled="props.routerQueryObj.viewFlag">
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
            <el-form-item label="利率执行区间"
                          prop="interestExecSection">
              <el-select v-model="interestRateForm.interestExecSection"
                         filterable
                         placeholder="请选择">
                <el-option v-for="item in sys_true_or_false"
                           :key="item.value"
                           :label="item.label"
                           :value="item.label">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :lg="12"
                  :xs="24">
            <el-form-item label="利率类型"
                          prop="type">
              <el-radio-group v-model="interestRateForm.type"
                              @change="handleType">
                <el-radio v-for="item in cont_interest_type"
                          :key="item.value"
                          :label="item.value">{{item.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <template v-if="isFloatFlag">
            <el-col :lg="12"
                    :xs="24">
              <el-form-item label="利率种类"
                            prop="rateCategory">
                <el-select v-model="interestRateForm.rateCategory"
                           filterable
                           placeholder="请选择">
                  <el-option v-for="item in postloan_rate_type"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :lg="12"
                    :xs="24">
              <el-form-item label="基准利率"
                            prop="benchmarkRate">
                <el-input v-model="interestRateForm.benchmarkRate"
                          oninput="value=value.replace(/[^0-9.]/g,'')"
                          placeholder="请输入基准利率"
                          maxlength="9">
                  <template #append>%</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :lg="12"
                    :xs="24">
              <el-form-item label="变动/锁定标志"
                            prop="changeLockFlag">
                <el-radio-group v-model="interestRateForm.changeLockFlag">
                  <el-radio v-for="item in cont_interest_floating_lock"
                            :key="item.value"
                            :label="item.value"
                            :value="item.value">{{item.label}}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :lg="12"
                    :xs="24">
              <el-form-item label="是否加减码"
                            prop="isAddOrSub">
                <el-radio-group v-model="interestRateForm.isAddOrSub"
                                @change="handleAddOrSub">
                  <el-radio v-for="item in cont_if_plus_minus"
                            :key="item.value"
                            :label="item.value">{{item.label}}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <template v-if="isAddOrSubFlag">
              <el-col :lg="12"
                      :xs="24">
                <el-form-item label=""
                              prop="isAdd">
                  <el-radio-group v-model="interestRateForm.isAdd">
                    <el-radio v-for="item in cont_plus_minus"
                              :key="item.value"
                              :label="item.value">{{item.label}}</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :lg="12"
                      :xs="24">
                <el-form-item label="加减码浮动方式"
                              prop="floatMethod">
                  <el-radio-group v-model="interestRateForm.floatMethod">
                    <el-radio v-for="item in cont_plus_minus_floating"
                              :key="item.value"
                              :label="item.value">{{item.label}}</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :lg="12"
                      :xs="24">
                <el-form-item label="加减码"
                              prop="addOrSub">
                  <el-input v-model="interestRateForm.addOrSub"
                            oninput="value=value.replace(/[^0-9.]/g,'')"
                            placeholder="请输入加减码"
                            maxlength="9">
                    <template #append>%</template>
                  </el-input>
                </el-form-item>
              </el-col>
            </template>
          </template>
          <template v-else>
            <el-col :lg="12"
                    :xs="24">
              <el-form-item label="固定利率"
                            prop="fixedRate">
                <el-input v-model="interestRateForm.fixedRate"
                          oninput="value=value.replace(/[^0-9.]/g,'')"
                          placeholder="请输入固定利率"
                          maxlength="9">
                  <template #append>%</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :lg="12"
                    :xs="24">
              <el-form-item label="利率周期"
                            prop="rateCycle">
                <el-select v-model="interestRateForm.rateCycle"
                           filterable
                           placeholder="请选择">
                  <el-option v-for="item in cont_interest_cycle"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </template>
          <el-col :lg="12"
                  :xs="24">
            <el-form-item label="执行利率"
                          prop="executeRate">
              <el-input v-model="interestRateForm.executeRate"
                        oninput="value=value.replace(/[^0-9.]/g,'')"
                        placeholder="请输入执行利率"
                        maxlength="9"
                        style="width: calc(100% - 70px)">
                <template #append>%</template>
              </el-input>
              <el-button type="primary"
                         plain
                         style="margin-left: 10px; width: 60px"
                         @click="handleCount">计算</el-button>
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
    <!-- 利率信息弹窗 end-->
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

const dataScope = reactive({
  rules: {
    "executeParty": [
      { required: true, message: "利率执行方不能为空", trigger: "blur" },
    ],
    "addOrSub": [
      { required: true, message: "加减码不能为空", trigger: "blur" },
    ],
    "executeRate": [
      { required: true, message: "执行利率不能为空", trigger: "blur" },
    ],
  },//验证规律
  interestRateForm: {
    "executeParty": "",
    "interestExecSection": "",
    "type": "1",
    "fixedRate": "",
    "rateCycle": "1",
    "rateCategory": "",
    "benchmarkRate": "",
    "changeLockFlag": "",
    "isAddOrSub": "2",
    "isAdd": "",
    "isSub": "",
    "floatMethod": "",
    "addOrSub": "",
    "executeRate": "",
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
    title: "",
    with: "",
    type: "normal"
  }
});

const { rules, interestRateForm, executePartyDom, dialog } = toRefs(dataScope);
const { sys_true_or_false,
  cont_interest_type,
  cont_interest_floating_type,
  cont_interest_cycle,
  cont_if_plus_minus,
  cont_plus_minus,
  cont_plus_minus_floating,
  cont_interest_floating_lock,
  postloan_rate_type } = proxy.useDict(
    "sys_true_or_false",
    "cont_interest_type",
    "cont_interest_floating_type",
    "cont_interest_cycle",
    "cont_if_plus_minus",
    "cont_plus_minus",
    "cont_plus_minus_floating",
    "cont_interest_floating_lock",
    "postloan_rate_type");//下拉框字典

let formData = ref({});//不能修改const 定义的数据
let interestRateList = ref([])

//利率类型是否浮动
let isFloatFlag = ref(false)
function handleType() {
  if (interestRateForm.value.type === "1") {
    interestRateForm.value.rateCategory = ""
    interestRateForm.value.benchmarkRate = ""
    interestRateForm.value.changeLockFlag = ""
    interestRateForm.value.isAddOrSub = cont_if_plus_minus.value[1].value
    interestRateForm.value.isAdd = ""
    interestRateForm.value.isSub = ""
    interestRateForm.value.floatMethod = ""
    interestRateForm.value.addOrSub = ""
    interestRateForm.value.executeRate = ""
  } else {
    isAddOrSubFlag.value = false
    interestRateForm.value.fixedRate = ""
    interestRateForm.value.rateCycle = cont_interest_cycle.value[0].value
    interestRateForm.value.executeRate = ""
  }
  isFloatFlag.value = interestRateForm.value.type === "2"
}

//是否加减码
let isAddOrSubFlag = ref(false)
function handleAddOrSub() {
  if (interestRateForm.value.isAddOrSub === "2") {
    interestRateForm.value.isAdd = ""
    interestRateForm.value.isSub = ""
    interestRateForm.value.floatMethod = ""
    interestRateForm.value.addOrSub = ""
    // interestRateForm.value.executeRate = ""
  }
  isAddOrSubFlag.value = interestRateForm.value.isAddOrSub === "1"
}

watch(props.infoData, (newValue, oldValue) => {
  if (newValue) {
    formData.value = deepClone(newValue)
    if (formData.value.po) {
      delete formData.value.po.subList
      interestRateList.value.push(formData.value.po)
    } else {
      formData.value.po = {}
      interestRateList.value[0] = {
        "delFlag": 0,
        "loanInterestRateChangeId": null,
        "debtId": null,
        "loanId": null,
        "executePartyNormal": "",
        "typeNormal": null,
        "fixedRateNormal": null,
        "rateCycleNormal": null,
        "rateCategoryNormal": null,
        "benchmarkRateNormal": null,
        "changeLockFlagNormal": null,
        "isAddOrSubNormal": null,
        "isAddNormal": null,
        "isSubNormal": null,
        "floatMethodNormal": null,
        "addOrSubNormal": null,
        "executeRateNormal": null,
        "executeParty": null,
        "type": null,
        "fixedRate": null,
        "rateCycle": null,
        "rateCategory": null,
        "benchmarkRate": null,
        "changeLockFlag": null,
        "isAddOrSub": null,
        "isAdd": null,
        "isSub": null,
        "floatMethod": null,
        "addOrSub": null,
        "executeRate": null,
      }
    }
  }
}, { immediate: true, deep: true })

watch(interestRateList, (newValue, oldValue) => {
  if (newValue) {
    const item = deepClone(newValue[0])
    Object.assign(formData.value.po, item)
    // console.log('利率信息内容', formData.value)
  }
}, { deep: true })

// 表单验证
function validForm() {
  let result = false
  proxy.$refs['elForm'].validate((valid) => { console.log(valid); result = valid })
  return result
}

// 执行方选择
function executePartySelect(row) {
  executePartyDom.value.showValue = row.customerName
  interestRateForm.value.executeParty = row.customerName
  if (interestRateForm.value.executeParty && interestRateForm.value.executeParty !== "") {
    proxy.$refs['elForm'].clearValidate('executeParty')
  }
}

// 正常利率信息弹窗
function handleNormal() {
  dialog.value.title = "正常利率信息"
  dialog.value.type = "normal"
  let interestRateItem = deepClone(interestRateList.value[0])
  // console.log('正常利率信息', interestRateItem)
  interestRateForm.value = {
    "executeParty": interestRateItem.executePartyNormal,
    "interestExecSection": interestRateItem.interestExecSectionNormal,
    "type": interestRateItem.typeNormal && interestRateItem.typeNormal !== "" ? interestRateItem.typeNormal : cont_interest_type.value[0].value,
    "fixedRate": interestRateItem.fixedRateNormal,
    "rateCycle": interestRateItem.rateCycleNormal && interestRateItem.rateCycleNormal !== "" ? interestRateItem.rateCycleNormal : cont_interest_cycle.value[0].value,
    "rateCategory": interestRateItem.rateCategoryNormal,
    "benchmarkRate": interestRateItem.benchmarkRateNormal,
    "changeLockFlag": interestRateItem.changeLockFlagNormal,
    "isAddOrSub": interestRateItem.isAddOrSubNormal && interestRateItem.isAddOrSubNormal !== "" ? interestRateItem.isAddOrSubNormal : cont_if_plus_minus.value[1].value,
    "isAdd": interestRateItem.isAddNormal === "1" ? "1" : interestRateItem.isSubNormal === "2" ? "2" : "",
    "isSub": "",
    "floatMethod": interestRateItem.floatMethodNormal,
    "addOrSub": interestRateItem.addOrSubNormal,
    "executeRate": interestRateItem.executeRateNormal,
  }
  isFloatFlag.value = interestRateForm.value.type === "2"
  isAddOrSubFlag.value = interestRateForm.value.isAddOrSub === "1"
  executePartyDom.value.showValue = interestRateItem.executePartyNormal
  // console.log('表单正常利率信息', interestRateForm.value)
  dialogVisible.value = true
}

// 宽限期利率信息弹窗
function handleGrace() {
  dialog.value.title = "宽限期利率信息"
  dialog.value.type = "grace"
  dialogVisible.value = true
  let interestRateItem = interestRateList.value[0]
  interestRateForm.value = {
    "executeParty": interestRateItem.executeParty,
    "interestExecSection": interestRateItem.interestExecSection,
    "type": interestRateItem.type && interestRateItem.type !== "" ? interestRateItem.type : cont_interest_type.value[0].value,
    "fixedRate": interestRateItem.fixedRate,
    "rateCycle": interestRateItem.rateCycle && interestRateItem.rateCycle !== "" ? interestRateItem.rateCycle : cont_interest_cycle.value[0].value,
    "rateCategory": interestRateItem.rateCategory,
    "benchmarkRate": interestRateItem.benchmarkRate,
    "changeLockFlag": interestRateItem.changeLockFlag,
    "isAddOrSub": interestRateItem.isAddOrSub && interestRateItem.isAddOrSub !== "" ? interestRateItem.isAddOrSub : cont_if_plus_minus.value[1].value,
    "isAdd": interestRateItem.isAdd === "1" ? "1" : interestRateItem.isSub === "2" ? "2" : "",
    "isSub": "",
    "floatMethod": interestRateItem.floatMethod,
    "addOrSub": interestRateItem.addOrSub,
    "executeRate": interestRateItem.executeRate,
  }
  isFloatFlag.value = interestRateForm.value.type === "2"
  isAddOrSubFlag.value = interestRateForm.value.isAddOrSub === "1"
  executePartyDom.value.showValue = interestRateItem.executeParty
  // console.log('宽限期利率信息', interestRateForm.value)
}

// 利率信息弹窗关闭，表单初始化
function handleClose() {
  interestRateForm.value = {
    "executeParty": "",
    "interestExecSection": "",
    "type": cont_interest_type.value[0].value,
    "fixedRate": "",
    "rateCycle": cont_interest_cycle.value[0].value,
    "rateCategory": "",
    "benchmarkRate": "",
    "changeLockFlag": "",
    "isAddOrSub": cont_if_plus_minus.value[1].value,
    "isAdd": "",
    "isSub": "",
    "floatMethod": "",
    "addOrSub": "",
    "executeRate": "",
  }
  executePartyDom.value.showValue = ""
  isAddOrSubFlag.value = false
  isFloatFlag.value = false
  proxy.resetForm("elForm")
  dialogVisible.value = false
}

// 利率信息弹窗 确定修改
function handleEdit() {
  const elForm = new Promise((resolve, reject) => {
    proxy.$refs['elForm'].validate(valid => {
      valid ? resolve(valid) : reject(valid)
    })
  })
  Promise.all([elForm]).then(() => {
    // console.log('弹窗类型', dialog.value.type)
    const formValues = interestRateForm.value
    let listItem = {}
    if (dialog.value.type === 'normal') {
      listItem = {
        "executePartyNormal": formValues.executeParty,
        "interestExecSectionNormal": formValues.interestExecSection,
        "typeNormal": formValues.type,
        "fixedRateNormal": formValues.fixedRate,
        "rateCycleNormal": formValues.rateCycle,
        "rateCategoryNormal": formValues.rateCategory,
        "benchmarkRateNormal": formValues.benchmarkRate,
        "changeLockFlagNormal": formValues.changeLockFlag,
        "isAddOrSubNormal": formValues.isAddOrSub,
        "isAddNormal": formValues.isAdd && formValues.isAdd === '1' ? '1' : "",
        "isSubNormal": formValues.isAdd && formValues.isAdd === '2' ? '2' : "",
        "floatMethodNormal": formValues.floatMethod,
        "addOrSubNormal": formValues.addOrSub,
        "executeRateNormal": formValues.executeRate,
      }
    } else {
      listItem = {
        "executeParty": formValues.executeParty,
        "interestExecSection": formValues.interestExecSection,
        "type": formValues.type,
        "fixedRate": formValues.fixedRate,
        "rateCycle": formValues.rateCycle,
        "rateCategory": formValues.rateCategory,
        "benchmarkRate": formValues.benchmarkRate,
        "changeLockFlag": formValues.changeLockFlag,
        "isAddOrSub": formValues.isAddOrSub,
        "isAdd": formValues.isAdd && formValues.isAdd === '1' ? '1' : "",
        "isSub": formValues.isAdd && formValues.isAdd === '2' ? '2' : "",
        "floatMethod": formValues.floatMethod,
        "addOrSub": formValues.addOrSub,
        "executeRate": formValues.executeRate,
      }
    }
    Object.assign(interestRateList.value[0], listItem)
    Object.assign(formData.value, listItem)
    handleClose()
  })
}

// 利率信息 执行利率计算
function handleCount() {
  const type = interestRateForm.value.type
  if (type === '1') {
    interestRateForm.value.executeRate = interestRateForm.value.fixedRate
  } else {
    if (interestRateForm.value.isAddOrSub === '1') {
      const isAdd = interestRateForm.value.isAdd && interestRateForm.value.isAdd !== "" ? interestRateForm.value.isAdd : "2",
        floatM = interestRateForm.value.floatMethod
      interestRateForm.value.executeRate = countRate(isAdd, floatM)
    } else {
      interestRateForm.value.executeRate = interestRateForm.value.benchmarkRate
    }
  }
}
function countRate(isAdd, floatM) {
  const benchmarkRate = Number(interestRateForm.value.benchmarkRate) / 100,
    addOrSub = Number(interestRateForm.value.addOrSub) / 100,
    addOrSubRatio = benchmarkRate * addOrSub
  let resultRate = 0
  if (isAdd === '1' && floatM === '1') {
    resultRate = benchmarkRate + addOrSub
  } else if (isAdd === '1' && floatM === '2') {
    resultRate = benchmarkRate + addOrSubRatio
  } else if (isAdd === '2' && floatM === '1') {
    resultRate = benchmarkRate - addOrSub
  } else if (isAdd === '2' && floatM === '2') {
    resultRate = benchmarkRate - addOrSubRatio
  }
  return parseFloat(resultRate * 100, 6)
}
defineExpose({
  formData
});
</script>