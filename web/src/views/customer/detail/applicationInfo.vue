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
			<el-collapse-item title="保理申请人信息" name="2">
				<el-row :gutter="15" style="margin-right: 30px">
					<el-col :xl="6" :lg="8" :sm="12" :xs="24">
						<el-form-item label="联系人名称" prop="applyPersonName">
							<el-input
								class="fixed-width-input"
								v-model="formData.applyPersonName"
								placeholder="联系人名称"
								clearable
								maxlength="32"
							></el-input>
						</el-form-item>
					</el-col>
					<el-col :xl="6" :lg="8" :sm="12" :xs="24">
						<el-form-item label="申请人电话" prop="applyPersonMobileNumber">
							<el-input
								class="fixed-width-input"
								v-model="formData.applyPersonMobileNumber"
								placeholder="请输入申请人电话"
								oninput="value=value.replace(/[^0-9-+]/,'')"
								clearable
								maxlength="32"
							></el-input>
						</el-form-item>
					</el-col>
					<el-col :xl="6" :lg="8" :sm="12" :xs="24">
						<el-form-item label="电子邮箱" prop="applyPersonEmail">
							<el-input
								class="fixed-width-input"
								v-model="formData.applyPersonEmail"
								placeholder="请输入电子邮箱"
								oninput="value=value.replace(/[^0-9A-Za-z.@]/g,'')"
								clearable
								maxlength="128"
							></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24">
						<el-form-item label="送达地址" prop="applySendAddress">
							<el-input
								class="fixed-width-input"
								type="textarea"
								v-model="formData.applySendAddress"
								placeholder="请输入送达地址"
								clearable
								maxlength="1024"
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
	rules: {
		applyPersonName: [
			{ required: true, message: "联系人不能为空", trigger: "blur" }
		],
		applyPersonMobileNumber: [
			{ required: true, message: "联系电话不能为空", trigger: "blur" }
		],
		applyPersonEmail: [
			{ required: true, message: "邮箱不能为空", trigger: "blur" },
			{
				pattern: /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/,
				message: " 请输入正确的邮箱格式",
				trigger: "blur"
			}
		],
		applySendAddress: [
			{ required: true, message: "送达地址不能为空", trigger: "blur" }
		]
	} //验证规律
});

const { rules } = toRefs(dataScope);

let formData = ref({
	applyPersonName: "",
	applyPersonMobileNumber: "",
	applyPersonEmail: "",
	applySendAddress: ""
}); //不能修改const 定义的数据

watch(
	() => props.infoData,
	newValue => {
		formData.value.applyPersonName = newValue.loginName;
		formData.value.applyPersonMobileNumber = newValue.phone;
		formData.value.applyPersonEmail = newValue.phone;
		formData.value.applySendAddress = newValue.phone;
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
