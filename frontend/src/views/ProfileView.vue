<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-light">
    <div class="bg-white p-6 rounded-2xl shadow-md w-96 text-center border border-dark">
      <h1 class="text-2xl font-semibold mb-4 text-dark">Личный кабинет</h1>

      <div v-if="user">
        <p class="mb-2"><span class="font-medium">Имя:</span> {{ user.name }}</p>
        <p class="mb-4"><span class="font-medium">Роль:</span> {{ user.role }}</p>
      </div>

      <button
        @click="logout"
        class="w-full bg-medium text-light py-2 rounded-lg hover:bg-dark transition-colors"
      >
        Выйти
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const user = ref(null)

onMounted(() => {
  const savedUser = localStorage.getItem('user')
  if (savedUser) {
    user.value = JSON.parse(savedUser)
  } else {
    router.push('/login')
  }
})

function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.push('/login')
}
</script>
