<template>
    <div>
        <el-card>
            <!-- 操控区 -->
            <template #header v-if="!isView">
                <!-- 新增按钮 -->
                <el-button
                    style="float: right; padding: 3px 0"
                    type="primary"
                    link
                    @click="openAddDialog()"
                >
                    新增
                </el-button>
                <!-- 删除按钮 -->
                <el-button
                    style="float: right; padding: 3px 0; margin-right: 20px"
                    type="primary"
                    link
                    @click="handleBatchDelete()"
                    :disabled="deleteIsDisabled"
                >
                    删除
                </el-button>
            </template>
            <!-- 表格 -->
            <el-table
                :data="interestList"
                @selection-change="handleSelectionChange"
            >
                <!-- Checkbox -->
                <el-table-column type="selection" width="55" align="center" v-if="!isView" />
                <!-- 执行方 -->
                <el-table-column label="执行方" align="center" prop="customerId">
                    <template #default="scope">
                        {{ getCustomerName(scope.row.customerId) }}
                    </template>
                </el-table-column>
                <!-- 执行区间 -->
                <el-table-column label="执行区间" align="center" prop="interestExecSection">
                    <template #default="scope">
                        <dict-tag
                            :options="cont_interest_exec_section"
                            :value="scope.row.interestExecSection"
                        />
                    </template>
                </el-table-column>
                <!-- 利率类型 -->
                <el-table-column label="利率类型" align="center" prop="interestType">
                    <template #default="scope">
                        <dict-tag
                            :options="cont_interest_type"
                            :value="scope.row.interestType"
                        />
                    </template>
                </el-table-column>
                <!-- 固定利率 -->
                <el-table-column label="固定利率" align="center" prop="interestSolidRate" />
                <!-- 利率种类 -->
                <el-table-column label="利率种类" align="center" prop="interestFloatingType">
                    <template #default="scope">
                        <dict-tag
                            :options="cont_interest_floating_type"
                            :value="scope.row.interestFloatingType"
                        />
                    </template>
                </el-table-column>
                <!-- 基准利率 -->
                <el-table-column label="基准利率" align="center" prop="interestBaseRate" />
                <!-- 变动/锁定标志 -->
                <el-table-column label="变动/锁定标志" align="center" prop="interestFloatingLock">
                    <template #default="scope">
                        <dict-tag
                            :options="cont_interest_floating_lock"
                            :value="scope.row.interestFloatingLock"
                        />
                    </template>
                </el-table-column>
                <!-- 利率周期 -->
                <el-table-column label="利率周期" align="center" prop="interestCycle">
                    <template #default="scope">
                        <dict-tag
                            :options="cont_interest_cycle"
                            :value="scope.row.interestCycle"
                        />
                    </template>
                </el-table-column>
                <!-- 加减码 -->
                <el-table-column label="加减码" align="center" prop="interestPlusMinus">
                    <template #default="scope">
                        <dict-tag
                            :options="cont_plus_minus"
                            :value="scope.row.interestPlusMinus"
                        />
                    </template>
                </el-table-column>
                <!-- 加减码浮动方式 -->
                <el-table-column label="加减码浮动方式" align="center" prop="interestPlusMinusFloating">
                    <template #default="scope">
                        <dict-tag
                            :options="cont_plus_minus_floating"
                            :value="scope.row.interestPlusMinusFloating"
                        />
                    </template>
                </el-table-column>
                <!-- 执行利率 -->
                <el-table-column label="执行利率" align="center" prop="interestExecRate" />
                <!-- 操作 -->
                <el-table-column
                    label="操作"
                    align="center"
                    class-name="small-padding fixed-width"
                    v-if="!isView"
                >
                    <template #default="scope">
                        <el-button
                            link
                            type="primary"
                            icon="Edit"
                            @click="handleUpdate(scope.row)"
                            title="修改"
                        ></el-button>
                        <el-button
                            link
                            type="primary"
                            icon="Delete"
                            @click="handleDelete(scope.row)"
                            title="删除"
                        ></el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <!-- 添加或修改用户配置对话框 -->
        <el-dialog
            :title="dialogTitle"
            v-model="dialogVisible"
            width="800px"
            append-to-body
            @close="handleCloseDialog"
        >
            <el-form
                ref="elFormRef"
                label-width="110px"
                :model="formData"
                :rules="rules"
            >
                <el-row>
                    <!-- 利率执行方 -->
                    <el-col :span="12">
                        <el-form-item label="利率执行方" prop="customerId">
                            <div class="form-item__block">
                                <el-select
                                    v-model="formData.customerId"
                                    filterable
                                    placeholder="请选择"
                                    :style="formItemContentStyle"
                                >
                                    <el-option
                                        v-for="item in customerList"
                                        :key="item.customerId"
                                        :label="item.customerName"
                                        :value="item.customerId"
                                    />
                                </el-select>
                            </div>
                        </el-form-item>
                    </el-col>
                    <!-- 利率执行区间 -->
                    <el-col :span="12">
                        <el-form-item
                            label="利率执行区间"
                            prop="interestExecSection"
                        >
                            <div class="form-item__block">
                                <el-select
                                    v-model="formData.interestExecSection"
                                    filterable
                                    placeholder="请选择"
                                    :style="formItemContentStyle"
                                >
                                    <el-option
                                        v-for="item in cont_interest_exec_section"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                    />
                                </el-select>
                            </div>
                        </el-form-item>
                    </el-col>
                    <!-- 利率类型 -->
                    <el-col :span="24">
                        <el-form-item label="利率类型" prop="interestType">
                            <div class="form-item__block">
                                <el-radio-group
                                    v-model="formData.interestType"
                                    :style="formItemContentStyle"
                                    @change="handleInterestTypeChange"
                                >
                                    <el-radio
                                        v-for="item in cont_interest_type"
                                        :key="item.value"
                                        :label="item.value"
                                    >
                                        {{ item.label }}
                                    </el-radio>
                                </el-radio-group>
                            </div>
                        </el-form-item>
                    </el-col>
                    <template v-if="formData.interestType === '1'">
                        <!-- 固定利率 -->
                        <el-col :span="12">
                            <el-form-item label="固定利率" prop="interestSolidRate">
                                <div class="form-item__block">
                                    <el-input
										maxlength="32"
                                        v-model="formData.interestSolidRate"
                                        clearable
                                        oninput="value=value.replace(/[^0-9]/g,'')"
                                        :style="formItemContentStyle"
										@input="handleInput($event,'interestSolidRate')"
                                    >
                                        <template #suffix>
                                            <span> % </span>
                                        </template>
                                    </el-input>
                                </div>
                            </el-form-item>
                        </el-col>
                        <!-- 利率周期 -->
                        <el-col :span="12">
                            <el-form-item label="利率周期" prop="interestCycle">
                                <div class="form-item__block">
                                    <el-select
                                        v-model="formData.interestCycle"
                                        filterable
                                        placeholder="请选择"
                                        :style="formItemContentStyle"
                                    >
                                        <el-option
                                            v-for="item in cont_interest_cycle"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value"
                                        />
                                    </el-select>
                                </div>
                            </el-form-item>
                        </el-col>
                    </template>
                    <template v-if="formData.interestType === '2'">
                        <!-- 利率种类 -->
                        <el-col :span="12">
                            <el-form-item label="利率种类" prop="interestFloatingType">
                                <div class="form-item__block">
                                    <el-select
                                        v-model="formData.interestFloatingType"
                                        filterable
                                        placeholder="请选择"
                                        :style="formItemContentStyle"
                                    >
                                        <el-option
                                            v-for="item in cont_interest_floating_type"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value"
                                        />
                                    </el-select>
                                </div>
                            </el-form-item>
                        </el-col>
                        <!-- 基准利率 -->
                        <el-col :span="12">
                            <el-form-item label="基准利率" prop="interestBaseRate">
                                <div class="form-item__block">
                                    <el-input
										maxlength="32"
                                        v-model="formData.interestBaseRate"
                                        clearable
                                        oninput="value=value.replace(/[^0-9]/g,'')"
                                        :style="formItemContentStyle"
										@input="handleInput($event,'interestBaseRate')"
                                    >
                                        <template #suffix>
                                            <span> % </span>
                                        </template>
                                    </el-input>
                                </div>
                            </el-form-item>
                        </el-col>
                        <!-- 变动/锁定标志 -->
                        <el-col :span="24">
                            <el-form-item label="变动/锁定标志" prop="interestFloatingLock">
                                <div class="form-item__block">
                                    <el-radio-group
                                        v-model="formData.interestFloatingLock"
                                        :style="formItemContentStyle"
                                    >
                                        <el-radio
                                            v-for="item in cont_interest_floating_lock"
                                            :key="item.value"
                                            :label="item.value"
                                        >
                                            {{ item.label }}
                                        </el-radio>
                                    </el-radio-group>
                                </div>
                            </el-form-item>
                        </el-col>
                    </template>
                    <!-- 是否加减码 -->
                    <el-col :span="24">
                        <el-form-item label="是否加减码" prop="interestIfPlusMinus">
                            <div class="form-item__block">
                                <el-radio-group
                                    v-model="formData.interestIfPlusMinus"
                                    :style="formItemContentStyle"
                                    @change="handleInterestIfPlusMinusChange"
                                >
                                    <el-radio
                                        v-for="item in cont_if_plus_minus"
                                        :key="item.value"
                                        :label="item.value"
                                    >
                                        {{ item.label }}
                                    </el-radio>
                                </el-radio-group>
                            </div>
                        </el-form-item>
                    </el-col>
                    <template v-if="formData.interestIfPlusMinus === '1'">
                        <el-col :span="12">
                            <el-form-item label="" prop="interestPlusMinus">
                                <div class="form-item__block">
                                    <el-radio-group
                                        v-model="formData.interestPlusMinus"
                                        :style="formItemContentStyle"
                                    >
                                        <el-radio
                                            v-for="item in cont_plus_minus"
                                            :key="item.value"
                                            :label="item.value"
                                        >
                                            {{ item.label }}
                                        </el-radio>
                                    </el-radio-group>
                                </div>
                            </el-form-item>
                        </el-col>
                        <!-- 加减码浮动方式 -->
                        <el-col :span="12">
                            <el-form-item label="加减码浮动方式" prop="interestPlusMinusFloating">
                                <div class="form-item__block">
                                    <el-radio-group
                                        v-model="formData.interestPlusMinusFloating"
                                        :style="formItemContentStyle"
                                    >
                                        <el-radio
                                            v-for="item in cont_plus_minus_floating"
                                            :key="item.value"
                                            :label="item.value"
                                        >
                                            {{ item.label }}
                                        </el-radio>
                                    </el-radio-group>
                                </div>
                            </el-form-item>
                        </el-col>
                        <!-- 加减码 -->
                        <el-col :span="24">
                            <el-form-item label="加减码" prop="interestPlusMinusRate">
                                <div class="form-item__block">
                                    <el-input
										maxlength="32"
                                        v-model="formData.interestPlusMinusRate"
                                        clearable
                                        oninput="value=value.replace(/[^0-9]/g,'')"
                                        :style="formItemContentStyle"
										@input="handleInput($event,'interestPlusMinusRate')"
                                    >
                                        <template #suffix>
                                            <span> % </span>
                                        </template>
                                    </el-input>
                                </div>
                            </el-form-item>
                        </el-col>
                    </template>
                    <!-- 执行利率 -->
                    <el-col :span="24">
                        <el-form-item label="执行利率" prop="interestExecRate">
                            <div class="form-item__block">
                                <el-input
									maxlength="32"
                                    v-model="formData.interestExecRate"
                                    clearable
                                    oninput="value=value.replace(/[^0-9]/g,'')"
                                    :style="formItemContentStyle"
									@input="handleInput($event,'interestExecRate')"
                                >
                                    <template #suffix>
                                        <span> % </span>
                                    </template>
                                </el-input>
                            </div>
                        </el-form-item>
                    </el-col>
                    <!-- 操作 -->
                    <el-col :span="24">
                        <el-form-item>
                            <el-button type="primary" @click="handleSave">
                                保存
                            </el-button>
                            <el-button type="primary" @click="handleCloseDialog">
                                取消
                            </el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onBeforeMount } from "vue";
