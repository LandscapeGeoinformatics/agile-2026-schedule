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
          <button
            v-if="canInstall"
            class="btn btn-install"
            @click="installApp"
          >
            Get the app for offline access
          </button>
        </div>
        <p class="version-line">{{ version }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

const version = __APP_VERSION__
const canInstall = ref(false)
let deferredPrompt = null

const handleBeforeInstallPrompt = (event) => {
  event.preventDefault()
  deferredPrompt = event
  canInstall.value = true
}

const handleAppInstalled = () => {
  deferredPrompt = null
  canInstall.value = false
}

const installApp = async () => {
  if (!deferredPrompt) return

  deferredPrompt.prompt()
  await deferredPrompt.userChoice

  deferredPrompt = null
  canInstall.value = false
}

onMounted(() => {
  window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
  window.addEventListener('appinstalled', handleAppInstalled)
})

onBeforeUnmount(() => {
  window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
  window.removeEventListener('appinstalled', handleAppInstalled)
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

.version-line {
  font-size: 12px;
  color: #999;
  margin: 0;
}
</style>