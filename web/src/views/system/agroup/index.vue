<template>
   <div class="app-container">
      <el-form :model="queryParams" ref="queryRef" v-show="showSearch" :inline="true" label-width="68px">
         <el-form-item label="分组名称" prop="agroupName">
            <el-input
               v-model="queryParams.agroupName"
               placeholder="请输入分组名称"
               clearable
               style="width: 140px"
               @keyup.enter="handleQuery"
            />
         </el-form-item>
         <el-form-item label="主办名称" prop="mainUserId">
            <el-select v-model="queryParams.mainUserId" clearable filterable placeholder="请选择主办" style="width: 140px">
              <el-option v-for="item in roleUsers" :key="item.value"
                  :label="item.userName" :value="item.userId"></el-option>
            </el-select>
         </el-form-item>
         <el-form-item label="辅办名称" prop="minorUserId">
            <el-select v-model="queryParams.minorUserId" clearable filterable placeholder="请选择辅办" style="width: 140px">
              <el-option v-for="item in roleUsers" :key="item.value"
                  :label="item.userName" :value="item.userId"></el-option>
            </el-select>
         </el-form-item>
         <el-form-item label="区域名称" prop="agroupAreas">
            <el-select v-model="queryParams.agroupAreas" clearable filterable placeholder="请选择" :style="{ width: '100%' }">
                  <el-option v-for="item in pcaTextArr" :key="item.value"
                      :label="item.label" :value="item.value">
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
            <el-button
               type="primary"
               plain
               icon="Plus"
               @click="handleAgroup"
               v-hasPermi="['system:agroup:add']"
            >新增</el-button>
         </el-col>
         <!--
         <el-col :span="1.5">
            <el-button
               type="success"
               plain
               icon="Edit"
               :disabled="single"
               @click="handleUpdate"
               v-hasPermi="['system:role:edit']"
            >修改</el-button>
         </el-col>
         -->
         <el-col :span="1.5">
            <el-button
               type="danger"
               plain
               icon="Delete"
               :disabled="multiple"
               @click="handleDelete"
               v-hasPermi="['system:role:remove']"
            >删除</el-button>
         </el-col>
         <!--
         <el-col :span="1.5">
            <el-button
               type="warning"
               plain
               icon="Download"
               @click="handleExport"
               v-hasPermi="['system:role:export']"
            >导出</el-button>
         </el-col>
         -->
         <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <!-- 表格数据 -->
      <el-table v-loading="loading" :data="roleList" @selection-change="handleSelectionChange">
         <el-table-column type="selection" width="55" align="center" />
         <el-table-column label="分组名称" prop="agroupName" width="120" />
         <el-table-column label="主办人员" prop="mainUserName" :show-overflow-tooltip="true" width="150" />
         <el-table-column label="辅办人员" prop="minorUserName" :show-overflow-tooltip="true" width="150" />
         <el-table-column label="区域名称" prop="agroupAreas" :show-overflow-tooltip="true" class-name="fixed-width"  />
         <el-table-column label="操作" align="center" class-name="small-padding"  width="80" >
            <template #default="scope">
              <el-tooltip content="修改" placement="top">
                <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:agroup:edit']"></el-button>
              </el-tooltip>
              <el-tooltip content="删除" placement="top">
                <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['system:agroup:remove']"></el-button>
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

      <!-- 添加或修改业务组对话框 -->
      <el-dialog :title="title" v-model="open" width="500px" append-to-body>
         <el-form ref="agroupRef" :model="form" :rules="rules" label-width="100px">
            <el-form-item label="业务组名称" prop="agroupName">
               <el-input v-model="form.agroupName" placeholder="请输入业务组名称" />
            </el-form-item>
            <el-form-item label="主办人员" prop="mainUserId">
               <el-select v-model="form.mainUserId" filterable placeholder="请选择"  :style="{ width: '100%' }">
                  <el-option v-for="item in roleUsers" :key="item.value"
                      :label="item.userName" :value="item.userId"></el-option>
               </el-select>
               <el-input v-model="form.mainUserName" hidden placeholder="用户名称冗余" />
            </el-form-item>
            <el-form-item label="辅办人员" prop="minorUserId">
               <el-select v-model="form.minorUserId" filterable placeholder="请选择" :style="{ width: '100%' }">
                  <el-option v-for="item in roleUsers" :key="item.value"
                      :label="item.userName" :value="item.userId"></el-option>
               </el-select>
               <el-input v-model="form.minorUserName" hidden placeholder="用户名称冗余" />
            </el-form-item>
            
            <el-form-item label="区域名称" prop="areas" class="address-area">
              <el-select v-model="form.areas" multiple filterable placeholder="请选择" :style="{ width: '100%' }">
                  <el-option v-for="item in pcaTextArr" :key="item.value"
                      :label="item.label" :value="item.value">
                  </el-option>
               </el-select>
               <el-input v-model="form.agroupAreas" hidden placeholder="区域名称冗余" />
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
import { listAgroup, getAgroup, addAgroup, updateAgroup, delAgroup, getRoleUser } from "@/api/system/agroup";
import { pcaTextArr } from "element-china-area-data"

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
const dateRange = ref([]);
const menuRef = ref(null);

