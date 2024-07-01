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
            <!-- 业务合同号 -->
            <el-form-item label="业务合同号" prop="contractNo">
                <div class="form-item__block">
                    <el-input
                        v-model="formData.contractNo"
                        :placeholder="showPlaceholder('系统自动生成')"
                        :style="formItemContentStyle"
                        disabled
                    />
                </div>
            </el-form-item>
            <!-- 业务产品 -->
            <el-form-item label="业务产品" prop="bussProduct">
                <div class="form-item__block">
                    <el-select
                        v-model="formData.bussProduct"
                        :placeholder="showPlaceholder('请选择')"
                        disabled
                        :style="formItemContentStyle"
                    >
                        <el-option
                            v-for="item in lend_buss_product"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </div>
            </el-form-item>
            <!-- 项目尽调编号 -->
            <el-form-item label="项目尽调编号" prop="projectNo">
                <div class="form-item__block">
                    <el-input
                        v-model="formData.projectNo"
                        :placeholder="showPlaceholder('请选择项目尽调编号')"
                        suffix-icon="el-icon-search"
                        readonly
                        :style="formItemContentStyle"
                        @click="openProjectNoDialog()"
                    />
                </div>
            </el-form-item>
            <!-- 项目名称 -->
            <el-form-item label="项目名称" prop="projectName">
                <div class="form-item__block">
                    <el-input
                        v-model="formData.projectName"
                        :placeholder="showPlaceholder('请输入项目名称')"
                        disabled
                        :style="formItemContentStyle"
                    />
                </div>
            </el-form-item>
            <!-- 合同生效日 -->
            <el-form-item label="合同生效日" prop="baseContractStartDate">
                <div class="form-item__block">
                    <el-date-picker
                        v-model="formData.baseContractStartDate"
                        type="date"
                        value-format="YYYY-MM-DD"
                        clearable
                        :placeholder="showPlaceholder('日期选择')"
                        :style="formItemContentStyle"
                    />
                </div>
            </el-form-item>
            <!-- 合同到期日 -->
            <el-form-item label="合同到期日" prop="baseContractEndDate">
                <div class="form-item__block">
                    <el-date-picker
                        v-model="formData.baseContractEndDate"
                        type="date"
                        value-format="YYYY-MM-DD"
                        clearable
                        :placeholder="showPlaceholder('日期选择')"
                        :style="formItemContentStyle"
                    />
                </div>
            </el-form-item>
            <!-- 用印时间 -->
            <el-form-item label="用印时间" prop="baseSealTime">
                <div class="form-item__block">
                    <el-date-picker
                        v-model="formData.baseSealTime"
                        type="date"
                        value-format="YYYY-MM-DD"
                        clearable
                        :placeholder="showPlaceholder('日期选择')"
                        :style="formItemContentStyle"
                    />
                </div>
            </el-form-item>
            <!-- 宽限期天数 -->
            <el-form-item label="宽限期天数" prop="baseGraceDays">
                <div class="form-item__block">
                    <el-input
                        v-model="formData.baseGraceDays"
                        :placeholder="showPlaceholder('请输入宽限期天数')"
                        clearable
						maxlength="9"
						oninput="value=value.replace(/[^0-9]/g,'')"
                        :style="formItemContentStyle"
                    >
                        <template #suffix>
                            <span> 天 </span>
                        </template>
                    </el-input>
                </div>
            </el-form-item>
            <!-- 利息收取方式 -->
            <el-form-item label="利息收取方式" prop="baseChargeInterestWay">
                <div class="form-item__block">
                    <el-radio-group
                        v-model="formData.baseChargeInterestWay"
                        :style="formItemContentStyle"
                        @change="handleChargeInterestWayChange"
                    >
                        <el-radio
                            v-for="item in cont_interest_pay"
                            :key="item.value"
                            :label="item.value"
                        >
                            {{ item.label }}
                        </el-radio>
                    </el-radio-group>
                </div>
            </el-form-item>
            <!-- 结息方式 -->
            <template v-if="formData.baseChargeInterestWay !== '3'">
                <el-form-item label="结息方式" prop="baseSettleInterestWay">
                    <div class="form-item__block">
                        <template v-if="formData.baseChargeInterestWay === '1'">
                            <el-radio-group v-model="formData.baseSettleInterestWay">
                                <el-radio
                                    v-for="item in cont_interest_pay_first"
                                    :key="item.value"
                                    :label="item.value"
                                >
                                    {{ item.label }}
                                </el-radio>
                            </el-radio-group>
                        </template>
                        <template v-if="formData.baseChargeInterestWay === '2'">
                            <el-select
                                v-model="formData.baseSettleInterestWay"
                                :placeholder="showPlaceholder('请选择')"
                                filterable
                                clearable
                                :style="formItemContentStyle"
                            >
                                <el-option
                                    v-for="item in cont_interest_settlement"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                />
                            </el-select>
                        </template>
                    </div>
                </el-form-item>
            </template>
            <template v-else>
                <el-form-item>
                    <div class="form-item__placeholder"></div>
                </el-form-item>
            </template>
            <!-- 本金函证方 -->
            <el-form-item label="本金函证方" prop="basePrincipalConfirmParty">
                <div class="form-item__block">
                    <el-select
                        v-model="formData.basePrincipalConfirmParty"
                        :placeholder="showPlaceholder('请选择')"
                        filterable
                        clearable
                        :style="formItemContentStyle"
                    >
                        <el-option
                            v-for="item in cont_capital_confirmation"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </div>
            </el-form-item>
            <!-- 省份 -->
            <el-form-item label="省份" prop="baseProvince">
                <div class="form-item__block">
                    <el-select
                        v-model="formData.baseProvince"
                        :placeholder="showPlaceholder('请选择')"
                        filterable
                        clearable
                        :style="formItemContentStyle"
                    >
                        <el-option
                            v-for="item in province"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </div>
            </el-form-item>
            <!-- 行业类别 -->
            <el-form-item label="行业类别" prop="baseIndustryType">
                <div class="form-item__block">
                    <el-select
                        v-model="formData.baseIndustryType"
                        :placeholder="showPlaceholder('请选择')"
                        filterable
                        clearable
                        :style="formItemContentStyle"
                    >
                        <el-option
                            v-for="item in cont_industry_type"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </div>
            </el-form-item>
            <!-- 保理标的 -->
            <el-form-item label="保理标的" prop="baseItem">
                <div class="form-item__block">
                    <el-select
                        v-model="formData.baseItem"
                        :placeholder="showPlaceholder('请选择')"
                        filterable
                        clearable
                        :style="formItemContentStyle"
                    >
                        <el-option
                            v-for="item in lend_item"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </div>
            </el-form-item>
            <!-- 备注 -->
            <el-form-item label="备注" prop="baseRemark">
                <div class="form-item__block">
                    <el-input
                        v-model="formData.baseRemark"
                        type="textarea"
                        :placeholder="showPlaceholder('请输入内容')"
                        :style="formItemContentStyle"
						maxlength="255"
                    />
                </div>
            </el-form-item>
            <!-- 签约状态 -->
            <el-form-item label="签约状态" prop="baseSignStatus">
                <div class="form-item__block">
                    <el-input
                        v-model="formData.baseSignStatus"
                        :placeholder="showPlaceholder('请输入签约状态')"
                        :style="formItemContentStyle"
						maxlength="32"
                    />
                </div>
            </el-form-item>
            <!-- 签约意见 -->
            <el-form-item label="签约意见" prop="baseSignOpinion">
                <div class="form-item__block">
                    <el-input
                        v-model="formData.baseSignOpinion"
                        type="textarea"
                        :placeholder="showPlaceholder('请输入内容')"
                        :style="formItemContentStyle"
						maxlength="255"
                    />
                </div>
            </el-form-item>
        </el-form>
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
import { ref, reactive, watch, computed } from "vue";
import { listDiligence } from "@/api/project/diligence";

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

