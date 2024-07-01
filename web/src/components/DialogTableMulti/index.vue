<template>
	<!-- 添加或修改用户配置对话框 -->
	<el-dialog :title="multiQueryChild.title" :model-value="multiQueryChild.open" width="700px"
		@closed="selececlientRow(false)">
		<el-form ref="queryRef" label-width="100px" :model="formInput">
			<el-row>
				<el-col :span="12" v-for="item in propShow" :key="item.value">
					<el-form-item :label="item.label" prop="number">
						<el-input :placeholder="'请输入' + item.label" maxlength="30" v-model="formInput[item.value]"
							@input="selectTableData"></el-input>
					</el-form-item>
				</el-col>

			</el-row>
		</el-form>
		<div class="table-content">
			<el-row justify="center">
				<el-col :span="24">
					<el-table ref="multipleTable" :data="tableDataShow" tooltip-effect="dark" style="margin: 0;"
						@row-click="selececlientRow" v-show="tableDataShow.length">
						<el-table-column :prop="item.value" :label="item.label" v-for="item in propShow"
							:key="item.value" align="center">
							<!-- <template #scope> {{ scope.item[value]}} </template> -->
						</el-table-column>
					</el-table>
					<div v-show="!tableDataShow.length">未查询到符合条件的数据</div>
				</el-col>

			</el-row>
		</div>
		<div class="page">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
				:page-size="multiQueryChild.pageSize" :current-page="multiQueryChild.currentPage"
				layout="total, prev, pager, next" :total="multiQueryChild.total">
			</el-pagination>
		</div>
	</el-dialog>
</template>
<script setup>
	import {
		inputProps
	} from "element-plus";
	import {
		reactive,
		ref,
		watchEffect
	} from "vue"
	const {
		proxy
	} = getCurrentInstance();
	const props = defineProps({
		// // 查询项
		// form: {
		//   type: Object,
		//   default: {number:"",name:""},
		// },
		//   展示表格列
		tableData: {
			type: Array,
			default: null,
		},
		multiQuery: {
			type: Object,
			default: {
				title: "", //标题
				open: false,
				currentPage: 1,
				total: 1,
				pageSize: 10,
			},
		},
		prop: {
			type: Array,
			default: [{
				label: '客户编号',
				value: 'number'
			}, {
				label: '客户名称',
				value: 'nickName'
			}]
		},
	});
	const emit = defineEmits();
	const data = reactive({
		formInput: {}
	});

	const {
		formInput
	} = toRefs(data);

	// let dataMsg = ref(props.multiQuery);
	let tableDataShow = ref(props.tableData);
	let multiQueryChild = ref({});
	let propShow = ref([]);
	watch(() => props.tableData, (newValue, oldValue) => {
		tableDataShow.value = newValue;
		selectTableData();
	}, {
		immediate: true,
		deep: true
	})
	watch(() => props.multiQuery, (newValue, oldValue) => {
		multiQueryChild.value = {
			...oldValue,
			...newValue
		};
	}, {
		immediate: true,
		deep: true
	})

	watch(() => props.prop, (newValue, oldValue) => {
		propShow.value = newValue;
		propShow.value.forEach((item) => {
			formInput.value[item.value] = "";
		})
	}, {
		immediate: true,
		deep: true
	})

	function selececlientRow(row, column, event) {

		emit("update:open", false);
		if (row && row[propShow.value[0].value]) {
			emit("selectRow", row);
		}
		// tableDataShow.value = props.tableData;
		resetForm();
	}

	function resetForm() {
		proxy.resetForm("queryRef");
	}

	function handleSizeChange(val) {
		console.log(`${val} items per page`)
	}

	function handleCurrentChange(val) {
		console.log(`current page: ${val}`)
		emit("pageChange", val);
	}

	function selectTableData() {
		if (props.tableData && propShow.value) {
			let total = 0;
			tableDataShow.value = props.tableData.filter((item) => {
				let findList = propShow.value.filter(element => {
					if (!formInput.value[element.value]) return true
					else {
						return item[element.value] && formInput.value[element.value] && item[element.value]
							.toString().indexOf(formInput.value[element.value].toString()) > -1;
					}
				});
				if (findList.length == propShow.value.length) {
					total++;
					return item;
				}
				if (findList.length == propShow.value.length) return item;
			})
			multiQueryChild.value.total = total;
			// proxy.$forceUpdate()
		}
	}
</script>
<style lang="scss">
	.table-content {
		// display: flex;
		// justify-content: center;
	}
</style>