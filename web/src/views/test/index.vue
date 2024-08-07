<template>
	<div class="mb-2 flex items-center text-sm">
		<span>{{ haha[2] || "没数据啊" }}</span>

		<div>
			<el-button @click="btnClick">点击</el-button>
		</div>
	</div>
</template>

<script setup>
import { ref, reactive, onMounted, toRefs } from "vue";

function btnClick() {
	haha.value[2] = 3;
}

const haha = ref(["1", "2"]);

// const data = reactive({
// 	haha: 1
// });

// const data2 = toRefs(data);

onMounted(() => {
	haha.value = {
		a: 1111
	};
});
</script>
