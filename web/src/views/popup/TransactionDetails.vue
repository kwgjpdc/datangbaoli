<template>
  <div class="btn-dialog">
    <el-tag class="tag-btn" @click="openDialog">交易明细</el-tag>
    <el-dialog v-model="dialogVisible" class="popup-dialog info-form-container" style="width: 95%; max-width: 1260px;" title="交易明细" :append-to-body="true">
      <el-form class="info-form" :model="formInfo" :disabled="true" :label-width="130">
        <el-row :gutter="15" style="margin-right: 30px">
          <el-col :lg="8" :md="12" :sm="24">
            <el-form-item label="保理申请人" prop="text">
              <el-input v-model="formInfo.text" placeholder="保理申请人"></el-input>
            </el-form-item>
          </el-col>
          <el-col :lg="8" :md="12" :sm="24">
            <el-form-item label="业务产品" prop="bussProduct">
              <el-select v-model="formInfo.bussProduct" filterable placeholder="业务产品">
                <el-option v-for="item in lend_buss_product" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :lg="8" :md="12" :sm="24">
            <el-form-item label="放款编号" prop="text">
              <el-input v-model="formInfo.text" placeholder="放款编号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :lg="8" :md="12" :sm="24">
            <el-form-item label="放款方式" prop="bussProduct">
              <el-select v-model="formInfo.bussProduct" filterable placeholder="放款方式">
                <el-option v-for="item in lend_buss_product" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="15" style="margin-right: 30px">
          <el-col :lg="8" :md="12" :sm="24">
            <el-form-item label="放款金额" prop="amount">
              <ElPriceInput :form="formInfo" prop="amount" placeholder="放款金额" :disabled="true"></ElPriceInput>
            </el-form-item>
          </el-col>
          <el-col :lg="8" :md="12" :sm="24">
            <el-form-item label="实际入账金额" prop="amount">
              <ElPriceInput :form="formInfo" prop="amount" placeholder="实际入账金额" :disabled="true"></ElPriceInput>
            </el-form-item>
          </el-col>
          <el-col :lg="8" :md="12" :sm="24">
            <el-form-item label="申请放款日" prop="date">
              <el-date-picker type="date" v-model="formInfo.date" value-format="YYYY-MM-DD" placeholder="申请放款日"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :lg="8" :md="12" :sm="24">
            <el-form-item label="放款到期日" prop="date">
              <el-date-picker type="date" v-model="formInfo.date" value-format="YYYY-MM-DD" placeholder="放款到期日"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :lg="8" :md="12" :sm="24">
            <el-form-item label="宽限期天数" prop="date">
              <el-date-picker type="date" v-model="formInfo.date" value-format="YYYY-MM-DD" placeholder="宽限期天数"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="15" style="margin-right: 30px">
          <el-col :lg="8" :md="12" :sm="24">
            <el-form-item label="放款日" prop="date">
              <el-date-picker type="date" v-model="formInfo.date" value-format="YYYY-MM-DD" placeholder="放款日"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :lg="8" :md="12" :sm="24">
            <el-form-item label="预收利息" prop="amount">
              <ElPriceInput :form="formInfo" prop="amount" placeholder="预收利息" :disabled="true"></ElPriceInput>
            </el-form-item>
          </el-col>
          <el-col :lg="8" :md="12" :sm="24">
            <el-form-item label="放款结果" prop="text">
              <el-input v-model="formInfo.text" placeholder="放款结果"></el-input>
            </el-form-item>
          </el-col>
          <el-col :lg="8" :md="12" :sm="24">
            <el-form-item label="借据号" prop="text">
              <el-input v-model="formInfo.text" placeholder="借据号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :lg="8" :md="12" :sm="24">
            <el-form-item label="放款账号" prop="text">
              <el-input v-model="formInfo.text" placeholder="放款账号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="24">
            <el-form-item label="备注" prop="remark">
              <el-input type="textarea" maxlength="255" show-word-limit rows="2"/>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 资金来源信息 -->
        <el-card class="info-card">
          <template #header>
            <h3 class="info-card-title">资金来源信息</h3>
          </template>
          <el-table :data="list1">
            <el-table-column type="index" align="center" width="50" fixed/>
            <el-table-column label="资金编号" align="center" prop="no" min-width="240" fixed/>
            <el-table-column label="币种" align="center" min-width="120">
              <template #default="scope">
                <dict-tag :options="sys_currency_type" :value="scope.row.currency"></dict-tag>
              </template>
            </el-table-column>
            <el-table-column label="资金金额" align="center" min-width="180">
              <template #default="scope">
                  <span>{{ formatMoney(scope.row.amount) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="关联金额" align="center" min-width="180">
              <template #default="scope">
                  <span>{{ formatMoney(scope.row.amount1) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="资金来源" align="center" prop="method" min-width="120"/>
            <el-table-column label="到期日" align="center" min-width="120">
              <template #default="scope">
                  <span>{{ parseTime(scope.row.endDate, '{y}-{m}-{d}') }}</span>
                </template>
              </el-table-column>
          </el-table>
        </el-card>
        <!-- 资金来源信息 end-->

        <!-- 费用信息 -->
        <el-card  class="info-card">
          <template #header>
            <h3 class="info-card-title">费用信息</h3>
          </template>
          <el-table :data="list2">
            <el-table-column type="index" align="center" width="50" fixed/>
            <el-table-column label="费用名目" align="center" prop="name" min-width="180" fixed/>
            <el-table-column label="是否本次收取" align="center" min-width="120">
                    <template #default="scope">
                        <dict-tag
                            :options="sys_true_or_false"
                            :value="scope.row.flag"
                        />
                    </template>
              </el-table-column>
              <el-table-column label="费用币种" align="center" min-width="120">
              <template #default="scope">
                <dict-tag :options="sys_currency_type" :value="scope.row.currency"></dict-tag>
              </template>
            </el-table-column>
            <el-table-column label="费用金额" align="center" min-width="120">
              <template #default="scope">
                  <span>{{ formatMoney(scope.row.amount) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="本次收取金额" align="center" min-width="120">
              <template #default="scope">
                  <span>{{ formatMoney(scope.row.amount1) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="尚欠金额" align="center" min-width="120">
              <template #default="scope">
                  <span>{{ formatMoney(scope.row.amount2) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="实际收取日" align="center" min-width="120">
              <template #default="scope">
                  <span>{{ parseTime(scope.row.date, '{y}-{m}-{d}') }}</span>
                </template>
              </el-table-column>
            <el-table-column label="费用到期日" align="center" min-width="120">
              <template #default="scope">
                  <span>{{ parseTime(scope.row.endDate, '{y}-{m}-{d}') }}</span>
                </template>
              </el-table-column>
          </el-table>
        </el-card>
        <!-- 计息明细 end-->
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup>
const { proxy } = getCurrentInstance();
import { deepClone } from "@/utils/index"
import ElPriceInput from "@/components/ElPriceInput"
import { formatMoney, formatPercent } from "@/utils/formatMoney"
const route = useRoute();
const router = useRouter();
const { lend_buss_product,
  sys_currency_type,
  cont_pay, cont_interest_cycle, sys_true_or_false } = proxy.useDict("lend_buss_product",
    "sys_currency_type",
    "cont_pay", "cont_interest_cycle", "sys_true_or_false");//下拉框字典

const props = defineProps({
  id: {
    default: "",
  }
});

const dialogVisible = ref(false)

const dataScope = reactive({
  formInfo: {},
  list1: [{
    no: "xxxxxxxxxxxx",
    endDate: "2025-04-20",
    method: "资金来源",
    currency: "1",
    amount: 20000,
    amount1: 20000
  }],
  list2: [{
    name: "xxxxxxxxxxxx",
    flag: "1",
    currency: "1",
    amount: 20000,
    amount1: 10000,
    amount2: 10000,
    date: "2025-04-20",
    endDate: "2025-04-20"
  }]
});

const { formInfo, list1, list2 } = toRefs(dataScope);

// 打开弹窗
function openDialog() {
  dialogVisible.value = true
}

// 翻页
function pageList(type) {
  console.log('翻页', type)
}

// 造假数据
function mockData() {
  const item1 = list1.value[0],
  item2 = list2.value[0]
  let mockList1 = new Array(12).fill(item1),
  mockList2 = new Array(15).fill(item2)
  list1.value = deepClone(mockList1)
  list2.value = deepClone(mockList2)
  pager1.value.total = 12
  pager2.value.total = 15
}

// mockData()

</script>

<style lang="scss" scoped>
@import "../../assets/styles/infoForm.scss";
</style>