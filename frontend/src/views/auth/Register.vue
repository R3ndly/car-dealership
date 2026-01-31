<template>
<div>
  <div class="registration-card">
    <div class="registration-title">
      <h1>Регистрация</h1>
    </div>
    <form @submit.prevent="handleSubmit" class="register-form">
      <div class="form-name">
        <label for="name">Ваше имя</label>
        <input
          id="name"
          v-model="formData.username"
          type="text"
        />
      </div>

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
        <span v-if="!validPassword.length">минимум 8 символов </span>
        <span v-if="!validPassword.letter">минимум одна буква </span>
      </div>

      <button type="submit" :disabled="isSubmitting">
        <span v-if="isSubmitting">Регистрация...</span>
        <span v-else>Создать аккаунт</span>
      </button>
    </form>
  </div>
</div>
</template>

<script setup>
  import { reactive, ref, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { useAuthStore } from '@/stores/authStore';

  const router = useRouter();
  const authStore = useAuthStore();

  const formData = reactive({
    username: '',
    email: '',
    password: ''
  })

  const isSubmitting = ref(false);

  const handleSubmit = async () => {
    try{
      isSubmitting.value = true;
      if(!formData.username || !formData.email || !formData.password) {
        throw('Вы не ввели данные в поля');
      }
      await authStore.register(formData);

      router.push('/');
    } catch(error) {
      alert(error.message);
    } finally {
      isSubmitting.value = false;
    }
  }

  const validPassword = computed(() => {
    return {
      length: formData.password.length >= 8,
      letter: /[a-zA-Zа-яА-Я]/.test(formData.password)
    }
  })
</script>

<style scoped>
  .invalid {
    background: red;
  }
  .valid {
    visibility: hidden;
  }
</style>
