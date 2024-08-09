<template>
  <el-dialog v-model="props.visible" title="汇总" width="600">
    <div style="margin-bottom: 20px" >
      <el-table :data="meetingUser.projReviewCommitteeDecisionList" style="width: 100%">
        <el-table-column prop="name" label="评审会委员" align="center">
          <template #default="{row}">
            {{row.name}} {{row.reviewPeopleType === "1" ? '（主任）' : ''}}
          </template>
        </el-table-column>
        <el-table-column prop="opinion" label="表决类型" width="180" align="center">
          <template #default="{row}">
            <dict-tag :options="diligence_voting_type" :value="row.opinion" />
          </template>
        </el-table-column>
        <el-table-column prop="decision" label="意见" />
      </el-table>
    </div>
    <el-form ref="ruleFormRef" :model="form"  label-width="auto" label-position="top" :rules="rules">
      <el-form-item label="汇总" prop="secretaryOpinion">
        <el-radio-group v-model="form.secretaryOpinion">
          <el-radio v-for="dict in secretary_opinion" :label="dict.value" :name="dict.value" :key="dict.value">{{ dict.label }}</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="emits('cancel')">取消</el-button>
        <el-button type="primary" @click="confirmClick(ruleFormRef)"> 确定 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { reactive, ref, defineProps, defineEmits, onActivated, onMounted, watch, computed } from 'vue'
import {getRoleUser} from "@/api/system/agroup";
import { ElMessage } from 'element-plus'
import {getDiligence} from "../../../../api/project/diligence";
import {deepClone} from "../../../../utils";
const {
  proxy
} = getCurrentInstance();
const {
  secretary_opinion,
  diligence_voting_type,
} = proxy.useDict('secretary_opinion', 'diligence_voting_type');
const emits = defineEmits(['confirm', 'cancel'])
const props = defineProps({ visible: String, userInfo: Object })
const dialogFormVisible = ref(false)
const ruleFormRef = ref()
const meetingUser = ref({}) // 委员
const proVal = ref({})

const rules = reactive({
  "secretaryOpinion": [
    { required: true,  message: "请输入表决意见", trigger: "change" }
  ],
})

const form = reactive({
  secretaryOpinion: '',
})

watch(() => props.visible, () => {
  if(props.visible && props.userInfo.id) {
    getMeetingUser(props.userInfo.id)
  }
})


async function getMeetingUser(id) {
  let resData = await getDiligence(id)
  if(resData.code === 200) {
    meetingUser.value = resData.data
    if(meetingUser.value.projReviewCommitteeDecisionList.length < 2) {
      proVal.value = meetingUser.value.projReviewCommitteeDecisionList[0]
    } else {
      proVal.value = meetingUser.value.projReviewCommitteeDecisionList.find((item) => item.reviewPeopleType === '1' )
    }
    console.log( proVal.value)
  }
}

const confirmClick = (formEl) => {
  if(formEl) {
    formEl.validate((valid, fields) => {
      if (valid) {
        emits('confirm',  {
          ...form,
          id: props.userInfo.id
        })
      } else {
        ElMessage('请选择内容.')
      }
    })
  }
}



</script>