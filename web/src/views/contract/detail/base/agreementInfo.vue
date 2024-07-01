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
            <!-- 债务人名称 -->
            <el-form-item label="债务人名称" prop="agreeDebtorName">
                <div class="form-item__block">
                    <el-input
                        v-model="formData.agreeDebtorName"
                        :placeholder="showPlaceholder('请输入债务人名称')"
                        clearable
                        :style="formItemContentStyle"
						maxlength="32"
                    />
                </div>
            </el-form-item>
            <!-- 企业客户号 -->
            <el-form-item label="企业客户号" prop="agreeCompanyNo">
                <div class="form-item__block">
                    <el-input
                        v-model="formData.agreeCompanyNo"
                        :placeholder="showPlaceholder('请输入企业客户号')"
                        clearable
                        :style="formItemContentStyle"
						maxlength="32"
                    />
                </div>
            </el-form-item>
            <!-- 结算方式 -->
            <el-form-item label="结算方式" prop="agreeSettlement">
                <div class="form-item__block">
                    <el-radio-group
                        v-model="formData.agreeSettlement"
                        :style="formItemContentStyle"
                        @change="handleSettlementChange"
                    >
                        <el-radio
                            v-for="item in cont_settlement"
                            :key="item.value"
                            :label="item.value"
                        >
                            {{ item.label }}
                        </el-radio>
                    </el-radio-group>
                </div>
            </el-form-item>
            <!-- 自然月结 -->
            <template v-if="formData.agreeSettlement === '1'">
                <el-form-item label="付款期限" prop="agreePaymentLimit">
                    <div class="form-item__block">
                        <el-select
                            v-model="formData.agreePaymentLimit"
                            :placeholder="showPlaceholder('请选择')"
                            filterable
                            clearable
                            :style="formItemContentStyle"
                        >
                            <el-option
                                v-for="item in day"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            />
                        </el-select>
                    </div>
                </el-form-item>
            </template>
            <!-- 固定月结 & 周结 -->
            <template v-if="formData.agreeSettlement === '2' || formData.agreeSettlement === '3'">
                <el-form-item label="起日" prop="agreePaymentStartDate">
                    <div class="form-item__block">
                        <el-select
                            v-model="formData.agreePaymentStartDate"
                            :placeholder="showPlaceholder('请选择')"
                            filterable
                            clearable
                            :style="formItemContentStyle"
                        >
                            <el-option
                                v-for="item in day"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            />
                        </el-select>
                    </div>
                </el-form-item>
                <el-form-item label="迄日" prop="agreePaymentEndDate">
                    <div class="form-item__block">
                        <el-select
                            v-model="formData.agreePaymentEndDate"
                            :placeholder="showPlaceholder('请选择')"
                            filterable
                            clearable
                            :style="formItemContentStyle"
                        >
                            <el-option
                                v-for="item in day"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            />
                        </el-select>
                    </div>
                </el-form-item>
                <el-form-item label="付款期限" prop="agreePaymentLimit">
                    <div class="form-item__block">
                        <el-select
                            v-model="formData.agreePaymentLimit"
                            :placeholder="showPlaceholder('请选择')"
                            filterable
                            clearable
                            :style="formItemContentStyle"
                        >
                            <el-option
                                v-for="item in day"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            />
                        </el-select>
                    </div>
                </el-form-item>
            </template>
            <!-- 天结 -->
            <template v-if="formData.agreeSettlement === '4'">
                <el-form-item label="对账期限" prop="agreePaymentVerify">
                    <div class="form-item__block">
                        <el-input
                            v-model="formData.agreePaymentVerify"
                            oninput="value=value.replace(/[^0-9]/g,'')"
                            :placeholder="showPlaceholder('请输入对账期限')"
                            clearable
                            :style="formItemContentStyle"
							maxlength="32"
							@input="handleInput($event,'agreePaymentVerify')"
                        />
                    </div>
                </el-form-item>
                <el-form-item label="初始日" prop="agreeStartDate">
                    <div class="form-item__block">
                        <el-date-picker
                            v-model="formData.agreeStartDate"
                            type="date"
                            value-format="YYYY-MM-DD"
                            clearable
                            :placeholder="showPlaceholder('日期选择')"
                            :style="formItemContentStyle"
                        />
                    </div>
                </el-form-item>
            </template>
            <template v-if="formData.agreeSettlement === '4' || formData.agreeSettlement === '5'">
                <el-form-item label="最大付款期限" prop="agreePaymentMaxLimit">
                    <div class="form-item__block">
                        <el-input
                            v-model="formData.agreePaymentMaxLimit"
                            oninput="value=value.replace(/[^0-9]/g,'')"
                            :placeholder="showPlaceholder('请输入最大付款期限')"
                            clearable
                            :style="formItemContentStyle"
							:maxlength="32"
							@input="handleInput($event,'agreePaymentMaxLimit')"
                        />
                    </div>
                </el-form-item>
            </template>
            <!-- 是否垫款 -->
            <el-form-item label="是否垫款" prop="agreeAdvance">
                <div class="form-item__block">
                    <el-radio-group
                        v-model="formData.agreeAdvance"
                        :style="formItemContentStyle"
                        @change="handleAdvanceChange()"
                    >
                        <el-radio
                            v-for="item in cont_advance"
                            :key="item.value"
                            :label="item.value"
                        >
                            {{ item.label }}</el-radio
                        >
                    </el-radio-group>
                </div>
            </el-form-item>
            <template v-if="formData.agreeAdvance === '1'">
                <!-- 垫款宽限期 -->
                <el-form-item label="垫款宽限期" prop="agreeAdvanceGraceDays">
                    <div class="form-item__block">
                        <el-input
                            v-model="formData.agreeAdvanceGraceDays"
                            :placeholder="showPlaceholder('请输入垫款宽限期')"
                            oninput="value=value.replace(/[^0-9]/g,'')"
                            clearable
                            :style="formItemContentStyle"
							maxlength="32"
							@input="handleInput($event,'agreeAdvanceGraceDays')"
                        >
                            <template #suffix>
                                <span> 天 </span>
                            </template>
                        </el-input>
                    </div>
                </el-form-item>
                <!-- 垫款比例 -->
                <el-form-item label="垫款比例" prop="agreeAdvancePercentage">
                    <div class="form-item__block">
                        <el-input
                            v-model="formData.agreeAdvancePercentage"
                            :placeholder="showPlaceholder('请输入垫款比例')"
                            oninput="value=value.replace(/[^0-9]/g,'')"
                            clearable
                            :style="formItemContentStyle"
							maxlength="32"
							@input="handleInput($event,'agreeAdvancePercentage')"
                        >
                            <template #suffix>
                                <span> % </span>
                            </template>
                        </el-input>
                    </div>
                </el-form-item>
            </template>
            <!-- 担保付款期限 -->
           <!-- <el-form-item label="担保付款期限" prop="agreeGuaranteePaymentLimit">
                <div class="form-item__block">
                    <el-input
                        v-model="formData.agreeGuaranteePaymentLimit"
                        :placeholder="showPlaceholder('请输入担保付款期限')"
                        oninput="value=value.replace(/[^0-9]/g,'')"
                        clearable
                        :style="formItemContentStyle"
						maxlength="10"
						@input="handleInput($event,'agreeGuaranteePaymentLimit')"
                    >
                        <template #suffix>
                            <span> 天 </span>
                        </template>
                    </el-input>
                </div>
            </el-form-item> -->
            <!-- 付款方式 -->
            <el-form-item label="付款方式" prop="agreePay">
                <div class="form-item__block">
                    <el-select
                        v-model="formData.agreePay"
                        :placeholder="showPlaceholder('请选择')"
                        filterable
                        clearable
                        :style="formItemContentStyle"
                    >
                        <el-option
                            v-for="item in cont_pay"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </div>
            </el-form-item>
            <!-- 买方入池上限金额 -->
            <el-form-item label="买方入池上限金额" prop="agreeBuyerPoolCeiling">
                <div class="form-item__block">
                    <el-input
                        v-model="formData.agreeBuyerPoolCeiling"
                        :placeholder="showPlaceholder('请输入买方入池上限金额')"
                        oninput="value=value.replace(/[^0-9]/g,'')"
                        clearable
                        :style="formItemContentStyle"
						maxlength="32"
						@input="handleInput($event,'agreeBuyerPoolCeiling')"
                    >
                        <template #suffix>
                            <span> 万元 </span>
                        </template>
                    </el-input>
                </div>
            </el-form-item>
            <!-- 超限处理办法 -->
            <el-form-item label="超限处理办法" prop="agreeOverrun">
                <div class="form-item__block">
                    <el-select
                        v-model="formData.agreeOverrun"
                        :placeholder="showPlaceholder('请选择')"
                        filterable
                        clearable
                        :style="formItemContentStyle"
                    >
                        <el-option
                            v-for="item in cont_overrun"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </div>
            </el-form-item>
            <!-- 业务类型 -->
            <el-form-item label="业务类型" prop="agreeInform" :required="true">
                <div class="form-item__block--half" style="margin-right: 10px;">
                    <el-select
                        v-model="formData.agreeInform"
                        filterable
                        clearable
                        :placeholder="showPlaceholder('请选择')"
                        :style="formItemContentStyle"
                        @change="handleInformChange()"
                    >
                        <el-option
                            v-for="item in proj_dd_type"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </div>
                <div class="form-item__block--half">
                    <el-input
                        v-model="formData.agreeInformOther"
						maxlength="32"
                        :placeholder="showPlaceholder('请输入')"
                        clearable
                        :style="formItemContentStyle"
                        :disabled="formData.agreeInform !== '6'"
                    />
                </div>
            </el-form-item>
            <!-- 是否全部转让 -->
            <el-form-item label="是否全部转让" prop="agreeTransferPart">
                <el-radio-group
                    v-model="formData.agreeTransferPart"
                    :style="formItemContentStyle"
                >
                    <el-radio
                        v-for="item in cont_transfer_part"
                        :key="item.value"
                        :label="item.value"
                    >
                        {{ item.label }}
                    </el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
    </el-card>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import {StrUtil} from '@/utils/StrUtil' 

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
    agreePaymentLimit: [
        { 
            required: true,
            message: "付款期限不能为空",
            trigger: "change" 
        }
    ],
    agreePaymentStartDate: [
        { 
            required: true,
            message: "起日不能为空",
            trigger: "change" 
        }
    ],
    agreePaymentEndDate: [
        { 
            required: true,
            message: "迄日不能为空",
            trigger: "change" 
        }
    ],
    agreePaymentVerify: [
        { 
            required: true,
            message: "对账期限不能为空",
            trigger: "change" 
        }
    ],
    agreeStartDate: [
        { 
            required: true,
            message: "初始日不能为空",
            trigger: "change" 
        }
    ],
    agreePaymentMaxLimit: [
        { 
            required: true,
            message: "最大付款期限不能为空",
            trigger: "change" 
        }
    ],
    agreeAdvanceGraceDays: [
        { 
            required: true,
            message: "垫款宽限期不能为空",
            trigger: "change" 
        }
    ],
    agreeInform: [
        {
            validator: validateInform,
            trigger: "change"
        }
    ]
});

