import React, { useMemo } from 'react';

// ─────────────────────────────────────────────────────────────
// VIEWPORT & LAYOUT
// ─────────────────────────────────────────────────────────────
const VP_WIDTH  = 400;
const VP_HEIGHT = 340;

const PANEL_LEFT         = 52;
const PANEL_RIGHT_MARGIN = 70;
const PANEL_WIDTH        = VP_WIDTH - PANEL_LEFT - PANEL_RIGHT_MARGIN;

const CUP_CENTER_Y_SVG   = VP_HEIGHT / 2;
const SCALE              = 2.8;

// ─────────────────────────────────────────────────────────────
// COLOUR PALETTE
// ─────────────────────────────────────────────────────────────
const C = {
  blue:         '#00b4d8',
  blueDim:      'rgba(0,180,216,0.50)',
  blueFaint:    'rgba(0,180,216,0.07)',
  orange:       '#f97316',
  orangeDim:    'rgba(249,115,22,0.50)',
  orangeFaint:  'rgba(249,115,22,0.07)',
  green:        '#22d3ee',
  greenDim:     'rgba(34,211,238,0.55)',
  warn:         '#fbbf24',
  danger:       '#f43f5e',
  muted:        'rgba(107,122,153,0.85)',
  mutedFaint:   'rgba(107,122,153,0.20)',
  panelFill:    'rgba(15,21,32,0.90)',
  bg:           '#0a0e14',
  grid:         'rgba(0,180,216,0.040)',
};

// ─────────────────────────────────────────────────────────────
// UTILITY COMPONENTS
// ─────────────────────────────────────────────────────────────
function CadText({
  x, y, children,
  anchor   = 'middle',
  baseline = 'auto',
  size     = 7.5,
  fill     = C.muted,
  bold     = false,
  opacity  = 1,
}) {
  return (
    <text
      x={x} y={y}
      textAnchor={anchor}
      dominantBaseline={baseline}
      fontSize={size}
      fontFamily="JetBrains Mono, Fira Code, Consolas, monospace"
      fontWeight={bold ? '600' : '400'}
      fill={fill}
      opacity={opacity}
    >
      {children}
    </text>
  );
}

function ArrowDim({ x1, y1, x2, y2, orient, color = C.muted }) {
  const AH = 4.5;
  let p1, p2;
  if (orient === 'h') {
    p1 = `M${x1+AH},${y1-AH} L${x1},${y1} L${x1+AH},${y1+AH}`;
    p2 = `M${x2-AH},${y2-AH} L${x2},${y2} L${x2-AH},${y2+AH}`;
  } else {
    p1 = `M${x1-AH},${y1+AH} L${x1},${y1} L${x1+AH},${y1+AH}`;
    p2 = `M${x2-AH},${y2-AH} L${x2},${y2} L${x2+AH},${y2-AH}`;
  }
  return (
    <g>
      <line
        x1={x1} y1={y1} x2={x2} y2={y2}
        stroke={color} strokeWidth="0.75"
        strokeDasharray="4 3" opacity="0.80"
      />
      <path d={p1} stroke={color} strokeWidth="1.0" fill="none" opacity="0.90" />
      <path d={p2} stroke={color} strokeWidth="1.0" fill="none" opacity="0.90" />
    </g>
  );
}

function Tick({ x, y, orient, color = C.muted, len = 5 }) {
  const [dx, dy] = orient === 'h' ? [0, len] : [len, 0];
  return (
    <line
      x1={x-dx} y1={y-dy} x2={x+dx} y2={y+dy}
      stroke={color} strokeWidth="0.85" opacity="0.75"
    />
  );
}

