/* =====================================================================
   Base de questions de Wikiguessr
   =====================================================================
   Chaque manche est une entrée de cette liste : le joueur lit l'indice,
   puis place sur le globe le lieu demandé (le lieu lui-même, un lieu de
   naissance, le lieu d'un événement…).

   AJOUTER UNE QUESTION
   Copier une ligne dans le bloc du thème voulu et la modifier :
     k : type de manche, si différent de celui du bloc (voir TYPES).
         Pour une personne, préférer « vie » (avec q) quand le lieu de
         naissance est anecdotique : lieu de sa mort, de son exploit…
     t : titre affiché (de préférence le titre de l'article Wikipédia)
     m : titre affiché pendant la manche, si t nomme le pays ou une grande
         ville de la réponse : une courte description qui ne donne pas le
         lieu (« Cathédrale gothique incendiée en 2019 »). t s'affiche
         après la réponse.
     w : titre exact de l'article Wikipédia, s'il diffère de t
         (sert à la photo et au lien « Lire l'article »)
     c : sous-catégorie affichée (Peinture, Football, Président…)
     q : ce qu'il faut placer, si différent du libellé du type
     x : indice affiché pendant la manche. Il ne doit jamais contenir
         le nom du lieu à trouver.
     e : courte explication affichée après la réponse (facultatif)
     p : lieu affiché après la réponse
     a, o : latitude et longitude du lieu (degrés décimaux)

   AJOUTER UN THÈME
   Ajouter une ligne dans THEMES (nom, couleur), puis un bloc ajouter().
   Le thème apparaît alors tout seul dans le menu de l'accueil.

   QUESTIONS AUTOMATIQUES
   questions-wikidata.js est rempli par outils/wikidata.js (voir ce fichier)
   et contrôlé par outils/valider-wikidata.js : ne pas le modifier à la main.

   VÉRIFIER
   node outils/verifier-questions.js  (doublons, champs manquants,
   indice qui contient la réponse, nombre de questions par thème)
   ===================================================================== */

/* Thèmes proposés dans le menu de l'accueil, dans cet ordre. La couleur sert aux points du globe d'accueil. */
const THEMES = {
  lieux:     { nom: 'Lieux',       long: 'Lieux emblématiques',    couleur: '#ffb547' },
  celeb:     { nom: 'Célébrités',  long: 'Célébrités',             couleur: '#ff6f9c' },
  sport:     { nom: 'Sport',       long: 'Sport',                  couleur: '#5ec8ff' },
  politique: { nom: 'Politique',   long: 'Politique',              couleur: '#a99bff' },
  histoire:  { nom: 'Histoire',    long: 'Histoire',               couleur: '#ff8f5a' },
  crime:     { nom: 'Criminels',   long: 'Criminels célèbres',     couleur: '#ff5c6c' },
  culture:   { nom: 'Culture',     long: 'Culture et patrimoine',  couleur: '#f4e06d' },
  evt:       { nom: 'Événements',  long: 'Événements historiques', couleur: '#e9eef2' },
  science:   { nom: 'Sciences',    long: 'Sciences et inventions', couleur: '#4fe0c2' },
  pop:       { nom: 'Pop culture', long: 'Culture populaire',      couleur: '#a8ec5a' }
};

/* Types de manche : ce qu'il faut placer (affiché dans la pastille) et le préfixe de la réponse. */
const TYPES = {
  lieu:   { quoi: '',                                rep: '' },
  perso:  { quoi: 'lieu de naissance',               rep: 'Né(e) à ' },
  evt:    { quoi: 'lieu de l’événement',             rep: '' },
  oeuvre: { quoi: 'lieu où l’œuvre est exposée',     rep: '' },
  recit:  { quoi: 'lieu où se déroule l’histoire',   rep: '' },
  vie:    { quoi: 'lieu lié à sa vie',               rep: '' }  /* une personne, mais un autre lieu que sa naissance : préciser q */
};

const QUESTIONS = [];
function ajouter(h, k, liste) {
  liste.forEach(d => QUESTIONS.push(Object.assign({ h, k }, d)));
}

/* ---- Lieux emblématiques : monuments, sites historiques, lieux religieux, merveilles du patrimoine (on place le lieu) ---- */
ajouter('lieux', 'lieu', [
]);

/* ---- Célébrités : acteurs, chanteurs, artistes, écrivains ---- */
ajouter('celeb', 'perso', [
]);

/* ---- Sport : un mélange de sportifs (lieu marquant de leur carrière), de lieux sportifs et de grands moments ---- */
ajouter('sport', 'perso', [
]);

/* ---- Politique : présidents, Premiers ministres, chefs d'État, militants ---- */
ajouter('politique', 'perso', [
]);

/* ---- Histoire : rois, reines, empereurs, explorateurs, révolutionnaires, militaires ---- */
ajouter('histoire', 'perso', [
]);

/* ---- Criminels célèbres : gangsters, escrocs, pirates, grandes affaires (présentés de façon factuelle) ---- */
ajouter('crime', 'perso', [
]);

/* ---- Culture et patrimoine : œuvres d'art, fêtes et traditions, mythes, littérature ---- */
ajouter('culture', 'oeuvre', [
]);

/* ---- Événements historiques : guerres, révolutions, catastrophes, tournants politiques ---- */
ajouter('evt', 'evt', [
]);

/* ---- Sciences et inventions : savants, inventeurs, découvertes ---- */
ajouter('science', 'perso', [
]);

/* ---- Culture populaire : fiction, cinéma, séries, jeux vidéo, bande dessinée ---- */
ajouter('pop', 'recit', [
]);

