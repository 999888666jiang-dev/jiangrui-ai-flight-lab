import { onMounted, onUnmounted, type Ref } from 'vue';

export type SwipeDirection = 'left' | 'right' | 'up' | 'down';

export type TouchGestureHandlers = {
  onSwipe?: (direction: SwipeDirection, distance: number) => void;
  onTap?: () => void;
};

export function useTouchGesture(target: Ref<HTMLElement | undefined>, handlers: TouchGestureHandlers, threshold = 44) {
  let startX = 0;
  let startY = 0;
  let startTime = 0;

  function handleTouchStart(event: TouchEvent) {
    const touch = event.touches[0];
    if (!touch) return;
    startX = touch.clientX;
    startY = touch.clientY;
    startTime = performance.now();
  }

  function handleTouchEnd(event: TouchEvent) {
    const touch = event.changedTouches[0];
    if (!touch) return;

    const dx = touch.clientX - startX;
    const dy = touch.clientY - startY;
    const distanceX = Math.abs(dx);
    const distanceY = Math.abs(dy);
    const elapsed = performance.now() - startTime;

    if (distanceX < 12 && distanceY < 12 && elapsed < 280) {
      handlers.onTap?.();
      return;
    }

    if (Math.max(distanceX, distanceY) < threshold) return;

    if (distanceX > distanceY) {
      handlers.onSwipe?.(dx > 0 ? 'right' : 'left', distanceX);
    } else {
      handlers.onSwipe?.(dy > 0 ? 'down' : 'up', distanceY);
    }
  }

  onMounted(() => {
    const element = target.value;
    if (!element) return;
    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });
  });

  onUnmounted(() => {
    const element = target.value;
    element?.removeEventListener('touchstart', handleTouchStart);
    element?.removeEventListener('touchend', handleTouchEnd);
  });
}
