<template>
  <div class="download-schedule">
    <p>Preparing your PDF download...</p>
    <router-link to="/" class="back-link">Back to welcome</router-link>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTimetable } from '../composables/useTimetable'
import { usePdfExport } from '../composables/usePdfExport'

const router = useRouter()
const workshopsSchedule = useTimetable('workshops')
const mainConferenceSchedule = useTimetable('main')
const { generateAndDownload } = usePdfExport()

onMounted(() => {
  const schedules = [
    {
      title: 'Workshops',
      days: workshopsSchedule.days.value,
      trackColumns: workshopsSchedule.TRACK_COLUMNS.value
    },
    {
      title: 'Main Conference',
      days: mainConferenceSchedule.days.value,
      trackColumns: mainConferenceSchedule.TRACK_COLUMNS.value
    }
  ]

  generateAndDownload(schedules, 'agile-2026-schedule.pdf')
  router.replace('/')
})
</script>

<style scoped>
.download-schedule {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 16px;
  text-align: center;
}

.back-link {
  color: #0155a5;
  text-decoration: underline;
}
</style>
