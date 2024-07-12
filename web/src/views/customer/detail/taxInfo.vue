<template>
	<el-collapse v-model="activeNames">
		<el-collapse-item title="客户税务信息" name="1">
			<el-card>
				<!-- 操控区 -->
				<template #header v-if="!isView">
					<!-- 新增按钮 -->
					<el-button
						style="float: right; padding: 3px 0"
						type="primary"
						link
						@click="openAddDialog()"
					>
						新增
					</el-button>
					<!-- 删除按钮 -->
					<el-button
						style="float: right; padding: 3px 0; margin-right: 20px"
						type="primary"
						link
						@click="handleBatchDelete()"
						:disabled="deleteIsDisabled"
					>
						删除
					</el-button>
				</template>
				<!-- 表格 -->
				<el-table
					:data="showInfoList"
					@selection-change="handleSelectionChange"
				>
					<!-- Checkbox -->
					<el-table-column
						type="selection"
						width="55"
						align="center"
						v-if="!isView"
					/>
					<!-- 纳税人识别号 -->
					<el-table-column
						label="纳税人识别号"
						prop="taxpayerIdNo"
						align="center"
					/>
					<!-- 类型 -->
					<el-table-column label="类型" prop="taxpayerType" align="center">
						<template #default="scope">
							<dict-tag
								:options="cont_tax_type"
								:value="scope.row.taxpayerType"
							/>
						</template>
					</el-table-column>
					<!-- 开户行 -->
					<el-table-column label="开户行" prop="bankName" align="center" />
					<!-- 账号 -->
					<el-table-column label="账号" prop="bankAccountNo" align="center" />
					<!-- 发票抬头 -->
					<el-table-column
						label="发票抬头"
						prop="invoiceTitle"
						align="center"
					/>
					<!-- 邮箱 -->
					<el-table-column label="邮箱" prop="taxpayerEmail" align="center" />
					<!-- 操作 -->
					<el-table-column
						label="操作"
						align="center"
						class-name="small-padding fixed-width"
					>
						<template #default="scope">
							<el-button
								link
								type="primary"
								icon="Edit"
								@click="handleUpdate(scope.row)"
								title="修改"
							></el-button>
							<el-button
								link
								type="primary"
								icon="Delete"
								@click="handleDelete(scope.row)"
								title="删除"
								v-if="!isView"
							></el-button>
						</template>
					</el-table-column>
				</el-table>
				<pagination
					v-show="total > 0"
					:total="total"
					v-model:page="queryParams.pageNum"
					v-model:limit="queryParams.pageSize"
					id="tax-info-pagination"
				/>
				<!-- Dialog -->
				<el-dialog
					:title="dialogTitle"
					v-model="dialogVisible"
					width="800px"
					append-to-body
					@close="handleCloseDialog"
				>
					<el-form
						ref="elFormRef"
						:model="dialogFormData"
						:rules="isView ? {} : rules"
						label-width="110px"
						:disabled="isView"
					>
						<el-row>
							<el-col :span="11">
								<el-form-item label="纳税人识别号" prop="taxpayerIdNo">
									<el-input
										v-model="dialogFormData.taxpayerIdNo"
										:placeholder="showPlaceholder('请输入纳税人识别号')"
										:style="formItemContentStyle"
										maxlength="32"
										oninput="value=value.replace(/[^0-9A-Za-z]/g,'')"
									/>
								</el-form-item>
							</el-col>
							<el-col :span="11" :offset="2">
								<el-form-item label="类型" prop="taxpayerType">
									<el-select
										v-model="dialogFormData.taxpayerType"
										:placeholder="showPlaceholder('请选择')"
										filterable
										clearable
										:style="formItemContentStyle"
									>
										<el-option
											v-for="item in cont_tax_type"
											:key="item.value"
											:label="item.label"
											:value="item.value"
										/>
									</el-select>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="11">
								<el-form-item label="电话" prop="taxpayerPhoneNo">
									<el-input
										v-model="dialogFormData.taxpayerPhoneNo"
										:placeholder="showPlaceholder('请输入电话')"
										:style="formItemContentStyle"
										maxlength="32"
										oninput="value=value.replace(/[^0-9-+]/,'')"
									/>
								</el-form-item>
							</el-col>
							<el-col :span="11" :offset="2">
								<el-form-item label="地址" prop="taxpayerAddr">
									<el-input
										v-model="dialogFormData.taxpayerAddr"
										maxlength="64"
										:placeholder="showPlaceholder('请输入地址')"
										:style="formItemContentStyle"
									/>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="11">
								<el-form-item label="开户行" prop="bankName">
									<el-input
										v-model="dialogFormData.bankName"
										maxlength="32"
										:placeholder="showPlaceholder('请输入开户行')"
										:style="formItemContentStyle"
									/>
								</el-form-item>
							</el-col>
							<el-col :span="11" :offset="2">
								<el-form-item label="开户行账号" prop="bankAccountNo">
									<el-input
										v-model="dialogFormData.bankAccountNo"
										:placeholder="showPlaceholder('请输入开户行账号')"
										:style="formItemContentStyle"
										maxlength="32"
										oninput="value=value.replace(/[^0-9A-Za-z]/g,'')"
									/>
								</el-form-item>
							</el-col>
						</el-row>

						<el-row>
							<el-col :span="11">
								<el-form-item label="发票抬头" prop="invoiceTitle">
									<el-input
										v-model="dialogFormData.invoiceTitle"
										maxlength="64"
										:placeholder="showPlaceholder('请输入发票抬头')"
										:style="formItemContentStyle"
									/>
								</el-form-item>
							</el-col>
							<el-col :span="11" :offset="2">
								<el-form-item label="邮箱" prop="taxpayerEmail">
									<el-input
										v-model="dialogFormData.taxpayerEmail"
										:placeholder="showPlaceholder('请输入纳税人邮箱')"
										:style="formItemContentStyle"
										maxlength="64"
										oninput="value=value.replace(/[^0-9A-Za-z.@]/g,'')"
									/>
								</el-form-item>
							</el-col>
						</el-row>

						<el-row>
							<el-col :span="24">
								<el-form-item label="备注" prop="remark">
									<el-input
										v-model="dialogFormData.remark"
										type="textarea"
										maxlength="255"
										:placeholder="showPlaceholder('请输入内容')"
										:style="formItemContentStyle"
									/>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row v-if="!isView">
							<el-col :span="24">
								<el-form-item>
									<el-button type="primary" @click="handleSave">
										保存
									</el-button>
									<el-button type="primary" @click="handleCloseDialog">
										取消
									</el-button>
								</el-form-item>
							</el-col>
						</el-row>
					</el-form>
				</el-dialog>
			</el-card>
		</el-collapse-item>
	</el-collapse>