// Form item 内容的统一宽度
const formItemContentStyle = { width: "100%" };

// 系统字典
const {
    cont_settlement,
    day,
    cont_advance,
    cont_pay,
    cont_overrun,
    proj_dd_type,
    cont_transfer_part
} = proxy.useDict(
    "cont_settlement",
    "day",
    "cont_advance",
    "cont_pay",
    "cont_overrun",
    "proj_dd_type",
    "cont_transfer_part"
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

// 验证业务类型
function validateInform(rule, value, callback) {
  if (StrUtil.isBlank(value)) {
    callback(new Error("业务类型不能为空"));
  } else {
    if (formData.agreeInform === "6" && StrUtil.isBlank(formData.agreeInformOther)) {
        callback(new Error("其他业务类型输入不能为空"));
    } else {
        callback();
    }
  }
}

// 结算方式改变方法
function handleSettlementChange() {
    formData.agreePaymentLimit = null;
    formData.agreePaymentStartDate = null;
    formData.agreePaymentEndDate = null;
    formData.agreePaymentVerify = null;
    formData.agreeStartDate = null;
    formData.agreePaymentMaxLimit = null;
}

// 改变是否垫付
function handleAdvanceChange() {
    formData.agreeAdvanceGraceDays = null;
    formData.agreeAdvancePercentage = null;
}

// 改变业务类型
function handleInformChange() {
    formData.agreeInformOther = null;
}

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

.form-item__block--half {
    width: 115px;
}

.form-item__placeholder {
    width: 390px;
    height: 30px;
}
</style>