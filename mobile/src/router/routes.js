import Layout from '@/layout/index.vue';
import Home from '@/views/home/index.vue';

const routes = [
  {
    path: '/',
    name: 'root',
    component: Layout,
    redirect: { name: 'Home' },
    children: [
      {
        path: 'home',
        name: 'Home',
        component: Home,
        meta: {
          title: '首页'
        }
      },
      {
        path: 'waitTask',
        name: 'Task',
        component: () => import('@/views/task/index.vue'),
        meta: {
          title: '待办'
        }
      },
      {
        path: 'message',
        name: 'Message',
        component: () => import('@/views/message/index.vue'),
        meta: {
          title: '消息'
          // noCache: true
        }
      },
      {
        path: 'myInfo',
        name: 'MyInfo',
        component: () => import('@/views/myInfo/index.vue'),
        meta: {
          title: '我的'
          // noCache: true
        }
      }
    ]
  },
  {
    path: '/myMessage',
    name: 'MyMessage',
    component: () => import('@/views/myInfo/myMessage.vue'),
    meta: {
      title: '我的消息'
      // noCache: true
    }
  },
  {
    path: '/taskDetail',
    name: 'TaskDetail',
    component: () => import('@/views/task/taskDetail.vue'),
    meta: {
      title: '任务处理'
      // noCache: true
    }
  },
  {
    path: '/homeDetail',
    name: 'HomeDetail',
    component: () => import('@/views/home/detail.vue'),
    meta: {
      title: '统计详情'
      // noCache: true
    }
  },
  {
    path: '/userFile',
    name: 'UserFile',
    component: () => import('@/views/myInfo/userFile.vue'),
    meta: {
      title: '用户资料上传'
      // noCache: true
    }
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/404/index.vue'),
    meta: {
      title: '暂无权限'
      // noCache: true
    }
  },
  {
    path: '/:catchAll(.*)',
    component: () => import('@/views/404/index.vue'),
    meta: {
      title: '暂无权限'
      // noCache: true
    }
  }
];

export default routes;
