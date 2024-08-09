<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="100px">
      <el-form-item label="审议编号" prop="dueNo">
        <el-input v-model="queryParams.dueNo" placeholder="请输入审议编号" clearable @keyup.enter="handleQuery"
                  :style="{ width: '240px' }" />
      </el-form-item>
      <el-form-item label="项目名称" prop="name">
        <el-input v-model="queryParams.name" placeholder="请选择项目名称" clearable
                  :style="{ width: '240px' }"></el-input>
      </el-form-item>

      <el-form-item label="保理申请人" prop="factoringApplicantName">
        <el-input v-model="queryParams.factoringApplicantName" placeholder="请输入保理申请人" clearable
                  @keyup.enter="handleQuery" :style="{ width: '240px' }" />
      </el-form-item>
      <el-form-item label="是否有效" prop="validFlag">
        <el-select v-model="queryParams.validFlag" placeholder="请选择是否有效" clearable :style="{ width: '240px' }">
          <el-option v-for="dict in sys_yes_no" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="录入日期">
        <el-date-picker v-model="daterangeCreateTime" value-format="YYYY-MM-DD" type="daterange"
                        range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
                        :style="{ width: '240px' }"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="diligenceList">
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <el-table-column width="55" align="center" fixed>
        <template #default="scope">
          <el-radio :label="scope.$index + 1" v-model="radio"
                    v-on:change="handleSelectionChange(scope.row)"></el-radio>
        </template>
      </el-table-column>
      <el-table-column label="审议编号" align="center" prop="dueNo" width="200">
        <template #default="scope">
          <el-button link type="primary" @click="handleView(scope.row)">{{ scope.row.dueNo }}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="项目名称" align="center" prop="name" />
      <el-table-column label="核心企业" align="center" prop="coreEnterpriseName" />
      <el-table-column label="授信额度（千万）" align="center" prop="financeLimitAmount" />

      <el-table-column label="已使用授信额度（千万）" align="center" prop="financeLimitAmountUsed" />
      <el-table-column label="未使用授信额度（千万）" align="center" prop="financeLimitAmountUnUsed" />
      <el-table-column label="是否调整" align="center" >
        <template #default="scope">
          <dict-tag :options="sys_yes_no"
                    :value="(scope.row.diligenceAdjust && scope.row.diligenceAdjust.length>0 ? 'Y' :'N')" />
        </template>
      </el-table-column>
      <el-table-column label="调整时间" align="center">

        <template #default="scope">
					<span
              v-if="scope.row.diligenceAdjust && scope.row.diligenceAdjust.length>0">{{ parseTime( scope.row.diligenceAdjust[0].createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>


      <el-table-column label="授信生效日" align="center" prop="reviewDate"> <template #default="scope">
        <span>{{ parseTime(scope.row.reviewDate, '{y}-{m}-{d}') }}</span>
      </template>
      </el-table-column>

      <el-table-column label="授信到期日" align="center" prop="reviewDate"> <template #default="scope">
        <span>{{ parseTime(scope.row.financeLimitExpireDate, '{y}-{m}-{d}') }}</span>
      </template>
      </el-table-column>
      <el-table-column label="尽调状态" align="center" prop="status" width="180"> <template #default="scope">
        <dict-tag :options="proj_dd_status" :value="scope.row.status" />
      </template>
      </el-table-column> <el-table-column label="录入人" align="center" prop="createBy" />

      <el-table-column label="录入时间" align="center" prop="createTime"> <template #default="scope">
        <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
      </template>
      </el-table-column>

      <el-table-column label="是否有效" align="center" prop="validFlag"> <template #default="scope">
        <dict-tag :options="sys_yes_no" :value="scope.row.validFlag" />
      </template>
      </el-table-column>

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right" width="200">
        <template #default="{ row }">
          <div class="button-display">
            <el-button link type="primary" icon="Edit"
               v-if="userStore.$state.id === row.secretaryId && !row.secretaryOpinion" @click="summaryOpinions(row)">汇总</el-button>
          </div>
        </template>
      </el-table-column>

    </el-table>


    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
                v-model:limit="queryParams.pageSize" @pagination="getList" />
    <!-- {{ multiQuery }} -->
    <DialogTableMulti v-model:multiQuery="multiQuery" v-model:open="multiQuery.open"
                      v-model:tableData="tableDataMulti" v-model:prop="propMulti" @selectRow="selectRowMulti"
                      @pageChange="pageChangeMulti" />
    <SummaryOpinionsForm
        :visible="sumMaryVisible"
        :userInfo="sumMaryRow"
        @confirm="sumMaryConfirm"
        @cancel="sumMaryVisible = false"
    ></SummaryOpinionsForm>
  </div>
</template>

<script setup name="Info">
import SummaryOpinionsForm from "./components/summaryOpinionsForm.vue";
import {
  listDiligence,
  getDiligence,
  delDiligence,
  addDiligence,
  updateDiligence,
  exportWord,
  diligenceExportWord,
  diligenceSecretarySummary
} from "@/api/project/diligence";
import {
  listProjInfo
} from "@/api/project/info";
import {
  ElMessage
} from 'element-plus'
import {deepClone} from "../../../utils";
import {diligenceCommitOpinion} from "../../../api/project/diligence";
import Cookies from 'js-cookie'

const {
  proxy
} = getCurrentInstance();
const route = useRoute();
const router = useRouter();
import useUserStore from "@/store/modules/user";
const userStore = useUserStore()
const {
  sys_yes_no,
  proj_dd_status
} = proxy.useDict('sys_yes_no', 'proj_dd_status');
let radio = ref("");
let selectId = ref("");
let custSelection = ref({});
const diligenceList = ref([]);
const projectDiligenceStatusList = ref(['6']);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const daterangeCreateTime = ref([]);
const sumMaryVisible = ref(false)
const sumMaryRow = ref(null)

let multiQuery = ref({
  title: "项目列表", //标题
  open: false,
  currentPage: 1,
  total: 1,
  pageSize: 10,
});
const propMulti = ref([{
  label: '项目编号',
  value: 'projectNo'
}, {
  label: '项目名称',
  value: 'projectName'
}]);
const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    dueNo: null,
    name: null,
    factoringApplicantNo: null,
    factoringApplicantName: null,
    status: null,
    validFlag: null,
    createTime: null,
  },

});

