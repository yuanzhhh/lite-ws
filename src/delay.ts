const core =
  (window as any).requestIdleCallback ||
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame;

const delay = ((delayCore, defaultTimeNum) => (
  callback: FrameRequestCallback,
  timeNum?: number,
): number =>
  typeof timeNum !== 'number' && delayCore
    ? delayCore(callback)
    : setTimeout(callback, timeNum || defaultTimeNum))(core, 1000 / 60);

export default (setDelay => (timeNum?: number) =>
  new Promise(resolve => setDelay(resolve, timeNum)))(delay);
