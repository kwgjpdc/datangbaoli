<template>
	<div class="mb-2 flex items-center text-sm">
		{{ data.haha || 66 }}
	</div>
</template>

<script setup>
import { ref, reactive, onMounted, toRefs } from "vue";

const data = reactive({
	haha: 1
});

const data2 = toRefs(data);

onMounted(() => {
	let { haha } = data2;
	haha.value = 2;
});
</script>
