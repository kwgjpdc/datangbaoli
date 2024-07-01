<template>
  <div class="btn-dialog">
    <el-tag class="tag-btn" @click="openDialog">历程</el-tag>
    <el-dialog v-model="dialogVisible" class="popup-dialog info-form-container" style="width: 95%; max-width: 1260px;" title="历程" :append-to-body="true">
      <el-table :data="dataList">
            <el-table-column type="index" align="center" width="50" fixed/>
            <el-table-column label="操作" width="120" align="center" fixed>
                <div class="flex-around-center">
                  <TransactionDetails></TransactionDetails>
                </div>
            </el-table-column>
            <el-table-column label="批次号" align="center" prop="no" min-width="240" fixed/>
            <el-table-column label="是否主档回复" align="center" min-width="120">
              <template #default="scope">
                <dict-tag :options="sys_true_or_false" :value="scope.row.replyFlag"/>
              </template>
            </el-table-column>
            <el-table-column label="交易日期" align="center" min-width="120">
              <template #default="scope">
                  <span>{{ parseTime(scope.row.date, '{y}-{m}-{d}') }}</span>
                </template>
              </el-table-column>
            <el-table-column label="交易型态" align="center" prop="type" min-width="120"/>
            <el-table-column label="融资状态" align="center" prop="status" min-width="120"/>
          </el-table>
    </el-dialog>
  </div>
</template>

<script setup>
import TransactionDetails from "./TransactionDetails"
const { proxy } = getCurrentInstance();
import { deepClone } from "@/utils/index"
const route = useRoute();
const router = useRouter();
const { sys_true_or_false } = proxy.useDict("sys_true_or_false");//下拉框字典

const props = defineProps({
  id: {
    default: "",
  }
});

const dialogVisible = ref(false)

const dataScope = reactive({
  dataList: [{
    no: "38639",
    replyFlag: "0",
    date: "2020-09-29",
    type: "放款申请并受理",
    status: "申请受理同意"
  }],
});

const { dataList } = toRefs(dataScope);

// 打开弹窗
function openDialog() {
  dialogVisible.value = true
}

</script>

<style lang="scss" scoped>
@import "../../assets/styles/infoForm.scss";
</style>