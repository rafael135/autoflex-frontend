import '@testing-library/jest-dom'

// jsdom does not implement window.matchMedia — required by antd responsive components
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
})

// jsdom does not implement ResizeObserver — required by antd Table / rc-resize-observer
// The callback must be invoked with fake dimensions so antd Table renders its rows.
global.ResizeObserver = class ResizeObserver {
  private cb: ResizeObserverCallback
  constructor(cb: ResizeObserverCallback) {
    this.cb = cb
  }
  observe(target: Element) {
    // Immediately report a non-zero bounding box so antd Table renders rows
    this.cb(
      [{ target, contentRect: { width: 800, height: 600 } } as unknown as ResizeObserverEntry],
      this as unknown as ResizeObserver,
    )
  }
  unobserve() {}
  disconnect() {}
}
