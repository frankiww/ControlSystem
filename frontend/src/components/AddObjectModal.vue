<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded shadow-lg w-full max-w-lg relative">
      <h2 class="text-xl font-bold mb-4">Создать новый объект</h2>
      <form @submit.prevent="submitObject" class="space-y-4">
        
        <div>
          <label class="block font-semibold mb-1">Название объекта</label>
          <input v-model="name" type="text" class="w-full border rounded px-3 py-2" required />
        </div>

        <div>
          <label class="block font-semibold mb-1">Клиент</label>
          <input
            type="text"
            v-model="clientSearch"
            placeholder="Поиск клиента..."
            class="w-full border rounded px-3 py-2 mb-1"
          />
          <ul class="max-h-60 overflow-y-auto border rounded bg-white shadow">
            <li
              v-for="client in filteredClients"
              :key="client.id"
              @click="selectClient(client)"
              class="px-3 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {{ client.name }}
            </li>
          </ul>
          <div v-if="selectedClient" class="mt-1 text-sm text-gray-700">
            Выбран объект: {{ selectedClient.name }}
          </div>
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
  clients: Array,
})

const emit = defineEmits(['close', 'created'])

const name = ref('')
const selectedClient = ref(null)
const clientSearch = ref('')

const filteredClients = computed(() =>
  props.clients.filter(c => c.name.toLowerCase().includes(clientSearch.value.toLowerCase()))
)

function selectClient(client) {
  selectedClient.value = client
}

function close() {
  emit('close')
}

async function submitObject() {
  if (!selectedClient.value) return alert('Выберите клиента')

  const token = localStorage.getItem('token')
  try {
    const payload = {
      name: name.value,
      client: selectedClient.value.id,
    }

    await axios.post('http://localhost:3030/api/objects', payload, {
      headers: { Authorization: `Bearer ${token}` }
    })

    emit('created')
    close()
  } catch (err) {
    console.error('Ошибка создания объекта', err)
    alert('Не удалось создать объект')
  }
}
</script>
