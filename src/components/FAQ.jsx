import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQ_ITEMS = [
  {
    question: 'What is the K-value (Tab distance) on a 35mm hinge?',
    answer:
      'The K-value is the horizontal distance between the door edge and the edge of the hinge baseplate (mounting plate). It determines how far the door sits from the cabinet frame when closed. A K3 setting (3mm) gives minimal gap, while K5 (5mm) provides more clearance. For thick doors (22mm+), always use K3 or K4 to prevent the hinge arm from binding on the cabinet partition.',
  },
  {
    question: 'Why are there two different screw hole patterns for Blum vs Hettich?',
    answer:
      'Blum CLIP top hinges use a 45mm center-to-center mounting hole spacing with a 9.5mm vertical offset from the cup center. Hettich Intermat uses a 48mm spacing with only a 6mm offset. These are proprietary mounting systems — Blum mounting plates are NOT interchangeable with Hettich plates. Always use the matching brand baseplate for the hinge cup you\'re installing.',
  },
  {
    question: 'Can I use standard 35mm hinges on 22mm or 24mm thick doors?',
    answer:
      'For 22mm doors, standard hinges can work but require a K-value of maximum 4mm and careful bore depth control. The 13.5mm bore depth on a 22mm door leaves only 8.5mm of wood — structurally sufficient but worth verifying. For 24mm+ doors, you should use specialized thick-door hinges (e.g., Blum CLIP top for thick doors or Hettich Intermat 9944) which have a shallower cup or modified arm geometry to avoid interference.',
  },
  {
    question: 'What drill bit do I need to bore the 35mm cup hole?',
    answer:
      'You need a 35mm Forstner bit. Do NOT use a spade bit or hole saw — they produce rough, imprecise holes that cause the hinge cup to be loose or misaligned. For production work, use a dedicated hinge boring bit with a central point and razor scoring spurs. Sharpen or replace bits after every 200–300 holes to maintain clean edges without face veneer tearout.',
  },
  {
    question: 'What is the difference between full overlay, half overlay, and inset hinges?',
    answer:
      'Full overlay hinges are used when the door completely covers the cabinet face frame (standard in frameless/European cabinets). Half overlay is used on center partition walls where two adjacent doors each overlap the partition by 50%. Inset hinges are used when the door sits flush inside the cabinet opening — these require the highest precision and typically use a different face frame reveal dimension. The overlay type changes the cup center-to-door-edge distance (X position) in the drilling template.',
  },
  {
    question: 'How accurate are these measurements?',
    answer:
      'The measurements are calculated from Blum and Hettich official technical specifications and are accurate to 0.1mm. However, real-world results depend on: (1) your drill press runout (should be <0.1mm), (2) Forstner bit quality and sharpness, (3) door material consistency, and (4) your jig or fence accuracy. Always drill a test piece and verify with a caliper before production. The calculator accounts for standard manufacturing tolerances but not for worn tooling or inconsistent material.',
  },
  {
    question: 'What does "bore depth" mean and why does it matter?',
    answer:
      'Bore depth is how deep the 35mm Forstner bit cuts into the door face. Standard Blum requires 13.5mm, Hettich 13mm. Too shallow and the hinge cup will protrude from the door face preventing proper closure. Too deep and you risk breaking through a thin door or cutting into a glass/aluminum inlay. Set your drill press depth stop precisely. The remaining wood behind the bore (door thickness minus bore depth) should be at least 3mm for structural integrity.',
  },
  {
    question: 'How far from the door top/bottom should hinges be positioned?',
    answer:
      'Standard practice for residential cabinet doors is 100mm from each end (top and bottom). For doors taller than 1200mm, add a third hinge at center. For doors taller than 1800mm, use four hinges at 200mm intervals. Heavy doors (solid hardwood, glass-filled) should use 80mm end positioning to place the hinge closer to the structural corner of the door rail joint. This calculator shows top and bottom positions at 100mm as per BS EN 1935 standard.',
  },
];

function FAQItem({ question, answer, isOpen, onToggle }) {
  return (
    <div className="border border-cad-border rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className="
          w-full flex items-center justify-between gap-4
          px-5 py-4 text-left
          bg-cad-panel hover:bg-cad-border/30
          transition-colors duration-200
          focus:outline-none focus-visible:ring-1 focus-visible:ring-cad-blue
        "
      >
        <span className="text-cad-text text-sm font-medium">{question}</span>
        <span className="shrink-0 text-cad-muted">
          {isOpen
            ? <ChevronUp size={16} className="text-cad-blue" />
            : <ChevronDown size={16} />
          }
        </span>
      </button>

      {/* Animated panel */}
      <div
        className={`
          overflow-hidden transition-all duration-300
          ${isOpen ? 'max-h-96' : 'max-h-0'}
        `}
      >
        <div className="px-5 py-4 bg-cad-bg/50 border-t border-cad-border/50">
          <p className="text-cad-muted text-sm leading-relaxed">{answer}</p>
        </div>
      </div>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (idx) => setOpenIndex(prev => prev === idx ? null : idx);

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="max-w-5xl mx-auto px-4 pb-16"
    >
      {/* Section Header */}
      <div className="flex items-center gap-4 mb-10">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cad-border to-transparent" />
        <h2
          id="faq-heading"
          className="text-cad-orange font-mono text-xs uppercase tracking-[0.25em] whitespace-nowrap"
        >
          Frequently Asked Questions
        </h2>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cad-border to-transparent" />
      </div>

      {/* Schema.org FAQPage markup via aria */}
      <div
        itemScope
        itemType="https://schema.org/FAQPage"
        className="space-y-2"
      >
        {FAQ_ITEMS.map((item, idx) => (
          <div
            key={idx}
            itemScope
            itemProp="mainEntity"
            itemType="https://schema.org/Question"
          >
            <meta itemProp="name" content={item.question} />
            <div
              itemScope
              itemProp="acceptedAnswer"
              itemType="https://schema.org/Answer"
            >
              <meta itemProp="text" content={item.answer} />
            </div>
            <FAQItem
              question={item.question}
              answer={item.answer}
              isOpen={openIndex === idx}
              onToggle={() => toggle(idx)}
            />
          </div>
        ))}
      </div>
    </section>
  );
}