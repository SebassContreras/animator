// Brand snapshot: builds and checks brand.lock.json and picks its fonts (011/D1, D5).
// Pure: the lock is Animator's only view of the Lienzo brand; only brandLock reads the project_inspect shape.
const HEX = /^#[0-9A-Fa-f]{6}$/;
const LOCK_KEYS = ["project", "palette", "fonts", "canvas", "guide"];
const PALETTE_ROLES = ["primary", "secondary", "accent", "background", "surface", "text"];
const FONT_ROLES = ["heading", "body", "accent", "mono"];
const CANVAS_KEYS = ["width", "height", "fps", "duration"];

// project_inspect result → lock: Lienzo's `custom` colours and manifest metadata are dropped (011/R1)
const brandLock = ({ manifest, guide }) => {
  const { custom, ...palette } = manifest.palette || {};
  return { project: manifest.project, palette, fonts: manifest.fonts, canvas: manifest.canvas, guide: guide ?? null };
};

const checkBrandLock = (lock) => {
  for (const key of Object.keys(lock)) {
    if (!LOCK_KEYS.includes(key)) throw new Error(`brand.lock.json has unknown key "${key}"`);
  }
  if (typeof lock.project !== "string" || lock.project === "") throw new Error(`brand.lock.json needs a "project" slug`);
  if (typeof lock.palette !== "object" || lock.palette === null) throw new Error(`brand.lock.json needs a "palette"`);
  for (const [role, hex] of Object.entries(lock.palette)) {
    if (!PALETTE_ROLES.includes(role)) throw new Error(`brand.lock.json palette has unknown role "${role}"`);
    // Lienzo also accepts rgb(), hsl() and CSS names; Animator needs #RRGGBB (011/R1)
    if (!HEX.test(hex)) throw new Error(`brand palette role "${role}" is ${hex}: set it as #RRGGBB in the Lienzo brand`);
  }
  if (!Array.isArray(lock.fonts)) throw new Error(`brand.lock.json needs a "fonts" list`);
  for (const font of lock.fonts) {
    if (typeof font.family !== "string" || !FONT_ROLES.includes(font.role) || !Array.isArray(font.weights)) {
      throw new Error(`brand.lock.json has a bad font: ${JSON.stringify(font)}`);
    }
  }
  for (const key of CANVAS_KEYS) {
    if (typeof lock.canvas?.[key] !== "number") throw new Error(`brand.lock.json canvas needs "${key}"`);
  }
  if (lock.guide !== null && typeof lock.guide !== "string") throw new Error(`brand.lock.json "guide" is Markdown or null`);
  return lock;
};

// System default when the brand declares no heading or body font: Inter, Lienzo's first bundled family (400–800) (011/D5)
const DEFAULT_FONTS = { heading: { family: "Inter", weight: 800 }, body: { family: "Inter", weight: 400 } };

// Heading at its heaviest declared cut, body at its lightest; a missing role takes the other's (011/D5)
const brandFonts = (lock) => {
  const pick = (role, choose) => {
    const font = lock.fonts.find((f) => f.role === role);
    return font && { family: font.family, weight: choose(...font.weights) };
  };
  const heading = pick("heading", Math.max), body = pick("body", Math.min);
  if (!heading && !body) return DEFAULT_FONTS;
  return { heading: heading || body, body: body || heading };
};

module.exports = { brandLock, checkBrandLock, brandFonts };
