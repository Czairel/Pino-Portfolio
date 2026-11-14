// Procedural circuit-board layout for the intro loader.
// The logo is treated as a chip; traces leave its four edges, run straight,
// bend at 45 degrees (like routed PCB traces) and end in a via pad.
// Everything is computed from the viewport size, so it fits phones and wide
// screens alike. The seeded random generator keeps the layout identical on
// every visit.

function seededRandom(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const LOGO_ASPECT = 96 / 197; // height / width of Logo.webp
const fmt = (n) => Math.round(n * 10) / 10;

export function buildBoard(W, H) {
  const rand = seededRandom(2026);

  const cw = Math.round(Math.min(280, Math.max(180, W * 0.56)));
  const ch = Math.round(cw * LOGO_ASPECT);
  const cx = W / 2;
  const cy = H / 2;
  const hw = cw / 2;
  const hh = ch / 2;

  // d = direction leaving the chip, p = direction along the chip edge
  const sides = [
    { d: [-1, 0], p: [0, 1], half: hw, pins: 4, span: ch * 0.74, room: cx - hw },
    { d: [1, 0], p: [0, 1], half: hw, pins: 4, span: ch * 0.74, room: W - cx - hw },
    { d: [0, -1], p: [1, 0], half: hh, pins: 5, span: cw * 0.78, room: cy - hh },
    { d: [0, 1], p: [1, 0], half: hh, pins: 5, span: cw * 0.78, room: H - cy - hh },
  ];

  const traces = [];

  sides.forEach(({ d, p, half, pins, span, room }) => {
    for (let i = 0; i < pins; i += 1) {
      const offset = (i - (pins - 1) / 2) * (span / (pins - 1));
      const sx = cx + d[0] * half + p[0] * offset;
      const sy = cy + d[1] * half + p[1] * offset;

      // Outer pins drift further outward, so neighbouring traces never cross
      const sign = offset === 0 ? (rand() > 0.5 ? 1 : -1) : Math.sign(offset);
      const reach = (room - 14) * (0.55 + rand() * 0.43);
      const straight = 12 + rand() * 18;
      let bend = 14 + 46 * (Math.abs(offset) / (span / 2)) + rand() * 12;
      bend = Math.min(bend, Math.max(0, reach - straight - 24));
      const lateral = sign * bend;

      const x1 = sx + d[0] * straight;
      const y1 = sy + d[1] * straight;
      const x2 = x1 + d[0] * bend + p[0] * lateral;
      const y2 = y1 + d[1] * bend + p[1] * lateral;
      const run = Math.max(24, reach - straight - bend);
      const x3 = x2 + d[0] * run;
      const y3 = y2 + d[1] * run;

      traces.push({
        d: `M${fmt(sx)} ${fmt(sy)} L${fmt(x1)} ${fmt(y1)} L${fmt(x2)} ${fmt(y2)} L${fmt(x3)} ${fmt(y3)}`,
        ex: fmt(x3),
        ey: fmt(y3),
        delay: fmt(rand() * 0.25),
      });
    }
  });

  return { cw, ch, cx, cy, traces };
}
