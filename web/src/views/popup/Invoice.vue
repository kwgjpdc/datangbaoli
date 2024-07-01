<template>
  <div class="btn-dialog">
    <el-tag class="tag-btn" @click="openDialog">发票查询</el-tag>
    <el-dialog v-model="dialogVisible" class="popup-dialog info-form-container" style="width: 95%; max-width: 1260px;" title="发票信息" :append-to-body="true">
      <el-form class="info-form" :model="formInfo" :disabled="true" :label-width="130">
        <!-- 提列明细 -->
        <el-card class="info-card">
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