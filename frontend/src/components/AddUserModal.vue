<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded shadow-lg w-full max-w-lg relative">
      <h2 class="text-xl font-bold mb-4">Создать нового пользователя</h2>
      <form @submit.prevent="submitUser" class="space-y-4">
        
        <div>
          <label class="block font-semibold mb-1">Имя</label>
          <input v-model="name" type="text" class="w-full border rounded px-3 py-2" required />
        </div>

        <div>
          <label class="block font-semibold mb-1">Роль</label>
            <select
                id="roleFilter"
                v-model="selectedRole"
                class="border border-gray-300 rounded px-3 py-1"
            >
                <option v-for="role in roles" :key="role" :value="role">
                {{ role }}
                </option>
            </select>
        </div>

        <div>
          <label class="block font-semibold mb-1">Логин</label>
          <input v-model="login" type="text" class="w-full border rounded px-3 py-2" required />
        </div>

        <div>
          <label class="block font-semibold mb-1">Пароль</label>
          <input v-model="password" type="text" class="w-full border rounded px-3 py-2" required />
        </div>
        <div class="flex justify-end gap-2 mt-4">
          <button type="button" @click="close" class="px-4 py-2 border rounded">Отмена</button>
          <button type="submit" class="px-4 py-2 bg-medium text-white rounded hover:bg-dark">Создать</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import axios from 'axios'

const props = defineProps({
  isOpen: Boolean,
})

const emit = defineEmits(['close', 'created'])

const name = ref('')
const login = ref('')
const password = ref('')
const selectedRole = ref(null)
const roles = ref(['manager', 'engineer', 'client'])

function close() {
  emit('close')
}

async function submitUser() {
  if (!selectedRole.value) return alert('Выберите роль')

  const token = localStorage.getItem('token')
  try {
    const payload = {
      name: name.value,
      login: login.value,
      password: password.value,
      role: selectedRole.value,
    }

    await axios.post('http://localhost:3030/api/users', payload, {
      headers: { Authorization: `Bearer ${token}` }
    })

    emit('created')
    close()
  } catch (err) {
    console.error('Ошибка создания пользователя', err)
    alert('Не удалось создать пользователя')
  }
}
</script>
