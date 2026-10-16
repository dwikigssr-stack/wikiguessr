// Contrôle les questions tirées de Wikidata (questions-wikidata.js) avant qu'elles entrent dans le jeu :
//   node outils/valider-wikidata.js              rapport seulement ; échoue s'il reste une question refusée
//   node outils/valider-wikidata.js --corriger   retire les questions refusées et note leur identifiant
//                                                dans outils/wikidata-exclus.txt pour qu'elles ne reviennent pas
//   --rapport fichier.md                         écrit aussi le rapport en Markdown (pour la PR)
// Le contrôle de position (le point est-il bien dans le pays annoncé ?) a besoin des paquets npm
// d3-geo, topojson-client et world-atlas ; sans eux, il est sauté avec un avertissement.
const fs = require('fs'), path = require('path'), vm = require('vm'), { execSync } = require('child_process');

const RACINE = path.join(__dirname, '..');
const FICHIER = path.join(RACINE, 'questions-wikidata.js');
const EXCLUS = path.join(__dirname, 'wikidata-exclus.txt');
const args = process.argv.slice(2);
const corriger = args.includes('--corriger');
const rapportMd = args.includes('--rapport') ? args[args.indexOf('--rapport') + 1] : null;

const norm = s => (s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\(.*?\)/g, '').replace(/[^a-z0-9]/g, '');
const GENERIQUES = require('./wikidata-mots.js');
const km = (a1, o1, a2, o2) => { const r = Math.PI / 180, x = Math.sin((a2 - a1) * r / 2) ** 2 + Math.cos(a1 * r) * Math.cos(a2 * r) * Math.sin((o2 - o1) * r / 2) ** 2; return 12742 * Math.asin(Math.sqrt(x)); };

if (!fs.existsSync(FICHIER)) { console.log('Pas de questions-wikidata.js : rien à contrôler.'); process.exit(0); }
const base = fs.readFileSync(path.join(RACINE, 'questions.js'), 'utf8');
const ctx = {};
vm.runInNewContext(base + ';const AVANT = QUESTIONS.length;' + fs.readFileSync(FICHIER, 'utf8') + ';this.T = THEMES; this.K = TYPES; this.Q = QUESTIONS; this.N = AVANT;', ctx);
const mains = ctx.Q.slice(0, ctx.N), auto = ctx.Q.slice(ctx.N);

/* Les questions arrivées depuis la dernière version enregistrée dans git : ce sont elles que le rapport détaille. */
let anciens = new Set();
try { anciens = new Set(execSync('git show HEAD:questions-wikidata.js', { cwd: RACINE, stdio: ['ignore', 'pipe', 'ignore'] }).toString().match(/id:"Q\d+"/g) || []); } catch (e) {}
const estNouvelle = d => !anciens.has('id:"' + d.id + '"');

/* Contrôle de position : le point doit être dans le pays annoncé, ou à moins de 30 km de lui (côtes, îles, frontières). */
let dansPays = null;
try {
  const d3 = require('d3-geo'), topo = require('topojson-client'), atlas = require('world-atlas/countries-50m.json');
  /* Plusieurs formes peuvent partager un code (l'Australie et les îles Ashmore-et-Cartier) : on les garde toutes. */
  const pays = new Map();
  for (const f of topo.feature(atlas, atlas.objects.countries).features) { const k = String(+f.id); pays.set(k, (pays.get(k) || []).concat(f)); }
  dansPays = (d) => {
    const fs = pays.get(String(+d.iso)); if (!fs) return null;
    const dedans = pt => fs.some(f => d3.geoContains(f, pt));
    if (dedans([d.o, d.a])) return true;
    for (let i = 0; i < 16; i++) {
      const ang = i * Math.PI / 8, dl = 30 / 111;
      if (dedans([d.o + dl * Math.sin(ang) / Math.max(0.2, Math.cos(d.a * Math.PI / 180)), d.a + dl * Math.cos(ang)])) return true;
    }
    return false;
  };
} catch (e) { console.log('Avertissement : d3-geo, topojson-client ou world-atlas absent, contrôle de position sauté.'); }

