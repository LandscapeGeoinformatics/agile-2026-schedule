<template>
  <div 
    class="event-opening"
    :style="placementStyle"
  >
    <div class="opening-inner">
      <!--<span class="opening-badge">{{ event.event_format }}</span>-->
      <div class="opening-title">{{ event.title }}</div>
      <div class="opening-time">{{ event.startFmt }} – {{ event.endFmt }} @ {{ event.location }}</div>
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
.event-opening {
  font-family: 'Inter', sans-serif;
  position: absolute;
  background-color: #f5f5f5;
  color: #1e1c19;
  border-radius: 5px;
  overflow: hidden;
  border: 1px solid #d3d3d3;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: box-shadow 0.15s;
  left: 3px;
  right: 3px;
  z-index: 25;
}

.event-opening:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.11);
}

.opening-inner {
  padding: 8px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.opening-title {
  font-size: 15px;
  font-weight: 600;
  line-height: 1.3;
  color: #1e1c19;
  text-align: center;
}

.opening-time {
  font-size: 14px;
  font-weight: 600;
  color: #1e1c19;
  letter-spacing: 0.03em;
}

.opening-link:hover {
  opacity: 0.75;
  text-decoration: underline;
}
</style>
