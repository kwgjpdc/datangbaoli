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
            <!-- 合同编号 -->
            <el-form-item label="合同编号" prop="otherContractNo">
                <div class="form-item__block">
                    <el-input
                        v-model="formData.otherContractNo"
                        :placeholder="showPlaceholder('请输入合同编号')"
                        clearable
                        :style="formItemContentStyle"
						maxlength="32"
                    />
                </div>
            </el-form-item>
            <!-- 合同名称 -->
            <el-form-item label="合同名称" prop="otherContractName">
                <div class="form-item__block">
                    <el-input
                        v-model="formData.otherContractName"
                        :placeholder="showPlaceholder('请输入合同名称')"
                        clearable
                        :style="formItemContentStyle"
						maxlength="32"
                    />
                </div>
            </el-form-item>
            <!-- 币种 -->
            <el-form-item label="币种" prop="otherCurrencyType">
                <div class="form-item__block">
                    <el-select
                        v-model="formData.otherCurrencyType"
                        filterable
                        :placeholder="showPlaceholder('请选择')"
                        :style="formItemContentStyle"
                    >
                        <el-option
                            v-for="item in sys_currency_type"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </div>
            </el-form-item>
            <!-- 合同金额 -->
            <el-form-item label="合同金额" prop="otherContractAmount">
                <div class="form-item__block">
                    <el-input
						maxlength="32"
                        v-model="formData.otherContractAmount"
                        oninput="value=value.replace(/[^0-9]/g,'')"
                        :placeholder="showPlaceholder('请输入合同金额')"
                        clearable
                        :style="formItemContentStyle"
						@input="handleInput($event,'otherContractAmount')"
                    />
                </div>
            </el-form-item>
            <!-- 额度上限 -->
            <el-form-item label="额度上限" prop="otherQuotaCeiling">
                <div class="form-item__block">
                    <el-input
						maxlength="32"
                        v-model="formData.otherQuotaCeiling"
                        oninput="value=value.replace(/[^0-9]/g,'')"
                        :placeholder="showPlaceholder('请输入额度上限')"
                        clearable
                        :style="formItemContentStyle"
						@input="handleInput($event,'otherQuotaCeiling')"
                    />
                </div>
            </el-form-item>
            <!-- 额度是否循环 -->
            <el-form-item label="额度是否循环" prop="otherQuotaCircle">
                <div class="form-item__block">
                    <el-select
                        v-model="formData.otherQuotaCircle"
                        :placeholder="showPlaceholder('请选择')"
                        filterable
                        :style="formItemContentStyle"
                    >
                        <el-option
                            v-for="item in cont_quota_circle"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </div>
            </el-form-item>
            <!-- 合同生效日 -->
            <el-form-item label="合同生效日" prop="otherContractStartDate">
                <div class="form-item__block">
                    <el-date-picker
                        v-model="formData.otherContractStartDate"
                        type="date"
                        value-format="YYYY-MM-DD"
                        clearable
                        :placeholder="showPlaceholder('日期选择')"
                        :style="formItemContentStyle"
                    />
                </div>
            </el-form-item>
            <!-- 合同到期日 -->
            <el-form-item label="合同到期日" prop="otherContractEndDate">
                <div class="form-item__block">
                    <el-date-picker
                        v-model="formData.otherContractEndDate"
                        type="date"
                        value-format="YYYY-MM-DD"
                        clearable
                        :placeholder="showPlaceholder('日期选择')"
                        :style="formItemContentStyle"
                    />
                </div>
            </el-form-item>
            <!-- 说明 -->
            <el-form-item label="说明" prop="otherRemark">
                <div class="form-item__block">
                    <el-input
                        v-model="formData.otherRemark"
                        :placeholder="showPlaceholder('请输入说明')"
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
    routerQueryObj: {
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
    otherContractNo: [
        { 
            required: true,
            pattern: '[^\x20]+',
            message: "合同编号不能为空",
            trigger: "change" 
        }
    ],
    otherContractName: [
        { 
            required: true,
            pattern: '[^\x20]+',
            message: "合同名称不能为空",
            trigger: "change" 
        }
    ],
    otherContractAmount: [
        { 
            required: true,
            message: "合同金额不能为空",
            trigger: "change" 
        }
    ]
});

// Form item 内容的统一宽度
const formItemContentStyle = { width: "100%" };

// 系统字典
const {
    sys_currency_type,
    cont_quota_circle
} = proxy.useDict(
    "sys_currency_type",
    "cont_quota_circle"
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

// 显示placeholder占位字符
function showPlaceholder(txt) {
    return isView.value ? " " : txt;
}

// 监听input:number的字段长度问题
function handleInput(value,name,len = 32){
	// 如果输入长度超过5，截取前5位
	if (value.length > len) {
		formData[name] = value.slice(0, len);
	}
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