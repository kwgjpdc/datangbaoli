<template>
    <el-card>
        <el-form
            ref="elFormRef"
            :model="formData"
            :rules="isView ? {} : rules"
            :inline="true"
            label-width="150px"
            :disabled="isView"
        >
            <!-- 账户种类 -->
            <el-form-item label="账户种类" prop="accountType">
                <div class="form-item__block">
                    <el-select
                        v-model="formData.accountType"
                        :placeholder="showPlaceholder('请选择')"
                        filterable
                        :style="formItemContentStyle"
                    >
                        <el-option
                            v-for="item in cont_account_type"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </div>
            </el-form-item>
            <!-- 户名 -->
            <el-form-item label="户名" prop="accountName">
                <div class="form-item__block">
                    <el-input
                        v-model="formData.accountName"
                        :placeholder="showPlaceholder('请输入户名')"
                        clearable
                        :style="formItemContentStyle"
						maxlength="32"
                    />
                </div>
            </el-form-item>
            <!-- 客户名称 -->
            <el-form-item label="客户名称" prop="accountCustomerName">
                <div class="form-item__block">
                    <el-input
                        v-model="formData.accountCustomerName"
                        :placeholder="showPlaceholder('请输入客户名称')"
                        clearable
                        :style="formItemContentStyle"
						maxlength="32"
                    />
                </div>
            </el-form-item>
            <!-- 债务人名称 -->
            <el-form-item label="债务人名称" prop="accountDebtorName">
                <div class="form-item__block">
                    <el-input
                        v-model="formData.accountDebtorName"
                        :placeholder="showPlaceholder('请输入债务人名称')"
                        clearable
                        :style="formItemContentStyle"
						maxlength="32"
                    />
                </div>
            </el-form-item>
            <!-- 开户行 -->
            <el-form-item label="开户行" prop="accountBankName">
                <div class="form-item__block">
                    <el-input
                        v-model="formData.accountBankName"
                        :placeholder="showPlaceholder('请输入开户行')"
                        clearable
                        :style="formItemContentStyle"
						maxlength="32"
                    />
                </div>
            </el-form-item>
            <!-- 账号 -->
            <el-form-item label="账号" prop="accountBankAccount">
                <div class="form-item__block">
                    <el-input
                        v-model="formData.accountBankAccount"
                        :placeholder="showPlaceholder('请输入账号')"
                        clearable
                        :style="formItemContentStyle"
						maxlength="32"
                    />
                </div>
            </el-form-item>
            <!-- 备注 -->
            <el-form-item label="备注" prop="accountRemark">
                <div class="form-item__block">
                    <el-input
                        v-model="formData.accountRemark"
                        :placeholder="showPlaceholder('请输入备注')"
                        clearable
                        :style="formItemContentStyle"
						maxlength="255"
                    />
                </div>
            </el-form-item>
        </el-form>
    </el-card>
</template>

<script setup>
import { ref, reactive, computed } from "vue";

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

// 表单对象
const formData = reactive(props.data);

// 表单验证规则
const rules = ref({
    accountType: [
        { 
            required: true,
            message: "账户种类不能为空",
            trigger: "change" 
        }
    ]
});

// Form item 内容的统一宽度
const formItemContentStyle = { width: "100%" };

// 系统字典
const { cont_account_type } = proxy.useDict("cont_account_type");

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

// 显示placeholder占位字符
function showPlaceholder(txt) {
    return isView.value ? " " : txt;
}

// 验证表单
async function validate(callback) {
    await elFormRef.value.validate((valid, fields) => {
        callback(valid, fields);
    });
};

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