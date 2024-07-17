<template>
   <div class="app-container">
      <el-form :model="queryParams" ref="queryRef" v-show="showSearch" :inline="true" label-width="68px">
         <el-form-item label="模板名称" prop="templetType">
            <el-input
               v-model="queryParams.templetType"
               placeholder="请输入模板名称"
               clearable
               style="width: 140px"
               @keyup.enter="handleQuery"
            />
         </el-form-item>
         <el-form-item label="模板类型" prop="templetName">
            <el-select v-model="queryParams.templetName" clearable filterable placeholder="请选择类型" style="width: 140px">
              <el-option v-for="item in templetTypeList" :key="item.value"
                  :label="item.label" :value="item.value"></el-option>
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
               @click="handleTemplet"
               v-hasPermi="['system:templet:add']"
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
      <el-table v-loading="loading" :data="templetList" @selection-change="handleSelectionChange">
         <el-table-column type="selection" width="55" align="center" />
         <el-table-column label="模板分类" align="center" prop="templetType" width="120" >
            <template #default="scope">
               <span>{{ parseType(scope.row.templetType) }}</span>
            </template>
         </el-table-column>
         <el-table-column label="模板名称" prop="templetName" width="150" />
         <el-table-column label="操作" align="center" class-name="small-padding"  width="120" >
            <template #default="scope">
              <el-tooltip content="修改" placement="top">
                <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:templet:edit']"></el-button>
              </el-tooltip>
              <el-tooltip content="设置属性" placement="top">
                <el-button link type="primary" icon="Setting" @click="handleDetail(scope.row)" v-hasPermi="['system:templet:detail']"></el-button>
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
            <el-form-item label="模板分类" prop="templetType">
                <el-select v-model="form.templetType" filterable placeholder="请选择"  :style="{ width: '100%' }">
                  <el-option v-for="item in templetTypeList" 
                      :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="模板名称" prop="templetName">
               <el-input v-model="form.templetName" placeholder="请输入模板名称" />
            </el-form-item>
            <el-form-item label="模板文件" prop="templetFile">
               <el-upload class="upload-demo" :action="uploadFileUrl" :headers="headers" :on-preview="handlePreview"
                 :on-remove="handleRemove" :before-remove="beforeRemove" :on-exceed="handleExceed"
                 :on-success="uploadSuccess" :show-file-list="false" ref="fileUpload">
                 <el-button type="primary" link >上传文件</el-button>
               </el-upload>
               <el-input v-model="form.templetPath" v-show="false" placeholder="文件名称冗余" />
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

      <!-- 添加或修改合同模板详细字段对话框 -->
      <el-dialog title="替换属性设置" v-model="tdetail" width="1000px" append-to-body >
        <el-table :data="tableList" height="500px" >
          <el-table-column label="属性名称" align="center">
            <template #default="scope">
              <el-input v-model="scope.row.attributeName" placeholder="请输入属性名称" />
            </template>
          </el-table-column>
          <el-table-column label="属性定义" align="center">
            <template #default="scope">
              <el-input v-model="scope.row.attributeEs" placeholder="请输入属性定义" />
            </template>
          </el-table-column>
          <el-table-column label="文档替换" align="center">
            <template #default="scope">
              <el-input v-model="scope.row.attributeTarget" placeholder="请输入文档替换" />
            </template>
          </el-table-column>
          <el-table-column label="属性类型" align="center" width="100px" >
            <template #default="scope">
              <el-select v-model="scope.row.attributeType" placeholder="请选择" :style="{ width: '100%' }">
                <el-option v-for="item in attrTypeList" 
                    :label="item.label" :value="item.value"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="无值时隐藏" align="center" width="100px" >
            <template #default="scope">
              <el-select v-model="scope.row.attributeSpecial" placeholder="请选择" :style="{ width: '100%' }">
                <el-option v-for="item in specialList" 
                    :label="item.label" :value="item.value"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <!--
          <el-table-column label="属性类型" align="center">
            <template #default="scope">
              <el-input v-model="scope.row.attributeType" placeholder="请输入属性类型" />
            </template>
          </el-table-column>
          <el-table-column label="时间转换" align="center">
            <template #default="scope">
              <el-input v-model="scope.row.timeRegular" placeholder="请输入时间转换" />
            </template>
          </el-table-column>
          <el-table-column label="金额转换" align="center">
            <template #default="scope">
              <el-input v-model="scope.row.moneyRegular" placeholder="请输入金额转换" />
            </template>
          </el-table-column>
          -->
        </el-table>
        <template #header>
          <div class="dialog-footer">
              <el-button type="primary" @click="addAline">添加属性</el-button>
          </div>
        </template>
        <template #footer>
          <div class="dialog-footer">
              <el-button type="primary" @click="submitDetail">确 定</el-button>
              <el-button @click="cancel">取 消</el-button>
          </div>
        </template>
      </el-dialog>
   </div>
