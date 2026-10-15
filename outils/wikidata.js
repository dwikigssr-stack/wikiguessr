// Ajoute au jeu des questions tirées de Wikidata : node outils/wikidata.js
// Le script interroge Wikidata (il faut un accès à Internet), garde les sujets connus (beaucoup d'articles
// Wikipédia dans le monde, un article en français, des coordonnées), écrit un indice qui ne nomme ni le lieu,
// ni sa région, ni son pays, puis complète questions-wikidata.js sans toucher aux questions écrites à la main.
// Réglages par variables d'environnement : MAX_NOUVELLES (nombre maximum de questions ajoutées, 1500 par défaut).
const fs = require('fs'), path = require('path'), vm = require('vm');

const RACINE = path.join(__dirname, '..');
const SORTIE = path.join(RACINE, 'questions-wikidata.js');
const MAX_NOUVELLES = +(process.env.MAX_NOUVELLES || 1500);
const EXCLUS = path.join(__dirname, 'wikidata-exclus.txt');
const UA = 'Wikiguessr/1.0 (https://github.com/dwikigssr-stack/wikiguessr; jeu de géographie)';

/* Catégories : classes Wikidata (instance de), thème et type de manche du jeu, sous-catégorie affichée,
   nombre minimum d'articles Wikipédia (toutes langues) pour garder un sujet, et les faits à citer dans l'indice. */
const CATEGORIES = [
  { h: 'lieux', k: 'lieu', min: 30, faits: ['debut', 'hauteur', 'architecte', 'unesco'], classes: {
    Q23413: 'Château', Q751876: 'Château', Q16560: 'Palais', Q2977: 'Cathédrale', Q32815: 'Mosquée', Q44539: 'Temple',
    Q160742: 'Abbaye', Q12280: 'Pont', Q11303: 'Gratte-ciel', Q4989906: 'Monument', Q839954: 'Site archéologique',
    Q57821: 'Fortification', Q1785071: 'Fort', Q12518: 'Tour', Q5003624: 'Mémorial' } },
  { h: 'lieux', k: 'lieu', min: 50, faits: ['altitude', 'superficie', 'unesco'], classes: {
    Q8502: 'Montagne', Q8072: 'Volcan', Q169358: 'Volcan', Q34038: 'Chute d’eau', Q23397: 'Lac', Q23442: 'Île', Q150784: 'Canyon',
    Q35666: 'Glacier', Q46169: 'Parc national' } },
  { h: 'culture', k: 'lieu', min: 30, faits: ['debut', 'architecte', 'unesco'], classes: {
    Q33506: 'Musée', Q207694: 'Musée d’art', Q153562: 'Opéra', Q24354: 'Théâtre', Q7075: 'Bibliothèque' } },
  { h: 'sport', k: 'lieu', min: 25, faits: ['ouverture', 'capacite', 'architecte'], classes: {
    Q483110: 'Stade', Q2338524: 'Circuit automobile', Q641226: 'Salle omnisports' } },
  { h: 'science', k: 'lieu', min: 20, faits: ['debut', 'altitude'], classes: {
    Q1254933: 'Observatoire', Q194188: 'Base de lancement', Q134447: 'Centrale nucléaire', Q12323: 'Barrage' } },
  { h: 'evt', k: 'evt', min: 25, faits: ['date', 'partie'], classes: {
    Q178561: 'Bataille', Q188055: 'Siège', Q7944: 'Séisme' } }
];

/* Mots trop courants pour signaler un indice trop parlant (repris de verifier-questions.js, plus les noms d'entités administratives). */
const GENERIQUES = require('./wikidata-mots.js');
const norm = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\(.*?\)/g, '').replace(/[^a-z0-9]/g, '');
const pause = ms => new Promise(r => setTimeout(r, ms));
const nb = x => Math.round(x).toLocaleString('fr-FR').replace(/[  ]/g, ' ');
const maj = s => s ? s[0].toUpperCase() + s.slice(1) : s;

