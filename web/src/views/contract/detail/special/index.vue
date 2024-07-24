<template>
	11111111111
	<!-- <el-collapse v-model="activeCollapseNames">
		<el-collapse-item title="甲乙方签订信息" name="subjectInfo">
			<subjectInfo
				v-model:data="specialData"
				:routerQueryObj="props.routerQueryObj"
				v-model:loading="loading"
			/>
		</el-collapse-item>

		<el-collapse-item title="回款专户及保理专户" name="bankAccount">
			<bankAccount
				v-model:data="specialData"
				:routerQueryObj="props.routerQueryObj"
				v-model:loading="loading"
			/>
		</el-collapse-item>

		<el-collapse-item title="应付款项银行账户" name="payableBankAccount">
			<payableBankAccount
				v-model:data="specialData"
				:routerQueryObj="props.routerQueryObj"
				v-model:loading="loading"
			/>
		</el-collapse-item>

		<el-collapse-item title="提前还款方式" name="earlyRepay">
			<earlyRepay
				v-model:data="specialData"
				:routerQueryObj="props.routerQueryObj"
				v-model:loading="loading"
			/>
		</el-collapse-item>

		<el-collapse-item title="保理融资款收取账户" name="financeBankAccount">
			<financeBankAccount
				v-model:data="specialData"
				:routerQueryObj="props.routerQueryObj"
				v-model:loading="loading"
			/>
		</el-collapse-item>

		<el-collapse-item title="应收账款转让通知" name="transferNotice">
			<transferNotice
				v-model:data="specialData"
				:routerQueryObj="props.routerQueryObj"
				v-model:loading="loading"
			/>
		</el-collapse-item>

		<el-collapse-item title="增信措施" name="creditEnhancement">
			<creditEnhancement
				v-model:data="specialData"
				:routerQueryObj="props.routerQueryObj"
				v-model:loading="loading"
			/>
		</el-collapse-item>

		<el-collapse-item title="公证与自愿接受强制执行" name="notarization">
			<notarization
				v-model:data="specialData"
				:routerQueryObj="props.routerQueryObj"
				v-model:loading="loading"
			/>
		</el-collapse-item>

		<el-collapse-item title="送达" name="notarization">
			<send
				v-model:data="specialData"
				:routerQueryObj="props.routerQueryObj"
				v-model:loading="loading"
			/>
		</el-collapse-item>

		<el-collapse-item title="补充条款" name="supplement">
			<supplement
				v-model:data="specialData"
				:routerQueryObj="props.routerQueryObj"
				v-model:loading="loading"
			/>
		</el-collapse-item>

		<el-collapse-item title="合同份数" name="severalContract">
			<severalContract
				v-model:data="specialData"
				v-model:loading="loading"
				:routerQueryObj="props.routerQueryObj"
			/>
		</el-collapse-item>
	</el-collapse> -->
</template>

<script setup>
import subjectInfo from "./subjectInfo.vue";
import bankAccount from "./bankAccount.vue";
import payableBankAccount from "./payableBankAccount.vue";
import earlyRepay from "./earlyRepay.vue";
import financeBankAccount from "./financeBankAccount.vue";
import transferNotice from "./transferNotice.vue";
import creditEnhancement from "./creditEnhancement.vue";
import notarization from "./notarization.vue";
import send from "./send.vue";
import supplement from "./supplement.vue";
import severalContract from "./severalContract.vue";

// 展开的折叠配置
const activeCollapseNames = reactive([
	"subjectInfo",
	"bankAccount",
	"payableBankAccount",
	"earlyRepay",
	"financeBankAccount",
	"transferNotice",
	"creditEnhancement",
	"notarization",
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
</script>
