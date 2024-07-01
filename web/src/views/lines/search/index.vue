<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="客户名称" prop="customerName">
        <el-input v-model="queryParams.customerName" placeholder="请输入客户名称" clearable />
      </el-form-item>
      <el-form-item label="客户经理" prop="customerManagerName">
        <el-input v-model="queryParams.customerManagerName" placeholder="请输入客户经理"
          @focus="openDiag('customerManagerName')"  suffix-icon="el-icon-search" />
      </el-form-item>
      <el-form-item label="录入人" prop="createBy">
        <el-input v-model="queryParams.createBy" placeholder="请输入录入人" @focus="openDiag('createBy')"  suffix-icon="el-icon-search" />
      </el-form-item>
      <el-form-item label="客户类型" prop="customerType">
        <el-select v-model="queryParams.customerType" filterable placeholder="请选择" :style="{ width: '180px' }">
          <el-option v-for="item in cust_customer_type" :key="item.value" :label="item.label" :value="item.value">
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
        <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['cust:quota:add']">新增</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate"
          v-hasPermi="['cust:quota:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['cust:quota:remove']">删除</el-button>
      </el-col> -->
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Download" @click="handleExport"
          v-hasPermi="['cust:quota:export']">导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="quotaList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <!-- <el-table-column label="主键" align="center" prop="quotaId" /> -->
      <el-table-column label="客户额度编号" align="center" prop="quotaNo" fixed width="120" >
         <template #default="scope"> <el-button link type="primary"  @click="handleView(scope.row)" >{{scope.row.quotaNo}}</el-button> </template>
      </el-table-column>
      <el-table-column label="客户名称" align="center" prop="customerName" fixed width="100" />

      <el-table-column label="客户额度名称" align="center" prop="quotaName" fixed width="120" />
      <el-table-column label="额度类型" align="center" prop="quotaType">
        <template #default="scope">
          <dict-tag :options="cust_quota_type" :value="scope.row.quotaType" />
        </template>
      </el-table-column>


      <el-table-column label="额度币种" align="center" prop="currencyType">
        <template #default="scope">
          <dict-tag :options="sys_currency_type" :value="scope.row.currencyType" />
        </template>
      </el-table-column>
      <el-table-column label="授信方式" align="center" prop="creditType">
        <template #default="scope">
          <dict-tag :options="cust_quota_credit_type" :value="scope.row.creditType" />
        </template>
      </el-table-column>
      <el-table-column label="额度占用方式" align="center" prop="quotaOccupationType"  width="120">
        <template #default="scope">
          <dict-tag :options="cust_quota_occupation_type" :value="scope.row.quotaOccupationType" />
        </template>
      </el-table-column>

      <el-table-column label="额度金额" align="center" prop="quotaAmount"  width="120" />

      <el-table-column label="生效日" align="center" prop="effectDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.effectDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="到期日" align="center" prop="expiryDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.expiryDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>

      <el-table-column label="额度状态" align="center" prop="quotaStaus">
        <template #default="scope">
          <dict-tag :options="cust_quota_staus" :value="scope.row.quotaStaus" />
        </template>
      </el-table-column>

      <el-table-column label="录入人" align="center" prop="createBy" />
      <!-- 
      <el-table-column label="客户id" align="center" prop="customerId" />
      <el-table-column label="客户编号" align="center" prop="customerNo" />
      
      <el-table-column label="保理方式" align="center" prop="factoringType" />
      <el-table-column label="是否拥有追索权" align="center" prop="isHaveResource" />
      <el-table-column label="临时占用额度金额" align="center" prop="tempQuotaAmount" />
      <el-table-column label="已用额度金额" align="center" prop="usedQuotaAmount" />
      <el-table-column label="可用额度金额" align="center" prop="enableQuotaAmount" />
      
      <el-table-column label="部门id" align="center" prop="deptId" />
      <el-table-column label="更新人用户id" align="center" prop="updateById" /> -->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right"  width="200">
        <template #default="scope">
          <div class="button-display">
          <!-- <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['cust:quota:edit']">修改</el-button> -->
          <el-button link type="danger" icon="Delete" @click="handleDelete(scope.row)"
            v-hasPermi="['cust:quota:remove']">删除</el-button>
            <el-button link type="primary" icon="Plus" @click="handleExtend(scope.row)"
            v-hasPermi="['cust:quota:remove']">展期</el-button>
            <el-dropdown>
      <el-button type="primary" link>
       更多<el-icon class="el-icon--right"><arrow-down /></el-icon>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item> <el-button link type="primary" icon="DocumentRemove" @click="handleIce(scope.row)"
            v-hasPermi="['cust:quota:remove']">冻结</el-button></el-dropdown-item>
          <el-dropdown-item> <el-button link type="primary" icon="DocumentAdd" @click="handleIceReverse(scope.row)"
            v-hasPermi="['cust:quota:remove']">解冻</el-button></el-dropdown-item>
          <el-dropdown-item>  <el-button link type="primary" icon="DocumentDelete" @click="handleStop(scope.row)"
            v-hasPermi="['cust:quota:remove']">终止</el-button></el-dropdown-item>
          <el-dropdown-item>  <el-button link type="primary" icon="DocumentChecked" @click="handleStopReverse(scope.row)"
            v-hasPermi="['cust:quota:remove']">撤销终止</el-button></el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
          
            <!-- <el-button link type="primary" icon="Plus" @click="handleExtend(scope.row)"
            v-hasPermi="['cust:quota:remove']">展期</el-button> -->
           
           
          
          
            </div>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改客户额度对话框 -->
    <el-dialog :title="title" v-model="open" width="800px" append-to-body>
      <el-form ref="quotaRef" :model="form" :rules="rules" label-width="160px" :inline="true" :disabled="editType!='add'" >

        <el-form-item label="额度类型" prop="quotaType">
          <el-select v-model="form.quotaType" filterable placeholder="请选择" :style="{ width: '180px' }">
            <el-option v-for="item in cust_quota_type" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>


        <el-form-item label="授信方式" prop="creditType">
          <el-select v-model="form.creditType" filterable placeholder="请选择" :style="{ width: '180px' }">
            <el-option v-for="item in cust_quota_credit_type" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="额度占用方式" prop="quotaOccupationType">
          <el-select v-model="form.quotaOccupationType" filterable placeholder="请选择" :style="{ width: '180px' }">
            <el-option v-for="item in cust_quota_occupation_type" :key="item.value" :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>



        <el-form-item label="客户编号" prop="customerNo">
          <div @click="openDiag('customerNo')">
            <el-input v-model="form.customerNo" placeholder="请选择客户编号" clearable :style="{ width: '180px' }"
              readonly></el-input>
          </div>
        </el-form-item>
        <el-form-item label="客户名称" prop="customerName">
          <el-input v-model="form.customerName" :style="{ width: '180px' }" disabled></el-input>
        </el-form-item>


        <el-form-item label="保理方式" align="center" prop="factoringType">
        
            <el-select v-model="form.factoringType" filterable placeholder="请选择" :style="{ width: '180px' }">
            <el-option v-for="item in cust_factoring_type" :key="item.value" :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
    
        </el-form-item>


        <el-form-item label="额度编号" prop="quotaNo">
          <el-input v-model="form.quotaNo" placeholder="请输入客户额度编号" :style="{ width: '180px' }" />
        </el-form-item>
        <el-form-item label="额度名称" prop="quotaName">
          <el-input v-model="form.quotaName" placeholder="请输入客户额度名称" :style="{ width: '180px' }" />
        </el-form-item>


        <el-form-item label="是否拥有追索权" prop="isHaveResource">
          <el-select v-model="form.isHaveResource" filterable placeholder="请选择" :style="{ width: '180px' }">
            <el-option v-for="item in sys_true_or_false" :key="item.value" :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="额度币种" prop="currencyType">
          <el-select v-model="form.currencyType" filterable placeholder="请选择" :style="{ width: '180px' }">
            <el-option v-for="item in sys_currency_type" :key="item.value" :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <!-- <el-form-item  prop="quotaAmount"> -->
       <!-- <el-input v-model="form.quotaAmount" placeholder="请输入额度金额" :style="{ width: '180px' }" />  -->
          <PriceInput v-model:form="form" :width = "180" label = "额度金额" prop = "quotaAmount" :rules = "rules" :disabled="editType!='add'" ></PriceInput>
        <!-- </el-form-item> -->

        <!-- <el-form-item label="临时占用额度金额" prop="tempQuotaAmount">
          <el-input v-model="form.tempQuotaAmount" placeholder="请输入临时占用额度金额" />
        </el-form-item>
        <el-form-item label="已用额度金额" prop="usedQuotaAmount">
          <el-input v-model="form.usedQuotaAmount" placeholder="请输入已用额度金额" />
        </el-form-item>
        <el-form-item label="可用额度金额" prop="enableQuotaAmount">
          <el-input v-model="form.enableQuotaAmount" placeholder="请输入可用额度金额" />
        </el-form-item> -->
        <el-form-item label="生效日" prop="effectDate">
          <el-date-picker clearable v-model="form.effectDate" type="date" value-format="YYYY-MM-DD" placeholder="请选择生效日期" :style="{ width: '180px' }">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="到期日" prop="expiryDate">
          <el-date-picker clearable v-model="form.expiryDate" type="date" value-format="YYYY-MM-DD" placeholder="请选择失效日期" :style="{ width: '180px' }">
          </el-date-picker>
        </el-form-item>
       
      </el-form>
      <el-form ref="quotaOpeRef" :model="form" :rules="rules" label-width="160px" :inline="true" v-if="editType=='change' ||editType=='extends' || editType == 'freeze' || editType == 'stop'|| editType == 'freezeRe' || editType == 'stopRe'">
         <!-- 新增 冻结 终止 -->

        <!-- 集团授信编号 集团授信生效日 集团授信到期日 -->
      
        <!-- 变更 -->
        <!-- 变更方式 调整额度 调整后的额度 大写 变更备注 -->
        <template v-if=" editType=='change'">
          <el-form-item label="变更方式" prop="changeType" >
          <el-select v-model="form.changeType" filterable placeholder="请选择" :style="{ width: '180px' }" @change="handleChangeAmount">
            <el-option v-for="item in cust_quota_change_type" :key="item.value" :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>


        <!-- <el-form-item label="调整额度" prop="changeAmount" >
          <el-input v-model="form.changeAmount" placeholder="请输入调整额度" :style="{ width: '180px' }"  @blur="handleChangeAmount"  />
        </el-form-item> -->
        <PriceInput v-model:form="form" :width = "180" label = "调整额度" prop = "changeAmount" :rules = "rules" ></PriceInput>

        <el-form-item label="调整后的额度" prop="beforeChangeAmount">
          <el-input v-model="form.afterChangeAmount" disabled :style="{ width: '180px' }" />
        </el-form-item>


        <el-form-item label="调整后的额度(大写)" prop="beforeChangeAmountUp">
          <el-input v-model="form.afterChineseMoney" disabled :style="{ width: '180px' }" />
        </el-form-item>
        </template>
        
       

        <!-- 展期 -->
        <!-- 展期到期日 备注 -->
        <template v-if="editType=='extends'">
          <el-form-item label="展期到期日" prop="extensionDate">
          <el-date-picker clearable v-model="form.extensionDate" type="date" value-format="YYYY-MM-DD" placeholder="请选择展期到期日期" :style="{ width: '180px' }">
          </el-date-picker>
        </el-form-item>
        </template>
        
        <!-- 冻结 终止 -->
        <!-- 备注 -->
        <template v-if="editType=='change' ||editType=='extends' || editType == 'freeze' || editType == 'stop' || editType == 'freezeRe' || editType == 'stopRe'">
          <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark"  :style="{ width: '180px' }" />
        </el-form-item>
      </template>
        

      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm" v-if=" editType != 'view'">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
    <DialogTable v-model:open="opendialog" v-model:tableData="tableData" v-model:title="titleDia" :total=totalDia
      @selectRow="selectRow" @pageChange="pageChange" :labelItem="labelItem" />
  </div>