// 表单对象
const elFormRef = ref(null);

// 表单数据
const formData = reactive(props.data);

// 表单验证规则
const rules = ref({
    projectNo: [
        { 
            required: true,
            message: "项目尽调编号不能为空",
            trigger: "change" 
        }
    ],
    projectName: [
        { 
            required: true,
            message: "项目名称不能为空",
            trigger: "change" 
        }
    ],
    baseContractStartDate: [
        { 
            required: true,
            message: "合同生效日不能为空",
            trigger: "change" 
        }
    ],
    baseContractEndDate: [
        { 
            required: true,
            message: "合同到期日不能为空",
            trigger: "change" 
        }
    ],
    baseSealTime: [
        { 
            required: true,
            message: "用印时间不能为空",
            trigger: "change" 
        }
    ],
    baseGraceDays: [
        { 
            required: true,
            message: "宽限期天数不能为空",
            trigger: "change" 
        }
    ],
    baseSettleInterestWay: [
        { 
            required: true,
            message: "结息方式不能为空",
            trigger: "change" 
        }
    ],
    basePrincipalConfirmParty: [
        {
            required: true,
            message: "本金函证方不能为空",
            trigger: "change" 
        }
    ],
    baseProvince: [
        { 
            required: true,
            message: "省份不能为空",
            trigger: "change" 
        }
    ],
    baseIndustryType: [
        { 
            required: true,
            message: "行业类别不能为空",
            trigger: "change" 
        }
    ]
});

