<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" style="margin-bottom: 20px">
      <el-form-item label="角色名称" prop="roleName">
        <el-input
          v-model="queryParams.roleName"
          placeholder="请输入角色名称"
          clearable
          style="width: 240px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-show="checkType === 'multiple'" ref="dataTable" v-loading="loading" :row-key="getRowKey" :data="roleList" @selection-change="handleMultipleRoleSelect">
      <el-table-column type="selection" width="50" align="center" reserve-selection/>
      <el-table-column label="角色编号" prop="roleId" width="120" />
      <el-table-column label="角色名称" prop="roleName" :show-overflow-tooltip="true" width="150" />
      <el-table-column label="权限字符" prop="roleKey" :show-overflow-tooltip="true" width="150" />
      <el-table-column label="显示顺序" prop="roleSort" width="100" />
      <el-table-column label="创建时间" align="center" prop="createTime">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-table v-show="checkType === 'single'" v-loading="loading" :data="roleList" @current-change="handleSingleRoleSelect">
      <el-table-column  width="55" align="center" >
        <template #default="scope">
          <!-- 可以手动的修改label的值，从而控制选择哪一项 -->
          <el-radio v-model="radioSelected" :label="scope.row.roleId">{{''}}</el-radio>
        </template>
      </el-table-column>
      <el-table-column label="角色编号" prop="roleId" width="120" />
      <el-table-column label="角色名称" prop="roleName" :show-overflow-tooltip="true" width="150" />
      <el-table-column label="权限字符" prop="roleKey" :show-overflow-tooltip="true" width="150" />
      <el-table-column label="显示顺序" prop="roleSort" width="100" />
      <el-table-column label="创建时间" align="center" prop="createTime">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
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

<script setup name="FlowRole">
import { listRole } from "@/api/system/role";

const router = useRouter();
const { proxy } = getCurrentInstance();

const roleList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const radioSelected = ref(null);
// 回显数据传值
const selectRoleList = ref([]);

const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 5,
    roleName: undefined,
  },
});

const { queryParams } = toRefs(data);

const emit = defineEmits(['handleRoleSelect'])

/** 组件传值  */
const props = defineProps({
  // 回显数据传值
  selectValues: {
    type: [Number , String , Array],
    default: null,
    required: false
  },
  // 表格类型
  checkType: {
    type: String,
    default: 'multiple',
    required: true
  },
});

/** 传值监听 */
watch(() => props.selectValues, newValue => {
      if (newValue) {
        if (typeof newValue === 'number') {
          radioSelected.value = newValue
        } else {
          selectRoleList.value = newValue;
        }
      }
    }, {immediate: true}
);

watch(roleList, newValue => {
      if (newValue.length > 0) {
        proxy.$nextTick(() => {
          proxy.$refs.dataTable.clearSelection();
          /*
          操作时，会显示报错，暂时去掉，目前没有影响正常逻辑
          if(selectRoleList != null && selectRoleList != undefined){
            selectRoleList.value.forEach(key => {
              proxy.$refs.dataTable.toggleRowSelection(roleList.value.find(
                  item => key === item.roleId
              ), true)
            });
          }
          */
        });
      }
    }
);

/** 查询角色列表 */
function getList() {
  loading.value = true;
  listRole(queryParams.value).then(response => {
    roleList.value = response.rows;
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

/** 多选框选中数据 */
function handleMultipleRoleSelect(selection) {
  const idList = selection.map(item => item.roleId.toString());
  const nameList = selection.map(item => item.roleName);
  emit('handleRoleSelect', idList.join(','), nameList.join(','));
}

/** 单选框选中数据 */
function handleSingleRoleSelect(selection) {
  radioSelected.value = selection.roleId.toString();
  const roleName = selection.roleName;
  emit('handleRoleSelect', radioSelected.value, roleName);
}

/** 保存选中的数据id,row-key就是要指定一个key标识这一行的数据 */
function getRowKey (row) {
  return row.roleId
}

getList();
</script>
