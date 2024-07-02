<template>
  <div class="pb-[16px]">
    <fund-draw :id="approveInfo.id" v-if="showType == 'fundDraw'" />
    <fund-pool :id="approveInfo.id" v-if="showType == 'fundPool'" />
    <fund-pay :id="approveInfo.id" v-if="showType == 'fundPay'" />
    <Contract :id="approveInfo.id" v-if="showType == 'contract'" />

    <!-- <project-all /> -->
    <!-- <shouxin-info /> -->
    <!-- <LoanInfo />  -->
    <!-- <change-rate />
    <change-interest ></change-interest> -->
    <!-- <change-date ></change-date> -->
    <!-- <change-arrear></change-arrear> -->
    <!-- <change-adjust></change-adjust> -->

    <div class="h-[16px]"></div>
    <div class="flex py-[20px] px-[16px] justify-center">
      <van-button type="primary" class="w-[100%]" @click="showCheck = true"
        >审批</van-button
      >
    </div>
  </div>

  <van-popup
    v-model:show="showCheck"
    round
    closeable
    position="bottom"
    :style="{ height: '60%' }"
  >
    <div class="h-[50px]"></div>
    <van-form ref="formRef">
      <van-cell-group>
        <van-field
          v-model="taskForm.variables.approveResult"
          label="单选框"
          :rules="[{ required: true, message: '请输入审批意见' }]"
        >
          <template #input>
            <van-radio-group
              v-model="taskForm.variables.approveResult"
              direction="horizontal"
            >
              <van-radio
                v-for="item in dictObj.approve_type"
                :name="item.value"
                :key="item.value"
                >{{ item.label }}</van-radio
              >
            </van-radio-group>
          </template>
        </van-field>
        <van-field label="审批意见" readonly :border="false" />
        <van-field
          v-model="taskForm.comment"
          type="textarea"
          rows="4"
          name="审批意见"
          placeholder="请输入审批意见"
          :rules="[{ required: true, message: '请输入审批意见' }]"
        />
      </van-cell-group>
    </van-form>
    <div class="flex py-[20px] px-[16px] justify-around">
      <van-button class="w-[40%]" @click="showCheck = false">取消</van-button>
      <van-button type="primary" class="w-[40%]" @click="submitTask"
        >审批</van-button
      >
    </div>
  </van-popup>
</template>

<script setup name="myInfo">
import { ref } from 'vue';
import { flowTaskForm, checkTask } from '@/api/flowable/todo.js';
import { useRoute } from 'vue-router';
import { useDict } from '@/utils/dict.js';
import fundDraw from './compoenent/fundDraw/index.vue';
import fundPool from './compoenent/fundPool/index.vue';
import fundPay from './compoenent/fundPay/index.vue';
import Contract from './compoenent/contract/index.vue';
// import projectAll from './compoenent/projectAll/index.vue'
// import shouxinInfo from './compoenent/shouxinInfo/index.vue'
// import LoanInfo from './compoenent/loanInfo/index.vue'
// import changeRate from './compoenent/changeRate/index.vue'
// import changeInterest from './compoenent/changeInterest/index.vue'
// import changeDate from './compoenent/changeDate/index.vue'
// import changeArrear from './compoenent/changeArrear/index.vue'
// import changeAdjust from './compoenent/changeAdjust/index.vue'

import { showSuccessToast } from 'vant';
import { useRouter } from 'vue-router';
const router = useRouter();

const taskForm = ref({
  returnTaskShow: false, // 是否展示回退表单
  delegateTaskShow: false, // 是否展示回退表单
  defaultTaskShow: true, // 默认处理
  comment: '', // 意见内容
  procInsId: '', // 流程实例编号
  instanceId: '', // 流程实例编号
  deployId: '', // 流程定义编号
  taskId: '', // 流程任务编号
  procDefId: '', // 流程编号
  targetKey: '',
  variables: {}
});
const taskName = ref('');
const startUser = ref('');
const route = useRoute();
const approveInfo = ref({
  id: '',
  type: ''
});
const showType = ref('');
const showCheck = ref(false);
const dictObj = useDict('approve_type');
const formRef = ref(null);

if (route.query) {
  taskName.value = route.query.taskName;
  startUser.value = route.query.startUser;
  taskForm.value.deployId = route.query.deployId;
  taskForm.value.taskId = route.query.taskId;
  taskForm.value.procInsId = route.query.procInsId;
  taskForm.value.executionId = route.query.executionId;
  taskForm.value.instanceId = route.query.procInsId;
  // 流程任务获取变量信息
  if (taskForm.value.taskId) {
    getFlowTaskForm(taskForm.value.taskId);
  }
  // getFlowRecordList(taskForm.value.procInsId, taskForm.value.deployId);
}

/** 流程节点表单 */
function getFlowTaskForm(taskId) {
  if (taskId) {
    // 提交流程申请时填写的表单存入了流程变量中后续任务处理时需要展示
    flowTaskForm({ taskId: taskId }).then(res => {
      if (res.data.formData) {
        approveInfo.value.id = res.data.formData.id;
        showType.value = res.data.formData.type;
      }
    });
  }
}

const submitTask = () => {
  formRef.value.validate().then(() => {
    handleSubmit();
  });
};

const handleSubmit = () => {
  checkTask(taskForm.value).then(() => {
    showSuccessToast('审批成功');
    router.push('/waitTask');
  });
};
</script>
