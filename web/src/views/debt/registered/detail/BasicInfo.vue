<template>
  <el-form class="info-form" ref="elForm" :model="formData" :rules="rules" label-width="140px"
    :disabled="props.routerQueryObj.viewFlag || props.routerQueryObj.cancelFlag">
    <el-collapse v-model="activeNames">
      <el-collapse-item title="基本信息" name="1">
        <el-row :gutter="15" style="margin-right: 30px;">
          <el-col :xl="6" :lg="8" :sm="12" :xs="24">
            <el-form-item label="业务类型" prop="bussType">
              <el-select v-model="formData.bussType" disabled filterable placeholder="请选择">
                <el-option v-for="item in registered_buss_type" :key="item.value" :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item></el-col>
          <el-col :xl="6" :lg="8" :sm="12" :xs="24">
            <el-form-item label="登记期限" prop="registerPeriod">
              <el-input v-model="formData.registerPeriod" clearable disabled>
                <template #suffix>
                  <span>个月</span>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="6" :lg="8" :sm="12" :xs="24">
            <el-form-item label="填表人归档号" prop="archiveNumber">
              <el-input v-model="formData.archiveNumber" clearable disabled></el-input>
            </el-form-item></el-col>
          <el-col :xl="6" :lg="8" :sm="12" :xs="24">
            <el-form-item label="初始登记编号" prop="registerNo">
              <el-input v-model="formData.registerNo" placeholder="系统自动生成" clearable disabled></el-input>
            </el-form-item></el-col>
          <el-col :xl="6" :lg="8" :sm="12" :xs="24">
            <el-form-item label="修改码" prop="modifyCode">
              <el-input v-model="formData.modifyCode" placeholder="系统自动生成" clearable disabled></el-input>
            </el-form-item></el-col>
          <el-col :xl="6" :lg="8" :sm="12" :xs="24">
            <el-form-item label="填表人" prop="filledBy">
              <el-input v-model="formData.filledBy" clearable disabled></el-input>
            </el-form-item></el-col>
          <el-col :xl="6" :lg="8" :sm="12" :xs="24">
            <el-form-item label="保理申请人" prop="factoringApplicantName">
              <el-input v-model="formData.factoringApplicantName" clearable disabled></el-input>
            </el-form-item></el-col>
          <el-col :xl="6" :lg="8" :sm="12" :xs="24">
            <el-form-item label="业务产品" prop="bussProduct">
              <el-select v-model="formData.bussProduct" disabled placeholder="请选择">
                <el-option v-for="item in lend_buss_product" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item></el-col>
          <el-col :xl="6" :lg="8" :sm="12" :xs="24">
            <el-form-item label="应收账款同意书编号" prop="agreementNo">
              <el-input v-model="formData.agreementNo" clearable disabled></el-input>
            </el-form-item></el-col>
          <el-col :xl="6" :lg="8" :sm="12" :xs="24">
            <el-form-item label="放款币种" prop="loanCurrencyType">
              <el-select v-model="formData.loanCurrencyType" disabled placeholder="请选择">
                <el-option v-for="item in sys_currency_type" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item></el-col>
          <el-col :xl="6" :lg="8" :sm="12" :xs="24">
            <el-form-item label="宽限期天数" prop="gracePeriod">
              <el-input v-model="formData.gracePeriod" clearable disabled>
                <template #suffix>
                  <span>天</span>
                </template>
              </el-input>
            </el-form-item></el-col>
          <el-col :xl="6" :lg="8" :sm="12" :xs="24">
            <el-form-item label="债务人" prop="agreeDebtorName">
              <el-input v-model="formData.agreeDebtorName" clearable disabled></el-input>
            </el-form-item></el-col>
          <el-col :xl="6" :lg="8" :sm="12" :xs="24">
            <el-form-item label="应收账款币种" prop="debtCurrencyType">
              <el-select v-model="formData.debtCurrencyType" disabled filterable placeholder="请选择">
                <el-option v-for="item in sys_currency_type" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item></el-col>
          <el-col :xl="6" :lg="8" :sm="12" :xs="24">
            <el-form-item label="应收账款金额" prop="debtReceivableAmount">
              <ElPriceInput v-model:form="formData" prop="debtReceivableAmount" :rules="rules" :disabled="true"
                :placeholder="'请输入'">
                <template #prefix>
                  <span> ￥ </span>
                </template>
                <template #suffix>
                  <span> 元 </span>
                </template>
              </ElPriceInput>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="财产描述" prop="propertyDescription">
              <el-input type="textarea" maxlength="255" rows="2" show-word-limit placeholder="请输入"
                v-model="formData.propertyDescription"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

      </el-collapse-item>

      <el-collapse-item title="出让人信息" name="2">
        <el-table v-loading="loading" :data="formData.transferList" style="margin-bottom: 20px;">
          <el-table-column label="序号" align="center" type="index" width="60" fixed />

          <el-table-column label="债务人类型" align="center" prop="debtType" fixed min-width="120px">
            <template #default="scope">
              <dict-tag :options="sys_debtor_type" :value="scope.row.debtType" />
            </template>
          </el-table-column>

          <el-table-column label="债务人" align="center" prop="debtName" fixed />

          <el-table-column label="统一社会信用代码" align="center" prop="creditCode" fixed width="240px" />

          <el-table-column label="法定代表人或负责人姓名" align="center" prop="corporationName" width="240px">
            <template #default="scope">
              <el-input v-model="scope.row.corporationName" placeholder="请输入" clearable maxlength="32"></el-input>
            </template>
          </el-table-column>

          <el-table-column label="企业所属行业" align="center" prop="industry" min-width="160px">
            <template #default="scope">
              <el-select v-model="scope.row.industry" placeholder="请选择">
                <el-option v-for="item in cont_industry_type" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </template>
          </el-table-column>

          <el-table-column label="国家" align="center" prop="country" min-width="180px">
            <template #default="scope">
              <el-select v-model="scope.row.country" filterable placeholder="请选择">
                <el-option v-for="item in sys_country" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </template>
          </el-table-column>

          <el-table-column label="所在地区" min-width="240px" align="center" prop="provinceCity">
            <template #default="scope">
              <el-cascader :options="pcTextArr" v-model="scope.row.provinceAndCity" clearable
                @change="locationChange($event, scope.row)"></el-cascader>
            </template>
          </el-table-column>

          <el-table-column label="详细地址" align="center" prop="address" min-width="360px">
            <template #default="scope">
              <el-input v-model="scope.row.address" placeholder="请输入" clearable maxlength="64"></el-input>
            </template>
          </el-table-column>

        </el-table>


      </el-collapse-item>

    </el-collapse>

  </el-form>
