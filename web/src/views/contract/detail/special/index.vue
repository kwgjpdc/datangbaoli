<template>
	<el-collapse v-model="activeCollapseNames">
		<el-collapse-item title="甲乙方签订信息" name="subjectInfo">
			<subjectInfo />
		</el-collapse-item>
	</el-collapse>
</template>

<script setup>
import subjectInfo from "./subjectInfo.vue";

// 展开的折叠配置
const activeCollapseNames = reactive(["subjectInfo"]);
</script>
