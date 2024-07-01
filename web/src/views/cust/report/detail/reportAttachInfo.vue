<template>
	<div>
		<el-row :gutter="15">
			<el-col :span="24" :xs="24">
				<el-collapse @change="handleChange" v-model="activeNames">
					<el-collapse-item title="财务报表导入文件" name="1">
						<el-card class="box-card">
							<template #header>
								<!-- <span>附件信息</span> -->
								<div class="header-button-operate" v-if="!props.routerQueryObj.viewFlag">
									<el-upload class="upload-demo" :action="uploadFileUrl" :headers="headers"
										:on-preview="handlePreview" :on-remove="handleRemove" handleBeforeUpload
										:before-remove="beforeRemove" :on-exceed="handleExceed"
										:on-success="uploadSuccess" :show-file-list="false" ref="fileUpload"
										:before-upload="handleBeforeUpload">
										<!-- <template #trigger> -->
										<!-- :auto-upload="false" -->
										<!-- <el-button type="primary">选择文件</el-button> -->
										<!-- </template> -->
										<el-button type="primary" link icon="Upload"
											:disabled="formData.commonFileList.length==1">上传文件</el-button>
									</el-upload>
									<el-button type="primary" link @click="importTemplate()"
										icon="Download">模版下载</el-button>
									<!-- <el-button type="primary" link
                                        @click="handleDelete()" :disabled="single">删除</el-button>
                                    <el-button type="text"
                                        @click="handleExport" v-hasPermi="['sys:file:export']" :disabled="single||multiple">批量下载</el-button> -->
								</div>

							</template>
							<el-table v-loading="loading" :data="formData.commonFileList"
								@selection-change="handleSelectionChange">
								<el-table-column type="selection" width="55" align="center" />

								<el-table-column label="文件名称" align="center" prop="fileName" width="250" />
								<!-- <el-table-column label="oss上文件存储地址" align="center" prop="fileUrl" /> -->
								<el-table-column label="文件大小" align="center" prop="fileSize">
									<template #default="scope">
										<span>{{ formatFileSize(scope.row.fileSize) }}</span>
									</template>
								</el-table-column>
								<el-table-column label="文件类型" align="center" prop="fileType" />



								<!-- <el-table-column label="备注" align="center" prop="remark" /> -->
								<el-table-column label="操作" align="center" class-name="small-padding fixed-width">
									<template #default="scope">
										<el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
											v-hasPermi="['sys:file:remove']" title="删除"
											v-if="!props.routerQueryObj.viewFlag"></el-button>
										<el-button link type="primary" icon="download" @click="handleExport(scope.row)"
											v-hasPermi="['sys:file:export']" title="下载"></el-button>
										<!-- <el-button link>
                                                <el-link :href="scope.row.fileUrl" target="_blank" icon="view" type="primary"   title="查看"></el-link >
                                            </el-button> -->

										<!-- <el-button link type="primary" icon="view"  scope.row.fileUrl
                                            v-hasPermi="['sys:file:export']" title="查看"></el-button> -->
									</template>
								</el-table-column>
							</el-table>

						</el-card>
					</el-collapse-item>
				</el-collapse>
			</el-col>
		</el-row>
		<!-- 添加或修改文件信息对话框 -->
		<el-dialog :title="title" v-model="open" width="500px" append-to-body @closed="selececlientRow(false)">
			<el-row :gutter="15">
				<el-col :span="24" :xs="24">
					<el-form ref="fileRef" :model="form" label-width="140px">
						<el-form-item label="附件类型名称" prop="bizTypeName">
							<el-input v-model="form.bizTypeName" placeholder="请输入附件类型名称" clearable />
						</el-form-item>
						<el-form-item>
							<el-button type="primary" @click="searchBiztypeName">查询</el-button>
						</el-form-item>
					</el-form>
				</el-col>
			</el-row>
			<div class="table-content">
				<el-row justify="center">
					<el-col :span="24">
						<el-table ref="multipleTable" :data="tableData" tooltip-effect="dark"
							style="width: 300px;margin: 0;" @row-click="selececlientRow" height="350">

							<el-table-column prop="value" label="序号" width="120">

							</el-table-column>
							<el-table-column prop="label" label="附件类型名称">

							</el-table-column>

						</el-table>
						<!-- <div v-show="!tableDataShow.length">未查询到符合条件的数据</div> -->
					</el-col>

				</el-row>
			</div>
			<div class="page">
				<el-pagination :current-page="currentPage1" :page-size="100" layout="total, prev, pager, next"
					:total="total">
				</el-pagination>
			</div>
		</el-dialog>
	</div>
