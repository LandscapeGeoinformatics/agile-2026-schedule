<template>
  <header class="app-header app-header-desktop">
    <div class="header-title">
      <h1 class="header-title-text">{{ title }}</h1>
    </div>
    <div class="day-selector">
      <button v-for="(day, i) in days" :key="day.date" class="day-pill" :class="{ active: visibleDayIndex === i }"
        @click="$emit('jumpToDay', i)">
        {{ day.label }}
      </button>
    </div>
    <!--
    <div class="track-selector">
      <span v-for="tc in currentDayTracks" :key="tc.key" class="track-pill" :class="`theme-${tc.theme}`">
        <span class="track-dot"></span>{{ tc.label }}
      </span>
    </div>
    -->
    <div class="download-selector">
      <button type="button" class="download-pill" @click="$emit('downloadSchedule')">
        <span class="download-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" focusable="false">
            <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zm0 1.5L17.5 8H14zM12 11v4.2l1.6-1.6.9.9-3.1 3.1-3.1-3.1.9-.9 1.6 1.6V11z"/>
          </svg>
        </span>
        Download as PDF
      </button>
    </div>
  </header>
</template>


<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: String,
  days: Array,
  visibleDayIndex: Number,
  TRACK_COLUMNS: Array,
})

const currentDayTracks = computed(() => {
  return props.TRACK_COLUMNS || []
})
</script>


<style scoped>
.app-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  background: white;
  border-bottom: 1px solid #e0dbd4;
  position: sticky;
  top: 0;
  z-index: 60;
}

.app-header-desktop {
  display: flex;
}

.header-title {
  flex: 0 0 auto;
}

.header-title-text {
  font-size: 20px;
  margin: 0;
}

.day-selector {
  user-select: none;
  display: flex;
  align-items: center;
  flex: 0 0 auto;
  gap: 0;
  border: 1px solid #e0dbd4;
  border-radius: 999px;
  background: #f8f6f3;
  overflow: hidden;
}

.track-selector {
  user-select: none;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-left: auto;
  justify-content: flex-end;
  flex-shrink: 0;
}

.download-selector {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: auto;
}

.download-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 25px;
  padding: 0 12px;
  border-radius: 999px;
  border: 1px solid #2563eb;
  background: #2563eb;
  color: #ffffff;
  text-decoration: none;
  font-size: 10px;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  white-space: nowrap;
  cursor: pointer;
  transition: background-color 0.15s, border-color 0.15s;
}

.download-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.download-icon svg {
  width: 12px;
  height: 12px;
  fill: currentColor;
}

.download-pill:hover {
  background: #1d4ed8;
  border-color: #1d4ed8;
}

.day-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 25px;
  padding: 0 11px;
  border-radius: 0;
  border: 0;
  border-right: 1px solid #e0dbd4;
  cursor: pointer;
  font-size: 10px;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: #9b9590;
  background: transparent;
  transition: all 0.15s;
  white-space: nowrap;
}

.day-pill:last-child {
  border-right: 0;
}

.day-pill:hover {
  color: #1e1c19;
}

.day-pill.active {
  color: white;
  background: #1e1c19;
}

.track-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 25px;
  font-size: 10px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  padding: 0 9px;
  border-radius: 20px;
  border: 1px solid;
  background: var(--theme-bg);
  color: var(--theme-color);
  border-color: var(--theme-border);
}

.track-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
  background: currentColor;
}

@media (max-width: 768px) {
  .app-header-desktop {
    display: none;
  }
}
</style>