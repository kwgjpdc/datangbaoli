<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="90px">
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

      <el-form-item label="开票日">
        <el-date-picker v-model="invoiceDate" value-format="YYYY-MM-DD" :style="{ width: '240px' }" placeholder="请选择开票日"></el-date-picker>
      </el-form-item>

      <el-form-item label="到期日">
        <el-date-picker v-model="dueDate" value-format="YYYY-MM-DD" :style="{ width: '240px' }" placeholder="请选择到期日"></el-date-picker>
      </el-form-item>

      <el-form-item label="合同状态" prop="contractStatus">
        <el-select v-model="queryParams.contractStatus" placeholder="请选择是否有效" clearable :style="{ width: '240px' }">
          <el-option v-for="dict in debt_contact_status" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
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
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['debt:info:add']">新增</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="infoList" @selection-change="handleSelectionChange">
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <el-table-column label="" align="center" type="index" />
      <el-table-column label="业务合同号" align="center" prop="contractNo" ><template #default="scope">
          <el-button link type="primary" @click="handleView(scope.row)">{{ scope.row.contractNo }}</el-button> </template>
      </el-table-column>

      <el-table-column label="核心企业" align="center" prop="coreEnterpriseName" />
      <el-table-column label="保理申请人" align="center" prop="factoringApplicantName" />
      <el-table-column label="借款人" align="center" prop="accountDebtorName" />
      <el-table-column label="合同名称" align="center" prop="contractName" />
      <el-table-column label="应收账款金额" align="center" prop="debtReceivableAmount" />
      <el-table-column label="凭证提供方" align="center" prop="voucherProviderName" />
      <el-table-column label="状态" align="center" prop="debtStatus">
        <template #default="scope">
          <dict-tag :options="debt_status" :value="scope.row.debtStatus" />
        </template>
      </el-table-column>
      <!-- <el-table-column label="备注" align="center" prop="remark" /> -->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right" width="200">
        <template #default="scope">
          <div class="button-display">
            <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
              v-hasPermi="['debt:info:edit']" v-if="scope.row.debtStatus == 1">修改</el-button>
            <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
              v-hasPermi="['debt:info:remove']">删除</el-button>

            <el-dropdown>
              <el-button type="primary" link>
                更多<el-icon class="el-icon--right"><arrow-down /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
<!--  -->
                  <el-dropdown-item> <el-button link type="primary" icon="Histogram" @click="handleTrans(scope.row)"
                      v-hasPermi="['debt:info:assignment']" v-if="scope.row.debtStatus == 5" >转让</el-button></el-dropdown-item>
                  <el-dropdown-item> <el-button link type="primary" icon="Operation"
                      v-hasPermi="['debt:info:preview']">通知书预览</el-button></el-dropdown-item>

                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>

        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize"
      @pagination="getList" />

    <DialogTableMulti v-model:multiQuery="multiQuery" v-model:open="multiQuery.open" v-model:tableData="tableDataMulti"
      v-model:prop="propMulti" @selectRow="selectRowMulti" @pageChange="pageChangeMulti" />
  </div>
</template>