const refus = [], avertissements = [];
const titresMain = new Map(mains.map(d => [norm(d.t), d.t]));
const vusTitre = new Map(), vusIndice = new Map();
for (const d of auto) {
  const raisons = [];
  for (const f of ['t', 'c', 'x', 'e', 'p']) if (typeof d[f] !== 'string' || !d[f].trim()) raisons.push('champ ' + f + ' manquant');
  if (!ctx.T[d.h]) raisons.push('thème inconnu');
  if (!ctx.K[d.k]) raisons.push('type inconnu');
  if (!/^Q\d+$/.test(d.id || '')) raisons.push('identifiant Wikidata manquant');
  if (!(Math.abs(d.a) <= 90 && Math.abs(d.o) <= 180) || (Math.abs(d.a) < 0.5 && Math.abs(d.o) < 0.5)) raisons.push('coordonnées invalides');

  const x = d.x || '';
  if (x.length < 25) raisons.push('indice trop court');
  if (x.length > 260) raisons.push('indice trop long');
  if (/undefined|null|NaN|\bQ\d+\b|https?:|\s{2}|\{|\}/.test(x + ' ' + d.e + ' ' + d.p)) raisons.push('texte mal formé');
  if (!/[.!?]$/.test(x)) raisons.push('indice sans ponctuation finale');
  /* L'indice ne doit nommer ni le lieu affiché après la réponse (commune, pays), ni le sujet lui-même. */
  const mots = [...(d.p || '').split(','), d.t].join(' ').split(/[\s'’\-,()]+/).filter(w => w.length >= 4 && !GENERIQUES.test(norm(w))).map(norm);
  const motsIndice = x.split(/[\s'’\-,.;:()«»]+/).map(norm).filter(w => w.length >= 4);
  const fuite = mots.find(m => motsIndice.some(w => w === m || (w.startsWith(m) && w.length - m.length <= 3)));
  if (fuite) raisons.push('indice trop parlant (« ' + fuite + ' »)');
  if (vusIndice.has(norm(x))) raisons.push('même indice que « ' + vusIndice.get(norm(x)) + ' »');

  if (titresMain.has(norm(d.t))) raisons.push('déjà dans les questions écrites à la main');
  else if (vusTitre.has(norm(d.t))) raisons.push('doublon de titre');
  /* Même endroit qu'une question écrite à la main : refusé si celle-ci demande déjà de placer le lieu lui-même
     (« Estadio Centenario » et « Stade Centenario »), ou si les titres partagent un nom. Une question sur un
     événement ou une personne au même endroit reste une question différente. */
  const motsTitre = new Set(d.t.split(/[\s'’\-,()]+/).filter(w => w.length >= 4 && !GENERIQUES.test(norm(w))).map(norm));
  const proche = mains.find(m => km(m.a, m.o, d.a, d.o) < 1 && (m.k === 'lieu' || m.t.split(/[\s'’\-,()]+/).some(w => motsTitre.has(norm(w)))));
  if (proche) raisons.push('même lieu que « ' + proche.t + ' » (questions écrites à la main)');

  if (dansPays && d.iso) {
    const r = dansPays(d);
    if (r === false) raisons.push('position hors du pays annoncé (' + d.p + ', code ' + d.iso + ')');
    if (r === null) avertissements.push('« ' + d.t + ' » : pays ' + d.iso + ' absent de la carte, position non contrôlée');
  }
  if (raisons.length) refus.push({ d, raisons });
  else { vusTitre.set(norm(d.t), d.t); vusIndice.set(norm(x), d.t); }
}

/* Équilibre du lot : un thème qui écrase les autres mérite un coup d'œil. */
const nouvelles = auto.filter(estNouvelle), refusIds = new Set(refus.map(r => r.d.id));
const gardees = nouvelles.filter(d => !refusIds.has(d.id));
const parTheme = {};
for (const d of gardees) parTheme[d.h] = (parTheme[d.h] || 0) + 1;
for (const [h, n] of Object.entries(parTheme)) if (gardees.length >= 50 && n / gardees.length > 0.6) avertissements.push('le thème ' + ctx.T[h].long + ' fait ' + Math.round(100 * n / gardees.length) + ' % du lot');

const lignes = [];
lignes.push('## Contrôle des questions Wikidata', '');
lignes.push(`- Questions Wikidata dans le jeu : **${auto.length - refus.length}** (dont **${gardees.length}** nouvelles dans ce lot)`);
lignes.push(`- Refusées : **${refus.length}**` + (corriger ? ' (retirées et ajoutées à outils/wikidata-exclus.txt)' : ''));
lignes.push('- Nouvelles par thème : ' + Object.entries(parTheme).map(([h, n]) => ctx.T[h].long + ' ' + n).join(', '));
if (avertissements.length) lignes.push('', '### À regarder', '', ...avertissements.map(a => '- ' + a));
if (refus.length) {
  lignes.push('', '### Refusées', '');
  const motifs = {}; refus.forEach(r => r.raisons.forEach(m => { const k = m.replace(/ \(.*$/, '').replace(/ «.*$/, ''); motifs[k] = (motifs[k] || 0) + 1; }));
  lignes.push(...Object.entries(motifs).sort((a, b) => b[1] - a[1]).map(([m, n]) => `- ${m} : ${n}`));
  lignes.push('', '<details><summary>Détail</summary>', '', ...refus.slice(0, 300).map(r => `- ${r.d.t} (${r.d.id}) : ${r.raisons.join(' ; ')}`), '', '</details>');
}
if (gardees.length) {
  const pas = Math.max(1, Math.floor(gardees.length / 30));
  lignes.push('', '### Échantillon à relire', '', '| Titre | Indice | Réponse |', '|---|---|---|');
  lignes.push(...gardees.filter((_, i) => i % pas === 0).slice(0, 30).map(d => `| ${d.t} | ${d.x.replace(/\|/g, '/')} | ${d.p} |`));
}
const rapport = lignes.join('\n');
console.log(rapport);
if (rapportMd) fs.writeFileSync(rapportMd, rapport + '\n');
if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, rapport + '\n');

if (corriger && refus.length) {
  const src = fs.readFileSync(FICHIER, 'utf8').split('\n').filter(l => { const m = l.match(/id:"(Q\d+)"/); return !(m && refusIds.has(m[1])); });
  fs.writeFileSync(FICHIER, src.join('\n').replace(/\najouter\('[^']+', '[^']+', \[\n\]\);\n/g, '\n'));
  const deja = fs.existsSync(EXCLUS) ? fs.readFileSync(EXCLUS, 'utf8') : '# Questions Wikidata écartées : une par ligne, identifiant puis raison. Elles ne seront plus proposées.\n';
  fs.writeFileSync(EXCLUS, deja + refus.map(r => r.d.id + ' ' + r.d.t + ' : ' + r.raisons.join(' ; ')).join('\n') + '\n');
  console.log('\n' + refus.length + ' questions retirées.');
} else if (refus.length) process.exit(1);
