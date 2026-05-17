// synapse-app.jsx — Synapse (AI & identity) program page

function SynapseApp() {
  // Coverage — areas covered (model categories + protocols)
  const coverageBody = (
    <div className="phases">
      <Reveal delay={0} y={28}>
        <div className="phase glass glow-card" data-glow="">
          <div className="ph-num" style={{ color: '#8a6d34' }}>Surface 01</div>
          <h4>Cloud LLMs</h4>
          <p>ChatGPT (OpenAI), Claude (Anthropic), Gemini (Google) wired into Auth0 or Okta. User auth, org-scoped tokens, audit posture.</p>
          <ul>
            <li>OpenAI Platform</li>
            <li>Anthropic API</li>
            <li>Google Gemini</li>
          </ul>
        </div>
      </Reveal>
      <Reveal delay={100} y={28}>
        <div className="phase glass glow-card" data-glow="">
          <div className="ph-num" style={{ color: '#8a6d34' }}>Surface 02</div>
          <h4>On-prem &amp; local</h4>
          <p>Self-hosted models behind your identity edge. vLLM, Ollama, Bedrock private endpoints, Azure AI Foundry, internal model gateways.</p>
          <ul>
            <li>vLLM / Ollama</li>
            <li>Bedrock private</li>
            <li>Azure AI</li>
          </ul>
        </div>
      </Reveal>
      <Reveal delay={200} y={28}>
        <div className="phase glass glow-card" data-glow="">
          <div className="ph-num" style={{ color: '#8a6d34' }}>Surface 03</div>
          <h4>Agents &amp; MCP</h4>
          <p>Authorization for agent actions and tool-use. MCP server posture. Token-bounded delegation. Audit trails for non-human identity.</p>
          <ul>
            <li>MCP servers</li>
            <li>Tool-use authz</li>
            <li>Agent identity</li>
          </ul>
        </div>
      </Reveal>
      <Reveal delay={300} y={28}>
        <div className="phase glass glow-card" data-glow="">
          <div className="ph-num" style={{ color: '#8a6d34' }}>Surface 04</div>
          <h4>Governance</h4>
          <p>The posture document your CISO and your auditor both sign. Data flow maps, retention, regional residency, DLP, EU AI Act and DORA alignment.</p>
          <ul>
            <li>EU AI Act</li>
            <li>DORA / DPA</li>
            <li>DLP &amp; retention</li>
          </ul>
        </div>
      </Reveal>
    </div>
  );

  // Engagement model — on-demand pricing
  const engagementBody = (
    <div className="eng-table glass">
      {[
        { name: "Synapse \u00b7 Spike",
          desc: "One question, two weeks. Often the right starting point: an AI agent auth model, an MCP server posture review, a single integration design.",
          len: "2 weeks \u00b7 Fixed price" },
        { name: "Synapse \u00b7 Sprint",
          desc: "Four to six weeks. Multi-question scope \u2014 design the agent identity model, model the FGA, write the playbook, hand it to your team.",
          len: "4\u20136 weeks \u00b7 Fixed price" },
        { name: "Synapse \u00b7 Cadence",
          desc: "Weekly working sessions plus on-demand spikes. For teams shipping AI features continuously who need an identity advisor on speed-dial.",
          len: "Weekly \u00b7 On demand" },
        { name: "Synapse \u00b7 Audit",
          desc: "Diagnostic-only. We assess your current AI-and-identity surface against EU AI Act, DORA, and your control framework. Findings + remediation plan.",
          len: "2 weeks \u00b7 Fixed price" },
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
      programKey="synapse"
      eyebrow="Synapse · A Veridyne Solutions program"
      headline={{
        segments: [
          { text: "Identity for the " },
          { text: "agent era.", className: "accent" },
        ],
      }}
      lede={"Synapse is our AI-and-identity program. Architecture for ChatGPT, Claude, Gemini, and local LLMs \u2014 plus the agents, MCP servers and tool-use authorization underneath \u2014 wired into Auth0 or Okta with the governance your CISO will sign."}
      primaryCta={{ label: "See engagement shapes", href: "#engagement" }}
      secondaryCta={{ label: "Activate Synapse", href: "#contact" }}
      meta={[
        { icon: <IconBriefcase />, label: "Format",  value: "Flexible" },
        { icon: <IconLayers />,    label: "Scope",   value: "AI-oriented" },
        { icon: <IconClock />,     label: "Cadence", value: "Weekly" },
        { icon: <IconRoute />,     label: "Term",    value: "On demand" },
      ]}
      illustration={<KeystoneIllustration active="synapse" />}
      what={{
        eyebrow: "The thesis",
        h2: (<>Agents need identity.<br /><span className="alt">Your identity stack doesn't know yet.</span></>),
        lede: "Auth0 and Okta were built around humans. Agents, MCP servers, and LLM apps don't behave like humans, and the questions they raise \u2014 delegation, tool-use authorization, non-human audit \u2014 don't have boilerplate answers. Synapse is the program that designs them.",
        cards: [
          { tag: "For teams that",
            h3: "Ship AI seriously",
            p: "You\u2019ve put ChatGPT, Claude or Gemini in front of users. Or behind agents. Or both. The auth model is held together with assumptions. The CISO has questions. The auditor has more." },
          { tag: "What you get",
            h3: "An auth model that holds",
            p: "Designed auth flows for human + agent identities. FGA models for tool-use and delegation. MCP server posture review. Governance documentation mapped to EU AI Act and DORA \u2014 not after, during." },
          { tag: "What it isn't",
            h3: "Not an AI strategy deck",
            p: "We don't write you a 30-page \u201cgenerative AI roadmap.\u201D Synapse is identity work, scoped to the AI surfaces that need it. If you need broader AI strategy, we'll happily refer you out." },
        ],
      }}
      middleSection={{
        id: "coverage",
        eyebrow: "What we cover",
        h2: (<>Four AI surfaces,<br /><span className="alt">all on Auth0 or Okta.</span></>),
        lede: "Cloud LLMs, on-prem models, the agents and MCP servers under them, and the governance posture on top. Cohesive, identity-first design across all four.",
        body: coverageBody,
      }}
      engagement={{
        id: "engagement",
        eyebrow: "Engagement shapes",
        h2: (<>From a two-week spike<br /><span className="alt">to a weekly cadence.</span></>),
        lede: "Synapse is on demand by design \u2014 AI moves too fast for a fixed eight-week shape. Pick the scope that matches the question on the table this month.",
        body: engagementBody,
      }}
      deliverables={{
        eyebrow: "What lands in your repo",
        h2: (<>Models, playbooks,<br /><span className="alt">audit posture.</span></>),
        lede: "Every Synapse engagement produces the same shape of artefact set \u2014 designed, documented, owned by your team.",
        items: [
          { Icon: IconBlueprint,  name: "Agent Identity Model",      desc: "How human, service, and agent identities relate. Delegation, scoping, lifetimes. Diagrams + ADRs." },
          { Icon: IconFGA,        name: "Tool-Use Authorization",    desc: "FGA model for which agents can call which tools, on whose behalf, against which resources. Source-controlled." },
          { Icon: IconWrench,     name: "MCP Posture Review",        desc: "Your MCP servers assessed \u2014 auth, secrets, audit, blast radius. Per-server remediation plan." },
          { Icon: IconClipboard,  name: "Integration Playbooks",     desc: "Per-LLM integration guides: ChatGPT, Claude, Gemini, and your local model edge. Tested by your engineers." },
          { Icon: IconReview,     name: "Governance Pack",           desc: "Data flow maps, retention, regional residency, EU AI Act + DORA mapping. Audit-ready, human-readable." },
          { Icon: IconSecurity,   name: "Threat Model",              desc: "STRIDE applied to your AI surfaces \u2014 prompt injection, indirect injection, agent abuse, model exfil. Ranked." },
        ],
      }}
      stats={[
        { value: 2,          suffix: " wks", label: "Spike start" },
        { value: 4,                          label: "Surfaces covered" },
        { value: 0,                          label: "Strategy decks" },
        { value: "Worldwide",                label: "Europe-based delivery" },
      ]}
      quote={{
        text: "\u201CIdentity built for humans won't hold agents. Synapse is the redesign.\u201D",
        cite: "\u2014 The Synapse rationale",
      }}
      contact={{
        eyebrow: "Activate Synapse",
        h2: (<>Scope a spike<br /><span className="alt">in one call.</span></>),
        lede: "30-minute call. We'll match an engagement shape to the AI surface you're shipping next, tell you which surface to start with, and where Synapse isn't the right tool yet.",
        asideTitle: "Talk to the lead.",
        asideLede: "You\u2019ll speak with whoever would run your Synapse \u2014 not a sales engineer.",
      }}
      topicForContact="Synapse (AI)"
      tweakDefaults={TWEAK_DEFAULTS}
    />
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<SynapseApp />);
