<template>
    <el-collapse v-model="activeCollapseNames">
        <el-collapse-item title="客户证照信息" name="cardInfo">
            <CardInfo ref="cardInfoRef" v-model:data="customerData.customerCardList" :routerQueryObj="props.routerQueryObj" />
        </el-collapse-item>
        <el-collapse-item title="客户股东信息" name="shareholderInfo">
            <ShareholderInfo ref="shareholderInfoRef" v-model:data="customerData.customerShareholderList" :routerQueryObj="props.routerQueryObj" />
        </el-collapse-item>
        <el-collapse-item title="客户经营住所" name="businessInfo">
            <ResidenceInfo ref="residenceInfoRef" v-model:data="customerData.customerResidenceList" :routerQueryObj="props.routerQueryObj" />
        </el-collapse-item>
        <el-collapse-item title="客户高管信息" name="executiveInfo">
            <SeniorExecutiveInfo ref="seniorExecutiveInfoRef" v-model:data="customerData.customerSeniorExecutiveList" :routerQueryObj="props.routerQueryObj" />
        </el-collapse-item>
        <el-collapse-item title="客户税务信息" name="taxInfo">
            <TaxInfo ref="taxInfoRef" v-model:data="customerData.customerTaxList" :routerQueryObj="props.routerQueryObj" />
        </el-collapse-item>
    </el-collapse>
</template>

<script setup>
import { reactive, watch } from "vue";
import CardInfo from "./cardInfo.vue";
import ShareholderInfo from "./shareholderInfo.vue";
import ResidenceInfo from "./residenceInfo.vue";
import SeniorExecutiveInfo from "./seniorExecutiveInfo.vue";
import TaxInfo from "./taxInfo.vue";

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
    }
});

// 定义组件事件
const emit = defineEmits(["update:data", "update:loading"]);

// 数据对象
const customerData = reactive(props.data);
watch(customerData, (newValue) => {
    emit("update:data", newValue);
});

// 定义 loading 触发
const loading = ref(props.loading);
watch(loading, (newValue) => {
    emit("update:loading", newValue);
});

// 展开的折叠配置
const activeCollapseNames = reactive([
    "cardInfo",
    "shareholderInfo",
    "businessInfo",
    "executiveInfo",
    "taxInfo"
]);
</script>

<style lang="scss" scoped>
</style>