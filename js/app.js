/* Renders the page from CONTENT for the current mode. Design lives in css/style.css. */
(function () {
  const C = window.CONTENT;
  const S = C.shared;
  const root = document.documentElement;
  const app = document.getElementById('app');
  const navLinks = document.getElementById('navLinks');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const ICON = {
    github: '<svg viewBox="0 0 24 24"><path d="M12 .5A11.5 11.5 0 0 0 8.4 22.9c.6.1.8-.2.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0c2.2-1.5 3.200-1.200 3.200-1.200.6 1.600.2 2.800.1 3.100.8.8 1.200 1.800 1.200 3.100 0 4.400-2.700 5.400-5.300 5.700.4.4.8 1.100.8 2.200v3.200c0 .3.2.7.8.6A11.500 11.500 0 0 0 12 .5z"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.5h4V21H3zM9.5 9.5h3.800v1.600h.1c.5-1 1.800-2 3.800-2 4 0 4.800 2.600 4.800 6V21h-4v-5c0-1.200 0-2.800-1.700-2.800s-2 1.300-2 2.700V21h-4z"/></svg>',
    orcid: '<svg viewBox="0 0 24 24"><path d="M12 0a12 12 0 1 0 0 24 12 12 0 0 0 0-24zM7.400 5.800a.9.9 0 1 1 0 1.800.9.9 0 0 1 0-1.800zM6.700 9h1.400v9H6.700zm3.700 0h3.700c3.300 0 4.800 2.300 4.800 4.500S17.400 18 14.100 18h-3.700zm1.400 1.300v6.400h2.200c2.300 0 3.400-1.400 3.400-3.200s-1.100-3.200-3.400-3.200z"/></svg>',
    researchgate: '<svg viewBox="0 0 24 24"><path d="M19.600 0H4.400A4.400 4.400 0 0 0 0 4.400v15.200A4.400 4.400 0 0 0 4.400 24h15.200a4.400 4.400 0 0 0 4.400-4.400V4.400A4.400 4.400 0 0 0 19.600 0zM8.800 18.500H7V6.800h3.500c2 0 3.300 1 3.300 2.900 0 1.300-.7 2.200-1.800 2.600l2.300 3.500h-2l-2-3.200H8.800zm0-5h1.600c1.100 0 1.700-.6 1.700-1.500s-.6-1.400-1.700-1.400H8.800zm10 5.100c-1.600 0-2.700-1-2.800-2.500h1.400c.1.700.6 1.100 1.400 1.100.7 0 1.200-.3 1.200-.8s-.4-.7-1.300-.9c-1.500-.3-2.400-.8-2.400-2 0-1.200 1-2 2.500-2s2.500.8 2.600 2h-1.400c-.1-.5-.5-.8-1.200-.8-.6 0-1 .3-1 .7s.4.6 1.300.8c1.600.3 2.500.9 2.500 2.100 0 1.300-1.100 2.200-2.800 2.200z"/></svg>',
    ieee: '<svg viewBox="0 0 24 24"><path d="M12 1 1 12l11 11 11-11zm0 3.800L19.200 12 12 19.200 4.800 12z"/></svg>',
    mail: '<svg viewBox="0 0 24 24"><path d="M2 5h20v14H2zm2 2v.5l8 5 8-5V7zm16 3-8 5-8-5v7h16z"/></svg>',
    download: '<svg viewBox="0 0 24 24"><path d="M12 3v11m0 0-4-4m4 4 4-4M5 19h14" fill="none" stroke="currentColor" stroke-width="2.200" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    arrow: '<svg viewBox="0 0 24 24"><path d="M7 17 17 7M8 7h9v9" fill="none" stroke="currentColor" stroke-width="2.200" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };

  /* mailto opens the visitor's mail app; tel: dials on phones */
  const mailHref = `mailto:${S.email}?subject=${encodeURIComponent('Hello Foyzul')}`;
  const telHref = S.phone ? 'tel:' + S.phone.replace(/[^+\d]/g, '') : '';
  const ICON_PHONE = '<svg viewBox="0 0 24 24"><path d="M6.6 10.800a15 15 0 0 0 6.600 6.600l2.200-2.200a1 1 0 0 1 1-.25 11.400 11.400 0 0 0 3.600.6 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.500a1 1 0 0 1 1 1c0 1.300.2 2.500.6 3.600a1 1 0 0 1-.25 1z"/></svg>';

  const ext = (u) => `href="${u}" target="_blank" rel="noopener noreferrer"`;
  const link = (u, txt) => `<a ${ext(u)}>${txt}</a>`;

  /* ---------- section builders ---------- */
  function sec(id, eyebrow, title, body, cls = '') {
    return `<section class="section ${cls}" id="${id}" aria-labelledby="${id}-h">
      <div class="section-head reveal"><span class="eyebrow">${eyebrow}</span><h2 id="${id}-h">${title}</h2></div>
      ${body}</section>`;
  }

  function hero(d) {
    const social = ['github', 'linkedin', 'orcid', 'researchgate', 'ieee'].map(k =>
      `<a class="neu icon-btn" ${ext(S.links[k])} aria-label="${k}" title="${k}">${ICON[k]}</a>`).join('');
    return `<section class="hero" id="top">
      <div class="bento">
        <article class="tile glass tile-intro tilt reveal">
          <span class="chip clay">${d.tag}</span>
          <h1>${d.headline}</h1>
          <p class="lead">${d.intro}</p>
          <div class="cta">
            <a class="btn btn-primary" href="${d.ctaPrimary.href}">${d.ctaPrimary.label}</a>
            <a class="btn btn-ghost" href="${d.ctaSecondary.href}">${d.ctaSecondary.label}</a>
            <a class="btn btn-ghost" href="${d.cv.href}" download="${d.cv.file}">${ICON.download}${d.cv.label}</a>
          </div>
        </article>
        <figure class="tile tile-photo tilt reveal">
          <div class="photo-layer"><img src="assets/profile.png" alt="Portrait of Foyzul Hoque" width="563" height="859" fetchpriority="high"></div>
          ${d.photoTags.map((t, i) => `<span class="glass photo-tag t${i + 1}">${t}</span>`).join('')}
          <figcaption class="glass photo-cap"><strong>${S.name}</strong><span>${S.location}</span></figcaption>
        </figure>
        <article class="tile neu-in tile-stats reveal">
          ${d.stats.map(s => `<div class="stat"><b>${s.n}</b><span>${s.l}</span></div>`).join('')}
        </article>
        <article class="tile glass tile-now tilt reveal">
          <span class="pulse"></span><p>${d.now}</p>
        </article>
        <article class="tile tile-links reveal">
          <div class="social">${social}</div>
          <div class="reach"><a class="mail" href="${mailHref}">${ICON.mail}<span>${S.email}</span></a>
          ${S.phone ? `<a class="mail" href="${telHref}">${ICON_PHONE}<span>${S.phone}</span></a>` : ''}</div>
        </article>
      </div>
    </section>`;
  }

  const interests = (d) => sec('about', 'Focus', 'Research interests',
    `<div class="grid grid-4">${d.interests.map(i =>
      `<article class="card glass tilt reveal"><span class="badge clay">${i.icon}</span><h3>${i.t}</h3></article>`).join('')}</div>`);

  const pubCard = (p) => `<article class="card glass pub tilt reveal">
      <div class="pub-top"><span class="chip clay">${p.tag}</span><span class="year">${p.year}</span></div>
      <h3>${link(p.url, p.title)}</h3>
      <p class="authors">${p.authors.replace('Foyzul Hoque', '<b>Foyzul Hoque</b>')}</p>
      <p class="venue">${p.venue}</p>
      <p>${p.summary}</p>
      <a class="more" ${ext(p.url)}>Read paper ${ICON.arrow}</a></article>`;

  function publications(d) {
    let body = d.publicationGroups.map(g =>
      `<h3 class="group reveal">${g.group}</h3><div class="grid grid-2">${g.items.map(pubCard).join('')}</div>`).join('');
    if (d.inPreparation) {
      body += `<h3 class="group reveal">In preparation</h3><div class="grid grid-3">${d.inPreparation.map(p =>
        `<article class="card neu-in tilt reveal"><h3>${p.t}</h3><p>${p.d}</p></article>`).join('')}</div>`;
    }
    return sec('publications', 'Research output', 'Publications', body);
  }

  const publicationsShort = (d) => sec('publications', 'Research background', 'Selected publications',
    `<div class="list">${d.publicationsShort.map(p =>
      `<a class="row glass reveal" ${ext(p.url)}><span><b>${p.title}</b><small>${p.venue}</small></span>${ICON.arrow}</a>`).join('')}</div>`);

  const projects = (d) => d.projects[0].kind
    ? sec('projects', 'Selected work', 'Apps I have shipped',
      `<div class="grid bento-proj">${d.projects.map((p, i) => `<article class="card project ${p.size} ${i % 2 ? 'alt' : ''} tilt reveal">
        <span class="kind">${p.kind}</span><h3>${p.name}</h3><p>${p.d}</p>
        <div class="tags">${p.tags.map(t => `<span class="chip">${t}</span>`).join('')}</div>
        ${p.links.map(l => `<a class="more" ${ext(l.u)}>${l.l} ${ICON.arrow}</a>`).join('')}</article>`).join('')}</div>`)
    : sec('projects', 'Selected work', 'Research projects',
      `<div class="grid grid-4">${d.projects.map(p => `<article class="card glass tilt reveal">
        <span class="year">${p.year}</span><h3>${p.name}</h3><p>${p.d}</p>
        <div class="tags">${p.tags.map(t => `<span class="chip">${t}</span>`).join('')}</div></article>`).join('')}</div>`);

  const experience = (d, title) => sec('experience', 'Where I have worked', title,
    `<ol class="timeline">${d.experience.map(e => `<li class="reveal"><div class="dot"></div><div class="card glass">
      <div class="tl-top"><h3>${e.role}</h3><span class="when">${e.when}</span></div>
      <p class="org">${link(e.url, e.org)} · ${e.where}</p><p>${e.d}</p></div></li>`).join('')}</ol>`);

  const skills = (d) => sec('skills', 'Toolbox', 'Skills',
    `<div class="grid grid-3">${d.skills.map(g => `<article class="card glass reveal"><h3>${g.g}</h3>
      <div class="tags">${g.items.map(i => `<span class="chip neu">${i}</span>`).join('')}</div></article>`).join('')}</div>`);

  /* Shared gallery for certificates and letters. `list` is a key in CONTENT.shared, `dir` is the folder under assets/ */
  const gallery = (id, eyebrow, title, list, dir, note = '') => sec(id, eyebrow, title,
    `${note ? `<p class="docs-note reveal">${note}</p>` : ''}<div class="certs">${S[list].map((c, i) => `<button class="cert card tilt reveal" data-list="${list}" data-dir="${dir}" data-i="${i}" aria-label="View: ${c.title}">
      <span class="cert-img clay"><img src="assets/${dir}/${c.img}-thumb.jpg" alt="" loading="lazy" draggable="false"></span>
      <span class="chip">${c.kind}</span><h3>${c.title}</h3><span class="cert-by">${c.by} · ${c.when}</span></button>`).join('')}</div>`);

  const certificates = () => gallery('certificates', 'Beyond the code', 'Certificates & activities', 'certificates', 'certs');
  const letters = () => gallery('documents', 'Official documents', 'University letters', 'letters', 'letters',
    'Issued by the IUB Registrar. Shown for verification only: view-only, watermarked, with the student ID removed. Originals are available from IUB on request.');

  const education = () => sec('education', 'Background', 'Education, awards & more',
    `<div class="grid grid-2">
      <article class="card glass reveal"><h3>Education</h3>${S.education.map(e =>
        `<div class="mini"><b>${e.title}</b><span>${e.org} · ${e.when}${e.note ? ' · ' + e.note : ''}</span></div>`).join('')}</article>
      <article class="card glass reveal"><h3>Honors & certifications</h3>${S.awards.map(a =>
        `<div class="mini"><b>${link(a.url, a.title)}</b><span>${a.note} · ${a.when}</span></div>`).join('')}</article>
      <article class="card glass reveal"><h3>Volunteering</h3>${S.volunteer.map(v =>
        `<div class="mini"><b>${v.title}</b><span>${v.org} · ${v.when}</span><span>${v.note}</span></div>`).join('')}</article>
      <article class="card glass reveal"><h3>Languages</h3><p>${S.languages}</p></article></div>`);

  /* GitHub activity: markup here, data filled in by loadGithub() */
  const github = () => sec('github', 'Consistency', 'Coding streak',
    `<div class="gh card glass reveal" id="gh" data-state="loading">
      <div class="gh-stats" id="ghStats"></div>
      <div class="gh-scroll"><div class="gh-months" id="ghMonths" aria-hidden="true"></div><div class="gh-map" id="ghMap" role="img" aria-label="GitHub contribution heatmap for the last year"></div></div>
      <div class="gh-foot"><span id="ghNote">Loading live data from GitHub…</span>
        <span class="gh-legend" aria-hidden="true">Less <i class="l0"></i><i class="l1"></i><i class="l2"></i><i class="l3"></i><i class="l4"></i> More</span>
        <a class="more" ${ext(S.links.github)}>Open GitHub profile ${ICON.arrow}</a></div></div>`);

  const contact = (d) => sec('contact', d.contactTitle === 'Get in touch' ? 'Say hello' : 'For prospective supervisors', d.contactTitle,
    `<div class="contact card glass tilt reveal">
      <p class="lead">${d.contactLine}</p>
      <div class="cta center"><a class="btn btn-primary big" href="${mailHref}">${S.email}</a>
      ${S.phone ? `<a class="btn btn-ghost big" href="${telHref}">${S.phone}</a>` : ''}
      <a class="btn btn-ghost big" href="${d.cv.href}" download="${d.cv.file}">${ICON.download}${d.cv.label}</a></div>
      <p class="loc">${S.location}</p></div>`, 'contact-sec');

  /* ---------- per-mode page plan ---------- */
  const PLAN = {
    academic: {
      nav: [['about', 'Focus'], ['publications', 'Publications'], ['projects', 'Projects'], ['experience', 'Experience'], ['github', 'Streak'], ['documents', 'Letters'], ['contact', 'Contact']],
      build: (d) => hero(d) + interests(d) + publications(d) + projects(d) + experience(d, 'Research & industry experience') + skills(d) + github() + certificates() + letters() + education() + contact(d)
    },
    industry: {
      nav: [['projects', 'Work'], ['experience', 'Experience'], ['skills', 'Skills'], ['github', 'Streak'], ['contact', 'Contact']],
      build: (d) => hero(d) + projects(d) + experience(d, 'Experience') + skills(d) + github() + certificates() + publicationsShort(d) + education() + contact(d)
    }
  };

  function render(mode) {
    const d = C[mode], plan = PLAN[mode];
    app.innerHTML = plan.build(d);
    navLinks.innerHTML = plan.nav.map(([id, t]) => `<a href="#${id}">${t}</a>`).join('');
    document.title = mode === 'academic' ? 'Foyzul Hoque · Researcher' : 'Foyzul Hoque · Mobile Engineer';
    bind();
    loadGithub();
  }

  /* ---------- GitHub streak + heatmap (live, cached for the session) ---------- */
  let ghData = null;
  async function fetchGithub() {
    if (ghData) return ghData;
    try { const c = sessionStorage.getItem('gh'); if (c) return (ghData = JSON.parse(c)); } catch (e) {}
    const u = S.links.github.split('/').pop();
    const [contrib, user] = await Promise.all([
      fetch(`https://github-contributions-api.jogruber.de/v4/${u}?y=last`).then(r => r.json()),
      fetch(`https://api.github.com/users/${u}`).then(r => r.json()).catch(() => ({}))
    ]);
    ghData = { days: contrib.contributions, total: contrib.total.lastYear, repos: user.public_repos, followers: user.followers };
    try { sessionStorage.setItem('gh', JSON.stringify(ghData)); } catch (e) {}
    return ghData;
  }

  function streaks(days) {
    let best = 0, run = 0;
    days.forEach(d => { run = d.count > 0 ? run + 1 : 0; best = Math.max(best, run); });
    let i = days.length - 1;
    if (days[i] && days[i].count === 0) i--;           // today may not have activity yet
    let cur = 0;
    for (; i >= 0 && days[i].count > 0; i--) cur++;
    return { cur, best };
  }

  async function loadGithub() {
    const box = document.getElementById('gh');
    if (!box) return;
    try {
      const g = await fetchGithub();
      const { cur, best } = streaks(g.days);
      const top = g.days.reduce((a, b) => (b.count > a.count ? b : a), g.days[0]);
      const active = g.days.filter(d => d.count > 0).length;
      const stats = [[g.total.toLocaleString(), 'contributions, last year'], [cur + ' days', 'current streak'], [best + ' days', 'longest streak'], [active, 'active days']];
      if (g.repos != null) stats.push([g.repos, 'public repos']);
      if (S.githubPrivateRepos != null) stats.push([S.githubPrivateRepos, 'private repos']);
      document.getElementById('ghStats').innerHTML = stats.map(([n, l]) => `<div class="stat"><b>${n}</b><span>${l}</span></div>`).join('');
      // heatmap: pad the first week so columns start on Sunday
      const pad = new Date(g.days[0].date + 'T00:00:00').getDay();
      let cells = '<i class="pad"></i>'.repeat(pad);
      let months = '', lastM = -1, col = 0;
      g.days.forEach((d, idx) => {
        const dt = new Date(d.date + 'T00:00:00');
        col = Math.floor((idx + pad) / 7);
        if (dt.getMonth() !== lastM && dt.getDate() <= 7) { months += `<span style="grid-column:${col + 1}">${dt.toLocaleString('en', { month: 'short' })}</span>`; lastM = dt.getMonth(); }
        cells += `<i class="l${d.level}" title="${d.count} contribution${d.count === 1 ? '' : 's'} on ${dt.toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })}"></i>`;
      });
      const weeks = col + 1;
      const map = document.getElementById('ghMap'), mo = document.getElementById('ghMonths');
      map.style.gridTemplateColumns = mo.style.gridTemplateColumns = `repeat(${weeks}, 1fr)`;
      map.innerHTML = cells; mo.innerHTML = months;
      document.getElementById('ghNote').textContent = `Best day: ${top.count} contributions · live from GitHub`;
      box.dataset.state = 'ready';
    } catch (e) {
      box.dataset.state = 'error';
      document.getElementById('ghNote').textContent = 'Live GitHub data is unavailable right now.';
    }
  }

  /* ---------- interactions ---------- */
  let io;
  function bind() {
    if (io) io.disconnect();
    const items = app.querySelectorAll('.reveal');
    if (reduceMotion || !('IntersectionObserver' in window)) { items.forEach(e => e.classList.add('in')); }
    else {
      io = new IntersectionObserver((es) => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.12 });
      items.forEach((e, i) => { e.style.setProperty('--d', (i % 4) * 60 + 'ms'); io.observe(e); });
    }
    const lb = document.getElementById('lightbox');
    app.querySelectorAll('.cert').forEach(b => b.addEventListener('click', () => {
      const c = S[b.dataset.list][b.dataset.i];
      document.getElementById('lbImg').src = `assets/${b.dataset.dir}/${c.img}.jpg`;
      document.getElementById('lbImg').alt = c.title;
      document.getElementById('lbCap').textContent = `${c.title} · ${c.by} · ${c.when}`;
      lb.showModal();
    }));
    if (!reduceMotion && matchMedia('(hover:hover)').matches) {
      app.querySelectorAll('.tilt').forEach(el => {
        el.addEventListener('pointermove', (ev) => {
          const r = el.getBoundingClientRect(), x = (ev.clientX - r.left) / r.width, y = (ev.clientY - r.top) / r.height;
          el.style.setProperty('--rx', ((0.5 - y) * 6).toFixed(2) + 'deg');
          el.style.setProperty('--ry', ((x - 0.5) * 8).toFixed(2) + 'deg');
          el.style.setProperty('--mx', (x * 100).toFixed(1) + '%');
          el.style.setProperty('--my', (y * 100).toFixed(1) + '%');
        });
        el.addEventListener('pointerleave', () => { el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg'); });
      });
    }
  }

  function setMode(mode, push) {
    if (mode !== 'academic' && mode !== 'industry') return;
    const apply = () => {
      root.dataset.mode = mode;
      render(mode);
      document.querySelectorAll('#modeSwitch button').forEach(b => b.setAttribute('aria-selected', b.dataset.mode === mode));
    };
    if (document.startViewTransition && !reduceMotion && push) document.startViewTransition(apply); else apply();
    try { localStorage.setItem('mode', mode); } catch (e) {}
    if (push) { const u = new URL(location.href); u.searchParams.set('mode', mode); history.replaceState(null, '', u); }
  }

  document.querySelectorAll('#modeSwitch button').forEach(b => b.addEventListener('click', () => setMode(b.dataset.mode, true)));
  document.getElementById('themeBtn').addEventListener('click', () => {
    const t = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = t;
    try { localStorage.setItem('theme', t); } catch (e) {}
  });

  /* liquid-glass sheen follows the pointer on the nav */
  const nav = document.getElementById('nav');
  nav.addEventListener('pointermove', (e) => {
    const r = nav.getBoundingClientRect();
    nav.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
    nav.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
  });
  addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 12), { passive: true });

  /* view-only documents: block right-click save and dragging (deterrent only; the watermark is the real protection) */
  ['contextmenu', 'dragstart'].forEach(ev => document.addEventListener(ev, (e) => {
    if (e.target.closest && e.target.closest('.cert, .lightbox')) e.preventDefault();
  }));

  document.getElementById('year').textContent = new Date().getFullYear();
  setMode(root.dataset.mode, false);
})();
