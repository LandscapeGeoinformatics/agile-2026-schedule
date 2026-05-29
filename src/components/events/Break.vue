<template>
  <div class="event-break" :style="placementStyle">
    <div class="event-break-inner">
      <span class="event-break-title">{{ event.title }}</span>
      <span class="event-break-time">{{ event.startFmt }} – {{ event.endFmt }}</span>
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
.event-break {
  font-family: 'Inter', sans-serif;
  position: absolute;
  border-radius: 5px;
  border: 1px solid #c8c3bb;
  background: repeating-linear-gradient(
    45deg,
    #ffffff,
    #ffffff 10px,
    #f7f7f7 10px,
    #f7f7f7 20px
  );
  left: 4px;
  right: 4px;
  z-index: 25;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px 10px;
}

.event-break-inner {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 3px;
  width: 100%;
}

.event-break-title {
  font-weight: 600;
  font-size: 15px;
  color: #7a7572;
  text-align: center;
  line-height: 1.3;
}

.event-break-time {
  font-weight: 600;
  font-size: 13px;
  color: #7a7572;
  text-align: center;
  line-height: 1.3;
  letter-spacing: 0.03em;
}
</style>