<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="85px">
      <el-form-item label="业务合同号" prop="contractNo">
        <el-input v-model="queryParams.contractNo" placeholder="请输入业务合同号" clearable @keyup.enter="handleQuery"
          :style="{ width: '240px' }" />
      </el-form-item>
      <el-form-item label="核心企业" prop="coreEnterpriseName">
        <el-input v-model="queryParams.coreEnterpriseName" placeholder="请输入核心企业" clearable @keyup.enter="handleQuery"
          :style="{ width: '240px' }" />
      </el-form-item>
      <el-form-item label="借款人" prop="accountDebtorName">
        <el-input v-model="queryParams.accountDebtorName" placeholder="请输入借款人" clearable @keyup.enter="handleQuery"
          :style="{ width: '240px' }" />
      </el-form-item>
      <el-form-item label="保理申请人" prop="factoringApplicantName">
        <el-input v-model="queryParams.factoringApplicantName" placeholder="请输入保理申请人" clearable
          @keyup.enter="handleQuery" :style="{ width: '240px' }" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-checkbox-group v-model="statusList">
          <el-checkbox v-for="dict in debt_status" :label="dict.value" :name="dict.value" :key="dict.value">{{
            dict.label }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-form :model="form" label-width="120px" :inline="true" >
   
 
        <el-form-item label="勾选凭证笔数">
          <el-col :span="3">
      <el-input v-model="ids.length" :style="{ width: '240px' }" disabled />
      </el-col>
    </el-form-item>
        
   
        <el-form-item label="勾选凭证总金额">
            
      <el-col :span="3">
      <el-input v-model="countAmount" :style="{ width: '240px' }"  disabled />
    </el-col>
    </el-form-item>
    <el-form-item>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Edit"
          :disabled="multiple"
          @click="handleAdd()"
          v-hasPermi="['debt:adjust:adjust']"
        >调整</el-button>
      </el-col>
    </el-form-item>
      </el-form>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="adjustList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column type="index" align="center" label="序号" />
      <el-table-column label="凭证号码" align="center" prop="voucherNo" >
        <template #default="scope">
          <el-button link type="primary" @click="handleView(scope.row)">{{ scope.row.voucherNo }}</el-button> </template>
      </el-table-column>
      <el-table-column label="应收账款到期日" align="center" prop="dueDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.dueDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="应收账款金额" align="center" prop="debtReceivableAmount" />
    
      <el-table-column label="应收账款余额" align="center" prop="debtReceivableBalance" />
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
import { listAdjust, getAdjust, delAdjust, addAdjust, updateAdjust } from "@/api/debt/adjust";
const route = useRoute();
const router = useRouter();
const { proxy } = getCurrentInstance();

const adjustList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const statusList = ref([]);
let countAmount = ref(0);
const { debt_status, debt_contact_status } = proxy.useDict('debt_status', 'debt_contact_status');
const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    debtAdjustId: null,
    voucherId: null,
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
  listAdjust(queryParams.value).then(response => {
    adjustList.value = response.rows;
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
  ids.value = selection.map(item => item.voucherId);
  countAmount.value = selection.reduce((sum, curr) => sum + curr.debtReceivableAmount, 0);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd(row) {
  const _id = row ?  [row.voucherId] : ids.value;
  let selectItem = adjustList.value.filter(item => _id.indexOf(item.voucherId)>-1);
  let contractId = selectItem[0].contractId;
 console.log(contractId);
var everyResult = selectItem.every( item => item.contractId ===contractId );
  if(!everyResult ) {
    proxy.$modal.confirm('只能同时调整相同业务下的应收款项！')
    return;
  }
  router.push({ name: 'Debt/adjust/detail', state: { pageNum: queryParams.value.pageNum,voucherId: _id.join(','),  } });
}

// 查看页面
function handleView(row) {
  console.log(row);
  const _id = row ?  [row.voucherId] : ids.value;
  let selectItem = adjustList.value.filter(item => _id.indexOf(item.voucherId)>-1);
  let contractId = selectItem[0].contractId;
 console.log(contractId);
var everyResult = selectItem.every( item => item.contractId ===contractId );
  if(!everyResult ) {
    proxy.$modal.confirm('只能同时调整相同业务下的应收款项！')
    return;
  }
  router.push({  name: 'Debt/adjust/detail',  state: { voucherId: _id.join(','), viewFlag: true, pageNum: queryParams.value.pageNum } });
}
/** 修改按钮操作 */
function handleUpdate(row) {
  
  const _id =  row ?  [row.voucherId] : ids.value
  router.push({ name: 'Debt/adjust/detail', state: { voucherId: _id, pageNum: queryParams.value.pageNum } });
}


/** 提交按钮 */
function submitForm() {
  proxy.$refs["adjustRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateAdjust(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addAdjust(form.value).then(response => {
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
    return delAdjust(_ids);
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
