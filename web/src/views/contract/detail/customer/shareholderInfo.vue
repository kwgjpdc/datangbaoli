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
            :data="showInfoList"
            @selection-change="handleSelectionChange"
        >
            <!-- Checkbox -->
            <el-table-column type="selection" width="55" align="center" v-if="!isView" />
            <!-- 股东名称 -->
            <el-table-column label="股东名称" prop="shareholderName" align="center" />
            <!-- 入股币种 -->
            <el-table-column label="入股币种" prop="shareholderCurrencyType" align="center">
                <template #default="scope">
                    <dict-tag :options="cont_shareholder_currency_type" :value="scope.row.shareholderCurrencyType" />
                </template>
            </el-table-column>
            <!-- 出资额 -->
            <el-table-column label="出资额" prop="shareholderContribution" align="center" />
            <!-- 占比 -->
            <el-table-column label="占比 (%)" prop="shareholderPercentage" align="center" />
            <!-- 到位率 -->
            <el-table-column label="到位率 (%)" prop="shareholderContributionAvailable" align="center" />
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
            id="shareholder-info-pagination"
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
                        <el-form-item label="股东类型" prop="shareholderType">
                            <el-select
                                v-model="formData.shareholderType"
                                :placeholder="showPlaceholder('请选择')"
                                filterable
                                clearable
                                :style="formItemContentStyle"
                            >
                                <el-option
                                    v-for="item in cont_shareholder_type"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11" :offset="2">
                        <el-form-item label="名称" prop="shareholderName">
                            <el-input
                                v-model="formData.shareholderName"
								maxlength="32"
                                :placeholder="showPlaceholder('请输入名称')"
                                :style="formItemContentStyle"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="11">
                        <el-form-item label="与法人关系" prop="shareholderRelation">
                            <el-input
                                v-model="formData.shareholderRelation"
								maxlength="32"
                                :placeholder="showPlaceholder('请输入与法人关系')"
                                :style="formItemContentStyle"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="11" :offset="2">
                        <el-form-item label="证照/证件类型" prop="shareholderCardType">
                            <el-select
                                v-model="formData.shareholderCardType"
                                :placeholder="showPlaceholder('请选择')"
                                filterable
                                clearable
                                :style="formItemContentStyle"
                            >
                                <el-option
                                    v-for="item in cont_shareholder_card_type"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="11">
                        <el-form-item label="证照/证件号码" prop="shareholderCardNo">
                            <el-input
                                v-model="formData.shareholderCardNo"
                                :placeholder="showPlaceholder('请输入证照/证件号码')"
								oninput="value=value.replace(/[^0-9Xx]/g,'')"
								maxlength="32"
                                :style="formItemContentStyle"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="11" :offset="2">
                        <el-form-item label="入股币种" prop="shareholderCurrencyType">
                            <el-select
                                v-model="formData.shareholderCurrencyType"
                                :placeholder="showPlaceholder('请选择')"
                                filterable
                                clearable
                                :style="formItemContentStyle"
                            >
                                <el-option
                                    v-for="item in cont_shareholder_currency_type"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="11">
                        <el-form-item label="出资额 (元)" prop="shareholderContribution">
                            <el-input
                                v-model="formData.shareholderContribution"
                                oninput="value=value.replace(/[^0-9]/g,'')"
								maxlength="32"
                                :placeholder="showPlaceholder('请输入出资额')"
                                :style="formItemContentStyle"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="11" :offset="2">
                        <el-form-item label="占比 (%)" prop="shareholderPercentage">
                            <el-input
                                v-model="formData.shareholderPercentage"
                                oninput="value=value.replace(/[^0-9]/g,'')"
								maxlength="32"
                                :placeholder="showPlaceholder('请输入出资额')"
                                :style="formItemContentStyle"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="11">
                        <el-form-item label="出资方式" prop="shareholderContributionType">
                            <el-input
                                v-model="formData.shareholderContributionType"
								maxlength="32"
                                :placeholder="showPlaceholder('请输入出资额')"
                                :style="formItemContentStyle"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="11" :offset="2">
                        <el-form-item label="到位率 (%)" prop="shareholderContributionAvailable">
                            <el-input
                                v-model="formData.shareholderContributionAvailable"
                                oninput="value=value.replace(/[^0-9]/g,'')"
								maxlength="32"
                                :placeholder="showPlaceholder('请输入出资额')"
                                :style="formItemContentStyle"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="备注" prop="shareholderRemark">
                            <el-input
                                v-model="formData.shareholderRemark"
                                type="textarea"
								maxlength="255"
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

// 系统字典
const { 
    cont_shareholder_type,
    cont_shareholder_card_type, 
    cont_shareholder_currency_type 
} = proxy.useDict(
    "cont_shareholder_type",
    "cont_shareholder_card_type", 
    "cont_shareholder_currency_type"
);

// 表格数据集合
const infoList = reactive(props.data);

// 表格删除按钮状态
const deleteIsDisabled = ref(true);

// 表格选择数据集合
let tableSelection = reactive([]);

// Dialog表单对象
const elFormRef = ref(null);

// Dialog表单数据
const formData = ref({
    shareholderType: null,
    shareholderName: null,
    shareholderRelation: null,
    shareholderCardType: null,
    shareholderCardNo: null,
    shareholderCurrencyType: null,
    shareholderContribution: null,
    shareholderPercentage: null,
    shareholderContributionType: null,
    shareholderContributionAvailable: null,
    shareholderRemark: null
});

// 表单验证规则
const rules = ref({
    shareholderType: [
        { 
            required: true,
            message: "股东类型不能为空",
            trigger: "change" 
        }
    ],
    shareholderName: [
        { 
            required: true,
            pattern: '[^\x20]+',
            message: "名称不能为空",
            trigger: "change" 
        }
    ],
    shareholderCardType: [
        { 
            required: true,
            message: "证照/证件类型不能为空",
            trigger: "change" 
        }
    ],
    shareholderCurrencyType: [
        { 
            required: true,
            message: "入股币种不能为空",
            trigger: "change" 
        }
    ],
    shareholderContribution: [
        { 
            required: true,
            message: "入股币种不能为空",
            trigger: "change" 
        }
    ],
    shareholderPercentage: [
        { 
            required: true,
            message: "占比不能为空",
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
    dialogTitle.value = isView ? "查看客户股东信息" : "编辑客户股东信息";
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
        shareholderType: null,
        shareholderName: null,
        shareholderRelation: null,
        shareholderCardType: null,
        shareholderCardNo: null,
        shareholderCurrencyType: null,
        shareholderContribution: null,
        shareholderPercentage: null,
        shareholderContributionType: null,
        shareholderContributionAvailable: null,
        shareholderRemark: null
    };
    dialogStatus.type = "create";
    dialogTitle.value = "新增客户股东信息";
    dialogVisible.value = true;
};

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
#shareholder-info-pagination .el-pagination {
    position: relative;
}
</style>