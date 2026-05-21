import React from 'react';
import { AlertTriangle, XCircle, CheckCircle2, ShieldAlert } from 'lucide-react';

/**
 * Renders the collision-detection warning panel.
 * severity: 'ok' | 'warn' | 'critical'
 */
export default function WarningPanel({ warnings, severity, maxSafeK, doorThickness }) {
  if (severity === 'ok' && warnings.length === 0) {
    return (
      <div className="
        flex items-center gap-3 px-4 py-3 rounded-lg
        bg-emerald-950/40 border border-emerald-800/50
        text-emerald-400 text-xs font-mono
      ">
        <CheckCircle2 size={16} className="shrink-0" />
        <span>
          Geometry validated — No interference detected for {doorThickness}mm door.
          Bore depth and K-value are within safe tolerances.
        </span>
      </div>
    );
  }

  const isCritical = severity === 'critical';

  return (
    <div className={`
      rounded-lg border font-mono text-xs overflow-hidden
      ${isCritical
        ? 'bg-rose-950/50 border-rose-700/60'
        : 'bg-amber-950/50 border-amber-700/60'
      }
    `}>
      {/* Header bar */}
      <div className={`
        flex items-center gap-2 px-4 py-2.5 border-b
        ${isCritical
          ? 'bg-rose-900/40 border-rose-700/40 text-rose-400'
          : 'bg-amber-900/40 border-amber-700/40 text-amber-400'
        }
      `}>
        {isCritical
          ? <XCircle size={15} className="shrink-0" />
          : <ShieldAlert size={15} className="shrink-0" />
        }
        <span className="font-semibold uppercase tracking-wider">
          {isCritical ? 'Critical — Geometry Failure' : 'Interference Warning'}
        </span>
        {maxSafeK !== undefined && (
          <span className="ml-auto opacity-70">
            Max safe K-value: <strong>{maxSafeK}mm</strong>
          </span>
        )}
      </div>

      {/* Warning list */}
      <ul className="divide-y divide-white/5">
        {warnings.map((w, i) => (
          <li key={i} className={`
            flex items-start gap-3 px-4 py-3
            ${isCritical ? 'text-rose-300' : 'text-amber-300'}
          `}>
            <AlertTriangle size={13} className="shrink-0 mt-0.5" />
            <span className="leading-relaxed">{w}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}