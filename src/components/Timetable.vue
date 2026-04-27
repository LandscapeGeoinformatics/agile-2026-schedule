<template>
  <div class="timetable-max-width-container">

    <!-- Headers -->
    <HeaderDesktop :title="title" :days="days" :visibleDayIndex="visibleDayIndex" :TRACK_COLUMNS="TRACK_COLUMNS"
      @jumpToDay="jumpToDay" @downloadSchedule="downloadSchedulePdf" />
    <HeaderMobile :title="title" :days="days" :visibleDayIndex="visibleDayIndex" @jumpToDay="jumpToDay"
      @downloadSchedule="downloadSchedulePdf" />

    <!-- Mobile track switch floating window -->
    <MobileTrackSelector v-if="TRACK_COLUMNS" :TRACK_COLUMNS="TRACK_COLUMNS" :visibleTrackIndex="visibleTrackIndex"
      @setVisibleTrackIndex="setVisibleTrackIndex" />

    <!-- Schedule view -->
    <div class="schedule-wrapper" ref="scheduleContainerRef" @scroll="onScroll" @touchstart="handleTouchStart"
      @touchmove="handleTouchMove" @touchend="handleTouchEnd">
      <div v-for="(day, di) in days" :key="day.date" :ref="el => { if (el) daySectionRefs[di] = el }">

        <!-- Day headings -->
        <div class="day-heading">
          <span class="day-name">{{ day.dayName }}</span>
          <span class="day-date">{{ day.fullDate }}</span>
        </div>

        <!-- Grid lines -->
        <div class="grid-wrap" :style="{ height: day.totalHeight + 'px' }">

          <!-- Time side labels -->
          <div class="time-gutter">
            <div v-for="h in day.hours" :key="'tl' + di + h" class="time-label" :style="{ top: timeToYForDay(h, day.SCALE_ZONES) + 'px' }">
              {{ h % 1 === 0 ? formatHour(h) : '' }}</div>
          </div>

          <!-- Columns area -->
          <div class="cols-area">
            <div v-for="h in day.hours" :key="'gl' + di + h" class="h-gridline" :class="{ half: h % 1 !== 0 }"
              :style="{ top: timeToYForDay(h, day.SCALE_ZONES) + 'px' }"></div>
            <!--<div v-if="isToday(day.date) && nowY" class="now-line" :style="{ top: nowY + 'px' }">
              <div class="now-dot"></div>
            </div>-->

            <!-- Track-independent events -->
            <template v-for="ev in day.events.filter(e => !e.track)" :key="ev.title">
              <Break v-if="ev.event_format === 'break'" :event="ev" :placement-style="eventStyle(ev)" />
              <Keynote v-else-if="ev.event_format === 'keynote' || ev.event_format === 'announcement'" :event="ev" :placement-style="eventStyle(ev)" />
              <Assembly v-else-if="ev.event_format === 'assembly'" :event="ev" :placement-style="eventStyle(ev)" />
              <Opening v-else-if="ev.event_format === 'opening'" :event="ev" :placement-style="eventStyle(ev)" />
              <Posters v-else-if="ev.event_format === 'posters'" :event="ev" :placement-style="eventStyle(ev)" />
              <Social v-else-if="ev.event_format === 'social'" :event="ev" :placement-style="eventStyle(ev)" />
              <Milestone v-else-if="ev.event_format === 'milestone'" :event="ev" :placement-style="eventStyle(ev)" />
              <Presentation v-else-if="ev.event_format === 'presentation'" :event="ev" :placement-style="eventStyle(ev)" />
            </template>

            <!-- Track-specific events -->
            <div v-for="(tc, tcIndex) in TRACK_COLUMNS" :key="tc.key" class="type-col"
              :style="mobileColumnStyle(tcIndex)">
              <TrackHeader :column="tc" :theme="tc.theme" />
              <template v-for="ev in day.events.filter(e => e.track === tc.key)" :key="ev.title">
                <Workshop v-if="ev.event_format === 'workshop' || ev.event_format === 'tutorial'" :event="ev" :placement-style="eventStyle(ev)" />
                <Presentation v-else-if="ev.event_format === 'presentation'" :event="ev" :placement-style="eventStyle(ev)" />
                <Networking v-else-if="ev.event_format === 'networking'" :event="ev" :placement-style="eventStyle(ev)" />
                <Assembly v-else-if="ev.event_group === 'assembly'" :event="ev" :placement-style="eventStyle(ev)" />
              </template>
            </div>

          </div>
        </div>
      </div>
      <div class="schedule-padding" />
    </div>
  </div>
</template>

<script setup>
import { useTimetable } from '../composables/useTimetable'
import { useScheduleNavigation } from '../composables/useScheduleNavigation'
import { usePdfExport } from '../composables/usePdfExport'

import Break from './events/Break.vue'
import Social from './events/Social.vue'
import Keynote from './events/Keynote.vue'
import Assembly from './events/Assembly.vue'
import Opening from './events/Opening.vue'
import Posters from './events/Posters.vue'
import Workshop from './events/Workshop.vue'
import Milestone from './events/Milestone.vue'
import Networking from './events/Networking.vue'
import Presentation from './events/Presentation.vue'

