const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const MN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const fmt = v => { const m = /^(\d{4})-(0[1-9]|1[0-2])$/.exec(v || ''); return m ? MN[+m[2] - 1] + ' ' + m[1] : (v || ''); };
const dates = o => { const s = fmt(o.start), e = o.current ? 'Present' : fmt(o.end); return s && e ? s + ' – ' + e : (s || e); };
const contactList = p => [p.email, p.phone, p.location, ...(p.links || [])].filter(Boolean).map(esc);
const sec = (t, h) => (h ? `<section><h2>${t}</h2>${h}</section>` : '');
const S = {
  summary: r => sec('Summary', r.summary ? `<p>${esc(r.summary)}</p>` : ''),
  exp: r => sec('Experience', r.experience.map(e => `<div class="item"><div class="row"><b>${esc(e.title)}</b><span>${esc(dates(e))}</span></div>
    <div class="sub">${esc([e.company, e.location].filter(Boolean).join(', '))}</div>
    ${e.bullets.length ? `<ul>${e.bullets.map(b => `<li>${esc(b)}</li>`).join('')}</ul>` : ''}</div>`).join('')),
  edu: r => sec('Education', r.education.map(e => `<div class="item"><div class="row"><b>${esc(e.degree)}</b><span>${esc(dates(e))}</span></div>
    <div class="sub">${esc([e.school, e.location].filter(Boolean).join(', '))}</div>${e.grade ? `<div>Grade: ${esc(e.grade)}</div>` : ''}${e.details ? `<p>${esc(e.details)}</p>` : ''}</div>`).join('')),
  proj: r => sec('Projects', r.projects.map(p => `<div class="item"><div class="row"><b>${esc(p.title)}</b><span>${esc(fmt(p.date))}</span></div>
    ${p.link ? `<div class="sub">${esc(p.link)}</div>` : ''}${p.description ? `<p>${esc(p.description)}</p>` : ''}</div>`).join('')),
  vol: r => sec('Volunteer Experience', r.volunteer.map(v => `<div class="item"><div class="row"><b>${esc(v.position)}</b><span>${esc(dates(v))}</span></div>
    <div class="sub">${esc([v.organisation, v.location].filter(Boolean).join(', '))}</div>${v.description ? `<p>${esc(v.description)}</p>` : ''}</div>`).join('')),
  certs: (r, t = 'Certifications') => sec(t, r.certifications.map(c => `<div class="item"><div class="row"><b>${esc(c.name)}</b><span>${esc(c.year)}</span></div>
    <div class="sub">${esc(c.issuer)}</div></div>`).join('')),
  skills: r => sec('Skills', r.skills.length ? `<p>${r.skills.map(esc).join(' • ')}</p>` : '')
};
const head = (r, br = ' | ') => `<header><h1>${esc(r.personal.name || 'Your Name')}</h1><div class="t">${esc(r.personal.title)}</div>
  <div class="c">${contactList(r.personal).join(br)}</div></header>`;

const TEMPLATES = {
  modern: { name: 'Modern', tag: 'bold · clean', color: '#5b3fe0',
    render: r => head(r) + S.summary(r) + S.exp(r) + S.proj(r) + S.vol(r) + S.edu(r) + S.certs(r) + S.skills(r) },
  professional: { name: 'Professional', tag: 'serif · formal', color: '#222',
    render: r => head(r) + S.summary(r) + S.exp(r) + S.proj(r) + S.vol(r) + S.edu(r) + S.skills(r) + S.certs(r) },
  minimal: { name: 'Minimal', tag: 'light · simple', color: '#777',
    render: r => head(r) + S.summary(r) + S.exp(r) + S.proj(r) + S.vol(r) + S.edu(r) + S.skills(r) + S.certs(r) },
  creative: { name: 'Creative', tag: 'sidebar · colorful', color: '#e1583c',
    render: r => `<aside>${head(r, '<br>')}${S.skills(r)}${S.certs(r)}</aside><main>${S.summary(r)}${S.exp(r)}${S.proj(r)}${S.vol(r)}${S.edu(r)}</main>` },
  healthcare: { name: 'Healthcare', tag: 'licenses first', color: '#008080',
    render: r => head(r) + S.summary(r) + S.certs(r, 'Licenses & Certifications') + S.exp(r) + S.edu(r) + S.proj(r) + S.vol(r) + S.skills(r) }
};
const renderResume = (r, key) => `<div class="resume tpl-${key}">${TEMPLATES[key].render(r)}</div>`;

const SAMPLE = {
  personal: { name: 'Jonny Greenwood', title: 'Software Engineer', email: 'jonny@example.com', phone: '555-0100', location: 'Montréal, QC', links: ['github.com/jonny'] },
  summary: 'Software engineer with experience building web applications with JavaScript, Node.js and SQL.',
  experience: [{ title: 'Software Developer Intern', company: 'Acme Corp', location: 'Montréal', start: '2025-05', end: '2025-08',
    bullets: ['Built REST APIs in Node.js used by 3 internal teams.', 'Wrote unit tests that raised coverage to 85%.'] }],
  education: [{ degree: 'B.Eng. Software Engineering', school: 'Concordia University', location: 'Montréal', start: '2023-09', end: '2028-04', grade: '3.8 GPA', details: '' }],
  projects: [{ title: 'Job Tracker', link: 'github.com/jonny/job-tracker', description: 'Web app to track job applications (Node.js, MySQL).', date: '2025-11' }],
  volunteer: [{ position: 'Mentor', organisation: 'Code for Good', location: 'Montréal', start: '2024-01', end: '', current: true, description: 'Teach weekly intro-to-programming workshops.' }],
  skills: ['JavaScript', 'Node.js', 'SQL', 'HTML/CSS', 'Git'],
  certifications: [{ name: 'AWS Cloud Practitioner', issuer: 'Amazon Web Services', year: '2025' }]
};

