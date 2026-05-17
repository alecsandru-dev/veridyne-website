// shared-components.jsx
// Logos, icons, nav, footer, mobile menu — shared between Veridyne + Keystone pages.

// ─── Brand marks ───────────────────────────────────────────────────────────
// Veridyne symbol mark — official logo. The PNG is square with slate bg,
// so we drop it in unwrapped and just round the corners.
const VeridyneMark = ({ size = 32, alt = "Veridyne" }) => (
  <img src="logos/veridyne-symbol.png" alt={alt}
       width={size} height={size}
       style={{ display: 'block', borderRadius: 7, objectFit: 'cover' }} />
);

// Veridyne full lockup (symbol stacked over wordmark, transparent bg)
const VeridyneLockup = ({ height = 64, alt = "Veridyne Solutions" }) => (
  <img src="logos/veridyne-lockup.png" alt={alt}
       style={{ display: 'block', height: height, width: 'auto' }} />
);

// Program marks — simple, universally-readable icons.
// Keystone: filled trapezoid (literal architectural keystone).
const KeystoneMark = ({ size = 16, color = "currentColor" }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none">
    <path d="M8 5 L16 5 L19 19 L5 19 Z"
          fill={color} fillOpacity="0.18"
          stroke={color} strokeWidth="1.6" strokeLinejoin="round" />
  </svg>
);

