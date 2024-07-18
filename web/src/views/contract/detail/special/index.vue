<template>
	<el-collapse v-model="activeCollapseNames">
		<el-collapse-item title="甲乙方签订信息" name="subjectInfo">
			<subjectInfo
				v-model:data="specialData"
				:routerQueryObj="props.routerQueryObj"
				v-model:loading="loading"
			/>
		</el-collapse-item>

		<el-collapse-item title="回款专户及保理专户" name="bankAccountInfo">
			<bankAccount
				v-model:data="specialData"
				:routerQueryObj="props.routerQueryObj"
				v-model:loading="loading"
			/>
		</el-collapse-item>
	</el-collapse>
</template>

<script setup>
import subjectInfo from "./subjectInfo.vue";
import bankAccount from "./bankAccount.vue";

// 展开的折叠配置
const activeCollapseNames = reactive(["subjectInfo", "bankAccountInfo"]);

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
	console.log("***************");
	emit("update:loading", newValue);
});
</script>