<script setup name="Info">
import { listDebtInfo, delDebtInfo } from "@/api/debt/info";
import { listUser } from "@/api/system/user";
import { listInfo as getUserList } from "@/api/customer/index"
const { proxy } = getCurrentInstance();
const { debt_status, debt_contact_status } = proxy.useDict('debt_status', 'debt_contact_status');
const route = useRoute();
const router = useRouter();
const infoList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const invoiceDate = ref("");
const dueDate = ref("");
const statusList = ref([]);
let multiQuery = ref({
  title: "项目列表",//标题
  open: false,
  currentPage: 1,
  total: 1,
  pageSize: 10,
});
const propMulti = ref([{
  label: '项目编号',
  value: 'projectNo'
}, {
  label: '项目名称',
  value: 'projectName'
}]);
const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    contractNo: null,
    coreEnterpriseName: null,
    accountDebtorName: null,
    factoringApplicantName:null,
    invoiceDate:null,
    dueDate:null,
    validFlag:null,
    status: null,
    params: {},
    contractStatus:null,
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
    invoiceDate.value = null;
    dueDate.value = null;
    statusList.value = [];
    proxy.resetForm("queryRef");
    getList();
  }
})
/** 查询应收账款查询列表 */
function getList() {
  loading.value = true;
  
  if (statusList.value.length) {
    queryParams.value.params["status"] = statusList.value.join(',')
  } else {
    queryParams.value.params["status"] = "";
  }




  if (null != invoiceDate && '' != invoiceDate) {
    queryParams.value.params["invoiceDate"] = invoiceDate.value;
  }else {
    queryParams.value.params["invoiceDate"] = null;
  }

  if (null != dueDate && '' != dueDate) {
    queryParams.value.params["dueDate"] = dueDate.value;
  }else {
    queryParams.value.params["dueDate"] = null;
  }




  listDebtInfo(queryParams.value).then(response => {
    infoList.value = response.rows;
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
  invoiceDate.value = ref("");
  dueDate.value = ref("");
  statusList.value = [];
  handleQuery();
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  
  router.push({ name: 'Debt/detail/index', state: { pageNum: queryParams.value.pageNum } });
}


// 查看页面
function handleView(row) {
  const _id = row.debtId || ids.value
  router.push({  name: 'Debt/detail/index',  state: { debtId: _id, viewFlag: true, pageNum: queryParams.value.pageNum,contractId: row.contractId } });
}
/** 修改按钮操作 */
function handleUpdate(row) {
  
  const _id = row.debtId || ids.value
  router.push({ name: 'Debt/detail/index', state: { debtId: _id, pageNum: queryParams.value.pageNum,contractId: row.contractId } });
}


function handleTrans(row){
  
  const _id = row.debtId || ids.value
  router.push({ name: 'Debt/trans/index', state: { debtId: _id, pageNum: queryParams.value.pageNum,contractId: row.contractId } });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _ids = row.voucherId || ids.value;
  proxy.$modal.confirm('是否确认删除应收账款查询编号为"' + _ids + '"的数据项？').then(function () {
    return delDebtInfo(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => { });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('debt/info/export', {
    ...queryParams.value
  }, `info_${new Date().getTime()}.xlsx`)
}


// 用户组件请求信息
const userParams = ref({
  pageNum: 1,
  pageSize: 10,
})
const tableDataMulti = ref([]);
let checkItemMult = ref("")
let tableDataMultiCoreEnterpriseName = ref([]);
let tableDataMultiOther = ref([]);

// 打开用户信息选择框 请求用户信息
function openDiagMulti(options) {
  console.log(tableDataMulti.value);
  multiQuery.value.currentPage = 1;
  userParams.value.pageNum = 1;
  if (options == 'coreEnterpriseName' && tableDataMultiCoreEnterpriseName.value.length) {
    tableDataMulti.value = tableDataMultiCoreEnterpriseName.value;
    setDialogTitle(options);
    multiQuery.value.open = true;
  } else if (options != 'coreEnterpriseName' && tableDataMultiOther.value.length) {
    tableDataMulti.value = tableDataMultiOther.value;
    setDialogTitle(options);
    multiQuery.value.open = true;
  } else {
    if (options == 'coreEnterpriseName') {
      userParams.value.isCoreEnterprise = 1;
    } else {
      if (userParams.value.isCoreEnterprise) {
        delete userParams.value.isCoreEnterprise;
      }

    }
    loading.value = true;
    getUserList(userParams.value).then(response => {
      tableDataMulti.value = [];
      loading.value = 0;
      response.rows.map((item) => {
        item.parentCustomerName = item.companyInfo.parentCustomerName;
        tableDataMulti.value.push(item)
        if (options == 'coreEnterpriseName') {
          tableDataMultiCoreEnterpriseName.value.push(item);
        } else {
          tableDataMultiOther.value.push(item);
        }

      });
      multiQuery.value.total = response.total;

      setDialogTitle(options);
      multiQuery.value.open = true;
    });
  }
  checkItemMult.value = options;
}
function setDialogTitle(options) {
  if (options == 'customerName') {
    multiQuery.value.title = "客户信息";

  } else if (options == 'coreEnterpriseName') {
    multiQuery.value.title = "核心企业信息";
  } else if (options == 'factoringApplicantName') {
    multiQuery.value.title = "保理申请人信息";
  } else if (options == 'debtorName') {
    multiQuery.value.title = "债务人信息";
  }
}
// 弹出用户信息分页处理
function pageChangeMulti(page) {
  userParams.value.pageNum = page;
  multiQuery.value.currentPage = page;
  loading.value = true;
  getUserList(userParams.value).then(response => {
    loading.value = false;
    tableDataMulti.value = [];
    response.rows.map((item) => {
      item.parentCustomerName = item.companyInfo.parentCustomerName;
      tableDataMulti.value.push(item)
    });
    multiQuery.value.total = response.total;
    setDialogTitle(options);
    multiQuery.value.open = true;
  });
}
// 选择了用户信息；
function selectRowMulti(rows) {
  console.log(rows);

  if (checkItemMult.value == 'customerName') {
    formData.value.customerName = rows.customerName
    formData.value.customerNo = rows.customerNo
  } else if (checkItemMult.value == 'coreEnterpriseName') {
    formData.value.coreEnterpriseName = rows.customerName
    formData.value.coreEnterpriseNo = rows.customerNo
  } else if (checkItemMult.value == 'factoringApplicantName') {
    formData.value.factoringApplicantName = rows.customerName
    formData.value.factoringApplicantNo = rows.customerNo
  } else if (checkItemMult.value == 'debtorName') {
    formData.value.debtorName = rows.customerName
    formData.value.debtorNo = rows.customerNo
  }

}


getList();
</script>
<style lang="scss" scoped>
.button-display {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;

  .el-button+.el-button {
    margin-left: 0;
  }
}
</style>