// Continuum: infinity loop — universal "continuous, ongoing".
const ContinuumMark = ({ size = 16, color = "currentColor" }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none">
    <path d="M 7 12 A 3.5 3.5 0 1 1 12 12 A 3.5 3.5 0 1 0 17 12 A 3.5 3.5 0 1 1 12 12 A 3.5 3.5 0 1 0 7 12 Z"
          stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Catalyst: lightning bolt — spark / transformation.
const CatalystMark = ({ size = 16, color = "currentColor" }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none">
    <path d="M13 2 L4 13 L11 13 L10 22 L20 11 L13 11 Z"
          fill={color} fillOpacity="0.18"
          stroke={color} strokeWidth="1.6" strokeLinejoin="round" />
  </svg>
);

// Synapse: three connected nodes — neural / AI connection.
const SynapseMark = ({ size = 16, color = "currentColor" }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none">
    <path d="M 6.5 7 L 17.5 7 M 17.5 7 L 12 18 M 12 18 L 6.5 7"
          stroke={color} strokeWidth="1.4" strokeLinecap="round" />
    <circle cx="6.5" cy="7" r="2.4" fill={color} fillOpacity="0.18" stroke={color} strokeWidth="1.6" />
    <circle cx="17.5" cy="7" r="2.4" fill={color} fillOpacity="0.18" stroke={color} strokeWidth="1.6" />
    <circle cx="12" cy="18" r="2.4" fill={color} fillOpacity="0.18" stroke={color} strokeWidth="1.6" />
  </svg>
);

// Large architectural illustration — arch with 5 named program stones.
// active: "veridyne" | "keystone" | "continuum" | "catalyst" | "synapse"
// Each stone sits at an even index (0,2,4,6,8) across the 9-stone arch;
// odd-index stones are neutral spacers.
const KeystoneIllustration = ({ active = "veridyne" }) => {
  const PROG_STONES = [
    { key: "veridyne",  label: "VERIDYNE",  color: "#B4632A",
      fill: "rgba(180,99,42,0.60)",  dimFill: "rgba(180,99,42,0.07)",
      stroke: "rgba(180,99,42,0.90)", dimStroke: "rgba(180,99,42,0.30)",
      shadow: "rgba(180,99,42,0.45)", idx: 0 },
    { key: "keystone",  label: "KEYSTONE",  color: "#9E7B3B",
      fill: "rgba(158,123,59,0.60)", dimFill: "rgba(158,123,59,0.07)",
      stroke: "rgba(158,123,59,0.90)",dimStroke: "rgba(158,123,59,0.30)",
      shadow: "rgba(158,123,59,0.45)",idx: 2 },
    { key: "continuum", label: "CONTINUUM", color: "#6B7D5C",
      fill: "rgba(107,125,92,0.60)", dimFill: "rgba(107,125,92,0.07)",
      stroke: "rgba(107,125,92,0.90)",dimStroke: "rgba(107,125,92,0.30)",
      shadow: "rgba(107,125,92,0.45)",idx: 4 },
    { key: "catalyst",  label: "CATALYST",  color: "#C87A3F",
      fill: "rgba(200,122,63,0.60)", dimFill: "rgba(200,122,63,0.07)",
      stroke: "rgba(200,122,63,0.90)",dimStroke: "rgba(200,122,63,0.30)",
      shadow: "rgba(200,122,63,0.45)",idx: 6 },
    { key: "synapse",   label: "SYNAPSE",   color: "#7591BD",
      fill: "rgba(117,145,189,0.60)",dimFill: "rgba(117,145,189,0.07)",
      stroke: "rgba(117,145,189,0.90)",dimStroke:"rgba(117,145,189,0.30)",
      shadow: "rgba(117,145,189,0.45)",idx: 8 },
  ];

  const r1 = 100, r2 = 140, cx = 200, cy = 240;

  const geom = (i) => {
    const angleDeg = -180 + (i + 1) * 18;
    const a1 = (angleDeg - 8) * Math.PI / 180;
    const a2 = (angleDeg + 8) * Math.PI / 180;
    const midA = angleDeg * Math.PI / 180;
    const p1 = [cx + r1 * Math.cos(a1), cy + r1 * Math.sin(a1)];
    const p2 = [cx + r2 * Math.cos(a1), cy + r2 * Math.sin(a1)];
    const p3 = [cx + r2 * Math.cos(a2), cy + r2 * Math.sin(a2)];
    const p4 = [cx + r1 * Math.cos(a2), cy + r1 * Math.sin(a2)];
    return {
      d: `M ${p1[0].toFixed(2)} ${p1[1].toFixed(2)} L ${p2[0].toFixed(2)} ${p2[1].toFixed(2)} L ${p3[0].toFixed(2)} ${p3[1].toFixed(2)} L ${p4[0].toFixed(2)} ${p4[1].toFixed(2)} Z`,
      outerX: cx + r2 * Math.cos(midA),
      outerY: cy + r2 * Math.sin(midA),
    };
  };

  const activeProg = PROG_STONES.find(p => p.key === active) || PROG_STONES[0];
  const ag = geom(activeProg.idx);

  return (
    <svg viewBox="0 0 400 400" width="100%" height="100%" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="kg2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#E5DDD0" stopOpacity="0.18" />
          <stop offset="1" stopColor="#E5DDD0" stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {/* Outer rotating ring */}
      <g style={{ transformOrigin: '200px 200px', animation: 'spin 60s linear infinite' }}>
        <circle cx="200" cy="200" r="180" stroke="url(#kg2)" strokeWidth="1" strokeDasharray="2 8" />
        <circle cx="200" cy="200" r="160" stroke="rgba(229,221,208,0.08)" strokeWidth="1" />
      </g>

      {/* Arch ring guide */}
      <path d="M 60 240 A 140 140 0 0 1 340 240" stroke="rgba(229,221,208,0.18)" strokeWidth="1" fill="none" />

      {/* Voussoir stones */}
      {Array.from({ length: 9 }).map((_, i) => {
        const prog = PROG_STONES.find(p => p.idx === i);
        const g = geom(i);
        if (prog) {
          const isActive = prog.key === active;
          return (
            <path key={i} d={g.d}
                  fill={isActive ? prog.fill : prog.dimFill}
                  stroke={isActive ? prog.stroke : prog.dimStroke}
                  strokeWidth={isActive ? "1.5" : "1"}
                  style={isActive ? { filter: `drop-shadow(0 0 7px ${prog.shadow})` } : {}} />
          );
        }
        return (
          <path key={i} d={g.d}
                fill="rgba(229,221,208,0.04)"
                stroke="rgba(229,221,208,0.14)"
                strokeWidth="1" />
        );
      })}

      {/* Blueprint connector: label → active stone outer tip */}
      <line x1="200" y1="24" x2={ag.outerX.toFixed(2)} y2={ag.outerY.toFixed(2)}
            stroke={activeProg.color} strokeWidth="1"
            strokeOpacity="0.50" strokeDasharray="2 4" />

      {/* Program label (always top-center, text changes per active) */}
      <text x="200" y="18" textAnchor="middle"
            fill={activeProg.color}
            fontFamily="ui-monospace, SF Mono, Menlo, monospace"
            fontSize="9" letterSpacing="2" opacity="0.9">
        {activeProg.label}
      </text>

      {/* Blueprint ticks */}
      <g stroke="rgba(229,221,208,0.18)" strokeWidth="0.5">
        <line x1="200" y1="360" x2="200" y2="380" />
        <line x1="20" y1="240" x2="40" y2="240" />
        <line x1="360" y1="240" x2="380" y2="240" />
      </g>

      <text x="200" y="395" textAnchor="middle" fill="rgba(229,221,208,0.32)"
            fontFamily="ui-monospace, SF Mono, Menlo, monospace" fontSize="8" letterSpacing="2">
        FIG. 01 — LOAD DISTRIBUTION
      </text>
    </svg>
  );
};

// Service icons (line, architectural)
const IconArch = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 21 L4 11 A8 8 0 0 1 20 11 L20 21" />
    <path d="M4 21 L20 21" />
    <path d="M12 3 L12 7" />
    <circle cx="12" cy="11" r="1" fill="currentColor" />
  </svg>
);
const IconWorkshop = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="6" width="18" height="13" rx="1" />
    <path d="M7 11 L11 11" /><path d="M7 14 L15 14" />
    <path d="M8 19 L8 22" /><path d="M16 19 L16 22" />
    <path d="M6 6 L6 4" /><path d="M18 6 L18 4" />
  </svg>
);
const IconReview = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="6" />
    <path d="M15.5 15.5 L20 20" />
    <path d="M8 11 L10 13 L14 9" />
  </svg>
);
const IconSecurity = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3 L20 6 V12 C 20 17 16 20 12 21 C 8 20 4 17 4 12 V6 Z" />
    <path d="M9 12 L11 14 L15 10" />
  </svg>
);
const IconAI = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3 L14 10 L21 12 L14 14 L12 21 L10 14 L3 12 L10 10 Z" />
    <circle cx="18" cy="6" r="1" fill="currentColor" stroke="none" />
    <circle cx="6" cy="18" r="0.7" fill="currentColor" stroke="none" opacity="0.6" />
  </svg>
);
const IconMigrate = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2.5" y="3.5" width="8" height="7" rx="1" />
    <rect x="13.5" y="13.5" width="8" height="7" rx="1" />
    <path d="M15 5 L 17 7 L 15 9" />
    <path d="M14 7 L 18 7" />
    <path d="M11 9 L 14 9 L 14 16" opacity="0.5" />
  </svg>
);
const IconFGA = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="5.5" cy="6" r="2.2" />
    <circle cx="5.5" cy="18" r="2.2" />
    <circle cx="18" cy="12" r="2.6" />
    <path d="M7.5 7 L 15.5 11" />
    <path d="M7.5 17 L 15.5 13" />
  </svg>
);
// Hero-meta thin icons
const IconCompass = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <path d="M14.5 9.5 L 11 13 L 9.5 14.5 L 13 11 Z" fill="currentColor" stroke="none" />
  </svg>
);
const IconLayers = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3 L21 8 L12 13 L3 8 Z" />
    <path d="M3 12 L12 17 L21 12" opacity="0.6" />
    <path d="M3 16 L12 21 L21 16" opacity="0.35" />
  </svg>
);
const IconClock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7 L12 12 L15.5 14" />
  </svg>
);
const IconRoute = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="5" cy="6" r="2.2" />
    <circle cx="19" cy="18" r="2.2" />
    <path d="M5 8 L 5 12 a4 4 0 0 0 4 4 L 19 16" strokeDasharray="2 3" />
  </svg>
);
const IconTarget = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="5.5" />
    <circle cx="12" cy="12" r="1.8" fill="currentColor" stroke="none" />
  </svg>
);
const IconGlobe = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12 L21 12" />
    <path d="M12 3 a 14 14 0 0 1 0 18 a 14 14 0 0 1 0 -18" />
  </svg>
);
const IconBriefcase = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="7" width="18" height="13" rx="1.5" />
    <path d="M9 7 V5 a1 1 0 0 1 1 -1 h4 a1 1 0 0 1 1 1 v2" />
    <path d="M3 12 L21 12" opacity="0.5" />
  </svg>
);
const IconWhatsApp = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 21 L4.5 16.4 A8.5 8.5 0 1 1 7.6 19.5 Z" />
    <path d="M9 9 q 0 4 6 6" />
  </svg>
);
const IconArrow = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 8 H13" /><path d="M9 4 L13 8 L9 12" />
  </svg>
);
const IconCheck = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12 L10 17 L19 7" />
  </svg>
);
const IconMail = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="5" width="18" height="14" rx="1.5" />
    <path d="M3 7 L12 13 L21 7" />
  </svg>
);
const IconBlueprint = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="16" rx="1" />
    <path d="M3 9 L21 9" /><path d="M9 4 L9 20" />
    <path d="M13 13 L17 13" /><path d="M13 16 L15 16" />
  </svg>
);
const IconDoc = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 3 H14 L18 7 V20 a1 1 0 0 1 -1 1 H6 a1 1 0 0 1 -1 -1 V4 a1 1 0 0 1 1 -1 Z" />
    <path d="M14 3 V7 H18" /><path d="M8 12 H15" /><path d="M8 15 H15" /><path d="M8 18 H12" />
  </svg>
);
const IconWrench = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 4 a 4 4 0 0 1 5 5 l -10 10 l -3 1 l 1 -3 l 10 -10 a 4 4 0 0 0 -3 -3 Z" />
  </svg>
);
const IconClipboard = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="6" y="4" width="12" height="17" rx="1.5" />
    <rect x="9" y="2" width="6" height="3" rx="1" />
    <path d="M9 11 H15" /><path d="M9 14 H15" /><path d="M9 17 H13" />
  </svg>
);

