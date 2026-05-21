import React, { useState, useCallback, useId } from 'react';
import {
  Settings2,
  Layers,
  Ruler,
  ChevronRight,
  Info,
  Copy,
  CheckCheck,
  RotateCcw,
  Cpu,
} from 'lucide-react';
import { useHingeMath, BRAND_SPECS, OVERLAY_SPECS } from '../hooks/useHingeMath.js';
import Blueprint from './Blueprint.jsx';
import WarningPanel from './WarningPanel.jsx';
import AffiliateButton from './AffiliateButton.jsx';
import HowToUse from './HowToUse.jsx';
import FAQ from './FAQ.jsx';

// ─────────────────────────────────────────────────────────────
// FORM FIELD WRAPPER
// ─────────────────────────────────────────────────────────────
function FieldGroup({ label, hint, children }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-cad-text text-xs font-medium uppercase tracking-wider">
          {label}
        </label>
        {hint && (
          <span className="text-cad-muted text-xs flex items-center gap-1 opacity-70">
            <Info size={11} />
            {hint}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// STYLED SELECT
// ─────────────────────────────────────────────────────────────
function CadSelect({ value, onChange, children, disabled }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      disabled={disabled}
      className="
        w-full px-3 py-2.5 rounded-lg
        bg-cad-bg border border-cad-border
        text-cad-text text-xs font-mono
        focus:outline-none focus:border-cad-blue focus:ring-1 focus:ring-cad-blue/30
        hover:border-cad-blueDim transition-colors duration-150
        disabled:opacity-40 disabled:cursor-not-allowed
        cursor-pointer pr-8
      "
    >
      {children}
    </select>
  );
}

// ─────────────────────────────────────────────────────────────
// RESULT ROW
// ─────────────────────────────────────────────────────────────
function ResultRow({ label, value, unit = 'mm', accent = 'blue', note }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${value}${unit}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard API not available
    }
  };

  const accentClasses = {
    blue:   'text-cad-blue border-cad-blue/20 bg-cad-blue/5',
    orange: 'text-cad-orange border-cad-orange/20 bg-cad-orange/5',
    green:  'text-cad-green border-cad-green/20 bg-cad-green/5',
    muted:  'text-cad-muted border-cad-border bg-transparent',
  };

  return (
    <div className={`
      flex items-center justify-between px-4 py-3
      rounded-lg border ${accentClasses[accent] ?? accentClasses.blue}
      group
    `}>
      <div className="flex-1 min-w-0">
        <p className="text-cad-muted text-[10px] uppercase tracking-wider mb-0.5">
          {label}
        </p>
        {note && (
          <p className="text-cad-muted/50 text-[9px] mt-0.5 leading-tight">{note}</p>
        )}
      </div>
      <div className="flex items-center gap-2 ml-3">
        <div className="text-right">
          <span className="font-mono font-bold text-lg leading-none">
            {typeof value === 'number' ? value.toFixed(1) : value}
          </span>
          <span className="text-[10px] ml-1 opacity-70">{unit}</span>
        </div>
        <button
          onClick={handleCopy}
          title="Copy to clipboard"
          className="
            opacity-0 group-hover:opacity-100 transition-opacity
            p-1.5 rounded hover:bg-white/5
            text-cad-muted hover:text-cad-text
          "
          aria-label={`Copy ${label} value`}
        >
          {copied
            ? <CheckCheck size={12} className="text-emerald-400" />
            : <Copy size={12} />
          }
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SLIDER INPUT
// ─────────────────────────────────────────────────────────────
function CadSlider({ label, value, min, max, step = 1, onChange, unit = 'mm', hint, accent = 'orange' }) {
  const pct = ((value - min) / (max - min)) * 100;

  const trackColor = accent === 'blue'
    ? 'rgba(0,180,216,0.6)'
    : 'rgba(249,115,22,0.6)';

  return (
    <FieldGroup label={label} hint={hint}>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-cad-muted">{min}{unit}</span>
          <span className="font-mono font-bold text-lg text-cad-orange text-glow-orange">
            {value}{unit}
          </span>
          <span className="font-mono text-xs text-cad-muted">{max}{unit}</span>
        </div>
        <div className="relative">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={e => onChange(Number(e.target.value))}
            style={{
              background: `linear-gradient(to right, ${trackColor} 0%, ${trackColor} ${pct}%, #1e2d40 ${pct}%, #1e2d40 100%)`,
            }}
            aria-label={`${label}: ${value}${unit}`}
          />
        </div>
      </div>
    </FieldGroup>
  );
}

// ─────────────────────────────────────────────────────────────
// STAT CARD (small summary cards in header)
// ─────────────────────────────────────────────────────────────
function StatCard({ label, value, unit, color = 'blue' }) {
  const colors = {
    blue:   'border-cad-blue/25 bg-cad-blue/5  text-cad-blue',
    orange: 'border-cad-orange/25 bg-cad-orange/5 text-cad-orange',
    green:  'border-cad-green/25 bg-cad-green/5 text-cad-green',
  };
  return (
    <div className={`rounded-lg border px-3 py-2 ${colors[color]}`}>
      <div className="text-[9px] uppercase tracking-widest opacity-70 mb-1">{label}</div>
      <div className="font-mono font-bold text-base leading-none">
        {typeof value === 'number' ? value.toFixed(1) : value}
        <span className="text-xs font-normal ml-0.5 opacity-70">{unit}</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN CALCULATOR COMPONENT
// ─────────────────────────────────────────────────────────────
export default function Calculator({ defaultBrand = 'blum', defaultOverlay = 'full', seoTitle }) {
  // ── State ──────────────────────────────────────────────────
  const [brand,         setBrand]         = useState(defaultBrand);
  const [overlayType,   setOverlayType]   = useState(defaultOverlay);
  const [doorThickness, setDoorThickness] = useState(18);
  const [kValue,        setKValue]        = useState(3);

  // ── Reset handler ──────────────────────────────────────────
  const handleReset = useCallback(() => {
    setBrand(defaultBrand);
    setOverlayType(defaultOverlay);
    setDoorThickness(18);
    setKValue(3);
  }, [defaultBrand, defaultOverlay]);

  // ── Enforce K-value restriction for thick doors ────────────
  const effectiveMaxK = doorThickness >= 22 ? 4 : 7;
  const effectiveK    = Math.min(kValue, effectiveMaxK);

  // ── Math engine ────────────────────────────────────────────
  const measurements = useHingeMath({
    brand,
    overlayType,
    doorThickness,
    kValue: effectiveK,
  });

  // If user had K > max, display clamped value
  const handleKChange = useCallback((v) => {
    setKValue(Math.min(v, effectiveMaxK));
  }, [effectiveMaxK]);

  // ── Severity-based UI colors ───────────────────────────────
  const sevColor = measurements.severity === 'critical'
    ? 'text-cad-danger'
    : measurements.severity === 'warn'
    ? 'text-cad-yellow'
    : 'text-cad-green';

  const sevBadge = measurements.severity === 'critical'
    ? 'bg-rose-900/40 border-rose-700/40 text-rose-400'
    : measurements.severity === 'warn'
    ? 'bg-amber-900/40 border-amber-700/40 text-amber-400'
    : 'bg-emerald-900/40 border-emerald-700/40 text-emerald-400';

  return (
    <main className="w-full">
      {/* ═══════════════════════════════════════════════════════
          PAGE HEADER
      ════════════════════════════════════════════════════════ */}
      <header className="border-b border-cad-border bg-cad-panel/80 backdrop-blur sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          {/* Logo mark */}
          <div className="
            w-8 h-8 rounded-lg border border-cad-blue/40 bg-cad-blue/10
            flex items-center justify-center shrink-0
          ">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
              <circle cx="12" cy="12" r="9" stroke="#00b4d8" strokeWidth="1.5"/>
              <circle cx="12" cy="12" r="3.5" fill="none" stroke="#f97316" strokeWidth="1.5"/>
              <line x1="12" y1="3" x2="12" y2="1" stroke="#00b4d8" strokeWidth="1.5"/>
              <line x1="12" y1="23" x2="12" y2="21" stroke="#00b4d8" strokeWidth="1.5"/>
              <line x1="21" y1="12" x2="23" y2="12" stroke="#00b4d8" strokeWidth="1.5"/>
              <line x1="1" y1="12" x2="3" y2="12" stroke="#00b4d8" strokeWidth="1.5"/>
            </svg>
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="text-cad-text font-semibold text-sm truncate">
              {seoTitle ?? '35mm Concealed Hinge Template Generator'}
            </h1>
            <p className="text-cad-muted text-[10px] hidden sm:block">
              Professional drilling template — Blum / Hettich / Generic standards
            </p>
          </div>

          {/* Status badge */}
          <div className={`
            hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full
            border text-[10px] font-mono uppercase tracking-wider
            ${sevBadge}
          `}>
            <span className={`w-1.5 h-1.5 rounded-full ${
              measurements.severity === 'ok'       ? 'bg-emerald-400 animate-pulse' :
              measurements.severity === 'warn'     ? 'bg-amber-400 animate-pulse' :
              'bg-rose-400 animate-pulse'
            }`} />
            {measurements.severity === 'ok' ? 'All Clear' :
             measurements.severity === 'warn' ? 'Warning' : 'Critical'}
          </div>

          {/* Reset */}
          <button
            onClick={handleReset}
            className="
              flex items-center gap-1.5 px-3 py-1.5 rounded-lg
              border border-cad-border text-cad-muted hover:text-cad-text
              hover:border-cad-blue/40 hover:bg-cad-blue/5
              text-xs font-mono transition-all duration-150
            "
            title="Reset to defaults"
            aria-label="Reset calculator to default values"
          >
            <RotateCcw size={12} />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════
          CONTENT AREA
      ════════════════════════════════════════════════════════ */}
      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* ── Quick stats bar ─────────────────────────────── */}
        <div className="flex flex-wrap gap-2 mb-8">
          <StatCard label="Cup Center X"  value={measurements.cupCenterX}  unit="mm" color="blue"   />
          <StatCard label="Bore Depth"    value={measurements.boreDepth}    unit="mm" color="orange" />
          <StatCard label="Screw Spacing" value={measurements.holeSpacing}  unit="mm" color="blue"   />
          <StatCard label="Screw Offset"  value={measurements.screwOffsetY} unit="mm" color="orange" />
          <StatCard label="Remaining Wood" value={measurements.remainingWood} unit="mm"
            color={measurements.remainingWood < 4 ? 'orange' : 'green'}
          />
        </div>

        {/* ── Two-column layout ───────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* ═══════════════════════════
              LEFT COLUMN — Controls
          ═════════════════════════════ */}
          <div className="space-y-5">
            {/* Panel: Configuration */}
            <section
              aria-labelledby="config-heading"
              className="
                rounded-xl border border-cad-border bg-cad-panel
                overflow-hidden
              "
            >
              <div className="
                flex items-center gap-2 px-5 py-3
                border-b border-cad-border
                bg-gradient-to-r from-cad-blue/5 to-transparent
              ">
                <Settings2 size={14} className="text-cad-blue" />
                <h2
                  id="config-heading"
                  className="text-cad-text text-xs font-semibold uppercase tracking-widest"
                >
                  Configuration
                </h2>
              </div>

              <div className="p-5 space-y-5">
                {/* Brand Select */}
                <FieldGroup
                  label="Hinge Brand"
                  hint="Affects hole spacing & offsets"
                >
                  <CadSelect value={brand} onChange={setBrand}>
                    {Object.entries(BRAND_SPECS).map(([key, spec]) => (
                      <option key={key} value={key}>{spec.label}</option>
                    ))}
                  </CadSelect>
                  {/* Brand spec preview */}
                  <div className="
                    mt-2 grid grid-cols-2 gap-2 p-3 rounded-lg
                    bg-cad-bg/50 border border-cad-border/50
                    text-[10px] font-mono text-cad-muted
                  ">
                    <span>Cup Ø: <span className="text-cad-blue">{BRAND_SPECS[brand]?.cupDiameter}mm</span></span>
                    <span>Hole Spacing: <span className="text-cad-orange">{BRAND_SPECS[brand]?.holeSpacing}mm</span></span>
                    <span>Screw Offset: <span className="text-cad-blue">{BRAND_SPECS[brand]?.screwOffsetY}mm</span></span>
                    <span>Bore Depth: <span className="text-cad-orange">{BRAND_SPECS[brand]?.boreDepth}mm</span></span>
                  </div>
                </FieldGroup>

                {/* Overlay Type */}
                <FieldGroup
                  label="Overlay Type"
                  hint="Door-to-cabinet relationship"
                >
                  <div className="grid grid-cols-3 gap-2">
                    {Object.entries(OVERLAY_SPECS).map(([key, spec]) => (
                      <button
                        key={key}
                        onClick={() => setOverlayType(key)}
                        className={`
                          px-2 py-2.5 rounded-lg border text-xs font-mono text-center
                          transition-all duration-150
                          ${overlayType === key
                            ? 'border-cad-orange/60 bg-cad-orange/10 text-cad-orange shadow-glow-orange'
                            : 'border-cad-border bg-cad-bg text-cad-muted hover:border-cad-border/80 hover:text-cad-text'
                          }
                        `}
                        aria-pressed={overlayType === key}
                        title={spec.description}
                      >
                        <div className="font-semibold leading-tight">
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </div>
                        <div className="text-[8px] opacity-60 mt-0.5 leading-tight">
                          {spec.description.split(' ').slice(0, 3).join(' ')}
                        </div>
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-cad-muted/60 mt-1.5 font-mono">
                    {OVERLAY_SPECS[overlayType]?.description}
                    {' — '}
                    Base edge offset: <span className="text-cad-blue">
                      {OVERLAY_SPECS[overlayType]?.baseEdgeOffset}mm
                    </span>
                  </p>
                </FieldGroup>
              </div>
            </section>

            {/* Panel: Parameters */}
            <section
              aria-labelledby="params-heading"
              className="
                rounded-xl border border-cad-border bg-cad-panel
                overflow-hidden
              "
            >
              <div className="
                flex items-center gap-2 px-5 py-3
                border-b border-cad-border
                bg-gradient-to-r from-cad-orange/5 to-transparent
              ">
                <Ruler size={14} className="text-cad-orange" />
                <h2
                  id="params-heading"
                  className="text-cad-text text-xs font-semibold uppercase tracking-widest"
                >
                  Door Parameters
                </h2>
              </div>

              <div className="p-5 space-y-6">
                {/* Door Thickness Slider */}
                <CadSlider
                  label="Door Thickness"
                  value={doorThickness}
                  min={16}
                  max={26}
                  step={1}
                  onChange={setDoorThickness}
                  unit="mm"
                  hint={
                    doorThickness >= 24 ? '⛔ Too thick for std hinges' :
                    doorThickness >= 22 ? '⚠ Thick — use min K-value' :
                    'Standard range: 16–19mm'
                  }
                />

                {/* K-Value Slider */}
                <CadSlider
                  label={`Tab / K-Value${doorThickness >= 22 ? ` (max ${effectiveMaxK}mm)` : ''}`}
                  value={effectiveK}
                  min={3}
                  max={effectiveMaxK}
                  step={1}
                  onChange={handleKChange}
                  unit="mm"
                  hint="Gap: hinge plate ↔ door edge"
                />

                {/* Depth analysis */}
                <div className="
                  rounded-lg border border-cad-border p-3
                  bg-cad-bg/40 space-y-2 font-mono text-[10px]
                ">
                  <div className="text-cad-muted uppercase tracking-wider mb-2">
                    Depth Analysis
                  </div>
                  <div className="flex justify-between">
                    <span className="text-cad-muted">Bore required:</span>
                    <span className="text-cad-blue">{measurements.depthRequired.toFixed(1)}mm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-cad-muted">Available depth:</span>
                    <span className={
                      measurements.depthAvailable < measurements.depthRequired
                        ? 'text-cad-danger'
                        : 'text-cad-green'
                    }>
                      {measurements.depthAvailable.toFixed(1)}mm
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-cad-muted">Remaining wood:</span>
                    <span className={
                      measurements.remainingWood < 4 ? 'text-cad-yellow' : 'text-cad-text'
                    }>
                      {measurements.remainingWood.toFixed(1)}mm
                    </span>
                  </div>
                  {/* Depth bar */}
                  <div className="mt-2 h-1.5 rounded-full bg-cad-border overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(100, (measurements.depthAvailable / measurements.depthRequired) * 100)}%`,
                        background: measurements.depthAvailable >= measurements.depthRequired
                          ? 'linear-gradient(90deg, #22d3ee, #00b4d8)'
                          : 'linear-gradient(90deg, #f43f5e, #be123c)',
                      }}
                    />
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* ═══════════════════════════
              RIGHT COLUMN — Blueprint + Results
          ═════════════════════════════ */}
          <div className="space-y-5">
            {/* Blueprint SVG */}
            <Blueprint measurements={measurements} />

            {/* Results Panel */}
            <section
              aria-labelledby="results-heading"
              className="
                rounded-xl border border-cad-border bg-cad-panel
                overflow-hidden
              "
            >
              <div className="
                flex items-center gap-2 px-5 py-3
                border-b border-cad-border
                bg-gradient-to-r from-cad-blue/5 to-transparent
              ">
                <Cpu size={14} className="text-cad-blue" />
                <h2
                  id="results-heading"
                  className="text-cad-text text-xs font-semibold uppercase tracking-widest"
                >
                  Computed Measurements
                </h2>
                <span className="ml-auto text-[9px] text-cad-muted font-mono opacity-70">
                  Click value to copy
                </span>
              </div>

              <div className="p-4 space-y-2">
                {/* Cup hole */}
                <div className="text-[9px] text-cad-blue/60 font-mono uppercase tracking-widest px-1 pb-1 pt-2">
                  ── Cup Hole (35mm Forstner Bit) ──
                </div>
                <ResultRow
                  label="Cup Center — from Hinge Edge (X)"
                  value={measurements.cupCenterX}
                  accent="blue"
                  note="Horizontal from the hinge-side door edge"
                />
                <ResultRow
                  label="Bore Diameter"
                  value={measurements.cupDiameter}
                  accent="blue"
                  note="Use 35mm Forstner bit — no substitutes"
                />
                <ResultRow
                  label="Bore Depth"
                  value={measurements.boreDepth}
                  accent="blue"
                  note="Set drill press depth stop precisely"
                />
                <ResultRow
                  label="Remaining Door Thickness After Bore"
                  value={measurements.remainingWood}
                  accent={measurements.remainingWood < 4 ? 'orange' : 'muted'}
                  note="Must be ≥3mm for structural integrity"
                />

                {/* Screw holes */}
                <div className="text-[9px] text-cad-orange/60 font-mono uppercase tracking-widest px-1 pb-1 pt-3">
                  ── Mounting Screw Holes (4mm Pilot Bit) ──
                </div>
                <ResultRow
                  label="Left Screw — from Hinge Edge (X)"
                  value={measurements.screwLeftX}
                  accent="orange"
                  note="Left screw center, horizontal from edge"
                />
                <ResultRow
                  label="Right Screw — from Hinge Edge (X)"
                  value={measurements.screwRightX}
                  accent="orange"
                  note="Right screw center, horizontal from edge"
                />
                <ResultRow
                  label="Screw-to-Screw Spacing"
                  value={measurements.holeSpacing}
                  accent="orange"
                  note={`${measurements.brandSpec.label} standard spacing`}
                />
                <ResultRow
                  label="Vertical Offset — Screws Below Cup (ΔY)"
                  value={measurements.screwOffsetY}
                  accent="orange"
                  note="Screw center line is BELOW cup center line"
                />

                {/* Hinge positions */}
                <div className="text-[9px] text-cad-green/60 font-mono uppercase tracking-widest px-1 pb-1 pt-3">
                  ── Standard Hinge Vertical Positions (Y) ──
                </div>
                <ResultRow
                  label="Top Hinge — from Top Edge"
                  value={measurements.topHingeY}
                  accent="green"
                  note="Per BS EN 1935 standard"
                />
                <ResultRow
                  label="Bottom Hinge — from Bottom Edge"
                  value={measurements.bottomOffset}
                  accent="green"
                  note="Mirror of top hinge position"
                />
                <ResultRow
                  label="Overlay / Reveal"
                  value={measurements.overlayAmount}
                  accent="muted"
                  note={`${measurements.overlaySpec.label} door reveals ${measurements.overlayAmount}mm`}
                />
              </div>
            </section>

            {/* Warning Panel */}
            {(measurements.warnings.length > 0 || measurements.severity !== 'ok') && (
              <WarningPanel
                warnings={measurements.warnings}
                severity={measurements.severity}
                maxSafeK={measurements.maxSafeK}
                doorThickness={doorThickness}
              />
            )}
            {measurements.severity === 'ok' && measurements.warnings.length === 0 && (
              <WarningPanel
                warnings={[]}
                severity="ok"
                doorThickness={doorThickness}
              />
            )}
          </div>
        </div>

        {/* ── Affiliate Section ───────────────────────────── */}
        <div className="mt-8">
          <AffiliateButton brand={brand} />
        </div>

        {/* ── Divider ─────────────────────────────────────── */}
        <hr className="cad-divider my-12" />

        {/* ── How To Use (SEO content) ─────────────────────── */}
        <HowToUse />

        {/* ── FAQ (SEO content + Schema.org) ──────────────── */}
        <FAQ />
      </div>
    </main>
  );
}