<template>
    <div>
        <el-row :gutter="15">
            <el-col :span="24" :xs="24">
                <el-collapse @change="handleChange" v-model="activeNames">
                    <el-collapse-item title="附件信息" name="1">
                        <el-card class="box-card">
                            <template #header>
                                <!-- <span>附件信息</span> -->
                                <div class="header-button-operate" v-if="!props.routerQueryObj.viewFlag">
                                    <el-upload class="upload-demo" :action="uploadFileUrl"
                                        :headers="headers" :on-preview="handlePreview" :on-remove="handleRemove"
                                        :before-remove="beforeRemove" :on-exceed="handleExceed" :on-success="uploadSuccess"
                                        :show-file-list="false" ref="fileUpload">
                                        <el-button  type="primary" link>上传文件</el-button>
                                    </el-upload>

                                    <!-- <el-button type="primary" link
                                        @click="handleDelete()" :disabled="single">删除</el-button>
                                    <el-button type="text"
                                        @click="handleExport" v-hasPermi="['sys:file:export']" :disabled="single||multiple">批量下载</el-button> -->
                                </div>

                            </template>
                            <el-table v-loading="loading" :data="formData.commonFileList"
                                @selection-change="handleSelectionChange" >
                                <el-table-column type="selection" width="55" align="center" />

                                <el-table-column label="文件名称" align="center" prop="fileName" width="250"/>
                                <!-- <el-table-column label="oss上文件存储地址" align="center" prop="fileUrl" /> -->
                                <el-table-column label="文件大小" align="center" prop="fileSize">
                                    <template #default="scope">
                                        <span>{{ formatFileSize(scope.row.fileSize) }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="文件类型" align="center" prop="fileType" />
                                <el-table-column label="附件类型" align="center"  prop="bizType" >
                                    <template #default="scope">
                                            <div @click="openDiag(scope.row)" class="biz-type-button">
                                            <dict-tag :options="sys_file_biz_type" :value="scope.row.bizType" />
                                            <el-button link type="primary" icon="Search" :disabled="props.routerQueryObj.viewFlag"></el-button>
                                            </div>
                                    </template>
                                </el-table-column>
                                <el-table-column label="附件来源" align="center" prop="fileSource" >
                                    <template #default="scope">
                                        <el-select v-model="scope.row.fileSource"  placeholder="请选择"
                                        :disabled="props.routerQueryObj.viewFlag">
                                        <el-option v-for="item in sys_file_source" :key="item.value" :label="item.label"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>
                                    </template>
                                </el-table-column>
                                

                                <el-table-column label="操作人" align="center" prop="updateBy" />
                                <el-table-column label="操作时间" align="center" prop="updateTime" > 
                                    <template #default="scope">
                                        <span>{{ parseTime(scope.row.updateTime, '{y}-{m}-{d}') }}</span>
                                    </template>
                                </el-table-column>
                                <!-- <el-table-column label="备注" align="center" prop="remark" /> -->
                                <el-table-column label="操作" align="center" class-name="small-padding fixed-width" v-if="!props.routerQueryObj.viewFlag">
                                    <template #default="scope">
                                        <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
                                            v-hasPermi="['sys:file:remove']" title="删除"></el-button>
                                        <el-button link type="primary" icon="download" @click="handleExport(scope.row)"
                                            v-hasPermi="['sys:file:export']" title="下载"></el-button>
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
        <el-form ref="fileRef" :model="form"  label-width="140px">
          <el-form-item label="附件类型名称" prop="bizTypeName">
            <el-input v-model="form.bizTypeName" placeholder="请输入附件类型名称" clearable />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="searchBiztypeName">查询</el-button>
          </el-form-item>
        </el-form>
        </el-col>
        </el-row>
        <div class="table-content" >
        <el-row justify="center">
          <el-col :span="24">
         <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 300px;margin: 0;"
                                 @row-click="selececlientRow"  height="350">
                              
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
                                <el-pagination
                                :current-page="currentPage1" :page-size="100" layout="total, prev, pager, next"
                                :total="total">
                            </el-pagination>
                            </div>
      </el-dialog>
    </div>
</template>
<script setup>
import { formatFileSize} from "@/utils/index"
import {deepClone} from "@/utils/index"
import { getToken } from "@/utils/auth";
const { proxy } = getCurrentInstance();
const activeNames = ref(['1']);//tab打开状态
const single = ref(true);
const multiple = ref(true);
const ids = ref([]);
const loading = ref(false);
const open = ref(false);
const title = ref("");
const total = ref(50);
const currentPage1 = ref(1);

const uploadFileUrl = ref(import.meta.env.VITE_APP_BASE_API + "/common/file/upload"); // 上传文件服务器地址
const headers = ref({ Authorization: getToken() });
const props = defineProps({
    commonFileList: {
        type: Array,
        default: [],
    }, diligenceId: {
        type: String,
        default: "",
    },
    routerQueryObj:{
        type: Object,
        default: null,
    }
});
const { sys_file_biz_type,sys_file_source } = proxy.useDict("sys_file_biz_type","sys_file_source");//下拉框字典
const dataScope = reactive({
    // formData: {},
    form:{bizTypeName:""},
    rowSelect:{}
})

const { form,rowSelect } = toRefs(dataScope);
let tableData = ref([]);
function handleChange(val) {
    console.log(val);
}
let formData = ref({

    "commonFileList": [],
});//不能修改const 定义的数据
watch(() => props.commonFileList, (newValue, oldValue) => {
    console.log(newValue);
    if(newValue) {
        formData.value.commonFileList = newValue; 
    }
    console.log(formData)
}, { immediate: true, deep: true })

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
    this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
}
function beforeRemove(file, fileList) {
    return this.$confirm(`确定移除 ${file.name}？`);
}
function uploadSuccess(response, file, fileList) {
    if (response.code === 200) {
    response.data.tableId = props.diligenceId;
    formData.value.commonFileList.push(response.data);
  } else {
    proxy.$modal.msgError(response.msg);
    proxy.$refs.fileUpload.handleRemove(file);
    console.log(fileList);
  }
}
function handleDelete(rows) {
    const fileName = rows ? [rows.fileName] : ids.value;
    proxy.$modal.confirm('是否确认删除文件名为"' + fileName + '"的数据项？').then(function () {
        fileName.forEach((names) => {
            formData.value.commonFileList = formData.value.commonFileList.filter((item) => {
                return item.fileName != names;
            })

        })
        single.value = false;
        multiple.value = false;

    }).catch((e) => { console.log(e) });
}
function handleExport(rows){
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
  function searchBiztypeName(){
    if(sys_file_biz_type.value) {
    tableData.value =  sys_file_biz_type.value.filter((item)=>{
        if(form && form.value.bizTypeName ) {
          return item.label.toString().indexOf(form.value.bizTypeName) > -1
        } else {
          return item
        }
    })
    proxy.$forceUpdate()
    } 
  }
  function selececlientRow(row) {
    if(row) {
        rowSelect.value.bizType = row.value;
       
    }
    open.value = false;
    
  }
  function reset(){
    form.value = {bizTypeName:""};
  }


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
display:flex;
  justify-content:center;
  
}
.biz-type-button{
    display: flex;
}
</style>