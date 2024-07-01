<template>
  <el-form class="query-form" :model="queryParams" :loading="loading" ref="queryRef" v-show="props.showSearch"
    label-width="110px">
    <el-row class="query-row" :gutter="15" style="margin-right: 30px;" :class="{ 'el-row-multiline': paramsItems.length > 3 }">
      <el-col v-for="(item, index) in paramsItems" :key="'col' + index" :xl="item.colSpan ? item.colSpan : 6"
        :lg="item.colSpan ? item.colSpan : 8" :sm="item.colSpan ? item.colSpan : 12" :xs="24">
      
        <template v-if="item.type === 'text'">
          <!-- 输入框 -->
          <el-form-item :label="item.label" :prop="item.prop">
            <el-input class="fixed-width-input" v-model.trim="queryParams[item.prop]" :placeholder="item.placeholder" clearable />
          </el-form-item>
          <!-- 输入框 end-->
        </template>
        
        <template v-if="item.type === 'select'">
          <!-- 选择下拉 -->
          <el-form-item :label="item.label" :prop="item.prop">
            <el-select v-model="queryParams[item.prop]" :placeholder="item.placeholder">
              <template v-for="i in item.options" :key="i.value">
                <el-option :label="i.label" :value="i.value">
                </el-option>
              </template>
            </el-select>
          </el-form-item>
          <!-- 选择下拉 end-->
        </template>
        
        <template v-if="item.type === 'select_all'">
          <!-- 选择下拉 默认选中【全部】的空值-->
          <el-form-item :label="item.label" :prop="item.prop">
            <el-select v-model="queryParams[item.prop]" filterable :placeholder="item.placeholder">
              <el-option label="全部" value=""></el-option>
              <template v-for="i in item.options" :key="i.value">
                <el-option :label="i.label" :value="i.value">
                </el-option>
              </template>
            </el-select>
          </el-form-item>
          <!-- 选择下拉 默认选中【全部】的空值 end-->
        </template>
        
        <template v-if="item.type === 'checkbox'">
          <!-- 多选框 -->
          <el-form-item :label="item.label" :prop="item.prop">
            <el-checkbox-group v-model="queryParams[item.prop]">
              <el-checkbox v-for="i in item.options" :key="i.value" :label="i.value">{{ i.label }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <!-- 多选框 end-->
        </template>
        
        <template v-if="item.type === 'radio'">
          <!-- 单选框 -->
          <el-form-item :label="item.label" :prop="item.prop">
            <el-radio-group v-model="queryParams[item.prop]">
              <el-radio v-for="i in item.options" :key="i.value" :label="i.value">{{ i.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <!-- 单选框 end-->
        </template>
        
        <template v-if="item.type === 'date'">
          <!-- 单选日期 -->
          <el-form-item :label="item.label" :prop="item.prop">
            <el-date-picker type="date" v-model="queryParams[item.prop]" :placeholder="item.placeholder"
              :value-format="item.format" @change="handleDate"></el-date-picker>
          </el-form-item>
          <!-- 单选日期 end-->
        </template>

        <template v-if="item.type === 'month'">
          <!-- 单选月份 -->
          <el-form-item :label="item.label" :prop="item.prop">
            <el-date-picker type="month" v-model="queryParams[item.prop]" :placeholder="item.placeholder"
              :value-format="item.format" @change="handleDate"></el-date-picker>
          </el-form-item>
          <!-- 单选月份 end-->
        </template>
            
        <template v-if="item.type === 'daterange'">
          <!-- 日期范围 -->
          <el-form-item :label="item.label" :prop="item.prop">
            <el-date-picker v-model="queryParams[item.prop]" :value-format="item.format" type="daterange" range-separator="-"
              :start-placeholder="item.placeholder[0]" :end-placeholder="item.placeholder[1]" @change="handleDate"></el-date-picker>
          </el-form-item>
          <!-- 日期范围 end-->
        </template>

        <template v-if="item.type === 'customerSelect'">
          <!-- 客户选择 -->
          <slot name="customerSelect" :item=item></slot>
        </template>
      </el-col>
      <el-col :xl="6" :lg="8" :sm="12" :xs="24" align="center" style="min-height: 50px">
        <div class="query-btns">
          <el-button type="primary" icon="Search" @click="handleQuery" @keydown.enter="keydownSearch">搜索</el-button>
          <el-button icon="Refresh" @click="resetQuery">重置</el-button>
        </div>
      </el-col>
    </el-row>
    <!-- <el-row>
      <el-col :span="24" align="center">
        <el-button type="primary" icon="Search" @click="handleQuery" @keydown.enter="keydownSearch">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-col>
    </el-row> -->
  </el-form>
</template>

<script setup>
import request from '@/utils/request'
import { deepClone } from "@/utils/index"
import { onMounted, onUnmounted, watch } from "vue"
const { proxy } = getCurrentInstance();
const props = defineProps({
  queryParams: {
    type: Object,
    default: null,
  },
  paramsItems: {
    type: Array,
    default: [],
  },
  showSearch: {
    type: Boolean,
    default: true
  }
});
const loading = ref(true)
let queryParams = ref({})
let paramsItems = ref([])
let showSearch = ref(true)
let queryUrl = ref("")

watch(props.queryParams, (newValue, oldValue) => {
  if (newValue) {
    queryParams.value = deepClone(newValue)
  }
}, { immediate: true, deep: true })

watch(props.paramsItems, (newValue, oldValue) => {
  if (newValue) {
    paramsItems.value = deepClone(newValue)
    // console.log('查询项：', paramsItems.value)
  }
}, { immediate: true, deep: true })

function handleQuery() {
  proxy.$emit('handleQuery', queryParams)
}

function resetQuery() {
  proxy.resetForm("queryRef")
  proxy.$emit('resetQuery', queryParams)
}

const keydownSearch = (e) => {
  if (e.key == "Enter") {
    handleQuery()
  }
}

onMounted(() => {
  window.addEventListener("keydown", keydownSearch)
})

onUnmounted(() => {
  window.removeEventListener("keydown", keydownSearch, false)
})

// 日期回显
function handleDate() {
  proxy.$forceUpdate()
  proxy.$emit("changeParams", queryParams)
}

</script>

<style lang="scss" scoped>
.query-form {
  :deep(.el-form-item--default .el-form-item__label) {
    white-space: pre-line;
    line-height: 20px;
    display: flex;
    align-items: center;
  }

  :deep(.el-select) {
    width: 100%;
  }
  :deep(.el-input) {
    width: 100%;
  }

  .query-btns {
    position: absolute;
    right: 8px;
  }
}

@media only screen and (min-width: 1600px) {
  .query-form {
    .el-row-multiline {
      :deep(.el-col-xl-6) {
        display: block;
        max-width: 25%;
        flex: 0 0 25%;
      }
    }
  }
}

@media only screen and (max-width: 990px) {
  .query-form .query-row {
    margin-right: 0 !important;
  }
}
</style>
<style>
	.fixed-width-input .el-input__inner {
		width: 210px;
	}
</style>