// ─── Brand Header (Nav) ────────────────────────────────────────────────────
// Section metadata for desktop nav + mobile menu — id (scroll-spy target),
// label, optional subtitle (mobile cards), and a small icon SVG.
const VERIDYNE_NAV = [
  { id: "services", label: "Services",  href: "#services",
    sub: "Six practices for Auth0 & Okta",
    Icon: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3.5" y="3.5" width="7" height="7" rx="1" />
        <rect x="13.5" y="3.5" width="7" height="7" rx="1" />
        <rect x="3.5" y="13.5" width="7" height="7" rx="1" />
        <rect x="13.5" y="13.5" width="7" height="7" rx="1" />
      </svg>
    ) },
  { id: "programs", label: "Programs",  href: "#programs",
    sub: "Keystone · Continuum · Catalyst · Synapse",
    Icon: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3 L21 8 L12 13 L3 8 Z" />
        <path d="M3 12 L12 17 L21 12" opacity="0.55" />
        <path d="M3 16 L12 21 L21 16" opacity="0.35" />
      </svg>
    ) },
  { id: "approach", label: "Approach",  href: "#approach",
    sub: "Our four-stage delivery framework",
    Icon: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 6 L21 6" strokeDasharray="2 2" />
        <circle cx="5" cy="6" r="2" fill="currentColor" stroke="none" />
        <circle cx="11" cy="6" r="1.4" />
        <circle cx="16" cy="6" r="1.4" />
        <circle cx="21" cy="6" r="1.4" />
        <path d="M3 13 L9 13 M3 17 L7 17" opacity="0.55" />
      </svg>
    ) },
  { id: "about",    label: "About",     href: "#about",
    sub: "How we think about identity",
    Icon: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8 L 12 12.5" />
        <circle cx="12" cy="16" r="0.8" fill="currentColor" stroke="none" />
      </svg>
    ) },
];

