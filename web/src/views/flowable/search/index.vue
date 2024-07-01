<template>
    <div>
        <el-row :gutter="15" justify="center">
            <el-col :span="24" :xs="24">
                <el-form label-width="140px" :inline="true" :rules="rules" ref="elForm" :model="formData">
                    <el-collapse v-model="activeApprove" @change="handleChange">
                        <el-collapse-item title="审批信息" name="99">
                            <el-card class="box-card">
                                <el-form-item label="审批流程" prop="flowName">
                                    <template #default="scope">
                                        <el-input v-model="formData.flowName"
                                                  placeholder="请选择审批流程"
                                                  suffix-icon="el-icon-search"
                                                  readonly
                                                  @click="handleAdd"
                                                  :style="{ width: '240px' }"  ></el-input>
                                        <el-input v-model="formData.flowId" :style="{ width: '240px', display:'none' }"  ></el-input>
                                    </template>
                                </el-form-item>
                                <el-form-item label="评审会人员" prop="userIds" v-if="props.needUser">
                                    <el-input-tag v-model="checkValuesName" :value="checkValuesName" @click="handleAdd1"/>
                                    <el-input v-model="formData.userIds" :style="{ width: '240px', display:'none' }"  ></el-input>
                                </el-form-item>
                            </el-card>
                        </el-collapse-item>
                    </el-collapse>
                </el-form>
            </el-col>
        </el-row>
    </div>
    <!-- 发起流程 -->
    <el-dialog :title="title" v-model="open" width="60%" append-to-body>
        <el-form :model="queryProcessParams" ref="queryProcessForm" :inline="true" v-show="showSearch" label-width="68px">
            <el-form-item label="名称" prop="name">
                <el-input
                        v-model="queryProcessParams.name"
                        placeholder="请输入名称"
                        clearable
                        @keyup.enter="handleQuery"
                />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="Search" @click="handleProcessQuery">搜索</el-button>
                <el-button icon="Refresh" @click="resetProcessQuery">重置</el-button>
            </el-form-item>
        </el-form>
        <el-table v-loading="processLoading" fit :data="definitionList" border >
            <el-table-column label="流程名称" align="center" prop="name" />
            <el-table-column label="流程版本" align="center">
                <template #default="scope">
                    <el-tag size="small" >v{{ scope.row.version }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="流程分类" align="center" prop="category" />
            <el-table-column label="操作" align="center" width="300" class-name="small-padding fixed-width">
                <template #default="scope">
                    <el-button
                            size="small"
                            link type="primary"
                            icon="EditOutline"
                            @click="selectFlow(scope.row)"
                    >发起流程</el-button>
                </template>
            </el-table-column>
        </el-table>
        <pagination
                v-show="processTotal>0"
                :total="processTotal"
                v-model:page="queryProcessParams.pageNum"
                v-model:limit="queryProcessParams.pageSize"
                @pagination="getListDefinition"
        />
    </el-dialog>
    <!--选择流程接收人-->
    <el-dialog :title="taskTitle" v-model="taskOpen" width="65%" append-to-body>
        <flow-user v-if="checkSendUser" :checkType="checkType"  @handleUserSelect="userSelect"/>
        <flow-role v-if="checkSendRole" @handleRoleSelect="roleSelect"/>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="taskOpen = false">取 消</el-button>
            <el-button type="primary" @click="taskOpen = false">提 交</el-button>
          </span>
        </template>
    </el-dialog>
</template>
<script setup>
import { reactive, ref, watch } from "vue";
const { proxy } = getCurrentInstance();
import { listDefinition } from "@/api/flowable/definition";
import FlowUser from '@/components/flow/User';
import FlowRole from '@/components/flow/Role';
import ElInputTag from '@/components/flow/ElInputTag';
const props = defineProps({ needUser: Boolean });
const processLoading = ref(true);
const processTotal = ref(0);
// 显示搜索条件
const showSearch = ref(true);
// 弹出层标题
const title = ref("");
// 是否显示弹出层
const open = ref(false);
const src = ref("");
const definitionList = ref([]);
const taskTitle = ref(null);
const taskOpen = ref(false);
// 是否展示人员选择模块
const checkSendUser = ref(true);
// 是否展示角色选择模块
const checkSendRole = ref(false);
// 选择类型
const checkType = ref("multiple");
// 选中任务接收人员数据
const userIds = ref(null);
const checkValuesName = ref(null);
// 会签节点
const multiInstanceVars = ref('');
const activeApprove = ref(['99']);//tab打开状态
const flowName = ref("");
const flowId = ref("");
let formData = ref({
    userIds:"",
    flowId:""
});
// 表单对象
const data = reactive({
    // 查询参数
    queryProcessParams: {
        pageNum: 1,
        pageSize: 10,
        name: null,
        category: null,
        key: null,
        tenantId: null,
        deployTime: null,
        derivedFrom: null,
        derivedFromRoot: null,
        parentDeploymentId: null,
        engineVersion: null
    },
    selectData: {
        assignee: null,
        candidateUsers: null,
        candidateGroups: null,
        exp: null,
    },
    rules: {
        flowName: [
            { required: true, message: "审批流程不能为空", trigger: "change" }
        ],
        userIds: [
            { required: true, message: "评审会人员不能为空", trigger: "change" }
        ]
    },//验证规律
});
const { queryProcessParams, selectData, rules } = toRefs(data);
let routerQueryObj = ref({});
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
/** 提交流程 */
function submitTask() {
    if (!userIds.value && checkSendUser.value) {
        proxy.$modal.msgError("请选择任务接收!");
        return;
    }
    if (!userIds.value && checkSendRole.value) {
        proxy.$modal.msgError("请选择流程接收角色组!");
        return;
    }
    if (formData.value) {
        const param = {
            formJson: formJson.value,
        }
        // 复制对象的属性值给新的对象
        Object.assign(param, formData.value);
        if (multiInstanceVars.value) {
            Reflect.set(param, multiInstanceVars.value, userIds.value);
        } else {
            Reflect.set(param, "approval", userIds.value);
        }

    }
}
/** 用户信息选中数据 */
const userSelect = (selection) => {
    if (selection) {
        if (selection instanceof Array) {
            const selectVal = selection.map(item => item.userId);
            const nickName = selection.map(item => item.nickName);
            userIds.value = selectVal.join(',');
            formData.value.userIds = selectVal.join(',');
            checkValuesName.value = nickName.join(',');
        } else {
            userIds.value = selection.userId;
        }
    }else{
        userIds.value = '';
        checkValuesName.value = '';
    }
    console.log(userIds)
}

/** 角色信息选中数据 */
const roleSelect = (selection, name) => {
    if (selection) {
        if (selection instanceof Array) {
            const selectVal = selection.map(item => item.roleId);
            userIds.value = selectVal.join(',')
        } else {
            userIds.value = selection;
        }
    }
}
function getListDefinition(){
    listDefinition(queryProcessParams.value).then(response => {
        definitionList.value = response.data.records;
        processTotal.value = response.data.total;
        processLoading.value = false;
    });
}

/** 新增按钮操作 */
function handleAdd() {
    open.value = true;
    title.value = "发起流程";
    getListDefinition();
}
/** 新增按钮操作 */
function handleAdd1() {
    taskOpen.value = true;
    taskTitle.value = "选择任务接收";
}

/** 搜索按钮操作 */
function handleProcessQuery() {
    queryProcessParams.value.pageNum = 1;
    getListDefinition();
}

/** 重置按钮操作 */
function resetProcessQuery() {
    proxy.resetForm("queryProcessForm");
    handleProcessQuery();
}

function selectFlow(row){
    //console.log(row);
    formData.value.flowId = row.id;
    formData.value.flowName = row.name;
    open.value = false;
}

function validForm() {
    let result = false
    this.$refs['elForm'].validate((valid) => { console.log(valid); result = valid })
    return result
}

defineExpose({
    formData,
    validForm
});
</script>
<style lang="scss" scoped>
.el-input-tag{
    width:240px;
}
</style>
  