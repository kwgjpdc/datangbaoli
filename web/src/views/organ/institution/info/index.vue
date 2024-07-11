<template>
	<div class="app-container">
		<!-- 查询表单组件 -->
		<QueryParams
			:queryParams="queryParams"
			:paramsItems="paramsItems"
			:showSearch="showSearch"
			@handleQuery="handleQuery"
			@resetQuery="resetQuery"
		></QueryParams>
		<!-- 查询表单组件 end-->
		<!-- <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="90px">
      <el-form-item label="机构名称" prop="institutionName">
        <el-input v-model="queryParams.institutionName" placeholder="支持模糊查询" clearable @keyup.enter="handleQuery"
          :style="{ width: '240px' }" />
      </el-form-item>
      <el-form-item label="工商注册号" prop="registerCode">
        <el-input v-model="queryParams.registerCode" placeholder="支持模糊查询" clearable @keyup.enter="handleQuery"
                  :style="{ width: '240px' }" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="Search"  @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh"  @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form> -->

		<el-row :gutter="10" class="mb8">
			<el-col :span="1.5">
				<el-button
					type="primary"
					plain
					@click="handleAdd"
					v-hasPermi="['cust:institution:add']"
					>新增</el-button
				>
			</el-col>
			<!-- <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['demo:info:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['demo:info:remove']"
        >删除</el-button>
      </el-col> -->
			<right-toolbar
				v-model:showSearch="showSearch"
				@queryTable="getList"
			></right-toolbar>
		</el-row>

		<el-table
			v-loading="loading"
			:data="infoList"
			@selection-change="handleSelectionChange"
			style="width: 100%"
			border
		>
			<el-table-column label="机构名称" align="center">
				<template #default="scope">
					<el-button link type="primary" @click="handleView(scope.row)">{{
						scope.row.institutionName
					}}</el-button>
				</template>
			</el-table-column>
			<el-table-column label="工商注册号" align="center" prop="registerCode" />
			<el-table-column
				label="注册资本"
				align="center"
				prop="registeredCapital"
			/>
			<el-table-column label="出资金额" align="center" prop="contribution" />
			<el-table-column
				label="法人代表"
				align="center"
				prop="legalRepresentative"
			/>
			<el-table-column
				label="操作"
				align="center"
				class-name="small-padding"
				fixed="right"
				width="260"
			>
				<template #default="scope">
					<div class="button-display">
						<el-button
							link
							type="primary"
							icon="Edit"
							@click="handleUpdate(scope.row)"
							v-hasPermi="['demo:info:edit']"
							>修改</el-button
						>
						<el-button
							link
							type="primary"
							icon="Delete"
							@click="handleDelete(scope.row)"
							v-hasPermi="['demo:info:remove']"
							>删除</el-button
						>
					</div>
				</template>
			</el-table-column>
		</el-table>

		<pagination
			v-show="total > 0"
			:total="total"
			v-model:page="queryParams.pageNum"
			v-model:limit="queryParams.pageSize"
			@pagination="getList"
		/>
	</div>
</template>

<script setup name="Info">
import {
	listInstitutionInfo,
	delInstitutionInfo
} from "@/api/institution/info";
import QueryParams from "@/components/QueryParams";
const { proxy } = getCurrentInstance();
const route = useRoute();
const router = useRouter();
const infoList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const invoiceDate = ref("");
const dueDate = ref("");
const statusList = ref([]);
const daterangeEndDate = ref([]);
let multiQuery = ref({
	title: "项目列表", //标题
	open: false,
	currentPage: 1,
	total: 1,
	pageSize: 10
});
const propMulti = ref([
	{
		label: "项目编号",
		value: "projectNo"
	},
	{
		label: "项目名称",
		value: "projectName"
	}
]);
const data = reactive({
	form: {},
	queryParams: {
		pageNum: 1,
		pageSize: 10,
		institutionName: null,
		registerCode: null,
		params: {}
	},
	paramsItems: [
		{
			type: "text",
			label: "机构名称",
			prop: "institutionName",
			placeholder: "请输入机构名称"
		},
		{
			type: "text",
			label: "工商注册号",
			prop: "registerCode",
			placeholder: "请输入工商注册号"
		}
	],
	rules: {}
});

const { queryParams, paramsItems, form, rules } = toRefs(data);
const uniqueId = ref("");
let formData = ref({
	contract: {
		createBy: null,
		createById: null,
		createTime: null,
		updateBy: null,
		updateById: null,
		updateTime: null,
		delFlag: null,
		institutionId: null,
		institutionName: "",
		registerCode: "",
		registeredCapital: "",
		contribution: "",
		legalRepresentative: ""
	}
}); //不能修改const 定义的数据
onActivated(() => {
	const time = route.query.t;
	if (time != null && time != uniqueId.value) {
		uniqueId.value = time;
		queryParams.value.pageNum = Number(route.query.pageNum);
		invoiceDate.value = null;
		dueDate.value = null;
		statusList.value = [];
		proxy.resetForm("queryRef");
		getList();
	}
});
/** 查询应收账款查询列表 */
function getList() {
	loading.value = true;

	listInstitutionInfo(queryParams.value).then(response => {
		infoList.value = response.rows;
		total.value = response.total;
		loading.value = false;
	});
}

/** 搜索按钮操作 */
function handleQuery(params) {
	if (params) {
		queryParams.value = params;
	}
	queryParams.value.pageNum = 1;
	getList();
}

/** 重置按钮操作 */
function resetQuery(params) {
	handleQuery(params);
}

// 多选框选中数据
function handleSelectionChange(selection) {
	ids.value = selection.map(item => item.id);
	single.value = selection.length != 1;
	multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
	router.push({
		name: "Institution/detail",
		state: { pageNum: queryParams.value.pageNum }
	});
}

// 查看页面
function handleView(row) {
	const _id = row.institutionId || ids.value;
	router.push({
		name: "Institution/detail",
		state: {
			institutionId: _id,
			viewFlag: true,
			pageNum: queryParams.value.pageNum
		}
	});
}
/** 修改按钮操作 */
function handleUpdate(row) {
	const _id = row.institutionId;
	router.push({
		name: "Institution/detail",
		state: { institutionId: _id, pageNum: queryParams.value.pageNum }
	});
}

/** 删除按钮操作 */
function handleDelete(row) {
	const _ids = row.institutionId;
	const _names = row.institutionName;
	proxy.$modal
		.confirm('是否确认删除机构名称为"' + _names + '"的数据项？')
		.then(function () {
			return delInstitutionInfo(_ids);
		})
		.then(() => {
			getList();
			proxy.$modal.msgSuccess("删除成功");
		})
		.catch(() => {});
}

// 用户组件请求信息
const userParams = ref({
	pageNum: 1,
	pageSize: 10
});
const tableDataMulti = ref([]);
let checkItemMult = ref("");

getList();
</script>
<style lang="scss" scoped>
.button-display {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-around;

	.el-button + .el-button {
		margin-left: 0;
	}
}
</style>
