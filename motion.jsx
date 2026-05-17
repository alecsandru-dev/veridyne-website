// motion.jsx — shared animation primitives + interactions
// Keep this lightweight: IntersectionObserver + rAF + CSS variables.
// No external libs.

// ─── useInView ─────────────────────────────────────────────────────────────
function useInView(ref, opts = {}) {
  const [inView, setInView] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (typeof IntersectionObserver === 'undefined') { setInView(true); return undefined; }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setInView(true);
            if (opts.once !== false) io.unobserve(el);
          } else if (opts.once === false) {
            setInView(false);
          }
        });
      },
      { rootMargin: opts.rootMargin || "-10% 0px -10% 0px", threshold: opts.threshold || 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [opts.once, opts.rootMargin, opts.threshold]);
  return inView;
}

// ─── Reveal ────────────────────────────────────────────────────────────────
// Lift + fade content as it enters view. delay supports stagger.
function Reveal({ children, delay = 0, y = 24, duration = 700, as: Tag = "div", className = "", style = {}, ...rest }) {
  const ref = React.useRef(null);
  const visible = useInView(ref);
  const finalStyle = {
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0px)" : `translateY(${y}px)`,
    transition: `opacity ${duration}ms cubic-bezier(.22,.61,.36,1) ${delay}ms, transform ${duration}ms cubic-bezier(.22,.61,.36,1) ${delay}ms`,
    willChange: "opacity, transform",
    ...style,
  };
  return <Tag ref={ref} className={className} style={finalStyle} {...rest}>{children}</Tag>;
}

// ─── RevealStagger ─────────────────────────────────────────────────────────
// Wraps direct children, applying an incremental delay to each.
function RevealStagger({ children, delay = 0, step = 80, y = 24, duration = 700, className = "", style = {} }) {
  const arr = React.Children.toArray(children);
  return (
    <>
      {arr.map((child, i) => (
        <Reveal key={i} delay={delay + i * step} y={y} duration={duration}
                className={className} style={style}>
          {child}
        </Reveal>
      ))}
    </>
  );
}

// ─── SplitWords ────────────────────────────────────────────────────────────
// Word-by-word reveal for headlines. Pass a string OR an array of segments.
// Each segment: { text, accent?, alt?, br? }. Words inside a segment carry
// the segment's class. Animation is CSS-driven, kicked off when the parent
// enters view.
function SplitWords({ segments, delay = 0, step = 60, duration = 800 }) {
  const ref = React.useRef(null);
  const visible = useInView(ref);
  // Flatten to words while tracking style class per word.
  const words = [];
  segments.forEach((seg, si) => {
    if (seg.br) { words.push({ br: true, key: `br-${si}` }); return; }
    const text = seg.text || "";
    const parts = text.split(/(\s+)/); // keep spaces
    parts.forEach((p, pi) => {
      if (!p) return;
      if (/^\s+$/.test(p)) { words.push({ space: true, key: `s-${si}-${pi}` }); return; }
      words.push({ text: p, key: `w-${si}-${pi}`, className: seg.className || "" });
    });
  });
  let i = 0;
  return (
    <span ref={ref} style={{ display: "inline" }}>
      {words.map((w) => {
        if (w.br) return <br key={w.key} />;
        if (w.space) return <span key={w.key}>{" "}</span>;
        const d = delay + (i++) * step;
        return (
          <span key={w.key} className={w.className}
                style={{ display: "inline-block", overflow: "hidden",
                         paddingBottom: "0.12em", marginBottom: "-0.12em",
                         verticalAlign: "baseline" }}>
            <span style={{
              display: "inline-block",
              transform: visible ? "translateY(0%)" : "translateY(110%)",
              opacity: visible ? 1 : 0,
              transition: `transform ${duration}ms cubic-bezier(.2,.7,.2,1) ${d}ms, opacity ${duration}ms ease ${d}ms`,
              willChange: "transform, opacity",
            }}>{w.text}</span>
          </span>
        );
      })}
    </span>
  );
}

// ─── Mouse-follow card glow ────────────────────────────────────────────────
// Add data-glow to cards inside a container, call hookMouseGlow on the
// container's ref. CSS reads --mx / --my / --mxp / --myp.
function useMouseGlow(ref) {
  React.useEffect(() => {
    const root = ref.current;
    if (!root) return undefined;
    let frame = null;
    const onMove = (e) => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const cards = root.querySelectorAll("[data-glow]");
        cards.forEach((card) => {
          const r = card.getBoundingClientRect();
          const x = e.clientX - r.left;
          const y = e.clientY - r.top;
          card.style.setProperty("--mx", x + "px");
          card.style.setProperty("--my", y + "px");
        });
      });
    };
    root.addEventListener("pointermove", onMove);
    return () => root.removeEventListener("pointermove", onMove);
  }, []);
}

