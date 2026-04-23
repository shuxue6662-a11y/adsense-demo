import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import CompareMode from '../views/CompareMode.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: 'AdSense·感知广告 - 首页'
    }
  },
  {
    path: '/compare',
    name: 'Compare',
    component: CompareMode,
    meta: {
      title: 'AdSense·感知广告 - 对比实验'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  }
});

// 路由守卫：更新页面标题
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'AdSense·感知广告';
  next();
});

export default router;