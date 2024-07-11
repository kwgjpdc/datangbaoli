<template>
	<div>
		<div>客户账号列表列表列表列表列表</div>

		<el-button @click="handleAdd">新增</el-button>
	</div>
</template>

<script setup>
const router = useRouter();
function handleAdd() {
	router.push("/customer/account/detail");
}
</script>
