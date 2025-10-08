<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded shadow-lg w-full max-w-lg relative">
      <h2 class="text-xl font-bold mb-4">Создать новый дефект</h2>
      <form @submit.prevent="submitDefect" class="space-y-4">
        
        <div>
          <label class="block font-semibold mb-1">Название дефекта</label>
          <input v-model="name" type="text" class="w-full border rounded px-3 py-2" required />
        </div>

        <div>
          <label class="block font-semibold mb-1">Описание</label>
          <textarea v-model="description" class="w-full border rounded px-3 py-2" required></textarea>
        </div>

        <div>
          <label class="block font-semibold mb-1">Объект</label>
          <input
            type="text"
            v-model="objectSearch"
            placeholder="Поиск объекта..."
            class="w-full border rounded px-3 py-2 mb-1"
          />
          <ul class="max-h-60 overflow-y-auto border rounded bg-white shadow">
            <li
              v-for="obj in filteredObjects"
              :key="obj.id"
              @click="selectObject(obj)"
              class="px-3 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {{ obj.name }}
            </li>
          </ul>
          <div v-if="selectedObject" class="mt-1 text-sm text-gray-700">
            Выбран объект: {{ selectedObject.name }}
          </div>
        </div>

        <div>
            <label class="block font-semibold mb-1">Инженер (необязательно)</label>
            <div class="flex items-center gap-2">
                <input
                    type="text"
                    v-model="engineerSearch"
                    placeholder="Поиск инженера..."
                    class="w-full border rounded px-3 py-2 mb-1"
                />
                <button
                    v-if="selectedEngineer"
                    @click="selectedEngineer = null"
                    class="text-sm text-gray-500 hover:text-red-500">
                    ✕ Очистить
                </button>
            </div>
          <ul class="border rounded max-h-32 overflow-y-auto">
            <li
              v-for="eng in filteredEngineers"
              :key="eng.id"
              @click="selectEngineer(eng)"
              class="px-3 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {{ eng.name }}
            </li>
          </ul>
          <div v-if="selectedEngineer" class="mt-1 text-sm text-gray-700">
            Выбран инженер: {{ selectedEngineer.name }}
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block font-semibold mb-1">Приоритет</label>
            <select v-model="priority" class="w-full border rounded px-3 py-2">
              <option :value="1">1</option>
              <option :value="2">2</option>
              <option :value="3">3</option>
            </select>
          </div>

          <div>
            <label class="block font-semibold mb-1">Дедлайн</label>
            <input type="date" v-model="deadline" class="w-full border rounded px-3 py-2" required />
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
  objects: Array,
  engineers: Array,
})

const emit = defineEmits(['close', 'created'])

const name = ref('')
const description = ref('')
const selectedObject = ref(null)
const objectSearch = ref('')
const selectedEngineer = ref(null)
const engineerSearch = ref('')
const priority = ref(1)
const deadline = ref('')

const filteredObjects = computed(() =>
  props.objects.filter(o => o.name.toLowerCase().includes(objectSearch.value.toLowerCase()))
)

const filteredEngineers = computed(() =>
  props.engineers.filter(e => e.name.toLowerCase().includes(engineerSearch.value.toLowerCase()))
)

function selectObject(obj) {
  selectedObject.value = obj
}

function selectEngineer(eng) {
  selectedEngineer.value = eng
}

function close() {
  emit('close')
}

async function submitDefect() {
  if (!selectedObject.value) return alert('Выберите объект')

  const token = localStorage.getItem('token')
  try {
    const payload = {
      name: name.value,
      description: description.value,
      object: selectedObject.value.id,
      priority: priority.value,
      deadline: deadline.value,
      engineer: selectedEngineer.value?.id || null
    }

    await axios.post('http://localhost:3030/api/defects', payload, {
      headers: { Authorization: `Bearer ${token}` }
    })

    emit('created')
    close()
  } catch (err) {
    console.error('Ошибка создания дефекта', err)
    alert('Не удалось создать дефект')
  }
}
</script>