import { deepClone } from "@/utils/index";
import { listInfo as getUserList } from "@/api/customer/index";

// 组件属性
const props = defineProps({
    data: {
        type: Array,
        default: []
    },
    routerQueryObj:{
        type: Object
    },
    loading: {
        type: Boolean,
        default: false
    }
});

// 组件事件
const emit = defineEmits(["update:data", "update:loading"]);

// vue实例对象
const { proxy } = getCurrentInstance();

// 利率集合
const interestList = reactive(props.data);

// 显示loading
const loading = ref(props.loading);

// Form item 内容的统一宽度
const formItemContentStyle = { width: "100%" };

// 系统字典
const { 
    cont_interest_exec_section, 
    cont_interest_type, 
    cont_interest_cycle, 
    cont_interest_floating_type, 
    cont_interest_floating_lock, 
    cont_if_plus_minus, 
    cont_plus_minus,
    cont_plus_minus_floating 
} = proxy.useDict(
    "cont_interest_exec_section", 
    "cont_interest_type", 
    "cont_interest_cycle", 
    "cont_interest_floating_type", 
    "cont_interest_floating_lock", 
    "cont_if_plus_minus", 
    "cont_plus_minus",
    "cont_plus_minus_floating"
);

// 表格删除按钮状态
const deleteIsDisabled = ref(true);

