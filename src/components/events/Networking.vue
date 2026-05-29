<template>
  <div 
    class="event-networking"
    :class="`theme-${event.theme}`"
    :style="placementStyle"
  >
    <div class="networking-inner">
      <span class="networking-badge">{{ event.event_format }}</span>
      <div class="networking-title">{{ event.title }}</div>
      <div class="networking-description" v-if="event.description">{{ event.description }}</div>
      <div class="networking-location" v-if="event.location">{{ event.location }}</div>
      <div class="networking-time">{{ event.startFmt }} – {{ event.endFmt }}</div>
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
.event-networking {
  font-family: 'Inter', sans-serif;
  position: absolute;
  background-color: var(--theme-background);
  color: var(--theme-text);
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

.event-networking::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 50%;
  pointer-events: none;
  background-image: repeating-linear-gradient(135deg, var(--theme-side-stripe, rgba(245, 127, 23, 0.16)) 0 2px, transparent 2px 6.7px);
  background-size: 100% 100%;
  background-repeat: repeat-y;
  -webkit-mask-image: linear-gradient(to left, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 100%);
  mask-image: linear-gradient(to left, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 100%);
}

.event-networking::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 50%;
  pointer-events: none;
  background-image: repeating-linear-gradient(135deg, var(--theme-side-stripe, rgba(245, 127, 23, 0.16)) 0 2px, transparent 2px 6.7px);
  background-size: 100% 100%;
  background-repeat: repeat-y;
  -webkit-mask-image: linear-gradient(to right, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 100%);
  mask-image: linear-gradient(to right, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 100%);
}

.event-networking:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.11);
}

.networking-inner {
  padding: 8px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.networking-badge {
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
  border: none;
  background-color: var(--theme-pill-bg);
}

.networking-title {
  font-size: 15px;
  font-weight: 600;
  line-height: 1.3;
  color: var(--theme-text);
  text-align: center;
}

.networking-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  text-align: center;
}

.networking-description {
  font-size: 13px;
  color: var(--theme-text);
  opacity: 0.85;
  line-height: 1.5;
  text-align: justify;
  padding: 0 4px;
}

.networking-time {
  font-size: 14px;
  font-weight: 600;
  color: var(--theme-text);
  letter-spacing: 0.03em;
}

.networking-location {
  font-size: 14px;
  font-weight: 600;
  color: var(--theme-text);
}

.networking-links {
  border-top: 1px dashed var(--theme-border);
  margin-top: 8px;
  padding-top: 6px;
  display: flex;
  flex-direction: row;
  gap: 8px;
  justify-content: center;
}

.networking-link {
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

.networking-link:hover {
  opacity: 0.75;
  text-decoration: underline;
}
</style>