// Tiny reusable icon factories for the program-page nav models.
const _NavIco = {
  what:   () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M9 9 a3 3 0 1 1 4 2.5 v1.5" /><circle cx="12" cy="17" r="0.8" fill="currentColor" stroke="none" /></svg>),
  phases: () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2.5" y="9" width="4" height="6" rx="0.5" /><rect x="8" y="6.5" width="4" height="11" rx="0.5" /><rect x="13.5" y="9" width="4" height="9" rx="0.5" /><rect x="19" y="11" width="2.5" height="5" rx="0.5" opacity="0.7" /></svg>),
  engage: () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="6" width="18" height="3" rx="0.5" /><rect x="3" y="11" width="18" height="3" rx="0.5" opacity="0.7" /><rect x="3" y="16" width="18" height="3" rx="0.5" opacity="0.45" /></svg>),
  deliv:  () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3 H14 L18 7 V20 a1 1 0 0 1 -1 1 H6 a1 1 0 0 1 -1 -1 V4 a1 1 0 0 1 1 -1 Z" /><path d="M14 3 V7 H18" /><path d="M8 12 H15 M8 15 H15 M8 18 H12" /></svg>),
  rhythm: () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12 L8 12 L10 7 L14 17 L16 12 L21 12" /></svg>),
  catalog:() => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="1.5" /><path d="M8 9 L16 9 M8 12 L16 12 M8 15 L13 15" /></svg>),
  format: () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="1.5" /><path d="M3 9 L21 9" /><circle cx="7" cy="7" r="0.8" fill="currentColor" stroke="none" /><circle cx="10" cy="7" r="0.8" fill="currentColor" stroke="none" /></svg>),
  coverage:() => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M3 12 L21 12" /><path d="M12 3 a 14 14 0 0 1 0 18 a 14 14 0 0 1 0 -18" /></svg>),
};

const KEYSTONE_NAV = [
  { id: "what",         label: "What",         href: "#what",         sub: "The thesis",                          Icon: _NavIco.what },
  { id: "phases",       label: "Phases",       href: "#phases",       sub: "Five stages, in order",               Icon: _NavIco.phases },
  { id: "engagements",  label: "Engagements",  href: "#engagements",  sub: "Foundation · Span · Vault · Review",  Icon: _NavIco.engage },
  { id: "deliverables", label: "Deliverables", href: "#deliverables", sub: "What lands in your repo",             Icon: _NavIco.deliv },
];

const CONTINUUM_NAV = [
  { id: "what",         label: "What",         href: "#what",         sub: "The thesis",                          Icon: _NavIco.what },
  { id: "rhythm",       label: "Rhythm",       href: "#rhythm",       sub: "Weekly cadence, quarterly review",    Icon: _NavIco.rhythm },
  { id: "levels",       label: "Levels",       href: "#levels",       sub: "Block sizes from light to heavy",     Icon: _NavIco.engage },
  { id: "deliverables", label: "Deliverables", href: "#deliverables", sub: "Rolling artefacts you keep",          Icon: _NavIco.deliv },
];

const CATALYST_NAV = [
  { id: "what",         label: "What",         href: "#what",         sub: "The thesis",                          Icon: _NavIco.what },
  { id: "formats",      label: "Formats",      href: "#formats",      sub: "Half-day · Two-day · Intensive",      Icon: _NavIco.format },
  { id: "catalog",      label: "Catalog",      href: "#catalog",      sub: "Workshops we run today",              Icon: _NavIco.catalog },
  { id: "deliverables", label: "Deliverables", href: "#deliverables", sub: "What your team walks away with",      Icon: _NavIco.deliv },
];

