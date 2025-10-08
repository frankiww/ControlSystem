<template>
  <div class="p-4">
    <h2 class="text-xl font-semibold mb-4">История изменений</h2>

    <div v-if="loading" class="text-gray-500">Загрузка истории...</div>
    <div v-else-if="error" class="text-red-500">{{ error }}</div>
    <div v-else-if="history.length === 0" class="text-gray-500">
      История изменений отсутствует.
    </div>

    <ul v-else class="space-y-3">
      <li
        v-for="(entry, index) in history"
        :key="index"
        class="p-3 bg-white rounded shadow-sm border border-gray-200"
      >
        <div class="text-sm text-gray-600 mb-1">
          {{ formatDate(entry.createdAt) }}
        </div>
        <div class="text-gray-800">
          <strong>{{ entry.data.action }}:</strong> {{ entry.data.message }}
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRoute } from 'vue-router'

const route = useRoute()
const history = ref([])
const loading = ref(true)
const error = ref('')

function formatDate(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
}

async function fetchHistory() {
  try {
    const token = localStorage.getItem('token')
    const response = await axios.get(
      `http://localhost:3030/api/history/${route.params.id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    history.value = response.data
  } catch (err) {
    console.error('Ошибка загрузки истории:', err)
    error.value = 'Не удалось загрузить историю изменений'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchHistory()
})
</script>

<style scoped>
li {
  transition: background-color 0.2s;
}
li:hover {
  background-color: #fafafa;
}
</style>
