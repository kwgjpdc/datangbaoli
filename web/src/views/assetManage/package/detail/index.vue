<template>
    <div class="app-container" v-loading.fullscreen.lock="loading" ref="appContainerView">
        <div class="content">
            <div class="operate-button" v-if="!routerQueryObj.approveFlag">
                <el-row :gutter="10" class="mb8" justify="end">
                    <template v-if="!isView">
                        <el-col :span="1.5">
                            <el-button type="primary" icon="List" @click="submitForm(1)">
                                暂存
                            </el-button>
                        </el-col>
                        <el-col :span="1.5">
                            <el-button type="primary" icon="Checked" @click="submitForm(2)">
                                提交
                            </el-button>
                        </el-col>
                    </template>
                    <el-col :span="1.5">
                        <el-button type="primary" icon="CircleCloseFilled" @click="closePage">
                            取消
                        </el-button>
                    </el-col>
                </el-row>
            </div>
            <div class="content-item-scroll">
                <el-collapse v-model="activeCollapseNames">
                    <el-collapse-item title="资料信息" name="absInfo">
                        <absInfo ref="absInfoRef" v-model:data="data" :routerQueryObj="routerQueryObj" />
                    </el-collapse-item>
                    <el-collapse-item title="应收账款信息" name="absDebt">
                        <absDebt ref="absDebtRef" v-model:data="data" :routerQueryObj="routerQueryObj" v-model:loading="loading" />
                    </el-collapse-item>
					<div class="content-item-scroll" v-if="!routerQueryObj.approveFlag">
					    <flow-search id="flowSearch" ref="flowSearchRef" :routerQueryObj="routerQueryObj" :needUser="false"></flow-search>
					</div>
                </el-collapse>
            </div>
        </div>
    </div>
    
</template>

<script setup>
import { ref, computed, onBeforeMount, watch } from "vue";
import { getAbs, addAbs, updateAbs } from "@/api/abs";
import FlowSearch from '@/views/flowable/search/index.vue'
import absInfo from "./absInfo.vue";
import absDebt from "./absDebt.vue"

const route = useRoute();
// 当前组件对象
const { proxy } = getCurrentInstance();

// 是否显示loading
const loading = ref(false);

// 展开的折叠配置
const activeCollapseNames = reactive(["absInfo", "absDebt"]);

// 数据对象
const data = ref({
    absId: null,
    absNo: null,
    institutionName: null,
    financingMethod: null,
    debtTransferMethod: null,
    absEndDate: null,
    specialPlanNo: null,
    specialPlan: null,
    planManager: null,
    accountName: null,
    accountCode: null,
    accountBank: null,
    status: null,
    absDebtList: [],
    voucherList: []
});

const props = defineProps({
	approveId: {
		type: Number
	}
})

watch(data, v => {
    console.log('==data==');
    console.log(v);
    console.log('==data end==');
}, { deep: true });


// router参数
const routerQueryObj = ref(history.state);

// 资产信息页面
const absInfoRef = ref(null);

// 页面是View状态
const isView = computed(() => {
    let result = false;
	if (route.query.viewFlag === undefined || route.query.viewFlag === null) {
	    result = false;
	} else {
	    result = route.query.viewFlag;
	}
    // if (routerQueryObj.value.viewFlag === undefined || routerQueryObj.value.viewFlag === null) {
    //     result = false;
    // } else {
    //     result = routerQueryObj.value.viewFlag;
    // }
    return result;
});

// 页面是Edit状态
const isEdit = computed(() => {
    let result = false;
	if (route.query.editFlag === undefined || route.query.editFlag === null) {
	    result = false;
	} else {
	    result = route.query.editFlag;
	}
    // if (routerQueryObj.value.editFlag === undefined || routerQueryObj.value.editFlag === null) {
    //     result = false;
    // } else {
    //     result = routerQueryObj.value.editFlag;
    // }
    return result;
});

// 新增资产数据
function addAbsData(status) {
    data.value.status = status;
    loading.value = true
	data.value.flowId = proxy.$refs['flowSearchRef'].formData.flowId;
	data.value.userIds = proxy.$refs['flowSearchRef'].formData.userIds;
    addAbs(data.value).then(() => {
        proxy.$modal.msgSuccess("新增成功");
        loading.value = false;
        closePage();
    });
}

// 更新资产数据
function updateAbsData(status) {
    data.value.status = status;
    loading.value = true
	data.value.flowId = proxy.$refs['flowSearchRef'].formData.flowId;
	data.value.userIds = proxy.$refs['flowSearchRef'].formData.userIds;
    updateAbs(data.value).then(() => {
        proxy.$modal.msgSuccess("更新成功");
        loading.value = false;
        closePage();
    });
}

// 获取资产数据
function getAbsData(id) {
    loading.value = true;
    getAbs(id).then(response => {
        for (const prop in response.data) {
            if (Array.isArray(data.value[prop])) {
                data.value[prop].length = 0;
                if (Array.isArray(response.data[prop])) {
                    response.data[prop].forEach((v) => {
                        data.value[prop].push(v);
                    });
                }
            } else {
                data.value[prop] = response.data[prop];
            }
        };
        loading.value = false;
    });;
}

// 提交表单
function submitForm(status) {
    const absForm = new Promise((resolve, reject) => {
        absInfoRef.value.validate((valid) => {
            valid ? resolve(valid) : reject(valid);
        });
    });
	const flowForm = new Promise((resolve, reject) => {
	    proxy.$refs['flowSearchRef'].$refs['elForm'].validate(valid => {
	        valid ? resolve(valid) : reject(valid)
	    })
	});
    Promise.all([absForm,flowForm]).then(() => {
        if (!isEdit.value) {
            addAbsData(status)
        } else {
            updateAbsData(status)
        }
    });
}

// 取消按钮操作
function closePage() {
    const obj = { path: "/assetManage/package", query: { t: Date.now(), pageNum: history.state.pageNum } };
    proxy.$tab.closeOpenPage(obj);
}

// 在页面挂载前
onBeforeMount(() => {
    if (isView.value || isEdit.value) {
		let absId = route.query.absId;
		if(props.approveId){
			routerQueryObj.value.viewFlag = true;
			routerQueryObj.value.approveFlag = true;
			absId = props.approveId;
		}
		getAbsData(absId);
        // getAbsData(routerQueryObj.value.absId);
    }
});

</script>

<style lang="scss" scoped>
.app-container {
    position: relative;
    height: calc(100vh - 85px);
    overflow: scroll;
}

.operate-button {
    position: fixed;
    top: 83px;
    z-index: 100;
    background: #fff;
    right: 0;
    left: 0;
    padding: 5px 15px;
}

.content-item-scroll {
    margin-top: 30px;
}
</style>