<template>
  <div>
    <el-row :gutter="15" justify="center">
      <el-col :span="24" :xs="24">
        <el-collapse v-model="activeNames" @change="handleChange" style="border-top: 0;">
          <el-collapse-item title="历次审核信息" name="1">
            <el-table v-loading="loading" :data="auditInfoList">
                <el-table-column label="审核人" align="center" prop="reviewers" />
                <el-table-column label="审核时间" align="center" prop="reviewTime" width="180">
                  <template #default="scope">
                    <span>{{ parseTime(scope.row.dueDate, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="审核意见" align="center" prop="reviewOpinions" />
                <el-table-column label="审核说明" align="center" prop="auditInstructions" />
              </el-table>
          </el-collapse-item>
        </el-collapse>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
const { proxy } = getCurrentInstance();

const props = defineProps({
  auditInfoList: {
    type: Array,
    default: [],
  }
});

const activeNames = ref(['1']);//tab打开状态
const loading = ref(false);

const dataScope = reactive({
  rules: {},//验证规律
});

function handleChange(val) {
  console.log(val);
}

</script>