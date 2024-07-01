<template>
  <el-form label-width="80px" status-icon>
    <el-form-item label="异步">
      <el-switch v-model="bpmnFormData.async" active-text="是" inactive-text="否" @change="updateElementTask('async')"/>
    </el-form-item>
    <el-form-item label="用户类型">
      <el-select v-model="bpmnFormData.userType" placeholder="选择人员" @change="updateUserType">
        <el-option
            v-for="item in userTypeOption"
            :key="item.value"
            :label="item.label"
            :value="item.value"
        />
      </el-select>
    </el-form-item>

    <el-form-item label="指定人员" v-if="bpmnFormData.userType === 'assignee'">
        <el-input-tag v-model="bpmnFormData.assignee" :value="bpmnFormData.assignee"/>
        <el-button-group class="ml-4" style="margin-top: 8px">
         <!--指定人员-->
          <el-tooltip class="box-item" effect="dark" content="指定人员" placement="bottom">
            <el-button type="primary" icon="User" @click="singleUserCheck"/>
          </el-tooltip>
         <!--选择表达式-->
          <el-tooltip class="box-item" effect="dark" content="选择表达式" placement="bottom">
            <el-button type="warning" icon="Postcard" @click="singleExpCheck"/>
          </el-tooltip>
        </el-button-group>
    </el-form-item>

    <el-form-item label="候选人员" v-else-if="bpmnFormData.userType === 'candidateUsers'">
      <el-input-tag v-model="bpmnFormData.candidateUsers" :value="bpmnFormData.candidateUsers"/>
      <el-button-group class="ml-4" style="margin-top: 8px">
        <!--候选人员-->
        <el-tooltip class="box-item" effect="dark" content="候选人员" placement="bottom">
          <el-button type="primary" icon="User" @click="multipleUserCheck"/>
        </el-tooltip>
        <!--选择表达式-->
        <el-tooltip class="box-item" effect="dark" content="选择表达式" placement="bottom">
          <el-button type="warning" icon="Postcard" @click="singleExpCheck"/>
        </el-tooltip>
      </el-button-group>
    </el-form-item>

    <el-form-item label="候选角色" v-else>
      <el-input-tag v-model="bpmnFormData.candidateGroups" :value="bpmnFormData.candidateGroups"/>
      <el-button-group class="ml-4" style="margin-top: 8px">
        <!--候选角色-->
        <el-tooltip class="box-item" effect="dark" content="候选角色" placement="bottom">
          <el-button type="primary" icon="User"  @click="multipleRoleCheck"/>
        </el-tooltip>
        <!--选择表达式-->
        <el-tooltip class="box-item" effect="dark" content="选择表达式" placement="bottom">
          <el-button type="warning" icon="Postcard" @click="singleExpCheck"/>
        </el-tooltip>
      </el-button-group>
    </el-form-item>

    <el-form-item label="优先级">
      <el-input v-model="bpmnFormData.priority" @change="updateElementTask('priority')"/>
    </el-form-item>
    <el-form-item label="到期时间">
      <el-input v-model="bpmnFormData.dueDate" @change="updateElementTask('dueDate')"/>
    </el-form-item>
  </el-form>

  <!--选择人员-->
  <el-dialog
      title="选择人员"
      v-model="userVisible"
      width="60%"
      :close-on-press-escape="false"
      :show-close="false"
  >
    <flow-user v-if="userVisible" :checkType="checkType" :selectValues="selectData.assignee || selectData.candidateUsers" @handleUserSelect="userSelect"></flow-user>
    <template #footer>
        <span class="dialog-footer">
          <el-button @click="userVisible = false">取 消</el-button>
          <el-button type="primary" @click="checkUserComplete">确 定</el-button>
        </span>
    </template>
  </el-dialog>

  <!--选择角色-->
  <el-dialog
      title="选择候选角色"
      v-model="roleVisible"
      width="60%"
      :close-on-press-escape="false"
      :show-close="false"
  >
    <flow-role v-if="roleVisible" :selectValues="selectData.candidateGroups" @handleRoleSelect="roleSelect"></flow-role>
    <template #footer>
        <span class="dialog-footer">
          <el-button @click="roleVisible = false">取 消</el-button>
          <el-button type="primary" @click="checkRoleComplete">确 定</el-button>
        </span>
    </template>
  </el-dialog>

  <!--选择表达式-->
  <el-dialog
      title="选择表达式"
      v-model="expVisible"
      width="60%"
      :close-on-press-escape="false"
      :show-close="false"
  >
    <flow-exp v-if="expVisible" :selectValues="selectData.exp" @handleSingleExpSelect="expSelect"></flow-exp>
    <template #footer>
        <span class="dialog-footer">
          <el-button @click="expVisible = false">取 消</el-button>
          <el-button type="primary" @click="checkExpComplete">确 定</el-button>
        </span>
    </template>
  </el-dialog>

