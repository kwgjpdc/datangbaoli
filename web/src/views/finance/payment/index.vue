<template>
   <div class="app-container">
      <el-form :model="queryParams" ref="queryRef" v-show="showSearch" :inline="true" label-width="68px">
        <el-form-item label="收款账号" prop="paymentAccount">
            <el-input
               v-model="queryParams.paymentAccount"
               placeholder="请输入收款账号"
               clearable
               style="width: 140px"
               @keyup.enter="handleQuery"
            />
         </el-form-item>
         <el-form-item label="户名" prop="paymentDescribe">
            <el-input
               v-model="queryParams.accountName"
               placeholder="请输入户名"
               clearable
               style="width: 140px"
               @keyup.enter="handleQuery"
            />
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
               icon="Plus"
               @click="handlePayment"
               v-hasPermi="['finance:payment:add']"
            >新增</el-button>
         </el-col>
         <el-col :span="1.5">
            <el-button
               type="danger"
               plain
               icon="Delete"
               :disabled="multiple"
               @click="handleDelete"
               v-hasPermi="['finance:payment:remove']"
            >删除</el-button>
         </el-col>
         <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <!-- 表格数据 -->
      <el-table v-loading="loading" :data="paymentList" @selection-change="handleSelectionChange">
         <el-table-column type="selection" width="55" align="center" />
         <el-table-column label="开户行" prop="depositBank" width="150" />
         <el-table-column label="户名" prop="accountName" width="150" />
         <el-table-column label="银行账号" prop="paymentAccount" width="150" />
         <el-table-column label="账号描述" prop="paymentDescribe" width="150" />
         <el-table-column label="操作" align="center" class-name="small-padding"  width="120" >
            <template #default="scope">
              <el-tooltip content="修改" placement="top">
                <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:templet:edit']"></el-button>
              </el-tooltip>
              <el-tooltip content="删除" placement="top">
                <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['system:templet:remove']"></el-button>
              </el-tooltip>
            </template>
         </el-table-column>
      </el-table>

      <pagination
         v-show="total > 0"
         :total="total"
         v-model:page="queryParams.pageNum"
         v-model:limit="queryParams.pageSize"
         @pagination="getList"
      />

      <!-- 添加或修改合同模板话框 -->
      <el-dialog :title="title" v-model="open" width="600px" append-to-body>
        <el-form ref="templetRef" :model="form" :rules="rules" label-width="100px">
            <el-form-item label="开户行" prop="depositBank">
               <el-input v-model="form.depositBank" placeholder="请输入开户行名称" />
            </el-form-item>
            <el-form-item label="户名" prop="accountName">
               <el-input v-model="form.accountName" placeholder="请输入户名名称" />
            </el-form-item>
            <el-form-item label="收款账号" prop="paymentAccount">
               <el-input v-model="form.paymentAccount" placeholder="请输入收款账号" />
            </el-form-item>
            <el-form-item label="账号描述" prop="paymentDescribe">
               <el-input v-model="form.paymentDescribe" placeholder="请输入账号描述" />
            </el-form-item>
            <el-form-item label="备注">
               <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
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

<script setup name="agroup">
import { listPayment, addPayment, updatePayment, delPayment } from "@/api/finance/payment";

const { proxy } = getCurrentInstance();

const paymentList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const menuRef = ref(null);

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    paymentAccount: undefined,
    paymentDescribe: undefined,
    delFlag: 2
  },
  rules: {
    depositBank: [{ required: true, message: "开户行不能为空", trigger: "blur" }],
    accountName: [{ required: true, message: "户名不能为空", trigger: "blur" }],
    paymentAccount: [{ required: true, message: "银行账号不能为空", trigger: "blur" }],
  },
});

const { queryParams, form, rules, } = toRefs(data);

/** 查询模板列表 */
function getList() {
  loading.value = true;
  listPayment(queryParams.value).then(response => {
    paymentList.value = response.rows;
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
  handleQuery();
}
/** 修改按钮操作 */
function handleUpdate(row){
  form.value.paymentId = row.paymentId;
  form.value.depositBank = row.depositBank;
  form.value.accountName = row.accountName;
  form.value.paymentAccount = row.paymentAccount;
  form.value.paymentDescribe = row.paymentDescribe;
  form.value.remark = row.remark;
  title.value = "修改保理收款账号";
  open.value = true;
}
/** 删除按钮操作 */
function handleDelete(row) {
  const paymentIds = row.paymentId || ids.value;
  proxy.$modal.confirm('是否确认删除数据项?').then(function () {
    return delPayment(paymentIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}
/** 多选框选中数据 */
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.paymentId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}
/** 重置新增的表单以及其他数据  */
function reset() {
  if (menuRef.value != undefined) {
    menuRef.value.setCheckedKeys([]);
  }
  form.value = {
    paymentId: undefined,
    depositBank: undefined,
    accountName: undefined,
    paymentAccount: undefined,
    paymentDescribe: undefined,
    remark: undefined
  };
  proxy.resetForm("templetRef");
}
/** 添加模板 */
function handlePayment() {
  reset();
  open.value = true;
  title.value = "添加保理收款账号";
}
/** 提交按钮 */
function submitForm() {
  proxy.$refs["templetRef"].validate(valid => {
    if (valid) {
      if (form.value.templetId != undefined) {
        updatePayment(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addPayment(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}
/** 取消按钮 */
function cancel() {
  open.value = false;
  reset();
}

getList();


</script>
