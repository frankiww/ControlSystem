<template>
  <div v-if="defect" class="min-h-screen bg-light text-dark p-6">
    <h1 class="text-2xl font-bold mb-4 border-b border-dark pb-2">{{ defect.name }}</h1>

    <div class="bg-white p-4 rounded shadow mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div><strong>Описание:</strong> {{ defect.description || '-' }}</div>
      <div><strong>Приоритет:</strong> {{ defect.priority || '-' }}</div>
      <div><strong>Инженер:</strong> {{ defect.engineerName || '-' }}</div>
      <div><strong>Дедлайн:</strong> {{ formatDate(defect.deadline) || '-' }}</div>
      <div><strong>Статус:</strong> {{ defect.statusName || '-' }}</div>
      <div><strong>Клиент:</strong> {{ defect.objectInfo.clientInfo?.name || '-' }}</div>
    </div>

    <!-- вкладки -->
  </div>

  <div v-else class="min-h-screen flex items-center justify-center text-gray-500">
    Загрузка информации о дефекте...
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const defect = ref(null)
const error = ref('')

function formatDate(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
}

async function fetchDefect() {
  try {
    const token = localStorage.getItem('token')
    const response = await axios.get(
      `http://localhost:3030/api/defects/${route.params.id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    defect.value = response.data
  } catch (err) {
    console.error('Ошибка загрузки дефекта:', err)
    error.value = 'Не удалось загрузить дефект'
  }
}

onMounted(() => {
  fetchDefect()
})
</script>
