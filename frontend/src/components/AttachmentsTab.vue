<template>
  <div class="p-4">
    <h2 class="text-xl font-semibold mb-4">Вложения</h2>

    <!-- добавление вложения -->
    <div v-if="user.role !== 'client'" class="mb-4">
      <input
        v-model="newUrl"
        type="text"
        placeholder="Вставьте ссылку на файл..."
        class="w-full border rounded p-2 focus:outline-none focus:ring"
      />
      <button
        @click="addAttachment"
        class="mt-2 px-4 py-2 bg-medium text-dark rounded hover:bg-dark hover:text-light"
      >
        Добавить
      </button>
    </div>

    <div v-if="loading">Загрузка вложений...</div>
    <div v-else-if="attachments.length === 0" class="text-gray-500">Вложений пока нет.</div>
    <ul v-else class="space-y-4">
        <li
            v-for="file in attachments"
            :key="file.id"
            class="p-3 bg-white rounded shadow border border-gray-200"
        >
            <div class="flex justify-between mb-1">
            <span class="font-semibold text-gray-800">
                {{ file.User?.name || 'Неизвестный пользователь' }}
            </span>
            <span class="text-sm text-gray-500">
                {{ formatDate(file.createdAt) }}
            </span>
            </div>

            <div class="mt-1">
            <a
                :href="file.path"
                target="_blank"
                class="text-blue-600 hover:underline break-all"
            >
                {{ file.path }}
            </a>
            </div>

            <div v-if="isImage(file.path)" class="mt-2">
            <img
                :src="file.path"
                alt="attachment"
                class="max-h-64 rounded border border-gray-200"
            />
            </div>
        </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const attachments = ref([])
const newUrl = ref('')
const loading = ref(true)
const user = ref(JSON.parse(localStorage.getItem('user') || '{}'))

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleString()
}

function isImage(url) {
  if (!url) return false;

  const extensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'];
  if (extensions.some(ext => url.toLowerCase().includes(ext))) return true;

  const imageIndicators = ['image', 'avatars'];
  if (imageIndicators.some(ind => url.toLowerCase().includes(ind))) return true;

  return false;
}

async function fetchAttachments() {
  try {
    const token = localStorage.getItem('token')
    const res = await axios.get(`http://localhost:3030/api/attachments/${route.params.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    attachments.value = res.data
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

async function addAttachment() {
  if (!newUrl.value.trim()) return
  try {
    const token = localStorage.getItem('token')
    await axios.post(
      'http://localhost:3030/api/attachments',
      { defectId: route.params.id, path: newUrl.value },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    newUrl.value = ''
    await fetchAttachments()
  } catch (err) {
    console.error('Ошибка добавления вложения', err)
  }
}

onMounted(fetchAttachments)
</script>
