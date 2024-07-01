<template>
	<div class="app-container info-form-container" v-loading="loading" ref="appContainerView">
		<div class="content">
			<div class="operate-button" v-if="!routerQueryObj.approveFlag">
				<el-row :gutter="10" justify="end">
					<el-col :span="1.5" v-if="!routerQueryObj.viewFlag">
						<el-button type="primary" icon="List" @click="submitForm(1)">暂存</el-button>
					</el-col>
					<el-col :span="1.5" v-if="!routerQueryObj.viewFlag">
						<el-button type="primary" icon="Checked" @click="submitForm(2)">提交</el-button>
					</el-col>
					<el-col :span="1.5">
						<el-button type="primary" icon="CircleCloseFilled" @click="closePage">返回</el-button>
					</el-col>
				</el-row>
			</div>
			<div class="content-item-scroll">
				<el-form class="info-form" ref="elForm" :model="formData" :rules="rules" label-width="140px"
					:disabled="routerQueryObj.viewFlag">
					<el-collapse v-model="activeNames">
						<el-collapse-item title="授信信息" name="1">
							<el-row :gutter="15" style="margin-right: 30px;">
								<el-col :xl="6" :lg="8" :sm="12" :xs="24">
									<el-form-item label="审议编号" prop="creditNo">
										<el-input v-model="formData.creditNo" placeholder="系统自动生成" disabled></el-input>
									</el-form-item></el-col>
								<el-col :xl="6" :lg="8" :sm="12" :xs="24">
									<el-form-item label="总期" prop="totalPeriod">
										<el-input v-model="formData.totalPeriod" placeholder="系统自动生成"
											disabled></el-input>
									</el-form-item></el-col>
								<el-col :xl="6" :lg="8" :sm="12" :xs="24">
									<el-form-item label="提交部门" prop="submitDepartment">
										<el-input v-model="formData.submitDepartment" placeholder="请输入提交部门" clearable
											maxlength="32"></el-input>
									</el-form-item></el-col>
								<el-col :xl="6" :lg="8" :sm="12" :xs="24">
									<el-form-item label="年期" prop="currentYear">
										<el-input v-model="formData.currentYear" placeholder="系统自动生成"
											disabled></el-input>
									</el-form-item></el-col>
								<el-col :xl="6" :lg="8" :sm="12" :xs="24">
									<el-form-item label="审议日期" prop="reviewDate">
										<el-date-picker clearable v-model="formData.reviewDate" type="date"
											value-format="YYYY-MM-DD" placeholder="请选择">
										</el-date-picker>
									</el-form-item></el-col>
								<el-col :xl="6" :lg="8" :sm="12" :xs="24">
									<el-form-item label="主办人" prop="sponsor">
										<el-input v-model="formData.sponsor" placeholder="请输入主办人" clearable
											maxlength="32"></el-input>
									</el-form-item></el-col>
								<el-col :xl="6" :lg="8" :sm="12" :xs="24">
									<!-- <el-form-item label="授信对象" prop="creditObject">
										<el-input v-model="formData.creditObject" placeholder="请输入授信对象" clearable
											maxlength="64"></el-input>
									</el-form-item> -->
									<el-form-item label="授信对象" prop="creditObject">
									    <div @click="openDiagMulti('creditObject')">
									        <el-input v-model="formData.creditObject" placeholder="请选择授信对象" readonly
									            suffix-icon="el-icon-search" :style="{ width: '240px' }"></el-input>
									    </div>
									</el-form-item>
								</el-col>
								<el-col :xl="6" :lg="8" :sm="12" :xs="24">
									<el-form-item label="授信额度" prop="creditLine">
										<ElPriceInput v-model:form="formData" prop="creditLine" :rules="rules"
											:disabled="routerQueryObj.viewFlag" :placeholder="'请输入'">
											<template #prefix>
												<span> ￥ </span>
											</template>
											<template #suffix>
												<span> 元 </span>
											</template>
										</ElPriceInput>
									</el-form-item>
								</el-col>
								<el-col :xl="6" :lg="8" :sm="12" :xs="24">
									<el-form-item label="担保方式" prop="guarantyWay">
										<el-radio-group v-model="formData.guarantyWay">
											<el-radio v-for="dict in credit_guaranty_way" :label="dict.value"
												:name="dict.value" :key="dict.value">{{dict.label}}</el-radio>
										</el-radio-group>
									</el-form-item></el-col>
								<el-col :xl="6" :lg="8" :sm="12" :xs="24">
									<el-form-item label="授信期限" prop="creditPeriod">
										<el-input v-model="formData.creditPeriod" placeholder="请输入授信期限"
											oninput="value=value.replace(/[^0-9]/g,'')" maxlength="9">
											<template #suffix>
												<span> 个月 </span>
											</template>
										</el-input>
									</el-form-item>
								</el-col>
								<el-col :xl="6" :lg="8" :sm="12" :xs="24">
									<el-form-item label="授信到期日" prop="expireDate">
										<el-date-picker clearable v-model="formData.expireDate" type="date"
											value-format="YYYY-MM-DD" placeholder="请选择">
										</el-date-picker>
									</el-form-item></el-col>
								<el-col :xl="6" :lg="8" :sm="12" :xs="24">
									<el-form-item label="额度种类组" prop="typeGroup">
										<el-select v-model="formData.typeGroup" filterable placeholder="请选择">
											<el-option v-for="item in cust_credit_type" :key="item.value"
												:label="item.label" :value="item.value">
											</el-option>
										</el-select>
									</el-form-item></el-col>
								<el-col :xl="12" :lg="16" :sm="24">
									<el-form-item label="额度管理方式" prop="manageMode" :style="{ width: '100%' }">
										<el-radio-group v-model="formData.manageMode">
											<el-radio v-for="dict in lines_manage_mode" :label="dict.value"
												:name="dict.value" :key="dict.value">
												{{ dict.label }}
											</el-radio>
										</el-radio-group>
									</el-form-item></el-col>
								<el-col :sm="24">
									<el-form-item label="备注" prop="remark">
										<el-input type="textarea" rows="2" maxlength="255" show-word-limit
											v-model="formData.remark" placeholder="请输入备注" clearabl></el-input>
									</el-form-item>
								</el-col>

							</el-row>
							<el-row :gutter="15">
								<el-col :span="24">
									<div class="table-content" style="margin: 20px 30px;">
										<el-table ref="multipleTable" :data="formData.commonFileList"
											tooltip-effect="dark" style="width: 100%;margin: 0;">
											<el-table-column type="index" align="center" label="序号" width="80" />
											<el-table-column prop="fileName" align="center" label="附件类型名称" />
											<el-table-column label="操作" align="center" width="120">
												<template #default="scope">
													<el-button link type="primary" icon="download"
														@click="handleExport(scope.row)"
														v-hasPermi="['sys:file:export']" title="下载"></el-button>
												</template>
											</el-table-column>
										</el-table>
									</div>
								</el-col>
							</el-row>
						</el-collapse-item>
					</el-collapse>
				</el-form>
				<div class="content-item-scroll" v-if="!routerQueryObj.viewFlag">
				    <flow-search id="flowSearch" ref="flowSearchRef" :routerQueryObj="routerQueryObj" :needUser="true"></flow-search>
				</div>
			</div>
		</div>
		<DialogTableMulti v-model:multiQuery="multiQuery" v-model:open="multiQuery.open" v-model:tableData="tableDataMulti"
		    v-model:prop="propMulti" @selectRow="selectRowMulti" @pageChange="pageChangeMulti" />
	</div>