const personNoSame = (rule, value, callback) => {
  if (form.value.mainUserId == value) {
    callback(new Error("两主办辅办不能相同"));
  } else {
    callback();
  }
};

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    roleName: undefined,
    roleKey: undefined,
    status: undefined
  },
  rules: {
    agroupName: [{ required: true, message: "业务组名称不能为空", trigger: "blur" }],
    mainUserId: [{ required: true, message: "主办人员不能为空", trigger: "blur" }],
    minorUserId: [{ required: true, message: "辅办人员不能为空", trigger: "blur" },
                  { required: true, validator: personNoSame, trigger: "blur" }
    ],
    areas: [{ required: true, message: "区域名称不能为空", trigger: "blur" }]
  },
  roleUsers: [
    {userName:'',userId:''},
  ],
  roleUsersMap : {},
});

const { queryParams, form, rules, roleUsers, roleUsersMap } = toRefs(data);

/** 查询角色列表 */
function getList() {
  loading.value = true;
  listAgroup(proxy.addDateRange(queryParams.value, dateRange.value)).then(response => {
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
  dateRange.value = [];
  proxy.resetForm("queryRef");
  handleQuery();
}
/** 修改按钮操作 */
function handleUpdate(row){
  form.value.agroupId = row.agroupId;
  form.value.agroupName = row.agroupName;
  form.value.areas = row.agroupAreas.split(",");
  form.value.agroupAreas = row.agroupAreas;
  form.value.mainUserId = row.mainUserId;
  form.value.mainUserName = row.mainUserName;
  form.value.minorUserId = row.minorUserId;
  form.value.minorUserName = row.minorUserName;
  form.value.remark = row.remark;
  title.value = "修改业务组";
  open.value = true;
}
/** 删除按钮操作 */
function handleDelete(row) {
  const agroupIds = row.agroupId || ids.value;
  proxy.$modal.confirm('是否确认删除数据项?').then(function () {
    return delAgroup(agroupIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}
/** 导出按钮操作 */
function handleExport() {
  proxy.download("system/role/export", {
    ...queryParams.value,
  }, `role_${new Date().getTime()}.xlsx`);
}
/** 多选框选中数据 */
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.agroupId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}
/** 重置新增的表单以及其他数据  */
function reset() {
  if (menuRef.value != undefined) {
    menuRef.value.setCheckedKeys([]);
  }
  form.value = {
    agroupId: undefined,
    agroupName: undefined,
    areas: undefined,
    agroupAreas: undefined,
    mainUserId: undefined,
    mainUserName: undefined,
    minorUserId: undefined,
    minorUserName: undefined,
    remark: undefined
  };
  proxy.resetForm("agroupRef");
}
/** 添加角色 */
function handleAgroup() {
  reset();
  open.value = true;
  title.value = "添加业务组";
}
/** 提交按钮 */
function submitForm() {
  //console.log("data.roleUsersMap",data.roleUsersMap);
  //console.log("121:",form.value.mainUserId+":",data.roleUsersMap[form.value.mainUserId]);
  //console.log("232:",form.value.minorUserId+":",data.roleUsersMap[form.value.minorUserId]);
  //console.log("form.value.areas",form.value.areas)
  //form.value.agroupAreas = '';
  //form.value.areas.forEach(item => {
  //  form.value.agroupAreas=form.value.agroupAreas+item+","
  //});
  //console.log("form.value.agroupAreas",form.value.agroupAreas)
  proxy.$refs["agroupRef"].validate(valid => {
    if (valid) {
      form.value.mainUserName = data.roleUsersMap[form.value.mainUserId];
      form.value.minorUserName = data.roleUsersMap[form.value.minorUserId];
      form.value.agroupAreas = '';
      form.value.areas.forEach(item => {
        form.value.agroupAreas=form.value.agroupAreas+item+","
      });
      form.value.agroupAreas = form.value.agroupAreas.substring(0,form.value.agroupAreas.length-1);
      if (form.value.agroupId != undefined) {
        updateAgroup(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addAgroup(form.value).then(response => {
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

//初始化加载业务人员角色的用户
getRoleUser('业务人员').then(response => {
  data.roleUsers = response.rows;
  //console.log("response.rows",response.rows);
  response.rows.map(item=>(data.roleUsersMap[item.userId]=item.userName));
  //console.log("roleUsersMap",data.roleUsersMap)
});

//此处初始化处理业务组分中的区域仅到(一级)省份
for (let i = 0; i < pcaTextArr.length; i++) {
  delete pcaTextArr[i].children;
}
/*
console.log("pcaTextArr",pcaTextArr)
console.log("pcaTextArr.length",pcaTextArr.length)
console.log("pcaTextArr.c1",delete pcaTextArr[1].children)
console.log("pcaTextArr.c1",pcaTextArr[1])
console.log("pcaTextArr",pcaTextArr)
*/
</script>
