import React, { useMemo } from 'react';

// ─────────────────────────────────────────────────────────────
// DIMENSION CONSTANTS (SVG viewport units ≈ mm scale)
// ─────────────────────────────────────────────────────────────

// The SVG viewport represents the FACE of the door panel.
// We show a cropped vertical section from one hinge side.

const VP_WIDTH  = 340;   // SVG viewport width  (px)
const VP_HEIGHT = 420;   // SVG viewport height (px)

// Door face representation (left edge = hinge side)
const DOOR_LEFT   = 40;   // left margin (space for dimension lines)
const DOOR_TOP    = 50;
const DOOR_WIDTH  = 200;  // rendered door face width in SVG units
const DOOR_HEIGHT = 320;  // rendered door face height

// Scale factor: 1 CAD unit = 2.5 SVG px (so 35mm = 87.5px)
const SCALE = 2.2;

// ─────────────────────────────────────────────────────────────
// HELPER: Dashed dimension line with arrows and label
// ─────────────────────────────────────────────────────────────
function DimLine({ x1, y1, x2, y2, label, orient = 'h', offset = 0, color = '#6b7a99' }) {
  const mid = { x: (x1 + x2) / 2, y: (y1 + y2) / 2 };

  // Arrow head size
  const AH = 4;
  let arrow1, arrow2;

  if (orient === 'h') {
    arrow1 = `M${x1+AH},${y1-AH} L${x1},${y1} L${x1+AH},${y1+AH}`;
    arrow2 = `M${x2-AH},${y2-AH} L${x2},${y2} L${x2-AH},${y2+AH}`;
  } else {
    arrow1 = `M${x1-AH},${y1+AH} L${x1},${y1} L${x1+AH},${y1+AH}`;
    arrow2 = `M${x2-AH},${y2-AH} L${x2},${y2} L${x2+AH},${y2-AH}`;
  }

  return (
    <g>
      {/* Dimension leader line */}
      <line
        x1={x1} y1={y1} x2={x2} y2={y2}
        stroke={color}
        strokeWidth="0.6"
        strokeDasharray="4 3"
        opacity="0.7"
      />
      {/* Arrow heads */}
      <path d={arrow1} stroke={color} strokeWidth="0.8" fill="none" opacity="0.8" />
      <path d={arrow2} stroke={color} strokeWidth="0.8" fill="none" opacity="0.8" />
      {/* Dimension text */}
      <text
        x={mid.x}
        y={orient === 'h' ? mid.y - 6 : mid.y}
        textAnchor="middle"
        dominantBaseline={orient === 'v' ? 'middle' : 'auto'}
        fontSize="7.5"
        fontFamily="JetBrains Mono, monospace"
        fill={color}
        opacity="0.9"
      >
        {label}
      </text>
    </g>
  );
}

// ─────────────────────────────────────────────────────────────
// HELPER: Crosshair target marker (drill point indicator)
// ─────────────────────────────────────────────────────────────
function CrosshairMarker({ cx, cy, radius, color, pulseClass = '' }) {
  return (
    <g>
      {/* Outer ring */}
      <circle
        cx={cx} cy={cy} r={radius + 4}
        fill="none" stroke={color} strokeWidth="0.5" opacity="0.3"
        className={pulseClass}
      />
      {/* Main circle */}
      <circle
        cx={cx} cy={cy} r={radius}
        fill="none" stroke={color} strokeWidth="1"
        filter="url(#glowBlue)"
      />
      {/* Center dot */}
      <circle cx={cx} cy={cy} r="1.5" fill={color} opacity="0.9" />
      {/* Crosshair lines */}
      <line
        x1={cx - radius - 8} y1={cy}
        x2={cx + radius + 8} y2={cy}
        stroke={color} strokeWidth="0.6" strokeDasharray="2 2" opacity="0.6"
      />
      <line
        x1={cx} y1={cy - radius - 8}
        x2={cx} y2={cy + radius + 8}
        stroke={color} strokeWidth="0.6" strokeDasharray="2 2" opacity="0.6"
      />
    </g>
  );
}

