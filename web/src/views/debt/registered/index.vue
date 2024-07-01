<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="140px">
      <el-form-item label="应收账款同意书编号" prop="contractNo">
        <el-input v-model="queryParams.contractNo" placeholder="请输入应收账款同意书编号" clearable @keyup.enter="handleQuery"
          :style="{ width: '240px' }" />
      </el-form-item>
      <el-form-item label="保理申请人" prop="factoringApplicantName">
        <el-input v-model="queryParams.factoringApplicantName" placeholder="请输入保理申请人" clearable @keyup.enter="handleQuery"
          :style="{ width: '240px' }" />
      </el-form-item>
      <el-form-item label="债务人" prop="debtorName">
        <el-input v-model="queryParams.debtorName" placeholder="请输入债务人" clearable @keyup.enter="handleQuery"
          :style="{ width: '240px' }" />
      </el-form-item>
      <el-form-item label="业务产品" prop="bussProduct">
        <el-select v-model="queryParams.bussProduct" filterable :style="{ width: '240px' }" placeholder="请选择">
          <el-option v-for="item in lend_buss_product" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="登记时间">
        <el-date-picker v-model="escalationTime" value-format="YYYY-MM-DD" type="daterange" range-separator="-"
          start-placeholder="开始日期" end-placeholder="结束日期" :style="{ width: '240px' }"></el-date-picker>
      </el-form-item>
      <el-form-item label="上报状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择" clearable :style="{ width: '240px' }">
          <el-option v-for="item in sys_online_status" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <el-table v-loading="loading" :data="registeredList">
      <el-table-column type="index" align="center" fixed width="80" label="序号" />
      <el-table-column label="业务类型" align="center" fixed width="120" prop="bussType">
        <template #default="scope">
          <dict-tag :options="proj_dd_type" :value="scope.row.bussType" />
        </template>
      </el-table-column>
      <el-table-column label="应收账款同意书编号" fixed width="180" align="center" prop="contractNo">
        <template #default="scope">
          <el-button link type="primary" @click="handleView(scope.row)">{{ scope.row.contractNo }}</el-button> </template>
      </el-table-column>
      <el-table-column label="保理申请人" align="center" prop="factoringApplicantName" />
      <el-table-column label="债务人" align="center" prop="debtorName" />
      <el-table-column label="业务产品" align="center" prop="bussProduct">
        <template #default="scope">
          <dict-tag :options="lend_buss_product" :value="scope.row.bussProduct" />
        </template>
      </el-table-column>
      <el-table-column label="币种" align="center" prop="currencyType">
        <template #default="scope">
          <dict-tag :options="sys_currency_type" :value="scope.row.currencyType" />
        </template>
      </el-table-column>
      <el-table-column label="应收账款金额" align="center" prop="debtReceivableAmount" />
      <el-table-column label="放款金额" align="center" prop="loanAmount" />
      <el-table-column label="预计放款日" align="center" prop="dueDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.dueDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="放款到期日" align="center" prop="dueDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.dueDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="宽限期到期日" align="center" prop="dueDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.dueDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="登记时间" align="center" prop="dueDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.dueDate, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="登记状态" align="center" prop="status">
        <template #default="scope">
          <dict-tag :options="sys_online_status" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right" width="200">
        <template #default="scope">
          <div class="button-display">
            <el-button link type="primary" icon="View" @click="handleView(scope.row)"
              v-hasPermi="['debt:info:view']">查看</el-button>
            <el-button link type="primary" icon="DocumentChecked" @click="handleUpdate(scope.row)"
              v-hasPermi="['debt:info:edit']" v-if="scope.row.status == 1">登记</el-button>
            <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['debt:info:edit']"
              v-if="scope.row.status == 2 || scope.row.status == 3">变更</el-button>
            <el-button link type="primary" icon="DocumentDelete" @click="handleCancel(scope.row)"
              v-hasPermi="['debt:info:edit']" v-if="scope.row.status == 2 || scope.row.status == 3">注销</el-button>
          </div>

        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize"
      @pagination="getList" />
  </div>
</template>

<script setup name="Registered">
import { listAdjust, getAdjust, delAdjust, addAdjust, updateAdjust } from "@/api/debt/adjust";
import { listRegistered } from "@/api/debt/Registered";
const route = useRoute();
const router = useRouter();
const { proxy } = getCurrentInstance();

