<template>
    <el-collapse v-model="activeCollapseNames">
        <el-collapse-item title="合同信息" name="contractInfo">
            <ContractInfo ref="contractInfoRef" v-model:data="baseData" :routerQueryObj="props.routerQueryObj" v-model:loading="loading" />
        </el-collapse-item>
        <el-collapse-item title="约定信息" name="agreementInfo">
            <AgreementInfo ref="agreementInfoRef" v-model:data="baseData" :routerQueryObj="props.routerQueryObj" />
        </el-collapse-item>
        <el-collapse-item title="利率信息" name="interestInfo">
            <InterestInfo ref="interestInfoRef" v-model:data="baseData.interestList" :routerQueryObj="props.routerQueryObj" v-model:loading="loading" />
        </el-collapse-item>
        <el-collapse-item title="费用信息" name="feeInfo">
            <FeeInfo v-model:data="baseData.feeList" :routerQueryObj="props.routerQueryObj" v-model:loading="loading" />
        </el-collapse-item>
        <el-collapse-item title="违约利率信息" name="defaultInterestInfo">
            <DefaultInterestInfo ref="defaultInterestInfoRef" v-model:data="baseData" :routerQueryObj="props.routerQueryObj" />
        </el-collapse-item>
        <el-collapse-item title="账户信息" name="accountInfo">
            <AccountInfo ref="accountInfoRef" v-model:data="baseData" :routerQueryObj="props.routerQueryObj" />
        </el-collapse-item>
        <el-collapse-item title="还款信息" name="repaymentInfo">
            <RepaymentInfo ref="repaymentInfoRef" v-model:data="baseData.paymentSequenceList" :routerQueryObj="props.routerQueryObj" />
        </el-collapse-item>
        <el-collapse-item title="其他" name="otherInfo">
            <OtherInfo ref="otherInfoRef" v-model:data="baseData" :routerQueryObj="props.routerQueryObj" />
        </el-collapse-item>
        <el-collapse-item title="附件信息" name="attachInfo">
            <AttachInfo ref="attachInfoRef" :commonFileList="baseData.commonFileList" :contractId="baseData.contractId + ''" :routerQueryObj="props.routerQueryObj" />
        </el-collapse-item>
    </el-collapse>
</template>

<script setup>
import { reactive, ref, watch } from "vue";
import ContractInfo from "./contractInfo.vue";
import AgreementInfo from "./agreementInfo.vue";
import InterestInfo from "./interestInfo.vue";
import FeeInfo from "./feeInfo.vue";
import DefaultInterestInfo from "./defaultInterestInfo.vue";
import AccountInfo from "./accountInfo.vue";
import RepaymentInfo from "./repaymentInfo.vue";
import OtherInfo from "./otherInfo.vue";
import AttachInfo from "./attachInfo.vue";
const { proxy } = getCurrentInstance();

// 定义组件属性
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
    },
	approveId: {
		type: Number
	}
});

// 定义组件事件
const emit = defineEmits(["update:data", "update:loading"]);

// 数据对象
const baseData = ref(props.data);
watch(baseData, (newValue) => {
	console.log("update")
    emit("update:data", newValue);
});

// 定义 loading 触发
const loading = ref(props.loading);
watch(loading, (newValue) => {
	console.log("***************")
    emit("update:loading", newValue);
});

// 展开的折叠配置
const activeCollapseNames = reactive([
    "contractInfo",
    "agreementInfo",
    "interestInfo",
    "feeInfo",
    "defaultInterestInfo",
    "accountInfo",
    "repaymentInfo",
    "otherInfo",
    "attachInfo"
]);

// 合同信息
const contractInfoRef = ref(null);

// 约定信息
const agreementInfoRef = ref(null);

// 违约利率信息
const defaultInterestInfoRef = ref(null);

// 账户信息
const accountInfoRef = ref(null);

// 还款信息
const repaymentInfoRef = ref(null);

// 其他
const otherInfoRef = ref(null);

// 
const attachInfoRef = ref(null);

const validate = async (callback) => {
    let result = true;
    await contractInfoRef.value.validate((valid) => {
        result = result && valid;
    });
    await agreementInfoRef.value.validate((valid) => {
        result = result && valid;
    });
    await defaultInterestInfoRef.value.validate((valid) => {
        result = result && valid;
    });
    await accountInfoRef.value.validate((valid) => {
        result = result && valid;
    });
    await otherInfoRef.value.validate((valid) => {
        result = result && valid;
    });
	const partFormData = proxy.$refs["attachInfoRef"].formData;
	Object.assign(baseData.value, partFormData);
    callback(result);
};

// 父组件可以调用的方法
defineExpose({
    validate
});
</script>

<style lang="scss" scoped>
	
</style>