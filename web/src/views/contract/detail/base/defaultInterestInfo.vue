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
            <!-- 利率执行方 -->
            <el-form-item label="利率执行方" prop="branchCustomerId">
                <div class="form-item__block">
                    <el-select
                        v-model="formData.branchCustomerId"
                        :placeholder="showPlaceholder('请选择')"
                        filterable
                        clearable
                        :style="formItemContentStyle"
                    >
                        <el-option
                            v-for="item in cont_branch_customer"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </div>
            </el-form-item>
            <!-- 违约金方式 -->
            <el-form-item label="违约金方式" prop="branchType">
                <div class="form-item__block">
                    <el-select
                        v-model="formData.branchType"
                        :placeholder="showPlaceholder('请选择')"
                        filterable
                        clearable
                        :style="formItemContentStyle"
                    >
                        <el-option
                            v-for="item in cont_branch_type"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </div>
            </el-form-item>
            <!-- 违约利率周期 -->
            <el-form-item label="违约利率周期" prop="branchInterestCycle">
                <div class="form-item__block">
                    <el-select
                        v-model="formData.branchInterestCycle"
                        :placeholder="showPlaceholder('请选择')"
                        filterable
                        clearable
                        :style="formItemContentStyle"
                    >
                        <el-option
                            v-for="item in cont_branch_interest_cycle"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </div>
            </el-form-item>
            <!-- 违约罚息率 -->
            <el-form-item label="违约罚息率" prop="branchFineRate">
                <div class="form-item__block">
                    <el-input
						maxlength="32"
                        v-model="formData.branchFineRate"
                        :placeholder="showPlaceholder('请输入违约罚息率')"
                        clearable
                        type="number"
                        :style="formItemContentStyle"
						@input="handleInput($event,'branchFineRate')"
                    >
                        <template #suffix>
                            <span> % </span>
                        </template>
                    </el-input>
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

// 定义组件事件
const emit = defineEmits(["update:data"]);

// vue实例对象
const { proxy } = getCurrentInstance();

// 表单对象
const elFormRef = ref(null);

// 表单数据
const formData = reactive(props.data);

// 表单验证规则
const rules = ref({
    branchCustomerId: [
        { 
            required: true,
            message: "利率执行方不能为空",
            trigger: "change" 
        }
    ],
    branchType: [
        { 
            required: true,
            message: "违约金方式不能为空",
            trigger: "change" 
        }
    ],
    branchInterestCycle: [
        { 
            required: true,
            message: "违约利率周期不能为空",
            trigger: "change" 
        }
    ],
    branchFineRate: [
        { 
            required: true,
            message: "违约罚息率不能为空",
            trigger: "change" 
        }
    ]
});

// Form item 内容的统一宽度
const formItemContentStyle = { width: "100%" };

// 系统字典
const {
    cont_branch_customer,
    cont_branch_type,
    cont_branch_interest_cycle
} = proxy.useDict(
    "cont_branch_customer",
    "cont_branch_type",
    "cont_branch_interest_cycle"
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

// 验证表单
async function validate(callback) {
    await elFormRef.value.validate((valid, fields) => {
        callback(valid, fields);
    });
}


// 监听input:number的字段长度问题
function handleInput(value,name,len = 32){
	// 如果输入长度超过5，截取前5位
	if (value.length > len) {
		formData[name] = value.slice(0, len);
	}
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