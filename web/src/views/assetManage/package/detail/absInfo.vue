<template>
    <el-card>
        <el-form
            ref="elFormRef"
            :model="formData"
            :rules="isView ? {} : rules"
            :inline="true"
            label-width="150px"
            :disabled = "isView"
        >
            <!-- 资产包编号 -->
            <el-form-item label="资产包编号" prop="absNo">
                <div class="form-item__block">
                    <el-input
                        v-model="formData.absNo"
                        :placeholder="showPlaceholder('系统自动生成')"
                        :style="formItemContentStyle"
                        disabled
                    />
                </div>
            </el-form-item>
            <!-- 资产包编号 -->
            <el-form-item label="资产包编号" prop="institutionName">
                <div class="form-item__block">
                    <el-input
                        v-model="formData.institutionName"
                        :placeholder="showPlaceholder('请输入资产包编号')"
						maxlength="32"
                        clearable
                        :style="formItemContentStyle"
                    />
                </div>
            </el-form-item>
            <!-- 融资方式 -->
            <el-form-item label="融资方式" prop="financingMethod">
                <div class="form-item__block">
                    <el-select
                        v-model="formData.financingMethod"
                        :placeholder="showPlaceholder('请选择')"
                        filterable
                        clearable
                        :style="formItemContentStyle"
                    >
                        <el-option
                            v-for="item in abs_financing_method"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </div>
            </el-form-item>
            <!-- 应收账款转让方式 -->
            <el-form-item label="应收账款转让方式" prop="debtTransferMethod">
                <div class="form-item__block">
                    <el-select
                        v-model="formData.debtTransferMethod"
                        :placeholder="showPlaceholder('请选择')"
                        filterable
                        clearable
                        :style="formItemContentStyle"
                    >
                        <el-option
                            v-for="item in abs_debt_transfer_method"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </div>
            </el-form-item>
            <!-- 资产包到期日 -->
            <el-form-item label="资产包到期日" prop="absEndDate">
                <div class="form-item__block">
                    <el-date-picker
                        v-model="formData.absEndDate"
                        type="date"
                        value-format="YYYY-MM-DD"
                        clearable
                        :placeholder="showPlaceholder('日期选择')"
                        :style="formItemContentStyle"
                    />
                </div>
            </el-form-item>
            <!-- 专项计划编号 -->
            <el-form-item label="专项计划编号" prop="specialPlanNo">
                <div class="form-item__block">
                    <el-input
                        v-model="formData.specialPlanNo"
                        :placeholder="showPlaceholder('请输入专项计划编号')"
						maxlength="32"
                        clearable
                        :style="formItemContentStyle"
                    />
                </div>
            </el-form-item>
            <!-- 专项计划 -->
            <el-form-item label="专项计划" prop="specialPlan">
                <div class="form-item__block">
                    <el-input
                        v-model="formData.specialPlan"
                        :placeholder="showPlaceholder('请输入专项计划')"
						maxlength="32"
                        clearable
                        :style="formItemContentStyle"
                    />
                </div>
            </el-form-item>
            <!-- 计划管理人名称 -->
            <el-form-item label="计划管理人名称" prop="planManager">
                <div class="form-item__block">
                    <el-input
                        v-model="formData.planManager"
                        :placeholder="showPlaceholder('请输入计划管理人名称')"
						maxlength="32"
                        clearable
                        :style="formItemContentStyle"
                    />
                </div>
            </el-form-item>
            <!-- 户名 -->
            <el-form-item label="户名" prop="accountName">
                <div class="form-item__block">
                    <el-input
                        v-model="formData.accountName"
                        :placeholder="showPlaceholder('请输入户名')"
						maxlength="32"
                        clearable
                        :style="formItemContentStyle"
                    />
                </div>
            </el-form-item>
            <!-- 账号 -->
            <el-form-item label="账号" prop="accountCode">
                <div class="form-item__block">
                    <el-input
                        v-model="formData.accountCode"
                        :placeholder="showPlaceholder('请输入账号')"
						maxlength="32"
						oninput="value=value.replace(/[^0-9]/g,'')"
                        clearable
                        :style="formItemContentStyle"
                    />
                </div>
            </el-form-item>
            <!-- 开户行 -->
            <el-form-item label="开户行" prop="accountBank">
                <div class="form-item__block">
                    <el-input
                        v-model="formData.accountBank"
                        :placeholder="showPlaceholder('请输入开户行')"
						maxlength="32"
                        clearable
                        :style="formItemContentStyle"
                    />
                </div>
            </el-form-item>
        </el-form>
    </el-card>
</template>

<script setup>
import { ref, reactive, watch, computed } from "vue";

// 组件属性
const props = defineProps({
    data: {
        type: Object,
        default: {}
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

// 表单对象
const elFormRef = ref(null);

// 表单数据
const formData = reactive(props.data);

// 表单验证规则
const rules = ref({
    institutionName: [
        { 
            required: true,
            pattern: '[^\x20]+',
            message: "金融机构名称不能为空",
            trigger: "change" 
        }
    ],
    financingMethod: [
        { 
            required: true,
            message: "融资方式不能为空",
            trigger: "change" 
        }
    ],
    debtTransferMethod: [
        { 
            required: true,
            message: "应收账款转让方式不能为空",
            trigger: "change" 
        }
    ],
    absEndDate: [
        { 
            required: true,
            message: "资产包到期日不能为空",
            trigger: "change" 
        }
    ],
    specialPlanNo: [
        { 
            required: true,
            pattern: '[^\x20]+',
            message: "专项计划编号不能为空",
            trigger: "change" 
        }
    ],
    specialPlan: [
        { 
            required: true,
            pattern: '[^\x20]+',
            message: "专项计划不能为空",
            trigger: "change" 
        }
    ],
    planManager: [
        {
            required: true,
            pattern: '[^\x20]+',
            message: "计划管理人名称不能为空",
            trigger: "change" 
        }
    ],
    accountName: [
        { 
            required: true,
            pattern: '[^\x20]+',
            message: "户名不能为空",
            trigger: "change" 
        }
    ],
    accountCode: [
        { 
            required: true,
            pattern: '[^\x20]+',
            message: "账号不能为空",
            trigger: "change" 
        }
    ],
    accountBank: [
        { 
            required: true,
            pattern: '[^\x20]+',
            message: "开户行不能为空",
            trigger: "change" 
        }
    ]
});

// Form item 内容的统一宽度
const formItemContentStyle = { width: "100%" };

// 显示placeholder占位字符
function showPlaceholder(txt) {
    return isView.value ? " " : txt;
}

// 系统字典
const { 
    abs_financing_method, 
    abs_debt_transfer_method 
} = proxy.useDict(
    "abs_financing_method", 
    "abs_debt_transfer_method"
);

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

// 侦听表单数据变化
watch(formData, (newValue) => {
    emit("update:data", newValue);
});

// 表单验证方法
async function validate(callback) {
    await elFormRef.value.validate((valid, fields) => {
        callback(valid, fields);
    });
}

// 父组件可以调用的方法
defineExpose({
    validate
});
</script>

<style lang="scss" scoped>
.form-item__block {
    width: 240px;
}

.form-item__placeholder {
    width: 390px;
    height: 30px;
}
</style>