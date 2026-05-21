import { useMemo } from 'react';

// ─────────────────────────────────────────────────────────────
// BRAND CONSTANTS — Industrial Standards
// ─────────────────────────────────────────────────────────────
export const BRAND_SPECS = {
  blum: {
    label:             'Blum (CLIP top)',
    cupDiameter:       35,
    holeSpacing:       45,    // mm — center-to-center between mount screws
    screwOffsetY:      9.5,   // mm — vertical offset of screw line BELOW cup center
    minEdgeDistance:   3,     // mm — absolute minimum from door edge to cup center
    boreDepth:         13.5,  // mm — standard bore depth
    plateThickness:    1.5,
  },
  hettich: {
    label:             'Hettich (Intermat)',
    cupDiameter:       35,
    holeSpacing:       48,
    screwOffsetY:      6,
    minEdgeDistance:   3,
    boreDepth:         13,
    plateThickness:    1.6,
  },
  generic: {
    label:             'Generic / Universal',
    cupDiameter:       35,
    holeSpacing:       45,
    screwOffsetY:      8,
    minEdgeDistance:   3,
    boreDepth:         13,
    plateThickness:    1.5,
  },
};

// ─────────────────────────────────────────────────────────────
// OVERLAY TYPE DEFINITIONS
// ─────────────────────────────────────────────────────────────
export const OVERLAY_SPECS = {
  full: {
    label:       'Full Overlay',
    description: 'Door fully covers cabinet face frame',
    // Cup center from door edge = (cupRadius) + edgeClearance + kAdjustment
    // For full overlay: typically 37mm from door edge
    baseEdgeOffset: 37,
  },
  half: {
    label:       'Half Overlay',
    description: 'Door covers half of cabinet partition',
    baseEdgeOffset: 28,
  },
  inset: {
    label:       'Inset (Flush)',
    description: 'Door sits flush inside cabinet opening',
    baseEdgeOffset: 22,
  },
};

// ─────────────────────────────────────────────────────────────
// INTERFERENCE / COLLISION DETECTION ENGINE
// ─────────────────────────────────────────────────────────────

/**
 * Analyzes door thickness against hinge geometry to detect
 * physical interference between the hinge cup and door edge.
 *
 * Physics model:
 *   Available depth = doorThickness - kValue
 *   Required depth  = boreDepth + plateThickness
 *   Interference    = requiredDepth > availableDepth
 *
 * @param {number} doorThickness  - mm
 * @param {number} kValue         - Tab (K-value) in mm
 * @param {object} brandSpec      - Brand spec object
 * @returns {{ warnings: string[], severity: 'ok'|'warn'|'critical', maxSafeK: number }}
 */
function runCollisionDetection(doorThickness, kValue, brandSpec) {
  const warnings = [];
  let severity = 'ok';

  const requiredDepth = brandSpec.boreDepth + brandSpec.plateThickness;
  const availableDepth = doorThickness - kValue;
  const deficit = requiredDepth - availableDepth;

  // ── Thick door thresholds ──────────────────────────────────
  if (doorThickness >= 24) {
    severity = 'critical';
    warnings.push(
      '⛔ CRITICAL: Standard 35mm hinges will FAIL on doors ≥24mm thick. ' +
      'Hinge cup bore (13.5mm) conflicts with door geometry at standard K-values. ' +
      'Specify THICK-DOOR profile hinges (e.g., Blum CLIP top Thick Door, Hettich Intermat 9944).'
    );
  } else if (doorThickness >= 22) {
    severity = severity === 'critical' ? 'critical' : 'warn';
    warnings.push(
      '⚠ CLEARANCE WARNING: Doors ≥22mm thick risk hinge binding. ' +
      'Keep Tab (K-value) at minimum (3mm) or use profile hinges. ' +
      'Verify cup bore does not breach rear face of door stile.'
    );
  }

  // ── K-value vs depth interference ─────────────────────────
  if (deficit > 0) {
    severity = 'critical';
    warnings.push(
      `⛔ GEOMETRY CONFLICT: At K=${kValue}mm on ${doorThickness}mm door, ` +
      `the hinge requires ${requiredDepth.toFixed(1)}mm bore depth but only ` +
      `${availableDepth.toFixed(1)}mm is available. Reduce K-value or increase door thickness.`
    );
  }

  // ── Minimum edge distance check ───────────────────────────
  const cupCenterFromEdge = brandSpec.cupDiameter / 2 + brandSpec.minEdgeDistance;
  if (kValue < brandSpec.minEdgeDistance) {
    severity = severity === 'critical' ? 'critical' : 'warn';
    warnings.push(
      `⚠ EDGE PROXIMITY: K-value of ${kValue}mm is below the recommended minimum ` +
      `edge distance (${brandSpec.minEdgeDistance}mm). Risk of door edge splitting during bore.`
    );
  }

  // ── Calculate maximum safe K for this door thickness ──────
  const maxSafeK = Math.max(3, Math.min(7, doorThickness - requiredDepth));

  // ── K restriction for thick doors ─────────────────────────
  if (doorThickness >= 22 && kValue > 4) {
    severity = severity === 'critical' ? 'critical' : 'warn';
    warnings.push(
      `⚠ K-VALUE RESTRICTION: For ${doorThickness}mm doors, ` +
      `maximum recommended K-value is 4mm (you entered ${kValue}mm). ` +
      `Exceeding this increases binding risk by ${((kValue - 4) * 12).toFixed(0)}%.`
    );
  }

  return { warnings, severity, maxSafeK };
}

