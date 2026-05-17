// settings-panel.jsx — theme + accessibility settings, cog button in nav

(function () {
  const { useState, useEffect, useRef } = React;

  const DEFAULTS = {
    theme: 'dark',
    reducedMotion: false,
    highContrast: false,
    largerText: false,
    dyslexiaFont: false,
  };

  function loadSettings() {
    try { return { ...DEFAULTS, ...JSON.parse(localStorage.getItem('vdy-settings') || '{}') }; }
    catch { return { ...DEFAULTS }; }
  }

  function applySettings(s) {
    const b = document.body;
    b.dataset.theme         = s.theme;
    b.dataset.reducedMotion = s.reducedMotion ? '1' : '0';
    b.dataset.highContrast  = s.highContrast  ? '1' : '0';
    b.dataset.largerText    = s.largerText    ? '1' : '0';
    b.dataset.dyslexia      = s.dyslexiaFont  ? '1' : '0';
    if (s.dyslexiaFont && !document.getElementById('vdy-dyslexia-font')) {
      const link = document.createElement('link');
      link.id = 'vdy-dyslexia-font'; link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400;1,700&display=swap';
      document.head.appendChild(link);
    }
  }

  // Apply before first paint
  applySettings(loadSettings());

  function useSettings() {
    const [s, setS] = useState(loadSettings);
    const update = (key, val) => setS(prev => {
      const next = { ...prev, [key]: val };
      localStorage.setItem('vdy-settings', JSON.stringify(next));
      applySettings(next);
      return next;
    });
    return [s, update];
  }

  const IconCog = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
    </svg>
  );
  const IconMoon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  );
  const IconSun = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="13" height="13">
      <circle cx="12" cy="12" r="4.5"/>
      <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
    </svg>
  );

  function SettingsPanel() {
    const [s, update] = useSettings();
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
      if (!open) return;
      const fn = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
      document.addEventListener('mousedown', fn);
      return () => document.removeEventListener('mousedown', fn);
    }, [open]);

    const A11Y = [
      { key: 'reducedMotion', label: 'Reduce motion',   desc: 'Stops scroll animations'    },
      { key: 'highContrast',  label: 'High contrast',   desc: 'Removes glass blur'          },
      { key: 'largerText',    label: 'Larger text',      desc: '+20% font size'              },
      { key: 'dyslexiaFont',  label: 'Dyslexia font',   desc: 'Atkinson Hyperlegible'       },
    ];

    return (
      <div className="nav-icon-wrap" ref={ref}>
        <button className={"nav-icon-btn" + (open ? " active" : "")}
                onClick={() => setOpen(o => !o)}
                aria-label="Settings" aria-expanded={open} title="Settings">
          <IconCog />
        </button>
        {open && (
          <div className="nav-drop settings-drop" role="dialog" aria-label="Settings panel">
            <div className="ndrop-section">
              <div className="ndrop-label">Appearance</div>
              <div className="sdrop-theme-row">
                <button className={"sdrop-theme-btn" + (s.theme === 'dark' ? ' active' : '')}
                        onClick={() => update('theme', 'dark')}>
                  <IconMoon /> Dark
                </button>
                <button className={"sdrop-theme-btn" + (s.theme === 'light' ? ' active' : '')}
                        onClick={() => update('theme', 'light')}>
                  <IconSun /> Light
                </button>
              </div>
            </div>
            <div className="ndrop-section">
              <div className="ndrop-label">Accessibility</div>
              {A11Y.map(({ key, label, desc }) => (
                <button key={key}
                        className={"sdrop-toggle" + (s[key] ? ' on' : '')}
                        onClick={() => update(key, !s[key])}>
                  <span className="sdrop-info">
                    <span className="sdrop-title">{label}</span>
                    <span className="sdrop-desc">{desc}</span>
                  </span>
                  <span className="sdrop-switch" role="switch" aria-checked={s[key]}>
                    <span className="sdrop-thumb" />
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  Object.assign(window, { useSettings, SettingsPanel });
})();
