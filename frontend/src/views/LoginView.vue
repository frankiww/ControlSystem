<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-light">
    <div class="bg-white p-6 rounded-2xl shadow-md w-96 border border-dark">
      <h2 class="text-2xl font-semibold mb-6 text-dark text-center">Авторизация</h2>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div class="flex flex-col">
          <label for="login" class="mb-1 text-dark font-medium">Логин:</label>
          <input
            v-model="login"
            id="login"
            type="text"
            required
            class="border border-dark rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-medium"
          />
        </div>

        <div class="flex flex-col">
          <label for="password" class="mb-1 text-dark font-medium">Пароль:</label>
          <input
            v-model="password"
            id="password"
            type="password"
            required
            class="border border-dark rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-medium"
          />
        </div>

        <button
          type="submit"
          class="w-full bg-medium text-white py-2 rounded-lg hover:bg-dark transition-colors"
        >
          Войти
        </button>
      </form>

      <p v-if="error" class="text-red-600 mt-4 text-center">{{ error }}</p>
    </div>
  </div>
</template>


<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const login = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()

async function handleLogin() {
  try {
    const response = await axios.post('http://localhost:3030/api/auth/login', {
      login: login.value,
      password: password.value,
    })
    console.log(response);
    //сохраняем токен, который пришел с бэка
    localStorage.setItem('token', response.data.token)
    localStorage.setItem('user', JSON.stringify(response.data.user))

    router.push('/profile')
  } catch (err) {
    error.value = 'Неверный логин или пароль'
  }
}
</script>

<style scoped>
.login-page {
  max-width: 400px;
  margin: 100px auto;
  padding: 24px;
  border: 1px solid #2B2D42;
  border-radius: 10px;
}
.form-group {
  margin-bottom: 16px;
}
button {
  width: 100%;
  padding: 10px;
  background-color: #8D99AE;
  border-color: #8D99AE;
}
.error {
  color: red;
  margin-top: 10px;
}
label{
    margin-right: 15px;
}
</style>
