// catalyst-app.jsx — Catalyst (custom workshops & training) program page

function CatalystApp() {
  // Formats — half-day, two-day, intensive
  const formatsBody = (
    <div className="phases" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
      <Reveal delay={0} y={28}>
        <div className="phase glass glow-card" data-glow="">
          <div className="ph-num" style={{ color: '#8a6d34' }}>Format 01 · 4 hours</div>
          <h4>Briefing</h4>
          <p>One topic, half a day, your room. The shortest path from "we should learn this" to "we can have the right meeting about it."</p>
          <ul>
            <li>Up to 12 attendees</li>
            <li>Live + interactive</li>
            <li>Workbook handout</li>
          </ul>
        </div>
      </Reveal>
      <Reveal delay={120} y={28}>
        <div className="phase glass glow-card" data-glow="">
          <div className="ph-num" style={{ color: '#8a6d34' }}>Format 02 · 2 days</div>
          <h4>Deep dive</h4>
          <p>The default. Two days, hands-on labs against your stack (or a sanitized clone), patterns the team will actually use the week after.</p>
          <ul>
            <li>Up to 16 attendees</li>
            <li>Hands-on labs</li>
            <li>Take-home reference</li>
          </ul>
        </div>
      </Reveal>
      <Reveal delay={240} y={28}>
        <div className="phase glass glow-card" data-glow="">
          <div className="ph-num" style={{ color: '#8a6d34' }}>Format 03 · 3 days</div>
          <h4>Intensive</h4>
          <p>Three days, mixed-cohort (engineering + security + IT), built around a real engagement. Often the right shape before a Keystone kickoff.</p>
          <ul>
            <li>Mixed cohort</li>
            <li>Real-engagement basis</li>
            <li>Output: team capability map</li>
          </ul>
        </div>
      </Reveal>
    </div>
  );

  // Catalog — list of available workshops
  const catalogBody = (
    <div className="eng-table glass">
      {[
        { name: "Auth0 for Engineers",
          desc: "Deep dive into Auth0 \u2014 Universal Login, Actions, custom domains, organizations, custom database connections, deployment pipelines. Pattern-first, not API-tour.",
          len: "2 days \u00b7 Engineering" },
        { name: "Okta Workforce Administration",
          desc: "For IT and identity teams running Okta. Group rules, app integration patterns, lifecycle workflows, MFA strategy, monitoring. Real config exercises.",
          len: "2 days \u00b7 IT + Security" },
        { name: "FGA Modelling",
          desc: "Authorization that scales past role lists. Auth0 FGA and OpenFGA models, ReBAC patterns, migration from RBAC, performance and audit. Hands-on labs.",
          len: "1 day \u00b7 Engineering" },
        { name: "Identity Threat Modelling",
          desc: "STRIDE applied to identity surfaces \u2014 federation, session, token, agent. Workshop-style: bring your architecture, leave with a ranked threat model.",
          len: "1 day \u00b7 Security" },
        { name: "AI &amp; Identity",
          desc: "Identity for ChatGPT, Claude, Gemini, and local LLMs. Agent auth flows, tool-use authorization, MCP server posture, audit for non-human identity.",
          len: "1 day \u00b7 Engineering + Security" },
        { name: "Migration Bootcamp",
          desc: "Two days walking your team through a real migration plan \u2014 Ping/ForgeRock/Keycloak/AD\u00a0FS into Auth0 or Okta. Cutover patterns, rollback, communication.",
          len: "2 days \u00b7 Engineering + IT" },
        { name: "Custom",
          desc: "Built for your stack, your team, your week. Common one-offs: incident retrospective workshops, executive briefings, board-prep sessions.",
          len: "Quoted" },
      ].map((row, i) => (
        <Reveal key={i} delay={i * 60} y={16}>
          <div className="eng-row">
            <div className="eng-name">{row.name}</div>
            <div className="eng-desc" dangerouslySetInnerHTML={{ __html: row.desc }} />
            <div className="eng-len">{row.len}</div>
          </div>
        </Reveal>
      ))}
    </div>
  );

  return (
    <ProgramPage
      programKey="catalyst"
      eyebrow="Catalyst · A Veridyne Solutions program"
      headline={{
        segments: [
          { text: "Sharper teams." },
          { br: true },
          { text: "Faster decisions.", className: "accent" },
        ],
      }}
      lede={"Catalyst is custom workshops and training for engineering, security, and identity teams. Auth0, Okta, FGA, AI-and-identity, threat modelling \u2014 built around your stack, with hands-on labs from real engagements."}
      primaryCta={{ label: "See the catalog", href: "#catalog" }}
      secondaryCta={{ label: "Book a workshop", href: "#contact" }}
      meta={[
        { icon: <IconBriefcase />, label: "Format",     value: "Cohort" },
        { icon: <IconClock />,     label: "Length",     value: "1\u20133 days" },
        { icon: <IconLayers />,    label: "Curriculum", value: "Custom" },
        { icon: <IconGlobe />,     label: "Mode",       value: "On-site or remote" },
      ]}
      illustration={<KeystoneIllustration active="catalyst" />}
      what={{
        eyebrow: "The thesis",
        h2: (<>Training that travels.<br /><span className="alt">Not training that decorates.</span></>),
        lede: "Most identity training is a tour of an API. Catalyst is built backwards from the patterns we use on real engagements \u2014 so your team leaves with mental models, not slides.",
        cards: [
          { tag: "For teams that",
            h3: "Need to level up fast",
            p: "New Auth0 tenant landing next quarter. First Okta admin hire. A board that wants identity-literate engineers. Catalyst gets the team to the same vocabulary, fast." },
          { tag: "What you get",
            h3: "Hands-on, your stack",
            p: "Cohort sessions with real labs \u2014 against your tenant or a clean clone. Workbook attendees keep. Recordings for the next hire on day one. Office hours after the session." },
          { tag: "What it isn't",
            h3: "Not a vendor pitch",
            p: "We don't sell licenses. We don't have a partner quota. The session is the work \u2014 architecture, patterns, gotchas \u2014 not a path to procurement." },
        ],
      }}
      middleSection={{
        id: "formats",
        eyebrow: "Three formats",
        h2: (<>From a briefing<br /><span className="alt">to an intensive.</span></>),
        lede: "Same patterns, different depth. Pick by how much your team needs to absorb and how much they can take off the line.",
        body: formatsBody,
      }}
      engagement={{
        id: "catalog",
        eyebrow: "Workshop catalog",
        h2: (<>What we run<br /><span className="alt">most often.</span></>),
        lede: "Our standing curriculum. Every session is tailored to your stack, your team's seniority, and what you're trying to ship next.",
        body: catalogBody,
      }}
      deliverables={{
        eyebrow: "What your team walks away with",
        h2: (<>Skills built,<br /><span className="alt">artefacts kept.</span></>),
        lede: "Every Catalyst cohort produces the same shapes of output \u2014 portable, reviewable, and useful the week after.",
        items: [
          { Icon: IconDoc,        name: "Workbook",                desc: "Annotated reference \u2014 patterns, anti-patterns, gotchas. Yours to keep, yours to extend." },
          { Icon: IconClipboard,  name: "Lab Artefacts",           desc: "Working configurations, FGA models, integration plans \u2014 produced during labs against your real stack." },
          { Icon: IconWorkshop,   name: "Session Recordings",      desc: "Every session recorded and indexed. Onboarding the next hire is a link." },
          { Icon: IconBlueprint,  name: "Capability Map",          desc: "Honest assessment of where the cohort stands at the end \u2014 ranked by topic. Useful for hiring plans." },
          { Icon: IconReview,     name: "Office-Hours Calendar",   desc: "Four follow-up office hours over the month after the session. Where most of the real questions land." },
          { Icon: IconSecurity,   name: "Threat-Model Output",     desc: "If your session was identity threat modelling, you leave with a ranked threat model of your real architecture." },
        ],
      }}
      stats={[
        { value: 16,          suffix: "",     label: "Cohort max" },
        { value: 3,           suffix: " days", label: "Longest format" },
        { value: 4,           suffix: "",     label: "Office hours after" },
        { value: "Worldwide",                 label: "On-site or remote" },
      ]}
      quote={{
        text: "\u201CYour engineers shouldn't have to learn identity by being on call for it.\u201D",
        cite: "\u2014 The Catalyst rationale",
      }}
      contact={{
        eyebrow: "Book a Catalyst",
        h2: (<>Plan a cohort<br /><span className="alt">in one call.</span></>),
        lede: "30-minute call. We'll match a format to what you're trying to ship next, walk through workshop options, and quote you the same week.",
        asideTitle: "Talk to the lead.",
        asideLede: "You\u2019ll speak with whoever would run your workshop \u2014 not a sales engineer.",
      }}
      topicForContact="Catalyst (workshops)"
      tweakDefaults={TWEAK_DEFAULTS}
    />
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<CatalystApp />);
