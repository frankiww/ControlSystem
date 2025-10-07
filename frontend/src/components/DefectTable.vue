<template>
  <div class="overflow-x-auto bg-white rounded shadow">
    <table class="min-w-full text-left border-collapse">
      <thead class="bg-medium text-light">
        <tr>
          <th class="py-3 px-4 border-b border-dark">Название</th>
          <th class="py-3 px-4 border-b border-dark">Статус</th>
          <th class="py-3 px-4 border-b border-dark">Исполнитель</th>
          <th class="py-3 px-4 border-b border-dark">Дедлайн</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="defect in defects"
          :key="defect.id"
          class="hover:bg-light cursor-pointer"
          @click="$emit('select-defect', defect)"
        >
          <td class="py-2 px-4 border-b border-dark">{{ defect.name }}</td>
          <td class="py-2 px-4 border-b border-dark">{{ defect.statusName }}</td>
          <td class="py-2 px-4 border-b border-dark">{{ defect.engineerName || '-' }}</td>
          <td class="py-2 px-4 border-b border-dark">{{ defect.deadline | formatDate}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  defects: {
    type: Array,
    default: () => []
  }
})
</script>

<script>
// Фильтр для форматирования даты
export default {
  filters: {
    formatDate(value) {
      if (!value) return ''
      return new Date(value).toLocaleDateString()
    }
  }
}
</script>
