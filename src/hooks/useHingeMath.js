import { useMemo } from 'react';

// ─────────────────────────────────────────────────────────────
// BRAND CONSTANTS
// ─────────────────────────────────────────────────────────────
export const BRAND_SPECS = {
  blum: {
    label:           'Blum (CLIP top)',
    cupDiameter:     35,
    holeSpacing:     45,     // vertical distance between the two screw holes (Y-axis)
    screwOffsetX:    9.5,    // horizontal offset: cup center → screw column (X-axis)
    minEdgeDistance: 3,
    boreDepth:       13.5,
    plateThickness:  1.5,
  },
  hettich: {
    label:           'Hettich (Intermat)',
    cupDiameter:     35,
    holeSpacing:     48,
    screwOffsetX:    6,
    minEdgeDistance: 3,
    boreDepth:       13,
    plateThickness:  1.6,
  },
  generic: {
    label:           'Generic / Universal',
    cupDiameter:     35,
    holeSpacing:     45,
    screwOffsetX:    8,
    minEdgeDistance: 3,
    boreDepth:       13,
    plateThickness:  1.5,
  },
};

// ─────────────────────────────────────────────────────────────
// OVERLAY TYPE DEFINITIONS
// ─────────────────────────────────────────────────────────────
export const OVERLAY_SPECS = {
  full: {
    label:          'Full Overlay',
    description:    'Door fully covers cabinet face frame',
    // How far the cabinet face frame sits FROM the hinge-side
    // door edge when the door is closed.
    // Full overlay: door extends 16mm past the face frame edge.
    // Face frame reference line X = cupCenterX - 16 (from door edge)
    cabinetFaceOffset: 16,
  },
  half: {
    label:          'Half Overlay',
    description:    'Door covers half of cabinet partition',
    cabinetFaceOffset: 8,
  },
  inset: {
    label:          'Inset (Flush)',
    description:    'Door sits flush inside cabinet opening',
    // For inset, the cabinet face frame is flush with door face.
    // The door edge is recessed 2mm behind the face frame.
    cabinetFaceOffset: -2,
  },
};

// ─────────────────────────────────────────────────────────────
// COLLISION DETECTION ENGINE
// ─────────────────────────────────────────────────────────────
function runCollisionDetection(doorThickness, kValue, brandSpec) {
  const warnings       = [];
  let   severity       = 'ok';
  const requiredDepth  = brandSpec.boreDepth + brandSpec.plateThickness;
  const availableDepth = doorThickness - kValue;
  const deficit        = requiredDepth - availableDepth;

  if (doorThickness >= 24) {
    severity = 'critical';
    warnings.push(
      '⛔ CRITICAL: Standard 35mm hinges will FAIL on doors ≥24mm thick. ' +
      'The hinge cup bore conflicts with door geometry at standard K-values. ' +
      'Specify THICK-DOOR profile hinges (e.g., Blum CLIP top Thick Door, ' +
      'Hettich Intermat 9944).'
    );
  } else if (doorThickness >= 22) {
    severity = 'warn';
    warnings.push(
      '⚠ CLEARANCE WARNING: Doors ≥22mm thick risk hinge binding. ' +
      'Keep Tab (K-value) at minimum (3mm) or use profile hinges. ' +
      'Verify cup bore does not breach rear face of door stile.'
    );
  }

  if (deficit > 0) {
    severity = 'critical';
    warnings.push(
      `⛔ GEOMETRY CONFLICT: At K=${kValue}mm on a ${doorThickness}mm door, ` +
      `the hinge requires ${requiredDepth.toFixed(1)}mm bore depth but only ` +
      `${availableDepth.toFixed(1)}mm is available. ` +
      `Reduce K-value or use a thicker door.`
    );
  }

  if (kValue < brandSpec.minEdgeDistance) {
    if (severity === 'ok') severity = 'warn';
    warnings.push(
      `⚠ EDGE PROXIMITY: K-value of ${kValue}mm is below the recommended ` +
      `minimum (${brandSpec.minEdgeDistance}mm). ` +
      `Risk of door edge splitting during bore.`
    );
  }

  if (doorThickness >= 22 && kValue > 4) {
    if (severity === 'ok') severity = 'warn';
    warnings.push(
      `⚠ K-VALUE RESTRICTION: For ${doorThickness}mm doors, ` +
      `maximum recommended K-value is 4mm (entered: ${kValue}mm). ` +
      `Exceeding this increases binding risk by ~${((kValue - 4) * 12).toFixed(0)}%.`
    );
  }

  const maxSafeK = Math.max(3, Math.min(7, Math.floor(doorThickness - requiredDepth)));
  return { warnings, severity, maxSafeK };
}

