<template>
  <el-dialog v-model="props.visible" title="选择人员" width="500">
    <el-form ref="ruleFormRef" :model="form"  label-width="auto" :rules="rules">
      <el-form-item label="评审委员" label-width="100px" prop="users">
        <el-select multiple v-model="form.users" placeholder="请选择评审委员会委员" clearable style="width: 100%" >
          <el-option v-for="dict in meetingUserList" :key="dict.userId" :label="dict.userName" :value="dict.userId" />
        </el-select>
      </el-form-item>
      <el-form-item label="评审主任" label-width="100px" prop="users2">
        <el-select v-model="form.users2" placeholder="请选择评审委员会主任委员" clearable style="width: 100%" >
          <el-option v-for="dict in meetingDirectorList" :key="dict.userId" :label="dict.userName" :value="dict.userId" />
        </el-select>
      </el-form-item>
      <el-form-item label="评审秘书" label-width="100px" prop="users3">
        <el-select v-model="form.users3" placeholder="请选择评审会秘书" clearable style="width: 100%" >
          <el-option v-for="dict in meetingSecretaryList" :key="dict.userId" :label="dict.userName" :value="dict.userId" />
        </el-select>
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
import { reactive, ref, defineProps, defineEmits, onActivated, onMounted } from 'vue'
import {getRoleUser} from "@/api/system/agroup";
import { ElMessage } from 'element-plus'

const emits = defineEmits(['confirm', 'cancel'])
const props = defineProps({ visible: String })
const dialogFormVisible = ref(false)
const ruleFormRef = ref()
const meetingUserList = ref([]) // 委员
const meetingDirectorList = ref([]) // 主任
const meetingSecretaryList = ref([]) // 秘书

const rules = reactive({
  "users": [
    { required: true,  message: "请选择评审委员会委员", trigger: "change" }
  ],
  "users2":  [
    { required: true, message: "请选择评审委员会主任委员", trigger: "change" }
  ],
  "users3":[
    { required: true, message: "请选择评审会秘书", trigger: "change" }
  ],
})

const form = reactive({
  users: [],
  users2: '',
  users3: '',
})

watch(() => props.visible, () => {
  if(props.visible) {
    getMeetingUserList()
  }
})


async function getMeetingUserList() {
  let resData = await getRoleUser('评审委员会委员')
  let resData2 = await getRoleUser('评审委员会主任委员')
  let resData3 = await getRoleUser('评审会秘书')
  if(resData.code === 200) {
    meetingUserList.value = resData.rows
    form.users = resData.rows.map((vitem, _) => vitem.userId)
  }
  if(resData2.code === 200) {
    meetingDirectorList.value = resData2.rows
    form.users2 = resData2.rows.length ? resData2.rows[0].userId : ''
  }
  if(resData3.code === 200) {
    meetingSecretaryList.value = resData3.rows
    form.users3 = resData3.rows.length ? resData3.rows[0].userId : ''
  }
}


const confirmClick = (formEl) => {
  if(formEl) {
    formEl.validate((valid, fields) => {
      if (valid) {
        const zr =  meetingDirectorList.value.find((vItem) => vItem.userId === form.users2)
        const values = {
          projReviewCommitteeDecisionList: [],
          secretaryId: form.users3,
          secretaryName: meetingSecretaryList.value.find((vItem) => vItem.userId === form.users3).userName
        }
        values.projReviewCommitteeDecisionList.push(
            ...form.users.map((item) => {      // 委员
              const user = meetingUserList.value.find((vItem) => vItem.userId === item)
              return {
                name: user.userName,
                userId: user.userId,
                reviewPeopleType: 0,
              }
            }),
            {      // 主任
              name: zr.userName,
              userId: zr.userId,
              reviewPeopleType: 1,
            }
        )
        // 秘书
        emits('confirm', values)
      } else {
        ElMessage('请选择内容.')
      }
    })
  }
}



</script>