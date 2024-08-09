<template>
	<el-card>
		<el-form
			ref="elFormRef"
			:model="formData"
			:rules="isView ? {} : rules"
			:inline="true"
			label-width="160px"
			:disabled="isView"
		>
			<el-form-item label="合同编号" prop="contractNum">
				<div class="form-item__block">
					<CustomerSelect
						:showValue="formData.contractNum"
						:option="contractConfig.option"
						:queryPropList="contractConfig.queryPropList"
						:tablePropList="contractConfig.tablePropList"
						@selectRow="contractConfigSelectRow"
					/>
				</div>
			</el-form-item>

			<el-form-item label="尽调审议编号" prop="dueNo">
				<div class="form-item__block">
					<el-input
						v-model="formData.dueNo"
						readonly
						placeholder="请选择"
						@click="dueDiliClick"
					/>
				</div>
			</el-form-item>

			<el-form-item label="放款节点依据" prop="loanNodeBasisName">
				<div class="form-item__block" style="width: 350px">
					<el-input
						v-model="formData.loanNodeBasisName"
						readonly
						placeholder="请选择"
						@click="loanClick"
					/>
				</div>
			</el-form-item>
		</el-form>
	</el-card>

	<!-- 尽调 -->
	<XyDialogSelect
		v-model:open="dueDiliSelect.dialogConfig.open"
		:dialogConfig="dueDiliSelect.dialogConfig"
		:tableConfig="dueDiliSelect.tableConfig"
		:queryConfig="dueDiliSelect.queryConfig"
		@pageChange="pageChangeDueDili"
		@querySearch="querySearchDueDili"
		@selectRow="selectRowDueDili"
	/>

	<!-- 放款节点 -->
	<XyDialogSelect
		v-model:open="loanSelect.dialogConfig.open"
		:dialogConfig="loanSelect.dialogConfig"
		:tableConfig="loanSelect.tableConfig"
		:queryConfig="loanSelect.queryConfig"
		@selectRow="selectRowLoanSelect"
	/>
</template>

<script setup>
import { ref, reactive, computed, getCurrentInstance } from "vue";

import { StrUtil } from "@/utils/StrUtil";

import { contPddList } from "@/api/contract/annex";
import { getDiligence } from "@/api/project/diligence.js";

import CustomerSelect from "@/components/CustomerSelect";

import XyDialogSelect from "@/components/XyDialogSelect";

const { proxy } = getCurrentInstance();

const { proj_dd_loan_basis, proj_dd_confirmation_seal } = proxy.useDict(
	"proj_dd_loan_basis", // 放款节点
	"proj_dd_confirmation_seal" // 确权章
); //下拉框字典

// 组件属性
const props = defineProps({
	data: {
		type: Object,
		default: {}
	},
	routerQueryObj: {
		type: Object,
		default: {}
	}
});

// 组件事件
const emit = defineEmits(["update:data", "dueDiliChange"]);

// 表单对象
const elFormRef = ref(null);

// 表单数据
const formData = reactive(props.data);

// 表单验证规则
const rules = ref({
	contractNum: [
		{
			required: true,
			message: "合同编号不能为空",
			trigger: "change"
		}
	],
	dueNo: [
		{
			required: true,
			message: "尽调审议编号不能为空",
			trigger: "change"
		}
	],
	loanRatio: [
		{
			required: true,
			message: "放款节点不能为空",
			trigger: "change"
		}
	]
});

const dataScope = reactive({
	contractConfig: {
		option: {
			inputW: "100%",
			dialogW: "1000px",
			placeholder: "请选择合同信息",
			dialogTitle: "合同信息",
			queryUrl: "/cont/list"
		},
		queryPropList: [
			{
				prop: "contractNo",
				label: "合同编号"
			},
			{
				prop: "otherContractName",
				label: "合同名称"
			},
			{
				prop: "applyInstitutionName",
				label: "申请人"
			}
		],
		tablePropList: [
			{
				prop: "contractNo",
				label: "合同编号"
			},
			{
				prop: "otherContractName",
				label: "合同名称"
			},
			{
				prop: "applyInstitutionName",
				label: "申请人"
			}
		]
	}
});

const { config, contractConfig } = toRefs(dataScope);

const dueDiliSelect = reactive({
	dialogConfig: {
		title: "合同选择",
		open: false
	},

	queryConfig: [
		{
			label: "尽调编号",
			prop: "dueNo"
		},
		{
			label: "项目名称",
			prop: "name"
		}
	],

	tableConfig: {
		total: 0,
		pageNum: 1,
		pageSize: 10,
		tableColunms: [
			{
				label: "尽调编号",
				prop: "dueNo"
			},
			{
				label: "项目名称",
				prop: "name"
			}
		],
		tableData: []
	}
});

const loanSelect = reactive({
	dialogConfig: {
		title: "放款节点",
		open: false
	},

	queryConfig: [],

	tableConfig: {
		total: 0,
		pageNum: 1,
		pageSize: 10,
		hasPagination: false,
		tableColunms: [
			{
				label: "放款节点依据",
				prop: "loanNodeBasisName"
			},
			{
				label: "放款比例",
				prop: "loanRatio"
			},
			{
				label: "确权章",
				prop: "confirmationSealName"
			}
		],
		tableData: []
	}
});

