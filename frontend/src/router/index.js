import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('@/views/HomeView.vue')
    },
    {
      path: '/register',
      name: 'registration',
      component: () => import('@/views/auth/Register.vue')
    },
    {
      path: '/login',
      name: 'Authentication',
      component: () => import('@/views/auth/Login.vue')
    },
    {
      path: '/profile',
      name: 'UserProfile',
      component: () => import('@/views/Profile.vue'),
      meta: { requiresAuth: true }
    }
  ],
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if(requiresAuth && !localStorage.getItem('token')) {
    next('/login');
  } else {
    next();
  }
});

export default router;
