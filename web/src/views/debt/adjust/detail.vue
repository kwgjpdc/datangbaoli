<template>
    <div class="app-container" v-loading="loading" ref="appContainerView">
        <div class="content">
            <div class="operate-button" v-if="!routerQueryObj.approveFlag">
                <el-row :gutter="10" class="mb8 " justify="end">
                    <!-- <div class=""> -->
                    <!--  -->
                    <!--  <el-col :span="1.5" v-if="!routerQueryObj.viewFlag">
                        <el-button type="primary" icon="List" @click="submitForm('1')">暂存</el-button>
                    </el-col>-->
                    <el-col :span="1.5" v-if="!routerQueryObj.viewFlag">
                        <el-button type="primary" icon="Checked" @click="submitForm('2')">提交</el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button type="primary" icon="CircleCloseFilled" @click="closePage">返回</el-button>
                    </el-col>

                </el-row>
            </div>
            <div class="zhanwei"></div>
            <el-row :gutter="15" justify="center">
                <el-col :span="24" :xs="24">
                    <el-form ref="elForm" :model="adjustInfo" :rules="rules" label-width="140px" :inline="true"
                        :disabled="routerQueryObj.viewFlag" v-loading="loading">



                        <el-card class="box-card">
                            <template #header>
                                <span>
                                    应收账款调整</span>
                            </template>
                            <el-form-item label="应收账款金额" prop="debtReceivableAmount">
								<ElPriceInput v-model:form="formdata" prop="debtReceivableAmount" :rules="rules" :disabled="true" :placeholder="'请输入'">
								  <template #prefix>
								    <span></span>
								  </template>
								  <template #suffix>
								    <span></span>
								  </template>
								</ElPriceInput>
                               <!-- <el-input v-model="formdata.debtReceivableAmount" placeholder="请输入" clearable
                                    :style="{ width: '240px' }" disabled></el-input> -->


                            </el-form-item>
                            <el-form-item label="总应收账款总余额" prop="debtReceivableBalance">
								<ElPriceInput v-model:form="formdata" prop="debtReceivableBalance" :rules="rules" :disabled="true" :placeholder="'请输入'">
								  <template #prefix>
								    <span></span>
								  </template>
								  <template #suffix>
								    <span></span>
								  </template>
								</ElPriceInput>
                               <!-- <el-input v-model="formdata.debtReceivableBalance" clearable :style="{ width: '240px' }"
                                    disabled></el-input> -->

                            </el-form-item>
                         


                            <el-form-item label="调整后应收账款金额" prop="debtReceivableAmountNew">
								<ElPriceInput v-model:form="formdata" prop="debtReceivableAmountNew" :rules="rules" :disabled="true" :placeholder="'请输入'">
								  <template #prefix>
								    <span></span>
								  </template>
								  <template #suffix>
								    <span></span>
								  </template>
								</ElPriceInput>
                                <!-- <el-input v-model="formdata.debtReceivableAmountNew" clearable
                                    :style="{ width: '240px' }" disabled /> -->
                            </el-form-item>
                            <el-form-item label="调整后总金额" prop="debtReceivableBalanceNew">
								<ElPriceInput v-model:form="formdata" prop="debtReceivableBalanceNew" :rules="rules" :disabled="true" :placeholder="'请输入'">
								  <template #prefix>
								    <span></span>
								  </template>
								  <template #suffix>
								    <span></span>
								  </template>
								</ElPriceInput>
                                <!-- <el-input v-model="formdata.debtReceivableBalanceNew" clearable
                                    :style="{ width: '240px' }" disabled /> -->
                            </el-form-item>
                            <el-form-item label="放款比例(%)" prop="loanRatio">
                                <el-input v-model="formdata.loanRatio" clearable :style="{ width: '240px' }"
                                    type="number"></el-input>


                            </el-form-item>

                            <el-form-item label="应收账款到期日" prop="dueDate">
                                <el-date-picker clearable v-model="formdata.dueDate" type="date" value-format="YYYY-MM-DD"
                                    placeholder="请选择到期日" :style="{ width: '240px' }">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item>
                                <el-button @click="handleAllEdit">批量修改</el-button>
                            </el-form-item>
                            <el-table v-loading="loading" :data="adjustInfo" @selection-change="handleSelectionChange"
                                style="margin-bottom: 50px;margin-top: 30px;">
                                <!-- <el-table-column type="selection" width="55" align="center" /> -->

                                <el-table-column label="序号" align="center" type="index" width="60" fixed />
                                <!-- <el-table-column label="oss上文件存储地址" align="center" prop="fileUrl" /> -->
                                <!-- factoringApplicantNo -->
                                <el-table-column label="操作" width="240" align="center">
                                    <div class="button-display">
                                        <el-tag>凭证明细</el-tag>
                                        <el-tag>单证查询</el-tag>
                                        <el-tag>发票查询</el-tag>
                                        <!-- <el-button link type="primary" 
             >凭证明细</el-button>
            <el-button link type="primary"  
             >单证查询</el-button>
              <el-button link type="primary"
              >发票查询</el-button> -->
                                    </div>

                                </el-table-column>
                                <el-table-column label="凭证号码" align="center" prop="voucherNo"> <template #default="scope">
                                        <el-input v-model="scope.row.voucherNo" placeholder="请输入" clearable
                                            disabled></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column label="到期日" align="center" prop="dueDate" width="240">
                                    <template #default="scope">
                                        <el-date-picker clearable
                                            v-model="scope.row.dueDate" type="date"
                                            value-format="YYYY-MM-DD" placeholder="请选择到期日">
                                        </el-date-picker>
                                    </template>
                                </el-table-column>
                                <el-table-column label="应收账款金额" align="center" prop="debtReceivableAmount"><template
                                        #default="scope">
										<ElPriceInput v-model:form="formdata" prop="debtReceivableAmount" :rules="rules" :disabled="true" :placeholder="'请输入'">
										  <template #prefix>
										    <span></span>
										  </template>
										  <template #suffix>
										    <span></span>
										  </template>
										</ElPriceInput>
                                        <!-- <el-input v-model="scope.row.debtReceivableAmount" placeholder="请输入" clearable
                                            disabled></el-input> -->
                                    </template>
                                </el-table-column>
                                <el-table-column label="应收账款余额" align="center" prop="debtReceivableBalance"><template
                                        #default="scope">
										<ElPriceInput v-model:form="formdata" prop="debtReceivableBalance" :rules="rules" :disabled="true" :placeholder="'请输入'">
										  <template #prefix>
										    <span></span>
										  </template>
										  <template #suffix>
										    <span></span>
										  </template>
										</ElPriceInput>
                                        <!-- <el-input v-model="scope.row.debtReceivableBalance" placeholder="请输入" clearable
                                            disabled></el-input> -->
                                    </template>
                                </el-table-column>
                                <el-table-column label="调整后应收账款金额" align="center" prop="debtReceivableAmountNew"><template
                                        #default="scope">
										<ElPriceInput v-model:form="formdata" prop="debtReceivableAmountNew" :rules="rules" :placeholder="'请输入'">
										  <template #prefix>
										    <span></span>
										  </template>
										  <template #suffix>
										    <span></span>
										  </template>
										</ElPriceInput>
                                       <!-- <el-input
                                            v-model="scope.row.debtReceivableAmountNew"
                                            placeholder="请输入" clearable></el-input> -->
                                    </template>
                                </el-table-column>
                                <el-table-column label="调整后应收账款余额" align="center" prop="debtReceivableBalanceNew">
                                    <template #default="scope">
										<ElPriceInput v-model:form="formdata" prop="debtReceivableBalanceNew" :rules="rules" :placeholder="'请输入'">
										  <template #prefix>
										    <span></span>
										  </template>
										  <template #suffix>
										    <span></span>
										  </template>
										</ElPriceInput>
                                        <!-- <el-input
                                            v-model="scope.row.debtReceivableBalanceNew"
                                            placeholder="请输入" clearable></el-input> -->
                                    </template>
                                </el-table-column>
                                <el-table-column label="放款比例" align="center" prop="loanRatio"><template #default="scope">
                                        <el-input v-model="scope.row.loanRatio"
                                            placeholder="请输入" clearable></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column label="煤炭吨数" align="center" prop="coalTon"><template #default="scope">
                                        <el-input v-model="scope.row.coalTon"
                                            placeholder="请输入" clearable type="number"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column label="单价(元/吨)" align="center" prop="price"><template #default="scope">
									<ElPriceInput v-model:form="formdata" prop="price" :rules="rules" :placeholder="'请输入'">
									  <template #prefix>
									    <span></span>
									  </template>
									  <template #suffix>
									    <span></span>
									  </template>
									</ElPriceInput>
                                       <!-- <el-input v-model="scope.row.price"
                                            placeholder="请输入" clearable></el-input> -->
                                    </template>
                                </el-table-column>

                            </el-table>

                        </el-card>
                    </el-form>
                </el-col>
            </el-row>
			<div class="content-item-scroll" v-if="!routerQueryObj.viewFlag">
			    <flow-search id="flowSearch" ref="flowSearchRef" :routerQueryObj="routerQueryObj" :needUser="false"></flow-search>
			</div>
        </div>




    </div>