</template>
<script setup>
const { proxy } = getCurrentInstance();
import { deepClone } from "@/utils/index"
// 地址选择器的中国全省市区数据
import { pcTextArr } from "element-china-area-data"
import ElPriceInput from "@/components/ElPriceInput"

const props = defineProps({
  registrationInfo: {
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
const dataScope = reactive({
  rules: {},//验证规律
});

const { rules } = toRefs(dataScope);

const {
  sys_currency_type,
  registered_buss_type,
  lend_buss_product,
  sys_debtor_type,
  cont_industry_type,
  sys_country, province
} = proxy.useDict(
  "sys_currency_type",
  "registered_buss_type",
  "lend_buss_product",
  "sys_debtor_type",
  "cont_industry_type",
  "sys_country", "province"
);//下拉框字典

let formData = ref({});

watch(() => props.registrationInfo, (newValue, oldValue) => {
  // console.log(newValue);
  if (newValue) {
    formData.value = deepClone(newValue);
    if (formData.value.transferList && formData.value.transferList.length > 0) {
      for (let item of formData.value.transferList) {
        item.provinceAndCity = [item.province, item.city]
      }
    } else {
      formData.value.transferList = []
    }
  }
}, { immediate: true, deep: true })

// 所在地区修改
function locationChange(value, item) {
  item.province = value[0]
  item.city = value[1]
}

defineExpose({
  formData
});

</script>

<style lang="scss" scoped>
.box-card {
  margin-bottom: 20px;
}

.page {
  margin-top: 10px;

}

.header-button-operate {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}
</style>
