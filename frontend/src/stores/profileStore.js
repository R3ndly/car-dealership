import { defineStore } from 'pinia';

export const useProfileStore = defineStore('profile', () => {
  const token = localStorage.getItem('token');

  const getProfile = async () => {
    try {
      const response = await fetch('http://project/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      const data = await response.json();

      if(!data.success) {
        throw new Error('Ошибка при получении данных: '+ data.message);
      }

      return data.user;
    } catch(error) {
      throw error;
    }
  };

  const updateProfile = async (editForm) => {
      const response = await fetch('http://project/profile', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editForm),
        credentials: 'include'
      });

      const data = await response.json();

      if(!data.success) {
        throw new Error('Ошибка обновления данных' + data.message);
      }

      return data.user;
  };

  return {
    getProfile,
    updateProfile
  };
});
