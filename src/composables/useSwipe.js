import { ref } from 'vue'

export function useSwipe({
  threshold = 50,
  verticalThreshold = 50,
  onSwipeLeft = () => {},
  onSwipeRight = () => {}
} = {}) {
  const touchStart = ref({ x: 0, y: 0 })
  const touchEnd = ref({ x: 0, y: 0 })
  const isHorizontalSwipe = ref(false)

  const handleTouchStart = (event) => {
    const touch = event.changedTouches?.[0]
    if (!touch) {
      return
    }

    touchStart.value = { x: touch.clientX, y: touch.clientY }
    isHorizontalSwipe.value = false
  }

  const handleTouchMove = (event) => {
    const touch = event.changedTouches?.[0]
    if (!touch) {
      return
    }

    const deltaX = touch.clientX - touchStart.value.x
    const deltaY = touch.clientY - touchStart.value.y

    // If horizontal movement is greater, prevent default scrolling
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
      isHorizontalSwipe.value = true
      event.preventDefault()
    }
  }

  const handleTouchEnd = (event) => {
    const touch = event.changedTouches?.[0]
    if (!touch) {
      return
    }

    touchEnd.value = { x: touch.clientX, y: touch.clientY }

    const deltaX = touchEnd.value.x - touchStart.value.x
    const deltaY = touchEnd.value.y - touchStart.value.y

    // If vertical movement is greater than horizontal, treat as scroll
    if (Math.abs(deltaY) > Math.abs(deltaX) || Math.abs(deltaY) > verticalThreshold) {
      isHorizontalSwipe.value = false
      return
    }

    // Horizontal swipe detected
    if (Math.abs(deltaX) >= threshold && isHorizontalSwipe.value) {
      event.preventDefault()
      if (deltaX < 0) {
        onSwipeLeft()
      } else {
        onSwipeRight()
      }
    }
    
    isHorizontalSwipe.value = false
  }

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  }
}