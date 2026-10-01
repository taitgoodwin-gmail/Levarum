const { NavBar, Footer, SkipLink, LinkArrow, Eyebrow, Card } = window.LevarumDesignSystem_13e0fb;

/* Screens are routed by hash, so every link in the kit is a real link and the
   nav behaves exactly as it does in the product. */
const ROUTES = [
  { key: 'home', label: 'Home' },
  { key: 'how', label: 'How it works' },
  { key: 'what', label: 'What we automate' },
  { key: 'questions', label: 'Questions' },
  { key: 'partners', label: 'Partners' },
];

const NAV_LINKS = [
  { label: 'How it works', href: '#how' },
  { label: 'What we automate', href: '#what' },
  { label: 'Questions', href: '#questions' },
];

function useHashRoute(fallback) {
  const read = () => {
    const h = String(window.location.hash || '').replace('#', '');
    return ROUTES.some((r) => r.key === h) ? h : fallback;
  };
  const [route, setRoute] = React.useState(read);
  React.useEffect(() => {
    const on = () => { setRoute(read()); window.scrollTo(0, 0); };
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return route;
}

function PartnerBanner() {
  return (
    <Card padding="sm" style={{ background: 'transparent', border: 'var(--lv-bw) solid var(--lv-sec)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(300px,100%),1fr))', gap: 'var(--lv-s-6)', alignItems: 'center' }}>
      <div>
        <Eyebrow style={{ marginBottom: 'var(--lv-s-3)' }}>NOT A BUSINESS OWNER · FOR PARTNERS</Eyebrow>
        <div style={{ fontFamily: 'var(--lv-f-display)', fontWeight: 700, fontSize: 'var(--lv-t-lg)', letterSpacing: 'var(--lv-track-tight)', marginBottom: 'var(--lv-s-2)' }}>Build these with me</div>
        <div style={{ fontSize: 'var(--lv-t-sm)', lineHeight: 'var(--lv-lead-prose)', color: 'var(--lv-ink-quiet)', maxWidth: '60ch' }}>If you set up automations for small service businesses, there is paid delivery work here and decisions still open. Remote, wherever you are.</div>
      </div>
      <LinkArrow href="#partners">Put your name down</LinkArrow>
    </Card>
  );
}

function Shell({ current, children, banner = true }) {
  const label = (ROUTES.find((r) => r.key === current) || {}).label;
  return (
    <div style={{ fontFamily: 'var(--lv-f-body)', color: 'var(--lv-ink)', background: 'var(--lv-page)', overflowX: 'hidden', minHeight: '100vh' }}>
      <SkipLink href="#lv-main" />
      <NavBar links={NAV_LINKS} current={label} cta={{ label: 'Start', href: '../intake/index.html' }} />
      <main id="lv-main">{children}</main>
      <Footer
        tagline="Back-office automation for owner-run businesses."
        banner={banner ? <PartnerBanner /> : null}
        links={[
          { label: 'How it works', href: '#how' },
          { label: 'What we automate', href: '#what' },
          { label: 'Questions', href: '#questions' },
          { label: 'hello@levarum.co', href: 'mailto:hello@levarum.co' },
          { label: 'Partners', href: '#partners' },
        ]}
      />
    </div>
  );
}

Object.assign(window, { Shell, ROUTES, NAV_LINKS, useHashRoute, PartnerBanner });
