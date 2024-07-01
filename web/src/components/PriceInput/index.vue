<template>
    <el-form-item class="price-parent" :label="props.label" :prop="props.propslot?props.propslot:props.prop" :disabled ="props.disabled" :style="props.style">
        <el-input :style="`width: ${width}px`" ref="input" v-model="form[props.prop]" :placeholder="placeholder" maxlength="12"
            @blur="blurInput" @focus="focusInput" oninput ="value=value.replace(/[^0-9.]/g,'')" :disabled ="props.disabled" >
            <template #suffix>
                <slot name="suffix"></slot>
        </template>
        <template #prefix>
            <slot name="prefix"></slot>
        </template>
        </el-input>
        <div class="price-mask" :style="`width: ${width - 20}px`" v-show="showFormatPrice" @click="focusInput" :class="{'mask-disabled':props.disabled}"><span> <slot name="prefix"></slot>{{ formaterPrice }}</span><slot name="suffix" v-if="formaterPrice" style="float: right;"></slot></div>
    </el-form-item>
</template>

<script setup>
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
        default: 140,
    },
    form: {
        type: Object,
        default: () => ({
        }),
    },
    rules: {
        type: Object,
        default: null,
    },
    disabled:{
        type: Boolean,
        default: false,
    },
    style:{
        type: Object,
        default: () => { },
    }
})
let formaterPrice = ref('0');
let showFormatPrice = ref(true);
watch(() => props.form[props.prop], (newValue, oldValue) => {
    if (
        newValue !== '' &&
        newValue !== null && newValue
    ) {
        // 去掉前面的0

        const integer = newValue.toString().split('.')[0] || '0';
        const decimal = newValue.toString().split('.')[1]
            ? `.${newValue.toString().split('.')[1]}`
            : ''
        formaterPrice.value = `${integer
            .toString()
            .replace(/(?=(?!^)(\d{3})+$)/g, ',')}${decimal}`
    } else {
        formaterPrice.value = ''
    }
}, { deep:true,immediate: true })

function inputFun(value){
    if (value.keyCode!=46 && value.keyCode!=45 && value.keyCode<48 || value.keyCode>57) value.returnValue=false
}
// 聚焦金额输入框
function focusInput() {
    if(props.disabled) return;

    showFormatPrice.value = false
    proxy.$refs.input.focus()
}
// 失焦金额输入框
function blurInput() {
    if (props.form[props.prop] !== '' && props.form[props.prop]) {
        // 去掉前面的0
        console.log(props.form[props.prop]);
        const integer = Number(props.form[props.prop].toString().split('.')[0]) || '0';
        const decimal = props.form[props.prop].toString().split('.')[1]
            ? `.${props.form[props.prop].toString().split('.')[1]}`
            : ''
        emit(`update:form[${props.prop}]`, isNaN(`${integer}${decimal}`)
            ? props.form[props.prop]
            : `${integer}${decimal}`);
        if (typeof props.rules[props.prop][0].pattern !== 'object') {
            throw `请确保 rules[${props.prop}][0].pattern 为正则表达式`
            return
        }
        showFormatPrice.value = props.rules[props.prop][0].pattern.test(
            props.form[props.prop],
        )
    }
}
</script>

<style lang="scss" scoped>
.price-mask {
    position: absolute;
    z-index: 2;
    top: 1px;
    left: 10px;
    background: white;
    width: 110px;
    overflow: auto;
    font-size: 13px;
    line-height: 30px;
    color: var(--el-input-text-color);
    display: flex;
    justify-content: space-between;
   
}
.mask-disabled {
    color: var(--el-disabled-text-color);
    -webkit-text-fill-color: var(--el-disabled-text-color);
    cursor: not-allowed;
    background-color: var(--el-disabled-bg-color);
    
}

</style>
