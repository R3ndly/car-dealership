import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

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

const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));

    return payload.exp * 1000 < Date.now();
  } catch (error) {
    return true;
  }
};

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const token = localStorage.getItem('token');
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  const tokenExpired = isTokenExpired(token);

  if(requiresAuth && (!token || tokenExpired)) {
    if (tokenExpired) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      authStore.token = null;
      authStore.username = null;
    }
    next('/login');
  } else {
    next();
  }
});

export default router;