// ─────────────────────────────────────────────────────────────
// MAIN CALCULATION ENGINE
// ─────────────────────────────────────────────────────────────

/**
 * Computes all drill positions and metadata for a 35mm hinge installation.
 *
 * Coordinate system (all in mm, origin = top-left corner of door face):
 *   X = horizontal distance from door SIDE EDGE (the edge being hinged)
 *   Y = vertical distance from door TOP edge (changes per hinge position)
 *
 * For the cup hole:
 *   X_cup = overlaySpec.baseEdgeOffset + kValue
 *
 * For the two mounting screw holes (horizontally away from cup center):
 *   X_screwLeft  = X_cup - holeSpacing/2
 *   X_screwRight = X_cup + holeSpacing/2
 *   Y_screw      = Y_cup + screwOffsetY   (offset BELOW cup center line)
 *
 * Standard hinge positions from top of door:
 *   Top hinge:    100mm from top
 *   Bottom hinge: 100mm from bottom (represented as negative offset)
 *   Middle hinge: geometric center (only shown when door > 1200mm)
 */
function calculatePositions(brand, overlayType, doorThickness, kValue) {
  const brandSpec   = BRAND_SPECS[brand]   ?? BRAND_SPECS.generic;
  const overlaySpec = OVERLAY_SPECS[overlayType] ?? OVERLAY_SPECS.full;

  // ── Cup hole X position from hinge-side edge ───────────────
  const cupCenterX = overlaySpec.baseEdgeOffset + kValue;

  // ── Mounting screw positions (horizontal from cup center) ──
  const screwLeftX  = cupCenterX - brandSpec.holeSpacing / 2;
  const screwRightX = cupCenterX + brandSpec.holeSpacing / 2;

  // ── Vertical offset of screw holes from cup center line ────
  //    Screws are BELOW the cup center (toward door interior)
  const screwOffsetY = brandSpec.screwOffsetY;

  // ── Standard vertical positions (from top of door) ─────────
  const hingePositions = [
    { id: 'top',    yFromTop: 100,  label: 'Top Hinge',    note: '100mm from top edge' },
    { id: 'bottom', yFromTop: null, label: 'Bottom Hinge', note: '100mm from bottom edge' },
  ];

  // ── Effective overlap / reveal ─────────────────────────────
  //    How much the door overlaps the cabinet face
  let overlayAmount;
  switch (overlayType) {
    case 'full':  overlayAmount = 16; break;   // full overlay (one door side)
    case 'half':  overlayAmount = 8;  break;   // half partition
    case 'inset': overlayAmount = -2; break;   // inset (door is narrower than opening)
    default:      overlayAmount = 16;
  }

  // ── Bore details ───────────────────────────────────────────
  const boreDepth      = brandSpec.boreDepth;
  const remainingWood  = doorThickness - boreDepth;

  // ── Quality checks ─────────────────────────────────────────
  const collision = runCollisionDetection(doorThickness, kValue, brandSpec);

  return {
    // Core measurements
    cupCenterX,
    screwLeftX,
    screwRightX,
    screwOffsetY,
    holeSpacing:    brandSpec.holeSpacing,
    cupDiameter:    brandSpec.cupDiameter,
    boreDepth,
    remainingWood,
    overlayAmount,

    // Hinge row positions
    hingePositions,
    topHingeY:    100,
    bottomOffset: 100,   // from bottom edge

    // Brand metadata
    brandSpec,
    overlaySpec,
    brandKey:     brand,
    overlayKey:   overlayType,
    doorThickness,
    kValue,

    // Collision analysis
    warnings:    collision.warnings,
    severity:    collision.severity,
    maxSafeK:    collision.maxSafeK,

    // Derived safety metrics
    isGeometrySafe: collision.severity === 'ok',
    depthAvailable: doorThickness - kValue,
    depthRequired:  boreDepth + brandSpec.plateThickness,
  };
}

// ─────────────────────────────────────────────────────────────
// CUSTOM HOOK
// ─────────────────────────────────────────────────────────────

/**
 * useHingeMath — Core calculation hook
 *
 * @param {object} params
 * @param {string} params.brand          - 'blum' | 'hettich' | 'generic'
 * @param {string} params.overlayType    - 'full' | 'half' | 'inset'
 * @param {number} params.doorThickness  - mm (16–26)
 * @param {number} params.kValue         - mm (3–7)
 *
 * @returns {object} Complete measurement set + warnings
 */
export function useHingeMath({ brand, overlayType, doorThickness, kValue }) {
  return useMemo(
    () => calculatePositions(brand, overlayType, doorThickness, kValue),
    [brand, overlayType, doorThickness, kValue]
  );
}

// Named export of raw calculator for use outside React
export { calculatePositions };