// 显示loading
const loading = ref(props.loading);

// Form item 内容的统一宽度
const formItemContentStyle = { width: "100%" };

// 系统字典
const {
    lend_buss_product,
    cont_interest_pay,
    cont_interest_pay_first,
    cont_interest_settlement,
    cont_capital_confirmation,
    province,
    cont_industry_type,
    lend_item
} = proxy.useDict(
    "lend_buss_product",
    "cont_interest_pay",
    "cont_interest_pay_first",
    "cont_interest_settlement",
    "cont_capital_confirmation",
    "province",
    "cont_industry_type",
    "lend_item"
);


// Dialog配置
let multiQuery = reactive({
    title: "项目尽调编号",
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
        label: "审议编号",
        value: "dueNo"
    }, 
    {
        label: "项目名称",
        value: "name"
    }
]);

// 项目尽调查询参数
const diligenceParamsMulti = reactive({
    pageNum: 1,
    pageSize: 10,
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

// 侦听表单数据变化
watch(formData, (newValue) => {
    emit("update:data", newValue);
});

// 侦听loading变化
watch(loading, (newValue) => {
    emit("update:loading", newValue);
});

// 利息收取方式改变方法
function handleChargeInterestWayChange() {
    formData.baseSettleInterestWay = null;
}

// Dialog表格选中方法
function selectRowMulti(rows) {
    //console.log(rows);
    formData.projectDueId = rows.id;
    formData.projectNo = rows.dueNo;
    formData.projectName = rows.name;
    formData.bussProduct = rows.businessType;
}

// Dialog表格分页方法
function pageChangeMulti(pageNum) {
    loading.value = true;
    diligenceParamsMulti.pageNum = pageNum;
    listDiligence(diligenceParamsMulti).then(response => {
        tableDataMulti.value = response.rows;
        multiQuery.total = response.total;
        multiQuery.open = true;
        loading.value = false;
    });
}

// 打开项目尽调Dialog
function openProjectNoDialog() {
    if (!tableDataMulti.value.length) {
        loading.value = true;
        listDiligence(diligenceParamsMulti).then(response => {
            tableDataMulti.value = response.rows;
            multiQuery.total = response.total;
            multiQuery.open = true;
            loading.value = false;
        });
    } else {
        multiQuery.open = true;
    }
}

// 显示placeholder占位字符
function showPlaceholder(txt) {
    return isView.value ? " " : txt;
}

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