</template>

<script setup>
import { ref, reactive, computed, watch } from "vue";
import { deepClone } from "@/utils/index";

// 组件属性
const props = defineProps({
	infoData: {
		type: Array,
		default: []
	},
	routerQueryObj: {
		type: Object,
		default: {}
	}
});

// vue实例对象
const { proxy } = getCurrentInstance();

// 系统字典
const { cont_tax_type } = proxy.useDict("cont_tax_type");

// 表格数据集合
let formData = ref({});

// 表格删除按钮状态
const deleteIsDisabled = ref(true);

// 表格选择数据集合
let tableSelection = reactive([]);

// Dialog表单对象
const elFormRef = ref(null);

// Dialog表单数据
const dialogFormData = ref({
	taxpayerIdNo: null,
	taxpayerType: null,
	taxpayerPhoneNo: null,
	taxpayerAddr: null,
	bankName: null,
	bankAccountNo: null,
	invoiceTitle: null,
	taxpayerEmail: null,
	remark: null
});

// Dialog表单验证规则
const rules = ref({
	taxpayerIdNo: [
		{
			required: true,
			pattern: "[^\x20]+",
			message: "纳税人识别号不能为空",
			trigger: "blur"
		}
	],
	taxpayerType: [
		{
			required: true,
			message: "纳税人类型不能为空",
			trigger: "blur"
		}
	],
	taxpayerEmail: [
		{
			required: true,
			message: "纳税人邮箱不能为空",
			trigger: "blur"
		},
		{
			// pattern: /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/,
			pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
			message: " 请输入正确的客户邮箱",
			trigger: "change"
		}
	],
	bankName: [
		{
			required: true,
			message: "开户行名称不能为空",
			trigger: "blur"
		}
	],
	invoiceTitle: [
		{
			required: true,
			message: "发票抬头不能为空",
			trigger: "blur"
		}
	],
	taxpayerAddr: [
		{
			required: true,
			message: "纳税人地址不能为空",
			trigger: "blur"
		}
	],
	taxpayerPhoneNo: [
		{
			required: true,
			message: "纳税人电话不能为空",
			trigger: "blur"
		}
	],
	bankAccountNo: [
		{
			required: true,
			message: "开户行账号不能为空",
			trigger: "blur"
		}
	]
});

