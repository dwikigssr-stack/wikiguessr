/* =====================================================================
   Menu principal de Wikiguessr : modes de jeu et sujets
   =====================================================================
   Le menu se construit tout seul à partir de ces deux listes (dans cet
   ordre). Rien d'autre à toucher pour ajouter un mode ou un sujet.

   AJOUTER UN SUJET
   Copier un bloc de MENU_SUJETS et le modifier :
     id     : identifiant court, unique
     nom    : nom affiché sur la tuile
     sous   : sous-catégories, affichées en petit sous le nom
     f      : couleur de la tuile (aplat), identique en clair et en sombre
     ink    : couleur du texte et du dessin sur la tuile (contraste ≥ 4.5:1)
     themes : thèmes de questions.js regroupés dans ce sujet (chaque thème
              n'appartient qu'à un seul sujet) ; null = tous les thèmes
     large  : true pour une tuile en pleine largeur
     dessin : contenu SVG du dessin (viewBox 0 0 120 120), décoratif

   AJOUTER UN MODE
   Copier un bloc de MENU_MODES :
     id, nom, aide (texte sous le nom), bouton (libellé du bouton d'action)
     jeu : réglages transmis au moteur de jeu
       joueurs : 1 en solo, 'duel' pour le nombre de joueurs choisi dans
                 les réglages (2 ou 3, sur le même appareil)
       chrono  : true = temps par manche choisi dans les réglages, 0 = sans
       manches : nombre de questions
   ===================================================================== */

const MENU_MODES = [
  { id: 'chrono', nom: 'Contre-la-montre', aide: '10 questions, un chrono. En solo.', bouton: 'Lancer la partie',
    jeu: { joueurs: 1, chrono: true, manches: 10 } },
  { id: 'duel', nom: 'Duel', aide: 'Mêmes questions pour deux. Le plus rapide marque.', bouton: 'Trouver un adversaire',
    jeu: { joueurs: 'duel', chrono: true, manches: 10 } },
  { id: 'training', nom: 'Training', aide: 'Sans chrono, sans limite. Pour s’entraîner.', bouton: 'Commencer l’entraînement',
    jeu: { joueurs: 1, chrono: 0, manches: 10 } }
];

const MENU_SUJETS = [
  { id: 'sport', nom: 'Sport', sous: 'Grands moments, football, tennis, Jeux olympiques', f: '#2F6BFF', ink: '#FFFFFF',
    themes: ['sport'],
    dessin: '<path d="M4 40h16M0 60h14M6 80h16" stroke="#0B1F66" stroke-width="5" stroke-linecap="round"/><circle cx="70" cy="60" r="42" fill="#fff"/><polygon points="70,46 83.3,55.7 78.2,71.3 61.8,71.3 56.7,55.7" fill="#0B1F66"/><path d="M70 46V30M83.3 55.7l15-5M78.2 71.3l9 13M61.8 71.3l-9 13M56.7 55.7l-15-5" stroke="#0B1F66" stroke-width="4" stroke-linecap="round"/><circle cx="70" cy="60" r="42" fill="none" stroke="#0B1F66" stroke-width="5"/>' },
  { id: 'histoire', nom: 'Histoire', sous: 'Personnages, événements', f: '#19D48B', ink: '#00291B',
    themes: ['histoire', 'evt', 'crime'],
    dessin: '<path d="M8 46L60 12l52 34z" fill="#00291B"/><rect x="14" y="48" width="92" height="9" fill="#fff"/><rect x="20" y="60" width="12" height="38" fill="#fff"/><rect x="42" y="60" width="12" height="38" fill="#fff"/><rect x="66" y="60" width="12" height="38" fill="#fff"/><rect x="88" y="60" width="12" height="38" fill="#fff"/><rect x="8" y="100" width="104" height="11" fill="#00291B"/><circle cx="60" cy="34" r="6" fill="#FFB400"/>' },
  { id: 'pop', nom: 'Pop culture', sous: 'Artistes, événements', f: '#FF4D94', ink: '#3A0020',
    themes: ['pop'],
    dessin: '<rect x="44" y="8" width="32" height="56" rx="16" fill="#fff"/><path d="M46 26h28M46 38h28M46 50h28" stroke="#3A0020" stroke-width="4"/><path d="M30 50a30 30 0 0 0 60 0" fill="none" stroke="#3A0020" stroke-width="7" stroke-linecap="round"/><rect x="56" y="80" width="8" height="18" fill="#3A0020"/><rect x="36" y="98" width="48" height="10" rx="5" fill="#3A0020"/><path d="M100 14l4 10 10 4-10 4-4 10-4-10-10-4 10-4z" fill="#FFE14D"/><path d="M16 28l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" fill="#FFE14D"/>' },
  { id: 'culture', nom: 'Culture générale', sous: 'Personnalités, politique, lieux', f: '#FFC400', ink: '#2B1A00',
    themes: ['lieux', 'celeb', 'politique', 'culture', 'science'],
    dessin: '<circle cx="56" cy="64" r="42" fill="#fff"/><ellipse cx="56" cy="64" rx="17" ry="42" fill="none" stroke="#5C3A00" stroke-width="5"/><path d="M14 64h84M22 40h68M22 88h68" stroke="#5C3A00" stroke-width="5" stroke-linecap="round"/><circle cx="56" cy="64" r="42" fill="none" stroke="#5C3A00" stroke-width="5"/><circle cx="96" cy="26" r="20" fill="#2B1A00"/><path d="M89 21a7 7 0 1 1 10 6c-2 1-3 2-3 5" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/><circle cx="96" cy="39" r="3" fill="#fff"/>' },
  { id: 'mixte', nom: 'Tout mélanger', sous: 'Les quatre sujets dans une seule partie', f: '#2B2B2A', ink: '#FFFFFF',
    themes: null, large: true,
    dessin: '<rect x="14" y="14" width="92" height="92" rx="20" fill="#fff"/><circle cx="40" cy="40" r="8" fill="#2B2B2A"/><circle cx="80" cy="40" r="8" fill="#2B2B2A"/><circle cx="60" cy="60" r="8" fill="#2B2B2A"/><circle cx="40" cy="80" r="8" fill="#2B2B2A"/><circle cx="80" cy="80" r="8" fill="#2B2B2A"/>' }
];

/* Sélection au premier lancement. */
const MENU_DEFAUT = { mode: 'chrono', sujet: 'culture' };
