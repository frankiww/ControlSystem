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

      <div class="w-full flex justify-center mt-6">
          <div class="w-full flex justify-center mt-6">
          <Pie :data="chartData" :options="chartOptions" />
          </div>
      </div>
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
import { Pie } from 'vue-chartjs'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const props = defineProps({
  report: { type: Object, required: true },
})

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('ru-RU')
}

const chartData = {
  labels: props.report.data.map(item => item.status),
  datasets: [
    {
      label: 'Количество дефектов',
      data: props.report.data.map(item => item.count),
      backgroundColor: [
        '#3b82f6',
        '#10b981',
        '#f59e0b',
        '#ef4444',
        '#8b5cf6',
        '#14b8a6',
      ],
      borderWidth: 1,
    },
  ],
}

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { position: 'bottom' },
  },
}
</script>