</template>

<script setup name="agroup">
import { getToken } from "@/utils/auth";
import { listTemplet, addTemplet, updateTemplet, delTemplet, addTempletDetail, getTempletDetail } from "@/api/system/templet";

const { proxy } = getCurrentInstance();

const uploadFileUrl = ref(import.meta.env.VITE_APP_BASE_API + "/common/file/upload"); // 上传文件服务器地址
const headers = ref({ Authorization: getToken() });
function handlePreview(file) {
  console.log(file);
}
function handleRemove(file, fileList) {
  console.log(file, fileList);
}
function beforeRemove(file, fileList) {
  return this.$confirm(`确定移除 ${file.name}？`);
}
function handleExceed(files, fileList) {
  this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
}
function uploadSuccess(response, file, fileList) {
  console.log(response);
  // 表格添加上传的数据返回
  if (response.code === 200) {
    console.log("file.response.data",response.data)
    console.log("file.url.data",response.data.fileUrl)
    form.value.templetPath = response.data.fileUrl;
  } else {
    proxy.$modal.msgError(response.msg);
    proxy.$refs.fileUpload.handleRemove(file);
    console.log(fileList);
  }
}

const templetList = ref([]);
const open = ref(false);
const tdetail = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const templetId = ref("");
const tableList = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const dateRange = ref([]);
const menuRef = ref(null);

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    templetType: undefined,
    templetName: undefined,
    status: undefined
  },
  rules: {
    templetType: [{ required: true, message: "模板类型不能为空", trigger: "blur" }],
    templetName: [{ required: true, message: "模板名称不能为空", trigger: "blur" }],
  },
  templetTypeList: [
    {label:'项目尽调',value:'1'},
    {label:'合同附件',value:'2'},
    {label:'应收账款',value:'3'},
  ],
  specialList: [
    {label:'否',value:'0'},
    {label:'是',value:'1'},
  ],
  attrTypeList: [
    {label:'字符',value:'0'},
    {label:'时间',value:'1'},
    {label:'金额',value:'2'},
    {label:'循环',value:'3'},
  ],
  templetTypeMap: {'1':'项目尽调','2':'合同附件','3':'应收账款'},  
});

const { queryParams, form, rules, templetTypeList, attrTypeList, specialList, templetTypeMap } = toRefs(data);


function submitDetail(){
  console.log("idtempletIds.value",templetId.value)
  console.log("tableList.value",tableList.value)

  var data = {"templetId":templetId.value,"templetDetailList":tableList.value};
  addTempletDetail(data).then(response => {
    templetList.value = response.rows;
    total.value = response.total;
    loading.value = false;
    tdetail.value = false;
  });
  
}
function addAline(){
  tableList.value.push({});
}
function parseType(val){
  //console.log("a",val,data.templetTypeMap[val],data.templetTypeMap['1'])
  return data.templetTypeMap[val];
}
/** 查询模板列表 */
function getList() {
  loading.value = true;
  listTemplet(proxy.addDateRange(queryParams.value, dateRange.value)).then(response => {
    templetList.value = response.rows;
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
  form.value.templetId = row.templetId;
  form.value.templetType = row.templetType;
  form.value.templetName = row.templetName;
  form.value.templetPath = row.templetPath;
  form.value.remark = row.remark;
  title.value = "修改文件模板";
  open.value = true;
}
/** 设置模板属性替换详细 */
function handleDetail(row){
  templetId.value = row.templetId;
  
  getTempletDetail(row.templetId).then(response => {
    tableList.value = response.rows;
    loading.value = false;
  });
  
  tdetail.value = true;
}
/** 删除按钮操作 */
function handleDelete(row) {
  const templetIds = row.templetId || ids.value;
  proxy.$modal.confirm('是否确认删除数据项?').then(function () {
    return delTemplet(templetIds);
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
  ids.value = selection.map(item => item.templetId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}
/** 重置新增的表单以及其他数据  */
function reset() {
  if (menuRef.value != undefined) {
    menuRef.value.setCheckedKeys([]);
  }
  form.value = {
    templetType: undefined,
    templetName: undefined,
    remark: undefined
  };
  proxy.resetForm("templetRef");
}
/** 添加模板 */
function handleTemplet() {
  reset();
  open.value = true;
  title.value = "添加业务组";
}
/** 提交按钮 */
function submitForm() {
  proxy.$refs["templetRef"].validate(valid => {
    if (valid) {
      if (form.value.templetId != undefined) {
        updateTemplet(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addTemplet(form.value).then(response => {
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
  tdetail.value = false;
  reset();
}

getList();


</script>
