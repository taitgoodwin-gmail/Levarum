import React from 'react';

/* The hours bar. One scale everywhere on the site: 4 hours a week fills a bar.
   Fills from 0 on scroll-in over 900ms, once, and not at all under
   prefers-reduced-motion. */
export function Meter({ value = 100, height = 'md', quiet = false, animate = true, style, ...rest }) {
  const ref = React.useRef(null);
  const target = Math.max(0, Math.min(100, value)) + '%';
  const [width, setWidth] = React.useState(animate ? '0%' : target);

  React.useEffect(() => {
    let reduce = false;
    try { reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
    if (!animate || reduce || !('IntersectionObserver' in window)) { setWidth(target); return; }
    const el = ref.current;
    if (!el) { setWidth(target); return; }
    let done = false;
    const commit = () => { if (!done) { done = true; setWidth(target); } };
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { io.unobserve(en.target); commit(); } });
    }, { threshold: 0.3 });
    io.observe(el);
    // A missed observer callback must degrade to a correctly filled bar, never an
    // empty one: the fill is the only carrier of the comparison.
    const fallback = setTimeout(commit, 400);
    return () => { clearTimeout(fallback); io.disconnect(); };
  }, [target, animate]);

  const h = height === 'sm' ? 'var(--lv-s-2)' : height === 'lg' ? 'var(--lv-s-4)' : 'var(--lv-s-3)';
  return (
    <div ref={ref} style={{ height: h, borderRadius: 'var(--lv-r-pill)', background: 'var(--lv-meter-track)', overflow: 'hidden', ...style }} {...rest}>
      <div style={{
        width,
        height: '100%',
        background: quiet ? 'var(--lv-meter-fill-quiet)' : 'var(--lv-meter-fill)',
        transition: 'width var(--lv-dur-meter) var(--lv-ease)',
      }} />
    </div>
  );
}
