<template>
  <div
    class="type-col-header"
    :class="`theme-${theme || 'gray'}`"
  >
    {{ column.label }}
  </div>
</template>

<script setup>
defineProps({
  column: {
    type: Object,
    required: true
  },
  theme: {
    type: String,
  }
})
</script>

<style scoped>
.type-col-header {
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  border-bottom: 2px solid;
  background:          var(--theme-bg);
  color:               var(--theme-color);
  border-bottom-color: var(--theme-border);
}
</style>