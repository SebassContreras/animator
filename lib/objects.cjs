// Recurring objects proven in a video. Colours always come from the caller.
const { path } = require("./primitives.cjs");

// heart outline drawn in a 140x140 box
const HEART_SIZE = 140;
const HEART_D = "M70 126 L10 62 A32 32 0 0 1 70 18 A32 32 0 0 1 130 62 Z";
const heart = (id, x, y, color, extra = {}) => path(id, x, y, HEART_SIZE, HEART_SIZE, HEART_D, color, extra);

module.exports = { heart };
