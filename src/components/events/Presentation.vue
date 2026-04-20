<template>
  <div 
    class="event-presentation"
    :class="`theme-${event.theme}`"
    :style="placementStyle"
  >
    <div class="event-header">
      <div class="event-badge">
        <div v-for="(part, index) in splitSessionCategory(event.session_category)" :key="index" class="event-badge-line">
          {{ part }}
        </div>
      </div>
    </div>

    <div class="event-inner">
      <div class="event-title">{{ event.title }}</div>

      <div v-if="event.author" class="event-author">
        {{ Array.isArray(event.author) ? event.author.join(', ') : event.author }}
      </div>

      <div class="event-bottom">
        <span class="event-time">{{ event.startFmt }} – {{ event.endFmt }}</span>
        <span v-if="event.location" class="event-room">{{ event.location }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  event: {
    type: Object,
    required: true
  },
  placementStyle: {
    type: Object,
    required: true
  }
})

const splitSessionCategory = (category) => {
  if (category.includes(' for ')) {
    return category.split(' for ').map((s, i, arr) => i < arr.length - 1 ? s.trim() + ' for' : s.trim())
  }
  return category.split('&').map((s, i, arr) => i < arr.length - 1 ? s.trim() + ' &' : s.trim())
}
</script>

<style scoped>
.event-presentation {
  font-family: 'Inter', sans-serif;
  position: absolute;
  background: white;
  border-radius: 5px;
  overflow: hidden;
  border: 1px solid #c8c3bb;
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.15s;
  left: 3px;
  right: 3px;
  z-index: 25;
}

.event-presentation:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.11);
}

.event-header {
  background: var(--theme-bg);
  color: var(--theme-color);
  padding: 0 10px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 6px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  height: 48px;
}

.event-inner {
  padding: 8px 10px;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  gap: 6px;
}

.event-badge {
  display: flex;
  flex-direction: column;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  line-height: 1.5;
  flex-shrink: 0;
  gap: 2px;
  justify-content: center;
}

.event-badge-line {
  display: inline-flex;
}

.event-room {
  font-size: 13px;
  font-weight: 600;
  color: #9b9590;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: right;
  flex: 1;
}

.event-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  margin-top: auto;
}

.event-title {
  font-size: 15px;
  font-weight: 600;
  line-height: 1.3;
  color: #1e1c19;
}

.event-author {
  font-size: 12px;
  color: #857f7b;
  font-style: italic;
  line-height: 1.4;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.event-time {
  font-size: 13px;
  font-weight: 600;
  color: #1e1c19;
  letter-spacing: 0.03em;
}
</style>
