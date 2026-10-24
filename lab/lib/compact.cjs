// Compact-scene primitives shared by the ringana-omega generators.
// Flat by default: Lienzo turns gradient and shadow on unless told otherwise.
const flat = (o) => ({ border: { width: 0 }, shadow: { enabled: false }, ...o, fill: { gradient: false, opacity: 1, ...(o.fill || {}) } });
const rect = (id, x, y, w, h, color, extra = {}) => flat({ id, kind: "rect", x, y, w, h, radius: 0, ...extra, fill: { color, ...(extra.fill || {}) } });
const ell = (id, x, y, w, h, color, extra = {}) => flat({ id, kind: "ellipse", x, y, w, h, ...extra, fill: { color, ...(extra.fill || {}) } });
const path = (id, x, y, w, h, d, color, extra = {}) => flat({ id, kind: "path", x, y, w, h, view: { x: 0, y: 0, w, h }, shapes: [{ d }], ...extra, fill: { color, ...(extra.fill || {}) } });
const group = (id, x, y, w, h, children, extra = {}) => ({ id, kind: "group", x, y, w, h, cw: w, ch: h, children, ...extra });

module.exports = { flat, rect, ell, path, group };