const registeredList = ref([]);

const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
// const ids = ref([]);
// const single = ref(true);
// const multiple = ref(true);
const total = ref(0);
// const statusList = ref([]);
const escalationTime = ref([]);
// let countAmount = ref(0);
// 字典数据引用
const { lend_buss_product, sys_currency_type, sys_online_status, proj_dd_type } = proxy.useDict('lend_buss_product', 'sys_currency_type', 'sys_online_status', 'proj_dd_type');
const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    contractNo: null,
    factoringApplicantName: null,
    debtorName: null,
    bussProduct: null,
    status: '1',
    params: {}
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);
const uniqueId = ref("");
onActivated(() => {
  const time = route.query.t;
  if (time != null && time != uniqueId.value) {
    uniqueId.value = time;
    queryParams.value.pageNum = Number(route.query.pageNum);
    // statusList.value = [];
    proxy.resetForm("queryRef");
    getList();
  }
})
/** 查询应收账款要素调整列表 */
function getList() {
  loading.value = true;
  queryParams.value.params = {};
  if (null != escalationTime && '' != escalationTime) {
    queryParams.value.params["escalationBeginTime"] = escalationTime.value[0];
    queryParams.value.params["escalationEndTime"] = escalationTime.value[1];
  }else {
    queryParams.value.params["escalationBeginTime"] = '';
    queryParams.value.params["escalationEndTime"] = '';
  }
  listRegistered(queryParams.value).then(response => {
    registeredList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}


/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  escalationTime.value = [];
  proxy.resetForm("queryRef");
  // statusList.value = [];
  handleQuery();
}

// 多选框选中数据
// function handleSelectionChange(selection) {
//   ids.value = selection.map(item => item.voucherId);
//   countAmount.value = selection.reduce((sum, curr) => sum + curr.debtReceivableAmount, 0);
//   single.value = selection.length != 1;
//   multiple.value = !selection.length;
// }

// 查看页面
function handleView(row) {
  console.log(row);
  const _id = row.voucherId
  // let selectItem = registeredList.value.filter(item => _id.indexOf(item.voucherId) > -1);
  // let contractId = selectItem[0].contractId;
  // console.log(contractId);
  // var everyResult = selectItem.every(item => item.contractId === contractId);
  // if (!everyResult) {
  //   proxy.$modal.confirm('只能同时调整相同业务下的应收款项！')
  //   return;
  // }
  router.push({ name: 'Debt/registered/detail', state: { voucherId: _id, viewFlag: true, pageNum: queryParams.value.pageNum } });
}

/** 登记，变更按钮操作 */
function handleUpdate(row) {
  const _id = row.voucherId
  router.push({ name: 'Debt/registered/detail', state: { voucherId: _id, pageNum: queryParams.value.pageNum } });
}

/** 注销按钮操作 */
function handleCancel(row) {
  const _id = row.voucherId
  router.push({ name: 'Debt/registered/detail', state: { voucherId: _id, cancelFlag: true, pageNum: queryParams.value.pageNum } });
}

/** 提交按钮 */
// function submitForm() {
//   proxy.$refs["adjustRef"].validate(valid => {
//     if (valid) {
//       if (form.value.id != null) {
//         updateAdjust(form.value).then(response => {
//           proxy.$modal.msgSuccess("修改成功");
//           open.value = false;
//           getList();
//         });
//       } else {
//         addAdjust(form.value).then(response => {
//           proxy.$modal.msgSuccess("新增成功");
//           open.value = false;
//           getList();
//         });
//       }
//     }
//   });
// }

/** 删除按钮操作 */
// function handleDelete(row) {
//   const _ids = row.id || ids.value;
//   proxy.$modal.confirm('是否确认删除应收账款要素调整编号为"' + _ids + '"的数据项？').then(function () {
//     return delAdjust(_ids);
//   }).then(() => {
//     getList();
//     proxy.$modal.msgSuccess("删除成功");
//   }).catch(() => { });
// }

/** 导出按钮操作 */
// function handleExport() {
//   proxy.download('debt/adjust/export', {
//     ...queryParams.value
//   }, `adjust_${new Date().getTime()}.xlsx`)
// }

getList();
</script>
