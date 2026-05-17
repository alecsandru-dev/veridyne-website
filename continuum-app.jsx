// continuum-app.jsx — Continuum (long-term advisory) program page

function ContinuumApp() {
  // Rhythm section body — quarterly + weekly cadence visualized
  const rhythmBody = (
    <>
      <div className="phases">
        <Reveal delay={0} y={28}>
          <div className="phase glass glow-card" data-glow="">
            <div className="ph-num" style={{ color: '#8a6d34' }}>Beat 01 · Weekly</div>
            <h4>Working session</h4>
            <p>One scheduled hour, every week. Architecture questions, design review on whatever your team is shipping, decisions before they harden into regret.</p>
            <ul>
              <li>Design review</li>
              <li>ADR drafting</li>
              <li>Unblock decisions</li>
            </ul>
          </div>
        </Reveal>
        <Reveal delay={100} y={28}>
          <div className="phase glass glow-card" data-glow="">
            <div className="ph-num" style={{ color: '#8a6d34' }}>Beat 02 · Monthly</div>
            <h4>Deep dive</h4>
            <p>One topic, picked from a backlog you and we maintain together. Architecture spike, FGA refresh, integration plan — whatever needs four hours of focus this month.</p>
            <ul>
              <li>Deep-dive deliverable</li>
              <li>Async write-up</li>
              <li>Follow-on actions</li>
            </ul>
          </div>
        </Reveal>
        <Reveal delay={200} y={28}>
          <div className="phase glass glow-card" data-glow="">
            <div className="ph-num" style={{ color: '#8a6d34' }}>Beat 03 · Quarterly</div>
            <h4>Architecture review</h4>
            <p>Half-day, your team in the room. Where the identity model has drifted, where it&rsquo;s working, what needs to change. Outputs as ADRs and a refreshed posture document.</p>
            <ul>
              <li>Quarterly review pack</li>
              <li>Refreshed ADR log</li>
              <li>Roadmap delta</li>
            </ul>
          </div>
        </Reveal>
        <Reveal delay={300} y={28}>
          <div className="phase glass glow-card" data-glow="">
            <div className="ph-num" style={{ color: '#8a6d34' }}>Beat 04 · On call</div>
            <h4>When it lights up</h4>
            <p>Production incident with an identity surface. A vendor cutover with a hard date. A board question that needs a one-page answer by tomorrow. We&rsquo;re on Slack, on the call, on the document.</p>
            <ul>
              <li>Incident assist</li>
              <li>Rapid review</li>
              <li>Board-grade memos</li>
            </ul>
          </div>
        </Reveal>
      </div>
    </>
  );

  // Levels — block sizes (light to heavy)
  const levelsBody = (
    <div className="eng-table glass">
      {[
        { name: "Continuum · Light",
          desc: "One working session per week, one deep dive per month, quarterly review. The cadence-only tier — for teams who mostly need a thinking partner in the room.",
          len: "20 hrs/mo · 12-month min" },
        { name: "Continuum · Standard",
          desc: "Working sessions, deep dives, plus active design and review on two or three concurrent workstreams. The default — covers most identity-mature mid-market and enterprise teams.",
          len: "40 hrs/mo · 12-month min" },
        { name: "Continuum · Heavy",
          desc: "Significant ongoing scope: multiple migrations in flight, FGA model evolution, AI-and-identity scope, audit cycles. Two named consultants assigned.",
          len: "80 hrs/mo · 12-month min" },
        { name: "Continuum · Custom",
          desc: "Multi-region, multi-product, multi-regulator. Embedded engagement with reserved bandwidth and named bench depth. Quoted.",
          len: "Quoted" },
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
      programKey="continuum"
      eyebrow="Continuum · A Veridyne Solutions program"
      headline={{
        segments: [
          { text: "Identity isn't a project." },
          { br: true },
          { text: "It's a permanent surface.", className: "accent" },
        ],
      }}
      lede={"Continuum is our long-term identity advisory. A retained partnership with weekly working sessions and quarterly architecture reviews \u2014 flexible scope across Auth0, Okta, FGA, migrations, and the next thing that surfaces."}
      primaryCta={{ label: "See engagement levels", href: "#levels" }}
      secondaryCta={{ label: "Talk to us", href: "#contact" }}
      meta={[
        { icon: <IconBriefcase />, label: "Format",  value: "Retained" },
        { icon: <IconClock />,     label: "Cadence", value: "Weekly + quarterly" },
        { icon: <IconLayers />,    label: "Scope",   value: "Flexible" },
        { icon: <IconRoute />,     label: "Term",    value: "12 months+" },
      ]}
      illustration={<KeystoneIllustration active="continuum" />}
      what={{
        eyebrow: "The thesis",
        h2: (<>Architecture has<br /><span className="alt">a half-life.</span></>),
        lede: "What looked right at sign-off won't look right twelve months out. New integrations land, threat models shift, regulators move. Continuum is the rhythm that keeps identity from drifting into accident again.",
        cards: [
          { tag: "For teams that",
            h3: "Outgrow projects",
            p: "You shipped Keystone or your own equivalent. Identity is decent. But the questions keep coming \u2014 from product, security, audit, M&A \u2014 and nobody owns the architecture. That's Continuum's job." },
          { tag: "What you get",
            h3: "A second brain",
            p: "Weekly thinking partner with a 360-degree view of your identity estate. Quarterly architecture reviews that catch drift early. A backlog of deep dives you'd never get to alone." },
          { tag: "What it isn't",
            h3: "Not staff augmentation",
            p: "Continuum isn't a body-shop subscription. We don't replace engineers. We're the advisor in the room when the decision is expensive, and the writer on the document when it needs to be precise." },
        ],
      }}
      middleSection={{
        id: "rhythm",
        eyebrow: "Five beats",
        h2: (<>The shape of<br /><span className="alt">a Continuum quarter.</span></>),
        lede: "Predictable rhythm, predictable budget, predictable artefacts. Surprise scope handled inside the same shape \u2014 not as a change order.",
        body: rhythmBody,
      }}
      engagement={{
        id: "levels",
        eyebrow: "Engagement levels",
        h2: (<>One program,<br /><span className="alt">four block sizes.</span></>),
        lede: "Pick the block that matches your scope today. Re-size every six months \u2014 same shape, different weight.",
        body: levelsBody,
      }}
      deliverables={{
        eyebrow: "What lands every quarter",
        h2: (<>Rolling artefacts<br /><span className="alt">you actually use.</span></>),
        lede: "Continuum produces the same artefact shapes every quarter \u2014 versioned, source-controlled, owned by your team.",
        items: [
          { Icon: IconDoc,        name: "Architecture Decision Log", desc: "Every decision recorded \u2014 alternatives, trade-off, date. Live document, updated weekly." },
          { Icon: IconBlueprint,  name: "Quarterly Posture Pack",    desc: "~10-page review of where the identity estate has drifted, what changed, what to change next. Board-ready." },
          { Icon: IconClipboard,  name: "Runbook Library",           desc: "Rolling library of runbooks \u2014 cutover, incident, rotation, recovery. Tested in tabletop exercises." },
          { Icon: IconReview,     name: "Posture Reviews",           desc: "Quarterly architecture review against NIST, SOC 2 CC6, your own controls. Findings ranked by blast radius." },
          { Icon: IconWorkshop,   name: "Internal Workshops",        desc: "Two short workshops per quarter \u2014 onboarding new engineers, threat modelling, FGA refresh." },
          { Icon: IconSecurity,   name: "Continuity Plan",           desc: "Identity disaster-recovery plan refreshed quarterly. Failure modes mapped to people, runbooks, and timing." },
        ],
      }}
      stats={[
        { value: 4,            suffix: " beats", label: "Per quarter" },
        { value: 12,           suffix: " mos",   label: "Minimum term" },
        { value: 0,                              label: "Body-shop hours" },
        { value: "Worldwide",                    label: "Europe-based delivery" },
      ]}
      quote={{
        text: "\u201CIdentity drifts. Continuum is the corrective that doesn't depend on a project being live.\u201D",
        cite: "\u2014 On the half-life of architecture",
      }}
      contact={{
        eyebrow: "Start a Continuum",
        h2: (<>Talk to the lead<br /><span className="alt">about a long-term shape.</span></>),
        lede: "30-minute call. We'll talk about your identity estate today, the cadence that would actually be useful, and which engagement level matches.",
        asideTitle: "Talk to the lead.",
        asideLede: "You\u2019ll speak with whoever would run your Continuum \u2014 not a sales engineer.",
      }}
      topicForContact="Continuum (long-term)"
      tweakDefaults={TWEAK_DEFAULTS}
    />
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<ContinuumApp />);
