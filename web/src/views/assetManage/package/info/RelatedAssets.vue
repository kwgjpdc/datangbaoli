<template>
  <div class="assets-container">
    <el-button type="danger" plain icon="Connection" @click="openDialog" :disabled="props.single">
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
        <el-col :span="12" align="right" style="padding-right: 10px">
          已选拨付总额：{{ formatMoney(amountTotal) }}
        </el-col>
      </el-row>
      <div class="assets-result">
        <el-table ref="assetsTable" v-loading="loading" :data="assetsData" @select="handleSelectRow" @select-all="handleSelectAll" :row-key="getRowKeys">
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
import { listAssociation, getAssociationList, updateAssociation } from "@/api/abs"
import { formatMoney, formatPercent } from "@/utils/formatMoney"

import QueryParams from "@/components/QueryParams"
import { watch } from "vue"

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
const assetsSelectedIds = ref([])
const amountTotal = ref(0)
const total = ref(0)
const dataSource = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    partyBuy: "",
    partySell: "",
    subContractNo: "",
    basicContractName: "",
    params: {
      flag: "relatable"
    }
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
  initData()
}
// 关闭
function handleClose() {
  assetsData.value = []
  assetsSelectedIds.value = []
  assetsSelecteds.value = []
  proxy.$refs.assetsTable.clearSelection()
  dialogVisible.value = false
}
// 弹窗数据初始化
function initData() {
  if (props.absIds && props.absIds.length > 0) {
    absId.value = props.absIds.join(',')
    queryParams.value.params.absId = absId.value
    getAssociations(absId.value)
    handleQuery()
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
    proxy.$nextTick(()=>{
      assetsData.value.forEach(row => {
        if (assetsSelectedIds.value.indexOf(row.absAssociationId) > -1) {
          proxy.$refs.assetsTable.toggleRowSelection(row, true)
        }
      })
    })
  });
}
/** 查询已关联的全部资产列表 */
function getAssociations(id) {
  getAssociationList(id).then(response=>{
    assetsSelecteds.value = response.data.associationList
    handleAssetsSelecteds()
    //assetsSelectedIds.value = assetsSelecteds.value.map(item => item.absAssociationId)
  })
}
// 多选操作
function handleSelectRow(rows, row) {
  let selected = rows.length && rows.indexOf(row) !== -1
  let lenFalse = assetsSelecteds.value.length
  if (selected) {
    assetsSelecteds.value.push(row)
  } else {
    if (lenFalse !== 0) {
      for(let i = 0; i < lenFalse; i++) {
        if (assetsSelecteds.value[i].absAssociationId === row.absAssociationId) {
          assetsSelecteds.value.splice(i, 1)
          break
        }
      }
    }
  }
  handleAssetsSelecteds()
  //assetsSelectedIds.value = assetsSelecteds.value.map(item => item.absAssociationId)
  // console.log('选择了', assetsSelectedIds.value)
}
// 全选操作
function handleSelectAll(rows) {
  const rowsLen = rows.length
  const dataLen = assetsData.value.length
  const selectedLen = assetsSelecteds.value.length 
  const isAllFlag = rows.indexOf(assetsData.value[0]) > -1
  if (!isAllFlag) { // 取消全选
    if (selectedLen > 0) {
      const resultList = assetsSelecteds.value.filter( item => {
        return !assetsData.value.find( prop => {
          return prop.absAssociationId === item.absAssociationId
        })
      })
      assetsSelecteds.value = resultList
    }
  } else { // 全选
    const resultList = rows.reduce((arr1, obj) => {
      let isFlag = false
      arr1.forEach(item => {
        if (item.absAssociationId === obj.absAssociationId) {
          isFlag = true
          item = Object.assign(item, obj)
        }
      })
      if(!isFlag) {
        arr1.push(obj)
      }
      return arr1
    }, assetsSelecteds.value)
    assetsSelecteds.value = resultList
  }
  handleAssetsSelecteds()
  //assetsSelectedIds.value = assetsSelecteds.value.map(item => item.absAssociationId)
  // console.log('是否全选', assetsSelecteds.value)
}

function getRowKeys(row) {
  return row.absAssociationId
}

// 选择的资产操作
function handleAssetsSelecteds() {
  if (assetsSelecteds.value.length > 0) {
    assetsSelectedIds.value = assetsSelecteds.value.map(item => item.absAssociationId)
    amountTotal.value = assetsSelecteds.value.reduce((sum, e) => sum + Number(e.totalAppropriation || 0), 0)
  } else {
    assetsSelectedIds.value = []
    amountTotal.value = 0
  }
}

// 关联资产操作
function handleRelated() {
  loading.value = true
  const relatedList = deepClone(assetsSelecteds.value)
  console.log('关联数据', relatedList)
  let relatedInfo = {
    absId: absId.value,
    associationList: relatedList
  }
  updateAssociation(relatedInfo).then(response=>{
        proxy.$modal.msgSuccess("关联成功");
        loading.value = false;
        handleClose()
    })
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