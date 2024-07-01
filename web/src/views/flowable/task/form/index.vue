<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="表单名称" prop="formName">
        <el-input
            v-model="queryParams.formName"
            placeholder="请输入表单名称"
            clearable
            @keyup.enter="handleQuery"
			maxlength="32"
        />
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
            @click="handleAdd"
            v-hasPermi="['system:form:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="success"
            plain
            icon="Edit"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['system:form:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['system:form:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['system:form:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="formList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="表单主键" align="center" prop="formId" />
      <el-table-column label="表单名称" align="center" prop="formName" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="View" size="small" @click="handleDetail(scope.row)">详情</el-button>
          <el-button link type="primary" icon="Edit" size="small" @click="handleUpdate(scope.row)" v-hasPermi="['system:form:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" size="small" @click="handleDelete(scope.row)" v-hasPermi="['system:form:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
        v-show="total>0"
        :total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
    />

    <!-- 添加或修改流程单对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="表单名称" prop="formName">
          <el-input v-model="form.formName" placeholder="请输入表单名称" />
        </el-form-item>
        <el-form-item label="表单内容">
          <editor v-model="form.formContent" :min-height="192"/>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 表单详情 -->
    <el-dialog :title="formTitle" v-model="formRenderOpen" width="60%" append-to-body>
      <v-form-render :form-data="formData" ref="vFormRef"/>
    </el-dialog>

  </div>
</template>

<script setup name="Form">
import { listForm, getForm, delForm, addForm, updateForm } from "@/api/flowable/form";
import router from "@/router";

const route = useRoute();
const { proxy } = getCurrentInstance();

const formList = ref([]);
const open = ref(false);
const formRenderOpen = ref(false);
const formData = ref({});
const formTitle = ref("");
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const vFormRef = ref(null)


const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    formName: null,
    formContent: null,
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

watch(route, (newRoute) => {
    getList();
}, { immediate: true });

/** 查询流程单列表 */
function getList() {
  loading.value = true;
  listForm(queryParams.value).then(response => {
    formList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

// 表单重置
function reset() {
  form.value = {
    formId: null,
    formName: null,
    formContent: null,
    createTime: null,
    updateTime: null,
    createBy: null,
    updateBy: null,
    remark: null
  };
  proxy.resetForm("formRef");
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

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.formId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 表单配置信息 */
function handleDetail(row) {
  formRenderOpen.value = true;
  formTitle.value = "表单详情";
  proxy.$nextTick(() => {
    // 回显数据
    vFormRef.value.setFormJson(JSON.parse(row.formContent))
    proxy.$nextTick(() => {
      // 表单禁用
      vFormRef.value.disableForm();
    })
  })
}

/** 新增按钮操作 */
function handleAdd() {
  router.push({path: "/flowable/task/flowForm/index"});

}

/** 修改按钮操作 */
function handleUpdate(row) {
  router.push({ path: '/flowable/task/flowForm/index', query: {formId: row.formId }})
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["formRef"].validate(valid => {
    if (valid) {
      if (form.value.formId != null) {
        updateForm(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addForm(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _formIds = row.formId || ids.value;
  proxy.$modal.confirm('是否确认删除流程单编号为"' + _formIds + '"的数据项？').then(function() {
    return delForm(_formIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('flowable/form/export', {
    ...queryParams.value
  }, `form_${new Date().getTime()}.xlsx`)
}

getList();
</script>
