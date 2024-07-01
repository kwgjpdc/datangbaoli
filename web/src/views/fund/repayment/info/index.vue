<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="90px">
      <el-form-item label="资金池编号" prop="fundNo">
        <el-input v-model="queryParams.params.fundNo" placeholder="请输入资金池编号" clearable @keyup.enter="handleQuery"
          :style="{ width: '240px' }" />
      </el-form-item>
      <el-form-item label="资金来源" prop="fundResource">
                                    <el-select v-model="queryParams.fundResource" filterable placeholder="请选择"
                                        :style="{ width: '240px' }">
                                        <el-option v-for="item in fund_resource" :key="item.value"
                                            :label="item.label" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>



      <el-form-item label="资金到期日" style="width: 308px">
        <el-date-picker
          v-model="daterangeEndDate"
          value-format="YYYY-MM-DD"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>

      <el-form-item label="资金提供方" prop="provider">
        <el-select v-model="queryParams.params.provider" filterable placeholder="请选择"
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
          v-hasPermi="['repayment:info:add']"
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
          @click="handleBatch"
          v-hasPermi="['repayment:info:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="infoList" @selection-change="handleSelectionChange"  style="width: 100%"  @header-dragend="changeColwidth">

      <el-table-column label="资金编号" align="center" prop="payNo" width="120" >
        <template #default="scope">
          <el-button link type="primary" @click="handleView(scope.row)">{{ scope.row.payNo }}</el-button> </template>
      </el-table-column>

      <el-table-column label="资金提供方" align="center" prop="provider" width="120" > 
        <template #default="scope">
          <dict-tag :options="fund_provider" :value="scope.row.provider"/>
        </template>
      </el-table-column>
         
        <el-table-column label="资金来源" align="center" prop="fundResource" >
        <template #default="scope">
          <dict-tag :options="fund_resource" :value="scope.row.fundResource"/>
        </template>
      </el-table-column>
      <el-table-column label="借款合同" align="center" prop="contractNo" width="120" />
   
      <el-table-column label="币种" align="center" prop="currencyType" >
      <template #default="scope">
          <dict-tag :options="sys_currency_type" :value="scope.row.currencyType"/>
        </template>
      </el-table-column>
      <el-table-column label="借款金额(元)" align="center" prop="amount" width="200"/>
      <el-table-column label="借款余额(元)" align="center" prop="remainAmount" />
      
      <el-table-column label="利率(%)" align="center" prop="interestRate" >
      </el-table-column>
      <el-table-column label="综合成本( %)" align="center" prop="costRate" width="200"></el-table-column>

      <el-table-column label="借款日期" align="center" prop="startDate" width="120" >
        <!-- <template #default="scope">
          <dict-tag :options="cust_register_country" :value="scope.row.registerAddr"/>
        </template> -->
      </el-table-column>
      <el-table-column label="到期日期" align="center" prop="endDate" width="120" />
      
      <el-table-column label="状态" align="center" prop="status" width="200" >
        <template #default="scope">
          <dict-tag :options="proj_audit_status" :value="scope.row.status"/>
        </template>
        </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding" fixed="right"  width="120">
        <template #default="scope">
          <div class="button-display">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-if="scope.row.status!=2" v-hasPermi="['repayment:info:edit']">修改</el-button>
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

    <el-form-item label="借款总余额(元)" prop="allUsedAmount">
        <el-input v-model="formData1.allUsedAmount" placeholder="系统自动计算" disabled
          :style="{ width: '240px' }" />
      </el-form-item>
  </div>
</template>

<script setup name="Info">
import { listFundRepaymentInfo, delFundPayInfo, listFundPoolsum } from "@/api/fund/info";
import { listUser } from "@/api/system/user";
import { listInfo as getUserList } from "@/api/customer/index"
import { watch } from "vue";
const { proxy } = getCurrentInstance();
const { debt_status, debt_contact_status, fund_resource, proj_audit_status, sys_currency_type, fund_provider } = proxy.useDict('debt_status', 'debt_contact_status', "fund_resource", "proj_audit_status", "sys_currency_type", "fund_provider");
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
    daterangeEndDate:null,
    params: {},
    contractStatus:null,
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);
const uniqueId = ref("");
let formData = ref({
    contract:{
      "createBy": null,
            "createById": null,
            "createBy": "",
            "createTime": null,
            "updateBy": null,
            "updateById": null,
            "updateTime": null,
            "delFlag": null,
            "fundId": null,
            "fundResource": "",
            "payNo": "",
            "bank_code": "",
            "bank_name": "",
            "contractNo": "",
            "drawNo": "",
            "fundDrawId": "",
            "provider": "",
            "costRate":"",
            "creditType": "",
            "interestSettlement": "",
            "receiptCode": "",
            "accountType": "",
            "account": "",
            "currencyType": "",
            "amount": null,
            "amount": null,
            "remainAmount": null,
            "createTime": "",
            "startDate": null,
            "endDate": null,
            "term": "",
            "drawType": "",
            "costRate": null,
            "interestRate": null,
            "interestStartDate": null,
            "interestRateChanged": null,
            "feeCost": null,
            "remark": "",
            "status": "",
            "commonFileList": []
        },
});//不能修改const 定义的数据
let formData1 = ref({
  "allUsedAmount": null
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
  if (statusList.value.length) {
    queryParams.value.params["status"] = statusList.value.join(',')
  } else {
    queryParams.value.params["status"] = "";
  }


  if (null != daterangeEndDate && '' != daterangeEndDate) {
    queryParams.value.params["endDateFrom"] = daterangeEndDate.value[0];
    queryParams.value.params["endDateTo"] = daterangeEndDate.value[1];
  }

  // if (null != invoiceDate && '' != invoiceDate) {
  //   queryParams.value.params["invoiceDate"] = invoiceDate.value;
  // }else {
  //   queryParams.value.params["invoiceDate"] = null;
  // }

  // if (null != dueDate && '' != dueDate) {
  //   queryParams.value.params["dueDate"] = dueDate.value;
  // }else {
  //   queryParams.value.params["dueDate"] = null;
  // }




  listFundRepaymentInfo(queryParams.value).then(response => {
    infoList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });

  listFundPoolsum().then(response => {
    formData1.value = response.data;
  });
}

watch(infoList, (value) => {
  console.log(value);
});

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  invoiceDate.value = ref("");
  daterangeEndDate.value = ref("");
  statusList.value = [];
  queryParams.value.params = {
    fundNo: "",
    provider: ""
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
  
  router.push({ name: 'Fund/repayment/detail/index', state: { pageNum: queryParams.value.pageNum } });
}


// 查看页面
function handleView(row) {
  
  const _id = row.fundPayId
  router.push({  name: 'Fund/repayment/detail/index',  state: { debtId: _id, viewFlag: true, pageNum: queryParams.value.pageNum } });
}
/** 修改按钮操作 */
function handleUpdate(row) {
  
  const _id = row.fundPayId
  console.log("@@@@@pay@@@pay@@@")
  console.log(row.fundPayId)
  console.log(_id)
  router.push({ name: 'Fund/repayment/detail/index', state: { debtId: _id, pageNum: queryParams.value.pageNum } });
}


function handleTrans(row){
  
  const _id = row.debtId || ids.value
  router.push({ name: 'Debt/trans/index', state: { debtId: _id, pageNum: queryParams.value.pageNum } });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _ids = row.fundPayId;
  proxy.$modal.confirm('是否确认删除资金还款编号为"' + _ids + '"的数据项？').then(function () {
    return delFundPayInfo(_ids);
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
