<template>
  <div v-if="object">
    <div class="min-h-screen bg-light text-dark p-6">
      <h1 class="text-2xl font-bold mb-4 border-b border-dark pb-2">{{ object.name }}</h1>

      <div class="bg-white p-4 rounded shadow mb-6 flex flex-col sm:flex-row justify-between gap-4">
        <div><strong>Клиент: </strong>{{ object.clientInfo?.name }}</div>
        <div><strong>Активные дефекты: </strong>{{ object.activeDefects }}</div>
        <div><strong>Всего дефектов: </strong>{{ object.totalDefects }}</div>
      </div>

      <div v-if="defects.length > 0">
        <DefectTable :defects="defects" @select-defect="openDefect" />
      </div>
      <div v-else class="text-center text-gray-500 py-4">
        Нет дефектов для этого объекта
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter, useRoute } from 'vue-router'
import DefectTable from '../components/DefectTable.vue'

const router = useRouter()
const route = useRoute()
const object = ref(null)
const defects = ref([])
const error = ref('')

async function fetchObject() {
  try {
    const token = localStorage.getItem('token')
    const response = await axios.get(`http://localhost:3030/api/objects/${route.params.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    object.value = response.data
    await fetchDefects()
  } catch (err) {
    error.value = 'Ошибка загрузки объекта'
  }
}

async function fetchDefects() {
  try {
    const token = localStorage.getItem('token')
    const response = await axios.get('http://localhost:3030/api/defects', {
      headers: { Authorization: `Bearer ${token}` },
      params: { object: object.value.id }
    })
    defects.value = response.data
    console.log(defects.value)
  } catch (err) {
    console.error('Ошибка загрузки дефектов:', err)
  }
}

function openDefect(id) {
  router.push({ name: 'DefectInfoView', params: { id } })
}

onMounted(async () => {
  await fetchObject()
  // await fetchDefects()
})
</script>
