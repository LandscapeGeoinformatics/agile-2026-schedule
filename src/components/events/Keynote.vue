<template>
  <div
    class="event-keynote"
    :class="`theme-${event.theme}`"
    :style="placementStyle"
  >
    <div class="keynote-inner">
      <span class="keynote-badge">{{ event.event_format }}</span>
      <div class="keynote-title">{{ event.title }}</div>
      <div class="keynote-info">
        <div class="keynote-author" v-if="event.author">
          {{ Array.isArray(event.author) ? event.author.join(', ') : event.author }}
        </div>
      </div>
      <div class="keynote-time">{{ event.startFmt }} – {{ event.endFmt }} @ {{ event.location }}</div>
      <div class="keynote-chair" v-if="event.session_chair">Chaired by {{ event.session_chair }}</div>
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
.event-keynote {
  font-family: 'Inter', sans-serif;
  position: absolute;
  background-color: var(--theme-background);
  color: var(--theme-text);
  background-image:
    radial-gradient(circle at center, var(--theme-background) 0%, transparent 80%),
    radial-gradient(circle, var(--theme-dots) 2px, transparent 2px),
    radial-gradient(circle, var(--theme-dots) 2px, transparent 2px);
  background-size: 100% 100%, 16px 32px, 16px 32px;
  background-position: center, 0 0, 8px 16px;
  border-radius: 5px;
  overflow: hidden;
  border: 1px solid var(--theme-border);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: box-shadow 0.15s;
  left: 3px;
  right: 3px;
  z-index: 25;
}

.event-keynote:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.11);
}

.keynote-inner {
  padding: 8px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  max-width: 548px;
  width: 100%;
}

.keynote-badge {
  display: inline-flex;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  line-height: 1.5;
  flex-shrink: 0;
  color: var(--theme-pill);
  padding: 6px 12px;
  border-radius: 20px;
  border: 1px solid var(--theme-pill);
  background-color: var(--theme-pill-bg);
}

.keynote-title {
  font-size: 15px;
  font-weight: 600;
  line-height: 1.3;
  color: var(--theme-text);
  text-align: center;
}

.keynote-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  text-align: center;
}

.keynote-author {
  font-size: 14px;
  font-weight: 600;
  color: var(--theme-text);
  font-style: italic;
  text-decoration: underline;
  opacity: 0.9;
}

.keynote-chair {
  font-size: 14px;
  font-weight: 600;
  color: var(--theme-text);
  opacity: 0.7;
}

.keynote-time {
  font-size: 14px;
  font-weight: 600;
  color: var(--theme-text);
  letter-spacing: 0.03em;
}
</style>
