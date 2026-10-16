// Un titre qui nomme le pays ou une grande ville de la réponse la donne (« Observatoire de Paris ») :
// ces questions ont un champ m, une courte description affichée pendant la manche à la place du titre.
// outils/wikidata.js écarte ces sujets plutôt que d'écrire une description automatique.
const sansAccent = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const VIDES = new Set(['des', 'les', 'sur', 'aux', 'dans', 'pour', 'une', 'the', 'and', 'del', 'der', 'grand', 'grande', 'mont', 'lac', 'ile', 'iles', 'baie', 'golfe', 'mer', 'cap', 'fleuve', 'chutes', 'plage', 'desert', 'foret']);

/* Vrai si le titre contient l'un des noms (en mot entier, sans tenir compte des accents).
   Un titre qui n'est que le lieu (« Monaco », « Lac Malawi ») ne compte pas : la question est justement de le placer. */
function nommeLieu(titre, noms) {
  let reste = ' ' + sansAccent(titre) + ' ', trouve = false;
  const liste = [...new Set(noms.filter(Boolean).map(x => sansAccent(x).trim()))].filter(x => x.length >= 3).sort((a, b) => b.length - a.length);
  for (const nom of liste) {
    const re = new RegExp('(^|[^a-z0-9])' + nom.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(?=$|[^a-z0-9])', 'g');
    if (re.test(reste)) { trouve = true; reste = reste.replace(re, '$1 '); }
  }
  return trouve && reste.split(/[^a-z0-9]+/).some(w => w.length >= 3 && !VIDES.has(w));
}

module.exports = { nommeLieu };
