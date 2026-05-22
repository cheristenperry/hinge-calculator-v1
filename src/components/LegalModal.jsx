import React, { useEffect, useRef } from 'react';
import { X, Shield, FileText, ExternalLink } from 'lucide-react';

// ─────────────────────────────────────────────────────────────
// LEGAL CONTENT — Privacy Policy & Terms of Service
// Replace "HingeCalc" / "hingecalc.com" / dates as needed.
// ─────────────────────────────────────────────────────────────

const PRIVACY_POLICY = {
  title:        'Privacy Policy',
  icon:         Shield,
  effectiveDate:'January 1, 2025',
  sections: [
    {
      heading: '1. Introduction',
      body: `HingeCalc ("we", "us", or "our") operates the website https://www.hingecalc.com (the "Service"). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website. Please read this policy carefully. If you disagree with its terms, please discontinue use of the site.`,
    },
    {
      heading: '2. Information We Collect',
      body: `We do not require you to create an account or provide personal information to use the calculator. However, the following data may be collected automatically through third-party services embedded on this site:\n\n• Browser type and version\n• Operating system\n• Pages visited and time spent on each page\n• Referring URLs\n• General geographic location (country/region level, derived from IP address)\n• Device type (desktop, mobile, tablet)\n\nWe do not knowingly collect personally identifiable information (PII) such as your name, email address, or phone number.`,
    },
    {
      heading: '3. Google Analytics (GA4)',
      body: `This website uses Google Analytics 4 (GA4), a web analytics service provided by Google LLC ("Google"). Google Analytics uses cookies and similar tracking technologies to collect and analyze information about how visitors use the site. This data is transmitted to and stored by Google on servers in the United States.\n\nGoogle may use this data to evaluate your use of the website, compile reports on website activity for website operators, and provide other services relating to website activity and internet usage.\n\nGoogle's ability to use and share information collected by Google Analytics is restricted by the Google Analytics Terms of Service and the Google Privacy Policy (https://policies.google.com/privacy).\n\nYou may opt out of Google Analytics tracking by installing the Google Analytics Opt-out Browser Add-on available at https://tools.google.com/dlpage/gaoptout.`,
    },
    {
      heading: '4. Google AdSense & Advertising Cookies',
      body: `This website participates in the Google AdSense program, operated by Google LLC. Google AdSense uses cookies to serve personalized advertisements based on your prior visits to this website and other websites on the internet.\n\nGoogle's use of advertising cookies enables it and its partners to serve ads to you based on your visit to our site and/or other sites on the internet. You may opt out of personalized advertising by visiting https://www.google.com/settings/ads.\n\nThird-party vendors, including Google, use cookies to serve ads based on a user's prior visits to this website or other websites. You can also opt out of third-party vendor use of cookies for personalized advertising by visiting https://www.aboutads.info.\n\nWe comply with the IAB Transparency and Consent Framework and Google's Publisher Policies. Advertisements displayed on this site may be targeted based on content relevance, geographic location, or browsing history depending on your consent settings and applicable law.`,
    },
    {
      heading: '5. Amazon Associates Disclosure',
      body: `HingeCalc is a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com.\n\nWhen you click on affiliate links on this website and make a purchase, we may earn a small commission at no additional cost to you. These commissions help support the free operation of this tool.\n\nAs required by the Federal Trade Commission (FTC), we disclose that: "As an Amazon Associate I earn from qualifying purchases."\n\nWe only recommend products we believe are genuinely useful for the intended purpose. Affiliate relationships do not influence our calculator results, measurement outputs, or technical recommendations.`,
    },
    {
      heading: '6. Cookies',
      body: `We use the following categories of cookies:\n\n• Strictly Necessary Cookies: Required for the website to function. These cannot be disabled.\n• Analytics Cookies: Used by Google Analytics to understand how visitors interact with the site (see Section 3).\n• Advertising Cookies: Used by Google AdSense to deliver relevant advertisements (see Section 4).\n• Functional Cookies: Used to remember your preferences within a single session.\n\nYou can control and/or delete cookies as you wish. You can delete all cookies that are already on your computer and you can set most browsers to prevent them from being placed. If you do this, however, you may have to manually adjust some preferences every time you visit a site.`,
    },
    {
      heading: '7. Third-Party Links',
      body: `Our website contains links to third-party websites, including Amazon.com, Google, and manufacturer websites (Blum, Hettich). We have no control over the content and privacy practices of those sites and are not responsible for their privacy policies. We encourage you to review the privacy policy of every site you visit.`,
    },
    {
      heading: '8. Children\'s Privacy',
      body: `Our Service is not directed to children under the age of 13. We do not knowingly collect personally identifiable information from children under 13. If you are a parent or guardian and you are aware that your child has provided us with personal data, please contact us so we can take necessary action.`,
    },
    {
      heading: '9. Your Rights (GDPR / CCPA)',
      body: `Depending on your location, you may have the following rights regarding your personal data:\n\n• The right to access the personal data we hold about you\n• The right to request correction of inaccurate data\n• The right to request deletion of your data\n• The right to object to or restrict processing\n• The right to data portability\n• The right to withdraw consent at any time\n\nFor CCPA (California) residents: We do not sell your personal information. You have the right to know what personal information is collected and the right to non-discrimination for exercising your privacy rights.\n\nTo exercise any of these rights, please contact us using the information in Section 11.`,
    },
    {
      heading: '10. Changes to This Policy',
      body: `We reserve the right to update this Privacy Policy at any time. We will notify you of any changes by updating the "Effective Date" at the top of this page. Your continued use of the Service after any changes constitutes acceptance of the new Privacy Policy.`,
    },
    {
      heading: '11. Contact Us',
      body: `If you have questions or concerns about this Privacy Policy, please contact us at:\n\nHingeCalc\nWebsite: https://www.hingecalc.com\nEmail: privacy@hingecalc.com`,
    },
  ],
};

