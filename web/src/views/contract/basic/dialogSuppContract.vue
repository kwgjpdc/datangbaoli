<template>
	<el-dialog
		:model-value="open"
		width="1400"
		title="合同补录"
		align-center
		destroy-on-close
		@close="handleClose"
	>
		<el-table :data="tableList">
			<el-table-column prop="contractNo" label="合同编号" align="center" />
			<el-table-column
				prop="otherContractName"
				label="合同名称"
				align="center"
			/>

			<el-table-column
				prop="factoringApplicantName"
				label="保理申请人名称"
				align="center"
			/>

			<el-table-column label="用印时间" align="center" width="150">
				<template #default="scope">
					<el-date-picker
						v-model="scope.row.baseSealTime"
						type="date"
						value-format="YYYY-MM-DD"
						clearable
						placeholder="请选择日期"
						style="width: 100%"
					/>
				</template>
			</el-table-column>

			<el-table-column label="签约状态" align="center">
				<template #default="scope">
					<el-input
						v-model="scope.row.baseSignStatus"
						placeholder="请输入签约状态"
						maxlength="32"
					/>
				</template>
			</el-table-column>

			<el-table-column label="签约意见" align="center" width="300">
				<template #default="scope">
					<el-input
						v-model="scope.row.baseSignOpinion"
						type="textarea"
						placeholder="请输入签约意见"
					/>
				</template>
			</el-table-column>
		</el-table>
		<template #footer>
			<div class="dialog-footer">
				<el-button @click="handleClose">取消</el-button>
				<el-button type="primary" @click="handleOk">确定</el-button>
			</div>
		</template>
	</el-dialog>
</template>
<script setup>
import { ref, reactive, watch } from "vue";
import { deepClone } from "@/utils/index";

const props = defineProps({
	open: {
		type: Boolean,
		default: false
	},
	tableSelectedRows: {
		type: Array,
		default: []
	}
});

const emit = defineEmits();

let tableList = ref([]);

watch(
	[() => props.open, () => props.tableSelectedRows],
	(newVal, oldVal) => {
		if (newVal[0]) {
			tableList.value = deepClone(newVal[1]);
		}
	},
	{ immediate: true, deep: true }
);

function handleClose() {
	emit("update:open", false);
}

function handleOk() {
	console.log("confirm", tableList);
	handleClose();
}
</script>
