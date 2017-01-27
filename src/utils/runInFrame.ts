const raf = typeof requestAnimationFrame === "undefined"
  ? (callback: Function) => setTimeout(callback, 17)
  : requestAnimationFrame;

export const runInFrame = (no: number, callback: Function) => {
  let cur = 0;
  let canceled = false;
  const loop = () => {
    if (canceled) {
      return;
    }
    if (cur <= no) {
      cur++;
      raf(loop);
      return;
    }
    callback();
  };
  loop();
  return () => { canceled = true; };
};

export default runInFrame;
