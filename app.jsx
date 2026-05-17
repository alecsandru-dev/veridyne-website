// app.jsx — Veridyne Solutions main site

function App() {
  const tr = (typeof useT !== 'undefined') ? useT() : (k, fb) => fb || k;
  const TX = (key, fb) => tr(key, fb);
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [heroVariant, setHeroVariant] = React.useState(0);
  const servicesRef = React.useRef(null);

  useNavScroll();
  useSmoothAnchors();
  useMouseGlow(servicesRef);

  // Apply tweaks to the document via CSS variables
  React.useEffect(() => {
    const root = document.documentElement;
    // Glass intensity
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
    // Accent color
    const accentMap = {
      copper: { a: "#B4632A", b: "#c87a3f" },
      brass:  { a: "#9E7B3B", b: "#b6924d" },
      sage:   { a: "#6B7D5C", b: "#849575" },
    };
    const a = accentMap[t.accent] || accentMap.copper;
    root.style.setProperty("--accent", a.a);
    root.style.setProperty("--accent-2", a.b);
  }, [t.glass, t.accent]);

  // Hero variants — loaded from translations with English fallback
  const _heroVars = TX('home.hero.variants') || [
    { eyebrow: "Identity, designed like infrastructure",
      seg1: "Auth that holds ", seg2: "weight.", seg2class: "accent",
      lede: "Veridyne designs, migrates to, and reviews identity on Auth0 and Okta. Years of hands-on experience. We hand your team the architecture and the implementation guide — the keyboard is theirs." },
    { eyebrow: "Design · Migration · Review",
      seg1: "Identity is ", seg1class: "alt", seg2: "load-bearing.",
      lede: "We are the team you bring in when SSO, federation, and access policy stop being a feature and start being part of the foundation. We design it like it." },
    { eyebrow: "Auth0 · Okta · FGA",
      seg1: "Quiet, durable ", seg2: "identity.", seg2class: "accent",
      lede: "Specialist professional services for Auth0 and Okta — architecture design, migrations from legacy IAM, fine-grained authorization, reviews, and workshops that leave your team faster than they were." },
  ];
  const _hv = _heroVars[heroVariant % _heroVars.length];
  const hero = {
    eyebrow: _hv.eyebrow,
    segments: _hv.seg1class
      ? [{ text: _hv.seg1, className: _hv.seg1class }, { text: _hv.seg2 }]
      : [{ text: _hv.seg1 }, { text: _hv.seg2, className: _hv.seg2class }],
    lede: _hv.lede,
  };

  return (
    <>
      <div className="bg-stack" />
      <a id="top" />
      <BrandHeader active="home" onMobileOpen={() => setMobileOpen(true)} />
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />

      {/* HERO */}
      <header className="wrap hero" data-screen-label="01 Hero">
        <Reveal y={14} duration={600}><span className="eyebrow">{hero.eyebrow}</span></Reveal>
        <div className="spacer-6" />
        <h1 key={heroVariant}>
          <SplitWords segments={hero.segments} delay={120} step={70} duration={900} />
        </h1>
        <Reveal y={16} duration={700} delay={520}>
          <p className="lede">{hero.lede}</p>
        </Reveal>
        <Reveal y={16} duration={700} delay={680}>
          <div className="hero-actions">
            <Magnetic strength={0.18}>
              <a href="#services" className="btn btn-primary">
                See what we do <span className="arr"><IconArrow /></span>
              </a>
            </Magnetic>
            <a href="#programs" className="btn btn-ghost">
              Programs
            </a>
          </div>
        </Reveal>
        <Reveal y={14} duration={700} delay={820}>
          <div className="hero-programs">
            <span className="label">Meet a program:</span>
            <a className="prog-chip" data-program="keystone" href="keystone.html">
              <span className="ico"><KeystoneMark size={16} /></span>
              Keystone
            </a>
            <a className="prog-chip" data-program="continuum" href="continuum.html">
              <span className="ico"><ContinuumMark size={16} /></span>
              Continuum
            </a>
            <a className="prog-chip" data-program="catalyst" href="catalyst.html">
              <span className="ico"><CatalystMark size={16} /></span>
              Catalyst
            </a>
            <a className="prog-chip" data-program="synapse" href="synapse.html">
              <span className="ico"><SynapseMark size={16} /></span>
              Synapse
            </a>
          </div>
        </Reveal>

        <div className="hero-diagram"><KeystoneIllustration active="veridyne" /></div>

        <Reveal y={20} duration={800} delay={900}>
          <div className="hero-meta">
            <div>
              <div className="hm-head">
                <span className="hm-icon"><IconCompass /></span>
                <div className="label">{TX('home.heroPractice','Practice')}</div>
              </div>
              <div className="value">Identity</div>
            </div>
            <div>
              <div className="hm-head">
                <span className="hm-icon"><IconLayers /></span>
                <div className="label">{TX('home.heroSpecialty','Specialty')}</div>
              </div>
              <div className="value">Auth0 · Okta</div>
            </div>
            <div>
              <div className="hm-head">
                <span className="hm-icon"><IconBriefcase /></span>
                <div className="label">{TX('home.heroEngagements','Engagements')}</div>
              </div>
              <div className="value">{TX('home.heroEngagementsVal','Design, Migration, Review')}</div>
            </div>
            <div>
              <div className="hm-head">
                <span className="hm-icon"><IconGlobe /></span>
                <div className="label">{TX('home.heroBased','Based')}</div>
              </div>
              <div className="value">{TX('home.heroBasedVal','Europe, worldwide')}</div>
            </div>
          </div>
        </Reveal>
      </header>

      {/* SERVICES */}
      <section id="services" className="section" data-screen-label="02 Services">
        <div className="wrap">
          <div className="sec-head">
            <Reveal>
              <div>
                <span className="eyebrow">{TX('home.services.eyebrow','What we do')}</span>
                <h2>{TX('home.services.h2a','Six practices.')}<br /><span className="alt">{TX('home.services.h2b','One discipline.')}</span></h2>
              </div>
            </Reveal>
            <Reveal delay={150}>
              <p>{TX('home.services.desc',"Auth0 and Okta only — that's where we go deep. Everything else, we integrate with, migrate from, or design around. Pick the shape that fits.")}</p>
            </Reveal>
          </div>

          <div className="svc-grid" ref={servicesRef}>
            <Reveal delay={0} y={28}>
              <article className="svc-card glass glow-card" data-glow="">
                <div className="svc-num">01 / Design</div>
                <div className="svc-icon"><IconArch /></div>
                <h3>Architecture &amp; Design</h3>
                <p>Full deployment design for Auth0 and Okta. Tenancy models, federation, custom flows, secure-by-default policy &mdash; delivered as high-level designs, implementation guides, and runbooks your team can build from.</p>
                <div className="svc-tags">
                  <span className="tag">Auth0</span>
                  <span className="tag">Okta</span>
                  <span className="tag">OIDC</span>
                  <span className="tag">SAML</span>
                  <span className="tag">HLD</span>
                </div>
              </article>
            </Reveal>

            <Reveal delay={100} y={28}>
              <article className="svc-card glass glow-card" data-glow="">
                <div className="svc-num">02 / Move</div>
                <div className="svc-icon"><IconMigrate /></div>
                <h3>Migration &amp; Integration</h3>
                <p>Move from Ping, ForgeRock, Keycloak, EntraID, AD&nbsp;FS or homegrown IAM &mdash; into Auth0 or Okta. Or integrate what you already have. Migration plans, cutover runbooks, integration playbooks per system.</p>
                <div className="svc-tags">
                  <span className="tag">Ping &rarr; Auth0</span>
                  <span className="tag">Keycloak &rarr; Okta</span>
                  <span className="tag">AD FS</span>
                  <span className="tag">SCIM</span>
                  <span className="tag">Cutover</span>
                </div>
              </article>
            </Reveal>

            <Reveal delay={200} y={28}>
              <article className="svc-card glass glow-card" data-glow="">
                <div className="svc-num">03 / Authorize</div>
                <div className="svc-icon"><IconFGA /></div>
                <h3>Fine-Grained Authorization</h3>
                <p>Authorization that scales past role lists. Auth0 FGA and OpenFGA model design, migration from RBAC to ReBAC, policy review, and the implementation guide your engineers will actually follow.</p>
                <div className="svc-tags">
                  <span className="tag">Auth0 FGA</span>
                  <span className="tag">OpenFGA</span>
                  <span className="tag">ReBAC</span>
                  <span className="tag">Policy design</span>
                </div>
              </article>
            </Reveal>

            <Reveal delay={300} y={28}>
              <article className="svc-card glass glow-card" data-glow="">
                <div className="svc-num">04 / Enable</div>
                <div className="svc-icon"><IconWorkshop /></div>
                <h3>Workshops &amp; Training</h3>
                <p>Cohort-based, hands-on. Auth0 and Okta deep dives, IAM fundamentals for engineering, FGA modelling, threat modelling for identity. Your team leaves with patterns, not slides.</p>
                <div className="svc-tags">
                  <span className="tag">Cohort</span>
                  <span className="tag">Hands-on</span>
                  <span className="tag">Custom curriculum</span>
                </div>
              </article>
            </Reveal>

            <Reveal delay={400} y={28}>
              <article className="svc-card glass glow-card" data-glow="">
                <div className="svc-num">05 / Review</div>
                <div className="svc-icon"><IconReview /></div>
                <h3>IAM Solution Reviews</h3>
                <p>Independent, evidence-based reviews of your existing identity estate. Findings mapped to NIST and your own controls, ranked by blast radius. Practical fixes, not a 60-page PDF.</p>
                <div className="svc-tags">
                  <span className="tag">Audit-ready</span>
                  <span className="tag">NIST 800-63</span>
                  <span className="tag">Remediation plan</span>
                </div>
              </article>
            </Reveal>

            <Reveal delay={500} y={28}>
              <article className="svc-card glass glow-card" data-glow="">
                <div className="svc-num">06 / AI</div>
                <div className="svc-icon"><IconAI /></div>
                <h3>AI Integrations with IAM</h3>
                <p>Identity for the agent era. ChatGPT, Claude, Gemini, plus on-prem LLMs &mdash; wired into Auth0 or Okta with proper auth flows, fine-grained authorization for agent actions, and the governance posture your CISO will sign.</p>
                <div className="svc-tags">
                  <span className="tag">ChatGPT</span>
                  <span className="tag">Claude</span>
                  <span className="tag">Gemini</span>
                  <span className="tag">MCP</span>
                  <span className="tag">Local LLMs</span>
                </div>
              </article>
            </Reveal>

            <Reveal delay={600} y={28}>
              <article className="svc-card glass glow-card" data-glow="" style={{ background: "transparent", borderStyle: "dashed", justifyContent: "center", textAlign: "center" }}>
                <div className="svc-num" style={{ color: 'var(--text-dimmer)' }}>Custom · 07</div>
                <h3 style={{ fontSize: 26 }}>Something else?</h3>
                <p>Identity work rarely fits a brochure. If it touches Auth0, Okta, FGA or how they reach the rest of your stack &mdash; talk to us.</p>
                <a href="#contact" className="btn btn-ghost" style={{ alignSelf: "center", marginTop: "auto" }}>
                  Start a conversation <span className="arr"><IconArrow /></span>
                </a>
              </article>
            </Reveal>
          </div>
        </div>
      </section>

      {/* PROGRAMS */}
      <section id="programs" className="section" data-screen-label="03 Programs">
        <div className="wrap">
          <div className="sec-head">
            <Reveal>
              <div>
                <span className="eyebrow">{TX('home.programs.eyebrow','Four programs')}</span>
                <h2>{TX('home.programs.h2a','One framework.')}<br /><span className="alt">{TX('home.programs.h2b','Four ways to engage.')}</span></h2>
              </div>
            </Reveal>
            <Reveal delay={150}>
              <p>{TX('home.programs.desc','Same identity discipline, four shapes. Pick the program that fits the work: focused delivery, ongoing partnership, sharper people, or AI-era auth.')}</p>
            </Reveal>
          </div>

          <div className="programs-grid">
            <Reveal delay={0} y={28}>
              <article className="program-card glass keystone-card">
                <div className="prog-mark"><KeystoneMark size={38} /></div>
                <div className="prog-tag">Productized PS engagement</div>
                <h3 className="prog-name">Keystone</h3>
                <p>Our flagship. A fixed-shape program that takes Auth0 and Okta from &ldquo;turned on&rdquo; to load-bearing infrastructure &mdash; designed, documented, and handed over to your team.</p>
                <div className="prog-meta">
                  <div>
                    <div className="l">Format</div>
                    <div className="v">Fixed shape</div>
                  </div>
                  <div>
                    <div className="l">Length</div>
                    <div className="v">8+ weeks</div>
                  </div>
                  <div>
                    <div className="l">Phases</div>
                    <div className="v">Five, in order</div>
                  </div>
                  <div>
                    <div className="l">Outcome</div>
                    <div className="v">A paved road</div>
                  </div>
                </div>
                <a href="keystone.html" className="btn btn-primary">
                  Explore Keystone <span className="arr"><IconArrow /></span>
                </a>
              </article>
            </Reveal>

            <Reveal delay={120} y={28}>
              <article className="program-card glass continuum-card">
                <div className="prog-mark"><ContinuumMark size={38} /></div>
                <div className="prog-tag">Long-term advisory</div>
                <h3 className="prog-name">Continuum</h3>
                <p>When identity isn&rsquo;t a project but a permanent surface. A retained program with flexible cadence and scope &mdash; quarterly architecture review, FGA updates, integration design, the next migration. Whatever the quarter brings.</p>
                <div className="prog-meta">
                  <div>
                    <div className="l">Format</div>
                    <div className="v">Retained</div>
                  </div>
                  <div>
                    <div className="l">Cadence</div>
                    <div className="v">Quarterly</div>
                  </div>
                  <div>
                    <div className="l">Scope</div>
                    <div className="v">Flexible</div>
                  </div>
                  <div>
                    <div className="l">Term</div>
                    <div className="v">12 months+</div>
                  </div>
                </div>
                <a href="continuum.html" className="btn btn-primary">
                  Talk about Continuum <span className="arr"><IconArrow /></span>
                </a>
              </article>
            </Reveal>

            <Reveal delay={240} y={28}>
              <article className="program-card glass catalyst-card">
                <div className="prog-mark"><CatalystMark size={38} /></div>
                <div className="prog-tag">Custom workshops &amp; training</div>
                <h3 className="prog-name">Catalyst</h3>
                <p>Custom curriculum for engineering teams, security teams, and identity practitioners. Auth0 deep dives, Okta administration, FGA modelling, threat modelling for identity &mdash; built around your stack, with hands-on labs from real engagements.</p>
                <div className="prog-meta">
                  <div>
                    <div className="l">Format</div>
                    <div className="v">Cohort</div>
                  </div>
                  <div>
                    <div className="l">Length</div>
                    <div className="v">1&ndash;3 days</div>
                  </div>
                  <div>
                    <div className="l">Curriculum</div>
                    <div className="v">Custom</div>
                  </div>
                  <div>
                    <div className="l">Mode</div>
                    <div className="v">On-site or remote</div>
                  </div>
                </div>
                <a href="catalyst.html" className="btn btn-primary">
                  Book Catalyst <span className="arr"><IconArrow /></span>
                </a>
              </article>
            </Reveal>

            <Reveal delay={360} y={28}>
              <article className="program-card glass synapse-card">
                <div className="prog-mark"><SynapseMark size={38} /></div>
                <div className="prog-tag">AI &amp; identity</div>
                <h3 className="prog-name">Synapse</h3>
                <p>Identity for the agent era. Architecture and design for AI agents, MCP servers, and LLM-powered apps &mdash; auth flows, fine-grained authorization for agent actions, secrets posture, and the governance to keep it all defensible.</p>
                <div className="prog-meta">
                  <div>
                    <div className="l">Format</div>
                    <div className="v">Flexible</div>
                  </div>
                  <div>
                    <div className="l">Scope</div>
                    <div className="v">AI-oriented</div>
                  </div>
                  <div>
                    <div className="l">Cadence</div>
                    <div className="v">Weekly</div>
                  </div>
                  <div>
                    <div className="l">Term</div>
                    <div className="v">On demand</div>
                  </div>
                </div>
                <a href="synapse.html" className="btn btn-primary">
                  Activate Synapse <span className="arr"><IconArrow /></span>
                </a>
              </article>
            </Reveal>
          </div>
        </div>
      </section>

      {/* APPROACH / PROCESS */}
      <section id="approach" className="section surface-limestone" data-screen-label="04 Approach">
        <div className="wrap" style={{ position: 'relative', zIndex: 1 }}>
          <div className="sec-head">
            <Reveal>
              <div>
                <span className="eyebrow">{TX('home.approach.eyebrow','How we work')}</span>
                <h2>{TX('home.approach.h2a','Slow at the start,')}<br /><span className="alt">{TX('home.approach.h2b','fast everywhere after.')}</span></h2>
              </div>
            </Reveal>
            <Reveal delay={150}>
              <p>{TX('home.approach.desc',"We spend the first phase getting the model right. The rest of the engagement is executing against it — with your team, on visible artefacts. Every stage produces something concrete you can review.")}</p>
            </Reveal>
          </div>

          <Reveal y={20}>
            <div className="process-frame">
              <div className="process-rail" aria-hidden="true">
                <div className="stop">
                  <div className="wk">Week 1</div>
                  <div className="dot" />
                  <div className="tick" />
                </div>
                <div className="stop">
                  <div className="wk">Weeks 1&ndash;2</div>
                  <div className="dot" />
                  <div className="tick" />
                </div>
                <div className="stop">
                  <div className="wk">Weeks 3&ndash;5</div>
                  <div className="dot" />
                  <div className="tick" />
                </div>
                <div className="stop">
                  <div className="wk">Weeks 6&ndash;8+</div>
                  <div className="dot" />
                  <div className="tick" />
                </div>
              </div>

              <div className="process-stages">
                <Reveal delay={0}>
                  <article className="proc-stage">
                    <div className="ps-head">
                      <span className="ps-no">01</span>
                      <span className="ps-wk">Week 1</span>
                    </div>
                    <h4>Frame</h4>
                    <p>Stakeholder mapping, constraints, success measures, threat surface. The honest map of where you actually are.</p>
                    <div className="ps-delivers">
                      <span className="ps-label">Delivers</span>
                      <ul className="ps-list">
                        <li>Stakeholder map</li>
                        <li>Constraints register</li>
                        <li>Success metrics</li>
                      </ul>
                    </div>
                  </article>
                </Reveal>

                <Reveal delay={120}>
                  <article className="proc-stage">
                    <div className="ps-head">
                      <span className="ps-no">02</span>
                      <span className="ps-wk">Weeks 1&ndash;2</span>
                    </div>
                    <h4>Model</h4>
                    <p>Tenancy, identity domains, policy primitives, integration topology. Decisions on the table &mdash; not options.</p>
                    <div className="ps-delivers">
                      <span className="ps-label">Delivers</span>
                      <ul className="ps-list">
                        <li>Target architecture (HLD)</li>
                        <li>Decision log (ADR)</li>
                        <li>Migration strategy</li>
                      </ul>
                    </div>
                  </article>
                </Reveal>

                <Reveal delay={240}>
                  <article className="proc-stage">
                    <div className="ps-head">
                      <span className="ps-no">03</span>
                      <span className="ps-wk">Weeks 3&ndash;5</span>
                    </div>
                    <h4>Specify</h4>
                    <p>Implementation guides, integration plans, runbooks. Reviewed in PRs your engineers own &mdash; the keyboard is theirs.</p>
                    <div className="ps-delivers">
                      <span className="ps-label">Delivers</span>
                      <ul className="ps-list">
                        <li>Implementation guides</li>
                        <li>Integration playbooks</li>
                        <li>Runbooks</li>
                      </ul>
                    </div>
                  </article>
                </Reveal>

                <Reveal delay={360}>
                  <article className="proc-stage">
                    <div className="ps-head">
                      <span className="ps-no">04</span>
                      <span className="ps-wk">Weeks 6&ndash;8+</span>
                    </div>
                    <h4>Handover</h4>
                    <p>Workshops that stick, documentation that gets read, paired review for the first 60 days. By the end, your team owns it.</p>
                    <div className="ps-delivers">
                      <span className="ps-label">Delivers</span>
                      <ul className="ps-list">
                        <li>Engineering workshop</li>
                        <li>Operator workshop</li>
                        <li>Paired review · 60 days</li>
                      </ul>
                    </div>
                  </article>
                </Reveal>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* TRUST + STATS */}
      <section className="section-sm" data-screen-label="05 Trust">
        <div className="wrap">
          <Reveal>
            <div className="trust glass trust-tiers">
              <div className="trust-tier">
                <span className="label">Designed for</span>
                <div className="trust-items">
                  <div className="trust-badge"><span className="dot">A</span> Auth0</div>
                  <div className="trust-badge"><span className="dot">O</span> Okta</div>
                </div>
              </div>
              <div className="trust-tier">
                <span className="label">Migrates from · Integrates with</span>
                <div className="trust-items">
                  <div className="trust-badge"><span className="dot">P</span> Ping</div>
                  <div className="trust-badge"><span className="dot">F</span> ForgeRock</div>
                  <div className="trust-badge"><span className="dot">K</span> Keycloak</div>
                  <div className="trust-badge"><span className="dot">E</span> EntraID</div>
                  <div className="trust-badge"><span className="dot">A</span> AD FS</div>
                  <div className="trust-badge"><span className="dot">C</span> Custom IdPs</div>
                </div>
              </div>
            </div>
          </Reveal>
          <div style={{ height: 16 }} />
          <Reveal delay={120}>
            <div className="stats glass">
              <div>
                <div className="v"><CountUp value={40} suffix="+" /></div>
                <div className="l">{TX('home.stats.engagements','Identity engagements')}</div>
              </div>
              <div>
                <div className="v"><CountUp value={15} /></div>
                <div className="l">{TX('home.stats.industries','Regulated industries')}</div>
              </div>
              <div>
                <div className="v"><CountUp value={6} suffix=" wks" /></div>
                <div className="l">{TX('home.stats.keystone','Median Keystone delivery')}</div>
              </div>
              <div>
                <div className="v" style={{ fontSize: 'clamp(22px, 2.4vw, 32px)', lineHeight: 1.15 }}>Worldwide</div>
                <div className="l">{TX('home.stats.reach','Europe-based delivery')}</div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ABOUT — quiet block */}
      <section id="about" className="section" data-screen-label="06 About">
        <div className="wrap">
          <Reveal>
            <div className="pull glass">
              <blockquote>
                &ldquo;Identity is the cheapest place to do the right thing, and the most expensive place to do the wrong one.&rdquo;
              </blockquote>
              <cite>— Veridyne Solutions, working principle</cite>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="section" data-screen-label="07 FAQ">
        <div className="wrap" style={{ maxWidth: 880 }}>
          <div className="sec-head" style={{ gridTemplateColumns: '1fr' }}>
            <div>
              <span className="eyebrow">{TX('home.faq.eyebrow','Common questions')}</span>
              <h2>{TX('home.faq.h2a','Before you write,')}<br /><span className="alt">{TX('home.faq.h2b','you might be wondering…')}</span></h2>
            </div>
          </div>
          <FAQ />
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="section" data-screen-label="08 Contact">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <span className="eyebrow">{TX('contact.eyebrow',"Let's talk")}</span>
              <h2>{TX('contact.h2a','Start with the')}<br /><span className="alt">{TX('contact.h2b','shortest message that works.')}</span></h2>
            </div>
            <p>{TX('contact.note',"We read every note, reply within one business day, and won't put you in a sequence.")}</p>
          </div>

          <div className="contact-grid">
            <aside className="contact-aside glass">
              <h3>Direct lines.</h3>
              <p>Skip the form &mdash; reach a person, on a channel you already use.</p>
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
              </div>
            </aside>
            <ContactForm />
          </div>
        </div>
      </section>

      <Footer />

      {/* Tweaks panel */}
      <TweaksPanel title="Tweaks">
        <TweakSection label="Atmosphere">
          <TweakRadio label="Glass" value={t.glass}
                      options={["subtle", "moderate", "heavy"]}
                      onChange={(v) => setTweak("glass", v)} />
        </TweakSection>
        <TweakSection label="Brand accent">
          <TweakRadio label="Color"
                      value={t.accent}
                      options={[
                        { value: "copper", label: "Copper" },
                        { value: "brass",  label: "Brass" },
                        { value: "sage",   label: "Sage" },
                      ]}
                      onChange={(v) => setTweak("accent", v)} />
        </TweakSection>
        <TweakSection label="Hero variant">
          <TweakRadio label="Headline"
                      value={String(heroVariant)}
                      options={["0", "1", "2"]}
                      onChange={(v) => setHeroVariant(Number(v))} />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

