<template>
    <div class="app-container" v-loading="loading" ref="appContainerView">


        <div class="content">
            <div class="operate-button" v-if="!routerQueryObj.approveFlag">
                <el-row :gutter="10" class="mb8 " justify="end">
                    <!-- <div class=""> -->
                    <!--  -->
                    <el-col :span="1.5" v-if="!routerQueryObj.viewFlag">
                        <el-button type="primary" icon="List" @click="submitForm(1)">保存</el-button>
                    </el-col>
                    <el-col :span="1.5" v-if="!routerQueryObj.viewFlag">
                        <el-button type="primary" icon="Checked" @click="submitForm(2)">保存并提交审批</el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button type="primary" icon="CircleCloseFilled" @click="closePage">取消</el-button>
                    </el-col>

                </el-row>
            </div>
            <div class="zhanwei" ></div>
            <div class="content-item-scroll">
                <basic-info id="basicInfo" :projectInfo="projectInfo" ref="basicInfoRef" :projectId="projectId"
                    :routerQueryObj="routerQueryObj"></basic-info>
            </div>


            <div class="content-item-scroll">
                <attach-info id="attachInfo" ref="attachInfoRef" :commonFileList="projectInfo.commonFileList"
                    :routerQueryObj="routerQueryObj" :projectId="projectId"></attach-info>
            </div>
        </div>


        <DialogTableMulti v-model:multiQuery="multiQuery" v-model:open="multiQuery.open" v-model:tableData="tableData"
            v-model:prop="propMulti" @selectRow="selectRow" @pageChange="pageChange" />

    </div>
</template>
<script setup>
import { ref, computed, onBeforeMount, watch } from "vue";
import { getProjInfo, addProjInfo, updateProjInfo } from "@/api/project/info.js"
import basicInfo from './projBasicInfo.vue'
import attachInfo from './projAttachInfo.vue'
const { proxy } = getCurrentInstance();
const projectId = ref("");
const route = useRoute();
const router = useRouter();
const loading = ref(false);
let multiQuery = ref({
    title: "卖方客户信息",//标题
    open: false,
    currentPage: 1,
    total: 1,
    pageSize: 10,
});
const props = defineProps({
	approveId: {
		type: Number
	}
})
const propMulti = ref([{
    label: '客户编号',
    value: 'customerNo'
}, {
    label: '上级公司',
    value: 'parentCustomerName'
}, {
    label: '客户名称',
    value: 'customerName'
}]);
const data = reactive({
    projectInfo: {
        "createTime": "",
        "updateTime": "",
        "delFlag": null,
        "remark": null,
        "projectId": null,
        "deptId": null,
        "projectType": "",
        "sponsor": "",
        "sponsorCustomerId": "",
        "sponsorCustomerName": "",
        "projectNo": "",
        "projectBeginDate": "",
        "projectName": "",
        "projectSource": "",
        "projectStatus": "",
        "sourceName": "",
        "projectBelongCompany": "",
        "firstChargeId": null,
        "firstChargeName": "",
        "secondChargeId": null,
        "secondChargeName": "",
        "ratio": null,
        "mainBusiness": null,
        "accountsReceivableScale": null,
        "paybackMode": "",
        "creditLimit": null,
        "lendingDate": null,
        "financingTerm": null,
        "financingRatio": null,
        "creditLimitStartDate": null,
        "creditLimitEndDate": null,
        "commonFileList": []
    },       //客户信息

});
const { projectInfo } = toRefs(data);
let routerQueryObj = ref({});
watch(route, (newRoute) => {
	if(props.approveId){
		routerQueryObj.value.viewFlag = true;
		routerQueryObj.value.approveFlag = true;
		projectId.value = props.approveId;
	}else{
		projectId.value = newRoute.query && newRoute.query.projectId;//{customerId:"queryParam0"}
		routerQueryObj.value.viewFlag = newRoute.query && newRoute.query.viewFlag;
	}
}, { immediate: true });
/** 修改的时候查询客户基本信息列表 */
function getProjInfoPage() {
    if (projectId.value) {
        loading.value = true;
        getProjInfo(projectId.value).then(response => {
            projectInfo.value = response.data;
            loading.value = false;
        });
    }
}
// 表单验证

function submitForm(statusFlag) {
    const basicInfoRefForm = new Promise((resolve, reject) => {
        proxy.$refs['basicInfoRef'].$refs['elForm'].validate(valid => {
            valid ? resolve(valid) : reject(valid)

        })
    })



   
    Promise.all([basicInfoRefForm]).then(() => {
        const formKeys = ['basicInfoRef', 'attachInfoRef'];
        let projectInfoSave = projectInfo.value;
        formKeys.map(formKey => {
            const partFormData = proxy.$refs[formKey].formData
            Object.assign(projectInfoSave, partFormData)
        })
       
         // 处理项目主办
         if (projectInfoSave.firstChargeName.length) {
            projectInfoSave.firstChargeName = projectInfoSave.firstChargeName.join(',')
        } else {
            projectInfoSave.firstChargeName = "";
        }
        if (projectInfoSave.secondChargeName.length) {
            projectInfoSave.secondChargeName = projectInfoSave.secondChargeName.join(',')
        } else {
            projectInfoSave.secondChargeName = "";
        }

        projectInfoSave.projectStatus = statusFlag;
        projectInfoSave.auditStatus = statusFlag;


        console.log(projectInfoSave);
        if (!projectId.value) {
            //新增
            addProjInfo(projectInfoSave).then(response => {
                proxy.$modal.msgSuccess("新增成功");
                loading.value = false;
                closePage()
            });
        } else {
            //修改
            //修改
            updateProjInfo(projectInfoSave).then(response => {
                proxy.$modal.msgSuccess("修改成功");
                loading.value = false;
                closePage()
            });
        }
    })


}
function closePage() {
    const obj = { path: "/project/info", query: { t: Date.now(), pageNum: route.query.pageNum } };
    proxy.$tab.closeOpenPage(obj);
}


getProjInfoPage();


</script>
<style lang="scss" scoped>
.app-container {
    position: relative;
    height: calc(100vh - 85px);
    overflow: scroll;
}

// .fixed-head {
//     position: fixed;
//     top: 50px;
//     right: 50px;
//     left: 50px;
//     z-index: 100;
// }

.nav-bar {
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 200px;
    right: 20px;

    .item {
        padding: 8px 16px;
        color: #606266;
    }

    .active {
        color: #1890ff;
        ;
        // background-color: #e2e2e2;
    }
}

.content-item-scroll {
    margin-bottom: 20px;
}

.zhanwei {
    height: 40px;
    display: block;
}

.operate-button {
    position: fixed;
    top: 83px;
    z-index: 100;
    background: #fff;
    right: 0;
    left: 0;
    padding: 5px 15px;
    // margin: 20px;

}

.card-header {
    display: flex;
    justify-content: space-between;
}
</style>
  