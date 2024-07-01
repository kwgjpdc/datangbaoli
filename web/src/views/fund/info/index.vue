<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="120px">
      <el-form-item label="资金池编号" prop="fundNo">
        <el-input v-model="queryParams.fundNo" placeholder="请输入资金池编号" clearable @keyup.enter="handleQuery"
          :style="{ width: '240px' }" />
      </el-form-item>
      <el-form-item label="资金来源" prop="fundResource">
                                    <el-select v-model="queryParams.fundResource" filterable placeholder="请选择资金来源"
                                        :style="{ width: '240px' }">
                                        <el-option v-for="item in fund_resource" :key="item.value"
                                            :label="item.label" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>


      <el-form-item label="资金池总金额" prop="totalAmountFrom" >
        <el-input v-model="queryParams.params.totalAmountFrom"  clearable @keyup.enter="handleQuery" type="Number"
          :style="{ width: '120px' }" placeholder="最小金额" />
      </el-form-item>
      <el-form-item label="~" prop="totalAmountTo" label-width="8px" >
        <el-input v-model="queryParams.params.totalAmountTo" clearable @keyup.enter="handleQuery" type="Number"
          :style="{ width: '120px' }" placeholder="最大金额" />
      </el-form-item>

      <el-form-item label="资金池可用余额" prop="availableAmountFrom" >
        <el-input v-model="queryParams.params.availableAmountFrom"  clearable @keyup.enter="handleQuery" type="Number"
          :style="{ width: '120px' }" placeholder="最小余额" />
      </el-form-item>
      <el-form-item label="~" prop="availableAmountTo" label-width="8px" >
        <el-input v-model="queryParams.params.availableAmountTo" clearable @keyup.enter="handleQuery" type="Number"
          :style="{ width: '120px' }" placeholder="最大余额" />
      </el-form-item>

      <el-form-item label="资金到期日" >
        <el-date-picker v-model="daterangeEndDate" value-format="YYYY-MM-DD" type="daterange" range-separator="-"
          start-placeholder="开始日期" end-placeholder="结束日期" :style="{ width: '240px' }"></el-date-picker>
      </el-form-item>
      <el-form-item label="资金提供方" prop="provider">
        <el-select v-model="queryParams.provider" filterable placeholder="请选择资金提供方"
                   :style="{ width: '240px' }">
          <el-option v-for="item in fund_provider" :key="item.value"
                     :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

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
          @click="handleAdd"
          v-hasPermi="['fund:info:add']"
        >新增</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['demo:info:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['demo:info:remove']"
        >删除</el-button>
      </el-col> -->
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          @click="handleExport"
          v-hasPermi="['fund:info:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="infoList" @selection-change="handleSelectionChange"  style="width: 100%"  @header-dragend="changeColwidth" border>
      <el-table-column type="index" align="center" label="序号" />   
      <el-table-column label="资金池编号" align="center" prop="fundNo" width="120" >
      <template #default="scope">
          <el-button link type="primary" @click="handleView(scope.row)">{{ scope.row.fundNo }}</el-button> </template>
        </el-table-column> 
      <el-table-column label="资金提供方" align="center" prop="provider" > 
      <template #default="scope">
          <dict-tag :options="fund_provider" :value="scope.row.provider"/>
        </template>
      </el-table-column>
      <el-table-column label="资金来源" align="center" prop="fundResource" >
        <template #default="scope">
          <dict-tag :options="fund_resource" :value="scope.row.fundResource"/>
        </template>
      </el-table-column>
      <el-table-column label="借款合同" align="center" prop="contractNo" />
      <el-table-column label="币种" align="center" prop="currencyType" >
        <template #default="scope">
          <dict-tag :options="sys_currency_type" :value="scope.row.currencyType"/>
        </template>
      </el-table-column>
      <el-table-column label="资金池总额度(元)" align="center" prop="totalAmount"/>
      <el-table-column label="资金池已用额度(元)" align="center" prop="usedAmount" />
      <el-table-column label="资金池可用余额(元)" align="center" prop="availableAmount" />
      <el-table-column label="到期日" align="center" prop="endDate" />
      <el-table-column label="合同起始日" align="center" prop="startDate" />
      <el-table-column label="合同到期日" align="center" prop="endDate" />
      <el-table-column label="是否可循环使用" align="center" prop="fundIfCycle" >
        <template #default="scope">
          <dict-tag :options="fund_if_cycle" :value="scope.row.fundIfCycle"/>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status" width="200" >
        <template #default="scope">
          <dict-tag :options="proj_audit_status" :value="scope.row.status"/>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" class-name="small-padding" fixed="right"  width="120">
        <template #default="scope">
          <div class="button-display">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-if="scope.row.status!=2" v-hasPermi="['fund:info:edit']">修改</el-button>
          <!--<el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-if="scope.row.status!=2" v-hasPermi="['demo:info:remove']">删除</el-button>-->
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
    <el-form :inline="true" label-width="180px" style="margin-top:40px;">
      <el-form-item label="资金池总额度台合计(元)" prop="allTotalAmount">
        <div >
          <el-input v-model="formData1.allTotalAmount" placeholder="系统自动计算" disabled
                    :style="{ width: '240px' }"  ></el-input>
        </div>
      </el-form-item>
      <el-form-item label="资金池已用总额度(元)" prop="allUsedAmount">
        <div >
          <el-input v-model="formData1.allUsedAmount" placeholder="系统自动计算" disabled
                    :style="{ width: '240px' }"  ></el-input>
        </div>
      </el-form-item>
      <el-form-item label="资金池可用总额度(元)" prop="allAvailableAmount">
        <div >
          <el-input v-model="formData1.allAvailableAmount" placeholder="系统自动计算" disabled
                    :style="{ width: '240px' }"  ></el-input>
        </div>
      </el-form-item>
    </el-form>
    <DialogTable :label="labelItem" v-model:open="opendialog" v-model:tableData="tableData" v-model:title="title2"  :total="totalDia" @selectRow="selectRow" @pageChange="pageChange" :pageSize="userParams.pageSize" :currentPage="userParams.currentPage"/>
    <el-dialog v-model="openBatch" width="800px" append-to-body :title="titleBatch" v-loading="loading">
      <batchImport v-model:batchCustomerList="batchCustomerList"></batchImport>
      <template #footer>
        <div class="dialog-footer">
          <!-- <el-button type="primary" @click="handleSaveData">确 定</el-button> -->
          <el-button @click="cancelSaveData">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Info">
import { listFundPoolInfo, delFundPoolInfo, listFundPoolsum } from "@/api/fund/info";
import { listUser } from "@/api/system/user";
import { listInfo as getUserList } from "@/api/customer/index"
const { proxy } = getCurrentInstance();
const { debt_status, debt_contact_status, fund_resource, fund_provider, sys_currency_type, fund_if_cycle, proj_audit_status } = proxy.useDict('debt_status', 'debt_contact_status', "fund_resource", "fund_provider", "sys_currency_type", "fund_if_cycle", "proj_audit_status");
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

const daterangeEndDate = ref([]);

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
let formData = ref({
            "createBy": null,
            "createById": null,
            "createTime": null,
            "updateBy": null,
            "updateById": null,
            "updateTime": null,
            "delFlag": null,
            "fundId": null,
            "fundNo": "",
            "fundResource": "",
            "provider": "",
            "providerCode": "",
            "providerName": "",
            "providerNcCode": "",
            "contractNo": "",
            "creditType": "",
            "fundIfCycle": "",
            "currencyType": "",
            "totalAmount": null,
            "usedAmount": null,
            "availableAmount": null,
            "startDate": null,
            "endDate": null,
            "remark": "",
            "status": "",
            "commonFileList": []
});//不能修改const 定义的数据
let formData1 = ref({
  "createBy": null,
  "allTotalAmount": null,
  "allUsedAmount": null,
  "allAvailableAmount": null
});//不能修改const 定义的数据
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
  console.log(12121212121212)
  if (statusList.value.length) {
    queryParams.value.params["status"] = statusList.value.join(',')
  } else {
    queryParams.value.params["status"] = "";
  }

  console.log(3434343434343)
  if (null != daterangeEndDate && '' != daterangeEndDate) {
    queryParams.value.params["endDateFrom"] = daterangeEndDate.value[0];
    queryParams.value.params["endDateTo"] = daterangeEndDate.value[1];
  }

  console.log(5454545454545454)
  listFundPoolInfo(queryParams.value).then(response => {
    infoList.value = response.rows;
    total.value = response.total;
    loading.value = false
  });

  listFundPoolsum().then(response => {
    formData1.value = response.data;
  });
}



