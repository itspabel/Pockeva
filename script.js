(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  document.documentElement.classList.add('js');

  const theme = () => {
    const root = document.documentElement, btn = $('#themeBtn');
    let t = 'dark';
    try { t = localStorage.getItem('pk-theme') || (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'); } catch (e) {}
    const apply = v => { root.dataset.theme = v; btn.setAttribute('aria-pressed', v === 'light'); $('#tgl').classList.toggle('on', v === 'light'); $('meta[name=theme-color]').content = v === 'light' ? '#f7f5fc' : '#0c0a14'; };
    apply(t);
    btn.addEventListener('click', () => { t = t === 'dark' ? 'light' : 'dark'; apply(t); try { localStorage.setItem('pk-theme', t); } catch (e) {} });
  };

  const menu = () => {
    const b = $('#menuBtn'), l = $('#links');
    const set = o => { l.classList.toggle('open', o); b.setAttribute('aria-expanded', o); };
    b.addEventListener('click', () => set(!l.classList.contains('open')));
    $$('a', l).forEach(a => a.addEventListener('click', () => set(false)));
    document.addEventListener('keydown', e => e.key === 'Escape' && set(false));
  };

  const tabs = () => {
    const src = $('#heroScreen'), dash = $('#p-dashboard .scr');
    if (src && dash) dash.innerHTML = src.innerHTML;
    const btns = $$('[role=tab]');
    const show = b => {
      btns.forEach(x => { const on = x === b; x.setAttribute('aria-selected', on); x.tabIndex = on ? 0 : -1; $('#' + x.getAttribute('aria-controls')).hidden = !on; });
    };
    btns.forEach((b, i) => {
      b.addEventListener('click', () => show(b));
      b.addEventListener('keydown', e => {
        const k = { ArrowRight: 1, ArrowLeft: -1 }[e.key]; if (!k) return;
        const n = btns[(i + k + btns.length) % btns.length]; show(n); n.focus();
      });
    });
  };

  const faq = () => $$('.faq button').forEach(b => b.addEventListener('click', () => {
    const open = b.getAttribute('aria-expanded') !== 'true';
    b.setAttribute('aria-expanded', open); b.parentElement.nextElementSibling.classList.toggle('open', open);
  }));

  const gallery = () => {
    const dlg = $('#modal'), img = $('#mImg'), cap = $('#mCap'), ph = $('#mPh');
    let last = null;
    $$('.shot').forEach(s => {
      const im = $('img', s), miss = () => im.classList.add('miss');
      im.addEventListener('error', miss); if (im.complete && !im.naturalWidth) miss();
      s.addEventListener('click', () => {
        last = s; const ok = !im.classList.contains('miss');
        cap.textContent = s.dataset.title; img.hidden = !ok; ph.hidden = ok;
        if (ok) { img.src = im.src; img.alt = im.alt; } dlg.showModal();
      });
    });
    $('#mClose').addEventListener('click', () => dlg.close());
    dlg.addEventListener('click', e => e.target === dlg && dlg.close());
    dlg.addEventListener('close', () => last && last.focus());
  };

  const reveal = () => {
    const els = $$('.reveal');
    if (!('IntersectionObserver' in window)) return els.forEach(e => e.classList.add('in'));
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
    els.forEach(e => io.observe(e));
  };

  [theme, menu, tabs, faq, gallery, reveal].forEach(f => f());
})();
