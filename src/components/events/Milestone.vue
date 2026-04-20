<template>
  <div 
    class="event-milestone"
    :style="placementStyle"
  >
    <div class="milestone-line"></div>
    <span class="milestone-text">{{ event.title }}</span>
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
.event-milestone {
  font-family: 'Inter', sans-serif;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 0;
  left: 0px;
  right: 0px;
  z-index: 25;
}

.milestone-line {
  position: absolute;
  left: 1px;
  right: 1px;
  height: 2px;
  background-color: #666;
}

.milestone-text {
  position: relative;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  white-space: nowrap;
  padding: 2px 8px;
  background: #f0f0f0;
  border-radius: 5px;
  border: 1px solid #666;
  color: #666;
}
</style>