// ---- ATS-friendly text PDF (jsPDF, no canvas) ----
const PDF = {
  modern: { font: 'helvetica', accent: [91, 63, 224], band: true, rule: true, align: 'left' },
  professional: { font: 'times', accent: [30, 30, 30], rule: true, align: 'center' },
  minimal: { font: 'helvetica', accent: [100, 100, 100], rule: false, align: 'left' },
  creative: { font: 'helvetica', accent: [225, 88, 60], band: true, bar: true, rule: true, align: 'left' },
  healthcare: { font: 'helvetica', accent: [0, 128, 128], rule: true, align: 'center' }
};
function exportPDF(r, key, download = true) {
  const { jsPDF } = window.jspdf, d = new jsPDF({ unit: 'pt', format: 'letter' });
  const s = PDF[key], W = 612, H = 792, M = 48, TW = W - 2 * M, f = s.font, p = r.personal;
  let y = M;
  const decor = () => { if (s.bar) { d.setFillColor(...s.accent); d.rect(0, 0, 14, H, 'F'); } };
  const font = (sz, st = 'normal', c = [30, 30, 30]) => { d.setFont(f, st); d.setFontSize(sz); d.setTextColor(...c); };
  const room = h => { if (y + h > H - M) { d.addPage(); decor(); y = M; } };
  const wrapT = (t, sz, st, w) => { font(sz, st); return d.splitTextToSize(String(t), w); };
  decor();
  const hx = s.align === 'center' ? W / 2 : M, o = { align: s.align };
  if (s.band) { d.setFillColor(...s.accent); d.rect(s.bar ? 14 : 0, 0, W, 100, 'F'); }
  y = s.band ? 42 : M + 10;
  font(24, 'bold', s.band ? [255, 255, 255] : [20, 20, 20]); d.text(p.name || 'Your Name', hx, y, o);
  if (p.title) { y += 18; font(12, 'normal', s.band ? [255, 255, 255] : s.accent); d.text(p.title, hx, y, o); }
  y += 16;
  wrapT([p.email, p.phone, p.location, ...(p.links || [])].filter(Boolean).join('  |  '), 9, 'normal', TW).forEach(l => {
    font(9, 'normal', s.band ? [255, 255, 255] : [80, 80, 80]); d.text(l, hx, y, o); y += 11; });
  y = (s.band ? Math.max(y, 100) : y) + 16;

  const header = t => { room(40); font(11, 'bold', s.accent); d.text(t.toUpperCase(), M, y); y += 4;
    if (s.rule) { d.setDrawColor(...s.accent); d.setLineWidth(0.8); d.line(M, y, W - M, y); } y += 14; };
  const para = t => wrapT(t, 10, 'normal', TW).forEach(l => { room(13); font(10); d.text(l, M, y); y += 13; });
  const row = (l, rt) => { room(14); font(10.5, 'bold'); d.text(l || '', M, y);
    if (rt) { font(9.5, 'normal', [90, 90, 90]); d.text(rt, W - M, y, { align: 'right' }); } y += 13; };
  const sub = t => { if (t) { room(13); font(10, 'italic', [70, 70, 70]); d.text(t, M, y); y += 13; } };
  const bullets = a => a.forEach(b => wrapT(b, 10, 'normal', TW - 14).forEach((l, i) => {
    room(13); font(10); if (!i) d.text('•', M + 3, y); d.text(l, M + 14, y); y += 12.5; }));

  const blocks = {
    summary: () => r.summary && (header('Summary'), para(r.summary), y += 4),
    exp: () => r.experience.length && (header('Experience'), r.experience.forEach(e => {
      row(e.title, dates(e)); sub([e.company, e.location].filter(Boolean).join(', ')); bullets(e.bullets); y += 6; })),
    edu: () => r.education.length && (header('Education'), r.education.forEach(e => {
      row(e.degree, dates(e)); sub([e.school, e.location].filter(Boolean).join(', ')); if (e.grade) para('Grade: ' + e.grade); if (e.details) para(e.details); y += 6; })),
    proj: () => r.projects.length && (header('Projects'), r.projects.forEach(q => {
      row(q.title, fmt(q.date)); sub(q.link); if (q.description) para(q.description); y += 6; })),
    vol: () => r.volunteer.length && (header('Volunteer Experience'), r.volunteer.forEach(v => {
      row(v.position, dates(v)); sub([v.organisation, v.location].filter(Boolean).join(', ')); if (v.description) para(v.description); y += 6; })),
    certs: () => r.certifications.length && (header(key === 'healthcare' ? 'Licenses & Certifications' : 'Certifications'),
      r.certifications.forEach(c => { row(c.name, c.year); sub(c.issuer); y += 4; })),
    skills: () => r.skills.length && (header('Skills'), para(r.skills.join(' • ')))
  };
  const order = key === 'healthcare' ? ['summary', 'certs', 'exp', 'edu', 'proj', 'vol', 'skills']
    : ['summary', 'exp', 'proj', 'vol', 'edu', ...(key === 'modern' || key === 'creative' ? ['certs', 'skills'] : ['skills', 'certs'])];
  order.forEach(k => blocks[k]());
  if (download) d.save((p.name || 'resume').trim().replace(/\s+/g, '_') + '_Resume.pdf');
  return d.output('blob');
}