</template>

<script setup name="CreditDetail">
	import { ref, computed, onBeforeMount, watch } from "vue";
	import { listInfo as getUserList } from "@/api/customer/index"
	import {
		getInfo,
		addInfo,
		updateInfo
	} from "@/api/customer/credit";
	import {
		deepClone
	} from "@/utils/index"
	import ElPriceInput from "@/components/ElPriceInput"
	import FlowSearch from '@/views/flowable/search/index.vue'

	const {
		proxy
	} = getCurrentInstance();
	const route = useRoute();
	const router = useRouter();
	const {
		cust_credit_type,
		lines_manage_mode,
		credit_guaranty_way
	} = proxy.useDict('cust_credit_type', 'lines_manage_mode', 'credit_guaranty_way');

	const customerId = ref(""); //客户信息id
	const loading = ref(false);
	let routerQueryObj = ref({}); //路由地址所带参数
	const activeNames = ref(['1']);

	const data = reactive({
		creditDetailInfo: {
			"createBy": null,
			"createById": "",
			"createTime": "",
			"updateBy": "",
			"updateById": "",
			"updateTime": "",
			"delFlag": null,
			"remark": "",
			"creditId": null,
			"customerId": "", // 客户ID
			"creditNo": "",
			"totalPeriod": "",
			"submitDepartment": "",
			"currentYear": "",
			"reviewDate": "",
			"sponsor": "",
			"creditObject": "",
			"creditLine": "",
			"guarantyWay": null,
			"creditPeriod": "",
			"expireDate": "",
			"manageMode": null,
			"typeGroup": "",
			"status": "",
			"commonFileList": []
		}, //授信信息
		rules: {
			submitDepartment: [{
				required: true,
				message: "提交部门不能为空",
				trigger: "blur"
			}],
			reviewDate: [{
				required: true,
				message: "审议日期不能为空",
				trigger: "change"
			}],
			creditObject: [{
				required: false,
				message: "授信对象不能为空",
				trigger: "blur"
			}],
			creditLine: [{
					pattern: /^1000000000$|^1000000000.0$|^1000000000.00$|^[+]{0,1}(\d{0,9})$|^[+]{0,1}(\d{0,9}\.\d{1,2})$/,
					message: ' 请输入 0-10亿 的正数，可保留两位小数',
					trigger: 'blur',
				},
				{
					required: true,
					message: "授信额度不能为空",
					trigger: "blur"
				}
			],
			guarantyWay: [{
				required: true,
				message: "担保方式不能为空",
				trigger: "change"
			}],
			creditPeriod: [{
				required: true,
				message: "授信期限不能为空",
				trigger: "change"
			}],
			expireDate: [{
				required: true,
				message: "授信到期日不能为空",
				trigger: "change"
			}],
			manageMode: [{
				required: true,
				message: "额度管理方式不能为空",
				trigger: "change"
			}],
			typeGroup: [{
				required: true,
				message: "额度种类组不能为空",
				trigger: "change"
			}]
		}, //验证规律
	});

	const {
		creditDetailInfo,
		rules
	} = toRefs(data);
	let formData = ref({
		"createBy": null,
		"createById": "",
		"createTime": "",
		"updateBy": "",
		"updateById": "",
		"updateTime": "",
		"delFlag": null,
		"remark": "",
		"creditId": null,
		"customerId": "", // 客户ID
		"creditNo": "",
		"totalPeriod": "",
		"submitDepartment": "",
		"currentYear": "",
		"reviewDate": "",
		"sponsor": "",
		"creditObject": "",
		"creditLine": "",
		"guarantyWay": null,
		"creditPeriod": "",
		"expireDate": "",
		"manageMode": null,
		"typeGroup": "",
		"status": "",
		"commonFileList": []
	})
	const props = defineProps({
		approveId: {
			type: Number
		}
	})
	
	// 用户组件请求信息
	const userParams = ref({
	    pageNum: 1,
	    pageSize: 10,
	})
	let multiQuery = ref({
	    title: "客户信息",//标题
	    open: false,
	    currentPage: 1,
	    total: 1,
	    pageSize: 10,
	});
	const tableDataMulti = ref([]);
	const propMulti = ref([{
	    label: '客户编号',
	    value: 'customerNo'
	}, {
	    label: '客户名称',
	    value: 'customerName'
	}]);
	let checkItemMult = ref("")

	watch(route, (newRoute) => {
		if(props.approveId){
			routerQueryObj.value.viewFlag = true;
			routerQueryObj.value.approveFlag = true;
			customerId.value = props.approveId;
			// getInfoPage();
		}else{
			customerId.value = newRoute.query && newRoute.query.customerId;
			formData.value.customerId = customerId.value
			routerQueryObj.value.viewFlag = newRoute.query && newRoute.query.viewFlag && newRoute.query.viewFlag ===
				'true' ? true : false;
		}
	}, {
		immediate: true
	});

	/** 获取授信信息 */
	function getInfoPage() {
		loading.value = true;
		if (customerId.value) {
			getInfo(customerId.value).then(response => {
				console.log(response);
				if (response.data) {
					formData.value = deepClone(response.data);
				}
				loading.value = false;
			});
		}
	}

	// 表单验证
	function validForm() {
		let result = false
		proxy.$refs['elForm'].validate((valid) => {
			console.log(valid);
			result = valid
		})
		return result
	}

	function submitForm(statusFlag) {
		loading.value = true
		const validForm = new Promise((resolve, reject) => {
			proxy.$refs['elForm'].validate(valid => {
				valid ? resolve(valid) : reject(valid)
			})
		})
		const flowForm = new Promise((resolve, reject) => {
		    proxy.$refs['flowSearchRef'].$refs['elForm'].validate(valid => {
		        valid ? resolve(valid) : reject(valid)
		    })
		});

		// 账户管理不需要在外层校验；
		Promise.all([validForm,flowForm]).then(() => {
			let creditInfoSave = formData.value;
			creditInfoSave.status = statusFlag;
			creditInfoSave.cStatus = statusFlag;
			// console.log(creditInfoSave)
			creditInfoSave.flowId = proxy.$refs['flowSearchRef'].formData.flowId;
			creditInfoSave.userIds = proxy.$refs['flowSearchRef'].formData.userIds;
			if (!(creditInfoSave.creditId && creditInfoSave.creditId !== '')) {
				//新增
				addInfo(creditInfoSave).then(response => {
					proxy.$modal.msgSuccess("授信新增成功");
					loading.value = false;
					closePage()
				}).catch(() => {
					loading.value = false;
				});
			} else {
				//修改
				updateInfo(creditInfoSave).then(response => {
					proxy.$modal.msgSuccess("授信修改成功");
					loading.value = false;
					closePage()
				}).catch(() => {
					loading.value = false;
				});
			}
		}).catch(() => {
			loading.value = false;
		})
	}
	
	
	
	// 打开用户信息选择框 请求用户信息
	function openDiagMulti(options) {
	    multiQuery.value.currentPage = 1;
	    userParams.value.pageNum = 1;
	    loading.value = true;
		multiQuery.value.title = "授信对象";
	    getUserList(userParams.value).then(response => {
	        tableDataMulti.value = [];
	        loading.value = 0;
	        response.rows.map((item) => {
	            // item.parentCustomerName = item.companyInfo.parentCustomerName;
	            tableDataMulti.value.push(item)
				// tableDataMultiOther.value.push(item);
				// totalDataMultiOther.value =  response.total;
	        });
	        multiQuery.value.total = response.total;
	        multiQuery.value.open = true;
	    });
	    checkItemMult.value = options;
	}

	// 选择了用户信息；
	function selectRowMulti(rows) {
	    console.log(rows);
	
	    if (checkItemMult.value == 'creditObject') {
	        formData.value.creditObject = rows.customerName
	  //       formData.value.customerNo = rows.customerNo
			// formData.value.customerId = rows.customerId
	    }
	}
	// 弹出用户信息分页处理
	function pageChangeMulti(page) {
	    userParams.value.pageNum = page;
	    multiQuery.value.currentPage = page;
	    loading.value = true;
	    getUserList(userParams.value).then(response => {
	        loading.value = false;
	        tableDataMulti.value = [];
	        response.rows.map((item) => {
	            // item.parentCustomerName = item.companyInfo.parentCustomerName;
	            tableDataMulti.value.push(item)
	        });
	        multiQuery.value.total = response.total;
	        multiQuery.value.open = true;
	    });
	}
	
	// 下载已上传的文件内容
	function handleExport(rows) {
		const fileUrl = rows.fileUrl;
		proxy.$download.resource(fileUrl);
	}

	// 关闭详情标签页
	function closePage() {
		const obj = {
			path: "/customer/customer/basic",
			query: {
				t: Date.now(),
				pageNum: route.query.pageNum
			}
		};
		proxy.$tab.closeOpenPage(obj);
	}

	// 标签收起展开
	function handleChange(val) {
		console.log(val);
	}

	getInfoPage();
</script>

<style lang="scss" scoped>
	@import '../../../assets/styles/infoForm.scss';
</style>