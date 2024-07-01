<template>
    <el-card>
        <el-form
            ref="elFormRef"
            :inline="true"
            label-width="150px"
            :disabled="isView"
        >
            <!-- 违约罚息率 -->
            <el-form-item label="正常贷款">
                <div class="form-item__block">
                    <el-input
                        v-model="repayLoan"
                        :placeholder="showPlaceholder('请输入正常贷款')"
                        readonly
                        :style="formItemContentStyle"
                        @click="handleOpenDialog"
                    />
                </div>
            </el-form-item>
        </el-form>
        <!-- Dialog -->
        <el-dialog
            title="还款顺序"
            v-model="dialogVisible"
            width="400px"
            append-to-body
        >
            <el-table :data="tmpRepaymentList">
                <el-table-column label="类型" align="center">
                    <template #default="scope">
                        {{ repaymentSequenceDictMap.get(scope.row.repaymentSequenceCode) }}
                    </template>
                </el-table-column>
                <el-table-column
                    label="操作"
                    align="center"
                    class-name="small-padding fixed-width"
                >
                    <template #default="scope">
                        <el-button
                            link
                            type="primary"
                            icon="top"
                            @click="handleMoveUp(scope)"
                            title="向上"
                            :disabled="scope.$index === 0"
                        >
                            向上
                        </el-button>
                        <el-button
                            link
                            type="primary"
                            icon="bottom"
                            @click="handleMoveDown(scope)"
                            title="向下"
                            :disabled="scope.$index === tmpRepaymentList.length - 1"
                        >
                            向下
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div style="margin-top: 10px;">
                <el-button type="primary" @click="handleSave">
                    确定
                </el-button>
                <el-button type="primary" @click="handleCloseDialog">
                    取消
                </el-button>
            </div>
        </el-dialog>
    </el-card>
</template>

<script setup>
import { ref, reactive, computed, watch, watchEffect } from "vue";

// 组件属性
const props = defineProps({
    data: {
        type: Object,
        default: []
    },
    routerQueryObj: {
        type: Object,
        default: {}
    }
});

// 组件事件
const emit = defineEmits(["update:data"]);

// 当前实例
const { proxy } = getCurrentInstance();

// 数据集合
const repaymentList = reactive(props.data);

// 临时的数据集合
const tmpRepaymentList = ref([]);

// 字典
const { cont_repayment_sequence } = proxy.useDict("cont_repayment_sequence");

// Form item 内容的统一宽度
const formItemContentStyle = { width: "100%" };

// Dialog显示变量
const dialogVisible = ref(false);

// 字典Map
const repaymentSequenceDictMap = computed(() => {
    const result = new Map();
    if (cont_repayment_sequence.value.length > 0) {
        cont_repayment_sequence.value.forEach((item) => {
            result.set(item.value, item.label);
        });
    }
    return result;
});

// 页面输入框显示的计算属性
const repayLoan = computed(() => {
    let repaymentValueArr = repaymentList.map((item) => repaymentSequenceDictMap.value.get(item.repaymentSequenceCode));
    return repaymentValueArr.length > 0 ? repaymentValueArr.join(", ") : "";
});

// 页面是View状态
const isView = computed(() => {
    let result = false;
    if (props.routerQueryObj && props.routerQueryObj.viewFlag) {
        result = true;
    }
    return result;
});

// 页面是Edit状态
const isEdit = computed(() => {
    let result = false;
    if (props.routerQueryObj && props.routerQueryObj.editFlag) {
        result = true;
    }
    return result;
});

// 监听 repaymentList 的变化
watch(repaymentList, (newValue) => {
    emit("update:data", newValue);
});

// 监听 cont_repayment_sequence 的变化
watch(cont_repayment_sequence, (newValue) => {
    newValue.forEach((item, index) => {
        tmpRepaymentList.value.push({
            repaymentSequenceCode: item.value,
            repaymentSequenceName: item.label,
            sequence: index + 1
        });
    });
});

// 初始化 repaymentList
watchEffect(() => {
    if (!isView.value && !isEdit.value) {
        repaymentList.length = 0;
        cont_repayment_sequence.value.forEach((item, index) => {
            repaymentList.push({
                repaymentSequenceCode: item.value,
                repaymentSequenceName: item.label,
                sequence: index + 1
            });
        });
    }
});

// 向上移动事件
function handleMoveUp(scope) {
    const index = scope.$index;
    const item = scope.row;
    item.sequence--;
    const oldItem = tmpRepaymentList.value[index - 1];
    oldItem.sequence++;
    tmpRepaymentList.value.splice(index - 1, 1, item);
    tmpRepaymentList.value.splice(index, 1, oldItem);
}

// 向下移动事件
function handleMoveDown(scope) {
    const index = scope.$index;
    const item = scope.row;
    item.sequence++;
    const oldItem = tmpRepaymentList.value[index + 1];
    oldItem.sequence--;
    tmpRepaymentList.value.splice(index, 1, oldItem);
    tmpRepaymentList.value.splice(index + 1, 1, item);
}

// 保存顺序更改
function handleSave() {
    const newArr = JSON.parse(JSON.stringify(tmpRepaymentList.value));
    newArr.forEach((item, index) => {
        repaymentList.splice(index, 1, item);
    });
    dialogVisible.value = false;
}

// 打开Dialog
function handleOpenDialog() {
    tmpRepaymentList.value = JSON.parse(JSON.stringify(repaymentList));
    dialogVisible.value = true;
}

// 关闭Dialog
function handleCloseDialog() {
    dialogVisible.value = false;
}

// 显示placeholder占位字符
function showPlaceholder(txt) {
    return isView.value ? " " : txt;
}
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