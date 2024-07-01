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
                @click="batchDelete()"
                :disabled="deleteIsDisabled"
            >
                删除
            </el-button>
        </template>
        <!-- 表格 -->
        <el-table
            :data="data.voucherList"
            @selection-change="handleSelectionChange"
        >
            <!-- Checkbox -->
            <el-table-column type="selection" width="55" align="center" v-if="!isView" />
            <!-- 业务合同号 -->
            <el-table-column label="业务合同号" prop="contractNo" align="center" />
            <!-- 核心企业 -->
            <el-table-column label="核心企业" prop="coreEnterpriseName" align="center" />
            <!-- 保理申请人 -->
            <el-table-column label="保理申请人" prop="factoringApplicantName" align="center" />
            <!-- 借款人 -->
            <el-table-column label="借款人" prop="accountDebtorName" align="center" />
            <!-- 合同名称 -->
            <el-table-column label="合同名称" prop="contractName" align="center" />
            <!-- 应收账款金额 -->
            <el-table-column label="应收账款金额" prop="debtReceivableAmount" align="center" >
				<template #default="scope">
					<span>{{ formatMoney(scope.row.debtReceivableAmount) }}</span>
				</template>
			</el-table-column>
            <!-- 凭证提供方 -->
            <el-table-column label="凭证提供方" prop="voucherProviderName" align="center" />
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
                        icon="Delete"
                        @click="handleDelete(scope.row)"
                        title="删除"
                    ></el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- Dialog -->
        <DialogTableMulti 
            v-model:multiQuery="multiQuery" 
            v-model:open="multiQuery.open" 
            v-model:tableData="tableDataMulti"
            v-model:prop="propMulti" 
            @selectRow="selectRowMulti" 
            @pageChange="pageChangeMulti"
        />
    </el-card>
</template>

<script setup>
import { ref, reactive, computed, toRef, watch } from "vue";
import { deepClone } from "@/utils/index"
import { listDebtInfo } from "@/api/debt/info";
import { formatMoney } from "@/utils/formatMoney";

// 组件属性
const props = defineProps({
    data: {
        type: Object,
        default: {}
    },
    routerQueryObj:{
        type: Object,
        default: {}
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

// 数据对象
const data = reactive(props.data);

// 显示loading
const loading = ref(props.loading);

// 表格删除按钮状态
const deleteIsDisabled = ref(true);

// 表格选中行集合
let tableSelection = reactive([]);

// Dialog配置
let multiQuery = reactive({
    title: "应收账款",
    open: false,
    currentPage: 1,
    total: 1,
    pageSize: 10
});

// Dialog表格数据
const tableDataMulti = ref([]);

// Dialog表格列头
const propMulti = reactive([
    {
        label: "业务合同号",
        value: "contractNo"
    }, 
    {
        label: "核心企业",
        value: "coreEnterpriseName"
    },
    {
        label: "借款人",
        value: "accountDebtorName"
    },
    {
        label: "保理申请人",
        value: "factoringApplicantName"
    }
]);

// Dialog查询参数
const paramsMulti = reactive({
    pageNum: 1,
    pageSize: 10,
});

// 页面是View状态
const isView = computed(() => {
    let result = false;
    if (props.routerQueryObj && props.routerQueryObj.viewFlag) {
        result = true;
    }
    return result;
});

// 侦听数据变化
watch(data, (newValue) => {
    emit("update:data", newValue);
});

// 侦听loading变化
watch(loading, (newValue) => {
    emit("update:loading", newValue);
});

// 侦听voucherList变化
watch(data.voucherList, (newValue) => {
    data.absDebtList.length = 0;
    if (newValue.length > 0) {
        newValue.forEach((item) => {
            data.absDebtList.push({
                absDebtId: null,
                absId: data.absId,
                debtReceivableVoucherId: item.voucherId
            });
        });
    }
});

// 选择器触发事件
function handleSelectionChange(selection) {
    tableSelection = selection;
    deleteIsDisabled.value = !(selection.length > 0);
}

// 删除多条应收账款
function batchDelete() {
    proxy.$modal.confirm('是否确认删除选择的数据项？').then(() => {
        tableSelection.forEach((debt) => {
            const index = data.voucherList.indexOf(debt);
            if (index !== -1) {
                data.voucherList.splice(index, 1);
            }
        });
    }).catch((e) => { 
        console.log(e) 
    });
}

// 删除一条应收账款
function handleDelete(debt) {
    proxy.$modal.confirm('是否确认删除选择的数据项？').then(function () {
        const index = data.voucherList.indexOf(debt);
        if (index !== -1) {
            data.voucherList.splice(index, 1);
        }
    }).catch((e) => { 
        console.log(e) 
    });
}

// Dialog表格选中方法
function selectRowMulti(rows) {
    data.voucherList.push(deepClone(rows));
}

// Dialog表格分页方法
function pageChangeMulti(pageNum) {
    loading.value = true;
    paramsMulti.pageNum = pageNum;
    listDebtInfo(paramsMulti).then((response) => {
        tableDataMulti.value = response.rows;
        multiQuery.total = response.total;
        multiQuery.open = true;
        loading.value = false;
    });
}

// 打开Dialog
function openAddDialog() {
    if (!tableDataMulti.value.length) {
        loading.value = true;
        listDebtInfo(paramsMulti).then((response) => {
            tableDataMulti.value = response.rows;
            multiQuery.total = response.total;
            multiQuery.open = true;
            loading.value = false;
        });
    } else {
        multiQuery.open = true;
    }
}
</script>

<style lang="scss" scoped>
</style>