// Dialog表格内容的统一宽度
const formItemContentStyle = { width: "100%" };

const activeNames = ref(["1"]); //tab打开状态

// Dialog标题
const dialogTitle = ref("");

// Dialog显示
const dialogVisible = ref(false);

// Dialog状态
const dialogStatus = reactive({
	type: "create", // create, edit
	row: undefined
});

// 分页配置
const queryParams = reactive({
	pageNum: 1,
	pageSize: 10
});

// 页面是View状态
const isView = computed(() => {
	let result = false;
	if (
		props.routerQueryObj.viewFlag === undefined ||
		props.routerQueryObj.viewFlag === null
	) {
		result = false;
	} else {
		result = props.routerQueryObj.viewFlag;
	}
	return result;
});

// 分页数据总数
const total = computed(() => {
	return formData.value.custInvoiceInfoList.length;
});

// 显示数据集合
const showInfoList = computed(() => {
	const start = queryParams.pageSize * (queryParams.pageNum - 1);
	const end = queryParams.pageNum * queryParams.pageSize;
	return formData.value.custInvoiceInfoList.slice(start, end);
});

watch(
	props.infoData,
	(newValue, oldValue) => {
		if (newValue) {
			formData.value.custInvoiceInfoList = deepClone(newValue);
		}
	},
	{ immediate: true }
);

// 表格选择器触发事件
function handleSelectionChange(selection) {
	tableSelection = selection;
	deleteIsDisabled.value = !(selection.length > 0);
}

// 删除表格多条数据
function handleBatchDelete() {
	proxy.$modal
		.confirm("是否确认删除选择的数据项？")
		.then(() => {
			tableSelection.forEach(data => {
				const index = formData.value.custInvoiceInfoList.indexOf(data);
				if (index !== -1) {
					formData.value.custInvoiceInfoList.splice(index, 1);
				}
			});
		})
		.catch(e => {
			console.log(e);
		});
}

// 删除表格一条数据
function handleDelete(data) {
	proxy.$modal
		.confirm("是否确认删除选择的数据项？")
		.then(function () {
			const index = formData.value.custInvoiceInfoList.indexOf(data);
			if (index !== -1) {
				formData.value.custInvoiceInfoList.splice(index, 1);
			}
		})
		.catch(e => {
			console.log(e);
		});
}

// 修改表格一条数据
function handleUpdate(data) {
	dialogFormData.value = deepClone(data);
	dialogStatus.type = "edit";
	dialogStatus.row = data;
	dialogTitle.value = isView ? "查看客户税务信息" : "编辑客户税务信息";
	dialogVisible.value = true;
}

// Dialog验证表单
async function validate(callback) {
	await elFormRef.value.validate((valid, fields) => {
		callback(valid, fields);
	});
}

// 打开Dialog
function openAddDialog() {
	dialogFormData.value = {
		taxpayerIdNo: null,
		taxpayerType: null,
		taxpayerPhoneNo: null,
		taxpayerAddr: null,
		bankName: null,
		bankAccountNo: null,
		remark: null
	};
	dialogStatus.type = "create";
	dialogTitle.value = "新增客户税务信息";
	dialogVisible.value = true;
}

// 关闭Dialog
function handleCloseDialog() {
	elFormRef.value.resetFields();
	dialogVisible.value = false;
}

// 保存Dialog表单
function handleSave() {
	validate(valid => {
		if (valid) {
			if (dialogStatus.type === "create") {
				formData.value.custInvoiceInfoList.unshift(
					deepClone(dialogFormData.value)
				);
			} else if (dialogStatus.type === "edit") {
				const index = formData.value.custInvoiceInfoList.indexOf(
					dialogStatus.row
				);
				formData.value.custInvoiceInfoList.splice(
					index,
					1,
					deepClone(dialogFormData.value)
				);
			}
			dialogVisible.value = false;
		}
	});
}

// 显示placeholder占位字符
function showPlaceholder(txt) {
	return isView.value ? " " : txt;
}

// 将formData暴露出去父组件取值；
defineExpose({
	formData
});
</script>

<style lang="scss">
#tax-info-pagination .el-pagination {
	position: relative;
}
</style>