// 侦听表单数据变化
watch(formData, newValue => {
	emit("update:data", newValue);
});

// ----------------ref,torefs,watch,computed-----------------------------------------------

/* start------------------- 尽调 */

// 点击尽调 input
function dueDiliClick() {
	dueDiliSelect.dialogConfig.open = true;
	const params = {
		pageNum: dueDiliSelect.tableConfig.pageNum,
		pageSize: dueDiliSelect.tableConfig.pageSize
	};
	apiContPddList(params);
}

// 获取 尽调项目列表
function apiContPddList(params) {
	params.pddId = formData.pddId;
	contPddList(params).then(res => {
		if (res.code === 200) {
			dueDiliSelect.tableConfig.tableData = res.rows || [];
			dueDiliSelect.tableConfig.total = res.total || 0;
		}
	});
}

// 尽调分页
function pageChangeDueDili(pageNum) {
	dueDiliSelect.tableConfig.pageNum = pageNum;
	const params = {
		pageNum: dueDiliSelect.tableConfig.pageNum,
		pageSize: dueDiliSelect.tableConfig.pageSize
	};
	apiContPddList(params);
}

// 尽调查询
function querySearchDueDili(queryParams) {
	const params = {
		pageNum: 1,
		pageSize: 10,
		...queryParams
	};

	apiContPddList(params);
}

// 选取尽调
function selectRowDueDili(row) {
	// 尽调Id
	formData.projDueDiligenceId = row.id;
	// 尽调No
	formData.dueNo = row.dueNo;

	// 触发 父组件 中 获取尽调详情并回显尽调信息的逻辑；
	emit("dueDiliChange", row.id);
}

/* end------------------------ 尽调 */

/* start*****************放款节点 */

function loanClick() {
	loanSelect.dialogConfig.open = true;
	// 根据 尽调ID 获取 当前尽调的 【放款节点依据】信息
	getDiligence(formData.projDueDiligenceId).then(res => {
		loanSelect.tableConfig.tableData = res.data.loanList.map(item => {
			// proj_dd_loan_basis 放款节点依据  字典  --》 loanNodeBasis    "15":其他
			// proj_dd_confirmation_seal 确权章 字典  --》confirmationSeal  "17":其他

			if (item.loanNodeBasis) {
				item.loanNodeBasisName =
					item.loanNodeBasis == "15"
						? item.loanNodeBasisOther
						: proj_dd_loan_basis.value.find(
								basis => basis.value == item.loanNodeBasis
						  ).label;
			} else {
				item.loanNodeBasisName = "";
			}

			if (item.confirmationSeal) {
				item.confirmationSealName =
					item.confirmationSeal == "17"
						? item.confirmationSealOther
						: proj_dd_confirmation_seal.value.find(
								seal => seal.value == item.confirmationSeal
						  ).label;
			} else {
				item.confirmationSealName = "";
			}

			return item;
		});
	});
}

function selectRowLoanSelect(row) {
	// 节点比例
	formData.loanRatio = row.loanRatio;
	formData.loanNodeBasisName = row.loanNodeBasisName;

	formData.loanNodeBasis = row.loanNodeBasis; // 放款节点依据
	formData.oanNodeBasisOther = row.oanNodeBasisOther; // 放款节点依据-其他
	formData.confirmationSeal = row.confirmationSeal; // 确权章
	formData.confirmationSealOther = row.confirmationSealOther; // 确权章其他
}

/* end*****************放款节点 */

// 合同选择
function contractConfigSelectRow(row) {
	formData.contractId = row.contractId; // 合同id
	formData.contractNum = row.contractNo; // 合同编号；
	formData.customerName = row.applyInstitutionName; // 合同申请人

	formData.contractAgreeFileVo.contractNum = row.contractNo; // 附件2维护：合同编号；不能去除

	formData.pddId = row.pddId; // pddId 获取合同关联尽调（重要）；
}

// Form item 内容的统一宽度
const formItemContentStyle = { width: "100%" };

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

// 侦听表单数据变化
watch(formData, newValue => {
	emit("update:data", newValue);
});

// 验证业务类型
function validateInform(rule, value, callback) {
	if (StrUtil.isBlank(value)) {
		callback(new Error("业务类型不能为空"));
	} else {
		if (
			formData.agreeInform === "6" &&
			StrUtil.isBlank(formData.agreeInformOther)
		) {
			callback(new Error("其他业务类型输入不能为空"));
		} else {
			callback();
		}
	}
}

// 监听input:number的字段长度问题
function handleInput(value, name, len = 32) {
	// 如果输入长度超过5，截取前5位
	if (value.length > len) {
		formData[name] = value.slice(0, len);
	}
}

// 验证表单
async function validate(callback) {
	await elFormRef.value.validate((valid, fields) => {
		callback(valid, fields);
	});
}

// 父组件可以调用的方法
defineExpose({
	validate,
	elFormRef
});
</script>

<style lang="scss" scoped>
.content {
	:deep(.el-card__body) {
		padding: 10px 0 !important;
	}
}

.form-item__block {
	width: 240px;
}

.form-item__block--half {
	width: 115px;
}

.form-item__placeholder {
	width: 390px;
	height: 30px;
}
</style>
