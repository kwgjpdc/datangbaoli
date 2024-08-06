<template>
	<div class="info-form">
		<el-form ref="elForm" :model="formData" label-width="140px">
			<el-collapse v-model="activeNames" style="border-top: 0">
				<el-collapse-item title="客户银行账号信息" name="8">
					<!--  联系方式表格-->
					<el-card class="box-card">
						<template #header v-if="!props.routerQueryObj.viewFlag">
							<!-- <span>联系方式</span> -->
							<el-button
								style="float: right; padding: 3px 0"
								type="primary"
								link
								@click="handleDelete()"
								:disabled="single"
								>删除</el-button
							>
							<el-button
								style="float: right; padding: 3px 0; margin-right: 20px"
								type="primary"
								link
								@click="addAccount()"
								>新增</el-button
							>
						</template>
						<el-table
							:data="formData.bankInfoList"
							@selection-change="handleSelectionChange"
						>
							<el-table-column
								type="selection"
								width="55"
								align="center"
								:disabled="props.routerQueryObj.viewFlag"
							/>
							<el-table-column
								label="账号种类"
								align="center"
								prop="accountType"
							>
								<template #default="scope">
									<dict-tag
										:options="cust_account_type"
										:value="scope.row.accountType"
									/>
								</template>
							</el-table-column>
							<el-table-column label="币种" align="center" prop="currencyType">
								<template #default="scope">
									<dict-tag
										:options="sys_currency_type"
										:value="scope.row.currencyType"
									/>
								</template>
							</el-table-column>
							<el-table-column
								label="开户行"
								align="center"
								prop="accountBankInfo"
							>
							</el-table-column>
							<el-table-column label="账号" align="center" prop="accountInfo">
							</el-table-column>
							<el-table-column label="户名" align="center" prop="accountName">
							</el-table-column>

							<el-table-column
								label="操作"
								align="center"
								fixed="right"
								width="150"
								class-name="small-padding fixed-width"
								v-if="!props.routerQueryObj.viewFlag"
							>
								<template #default="scope">
									<el-button
										link
										type="primary"
										icon="Edit"
										@click="handleUpdate(scope.row, scope.$index)"
										v-hasPermi="['cust:contact:edit']"
										title="修改"
									></el-button>
									<el-button
										link
										type="primary"
										icon="Delete"
										@click="handleDelete(scope.row)"
										v-hasPermi="['cust:contact:remove']"
										title="删除"
									></el-button>
								</template>
							</el-table-column>
						</el-table>
					</el-card>
				</el-collapse-item>
			</el-collapse>
		</el-form>
		<!-- 添加或修改用户配置对话框 -->
		<el-dialog
			title="客户账户"
			:model-value="openAccountAdd"
			width="800px"
			@closed="closeAccountAdd(false)"
		>
			<el-form
				ref="formInput"
				label-width="110px"
				:model="accountFormInput"
				:rules="accountAddrules"
			>
				<el-row>
					<el-col :span="12">
						<el-form-item label="账号种类" prop="accountType">
							<el-select
								v-model="accountFormInput.accountType"
								filterable
								placeholder="请选择"
								:style="{ width: '240px' }"
							>
								<el-option
									v-for="item in cust_account_type"
									:key="item.value"
									:label="item.label"
									:value="item.value"
								>
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="币种" prop="currencyType">
							<el-select
								v-model="accountFormInput.currencyType"
								filterable
								placeholder="请选择"
								:style="{ width: '240px' }"
							>
								<el-option
									v-for="item in sys_currency_type"
									:key="item.value"
									:label="item.label"
									:value="item.value"
								>
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="开户行" prop="accountBankInfo">
							<el-input
								placeholder="请输入开户行"
								maxlength="64"
								v-model="accountFormInput.accountBankInfo"
								:style="{ width: '240px' }"
							></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="账号" prop="accountInfo">
							<el-input
								placeholder="请输入账号"
								maxlength="64"
								v-model="accountFormInput.accountInfo"
								:style="{ width: '240px' }"
							></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="户名" prop="accountName">
							<el-input
								placeholder="请输入户名"
								maxlength="64"
								v-model="accountFormInput.accountName"
								:style="{ width: '240px' }"
							></el-input>
						</el-form-item>
					</el-col>

					<!-- <el-col :span="12">
						<el-form-item label="流水余额" prop="accountCapitalInfo">
							<ElPriceInput
								v-model:form="accountFormInput"
								prop="accountCapitalInfo"
								:rules="rules"
								:disabled="props.routerQueryObj.viewFlag"
								:placeholder="'请输入'"
								:width="240"
							>
								<template #prefix>
									<span> ￥ </span>
								</template>
								<template #suffix>
									<span> 元 </span>
								</template>
							</ElPriceInput>
						</el-form-item>
					</el-col> -->
				</el-row>

				<el-row justify="center">
					<el-button type="primary" @click="saveAccount">保存</el-button>
					<el-button type="primary" @click="closeAccountAdd(false)"
						>取消</el-button
					>
				</el-row>
			</el-form>
		</el-dialog>
	</div>
