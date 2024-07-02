<template>
  <van-cell-group>
    <van-field label="用户资料上传" readonly :border="false" />
    <van-field readonly>
      <template #input>
        <van-uploader
          upload-icon="plus"
          v-model="fileList"
          :deletable="false"
          accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.html,.htm,.txt,.rar,.zip,.gz,.bz2,.mp4,.avi,.rmvb"
          :after-read="afterRead"
        />
        <!-- <template #preview-cover="{ file }">
            <div class="preview-cover van-ellipsis" v-if="file">{{ file?file.name:'' }}</div>
          </template> -->
        <!-- </van-uploader> -->
      </template>
    </van-field>
  </van-cell-group>
  <div class="p-[20px]">
    <van-button block plain @click="router.go(-1)">返回</van-button>
  </div>
</template>

<script setup>
import { uploadUserFile } from '@/api/user';
import { showSuccessToast } from 'vant';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const fileList = ref([]);
const router = useRouter();

const afterRead = (file, index) => {
  const formData = new FormData();
  formData.append('file', file.file);
  uploadUserFile(formData).then(res => {
    showSuccessToast('上传成功');
  }).catch(err => {
    fileList.value.splice(index.index, 1)
  });
};
</script>

<style scoped>
.preview-cover {
  position: absolute;
  bottom: 0;
  box-sizing: border-box;
  width: 100%;
  padding: 0px;
  color: #fff;
  font-size: 12px;
  text-align: center;
  background: rgba(0, 0, 0, 0.3);
}
</style>
