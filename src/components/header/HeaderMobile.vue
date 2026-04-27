<template>
  <header class="app-header app-header-mobile">
    <div class="header-row-1">
      <div class="header-title">
        <h1 class="header-title-text">{{ title }}</h1>
      </div>
    </div>
    <div class="header-row-2">
      <div class="day-selector" role="tablist" aria-label="Conference day selector">
        <button
          v-for="(day, i) in days"
          :key="day.date"
          class="day-pill"
          :class="{ active: visibleDayIndex === i }"
          @click="$emit('jumpToDay', i)"
        >
          {{ day.label }}
        </button>
      </div>
    </div>
    <div class="header-row-3">
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
defineProps({
  title: String,
  days: Array,
  visibleDayIndex: Number,
})

defineEmits(['jumpToDay', 'downloadSchedule'])
</script>


<style scoped>
.app-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  min-height: 55px;
  background: white;
  border-bottom: 1px solid #e0dbd4;
  position: sticky;
  top: 0;
  z-index: 60;
}

.app-header-mobile {
  display: none;
}

.header-row-1 {
  display: flex;
  align-items: center;
  min-width: 0;
}

.header-row-2 {
  display: flex;
  align-items: center;
}

.header-row-3 {
  display: flex;
  align-items: center;
}

.header-title {
  flex: 1 1 auto;
  min-width: 0;
}

.header-title-text {
  font-size: 20px;
  margin: 0;
  line-height: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.download-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 25px;
  padding: 0 10px;
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

.download-pill:hover {
  background: #1d4ed8;
  border-color: #1d4ed8;
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

.day-selector {
  user-select: none;
  display: flex;
  align-items: center;
  flex-shrink: 0;
  overflow: hidden;
  border: 1px solid #e0dbd4;
  border-radius: 999px;
  background: #f8f6f3;
}

.day-pill {
  padding: 5px 10px;
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

@media (max-width: 768px) {
  .app-header-mobile {
    display: flex;
    align-items: center;
  }

  .header-row-1 {
    order: 1;
    flex: 1 1 auto;
  }

  .header-row-2 {
    order: 2;
    flex: 0 0 auto;
  }

  .header-row-3 {
    order: 3;
    flex: 0 0 auto;
  }
}

@media (max-width: 512px) {
  .app-header-mobile {
    align-items: stretch;
  }

  .header-row-1 {
    order: 1;
    flex: 1 1 auto;
  }

  .header-row-2 {
    order: 2;
    margin-left: auto;
    flex: 0 0 auto;
  }

  .header-row-3 {
    order: 3;
    width: 100%;
    flex: 0 0 100%;
    justify-content: flex-end;
  }
}
</style>