// ─────────────────────────────────────────────────────────────
// HELPER: Small screw hole marker
// ─────────────────────────────────────────────────────────────
function ScrewHole({ cx, cy, color = '#f97316' }) {
  return (
    <g>
      {/* Outer ring */}
      <circle
        cx={cx} cy={cy} r={6}
        fill="rgba(249,115,22,0.07)"
        stroke={color} strokeWidth="0.8"
        filter="url(#glowOrange)"
      />
      {/* Inner ring */}
      <circle cx={cx} cy={cy} r="2.5" fill="none" stroke={color} strokeWidth="0.7" opacity="0.7" />
      {/* Center */}
      <circle cx={cx} cy={cy} r="1" fill={color} opacity="0.8" />
      {/* Diagonal slots (screw head indicator) */}
      <line
        x1={cx - 1.5} y1={cy - 1.5}
        x2={cx + 1.5} y2={cy + 1.5}
        stroke={color} strokeWidth="0.7" opacity="0.7"
      />
    </g>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN BLUEPRINT COMPONENT
// ─────────────────────────────────────────────────────────────
export default function Blueprint({ measurements }) {
  const {
    cupCenterX,
    screwLeftX,
    screwRightX,
    screwOffsetY,
    cupDiameter,
    brandSpec,
    doorThickness,
    severity,
    topHingeY,
    bottomOffset,
  } = measurements;

  // ── Map real-world mm to SVG coords ───────────────────────
  // Origin (0,0) = top-left corner of door FACE
  // X_svg = DOOR_LEFT + (real_X_mm * SCALE)
  // Y_svg = DOOR_TOP + hinge_y_position_in_svg

  const svgCupX  = DOOR_LEFT + cupCenterX * SCALE;
  const cupR     = (cupDiameter / 2) * SCALE;

  // Two hinge instances: top and bottom
  const hingeInstances = [
    { id: 'top',    ySvg: DOOR_TOP + 80,  label: `Y = ${topHingeY}mm` },
    { id: 'bottom', ySvg: DOOR_TOP + 240, label: `Y = 100mm from bottom` },
  ];

  // Screw hole X positions in SVG
  const svgScrewLeftX  = DOOR_LEFT + screwLeftX  * SCALE;
  const svgScrewRightX = DOOR_LEFT + screwRightX * SCALE;

  // Screw vertical offset from cup center
  const svgScrewOffsetY = screwOffsetY * SCALE;

  // Door face dimensions — clamp to avoid overflow
  const svgDoorFaceWidth = Math.min(DOOR_WIDTH, VP_WIDTH - DOOR_LEFT - 20);

  // Warning color for door outline
  const outlineColor = severity === 'critical'
    ? '#f43f5e'
    : severity === 'warn'
    ? '#fbbf24'
    : '#00b4d8';

  // ── Grid lines (CAD appearance) ────────────────────────────
  const gridLines = useMemo(() => {
    const lines = [];
    const step = 20;
    for (let x = DOOR_LEFT; x <= DOOR_LEFT + DOOR_WIDTH; x += step) {
      lines.push({ x1: x, y1: DOOR_TOP, x2: x, y2: DOOR_TOP + DOOR_HEIGHT, axis: 'v' });
    }
    for (let y = DOOR_TOP; y <= DOOR_TOP + DOOR_HEIGHT; y += step) {
      lines.push({ x1: DOOR_LEFT, y1: y, x2: DOOR_LEFT + DOOR_WIDTH, y2: y, axis: 'h' });
    }
    return lines;
  }, []);

  return (
    <div className="
      rounded-xl border border-cad-border bg-cad-bg overflow-hidden
      shadow-[inset_0_0_40px_rgba(0,180,216,0.03)]
    ">
      {/* Header bar */}
      <div className="
        flex items-center justify-between px-4 py-2
        border-b border-cad-border bg-cad-panel/60
      ">
        <span className="text-cad-muted font-mono text-[10px] uppercase tracking-widest">
          Blueprint — Door Face (35mm Hinge Template)
        </span>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-[10px] font-mono text-cad-blue opacity-70">
            <span className="w-3 h-0.5 bg-cad-blue inline-block" />
            Cup Hole
          </span>
          <span className="flex items-center gap-1.5 text-[10px] font-mono text-cad-orange opacity-70">
            <span className="w-3 h-0.5 bg-cad-orange inline-block" />
            Screw Holes
          </span>
          <span className="flex items-center gap-1.5 text-[10px] font-mono text-cad-muted opacity-70">
            <span className="w-3 h-0.5 bg-cad-muted inline-block border-dashed border-t border-cad-muted" />
            Dimensions
          </span>
        </div>
      </div>

      {/* SVG Canvas */}
      <svg
        viewBox={`0 0 ${VP_WIDTH} ${VP_HEIGHT}`}
        className="w-full"
        style={{ maxHeight: '480px', background: '#0a0e14' }}
        role="img"
        aria-label="CAD blueprint showing 35mm hinge drilling template with cup hole and mounting screw positions"
      >
        <defs>
          {/* Glow filters */}
          <filter id="glowBlue" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glowOrange" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glowWarn" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Grid pattern */}
          <pattern id="cadGrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path
              d="M 20 0 L 0 0 0 20"
              fill="none" stroke="rgba(0,180,216,0.06)" strokeWidth="0.5"
            />
          </pattern>
          {/* Hatch pattern for door thickness cross-section */}
          <pattern id="woodHatch" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="5" stroke="rgba(0,180,216,0.12)" strokeWidth="0.7" />
          </pattern>
        </defs>

        {/* ── Background grid ──────────────────────────────── */}
        <rect width={VP_WIDTH} height={VP_HEIGHT} fill="url(#cadGrid)" />

        {/* ── Origin crosshair (top-left of door) ─────────── */}
        <circle cx={DOOR_LEFT} cy={DOOR_TOP} r="2" fill="rgba(0,180,216,0.4)" />

        {/* ── Door FACE rectangle ──────────────────────────── */}
        <rect
          x={DOOR_LEFT}
          y={DOOR_TOP}
          width={svgDoorFaceWidth}
          height={DOOR_HEIGHT}
          fill="rgba(15,21,32,0.8)"
          stroke={outlineColor}
          strokeWidth="1.5"
          filter={severity !== 'ok' ? 'url(#glowWarn)' : 'url(#glowBlue)'}
        />

        {/* Grid inside door face */}
        {gridLines.map((l, i) => (
          <line
            key={i}
            x1={l.x1} y1={l.y1}
            x2={Math.min(l.x2, DOOR_LEFT + svgDoorFaceWidth)}
            y2={Math.min(l.y2, DOOR_TOP + DOOR_HEIGHT)}
            stroke="rgba(0,180,216,0.04)"
            strokeWidth="0.5"
          />
        ))}

        {/* ── Door edge label ──────────────────────────────── */}
        <text
          x={DOOR_LEFT - 6}
          y={DOOR_TOP + DOOR_HEIGHT / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="7"
          fontFamily="JetBrains Mono, monospace"
          fill="rgba(0,180,216,0.5)"
          transform={`rotate(-90, ${DOOR_LEFT - 6}, ${DOOR_TOP + DOOR_HEIGHT / 2})`}
        >
          HINGE SIDE EDGE →
        </text>

        {/* ── Thickness indicator (cross-section mini view) ── */}
        <rect
          x={DOOR_LEFT + svgDoorFaceWidth + 8}
          y={DOOR_TOP + 10}
          width={doorThickness * 0.9}
          height={60}
          fill="url(#woodHatch)"
          stroke="rgba(0,180,216,0.3)"
          strokeWidth="0.8"
        />
        <text
          x={DOOR_LEFT + svgDoorFaceWidth + 8 + (doorThickness * 0.45)}
          y={DOOR_TOP + 75}
          textAnchor="middle"
          fontSize="7"
          fontFamily="JetBrains Mono, monospace"
          fill="rgba(0,180,216,0.6)"
        >
          {doorThickness}mm
        </text>
        <text
          x={DOOR_LEFT + svgDoorFaceWidth + 8 + (doorThickness * 0.45)}
          y={DOOR_TOP + 84}
          textAnchor="middle"
          fontSize="6"
          fontFamily="JetBrains Mono, monospace"
          fill="rgba(0,180,216,0.4)"
        >
          (thickness)
        </text>

        {/* ── HINGE INSTANCES (top + bottom) ──────────────── */}
        {hingeInstances.map(({ id, ySvg, label }) => {
          const cupY      = ySvg;
          const screwY    = ySvg + svgScrewOffsetY;   // screws are BELOW cup center

          return (
            <g key={id}>
              {/* ── Cup hole (35mm Forstner bore) ─────────── */}
              <CrosshairMarker
                cx={svgCupX}
                cy={cupY}
                radius={cupR}
                color="#00b4d8"
                pulseClass="cad-pulse"
              />

              {/* Cup fill to indicate bore depth visually */}
              <circle
                cx={svgCupX}
                cy={cupY}
                r={cupR}
                fill="rgba(0,180,216,0.06)"
              />

              {/* ── Mounting screw holes ───────────────────── */}
              {/* Left screw */}
              <ScrewHole
                cx={svgScrewLeftX}
                cy={screwY}
                color="#f97316"
              />
              {/* Right screw */}
              <ScrewHole
                cx={svgScrewRightX}
                cy={screwY}
                color="#f97316"
              />

              {/* ── Horizontal line connecting the 3 holes ── */}
              {/* Cup-to-screw connection (diagonal, showing offset) */}
              <line
                x1={svgCupX}    y1={cupY}
                x2={svgScrewLeftX}  y2={screwY}
                stroke="rgba(249,115,22,0.3)" strokeWidth="0.6" strokeDasharray="3 2"
              />
              <line
                x1={svgCupX}    y1={cupY}
                x2={svgScrewRightX} y2={screwY}
                stroke="rgba(249,115,22,0.3)" strokeWidth="0.6" strokeDasharray="3 2"
              />

              {/* ── Screw-to-screw horizontal line ─────────── */}
              <line
                x1={svgScrewLeftX}  y1={screwY}
                x2={svgScrewRightX} y2={screwY}
                stroke="rgba(249,115,22,0.2)" strokeWidth="0.5" strokeDasharray="4 3"
              />

              {/* ── Cup center label ────────────────────────── */}
              <text
                x={svgCupX}
                y={cupY - cupR - 10}
                textAnchor="middle"
                fontSize="7"
                fontFamily="JetBrains Mono, monospace"
                fill="rgba(0,180,216,0.8)"
              >
                Ø35mm
              </text>

              {/* ── Vertical offset annotation ──────────────── */}
              <line
                x1={svgCupX + cupR + 5} y1={cupY}
                x2={svgCupX + cupR + 5} y2={screwY}
                stroke="rgba(249,115,22,0.5)" strokeWidth="0.6"
              />
              <text
                x={svgCupX + cupR + 14}
                y={(cupY + screwY) / 2}
                dominantBaseline="middle"
                fontSize="6.5"
                fontFamily="JetBrains Mono, monospace"
                fill="rgba(249,115,22,0.7)"
              >
                {screwOffsetY}mm↕
              </text>

              {/* ── Hinge instance label ────────────────────── */}
              <text
                x={DOOR_LEFT + svgDoorFaceWidth - 4}
                y={cupY}
                textAnchor="end"
                dominantBaseline="middle"
                fontSize="6.5"
                fontFamily="JetBrains Mono, monospace"
                fill="rgba(0,180,216,0.4)"
              >
                {label}
              </text>
            </g>
          );
        })}

        {/* ── DIMENSION LINES ────────────────────────────── */}
        {/* Cup center X from door left edge */}
        <DimLine
          x1={DOOR_LEFT}
          y1={DOOR_TOP + DOOR_HEIGHT + 16}
          x2={svgCupX}
          y2={DOOR_TOP + DOOR_HEIGHT + 16}
          label={`${measurements.cupCenterX.toFixed(1)}mm`}
          orient="h"
          color="#00b4d8"
        />

        {/* Screw-to-screw spacing */}
        <DimLine
          x1={svgScrewLeftX}
          y1={DOOR_TOP + DOOR_HEIGHT + 28}
          x2={svgScrewRightX}
          y2={DOOR_TOP + DOOR_HEIGHT + 28}
          label={`${brandSpec.holeSpacing}mm`}
          orient="h"
          color="#f97316"
        />

        {/* ── Edge markers ────────────────────────────────── */}
        {/* Left (hinge side) vertical edge tick */}
        <line
          x1={DOOR_LEFT} y1={DOOR_TOP + DOOR_HEIGHT + 6}
          x2={DOOR_LEFT} y2={DOOR_TOP + DOOR_HEIGHT + 26}
          stroke="rgba(0,180,216,0.4)" strokeWidth="0.8"
        />
        {/* Cup center vertical tick */}
        <line
          x1={svgCupX} y1={DOOR_TOP + DOOR_HEIGHT + 6}
          x2={svgCupX} y2={DOOR_TOP + DOOR_HEIGHT + 36}
          stroke="rgba(0,180,216,0.4)" strokeWidth="0.8"
        />
        {/* Left screw vertical tick */}
        <line
          x1={svgScrewLeftX} y1={DOOR_TOP + DOOR_HEIGHT + 6}
          x2={svgScrewLeftX} y2={DOOR_TOP + DOOR_HEIGHT + 38}
          stroke="rgba(249,115,22,0.4)" strokeWidth="0.8"
        />
        {/* Right screw vertical tick */}
        <line
          x1={svgScrewRightX} y1={DOOR_TOP + DOOR_HEIGHT + 6}
          x2={svgScrewRightX} y2={DOOR_TOP + DOOR_HEIGHT + 38}
          stroke="rgba(249,115,22,0.4)" strokeWidth="0.8"
        />

        {/* ── Brand watermark ─────────────────────────────── */}
        <text
          x={VP_WIDTH - 8}
          y={VP_HEIGHT - 8}
          textAnchor="end"
          fontSize="7"
          fontFamily="JetBrains Mono, monospace"
          fill="rgba(0,180,216,0.15)"
        >
          HingeCalc v1.0 — {brandSpec.label}
        </text>

        {/* ── Scale indicator ──────────────────────────────── */}
        <g>
          <line
            x1={DOOR_LEFT} y1={DOOR_TOP - 18}
            x2={DOOR_LEFT + 10 * SCALE} y2={DOOR_TOP - 18}
            stroke="rgba(0,180,216,0.5)" strokeWidth="1"
          />
          <line x1={DOOR_LEFT} y1={DOOR_TOP - 21} x2={DOOR_LEFT} y2={DOOR_TOP - 15}
            stroke="rgba(0,180,216,0.5)" strokeWidth="0.8" />
          <line x1={DOOR_LEFT + 10 * SCALE} y1={DOOR_TOP - 21}
            x2={DOOR_LEFT + 10 * SCALE} y2={DOOR_TOP - 15}
            stroke="rgba(0,180,216,0.5)" strokeWidth="0.8" />
          <text
            x={DOOR_LEFT + 5 * SCALE}
            y={DOOR_TOP - 22}
            textAnchor="middle"
            fontSize="6.5"
            fontFamily="JetBrains Mono, monospace"
            fill="rgba(0,180,216,0.5)"
          >
            10mm
          </text>
        </g>
      </svg>
    </div>
  );
}