</template>

<script setup name="TaskPanel">
import FlowUser from '@/components/flow/User'
import FlowRole from '@/components/flow/Role'
import FlowExp from '@/components/flow/Expression'
import ElInputTag from '@/components/flow/ElInputTag'
import {StrUtil} from '@/utils/StrUtil'
import useModelerStore from '@/store/modules/modeler'
const modelerStore = useModelerStore()

const {proxy} = getCurrentInstance();

const userVisible = ref(false);
const roleVisible = ref(false);
const expVisible = ref(false);
// 选类
const checkType = ref('single');
const userType = ref('');

const data = reactive({
  userTypeOption: [
    {label: '指定人员', value: 'assignee'},
    {label: '候选人员', value: 'candidateUsers'},
    {label: '候选角色', value: 'candidateGroups'}
  ],
  bpmnFormData: {
    userType: "",
    assignee: "",
    candidateUsers: "",
    candidateGroups: "",
    dueDate: "",
    priority: "",
    dataType: "",
    expId: "",
  },
  // 数据回显
  selectData: {
    assignee: null,
    candidateUsers: null,
    candidateGroups: null,
    exp: null,
  }
});

const {userTypeOption, bpmnFormData, selectData} = toRefs(data);

/** 组件传值  */
const props = defineProps({
  id: {
    type: String,
    required: true
  },
});

/** 传值监听 */
watch(() => props.id, newVal => {
      if (newVal) {
        resetTaskForm();
      }
    },
    {immediate: true}
)

// 初始化表单
function resetTaskForm() {
  // 初始化设为空值
  bpmnFormData.value = {
    userType: "",
    assignee: "",
    candidateUsers: "",
    candidateGroups: "",
    dueDate: "",
    priority: "",
    dataType: "",
    expId: "",
  }
  selectData.value = {
    assignee: null,
    candidateUsers: null,
    candidateGroups: null,
    exp: null,
  }
  // 流程节点信息上取值
  for (let key in bpmnFormData.value) {
    const value = modelerStore.getBpmnElement?.businessObject[key] || bpmnFormData.value[key];
    Reflect.set(bpmnFormData.value, key, value);
  }
  // 人员信息回显
  checkValuesEcho(bpmnFormData.value);
}

// 更新节点信息
function updateElementTask(key) {
  const taskAttr = Object.create(null);
  taskAttr[key] = bpmnFormData.value[key] || "";
  modelerStore.getModeling.updateProperties(modelerStore.getBpmnElement, taskAttr);
}

// 更新自定义流程节点/参数信息
function updateCustomElement(key, value) {
  const taskAttr = Object.create(null);
  taskAttr[key] = value;
  modelerStore.getModeling.updateProperties(modelerStore.getBpmnElement, taskAttr);
}

// 更新人员类型
function updateUserType(val) {
  // 删除xml中已选择数据类型节点
  deleteFlowAttar();
  delete modelerStore.getBpmnElement.businessObject[`userType`]
  // 清除已选人员数据
  bpmnFormData.value[val] = null;
  selectData.value = {
    assignee: null,
    candidateUsers: null,
    candidateGroups: null,
    exp: null,
  }
  // 写入userType节点信息到xml
  updateCustomElement('userType', val);
}

// 设计器右侧表单数据回显
function checkValuesEcho(formData) {
  if (StrUtil.isNotBlank(formData.expId)) {
      getExpList(formData.expId, formData.userType);
  } else {
    if ("candidateGroups" === formData.userType) {
      getRoleList(formData[formData.userType], formData.userType);
    } else {
      getUserList(formData[formData.userType], formData.userType);
    }
  }
}

// 获取表达式信息
function getExpList(val, key) {
  if (StrUtil.isNotBlank(val)) {
    bpmnFormData.value[key] = modelerStore.getExpList?.find(item => item.id.toString() === val).name;
    selectData.value.exp = modelerStore.getExpList?.find(item => item.id.toString() === val).id;
  }
}

