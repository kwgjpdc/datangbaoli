<template>
  <div class="assets-container">
    <el-button type="danger" plain icon="Switch" @click="openDialog" :disabled="props.single">
      关联资产
    </el-button>
    <!-- 资产信息列表 -->
    <el-dialog ref="assetsDialog" class="assets-dialog" title="资产列表" v-model="dialogVisible" append-to-body>
      <QueryParams ref="query" :queryParams="queryParams" :paramsItems="paramsItems" @handleQuery="handleQuery" @resetQuery="resetQuery"></QueryParams>
      <el-row :gutter="10" class="mb8" justify="end">
        <!-- <el-col :span="1.5" ref="tableTop">
          <el-button type="primary" plain icon="Plus" @click="handleAdd">
            新增
          </el-button>
        </el-col> -->
        <el-col :span="3">
          已选拨付总额：{{ formatMoney(amountTotal) }}
        </el-col>
      </el-row>
      <div class="assets-result">
        <el-table v-loading="loading" :data="assetsData" @selection-change="handleSelectionChange" :row-key="getRowKeys">
          <el-table-column type="selection" :reserve-selection="true" width="55" align="center" fixed="left"/>
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
          <!-- <el-table-column label="操作" width="120" align="center" fixed="right">
            <template #default="scope">
            <div class="button-display">
              <el-button type="primary" link @click="handleEdit(scope.row)">修改</el-button>
            </div>
            </template>
          </el-table-column> -->
        </el-table>
        <!-- 分页 -->
        <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
        <!-- 分页 end -->
      </div>
      <template #footer>
        <div class="dialog-footer" ref="dialogFooter">
          <el-button type="primary" @click="handleRelated">确 定</el-button>
          <el-button @click="handleClose">取 消</el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 资产信息列表 end-->
  </div>
</template>

<script setup>
const { proxy } = getCurrentInstance()
import {toRaw} from "@vue/reactivity"
import { deepClone } from "@/utils/index"
import { listAssociation, getAssociationList, addAssociation, updateAssociation } from "@/api/abs"
import { formatMoney, formatPercent } from "@/utils/formatMoney"
 
import QueryParams from "@/components/QueryParams"

// 字典参数
const { sys_true_or_false } = proxy.useDict("sys_true_or_false")
const props = defineProps({
  absIds: {
    type: Array,
    default: null,
  },
  single: {
    type: Boolean,
    default: true
  },
  routerQueryObj: {
    type: Object,
    default: null,
  }
});

const dialogVisible = ref(false)

const absId = ref("")
const loading = ref(true)
const assetsData = ref([])
const assetsSelecteds = ref([])
const tableSelection = ref([])
const amountTotal = ref(0)
const total = ref(0)
const dataSource = reactive({
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
})
const { queryParams, paramsItems } = toRefs(dataSource);

// 打开弹窗
function openDialog() {
  dialogVisible.value = true
  handleQuery()
  initData()
}
// 关闭
function handleClose() {
  dialogVisible.value = false
}
// 弹窗数据初始化
function initData() {
  if (props.absIds && props.absIds.length > 0) {
    absId.value = props.absIds.join(',')
    getAssociations(absId.value)
  }
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

/** 查询全部资产列表 */
function getList() {
  loading.value = true
  listAssociation(queryParams.value).then(response => {
    assetsData.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}
/** 查询已关联的全部资产列表 */
function getAssociations(id) {
  getAssociationList(id).then(response=>{
    assetsSelecteds.value = response.data.associationList
  })
}
// 多选操作
function handleSelectionChange(selection) {
  tableSelection.value = selection.map(item => toRaw(item))
  // console.log('选了数据',tableSelection.value)
}

function getRowKeys(row) {
  return row.absAssociationId
}

// proxy.$nextTick(() => {
//   assetsData.value.forEach()
// })

// 关联资产操作
function handleRelated() {
  loading.value = true
  const relatedList = deepClone(tableSelection.value)
  // tableSelection.value.forEach((item) => {
  //   relatedList.push(item)
  // });
  console.log('关联数据', relatedList)
  let relatedInfo = {
    absId: absId.value,
    associationList: relatedList
  }
  if (assetsSelecteds.value.length > 0) {
    updateAssociation(relatedInfo).then(response=>{
        proxy.$modal.msgSuccess("修改成功");
        loading.value = false;
        assetsClose()
        handleQuery()
    })
  } else {
    addAssociation(relatedInfo).then(response=>{
      proxy.$modal.msgSuccess("新增成功");
      loading.value = false;
      handleClose()
    })
  }
}
</script>

<style lang="scss">
.assets-dialog.el-dialog {
  width: 90%;
  top: 10px;
  bottom: 10px;
  margin: 20px auto !important;
}
.assets-result {
  .pagination-container {
    position: relative !important;
    margin-top: 20px;
  }
}
</style>