<template>
  <div class="app-container">
    <QueryParams :queryParams="queryParams" :paramsItems="paramsItems" :showSearch="showSearch" @handleQuery="handleQuery" @resetQuery="resetQuery"></QueryParams>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Switch" @click="handleSignStatus" :disabled="single"
          v-hasPermi="['finance:task:edit']">资产签约</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="tasksData" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" fixed="left"/>
          <el-table-column label="买方" prop="partyBuy" align="center" fixed="left" min-width="180"/>
          <el-table-column label="卖方" prop="partySell" align="center" fixed="left" min-width="180"/>
          <!-- <el-table-column label="分合同编号" prop="partyBuy" align="center" min-width="240"/> -->
          <el-table-column label="基础交易合同名称" prop="basicContractName" align="center" min-width="240"/>
          <el-table-column label="拨付总额" prop="totalAppropriation" align="center" min-width="180">
            <template #default="scope">
              <span>{{formatMoney(scope.row.totalAppropriation)}}</span>
            </template>
          </el-table-column>
          <el-table-column label="资产合格标准" align="center" min-width="120">
            <template #default="scope">
              <dict-tag :options="sys_true_or_false" :value="scope.row.qualifiedStandard" />
            </template>
          </el-table-column>
          <el-table-column label="资产入池标准" align="center" min-width="120">
            <template #default="scope">
              <dict-tag :options="sys_true_or_false" :value="scope.row.poolingStandard" />
            </template>
          </el-table-column>
          <el-table-column label="还款时间" align="center" min-width="120">
            <template #default="scope">
              <span>{{ parseTime(scope.row.repayTime, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="资产签约状态" align="center" min-width="120" fixed="right">
            <template #default="scope">
              <dict-tag :options="asset_sign_flag" :value="scope.row.signStatus" />
            </template>
          </el-table-column>
        </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize"
      @pagination="getList" />

      <el-dialog v-model="formDialog.visible" v-loading="formDialog.loading" :title="formDialog.title">
        <el-form class="info-form" ref="elForm" :model="formData" label-width="140px">
          <el-row :gutter="15">
            <el-col :lg="12" :md="24">
              <el-form-item label="买方" prop="partyBuy">
                <el-input v-model="formData.partyBuy" disabled/>
              </el-form-item>
            </el-col>
            <el-col :lg="12" :md="24">
              <el-form-item label="卖方" prop="partySell">
                <el-input v-model="formData.partySell" disabled/>
              </el-form-item>
            </el-col>
            <el-col :lg="12" :md="24">
              <el-form-item label="基础交易合同名称" prop="basicContractName">
                <el-input v-model="formData.basicContractName" disabled/>
              </el-form-item>
            </el-col>
            <el-col :lg="12" :md="24">
              <el-form-item label="拨付总额" prop="totalAppropriation">
                <ElPriceInput :form="formData" prop="totalAppropriation" :disabled="true"></ElPriceInput>
              </el-form-item>
            </el-col>
            <el-col :lg="12" :md="24">
              <el-form-item label="资产签约状态" prop="signStatus">
                <el-select v-model="formData.signStatus" placeholder="请选择">
                  <el-option v-for="item in asset_sign_flag" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
              <el-button type="primary" @click="submitForm">确 定</el-button>
              <el-button @click="handleClose">取 消</el-button>
          </div>
        </template>
      </el-dialog>
  </div>
</template>

<script setup>
import { listData, getInfo, save } from "@/api/finance/task";
import { deepClone } from "@/utils/index";
import { formatMoney } from "@/utils/formatMoney";
import QueryParams from "@/components/QueryParams";
import ElPriceInput from "@/components/ElPriceInput";

const { proxy } = getCurrentInstance();
const route = useRoute();
const router = useRouter();
const { sys_true_or_false, asset_sign_flag } = proxy.useDict("sys_true_or_false","asset_sign_flag");//下拉框字典

const loading = ref(true);
const tasksData = ref([]);
const showSearch = ref(true);
const total = ref(0);

const assetSelected = ref({})
const single = ref(true)

const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    partyBuy: "",
    partySell: "",
    subContractNo: "",
    basicContractName: "",
    signStatus: ""
  },
  paramsItems: [
    {
      type: "text",
      label: "卖方客户名称",
      prop: "partySell",
      placeholder: "请输入卖方客户名称",
    },
    {
      type: "text",
      label: "买方客户名称",
      prop: "partyBuy",
      placeholder: "请输入买方客户名称",
    },
    {
      type: "text",
      label: "分合同编号",
      prop: "subContractNo",
      placeholder: "分合同编号-支持模糊查询",
    },
    {
      type: "text",
      label: "基础交易合同名称",
      prop: "basicContractName",
      placeholder: "基础交易合同名称-支持模糊查询",
    },
    {
      type: "select_all",
      label: "资产签约状态",
      prop: "signStatus",
      placeholder: "请选择",
      options: asset_sign_flag
    }
  ],
  formDialog: {
    title: "资产签约",
    visible: false,
    loading: false
  },
  formData: {
    absAssociationTaskId: null,
    absAssociationId: null,
    absId: null,
    partyBuy: "",
    partySell: "",
    subContractNo: "",
    basicContractName: "",
    totalAppropriation: "",
    signStatus: "1"
  }
});

const uniqueId = ref("");
onActivated(() => {
  const time = route.query.t;
  if (time != null && time != uniqueId.value) {
    uniqueId.value = time;
    queryParams.value.pageNum = Number(route.query.pageNum);
    proxy.resetForm("queryRef");
    getList();
  }
})


const { queryParams, paramsItems, formDialog, formData } = toRefs(data);

/** 查询列表 */
function getList() {
  loading.value = true;
  listData(queryParams.value).then(response => {
    tasksData.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}


/** 搜索按钮操作 */
function handleQuery(params) {
  if (params) {
    queryParams.value = params
  }
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery(params) {
  handleQuery(params);
}

// 多选操作
function handleSelectionChange(selection) {
  single.value = selection.length != 1;
  if (!single.value) {
    assetSelected.value = deepClone(selection[0])
  } else {
    assetSelected.value = {}
  }
}

/** 资产签约按钮操作 */
function handleSignStatus() {
  formData.value = deepClone(assetSelected.value)
  if (!formData.value.signStatus || formData.value.signStatus === "") {
    formData.value.signStatus = "1"
  }
  formDialog.value.visible = true;
}

// 弹窗 取消操作
function handleClose() {
  proxy.$refs['elForm'].resetFields();
  formDialog.value.visible = false;
}

// 弹窗 确定操作
function submitForm() {
  formDialog.value.loading = true
  const infoSave = formData.value
  save(infoSave).then(response => {
    proxy.$modal.msgSuccess("修改成功");
    formDialog.value.loading = false;
    handleClose()
    getList()
  }).catch(() => {
    formDialog.value.loading = false
  });
}


getList();
</script>