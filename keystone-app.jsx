// keystone-app.jsx — Keystone (productized PS) program page

function KeystoneApp() {
  // Phases — five-phase delivery model
  const phasesBody = (
    <>
      <div className="phases">
        <Reveal delay={0} y={28}>
          <div className="phase glass glow-card" data-glow="">
            <div className="ph-num" style={{ color: '#8a6d34' }}>Phase 01 · Week 1</div>
            <h4>Survey</h4>
            <p>Stakeholders, threat surface, current-state inventory. The honest map.</p>
            <ul>
              <li>Tenant audit</li>
              <li>Integration map</li>
              <li>Risk register</li>
            </ul>
          </div>
        </Reveal>
        <Reveal delay={100} y={28}>
          <div className="phase glass glow-card" data-glow="">
            <div className="ph-num" style={{ color: '#8a6d34' }}>Phase 02 · Weeks 1&ndash;2</div>
            <h4>Model</h4>
            <p>Identity domains, tenancy, policy primitives. Reviewed, decided, signed.</p>
            <ul>
              <li>Target architecture</li>
              <li>Decision log (ADR)</li>
              <li>Migration strategy</li>
            </ul>
          </div>
        </Reveal>
        <Reveal delay={200} y={28}>
          <div className="phase glass glow-card" data-glow="">
            <div className="ph-num" style={{ color: '#8a6d34' }}>Phase 03 · Weeks 3&ndash;5</div>
            <h4>Specify</h4>
            <p>Implementation guides, integration plans, runbooks. Per system in scope. Reviewed in PRs your engineers own.</p>
            <ul>
              <li>Implementation guides</li>
              <li>Integration plans</li>
              <li>Runbooks</li>
            </ul>
          </div>
        </Reveal>
        <Reveal delay={300} y={28}>
          <div className="phase glass glow-card" data-glow="">
            <div className="ph-num" style={{ color: '#8a6d34' }}>Phase 04 · Weeks 6&ndash;7</div>
            <h4>Migrate</h4>
            <p>Cutover plan. Tested in staging, rehearsed with your team, executed against the runbook by your engineers &mdash; with us on the call.</p>
            <ul>
              <li>Cutover runbook</li>
              <li>Rollback plan</li>
              <li>Comms templates</li>
            </ul>
          </div>
        </Reveal>
      </div>
      <div className="spacer-4" />
      <Reveal delay={100} y={28}>
        <div className="phases" style={{ gridTemplateColumns: "1fr" }}>
          <div className="phase glass glow-card" data-glow="" style={{
            background: 'rgba(158,123,59,0.12)',
            borderColor: 'rgba(158,123,59,0.35)',
          }}>
            <div className="ph-num" style={{ color: '#8a6d34' }}>Phase 05 · Week 8 + 60 days</div>
            <h4 style={{ fontSize: 32 }}>Handover &amp; review</h4>
            <p style={{ maxWidth: '60ch' }}>The bit other PS firms skip. We run a structured handover &mdash; workshops, runbooks-in-anger, paired review &mdash; for 60 days after go-live. By the end, your team owns it, in the way that matters: they can change it.</p>
            <ul style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
              <li>Engineering workshop · 2 days</li>
              <li>Operator workshop · 1 day</li>
              <li>Paired review · 60 days</li>
              <li>Quarterly review · year one</li>
            </ul>
          </div>
        </div>
      </Reveal>
    </>
  );

  // Engagement model — Foundation / Span / Vault / Review
  const engagementBody = (
    <div className="eng-table glass">
      {[
        { name: "Keystone · Foundation",
          desc: "Single-tenant Auth0 or Okta. Greenfield or first-replatform. One product surface, one workforce surface, clean migration. The standard shape.",
          len: "8 weeks · Fixed price" },
        { name: "Keystone · Span",
          desc: "Multi-tenant, multi-region, or mixed workforce + customer identity. Heavier modelling phase. Federation, SCIM, custom domains, audit posture all in scope.",
          len: "10–12 weeks · Fixed price" },
        { name: "Keystone · Vault",
          desc: "Regulated industries — DORA, HIPAA, PCI, SOC 2 Type II. Extended hardening phase, evidence packages, third-party audit liaison. Quoted per engagement.",
          len: "14+ weeks · Quoted" },
        { name: "Keystone · Review",
          desc: "Diagnostic-only. We assess an existing IAM estate against the same model and hand you the gap and the plan. The starting point if you're not sure you need the whole program yet.",
          len: "2 weeks · Fixed price" },
      ].map((row, i) => (
        <Reveal key={i} delay={i * 80} y={16}>
          <div className="eng-row">
            <div className="eng-name">{row.name}</div>
            <div className="eng-desc">{row.desc}</div>
            <div className="eng-len">{row.len}</div>
          </div>
        </Reveal>
      ))}
    </div>
  );

  return (
    <ProgramPage
      programKey="keystone"
      eyebrow="Keystone · A Veridyne Solutions program"
      headline={{
        segments: [
          { text: "The one stone that" },
          { br: true },
          { text: "holds the arch.", className: "accent" },
        ],
      }}
      lede={"Keystone is our productized Professional Services engagement. A fixed-shape program that takes Auth0 and Okta from \u201Cturned on\u201D to load-bearing infrastructure \u2014 designed, documented, and handed over to your team in eight weeks and up."}
      primaryCta={{ label: "See engagement shapes", href: "#engagements" }}
      secondaryCta={{ label: "Talk to us", href: "#contact" }}
      meta={[
        { icon: <IconBriefcase />, label: "Format",  value: "Fixed-shape PS" },
        { icon: <IconClock />,     label: "Length",  value: "8+ weeks" },
        { icon: <IconLayers />,    label: "Phases",  value: "Five, in order" },
        { icon: <IconRoute />,     label: "Outcome", value: "A paved road" },
      ]}
      illustration={<KeystoneIllustration active="keystone" />}
      what={{
        eyebrow: "The thesis",
        h2: (<>An identity stack<br /><span className="alt">should feel inevitable.</span></>),
        lede: "Most IAM implementations are accidents of history — one tenant, one urgent integration, one departed engineer at a time. Keystone replaces the accident with a deliberate model.",
        cards: [
          { tag: "For teams that",
            h3: "Have outgrown defaults",
            p: "One tenant became three. The custom action pile is the documentation. Your auth incident-to-launch ratio is climbing. Time for a model that scales past the next year." },
          { tag: "What you get",
            h3: "Architecture, written down",
            p: "A target architecture, the migration plan to it, and the implementation guides to get you there. Documentation that\u2019s grep-able, runbooks that match reality, and a team that knows how to extend it." },
          { tag: "What it isn\u2019t",
            h3: "Not a body-shop",
            p: "Keystone is opinionated. We bring the pattern, the tools, and a calendar of decisions. If you want hands at the keyboard with no architectural debate, hire contractors." },
        ],
      }}
      middleSection={{
        id: "phases",
        eyebrow: "Five phases",
        h2: (<>The shape of<br /><span className="alt">a Keystone engagement.</span></>),
        lede: "Phases are sequential, time-boxed, and visible. You see the artefacts as they emerge — not on the last day.",
        body: phasesBody,
      }}
      engagement={{
        id: "engagements",
        eyebrow: "Engagement shapes",
        h2: (<>One program,<br /><span className="alt">four sizes.</span></>),
        lede: "Keystone is a shape. The shape is fixed; the scope inside it flexes to match your stack\u2019s weight class.",
        body: engagementBody,
      }}
      deliverables={{
        eyebrow: "What lands in your repo",
        h2: (<>Artefacts<br /><span className="alt">you actually use.</span></>),
        lede: "Every Keystone engagement produces the same artefact set. Different stack, same shelf. You can name the files before we start.",
        items: [
          { Icon: IconBlueprint,  name: "Target Architecture (HLD)",  desc: "Identity domains, tenancy, policy model, integration topology. ~25 pages, every diagram source-controlled." },
          { Icon: IconDoc,        name: "Architecture Decision Log",  desc: "Every decision, the alternatives, the trade-off, the date. The artefact your future engineers will thank you for." },
          { Icon: IconWrench,     name: "Implementation Guides",      desc: "Step-by-step for your engineers: per-integration walkthroughs, configuration screenshots, copy-pasteable snippets, and the gotchas we hit so you don't." },
          { Icon: IconClipboard,  name: "Runbooks & Migration Plan",  desc: "Cutover runbook, rollback plan, on-call playbook, incident comms templates. Tested in pre-prod before they go live." },
          { Icon: IconWorkshop,   name: "Workshops & Recordings",     desc: "Engineering and operator workshops, custom-built to your stack. Recorded for the next hire on day one." },
          { Icon: IconSecurity,   name: "Audit Evidence Pack",        desc: "Mapped to NIST 800-63, SOC 2 CC6, and your control framework. Hand it to your auditor; we'll be in the room if you want." },
        ],
      }}
      stats={[
        { value: 8,             suffix: " wks", label: "Median delivery" },
        { value: 5,             suffix: "×",    label: "Faster post-handover changes" },
        { value: 0,                             label: "SaaS lock-in clauses" },
        { value: "Worldwide",                   label: "Europe-based delivery" },
      ]}
      quote={{
        text: "\u201CThe keystone is the smallest piece. Nothing stands without it.\u201D",
        cite: "\u2014 On architectural load",
      }}
      contact={{
        eyebrow: "Start a Keystone",
        h2: (<>Scope a fit<br /><span className="alt">in one call.</span></>),
        lede: "30-minute call. We'll tell you which engagement shape fits, what we'd cover in Phase 01, and where Keystone is the wrong tool for the job.",
        asideTitle: "Talk to the lead.",
        asideLede: "You\u2019ll speak with whoever would run your engagement \u2014 not a sales engineer.",
      }}
      topicForContact="Keystone engagement"
      tweakDefaults={TWEAK_DEFAULTS}
    />
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<KeystoneApp />);
