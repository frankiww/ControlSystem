<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Пользователи</h1>

    <!-- вкладки -->
    <div class="flex space-x-4 mb-6">
      <button
        :class="[
          'px-4 py-2 rounded transition',
          activeTab === 'active' ? 'bg-medium text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        ]"
        @click="activeTab = 'active'; fetchUsers()"
      >
        Активные
      </button>
      <button
        :class="[
          'px-4 py-2 rounded transition',
          activeTab === 'inactive' ? 'bg-medium text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        ]"
        @click="activeTab = 'inactive'; fetchUsers()"
      >
        Неактивные
      </button>

      <button
        class="ml-auto bg-medium text-white px-4 py-2 rounded hover:bg-dark transition"
        @click="openAddUserModal"
      >
        + Добавить пользователя
      </button>
    </div>

    <!-- фильтр -->
    <div class="mb-4 flex items-center space-x-3">
      <label for="roleFilter" class="text-gray-700">Роль:</label>
      <select
        id="roleFilter"
        v-model="selectedRole"
        @change="fetchUsers"
        class="border border-gray-300 rounded px-3 py-1"
      >
        <option value="">Все</option>
        <option v-for="role in roles" :key="role" :value="role">
          {{ role }}
        </option>
      </select>
    </div>

    <table class="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
      <thead class="bg-medium text-dark">
        <tr>
          <th class="py-2 px-4 text-left">Имя</th>
          <th class="py-2 px-4 text-left">Роль</th>
          <th class="py-2 px-4 text-left">Логин</th>
          <th v-if="activeTab === 'active'" class="py-2 px-4 text-left">Действия</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="user in users"
          :key="user.id"
          class="border-t hover:bg-gray-50 transition"
        >
          <td class="py-2 px-4">{{ user.name }}</td>
          <td class="py-2 px-4">{{ user.Role?.name || '—' }}</td>
          <td class="py-2 px-4">{{ user.Account.login }}</td>
          <td v-if="activeTab === 'active'" class="py-2 px-4">
            <button
              v-if="user.id !== currentUser.id && user.active"
              @click="deactivateUser(user)"
              class="text-red-600 hover:underline"
            >
              Деактивировать
            </button>
            <span v-else class="text-gray-400">—</span>
          </td>
        </tr>
      </tbody>
    </table>

    <AddUserModal
      v-if="showAddUserModal"
      :is-open="showAddUserModal"
      @close="closeAddObjectModal"
      @created="handleUserCreated"

    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import AddUserModal from '../components/AddUserModal.vue'

const users = ref([])
const roles = ref(['manager', 'engineer', 'client'])
const selectedRole = ref('')
const activeTab = ref('active')
const showAddUserModal = ref(false)

const token = localStorage.getItem('token')
const currentUser = ref(JSON.parse(localStorage.getItem('user') || '{}'))

async function fetchUsers() {
  try {
    const res = await axios.get(`http://localhost:3030/api/users`, {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        role: selectedRole.value || undefined,
        active: activeTab.value === 'active' ? true : false,
        login: true
      }
    })
    users.value = res.data
  } catch (err) {
    console.error('Ошибка при загрузке пользователей:', err)
  }
}

function openAddUserModal() {
  showAddUserModal.value = true
}

function closeAddObjectModal() {
  showAddUserModal.value = false
}

async function handleUserCreated() {
  await fetchUsers()
  closeAddObjectModal()
}

async function deactivateUser(user) {
  if (confirm(`Вы уверены, что хотите деактивировать пользователя ${user.name}?`)) {
    try {
      await axios.put(
        `http://localhost:3030/api/users/${user.id}/deactivate`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      await fetchUsers()
    } catch (err) {
      console.error('Ошибка при деактивации пользователя:', err)
    }
  }
}

onMounted(fetchUsers)
</script>
