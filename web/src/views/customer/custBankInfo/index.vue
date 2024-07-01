<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="100px">
      <el-form-item label="流水号" prop="serialNumber">
        <el-input
          v-model="queryParams.serialNumber"
          placeholder="请输入流水号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="银行账号" prop="bankAccount">
        <el-input
          v-model="queryParams.bankAccount"
          placeholder="请输入银行账号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="客户中文名称" prop="customerName">
        <el-input
          v-model="queryParams.customerName"
          placeholder="请输入客户中文名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <!-- <el-form-item label="开户行名称" prop="bankBranch">
        <el-input
          v-model="queryParams.bankBranch"
          placeholder="请输入开户行名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="分行（省）" prop="province">
        <el-input
          v-model="queryParams.province"
          placeholder="请输入分行"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="分行（市）" prop="city">
        <el-input
          v-model="queryParams.city"
          placeholder="请输入分行"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="账户名称" prop="accountName">
        <el-input
          v-model="queryParams.accountName"
          placeholder="请输入账户名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="币种" prop="currencyType">
        <el-select v-model="queryParams.currencyType" placeholder="请选择币种" clearable>
          <el-option
            v-for="dict in sys_currency_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="复核状态" prop="auditStatus">
        <el-select v-model="queryParams.auditStatus" placeholder="请选择复核状态" clearable>
          <el-option
            v-for="dict in cust_back_account_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['custBankInfo:custBankInfo:add']"
        >新增</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['custBankInfo:custBankInfo:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['custBankInfo:custBankInfo:remove']"
        >删除</el-button>
      </el-col> -->
      <!-- <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['custBankInfo:custBankInfo:export']"
        >导出</el-button>
      </el-col> -->
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="custBankInfoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <!-- <el-table-column label="主键" align="center" prop="accountId" /> -->
      <el-table-column label="流水号" align="center" prop="serialNumber"  fixed width="200"/>
      <el-table-column label="银行账号" align="center" prop="bankAccount" fixed width="150"/>
      <el-table-column label="客户中文名称" align="center" prop="customerName"   width="150" />
      <el-table-column label="开户行" align="center" prop="bankBranch" />
      <el-table-column label="分行（省）" align="center" prop="province" />
      <el-table-column label="分行（市）" align="center" prop="city" />
      <el-table-column label="账户名称" align="center" prop="accountName" />
      <el-table-column label="币种" align="center" prop="currencyType">
        <template #default="scope">
          <dict-tag :options="sys_currency_type" :value="scope.row.currencyType"/>
        </template>
      </el-table-column>
      <el-table-column label="复核状态" align="center" prop="auditStatus">
        <template #default="scope">
          <dict-tag :options="cust_back_account_status" :value="scope.row.auditStatus"/>
        </template>
      </el-table-column>
      <el-table-column label="录入人" align="center" prop="createBy" />
      <el-table-column label="录入时间" align="center" prop="createTime" width="250" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right"  width="200">
        <template #default="scope">
          <div class="button-display">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['custBankInfo:custBankInfo:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['custBankInfo:custBankInfo:remove']">删除</el-button>
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

    <!-- 添加或修改客户银行账户信息对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="custBankInfoRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="流水号" prop="serialNumber">
          <el-input v-model="form.serialNumber" placeholder="保存自动生成流水号" disabled />
        </el-form-item>
        <el-form-item label="银行账号" prop="bankAccount">
          <el-input v-model="form.bankAccount" placeholder="请输入银行账号" />
        </el-form-item>
        <el-form-item label="客户中文名称" prop="customerName">
          <el-input v-model="form.customerName" placeholder="请输入客户中文名称" />
        </el-form-item>
        <el-form-item label="开户行名称" prop="bankBranch">
          <el-input v-model="form.bankBranch" placeholder="请输入开户行名称" />
        </el-form-item>
        <el-form-item label="分行（省）" prop="province">
          <el-input v-model="form.province" placeholder="请输入分行" />
        </el-form-item>
        <el-form-item label="分行（市）" prop="city">
          <el-input v-model="form.city" placeholder="请输入分行" />
        </el-form-item>
        <el-form-item label="账户名称" prop="accountName">
          <el-input v-model="form.accountName" placeholder="请输入账户名称" />
        </el-form-item>
        <el-form-item label="币种" prop="currencyType">
          <el-select v-model="form.currencyType" placeholder="请选择币种">
            <el-option
              v-for="dict in sys_currency_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="复核状态" prop="auditStatus">
          <el-radio-group v-model="form.auditStatus">
            <el-radio
              v-for="dict in cust_back_account_status"
              :key="dict.value"
              :label="dict.value"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="CustBankInfo">
import { listCustBankInfo, getCustBankInfo, delCustBankInfo, addCustBankInfo, updateCustBankInfo,getBankSeq } from "@/api/customer/custBankInfo";

const { proxy } = getCurrentInstance();
const { sys_currency_type, cust_back_account_status } = proxy.useDict('sys_currency_type', 'cust_back_account_status');

const custBankInfoList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const route = useRoute();
const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    serialNumber: null,
    bankAccount: null,
    customerName: null,
    bankBranch: null,
    province: null,
    city: null,
    accountName: null,
    currencyType: null,
    auditStatus: null,
    createById: null,
    updateById: null,
    customerId:"",
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);
watch(route, (newRoute) => {
    console.log(newRoute.query);
    queryParams.value.customerId = newRoute.query && newRoute.query.customerId;//{customerId:"queryParam0"}
}, { immediate: true });
/** 查询客户银行账户信息列表 */
function getList() {
  loading.value = true;
  listCustBankInfo(queryParams.value).then(response => {
    custBankInfoList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

// 表单重置
function reset() {
  form.value = {
    customerId:"",
    accountId: null,
    serialNumber: null,
    bankAccount: null,
    customerName: null,
    bankBranch: null,
    province: null,
    city: null,
    accountName: null,
    currencyType: null,
    auditStatus: null,
    createBy: null,
    createById: null,
    createTime: null,
    updateBy: null,
    updateById: null,
    updateTime: null
  };
  proxy.resetForm("custBankInfoRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.accountId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  // loading.value = true;
  // getBankSeq().then(response => {
  //           console.log(response);
  //           form.value.serialNumber = response.msg;
  //           loading.value = false;
  // }).catch((e) =>{
  //   loading.value = false;
  // });
  open.value = true;
  title.value = "添加客户银行账户信息";

}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _accountId = row.accountId || ids.value
  getCustBankInfo(_accountId).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改客户银行账户信息";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["custBankInfoRef"].validate(valid => {
    if (valid) {
      form.value.customerId = queryParams.value.customerId;
      if (form.value.accountId != null) {
        updateCustBankInfo(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addCustBankInfo(form.value).then(response => {
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
  const _accountIds = row.accountId || ids.value;
  proxy.$modal.confirm('是否确认删除客户银行账户信息编号为"' + _accountIds + '"的数据项？').then(function() {
    return delCustBankInfo(_accountIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('cust/bank/export', {
    ...queryParams.value
  }, `custBankInfo_${new Date().getTime()}.xlsx`)
}

getList();
</script>
<style lang="scss" scoped>
.button-display{
  display: flex;
}
</style>