function CupHole({ cx, cy, radius, severity }) {
  const ringColor =
    severity === 'critical' ? C.danger :
    severity === 'warn'     ? C.warn   : C.blue;
  return (
    <g>
      <circle cx={cx} cy={cy} r={radius + 7}
        fill="none" stroke={ringColor}
        strokeWidth="0.5" opacity="0.15"
        className="cad-pulse"
      />
      <circle cx={cx} cy={cy} r={radius + 3}
        fill="none" stroke={ringColor}
        strokeWidth="0.4" opacity="0.20"
      />
      <circle cx={cx} cy={cy} r={radius}
        fill={C.blueFaint}
        stroke={ringColor} strokeWidth="1.4"
        filter="url(#glowBlue)"
      />
      <line
        x1={cx - radius - 12} y1={cy}
        x2={cx + radius + 12} y2={cy}
        stroke={ringColor} strokeWidth="0.6"
        strokeDasharray="2.5 2.5" opacity="0.50"
      />
      <line
        x1={cx} y1={cy - radius - 12}
        x2={cx} y2={cy + radius + 12}
        stroke={ringColor} strokeWidth="0.6"
        strokeDasharray="2.5 2.5" opacity="0.50"
      />
      <circle cx={cx} cy={cy} r="2.0" fill={ringColor} opacity="0.95" />
    </g>
  );
}

function ScrewHole({ cx, cy }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={9}
        fill={C.orangeFaint}
        stroke={C.orange} strokeWidth="1.0"
        filter="url(#glowOrange)"
      />
      <circle cx={cx} cy={cy} r={3.5}
        fill="none"
        stroke={C.orange} strokeWidth="0.75" opacity="0.70"
      />
      <circle cx={cx} cy={cy} r="1.6" fill={C.orange} opacity="0.95" />
      <line
        x1={cx-2.2} y1={cy-2.2}
        x2={cx+2.2} y2={cy+2.2}
        stroke={C.orange} strokeWidth="1.0" opacity="0.75"
      />
    </g>
  );
}

function LeaderLabel({ fromX, fromY, toX, toY, label, sublabel, color = C.blue }) {
  const boxW = sublabel ? 48 : 40;
  const boxH = sublabel ? 20 : 13;
  const boxX = toX - 2;
  const boxY = toY - boxH / 2;
  return (
    <g>
      <circle cx={fromX} cy={fromY} r="1.6" fill={color} opacity="0.75" />
      <line
        x1={fromX} y1={fromY} x2={toX - 2} y2={toY}
        stroke={color} strokeWidth="0.75" opacity="0.75"
      />
      <rect
        x={boxX} y={boxY} width={boxW} height={boxH}
        rx="2"
        fill="rgba(10,14,20,0.85)"
        stroke={color} strokeWidth="0.5" opacity="0.6"
      />
      <CadText
        x={boxX + boxW/2}
        y={sublabel ? boxY + 7 : boxY + boxH/2 + 1}
        size={7.5} fill={color} bold
      >
        {label}
      </CadText>
      {sublabel && (
        <CadText x={boxX + boxW/2} y={boxY + 15} size={6} fill={color} opacity={0.7}>
          {sublabel}
        </CadText>
      )}
    </g>
  );
}

function ScaleBar({ x, y, scale }) {
  const barPx = 10 * scale;
  return (
    <g>
      <line x1={x} y1={y} x2={x + barPx} y2={y}
        stroke={C.blueDim} strokeWidth="1.2" opacity="0.65" />
      <line x1={x}       y1={y-3} x2={x}       y2={y+3}
        stroke={C.blueDim} strokeWidth="0.9" opacity="0.65" />
      <line x1={x+barPx} y1={y-3} x2={x+barPx} y2={y+3}
        stroke={C.blueDim} strokeWidth="0.9" opacity="0.65" />
      <CadText x={x + barPx/2} y={y - 6} size={6.5} fill={C.blueDim} opacity={0.75}>
        10mm
      </CadText>
    </g>
  );
}

function LegendItem({ color, label, dashed = false }) {
  return (
    <span
      className="flex items-center gap-1.5 text-[10px] font-mono opacity-70"
      style={{ color }}
    >
      <span
        className="inline-block w-4"
        style={{
          height: '1px',
          background: dashed ? 'none' : color,
          borderTop: dashed ? `1px dashed ${color}` : 'none',
        }}
      />
      {label}
    </span>
  );
}

