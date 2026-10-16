// Titre affiché pendant la manche (champ m des questions) : le nom du pays ou d'une grande ville où se trouve la réponse
// y est remplacé par « … », sinon le titre donnerait la réponse (« Observatoire de Paris » devient « Observatoire de … »).
// Le vrai titre s'affiche après la réponse. Utilisé par outils/wikidata.js.
const sansAccent = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const VIDES = new Set(['des', 'les', 'sur', 'aux', 'dans', 'pour', 'une', 'the', 'and', 'del', 'der', 'grand', 'grande', 'mont', 'lac', 'ile', 'iles', 'baie', 'golfe', 'mer', 'cap', 'fleuve', 'chutes', 'plage', 'desert', 'foret']);

/* Renvoie le titre avec les noms cachés, ou null s'il n'y a rien à cacher.
   Un titre qui n'est que le lieu (« Monaco », « Madagascar ») reste tel quel : la question est justement de le placer. */
function masquer(titre, noms) {
  let n = ''; const pos = [];
  for (let i = 0; i < titre.length; i++) for (const c of sansAccent(titre[i])) { n += c; pos.push(i); }
  const morceaux = [];
  const liste = [...new Set(noms.filter(Boolean).map(x => sansAccent(x).trim()))].filter(x => x.length >= 3).sort((a, b) => b.length - a.length);
  for (const nom of liste) {
    for (let k = n.indexOf(nom); k >= 0; k = n.indexOf(nom, k + 1)) {
      const fin = k + nom.length;
      if (/[a-z0-9]/.test(n[k - 1] || '') || /[a-z0-9]/.test(n[fin] || '')) continue;
      const d = pos[k], f = pos[fin - 1] + 1;
      if (!morceaux.some(([x, y]) => d < y && f > x)) morceaux.push([d, f]);
    }
  }
  if (!morceaux.length) return null;
  let m = titre;
  for (const [d, f] of morceaux.sort((x, y) => y[0] - x[0])) m = m.slice(0, d) + '…' + m.slice(f);
  const reste = sansAccent(m).split(/[^a-z0-9]+/).filter(w => w.length >= 3 && !VIDES.has(w));
  return reste.length ? m : null;
}

module.exports = { masquer };
