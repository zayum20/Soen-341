const $ = s => document.querySelector(s);
const qs = new URLSearchParams(location.search);
if (qs.get('bare') && TEMPLATES[qs.get('bare')]) {           // used by scripts/screenshots.js
  document.body.innerHTML = renderResume(SAMPLE, qs.get('bare'));
  document.body.style.background = '#fff';
} else init();

function init() {
  const blank = () => ({ personal: { name: '', title: '', email: '', phone: '', location: '', links: [] },
    summary: '', experience: [], education: [], projects: [], volunteer: [], skills: [], certifications: [] });
  let R = blank(), id = qs.get('id'), tpl = 'modern', zoom = 0.75, modalKey = null;
  const open = new Set(['personal']);
  const NEW = { experience: () => ({ title: '', company: '', location: '', start: '', end: '', current: false, bullets: [] }),
    education: () => ({ degree: '', school: '', location: '', start: '', end: '', current: false, grade: '', details: '' }),
    projects: () => ({ title: '', link: '', description: '', date: '' }),
    volunteer: () => ({ position: '', organisation: '', location: '', start: '', end: '', current: false, description: '' }),
    certifications: () => ({ name: '', issuer: '', year: '' }) };
  const SECTIONS = [
    ['personal', 'Contact', () => R.personal.name || R.personal.email],
    ['summary', 'About', () => R.summary],
    ['experience', 'Work Experience', () => R.experience.length],
    ['education', 'Education', () => R.education.length],
    ['certifications', 'Certifications', () => R.certifications.length],
    ['projects', 'Projects', () => R.projects.length],
    ['skills', 'Skills', () => R.skills.length],
    ['volunteer', 'Volunteer Experience', () => R.volunteer.length]];

  function toast(msg, type = '', ms = 3000) {
    const t = document.createElement('div'); t.className = 'toast ' + type; t.textContent = msg;
    $('#toasts').appendChild(t); setTimeout(() => t.remove(), ms); return t;
  }
  const inp = (label, path, val, kind = 'text') => `<label>${label}<input data-path="${path}" data-kind="${kind}" value="${esc(val)}"></label>`;
  const area = (label, path, val, kind = 'text') => `<label>${label}<textarea data-path="${path}" data-kind="${kind}">${esc(val)}</textarea></label>`;
  const mon = (label, path, val, dis = false) => `<label>${label}<input type="month" data-path="${path}" data-kind="text" value="${/^\d{4}-\d{2}$/.test(val || '') ? val : ''}" ${dis ? 'disabled' : ''}></label>`;
  const chk = (path, on) => `<label style="display:flex;gap:6px;align-items:center"><input type="checkbox" data-path="${path}" data-kind="check" style="width:auto;margin:0" ${on ? 'checked' : ''}>Currently here (show "Present")</label>`;
  const range = (base, o) => `<div class="two">${mon('Start', base + '.start', o.start)}${mon('End', base + '.end', o.current ? '' : o.end, !!o.current)}</div>${chk(base + '.current', o.current)}`;
  const card = (list, i, inner) => `<div class="card"><button class="del" data-act="del" data-list="${list}" data-i="${i}">Remove</button>${inner}</div>`;
  const add = (list, label) => `<button data-act="add" data-list="${list}">+ Add ${label}</button>`;

  const BODY = {
    personal: () => { const p = R.personal;
      return inp('Full name', 'personal.name', p.name) + inp('Job title', 'personal.title', p.title) + inp('Email', 'personal.email', p.email) +
        inp('Phone', 'personal.phone', p.phone) + inp('Location', 'personal.location', p.location) +
        area('Links (one per line)', 'personal.links', p.links.join('\n'), 'lines'); },
    summary: () => area('Professional summary', 'summary', R.summary),
    experience: () => R.experience.map((e, i) => card('experience', i, inp('Job title', `experience.${i}.title`, e.title) +
      inp('Company', `experience.${i}.company`, e.company) + inp('Location', `experience.${i}.location`, e.location) +
      range(`experience.${i}`, e) +
      area('Bullets (one per line)', `experience.${i}.bullets`, e.bullets.join('\n'), 'lines'))).join('') + add('experience', 'experience'),
    education: () => R.education.map((e, i) => card('education', i, inp('Degree', `education.${i}.degree`, e.degree) +
      inp('School', `education.${i}.school`, e.school) + inp('Location', `education.${i}.location`, e.location) +
      range(`education.${i}`, e) + inp('Grade (optional)', `education.${i}.grade`, e.grade || '') +
      area('Details', `education.${i}.details`, e.details))).join('') + add('education', 'education'),
    certifications: () => R.certifications.map((c, i) => card('certifications', i, inp('Name', `certifications.${i}.name`, c.name) +
      inp('Issuer', `certifications.${i}.issuer`, c.issuer) + inp('Year', `certifications.${i}.year`, c.year))).join('') + add('certifications', 'certification'),
    projects: () => R.projects.map((p, i) => card('projects', i, inp('Title', `projects.${i}.title`, p.title) +
      inp('Link', `projects.${i}.link`, p.link) + mon('Date', `projects.${i}.date`, p.date) +
      area('Description', `projects.${i}.description`, p.description))).join('') + add('projects', 'project'),
    volunteer: () => R.volunteer.map((v, i) => card('volunteer', i, inp('Position', `volunteer.${i}.position`, v.position) +
      inp('Organisation', `volunteer.${i}.organisation`, v.organisation) + inp('Location', `volunteer.${i}.location`, v.location) +
      range(`volunteer.${i}`, v) + area('Description', `volunteer.${i}.description`, v.description))).join('') + add('volunteer', 'volunteer experience'),
    skills: () => area('Skills (comma separated)', 'skills', R.skills.join(', '), 'csv')
  };

  function renderEditor() {
    $('#sections').innerHTML = SECTIONS.map(([k, label, has]) => `<div class="sec ${has() ? '' : 'empty'}" data-k="${k}">
      <div class="sec-h" data-toggle="${k}"><i>${open.has(k) ? '−' : '+'}</i>${label}<span class="badge" ${has() ? 'hidden' : ''}>Empty</span></div>
      ${open.has(k) ? `<div class="sec-b">${BODY[k]()}</div>` : ''}</div>`).join('');
  }
  function updateBadges() {
    SECTIONS.forEach(([k, , has]) => { const el = document.querySelector(`.sec[data-k="${k}"]`); if (!el) return;
      el.classList.toggle('empty', !has()); el.querySelector('.badge').hidden = !!has(); });
  }
  const renderPreview = () => { $('#page').innerHTML = renderResume(R, tpl); $('#page').style.zoom = zoom; };
  const hasContent = () => R.personal.name || R.experience.length || R.summary;
  function renderGallery() {
    const data = hasContent() ? R : SAMPLE;
    $('#gallery').innerHTML = Object.entries(TEMPLATES).map(([k, t]) => `<div class="tcard ${k === tpl ? 'sel' : ''}" data-k="${k}">
      <div class="thumb">${renderResume(data, k)}</div><div class="tname"><span class="dot" style="background:${t.color}"></span>${t.name}</div>
      <div class="ttag">${t.tag}</div><button data-prev="${k}">Preview</button></div>`).join('');
  }
  let timer; const refresh = () => { renderPreview(); updateBadges(); clearTimeout(timer); timer = setTimeout(renderGallery, 500); };
  const setPath = (path, v) => { const k = path.split('.'); let o = R; while (k.length > 1) o = o[k.shift()]; o[k[0]] = v; };

  $('#sections').addEventListener('input', e => {
    const p = e.target.dataset.path; if (!p) return;
    const kind = e.target.dataset.kind, v = kind === 'check' ? e.target.checked : e.target.value;
    setPath(p, kind === 'lines' ? v.split('\n').map(s => s.trim()).filter(Boolean)
      : kind === 'csv' ? v.split(',').map(s => s.trim()).filter(Boolean) : v);
    if (kind === 'check') renderEditor();
    refresh();
  });
  $('#sections').addEventListener('click', e => {
    const t = e.target.closest('[data-toggle],[data-act]'); if (!t) return;
    if (t.dataset.toggle) { open.has(t.dataset.toggle) ? open.delete(t.dataset.toggle) : open.add(t.dataset.toggle); }
    else if (t.dataset.act === 'add') R[t.dataset.list].push(NEW[t.dataset.list]());
    else if (t.dataset.act === 'del') R[t.dataset.list].splice(+t.dataset.i, 1);
    renderEditor(); refresh();
  });
  $('#gallery').addEventListener('click', e => {
    const pv = e.target.closest('[data-prev]'), c = e.target.closest('.tcard'); if (!c) return;
    if (pv) return showModal(pv.dataset.prev);
    tpl = c.dataset.k; renderPreview(); renderGallery();
  });
  function showModal(k) {
    modalKey = k; $('#mtitle').textContent = TEMPLATES[k].name + ' template';
    $('#mbody').innerHTML = renderResume(hasContent() ? R : SAMPLE, k); $('#modal').hidden = false;
  }
  $('#mclose').onclick = () => ($('#modal').hidden = true);
  $('#muse').onclick = () => { tpl = modalKey; $('#modal').hidden = true; renderPreview(); renderGallery(); toast('Template applied', 'ok'); };
  $('#zi').onclick = () => { zoom = Math.min(1.2, zoom + 0.1); renderPreview(); };
  $('#zo').onclick = () => { zoom = Math.max(0.4, zoom - 0.1); renderPreview(); };

  async function api(url, opts) {
    const r = await fetch(url, opts), j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(j.error || j.message || 'Request failed (' + r.status + ')');
    return j;
  }
  function load(j) { R = { ...blank(), ...j.data }; tpl = TEMPLATES[j.template] ? j.template : 'modern'; id = j.id;
    history.replaceState(null, '', '?id=' + id); renderEditor(); renderPreview(); renderGallery(); }

  $('#upload').onclick = () => $('#file').click();
  $('#file').onchange = async e => {
    const f = e.target.files[0]; if (!f) return;
    const t = toast('Parsing resume with AI…', '', 60000);
    try { const fd = new FormData(); fd.append('resume', f);
      load(await api('/api/resumes/upload', { method: 'POST', body: fd })); toast('Resume parsed — review and edit below', 'ok');
    } catch (err) { toast(err.message, 'err', 5000); } finally { t.remove(); e.target.value = ''; }
  };
  $('#save').onclick = async () => {
    try { const body = JSON.stringify({ data: R, template: tpl }), h = { 'Content-Type': 'application/json' };
      if (id) await api('/api/resumes/' + id, { method: 'PUT', headers: h, body });
      else { id = (await api('/api/resumes', { method: 'POST', headers: h, body })).id; history.replaceState(null, '', '?id=' + id); }
      const pdf = exportPDF(R, tpl, false);
      const filename = (R.personal.name || 'resume').trim().replace(/\s+/g, '_') + '_Resume.pdf';
      const form = new FormData();
      form.append('resume', pdf, filename);
      await api('/api/profile/resume', { method: 'POST', body: form });
      toast('Saved to your profile', 'ok');
    } catch (err) { toast(err.message, 'err', 5000); }
  };
  $('#download').onclick = () => { try { exportPDF(R, tpl); toast('PDF downloaded', 'ok'); } catch (err) { toast('PDF failed: ' + err.message, 'err'); } };

  renderEditor(); renderPreview(); renderGallery();
  if (id) api('/api/resumes/' + id).then(load).catch(err => toast(err.message, 'err', 5000));
}