const TERMS_OF_SERVICE = {
  title:        'Terms of Service',
  icon:         FileText,
  effectiveDate:'January 1, 2025',
  sections: [
    {
      heading: '1. Acceptance of Terms',
      body: `By accessing and using https://www.hingecalc.com (the "Service"), you accept and agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you must immediately discontinue use of the Service. These Terms apply to all visitors, users, and others who access or use the Service.`,
    },
    {
      heading: '2. Description of Service',
      body: `HingeCalc provides a free, browser-based calculator tool designed to assist woodworkers, cabinet makers, and DIY enthusiasts in calculating approximate drill positions for 35mm European concealed hinges. The Service provides reference measurements based on publicly available industry standards from manufacturers including Blum and Hettich.`,
    },
    {
      heading: '3. DISCLAIMER OF WARRANTIES — INFORMATIONAL PURPOSE ONLY',
      body: `THE SERVICE AND ALL CONTENT, CALCULATIONS, MEASUREMENTS, AND INFORMATION PROVIDED THROUGH THE SERVICE ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS, WITHOUT ANY WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.\n\nHINGECALC EXPLICITLY DISCLAIMS ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO:\n\n• WARRANTIES OF MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE\n• WARRANTIES OF ACCURACY, COMPLETENESS, OR RELIABILITY OF ANY CALCULATION OR MEASUREMENT\n• WARRANTIES THAT THE SERVICE WILL MEET YOUR REQUIREMENTS\n• WARRANTIES THAT THE SERVICE WILL BE UNINTERRUPTED, TIMELY, SECURE, OR ERROR-FREE\n\nTHE CALCULATOR IS PROVIDED FOR INFORMATIONAL AND REFERENCE PURPOSES ONLY. IT IS NOT A SUBSTITUTE FOR PROFESSIONAL ENGINEERING ADVICE, MANUFACTURER SPECIFICATIONS, PROPER TOOLING, OR QUALIFIED INSTALLATION.`,
    },
    {
      heading: '4. CRITICAL LIABILITY DISCLAIMER — READ CAREFULLY',
      body: `BY USING THIS CALCULATOR, YOU EXPLICITLY ACKNOWLEDGE AND AGREE THAT:\n\n(a) MATERIAL DAMAGE: HingeCalc and its operators shall NOT be liable for any ruined, damaged, or destroyed materials — including but not limited to cabinet doors, door panels, face frames, veneer surfaces, MDF, plywood, solid hardwood, or any other wood or composite materials — resulting from drilling operations performed using measurements obtained from this Service.\n\n(b) INCORRECT DRILLING: HingeCalc shall NOT be liable for any incorrectly positioned, mis-sized, or misaligned drill holes, bores, or mortises resulting from reliance on this Service's output.\n\n(c) PROJECT FAILURE: HingeCalc shall NOT be liable for the failure of any carpentry project, cabinet installation, renovation, or construction work — whether residential, commercial, or otherwise — that relied in whole or in part on measurements from this Service.\n\n(d) TOOL AND EQUIPMENT DAMAGE: HingeCalc shall NOT be liable for damage to drill bits, drill presses, routers, CNC machines, or any other tools or equipment used in conjunction with measurements from this Service.\n\n(e) PERSONAL INJURY: HingeCalc shall NOT be liable for any personal injury, including cuts, lacerations, crush injuries, or other harm, resulting from woodworking operations undertaken using data from this Service.\n\n(f) FINANCIAL LOSS: HingeCalc shall NOT be liable for any direct, indirect, incidental, consequential, special, exemplary, or punitive financial losses, including but not limited to material costs, labor costs, replacement costs, lost revenue, or project delays.\n\nYOU ASSUME ALL RISK associated with the application of any measurements, calculations, or recommendations produced by this Service. ALWAYS VERIFY ALL MEASUREMENTS WITH A TEST PIECE BEFORE PRODUCTION DRILLING.`,
    },
    {
      heading: '5. Accuracy of Calculations',
      body: `While we make reasonable efforts to ensure the accuracy of our calculations based on publicly available Blum, Hettich, and generic hinge standards, we make no guarantee that:\n\n• Calculations are free from errors or omissions\n• Results are applicable to your specific hinge model or batch\n• Manufacturer specifications have not changed since the calculator was last updated\n• Your specific door material, density, or thickness variation is accounted for\n\nManufacturers periodically update their product specifications. Always cross-reference results with the official installation documentation provided with your specific hinge product. Hinge specifications can vary between product generations, regional variants, and individual SKUs.`,
    },
    {
      heading: '6. User Responsibilities',
      body: `You are solely responsible for:\n\n• Verifying all measurements against physical test pieces before production use\n• Using appropriate, calibrated, and properly maintained tools\n• Following all safety guidelines for woodworking operations\n• Cross-referencing results with manufacturer installation instructions\n• Ensuring your skill level is appropriate for the planned work\n• Compliance with any applicable building codes, safety regulations, or professional standards in your jurisdiction`,
    },
    {
      heading: '7. Affiliate Links & Commercial Relationships',
      body: `The Service contains affiliate links to Amazon.com and potentially other retailers. When you click these links and make a purchase, we may receive a commission. This does not affect the price you pay. Our commercial relationships do not influence the technical accuracy or output of the calculator. See our Privacy Policy for full disclosure.`,
    },
    {
      heading: '8. Intellectual Property',
      body: `The Service, including its design, code, text, graphics, and user interface, is owned by HingeCalc and is protected by applicable intellectual property laws. You may use the Service for personal and commercial woodworking projects. You may not copy, reproduce, distribute, or create derivative works from the Service's source code or design without explicit written permission.`,
    },
    {
      heading: '9. Limitation of Liability',
      body: `TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL HINGECALC, ITS OPERATORS, CONTRIBUTORS, OR AFFILIATES BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM YOUR ACCESS TO OR USE OF (OR INABILITY TO ACCESS OR USE) THE SERVICE.\n\nIN JURISDICTIONS THAT DO NOT ALLOW THE EXCLUSION OF CERTAIN WARRANTIES OR THE LIMITATION OF LIABILITY FOR CERTAIN TYPES OF DAMAGES, OUR LIABILITY SHALL BE LIMITED TO THE MAXIMUM EXTENT PERMITTED BY LAW.`,
    },
    {
      heading: '10. Governing Law',
      body: `These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to its conflict of law provisions. Any disputes arising from these Terms or the use of the Service shall be subject to the exclusive jurisdiction of the courts located in the United States.`,
    },
    {
      heading: '11. Changes to Terms',
      body: `We reserve the right to modify or replace these Terms at any time. We will indicate the date of the most recent update at the top of this page. Your continued use of the Service after any changes constitutes acceptance of the revised Terms.`,
    },
    {
      heading: '12. Contact',
      body: `For questions about these Terms of Service, please contact:\n\nHingeCalc\nWebsite: https://www.hingecalc.com\nEmail: legal@hingecalc.com`,
    },
  ],
};

