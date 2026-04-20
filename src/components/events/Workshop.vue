<template>
  <div 
    class="event-workshop"
    :class="[`theme-${event.theme}`, { 'is-continued': event.is_continued }]"
    :style="placementStyle"
  >
    <div class="event-header">
      <span class="event-badge">
        {{ event.event_format }}
      </span>
    </div>

    <div class="event-inner">
      <div class="event-title">{{ event.title }}</div>

      <div v-if="event.is_continued" class="event-label">Continued</div>

      <template v-else>
        <div v-if="event.author" class="event-author">
          <div v-for="author in (Array.isArray(event.author) ? event.author : [event.author])" :key="author">
            {{ author }}
          </div>
        </div>

        <div class="event-bottom">
          <span class="event-time">{{ event.startFmt }} – {{ event.endFmt }}</span>
          <span v-if="event.location" class="event-room">{{ event.location }}</span>
        </div>

        <div v-if="event.description || event.website" class="event-links">
          <a v-if="event.description" :href="event.description" target="_blank" class="event-link">Description</a>
          <a v-if="event.website" :href="event.website" target="_blank" class="event-link">Website</a>
        </div>
      </template>
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
</script>

<style scoped>
.event-workshop {
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

.event-workshop:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.11);
}

.event-header {
  background: var(--theme-bg);
  color: var(--theme-color);
  padding: 8px 10px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 6px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.event-inner {
  padding: 8px 10px;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  gap: 6px;
}

.event-workshop.is-continued .event-inner {
  align-items: flex-start;
  justify-content: center;
  height: 100%;
  padding: 8px;
  text-align: left;
}

.event-badge {
  display: inline-flex;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  line-height: 1.5;
  flex-shrink: 0;
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
  height: stretch;
}

.event-time {
  font-size: 13px;
  font-weight: 600;
  color: #1e1c19;
  letter-spacing: 0.03em;
}

.event-links {
  border-top: 1px dashed #e0dbd4;
  margin-top: auto;
  padding-top: 6px;
  display: flex;
  flex-direction: row;
  gap: 8px;
}

.event-link {
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  line-height: 1.6;
  transition: opacity 0.12s;
  padding: 2px 0;
  color: #1e1c19;
}

.event-link:hover {
  opacity: 0.75;
  text-decoration: underline;
}

.event-label {
  font-size: 12px;
  color: #9b9590;
  font-style: italic;
  line-height: 1.4;
}
</style>