</template>

<script setup name="Quota">
import { listQuota, getQuota, delQuota, addQuota, updateQuota,changeAmount,editExpiryDate,addChangeRecord,freeze,unfreeze,endPost,cancelEndPost} from "@/api/customer/quota";
import { listInfo } from "@/api/customer/index";
import { listUser } from "@/api/system/user";

const { proxy } = getCurrentInstance();
const { cust_customer_type, cust_quota_type, sys_currency_type, cust_quota_credit_type, cust_quota_occupation_type, cust_factoring_type, sys_true_or_false, cust_quota_staus,cust_quota_change_type } = proxy.useDict("cust_customer_type", "cust_quota_type", "sys_currency_type", "cust_quota_credit_type", "cust_quota_occupation_type", "cust_factoring_type", "sys_true_or_false", "cust_quota_staus","cust_quota_change_type");//下拉框字典
const quotaList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref(""); 
const editType = ref("add");// add change extends  freeze stop
// 用户组件弹窗的变量
const totalDia = ref(0);
const titleDia = ref("客户信息");
const opendialog = ref(false);
const checkItem = ref("");
const labelItem = ref(['用户编号', '用户名称']);
const tableData = ref([])
const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    quotaType: null,
    creditType: null,
    quotaOccupationType: null,
    customerId: null,
    customerNo: null,
    quotaNo: null,
    quotaName: null,
    factoringType: null,
    isHaveResource: null,
    currencyType: null,
    quotaAmount: null,
    tempQuotaAmount: null,
    usedQuotaAmount: null,
    enableQuotaAmount: null,
    effectDate: null,
    expiryDate: null,
    deptId: null,
    quotaStaus: null,
    createById: null,
    updateById: null,
  },
  rules: {
    quotaType: [
      { required: true, message: "额度类型不能为空", trigger: "change" }
    ],
    creditType: [
      { required: true, message: "授信方式不能为空", trigger: "change" }
    ],
    quotaOccupationType: [
      { required: true, message: "额度占用方式不能为空", trigger: "change" }
    ],
    quotaName: [
      { required: true, message: "客户额度名称不能为空", trigger: "blur" }
    ],
    factoringType: [
      { required: true, message: "保理方式不能为空", trigger: "change" }
    ],
    isHaveResource: [
      { required: true, message: "是否拥有追索权不能为空", trigger: "blur" }
    ],
    currencyType: [
      { required: true, message: "额度币种不能为空", trigger: "change" }
    ],
    quotaAmount: [
    {
          pattern: /^1000000000$|^1000000000.0$|^1000000000.00$|^[+]{0,1}(\d{0,9})$|^[+]{0,1}(\d{0,9}\.\d{1,2})$/,
          message: ' 请输入 0-10亿 的正数，可保留两位小数',
          trigger: 'blur',
        },
      { required: true, message: "额度金额不能为空", trigger: "blur" }
    ],
    effectDate: [
      { required: true, message: "生效日期不能为空", trigger: "blur" }
    ],
    expiryDate: [
      { required: true, message: "失效日期不能为空", trigger: "blur" }
    ],
    
    customerNo:[
      { required: true, message: "客户编号不能为空", trigger: "blur" }
    ],
    quotaNo:[
      { required: true, message: "额度编号不能为空", trigger: "blur" }
    ],
    extensionDate:[
      { required: true, message: "展期到期日期不能为空", trigger: "change" }
    ],
    changeType:[
      { required: true, message: "变更方式不能为空", trigger: "change" }
    ],
    changeAmount:[
    {
          pattern: /^1000000000$|^1000000000.0$|^1000000000.00$|^[+]{0,1}(\d{0,9})$|^[+]{0,1}(\d{0,9}\.\d{1,2})$/,
          message: ' 请输入 0-10亿 的正数，可保留两位小数',
          trigger: 'blur',
        },
        { required: true, message: "调整额度不能为空", trigger: "blur" },
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询客户额度列表 */
function getList() {
  loading.value = true;
  listQuota(queryParams.value).then(response => {
    quotaList.value = response.rows;
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
    quotaId: null,
    quotaType: null,
    creditType: null,
    quotaOccupationType: null,
    customerId: null,
    customerNo: null,
    quotaNo: null,
    quotaName: null,
    factoringType: null,
    isHaveResource: null,
    currencyType: null,
    quotaAmount: null,
    tempQuotaAmount: null,
    usedQuotaAmount: null,
    enableQuotaAmount: null,
    effectDate: null,
    expiryDate: null,
    deptId: null,
    quotaStaus: null,
    delFlag: null,
    createBy: null,
    createById: null,
    createTime: null,
    updateById: null,
    updateBy: null,
    updateTime: null
  };
  proxy.resetForm("quotaRef");
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
  ids.value = selection.map(item => item.quotaId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加客户额度";
  editType.value='add';
  form.value.quotaType = cust_quota_type.value[0].value;
  form.value.creditType = cust_quota_credit_type.value[0].value;
  form.value.quotaOccupationType = cust_quota_occupation_type.value[0].value;
  form.value.factoringType = cust_factoring_type.value[0].value;
  form.value.isHaveResource = sys_true_or_false.value[0].value;
  form.value.currencyType = sys_currency_type.value[0].value;
}
function handleView(row){
  reset();
  const _quotaId = row.quotaId || ids.value
  getQuota(_quotaId).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "授信额度查看";
    editType.value='view';
  });
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _quotaId = row.quotaId || ids.value
  getQuota(_quotaId).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "授信额度变更";
    
    editType.value='change';
  });
}

