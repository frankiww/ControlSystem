<template>
  <div class="space-y-4">
    <div v-if="loading" class="text-gray-500 text-center py-8">Загрузка отчетов...</div>

    <table v-else class="min-w-full border border-gray-200 rounded-xl overflow-hidden">
      <thead class="bg-gray-50">
        <tr class="text-left text-gray-600">
          <th class="px-4 py-2">Название</th>
          <th class="px-4 py-2">Менеджер</th>
          <th class="px-4 py-2">Клиент</th>
          <th class="px-4 py-2">Объект</th>
          <th class="px-4 py-2">Период</th>
          <th class="px-4 py-2 text-center">Действия</th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="report in reports"
          :key="report.id"
          class="border-t hover:bg-gray-50 transition"
        >
          <td class="px-4 py-2 font-medium">{{ report.name }}</td>
          <td class="px-4 py-2">{{ report.manager.name }}</td>
          <td class="px-4 py-2">
            {{ report.recipient?.name || 'Внутренний отчёт' }}
          </td>
          <td class="px-4 py-2">{{ report.objectName || '-'}}</td>
          <td v-if="report.filter?.period?.from&&report.filter?.period?.to" class="px-4 py-2 text-gray-500">
            {{ formatDate(report.filter.period.from) }} - {{ formatDate(report.filter.period.to) }}
          </td>
          <td v-else class="px-4 py-2 text-gray-500">
            За все время
          </td>
          <td class="px-4 py-2 text-center space-x-2">
            <button
              class="px-3 py-1 bg-medium text-light rounded hover:bg-dark transition"
              @click="$emit('open', report)"
            >
              Просмотр
            </button>
            <button
              class="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
              @click="$emit('export', report)"
            >
              Экспорт
            </button>
          </td>
        </tr>

        <tr v-if="!reports.length">
          <td colspan="5" class="text-center text-gray-500 py-6">
            Отчеты не найдены
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
const props = defineProps({
  reports: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
});

const emit = defineEmits(['open', 'export']);

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  return date.toLocaleDateString('ru-RU');
};
</script>

<style scoped>
table {
  border-collapse: separate;
  border-spacing: 0;
}
</style>
