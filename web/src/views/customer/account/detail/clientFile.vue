<template>
	<div class="info-form">
		<el-collapse v-model="activeNames">
			<el-collapse-item title="附件信息" name="5">
				<el-card class="box-card">
					<template #header>
						<!-- <span>附件信息</span> -->
						<div
							class="header-button-operate"
							v-if="!props.routerQueryObj.viewFlag"
						>
							<el-upload
								class="upload-demo"
								:action="uploadFileUrl"
								:headers="headers"
								:on-preview="handlePreview"
								:on-remove="handleRemove"
								:before-remove="beforeRemove"
								:on-exceed="handleExceed"
								:on-success="uploadSuccess"
								:show-file-list="false"
								ref="fileUpload"
							>
								<el-button
									type="primary"
									link
									:disabled="props.routerQueryObj.viewFlag"
									>上传文件</el-button
								>
							</el-upload>
						</div>
					</template>
					<el-table
						v-loading="loading"
						:data="formData.commonFileList"
						@selection-change="handleSelectionChange"
					>
						<el-table-column
							type="selection"
							width="55"
							align="center"
							:disabled="props.routerQueryObj.viewFlag"
						/>
						<el-table-column
							label="文件类型"
							align="center"
							prop="fileType"
							:min-width="80"
						/>
						<el-table-column
							label="文件名称"
							align="center"
							prop="fileName"
							:min-width="240"
						/>

						<el-table-column
							label="文件大小"
							align="center"
							prop="fileSize"
							:min-width="120"
						>
							<template #default="scope">
								<span>{{ formatFileSize(scope.row.fileSize) }}</span>
							</template>
						</el-table-column>

						<el-table-column
							label="文件描述"
							align="center"
							prop="remark"
							:min-width="240"
						>
							<template #default="scope">
								<el-input
									v-model="scope.row.remark"
									type="textarea"
									placeholder="请输入文件描述"
								/>
							</template>
						</el-table-column>

						<el-table-column
							label="操作人"
							align="center"
							prop="createBy"
							:min-width="120"
						/>
						<el-table-column
							label="操作时间"
							align="center"
							prop="createTime"
							:min-width="160"
						>
							<template #default="scope">
								<span>{{
									parseTime(scope.row.updateTime, "{y}-{m}-{d}")
								}}</span>
							</template>
						</el-table-column>
						<el-table-column
							label="最近修改人"
							align="center"
							prop="updateBy"
							:min-width="120"
						/>
						<el-table-column
							label="最近修改时间"
							align="center"
							prop="updateTime"
							:min-width="160"
						>
							<template #default="scope">
								<span>{{
									parseTime(scope.row.updateTime, "{y}-{m}-{d}")
								}}</span>
							</template>
						</el-table-column>

						<el-table-column
							label="操作"
							align="center"
							width="120"
							fixed="right"
							class-name="small-padding fixed-width"
							v-if="!props.routerQueryObj.viewFlag"
						>
							<template #default="scope">
								<el-button
									link
									type="primary"
									icon="Delete"
									@click="handleDelete(scope.row)"
									v-hasPermi="['sys:file:remove']"
									title="删除"
								></el-button>
								<el-button
									link
									type="primary"
									icon="download"
									@click="handleExport(scope.row)"
									v-hasPermi="['sys:file:export']"
									title="下载"
								></el-button>
							</template>
						</el-table-column>
					</el-table>
				</el-card>
			</el-collapse-item>
		</el-collapse>
	</div>
</template>

<script setup>
import { getToken } from "@/utils/auth";
// import { downloadFile } from "@/api/customer/file";
import { deepClone } from "@/utils/index";
import { formatFileSize } from "@/utils/index";
const { proxy } = getCurrentInstance();
const activeNames = ref(["5"]); //tab打开状态
const single = ref(true);
const multiple = ref(true);
const ids = ref([]);
const loading = ref(false);
// const open = ref(false);
// const title = ref("");
// const total = ref(50);
// const currentPage1 = ref(1);

const uploadFileUrl = ref(
	import.meta.env.VITE_APP_BASE_API + "/common/file/upload"
); // 上传文件服务器地址
const headers = ref({ Authorization: getToken() });
const props = defineProps({
	infoData: {
		type: Array,
		default: []
	},
	customerId: {
		type: String,
		default: ""
	},
	routerQueryObj: {
		type: Object,
		default: null
	}
});
const { sys_file_biz_type, sys_file_source, cust_file_type } = proxy.useDict(
	"sys_file_biz_type",
	"sys_file_source",
	"cust_file_type"
); //下拉框字典

const dataScope = reactive({
	form: { bizTypeName: "" },
	rowSelect: {}
});

const { form, rowSelect } = toRefs(dataScope);

let tableData = ref([]);

// 取名formData 方便父组件 直接取对应的对象
let formData = ref({
	commonFileList: []
});

//不能修改const 定义的数据
watch(
	() => props.infoData,
	(newValue, oldValue) => {
		if (newValue) {
			formData.value.commonFileList = deepClone(newValue);
		}
	},
	{ immediate: true, deep: true }
);

// let routerQueryObj = ref({});
// watch(() => props.routerQueryObj, (newValue, oldValue) => {
//     routerQueryObj.value = newValue;
// }, { immediate: true, deep: true })

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
function handleExceed(files, fileList) {
	this.$message.warning(
		`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
			files.length + fileList.length
		} 个文件`
	);
}
function beforeRemove(file, fileList) {
	return this.$confirm(`确定移除 ${file.name}？`);
}
function uploadSuccess(response, file, fileList) {
	// 表格添加上传的数据返回
	if (response.code === 200) {
		response.data.tableId = props.customerId;
		formData.value.commonFileList.push(response.data);
	} else {
		proxy.$modal.msgError(response.msg);
		proxy.$refs.fileUpload.handleRemove(file);
	}
}
// 删除已上传的文件 ，在commonFileList中
function handleDelete(rows) {
	const fileName = rows ? [rows.fileName] : ids.value;
	proxy.$modal
		.confirm('是否确认删除文件名为"' + fileName + '"的数据项？')
		.then(function () {
			fileName.forEach(names => {
				formData.value.commonFileList = formData.value.commonFileList.filter(
					item => {
						return item.fileName != names;
					}
				);
			});
			single.value = false;
			multiple.value = false;
		})
		.catch(e => {
			console.log(e);
		});
}
// 下载已上传的文件内容
function handleExport(rows) {
	const fileUrl = rows ? [rows.fileUrl] : ids.value;
	proxy.$download.resource(fileUrl);
}

//   弹窗中查询附件类型
// function searchBiztypeName() {
// 	if (sys_file_biz_type.value) {
// 		tableData = sys_file_biz_type.value.filter(item => {
// 			console.log(item);
// 			if (form && form.value.bizTypeName) {
// 				return item.label.toString().indexOf(form.value.bizTypeName) > -1;
// 			} else {
// 				return item;
// 			}
// 		});
// 		proxy.$forceUpdate();
// 	}
// }
//   选中某一条数据
// function selececlientRow(row) {
// 	if (row) {
// 		rowSelect.value.bizType = row.value;
// 	}
// }
//   重置数据
// function reset() {
// 	form.value = { bizTypeName: "" };
// }

// 将formData暴露出去父组件取值；
defineExpose({
	formData
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
