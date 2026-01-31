<template>
  <h1>Профиль</h1>
  <div v-if="profile">
    <p>👤 {{ profile.username }}</p>
    <p>📧 {{ profile.email }}</p>
    <div>
      <button @click="openEditModal">Изменить данные профиля</button>
    </div>
  </div>
  <div v-else>
    <p>Загрузка профиля...</p>
  </div>

  <div v-if="showEditModal">
    <h3>Редактирование данных</h3>

    <form @submit.prevent="updateProfile">
      <div class="update-form">
        <label for="username">Имя пользователя:</label>
        <input
          id="username"
          v-model="editForm.username"
          type="text"
          required
        />
      </div>
      <div class="update-form">
        <label for="email">Email:</label>
        <input
          id="email"
          v-model="editForm.email"
          type="email"
          required
        />
      </div>
      <button type="submit">Сохранить</button>
      <button @click="closeEditModal" class="close-btn">Отмена</button>
    </form>
  </div>
</template>

<script setup>
  import { useProfileStore } from '@/stores/profileStore';
  import { onMounted, ref } from 'vue';

  const profileStore = useProfileStore();

  const profile = ref(null);
  const showEditModal = ref(false);

  const editForm = ref({
    username: '',
    email: ''
  });

  const openEditModal = () => {
    showEditModal.value = true;
  };

  const closeEditModal = () => {
    showEditModal.value = false;
  };

  const loadProfile = async () => {
    try {
      profile.value = await profileStore.getProfile();

      editForm.value = {
        username: profile.value.username,
        email: profile.value.email,
      };
    } catch (err) {
      console.error('Ошибка загрузки профиля:', err);
      alert(err);
    }
  };

  const updateProfile = async () => {
    try {
      profile.value = await profileStore.updateProfile(editForm.value);
      closeEditModal();
    } catch (err) {
      console.error('Ошибка обновления профиля:', err);
      alert(err);
    }
  };

  onMounted(() => {
    loadProfile();
  });
</script>
