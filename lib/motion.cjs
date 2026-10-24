// Motion helpers: keyframe tracks reused across videos.

// "@scale" keyframes for `beats` heartbeats from t0, one every 0.6 s: dip, peak, back to base.
const heartbeat = (t0, beats, { base = 1, dip = 1, peak = 1.15, ease = "ease-in" } = {}) => {
  const k = [[0, base]];
  for (let i = 0; i < beats; i++) {
    const t = t0 + i * 0.6;
    k.push([t, base * dip, "ease-out"], [t + 0.15, base * peak, ease], [t + 0.4, base]);
  }
  return k;
};

module.exports = { heartbeat };
