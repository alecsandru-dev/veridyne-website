// program-page.jsx — shared layout for Keystone / Continuum / Catalyst / Synapse pages.
// Each program subpage wires its own copy + sections into <ProgramPage>.
//
// The page reads the same TWEAK_DEFAULTS structure as the other apps (just glass intensity).
// Programs supply their own content per section; the layout handles hero, navigation,
// reveal animations, mouse-glow, scroll-spy, footer and tweaks panel.

function ProgramPage({
  programKey,         // "continuum" | "catalyst" | "synapse" | "keystone"
  eyebrow,            // small line above the hero title
  headline,           // {segments:[{text, className?}, {br:true}]} for word-stagger
  lede,               // hero paragraph
  primaryCta,         // {label, href}
  secondaryCta,       // {label, href}
  meta,               // [{icon: ReactElement, label, value}]
  illustration,       // optional ReactElement shown to the right of hero (currently uses KeystoneIllustration as default)
  what,               // {eyebrow, h2:[{text}, {br:true}, {text, className:"alt"}], lede, cards:[{tag, h3, p}]}
  middleSection,      // {id, eyebrow, h2, lede, body} — the phases/rhythm/formats/coverage block
  engagement,         // {id, eyebrow, h2, lede, body}
  deliverables,       // {id, eyebrow, h2, lede, items:[{Icon, name, desc}]}
  stats,              // [{value, suffix, label}]
  quote,              // {text, cite}
  contact,            // {eyebrow, h2, lede, asideTitle, asideLede, contactRows}
  topicForContact,    // string — the value to pre-select in the contact form
  tweakDefaults,
  setTweakFn,
}) {
  const prog = PROGRAMS[programKey];
  const accentColor = `var(${prog.cssVar})`;
  const accentColor2 = `var(${prog.cssVar}-2)`; // wired via CSS — using the dim 2 variant
  const dimEyebrowColor = accentColor2;

  const [t, setTweak] = useTweaks(tweakDefaults);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const whatRef = React.useRef(null);
  const middleRef = React.useRef(null);
  const delivRef = React.useRef(null);

  useNavScroll();
  useSmoothAnchors();
  useMouseGlow(whatRef);
  useMouseGlow(middleRef);
  useMouseGlow(delivRef);

  // Apply glass-intensity tweak
  React.useEffect(() => {
    const root = document.documentElement;
    const glassMap = {
      subtle:   { blur: "14px", sat: "120%", bg: "rgba(229,221,208,0.03)", bgs: "rgba(229,221,208,0.06)" },
      moderate: { blur: "24px", sat: "140%", bg: "rgba(229,221,208,0.05)", bgs: "rgba(229,221,208,0.09)" },
      heavy:    { blur: "44px", sat: "170%", bg: "rgba(229,221,208,0.09)", bgs: "rgba(229,221,208,0.14)" },
    };
    const g = glassMap[t.glass] || glassMap.moderate;
    root.style.setProperty("--glass-blur", g.blur);
    root.style.setProperty("--glass-sat", g.sat);
    root.style.setProperty("--glass-bg", g.bg);
    root.style.setProperty("--glass-bg-strong", g.bgs);
  }, [t.glass]);

  return (
    <>
      <div className="bg-stack" />
      <a id="top" />
      <BrandHeader program={programKey} onMobileOpen={() => setMobileOpen(true)} />
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} program={programKey} />

      {/* HERO */}
      <header className="wrap hero" data-screen-label={`01 ${prog.name} Hero`}>
        <Reveal y={14} duration={600}>
          <span className="eyebrow" style={{ color: dimEyebrowColor }}>
            {eyebrow}
          </span>
        </Reveal>
        <div className="spacer-6" />
        <h1>
          <SplitWords segments={headline.segments} delay={140} step={70} duration={900} />
        </h1>
        <Reveal y={16} duration={700} delay={620}>
          <p className="lede">{lede}</p>
        </Reveal>
        <Reveal y={16} duration={700} delay={780}>
          <div className="hero-actions">
            <Magnetic strength={0.18}>
              <a href={primaryCta.href} className="btn btn-primary">
                {primaryCta.label} <span className="arr"><IconArrow /></span>
              </a>
            </Magnetic>
            <a href={secondaryCta.href} className="btn btn-ghost">
              {secondaryCta.label}
            </a>
          </div>
        </Reveal>
        {illustration && <div className="hero-diagram">{illustration}</div>}

        <Reveal y={20} duration={800} delay={1000}>
          <div className="hero-meta">
            {meta.map((m, i) => (
              <div key={i}>
                <div className="hm-head">
                  <span className="hm-icon">{m.icon}</span>
                  <div className="label">{m.label}</div>
                </div>
                <div className="value">{m.value}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </header>

      {/* WHAT */}
      <section id="what" className="section" data-screen-label="02 What">
        <div className="wrap">
          <div className="sec-head">
            <Reveal>
              <div>
                <span className="eyebrow">{what.eyebrow}</span>
                <h2>{what.h2}</h2>
              </div>
            </Reveal>
            <Reveal delay={150}>
              <p>{what.lede}</p>
            </Reveal>
          </div>

          <div className="svc-grid" ref={whatRef} style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
            {what.cards.map((c, i) => (
              <Reveal key={i} delay={i * 120} y={28}>
                <div className="svc-card glass glow-card" data-glow="">
                  <div className="svc-num" style={{ color: dimEyebrowColor }}>{c.tag}</div>
                  <h3>{c.h3}</h3>
                  <p>{c.p}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* MIDDLE — phases / rhythm / formats / coverage */}
      <section id={middleSection.id} className="section surface-limestone" data-screen-label={`03 ${middleSection.id}`}>
        <div className="wrap" style={{ position: 'relative', zIndex: 1 }}>
          <div className="sec-head">
            <Reveal>
              <div>
                <span className="eyebrow" style={{ color: '#8a6d34' }}>{middleSection.eyebrow}</span>
                <h2>{middleSection.h2}</h2>
              </div>
            </Reveal>
            <Reveal delay={150}>
              <p>{middleSection.lede}</p>
            </Reveal>
          </div>
          <div ref={middleRef}>{middleSection.body}</div>
        </div>
      </section>

      {/* ENGAGEMENT */}
      <section id={engagement.id} className="section" data-screen-label={`04 ${engagement.id}`}>
        <div className="wrap">
          <div className="sec-head">
            <Reveal>
              <div>
                <span className="eyebrow">{engagement.eyebrow}</span>
                <h2>{engagement.h2}</h2>
              </div>
            </Reveal>
            <Reveal delay={150}>
              <p>{engagement.lede}</p>
            </Reveal>
          </div>
          <div>{engagement.body}</div>
        </div>
      </section>

      {/* DELIVERABLES */}
      <section id="deliverables" className="section" data-screen-label="05 Deliverables">
        <div className="wrap">
          <div className="sec-head">
            <Reveal>
              <div>
                <span className="eyebrow">{deliverables.eyebrow}</span>
                <h2>{deliverables.h2}</h2>
              </div>
            </Reveal>
            <Reveal delay={150}>
              <p>{deliverables.lede}</p>
            </Reveal>
          </div>
          <div className="deliv" ref={delivRef}>
            {deliverables.items.map((d, i) => (
              <Reveal key={i} delay={i * 80} y={20}>
                <div className="deliv-item glow-card" data-glow="">
                  <div className="dot"><d.Icon /></div>
                  <div>
                    <div className="name">{d.name}</div>
                    <div className="desc">{d.desc}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="section-sm" data-screen-label="06 Outcomes">
        <div className="wrap">
          <Reveal>
            <div className="stats glass">
              {stats.map((s, i) => (
                <div key={i}>
                  <div className="v">
                    {typeof s.value === "number"
                      ? <CountUp value={s.value} suffix={s.suffix || ""} />
                      : <span style={{ fontSize: 'clamp(22px, 2.4vw, 32px)', lineHeight: 1.15 }}>{s.value}</span>}
                  </div>
                  <div className="l">{s.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* PULL QUOTE */}
      <section className="section" data-screen-label="07 Quote">
        <div className="wrap">
          <Reveal>
            <div className="pull glass">
              <blockquote>{quote.text}</blockquote>
              <cite>{quote.cite}</cite>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="section" data-screen-label="08 Contact">
        <div className="wrap">
          <div className="sec-head">
            <Reveal>
              <div>
                <span className="eyebrow">{contact.eyebrow}</span>
                <h2>{contact.h2}</h2>
              </div>
            </Reveal>
            <Reveal delay={150}>
              <p>{contact.lede}</p>
            </Reveal>
          </div>
          <div className="contact-grid">
            <aside className="contact-aside glass">
              <h3>{contact.asideTitle}</h3>
              <p>{contact.asideLede}</p>
              <div className="contact-meta">
                <div className="row">
                  <span className="label">Email</span>
                  <a href="mailto:solutions@veridyne.eu">solutions@veridyne.eu</a>
                </div>
                <div className="row">
                  <span className="label">WhatsApp</span>
                  <a href="https://wa.me/40755577744" target="_blank" rel="noopener">+40 755 577 744</a>
                </div>
                <div className="row">
                  <span className="label">LinkedIn</span>
                  <a href="https://www.linkedin.com/company/122224295" target="_blank" rel="noopener">linkedin.com/company/veridyne</a>
                </div>
                <div className="row">
                  <span className="label">Parent</span>
                  <a href="index.html">Veridyne Solutions &rarr;</a>
                </div>
              </div>
            </aside>
            <ContactForm key={topicForContact} initialTopic={topicForContact} />
          </div>
        </div>
      </section>

      <Footer program={programKey} />

      <TweaksPanel title="Tweaks">
        <TweakSection label="Atmosphere">
          <TweakRadio label="Glass" value={t.glass}
                      options={["subtle", "moderate", "heavy"]}
                      onChange={(v) => setTweak("glass", v)} />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

window.ProgramPage = ProgramPage;