</template>
<script setup>
import { ref, computed, onBeforeMount, watch } from "vue";
import { getAdjust, updateAdjust } from "@/api/debt/adjust.js"
import FlowSearch from '@/views/flowable/search/index.vue'

const { proxy } = getCurrentInstance();
const voucherId = ref("");
const route = useRoute();
const router = useRouter();
const loading = ref(false);

const data = reactive({
    adjustInfo: [{

        id: null,
        contractNo: null,
        contractName: null,
        coreEnterpriseName: null,
        accountDebtorName: null,
        businessType: null,
        businessTypeOther: null,
        currencyType: null,
        status: [],
        createBy: null,
        createById: null,
        updateBy: null,
        updateById: null,
        delFlag: null,
        createTime: null,
        updateTime: null,
        voucherList: [],
        "commonFileList": [],

    }]
});
const { adjustInfo } = toRefs(data);
let formdata = ref({})
let routerQueryObj = ref({});
const props = defineProps({
	approveId: {
		type: Number
	}
})
watch(route, (newRoute) => {
	if(props.approveId){
		routerQueryObj.value.viewFlag = true;
		routerQueryObj.value.approveFlag = true;
		voucherId.value = props.approveId;
	}else{
		routerQueryObj.value.viewFlag = history.state && history.state.viewFlag;
		voucherId.value = history.state && history.state.voucherId;
		routerQueryObj.value.pageNum = history.state && history.state.pageNum;
	}
}, { immediate: true });
/** 修改的时候查询客户基本信息列表 */
let adjustVoucherListTemp = ref(
    {
        "createBy": null,
        "createById": null,
        "createTime": null,
        "updateBy": null,
        "updateById": null,
        "updateTime": null,
        "delFlag": null,
        "remark": null,
        "id": null,
        "debtAdjustId": null,
        "voucherId": null,
        "voucherNo": "",
        "debtReceivableAmount": null,
        "debtReceivableAmountNew": null,
        "debtReceivableBalance": null,
        "debtReceivableBalanceNew": null,
        "dueDate": null,
        "coalTon": null,
        "price": null,
        "loanRatio": null
    }
)


