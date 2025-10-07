<template>
  <div class="min-h-screen bg-light text-dark p-6">
    <h1 class="text-2xl font-bold mb-6 border-b border-dark pb-2">
      Дефекты
    </h1>

    <!-- фильтры -->
    <div class="flex flex-col sm:flex-row gap-4 mb-6 items-center">
      <select
        v-model="selectedStatus"
        @change="fetchDefects"
        class="border border-dark rounded px-3 py-2 w-full sm:w-1/3 focus:outline-none focus:ring-2 focus:ring-medium"
      >
        <option value="">Все статусы</option>
        <option
          v-for="status in statuses"
          :key="status.id"
          :value="status.id"
        >
          {{ status.name }}
        </option>
      </select>

      <button
        v-if="userRole === 'manager'"
        class="bg-medium text-light px-4 py-2 rounded hover:bg-dark transition sm:ml-auto"
        @click="openAddDefectModal"
      >
        + Добавить дефект
      </button>
    </div>

    <DefectTable :defects="defects" @select-defect="openDefect" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import DefectTable from '../components/DefectTable.vue'
const router = useRouter()

const defects = ref([])
const statuses = ref([])
const selectedStatus = ref('')

const user = JSON.parse(localStorage.getItem('user'))
const userRole = user?.role || ''

async function fetchDefects() {
  try {
    const token = localStorage.getItem('token')
    const response = await axios.get('http://localhost:3030/api/defects', {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        status: selectedStatus.value || '',
      }
    })
    defects.value = response.data
  } catch (err) {
    console.error('Ошибка загрузки дефектов:', err)
  }
}

async function fetchStatuses() {
  try {
    const token = localStorage.getItem('token')
    const res = await axios.get('http://localhost:3030/api/statuses', {
      headers: { Authorization: `Bearer ${token}` }
    })
    statuses.value = res.data
  } catch (err) {
    console.error('Ошибка загрузки клиентов:', err)
  }
}

function openDefect(id) {
  router.push({ name: 'DefectInfoView', params: { id } })
}

function openAddDefectModal() {
  //добавить дефект
}

onMounted(() => {
  fetchDefects()
  fetchStatuses()
})
</script>
