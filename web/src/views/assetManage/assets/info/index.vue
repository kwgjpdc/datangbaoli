<template>
  <div class="app-container">
    <QueryParams :queryParams="queryParams" :paramsItems="paramsItems" :showSearch="showSearch" @handleQuery="handleQuery" @resetQuery="resetQuery"></QueryParams>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAdd"
          v-hasPermi="['assetManage:assets:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" @click="handleDelete" :disabled="multiple"
          v-hasPermi="['assetManage:assets:delete']">删除</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="assetsData" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" fixed="left"/>
          <el-table-column label="买方" prop="partyBuy" align="center" fixed="left" min-width="180"/>
          <el-table-column label="卖方" prop="partySell" align="center" fixed="left" min-width="180"/>
          <el-table-column label="分合同编号" prop="partyBuy" align="center" min-width="240"/>
          <el-table-column label="基础交易合同名称" prop="partyBuy" align="center" min-width="240"/>
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
          <el-table-column label="操作" width="120" align="center" fixed="right">
            <template #default="scope">
            <div class="button-display">
              <el-button type="primary" link @click="handleUpdate(scope.row)">修改</el-button>
              <el-button type="danger" link @click="handleDelete(scope.row)">删除</el-button>
            </div>
            </template>
          </el-table-column>
        </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize"
      @pagination="getList" />


  </div>
</template>

<script setup name="assetManage-assets">
import QueryParams from "@/components/QueryParams"
import { listAssociation, deleteAssets } from "@/api/abs"
import { formatMoney } from "@/utils/formatMoney"
const { proxy } = getCurrentInstance();
const route = useRoute();
const router = useRouter();
const { sys_true_or_false } = proxy.useDict('sys_true_or_false');//下拉框字典

const loading = ref(true);
const assetsData = ref([]);
const showSearch = ref(true);
const total = ref(0);

const ids = ref([])
const single = ref(true)
const multiple = ref(true)

const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    partyBuy: "",
    partySell: "",
    subContractNo: "",
    basicContractName: ""
  },
  paramsItems: [
    {
      type: "text",
      label: "买方",
      prop: "partyBuy",
      placeholder: "请输入买方",
    },
    {
      type: "text",
      label: "卖方",
      prop: "partySell",
      placeholder: "请输入卖方",
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
    }
  ]
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


const { queryParams, paramsItems } = toRefs(data);

/** 查询列表 */
function getList() {
  loading.value = true;
  listAssociation(queryParams.value).then(response => {
    assetsData.value = response.rows;
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

/** 新增按钮操作 */
function handleAdd() {
  router.push({ path: '/assetManage/assets/detail', query: { pageNum: queryParams.value.pageNum } });
}

/** 查看按钮操作 */
function handleView(row) {
  const _id = row.absAssociationId
  router.push({ path: '/assetManage/assets/detail', query: { absAssociationId: _id, viewFlag: true, pageNum: queryParams.value.pageNum } });
}

/** 录入按钮操作 */
function handleUpdate(row) {
  const _id = row.absAssociationId
  router.push({ path: '/assetManage/assets/detail', query: { absAssociationId: _id, pageNum: queryParams.value.pageNum } });
}

// 多选操作
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.absAssociationId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _ids = row.absAssociationId || ids.value;
  proxy.$modal.confirm('是否确认删除？').then(function () {
    return deleteAssets(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => { });
}

/** 导出按钮操作 */
// function handleExport() {
//   proxy.download('debt/loan/export', {
//     ...queryParams.value
//   }, `loan_${new Date().getTime()}.xlsx`)
// }

getList();
</script>