import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useAuthStore = defineStore('auth', () => {

  const username = ref(null);
  const token = ref(localStorage.getItem('token') || null);
  const error = ref(null);

  const isAuthenticated = computed(() => !!token.value);
  const currentUser = computed(() => username.value);

  const login = async (email, password) => {
    error.value = null;

    try {
      // TODO: Заменить на реальный API вызов к Symfony микросервису
      const response = await fetch('http://project/api/login', {
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
      username.value = data.username;
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', data.username);

      return data;
    } catch (err) {
      error.value = err.message;
      throw err;
    }
  }

  const register = async (userData) => {
    try {
      const response = await fetch('http://project/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      })
      const data = await response.json();
      console.log(data);

      if (!data.success) {
        throw new Error(data.message || 'Ошибка регистрации');
      }

      //token.value = data.token;
      username.value = data.username;
      //localStorage.setItem('token', data.token);
      localStorage.setItem('user', data.username);

      return data.username;
    } catch (err) {
      console.error('Ошибка регистрации: ', err.message);
      throw err;
    }
  }

  const logout = () => {
    token.value = null;
    username.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  const restoreUser = () => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      username.value = savedUser;
    }
  }

  restoreUser();

  return {
    username,
    token,
    error,
    isAuthenticated,
    currentUser,
    login,
    register,
    logout
  }
})