// ─── Magnetic button ───────────────────────────────────────────────────────
// Wraps a child element, drifts it toward the cursor inside a bounding box.
function Magnetic({ children, strength = 0.25, className = "", style = {} }) {
  const ref = React.useRef(null);
  const [t, setT] = React.useState({ x: 0, y: 0 });
  const frame = React.useRef(null);
  const onMove = (e) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dx = (e.clientX - cx) * strength;
    const dy = (e.clientY - cy) * strength;
    if (frame.current) cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => setT({ x: dx, y: dy }));
  };
  const onLeave = () => setT({ x: 0, y: 0 });
  return (
    <span ref={ref}
          onPointerMove={onMove} onPointerLeave={onLeave}
          className={className}
          style={{
            display: "inline-block",
            transform: `translate(${t.x}px, ${t.y}px)`,
            transition: "transform .4s cubic-bezier(.2,.8,.2,1)",
            willChange: "transform",
            ...style,
          }}>
      {children}
    </span>
  );
}

// ─── CountUp ───────────────────────────────────────────────────────────────
// Animate a number from 0 → target when scrolled into view.
function CountUp({ value, suffix = "", prefix = "", duration = 1400, format }) {
  const ref = React.useRef(null);
  const visible = useInView(ref);
  const [n, setN] = React.useState(0);
  React.useEffect(() => {
    if (!visible) return undefined;
    const start = performance.now();
    let raf;
    const tick = (t) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(value * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [visible, value, duration]);
  const display = format ? format(n) : Math.round(n);
  return (
    <span ref={ref} style={{ fontVariantNumeric: "tabular-nums" }}>
      {prefix}{display}{suffix}
    </span>
  );
}

// ─── Parallax (scroll-driven translate) ────────────────────────────────────
function useParallax(ref, factor = 0.15) {
  React.useEffect(() => {
    const el = ref.current; if (!el) return undefined;
    let frame = null;
    const onScroll = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const vh = window.innerHeight;
        // 0 when element center is at viewport center
        const center = r.top + r.height / 2 - vh / 2;
        el.style.transform = `translate3d(0, ${center * -factor}px, 0)`;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [factor]);
}

// ─── Scroll spy ────────────────────────────────────────────────────────────
// Tracks which section is currently in view based on its id. Use the returned
// id to apply active styling. ids are observed via IntersectionObserver — the
// one closest to the top of the viewport (after the nav offset) wins.
function useScrollSpy(ids, options = {}) {
  const [active, setActive] = React.useState(ids[0] || null);
  React.useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined;
    const offset = options.offset ?? 120;
    // Track all sections with their top edge; pick whichever's top is closest
    // to but still above the offset line.
    const onScroll = () => {
      let best = ids[0];
      let bestDist = Infinity;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top - offset;
        // section is "active" if its top is above the offset line and the
        // distance below the line is smaller than the current best
        if (top <= 0 && Math.abs(top) < bestDist) {
          bestDist = Math.abs(top);
          best = id;
        }
      }
      setActive(best);
    };
    onScroll();
    let raf = null;
    const handler = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(onScroll);
    };
    window.addEventListener('scroll', handler, { passive: true });
    window.addEventListener('resize', handler);
    return () => {
      window.removeEventListener('scroll', handler);
      window.removeEventListener('resize', handler);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ids.join(','), options.offset]);
  return active;
}

// ─── Nav scroll state ──────────────────────────────────────────────────────
// Toggles body[data-scrolled] when past N px so CSS can react.
function useNavScroll(threshold = 24) {
  React.useEffect(() => {
    const onScroll = () => {
      const past = window.scrollY > threshold;
      document.body.dataset.scrolled = past ? "1" : "0";
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);
}

// ─── Smooth in-page anchor scroll ──────────────────────────────────────────
function useSmoothAnchors() {
  React.useEffect(() => {
    const onClick = (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute('href').slice(1);
      if (!id) return;
      const el = document.getElementById(id) || document.querySelector(`[id="${id}"]`);
      if (!el) return;
      e.preventDefault();
      const y = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
      history.replaceState(null, '', '#' + id);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);
}

Object.assign(window, {
  useInView, Reveal, RevealStagger, SplitWords,
  useMouseGlow, Magnetic, CountUp, useParallax,
  useNavScroll, useSmoothAnchors, useScrollSpy,
});
