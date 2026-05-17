// i18n.jsx — language switching, t() hook

(function () {
  const { useState, useEffect, useRef, useCallback } = React;

  const LANGS = [
    { code: 'en', label: 'English',    flag: '🇬🇧' },
    { code: 'ro', label: 'Română',     flag: '🇷🇴' },
    { code: 'de', label: 'Deutsch',    flag: '🇩🇪' },
    { code: 'it', label: 'Italiano',   flag: '🇮🇹' },
    { code: 'pl', label: 'Polski',     flag: '🇵🇱' },
    { code: 'es', label: 'Español',    flag: '🇪🇸' },
  ];

  const VALID = new Set(LANGS.map(l => l.code));

  // Detect language: stored pref → browser lang → 'en'
  function detectLang() {
    const stored = localStorage.getItem('vdy-lang');
    if (stored && VALID.has(stored)) return stored;
    const nav = (navigator.language || '').split('-')[0];
    return VALID.has(nav) ? nav : 'en';
  }

  let _lang = detectLang();
  const _listeners = new Set();

  document.documentElement.lang = _lang;

  function setLang(code) {
    if (!VALID.has(code)) return;
    _lang = code;
    localStorage.setItem('vdy-lang', code);
    document.documentElement.lang = code;
    _listeners.forEach(fn => fn(code));
  }

  function useLang() {
    const [lang, setLangState] = useState(_lang);
    useEffect(() => {
      const upd = (l) => setLangState(l);
      _listeners.add(upd);
      return () => _listeners.delete(upd);
    }, []);
    return [lang, setLang];
  }

  // Resolve a dot-separated key path in an object
  function resolve(obj, parts) {
    let cur = obj;
    for (const p of parts) {
      if (cur == null || typeof cur !== 'object') return undefined;
      cur = cur[p];
    }
    return cur;
  }

  function useT() {
    const [lang] = useLang();
    return useCallback((key, fallback) => {
      const T = window.VDY_TRANSLATIONS;
      if (!T) return fallback !== undefined ? fallback : key;
      const parts = key.split('.');
      const val = resolve(T[lang], parts) ?? resolve(T.en, parts);
      return val !== undefined ? val : (fallback !== undefined ? fallback : key);
    }, [lang]);
  }

  const IconGlobeNav = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9"/>
      <path d="M3 12 L21 12"/>
      <path d="M12 3 a 14 14 0 0 1 0 18 a 14 14 0 0 1 0 -18"/>
    </svg>
  );

  function LangPanel() {
    const [lang, setLangFn] = useLang();
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    const current = LANGS.find(l => l.code === lang) || LANGS[0];

    useEffect(() => {
      if (!open) return;
      const fn = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
      document.addEventListener('mousedown', fn);
      return () => document.removeEventListener('mousedown', fn);
    }, [open]);

    return (
      <div className="nav-icon-wrap" ref={ref}>
        <button className={"nav-icon-btn" + (open ? " active" : "")}
                onClick={() => setOpen(o => !o)}
                aria-label={"Language: " + current.label}
                aria-expanded={open}
                title="Language">
          <IconGlobeNav />
        </button>
        {open && (
          <div className="nav-drop lang-drop" role="listbox" aria-label="Select language">
            {LANGS.map(l => (
              <button key={l.code}
                      role="option"
                      aria-selected={l.code === lang}
                      className={"lang-opt" + (l.code === lang ? ' active' : '')}
                      onClick={() => { setLangFn(l.code); setOpen(false); }}>
                <span className="lang-flag">{l.flag}</span>
                <span className="lang-name">{l.label}</span>
                {l.code === lang && (
                  <svg viewBox="0 0 16 16" width="11" height="11" fill="none"
                       stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"
                       style={{ marginLeft: 'auto', flexShrink: 0 }}>
                    <path d="M3 8 L7 12 L13 4"/>
                  </svg>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  Object.assign(window, { useLang, useT, LangPanel, LANGS });
})();
