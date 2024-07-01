<template>
    <div class="app-container" v-loading="loading" ref="appContainerView">


        <div class="content">
            <div class="operate-button">
                <el-row :gutter="10" class="mb8 " justify="end">
                    <!-- <div class=""> -->
                    <!--  -->
                    <el-col :span="1.5" v-if="!routerQueryObj.viewFlag">
                        <el-button type="primary" icon="List" @click="submitForm(1)">保存</el-button>
                    </el-col>
                    <el-col :span="1.5" v-if="!routerQueryObj.viewFlag">
                        <el-button type="primary" icon="Checked" @click="submitForm(2)">提交</el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button type="primary" icon="CircleCloseFilled" @click="closePage">取消</el-button>
                    </el-col>
                    <!-- </div> -->

                </el-row>
            </div>
            <div class="zhanwei"></div>
            <div class="content-item-scroll">
                <basic-info id="basicInfo" :interactInfo="interactInfo" ref="basicInfoRef" :interactId="interactId"
                :routerQueryObj="routerQueryObj"></basic-info>
            </div>

            <div class="content-item-scroll">
                <warn-info id="warnInfo" :warningList="interactInfo.warningList" :interactId="interactId" :routerQueryObj="routerQueryObj" :dept-id="interactInfo.deptId"
                    ref="warnInfoRef"></warn-info>
            </div>

            <div class="content-item-scroll">
                <attach-info id="attachInfo" ref="attachInfoRef" :commonFileList="interactInfo.commonFileList" :routerQueryObj="routerQueryObj"
                    :interactId="interactId"></attach-info>
            </div>
            <!-- <el-button icon="Refresh" @click="resetQuery">取消</el-button> -->
        </div>




    </div>
</template>
<script setup>
import { getInteract,getInteractSeq,addInteract,updateInteract } from "@/api/customer/interact.js"
import basicInfo from './basicInfo.vue'
import attachInfo from './attachInfo.vue'
import warnInfo from './warnInfo.vue'
import useUserStore from '@/store/modules/user'
const active = ref(0);
const { proxy } = getCurrentInstance();
const interactId = ref("");
const route = useRoute();
const router = useRouter();
const loading = ref(false);


const data = reactive({
    interactInfo: {
        "createBy": null,
        "createById": null,
        "createTime": null,
        "updateBy": null,
        "updateById": null,
        "updateTime": null,
        "delFlag": "",
        "remark": null,
        "deptId": "",
        "interactNo": "",
        "customerId": "",
        "customerName": "",
        "projectId": "",
        "projectName": "",
        "contacts": "",
        "contactsWay": "",
        "interviewDate": "",
        "interviewStartTime": "",
        "interviewEndTime": "",
        "interactAbstract": null,
        "interviewWay": null,
        "status": null,
        "content": null,
        "noticeScope": null,
        "warningList":[],
        "commonFileList":[],
    },       //客户信息

});

const { interactInfo } = toRefs(data);
const { cust_register_country, cust_customer_type, cust_company_type, cust_customer_category, sys_true_or_false, sys_id_card_type, cust_enterprise_type, cust_contact_job_category } = proxy.useDict("cust_register_country", "cust_customer_type", "cust_customer_type", "cust_customer_category", "sys_true_or_false", "sys_id_card_type", "cust_enterprise_type", "cust_contact_job_category");//下拉框字典
let routerQueryObj = ref({});
watch(route, (newRoute) => {
    console.log(newRoute.query);
    interactId.value = newRoute.query && newRoute.query.interactId;//{customerId:"queryParam0"}
    routerQueryObj.value.viewFlag = newRoute.query && newRoute.query.viewFlag;
}, { immediate: true });
/** 修改的时候查询客户基本信息列表 */
function getInfoPage() {
    if (interactId.value) {
        loading.value = true;
        getInteract(interactId.value).then(response => {
            interactInfo.value = response.data;
            // deptId 如果为空 赋值
            if(!interactInfo.value.deptId) {
                interactInfo.value.deptId = useUserStore().dept.deptId;
            }

            loading.value = false;
        });
    } else {
        interactInfo.value.deptId = useUserStore().dept.deptId;
        interactInfo.value.deptName = useUserStore().dept.deptName;
        // loading.value = true;
        // getInteractSeq().then(response => {
        //     console.log(response);
        //     interactInfo.value.interactNo = response.msg;
        //     // interactNo.value = response.msg;
        //     loading.value = false;
        // });
    }
}

function submitForm(statusFlag) {
    // handleSave();
    // return;
    const basicInfoRefForm = new Promise((resolve, reject) => {
        proxy.$refs['basicInfoRef'].$refs['elForm'].validate(valid => {
            valid ? resolve(valid) : reject(valid)

        })
    })

    Promise.all([basicInfoRefForm]).then(() => {
        const formKeys = ['basicInfoRef','warnInfoRef','attachInfoRef'];
        let interactInfoSave = interactInfo;
        formKeys.map(formKey => {
            const partFormData = proxy.$refs[formKey].formData
            Object.assign(interactInfoSave, partFormData)
        })
        console.log(interactInfoSave);
        // 处理通知范围
        if (interactInfoSave.noticeScope.length) {
            interactInfoSave.noticeScope = interactInfoSave.noticeScope.join(',')
        } else {
            interactInfoSave.noticeScope = "";
        }


        interactInfoSave.status = statusFlag;


        // 处理开始时间结束时间
        // if (interactInfoSave.interviewStartTime) {
        //     interactInfoSave.interviewStartTime = formatTime(interactInfoSave.interviewStartTime);
        // } 
        // if (interactInfoSave.interviewEndTime) {
        //     interactInfoSave.interviewEndTime = formatTime(interactInfoSave.interviewEndTime);
        // } 
        console.log(interactInfoSave);
        if (!interactId.value) {
            //新增
            addInteract(interactInfoSave).then(response => {
                proxy.$modal.msgSuccess("新增成功");
                loading.value = false;
                closePage()
            });
        } else {
            //修改
            //修改
            updateInteract(interactInfoSave).then(response => {
                proxy.$modal.msgSuccess("修改成功");
                loading.value = false;
                closePage()
            });
        }
    })


}
function formatTime(time){
    return time.getHours().toString().padStart(2, '0') + ':' + time.getMinutes().toString().padStart(2, '0') +':' + time.getSeconds().toString().padStart(2, '0');
}
function closePage() {
    const obj = { path: "/customer/talk/search", query: { t: Date.now(), pageNum: route.query.pageNum } };
    proxy.$tab.closeOpenPage(obj);
}


getInfoPage();


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
    height: 30px;
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

}</style>
  