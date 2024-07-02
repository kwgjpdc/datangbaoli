<template>
  <div class="home-content pb-[12px]">
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <div
        class="bg-[#fff] rounded text-sm"
        v-for="(item, index) in dataList"
        :key="index"
      >
        <div class="px-[12px] py-[10px]">
          <div class="flex justify-start items-center">
            <div>
              <van-icon size="30" name="guide-o" />
            </div>
            <div class="ml-[16px] flex-1 flex justify-between items-center">
              <div class="">
                <div class="">应收款确认</div>
                <div class="text-description">这是一段任务描述</div>
              </div>
              <div>
                <van-icon name="arrow" size="18" />
              </div>
            </div>
          </div>
        </div>
        <div class="h-[1px] bg-bgColor"></div>
      </div>
    </van-list>
  </div>
</template>

<script setup name="myMessage">
import { ref } from 'vue';

const dataList = ref([
  {
    name: '保理业务金额',
    value: '1232'
  },
  {
    name: '可用资金余额',
    value: '1232'
  }
]);
const loading = ref(false);
const finished = ref(false);

const onLoad = () => {
  // 异步更新数据
  // setTimeout 仅做示例，真实场景中一般为 ajax 请求
  setTimeout(() => {
    for (let i = 0; i < 10; i++) {
      dataList.value.push(dataList.value.length + 1);
    }

    // 加载状态结束
    loading.value = false;

    // 数据全部加载完成
    if (dataList.value.length >= 40) {
      finished.value = true;
    }
  }, 1000);
};
</script>
