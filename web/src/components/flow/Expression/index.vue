<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px" style="margin-bottom: 20px">
      <el-form-item label="名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入表达式名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="expressionList" @current-change="handleSingleExpSelect">
      <el-table-column  width="55" align="center" >
        <template #default="scope">
          <!-- 可以手动的修改label的值，从而控制选择哪一项 -->
          <el-radio v-model="radioSelected" :label="scope.row.id">{{''}}</el-radio>
        </template>
      </el-table-column>
      <el-table-column label="主键" align="center" prop="id" />
      <el-table-column label="名称" align="center" prop="name" />
      <el-table-column label="表达式内容" align="center" prop="expression" />
      <el-table-column label="备注" align="center" prop="remark" />
    </el-table>

    <pagination
        v-show="total>0"
        :total="total"
        :page-sizes="[5,10]"
        layout="prev, pager, next"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
    />
  </div>
</template>

<script setup name="FlowExpression">
import { listExpression } from "@/api/flowable/expression";
import {markRaw} from "@vue/reactivity";
const emit = defineEmits(['handleSingleExpSelect'])

const { proxy } = getCurrentInstance();
const expressionList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const total = ref(0);
const radioSelected = ref(null);

const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    name: null,
  }
});

const { queryParams } = toRefs(data);
/** 组件传值  */
const props = defineProps({
  // 回显数据传值
  selectValues: {
    type: [Number , String , Array],
    default: null,
    required: false
  },
});

/** 传值监听 */
watch(() => props.selectValues, newValue => {
      if (newValue) {
        radioSelected.value = newValue
      }
    }, {immediate: true}
);

/** 查询流程达式列表 */
function getList() {
  loading.value = true;
  listExpression(queryParams.value).then(response => {
    expressionList.value = response.rows;
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

/** 单选框选中数据 */
function handleSingleExpSelect(selection) {
  radioSelected.value = selection.id;//点击当前行时,radio同样有选中效果
  emit('handleSingleExpSelect', markRaw(selection));
}

getList();
</script>
