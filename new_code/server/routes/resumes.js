const router = require('express').Router();
const multer = require('multer');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const { pool } = require('../db');
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

const blank = () => ({ personal: { name: '', title: '', email: '', phone: '', location: '', links: [] },
  summary: '', experience: [], education: [], projects: [], volunteer: [], skills: [], certifications: [] });
const arr = a => (Array.isArray(a) ? a : []);
const MON = { jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12 };
function ym(v) { // normalise to "YYYY-MM"; leave anything unparseable (e.g. "2025") untouched
  v = String(v == null ? '' : v).trim();
  if (/^\d{4}-\d{2}$/.test(v)) return v;
  const m = v.match(/^([A-Za-z]{3})[a-z]*\.?,?\s+(\d{4})$/);
  return m && MON[m[1].toLowerCase()] ? m[2] + '-' + String(MON[m[1].toLowerCase()]).padStart(2, '0') : v;
}
const isNow = v => /^(present|current|now|ongoing)$/i.test(String(v || '').trim());
const span = e => { const cur = !!e.current || isNow(e.end); return { start: ym(e.start), end: cur ? '' : ym(e.end), current: cur }; };
function normalize(d = {}) {
  const b = blank();
  return {
    personal: { ...b.personal, ...(d.personal || {}), links: arr(d.personal && d.personal.links) },
    summary: d.summary || '',
    experience: arr(d.experience).map(e => ({ title: '', company: '', location: '', ...e, ...span(e), bullets: arr(e.bullets) })),
    education: arr(d.education).map(e => ({ degree: '', school: '', location: '', grade: '', details: '', ...e, ...span(e) })),
    projects: arr(d.projects).map(p => ({ title: '', link: '', description: '', ...p, date: ym(p.date) })),
    volunteer: arr(d.volunteer).map(v => ({ position: '', organisation: '', location: '', description: '', ...v, ...span(v) })),
    skills: arr(d.skills).map(String),
    certifications: arr(d.certifications).map(c => ({ name: '', issuer: '', year: '', ...c }))
  };
}

const SYSTEM = `You convert resume text into JSON. Reply with ONLY valid JSON, no markdown, matching exactly:
{"personal":{"name":"","title":"","email":"","phone":"","location":"","links":[]},"summary":"",
"experience":[{"title":"","company":"","location":"","start":"","end":"","current":false,"bullets":[]}],
"education":[{"degree":"","school":"","location":"","start":"","end":"","current":false,"grade":"","details":""}],
"projects":[{"title":"","link":"","description":"","date":""}],
"volunteer":[{"position":"","organisation":"","location":"","start":"","end":"","current":false,"description":""}],
"skills":[],"certifications":[{"name":"","issuer":"","year":""}]}
Dates must be "YYYY-MM"; if only a year is stated use "YYYY". For ongoing roles/studies set "current" to true and "end" to "".
Put volunteer work in "volunteer" (not "experience") and personal/side projects in "projects".
Use only information present in the text. Use "" or [] when something is missing. Never invent content.`;

async function aiParse(text) {
  if (!process.env.ANTHROPIC_API_KEY) throw Object.assign(new Error('ANTHROPIC_API_KEY is not set'), { status: 500 });
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({ model: process.env.AI_MODEL || 'claude-sonnet-5-5', max_tokens: 4000, system: SYSTEM,
      messages: [{ role: 'user', content: text.slice(0, 20000) }] })
  });
  if (!r.ok) throw Object.assign(new Error('AI parsing failed (' + r.status + ')'), { status: 502 });
  const j = await r.json();
  const raw = j.content.filter(b => b.type === 'text').map(b => b.text).join('').replace(/^```(json)?|```$/gm, '').trim();
  return normalize(JSON.parse(raw));
}

async function extractText(f) {
  const n = f.originalname.toLowerCase();
  if (n.endsWith('.pdf')) return (await pdfParse(f.buffer)).text;
  if (n.endsWith('.docx')) return (await mammoth.extractRawText({ buffer: f.buffer })).value;
  throw Object.assign(new Error('Only PDF and DOCX files are supported'), { status: 400 });
}
const parseRow = r => ({ id: r.id, template: r.template, title: r.title, data: typeof r.data === 'string' ? JSON.parse(r.data) : r.data });
const wrap = fn => (req, res, next) => fn(req, res).catch(next);

router.post('/upload', upload.single('resume'), wrap(async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const text = await extractText(req.file);
  if (text.trim().length < 50) return res.status(422).json({ error: 'No readable text found (scanned PDF?)' });
  const data = await aiParse(text);
  const [r] = await pool.query('INSERT INTO resumes (title, data, original_filename) VALUES (?,?,?)',
    [data.personal.name || req.file.originalname, JSON.stringify(data), req.file.originalname]);
  res.json({ id: r.insertId, template: 'modern', data });
}));

router.get('/', wrap(async (req, res) => {
  const [rows] = await pool.query('SELECT id, title, template, updated_at FROM resumes ORDER BY updated_at DESC LIMIT 50');
  res.json(rows);
}));

router.post('/', wrap(async (req, res) => {
  const data = normalize(req.body.data);
  const [r] = await pool.query('INSERT INTO resumes (title, template, data) VALUES (?,?,?)',
    [data.personal.name || 'Untitled', req.body.template || 'modern', JSON.stringify(data)]);
  res.json({ id: r.insertId });
}));

router.get('/:id', wrap(async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM resumes WHERE id=?', [req.params.id]);
  if (!rows.length) return res.status(404).json({ error: 'Resume not found' });
  res.json(parseRow(rows[0]));
}));

router.put('/:id', wrap(async (req, res) => {
  const data = normalize(req.body.data);
  const [r] = await pool.query('UPDATE resumes SET title=?, template=?, data=? WHERE id=?',
    [data.personal.name || 'Untitled', req.body.template || 'modern', JSON.stringify(data), req.params.id]);
  if (!r.affectedRows) return res.status(404).json({ error: 'Resume not found' });
  res.json({ ok: true });
}));

module.exports = router;
