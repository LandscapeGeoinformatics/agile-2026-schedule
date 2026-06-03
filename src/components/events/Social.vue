<template>
  <div
    class="event-social"
    :class="[`theme-${event.theme}`]"
    :style="placementStyle"
  >
    <div class="social-inner">
      <span class="social-badge">{{ event.event_format }}</span>
      <div class="social-title">{{ event.title }}</div>
      <!--<div class="social-info">
        <div class="social-location" v-if="event.location">{{ event.location }}</div>
        <div class="social-time">{{ event.startFmt }} – {{ event.endFmt }}</div>
      </div>-->
      <div class="social-time">{{ event.startFmt }} – {{ event.endFmt }} @ {{ event.location }}</div>

      <div v-if="event.directions || event.venue_webpage" class="social-links">
        <a v-if="event.webpage" :href="event.webpage" target="_blank" class="social-link">Venue</a>
        <a v-if="event.directions" :href="event.directions" target="_blank" class="social-link">Get directions</a>
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
</script>

<style scoped>
.event-social {
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

.event-social:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.11);
}

.social-inner {
  padding: 8px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.social-badge {
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

.social-title {
  font-size: 15px;
  font-weight: 600;
  line-height: 1.3;
  color: var(--theme-text);
  text-align: center;
}

.social-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  text-align: center;
}

.social-time {
  font-size: 14px;
  font-weight: 600;
  color: var(--theme-text);
  letter-spacing: 0.03em;
  text-align: center;
}

.social-location {
  font-size: 14px;
  font-weight: 600;
  color: var(--theme-text);
}

.social-links {
  border-top: 1px dashed var(--theme-border);
  margin-top: 8px;
  padding-top: 6px;
  display: flex;
  flex-direction: row;
  gap: 16px;
  padding-left: 16px;
  padding-right: 16px;
  justify-content: center;
}

.social-link {
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  line-height: 1.6;
  transition: opacity 0.12s;
  padding: 2px 0;
  color: var(--theme-text);
}

.social-link:hover {
  opacity: 0.75;
  text-decoration: underline;
}
</style>
