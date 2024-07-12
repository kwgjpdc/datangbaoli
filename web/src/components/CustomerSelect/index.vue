<template>
	<div style="width: 100%">
		<el-input
			v-model="showValue"
			:placeholder="placeholder ? placeholder : option.placeholder"
			:style="{ width: option.inputW || '100%' }"
			readonly
			suffix-icon="el-icon-search"
			@click="openDiag"
		></el-input>
		<!-- 添加或修改用户配置对话框 -->
		<el-dialog
			:title="option.dialogTitle"
			v-model="open"
			:width="option.dialogW || '800px'"
			@closed="selececlientRow(false)"
			:append-to-body="true"
		>
			<el-form ref="queryRef" label-width="120px" :model="queryParams">
				<el-row>
					<el-col
						:span="12"
						v-for="(item, index) in queryPropList"
						:key="'col' + index"
					>
						<el-form-item :label="item.label" :prop="item.prop">
							<el-input
								:placeholder="'请输入' + item.label"
								maxlength="30"
								v-model="queryParams[item.prop]"
								@keydown.enter="handleQuery"
							></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24" align="center" style="margin-bottom: 20px">
						<el-button type="primary" icon="Search" @click="handleQuery"
							>搜索</el-button
						>
						<el-button icon="Refresh" @click="resetQuery">重置</el-button>
					</el-col>
				</el-row>
			</el-form>
			<div class="table-content">
				<el-row justify="center">
					<el-col :span="24">
						<el-table
							ref="resultTable"
							:data="resultList"
							tooltip-effect="dark"
							:max-height="resultHeight"
							style="width: 100%"
							@row-click="selececlientRow"
							v-loading="resultLoading"
						>
							<template
								v-for="(item, index) in tablePropList"
								:key="'column' + index"
							>
								<el-table-column
									:prop="item.prop"
									:label="item.label"
									align="center"
									:min-width="item.width ? item.width : '180'"
									:fixed="item.fixed ? item.fixed : false"
								>
									<template #default="scope">
										<span v-if="item.type === 'date'">{{
											parseTime(scope.row[item.prop], "{y}-{m}-{d}")
										}}</span>
										<span v-else-if="item.type === 'money'">{{
											formatMoney(scope.row[item.prop])
										}}</span>
										<span v-else>{{ scope.row[item.prop] }}</span>
									</template>
								</el-table-column>
							</template>
						</el-table>
						<!-- <div v-show="!resultList.length">未查询到符合条件的数据</div> -->
					</el-col>
				</el-row>
			</div>
			<div class="page">
				<el-pagination
					@size-change="handleSizeChange"
					@current-change="handleCurrentChange"
					:page-size="queryParams.pageSize"
					layout="total, prev, pager, next"
					:total="total"
				>
				</el-pagination>
			</div>
		</el-dialog>
	</div>
</template>

<script setup>
import { formatMoney, formatPercent } from "@/utils/formatMoney";
import request from "@/utils/request";
import { deepClone } from "@/utils/index";
import { reactive, ref } from "vue";
const { proxy } = getCurrentInstance();
const props = defineProps({
	placeholder: {
		type: String,
		default: null
	},
	option: {
		type: Object,
		default: {
			inputW: "",
			dialogW: "",
			placeholder: "请选择",
			dialogTitle: "用户信息",
			queryUrl: "https://mock.apifox.com/m1/3688489-0-default/dev-api/test/list"
		}
	},
	queryPropList: {
		type: Array,
		default: [
			{
				prop: "id",
				label: "编号"
			},
			{
				prop: "name",
				label: "名称"
			}
		]
	},
	tablePropList: {
		type: Array,
		default: [
			{
				prop: "id",
				label: "编号"
			},
			{
				prop: "name",
				label: "名称"
			}
		]
	},
	showValue: {
		type: String,
		default: ""
	}
});
const open = ref(false);
let resultLoading = ref(true);
const emit = defineEmits();
const data = reactive({
	showValue: "",
	queryParams: {
		pageNum: 1,
		pageSize: 10
	}
});

const { showValue, queryParams } = toRefs(data);

let resultHeight = ref("200px");
let option = ref({});
let queryPropList = ref([]);
let tablePropList = ref([]);
let resultList = ref([]);
let total = ref(0);

watch(
	() => props.option,
	(newValue, oldValue) => {
		option.value = newValue;
	},
	{ immediate: true, deep: true }
);

watch(
	() => props.queryPropList,
	(newValue, oldValue) => {
		queryPropList.value = newValue;
		queryPropList.value.forEach(item => {
			queryParams.value[item.prop] = "";
		});
	},
	{ immediate: true, deep: true }
);

watch(
	() => props.tablePropList,
	(newValue, oldValue) => {
		tablePropList.value = newValue;
	},
	{ immediate: true, deep: true }
);

watch(
	() => props.showValue,
	(newValue, oldValue) => {
		if (newValue && newValue !== "") {
			showValue.value = newValue;
		} else {
			showValue.value = "";
		}
	},
	{ immediate: true, deep: true }
);

function handleSizeChange(val) {
	queryParams.value.pageNum = val;
	getList();
}
function handleCurrentChange(val) {
	queryParams.value.pageNum = val;
	getList();
}
// 查询
function handleQuery() {
	// console.log('查询条件', queryParams)
	queryParams.value.pageNum = 1;
	getList();
}
// 重置条件
function resetQuery() {
	proxy.resetForm("queryRef");
	handleQuery();
}

// 查询
function getList() {
	resultLoading.value = true;
	return request({
		url: option.value.queryUrl,
		method: "get",
		params: queryParams.value
	}).then(response => {
		resultList.value = response.rows;
		total.value = response.total;
		resultLoading.value = false;
	});
}

// 对话框
function openDiag() {
	const bodyH = document.body.clientHeight;
	open.value = true;
	resultHeight.value = bodyH * 0.4 + "px";
	handleQuery();
}

function selececlientRow(row, column, event) {
	if (row) {
		// selectedItem.value = row
		emit("selectRow", row);
	}
	open.value = false;
	proxy.resetForm("queryRef");
}
</script>
