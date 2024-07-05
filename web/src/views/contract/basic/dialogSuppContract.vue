<template>
	<el-dialog
		:model-value="open"
		width="1400"
		title="合同补录"
		align-center
		destroy-on-close
		@close="handleClose"
	>
		<el-table :data="tableSelectedRows">
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
			<el-table-column label="用印时间" align="center"></el-table-column>
			<el-table-column label="签约状态" align="center"></el-table-column>
			<el-table-column label="签约意见" align="center">
				<template #default="scope">
					<el-input
						v-model="scope.row.baseSignOpinion"
						placeholder="请输入签约意见"
					/>
				</template>
			</el-table-column>
		</el-table>
	</el-dialog>
</template>
<script setup>
import { ref, reactive } from "vue";

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

let tableList = ref(props.tableSelectedRows);

watch(
	props.tableSelectedRows,
	(newVal, oldVal) => {
		tableList.value = newVal;
	},
	{ immediate: true, deep: true }
);

function handleClose() {
	emit("update:open", false);
}
</script>
