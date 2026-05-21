import React from 'react';
import { ExternalLink, Drill } from 'lucide-react';

/**
 * Amazon Affiliate CTA with FTC disclosure.
 * The href uses a placeholder affiliate tag — replace with your real associate ID.
 */
export default function AffiliateButton({ brand }) {
  // Craft a targeted search URL based on brand
  const searchQuery = encodeURIComponent(
    brand === 'blum'
      ? 'Blum 35mm Forstner bit concealed hinge drill'
      : brand === 'hettich'
      ? 'Hettich 35mm Forstner bit cabinet hinge'
      : '35mm Forstner bit concealed hinge set'
  );

  // Replace "yourstore-20" with your real Amazon Associate tag
  const affiliateUrl =
    `https://amzn.to/49haDYJ`;

  return (
    <div className="
      rounded-xl border border-cad-orange/30 bg-gradient-to-br
      from-orange-950/50 to-orange-900/20 p-5
    ">
      {/* Icon + Heading */}
      <div className="flex items-center gap-3 mb-3">
        <div className="
          w-10 h-10 rounded-lg bg-cad-orange/15 border border-cad-orange/30
          flex items-center justify-center shrink-0
        ">
          <Drill size={20} className="text-cad-orange" />
        </div>
        <div>
          <p className="text-cad-orange font-semibold text-sm">Recommended Tool</p>
          <p className="text-cad-muted text-xs">For this configuration</p>
        </div>
      </div>

      <p className="text-cad-text text-sm mb-4 leading-relaxed">
        A sharp 35mm Forstner bit is critical for clean, tear-out-free cup holes.
        Dull bits cause the door face to delaminate. Use a dedicated hinge-boring bit.
      </p>

      {/* CTA Button */}
      <a
        href={affiliateUrl}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="
          flex items-center justify-center gap-2.5
          w-full px-5 py-3 rounded-lg
          bg-cad-orange hover:bg-orange-500
          text-white font-semibold text-sm
          shadow-glow-orange hover:shadow-orange-500/50
          transition-all duration-200
          border border-orange-400/30
          group
        "
        aria-label="View recommended 35mm Forstner bit on Amazon (affiliate link)"
      >
        <Drill size={16} />
        <span>View Recommended 35mm Forstner Bit on Amazon</span>
        <ExternalLink
          size={13}
          className="opacity-70 group-hover:opacity-100 transition-opacity"
        />
      </a>

      {/* FTC Disclosure — REQUIRED */}
      <p className="mt-3 text-center text-cad-muted/60 text-xs">
        As an Amazon Associate I earn from qualifying purchases.
      </p>
    </div>
  );
}