// 获取人员信息
function getUserList(val, key) {
  if (StrUtil.isNotBlank(val)) {
    const newArr = modelerStore.getUserList?.filter(i => val.split(',').includes(i.userId.toString()))
    bpmnFormData.value[key] = newArr.map(item => item.nickName).join(',');
    if ('assignee' === key) {
      selectData.value[key] = newArr.find(item => item.userId.toString() === val).userId;
    } else {
      selectData.value[key] = newArr.map(item => item.userId);
    }
  }
}

// 获取角色信息
function getRoleList(val, key) {
  if (StrUtil.isNotBlank(val)) {
    const newArr = modelerStore.getRoleList?.filter(i => val.split(',').includes(i.roleId.toString()))
    bpmnFormData.value[key] = newArr.map(item => item.roleName).join(',');
    if ('assignee' === key) {
      selectData.value[key] = newArr.find(item => item.roleId.toString() === val).roleId;
    } else {
      selectData.value[key] = newArr.map(item => item.roleId);
    }
  }
}

// ------ 流程审批人员信息弹出框 start---------

/*单选人员*/
function singleUserCheck() {
  userVisible.value = true;
  checkType.value = "single";
}

/*多选人员*/
function multipleUserCheck() {
  userVisible.value = true;
  checkType.value = "multiple";
}

/*单选角色*/
function singleRoleCheck() {
  roleVisible.value = true;
  checkType.value = "single";
}

/*多选角色*/
function multipleRoleCheck() {
  roleVisible.value = true;
}

/*单选表达式*/
function singleExpCheck() {
  expVisible.value = true;
}

// 表达式选中数据
const expSelect = (selection) => {
  if (selection) {
    deleteFlowAttar();
    bpmnFormData.value[bpmnFormData.value.userType] = selection.name;
    updateCustomElement('dataType', selection.dataType);
    updateCustomElement('expId', selection.id.toString());
    updateCustomElement(bpmnFormData.value.userType, selection.expression);
    handleSelectData("exp", selection.id);
  }
}

// 用户选中数据 TODO: 后面更改为 点击确认按钮再赋值人员信息
const userSelect = (selection) => {
  if (selection) {
    deleteFlowAttar();
    updateCustomElement('dataType', 'fixed');
    if (selection instanceof Array) {
      const userIds = selection.map(item => item.userId);
      const nickName = selection.map(item => item.nickName);
      // userType = candidateUsers
      bpmnFormData.value[bpmnFormData.value.userType] = nickName.join(',');
      updateCustomElement(bpmnFormData.value.userType, userIds.join(','));
      handleSelectData(bpmnFormData.value.userType, userIds);
    } else {
      // userType = assignee
      bpmnFormData.value[bpmnFormData.value.userType] = selection.nickName;
      updateCustomElement(bpmnFormData.value.userType, selection.userId);
      handleSelectData(bpmnFormData.value.userType, selection.userId);
    }
  }
}

// 角色选中数据
const roleSelect = (selection, name) => {
  if (selection && name) {
    deleteFlowAttar();
    bpmnFormData.value[bpmnFormData.value.userType] = name;
    updateCustomElement('dataType','fixed');
    // userType = candidateGroups
    updateCustomElement(bpmnFormData.value.userType, selection);
    handleSelectData(bpmnFormData.value.userType, selection);
  }
}

// 处理人员回显
function handleSelectData(key, value) {
  for (let oldKey in selectData.value) {
    if (key !== oldKey){
      Reflect.set(selectData.value, oldKey, null);
    } else {
      Reflect.set(selectData.value, oldKey, value);
    }
  }
}

/*用户选中赋值*/
function checkUserComplete() {
  userVisible.value = false;
  checkType.value = "";
}

/*候选角色选中赋值*/
function checkRoleComplete() {
  roleVisible.value = false;
}

/*表达式选中赋值*/
function checkExpComplete() {
  expVisible.value = false;
}

// 删除节点
function deleteFlowAttar() {
  delete modelerStore.getBpmnElement.businessObject[`dataType`]
  delete modelerStore.getBpmnElement.businessObject[`expId`]
  delete modelerStore.getBpmnElement.businessObject[`assignee`]
  delete modelerStore.getBpmnElement.businessObject[`candidateUsers`]
  delete modelerStore.getBpmnElement.businessObject[`candidateGroups`]
}
// ------ 流程审批人员信息弹出框 end---------

</script>