function BreakLine({ y, panelLeft, panelRight }) {
  const width = panelRight - panelLeft;
  const amp   = 4;
  const segs  = 12;
  const segW  = width / segs;
  let d = `M ${panelLeft} ${y}`;
  for (let i = 0; i < segs; i++) {
    const x    = panelLeft + i * segW + segW / 2;
    const sign = i % 2 === 0 ? -1 : 1;
    d += ` L ${x} ${y + sign * amp}`;
  }
  d += ` L ${panelRight} ${y}`;
  return (
    <g opacity="0.55">
      <path d={d} fill="none"
        stroke="rgba(0,180,216,0.50)" strokeWidth="1.0" strokeLinejoin="round" />
      <CadText x={panelLeft - 4} y={y} anchor="end" baseline="middle" size={5.5}
        fill="rgba(0,180,216,0.35)">
        ~ ~ ~
      </CadText>
    </g>
  );
}

function ThicknessCallout({ x, y, thickness }) {
  const w = Math.max(12, thickness * 0.85);
  const h = 38;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h}
        fill="url(#woodHatch)"
        stroke={C.blueDim} strokeWidth="0.7" opacity="0.85"
      />
      <line x1={x-4} y1={y}   x2={x}   y2={y}   stroke={C.blueDim} strokeWidth="0.6" />
      <line x1={x-4} y1={y+h} x2={x}   y2={y+h} stroke={C.blueDim} strokeWidth="0.6" />
      <line x1={x-4} y1={y}   x2={x-4} y2={y+h} stroke={C.blueDim} strokeWidth="0.6" />
      <CadText x={x + w/2} y={y + h + 9}  size={7}   fill={C.blue} bold>
        {thickness}mm
      </CadText>
      <CadText x={x + w/2} y={y + h + 17} size={5.5} fill={C.blueDim}>
        thickness
      </CadText>
    </g>
  );
}

// ─────────────────────────────────────────────────────────────
// CABINET FACE REFERENCE LINE
//
// This vertical dashed line shows where the cabinet face frame
// sits relative to the door's hinge edge. It shifts left/right
// reactively when overlayType changes:
//
//   Full overlay  → cabinetFaceX is small  (close to hinge edge)
//   Half overlay  → cabinetFaceX is medium
//   Inset         → cabinetFaceX is large (or even past cup center)
//
// The line is drawn INSIDE the door panel, labeled "CABINET FACE".
// A fill band between the hinge edge and this line shows the
// overlay/inset zone in the overlay's accent color.
// ─────────────────────────────────────────────────────────────
function CabinetFaceLine({ cabinetFaceXsvg, panelLeft, overlayType, overlayAmount }) {
  // Color and label vary by overlay type
  const config = {
    full:  { color: C.green,  label: 'CABINET FACE',  sublabel: `+${overlayAmount}mm overlay` },
    half:  { color: C.green,  label: 'CABINET FACE',  sublabel: `+${overlayAmount}mm overlay` },
    inset: { color: C.warn,   label: 'CABINET FACE',  sublabel: `${overlayAmount}mm (inset)`  },
  };
  const { color, label, sublabel } = config[overlayType] ?? config.full;

  // Clamp so the line stays inside the visible panel
  const clampedX = Math.max(panelLeft + 4, cabinetFaceXsvg);

  // Fill band from hinge edge to cabinet face line
  const bandColor = overlayType === 'inset'
    ? 'rgba(251,191,36,0.05)'
    : 'rgba(34,211,238,0.05)';

  return (
    <g>
      {/* Shaded overlay/inset zone */}
      <rect
        x={panelLeft}
        y={0}
        width={Math.max(0, clampedX - panelLeft)}
        height={VP_HEIGHT}
        fill={bandColor}
      />

      {/* Cabinet face reference line — dashed, full panel height */}
      <line
        x1={clampedX} y1={0}
        x2={clampedX} y2={VP_HEIGHT}
        stroke={color}
        strokeWidth="1.0"
        strokeDasharray="6 4"
        opacity="0.65"
      />

      {/* Top label */}
      <rect
        x={clampedX + 3} y={40}
        width={54} height={18}
        rx="2"
        fill="rgba(10,14,20,0.80)"
        stroke={color} strokeWidth="0.5" opacity="0.55"
      />
      <CadText
        x={clampedX + 30} y={47}
        anchor="middle" baseline="middle"
        size={6.5} fill={color} bold opacity={0.9}
      >
        {label}
      </CadText>
      <CadText
        x={clampedX + 30} y={55}
        anchor="middle" baseline="middle"
        size={5.5} fill={color} opacity={0.65}
      >
        {sublabel}
      </CadText>

      {/* Small triangle marker pointing left at the line */}
      <path
        d={`M${clampedX-1},${VP_HEIGHT/2 - 5} L${clampedX+6},${VP_HEIGHT/2} L${clampedX-1},${VP_HEIGHT/2 + 5}`}
        fill={color} opacity="0.60"
      />
    </g>
  );
}