// ─────────────────────────────────────────────────────────────
// MAIN CALCULATION ENGINE
// ─────────────────────────────────────────────────────────────
function calculatePositions(brand, overlayType, doorThickness, kValue) {
  const brandSpec   = BRAND_SPECS[brand]        ?? BRAND_SPECS.generic;
  const overlaySpec = OVERLAY_SPECS[overlayType] ?? OVERLAY_SPECS.full;

  // ── Cup center X ───────────────────────────────────────────
  // Physical rule: cup center must clear the door edge by
  // exactly (cup radius + K-value). Overlay type does NOT
  // affect the bore position on the door face — it only
  // determines the cabinet-side arm setting.
  //
  //   cupCenterX = (cupDiameter / 2) + kValue
  //   e.g. 35mm cup, K=5: 17.5 + 5 = 22.5mm ✓
  //
  const cupCenterX = (brandSpec.cupDiameter / 2) + kValue;

  // ── Screw column X ─────────────────────────────────────────
  // The mounting flange sits deeper into the panel than the cup.
  // screwOffsetX is the horizontal distance from cup center
  // to the vertical screw center-line.
  const screwX = cupCenterX + brandSpec.screwOffsetX;

  // ── Screw Y offsets from cup center row ────────────────────
  // Both offsets are relative to cupCenterY (which varies per
  // hinge instance but is abstracted as 0 here).
  // Negative = above cup center, Positive = below cup center.
  const screwHalfSpacing   = brandSpec.holeSpacing / 2;
  const screwTopYOffset    = -screwHalfSpacing;   // e.g. -22.5mm for Blum
  const screwBottomYOffset = +screwHalfSpacing;   // e.g. +22.5mm for Blum

  // ── Overlay / cabinet face reference ───────────────────────
  // cabinetFaceOffset: how far the cabinet face frame sits
  // from the hinge-side door edge when door is closed.
  // Used by Blueprint to draw the reference line.
  const cabinetFaceOffset = overlaySpec.cabinetFaceOffset;

  // The X position of the cabinet face frame relative to
  // the door's hinge edge:
  //   cabinetFaceX = cupCenterX - cabinetFaceOffset
  // (frame sits "behind" the door overlap)
  const cabinetFaceX = cupCenterX - cabinetFaceOffset;

  // ── Bore depth analysis ────────────────────────────────────
  const boreDepth      = brandSpec.boreDepth;
  const remainingWood  = doorThickness - boreDepth;
  const depthRequired  = boreDepth + brandSpec.plateThickness;
  const depthAvailable = doorThickness - kValue;

  // ── Standard hinge row positions ──────────────────────────
  const topHingeY    = 100;
  const bottomOffset = 100;

  // ── Collision detection ────────────────────────────────────
  const collision = runCollisionDetection(doorThickness, kValue, brandSpec);

  // ── Overlay amount for display ─────────────────────────────
  const overlayAmount = cabinetFaceOffset;

  return {
    // ── Cup hole ─────────────────────────────────────────────
    cupCenterX,
    cupDiameter:   brandSpec.cupDiameter,
    boreDepth,

    // ── Screw holes — explicitly named for data consumers ────
    screwX,               // X from hinge edge to screw center-line
    screwTopYOffset,      // Y offset from cup center → top screw (negative = above)
    screwBottomYOffset,   // Y offset from cup center → bottom screw (positive = below)
    holeSpacing:     brandSpec.holeSpacing,   // vertical distance top↔bottom screw
    screwOffsetX:    brandSpec.screwOffsetX,  // horizontal cup→screw distance

    // ── Overlay / cabinet reference ───────────────────────────
    overlayType,
    overlayAmount,
    cabinetFaceOffset,
    cabinetFaceX,         // SVG: where to draw the cabinet face reference line

    // ── Hinge row positions ───────────────────────────────────
    topHingeY,
    bottomOffset,

    // ── Material analysis ─────────────────────────────────────
    remainingWood,
    depthRequired,
    depthAvailable,

    // ── Metadata ──────────────────────────────────────────────
    brandSpec,
    overlaySpec,
    brandKey:      brand,
    overlayKey:    overlayType,
    doorThickness,
    kValue,

    // ── Collision results ─────────────────────────────────────
    warnings:       collision.warnings,
    severity:       collision.severity,
    maxSafeK:       collision.maxSafeK,
    isGeometrySafe: collision.severity === 'ok',
  };
}

// ─────────────────────────────────────────────────────────────
// CUSTOM HOOK
// ─────────────────────────────────────────────────────────────
export function useHingeMath({ brand, overlayType, doorThickness, kValue }) {
  return useMemo(
    () => calculatePositions(brand, overlayType, doorThickness, kValue),
    [brand, overlayType, doorThickness, kValue]
  );
}

export { calculatePositions };