<template>
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
            :data="infoList"
            @selection-change="handleSelectionChange"
        >
            <!-- Checkbox -->
            <el-table-column type="selection" width="55" align="center" v-if="!isView" />
            <!-- 行政区划 -->
            <el-table-column label="行政区划" prop="residenceAdministrativeDivision" align="center" />
            <!-- 联系地址 -->
            <el-table-column label="联系地址" prop="residenceAddress" align="center" />
            <!-- 联系电话 -->
            <el-table-column label="联系电话" prop="residencePhone" align="center" />
            <!-- 邮政编码 -->
            <el-table-column label="邮政编码" prop="residencePostcode" align="center" />
            <!-- 操作 -->
            <el-table-column
                label="操作"
                align="center"
                class-name="small-padding fixed-width"
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
                        v-if="!isView"
                    ></el-button>
                </template>
            </el-table-column>
        </el-table>
        <pagination
            v-show="total > 0"
            :total="total"
            v-model:page="queryParams.pageNum"
            v-model:limit="queryParams.pageSize"
            id="business-info-pagination"
        />
        <!-- Dialog -->
        <el-dialog
            :title="dialogTitle"
            v-model="dialogVisible"
            width="800px"
            append-to-body
            @close="handleCloseDialog"
        >
            <el-form
                ref="elFormRef"
                :model="formData"
                :rules="isView ? {} : rules"
                label-width="110px"
                :disabled="isView"
            >
                <el-row>
                    <el-col :span="11">
                        <el-form-item label="行政划区" prop="residenceAdministrativeDivision">
                            <el-input
								maxlength="32"
                                v-model="formData.residenceAdministrativeDivision"
                                :placeholder="showPlaceholder('请输入行政划区')"
                                :style="formItemContentStyle"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="11" :offset="2">
                        <el-form-item label="邮政编码" prop="residencePostcode">
                            <el-input
                                v-model="formData.residencePostcode"
                                :placeholder="showPlaceholder('请输入邮政编码')"
                                :style="formItemContentStyle"
								maxlength="32"
								oninput="value=value.replace(/[^0-9]/g,'')"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="11">
                        <el-form-item label="联系电话" prop="residencePhone">
                            <el-input
                                v-model="formData.residencePhone"
                                :placeholder="showPlaceholder('请输入联系电话')"
                                :style="formItemContentStyle"
								maxlength="32"
								oninput="value=value.replace(/[^0-9]/g,'')"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="11" :offset="2">
                        <el-form-item label="联系地址" prop="residenceAddress">
                            <el-input
								maxlength="32"
                                v-model="formData.residenceAddress"
                                :placeholder="showPlaceholder('请输入联系地址')"
                                :style="formItemContentStyle"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="备注" prop="residenceRemark">
                            <el-input
								maxlength="255"
                                v-model="formData.residenceRemark"
                                type="textarea"
                                :placeholder="showPlaceholder('请输入内容')"
                                :style="formItemContentStyle"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="!isView">
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
    </el-card>
</template>

<script setup>
import { ref, reactive, computed, watch } from "vue";
import { deepClone } from "@/utils/index"

// 组件属性
const props = defineProps({
    data: {
        type: Array,
        default: []
    },
    routerQueryObj:{
        type: Object,
        default: {}
    }
});

// 组件事件
const emit = defineEmits(["update:data"]);

// vue实例对象
const { proxy } = getCurrentInstance();

// 表格数据集合
const infoList = reactive(props.data);

// 删除按钮状态
const deleteIsDisabled = ref(true);

// 表格选择数据集合
let tableSelection = reactive([]);

// Dialog表单对象
const elFormRef = ref(null);

// Dialog表单数据
const formData = ref({
    residenceAdministrativeDivision: null,
    residencePostcode: null,
    residencePhone: null,
    residenceAddress: null,
    residenceRemark: null
});

// 表单验证规则
const rules = ref({
    residenceAdministrativeDivision: [
        { 
            required: true,
            pattern: '[^\x20]+',
            message: "行政划区不能为空",
            trigger: "change" 
        }
    ]
});

// Dialog表格内容的统一宽度
const formItemContentStyle = { width: "100%" };

// Dialog标题
const dialogTitle = ref("");

// Dialog显示
const dialogVisible = ref(false);

// Dialog状态
const dialogStatus = reactive({
    type: "create", // create, edit
    row: undefined
});

// 分页配置
const queryParams = reactive({
    pageNum: 1,
    pageSize: 10
});

// 页面是View状态
const isView = computed(() => {
    let result = false;
    if (props.routerQueryObj.viewFlag === undefined || props.routerQueryObj.viewFlag === null) {
        result = false;
    } else {
        result = props.routerQueryObj.viewFlag;
    }
    return result;
});

// 分页数据总数
const total = computed(() => {
    return infoList.length;
});

// 显示数据集合
const showInfoList = computed(() => {
    const start = queryParams.pageSize * (queryParams.pageNum - 1);
    const end = queryParams.pageNum * queryParams.pageSize;
    return infoList.slice(start, end);
});

// 侦听数据集合变化
watch(infoList, (newValue) => {
    emit("update:data", newValue);
});

// 表格选择器触发事件
function handleSelectionChange(selection) {
    tableSelection = selection;
    deleteIsDisabled.value = !(selection.length > 0);
}

// 删除表格多条数据
function handleBatchDelete() {
    proxy.$modal.confirm('是否确认删除选择的数据项？').then(() => {
        tableSelection.forEach((data) => {
            const index = infoList.indexOf(data);
            if (index !== -1) {
                infoList.splice(index, 1);
            }
        });
    }).catch((e) => { 
        console.log(e) 
    });
}

// 删除表格一条数据
function handleDelete(data) {
    proxy.$modal.confirm('是否确认删除选择的数据项？').then(function () {
        const index = infoList.indexOf(data);
        if (index !== -1) {
            infoList.splice(index, 1);
        }
    }).catch((e) => { 
        console.log(e) 
    });
}

// 修改表格一条数据
function handleUpdate(data) {
    formData.value = deepClone(data);
    dialogStatus.type = "edit";
    dialogStatus.row = data;
    dialogTitle.value = isView ? "查看客户经营住所" : "编辑客户经营住所";
    dialogVisible.value = true;
}

// Dialog验证表单
async function validate(callback) {
    await elFormRef.value.validate((valid, fields) => {
        callback(valid, fields);
    });
}

// 打开Dialog
function openAddDialog() {
    formData.value = {
        residenceAdministrativeDivision: null,
        residencePostcode: null,
        residencePhone: null,
        residenceAddress: null,
        residenceRemark: null
    };
    dialogStatus.type = "create";
    dialogTitle.value = "新增客户经营住所";
    dialogVisible.value = true;
}

// 关闭Dialog
function handleCloseDialog() {
    elFormRef.value.resetFields();
    dialogVisible.value = false;
}

// 保存Dialog表单
function handleSave() {
    validate((valid) => {
        if (valid) {
            if (dialogStatus.type === "create") {
                infoList.unshift(deepClone(formData.value));
            } else if (dialogStatus.type === "edit") {
                const index = infoList.indexOf(dialogStatus.row);
                infoList.splice(index, 1, deepClone(formData.value));
            }
            dialogVisible.value = false;
        }
    });
}

// 显示placeholder占位字符
function showPlaceholder(txt) {
    return isView.value ? " " : txt;
}
</script>

<style lang="scss">
#business-info-pagination .el-pagination {
    position: relative;
}
</style>