// ─────────────────────────────────────────────────────────────
// SCREW COORDINATE LABELS
//
// Rendered next to each screw hole to show its coordinates.
// Format: "(X, ±Y)" relative to cup center.
// These labels match exactly what is shown in the data table.
// ─────────────────────────────────────────────────────────────
function ScrewCoordLabel({ cx, cy, screwX, yOffset, isTop }) {
  // Label box sits to the RIGHT of the screw hole
  const labelX = cx + 14;
  const labelY = cy;
  const sign   = isTop ? '−' : '+';
  const absY   = Math.abs(yOffset).toFixed(1);

  return (
    <g>
      {/* Horizontal tick from screw to label */}
      <line
        x1={cx + 9} y1={cy}
        x2={labelX}  y2={cy}
        stroke={C.orangeDim} strokeWidth="0.6" opacity="0.7"
      />
      {/* Coordinate text — two lines */}
      <CadText
        x={labelX + 2} y={cy - 4}
        anchor="start" baseline="middle"
        size={6.5} fill={C.orange} bold opacity={0.90}
      >
        X={screwX.toFixed(1)}mm
      </CadText>
      <CadText
        x={labelX + 2} y={cy + 5}
        anchor="start" baseline="middle"
        size={6.0} fill={C.orangeDim} opacity={0.80}
      >
        {sign}{absY}mm from ℄
      </CadText>
    </g>
  );
}