async function demander(url, opts = {}, essais = 2) {
  for (let i = 0; ; i++) {
    try {
      const r = await fetch(url, { ...opts, headers: { 'User-Agent': UA, Accept: 'application/json', ...(opts.headers || {}) } });
      if (r.ok) return await r.json();
      if (i >= essais || ![429, 500, 502, 503, 504].includes(r.status)) throw new Error(r.status + ' ' + url.slice(0, 120));
    } catch (e) { if (i >= essais) throw e; }
    await pause(5000 * (i + 1));
  }
}

async function sparql(q) {
  const j = await demander('https://query.wikidata.org/sparql', {
    method: 'POST', body: new URLSearchParams({ query: q, format: 'json' }),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
  return j.results.bindings;
}

/* Récupère des entités par paquets de 50 (étiquettes, descriptions et propriétés en français). */
const CACHE = new Map();
async function entites(ids) {
  const manquants = [...new Set(ids)].filter(id => id && !CACHE.has(id));
  for (let i = 0; i < manquants.length; i += 50) {
    const lot = manquants.slice(i, i + 50);
    const j = await demander('https://www.wikidata.org/w/api.php?' + new URLSearchParams({
      action: 'wbgetentities', ids: lot.join('|'), props: 'labels|descriptions|claims|sitelinks',
      languages: 'fr', sitefilter: 'frwiki', format: 'json'
    }));
    for (const id of lot) CACHE.set(id, (j.entities || {})[id] || null);
    await pause(200);
  }
  return ids.map(id => CACHE.get(id));
}
const etiquette = e => e && e.labels && e.labels.fr ? e.labels.fr.value : '';
/* Valeurs d'une propriété : rang préféré d'abord, jamais les valeurs dépréciées. */
function valeurs(e, p) {
  const c = (e && e.claims && e.claims[p]) || [];
  const ok = c.filter(x => x.rank !== 'deprecated' && x.mainsnak.snaktype === 'value');
  const pref = ok.filter(x => x.rank === 'preferred');
  return (pref.length ? pref : ok).map(x => x.mainsnak.datavalue.value);
}
const ref = (e, p) => valeurs(e, p).map(v => v.id).filter(Boolean);

/* Dates Wikidata : « 1869 », « années 1860 », « XIIe siècle », « 52 av. J.-C. ». */
function romain(n) { const t = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']]; let s = ''; for (const [v, r] of t) while (n >= v) { s += r; n -= v; } return s; }
function quand(v) {
  if (!v || !v.time) return '';
  const m = v.time.match(/^([+-])0*(\d+)-/); if (!m) return '';
  const an = +m[2], avant = m[1] === '-';
  if (v.precision >= 9) return '' + an + (avant ? ' av. J.-C.' : '');
  if (v.precision === 8) return 'années ' + (Math.floor(an / 10) * 10) + (avant ? ' av. J.-C.' : '');
  if (v.precision === 7) { const s = Math.ceil(an / 100); return romain(s) + (s === 1 ? 'er' : 'e') + ' siècle' + (avant ? ' av. J.-C.' : ''); }
  return '';
}
function quantite(e, p, unites) {
  for (const v of valeurs(e, p)) {
    const u = (v.unit || '').split('/').pop();
    if (unites.includes(u)) return +v.amount;
  }
  return null;
}
const METRE = ['Q11573'], KM2 = ['Q712226'];

/* Les faits qui composent l'indice, selon la catégorie. Chacun est filtré ensuite contre les noms interdits. */
async function faits(e, liste) {
  const f = [];
  for (const nom of liste) {
    if (nom === 'debut') { const d = quand(valeurs(e, 'P571')[0]); if (d) f.push('Construction : ' + d); }
    if (nom === 'ouverture') { const d = quand(valeurs(e, 'P1619')[0] || valeurs(e, 'P571')[0]); if (d) f.push('Ouverture : ' + d); }
    if (nom === 'date') { const d = quand(valeurs(e, 'P585')[0] || valeurs(e, 'P580')[0]); if (d) f.push('Date : ' + d); }
    if (nom === 'hauteur') { const h = quantite(e, 'P2048', METRE); if (h >= 30) f.push('Hauteur : ' + nb(h) + ' m'); }
    if (nom === 'altitude') { const h = quantite(e, 'P2044', METRE); if (h >= 200) f.push('Altitude : ' + nb(h) + ' m'); }
    if (nom === 'superficie') { const s = quantite(e, 'P2046', KM2); if (s >= 1) f.push('Superficie : ' + nb(s) + ' km²'); }
    if (nom === 'capacite') { const c = valeurs(e, 'P1083').map(v => +v.amount).filter(x => x > 0)[0]; if (c >= 1000) f.push('Capacité : ' + nb(c) + ' places'); }
    if (nom === 'architecte') { const [a] = await entites(ref(e, 'P84').slice(0, 1)); if (etiquette(a)) f.push('Architecte : ' + etiquette(a)); }
    if (nom === 'partie') { const [p] = await entites(ref(e, 'P361').slice(0, 1)); if (etiquette(p)) f.push('Contexte : ' + etiquette(p)); }
    if (nom === 'unesco' && ref(e, 'P1435').includes('Q9259')) f.push('Inscrit au patrimoine mondial de l’UNESCO');
  }
  return f;
}

/* Ce que l'indice ne doit jamais contenir : les noms de la commune, des régions, du pays (et ses gentilés),
   du massif ou de l'élément géographique où se trouve le sujet. */
async function interdits(e) {
  const chaine = [], vus = new Set();
  let niveau = ref(e, 'P131').slice(0, 2);
  for (let i = 0; i < 4 && niveau.length; i++) {
    const ents = (await entites(niveau)).filter(Boolean);
    const suivant = [];
    for (const x of ents) { if (vus.has(x.id)) continue; vus.add(x.id); chaine.push(x); suivant.push(...ref(x, 'P131').slice(0, 1)); }
    niveau = suivant;
  }
  const pays = (await entites(ref(e, 'P17').slice(0, 2))).filter(Boolean);
  const autres = (await entites([...ref(e, 'P706'), ...ref(e, 'P276'), ...ref(e, 'P4552')].slice(0, 4))).filter(Boolean);
  const noms = [...chaine, ...pays, ...autres].map(etiquette).filter(Boolean);
  for (const p of pays) for (const v of valeurs(p, 'P1549')) if (v.language === 'fr') noms.push(v.text);
  const mots = new Set();
  for (const n of noms) for (const w of n.split(/[\s'’\-,]+/)) if (w.length >= 4 && !GENERIQUES.test(norm(w))) mots.add(norm(w));
  return { chaine, pays, mots };
}
/* Un texte est trop parlant s'il contient un mot interdit (y compris au féminin ou au pluriel : « allemande », « alpins »). */
function parlant(texte, mots) {
  for (const w of texte.split(/[\s'’\-,.;:()«»]+/)) {
    const n = norm(w); if (n.length < 4) continue;
    for (const m of mots) if (n === m || (n.startsWith(m) && n.length - m.length <= 3) || (m.startsWith(n) && m.length - n.length <= 2 && n.length >= 5)) return true;
  }
  return false;
}

/* Charge d'un coup les candidats d'un paquet et les entités qu'ils citent (communes, régions, pays…), sur 4 niveaux. */
async function prechargement(ids) {
  let niveau = ids;
  for (let i = 0; i < 5 && niveau.length; i++) {
    const ents = (await entites(niveau)).filter(Boolean);
    niveau = ents.flatMap(e => i === 0 ? ['P131', 'P17', 'P706', 'P276', 'P4552', 'P84', 'P361'].flatMap(p => ref(e, p).slice(0, 2)) : [...ref(e, 'P131').slice(0, 1), ...ref(e, 'P17').slice(0, 1)])
      .filter(id => !CACHE.has(id));
  }
}

/* Les questions déjà dans le jeu, pour ne pas créer de doublon. */
function charger(fichier, aussi = '') {
  if (!fs.existsSync(fichier)) return [];
  const ctx = {};
  vm.runInNewContext(fs.readFileSync(path.join(RACINE, 'questions.js'), 'utf8') + ';' + aussi + ';this.Q = QUESTIONS;', ctx);
  return ctx.Q;
}
const km = (a1, o1, a2, o2) => { const r = Math.PI / 180, x = Math.sin((a2 - a1) * r / 2) ** 2 + Math.cos(a1 * r) * Math.cos(a2 * r) * Math.sin((o2 - o1) * r / 2) ** 2; return 12742 * Math.asin(Math.sqrt(x)); };

async function main() {
  const mains = charger(path.join(RACINE, 'questions.js'));
  const anciennes = fs.existsSync(SORTIE) ? charger(SORTIE, fs.readFileSync(SORTIE, 'utf8')).filter(d => d.id) : [];
  const existantes = [...mains, ...anciennes];
  const titres = new Set(existantes.flatMap(d => [norm(d.t), norm(d.w || '')]).filter(Boolean));
  const exclus = new Set((fs.existsSync(EXCLUS) ? fs.readFileSync(EXCLUS, 'utf8') : '').match(/Q\d+/g) || []);
  const ids = new Set([...anciennes.map(d => d.id), ...exclus]);
  console.log('Questions écrites à la main : ' + mains.length + ', déjà tirées de Wikidata : ' + anciennes.length);

  /* 1. Les candidats de chaque catégorie, du plus connu au moins connu. */
  /* Une requête par classe : les grandes classes (montagnes, lacs, îles) dépassent le temps limite de Wikidata
     si on les interroge ensemble. Une classe qui échoue quand même est sautée, sans arrêter le lot. */
  const parClasse = [];
  for (const cat of CATEGORIES) {
    for (const [cls, nom] of Object.entries(cat.classes)) {
      const q = `SELECT ?item ?sl ?titre WHERE {
        ?item wdt:P31 wd:${cls} ; wikibase:sitelinks ?sl .
        FILTER(?sl >= ${cat.min})
        ?item wdt:P625 ?coord .
        ?art schema:about ?item ; schema:isPartOf <https://fr.wikipedia.org/> ; schema:name ?titre .
      } ORDER BY DESC(?sl)`;
      let lignes;
      try { lignes = await sparql(q); } catch (e) { console.log(cat.h + ' / ' + nom + ' (' + cls + ') : sauté, Wikidata n’a pas répondu (' + e.message.slice(0, 60) + ')'); continue; }
      const vus = new Set(), liste = [];
      for (const l of lignes) {
        const id = l.item.value.split('/').pop(); if (vus.has(id) || ids.has(id)) continue; vus.add(id);
        liste.push({ id, cls, sl: +l.sl.value, titre: l.titre.value, cat });
      }
      console.log(cat.h + ' / ' + nom + ' (' + cls + ') : ' + liste.length + ' candidats');
      parClasse.push(liste);
      await pause(1000);
    }
  }

  /* 2. On prend les candidats à tour de rôle dans chaque classe (un château, un lac, un stade…), pour un lot varié. */
  const ordre = [], dejaPris = new Set();
  for (let i = 0; parClasse.some(l => i < l.length); i++) for (const l of parClasse) if (i < l.length && !dejaPris.has(l[i].id)) { dejaPris.add(l[i].id); ordre.push(l[i]); }

  const nouvelles = [], rejets = {};
  const rejet = (pourquoi) => { rejets[pourquoi] = (rejets[pourquoi] || 0) + 1; };
  for (let i = 0; i < ordre.length; i++) {
    const c = ordre[i];
    if (nouvelles.length >= MAX_NOUVELLES) break;
    if (i % 50 === 0) await prechargement(ordre.slice(i, i + 50).map(z => z.id));
    const t = c.titre.replace(/\s*\(.*?\)\s*$/, '');
    if (titres.has(norm(t)) || titres.has(norm(c.titre))) { rejet('déjà dans le jeu'); continue; }
    const [e] = await entites([c.id]); if (!e) { rejet('entité introuvable'); continue; }
    const coord = valeurs(e, 'P625')[0]; if (!coord || coord.globe !== 'http://www.wikidata.org/entity/Q2') { rejet('pas de coordonnées terrestres'); continue; }
    const a = Math.round(coord.latitude * 1e4) / 1e4, o = Math.round(coord.longitude * 1e4) / 1e4;
    if (existantes.concat(nouvelles).some(d => km(d.a, d.o, a, o) < 1 && norm(d.t).slice(0, 6) === norm(t).slice(0, 6))) { rejet('doublon proche'); continue; }

    const { chaine, pays, mots } = await interdits(e);
    if (!pays.length) { rejet('pas de pays'); continue; }
    for (const w of t.split(/[\s'’\-,]+/)) if (w.length >= 4 && !GENERIQUES.test(norm(w))) mots.add(norm(w)); /* le titre est caché en difficile */

    const desc = e.descriptions && e.descriptions.fr ? e.descriptions.fr.value : '';
    const sousCat = c.cat.classes[c.cls];
    const tete = desc && !parlant(desc, mots) && desc.length <= 120 ? maj(desc) : sousCat;
    const f = (await faits(e, c.cat.faits)).filter(x => !parlant(x, mots) && !norm(tete).includes(norm(x.split(' : ').pop())));
    if (!f.length) { rejet('pas assez de faits pour un indice'); continue; }
    const x = (tete + '. ' + f.join('. ') + '.').replace(/\.\.+$/, '.');

    /* Lieu affiché après la réponse : la commune (ou la première entité administrative) et le nom court du pays. */
    const nomPays = maj((valeurs(pays[0], 'P1813').find(v => v.language === 'fr') || {}).text || etiquette(pays[0]));
    const admins = chaine.map(etiquette).filter(n => n && norm(n) !== norm(nomPays) && norm(n) !== norm(etiquette(pays[0])) && !/^(hôtel de ville|mairie)$/i.test(n)).map(maj);
    const p = [admins[0] || '', nomPays].filter(Boolean).join(', ');
    const localisation = admins.slice(0, 2).concat(nomPays).join(', ');
    const e2 = (desc ? maj(desc) + '. ' : '') + 'Localisation : ' + localisation + '.';
    const n = c.sl >= 90 ? 1 : c.sl >= 50 ? 2 : 3;
    const iso = valeurs(pays[0], 'P299')[0];
    const d = { n, t, c: sousCat, x, e: e2, p, a, o, id: c.id };
    if (iso) d.iso = iso;
    if (t !== c.titre) d.w = c.titre;
    nouvelles.push(Object.assign({ h: c.cat.h, k: c.cat.k }, d));
    titres.add(norm(t));
    if (nouvelles.length % 100 === 0) console.log(nouvelles.length + ' questions…');
  }
  console.log('Nouvelles questions : ' + nouvelles.length + ' ; écartées : ' + JSON.stringify(rejets));

  /* 3. On réécrit le fichier : anciennes questions d'abord (inchangées), puis les nouvelles, par thème. */
  const toutes = [...anciennes, ...nouvelles];
  const champ = v => typeof v === 'number' ? String(v) : JSON.stringify(v);
  const ligne = d => '{' + ['n', 't', 'w', 'c', 'x', 'e', 'p', 'a', 'o', 'id', 'iso'].filter(k => d[k] !== undefined).map(k => k + ':' + champ(d[k])).join(',') + '},';
  let out = `/* Questions tirées automatiquement de Wikidata par outils/wikidata.js : ne pas modifier à la main
   (une question ratée se retire en ajoutant son identifiant Q… à outils/wikidata-exclus.txt, puis en relançant le script).
   Même format que questions.js ; chargé juste après lui. */\n`;
  const groupes = {};
  for (const d of toutes) if (!exclus.has(d.id)) (groupes[d.h + '|' + d.k] = groupes[d.h + '|' + d.k] || []).push(d);
  for (const [cle, l] of Object.entries(groupes)) {
    const [h, k] = cle.split('|');
    out += `\najouter('${h}', '${k}', [\n` + l.map(ligne).join('\n') + '\n]);\n';
  }
  fs.writeFileSync(SORTIE, out);
  console.log('Écrit : ' + path.relative(RACINE, SORTIE) + ' (' + toutes.length + ' questions)');
  console.log('\nExemples :');
  for (const d of nouvelles.filter((_, i) => i % Math.max(1, Math.floor(nouvelles.length / 40)) === 0).slice(0, 40)) console.log('- [' + d.h + ' n' + d.n + '] ' + d.t + ' | ' + d.x + ' | ' + d.p);
}

main().catch(e => { console.error(e); process.exit(1); });
