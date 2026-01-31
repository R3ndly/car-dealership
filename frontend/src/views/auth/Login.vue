<template>
<div>
  <div class="login-card">
    <div class="login-title">
      <h1>Вход</h1>
    </div>
    <form @submit.prevent="handleSubmit" class="login-form">
      <div class="form-email">
        <label for="email">Email</label>
        <input
          id="email"
          v-model="formData.email"
          type="email"
        />
      </div>

      <div class="form-password">
        <label for="password">Пароль</label>
        <input
          id="password"
          v-model="formData.password"
          type="password"
        />
      </div>

      <button type="submit">Вход</button>
    </form>
  </div>
</div>
</template>

<script setup>
  import { reactive } from 'vue';
  import { useRouter } from 'vue-router';
  import { useAuthStore } from '@/stores/authStore';

  const router = useRouter();
  const authStore = useAuthStore();

  const formData = reactive({
    email: '',
    password: ''
  })

  const handleSubmit = async () => {
    try{
      if(!formData.email || !formData.password) {
        throw('Вы не ввели данные в поля');
      }
      await authStore.login(formData);

      router.push('/');
    } catch(error) {
      alert('Ошибка: '+ error);
    }
  }
</script>

