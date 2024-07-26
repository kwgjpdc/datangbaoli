<template>
	<el-collapse v-model="activeCollapseNames">
		<el-collapse-item title="合同基本信息" name="baseInfo">
			<baseInfo
				ref="baseInfoRef"
				v-model:data="specialData"
				:routerQueryObj="props.routerQueryObj"
				v-model:loading="loading"
			/>
		</el-collapse-item>

		<el-collapse-item title="甲乙方签订信息" name="subjectInfo">
			<subjectInfo
				ref="subjectInfoRef"
				v-model:data="specialData"
				:routerQueryObj="props.routerQueryObj"
				v-model:loading="loading"
			/>
		</el-collapse-item>

		<el-collapse-item title="回款专户及保理专户" name="bankAccount">
			<bankAccount
				ref="bankAccountRef"
				v-model:data="specialData"
				:routerQueryObj="props.routerQueryObj"
				v-model:loading="loading"
			/>
		</el-collapse-item>

		<!-- <el-collapse-item title="应付款项银行账户" name="payableBankAccount">
			<payableBankAccount
				v-model:data="specialData"
				:routerQueryObj="props.routerQueryObj"
				v-model:loading="loading"
			/>
		</el-collapse-item> -->

		<el-collapse-item title="提前还款方式" name="earlyRepay">
			<earlyRepay
				ref="earlyRepayRef"
				v-model:data="specialData"
				:routerQueryObj="props.routerQueryObj"
				v-model:loading="loading"
			/>
		</el-collapse-item>

		<!-- <el-collapse-item title="保理融资款收取账户" name="financeBankAccount">
			<financeBankAccount
				v-model:data="specialData"
				:routerQueryObj="props.routerQueryObj"
				v-model:loading="loading"
			/>
		</el-collapse-item> -->

		<el-collapse-item title="应收账款转让通知" name="transferNotice">
			<transferNotice
				ref="transferNoticeRef"
				v-model:data="specialData"
				:routerQueryObj="props.routerQueryObj"
				v-model:loading="loading"
			/>
		</el-collapse-item>

		<el-collapse-item title="增信措施" name="creditEnhancement">
			<creditEnhancement
				ref="creditEnhancementRef"
				v-model:data="specialData"
				:routerQueryObj="props.routerQueryObj"
				v-model:loading="loading"
			/>
		</el-collapse-item>

		<el-collapse-item title="公证与自愿接受强制执行" name="notarization">
			<notarization
				ref="notarizationRef"
				v-model:data="specialData"
				:routerQueryObj="props.routerQueryObj"
				v-model:loading="loading"
			/>
		</el-collapse-item>

		<el-collapse-item title="送达" name="send">
			<send
				ref="sendRef"
				v-model:data="specialData"
				:routerQueryObj="props.routerQueryObj"
				v-model:loading="loading"
			/>
		</el-collapse-item>

		<el-collapse-item title="补充条款" name="supplement">
			<supplement
				ref="supplementRef"
				v-model:data="specialData"
				:routerQueryObj="props.routerQueryObj"
				v-model:loading="loading"
			/>
		</el-collapse-item>

		<el-collapse-item title="合同份数" name="severalContract">
			<severalContract
				ref="severalContractRef"
				v-model:data="specialData"
				v-model:loading="loading"
				:routerQueryObj="props.routerQueryObj"
			/>
		</el-collapse-item>
	</el-collapse>
</template>

<script setup>
import baseInfo from "./baseInfo.vue";
import subjectInfo from "./subjectInfo.vue";
import bankAccount from "./bankAccount.vue";
// import payableBankAccount from "./payableBankAccount.vue";
import earlyRepay from "./earlyRepay.vue";
// import financeBankAccount from "./financeBankAccount.vue";
import transferNotice from "./transferNotice.vue";
import creditEnhancement from "./creditEnhancement.vue";
import notarization from "./notarization.vue";
import send from "./send.vue";
import supplement from "./supplement.vue";
import severalContract from "./severalContract.vue";

// 展开的折叠配置
const activeCollapseNames = reactive([
	"baseInfo",
	"subjectInfo",
	"bankAccount",
	"payableBankAccount",
	"earlyRepay",
	"financeBankAccount",
	"transferNotice",
	"creditEnhancement",
	"notarization",
	"send",
	"supplement",
	"severalContract"
]);

const props = defineProps({
	data: {
		type: Object,
		default: {}
	},
	routerQueryObj: {
		type: Object,
		default: {}
	},
	loading: {
		type: Boolean,
		default: false
	}
});

const emit = defineEmits(["update:data", "update:loading"]);

const subjectInfoRef = ref(null);
const bankAccountRef = ref(null);
// const payableBankAccountRef = ref(null);
const earlyRepayRef = ref(null);
// const financeBankAccount = ref(null);
const transferNoticeRef = ref(null);
const creditEnhancementRef = ref(null);
const notarizationRef = ref(null);
const sendRef = ref(null);
const supplementRef = ref(null);
const severalContractRef = ref(null);

const validate = async callback => {
	let result = true;
	await subjectInfoRef.value.validate(valid => {
		result = result && valid;
	});
	await bankAccountRef.value.validate(valid => {
		result = result && valid;
	});
	await earlyRepayRef.value.validate(valid => {
		result = result && valid;
	});
	await transferNoticeRef.value.validate(valid => {
		result = result && valid;
	});
	await creditEnhancementRef.value.validate(valid => {
		result = result && valid;
	});
	await notarizationRef.value.validate(valid => {
		result = result && valid;
	});
	await sendRef.value.validate(valid => {
		result = result && valid;
	});
	await supplementRef.value.validate(valid => {
		result = result && valid;
	});
	await severalContractRef.value.validate(valid => {
		result = result && valid;
	});
	// const partFormData = proxy.$refs["attachInfoRef"].formData;
	// Object.assign(baseData.value, partFormData);
	callback(result);
};

// 数据对象
const specialData = ref(props.data);
watch(specialData, newValue => {
	emit("update:data", newValue);
});

// loading
const loading = ref(props.loading);
watch(loading, newValue => {
	emit("update:loading", newValue);
});

// 父组件可以调用的方法
defineExpose({
	validate
});
</script>