</template>
<script setup>
	import {
		formatFileSize
	} from "@/utils/index"
	import {
		getToken
	} from "@/utils/auth";
	import useUserStore from '@/store/modules/user'
	import {
		deepClone
	} from "@/utils/index"
	const {
		proxy
	} = getCurrentInstance();
	const activeNames = ref(['1']); //tab打开状态
	const single = ref(true);
	const multiple = ref(true);
	const ids = ref([]);
	const loading = ref(false);
	const open = ref(false);
	const title = ref("");
	const total = ref(50);
	const currentPage1 = ref(1);

	const uploadFileUrl = ref(import.meta.env.VITE_APP_BASE_API + "/common/file/upload"); // 上传文件服务器地址
	const headers = ref({
		Authorization: getToken()
	});
	const props = defineProps({
		commonFileList: {
			type: Array,
			default: [],
		},
		reportId: {
			type: String,
			default: "",
		},
		routerQueryObj: {
			type: Object,
			default: null,
		},
		fileSize: {
			type: String,
			default: "",
		},
		fileType: {
			type: Array,
			default: ['xlsx', 'xls'],
		}
	});
	const {
		sys_file_biz_type,
		sys_file_source
	} = proxy.useDict("sys_file_biz_type", "sys_file_source"); //下拉框字典
	const dataScope = reactive({
		// formData: {},
		form: {
			bizTypeName: ""
		},
		rowSelect: {}
	})

	const {
		form,
		rowSelect
	} = toRefs(dataScope);
	let tableData = ref([]);

	function handleChange(val) {
		console.log(val);
	}
	let formData = ref({

		"commonFileList": [],
		"file": null,
	}); //不能修改const 定义的数据
	watch(() => props.commonFileList, (newValue, oldValue) => {
		console.log(newValue);
		if (newValue) {
			formData.value.commonFileList = deepClone(newValue);
		}
		console.log(formData)
	}, {
		immediate: true,
		deep: true
	})

	// 多选框选中数据
	function handleSelectionChange(selection) {
		ids.value = selection.map(item => item.fileUrl);
		single.value = selection.length != 1;
		multiple.value = !selection.length;
	}

	function handleRemove(file, fileList) {
		console.log(file, fileList);
	}

	function handlePreview(file) {
		console.log(file);
	}
	// 上传前loading加载
	function handleBeforeUpload(file) {
		console.log(file)
		let isFile = false;
		if (props.fileType.length) {
			let fileExtension = "";
			if (file.name.lastIndexOf(".") > -1) {
				fileExtension = file.name.slice(file.name.lastIndexOf(".") + 1);
			}
			isFile = props.fileType.some(type => {
				if (file.type.indexOf(type) > -1) return true;
				if (fileExtension && fileExtension.indexOf(type) > -1) return true;
				return false;
			});
		} else {
			isFile = file.type.indexOf("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") > -1;
		}
		if (!isFile) {
			proxy.$modal.msgError(
				`文件格式不正确, 请上传${props.fileType.join("/")}图片格式文件!`
			);
			return false;
		}

		if (props.fileSize) {
			const isLt = file.size / 1024 / 1024 < props.fileSize;
			if (!isLt) {
				proxy.$modal.msgError(`上传文件大小不能超过 ${props.fileSize} MB!`);
				return false;
			}
		}
		proxy.$modal.loading("正在上传文件，请稍候...");
	}

	function handleExceed(files, fileList) {
		proxy.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
	}

	function beforeRemove(file, fileList) {
		// return proxy.$confirm(`确定移除 ${file.name}？`);
	}

	function uploadSuccess(response, file, fileList) {
		proxy.$modal.closeLoading();
		if (response.code === 200) {
			response.data.tableId = props.reportId;
			formData.value.commonFileList[0] = response.data;
			formData.value['file'] = file;
		} else {
			console.log(fileList);
			proxy.$modal.msgError(response.msg);
			proxy.$refs.fileUpload.handleRemove(file);
			console.log(fileList);
		}

	}

	function handleDelete(rows) {
		const fileName = rows ? [rows.fileName] : ids.value;
		proxy.$modal.confirm('是否确认删除文件名为"' + fileName + '"的数据项？').then(function() {
			fileName.forEach((names) => {
				formData.value.commonFileList = formData.value.commonFileList.filter((item) => {
					return item.fileName != names;
				})
				console.log()
			})
			single.value = false;
			multiple.value = false;

		}).catch((e) => {
			console.log(e)
		});
	}

	function handleExport(rows) {
		const fileUrl = rows ? [rows.fileUrl] : ids.value;
		proxy.$download.resource(fileUrl);
		// proxy.download('/common/download/resource',{resource:fileUrl})
		// window.open(import.meta.env.VITE_APP_BASE_API + '/common/download/resource?resource='+ fileUrl,'_blank')
		// downloadFile(fileUrl).then(function () {
		//     proxy.$message('下载完成！')
		// }).catch((e) => { console.log(e) });
	}
	/** 新增按钮操作 */
	function openDiag(row) {
		reset();
		open.value = true;
		title.value = "附件类型";
		rowSelect.value = row;
		tableData.value = sys_file_biz_type.value;
		console.log(tableData);
	}

	function searchBiztypeName() {
		if (sys_file_biz_type.value) {
			tableData = sys_file_biz_type.value.filter((item) => {
				console.log(item)
				if (form && form.value.bizTypeName) {
					return item.label.toString().indexOf(form.value.bizTypeName) > -1
				} else {
					return item
				}
			})
			proxy.$forceUpdate()
		}
	}

	function selececlientRow(row) {
		if (row) {
			rowSelect.value.bizType = row.value;

		}
		open.value = false;

	}

	function reset() {
		form.value = {
			bizTypeName: ""
		};
	}
	/** 下载模板操作 */
	function importTemplate() {
		// console.log(useUserStore().templates.custFinanceReport)
		//    proxy.$download.resource(useUserStore().templates.custFinanceReport);
		// let url = '@/assets/file/财务报表模板.xlsx';
		// 创建一个隐藏的<a>标签
		const link = document.createElement('a')
		link.style.display = 'none'
		document.body.appendChild(link)

		// 设置文件的 URL 和名称
		link.setAttribute('download', '财务报表模板.xlsx')
		link.setAttribute('href', `/static/reportforms.xlsx?t=${Date.now()}`)

		// 模拟点击链接进行下载
		link.click()

		// 移除创建的<a>标签
		document.body.removeChild(link)
		//   proxy.download(useUserStore.templates.custFinanceReport, {
		//   }, `finance_template_${new Date().getTime()}.xlsx`);
	};

	defineExpose({
		formData,
	});
</script>
<style lang="scss" scoped>
	.header-button-operate {
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
	}

	.upload-demo {
		display: flex;
		margin-right: 10px;
	}

	.table-content {
		display: flex;
		justify-content: center;

	}

	.biz-type-button {
		display: flex;
	}
</style>