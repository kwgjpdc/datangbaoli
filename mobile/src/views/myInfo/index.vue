<template>
  <div class="bg-[#E7E7F7] h-[150px] rounded-b-[20px]">
    <div class="flex justify-between items-top pt-[20px] px-[16px]">
      <div>
        <UploadCropper :imageUrl="userInfo.avatar" @finish="handleUpdateImg" />
      </div>
      <div class="flex-1 ml-[10px] mt-[6px]">
        <div class="text-[16px]">{{ userInfo.userName }}</div>
        <span class="text-description text-[14px]">{{
          userInfo.phonenumber
        }}</span>
      </div>
      <!-- <div class="mt-[6px]">
        <van-icon name="bell" size="6vw" dot @click="handleMyMessage" />
      </div> -->
    </div>

    <div class="pt-[10px]">
      <van-cell-group inset>
        <van-cell
          title="昵称"
          is-link
          :value="userInfo.nickName"
          @click="showBottom = true"
        />
        <van-cell title="手机号" :value="userInfo.phonenumber" />
        <van-cell title="ID" :value="userInfo.userId" />
      </van-cell-group>

      <div class="h-[16px]"></div>

      <van-cell-group inset>
        <van-cell
          title="资料上传"
          is-link
          @click="toUploadFile"
          v-if="checkCustomer"
        />
      </van-cell-group>
    </div>
  </div>

  <van-popup
    v-model:show="showBottom"
    round
    position="bottom"
    :style="{ height: '25%' }"
  >
    <div class="pt-[20px]">
      <van-field
        v-model="nickName"
        :border="true"
        label="昵称"
        placeholder="请输入昵称"
      />
    </div>
    <van-divider></van-divider>
    <div class="flex py-[10px] px-[16px] justify-between">
      <van-button class="w-[46%]" @click="showBottom = false">取消</van-button>
      <van-button type="primary" class="w-[46%]" @click="handleUpdateUserInfo"
        >确认</van-button
      >
    </div>
  </van-popup>
</template>

<script setup name="myInfo">
import { onMounted, ref } from 'vue';
import 'vant/es/toast/style';
import {
  getUserInfo,
  uploadAvatar,
  updateUserInfo,
  checkUserIsCustomer
} from '@/api/user';
import UploadCropper from './uploadCropper.vue';
import { showFailToast, showSuccessToast } from 'vant';
import { useRouter } from 'vue-router';
const router = useRouter();

const userInfo = ref({});
const showBottom = ref(false);
const nickName = ref('');
const checkCustomer = ref(false);

onMounted(() => {
  initMyUserInfo();
});

// const handleMyMessage = () => {
//   router.push({
//     path: "/myMessage",
//     query: {
//       id: "12"
//     }
//   });
// };

/**
 * 初始化用户信息
 */
const initMyUserInfo = () => {
  getUserInfo()
    .then(res => {
      userInfo.value = res.data;
      userInfo.value.avatar =
        import.meta.env.VITE_BASE_API + userInfo.value.avatar;
    })
    .catch(err => {});

  checkUserIsCustomer().then(res => {
    checkCustomer.value = res.data;
  });
};

/**
 * 上传头像
 * @param {} file
 */
const handleUpdateImg = file => {
  uploadAvatar(file)
    .then(res => {
      initMyUserInfo();
      showSuccessToast('上传成功');
    })
    .catch(err => {});
};

/**
 * 修改昵称
 */
const handleUpdateUserInfo = () => {
  if (!nickName.value) {
    showFailToast('请输入修改昵称信息');
    return;
  }
  const data = {
    ...userInfo.value,
    nickName: nickName.value
  };
  updateUserInfo(data)
    .then(res => {
      initMyUserInfo();
      showBottom.value = false;
    })
    .catch(err => {
      showBottom.value = false;
    });
};

const toUploadFile = () => {
  router.push({
    path: '/userFile'
  });
};
</script>
