<template>
	<div style="margin: 10px" class="mb-2 flex items-center text-sm">
		<span>{{ haha.c || "没数据啊" }}</span>

		<div>
			<el-button @click="hehe">点击</el-button>
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

const haha = reactive({
	a: 1,
	b: 2
});
console.log(proxy);

function inputClick() {
	alert(1111);
}

function btnClick() {
	haha.c = 3;
}

const Prom = new Promise(r => {
	setTimeout(() => {
		r(666);
	});
});

function hehe() {
	Prom.then(res => {
		return res;
	}).then(res2 => {
		debugger;
		console.log(res2);
	});
}

onMounted(() => {
	haha.value = {
		a: 1111
	};
});
</script>
