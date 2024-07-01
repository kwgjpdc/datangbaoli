<template>
    <div class="app-container" v-loading="loading" ref="appContainerView">


        <div class="content">
            <div class="operate-button">
                <el-row :gutter="10" class="mb8 " justify="end">
                    <!-- <div class=""> -->
                    <!--  -->
                    <el-col :span="1.5" v-if="!routerQueryObj.viewFlag">
                        <el-button type="primary" icon="List" @click="submitForm()">保存</el-button>
                    </el-col>
                  
                    <el-col :span="1.5">
                        <el-button type="primary" icon="CircleCloseFilled" @click="closePage">取消</el-button>
                    </el-col>

                </el-row>
            </div>
            <div class="zhanwei" ></div>
            <div class="content-item-scroll">
                <basic-info id="basicInfo" :reportInfo="reportInfo" ref="basicInfoRef" :reportId="reportId"
                    :routerQueryObj="routerQueryObj"></basic-info>
            </div>


            <div class="content-item-scroll">
                <attach-info id="attachInfo" ref="attachInfoRef" :commonFileList="reportInfo.commonFileList"
                    :routerQueryObj="routerQueryObj" :reportId="reportId"></attach-info>
            </div>
        </div>




    </div>
</template>
<script setup>
import { getReport, addReport, updateReport } from "@/api/customer/report.js"
import basicInfo from './reportBasicInfo.vue'
import attachInfo from './reportAttachInfo.vue'
const { proxy } = getCurrentInstance();
const reportId = ref("");
const route = useRoute();
const router = useRouter();
const loading = ref(false);

const data = reactive({
    reportInfo: {
       
        "createTime": null,
        "delFlag": null,
        "remark": null,
        "reportId": null,
        "reportNo": "",
        "customerId": null,
        "customerNo": "",
        "customerName": "",
        "reportType": "",
        "reportYear": null,
        "reportQuarter": null,
        "reportMonth": null,
        "reserve1": null,
        "reserve2": null,
        "reserve3": null,
        "reserve4": null,
        "reserve5": null,
        "commonFileList": []
    },       //客户信息

});
const { reportInfo } = toRefs(data);
let routerQueryObj = ref({});
watch(route, (newRoute) => {
    console.log(newRoute.query);
    reportId.value = newRoute.query && newRoute.query.reportId;//{customerId:"queryParam0"}
    routerQueryObj.value.viewFlag = newRoute.query && newRoute.query.viewFlag;
}, { immediate: true });
/** 修改的时候查询客户基本信息列表 */
function getReportInfoPage() {
    if (reportId.value) {
        loading.value = true;
        getReport(reportId.value).then(response => {
            reportInfo.value = response.data;
            loading.value = false;
        });
    }
}
// 表单验证

function submitForm() {
    if(proxy.$refs['attachInfoRef'].formData.commonFileList.length!=1) {
        proxy.$modal.msgError('请上传文件再保存' );
        return;
    }
    const basicInfoRefForm = new Promise((resolve, reject) => {
        proxy.$refs['basicInfoRef'].$refs['elForm'].validate(valid => {
            valid ? resolve(valid) : reject(valid)

        })
    })



   
    Promise.all([basicInfoRefForm]).then(() => {
        const formKeys = ['basicInfoRef', 'attachInfoRef'];
        let reportInfoSave = reportInfo.value;
        formKeys.map(formKey => {
            const partFormData = proxy.$refs[formKey].formData
            Object.assign(reportInfoSave, partFormData)
        })
       
        console.log(reportInfoSave);
        if(reportInfoSave.reportYear) {
            reportInfoSave.reportYear =  reportInfoSave.reportYear.getFullYear();
        }

        console.log(reportInfoSave);
        let formData = new FormData();
            formData.set("file", reportInfoSave.file.raw);
            let {file,...formDataSend}= reportInfoSave;
            formData.set("report", JSON.stringify(formDataSend));
            console.log(formData);
        if (!reportId.value) {
            //新增

            addReport(formData).then(response => {
                proxy.$modal.msgSuccess("新增成功");
                loading.value = false;
                closePage()
            });
        } else {
            //修改
            //修改
            updateReport(formData).then(response => {
                proxy.$modal.msgSuccess("修改成功");
                loading.value = false;
                closePage()
            });
        }
    })


}
function closePage() {
    const obj = { path: "/customer/customer/report", query: { t: Date.now(), pageNum: route.query.pageNum } };
    proxy.$tab.closeOpenPage(obj);
}


getReportInfoPage();


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
  