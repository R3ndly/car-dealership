<script setup></script>

<template>
  <nav>
    <p>Навигация</p>
    <router-link to="/">Домой</router-link>
    <router-link to="/register">Регистрация</router-link>
  </nav>
  <main>
    <router-view />
  </main>
  <footer><p>Symfony Microservices + Vue 3 | Учебный проект</p></footer>
</template>

<style scoped></style>
