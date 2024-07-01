<template>
	<div class="app-container">
		<!-- 查询表单组件 -->
		<QueryParams :queryParams="queryParams" :paramsItems="paramsItems" :showSearch="showSearch"
			@handleQuery="handleQuery" @resetQuery="resetQuery"></QueryParams>
		<!-- 查询表单组件 end-->

		<!-- 查询数据操作 -->
		<el-row :gutter="10" class="mb8" style="margin-top: 20px;">
			<el-col :span="1.5">
				<el-button type="primary" plain icon="Plus" @click="handleAdd"
					v-hasPermi="['demo:info:add']">新增</el-button>
			</el-col>
			<el-col :span="1.5">
				<el-button type="success" plain icon="Edit" :disabled="radio === ''"
					@click="handleUpdate(custSelection)" v-hasPermi="['demo:info:edit']">修改</el-button>
			</el-col>
			<el-col :span="1.5">
				<el-button type="success" plain icon="Edit" :disabled="radio === ''"
					@click="handleCredit(custSelection)" v-hasPermi="['customer:credit:edit']">发起授信</el-button>
			</el-col>
			<!-- <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['demo:info:remove']"
        >删除</el-button>
      </el-col> -->
			<el-col :span="1.5">
				<el-button type="warning" plain icon="Download" @click="goReportImport"
					v-hasPermi="['demo:info:export']">财务报表导入</el-button>
			</el-col>
			<el-col :span="1.5">
				<el-button type="warning" plain icon="Document" @click="generateReport" :disabled="radio === ''"
					v-hasPermi="['project:due:word']">生成授信上会报告</el-button>
			</el-col>
			<!-- <el-col :span="1.5">
				<el-button type="warning" plain icon="Download" @click="developTip"
					v-hasPermi="['demo:info:export']">客户信息导入</el-button>
			</el-col> -->
			<el-col :span="1.5">
				<el-button type="warning" plain icon="upload" @click="handleExport"
					v-hasPermi="['demo:info:export']">导出</el-button>
			</el-col>
			<right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
		</el-row>
		<!-- 查询数据操作 end-->

		<!-- 查询结果 -->
		<el-table v-loading="loading" :data="infoList" style="width: 100%" @header-dragend="changeColwidth">
			<el-table-column width="55" align="center" fixed>
				<template #default="scope">
					<el-radio :label="scope.$index + 1" v-model="radio"
						v-on:change="handleSelectionChange(scope.row)"></el-radio>
				</template>
			</el-table-column>
			<!-- <el-table-column type="index" align="center" width="60" label="序号" fixed /> -->
			<el-table-column label="客户编号" align="center" prop="customerNo" fixed width="120">

				<template #default="scope">
					<el-button link type="primary" @click="handleView(scope.row)">
						{{ scope.row.customerNo }}
					</el-button>
				</template>
			</el-table-column>
			<el-table-column label="客户名称" align="center" prop="customerName" fixed width="180" />
			<el-table-column label="简称" align="center" prop="name" />
			<el-table-column label="所属机构" align="center" prop="orgName" width="120" />
			<el-table-column label="工商注册号/统一社会信用代码" align="center" width="240" prop="creditCode" />
			<!-- <el-table-column label="组织机构代码" align="center" prop="orgCode" width="120" /> -->
			<el-table-column label="法人身份证号码" align="center" prop="corporationIdCard" width="180" />
			<el-table-column label="法人代表" align="center" prop="corporationName" min-width="120" />
			<el-table-column label="授信状态" align="center" prop="status">

				<template #default="scope">
					<dict-tag :options="sys_pass_status" :value="scope.row.status" />
				</template>
			</el-table-column>
			<el-table-column label="授信审议编号" align="center" width="180">
				<template #default="scope">
					<el-button link type="primary" @click="handleCreditView(scope.row)">
						{{ getCreditNo(scope.row) }}
					</el-button>
				</template>
			</el-table-column>
			<el-table-column label="授信额度（千万）" align="center" prop="totalAmount" min-width="150">

				<template #default="scope">
					<span>{{ scope.row.totalAmount }}</span>
				</template>
			</el-table-column>
			<el-table-column label="已使用授信额度（千万）" align="center" prop="usedAmount" min-width="180">

				<template #default="scope">
					<span>{{ scope.row.usedAmount }}</span>
				</template>
			</el-table-column>
			<el-table-column label="未使用授信额度（千万）" align="center" prop="mayAmount" min-width="180">

				<template #default="scope">
					<span>{{ scope.row.mayAmount }}</span>
				</template>
			</el-table-column>
			<el-table-column label="上会时间" align="center" prop="meetingTime" width="120">

				<template #default="scope">
					<span>{{ parseTime(scope.row.meetingTime, '{y}-{m}-{d}') }}</span>
				</template>
			</el-table-column>
			<el-table-column label="成立日期" align="center" prop="foundDate" width="120">

				<template #default="scope">
					<span>{{ parseTime(scope.row.foundDate, '{y}-{m}-{d}') }}</span>
				</template>
			</el-table-column>
			<el-table-column label="注册地址" align="center" prop="registerAddr" width="120" />
			<el-table-column label="客户经理" align="center" prop="customerManager" width="120" />
			<el-table-column label="录入人" align="center" prop="createBy" width="120" />
			<el-table-column label="录入时间" align="center" prop="createTime" width="180">

				<template #default="scope">
					<span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
				</template>
			</el-table-column>
			<!-- <el-table-column label="是否删除(1-是，0-否)" align="center" prop="isDeleted" /> -->
			<!-- <el-table-column label="操作" align="center" class-name="small-padding" fixed="right" width="260">
        <template #default="scope">
          <div class="button-display">
            <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
              v-hasPermi="['demo:info:edit']">修改</el-button>
            <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
              v-hasPermi="['demo:info:remove']">删除</el-button>
            <el-button link type="primary" icon="Coin" @click="handleAddBank(scope.row)"
              v-hasPermi="['demo:info:remove']">新增银行账户</el-button>
          </div>
        </template>
      </el-table-column> -->
		</el-table>
		<pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
			v-model:limit="queryParams.pageSize" @pagination="getList" />
		<!-- 查询结果 end-->
		<el-dialog v-model="openBatch" width="800" append-to-body :title="titleBatch" v-loading="batchLoading">
			<batchImport v-model:batchCustomerList="batchCustomerList"></batchImport>
			<template #footer>
				<div class="dialog-footer">
					<el-button type="primary" @click="handleSaveData">确 定</el-button>
					<el-button @click="cancelSaveData">取 消</el-button>
				</div>
			</template>
		</el-dialog>
	</div>
