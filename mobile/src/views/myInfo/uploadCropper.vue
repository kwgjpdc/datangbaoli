<template>
  <div>
    <van-uploader
      :after-read="afterRead"
      :max-count="maxCount"
      :class="`w-[60px] h-[60px]`"
    >
      <van-image round :class="`w-[60px] h-[60px]`" :src="url" />
    </van-uploader>
    <!-- option是配置，格式是对象-->
    <h5-cropper
      ref="cropper"
      :hide-input="true"
      :option="option"
      @getbase64Data="getbase64Data"
      @getblobData="getblobData"
      @getFile="getFile"
      @canceltailor="cancelCropper"
    />
  </div>
</template>
<script>
export default {
  name: 'UploadCropper'
};
</script>
<script setup>
import H5Cropper from 'vue-cropper-h5';
import 'vue-cropper-h5/dist/style.css';
import { ref, computed } from 'vue';
const props = defineProps({
  option: {
    type: Object,
    default: () => ({
      fixedNumber: [1, 1], //截图框的宽高比例,[宽度, 高度]
      fixed: true, //是否开启截图框宽高固定比例
      canMove: true, //上传图
      canMoveBox: false, //截图框能否拖动
      outputSize: 1, //裁剪生成图片的质量,可选值0.1 - 1
      info: true //裁剪框的大小信息
    })
  },
  maxCount: {
    type: Number,
    default: 1
  },
  // modelValue: {
  //   type: Array,
  //   default: () => [],
  // },
  imageUrl: {
    type: String,
    default: ''
  }
  // height: { //设置图片的宽度
  //   type: String,
  //   default: '60px',
  // },
  // width: {  //设置图片的高度
  //   type: String,
  //   default: '60px',
  // },
  // borderRadius: { //设置图片的圆角
  //   type: String,
  //   default: '60px',
  // },
});
const cropper = ref(null); //裁剪框
const $emit = defineEmits(['finish']);
const url = computed({
  get() {
    return props.imageUrl;
  },
  set(newVal) {
    // $emit('update:modelValue', newVal)
  }
});
// 获取裁剪完成的 Base64 数据
const getbase64Data = data => {
  //console.log(data)
};
// 获取裁剪完成的 Blob 数据
const getblobData = data => {
  //console.log(data)
};
const isStop = ref(false);

// 获取裁剪完成的 File 数据,上传图片,此方法有bug会执行两次，isStop控制一下
const getFile = async data => {
  if (isStop.value) return;
  isStop.value = true;
  const formData = new FormData();
  formData.append('avatarfile', data);
  $emit('finish', formData);
};
// 图片选择
const afterRead = data => {
  //调用组件自带的loadFile接口
  cropper.value.loadFile(data.file);
  //data.status = 'uploading'
  isStop.value = false;
};
// 取消裁剪
const cancelCropper = () => {};
</script>
<!-- <style scoped>
.upload_img {
  width: v-bind(width);
  height: v-bind(height);
  border-radius: v-bind(borderRadius);
}
:deep(.van-uploader) {
  width: v-bind(width);
  height: v-bind(height);
  border-radius: v-bind(borderRadius);
}
</style> -->