/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  daterangeEndDate.value = [];
  proxy.resetForm("queryRef");
  invoiceDate.value = ref("");
  dueDate.value = ref("");
  statusList.value = [];
  queryParams.value.params = {
    totalAmountFrom: "",
    totalAmountTo: "",
    availableAmountFrom: "",
    availableAmountTo: ""
  };
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
  
  router.push({ name: 'Fund/detail/index', state: { pageNum: queryParams.value.pageNum } });
}

function reset() {
  form.value = {
    createBy: null,
            createById: null,
            createTime: null,
            updateBy: null,
            updateById: null,
            updateTime: null,
            delFlag: null,
            fundId: null,
            fundNo: "",
            fundResource: "",
            provider: "",
            providerCode: "",
            providerName: "",
            providerNcCode: "",
            contractNo: "",
            creditType: "",
            fundIfCycle: "",
            currencyType: "",
            totalAmount: null,
            usedAmount: null,
            availableAmount: null,
            startDate: null,
            endDate: null,
            remark: "",
            status: "",
            commonFileList: []
  };
  proxy.resetForm("queryRef");
}

// 查看页面
function handleView(row) {
  //reset()
  const _id = row.fundId
  router.push({  name: 'Fund/detail/index',  state: { debtId: _id, viewFlag: true, pageNum: queryParams.value.pageNum } });
}
/** 修改按钮操作 */
function handleUpdate(row) {
  
  const _id = row.fundId
  console.log("@@@@@@@@@@@")
  console.log(row.fundId)
  console.log(_id)
  router.push({ name: 'Fund/detail/index', state: { debtId: _id, pageNum: queryParams.value.pageNum } });
}


function handleTrans(row){
  
  const _id = row.debtId || ids.value
  router.push({ name: 'Debt/trans/index', state: { debtId: _id, pageNum: queryParams.value.pageNum } });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _ids = row.fundId;
  console.log("DDDDDDDDDDDDD")
  console.log(row.fundId)
  console.log(_ids)
  proxy.$modal.confirm('是否确认删除资金池编号为"' + _ids + '"的数据项？').then(function () {
    return delFundPoolInfo(_ids);
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