</template>

<script setup>
import { deepClone } from "@/utils/index";

const { proxy } = getCurrentInstance();

const props = defineProps({
	infoData: {
		type: Array,
		default: []
	},
	customerId: {
		type: String,
		default: ""
	},
	baseInfoRef: {
		type: Object,
		default: {}
	},
	routerQueryObj: {
		type: Object,
		default: null
	}
});

const { sys_currency_type, cust_account_type } = proxy.useDict(
	"sys_currency_type",
	"cust_account_type"
);

const activeNames = ref(["8"]); //tab打开状态

let openAccountAdd = ref(false); //新增账号弹窗

const ids = ref([]);

const single = ref(true);

const multiple = ref(true);

const dataScope = reactive({
	accountAddrules: {
		accountType: [
			{ required: true, message: "账号种类不能为空", trigger: "change" }
		],
		currencyType: [
			{ required: true, message: "币种不能为空", trigger: "change" }
		],
		accountBankInfo: [
			{ required: true, message: "开户行不能为空", trigger: "change" }
		],
		accountInfo: [
			{ required: true, message: "账号不能为空", trigger: "change" }
		],
		accountName: [
			{ required: true, message: "户名不能为空", trigger: "change" }
		]
	}
});

const { accountAddrules } = toRefs(dataScope);

const formData = ref({}); //不能修改const 定义的数据

const accountFormInput = ref({
	accountType: null,
	currencyType: null,
	accountBankInfo: null,
	accountName: null,
	accountInfo: null, // 账号
	accountCapitalInfo: null
}); //后面要进行修改的对象用let定义

const curtIndex = ref(-1);

watch(
	() => props.infoData,
	newValue => {
		if (newValue) {
			formData.value.bankInfoList = deepClone(newValue);
		}
	},
	{ immediate: true }
);

/*-----------------------------------------------------------------------------------*/

// 保存账号到contactList
function saveAccount() {
	proxy.$refs["formInput"].validate(valid => {
		// accountFormInput.value.accountInfo 账号

		if (valid) {
			if (accountFormInput.value.type) {
				if (
					formData.value.bankInfoList
						.filter((item, index) => index !== curtIndex.value)
						.some(
							item => item.accountInfo === accountFormInput.value.accountInfo
						)
				) {
					return proxy.$message.warning("【账号】已存在！");
				}

				// 修改
				formData.value.bankInfoList = formData.value.bankInfoList.map(
					(list, index) => {
						if (index === curtIndex.value) {
							list = accountFormInput.value;
						}
						return list;
					}
				);
			} else {
				if (
					formData.value.bankInfoList.some(
						item => item.accountInfo === accountFormInput.value.accountInfo
					)
				) {
					return proxy.$message.warning("【账号】已存在！");
				}

				// 新增
				formData.value.bankInfoList.push(accountFormInput.value);
			}
			resetAccountFormInput();
			openAccountAdd.value = false;
		}
	});
}

// 联系人弹窗打开
function addAccount(row) {
	openAccountAdd.value = true;
	if (!row) {
		// 初始化表单数据
		accountFormInput.value.accountType = cust_account_type.value[0].value;
		accountFormInput.value.currencyType = sys_currency_type.value[0].value;
	} else {
		accountFormInput.value = deepClone(row);
		accountFormInput.value.type = "1";
	}
}

// 修改账号表单
function handleUpdate(rows, index) {
	addAccount(rows);
	curtIndex.value = index;
}

// 重置
function resetAccountFormInput() {
	accountFormInput.value = {
		accountType: null,
		currencyType: null,
		accountBankInfo: null,
		accountName: null,
		accountInfo: null,
		accountCapitalInfo: null
	};
	proxy.$refs["formInput"].clearValidate();
}

// 多选框选中数据
function handleSelectionChange(selection) {
	ids.value = selection.map(item => item.accountName);
	single.value = selection.length != 1;
	multiple.value = !selection.length;
}

// 关闭联系人弹窗
function closeAccountAdd() {
	resetAccountFormInput();
	openAccountAdd.value = false;
}

// 账号从bankInfoList中移除
function handleDelete(rows) {
	const accountInfos = rows ? [rows.accountInfo] : ids.value;
	proxy.$modal
		.confirm("是否确认删除账号？")
		.then(() => {
			formData.value.bankInfoList = formData.value.bankInfoList.filter(
				item => !accountInfos.some(info => info === item.accountInfo)
			);

			single.value = false;
			multiple.value = false;
		})
		.catch(e => {
			console.log(e);
		});
}

// 暴露方法和formdata
defineExpose({
	formData
});
</script>
