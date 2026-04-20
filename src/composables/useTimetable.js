import { computed } from 'vue'
import { timetablesConfig } from '../config/timetablesConfig'
import { eventsConfig } from '../config/eventsConfig'

export function useTimetable(scheduleType) {
  // Config parameters
  const config = timetablesConfig[scheduleType]
  const events = eventsConfig[scheduleType]

  const TRACK_HEAD = config.TRACK_HEAD
  const configDays = config.days || []

  // Computed properties

  // Helper functions
  const parseMin = (s) => {
    const date = new Date(s)
    return date.getHours() * 60 + date.getMinutes()
  }

  const fmtTime = (m) => {
    const hours = String(Math.floor(m / 60)).padStart(2, '0')
    const minutes = String(m % 60).padStart(2, '0')
    return `${hours}:${minutes}`
  }

  const formatHour = (h) => `${String(Math.floor(h)).padStart(2, '0')}:00`

  const isToday = (date) => date === new Date().toISOString().slice(0, 10)

  // Convert time string "HH:MM" or number to decimal hours
  const timeStringToHours = (time) => {
    if (typeof time === 'number') return time
    if (typeof time !== 'string') return 0
    const [hours, minutes] = time.split(':').map(Number)
    return hours + minutes / 60
  }

  // Calculate Y position within a day based on its zones
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

  // Calculate event height within a day based on its zones
  const getEventHeightForDay = (startMin, endMin, zones) => {
    if (zones.length === 0) return (endMin - startMin) * 2 - 4

    const startHour = startMin / 60
    const endHour = endMin / 60
    let height = 0

    for (let zone of zones) {
      if (zone.endHour <= startHour) continue
      if (zone.startHour >= endHour) break

      const zoneStart = Math.max(zone.startHour, startHour)
      const zoneEnd = Math.min(zone.endHour, endHour)
      const overlapMins = (zoneEnd - zoneStart) * 60

      height += overlapMins * zone.pxPerMin
    }

    return height - 4
  }

  // Calculate total height for a day
  const calculateTotalHeight = (zones) => {
    if (zones.length === 0) return TRACK_HEAD

    let total = TRACK_HEAD
    for (let zone of zones) {
      const zoneDurationMins = (zone.endHour - zone.startHour) * 60
      total += zoneDurationMins * zone.pxPerMin
    }
    return total
  }

  // Main days processor
  const days = computed(() => {
    // Create a map of events by date
    const eventsByDate = {}
    events.forEach((ev) => {
      const d = ev.time_start.slice(0, 10)
      if (!eventsByDate[d]) {
        eventsByDate[d] = []
      }
      eventsByDate[d].push(ev)
    })

    // Build days from config
    return configDays.map((dayConfig) => {
      const date = dayConfig.date
      const dayEvents = eventsByDate[date] || []

      // Normalize SCALE_ZONES (convert time strings to numbers)
      const normalizedZones = dayConfig.SCALE_ZONES.map(zone => ({
        startHour: timeStringToHours(zone.startHour),
        endHour: timeStringToHours(zone.endHour),
        pxPerMin: zone.pxPerMin
      }))

      // Parse date for day name
      const [year, month, day] = date.split('-').map(Number)
      const d = new Date(year, month - 1, day)

      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

      const dayName = dayNames[d.getDay()]
      const monthName = monthNames[d.getMonth()]

      // Process events with pre-calculated positions
      const processedEvents = dayEvents.map((ev) => ({
        ...ev,
        startMin: parseMin(ev.time_start),
        endMin: parseMin(ev.time_end),
        startFmt: fmtTime(parseMin(ev.time_start)),
        endFmt: fmtTime(parseMin(ev.time_end)),
        top: timeToYForDay(parseMin(ev.time_start) / 60, normalizedZones),
        height: getEventHeightForDay(parseMin(ev.time_start), parseMin(ev.time_end), normalizedZones)
      }))

      return {
        date,
        dayName,
        label: `${dayName.slice(0, 3)} ${d.getDate()}`,
        fullDate: `${monthName} ${d.getDate()}, ${d.getFullYear()}`,
        events: processedEvents.sort((a, b) => a.startMin - b.startMin),
        SCALE_ZONES: normalizedZones,
        totalHeight: calculateTotalHeight(normalizedZones),
        hours: (() => {
          const a = []
          const zones = normalizedZones
          if (zones.length === 0) return a
          const minHour = Math.min(...zones.map(z => z.startHour))
          const maxHour = Math.max(...zones.map(z => z.endHour))
          for (let i = minHour; i <= maxHour; i += 0.5) {
            a.push(i)
          }
          return a
        })()
      }
    })
  })

  // Fallback for hours and TRACK_COLUMNS (for backward compatibility)
  const hours = computed(() => {
    if (days.value.length === 0) return []
    return days.value[0].hours || []
  })

  const TRACK_COLUMNS = computed(() => {
    return config.TRACK_COLUMNS || []
  })

  // Helper to get timeToY for current viewport (uses first day's zones)
  const timeToY = (h) => {
    if (days.value.length === 0) return TRACK_HEAD
    return timeToYForDay(h, days.value[0].SCALE_ZONES)
  }

  // Event styling (uses pre-calculated values)
  const eventStyle = (ev) => {
    return {
      top: ev.top + 'px',
      height: ev.height + 'px'
    }
  }

  const breakStyle = (ev) => eventStyle(ev)
  const socialStyle = (ev) => eventStyle(ev)

  return {
    // Computed
    days,
    hours,
    TRACK_COLUMNS,
    TRACK_HEAD,
    // Methods
    timeToY,
    formatHour,
    isToday,
    eventStyle,
    breakStyle,
    socialStyle,
  }
}