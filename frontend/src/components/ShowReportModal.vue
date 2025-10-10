<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-2xl shadow-xl w-full max-w-3xl p-6 overflow-y-auto max-h-[90vh]">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold">{{ report.name }}</h2>
        <button
          @click="$emit('close')"
          class="text-gray-500 hover:text-gray-700 text-lg"
        >
          ✕
        </button>
      </div>

      <div class="grid grid-cols-2 gap-4 mb-6 text-sm">
        <div><strong>Менеджер:</strong> {{ report.manager.name }}</div>
        <div>
          <strong>Заказчик:</strong>
          {{ report.client?.name || 'Внутренний отчёт' }}
        </div>
        <div><strong>Объект:</strong> {{ report.objectName || 'Все объекты' }}</div>
        <div>
          <strong>Период:</strong>
          <span v-if="report.filter?.period">
            {{ formatDate(report.filter.period.from) }} –
            {{ formatDate(report.filter.period.to) }}
          </span>
          <span v-else>За всё время</span>
        </div>
      </div>

      <hr class="mb-6" />

      <h3 class="text-lg font-medium mb-3">Дефекты</h3>

      <div class="grid grid-cols-2 gap-6 items-center">
        <table class="w-full text-sm border rounded-lg overflow-hidden">
          <thead class="bg-gray-50 text-left">
            <tr>
              <th class="px-3 py-2 border-b">Статус</th>
              <th class="px-3 py-2 border-b">Количество</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in report.data"
              :key="item.status"
              class="border-b hover:bg-gray-50 transition"
            >
              <td class="px-3 py-2">{{ item.status }}</td>
              <td class="px-3 py-2">{{ item.count }}</td>
            </tr>
          </tbody>
        </table>

        <!-- <div class="w-full h-64 flex justify-center items-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                :data="chartData"
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius="80%"
                fill="#8884d8"
                label
              />
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div> -->
      </div>

      <div class="flex justify-end mt-6">
        <button
          @click="$emit('close')"
          class="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          Закрыть
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
// import { PieChart, Pie, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const props = defineProps({
  report: { type: Object, required: true },
})

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('ru-RU')
}

// const chartData = computed(() =>
//   Object.entries(props.report.data || {}).map(([status, count]) => ({
//     name: status,
//     value: count,
//   }))
// )
</script>