// 表格选中行集合
let tableSelection = reactive([]);

// Dialog显示
const dialogVisible = ref(false);

// Dialog标题
const dialogTitle = ref("");

// Dialog 状态
const dialogStatus = reactive({
    type: "create", // create, edit
    row: undefined
});

// Dialog表单对象
const elFormRef = ref(null);

// Dialog中的表单
const formData = ref({});

// Dialog表单验证规则
const rules = ref({
    customerId: [
        { 
            required: true,
            message: "利率执行方不能为空",
            trigger: "change" 
        }
    ],
    interestCycle: [
        { 
            required: true,
            message: "利率周期不能为空",
            trigger: "change" 
        }
    ],
    interestPlusMinusRate: [
        { 
            required: true,
            message: "加减码不能为空",
            trigger: "change" 
        }
    ]
});

// 执行方列表
const customerList = ref([]);

// 页面 view 状态
const isView = computed(() => {
    let result = false;
    if (props.routerQueryObj && props.routerQueryObj.viewFlag) {
        result = true;
    }
    return result;
});

// 侦听数据变化
watch(interestList, (newValue) => {
    emit("update:data", newValue);
});

// 侦听loading变化
watch(loading, (newValue) => {
    emit("update:loading", newValue);
});

// 表格选择器触发事件
function handleSelectionChange(selection) {
    tableSelection = selection;
    deleteIsDisabled.value = !(selection.length > 0);
}

