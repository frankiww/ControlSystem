<template>
  <div v-if="defect" class="min-h-screen bg-light text-dark p-6">
    <h1 class="text-2xl font-bold mb-4 border-b border-dark pb-2">{{ defect.name }}</h1>

    <div class="bg-white p-4 rounded shadow mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div><strong>Описание:</strong> {{ defect.description || '-' }}</div>
      <div><strong>Создан:</strong> {{ formatDate(defect.createdAt) }}</div>
      <div><strong>Инженер:</strong> {{ defect.engineerInfo?.name || '-' }}</div>
      <div><strong>Дедлайн:</strong> {{ formatDate(defect.deadline) || '-' }}</div>
      <div><strong>Статус:</strong> {{ defect.statusName || '-' }}</div>
      <div><strong>Клиент:</strong> {{ defect.objectInfo.clientInfo?.name || '-' }}</div>
      <div><strong>Приоритет:</strong> {{ defect.priority || '-' }}</div>
      <div><strong>Объект:</strong> {{ defect.objectInfo.name || '-' }}</div>
    </div>

    <!-- управление -->
    <div class="bg-white p-4 rounded shadow space-y-4">
      <!-- менеджер -->
      <template v-if="user.role === 'manager'">
        <!-- назначить инженера -->
        <div v-if="!defect.engineerInfo?.id">
          <h2 class="font-semibold text-lg mb-2">Назначить инженера</h2>
          <div class="flex gap-2">
            <select v-model="selectedEngineer" class="border rounded p-1 flex-1">
              <option disabled value="">Выберите инженера</option>
              <option v-for="eng in engineers" :key="eng.id" :value="eng.id">
                {{ eng.name }}
              </option>
            </select>
            <button
              @click="assignEngineer"
              class="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
            >
              Назначить
            </button>
          </div>
        </div>
        <!-- проверить -->
        <div v-else-if="defect.statusName === 'На проверке'">
          <h2 class="font-semibold text-lg mb-2">Проверка дефекта</h2>
          <div class="flex gap-2">
            <button
              @click="updateStatus('Закрыт')"
              class="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
            >
              Принять
            </button>
            <button
              @click="updateStatus('Отменен')"
              class="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
            >
              Отклонить
            </button>
          </div>
        </div>
      </template>

      <!-- инженер -->
      <template
        v-else-if="user.role === 'engineer' && defect.engineerInfo.id === user.id && defect.statusName === 'В работе'"
      >
        <h2 class="font-semibold text-lg mb-2">Передача на проверку</h2>
        <button
          @click="updateStatus('На проверке')"
          class="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
        >
          Передать на проверку
        </button>
      </template>
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
const engineers = ref([])
const selectedEngineer = ref('')
const user = ref({})

async function getUser(){
  const savedUser = localStorage.getItem('user')
  if (savedUser) user.value = JSON.parse(savedUser)
}
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

async function fetchEngineers() {
  const token = localStorage.getItem('token')
  const res = await axios.get(`http://localhost:3030/api/users?role=engineer`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  engineers.value = res.data
}

async function assignEngineer(){
  if (!selectedEngineer.value) return alert('Выберите инженера')
  if (confirm('Назначить выбранного инженера и начать работу?')) {
    const token = localStorage.getItem('token')
    await axios.put(
      `http://localhost:3030/api/defects/${route.params.id}/assign`,
      { engineerId: selectedEngineer.value },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    await fetchDefect()
  }
}

async function updateStatus(newStatus){
  const messages = {
    'На проверке': 'Передать дефект на проверку?',
    'Закрыт': 'Принять дефект?',
    'Отменен': 'Отклонить дефект?',
  }
  if (!confirm(messages[newStatus])) return
  const token = localStorage.getItem('token')
  await axios.put(
    `http://localhost:3030/api/defects/${route.params.id}/status`,
    { status: newStatus },
    { headers: { Authorization: `Bearer ${token}` } }
  )
  await fetchDefect()
}

  

onMounted(() => {
  fetchDefect()
  fetchEngineers()
  getUser()
})
</script>