const SYNAPSE_NAV = [
  { id: "what",         label: "What",         href: "#what",         sub: "The thesis",                          Icon: _NavIco.what },
  { id: "coverage",     label: "Coverage",     href: "#coverage",     sub: "ChatGPT · Claude · Gemini · Local",   Icon: _NavIco.coverage },
  { id: "engagement",   label: "Engagement",   href: "#engagement",   sub: "Flexible, weekly, on demand",         Icon: _NavIco.engage },
  { id: "deliverables", label: "Deliverables", href: "#deliverables", sub: "Models, playbooks, audit posture",    Icon: _NavIco.deliv },
];

// Centralized program registry — single source for color, mark, nav and copy.
// Callers pass `program="keystone"|"continuum"|"catalyst"|"synapse"`; falsy
// means the main Veridyne page.
const PROGRAMS = {
  keystone:  { name: "Keystone",  sub: "by Veridyne", page: "keystone.html",  Mark: () => <KeystoneMark color="#b6924d" />,  iconColor: "#b6924d", nav: KEYSTONE_NAV,  cssVar: "--brass"  },
  continuum: { name: "Continuum", sub: "by Veridyne", page: "continuum.html", Mark: () => <ContinuumMark color="#849575" />, iconColor: "#849575", nav: CONTINUUM_NAV, cssVar: "--sage"   },
  catalyst:  { name: "Catalyst",  sub: "by Veridyne", page: "catalyst.html",  Mark: () => <CatalystMark color="#c87a3f" />,  iconColor: "#c87a3f", nav: CATALYST_NAV,  cssVar: "--copper" },
  synapse:   { name: "Synapse",   sub: "by Veridyne", page: "synapse.html",   Mark: () => <SynapseMark color="#7591bd" />,   iconColor: "#7591bd", nav: SYNAPSE_NAV,   cssVar: "--indigo" },
};

// Back-compat: isKeystone={true} keeps working as program="keystone".
function _resolveProgram(p) {
  if (!p) return null;
  return PROGRAMS[p] || null;
}

