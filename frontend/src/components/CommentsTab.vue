<template>
  <div class="p-4">
    <h2 class="text-xl font-semibold mb-4">Комментарии</h2>

    <!-- добавление комментария -->
    <div v-if="user.role !== 'client'" class="mb-6">
      <textarea
        v-model="newComment"
        placeholder="Напишите комментарий..."
        class="w-full border rounded p-2 resize-none focus:outline-none focus:ring"
        rows="3"
      ></textarea>
      <button
        @click="submitComment"
        :disabled="loading"
        class="mt-2 px-4 py-2 bg-medium text-dark rounded hover:bg-dark hover:text-light disabled:opacity-50"
      >
        Отправить
      </button>
    </div>

    <!-- комменты -->
    <div v-if="loading">Загрузка комментариев...</div>
    <div v-else-if="error" class="text-red-500">{{ error }}</div>
    <div v-else-if="comments.length === 0" class="text-gray-500">Комментариев пока нет.</div>
    <ul v-else class="space-y-4">
      <li
        v-for="comment in comments"
        :key="comment.id"
        class="p-3 bg-white rounded shadow border border-gray-200"
      >
        <div class="flex justify-between mb-1">
          <span class="font-semibold text-gray-800">{{ comment.User?.name || 'Неизвестный' }}</span>
          <span class="text-sm text-gray-500">{{ formatDate(comment.createdAt) }}</span>
        </div>
        <p class="text-gray-700 whitespace-pre-wrap">{{ comment.text }}</p>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const comments = ref([])
const newComment = ref('')
const loading = ref(true)
const error = ref('')
const user = ref({})

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleString()
}

async function fetchComments() {
  try {
    const token = localStorage.getItem('token')
    const res = await axios.get(`http://localhost:3030/api/comments/${route.params.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    comments.value = res.data
  } catch (err) {
    console.error(err)
    error.value = 'Не удалось загрузить комментарии'
  } finally {
    loading.value = false
  }
}

async function submitComment() {
  if (!newComment.value.trim()) return

  try {
    loading.value = true
    const token = localStorage.getItem('token')
    await axios.post(
      'http://localhost:3030/api/comments',
      { defectId: route.params.id, text: newComment.value },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    newComment.value = ''
    await fetchComments()
  } catch (err) {
    console.error(err)
    error.value = 'Не удалось добавить комментарий'
  } finally {
    loading.value = false
  }
}

async function getUser(){
  const savedUser = localStorage.getItem('user')
  if (savedUser) user.value = JSON.parse(savedUser)
}

onMounted(() => {
    fetchComments()
    getUser()
})
</script>
