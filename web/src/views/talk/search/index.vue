<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="客户名称" prop="customerName">
        <el-input
          v-model="queryParams.customerName"
          placeholder="请输入客户名称"
          @focus="openDiag('customerName')"
          suffix-icon="el-icon-search"
        />
      </el-form-item>
      <el-form-item label="访谈日期" style="width: 308px">
        <el-date-picker clearable v-model="queryParams.interviewDate" type="date"
                                        value-format="YYYY-MM-DD" placeholder="请选择访谈日期" :style="{ width: '240px' }">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
          <el-option
            v-for="dict in cust_interview_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['cust:interact:list']"
        >新增</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['cust:interact:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['cust:interact:remove']"
        >删除</el-button> -->
      <!-- </el-col> -->
      <!-- <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['cust:interact:export']"
        >导出</el-button>
      </el-col> -->
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="interactList" @selection-change="handleSelectionChange">
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <el-table-column label="客户交互记录编号" align="center" prop="interactNo" width="150" fixed ><template #default="scope"> <el-button link type="primary"  @click="handleView(scope.row)" >{{scope.row.interactNo}}</el-button> </template>
      </el-table-column>
      <el-table-column label="客户编号" align="center" prop="customerNo" width="120" fixed />
      <el-table-column label="客户名称" align="center" prop="customerName"  width="120" fixed />
      <el-table-column label="对方联系人" align="center" prop="contacts" />
      <el-table-column label="访谈人" align="center" prop="createBy" />
      <el-table-column label="访谈时间" align="center" prop="interviewDate" width="250">
        <template #default="scope">
          <span>{{ parseTime(scope.row.interviewDate, '{y}-{m}-{d}') }} {{ scope.row.interviewStartTime && scope.row.interviewStartTime.split(' ')[1] +' -' }} {{ scope.row.interviewEndTime && scope.row.interviewEndTime.split(' ')[1] }}</span>
        </template>
      </el-table-column>
     
      <el-table-column label="交互方式" align="center" prop="interviewWay">
        <template #default="scope">
          <dict-tag :options="cust_interview_way" :value="scope.row.interviewWay"/>
        </template>
      </el-table-column>
      
      <el-table-column label="摘要" align="center" prop="interactAbstract" />
      <el-table-column label="状态" align="center" prop="status">
        <template #default="scope">
          <dict-tag :options="cust_interview_status" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="录入人" align="center" prop="createBy" />
      <el-table-column label="录入时间" align="center" prop="createTime" width="100" >
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right"  width="150">
        <template #default="scope">
          <div class="button-display">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['cust:interact:list']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['cust:interact:list']">删除</el-button>
        </div>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <DialogTable v-model:open="opendialog" v-model:tableData="tableData" v-model:title="titleDia"  :total=totalDia @selectRow="selectRow" @pageChange="pageChange"/>

  </div>
</template>

<script setup name="Interact">
import { listInteract, getInteract, delInteract, addInteract, updateInteract } from "@/api/customer/interact";
import { listInfo} from "@/api/customer/index";
const { proxy } = getCurrentInstance();
const { cust_interview_status } = proxy.useDict('cust_interview_status');
const { cust_interview_way } = proxy.useDict('cust_interview_way');
const router = useRouter();
const interactList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const daterangeInterviewDate = ref([]);
const totalDia = ref(0);
const titleDia = ref("客户信息");
const opendialog = ref(false);
const checkList = ref(['customerName','createby']);
const checkItem = ref("");
const tableData = ref([]);
const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    customerId: null,
    customerName: null,
    interviewDate: null,
    status: null,
  },
  rules: {
    interactNo: [
      { required: true, message: "客户交互记录编号不能为空", trigger: "blur" }
    ],
    customerId: [
      { required: true, message: "关联的客户id不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);
const uniqueId = ref("");
onActivated(() => {
  const time = route.query.t;
  if (time != null && time != uniqueId.value) {
    uniqueId.value = time;
    queryParams.value.pageNum = Number(route.query.pageNum);
    daterangeInterviewDate.value = [];
    proxy.resetForm("queryRef");
    getList() 
  }
})

/** 查询interact列表 */
function getList() {
  loading.value = true;
  queryParams.value.params = {};
  // if (null != daterangeInterviewDate && '' != daterangeInterviewDate) {
  //   queryParams.value.params["beginInterviewDate"] = daterangeInterviewDate.value[0];
  //   queryParams.value.params["endInterviewDate"] = daterangeInterviewDate.value[1];
  // }
  listInteract(queryParams.value).then(response => {
    interactList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

// 表单重置
function reset() {
  form.value = {
    interactId: null,
    deptId: null,
    interactNo: null,
    customerId: null,
    customerName: null,
    projectId: null,
    projectName: null,
    contacts: null,
    contactsWay: null,
    interviewDate: null,
    interviewStartTime: null,
    interviewEndTime: null,
    interactAbstract: null,
    interviewWay: null,
    status: null,
    content: null,
    noticeScope: null,
    remark: null,
    createBy: null,
    createById: null,
    updateBy: null,
    updateById: null,
    updateTime: null,
    createTime: null,
    delFlag: null
  };
  proxy.resetForm("interactRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  daterangeInterviewDate.value = [];
  proxy.resetForm("queryRef");
  handleQuery();
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.interactId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  // 
  router.push({ path: '/customer/talk/detail',query:{pageNum: queryParams.value.pageNum }});
  // open.value = true;
  // title.value = "添加interact";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _interactId = row.interactId || ids.value
  router.push({ path: '/customer/talk/detail',query:{interactId:_interactId,pageNum: queryParams.value.pageNum}});
}

// 查看页面
function handleView(row){
  reset();
  const _interactId = row.interactId || ids.value
  router.push({ path: '/customer/talk/detail',query:{interactId:_interactId,viewFlag:true,pageNum: queryParams.value.pageNum}});
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _interactIds = row.interactId || ids.value;
  proxy.$modal.confirm('是否确认删除interact编号为"' + _interactIds + '"的数据项？').then(function() {
    return delInteract(_interactIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('cust/interact/export', {
    ...queryParams.value
  }, `interact_${new Date().getTime()}.xlsx`)
}


// 用户组件请求信息
const userParams = ref({
    pageNum: 1,
    pageSize: 10,
    deptId: null,
    customerNo: null,
    registerCountry: null,
    customerName: null,
    customerType: null,
    customerManagerName: null,
    customerManagerId: null,
    parentCustomerId: null,
    customerCategory: null,
    isCoreEnterprise: null,
    isDeleted: null,
})
// 打开用户信息选择框 请求用户信息
function openDiag(options) {
  console.log(tableData.value);
    userParams.value.pageNum = 1;
    if (!tableData.value.length) {
        loading.value = true;
        listInfo(userParams.value).then(response => {
          loading.value = false;
          tableData.value = [];
          response.rows.map((item) => {
                tableData.value.push({
                    userId: item.customerNo,
                    userName: item.customerName,
                })
            });
            totalDia.value = response.total;
            console.log(options)
            titleDia.value = "客户基本信息";
            opendialog.value = true;
  });
    } else {
        console.log(options)
        titleDia.value = "客户基本信息";
        opendialog.value = true;
    }
    checkItem.value = options;
}
// 弹出用户信息分页处理
function pageChange(page) {
  userParams.value.pageNum = page;
  loading.value = true;
  listInfo(userParams.value).then(response => {
    loading.value = false;
    tableData.value = [];
    response.rows.map((item) => {
          tableData.value.push({
              userId: item.customerNo,
              userName: item.customerName,
          })
      });
      totalDia.value = response.total;
      titleDia.value = "客户基本信息";
      opendialog.value = true;
  });
}
// 选择了用户信息；
function selectRow(rows){
  console.log(checkItem.value);
  queryParams.value[checkItem.value] = rows.userName;
}

function formatTime(time){
    return time.getHours().toString().padStart(2, '0') + ':' + time.getMinutes().toString().padStart(2, '0') +':' + time.getSeconds().toString().padStart(2, '0');
}
getList();
</script>
<style lang="scss" scoped>
.button-display{
  display: flex;
}
</style>
