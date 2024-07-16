<template>
	<el-form
		class="info-form"
		ref="elForm"
		:model="formData"
		:rules="rules"
		label-width="140px"
		:disabled="props.routerQueryObj.viewFlag"
	>
		<el-collapse v-model="activeNames" style="border-top: 0">
			<el-collapse-item title="移动端登录认证" name="2">
				<el-row :gutter="15" style="margin-right: 30px">
					<el-col :xl="6" :lg="8" :sm="12" :xs="24">
						<el-form-item label="大唐云端登陆人名称" prop="loginName">
							<el-input
								class="fixed-width-input"
								v-model="formData.loginName"
								placeholder="请输入大唐云端登陆人名称"
								clearable
								maxlength="32"
							></el-input>
						</el-form-item>
					</el-col>
					<el-col :xl="6" :lg="8" :sm="12" :xs="24">
						<el-form-item label="大唐云端登录手机号" prop="phone">
							<el-input
								class="fixed-width-input"
								v-model="formData.phone"
								placeholder="请输入大唐云端登录手机号"
								oninput="value=value.replace(/[^0-9]/g,'')"
								clearable
								maxlength="11"
							></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-collapse-item>
		</el-collapse>
	</el-form>
</template>

<script setup>
const { proxy } = getCurrentInstance();
const props = defineProps({
	infoData: {
		type: Object,
		default: null
	},
	customerId: {
		type: String,
		default: ""
	},
	routerQueryObj: {
		type: Object,
		default: null
	}
});

const activeNames = ref(["2"]);
const dataScope = reactive({
	rules: {} //验证规律
});

const { rules } = toRefs(dataScope);

let formData = ref({
	loginName: "",
	phone: ""
}); //不能修改const 定义的数据

watch(
	() => props.infoData,
	newValue => {
		formData.value.loginName = newValue.loginName;
		formData.value.phone = newValue.phone;
	},
	{ immediate: true, deep: true }
);

// 表单验证
function validForm() {
	let result = false;
	this.$refs["elForm"].validate(valid => {
		result = valid;
	});
	return result;
}

defineExpose({
	formData,
	validForm
});
</script>

<style lang="scss">
.box-card {
	margin-bottom: 20px;
}

.page {
	margin-top: 10px;
}
</style>
