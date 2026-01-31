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

  const deleteProfile = async () => {
    const response = await fetch('http://project/profile', {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include'
    });

    const data = await response.json();

    if(!data.success) {
      throw new Error('Ошибка удаления профиля' + data.message);
    }

    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return {
    getProfile,
    updateProfile,
    deleteProfile
  };
});
