// Vérifie la base de questions (questions.js et questions-wikidata.js) : node outils/verifier-questions.js
// Erreurs (le script échoue) : champ manquant, thème ou type inconnu, niveau invalide, coordonnées hors limites, doublon.
// Avertissements : indice qui semble contenir le nom du lieu à trouver.
const fs = require('fs'), path = require('path'), vm = require('vm');
const auto = path.join(__dirname, '..', 'questions-wikidata.js');
const src = fs.readFileSync(path.join(__dirname, '..', 'questions.js'), 'utf8') + (fs.existsSync(auto) ? ';' + fs.readFileSync(auto, 'utf8') : '');
const ctx = {};
vm.runInNewContext(src + ';this.THEMES = THEMES; this.TYPES = TYPES; this.QUESTIONS = QUESTIONS;', ctx);
const { THEMES, TYPES, QUESTIONS } = ctx;

const errors = [], warnings = [], seen = new Map();
const norm = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\(.*?\)/g, '').replace(/[^a-z0-9]/g, '');
const GENERIC = /^(pres|large|nord|sud|est|ouest|baie|musee|palais|chateau|stade|plage|pont|foret|desert|region|centre|prison|institut|galerie|viaduc|royaume|empire|etats|republique)$/;

for (const d of QUESTIONS) {
  const who = '« ' + (d.t || '?') + ' »';
  for (const f of ['t', 'c', 'x', 'p']) if (typeof d[f] !== 'string' || !d[f].trim()) errors.push(who + ' : champ ' + f + ' manquant');
  if (!THEMES[d.h]) errors.push(who + ' : thème inconnu ' + d.h);
  if (!TYPES[d.k]) errors.push(who + ' : type inconnu ' + d.k);
  if (![1, 2, 3].includes(d.n)) errors.push(who + ' : niveau n invalide (' + d.n + ')');
  if (!(Math.abs(d.a) <= 90 && Math.abs(d.o) <= 180)) errors.push(who + ' : coordonnées invalides');
  const key = norm(d.t || '');
  if (seen.has(key)) errors.push(who + ' : doublon de « ' + seen.get(key) + ' »');
  seen.set(key, d.t);
  /* Le premier élément du lieu affiché (« Ulm » dans « Ulm, Allemagne ») ne doit pas apparaître dans l'indice. */
  const place = (d.p || '').split(',')[0].replace(/\(.*?\)/g, ' ');
  for (const w of place.split(/[\s'’-]+/)) {
    if (w.length < 4 || GENERIC.test(norm(w))) continue;
    if (new RegExp('(^|[^\\p{L}])' + w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '($|[^\\p{L}])', 'iu').test(d.x)) warnings.push(who + ' : l’indice contient « ' + w + ' »');
  }
}

const rows = Object.keys(THEMES).map(h => {
  const l = QUESTIONS.filter(d => d.h === h);
  return [THEMES[h].long.padEnd(24), ...[1, 2, 3].map(n => String(l.filter(d => d.n === n).length).padStart(8)), String(l.length).padStart(8)].join('');
});
console.log(''.padEnd(24) + '  Facile   Moyen   Diff.   Total');
console.log(rows.join('\n'));
console.log(''.padEnd(24) + [1, 2, 3].map(n => String(QUESTIONS.filter(d => d.n === n).length).padStart(8)).join('') + String(QUESTIONS.length).padStart(8));
if (warnings.length) console.log('\nÀ vérifier :\n' + warnings.join('\n'));
if (errors.length) { console.error('\nErreurs :\n' + errors.join('\n')); process.exit(1); }
console.log('\nAucune erreur.');
