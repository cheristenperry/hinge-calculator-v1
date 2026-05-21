import React from 'react';
import { Target, Ruler, Drill, CheckSquare, Wrench, AlertCircle } from 'lucide-react';

const STEPS = [
  {
    icon: Target,
    title: 'Step 1: Select Your Hinge Brand & Type',
    body:
      'Choose your hinge brand (Blum CLIP top or Hettich Intermat). Different brands use different hole spacings: Blum uses a 45mm center-to-center spacing with a 9.5mm vertical offset, while Hettich uses 48mm with a 6mm offset. These are factory tolerances — using wrong values will result in the door not closing flush.',
  },
  {
    icon: Ruler,
    title: 'Step 2: Set Door Overlay Type',
    body:
      'Full overlay doors completely cover the cabinet face frame and are the most common in modern kitchens. Half overlay is used when two doors share a single partition panel. Inset (flush) doors sit inside the cabinet opening and require the most precise fitting. The overlay type changes the cup center-to-edge distance significantly.',
  },
  {
    icon: Wrench,
    title: 'Step 3: Enter Door Thickness & K-Value',
    body:
      'Standard cabinet doors are 16–19mm thick. The K-value (Tab distance) is the gap between the hinge baseplate and the door edge — typically 3–5mm. For thick doors (22mm+), keep K-value at 3mm to prevent the hinge arm from binding on the cabinet partition when opening.',
  },
  {
    icon: Drill,
    title: 'Step 4: Bore the 35mm Cup Hole',
    body:
      'Use a sharp 35mm Forstner bit in a drill press or with a hinge boring jig. Set depth stop to the bore depth shown in the results (typically 13–13.5mm). Drill perpendicular to the door face. Do NOT drill all the way through — the remaining wood behind the cup provides structural integrity.',
  },
  {
    icon: Target,
    title: 'Step 5: Drill Mounting Screw Holes',
    body:
      'The two mounting screw holes are NOT on the same horizontal line as the cup center. They are vertically offset (9.5mm for Blum, 6mm for Hettich). Use a sharp 4mm bit. These pilot holes prevent the door from splitting when the mounting screws are driven in.',
  },
  {
    icon: CheckSquare,
    title: 'Step 6: Install & Adjust',
    body:
      'Snap the hinge cup into the bore hole and secure with the mounting screws. Clip the hinge arm onto the cabinet side plate. Test door swing — it should open fully to 110°. Use the three-way adjustment screws to align the door: side-to-side, up-down, and depth (in-out).',
  },
];

export default function HowToUse() {
  return (
    <section
      id="how-to-use"
      aria-labelledby="how-to-use-heading"
      className="max-w-5xl mx-auto px-4 py-16"
    >
      {/* Section Header */}
      <div className="flex items-center gap-4 mb-10">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cad-border to-transparent" />
        <h2
          id="how-to-use-heading"
          className="text-cad-blue font-mono text-xs uppercase tracking-[0.25em] whitespace-nowrap"
        >
          How To Use This Calculator
        </h2>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cad-border to-transparent" />
      </div>

      {/* Intro paragraph for SEO */}
      <p className="text-cad-muted text-sm leading-relaxed mb-10 text-center max-w-3xl mx-auto">
        Installing 35mm European concealed hinges requires precise drilling. A mistake of just 1mm
        in cup position means the door won't close properly. This calculator generates a
        brand-specific drilling template based on industrial standards from Blum and Hettich.
      </p>

      {/* Steps grid */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {STEPS.map(({ icon: Icon, title, body }, idx) => (
          <article
            key={idx}
            className="
              relative rounded-xl border border-cad-border
              bg-cad-panel p-5 group
              hover:border-cad-blue/40 transition-colors duration-300
            "
          >
            {/* Step number */}
            <span className="
              absolute top-4 right-4 text-cad-muted/20 font-mono font-bold text-3xl
              group-hover:text-cad-blue/20 transition-colors
            ">
              {String(idx + 1).padStart(2, '0')}
            </span>

            {/* Icon */}
            <div className="
              w-9 h-9 rounded-lg bg-cad-blue/10 border border-cad-blue/20
              flex items-center justify-center mb-3
            ">
              <Icon size={18} className="text-cad-blue" />
            </div>

            <h3 className="text-cad-text text-sm font-semibold mb-2">{title}</h3>
            <p className="text-cad-muted text-xs leading-relaxed">{body}</p>
          </article>
        ))}
      </div>

      {/* Safety callout */}
      <div className="
        mt-8 flex items-start gap-3 p-4 rounded-lg
        bg-amber-950/30 border border-amber-800/40 text-amber-400/80 text-xs
      ">
        <AlertCircle size={15} className="shrink-0 mt-0.5" />
        <p>
          <strong className="text-amber-400">Professional Tip:</strong>{' '}
          Always drill a test piece from the same batch of board before drilling your
          finished door panels. MDF, plywood, and solid wood all respond differently to
          Forstner bits. Check hole diameter with a digital caliper — it must be exactly
          35.0mm ±0.2mm for the hinge cup to snap in correctly without being loose.
        </p>
      </div>
    </section>
  );
}