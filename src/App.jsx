import React, { useEffect } from 'react';
import { Routes, Route, useParams, Link } from 'react-router-dom';
import Calculator from './components/Calculator.jsx';

// ─────────────────────────────────────────────────────────────
// SEO ROUTE CONFIG — maps URL segments to calculator defaults
// ─────────────────────────────────────────────────────────────
const ROUTE_CONFIGS = {
  // brand slug → internal key
  brandMap: {
    blum:    'blum',
    hettich: 'hettich',
    generic: 'generic',
  },
  // overlay slug → internal key
  overlayMap: {
    'full-overlay': 'full',
    'half-overlay': 'half',
    'inset':        'inset',
  },
};

// Human-readable labels for SEO title/h1 generation
const BRAND_LABELS    = { blum: 'Blum',    hettich: 'Hettich', generic: 'Generic' };
const OVERLAY_LABELS  = { full: 'Full Overlay', half: 'Half Overlay', inset: 'Inset' };

// ─────────────────────────────────────────────────────────────
// POPULAR CONFIGS — hardcoded for Google crawler discovery
// ─────────────────────────────────────────────────────────────
const POPULAR_LINKS = [
  { to: '/blum-full-overlay-hinge-calculator',    label: 'Blum Full Overlay Hinge Calculator'    },
  { to: '/blum-half-overlay-hinge-calculator',    label: 'Blum Half Overlay Hinge Calculator'    },
  { to: '/blum-inset-hinge-calculator',           label: 'Blum Inset Hinge Calculator'           },
  { to: '/hettich-full-overlay-hinge-calculator', label: 'Hettich Full Overlay Hinge Calculator' },
  { to: '/hettich-half-overlay-hinge-calculator', label: 'Hettich Half Overlay Hinge Calculator' },
  { to: '/hettich-inset-hinge-calculator',        label: 'Hettich Inset Hinge Calculator'        },
  { to: '/generic-full-overlay-hinge-calculator', label: 'Generic Full Overlay Hinge Calculator' },
  { to: '/generic-inset-hinge-calculator',        label: 'Generic Inset Hinge Calculator'        },
];

// ─────────────────────────────────────────────────────────────
// SEO ROUTE WRAPPER — parses URL params, sets document.title
// ─────────────────────────────────────────────────────────────
function SEOCalculatorRoute() {
  const { slug } = useParams();

  // Parse "blum-full-overlay-hinge-calculator" → brand + overlay
  const parsedConfig = React.useMemo(() => {
    if (!slug) return { brand: 'blum', overlayType: 'full', brandLabel: 'Blum', overlayLabel: 'Full Overlay' };

    let detectedBrand   = 'blum';
    let detectedOverlay = 'full';

    // Match brand at start of slug
    for (const [slugKey, internalKey] of Object.entries(ROUTE_CONFIGS.brandMap)) {
      if (slug.startsWith(slugKey)) {
        detectedBrand = internalKey;
        break;
      }
    }

    // Match overlay type anywhere in slug
    for (const [slugKey, internalKey] of Object.entries(ROUTE_CONFIGS.overlayMap)) {
      if (slug.includes(slugKey)) {
        detectedOverlay = internalKey;
        break;
      }
    }

    return {
      brand:        detectedBrand,
      overlayType:  detectedOverlay,
      brandLabel:   BRAND_LABELS[detectedBrand]   ?? 'Blum',
      overlayLabel: OVERLAY_LABELS[detectedOverlay] ?? 'Full Overlay',
    };
  }, [slug]);

  // ── Dynamic document.title for SEO ──────────────────────────
  useEffect(() => {
    const { brandLabel, overlayLabel } = parsedConfig;
    document.title =
      `${brandLabel} ${overlayLabel} 35mm Hinge Calculator — Free Template Generator`;

    // Update meta description dynamically
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content =
      `Free ${brandLabel} ${overlayLabel} 35mm concealed hinge drilling template. ` +
      `Get exact cup hole position, screw hole positions, and K-value settings for perfect cabinet door installation.`;
  }, [parsedConfig]);

  return (
    <Calculator
      defaultBrand={parsedConfig.brand}
      defaultOverlay={parsedConfig.overlayType}
      seoTitle={`${parsedConfig.brandLabel} ${parsedConfig.overlayLabel} 35mm Hinge Template`}
    />
  );
}

// ─────────────────────────────────────────────────────────────
// POPULAR CONFIGURATIONS FOOTER (crawler link farm)
// ─────────────────────────────────────────────────────────────
function PopularConfigurations() {
  return (
    <footer className="border-t border-cad-border mt-16 py-12 px-4 bg-cad-panel">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-cad-muted text-xs font-mono uppercase tracking-widest mb-6">
          Popular Hinge Configurations
        </h2>
        <nav aria-label="Popular hinge calculator configurations">
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {POPULAR_LINKS.map(({ to, label }) => (
              <li key={to}>
                <Link
                  to={to}
                  className="
                    block text-xs text-cad-muted hover:text-cad-blue
                    underline underline-offset-2 decoration-cad-border
                    hover:decoration-cad-blue transition-colors duration-200
                    py-1
                  "
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-10 pt-6 border-t border-cad-border text-center text-cad-muted text-xs space-y-1">
          <p>35mm Hinge Template Generator — Professional Cabinet Making Tool</p>
          <p>© {new Date().getFullYear()} HingeCalc. All measurements in millimeters.</p>
          <p className="text-cad-muted/50">
            Always verify measurements with a test piece before production drilling.
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────────────────────────
// ROOT APP — Router definition
// ─────────────────────────────────────────────────────────────
export default function App() {
  return (
    <div className="min-h-screen cad-grid-bg flex flex-col">
      <Routes>
        {/* Default route — Blum full overlay defaults */}
        <Route path="/" element={
          <>
            <Calculator
              defaultBrand="blum"
              defaultOverlay="full"
              seoTitle="35mm Concealed Hinge Template Generator"
            />
            <PopularConfigurations />
          </>
        } />

        {/* Programmatic SEO routes — e.g. /blum-full-overlay-hinge-calculator */}
        <Route path="/:slug" element={
          <>
            <SEOCalculatorRoute />
            <PopularConfigurations />
          </>
        } />
      </Routes>
    </div>
  );
}