<template>
  <div class="track-selector-host">
    <div class="track-selector">
      <button
        v-for="(track, index) in TRACK_COLUMNS"
        :key="track.key"
        type="button"
        class="track-pill"
        :class="[`theme-${track.theme}`, { active: visibleTrackIndex === index }]"
        @click="$emit('setVisibleTrackIndex', index)"
      >
        <span class="track-dot"></span>
        <span v-if="visibleTrackIndex === index" class="pill-label">{{ track.label }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  TRACK_COLUMNS: Array,
  visibleTrackIndex: Number,
})

defineEmits(['setVisibleTrackIndex'])
</script>

<style scoped>
.track-selector-host {
  display: none;
}

@media (max-width: 768px) {
  .track-selector-host {
    display: flex;
    position: fixed;
    left: 50%;
    bottom: calc(16px + env(safe-area-inset-bottom, 0px));
    transform: translateX(-50%);
    z-index: 70;
    width: max-content;
    max-width: calc(100vw - 24px);
    padding: 10px 12px;
    border: 1px solid rgba(200, 195, 187, 0.9);
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.92);
    box-shadow: 0 10px 30px rgba(30, 28, 25, 0.14);
    backdrop-filter: blur(10px);
  }
}

.track-selector {
  user-select: none;
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.track-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 10px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  padding: 3px 9px;
  border-radius: 20px;
  border: 1px solid;
  cursor: pointer;
  height: 20px;
  justify-content: center;
  color: var(--theme-color);
  border-color: var(--theme-border);
  background: transparent;
}

.track-pill:not(.active) {
  width: 20px;
  padding: 0;
  border-radius: 50%;
}

.track-pill.active {
  background: var(--theme-bg);
}

.pill-label {
  white-space: nowrap;
}

.track-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
  background: currentColor;
}
</style>