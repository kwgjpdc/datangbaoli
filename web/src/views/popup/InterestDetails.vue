<template>
  <div class="btn-dialog">
    <el-tag class="tag-btn" @click="openDialog">利息明细</el-tag>
    <el-dialog v-model="dialogVisible" class="popup-dialog info-form-container" style="width: 95%; max-width: 1260px;" title="利息明细" :append-to-body="true">
      <el-form class="info-form" :model="formInfo" :disabled="true" :label-width="130">
        <el-row :gutter="15" style="margin-right: 30px">
          <el-col :lg="8" :md="12" :sm="24">
            <el-form-item label="利息总金额" prop="amount">
              <ElPriceInput :form="formInfo" prop="amount" placeholder="利息总金额" :disabled="true"></ElPriceInput>
            </el-form-item>
          </el-col>
          <el-col :lg="8" :md="12" :sm="24">
            <el-form-item label="欠息标志" prop="bussProduct">
              <el-select v-model="formInfo.bussProduct" filterable placeholder="欠息标志">
                <el-option v-for="item in lend_buss_product" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :lg="8" :md="12" :sm="24">
            <el-form-item :label="'未收本金利息\n[含调整]'" prop="amount">
              <ElPriceInput :form="formInfo" prop="amount" placeholder="未收本金利息[含调整]" :disabled="true"></ElPriceInput>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="15" style="margin-right: 30px">
          <el-col :lg="8" :md="12" :sm="24">
            <el-form-item label="未收欠息" prop="amount">
              <ElPriceInput :form="formInfo" prop="amount" placeholder="未收欠息" :disabled="true"></ElPriceInput>
            </el-form-item>
          </el-col>
          <el-col :lg="8" :md="12" :sm="24">
            <el-form-item label="未收欠息利息" prop="amount">
              <ElPriceInput :form="formInfo" prop="amount" placeholder="未收欠息利息" :disabled="true"></ElPriceInput>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="15" style="margin-right: 30px">
          <el-col :lg="8" :md="12" :sm="24">
            <el-form-item label="总已收利息" prop="amount">
              <ElPriceInput :form="formInfo" prop="amount" placeholder="总已收利息" :disabled="true"></ElPriceInput>
            </el-form-item>
          </el-col>
          <el-col :lg="8" :md="12" :sm="24">
            <el-form-item :label="'已收本金利息\n[含调整]'" prop="amount">
              <ElPriceInput :form="formInfo" prop="amount" placeholder="已收本金利息[含调整]" :disabled="true"></ElPriceInput>
            </el-form-item>
          </el-col>
          <el-col :lg="8" :md="12" :sm="24">
            <el-form-item label="已收欠息" prop="amount">
              <ElPriceInput :form="formInfo" prop="amount" placeholder="已收欠息" :disabled="true"></ElPriceInput>
            </el-form-item>
          </el-col>
          <el-col :lg="8" :md="12" :sm="24">
            <el-form-item label="上次计息日" prop="date">
              <el-date-picker type="date" v-model="formInfo.date" value-format="YYYY-MM-DD" placeholder="上次计息日"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :lg="8" :md="12" :sm="24">
            <el-form-item label="总已提列利息" prop="amount">
              <ElPriceInput :form="formInfo" prop="amount" placeholder="总已提列利息" :disabled="true"></ElPriceInput>
            </el-form-item>
          </el-col>
          <el-col :lg="8" :md="12" :sm="24">
            <el-form-item label="已收欠息利息" prop="amount">
              <ElPriceInput :form="formInfo" prop="amount" placeholder="已收欠息利息" :disabled="true"></ElPriceInput>
            </el-form-item>
          </el-col>
          <el-col :lg="8" :md="12" :sm="24">
            <el-form-item label="累计调整利息" prop="amount">
              <ElPriceInput :form="formInfo" prop="amount" placeholder="累计调整利息" :disabled="true"></ElPriceInput>
            </el-form-item>
          </el-col>
          <el-col :lg="8" :md="12" :sm="24">
            <el-form-item :label="'正常应收利息余额\n(已提)'" prop="amount">
              <ElPriceInput :form="formInfo" prop="amount" placeholder="正常应收利息余额(已提)" :disabled="true"></ElPriceInput>
            </el-form-item>
          </el-col>
          <el-col :lg="8" :md="12" :sm="24">
            <el-form-item :label="'应收违约金余额\n(已提)'" prop="amount">
              <ElPriceInput :form="formInfo" prop="amount" placeholder="应收违约金余额(已提)" :disabled="true"></ElPriceInput>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 提列明细 -->
        <el-card class="info-card">
          <template #header>
            <h3 class="info-card-title">提列明细</h3>
          </template>
          <el-table :data="list1.slice((pager1.pageNum-1)*pager1.pageSize,pager1.pageNum*pager1.pageSize)">
            <el-table-column type="index" align="center" width="50" fixed/>
            <el-table-column label="单据号码" align="center" prop="no" min-width="240" fixed/>
            <el-table-column label="提列起日" align="center" min-width="120">
              <template #default="scope">
                  <span>{{ parseTime(scope.row.startDate, '{y}-{m}-{d}') }}</span>
                </template>
              </el-table-column>
            <el-table-column label="提列讫日" align="center" min-width="120">
              <template #default="scope">
                  <span>{{ parseTime(scope.row.endDate, '{y}-{m}-{d}') }}</span>
                </template>
              </el-table-column>
            <el-table-column label="提列方式" align="center" prop="method" min-width="120"/>
            <el-table-column label="提列天数" align="center" prop="days" min-width="120"/>
            <el-table-column label="提列金额" align="center" min-width="180">
              <template #default="scope">
                  <span>{{ formatMoney(scope.row.amount) }}</span>
                </template>
              </el-table-column>
          </el-table>
          <pagination v-show="pager1.total > 0" :total="pager1.total" v-model:page="pager1.pageNum"
      v-model:limit="pager1.pageSize" @pagination="pageList('1')" />
        </el-card>
        <!-- 提列明细 end-->

        <!-- 计息明细 -->
        <el-card  class="info-card">
          <template #header>
            <h3 class="info-card-title">计息明细</h3>
          </template>
          <el-table :data="list2.slice((pager2.pageNum-1)*pager2.pageSize,pager2.pageNum*pager2.pageSize)">
            <el-table-column type="index" align="center" width="50" fixed/>
            <el-table-column label="单据号码" align="center" prop="no" min-width="240" fixed/>
            <el-table-column label="计息止日" align="center" min-width="120">
              <template #default="scope">
                  <span>{{ parseTime(scope.row.endDate, '{y}-{m}-{d}') }}</span>
                </template>
              </el-table-column>
            <el-table-column label="计息天数" align="center" prop="days" min-width="120"/>
            <el-table-column label="本金余额" align="center" min-width="120">
              <template #default="scope">
                  <span>{{ formatMoney(scope.row.amount) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="利率周期" align="center" prop="cycle" min-width="120">
                    <template #default="scope">
                        <dict-tag
                            :options="cont_interest_cycle"
                            :value="scope.row.cycle"
                        />
                    </template>
              </el-table-column>
              <el-table-column label="本金利率" align="center" min-width="120">
              <template #default="scope">
                  <span>{{ formatPercent(scope.row.rate) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="欠息利率周期" align="center" min-width="120">
                    <template #default="scope">
                        <dict-tag
                            :options="cont_interest_cycle"
                            :value="scope.row.cycle1"
                        />
                    </template>
              </el-table-column>
              <el-table-column label="欠息余额" align="center" min-width="120">
              <template #default="scope">
                  <span>{{ formatMoney(scope.row.amount1) }}</span>
                </template>
              </el-table-column>
          </el-table>
          <pagination v-show="pager2.total > 0" :total="pager2.total" v-model:page="pager2.pageNum"
      v-model:limit="pager2.pageSize" @pagination="pageList('2')" />
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
  cont_pay, cont_interest_cycle } = proxy.useDict("lend_buss_product",
    "sys_currency_type",
    "cont_pay", "cont_interest_cycle");//下拉框字典

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
    startDate: "2024-04-20",
    endDate: "2025-04-20",
    method: "提列方式",
    days: 12,
    amount: 20000
  }],
  pager1: {
    total: 1,
    pageNum: 1,
    pageSize: 10
  },
  list2: [{
    no: "xxxxxxxxxxxx",
    endDate: "2025-04-20",
    days: 12,
    amount: 20000,
    cycle: "1",
    rate: 1.2,
    cycle1: "1",
    amount1: 100
  }],
  pager2: {
    total: 1,
    pageNum: 1,
    pageSize: 10
  },
});

const { formInfo, list1, pager1, list2, pager2 } = toRefs(dataScope);

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