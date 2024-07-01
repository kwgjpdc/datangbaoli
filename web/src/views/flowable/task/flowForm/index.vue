<template>
  <div>
  <v-form-designer ref="vfDesigner" :designer-config="designerConfig">
    <!-- 保存按钮 -->
    <template #customSaveButton>
      <el-button type="text" @click="saveFormJson"><el-icon><Promotion /></el-icon>保存</el-button>
    </template>
  </v-form-designer>

  <!--系统表单信息-->
  <el-dialog :title="formTitle" v-model="formOpen" width="500px" append-to-body>
    <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="表单名称" prop="formName">
        <el-input v-model="form.formName" placeholder="请输入表单名称" maxlength="32" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="form.remark" placeholder="请输入备注" maxlength="255" />
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

<script setup name="FlowForm">
import {addForm, getForm, updateForm} from "@/api/flowable/form";
import { StrUtil } from '@/utils/StrUtil'

// 获取当前组件实例
const { proxy } = getCurrentInstance();
const formTitle = ref("");
let formOpen = ref(false);
const vfDesigner = ref(null)
const data = reactive({
  // 表单校验
  rules: {
    formName: [
      { required: true, message: "表单名称不能为空", trigger: "blur" }
    ]
  },
  // 表单参数
  form: {
    formId: null,
    formName: null,
    formContent: null,
    remark: null
  },
  designerConfig: {
    generateSFCButton: false,  //是否显示生成SFC按钮
    exportCodeButton: false,  //是否显示导出代码按钮
    toolbarMaxWidth: 350,   //设计器工具按钮栏最大宽度（单位像素）
    toolbarMinWidth: 300,  //设计器工具按钮栏最小宽度（单位像素）
    formHeader: false,
  },
});

const { form, rules , designerConfig} = toRefs(data);

onMounted(() => {
  const formId = proxy.$route.query && proxy.$route.query.formId;
  if (StrUtil.isNotBlank(formId)) {
    getForm(formId).then(res => {
      proxy.$nextTick(() => {
        // 加载表单json数据
        vfDesigner.value.setFormJson(JSON.parse(res.data.formContent))
      })
      form.value = res.data;
    })
  }else {
    proxy.$nextTick(() => {
      // 加载表单json数据
      vfDesigner.value.setFormJson({"widgetList":[],"formConfig":{"modelName":"formData","refName":"vForm","rulesName":"rules","labelWidth":80,"labelPosition":"left","size":"","labelAlign":"label-left-align","cssCode":"","customClass":"","functions":"","layoutType":"PC","onFormCreated":"","onFormMounted":"","onFormDataChange":"","onFormValidate":""}})
    })
  }
})

/** 保存表单数据 */
function saveFormJson() {
  let formJson = vfDesigner.value.getFormJson();
  form.value.formContent = JSON.stringify(formJson);
  formOpen.value = true;
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["formRef"].validate(valid => {
    if (valid) {
      if (form.value.formId != null) {
        updateForm(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          formOpen.value = false;
        });
      } else {
        addForm(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          formOpen.value = false;
        });
      }
      // 关闭当前标签页并返回上个页面
      const obj = { path: "/flowable/form", query: { t: Date.now()} };
      proxy.$tab.closeOpenPage(obj);
    }
  });
}

/** 取消按钮 */
function cancel() {
  formOpen.value = false;
  reset();
}

/** 表单重置 */
function reset() {
  form.value = {
    formId: null,
    formName: null,
    formContent: null,
    remark: null
  };
  proxy.resetForm("formRef");
}

</script>

<style lang="scss" scoped>
body {
  margin: 0;  /* 如果页面出现垂直滚动条，则加入此行CSS以消除之 */
}
.el-container.main-container{
  background: #fff;
  margin-left: 0 !important;
}

</style>