// 展期 
function handleExtend(row) {
  reset();
  const _quotaId = row.quotaId || ids.value
  getQuota(_quotaId).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "授信展期编辑";
    editType.value='extends';
    proxy.$refs["quotaOpeRef"].clearValidate()
  });
}


// 冻结/解冻
function handleIce(row) {
  reset();
  const _quotaId = row.quotaId || ids.value
  getQuota(_quotaId).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "授信冻结编辑";
    editType.value='freeze';
  });
}
function handleIceReverse(row) {
  reset();
  const _quotaId = row.quotaId || ids.value
  getQuota(_quotaId).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "授信冻结编辑";
    editType.value='freezeRe';
  });
}


// 终止/撤销终止
function handleStop(row) {
  reset();
  const _quotaId = row.quotaId || ids.value
  getQuota(_quotaId).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "授信终止编辑";
    editType.value='stop';
  });
}
// 终止/撤销终止
function handleStopReverse(row) {
  reset();
  const _quotaId = row.quotaId || ids.value
  getQuota(_quotaId).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "授信终止编辑";
    editType.value='stopRe';
  });
}

/** 提交按钮 */
function submitForm() {
  // 表单校验
  if(editType.value == 'add') {
  proxy.$refs["quotaRef"].validate(valid => {
    if (valid) {
      handleSubmit();
    }
  });
} else {
  proxy.$refs["quotaOpeRef"].validate(valid => {
    if (valid) {
      handleSubmit();
    }
  });
}
  
}

