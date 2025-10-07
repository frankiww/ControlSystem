<template>
  <div class="overflow-x-auto bg-white rounded shadow">
    <table class="min-w-full text-left border-collapse">
      <thead class="bg-medium text-dark">
        <tr>
          <th class="py-3 px-4 border-b border-dark">Название</th>
          <th class="py-3 px-4 border-b border-dark">Статус</th>
          <th class="py-3 px-4 border-b border-dark">Исполнитель</th>
          <th class="py-3 px-4 border-b border-dark">Объект</th>
          <th class="py-3 px-4 border-b border-dark">Дедлайн</th>
          <th class="py-3 px-4 border-b border-dark">Приоритет</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="defect in defects"
          :key="defect.id"
          class="hover:bg-light cursor-pointer"
          @click="$emit('select-defect', defect.id)"
        >
          <td class="py-2 px-4 border-b border-dark">{{ defect.name }}</td>
          <td class="py-2 px-4 border-b border-dark">{{ defect.statusName }}</td>
          <td class="py-2 px-4 border-b border-dark">{{ defect.engineerName || '-' }}</td>
          <td class="py-2 px-4 border-b border-dark">{{ defect.objectName || '-' }}</td>
          <td class="py-2 px-4 border-b border-dark">{{ formatDate(defect.deadline)}}</td>
          <td class="py-2 px-4 border-b border-dark">{{ defect.priority }}</td>
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

const formatDate = (val) => {
  if (!val) return ''
  const d = new Date(val)
  return d.toLocaleDateString()
}

function openDefect(id) {
  router.push({ name: 'DefectInfoView', params: { id: id } })
}

</script>