function BrandHeader({ active = "home", isKeystone = false, program: programProp, onMobileOpen }) {
  const t = (typeof useT !== 'undefined') ? useT() : (k, fb) => fb || k;
  const programKey = programProp || (isKeystone ? "keystone" : null);
  const prog = _resolveProgram(programKey);
  const nav = prog ? prog.nav : VERIDYNE_NAV;
  const ids = React.useMemo(() => nav.map((n) => n.id), [programKey]);
  const activeId = useScrollSpy(ids);
  const linksRef = React.useRef(null);
  const [pill, setPill] = React.useState({ x: 0, w: 0, visible: false });

  // Slide a pill behind whichever link is "active" (scroll-spy) or hovered.
  const positionPill = React.useCallback((id) => {
    const root = linksRef.current;
    if (!root) return;
    const el = root.querySelector(`[data-nav-id="${id}"]`);
    if (!el) { setPill((p) => ({ ...p, visible: false })); return; }
    const rRoot = root.getBoundingClientRect();
    const rLink = el.getBoundingClientRect();
    setPill({ x: rLink.left - rRoot.left, w: rLink.width, visible: true });
  }, []);

  React.useEffect(() => { positionPill(activeId); }, [activeId, positionPill]);
  React.useEffect(() => {
    const onResize = () => positionPill(activeId);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [activeId, positionPill]);

  return (
    <nav className="nav">
      <div className="nav-inner glass">
        <a className="brand-mark home-link" href={prog ? "index.html" : "#top"}
           aria-label={prog ? "Back to Veridyne home" : "Veridyne home"}
           title={prog ? "Back to Veridyne" : "Home"}>
          {prog ? (
            <span className="logo"><prog.Mark /></span>
          ) : (
            <VeridyneMark size={32} />
          )}
          <span className="name">
            <strong>{prog ? prog.name : "Veridyne"}</strong>
            <small>{prog ? prog.sub : "Solutions"}</small>
          </span>
          <span className="home-hint" aria-hidden="true">
            {prog ? <>&larr; Home</> : <>Home</>}
          </span>
        </a>
        <div className="nav-links" ref={linksRef}
             onMouseLeave={() => positionPill(activeId)}>
          {pill.visible && (
            <span className="nav-pill" aria-hidden="true"
                  style={{ transform: `translateX(${pill.x}px)`, width: pill.w }} />
          )}
          {nav.map((l) => (
            <a key={l.id} href={l.href}
               data-nav-id={l.id}
               className={"nav-link" + (l.id === activeId ? " active" : "")}
               onMouseEnter={(e) => {
                 const rRoot = linksRef.current.getBoundingClientRect();
                 const rLink = e.currentTarget.getBoundingClientRect();
                 setPill({ x: rLink.left - rRoot.left, w: rLink.width, visible: true });
               }}>
              {l.label}
            </a>
          ))}
        </div>
        {prog && (
          <div className="nav-programs">
            {['keystone', 'continuum', 'catalyst', 'synapse'].map(key => {
              const p = PROGRAMS[key];
              const MarkMap = { keystone: KeystoneMark, continuum: ContinuumMark, catalyst: CatalystMark, synapse: SynapseMark };
              const M = MarkMap[key];
              return (
                <a key={key}
                   className={"nav-prog-chip" + (key === programKey ? " active" : "")}
                   data-prog={key}
                   href={p.page}
                   title={p.name}>
                  <span className="npc-ico"><M size={13} color="currentColor" /></span>
                  {p.name}
                </a>
              );
            })}
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 4 }}>
          {typeof SettingsPanel !== 'undefined' && <SettingsPanel />}
          {typeof LangPanel !== 'undefined' && <LangPanel />}
          <a href="#contact" className="btn btn-ghost nav-cta desktop-only" style={{ marginLeft: 2 }}>
            {t('nav.getInTouch', 'Get in touch')} <span className="arr"><IconArrow size={12} /></span>
          </a>
        </div>
        <button className="nav-mobile-btn" onClick={onMobileOpen} aria-label="Open menu">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <path d="M4 7 H20" /><path d="M4 12 H20" /><path d="M4 17 H20" />
          </svg>
        </button>
      </div>
    </nav>
  );
}

function MobileMenu({ open, onClose, isKeystone = false, program: programProp }) {
  if (!open) return null;
  const t = (typeof useT !== 'undefined') ? useT() : (k, fb) => fb || k;
  const programKey = programProp || (isKeystone ? "keystone" : null);
  const prog = _resolveProgram(programKey);
  const sections = prog ? prog.nav : VERIDYNE_NAV;
  return (
    <div className="mobile-menu">
      <button className="close" onClick={onClose} aria-label="Close menu">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <path d="M6 6 L18 18" /><path d="M18 6 L6 18" />
        </svg>
      </button>

      <div className="mm-brand">
        {prog ? (
          <span className="logo" style={{ width: 36, height: 36, display: 'grid', placeItems: 'center', borderRadius: 8, background: 'linear-gradient(135deg, var(--slate-2), var(--slate))', border: '1px solid var(--border-2)' }}>
            <prog.Mark />
          </span>
        ) : (
          <VeridyneMark size={36} />
        )}
        <div className="mm-brand-name">
          <strong>{prog ? prog.name : "Veridyne"}</strong>
          <small>{prog ? prog.sub : "Solutions"}</small>
        </div>
      </div>

      <div className="mm-section-label">{t('mobile.navigate','Navigate')}</div>
      <div className="mm-grid">
        {sections.map((s, i) => (
          <a key={i} className="mm-card" href={s.href} onClick={onClose}
             style={{ animationDelay: `${80 + i * 50}ms` }}>
            <span className="mm-icon"><s.Icon /></span>
            <span className="mm-body">
              <span className="mm-label">{s.label}</span>
              <span className="mm-sub">{s.sub}</span>
            </span>
            <span className="mm-arr">
              <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                <path d="M5 3 L11 8 L5 13" />
              </svg>
            </span>
          </a>
        ))}
      </div>

      <div className="mm-section-label">{t('mobile.programs','Programs')}</div>
      <div className="mm-pills">
        <a className="mm-pill" data-program="keystone"  href="keystone.html"  onClick={onClose}><KeystoneMark size={14} /> Keystone</a>
        <a className="mm-pill" data-program="continuum" href="continuum.html" onClick={onClose}><ContinuumMark size={14} /> Continuum</a>
        <a className="mm-pill" data-program="catalyst"  href="catalyst.html"  onClick={onClose}><CatalystMark size={14} /> Catalyst</a>
        <a className="mm-pill" data-program="synapse"   href="synapse.html"   onClick={onClose}><SynapseMark size={14} /> Synapse</a>
      </div>

      <div className="mm-section-label">{t('mobile.reachUs','Reach us')}</div>
      <div className="mm-contact">
        <a className="mm-contact-row" href="mailto:solutions@veridyne.eu">
          <IconMail /> <span>solutions@veridyne.eu</span>
        </a>
        <a className="mm-contact-row" href="https://wa.me/40755577744" target="_blank" rel="noopener">
          <IconWhatsApp /> <span>+40 755 577 744</span>
        </a>
      </div>
    </div>
  );
}

// ─── Footer ────────────────────────────────────────────────────────────────
function Footer({ isKeystone = false, program: programProp }) {
  const t = (typeof useT !== 'undefined') ? useT() : (k, fb) => fb || k;
  const programKey = programProp || (isKeystone ? "keystone" : null);
  const prog = _resolveProgram(programKey);
  const homeHref = prog ? "index.html" : "#top";
  const s = (key, fb) => t('footer.' + key, fb);
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div className="footer-col">
            <a className="brand-mark" href={homeHref} style={{ marginBottom: 16 }}>
              {prog ? (
                <>
                  <span className="logo"><prog.Mark /></span>
                  <span className="name">
                    <strong>{prog.name}</strong>
                    <small>{prog.sub}</small>
                  </span>
                </>
              ) : (
                <>
                  <VeridyneMark size={36} />
                  <span className="name">
                    <strong>Veridyne</strong>
                    <small>Solutions</small>
                  </span>
                </>
              )}
            </a>
            <p style={{ color: 'var(--text-dim)', fontSize: 14, maxWidth: '34ch', margin: 0 }}>
              {s('tagline','Architecture, migration, and review for Auth0 and Okta. Europe-based, working worldwide.')}
            </p>
          </div>
          <div className="footer-col">
            <h5>{s('programs','Programs')}</h5>
            <a href="keystone.html">{s('keystone','Keystone — Fixed PS')}</a>
            <a href="continuum.html">{s('continuum','Continuum — Long-term')}</a>
            <a href="catalyst.html">{s('catalyst','Catalyst — Workshops')}</a>
            <a href="synapse.html">{s('synapse','Synapse — AI')}</a>
          </div>
          <div className="footer-col">
            <h5>{s('services','Services')}</h5>
            <a href={prog ? "index.html#services" : "#services"}>{s('svcArch','Architecture & Design')}</a>
            <a href={prog ? "index.html#services" : "#services"}>{s('svcMigrate','Migration & Integration')}</a>
            <a href={prog ? "index.html#services" : "#services"}>{s('svcFga','Fine-Grained Authorization')}</a>
            <a href={prog ? "index.html#services" : "#services"}>{s('svcAi','AI Integrations with IAM')}</a>
            <a href={prog ? "index.html#services" : "#services"}>{s('svcReview','IAM Solution Reviews')}</a>
          </div>
          <div className="footer-col">
            <h5>{s('company','Company')}</h5>
            <a href={prog ? "index.html#about" : "#about"}>{s('about','About')}</a>
            <a href={prog ? "index.html#approach" : "#approach"}>{s('approach','Approach')}</a>
            <a href={prog ? "index.html#contact" : "#contact"}>{s('contactLink','Contact')}</a>
          </div>
          <div className="footer-col">
            <h5>{s('contact','Contact')}</h5>
            <a href="mailto:solutions@veridyne.eu">solutions@veridyne.eu</a>
            <a href="https://wa.me/40755577744" target="_blank" rel="noopener">WhatsApp · +40 755 577 744</a>
            <a href="https://www.linkedin.com/company/122224295" target="_blank" rel="noopener">LinkedIn</a>
          </div>
        </div>
        <div className="footer-meta">
          <span>{s('copyright','© 2026 Veridyne Solutions · Europe-based, working worldwide')}</span>
          <span>{s('designedFor','Designed for trust · OIDC · SAML · SCIM · FGA')}</span>
        </div>
      </div>
    </footer>
  );
}

