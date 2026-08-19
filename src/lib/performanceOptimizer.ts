// Mobile & iPad Performance Optimizer Utility

let isPageVisible = true;

// Detect if user is on an iPad, mobile device, or touch-enabled tablet
export const isMobileOrTablet = typeof window !== 'undefined' && 
  (/iPad|iPhone|Android|Macintosh/i.test(navigator.userAgent) && ('ontouchend' in document || navigator.maxTouchPoints > 0));

if (typeof window !== 'undefined') {
  if (isMobileOrTablet) {
    console.log("Mobile/iPad optimization active: Limiting frame rates and power usage.");
  }

  // Pause heavy background processing when tab is hidden or device locked
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      isPageVisible = false;
      console.log("Page hidden: Pausing heavy background rendering.");
    } else {
      isPageVisible = true;
    }
  });
}

export function getIsPageVisible(): boolean {
  return isPageVisible;
}

/**
 * Throttled animation loop helper for canvas visualizers to cap FPS and reduce CPU/battery consumption on mobile devices.
 */
export function optimizedRenderLoop(callback: () => void, targetFPS = 30): () => void {
  let animationFrameId: number;
  const interval = 1000 / targetFPS;
  let then = performance.now();
  let running = true;

  function loop(now: number) {
    if (!running) return;
    animationFrameId = requestAnimationFrame(loop);

    if (!isPageVisible) return; // Skip rendering if tab isn't active

    const elapsed = now - then;
    if (elapsed > interval) {
      then = now - (elapsed % interval);
      callback(); // Execute drawing / state update
    }
  }

  animationFrameId = requestAnimationFrame(loop);

  // Return cancel function
  return () => {
    running = false;
    if (typeof window !== 'undefined') {
      cancelAnimationFrame(animationFrameId);
    }
  };
}
