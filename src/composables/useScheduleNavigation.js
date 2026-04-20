import { ref, computed } from 'vue'
import { useSwipe } from './useSwipe'

export function useScheduleNavigation(trackColumns) {
  const scheduleContainerRef = ref(null)
  const daySectionRefs = ref([])
  const visibleDayIndex = ref(0)
  const visibleTrackIndex = ref(0)

  const trackCount = computed(() => trackColumns?.value?.length || 1)

  const onScroll = () => {
    const scrollTop = scheduleContainerRef.value?.scrollTop || 0
    let visibleDay = 0

    daySectionRefs.value.forEach((el, i) => {
      if (el?.offsetTop - 120 <= scrollTop) {
        visibleDay = i
      }
    })

    visibleDayIndex.value = visibleDay
  }

  const jumpToDay = (index) => {
    const offsetTop = daySectionRefs.value[index]?.offsetTop
    if (offsetTop) {
      scheduleContainerRef.value?.scrollTo({
        top: offsetTop - 120,
        behavior: 'smooth'
      })
    }
  }

  const setVisibleTrackIndex = (index) => {
    visibleTrackIndex.value = index
  }

  const { handleTouchStart, handleTouchMove, handleTouchEnd } = useSwipe({
    onSwipeLeft: () => {
      if (visibleTrackIndex.value < trackCount.value - 1) {
        visibleTrackIndex.value++
      }
    },
    onSwipeRight: () => {
      if (visibleTrackIndex.value > 0) {
        visibleTrackIndex.value--
      }
    }
  })

  return {
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
  }
}