<template>
    <el-card>
        <!-- 操控区 -->
        <template #header v-if="!isView">
            <!-- 新增按钮 -->
            <el-button
                style="float: right; padding: 3px 0"
                type="primary"
                link
                @click="addFee()"
            >
                新增
            </el-button>
            <!-- 删除按钮 -->
            <el-button
                style="float: right; padding: 3px 0; margin-right: 20px"
                type="primary"
                link
                @click="batchDeleteFee()"
                :disabled="deleteIsDisabled"
            >
                删除
            </el-button>
        </template>
        <!-- 表格 -->
        <el-table
            :data="feeList"
            @selection-change="handleSelectionChange"
        >
            <!-- Checkbox -->
            <el-table-column type="selection" width="55" align="center" v-if="!isView" />
            <!-- 收费名目 -->
            <el-table-column label="收费名目" prop="feeName" align="center" />
            <!-- 收费/支付对象 -->
            <el-table-column label="收费/支付对象" align="center">
                <template #default="scope">
                    <el-input
                        v-model="scope.row.customerName"
                        :placeholder="showPlaceholder('请选择收费/支付对象')"
                        suffix-icon="el-icon-search"
                        readonly
                        @click="openFeeCustomerDialog(scope.row)"
                        :disabled="isView"
                    />
                </template>
            </el-table-column>
            <!-- 收/支类型 -->
            <el-table-column label="收/支类型" align="center">
                <template #default="scope">
                    <el-radio-group v-model="scope.row.feeType" :disabled="isView">
                        <el-radio
                            v-for="item in cont_fee_type"
                            :key="item.value"
                            :label="item.value"
                        >
                            {{ item.label }}
                        </el-radio>
                    </el-radio-group>
                </template>
            </el-table-column>
            <!-- 支付方式 -->
            <el-table-column label="支付方式" align="center">
                <template #default="scope">
                    <div class="fee-payment__block--half">
                        <el-select
                            v-model="scope.row.feePayment"
                            filterable
                            clearable
                            :placeholder="showPlaceholder('请选择')"
                            @change="scope.row.feePaymentOther = null"
                            :disabled="isView"
                        >
                            <el-option
                                v-for="item in cont_fee_payment"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            />
                        </el-select>
                    </div>
                    <div class="fee-payment__block--half">
                        <el-input
							maxlength="32"
                            v-model="scope.row.feePaymentOther"
                            :placeholder="showPlaceholder('请输入')"
                            clearable
                            :disabled="scope.row.feePayment !== '4' || isView"
                        />
                    </div>
                </template>
            </el-table-column>
            <!-- 计费方式 -->
            <el-table-column label="计费方式" align="center">
                <template #default="scope">
                    <el-radio-group v-model="scope.row.feeBilling">
                        <el-radio
                            v-for="item in cont_fee_billing"
                            :key="item.value"
                            :label="item.value"
                            :disabled="isView"
                        >
                            {{ item.label }}
                        </el-radio>
                    </el-radio-group>
                </template>
            </el-table-column>
            <!-- 管理费金额/比例 -->
            <el-table-column label="管理费金额/比例" align="center">
                <template #default="scope">
                    <el-input 
                        v-model="scope.row.feeRate" 
                        oninput="value=value.replace(/[^0-9]/g,'')"
						maxlength="32"
                        :placeholder="showPlaceholder('请输入管理费金额/比例')" 
                        :disabled="isView" 
						@input="handleInput($event,scope.row,'feeRate')"
                    />
                </template>
            </el-table-column>
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
                        @click="handleDeleteFee(scope.row)"
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
import { ref, reactive, computed } from "vue";
import { listInfo as getUserList, getInfo as getUserId } from "@/api/customer/index";

// 组件属性
const props = defineProps({
    data: {
        type: Array,
        default: []
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

// 费用集合
const feeList = reactive(props.data);

// 显示loading
const loading = ref(props.loading);

// 系统字典
const { 
    cont_fee_type, 
    cont_fee_payment, 
    cont_fee_billing 
} = proxy.useDict(
    "cont_fee_type", 
    "cont_fee_payment", 
    "cont_fee_billing"
);

// 表格删除按钮状态
const deleteIsDisabled = ref(true);

// 表格选中行集合
let tableSelection = reactive([]);

// Dialog配置
let multiQuery = reactive({
    title: "收费/支付对象",
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
        label: "客户编号",
        value: "customerNo"
    }, 
    {
        label: "客户名称",
        value: "customerName"
    }
]);

// Dialog查询参数
const paramsMulti = reactive({
    pageNum: 1,
    pageSize: 10,
});

// Dialog当前选中行
const currentRow = ref({});

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

// 侦听数据集合变化
watch(feeList, (newValue) => {
    if (Array.isArray(feeList) && feeList.length > 0 && (isView.value || isEdit.value)) {
        feeList.forEach((item) => {
            if (!item.customerName && item.customerId) {
                getUserId(item.customerId).then((response) => {
                    item.customerName = response.data.customerName;
                });
            }
        });
    }
    emit("update:data", newValue);
});

// 侦听loading变化
watch(loading, (newValue) => {
    emit("update:loading", newValue);
});

// 选择器触发事件
function handleSelectionChange(selection) {
    tableSelection = selection;
    deleteIsDisabled.value = !(selection.length > 0);
}

// 添加一条费用
function addFee() {
    feeList.push({
        feeName: "管理费",
        customerId: null,
        customerName: null,
        feeType: null,
        feePayment: null,
        feePaymentOther: null,
        feeBilling: null,
        feeRate: null
    });
}

// 删除多条费用
function batchDeleteFee() {
    proxy.$modal.confirm('是否确认删除选择的数据项？').then(() => {
        tableSelection.forEach((fee) => {
            const index = feeList.indexOf(fee);
            if (index !== -1) {
                feeList.splice(index, 1);
            }
        });
    }).catch((e) => { 
        console.log(e) 
    });
}

// 删除一条费用
function handleDeleteFee(fee) {
    proxy.$modal.confirm('是否确认删除选择的数据项？').then(function () {
        const index = feeList.indexOf(fee);
        if (index !== -1) {
            feeList.splice(index, 1);
        }
    }).catch((e) => { 
        console.log(e) 
    });
}

// Dialog表格选中方法
function selectRowMulti(rows) {
    currentRow.value.customerId = rows.customerId;
    currentRow.value.customerName = rows.customerName;
}

// Dialog表格分页方法
function pageChangeMulti(pageNum) {
    loading.value = true;
    paramsMulti.pageNum = pageNum;
    getUserList(paramsMulti).then((response) => {
        tableDataMulti.value = response.rows;
        multiQuery.total = response.total;
        multiQuery.open = true;
        loading.value = false;
    });
}

// 打开Dialog
function openFeeCustomerDialog(row) {
    currentRow.value = row;
    if (!tableDataMulti.value.length) {
        loading.value = true;
        getUserList(paramsMulti).then((response) => {
            tableDataMulti.value = response.rows;
            multiQuery.total = response.total;
            multiQuery.open = true;
            loading.value = false;
        });
    } else {
        multiQuery.open = true;
    }
}
// 监听input:number的字段长度问题
function handleInput(value,item,name,len = 32){
	// 如果输入长度超过5，截取前5位
	if (value.length > len) {
		item[name] = value.slice(0, len);
	}
}

// 显示placeholder占位字符
function showPlaceholder(txt) {
    return isView.value ? " " : txt;
}
</script>

<style lang="scss" scoped>
.fee-payment__block--half {
    display: inline-block;
    width: calc(50% - 5px);
}

.fee-payment__block--half:first-child {
    margin-right: 10px;
}
</style>