function handleSubmit(){
  if(editType.value == 'add') {
    if (form.value.quotaId != null) {
        updateQuota(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addQuota(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
  } else if (editType.value == 'change') {
    form.value.beforeChangeAmount = form.value.quotaAmount;
    addChangeRecord(form.value).then(response => {
          proxy.$modal.msgSuccess("变更成功");
          open.value = false;
          getList();
        });
  } else if (editType.value == 'extends') {
let sendData = {"quotaId":form.value.quotaId,"expiryDate":form.value.extensionDate}
    editExpiryDate(sendData).then(response => {
          proxy.$modal.msgSuccess("展期成功");
          open.value = false;
          getList();
        });
}  else if (editType.value == 'freeze') {
  
let sendData = {"quotaId":form.value.quotaId,"operType":2}
freeze(sendData).then(response => {
          proxy.$modal.msgSuccess("冻结成功");
          open.value = false;
          getList();
        });
} else if (editType.value == 'freezeRe') {
  let sendData = {"quotaId":form.value.quotaId,"operType":3}
  unfreeze(sendData).then(response => {
          proxy.$modal.msgSuccess("解冻成功");
          open.value = false;
          getList();
        });
  }else if (editType.value == 'stop') {
    let sendData = {"quotaId":form.value.quotaId,"operType":4}
    endPost(sendData).then(response => {
          proxy.$modal.msgSuccess("终止成功");
          open.value = false;
          getList();
        });
  }else if (editType.value == 'stopRe') {
    let sendData = {"quotaId":form.value.quotaId,"operType":5}
    cancelEndPost(sendData).then(response => {
          proxy.$modal.msgSuccess("撤销终止成功");
          open.value = false;
          getList();
        });
  } 

}

/** 删除按钮操作 */
function handleDelete(row) {
  const _quotaIds = row.quotaId || ids.value;
  proxy.$modal.confirm('是否确认删除客户额度编号为"' + _quotaIds + '"的数据项？').then(function () {
    return delQuota(_quotaIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => { });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('cust/quota/export', {
    ...queryParams.value
  }, `quota_${new Date().getTime()}.xlsx`)
}


// 用户组件请求信息
const userParams = ref({
  pageNum: 1,
  pageSize: 10,
})
// 打开用户信息选择框 请求用户信息
function openDiag(options) {
  console.log(tableData.value);
  if (options == 'customerNo') {
    if (!tableData.value.length || checkItem.value != 'customerNo'|| checkItem.value == '') {
      loading.value = true;
      userParams.value.pageNum = 1;
      listInfo(userParams.value).then(response => {
        tableData.value = [];
        loading.value = false;
        response.rows.map((item) => {
          tableData.value.push({
            userId: item.customerNo,
            userName: item.customerName,
          })
        });
        totalDia.value = response.total;
        console.log(options)
        titleDia.value = "客户基本信息";
        labelItem.value = ['客户编号', '客户名称'];
        opendialog.value = true;
      });
    } else {
      console.log(options)
      titleDia.value = "客户基本信息";
      labelItem.value = ['客户编号', '客户名称'];
      opendialog.value = true;
    }

  } else {
    if (!tableData.value.length || checkItem.value == 'customerNo' || checkItem.value == '') {
      loading.value = true;
      userParams.value.pageNum = 1;
      listUser(userParams.value).then(response => {
        loading.value = false;
        tableData.value = [];
        response.rows.map((item) => {
          tableData.value.push({
            userId: item.userId,
            userName: item.nickName,
          })
        });
        totalDia.value = response.total;
        console.log(options)
        titleDia.value = "用户信息";
        labelItem.value = ['用户编号', '用户名称'];
        opendialog.value = true;
      })
    } else {
      console.log(options)
      titleDia.value = "用户信息";
      labelItem.value = ['用户编号', '用户名称'];
      opendialog.value = true;
    }
  }
  checkItem.value = options;

}
// 弹出用户信息分页处理
function pageChange(page) {
  userParams.value.pageNum = page;
  loading.value = true;

 if (checkItem.value == 'customerNo') {
  listInfo(userParams.value).then(response => {
    loading.value = false;
    tableData.value = [];
    response.rows.map((item) => {
      tableData.value.push({
        userId: item.customerNo,
        userName: item.customerName,
      })
    });
    totalDia.value = response.total;
    titleDia.value = "客户基本信息";
    labelItem.value = ['客户编号', '客户名称'];
    opendialog.value = true;
  });
} else {
  listUser(userParams.value).then(response => {
        loading.value = false;
        tableData.value = [];
        response.rows.map((item) => {
          tableData.value.push({
            userId: item.userId,
            userName: item.nickName,
          })
        });
        totalDia.value = response.total;
        titleDia.value = "用户信息";
        labelItem.value = ['用户编号', '用户名称'];
        opendialog.value = true;
      })
}
}
// 选择了用户信息；
function selectRow(rows) {
  console.log(checkItem.value);
  if (checkItem.value == 'customerNo') {
    form.value[checkItem.value] = rows.userId;
    form.value.customerName = rows.userName;
  } else {
    // 查询条件的查询客户经理和录入人
    queryParams.value[checkItem.value] = rows.userName;
  }

}


function handleChangeAmount(){
  if(form.value.quotaAmount && form.value.changeType && form.value.changeAmount) {
      changeAmount(form.value.quotaAmount,form.value.changeType,form.value.changeAmount).then(response => {
        form.value.afterChineseMoney =  response.afterChineseMoney;
        form.value.afterChangeAmount =  response.afterChangeAmount;
      });
  }
 
}
getList();
</script>

<style lang="scss" scoped>
.button-display{
  display: flex;
  flex-wrap: wrap;
  justify-content:flex-start ;
.el-button+.el-button{
  margin-left: 0;
}
}
</style>