const {
  queryParams,
  form
} = toRefs(data);
const {
  proj_project_status,
  proj_audit_status
} = proxy.useDict("proj_project_status", "proj_audit_status"); //下拉框字典



const uniqueId = ref("");
onActivated(() => {
  const time = route.query.t;
  if (time != null && time != uniqueId.value) {
    uniqueId.value = time;
    queryParams.value.pageNum = Number(route.query.pageNum);
    daterangeCreateTime.value = [];
    proxy.resetForm("queryRef");
    getList();
  }
})
function summaryOpinions(row) {
  sumMaryVisible.value = true
  sumMaryRow.value = row
}

async function sumMaryConfirm(values) {
  const copyValues = deepClone(values)
  let resData = await diligenceSecretarySummary(copyValues)
  if(resData.code === 200) {
    sumMaryVisible.value = false
    getList();
    ElMessage({
      message: '提交成功.',
      type: 'success',
    })
  }
}
/** 查询项目立项列表 */
function getList() {
  loading.value = true;
  radio.value = "";
  custSelection.value = {};
  queryParams.value.params = {};
  if (null != daterangeCreateTime && '' != daterangeCreateTime) {
    queryParams.value.params["beginCreateTime"] = daterangeCreateTime.value[0];
    queryParams.value.params["endCreateTime"] = daterangeCreateTime.value[1];
  } else {
    queryParams.value.params["beginCreateTime"] = '';
    queryParams.value.params["endCreateTime"] = '';
  }

  if (projectDiligenceStatusList.value.length) {
    queryParams.value.params["status"] = projectDiligenceStatusList.value.join(',')
  } else {
    queryParams.value.params["status"] = "";
  }

  listDiligence(queryParams.value).then(response => {
    diligenceList.value = response.rows;
    total.value = response.total;
    loading.value = false;
    let id = response.rows[0].id;
    // exportWord(id).then(res=>{
    // 	console.log(res.size)
    // 	console.log(new Blob([res], {type: 'application/docx'}))
    // 	const elink = document.createElement("a");
    // 	elink.href = window.URL.createObjectURL(new Blob([res]));
    // 	elink.style.display = 'none';
    // 	elink.setAttribute('download', 'demo' + '.docx');
    // 	document.body.appendChild(elink);
    // 	elink.click();
    // 	document.body.removeChild(elink);
    // })
  });
}



