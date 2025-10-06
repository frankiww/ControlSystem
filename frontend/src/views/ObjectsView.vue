<template>
  <div class="min-h-screen bg-light text-dark p-6">
    <h1 class="text-2xl font-bold mb-6 border-b border-dark pb-2">
      Объекты
    </h1>

    <!-- фильтры -->
    <div class="flex flex-col sm:flex-row gap-4 mb-6 items-center">
      <select
        v-model="selectedClient"
        @change="fetchObjects"
        class="border border-dark rounded px-3 py-2 w-full sm:w-1/3 focus:outline-none focus:ring-2 focus:ring-medium"
      >
        <option value="">Все клиенты</option>
        <option
          v-for="client in clients"
          :key="client.id"
          :value="client.id"
        >
          {{ client.name }}
        </option>
      </select>

      <label class="flex items-center space-x-2 text-sm">
        <input
          type="checkbox"
          v-model="onlyWithDefects"
          @change="fetchObjects"
          class="accent-medium"
        />
        <span>Только с активными дефектами</span>
      </label>

      <button
        v-if="userRole === 'manager'"
        class="bg-medium text-light px-4 py-2 rounded hover:bg-dark transition sm:ml-auto"
        @click="openAddObjectModal"
      >
        + Добавить объект
      </button>
    </div>

    <div class="overflow-x-auto bg-white rounded shadow">
      <table class="min-w-full text-left border-collapse">
        <thead class="bg-medium text-dark">
          <tr>
            <th class="py-3 px-4 border-b border-dark">Название</th>
            <th class="py-3 px-4 border-b border-dark">Клиент</th>
            <th class="py-3 px-4 border-b border-dark">Активные дефекты</th>
            <th class="py-3 px-4 border-b border-dark">Всего дефектов</th>
          </tr>
        </thead>
        <tbody>
          <ObjectRow
            v-for="object in objects"
            :key="object.id"
            :object="object"
            @click="openObject(object)"
          />
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import ObjectRow from '../components/ObjectRow.vue'

const objects = ref([])
const clients = ref([])
const selectedClient = ref('')
const onlyWithDefects = ref(false)

const user = JSON.parse(localStorage.getItem('user'))
const userRole = user?.role || ''

async function fetchObjects() {
  try {
    const token = localStorage.getItem('token')
    const response = await axios.get('http://localhost:3030/api/objects', {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        client: selectedClient.value || '',
        activeOnly: onlyWithDefects.value || false
      }
    })
    objects.value = response.data
  } catch (err) {
    console.error('Ошибка загрузки объектов:', err)
  }
}

async function fetchClients() {
  try {
    const token = localStorage.getItem('token')
    const res = await axios.get('http://localhost:3030/api/users?role=client', {
      headers: { Authorization: `Bearer ${token}` }
    })
    clients.value = res.data
  } catch (err) {
    console.error('Ошибка загрузки клиентов:', err)
  }
}

function openAddObjectModal() {
  //добавить объект
}

function openObject(object) {
  // переход на страницу объекта
  console.log('Открыт объект:', object)
}

onMounted(() => {
  fetchClients()
  fetchObjects()
})
</script>
