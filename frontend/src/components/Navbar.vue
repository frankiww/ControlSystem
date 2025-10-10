<template>
  <nav class="bg-medium text-dark flex justify-between items-center  sticky top-0 z-50">
    <div class="flex space-x-4">
      <router-link to="/objects" class="hover:bg-dark hover:text-light px-6 py-4">Объекты</router-link>
      <router-link to="/defects" class="hover:bg-dark hover:text-light px-6 py-4">Дефекты</router-link>
      <router-link v-if="user.role !== 'engineer'" to="/reports" class="hover:bg-dark hover:text-light px-6 py-4">Отчеты</router-link>
      <router-link
        v-if="user.role === 'manager'"
        to="/users"
        class="hover:bg-dark hover:text-light px-6 py-4"
      >
        Пользователи
      </router-link>
    </div>

    <div>
      <router-link to="/profile" class="hover:bg-dark hover:text-light px-6 py-5">Личный кабинет</router-link>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const user = ref({})

onMounted(() => {
  const savedUser = localStorage.getItem('user')
  if (savedUser) user.value = JSON.parse(savedUser)
})
</script>