function resetTemp() {
    adjustVoucherListTemp.value =
    {
        "createBy": null,
        "createById": null,
        "createTime": null,
        "updateBy": null,
        "updateById": null,
        "updateTime": null,
        "delFlag": null,
        "remark": null,
        "id": null,
        "debtAdjustId": null,
        "voucherId": null,
        "voucherNo": "",
        "debtReceivableAmount": null,
        "debtReceivableAmountNew": null,
        "debtReceivableBalance": null,
        "debtReceivableBalanceNew": null,
        "dueDate": null,
        "coalTon": null,
        "price": null,
        "loanRatio": null
    }
}
function getAdjustPage() {
    if (voucherId.value) {
        loading.value = true;
        getAdjust(voucherId.value).then(response => {




            // response.data.forEach((item) => {
                // if (!item.adjustVoucherList.length) {
                //     // 首次调整
                //     let adjustVoucherListTemp =
                //     {
                //         "createBy": null,
                //         "createById": null,
                //         "createTime": null,
                //         "updateBy": null,
                //         "updateById": null,
                //         "updateTime": null,
                //         "delFlag": null,
                //         "remark": null,
                //         "id": null,
                //         "debtAdjustId": null,
                //         "voucherId": item.voucherId,
                //         "voucherNo": item.voucherNo,
                //         "debtReceivableAmount": item.debtReceivableAmount,
                //         "debtReceivableAmountNew": null,
                //         "debtReceivableBalance": item.debtReceivableBalance,
                //         "debtReceivableBalanceNew": null,
                //         "dueDate": item.dueDate,
                //         "coalTon": item.coalTon,
                //         "price": item.price,
                //         "loanRatio": item.loanRatio
                //     }
                    //  adjustVoucherListTemp.value.voucherId = ;
                    //     adjustVoucherListTemp.value.voucherNo = ;
                    //     adjustVoucherListTemp.value.debtReceivableAmount = ;
                    //     adjustVoucherListTemp.value.debtReceivableBalance = item.debtReceivableBalance;
                    //     adjustVoucherListTemp.value.dueDate = item.dueDate;
                    //     adjustVoucherListTemp.value.coalTon = item.coalTon;
                    //     adjustVoucherListTemp.value.price = item.price;
                    //     adjustVoucherListTemp.value.loanRatio = item.loanRatio;
            //         item.adjustVoucherList.push(adjustVoucherListTemp)

            //     }
            // })




            adjustInfo.value = response.data;
            console.log(adjustInfo);



            loading.value = false;
        });
    }
}
// 表单验证


