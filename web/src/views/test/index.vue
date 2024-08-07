<template>
	<div style="margin: 10px" class="mb-2 flex items-center text-sm">
		<span>{{ haha.c || "没数据啊" }}</span>

		<div>
			<el-button @click="btnClick">点击</el-button>
		</div>

		<el-input
			value="111"
			placeholder="请输入"
			@click="inputClick"
			readonly
			suffix-icon="el-icon-search"
			disabled
			style="width: 200px"
		/>
	</div>
</template>

<script setup>
import { ref, reactive, onMounted, toRefs, getCurrentInstance } from "vue";

const { proxy } = getCurrentInstance();

console.log(proxy);

function inputClick() {
	alert(1111);
}

function btnClick() {
	haha.c = 3;
}

const haha = reactive({
	a: 1,
	b: 2
});

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