// 获取对应执行方名
function getCustomerName(customerId) {
    let customerName = "";
    for (const item of customerList.value) {
        if (customerId === item.customerId) {
            customerName = item.customerName;
            break;
        }
    }
    return customerName;
}


// 表格删除多条数据
function handleBatchDelete() {
    proxy.$modal.confirm('是否确认删除选择的数据项？').then(() => {
        tableSelection.forEach((data) => {
            const index = interestList.indexOf(data);
            if (index !== -1) {
                interestList.splice(index, 1);
            }
        });
    }).catch((e) => { 
        console.log(e);
    });
}

// 表格删除一条数据
function handleDelete(data) {
    proxy.$modal.confirm('是否确认删除选择的数据项？').then(function () {
        const index = interestList.indexOf(data);
        if (index !== -1) {
            interestList.splice(index, 1);
        }
    }).catch((e) => { 
        console.log(e);
    });
}

// 表格修改一条数据
function handleUpdate(data) {
    formData.value = deepClone(data);
    dialogStatus.type = "edit";
    dialogStatus.row = data;
    dialogTitle.value = "编辑利率信息";
    dialogVisible.value = true;
}

// 打开表单
function openAddDialog() {
    formData.value = {
        contractInterestId: null,
        contractId: null,
        customerId: null,
        interestExecSection: null,
        interestType: "1",
        interestSolidRate: null,
        interestCycle: "1",
        interestFloatingType: null,
        interestBaseRate: null,
        interestFloatingLock: null,
        interestIfPlusMinus: "2",
        interestPlusMinus: null,
        interestPlusMinusFloating: null,
        interestPlusMinusRate: null,
        interestExecRate: null
    };
    dialogStatus.type = "create";
    dialogTitle.value = "新增利率信息";
    dialogVisible.value = true;
}

// 关闭Dialog表单
function handleCloseDialog() {
    elFormRef.value.resetFields();
    dialogVisible.value = false;
}

// Dialog验证表单
async function validate(callback) {
    await elFormRef.value.validate((valid, fields) => {
        callback(valid, fields);
    });
}

// 保存Dialog表单
function handleSave() {
    validate((valid) => {
        if (valid) {
            if (dialogStatus.type === "create") {
                interestList.push(deepClone(formData.value));
            } else if (dialogStatus.type === "edit") {
                const index = interestList.indexOf(dialogStatus.row);
                interestList.splice(index, 1, deepClone(formData.value));
            }
            dialogVisible.value = false;
        }
    });
}

// 利率类型改变方法
function handleInterestTypeChange() {
    formData.value.interestSolidRate = null;
    formData.value.interestCycle = null;
    formData.value.interestFloatingType = null;
    formData.value.interestBaseRate = null;
    formData.value.interestFloatingLock = null;
}

// 是否加减码改变方法
function handleInterestIfPlusMinusChange() {
    formData.value.interestPlusMinus = null;
    formData.value.interestPlusMinusFloating = null;
    formData.value.interestPlusMinusRate = null;
}

// 监听input:number的字段长度问题
function handleInput(value,name,len = 32){
	// 如果输入长度超过5，截取前5位
	if (value.length > len) {
		formData.value[name] = value.slice(0, len);
	}
}

// 在页面挂载前
onBeforeMount(() => {
    getUserList().then(response => {
        customerList.value = response.rows;
    });
});
</script>

<style lang="scss" scoped>
.form-item__block {
    width: 240px;
}
</style>
