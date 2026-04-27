<template>
  <div class="welcome-container font-inter">
    <div class="welcome-content">
      <div class="logo">
        <img src="/agile_logo.svg" alt="Agile Logo" />
      </div>
      <div class="conference-info">
        <h2>The 29th AGILE Conference</h2>
        <p>Tartu, Estonia, 16 - 19 June 2026</p>
      </div>
      <div class="actions">
        <div class="buttons">
          <router-link to="/workshops" class="btn btn-workshop">
            Workshops schedule
          </router-link>
          <router-link to="/main-conference" class="btn btn-conference">
            Conference schedule
          </router-link>
          <router-link to="/download-schedule" class="btn btn-download">
            Download schedule as PDF
          </router-link>
          <button
            v-if="canInstall"
            class="btn btn-install"
            @click="installApp"
          >
            Get the app for offline access
          </button>
          <p v-if="showIosInstallHint" class="install-hint">
            Get the app for offline access. On iPhone/iPad, tap "Share", "More", then "Add to Home Screen".
          </p>
        </div>
        <button
          type="button"
          class="version-pill"
          :class="{ 'version-pill--active': updateAvailable }"
          :disabled="!updateAvailable"
          @click="applyUpdate"
        >
          <span>Version {{ version }}:</span>
          <span>{{ updateStatusLabel }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const version = __APP_VERSION__
const canInstall = ref(false)
const showIosInstallHint = ref(false)
const updateAvailable = ref(false)
let deferredPrompt = null

const updateStatusLabel = computed(() =>
  updateAvailable.value ? 'Update available' : 'No updates available'
)

const handleBeforeInstallPrompt = (event) => {
  event.preventDefault()
  deferredPrompt = event
  canInstall.value = true
}

const handleAppInstalled = () => {
  deferredPrompt = null
  canInstall.value = false
}

const handleUpdateStatus = (event) => {
  updateAvailable.value = Boolean(event?.detail?.updateAvailable)
}

const installApp = async () => {
  if (!deferredPrompt) return

  deferredPrompt.prompt()
  await deferredPrompt.userChoice

  deferredPrompt = null
  canInstall.value = false
}

const applyUpdate = () => {
  if (!updateAvailable.value) return
  window.location.reload()
}

onMounted(() => {
  const ua = window.navigator.userAgent || ''
  const isIos = /iPad|iPhone|iPod/.test(ua)
  const isStandalone =
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true

  showIosInstallHint.value = isIos && !isStandalone
  updateAvailable.value = Boolean(window.__APP_UPDATE_STATUS?.updateAvailable)

  window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
  window.addEventListener('appinstalled', handleAppInstalled)
  window.addEventListener('app-update-status', handleUpdateStatus)
})

onBeforeUnmount(() => {
  window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
  window.removeEventListener('appinstalled', handleAppInstalled)
  window.removeEventListener('app-update-status', handleUpdateStatus)
})
</script>

<style scoped>
.welcome-container {
  font-family: 'Inter', sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #ffffff;
}

.welcome-content {
  text-align: center;
  max-width: 1440px;
  width: 100%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 60px;
}

.logo {
  margin-bottom: 0;
}

.logo img {
  width: 500px;
  height: auto;
}

.conference-info {
  text-align: center;
}

.conference-info h2 {
  font-size: 32px;
  color: #1e1c19;
  margin: 0 0 8px 0;
}

.conference-info p {
  font-size: 14px;
  color: #6d6763;
  margin: 0;
  letter-spacing: 0.05em;
}

.buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  max-width: 500px;
}

.actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 100%;
}

.btn {
  padding: 12px 32px;
  font-size: 16px;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid;
}

.btn-conference {
  background: #ffd333;
  color: #1e1c19;
  border-color: #ffd333;
}

.btn-conference:hover {
  background: #ebc230;
  border-color: #ebc230;
}

.btn-workshop {
  background: #0155a5;
  color: white;
  border-color: #0155a5;
}

.btn-workshop:hover {
  background: #003a75;
  border-color: #003a75;
}

.btn-install {
  background: #ffffff;
  color: #000000;
  border-color: #ffffff;
}

.btn-install:hover {
  background: #f2f2f2;
}

.btn-download {
  background: #2c2c2c;
  color: #ffffff;
  border-color: #2c2c2c;
}

.btn-download:hover {
  background: #1a1a1a;
  border-color: #1a1a1a;
}

.install-hint {
  margin: 0;
  padding: 10px 12px;
  border: 1px solid #d9d4cf;
  background: #f9f7f5;
  color: #4f4944;
  font-size: 13px;
  line-height: 1.4;
  text-align: left;
}

.version-pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid #d8d3ce;
  background: #f1efec;
  color: #6f6862;
  font-size: 12px;
  line-height: 1;
  cursor: default;
  transition: background-color 0.2s, border-color 0.2s, color 0.2s;
}

.version-pill:disabled {
  opacity: 1;
}

.version-pill--active {
  border-color: #228c49;
  background: #e7f7ee;
  color: #166534;
  cursor: pointer;
}

.version-pill--active:hover {
  background: #d5f1e2;
}
</style>