// FAQ component
function FAQ() {
  const tr = (typeof useT !== 'undefined') ? useT() : (k, fb) => fb || k;
  const _faqItems = tr('home.faq.items');
  const items = _faqItems || [
    { q: "Are you an Auth0 or Okta partner?",
      a: "No — intentionally. We've worked deeply with both Auth0 (by Okta) and Okta Workforce/Customer Identity for years, but we stay independent. That keeps our advice on platform choice, FGA fit, and trade-offs honest — not anchored to a commercial agreement." },
    { q: "How do Keystone, Continuum, Catalyst and Synapse differ?",
      a: "Keystone is a fixed-shape Professional Services engagement — 8+ weeks, five phases, delivered and handed over. Continuum is the long-term version: retained advisory with flexible scope and quarterly cadence, minimum 12 months. Catalyst is custom workshops and training, 1–3 days, cohort-based. Synapse is our AI-and-identity program for teams shipping agents, MCP servers, and LLM-powered apps — flexible format, weekly cadence, on-demand term." },
    { q: "What size company do you typically work with?",
      a: "Series B through public companies — usually where identity has crossed the threshold from a single Auth0 tenant into being load-bearing for the product, the workforce, and the auditors. We also do focused Catalyst workshops and Solution Reviews for earlier-stage teams." },
    { q: "Do you build, or just design?",
      a: "We design and document. Architecture, runbooks, implementation guides, FGA models, integration playbooks — your engineers do the keyboard work, on their schedule, with us in the review. We don't ship code or pipelines on your behalf, and that's deliberate: it keeps your team owning what they run." },
    { q: "Why Auth0 and Okta only?",
      a: "Because depth matters. Years of hands-on with both platforms means we'd rather know two cold than four passably. We'll happily migrate you from Ping, ForgeRock, Keycloak, EntraID, AD FS or homegrown — into Auth0 or Okta. And integrate them where they need to coexist." },
    { q: "What does Synapse actually cover for AI?",
      a: "Identity around agents and LLM apps: auth flows for AI agents acting on behalf of users, fine-grained authorization for agent actions and tool-use, secrets and credential posture for MCP servers, audit and observability for non-human identity. We design the model; your team builds against it." },
    { q: "How long is a typical Keystone engagement?",
      a: "Eight weeks and up for the Foundation shape. Span engagements run 10–12 weeks; Vault (regulated industries) is quoted. Continuum, our long-term program, is a 12-month minimum with quarterly cadence. Catalyst workshops are 1–3 days. Synapse is on-demand with weekly cadence." },
    { q: "How does Continuum pricing work?",
      a: "Retained block of hours, billed monthly, with a 12-month minimum. Scope is flexible across the quarter — architecture review, FGA refresh, integration design, migration prep, whatever surfaces. Quarterly business reviews to re-shape the next block." },
    { q: "Can I do a Catalyst workshop standalone?",
      a: "Yes. Catalyst doesn't require a Keystone or Continuum engagement. Common standalone formats: 2-day Auth0 deep dive for engineering, 1-day Okta administration for IT, 1-day FGA modelling workshop, 3-day identity threat modelling intensive." },
    { q: "Can you sign our paper?",
      a: "Yes. Standard NDAs, MSAs and DPAs are routine. We carry professional indemnity insurance and can accommodate enterprise procurement processes — just point us at your portal." },
    { q: "Where are you based?",
      a: "Europe-based; we work with customers globally. Comfortable across EMEA, Americas and APAC time zones, and under GDPR, UK DPA, SOC 2, ISO 27001, PCI DSS, HIPAA and DORA — your control framework, not ours." },
  ];
  const [open, setOpen] = React.useState(0);
  return (
    <div className="faq">
      {items.map((it, i) => (
        <div key={i} className="faq-item" data-open={open === i ? "1" : "0"}>
          <button className="faq-q" onClick={() => setOpen(open === i ? -1 : i)}>
            <span>{it.q}</span>
            <span className="plus">+</span>
          </button>
          <div className="faq-a">{it.a}</div>
        </div>
      ))}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
