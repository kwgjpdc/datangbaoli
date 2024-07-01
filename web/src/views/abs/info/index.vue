<template>
    <div class="app-container" v-loading="loading">
        <!-- 查询条件 -->
        <QueryParams :queryParams="queryParams"
                 :paramsItems="paramsItems"
                 :showSearch="showSearch"
                 @handleQuery="handleQuery"
                 @resetQuery="resetQuery"></QueryParams>
        <!-- 操作区 -->
        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button type="primary" plain icon="Plus" @click="handleAdd">
                    新增
                </el-button>
            </el-col>
            <el-col :span="1.5">
                <RelatedAssets :single="single" :absIds="ids"></RelatedAssets>
            </el-col>
            <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" />
        </el-row>
        <!-- 表格 -->
        <el-table :data="absList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center"/>
            <!-- <el-table-column width="55" align="center">
                <template #default="scope">
                    {{ scope.$index + 1 }}
                </template>
            </el-table-column> -->
            <el-table-column label="资产包编号" align="center" min-width="120">
                <template #default="scope">
                    <el-button link type="primary" @click="handleView(scope.row)">{{ scope.row.absNo }}</el-button>
                </template>
            </el-table-column>
            <el-table-column label="金融机构名称" align="center" prop="institutionName" min-width="120" />
            <el-table-column label="融资方式" align="center" min-width="120">
                <template #default="scope">
                    <dict-tag :options="abs_financing_method" :value="scope.row.financingMethod" />
                </template>
            </el-table-column>
            <el-table-column label="应收账款转让方式" align="center" min-width="160">
                <template #default="scope">
                    <dict-tag :options="abs_debt_transfer_method" :value="scope.row.debtTransferMethod" />
                </template>
            </el-table-column>
            <el-table-column label="资产包到期日" align="center" prop="absEndDate" min-width="160" />
            <el-table-column label="专项计划编号" align="center" prop="specialPlanNo" min-width="120" />
            <el-table-column label="专项计划" align="center" prop="specialPlan" />
            <el-table-column label="计划管理人名称" align="center" prop="planManager" min-width="120" />
            <el-table-column label="户名" align="center" prop="accountName" />
            <el-table-column label="账号" align="center" prop="accountCode" />
            <el-table-column label="开户行" align="center" prop="accountBank" />
			<el-table-column label="状态" align="center" prop="status">
			  <template #default="scope">
			    <dict-tag :options="debt_status" :value="scope.row.status" />
			  </template>
			</el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right" width="200">
                <template #default="scope">
                    <div class="button-display">
                        <el-button 
                            link 
                            type="primary" 
                            icon="Edit" 
                            @click="handleUpdate(scope.row)"
                        >
                            修改
                        </el-button>
                        <el-button 
                            link 
                            type="primary" 
                            icon="Delete" 
                            @click="handleDelete(scope.row)"
                        >
                            删除
                        </el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
         <!-- 分页 -->
         <pagination 
            v-show="total > 0" 
            :total="total"
            v-model:page="queryParams.pageNum" 
            v-model:limit="queryParams.pageSize"
            @pagination="getList" 
        />
    </div>
</template>

<script setup>
import { ref, onBeforeMount } from "vue";
import { listAbs, delAbs } from "@/api/abs";

import QueryParams from "@/components/QueryParams"
import RelatedAssets from "./RelatedAssets"
// 当前组件对象
const { proxy } = getCurrentInstance();

// 路由对象
const router = useRouter();

// Form item 内容的统一宽度
const formItemContentStyle = { width: "240px" };

// 是否展示查询条件
const showSearch = ref(true);

// 系统字典
const { 
    abs_financing_method, 
    abs_debt_transfer_method,
	proj_dd_status,
	debt_status
} = proxy.useDict(
    "abs_financing_method", 
    "abs_debt_transfer_method",
	"proj_dd_status",
	"debt_status"
);

// 数据勾选
const ids = ref([])
const single = ref(true)
const multiple = ref(true)

// 是否显示loading
const loading = ref(false);
// 查询条件对象
const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    absNo: null,
    institutionName: null
  },
  paramsItems: [
    {
      type: "text",
      label: "资产包编号",
      prop: "absNo",
      placeholder: "请输入资产包编号",
    },
    {
      type: "text",
      label: "金融机构名称",
      prop: "institutionName",
      placeholder: "请输入金融机构名称",
    }
  ]
});
const { queryParams, paramsItems } = toRefs(data);

// 数据集合
const absList = ref([]);

// 查询数据总数
const total = ref(0);

// 查询数据列表
function getList() {
    loading.value = true;
    listAbs(queryParams.value).then(response => {
        absList.value = response.rows;
        total.value = response.total;
        loading.value = false;
    }).catch(() => {
        loading.value = false;
    });
}

// 查询按钮操作
function handleQuery(params) {
  if (params) {
    queryParams.value = params
  }
  queryParams.value.pageNum = 1;
  getList();
}

// 重置按钮操作
function resetQuery(params) {
  handleQuery(params);
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.absId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

// 新增按钮操作
function handleAdd() {
    resetQuery();
    //router.push({ name: 'Abs/detail/index', state: { pageNum: queryParams.value.pageNum } });
    router.push({ path: '/assetManage/package/detail', query: { pageNum: queryParams.value.pageNum } });
}

// 删除按钮操作
function handleDelete(row) {
	loading.value = true;
	proxy.$modal.confirm('是否确认删除？').then(function () {
	  return delAbs(row.absId);
	}).then(() => {
	  getList();
	  proxy.$modal.msgSuccess("删除成功");
	  loading.value = false;
	}).catch(() => {
		 loading.value = false;
	});
    // delAbs(row.absId).then(() => {
    //     absList.value.splice(absList.value.indexOf(row), 1);
    //     proxy.$modal.msgSuccess("删除成功");
    //     loading.value = false;
    // }).catch(() => {
    //     loading.value = false;
    // });
}

// 修改按钮操作
function handleUpdate(row) {
    resetQuery();
    router.push({ path: '/assetManage/package/detail', query: { absId: row.absId, editFlag: true, pageNum: queryParams.value.pageNum } });
}

// 查看详细链接操作
function handleView(row) {
    resetQuery();
    router.push({ path: '/assetManage/package/detail', query: { absId: row.absId, viewFlag: true, pageNum: queryParams.value.pageNum } });
}

// 在页面挂载前
onBeforeMount(() => {
    getList();
});
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