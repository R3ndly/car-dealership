<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore();

const dropdownOpen = ref(false);

const openDropdown = () => {
  dropdownOpen.value = true;
};

const closeDropdown = () => {
  dropdownOpen.value = false;
};
</script>

<template>
  <header>
    <nav>
      <div class="header">
        <router-link to="/">Домой</router-link>
      </div>

      <div v-if="authStore.isAuthenticated" class="header" @mouseleave="closeDropdown">
        <button @click="openDropdown">Профиль ▼</button>

        <div v-if="dropdownOpen" class="dropdown-menu" @mouseleave="closeDropdown">
          <div><strong>{{ authStore.username }}</strong></div>

          <router-link to="/profile" @click="closeDropdown">Мой профиль</router-link>

          <button @click.stop="authStore.logout()" @click="closeDropdown">Выйти</button>
        </div>
      </div>

      <div v-else class="header">
        <router-link to="/login">Войти</router-link>
        <router-link to="/register">Зарегистрироваться</router-link>
      </div>
    </nav>
  </header>
  <main>
    <router-view />
  </main>
  <footer><p>Symfony Microservices + Vue 3 | Учебный проект</p></footer>
</template>

<style scoped>
  nav {
    display: flex;
    justify-content: space-around;
    border-bottom: 1px solid #000;
  }
  nav a {
    text-decoration: none;
    color: black;
    margin-top: 7px;
  }
  nav a:hover {
    color: grey;
  }
  .header {
    display: flex;
    justify-content: space-between;
    width: 250px;
    height: 40px;
  }
  footer {
    border-top: 1px solid #000;
  }
</style>
