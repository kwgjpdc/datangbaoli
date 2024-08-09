<template>
	<!-- 添加或修改用户配置对话框 -->
	<el-dialog
		:title="dialogConfig.title"
		:model-value="dialogConfig.open"
		width="1000px"
		@close="dialogClose"
	>
		<!-- 查询 -->
		<div class="query">
			<el-form
				v-if="queryConfig.length"
				ref="queryRef"
				label-width="100px"
				:model="formInput"
			>
				<el-row>
					<el-col :span="12" v-for="item in queryConfig" :key="item.value">
						<el-form-item :label="item.label" :prop="item.prop">
							<el-input
								:placeholder="'请输入' + item.label"
								maxlength="50"
								v-model="formInput[item.prop]"
							/>
						</el-form-item>
					</el-col>

					<el-row justify="center" style="width: 100%">
						<el-button type="primary" @click="handleQueryParams"
							>查询</el-button
						>
						<el-button @click="resetForm">重置</el-button>
					</el-row>
				</el-row>
			</el-form>
		</div>

		<!-- 列表 -->
		<div class="table-content">
			<el-row justify="center">
				<el-col :span="24">
					<el-table
						ref="multipleTable"
						:data="tableConfig.tableData"
						tooltip-effect="dark"
						style="margin: 0"
						@row-click="selececlientRow"
					>
						<el-table-column
							v-for="item in tableConfig.tableColunms"
							:label="item.label"
							:prop="item.prop"
							:key="item.prop"
							align="center"
						/>
					</el-table>
				</el-col>
			</el-row>
		</div>

		<div class="page">
			<el-pagination
				layout="total, prev, pager, next"
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				:page-size="tableConfig.pageSize"
				:current-page="tableConfig.pageNum"
				:total="tableConfig.total"
			>
			</el-pagination>
		</div>
	</el-dialog>
</template>

<script setup>
import { getCurrentInstance, reactive } from "vue";

const { proxy } = getCurrentInstance();

const props = defineProps({
	dialogConfig: {
		type: Object,
		default: {
			open: false,
			title: "" //标题
		}
	},

	tableConfig: {
		type: Object,
		default: {
			pageNum: 1,
			pageSize: 10,
			total: 0,
			tableColumns: [],
			tableData: []
		}
	},

	queryConfig: {
		type: Array,
		default: []
	}
});

const emit = defineEmits();

const data = reactive({
	formInput: {}
});

const { formInput } = toRefs(data);

function dialogClose() {
	emit("update:open", false);
}

function handleQueryParams() {
	emit("querySearch", formInput.value);
}

function handleSizeChange(val) {
	console.log(`${val} items per page`);
}

function handleCurrentChange(val) {
	emit("pageChange", val);
}

function resetForm() {
	proxy.resetForm("queryRef");
}

function selececlientRow(row, column, event) {
	emit("update:open", false);
	if (row) {
		emit("selectRow", row);
	}

	resetForm();
}
</script>

<style lang="scss">
.query {
	margin: 0 0 10px;
}

.page {
	margin: 10px 0;
}
</style>
