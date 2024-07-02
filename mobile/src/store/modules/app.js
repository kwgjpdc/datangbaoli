import { defineStore } from 'pinia';
import { store } from '@/store';
import { getBusinessInfo, queryAlertMessage } from '@/api/home';

export const useAppStore = defineStore({
  id: 'app-store',
  state: () => ({
    // 是否是业务人员
    isBusiness: null,
    // 是否有消息， 加过消息,true表示未添加过，false表示添加过
    isMessage: null
  }),
  actions: {
    addBusiness(view) {
      this.isBusiness = view;
    },
    addMessage(view) {
      this.isMessage = view;
    },
    checkBusinessInfo() {
      getBusinessInfo().then(res => {
        if (res.code === 200) {
          this.addBusiness(res.data);
        }
      });
    },
    checkMessageInfo() {
      queryAlertMessage().then(res => {
        this.addMessage(res.data);
      });
    }
  }
});

export function useAppStoreHook() {
  return useAppStore(store);
}