watch(() => adjustInfo.value, (newValue, oldValue) => {
    formdata.value.debtReceivableAmount = 0;
    formdata.value.debtReceivableBalance = 0;
    // formdata.value.debtReceivableAmountNew = 0;
    // formdata.value.debtReceivableBalanceNew = 0;
    newValue.forEach((item) => {
        if(!item.debtReceivableAmount) {
            item.debtReceivableAmount = "";
        }
        if(!item.debtReceivableBalance) {
            item.debtReceivableBalance = "";
        } 
        // if(!item.debtReceivableAmountNew) {
        //     item.debtReceivableAmountNew = "";
        // }
        // if(!item.debtReceivableBalanceNew) {
        //     item.debtReceivableBalanceNew = "";
        // }
        formdata.value.debtReceivableAmount += Number(item.debtReceivableAmount)
        formdata.value.debtReceivableBalance += Number(item.debtReceivableBalance)
        // formdata.value.debtReceivableAmountNew += Number(item.debtReceivableAmountNew)
        // formdata.value.debtReceivableBalanceNew += Number(item.debtReceivableBalanceNew)
    })
}, { deep: true })



function submitForm(statusFlag) {

	
	const flowForm = new Promise((resolve, reject) => {
	    proxy.$refs['flowSearchRef'].$refs['elForm'].validate(valid => {
	        valid ? resolve(valid) : reject(valid)
	    })
	});
	Promise.all([flowForm]).then(() => {
		let saveInfo = adjustInfo.value;
		// saveInfo.adjustVoucherList = [];
		// adjustInfo.value.forEach((item) => {
		//     if (item && item.status != 1) {
		//         delete item.debtAdjustId;
		//     }

		//     saveInfo.adjustVoucherList.push(item);
		// }

		// )
		let flowId = proxy.$refs['flowSearchRef'].formData.flowId;
		let userIds = proxy.$refs['flowSearchRef'].formData.userIds;
		saveInfo.status = statusFlag;
		saveInfo.forEach((item) => {
			if(formdata.value.debtReceivableAmountNew>0){
				item.debtReceivableAmountNew = formdata.value.debtReceivableAmountNew
			}
			if(formdata.value.debtReceivableBalanceNew>0){
				item.debtReceivableBalanceNew = formdata.value.debtReceivableBalanceNew
			}
			if(formdata.value.price>0){
				item.price = formdata.value.price
			}
			item.flowId = flowId;
			item.userIds = userIds;
		})

		//修改
		updateAdjust({adjustVoucherList:saveInfo,flowId,userIds}).then(response => {
			proxy.$modal.msgSuccess("保存成功");
			loading.value = false;
			if (statusFlag == '2') {
				closePage()
			} else {
				closePage()
			}
		});
	})

}

function closePage() {
    const obj = { path: "/debt/adjust", query: { t: Date.now(), pageNum: routerQueryObj.value.pageNum } };
    proxy.$tab.closeOpenPage(obj);
}



function handleAllEdit() {
    adjustInfo.value.forEach((item) => {
        item.loanRatio = formdata.value.loanRatio;
        item.dueDate = formdata.value.dueDate;
    })
}


getAdjustPage();


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


.button-display {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;

    .el-button+.el-button {
        margin-left: 0;
    }
}
</style>
  