<template>
	<div class="mb-2 flex items-center text-sm">
		{{ haha.a }}
	</div>
</template>

<script setup>
import { ref, reactive, onMounted, toRefs } from "vue";

const haha = ref({
	a: 1,
	b: 2
});

// const data = reactive({
// 	haha: 1
// });

// const data2 = toRefs(data);

onMounted(() => {
	haha.value = {
		a: 1111,
	};
});
</script>
