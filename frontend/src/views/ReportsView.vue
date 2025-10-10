<template>
  <div class="min-h-screen bg-light text-dark p-6">
    <h1 class="text-2xl font-bold mb-4">Отчёты</h1>

    <!-- вкладки -->
    <div v-if="userRole === 'manager'" class="flex gap-4 mb-6">
      <button
        class="px-4 py-2 rounded"
        :class="activeTab === 'list' ? 'bg-medium text-light' : 'bg-white border'"
        @click="activeTab = 'list'"
      >
        Мои отчёты
      </button>
      <button
        class="px-4 py-2 rounded"
        :class="activeTab === 'create' ? 'bg-medium text-light' : 'bg-white border'"
        @click="activeTab = 'create'"
      >
        Создать отчёт
      </button>
    </div>

    <!-- отчеты -->
    <ReportsList
      v-if="activeTab === 'list'"
      :reports="reports"
      :userRole="userRole"
      @open="openReport"
      @export="exportReport"
    />

    <CreateReportModal
      v-if="activeTab === 'create' && userRole === 'manager'"
      @close="activeTab = 'list'"
      @created="handleCreate"
    />

    <!-- <ReportViewer
      v-if="selectedReport"
      :report="selectedReport"
      @close="selectedReport = null"
    /> -->
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ReportsList from '../components/ReportsList.vue'
import CreateReportModal from '../components/CreateReportModal.vue'
// import ReportViewer from '@/components/reports/ReportViewer.vue'
import axios from 'axios'

const activeTab = ref('list')
const reports = ref([])
const selectedReport = ref(null)
const userRole = ref(null)

async function fetchReports() {
  const token = localStorage.getItem('token')
  const res = await axios.get('http://localhost:3030/api/reports', {
    headers: { Authorization: `Bearer ${token}` },
  })
  reports.value = res.data
}

function openReport(report) {
  selectedReport.value = report
}

function exportReport(reportId) {
  // экспорт
}

function showGeneratedReport(reportData) {
  selectedReport.value = reportData
}

function handleCreate(){
    fetchReports()
    showGeneratedReport()
}

onMounted(async () => {
  const user = JSON.parse(localStorage.getItem('user'))
  userRole.value = user?.role
  await fetchReports()
})
</script>
