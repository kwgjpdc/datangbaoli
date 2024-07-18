<template>
	<div class="mb-2 flex items-center text-sm">
		<el-radio-group v-model="radio1" class="ml-4">
			<el-radio value="1" label="1" size="large">Option 1</el-radio>
			<el-radio value="2" label="2" size="large">Option 2</el-radio>
		</el-radio-group>
	</div>
</template>

<script setup>
import { ref } from "vue";

const radio1 = ref("1");
const radio2 = ref("1");
const radio3 = ref("1");
</script>
