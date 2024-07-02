import { createRouter, createWebHistory } from 'vue-router';
import routes from './routes';
//import { useCachedViewStoreHook } from "@/store/modules/cachedView";
import NProgress from '@/utils/progress';
import setPageTitle from '@/utils/set-page-title';
import { userLoginAuth } from '../api/user';
import { removeToken, setToken, getToken } from '../utils/auth';
import { useAppStoreHook } from '../store/modules/app';

const router = createRouter({
  history: createWebHistory('/app'),
  routes
});

// 路由白名单
const whiteList = ['/404'];

router.beforeEach((to, from, next) => {
  NProgress.start();
  setPageTitle(to.meta.title);

  const useAppStore = useAppStoreHook();

  const query = to.query || {};

  if (query.auth) {
    userLoginAuth({ username: query.auth })
      .then(res => {
        setToken(res.token);
        useAppStore.checkBusinessInfo();
        useAppStore.checkMessageInfo();
        next();
      })
      .catch(err => {
        removeToken();
        next({
          path: '/404'
        });
      });
  } else {
    // console.log(to)
    if (whiteList.indexOf(to.fullPath) == -1) {
      if (getToken()) {
        if (useAppStore.isBusiness === null) {
          useAppStore.checkBusinessInfo();
        }

        if (useAppStore.isMessage === null) {
          useAppStore.checkMessageInfo();
        }
        next();
      } else {
        next('/404');
      }
    } else {
      next();
    }
  }
  // 路由缓存
  //useCachedViewStoreHook().addCachedView(to);
  // 页面 title
});

router.afterEach(() => {
  window.scrollTo({ top: 0 });
  NProgress.done();
});

export default router;
