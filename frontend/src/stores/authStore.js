import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter();

  const user = ref(null);
  const token = ref(localStorage.getItem('token') || null);
  const error = ref(null);

  const isAuthenticated = computed(() => !!token.value);
  const currentUser = computed(() => user.value);

  const login = async (email, password) => {
    error.value = null;

    try {
      // TODO: Заменить на реальный API вызов к Symfony микросервису
      const response = await fetch('http://project/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        throw new Error('Неверные учетные данные');
      }

      const data = await response.json();

      token.value = data.token;
      user.value = data.user;
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      router.push('/');

      return data;
    } catch (err) {
      error.value = err.message;
      throw err;
    }
  }

  const register = async (userData) => {
    error.value = null;

    try {
      // TODO: Заменить на реальный API вызов
      const response = await fetch('http://project/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      })

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка регистрации');
      }

      const data = await response.json();

      token.value = data.token;
      user.value = data.user;
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      router.push('/');

      return data;
    } catch (err) {
      error.value = err.message;
      throw err;
    }
  }

  const logout = () => {
    token.value = null;
    user.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  }

  const restoreUser = () => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      user.value = JSON.parse(savedUser);
    }
  }

  restoreUser();

  return {
    user,
    token,
    error,
    isAuthenticated,
    currentUser,
    login,
    register,
    logout
  }
})
