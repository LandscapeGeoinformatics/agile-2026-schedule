<template>
  <header class="app-header app-header-mobile">
    <div class="header-row-1">
      <div class="header-title">
        <h1 class="header-title-text">{{ title }}</h1>
      </div>
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
  </header>
</template>


<script setup>
defineProps({
  title: String,
  days: Array,
  visibleDayIndex: Number,
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

.app-header-mobile {
  display: none;
}

.header-row-1 {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
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
  }
}
</style>