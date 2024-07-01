<template>
    <div class="app-container" ref="appContainerView">
        <div class="content">
            <div class="operate-button">
                <el-row :gutter="10" class="mb8 " justify="end">

                    <el-col :span="1.5">
                        <el-button type="primary" icon="CircleCloseFilled" @click="closePage">返回</el-button>
                    </el-col>


                </el-row>
            </div>
            <div class="zhanwei"></div>


         
                <el-descriptions title="凭证转让"  :column="1" border>
                    <el-descriptions-item label="操作结果">提交成功</el-descriptions-item>
                    <el-descriptions-item label="通知书">
                        <el-tag>应收账款转让明细表</el-tag>
                        
                        </el-descriptions-item>


                    <el-descriptions-item label="批次号">XXXX</el-descriptions-item>
                
                </el-descriptions>
          </div>
   
    </div>
</template>

<script setup>
import { getDebtInfo, addDebtInfo, updateDebtInfo } from "@/api/debt/info.js"

const { proxy } = getCurrentInstance();
const debtId = ref("");
const route = useRoute();
const router = useRouter();

let routerQueryObj = ref({});
watch(route, (newRoute) => {
    routerQueryObj.value.viewFlag = history.state && history.state.viewFlag;
    routerQueryObj.value.pageNum = history.state && history.state.pageNum;
    debtId.value = history.state && history.state.debtId;
}, { immediate: true });

function closePage() {
    const obj = { path: "/debt/info", query: { t: Date.now(), pageNum: routerQueryObj.value.pageNum } };
    proxy.$tab.closeOpenPage(obj);
}
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