import TrackHeader from './track/TrackHeader.vue'
import HeaderDesktop from './header/HeaderDesktop.vue'
import HeaderMobile from './header/HeaderMobile.vue'
import MobileTrackSelector from './header/MobileTrackSelector.vue'

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  scheduleType: {
    type: String,
    required: true,
  }
})

const {
  days,
  formatHour,
  isToday,
  eventStyle,
  TRACK_HEAD,
  TRACK_COLUMNS,
} = useTimetable(props.scheduleType)

const { generateAndDownload } = usePdfExport()

const downloadSchedulePdf = () => {
  const schedules = [
    {
      title: props.title,
      days: days.value,
      trackColumns: TRACK_COLUMNS.value
    }
  ]

  const filename = `${props.scheduleType}-schedule.pdf`
  generateAndDownload(schedules, filename)
}

// Helper to calculate Y position for a specific day's zones
const timeToYForDay = (hourValue, zones) => {
  if (zones.length === 0) return TRACK_HEAD

  let cumulativeY = TRACK_HEAD

  for (let zone of zones) {
    if (hourValue <= zone.startHour) break

    if (hourValue >= zone.endHour) {
      const zoneDurationMins = (zone.endHour - zone.startHour) * 60
      cumulativeY += zoneDurationMins * zone.pxPerMin
    } else {
      const partialHours = hourValue - zone.startHour
      cumulativeY += partialHours * 60 * zone.pxPerMin
      break
    }
  }

  return cumulativeY
}

const mobileColumnStyle = (colIndex) => {
  const offset = colIndex - visibleTrackIndex.value
  return {
    '--mobile-offset': offset,
    '--mobile-opacity': offset === 0 ? 1 : 0,
    '--mobile-z-index': offset === 0 ? 2 : 1,
    '--mobile-pointer-events': offset === 0 ? 'auto' : 'none'
  }
}

const {
  scheduleContainerRef,
  daySectionRefs,
  visibleDayIndex,
  visibleTrackIndex,
  onScroll,
  jumpToDay,
  setVisibleTrackIndex,
  handleTouchStart,
  handleTouchMove,
  handleTouchEnd,
} = useScheduleNavigation(TRACK_COLUMNS)
</script>

<style scoped>
.timetable-max-width-container {
  font-family: 'Inter', sans-serif;
  max-width: 1440px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  height: 100vh;
}

/* Export button */
.export-button-container {
  padding: 8px 12px;
  background: #f4f2ef;
  border-bottom: 1px solid #e0dbd4;
  display: flex;
  justify-content: flex-end;
}

.export-button {
  padding: 8px 16px;
  background: #2c2c2c;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 200ms ease;
  font-family: 'Inter', sans-serif;
}

.export-button:hover {
  background: #1a1a1a;
}

.export-button:active {
  transform: scale(0.98);
}

/* Schedule wrapper */
.schedule-wrapper {
  height: calc(100vh - 57px);
  overflow-y: auto;
  flex: 1;
  touch-action: pan-y;
}

.schedule-padding {
  height: 48px;
}

/* Day heading */
.day-heading {
  background: #f4f2ef;
  border-bottom: 1px solid #e0dbd4;
  border-top: 2px solid #1e1c19;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px 7px;
}

.day-name {
  font-style: italic;
  font-size: 18px;
  letter-spacing: -0.02em;
  line-height: 1;
}

.day-date {
  font-size: 10px;
  color: #9b9590;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

/* Grid */
.grid-wrap {
  display: flex;
  position: relative;
  margin-bottom: 24px;
}

.time-gutter {
  width: 48px;
  flex-shrink: 0;
  position: relative;
}

.time-label {
  position: absolute;
  right: 8px;
  font-size: 11px;
  color: #9b9590;
  letter-spacing: 0.04em;
  transform: translateY(-50%);
  white-space: nowrap;
}

.cols-area {
  flex: 1;
  display: flex;
  position: relative;
  overflow: hidden;
}

.h-gridline {
  position: absolute;
  left: 0;
  right: 0;
  border-top: 1px solid #eae6e0;
  pointer-events: none;
}

.h-gridline.half {
  border-top: 1px dashed #e5e0d8;
}

/* Type column */
.type-col {
  flex: 1;
  border-left: 1px solid #e0dbd4;
  position: relative;
}

/* Now line */
.now-line {
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  background: #e05c3a;
  z-index: 20;
  pointer-events: none;
}

.now-dot {
  position: absolute;
  left: -5px;
  top: -5px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #e05c3a;
}

@media (max-width: 768px) {
  .schedule-wrapper {
    height: calc(100vh - 57px);
  }

  .schedule-padding {
    height: 96px;
  }

  .type-col {
    position: absolute;
    inset: 0;
    border-left: none;
    transform: translateX(calc(var(--mobile-offset, 0) * 100%));
    opacity: var(--mobile-opacity, 1);
    z-index: var(--mobile-z-index, 1);
    pointer-events: var(--mobile-pointer-events, auto);
    transition: transform 220ms ease, opacity 220ms ease;
  }
}
</style>