// ─────────────────────────────────────────────────────────────
// DOCUMENT MAP
// ─────────────────────────────────────────────────────────────
const DOCUMENTS = {
  privacy: PRIVACY_POLICY,
  terms:   TERMS_OF_SERVICE,
};

// ─────────────────────────────────────────────────────────────
// LEGAL MODAL COMPONENT
// ─────────────────────────────────────────────────────────────
export default function LegalModal({ isOpen, documentType, onClose }) {
  const scrollRef   = useRef(null);
  const closeRef    = useRef(null);
  const doc         = DOCUMENTS[documentType];

  // ── Keyboard: Escape to close ───────────────────────────────
  useEffect(() => {
    if (!isOpen) return;

    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  // ── Lock body scroll while modal is open ───────────────────
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Focus the close button for accessibility
      setTimeout(() => closeRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // ── Scroll content back to top when document type switches ─
  useEffect(() => {
    if (isOpen && scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [documentType, isOpen]);

  if (!isOpen || !doc) return null;

  const IconComponent = doc.icon;

  return (
    /* ── Backdrop ── */
    <div
      className="
        fixed inset-0 z-50
        bg-black/75 backdrop-blur-sm
        flex items-center justify-center
        p-4 sm:p-6 lg:p-10
      "
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* ── Modal panel ── */}
      <div className="
        relative w-full max-w-3xl max-h-[90vh]
        flex flex-col
        bg-slate-900
        border border-slate-700
        rounded-2xl
        shadow-[0_0_60px_rgba(0,0,0,0.8),0_0_0_1px_rgba(0,180,216,0.08)]
        overflow-hidden
      ">

        {/* ── Header ─────────────────────────────────────── */}
        <div className="
          flex items-center gap-3 shrink-0
          px-6 py-4
          border-b border-slate-700/80
          bg-slate-800/60
        ">
          {/* Icon */}
          <div className="
            w-9 h-9 rounded-lg
            bg-cyan-500/10 border border-cyan-500/20
            flex items-center justify-center shrink-0
          ">
            <IconComponent size={18} className="text-cyan-400" />
          </div>

          {/* Title block */}
          <div className="flex-1 min-w-0">
            <h2
              id="legal-modal-title"
              className="
                text-slate-100 font-semibold text-base
                font-mono leading-tight
              "
            >
              {doc.title}
            </h2>
            <p className="text-slate-500 text-xs font-mono mt-0.5">
              Effective Date: {doc.effectiveDate} — hingecalc.com
            </p>
          </div>

          {/* Close button */}
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Close modal"
            className="
              shrink-0 w-8 h-8 rounded-lg
              flex items-center justify-center
              text-slate-500 hover:text-slate-200
              bg-transparent hover:bg-slate-700/70
              border border-transparent hover:border-slate-600
              transition-all duration-150
              focus:outline-none focus-visible:ring-2
              focus-visible:ring-cyan-500/60
            "
          >
            <X size={16} />
          </button>
        </div>

        {/* ── Scrollable content area ─────────────────────── */}
        <div
          ref={scrollRef}
          className="
            flex-1 overflow-y-auto
            px-6 py-6
            scroll-smooth
          "
          style={{ scrollbarWidth: 'thin', scrollbarColor: '#334155 #0f172a' }}
        >
          {/* Introduction line */}
          <p className="
            text-slate-400 text-xs font-mono leading-relaxed
            mb-6 pb-4 border-b border-slate-800
          ">
            Please read this {doc.title.toLowerCase()} carefully before using HingeCalc.
          </p>

          {/* Sections */}
          <div className="space-y-7">
            {doc.sections.map((section, idx) => (
              <section key={idx}>
                {/* Section heading */}
                <h3 className="
                  text-slate-200 font-mono font-semibold text-sm
                  mb-2.5
                  pb-1.5 border-b border-slate-800
                ">
                  {section.heading}
                </h3>

                {/* Section body — render line breaks from \n */}
                <div className="space-y-2">
                  {section.body.split('\n').map((paragraph, pIdx) => {
                    // Empty string from double \n → visual spacer
                    if (paragraph.trim() === '') {
                      return <div key={pIdx} className="h-1" />;
                    }
                    // Bullet points
                    if (paragraph.trim().startsWith('•')) {
                      return (
                        <p
                          key={pIdx}
                          className="
                            text-slate-400 text-xs font-mono leading-relaxed
                            pl-4
                          "
                        >
                          {paragraph}
                        </p>
                      );
                    }
                    // All-caps block = legal warning emphasis
                    const isLegalWarning =
                      paragraph.trim().length > 20 &&
                      paragraph.trim() === paragraph.trim().toUpperCase() &&
                      /[A-Z]{5,}/.test(paragraph);

                    return (
                      <p
                        key={pIdx}
                        className={`
                          text-xs font-mono leading-relaxed
                          ${isLegalWarning
                            ? 'text-amber-400/80 font-semibold'
                            : 'text-slate-400'
                          }
                        `}
                      >
                        {paragraph}
                      </p>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>

          {/* Bottom padding buffer */}
          <div className="h-6" />
        </div>

        {/* ── Footer ─────────────────────────────────────── */}
        <div className="
          shrink-0 flex items-center justify-between gap-4
          px-6 py-3
          border-t border-slate-700/80
          bg-slate-800/40
        ">
          <p className="text-slate-600 text-xs font-mono">
            © {new Date().getFullYear()} HingeCalc — All rights reserved.
          </p>
          <button
            onClick={onClose}
            className="
              px-4 py-1.5 rounded-lg
              bg-slate-700 hover:bg-slate-600
              border border-slate-600 hover:border-slate-500
              text-slate-300 hover:text-slate-100
              text-xs font-mono font-medium
              transition-all duration-150
              focus:outline-none focus-visible:ring-2
              focus-visible:ring-cyan-500/60
            "
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}