// ─────────────────────────────────────────────────────────────
// DIMENSION ANNOTATIONS
// ─────────────────────────────────────────────────────────────
function DimAnnotations({
  panelLeftSvg,
  cupXsvg,
  screwXsvg,
  screwTopYsvg,
  screwBotYsvg,
  cupCenterX,
  screwOffsetX,
  holeSpacing,
  dimHRow1Y,
  dimHRow2Y,
  dimVX,
}) {
  return (
    <g>
      {/* ── DIM A: cupCenterX (horizontal, blue) ─────────── */}
      <line
        x1={panelLeftSvg} y1={VP_HEIGHT - 50}
        x2={panelLeftSvg} y2={dimHRow1Y}
        stroke={C.blueDim} strokeWidth="0.55"
        strokeDasharray="3 3" opacity="0.60"
      />
      <line
        x1={cupXsvg} y1={VP_HEIGHT - 50}
        x2={cupXsvg} y2={dimHRow1Y}
        stroke={C.blueDim} strokeWidth="0.55"
        strokeDasharray="3 3" opacity="0.60"
      />
      <ArrowDim
        x1={panelLeftSvg} y1={dimHRow1Y}
        x2={cupXsvg}      y2={dimHRow1Y}
        orient="h" color={C.blue}
      />
      <Tick x={panelLeftSvg} y={dimHRow1Y} orient="h" color={C.blue} />
      <Tick x={cupXsvg}      y={dimHRow1Y} orient="h" color={C.blue} />
      <CadText
        x={(panelLeftSvg + cupXsvg) / 2}
        y={dimHRow1Y - 7}
        size={8} fill={C.blue} bold
      >
        {cupCenterX.toFixed(1)}mm
      </CadText>
      <CadText
        x={(panelLeftSvg + cupXsvg) / 2}
        y={dimHRow1Y + 8}
        size={6} fill={C.blueDim}
      >
        cup center (X)
      </CadText>

      {/* ── DIM B: screwOffsetX (horizontal, orange) ─────── */}
      <line
        x1={cupXsvg}   y1={VP_HEIGHT - 50}
        x2={cupXsvg}   y2={dimHRow2Y}
        stroke={C.orangeDim} strokeWidth="0.55"
        strokeDasharray="3 3" opacity="0.60"
      />
      <line
        x1={screwXsvg} y1={VP_HEIGHT - 50}
        x2={screwXsvg} y2={dimHRow2Y}
        stroke={C.orangeDim} strokeWidth="0.55"
        strokeDasharray="3 3" opacity="0.60"
      />
      <ArrowDim
        x1={cupXsvg}   y1={dimHRow2Y}
        x2={screwXsvg} y2={dimHRow2Y}
        orient="h" color={C.orange}
      />
      <Tick x={cupXsvg}   y={dimHRow2Y} orient="h" color={C.orange} />
      <Tick x={screwXsvg} y={dimHRow2Y} orient="h" color={C.orange} />
      <CadText
        x={(cupXsvg + screwXsvg) / 2}
        y={dimHRow2Y - 7}
        size={8} fill={C.orange} bold
      >
        {screwOffsetX.toFixed(1)}mm
      </CadText>
      <CadText
        x={(cupXsvg + screwXsvg) / 2}
        y={dimHRow2Y + 8}
        size={6} fill={C.orangeDim}
      >
        screw offset (X)
      </CadText>

      {/* ── DIM C: holeSpacing (vertical, orange) ────────── */}
      <line
        x1={screwXsvg + 11} y1={screwTopYsvg}
        x2={dimVX}          y2={screwTopYsvg}
        stroke={C.orangeDim} strokeWidth="0.55"
        strokeDasharray="3 3" opacity="0.60"
      />
      <line
        x1={screwXsvg + 11} y1={screwBotYsvg}
        x2={dimVX}          y2={screwBotYsvg}
        stroke={C.orangeDim} strokeWidth="0.55"
        strokeDasharray="3 3" opacity="0.60"
      />
      <ArrowDim
        x1={dimVX} y1={screwTopYsvg}
        x2={dimVX} y2={screwBotYsvg}
        orient="v" color={C.orange}
      />
      <Tick x={dimVX} y={screwTopYsvg} orient="v" color={C.orange} />
      <Tick x={dimVX} y={screwBotYsvg} orient="v" color={C.orange} />
      <CadText
        x={dimVX + 6}
        y={(screwTopYsvg + screwBotYsvg) / 2 - 6}
        anchor="start" baseline="middle"
        size={8} fill={C.orange} bold
      >
        {holeSpacing}mm
      </CadText>
      <CadText
        x={dimVX + 6}
        y={(screwTopYsvg + screwBotYsvg) / 2 + 6}
        anchor="start" baseline="middle"
        size={6} fill={C.orangeDim}
      >
        screw spacing (Y)
      </CadText>
    </g>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN BLUEPRINT COMPONENT
// ─────────────────────────────────────────────────────────────
export default function Blueprint({ measurements }) {
  const {
    cupCenterX,
    screwX,
    screwTopYOffset,
    screwBottomYOffset,
    cupDiameter,
    holeSpacing,
    screwOffsetX,
    brandSpec,
    doorThickness,
    severity,
    overlayType,
    overlayAmount,
    cabinetFaceX,
  } = measurements;

  // ── SVG coordinate helpers ──────────────────────────────────
  const toSvgX = (mm) => PANEL_LEFT + mm * SCALE;
  const toSvgY = (offsetMm) => CUP_CENTER_Y_SVG + offsetMm * SCALE;

  // ── Key SVG coordinates ─────────────────────────────────────
  const cupXsvg          = toSvgX(cupCenterX);
  const cupYsvg          = CUP_CENTER_Y_SVG;
  const screwXsvg        = toSvgX(screwX);
  const screwTopYsvg     = toSvgY(screwTopYOffset);
  const screwBotYsvg     = toSvgY(screwBottomYOffset);
  const cupRadius        = (cupDiameter / 2) * SCALE;
  const panelRightSvg    = PANEL_LEFT + PANEL_WIDTH;

  // Cabinet face reference line — reactive to overlayType
  const cabinetFaceXsvg  = toSvgX(cabinetFaceX);

  // ── Severity-based door outline color ──────────────────────
  const doorStrokeColor =
    severity === 'critical' ? C.danger :
    severity === 'warn'     ? C.warn   : C.blue;

  // ── Dimension line positions ────────────────────────────────
  const DIM_H_ROW1_Y = VP_HEIGHT - 30;
  const DIM_H_ROW2_Y = VP_HEIGHT - 14;
  const DIM_V_X      = panelRightSvg + 22;

  // ── Grid lines ──────────────────────────────────────────────
  const gridLines = useMemo(() => {
    const lines = [];
    const step  = 20;
    for (let x = PANEL_LEFT; x <= PANEL_LEFT + PANEL_WIDTH; x += step) {
      lines.push({ x1: x, y1: 0, x2: x, y2: VP_HEIGHT, key: `v${x}` });
    }
    for (let y = 0; y <= VP_HEIGHT; y += step) {
      lines.push({ x1: PANEL_LEFT, y1: y, x2: PANEL_LEFT + PANEL_WIDTH, y2: y, key: `h${y}` });
    }
    return lines;
  }, []);

  return (
    <div className="rounded-xl border border-cad-border bg-cad-bg overflow-hidden shadow-[inset_0_0_40px_rgba(0,180,216,0.03)]">

      {/* ── Header bar ───────────────────────────────────────── */}
      <div className="
        flex items-center justify-between
        px-4 py-2 border-b border-cad-border bg-cad-panel/60
      ">
        <span className="text-cad-muted font-mono text-[10px] uppercase tracking-widest">
          Detail View — Single Hinge Template
        </span>
        <div className="flex items-center gap-3 flex-wrap">
          <LegendItem color={C.blue}   label="Cup (35mm)"     />
          <LegendItem color={C.orange} label="Screws (4mm)"   />
          <LegendItem color={C.green}  label="Cabinet Face" dashed />
          <LegendItem color={C.muted}  label="Dims"         dashed />
        </div>
      </div>

      {/* ── SVG Canvas ───────────────────────────────────────── */}
      <svg
        viewBox={`0 0 ${VP_WIDTH} ${VP_HEIGHT}`}
        className="w-full"
        style={{ maxHeight: '400px', background: C.bg }}
        role="img"
        aria-label={
          `35mm hinge detail view. ${brandSpec.label}. ` +
          `Cup center at ${cupCenterX.toFixed(1)}mm from hinge edge. ` +
          `Screw column at ${screwX.toFixed(1)}mm. ` +
          `Screw spacing ${holeSpacing}mm vertical. ` +
          `Overlay type: ${overlayType}.`
        }
      >
        <defs>
          <filter id="glowBlue" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glowOrange" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glowWarn" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Vertical fade — panel fades at top & bottom */}
          <linearGradient id="panelFadeV" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={C.panelFill} stopOpacity="0"   />
            <stop offset="12%"  stopColor={C.panelFill} stopOpacity="0.7" />
            <stop offset="25%"  stopColor={C.panelFill} stopOpacity="1"   />
            <stop offset="75%"  stopColor={C.panelFill} stopOpacity="1"   />
            <stop offset="88%"  stopColor={C.panelFill} stopOpacity="0.7" />
            <stop offset="100%" stopColor={C.panelFill} stopOpacity="0"   />
          </linearGradient>

          {/* Mask for grid fade */}
          <linearGradient id="gridFadeV" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopOpacity="0" stopColor="white" />
            <stop offset="18%"  stopOpacity="1" stopColor="white" />
            <stop offset="82%"  stopOpacity="1" stopColor="white" />
            <stop offset="100%" stopOpacity="0" stopColor="white" />
          </linearGradient>
          <mask id="gridFadeMask">
            <rect
              x={PANEL_LEFT} y={0}
              width={PANEL_WIDTH} height={VP_HEIGHT}
              fill="url(#gridFadeV)"
            />
          </mask>

          {/* Door stroke gradient */}
          <linearGradient id="strokeFadeV" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={doorStrokeColor} stopOpacity="0"   />
            <stop offset="14%"  stopColor={doorStrokeColor} stopOpacity="0.8" />
            <stop offset="28%"  stopColor={doorStrokeColor} stopOpacity="1"   />
            <stop offset="72%"  stopColor={doorStrokeColor} stopOpacity="1"   />
            <stop offset="86%"  stopColor={doorStrokeColor} stopOpacity="0.8" />
            <stop offset="100%" stopColor={doorStrokeColor} stopOpacity="0"   />
          </linearGradient>

          {/* Wood hatch for thickness callout */}
          <pattern
            id="woodHatch" width="5" height="5"
            patternUnits="userSpaceOnUse" patternTransform="rotate(45)"
          >
            <line x1="0" y1="0" x2="0" y2="5"
              stroke="rgba(0,180,216,0.20)" strokeWidth="0.9" />
          </pattern>
        </defs>

        {/* ════════════════════════════════════════════════════
            LAYER 0 — Cabinet face reference line
            Rendered FIRST so all geometry appears on top of it
        ═══════════════════════════════════════════════════════ */}
        <CabinetFaceLine
          cabinetFaceXsvg={cabinetFaceXsvg}
          panelLeft={PANEL_LEFT}
          overlayType={overlayType}
          overlayAmount={overlayAmount}
        />

        {/* ════════════════════════════════════════════════════
            LAYER 1 — Door stile panel body
        ═══════════════════════════════════════════════════════ */}

        {/* Panel fill with vertical fade */}
        <rect
          x={PANEL_LEFT} y={0}
          width={PANEL_WIDTH} height={VP_HEIGHT}
          fill="url(#panelFadeV)"
        />

        {/* CAD grid */}
        <g mask="url(#gridFadeMask)">
          {gridLines.map((l) => (
            <line
              key={l.key}
              x1={l.x1} y1={l.y1}
              x2={Math.min(l.x2, PANEL_LEFT + PANEL_WIDTH)}
              y2={l.y2}
              stroke={C.grid} strokeWidth="0.5"
            />
          ))}
        </g>

        {/* Left border — hinge side edge */}
        <line
          x1={PANEL_LEFT} y1={0}
          x2={PANEL_LEFT} y2={VP_HEIGHT}
          stroke="url(#strokeFadeV)" strokeWidth="1.8"
          filter={severity !== 'ok' ? 'url(#glowWarn)' : 'url(#glowBlue)'}
        />

        {/* Right border */}
        <line
          x1={panelRightSvg} y1={0}
          x2={panelRightSvg} y2={VP_HEIGHT}
          stroke="url(#strokeFadeV)" strokeWidth="1.0" opacity="0.5"
        />

        {/* Break lines — "infinite material" indicator */}
        <BreakLine y={32}               panelLeft={PANEL_LEFT} panelRight={panelRightSvg} />
        <BreakLine y={VP_HEIGHT - 32}   panelLeft={PANEL_LEFT} panelRight={panelRightSvg} />

        {/* Door stile label */}
        <CadText
          x={panelRightSvg - 8} y={56}
          anchor="end" size={7} fill={C.blueDim} opacity={0.50}
        >
          DOOR STILE
        </CadText>

        {/* Hinge-edge rotated label */}
        <text
          x={PANEL_LEFT - 12}
          y={VP_HEIGHT / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="7"
          fontFamily="JetBrains Mono, Fira Code, monospace"
          fill={C.blueDim}
          opacity="0.70"
          transform={`rotate(-90, ${PANEL_LEFT - 12}, ${VP_HEIGHT / 2})`}
        >
          ◄ HINGE SIDE EDGE
        </text>

        {/* ════════════════════════════════════════════════════
            LAYER 2 — Hinge geometry
        ═══════════════════════════════════════════════════════ */}

        {/* Vertical screw column center-line */}
        <line
          x1={screwXsvg} y1={0}
          x2={screwXsvg} y2={VP_HEIGHT}
          stroke={C.orangeDim} strokeWidth="0.65"
          strokeDasharray="5 4" opacity="0.55"
        />

        {/* Cup center horizontal reference line */}
        <line
          x1={PANEL_LEFT - 8} y1={cupYsvg}
          x2={panelRightSvg + 8} y2={cupYsvg}
          stroke={C.blueDim} strokeWidth="0.55"
          strokeDasharray="3 4" opacity="0.40"
        />

        {/* Faint connectors: cup center → each screw */}
        <line
          x1={cupXsvg} y1={cupYsvg}
          x2={screwXsvg} y2={screwTopYsvg}
          stroke={C.mutedFaint} strokeWidth="0.5"
          strokeDasharray="2 4"
        />
        <line
          x1={cupXsvg} y1={cupYsvg}
          x2={screwXsvg} y2={screwBotYsvg}
          stroke={C.mutedFaint} strokeWidth="0.5"
          strokeDasharray="2 4"
        />

        {/* Screw holes — rendered BEFORE cup so cup sits on top */}
        <ScrewHole cx={screwXsvg} cy={screwTopYsvg} />
        <ScrewHole cx={screwXsvg} cy={screwBotYsvg} />

        {/* Screw coordinate labels */}
        <ScrewCoordLabel
          cx={screwXsvg}
          cy={screwTopYsvg}
          screwX={screwX}
          yOffset={screwTopYOffset}
          isTop={true}
        />
        <ScrewCoordLabel
          cx={screwXsvg}
          cy={screwBotYsvg}
          screwX={screwX}
          yOffset={screwBottomYOffset}
          isTop={false}
        />

        {/* Cup hole — topmost geometry layer */}
        <CupHole
          cx={cupXsvg}
          cy={cupYsvg}
          radius={cupRadius}
          severity={severity}
        />

        {/* ════════════════════════════════════════════════════
            LAYER 3 — Leaders / callouts
        ═══════════════════════════════════════════════════════ */}

        {/* Ø35mm cup leader */}
        <LeaderLabel
          fromX={cupXsvg + cupRadius * 0.72}
          fromY={cupYsvg - cupRadius * 0.72}
          toX={cupXsvg + cupRadius + 32}
          toY={cupYsvg - cupRadius - 16}
          label="Ø35mm"
          sublabel="cup bore"
          color={C.blue}
        />

        {/* Ø4mm screw leader — top screw only (avoids clutter) */}
        <LeaderLabel
          fromX={screwXsvg + 9}
          fromY={screwTopYsvg - 6}
          toX={screwXsvg + 30}
          toY={screwTopYsvg - 20}
          label="Ø4mm"
          sublabel="pilot hole"
          color={C.orange}
        />

        {/* ════════════════════════════════════════════════════
            LAYER 4 — Dimension annotations
        ═══════════════════════════════════════════════════════ */}
        <DimAnnotations
          panelLeftSvg={PANEL_LEFT}
          cupXsvg={cupXsvg}
          screwXsvg={screwXsvg}
          screwTopYsvg={screwTopYsvg}
          screwBotYsvg={screwBotYsvg}
          cupCenterX={cupCenterX}
          screwOffsetX={screwOffsetX}
          holeSpacing={holeSpacing}
          dimHRow1Y={DIM_H_ROW1_Y}
          dimHRow2Y={DIM_H_ROW2_Y}
          dimVX={DIM_V_X}
        />

        {/* ════════════════════════════════════════════════════
            LAYER 5 — Peripheral info
        ═══════════════════════════════════════════════════════ */}
        <ThicknessCallout
          x={panelRightSvg + 6}
          y={14}
          thickness={doorThickness}
        />

        <ScaleBar x={PANEL_LEFT} y={14} scale={SCALE} />

        <CadText
          x={VP_WIDTH - 6} y={VP_HEIGHT - 5}
          anchor="end" size={6} fill={C.blue} opacity={0.12}
        >
          HingeCalc v1.1 — {brandSpec.label}
        </CadText>
      </svg>
    </div>
  );
}