// 表单重置
function reset() {
  form.value = {
    id: null,
    dueNo: null,
    name: null,
    tatalPeriod: null,
    reviewDate: null,
    submitDepartment: null,
    currentYear: null,
    financeLimitExpireDate: null,
    sponsor: null,
    coreEnterpriseNo: null,
    coreEnterpriseName: null,
    factoringApplicantNo: null,
    factoringApplicantName: null,
    debtorNo: null,
    debtorName: null,
    financeLimitAmount: null,
    financeLimitPeriod: null,
    financeLimitType: null,
    businessType: null,
    businessTypeOther: null,
    contractType: null,
    contractTypeOther: null,
    creditEnhancementMethod: null,
    creditEnhancementMethodOther: null,
    normalTermInterestRate: null,
    gracePeriodInterestRate: null,
    defaultInterestRate: null,
    managementRate: null,
    factoringPeriod: null,
    gracePeriod: null,
    principalRepaymentMethod: null,
    principalRepaymentMethodOther: null,
    interestPaymentMethod: null,
    interestPaymentMethodOther: null,
    interestPayer: null,
    interestPayerOther: null,
    managementPaymentMethod: null,
    managementPaymentMethodOther: null,
    payingParty: null,
    payingPartyOther: null,
    confirmationMethod: null,
    settlementAccount: null,
    status: [],
    validFlag: null,
    createBy: null,
    createById: null,
    updateBy: null,
    updateById: null,
    delFlag: null,
    createTime: null,
    updateTime: null
  };
  proxy.resetForm("queryRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  daterangeCreateTime.value = [];
  proxy.resetForm("queryRef");
  handleQuery();
}

// 多选框选中数据
// function handleSelectionChange(selection) {
//   ids.value = selection.map(item => item.diligenceId);
//   single.value = selection.length != 1;
//   multiple.value = !selection.length;
// }
// 选中数据
function handleSelectionChange(selection) {
  custSelection.value = selection
  selectId.value = selection.customerId
  // selectId.value = selection.customerNo;
  // console.log('选择了', selection)
}

// 查看页面
function handleView(row) {
  reset();
  const _diligenceId = row.id || ids.value
  // router.push({ path: '/project/project/diligence/detail', query: { diligenceId: _diligenceId, viewFlag: true, pageNum: queryParams.value.pageNum } });

  router.push({
    name: 'Project/diligence/detail',
    state: {
      diligenceId: _diligenceId,
      viewFlag: true,
      pageNum: queryParams.value.pageNum
    }
  });
}




/** 导出按钮操作 */
function handleExport() {
  proxy.download('project/info/export', {
    ...queryParams.value
  }, `info_${new Date().getTime()}.xlsx`)
}



// 用户组件请求信息
const userParamsMulti = ref({
  pageNum: 1,
  pageSize: 10,
})
const tableDataMulti = ref([]);
let checkItemMult = ref("")
// 打开项目名称选择框 请求项目名称
function openDiagMulti(options) {
  console.log(tableDataMulti.value);
  if (!tableDataMulti.value.length) {
    loading.value = true;
    listProjInfo(userParamsMulti.value).then(response => {
      tableDataMulti.value = [];
      loading.value = false;
      response.rows.map((item) => {

        tableDataMulti.value.push(item)
      });
      multiQuery.value.total = response.total;
      multiQuery.value.open = true;
    });
  } else {
    multiQuery.value.open = true;
  }
  checkItemMult.value = options;
}

// 弹出项目信息分页处理
function pageChangeMulti(page) {
  userParamsMulti.value.pageNum = page;
  loading.value = true;

  listProjInfo(userParamsMulti.value).then(response => {
    loading.value = false;
    tableDataMulti.value = [];
    response.rows.map((item) => {

      tableDataMulti.value.push(item)
    });
    multiQuery.value.total = response.total;
    multiQuery.value.open = true;
  });
}

// 选择了用户信息；
function selectRowMulti(rows) {
  queryParams.value[checkItemMult.value] = rows.projectName; //项目名称
}

getList();
</script>
<style lang="scss" scoped>
.button-display {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;

  .el-button+.el-button {
    margin-left: 0;
  }
}
</style>