<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="85px">
      <el-form-item label="业务合同号" prop="contractNo">
        <el-input v-model="queryParams.contractNo" placeholder="请输入业务合同号" clearable @keyup.enter="handleQuery"
          :style="{ width: '240px' }" />
      </el-form-item>
      <el-form-item label="业务产品" prop="bussProduct">
        <el-select v-model="queryParams.bussProduct" filterable placeholder="请选择">
          <el-option v-for="item in lend_buss_product" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>

      </el-form-item>
      <el-form-item label="保理申请人" prop="factoringApplicantName">
        <el-input v-model="queryParams.factoringApplicantName" placeholder="请输入保理申请人" clearable
          @keyup.enter="handleQuery" :style="{ width: '240px' }" />
      </el-form-item>
      <el-form-item label="借款人" prop="accountDebtorName">
        <el-input v-model="queryParams.accountDebtorName" placeholder="请输入借款人" clearable @keyup.enter="handleQuery"
          :style="{ width: '240px' }" />
      </el-form-item>
      <el-form-item label="币种" prop="loanCurrency">
        <el-select v-model="queryParams.loanCurrency" filterable placeholder="请选择">
          <el-option v-for="item in sys_currency_type" :key="item.value" :label="item.label" :value="item.value">
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

    <el-table v-loading="loading" :data="arrearsList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column type="index" align="center" label="序号" />
      <el-table-column label="交易批次号" align="center" prop="jyNum" >
        <template #default="scope">
          <el-button link type="primary" @click="handleView(scope.row)">{{ scope.row.jyNum }}</el-button> </template>
      </el-table-column>
      <el-table-column label="交易入账日" align="center" prop="entryDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.entryDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="交易日" align="center" prop="dueDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.dueDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="保理申请人" align="center" prop="factoringApplicantName" />
    
      <el-table-column label="债务人" align="center" prop="agreeDebtorName" />
      <el-table-column label="未划转尾款总余额" align="center" prop="debtReceivableBalance" />

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <div class="button-display">
            <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
              v-hasPermi="['debt:loan:edit']">录入</el-button>
            <el-button link type="primary" icon="View" @click="handleView(scope.row)"
              v-hasPermi="['debt:loan:edit']">查看</el-button>
            <!-- <el-button link type="primary" icon="Delete" @click="handleView(scope.row)" v-hasPermi="['debt:loan:remove']">删除</el-button> -->
          </div>
        </template>
      </el-table-column>

    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script setup name="Adjust">
import { listArrears, getArrears, delArrears, addArrears, updateArrears } from "@/api/debt/arrears";
const route = useRoute();
const router = useRouter();
const { proxy } = getCurrentInstance();

const arrearsList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const statusList = ref([]);
let countAmount = ref(0);
const { debt_status, debt_contact_status,sys_currency_type } = proxy.useDict('debt_status', 'debt_contact_status','sys_currency_type');
const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    debtAdjustId: null,
    Id: null,
    voucherNo: null,
    debtReceivableAmount: null,
    debtReceivableAmountNew: null,
    debtReceivableBalance: null,
    debtReceivableBalanceNew: null,
    dueDate: null,
    coalTon: null,
    price: null,
    loanRatio: null,
    createById: null,
    updateById: null,
    params:{},
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
    statusList.value = [];
    proxy.resetForm("queryRef");
    getList();
  }
})
/** 查询应收账款要素调整列表 */
function getList() {
  loading.value = true;
  if (statusList.value.length) {
    queryParams.value.params["status"] = statusList.value.join(',')
  } else {
    queryParams.value.params["status"] = "";
  }
  listArrears(queryParams.value).then(response => {
    arrearsList.value = response.rows;
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
  proxy.resetForm("queryRef");
  statusList.value = [];
  handleQuery();
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id);
  countAmount.value = selection.reduce((sum, curr) => sum + curr.debtReceivableAmount, 0);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd(row) {
  const _id = row ?  [row.id] : ids.value;
  router.push({ name: 'Debt/arrear/detail', state: { pageNum: queryParams.value.pageNum,Id: _id.join(','),  } });
}

// 查看页面
function handleView(row) {
  console.log(row);
  const _id = row ?  [row.id] : ids.value;
 
  router.push({  name: 'Debt/arrear/detail',  state: { arrEarsId: _id.join(','), viewFlag: true, pageNum: queryParams.value.pageNum } });
}
/** 修改按钮操作 */
function handleUpdate(row) {
  
  const _id =  row ?  [row.id] : ids.value
  router.push({ name: 'Debt/arrear/detail', state: { arrEarsId: _id, pageNum: queryParams.value.pageNum } });
}


/** 提交按钮 */
function submitForm() {
  proxy.$refs["adjustRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateArrears(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addArrears(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _ids = row.id || ids.value;
  proxy.$modal.confirm('是否确认删除应收账款要素调整编号为"' + _ids + '"的数据项？').then(function() {
    return delArrears(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('debt/adjust/export', {
    ...queryParams.value
  }, `adjust_${new Date().getTime()}.xlsx`)
}

getList();
</script>