// ─── Contact form (shared) ─────────────────────────────────────────────────
function ContactForm({ accent = "copper", initialTopic = "Architecture & Design" }) {
  const t = (typeof useT !== 'undefined') ? useT() : (k, fb) => fb || k;
  const ct = (key, fb) => t('contact.' + key, fb);
  const [data, setData] = React.useState({
    name: "", email: "", company: "", topic: initialTopic, message: ""
  });
  const [errors, setErrors] = React.useState({});
  const [sent, setSent] = React.useState(false);

  // External CTAs can pre-select a topic via:
  //   window.dispatchEvent(new CustomEvent('set-contact-topic', { detail: 'Continuum' }))
  React.useEffect(() => {
    const onTopic = (e) => {
      if (typeof e.detail === 'string') {
        setData((d) => ({ ...d, topic: e.detail }));
      }
    };
    window.addEventListener('set-contact-topic', onTopic);
    return () => window.removeEventListener('set-contact-topic', onTopic);
  }, []);

  const set = (k) => (e) => {
    setData((d) => ({ ...d, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: null }));
  };

  const submit = (e) => {
    e.preventDefault();
    const er = {};
    if (!data.name.trim()) er.name = ct('errRequired','Required');
    if (!/^\S+@\S+\.\S+$/.test(data.email)) er.email = ct('errEmail','Email not valid');
    if (!data.message.trim() || data.message.trim().length < 12) er.message = ct('errMessage','Tell us a bit more');
    setErrors(er);
    if (Object.keys(er).length) return;

    // Compose mailto so the message routes to solutions@veridyne.eu via the
    // user's mail client — honest no-backend approach. Subject carries the
    // topic; body composes the form fields in a readable layout.
    const subject = `[Veridyne \u00b7 ${data.topic}] inquiry from ${data.name}`;
    const bodyLines = [
      `From: ${data.name} <${data.email}>`,
      data.company ? `Company: ${data.company}` : null,
      `Topic: ${data.topic}`,
      "",
      "\u2014",
      "",
      data.message,
      "",
      "\u2014 Sent via veridyne.eu contact form",
    ].filter(Boolean);
    const href = "mailto:solutions@veridyne.eu"
      + "?subject=" + encodeURIComponent(subject)
      + "&body=" + encodeURIComponent(bodyLines.join("\n"));
    window.location.href = href;
    setSent(true);
  };

  if (sent) {
    return (
      <div className="form glass form-success">
        <div className="check"><IconMail /></div>
        <h4>{ct('successTitle','Draft opened.')}</h4>
        <p>{ct('successBody','Your mail client should now have a pre-filled draft addressed to')} <strong>solutions@veridyne.eu</strong>. {ct('successBodyRest','Review it, then hit Send from there — nothing has been sent yet.')}</p>
        <p style={{ fontSize: 13, color: 'var(--text-dimmer)', marginTop: 4 }}>
          {ct('successFallback','Nothing happened? Email us directly at')} <a href="mailto:solutions@veridyne.eu" style={{ color: 'var(--accent)' }}>solutions@veridyne.eu</a>.
        </p>
        <button className="btn btn-ghost" style={{ marginTop: 12 }}
                onClick={() => { setSent(false); setData({ name:"", email:"", company:"", topic: initialTopic, message:"" }); }}>
          {ct('composeAnother','Compose another')}
        </button>
      </div>
    );
  }

  return (
    <form className="form glass" onSubmit={submit} noValidate>
      <div className="form-note">
        <IconMail />
        <span>
          <strong>{ct('formNote','This opens a draft in your mail client — nothing is sent from this page.')}</strong> {ct('formNoteRest',"Fill it in below and we'll prepare the message addressed to")} <a href="mailto:solutions@veridyne.eu">solutions@veridyne.eu</a>. {ct('reviewSend','You review and send it from your own inbox, so you keep the copy.')}
        </span>
      </div>
      <div className="form-row">
        <div className={"field" + (errors.name ? " error" : "")}>
          <label>{ct('labelName','Name')}</label>
          <input value={data.name} onChange={set("name")} placeholder={ct('placeholderName','Your name')} autoComplete="name" />
          {errors.name && <span className="err">{errors.name}</span>}
        </div>
        <div className={"field" + (errors.email ? " error" : "")}>
          <label>{ct('labelEmail','Email')}</label>
          <input value={data.email} onChange={set("email")} placeholder={ct('placeholderEmail','you@company.com')} type="email" autoComplete="email" />
          {errors.email && <span className="err">{errors.email}</span>}
        </div>
      </div>
      <div className="form-row">
        <div className="field">
          <label>{ct('labelCompany','Company')}</label>
          <input value={data.company} onChange={set("company")} placeholder={ct('placeholderCompany','Optional')} autoComplete="organization" />
        </div>
        <div className="field">
          <label>{ct('labelTopic','Topic')}</label>
          <select value={data.topic} onChange={set("topic")}>
            {(t('contact.topics') || ["Architecture & Design","Migration & Integration","Fine-Grained Authorization","Workshops & Training","IAM Solution Review","Keystone engagement","Continuum (long-term)","Catalyst (workshops)","Synapse (AI)","Something else"]).map(o => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </div>
      </div>
      <div className={"field" + (errors.message ? " error" : "")}>
        <label>{ct('labelMessage','What can we help with?')}</label>
        <textarea value={data.message} onChange={set("message")}
                  placeholder={ct('placeholderMessage','Auth0 multi-tenant rollout, Okta migration, OIDC review, internal workshop…')} />
        {errors.message && <span className="err">{errors.message}</span>}
      </div>
      <div className="form-submit">
        <span className="small">{ct('submitHint','Opens a pre-filled draft in your default mail app')}</span>
        <button type="submit" className="btn btn-primary">
          <IconMail /> {ct('submitBtn','Open draft in mail')} <span className="arr"><IconArrow /></span>
        </button>
      </div>
    </form>
  );
}

// Export to window so other Babel scripts can use them
Object.assign(window, {
  VeridyneMark, VeridyneLockup,
  KeystoneMark, ContinuumMark, CatalystMark, SynapseMark,
  KeystoneIllustration,
  IconArch, IconWorkshop, IconReview, IconSecurity, IconMigrate, IconFGA, IconAI,
  IconCompass, IconLayers, IconClock, IconRoute, IconTarget, IconGlobe, IconBriefcase,
  IconArrow, IconCheck, IconMail, IconWhatsApp, IconBlueprint, IconDoc, IconWrench, IconClipboard,
  BrandHeader, MobileMenu, Footer, ContactForm,
});
