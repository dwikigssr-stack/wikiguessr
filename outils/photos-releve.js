// Relevé temporaire : télécharge la miniature Wikipédia de chaque question pour la relire à l'œil.
const fs = require('fs'), path = require('path'), vm = require('vm');
const RACINE = path.join(__dirname, '..'), DOSSIER = path.join(RACINE, 'photos-tmp');
const UA = 'Wikiguessr/1.0 (https://github.com/dwikigssr-stack/wikiguessr; jeu de géographie)';
const ctx = {}; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(RACINE, 'questions.js'), 'utf8') + ';' + fs.readFileSync(path.join(RACINE, 'questions-wikidata.js'), 'utf8') + ';this.Q=QUESTIONS', ctx);
const pause = ms => new Promise(r => setTimeout(r, ms));
async function demander(url, opts = {}) {
  for (let i = 0; ; i++) {
    const r = await fetch(url, { ...opts, headers: { 'User-Agent': UA, ...(opts.headers || {}) } }).catch(e => ({ ok: false, status: 0 }));
    if (r.ok) return r;
    if (i >= 3) throw new Error(r.status + ' ' + url.slice(0, 100));
    await pause(4000 * (i + 1));
  }
}
(async () => {
  const qs = ctx.Q.map((q, i) => ({ i, cle: q.id || q.t, titre: (q.w || q.t).replace(/_/g, ' '), k: q.k, h: q.h, t: q.t }));
  const parTitre = new Map();
  const titres = [...new Set(qs.map(q => q.titre))];
  for (let i = 0; i < titres.length; i += 50) {
    const lot = titres.slice(i, i + 50);
    const j = await (await demander('https://fr.wikipedia.org/w/api.php', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ action: 'query', prop: 'pageimages', piprop: 'thumbnail|name', pithumbsize: '330', redirects: '1', titles: lot.join('|'), format: 'json', formatversion: '2' }) })).json();
    const vers = new Map(lot.map(t => [t, t]));
    for (const n of j.query.normalized || []) vers.set(n.from, n.to);
    const red = new Map((j.query.redirects || []).map(r => [r.from, r.to]));
    const pages = new Map(j.query.pages.map(p => [p.title, p]));
    for (const t of lot) { let x = vers.get(t); x = red.get(x) || x; const p = pages.get(x); if (p && p.thumbnail) parTitre.set(t, { url: p.thumbnail.source, fichier: p.pageimage }); }
    await pause(300);
  }
  const sortie = [];
  let n = 0;
  const file = qs.filter(q => parTitre.has(q.titre));
  async function ouvrier() {
    while (file.length) {
      const q = file.shift(), im = parTitre.get(q.titre);
      try {
        const buf = Buffer.from(await (await demander(im.url)).arrayBuffer());
        fs.writeFileSync(path.join(DOSSIER, q.i + '.jpg'), buf);
        sortie.push({ ...q, ...im });
        if (++n % 100 === 0) console.log(n + ' miniatures');
      } catch (e) { console.log('Échec ' + q.t + ' : ' + e.message); }
      await pause(150);
    }
  }
  await Promise.all([ouvrier(), ouvrier(), ouvrier()]);
  sortie.sort((a, b) => a.i - b.i);
  fs.writeFileSync(path.join(DOSSIER, 'manifeste.json'), JSON.stringify(sortie, null, 1));
  console.log(sortie.length + ' miniatures sur ' + qs.length + ' questions');
})();
