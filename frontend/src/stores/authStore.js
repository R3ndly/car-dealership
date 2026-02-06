import router from '@/router';
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useAuthStore = defineStore('auth', () => {

  const username = ref(localStorage.getItem('user') || null);
  const token = ref(localStorage.getItem('token') || null);

  const isAuthenticated = computed(() => !!username.value);

  const login = async (userData) => {
    const response = await fetch('http://project/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || 'Неверные учетные данные');
    }

    token.value = data.token;
    username.value = data.username;
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', data.username);
  }

  const register = async (userData) => {
    const response = await fetch('http://project/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    })
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || 'Ошибка регистрации');
    }

    token.value = data.token;
    username.value = data.username;
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', data.username);
  }

  const logout = () => {
    const currentRoute = router.currentRoute.value;

    token.value = null;
    username.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    if(currentRoute.meta?.requiresAuth) {
      router.push('/');
    }
  }

  return {
    username,
    token,
    isAuthenticated,
    login,
    register,
    logout
  }
})
