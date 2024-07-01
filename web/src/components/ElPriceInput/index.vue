<template>
  <div class="price-item">
    <el-input ref="input"
              :placeholder="placeholder"
              v-model="form[props.prop]"
              oninput="value=value.replace(/[^0-9.]/g,'')"
              @focus="focusInput"
              :disabled="props.disabled"
			  :style="`width: ${!width ? '100%' : width+'px'}`"
              maxlength="12" @blur="blurInput">
      <template #prefix>
        <slot name="prefix"></slot>
      </template>
      <template #suffix>
        <slot name="suffix"></slot>
      </template>
    </el-input>
    <!-- 金额格式化 -->
    <div class="price-mask"
		:style="`width: ${!width ? 'calc(100% - 20px)' : `calc(${width}px - 20px)`}`"
         v-show="showFormatPrice && formaterPrice !== ''"
         @click="focusInput"
         :class="{ 'mask-disabled': props.disabled }">
      <slot name="prefix"></slot>
      <div class="price-con">{{ formaterPrice }}</div>
      <slot name="suffix"></slot>
    </div>
    <!-- 金额格式化 end-->
  </div>
</template>

<script setup>
import { formatMoney } from "@/utils/formatMoney"
const emit = defineEmits();
const { proxy } = getCurrentInstance();
const props = defineProps({
  label: {
    type: String,
    default: '',
  },
  prop: {
    type: String,
    default: '',
  },
  // 复杂数组校验的时候添加的字段
  propslot: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '请输入',
  },
  width: {
	type: Number,
	default: null,
  },
  form: {
    type: Object,
    default: () => ({
    }),
  },
  rules: {
    type: Array,
    default: null
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  style: {
    type: Object,
    default: () => { },
  }
})
let formaterPrice = ref('0');
let showFormatPrice = ref(true);
watch(() => props.form[props.prop], (newValue, oldValue) => {
  if (newValue !== '' && newValue) {
    formaterPrice.value = formatMoney(newValue)
  } else {
    formaterPrice.value = ''
  }
  // if(props.rules){
  // 	showFormatPrice.value = false
  // }
  // focusInput();
}, { deep: true, immediate: true })

// 聚焦金额输入框
function focusInput() {
  if (props.disabled) return;
  showFormatPrice.value = false
  proxy.$refs.input.focus()
}
// 失焦金额输入框
function blurInput() {
  if (props.form[props.prop] !== '' && props.form[props.prop]) {
    // 去掉前面的0
    const integer = Number(props.form[props.prop].toString().split('.')[0]) || '0';
    const decimal = props.form[props.prop].toString().split('.')[1]
      ? `.${props.form[props.prop].toString().split('.')[1]}`
      : ''
    emit(`update:form[${props.prop}]`, isNaN(`${integer}${decimal}`) ? props.form[props.prop] : `${integer}${decimal}`);
	
	let newValue = formatMoney(props.form[props.prop]);
	formaterPrice.value = newValue;
	showFormatPrice.value = props.form[props.prop];
	// if(props.rules[0]){
	// 	if (typeof props.rules[0].pattern !== 'object') {
	// 	  throw `请确保 rules[0].pattern 为正则表达式`
	// 	  return
	// 	}
	// 	if (props.rules[0].pattern) {
	// 	  showFormatPrice.value = props.rules[0].pattern.test(props.form[props.prop])
	// 	}
	// }
  }
}

// 金额单位转换
function transUnit() {
  const unit = proxy.$slots.suffix()[0].children
  if (unit.indexOf('万元') > -1) {
    return 10000
  } else {
    return 1
  }
}
</script>

<style lang="scss" scoped>
.price-item {
  position: relative;
  width: 100%;
}

.price-mask {
  position: absolute;
  z-index: 2;
  top: 2px;
  left: 10px;
  right: 10px;
  bottom: 1px;
  background: white;
  // overflow: auto;
  font-size: 13px;
  line-height: 30px;
  color: var(--el-input-text-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  .price-con {
    flex: 1;
    text-align: left;
    // padding: 0 10px;
    word-break: keep-all;
    overflow: hidden;
    color: var(--el-input-text-color, var(--el-text-color-regular));
  }
  :deep(span) {
    display: inline-flex;
	flex: none;
    white-space: nowrap;
    flex-shrink: 0;
    flex-wrap: nowrap;
    height: 100%;
    text-align: center;
    color: var(--el-input-icon-color, var(--el-text-color-placeholder));
    transition: all var(--el-transition-duration);
    pointer-events: none;
    line-height: 31px;
  }
}

.mask-disabled {
  color: var(--el-disabled-text-color);
  -webkit-text-fill-color: var(--el-disabled-text-color);
  cursor: not-allowed;
  background-color: var(--el-disabled-bg-color);
}
</style>
