<template>
  <el-form class="info-form" ref="elForm" :model="formData" :rules="rules" label-width="140px"
    :disabled="props.routerQueryObj.viewFlag">
    <el-collapse v-model="activeNames" style="border-top: 0;">
      <el-collapse-item title="买方回款信息" name="1">
        <el-row :gutter="15">
          <el-col :span="24" :xs="24">
            <el-table :data="formData.subList.slice((subTablePage.currentPage - 1)*subTablePage.pageSize,subTablePage.currentPage*subTablePage.pageSize)" style="margin-bottom: 20px;margin-top: 15px;">

              <el-table-column label="序号" align="center" type="index" width="60" fixed />

              <el-table-column label="操作" width="240" align="center" fixed>
                <div class="button-display flex-around-center">
                  <FinancingDetails></FinancingDetails>
                  <InterestDetails></InterestDetails>
                  <Course></Course>
                </div>
              </el-table-column>

              <el-table-column label="放款编号" align="center" min-width="180" prop="loanNo" />

              <el-table-column label="同意书编号" align="center" min-width="180" prop="agreeNo" />

              <el-table-column label="放款到期日" align="center" prop="loanExpireDate" min-width="180">
                <template #default="scope">
                  <span>{{ parseTime(scope.row.loanExpireDate, '{y}-{m}-{d}') }}</span>
                </template>
              </el-table-column>

              <el-table-column label="放款方式" align="center" prop="loanWay" min-width="180">
                <template #default="scope">
                  <dict-tag :options="cont_pay" :value="scope.row.loanWay" />
                </template>
              </el-table-column>

              <el-table-column label="放款余额" align="center" prop="loanBalance" min-width="180">
                <template #default="scope">
                  <span>{{ formatMoney(scope.row.loanBalance) }}</span>
                </template>
              </el-table-column>

              <el-table-column label="风险敞口" align="center" prop="riskExposure" min-width="120">
                <template #default="scope">
                  <span>{{ formatMoney(scope.row.riskExposure) }}</span>
                </template>
              </el-table-column>

              <el-table-column label="尚欠总利息" align="center" prop="totalInterest" min-width="180">
                <template #default="scope">
                  <span>{{ formatMoney(scope.row.totalInterest) }}</span>
                </template>
              </el-table-column>

              <el-table-column label="是否调整利息" align="center" prop="isAdjustInterest" min-width="120">
                <template #default="scope">
                  <el-select v-model="scope.row.isAdjustInterest" placeholder="请选择">
                    <el-option v-for="item in sys_yes_no" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>

              <el-table-column label="违约金" align="center" prop="penalty" min-width="180">
                <template #default="scope">
                  <span>{{ formatMoney(scope.row.penalty) }}</span>
                </template>
              </el-table-column>

              <el-table-column label="本次入账金额" align="center" min-width="240" fixed="right">
                <template #default="scope">
                  <el-form-item :prop="`subList.${scope.$index}.amountReceived`" :rules="rules.amountReceived" class="only-input-content">
                    <ElPriceInput :form="scope.row" prop="amountReceived" :rules="rules.amountReceived"
                    :disabled="props.routerQueryObj.viewFlag">
                  </ElPriceInput>
                  </el-form-item>
                </template>
              </el-table-column>

            </el-table>
          </el-col>
          <el-col :span="24" :xs="24">
            <el-pagination v-show="subTablePage.total > 0" 
              @size-change="hadleSubSizeChange" 
              @current-change="hadleSubCurrentChange"
               v-model:current-page="subTablePage.currentPage" 
               :page-sizes="[5,10,20]" 
               v-model:page-size="subTablePage.pageSize" 
               layout="->, total, sizes, prev, pager, next" 
               :total="subTablePage.total" :small="true"></el-pagination>
          </el-col>
        </el-row>
      </el-collapse-item>

      <el-collapse-item title="回款信息" name="2">
        <el-row :gutter="15" style="margin-right: 30px;">
          <el-col :span="12" :xs="24">
            <el-form-item label="入账总金额" prop="entryAmount" class="btn-input-item">
              <ElPriceInput :form="formData" prop="entryAmount" :rules="rules.entryAmount"
                :disabled="props.routerQueryObj.viewFlag" placeholder="请输入">
              </ElPriceInput>
              <el-button type="primary" plain style="margin-left: 10px;">自动分配</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-collapse-item>
    </el-collapse>


  </el-form>
</template>

<script setup>
import { deepClone } from "@/utils/index"
import { formatMoney } from "@/utils/formatMoney"
import ElPriceInput from "@/components/ElPriceInput"
import FinancingDetails from "@/views/popup/FinancingDetails"
import InterestDetails from "@/views/popup/InterestDetails"
import Course from "@/views/popup/Course"
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

const dataScope = reactive({
  rules: {
    'entryAmount': [
      {
        pattern: /^1000000000$|^1000000000.0$|^1000000000.00$|(^[1-9](\d{0,8})?(\.\d{1,2})?$)|(^0$)|(^\d\.\d{1,2}$)/,
        message: ' 请输入 0-10亿 的正数，可保留两位小数',
        trigger: 'blur',
      },
      { required: true, message: '入账总金额不能为空', trigger: 'blur' }
    ],
    'amountReceived': [
      {
        pattern: /^1000000000$|^1000000000.0$|^1000000000.00$|(^[1-9](\d{0,8})?(\.\d{1,2})?$)|(^0$)|(^\d\.\d{1,2}$)/,
        message: '请输入 0-10亿 的正数，可保留两位小数',
        trigger: 'blur',
      }
    ]
  },//验证规律
  subTablePage: {
    currentPage: 1,
    pageSize: 10,
    total: 1,
  }
});

const { rules, subTablePage } = toRefs(dataScope);
const { sys_yes_no, cont_pay } = proxy.useDict("sys_yes_no", "cont_pay");//下拉框字典
let formData = ref({});//不能修改const 定义的数据

watch(props.infoData, (newValue, oldValue) => {
  console.log(newValue);
  if (newValue) {
    formData.value = deepClone(newValue)
    subTablePage.value.total = formData.value.subList.length
    // console.log('融资回款信息', formData.value)
  }
}, { immediate: true, deep: true })

// 表单验证
function validForm() {
  let result = false
  proxy.$refs['elForm'].validate((valid) => { console.log(valid); result = valid })
  return result
}

// 回款信息翻页操作
function hadleSubSizeChange(val) {
  subTablePage.value.currentPage = 1
  subTablePage.value.pageSize = val
}
function hadleSubCurrentChange(val) {
  subTablePage.currentPage = val
}

defineExpose({
  formData,
  validForm,
});
</script>

<style lang="scss" scoped>
.button-display {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;

  .el-tag {
    cursor: pointer;
  }
}
</style>