</template>

<script setup name="Info">
	import {
		listInfo,
		getInfo,
		delInfo,
		addInfo,
		updateInfo,
		getCustomerList,
		saveData
	} from "@/api/customer/index";
	import {
		listUser
	} from "@/api/system/user";
	import {
		deepClone,
		developTip
	} from "@/utils/index"
	import batchImport from "./batchImport.vue";
	import QueryParams from "@/components/QueryParams"
	import {
		ElMessage
	} from 'element-plus'
	import {
		custExportWord
	} from "@/api/project/diligence"
	const {
		proxy
	} = getCurrentInstance();
	const route = useRoute();
	const router = useRouter();

	const infoList = ref([]);
	const open = ref(false);
	const loading = ref(true);
	const showSearch = ref(true);
	let custSelection = ref({});
	let selectId = ref("");
	let radio = ref("");
	const total = ref(0);
	const title = ref("");
	const checkList = ref(['customerManagerName', 'createby']);
	const checkItem = ref("");
	const openBatch = ref(false);
	const batchLoading = ref(true)
	const titleBatch = ref('批量导入');
	const creditEffectiveDate = ref([]);
	let batchCustomerList = ref([]);
	const {
		cust_register_country,
		cust_customer_type,
		cust_customer_category,
		sys_true_or_false,
		cust_industry_type,
		sys_pass_status,
		sys_yes_no
	} = proxy.useDict("cust_register_country", "cust_customer_type", "cust_customer_category", "sys_true_or_false",
		"cust_industry_type", "sys_pass_status", "sys_yes_no"); //下拉框字典
	const data = reactive({
		form: {},
		queryParams: {
			pageNum: 1,
			pageSize: 10,
			customerNo: null,
			customerName: null,
			name: null,
			creditCode: null,
			customerManagerName: null,
			quotaStatus: "",
			isCredit: "",
			creditEffectiveDate: [],
			params: {
				creditEffectiveStartDate: "",
				creditEffectiveEndDate: "",
			}
		},
		paramsItems: [{
				type: "text",
				label: "客户编号",
				prop: "customerNo",
				placeholder: "请输入客户编号"
			},
			{
				type: "text",
				label: "客户名称",
				prop: "customerName",
				placeholder: "请输入客户名称",
			},
			{
				type: "text",
				label: "简称",
				prop: "name",
				placeholder: "请输入简称",
			},
			{
				type: "text",
				label: "工商注册号/\n统一社会信用代码",
				prop: "creditCode",
				placeholder: "请输入工商注册号/统一社会信用代码",
			},
			{
				type: "text",
				label: "客户经理",
				prop: "customerManagerName",
				placeholder: "请输入客户经理",
			},
			{
				type: "select_all",
				label: "是否发起授信",
				prop: "isCredit",
				placeholder: "请选择",
				options: sys_yes_no
			},
			{
				type: "select_all",
				label: "授信状态",
				prop: "quotaStatus",
				placeholder: "请选择",
				options: sys_pass_status
			},
			{
				type: "daterange",
				label: "授信生效日",
				prop: "creditEffectiveDate",
				placeholder: ["开始日期", "结束日期"],
				format: "YYYY-MM-DD",
			}
		]
	});

	const {
		queryParams,
		paramsItems,
		form
	} = toRefs(data);

	const uniqueId = ref("");
	onActivated(() => {
		const time = route.query.t;
		console.log(route.query.t)
		if (time != null && time != uniqueId.value) {
			uniqueId.value = time;
			queryParams.value.pageNum = Number(route.query.pageNum);
			console.log(queryParams.value)
			proxy.resetForm("queryRef");
			getList()
		}
	})
	/** 查询用户信息列表 */
	function getList() {
		loading.value = true;
		radio.value = "";
		custSelection.value = {};
		let paramsData = deepClone(queryParams.value)
		delete paramsData.creditEffectiveDate
		const creditEffectiveDate = queryParams.value.creditEffectiveDate
		if (null != creditEffectiveDate && '' != creditEffectiveDate) {
			paramsData.params.creditEffectiveStartDate = creditEffectiveDate[0];
			paramsData.params.creditEffectiveEndDate = creditEffectiveDate[1];
		} else {
			paramsData.params.creditEffectiveStartDate = '';
			paramsData.params.creditEffectiveEndDate = '';
		}
		listInfo(paramsData).then(response => {
			infoList.value = response.rows;
			total.value = response.total;
			loading.value = false;
		});
		// getCustomerList().then(response => {
		//   useCompanyStore.setCompanyList(response.rows);
		// });
	}

	// 获取审议编号
	function getCreditNo(row) {
		if (row.creditList && row.creditList.length > 0) {
			return row.creditList[0].creditNo
		} else {
			return ""
		}
	}

	// 取消按钮
	function cancel() {
		open.value = false;
		reset();
	}

	// 表单重置
	function reset() {
		form.value = {
			customerId: null,
			deptId: null,
			customerNo: null,
			registerCountry: null,
			customerName: null,
			customerType: null,
			customerManagerName: null,
			customerManagerId: null,
			parentCustomerId: null,
			customerCategory: null,
			isCoreEnterprise: null,
			createBy: null,
			updateBy: null,
			isDeleted: null,
			updateTime: null,
			createTime: null
		};
		proxy.resetForm("queryRef");
	}

	/** 搜索按钮操作 */
	function handleQuery(params) {
		if (params) {
			queryParams.value = params
		}
		queryParams.value.pageNum = 1;
		getList();
	}

	/** 重置按钮操作 */
	function resetQuery(params) {
		handleQuery(params);
	}

	// 选中数据
	function handleSelectionChange(selection) {
		custSelection.value = selection
		selectId.value = selection.customerId
		// selectId.value = selection.customerNo;
		// console.log('选择了', selection)
	}

	/** 新增按钮操作 */
	function handleAdd() {
		reset();
		// 
		router.push({
			path: '/customer/customer/detail',
			query: {
				pageNum: queryParams.value.pageNum
			}
		});
		// open.value = true;
		// title.value = "添加用户信息";

	}

	/** 修改按钮操作 */
	function handleUpdate(row) {
		reset();
		const _customerId = row.customerId
		router.push({
			path: '/customer/customer/detail',
			query: {
				customerId: _customerId,
				pageNum: queryParams.value.pageNum
			}
		});
	}
	// 发起授信
	function handleCredit(row) {
		reset()
		const _customerId = row.customerId
		let status = row.cstatus;
		if (status == 2) {
			proxy.$modal.msgSuccess("此客户已发起授信流程");
		} else if (status == 3 || status == 4) {
			proxy.$modal.confirm('此客户已存在授信结果是否重新发起授信？').then(function() {
				router.push({
					path: '/customer/customer/creditDetail',
					query: {
						customerId: _customerId,
						pageNum: queryParams.value.pageNum
					}
				});
			}).catch(() => {});
		}else{
			router.push({
				path: '/customer/customer/creditDetail',
				query: {
					customerId: _customerId,
					pageNum: queryParams.value.pageNum
				}
			});
		}
		// const _customerId = row.customerId
		// router.push({
		// 	path: '/customer/customer/creditDetail',
		// 	query: {
		// 		customerId: _customerId,
		// 		pageNum: queryParams.value.pageNum
		// 	}
		// });
	}

	function handleCreditView(row) {
		reset()
		const _customerId = row.customerId
		router.push({
			path: '/customer/customer/creditDetail',
			query: {
				customerId: _customerId,
				viewFlag: true,
				pageNum: queryParams.value.pageNum
			}
		});
	}
	// 查看页面
	function handleView(row) {
		reset();
		const _customerId = row.customerId
		router.push({
			path: '/customer/customer/detail',
			query: {
				customerId: _customerId,
				viewFlag: true,
				pageNum: queryParams.value.pageNum
			}
		});
	}


	/** 提交按钮 */
	function submitForm() {
		proxy.$refs["infoRef"].validate(valid => {
			if (valid) {
				if (form.value.customerId != null) {
					updateInfo(form.value).then(response => {
						proxy.$modal.msgSuccess("修改成功");
						open.value = false;
						getList();
					});
				} else {
					addInfo(form.value).then(response => {
						proxy.$modal.msgSuccess("新增成功");
						open.value = false;
						getList();
					});
				}
			}
		});
	}

	/** 删除按钮操作 */
	function handleDelete(row) {
		const _customerIds = row.customerId || ids.value;
		proxy.$modal.confirm('是否确认删除用户信息编号为"' + _customerIds + '"的数据项？').then(function() {
			return delInfo(_customerIds);
		}).then(() => {
			getList();
			proxy.$modal.msgSuccess("删除成功");
		}).catch(() => {});
	}

	/** 导出按钮操作 */
	function handleExport() {
		let paramsData = deepClone(queryParams.value)
		delete paramsData.creditEffectiveDate
		const creditEffectiveDate = queryParams.value.creditEffectiveDate
		if (null != creditEffectiveDate && '' != creditEffectiveDate) {
			paramsData.params.creditEffectiveStartDate = creditEffectiveDate.value[0];
			paramsData.params.creditEffectiveEndDate = creditEffectiveDate.value[1];
		} else {
			paramsData.params.creditEffectiveStartDate = '';
			paramsData.params.creditEffectiveEndDate = '';
		}
		proxy.download('/cust/customer/export', {
			...paramsData.value
		}, `info_${new Date().getTime()}.xlsx`)
	}

	function handleAddBank(row) {
		console.log(row)
		const _customerId = row.customerId || ids.value
		router.push({
			path: '/customer/customer/custbankinfo',
			query: {
				customerId: _customerId
			}
		});
	}

	function handleBatch() {
		// console.log("123")
		openBatch.value = true;
	}

	function handleSaveData() {
		batchLoading.value = true;
		if (batchCustomerList.value.length) {
			batchCustomerList.value.forEach(element => {
				element.contactList = [element.contact];
			});
			saveData({
				customerList: batchCustomerList.value
			}).then(response => {
				batchLoading.value = false;
				proxy.$modal.msgSuccess("导入成功");
				openBatch.value = false;
				getList();
			})
		}
	}
	// 取消按钮
	function cancelSaveData() {
		openBatch.value = false;
		reset();
	}

	// 跳转财务报表导入
	function goReportImport() {
		router.push({
			path: '/customer/customer/report',
			query: {}
		});
	}

	// 生成授信上会报告
	function generateReport() {
		if (!selectId.value) {
			ElMessage({
				message: '请先选择需要生成报告的信息',
				type: 'error'
			})
		} else {
			custExportWord(selectId.value).then(res => {
				if (!res.code) {
					if (!res || res.size == 0) {
						ElMessage({
							message: "未填写该客户授信信息",
							type: 'error'
						})
						return;
					}
					const elink = document.createElement("a");
					elink.href = window.URL.createObjectURL(new Blob([res]));
					elink.style.display = 'none';
					elink.setAttribute('download', '客户授信上会报告' + '.docx');
					document.body.appendChild(elink);
					elink.click();
					document.body.removeChild(elink);
				} else if (res.code == 500) {
					ElMessage({
						message: "未填写该客户授信信息",
						type: 'error'
					})
				} else {
					ElMessage({
						message: "未填写该客户授信信息",
						type: 'error'
					})
				}
			})
		}
	}

	function changeColwidth(nw, ow, col, evt) {

		// for(let item of infoList.columnList){
		//   if(item.label == column.label){
		//     item.width = newWidth;
		//   }
		// }
	}


	getList();
</script>

<style lang="scss" scoped>
	.button-display {
		display: flex;
	}

	.el-form {
		:deep(.el-form-item--default .el-form-item__label) {
			white-space: pre-line;
			line-height: 20px;
			display: flex;
			align-items: center;
		}
	}
</style>