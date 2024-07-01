<template>
  <div>
    <el-row :gutter="20">
      <!--部门数据-->
      <el-col :span="6" :xs="24">
        <div class="head-container">
          <el-input
            v-model="deptName"
            placeholder="请输入部门名称"
            clearable
            prefix-icon="el-icon-search"
            style="margin-bottom: 20px"
          />
        </div>
        <div class="head-container">
          <el-tree
            :data="deptOptions"
            :props="defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="tree"
            node-key="id"
            default-expand-all
            highlight-current
            @node-click="handleNodeClick"
          />
        </div>
      </el-col>
      <!--用户数据-->
      <el-col :span="18" :xs="24">
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px" style="margin-bottom: 20px">
          <el-form-item label="用户名称" prop="userName">
            <el-input
              v-model="queryParams.userName"
              placeholder="请输入用户名称"
              clearable
              style="width: 150px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
<!--          <el-form-item label="手机号码" prop="phonenumber">-->
<!--            <el-input-->
<!--              v-model="queryParams.phonenumber"-->
<!--              placeholder="请输入手机号码"-->
<!--              clearable-->
<!--              style="width: 150px"-->
<!--              @keyup.enter="handleQuery"-->
<!--            />-->
<!--          </el-form-item>-->
          <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
        <el-table v-show="checkType === 'multiple'" ref="dataTable" v-loading="loading" :row-key="getRowKey" :data="userList" @selection-change="handleMultipleUserSelect">
          <el-table-column type="selection" width="50" align="center" reserve-selection/>
          <el-table-column label="用户编号" align="center" key="userId" prop="userId" v-if="columns[0].visible" />
          <el-table-column label="登录账号" align="center" key="userName" prop="userName" v-if="columns[1].visible" :show-overflow-tooltip="true" />
          <el-table-column label="用户姓名" align="center" key="nickName" prop="nickName" v-if="columns[2].visible" :show-overflow-tooltip="true" />
          <el-table-column label="部门" align="center" key="deptName" prop="dept.deptName" v-if="columns[3].visible" :show-overflow-tooltip="true" />
          <el-table-column label="手机号码" align="center" key="phonenumber" prop="phonenumber" v-if="columns[4].visible" width="120" />
        </el-table>
        <el-table v-show="checkType === 'single'" v-loading="loading" :data="userList" @current-change="handleSingleUserSelect">
          <el-table-column  width="55" align="center" >
            <template #default="scope">
              <el-radio v-model="radioSelected" :label="scope.row.userId">{{''}}</el-radio>
            </template>
          </el-table-column>
          <el-table-column label="用户编号" align="center" key="userId" prop="userId" v-if="columns[0].visible" />
          <el-table-column label="登录账号" align="center" key="userName" prop="userName" v-if="columns[1].visible" :show-overflow-tooltip="true" />
          <el-table-column label="用户姓名" align="center" key="nickName" prop="nickName" v-if="columns[2].visible" :show-overflow-tooltip="true" />
          <el-table-column label="部门" align="center" key="deptName" prop="dept.deptName" v-if="columns[3].visible" :show-overflow-tooltip="true" />
          <el-table-column label="手机号码" align="center" key="phonenumber" prop="phonenumber" v-if="columns[4].visible" width="120" />
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
      </el-col>
    </el-row>
  </div>
</template>

<script setup name="FlowUser">
import { listUser, deptTreeSelect } from "@/api/system/user";
import {markRaw} from "@vue/reactivity";

const router = useRouter();
const { proxy } = getCurrentInstance();
const { sys_normal_disable, sys_user_sex } = proxy.useDict("sys_normal_disable", "sys_user_sex");

const userList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const deptName = ref("");
const deptOptions = ref(undefined);
// 单选框传值
const radioSelected = ref(null);
// 回显数据传值
const selectUserList = ref([]);

// 列显隐信息
const columns = ref([
  { key: 0, label: `用户编号`, visible: true },
  { key: 1, label: `用户名称`, visible: true },
  { key: 2, label: `用户昵称`, visible: true },
  { key: 3, label: `部门`, visible: true },
  { key: 4, label: `手机号码`, visible: true },
  { key: 5, label: `状态`, visible: true },
  { key: 6, label: `创建时间`, visible: true }
]);

const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    userName: undefined,
    phonenumber: undefined,
    status: undefined,
    deptId: undefined
  },
});

const { queryParams } = toRefs(data);

const emit = defineEmits(['handleUserSelect'])

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

/** 通过条件过滤节点  */
const filterNode = (value, data) => {
  if (!value) return true;
  return data.label.indexOf(value) !== -1;
};
/** 根据名称筛选部门树 */
watch(deptName, val => {
  proxy.$refs["deptTreeRef"].filter(val);
});

/** 传值监听 */
watch(() => props.selectValues, newValue => {
      if (newValue) {
        if (typeof newValue === 'number') {
          radioSelected.value = newValue
        } else {
          selectUserList.value = newValue;
        }
      }
    }, {immediate: true}
);

watch(userList, newValue => {
      if (newValue.length > 0) {
        proxy.$nextTick(() => {
          proxy.$refs.dataTable.clearSelection();
          selectUserList.value.forEach(key => {
            proxy.$refs.dataTable.toggleRowSelection(userList.value.find(
                item => key === item.userId
            ), true)
          });
        });
      }
    }
);

/** 查询部门下拉树结构 */
function getDeptTree() {
  deptTreeSelect().then(response => {
    deptOptions.value = response.data;
  });
};

/** 查询用户列表 */
function getList() {
  loading.value = true;
  listUser(queryParams.value).then(res => {
    loading.value = false;
    userList.value = res.rows;
    total.value = res.total;
  });
};

/** 保存选中的数据id,row-key就是要指定一个key标识这一行的数据 */
function getRowKey (row) {
  return row.userId
}

/** 节点单击事件 */
function handleNodeClick(data) {
  queryParams.value.deptId = data.id;
  handleQuery();
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  queryParams.value.deptId = undefined;
  proxy.$refs.deptTreeRef.setCurrentKey(null);
  handleQuery();
}

/** 多选框选中数据 */
function handleMultipleUserSelect(selection) {
  emit('handleUserSelect', markRaw(selection));
}

/** 单选框选中数据 */
function handleSingleUserSelect(selection) {
  // 点击当前行时,radio同样有选中效果
  radioSelected.value = selection.userId;
  emit('handleUserSelect', markRaw(selection));
}

getDeptTree();
getList();
</script>

