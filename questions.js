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

/* ---- Sport : les lieux sportifs mythiques (on place le lieu) ---- */
ajouter('sport', 'lieu', [
/* Football : France */
{t:"Orange Vélodrome",w:"Stade Vélodrome",c:"Football",x:"Stade de football d'un grand port méditerranéen, rénové pour l'Euro 2016, domicile d'un club bleu ciel et blanc, seul club français vainqueur de la Ligue des champions.",e:"Il se trouve sur le boulevard Michelet, dans le 8e arrondissement, au sud de Marseille ; c'est le stade de l'Olympique de Marseille, l'OM.",p:"Marseille, France",a:43.2698,o:5.3959},
{t:"Parc des Princes",c:"Football",x:"Stade en béton à l'architecture en anneau ouvert sur la ville, au pied du périphérique, domicile d'un club rouge et bleu vainqueur de la Ligue des champions 2025.",e:"Il se trouve dans le 16e arrondissement de Paris, à la porte de Saint-Cloud, tout près de Boulogne-Billancourt ; c'est le stade du Paris Saint-Germain.",p:"Paris, France",a:48.8414,o:2.253},
{t:"Groupama Stadium",c:"Football",x:"Stade de 59 000 places ouvert en 2016 en périphérie d'une grande ville, domicile du club aux sept titres de champion de France d'affilée (2002-2008).",e:"Il se trouve à Décines-Charpieu, dans l'est de la métropole de Lyon ; c'est le stade de l'Olympique lyonnais, qui a quitté Gerland pour s'y installer.",p:"Décines-Charpieu (Lyon), France",a:45.7653,o:4.9819},
{t:"Stade Bollaert-Delelis",c:"Football",x:"Stade de football d'une ancienne ville minière, bâti dans les années 1930 par des mineurs, où 38 000 supporters en « sang et or » chantent « Les Corons » à chaque mi-temps.",e:"Il se trouve à Lens, dans le Pas-de-Calais, au cœur de l'ancien bassin minier du Nord ; le stade compte plus de places que la ville n'a d'habitants.",p:"Lens, France",a:50.4329,o:2.8149},
{t:"Stade Pierre-Mauroy",c:"Football",x:"Stade à toit rétractable ouvert en 2012, nommé d'après un ancien Premier ministre et maire de la ville, domicile d'un club aux dogues. Sa pelouse peut se relever pour laisser place à une salle de 27 000 places.",e:"Il se trouve à Villeneuve-d'Ascq, dans la métropole de Lille ; c'est le stade du LOSC, et il a accueilli des finales de Coupe Davis en tennis (2014, 2017) et de basket aux Jeux de 2024.",p:"Villeneuve-d'Ascq (Lille), France",a:50.6119,o:3.1305},
{t:"Stade de la Meinau",c:"Football",x:"Stade d'un club bleu et blanc d'une ville frontalière siège du Parlement européen, réputé pour l'une des ambiances les plus chaudes de France.",e:"Il se trouve dans le quartier de la Meinau, au sud de Strasbourg, en Alsace ; c'est le stade du RC Strasbourg Alsace.",p:"Strasbourg, France",a:48.56,o:7.755},
{t:"Stade Geoffroy-Guichard",c:"Football",x:"Stade surnommé « le Chaudron », domicile d'un club vert dix fois champion de France, finaliste de la Coupe des clubs champions 1976 contre le Bayern.",e:"Il se trouve dans le quartier de Marais, au nord-est de Saint-Étienne, dans la Loire ; il porte le nom du fondateur des magasins Casino.",p:"Saint-Étienne, France",a:45.4608,o:4.3903},
{t:"Stade du Roudourou",c:"Football",x:"Stade de 18 000 places d'une petite ville bretonne de 7 000 habitants, domicile d'un club rouge et noir vainqueur de la Coupe de France en 2009 et 2014.",e:"Il se trouve à Guingamp, dans les Côtes-d'Armor ; c'est le stade de l'En Avant Guingamp, l'un des plus petits clubs à avoir joué en Ligue 1.",p:"Guingamp, France",a:48.5663,o:-3.1638},
{t:"Stade de la Beaujoire",c:"Football",x:"Stade au bord d'une rivière, ouvert pour l'Euro 1984, domicile d'un club jaune et vert célèbre pour son « jeu à la nantaise ».",e:"Il se trouve dans le nord-est de Nantes, au bord de l'Erdre ; il a aussi accueilli des matchs des Coupes du monde de football 1998 et de rugby 2007 et 2023.",p:"Nantes, France",a:47.256,o:-1.5247},
{t:"Stade Louis-II",c:"Football",x:"Stade bâti en partie sur des terres gagnées sur la mer, au pied d'un rocher, qui a longtemps accueilli la Supercoupe d'Europe chaque été.",e:"Il se trouve dans le quartier de Fontvieille, à Monaco ; c'est le stade de l'AS Monaco, finaliste de la Ligue des champions en 2004.",p:"Monaco",a:43.7275,o:7.4156},
{t:"Stade de la Mosson",c:"Football",x:"Stade au bord d'une petite rivière, domicile d'un club orange et bleu sacré champion de France en 2012 à la surprise générale, sous la présidence de Louis Nicollin.",e:"Il se trouve dans le quartier de la Paillade, au nord-ouest de Montpellier, dans l'Hérault ; c'est le stade du Montpellier HSC.",p:"Montpellier, France",a:43.6222,o:3.8119},
{t:"Stade Auguste-Bonal",c:"Football",x:"Stade d'un club jaune et bleu fondé en 1928 par une famille d'industriels de l'automobile, l'un des premiers clubs professionnels de France.",e:"Il se trouve à Montbéliard, dans le Doubs, tout près de Sochaux et des usines Peugeot ; c'est le stade du FC Sochaux-Montbéliard.",p:"Montbéliard, France",a:47.5122,o:6.8114},
{t:"Stade Saint-Symphorien",c:"Football",x:"Stade au bord de la Moselle, domicile d'un club grenat de Lorraine, dont la tribune sud porte le nom d'un ancien entraîneur, Carlo Molinari.",e:"Il se trouve sur l'île Saint-Symphorien, à Longeville-lès-Metz, juste à l'ouest du centre de Metz ; c'est le stade du FC Metz.",p:"Longeville-lès-Metz (Metz), France",a:49.1097,o:6.1594},
/* Football : Angleterre */
{t:"Old Trafford",c:"Football",x:"Surnommé « le Théâtre des rêves », plus grand stade de club de football de son pays, domicile d'un club aux maillots rouges.",e:"Il se trouve dans le borough de Trafford, au sud-ouest du centre de Manchester, près du canal maritime ; c'est le stade de Manchester United.",p:"Manchester, Royaume-Uni",a:53.4631,o:-2.2914},
{t:"Anfield",c:"Football",x:"Stade de football dont la tribune du Kop est célèbre pour son chant « You'll Never Walk Alone », domicile d'un club aux maillots rouges d'un grand port.",e:"Il se trouve dans le quartier d'Anfield, au nord de Liverpool ; seul le parc Stanley le sépare de Goodison Park, le stade historique du club rival d'Everton.",p:"Liverpool, Royaume-Uni",a:53.4308,o:-2.9608},
{t:"Emirates Stadium",c:"Football",x:"Stade de 60 000 places ouvert en 2006 pour un club aux maillots rouges et blancs surnommé « les Gunners », qui quittait son stade historique d'Highbury.",e:"Il se trouve à Holloway, dans le borough d'Islington, au nord de Londres ; c'est le stade d'Arsenal.",p:"Londres, Royaume-Uni",a:51.5549,o:-0.1084},
{t:"Stamford Bridge",c:"Football",x:"Stade ouvert en 1877 pour l'athlétisme, devenu en 1905 le domicile d'un club aux maillots bleus, double vainqueur de la Ligue des champions.",e:"Il se trouve dans le quartier de Fulham, dans l'ouest de Londres, sur Fulham Road ; c'est le stade de Chelsea.",p:"Londres, Royaume-Uni",a:51.4817,o:-0.191},
{t:"St James' Park",c:"Football",x:"Stade perché sur une colline en plein centre-ville, domicile d'un club aux rayures noires et blanches surnommé « les Magpies ».",e:"Il se trouve au cœur de Newcastle upon Tyne, dans le nord-est de l'Angleterre ; c'est le stade de Newcastle United.",p:"Newcastle upon Tyne, Royaume-Uni",a:54.9756,o:-1.6217},
{t:"Etihad Stadium",w:"Etihad Stadium (Manchester)",c:"Football",x:"Stade construit pour les Jeux du Commonwealth 2002, domicile d'un club bleu ciel, vainqueur de la Ligue des champions en 2023.",e:"Il se trouve à Eastlands, dans l'est de Manchester ; c'est le stade de Manchester City, rival de Manchester United.",p:"Manchester, Royaume-Uni",a:53.4831,o:-2.2004},
{t:"Villa Park",c:"Football",x:"Stade ouvert en 1897, domicile d'un club bordeaux et bleu ciel vainqueur de la Coupe des clubs champions en 1982, dans la deuxième ville du pays.",e:"Il se trouve dans le quartier d'Aston, au nord de Birmingham, dans les Midlands de l'Ouest ; c'est le stade d'Aston Villa.",p:"Birmingham, Royaume-Uni",a:52.5092,o:-1.8848},
/* Football : Espagne */
{t:"Santiago Bernabéu",w:"Stade Santiago-Bernabéu",c:"Football",x:"Stade de football à toit rétractable, nommé d'après un ancien président du club blanc qui y joue, dont les joueurs sont surnommés « les Merengues ».",e:"Il se dresse sur le paseo de la Castellana, la grande avenue nord-sud de Madrid, dans le quartier de Chamartín ; c'est le stade du Real Madrid.",p:"Madrid, Espagne",a:40.4531,o:-3.6884},
{t:"Spotify Camp Nou",w:"Camp Nou",c:"Football",x:"Plus grand stade d'Europe par sa capacité, d'environ 100 000 places, ouvert en 1957 et domicile d'un club aux couleurs bleu et grenat.",e:"Il se trouve dans le quartier des Corts, dans l'ouest de Barcelone, près de l'avenue Diagonale ; il abrite aussi le musée du FC Barcelone.",p:"Barcelone, Espagne",a:41.3809,o:2.1228},
{t:"Riyadh Air Metropolitano",w:"Stade Metropolitano",c:"Football",x:"Stade ouvert en 2017 pour le club rouge et blanc des « Colchoneros », qui a accueilli la finale de la Ligue des champions 2019.",e:"Il se trouve dans le quartier de San Blas-Canillejas, à l'est de Madrid ; c'est le stade de l'Atlético de Madrid.",p:"Madrid, Espagne",a:40.4362,o:-3.5995},
{t:"San Mamés",w:"Stade San Mamés",c:"Football",x:"Stade surnommé « la Cathédrale », domicile d'un club qui ne recrute que des joueurs formés au Pays basque.",e:"Il se trouve au bord de la ria du Nervion, à Bilbao ; le stade actuel, ouvert en 2013, a remplacé l'ancien San Mamés juste à côté. C'est le stade de l'Athletic Club.",p:"Bilbao, Espagne",a:43.2642,o:-2.9494},
{t:"Mestalla",w:"Stade de Mestalla",c:"Football",x:"Plus ancien stade de première division espagnole encore en service, ouvert en 1923, aux tribunes très raides, domicile d'un club à la chauve-souris.",e:"Il se trouve dans le quartier de Mestalla, à Valence, près de l'ancien lit du fleuve Turia ; c'est le stade du Valencia CF.",p:"Valence, Espagne",a:39.4746,o:-0.3583},
{t:"Ramón Sánchez-Pizjuán",w:"Stade Ramón-Sánchez-Pizjuán",c:"Football",x:"Stade où se joua en 1982 la demi-finale de Coupe du monde RFA-France, avec l'agression de Schumacher sur Battiston et les premiers tirs au but de l'histoire du Mondial.",e:"Il se trouve dans le quartier de Nervión, à Séville, en Andalousie ; c'est le stade du Séville FC.",p:"Séville, Espagne",a:37.384,o:-5.9705},
/* Football : Allemagne */
{t:"Signal Iduna Park",c:"Football",x:"Stade qui abrite la plus grande tribune de supporters debout d'Europe, le « Mur jaune », pour environ 25 000 fans.",e:"Ancien Westfalenstadion, il se trouve à Dortmund, dans la Ruhr, en Rhénanie-du-Nord-Westphalie ; c'est le stade du Borussia Dortmund.",p:"Dortmund, Allemagne",a:51.4926,o:7.4519},
{t:"Allianz Arena",c:"Football",x:"Stade à la façade gonflable en coussins translucides qui s'illumine en rouge, ouvert en 2005 pour le club le plus titré de son pays.",e:"Elle se trouve à Fröttmaning, dans le nord de Munich, en Bavière, le long de l'autoroute A9 ; c'est le stade du Bayern Munich.",p:"Munich, Allemagne",a:48.2188,o:11.6247},
{t:"Volksparkstadion",c:"Football",x:"Stade d'un grand port hanséatique, domicile d'un club au losange bleu, blanc et noir vainqueur de la Coupe des clubs champions en 1983, dont l'horloge comptait ses années en première division.",e:"Il se trouve dans le Volkspark, dans le quartier de Bahrenfeld, à l'ouest de Hambourg ; c'est le stade du Hambourg SV.",p:"Hambourg, Allemagne",a:53.5872,o:9.8986},
{t:"Borussia-Park",c:"Football",x:"Stade ouvert en 2004 pour un club vert, blanc et noir surnommé « les Poulains », grand rival du Bayern dans les années 1970.",e:"Il se trouve à Mönchengladbach, en Rhénanie-du-Nord-Westphalie, à l'ouest de Düsseldorf ; c'est le stade du Borussia Mönchengladbach.",p:"Mönchengladbach, Allemagne",a:51.1746,o:6.3855},
{t:"MHPArena",c:"Football",x:"Ancien Neckarstadion, au bord d'une rivière, dans la ville des usines Mercedes et Porsche, domicile d'un club blanc à la bande rouge.",e:"Il se trouve dans le quartier de Bad Cannstatt, à Stuttgart, dans le Bade-Wurtemberg, au bord du Neckar ; c'est le stade du VfB Stuttgart.",p:"Stuttgart, Allemagne",a:48.7922,o:9.232},
{t:"Veltins-Arena",c:"Football",x:"Stade à toit rétractable et pelouse amovible, sortie sur rails pour prendre le soleil, domicile d'un club bleu et blanc d'une ville minière de la Ruhr.",e:"Elle se trouve à Gelsenkirchen, dans la Ruhr, en Rhénanie-du-Nord-Westphalie ; c'est le stade de Schalke 04, qui y a accueilli la finale de la Ligue des champions 2004.",p:"Gelsenkirchen, Allemagne",a:51.5546,o:7.0676},
/* Football : Italie */
{t:"San Siro",w:"Stade Giuseppe-Meazza",c:"Football",x:"Stade de football partagé par deux clubs rivaux, l'un rouge et noir, l'autre bleu et noir, connu pour ses tours cylindriques en béton.",e:"Officiellement stade Giuseppe-Meazza, il se trouve dans le quartier de San Siro, dans l'ouest de Milan, en Lombardie ; il accueille l'AC Milan et l'Inter.",p:"Milan, Italie",a:45.4781,o:9.1240},
{t:"Stadio Olimpico",w:"Stade olympique de Rome",c:"Football",x:"Stade principal des Jeux de 1960 et de la finale du Mondial 1990, partagé par deux clubs rivaux de la ville, l'un jaune et rouge, l'autre bleu ciel.",e:"Il se trouve au Foro Italico, au pied du Monte Mario, dans le nord de Rome, au bord du Tibre ; l'AS Roma et la Lazio y jouent leurs matchs à domicile.",p:"Rome, Italie",a:41.9339,o:12.4547},
{t:"Stade Diego-Armando-Maradona",c:"Football",x:"Stade d'un grand port méditerranéen, longtemps nommé San Paolo, rebaptisé en 2020 en hommage au joueur argentin qui y a apporté deux titres de champion.",e:"Il se trouve dans le quartier de Fuorigrotta, à l'ouest de Naples, en Campanie ; c'est le stade du SSC Napoli, champion d'Italie en 1987, 1990, 2023 et 2025.",p:"Naples, Italie",a:40.8279,o:14.1931},
{t:"Stade Luigi-Ferraris",c:"Football",x:"Stade à l'anglaise ouvert en 1911, l'un des plus anciens d'Italie, partagé par le plus vieux club du pays et son rival « blucerchiato », dans un grand port de la Riviera.",e:"Il se trouve dans le quartier de Marassi, à Gênes, en Ligurie ; il accueille le Genoa et la Sampdoria.",p:"Gênes, Italie",a:44.4164,o:8.9525},
{t:"Stade Artemio-Franchi",c:"Football",x:"Stade en béton dessiné par Pier Luigi Nervi en 1931, avec une tour fine et un escalier hélicoïdal, domicile d'un club violet de la ville de la Renaissance.",e:"Il se trouve dans le quartier de Campo di Marte, à Florence, en Toscane ; c'est le stade de la Fiorentina.",p:"Florence, Italie",a:43.7808,o:11.2822},
{t:"Allianz Stadium",w:"Allianz Stadium (Turin)",c:"Football",x:"Stade ouvert en 2011 pour le club bianconero, le plus titré d'Italie, construit à la place de l'ancien stade delle Alpi.",e:"Il se trouve dans le quartier de Vallette, au nord-ouest de Turin, au pied des Alpes ; c'est le stade de la Juventus.",p:"Turin, Italie",a:45.1096,o:7.6413},
{t:"Stade Renato-Dall'Ara",c:"Football",x:"Stade inauguré en 1927 avec une tour de marathon en brique, domicile d'un club rouge et bleu sept fois champion d'Italie, dans la ville de la plus vieille université d'Europe.",e:"Il se trouve dans le quartier de Costa-Saragozza, à l'ouest du centre de Bologne, en Émilie-Romagne ; c'est le stade du Bologna FC.",p:"Bologne, Italie",a:44.4925,o:11.3097},
/* Football : Portugal, Pays-Bas, Écosse, Turquie */
{t:"Estádio da Luz",c:"Football",x:"Stade d'un club rouge à l'aigle, double champion d'Europe avec Eusébio, reconstruit pour l'Euro 2004 et théâtre de sa finale.",e:"Il se trouve dans le quartier de São Domingos de Benfica, au nord-ouest de Lisbonne ; c'est le stade du Benfica.",p:"Lisbonne, Portugal",a:38.7527,o:-9.1847},
{t:"Estádio do Dragão",w:"Stade du Dragon",c:"Football",x:"Stade ouvert en 2003 pour un club bleu et blanc vainqueur de la Ligue des champions 2004 avec José Mourinho, qui a accueilli le match d'ouverture de l'Euro 2004.",e:"Il se trouve dans le quartier de Campanhã, à l'est de Porto ; c'est le stade du FC Porto.",p:"Porto, Portugal",a:41.1617,o:-8.5836},
{t:"Estádio José Alvalade",w:"Stade José-Alvalade",c:"Football",x:"Stade vert et jaune ouvert en 2003 pour un club au lion, où le jeune Cristiano Ronaldo a été formé, et qui a accueilli la finale de la Coupe UEFA 2005.",e:"Il se trouve dans le quartier de Lumiar, au nord de Lisbonne, à quelques kilomètres du stade du Benfica ; c'est le stade du Sporting CP.",p:"Lisbonne, Portugal",a:38.7612,o:-9.1608},
{t:"Johan Cruyff Arena",c:"Football",x:"Stade à toit rétractable ouvert en 1996, renommé en 2018 en hommage au meneur de jeu du « football total », domicile d'un club quatre fois champion d'Europe.",e:"Il se trouve dans le quartier de Zuidoost, au sud-est d'Amsterdam ; c'est le stade de l'Ajax.",p:"Amsterdam, Pays-Bas",a:52.3143,o:4.9419},
{t:"De Kuip",w:"Stade Feijenoord",c:"Football",x:"Stade surnommé « la Baignoire » pour sa forme, ouvert en 1937, qui a accueilli de nombreuses finales européennes, dont la finale de l'Euro 2000.",e:"Officiellement stade Feijenoord, il se trouve au sud de la Meuse, à Rotterdam, premier port d'Europe ; c'est le stade du Feyenoord.",p:"Rotterdam, Pays-Bas",a:51.8939,o:4.5231},
{t:"Philips Stadion",c:"Football",x:"Stade ouvert en 1910 sur un terrain du géant de l'électronique qui a fondé le club, domicile d'un club rouge et blanc vainqueur de la Coupe des clubs champions en 1988.",e:"Il se trouve en pleine ville, à Eindhoven, dans le Brabant-Septentrional, berceau de l'entreprise Philips ; c'est le stade du PSV.",p:"Eindhoven, Pays-Bas",a:51.4417,o:5.4675},
{t:"Celtic Park",c:"Football",x:"Stade surnommé « Paradise », domicile d'un club aux rayures vertes et blanches, premier club britannique vainqueur de la Coupe des clubs champions en 1967.",e:"Il se trouve dans le quartier de Parkhead, dans l'est de Glasgow, en Écosse ; c'est le stade du Celtic, éternel rival des Rangers.",p:"Glasgow, Royaume-Uni",a:55.8497,o:-4.2055},
{t:"Ibrox Stadium",c:"Football",x:"Stade d'un club aux maillots bleus, rival protestant du Celtic, marqué par deux catastrophes en tribune, en 1902 et en 1971.",e:"Il se trouve dans le quartier d'Ibrox, au sud de la Clyde, à Glasgow, en Écosse ; c'est le stade des Rangers.",p:"Glasgow, Royaume-Uni",a:55.853,o:-4.3093},
{t:"RAMS Park",c:"Football",x:"Stade de 52 000 places ouvert en 2011 pour un club jaune et rouge vainqueur de la Coupe UEFA 2000, réputé pour être l'un des plus bruyants du monde.",e:"Il se trouve à Seyrantepe, sur la rive européenne d'Istanbul, au nord du centre ; c'est le stade de Galatasaray.",p:"Istanbul, Turquie",a:41.1035,o:28.9909},
{t:"Stade Şükrü-Saracoğlu",c:"Football",x:"Stade d'un club jaune et bleu marine, l'un des trois grands de son pays, situé sur la rive asiatique d'une ville à cheval sur deux continents.",e:"Il se trouve dans le quartier de Kadıköy, sur la rive asiatique d'Istanbul ; c'est le stade de Fenerbahçe, qui y a accueilli la finale de la Coupe UEFA 2009.",p:"Istanbul, Turquie",a:40.9877,o:29.0369},
{t:"Tüpraş Stadyumu",c:"Football",x:"Stade ouvert en 2016 au bord du Bosphore, juste à côté d'un palais ottoman, domicile d'un club noir et blanc à l'aigle.",e:"Il se trouve dans le quartier de Beşiktaş, sur la rive européenne d'Istanbul, près du palais de Dolmabahçe ; c'est le stade du Beşiktaş JK.",p:"Istanbul, Turquie",a:41.0394,o:28.9946},
/* Football : anciens stades mythiques */
{t:"Highbury",c:"Football",x:"Ancien stade aux tribunes Art déco, domicile d'un club rouge et blanc de 1913 à 2006, aujourd'hui transformé en appartements autour de l'ancienne pelouse devenue jardin.",e:"Il se trouvait dans le quartier de Highbury, au nord de Londres, à quelques centaines de mètres de l'actuel Emirates Stadium d'Arsenal.",p:"Londres, Royaume-Uni",a:51.5578,o:-0.1029},
{t:"White Hart Lane",c:"Football",x:"Ancien stade d'un club au coq de 1899 à 2017, démoli pour construire juste à côté une enceinte moderne de 62 000 places.",e:"Il se trouvait à Tottenham, au nord de Londres ; le nouveau Tottenham Hotspur Stadium occupe en partie son emplacement.",p:"Londres, Royaume-Uni",a:51.6033,o:-0.0657},
{t:"Stade Vicente-Calderón",c:"Football",x:"Ancien stade d'un club rouge et blanc de 1966 à 2017, célèbre pour son périphérique qui passait sous une tribune, au bord du fleuve de la capitale.",e:"Il se trouvait au bord du Manzanares, dans le sud-ouest de Madrid ; démoli en 2019, il a été remplacé par l'Atlético au Metropolitano.",p:"Madrid, Espagne",a:40.4017,o:-3.7206},
{t:"Stade de Gerland",c:"Football",x:"Stade aux portes monumentales, dessiné par l'architecte Tony Garnier et inauguré en 1926, où un club a remporté sept titres de champion de France d'affilée.",e:"Il se trouve dans le quartier de Gerland, dans le 7e arrondissement de Lyon, au bord du Rhône ; l'OL l'a quitté en 2016 et il accueille aujourd'hui le rugby.",p:"Lyon, France",a:45.7238,o:4.8322},
{t:"Estadio Riazor",w:"Stade Abanca-Riazor",c:"Football",x:"Stade en bord de plage d'un port de Galice, domicile du « Super Depor », champion d'Espagne en 2000 et tombeur du Milan AC en Ligue des champions en 2004.",e:"Il se trouve face à la plage de Riazor, à La Corogne, au nord-ouest de l'Espagne ; c'est le stade du Deportivo La Corogne.",p:"La Corogne, Espagne",a:43.3686,o:-8.4174},
/* Football : stades mythiques internationaux */
{t:"Maracanã",w:"Stade Maracanã",c:"Football",x:"Stade de football géant inauguré pour la Coupe du monde 1950, où l'équipe locale perdit la finale devant près de 200 000 spectateurs. Il a aussi accueilli la finale de 2014.",e:"Officiellement nommé stade Jornalista Mário Filho, il se trouve dans la zone nord de Rio de Janeiro ; c'est le stade de Flamengo et de Fluminense.",p:"Rio de Janeiro, Brésil",a:-22.9122,o:-43.2302},
{t:"La Bombonera",c:"Football",x:"Stade en forme de boîte de chocolats aux tribunes très raides, domicile d'un club bleu et or où a joué Maradona.",e:"Elle se trouve dans le quartier populaire de La Boca, au sud de Buenos Aires, près du port et des maisons colorées du Caminito ; c'est le stade de Boca Juniors.",p:"Buenos Aires, Argentine",a:-34.6356,o:-58.3647},
{t:"Estadio Monumental",w:"Stade Monumental Antonio Vespucio Liberti",c:"Football",x:"Plus grand stade de son pays, domicile d'un club à la bande rouge en diagonale, où la sélection nationale remporta la Coupe du monde 1978.",e:"Il se trouve dans le quartier de Núñez, au nord de Buenos Aires, près du Río de la Plata ; c'est le stade de River Plate, grand rival de Boca Juniors.",p:"Buenos Aires, Argentine",a:-34.5453,o:-58.4498},
{t:"Estadio Azteca",w:"Stade Azteca",c:"Football",x:"Premier stade à avoir accueilli deux finales de Coupe du monde (1970 et 1986), théâtre de la « main de Dieu » de Maradona, à plus de 2 200 mètres d'altitude.",e:"Il se trouve dans le sud de Mexico, le long de la Calzada de Tlalpan ; c'est le stade du Club América et il a accueilli le match d'ouverture du Mondial 2026.",p:"Mexico, Mexique",a:19.3029,o:-99.1505},
{t:"Estadio Centenario",c:"Football",x:"Stade ouvert en 1930 pour la première finale de Coupe du monde de football, remportée par le pays hôte.",e:"Il se trouve dans le parc Batlle, à Montevideo ; son nom célèbre le centenaire de la première Constitution de l'Uruguay, adoptée en 1830.",p:"Montevideo, Uruguay",a:-34.8945,o:-56.1529},
{t:"FNB Stadium (Soccer City)",w:"Soccer City",c:"Football",x:"Stade en forme de calebasse africaine, qui accueillit l'ouverture et la finale du Mondial 2010, domicile d'un club surnommé « Amakhosi ».",e:"Il se trouve près de Soweto, au sud-ouest de Johannesburg ; c'est le stade des Kaizer Chiefs, et on y a rendu hommage à Nelson Mandela après sa mort en 2013.",p:"Johannesburg, Afrique du Sud",a:-26.2348,o:27.9824},
/* Circuits automobiles et moto */
{t:"Circuit de Silverstone",c:"Circuit",x:"Ancien aérodrome militaire de la Seconde Guerre mondiale, qui a accueilli le tout premier Grand Prix du championnat du monde de Formule 1, en 1950.",e:"Il se trouve à la limite du Northamptonshire et du Buckinghamshire, au centre de l'Angleterre, entre Oxford et Northampton ; on y court le Grand Prix de Grande-Bretagne.",p:"Silverstone, Royaume-Uni",a:52.0786,o:-1.0169},
{t:"Nürburgring",c:"Circuit",x:"Circuit de 20 km surnommé « l'Enfer vert » par Jackie Stewart, tracé dans une forêt de moyenne montagne autour d'un château médiéval, où Niki Lauda faillit périr en 1976.",e:"Il se trouve dans le massif de l'Eifel, en Rhénanie-Palatinat, à l'ouest de l'Allemagne, entre Cologne et Coblence.",p:"Nürburg, Allemagne",a:50.3356,o:6.9475},
{t:"Circuit Gilles-Villeneuve",c:"Circuit",x:"Circuit tracé sur une île artificielle au milieu d'un grand fleuve, dont le dernier mur est surnommé « le mur des champions », nommé d'après un pilote Ferrari du pays.",e:"Il se trouve sur l'île Notre-Dame, au milieu du Saint-Laurent, à Montréal, au Québec ; on y court le Grand Prix du Canada.",p:"Montréal, Canada",a:45.5,o:-73.5228},
{t:"Interlagos",w:"Autodromo José Carlos Pace",c:"Circuit",x:"Circuit tourné dans le sens inverse des aiguilles d'une montre, dont le premier virage porte le nom d'un triple champion du monde du pays mort en 1994.",e:"Officiellement autodrome José-Carlos-Pace, il se trouve entre deux lacs de barrage, dans le sud de São Paulo, au Brésil ; on y court le Grand Prix de São Paulo.",p:"São Paulo, Brésil",a:-23.7036,o:-46.6997},
{t:"Circuit Yas Marina",c:"Circuit",x:"Circuit construit sur une île artificielle, avec un hôtel qui enjambe la piste et change de couleur, où se court à la tombée de la nuit le dernier Grand Prix de la saison.",e:"Il se trouve sur l'île de Yas, à Abou Dabi, aux Émirats arabes unis, à côté du parc d'attractions Ferrari World.",p:"Abou Dabi, Émirats arabes unis",a:24.4672,o:54.6031},
{t:"Red Bull Ring",c:"Circuit",x:"Circuit court et vallonné de la Styrie, ancien Österreichring, racheté par un fabricant de boisson énergisante, où se court le Grand Prix d'Autriche.",e:"Il se trouve à Spielberg, dans la vallée de la Mur, en Styrie, au centre de l'Autriche.",p:"Spielberg, Autriche",a:47.2197,o:14.7647},
{t:"Circuit de Phillip Island",c:"Circuit",x:"Circuit de moto surplombant les falaises d'une île de l'océan Austral, réputé pour son vent, ses mouettes et ses manchots pygmées.",e:"Il se trouve sur l'île de Phillip, à l'entrée de la baie de Western Port, à environ 140 km au sud-est de Melbourne, en Australie ; on y court le Grand Prix d'Australie de moto.",p:"Phillip Island, Australie",a:-38.5047,o:145.2311},
{t:"Circuit du Mugello",c:"Circuit",x:"Circuit vallonné de Toscane appartenant à Ferrari, temple du MotoGP où Valentino Rossi a gagné sept fois de suite, de 2002 à 2008.",e:"Il se trouve à Scarperia e San Piero, dans la vallée du Mugello, au nord de Florence, en Italie.",p:"Scarperia, Italie",a:43.9975,o:11.3719},
{t:"Circuit Ricardo Tormo",c:"Circuit",x:"Circuit en forme de stade, entouré de tribunes qui offrent une vue sur presque toute la piste, où se court souvent la dernière manche de la saison de MotoGP.",e:"Il se trouve à Cheste, à une trentaine de kilomètres à l'ouest de Valence, en Espagne ; il porte le nom d'un double champion du monde de moto valencien.",p:"Cheste, Espagne",a:39.4861,o:-0.6297},
/* Tennis */
{t:"Stade Roland-Garros",c:"Tennis",x:"Stade de tennis où se joue chaque printemps un tournoi du Grand Chelem sur terre battue, nommé d'après un aviateur pionnier.",e:"Il se trouve dans le 16e arrondissement de Paris, porte d'Auteuil, en bordure du bois de Boulogne, à deux pas du Parc des Princes.",p:"Paris, France",a:48.8463,o:2.2494},
{t:"Caja Mágica",c:"Tennis",x:"Salle de tennis en forme de boîte aux toits mobiles, surnommée « la Boîte magique », ouverte en 2009 pour un tournoi Masters 1000 sur terre battue.",e:"Elle se trouve au bord du Manzanares, dans le quartier de San Fermín, au sud de Madrid ; on y joue le Masters de Madrid.",p:"Madrid, Espagne",a:40.3694,o:-3.6853},
{t:"O2 Arena",w:"The O2 Arena",c:"Tennis",x:"Salle de 20 000 places installée sous un immense dôme blanc hérissé de mâts jaunes, construit pour fêter l'an 2000, qui a accueilli le Masters de tennis de fin d'année de 2009 à 2020.",e:"Elle se trouve sous le Millennium Dome, sur la péninsule de Greenwich, au bord de la Tamise, dans l'est de Londres.",p:"Londres, Royaume-Uni",a:51.503,o:0.0032},
/* Cyclisme */
{t:"Alpe d'Huez",c:"Cyclisme",x:"Montée de 13,8 km et 21 virages numérotés, chacun portant le nom d'un vainqueur d'étape, devenue la plus célèbre ascension du Tour de France depuis 1952.",e:"La station se trouve dans le massif des Grandes Rousses, en Isère, au-dessus du Bourg-d'Oisans, à l'est de Grenoble.",p:"Isère, France",a:45.092,o:6.07},
{t:"Mont Ventoux",c:"Cyclisme",x:"Sommet pelé surnommé « le Géant de Provence », battu par le mistral, où le Britannique Tom Simpson s'est effondré et est mort pendant le Tour de France 1967.",e:"Il culmine à 1 910 mètres dans le Vaucluse, au nord-est d'Avignon, au-dessus de Bédoin et de Malaucène.",p:"Vaucluse, France",a:44.1739,o:5.2786},
{t:"Col du Tourmalet",c:"Cyclisme",x:"Col pyrénéen à 2 115 mètres, le plus souvent franchi par le Tour de France depuis 1910, où une statue de géant de fer rend hommage au premier coureur à l'avoir passé.",e:"Il relie Barèges à La Mongie, dans les Hautes-Pyrénées, au pied du pic du Midi de Bigorre.",p:"Hautes-Pyrénées, France",a:42.9089,o:0.145},
{t:"Oude Kwaremont",c:"Cyclisme",x:"Côte pavée de 2,2 km des Ardennes flamandes, l'un des juges de paix du Tour des Flandres, monumentale classique de printemps.",e:"Elle grimpe au-dessus du village de Kwaremont, dans la commune de Kluisbergen, en Flandre-Orientale, en Belgique, près de la frontière wallonne.",p:"Kluisbergen, Belgique",a:50.778,o:3.617},
{t:"Col du Galibier",c:"Cyclisme",x:"Col alpin à 2 642 mètres, l'un des plus hauts franchis par le Tour de France, où un monument rend hommage au créateur de la course, Henri Desgrange.",e:"Il relie la Maurienne (Savoie) au col du Lautaret (Hautes-Alpes), dans le massif des Cerces, en France.",p:"Savoie, France",a:45.0642,o:6.4078},
{t:"Col du Stelvio",c:"Cyclisme",x:"Col à 2 757 mètres et 48 lacets numérotés sur un seul versant, sommet récurrent du Tour d'Italie, près de la frontière suisse.",e:"Il se trouve dans les Alpes italiennes, entre la Valteline (Lombardie) et le Haut-Adige, dans le parc national du Stelvio.",p:"Lombardie, Italie",a:46.5286,o:10.4531},
{t:"Montjuïc",c:"Cyclisme",x:"Colline dominant un grand port méditerranéen, dont la montée a accueilli les Championnats du monde de cyclisme sur route 1973, gagnés par Felice Gimondi devant Eddy Merckx.",e:"La colline de Montjuïc domine le port de Barcelone ; elle porte aussi le stade olympique des Jeux de 1992.",p:"Barcelone, Espagne",a:41.364,o:2.1586},
/* Rugby */
{t:"Principality Stadium",w:"Millennium Stadium",c:"Rugby",x:"Stade de rugby à toit rétractable ouvert en 1999, installé en plein centre-ville au bord d'une rivière, dans la capitale d'une nation du Royaume-Uni.",e:"Ancien Millennium Stadium, il est le stade de l'équipe galloise de rugby, au cœur de Cardiff, à deux pas de la gare centrale.",p:"Cardiff, Royaume-Uni",a:51.4782,o:-3.1826},
{t:"Aviva Stadium",c:"Rugby",x:"Stade à la façade transparente ondulée, ouvert en 2010 à l'emplacement de Lansdowne Road, le plus vieux stade de rugby international du monde.",e:"Il se trouve dans le quartier de Ballsbridge, au sud-est de Dublin, en Irlande ; il accueille les équipes irlandaises de rugby et de football.",p:"Dublin, Irlande",a:53.3352,o:-6.2285},
{t:"Murrayfield",w:"Murrayfield Stadium",c:"Rugby",x:"Plus grand stade d'Écosse, ouvert en 1925 pour le rugby, où le XV du Chardon reçoit ses adversaires au son des cornemuses.",e:"Il se trouve dans l'ouest d'Édimbourg, la capitale de l'Écosse, au Royaume-Uni.",p:"Édimbourg, Royaume-Uni",a:55.9422,o:-3.2409},
{t:"Ellis Park",w:"Ellis Park Stadium",c:"Rugby",x:"Stade de la finale de la Coupe du monde de rugby 1995, où Nelson Mandela, en maillot vert, remit le trophée au capitaine des Springboks.",e:"Il se trouve dans le quartier de Doornfontein, à l'est du centre de Johannesburg, en Afrique du Sud.",p:"Johannesburg, Afrique du Sud",a:-26.1975,o:28.0608},
{t:"Eden Park",c:"Rugby",x:"Stade de rugby et de cricket où les All Blacks restent invaincus depuis 1994, théâtre des finales des Coupes du monde de rugby 1987 et 2011, gagnées contre la France.",e:"Il se trouve dans le quartier de Kingsland, à Auckland, sur l'île du Nord de la Nouvelle-Zélande.",p:"Auckland, Nouvelle-Zélande",a:-36.875,o:174.7447},
{t:"Stade Ernest-Wallon",c:"Rugby",x:"Stade d'un club rouge et noir, le plus titré du rugby français et d'Europe, dans la « Ville rose ».",e:"Il se trouve dans le quartier des Sept-Deniers, au nord-ouest de Toulouse, au bord de la Garonne ; c'est le stade du Stade toulousain.",p:"Toulouse, France",a:43.6206,o:1.4189},
/* Basket-ball et boxe */
{t:"Madison Square Garden",c:"Salle",x:"Salle omnisports surnommée « la Mecque du basket », domicile des Knicks et des Rangers, célèbre pour ses combats de boxe, dont le « combat du siècle » Ali-Frazier en 1971.",e:"Il se trouve au cœur de Manhattan, à New York, entre la 7e et la 8e Avenue, juste au-dessus de la gare de Pennsylvania Station.",p:"New York, États-Unis",a:40.7505,o:-73.9934},
{t:"TD Garden",c:"Basket-ball",x:"Salle construite au-dessus d'une gare, héritière du Garden où jouaient Bill Russell et Larry Bird, domicile du club aux 18 titres de NBA et à la pelouse de trèfles.",e:"Elle se trouve au-dessus de North Station, dans le quartier de West End, à Boston, dans le Massachusetts ; c'est la salle des Celtics.",p:"Boston, États-Unis",a:42.3662,o:-71.0621},
{t:"Crypto.com Arena",c:"Basket-ball",x:"Salle ouverte en 1999 sous le nom de Staples Center, domicile d'un club violet et or où ont brillé Shaquille O'Neal et Kobe Bryant.",e:"Elle se trouve dans le quartier de South Park, au centre de Los Angeles, en Californie ; c'est la salle des Lakers et des Clippers.",p:"Los Angeles, États-Unis",a:34.043,o:-118.2673},
{t:"United Center",c:"Basket-ball",x:"Salle ouverte en 1994, devant laquelle se dresse une statue de Michael Jordan en plein vol, domicile d'un club au taureau.",e:"Elle se trouve dans le quartier de Near West Side, à Chicago, dans l'Illinois ; c'est la salle des Bulls et des Blackhawks.",p:"Chicago, États-Unis",a:41.8807,o:-87.6742},
{t:"Chase Center",c:"Basket-ball",x:"Salle ouverte en 2019 au bord d'une baie, pour un club aux maillots bleus et jaunes quadruple champion NBA avec Stephen Curry.",e:"Elle se trouve dans le quartier de Mission Bay, à San Francisco, en Californie ; c'est la salle des Golden State Warriors.",p:"San Francisco, États-Unis",a:37.768,o:-122.3877},
{t:"Accor Arena",c:"Basket-ball",x:"Salle en forme de pyramide aux flancs couverts de gazon, ouverte en 1984, qui accueille des matchs de NBA, un tournoi Masters 1000 de tennis et a reçu la gymnastique et le basket des Jeux de 2024.",e:"Ancien palais omnisports de Bercy, elle se trouve dans le 12e arrondissement de Paris, au bord de la Seine.",p:"Paris, France",a:48.8386,o:2.3786},
{t:"Stade de la Paix et de l'Amitié",c:"Basket-ball",x:"Salle ouverte en 1985 au bord d'un port, domicile du club rouge et blanc champion d'Europe de basket en 1997, 2012 et 2013, Olympiakos.",e:"Elle se trouve à Néo Fáliro, au Pirée, le port d'Athènes, en Grèce ; elle a accueilli le volley-ball des Jeux de 2004.",p:"Le Pirée, Grèce",a:37.9417,o:23.665},
{t:"MGM Grand Garden Arena",c:"Boxe",x:"Salle de 17 000 places au sein d'un hôtel-casino géant, théâtre du combat où Mike Tyson mordit l'oreille d'Evander Holyfield en 1997 et de Mayweather-Pacquiao en 2015.",e:"Elle se trouve dans l'hôtel MGM Grand, sur le Strip de Las Vegas, dans le Nevada, aux États-Unis.",p:"Las Vegas, États-Unis",a:36.1024,o:-115.1695},
/* Surf */
{t:"Teahupo'o",c:"Surf",x:"Vague géante et creuse qui déferle sur un récif de corail à fleur d'eau, au bout de la seule route d'une presqu'île du Pacifique, site des épreuves de surf des Jeux de 2024.",e:"Elle se trouve au bout de la presqu'île de Tahiti Iti, sur la côte sud-ouest de Tahiti, en Polynésie française, à 15 000 km de Paris.",p:"Tahiti, Polynésie française",a:-17.858,o:-149.257},
{t:"Banzai Pipeline",c:"Surf",x:"Vague en tube qui casse sur un récif peu profond, considérée comme la plus dangereuse du monde, sur la côte nord d'une île du Pacifique.",e:"Elle se trouve face à la plage d'Ehukai, sur le North Shore d'O'ahu, à Hawaï, aux États-Unis.",p:"O'ahu, Hawaï, États-Unis",a:21.665,o:-158.053},
{t:"Bells Beach",c:"Surf",x:"Plage au pied de falaises qui accueille depuis 1962 la plus ancienne compétition de surf professionnelle, dont le vainqueur reçoit une cloche.",e:"Elle se trouve près de Torquay, sur la Great Ocean Road, au sud-ouest de Melbourne, dans l'État de Victoria, en Australie.",p:"Torquay, Australie",a:-38.37,o:144.2817},
/* Sports d'hiver */
{t:"Chamonix",w:"Chamonix-Mont-Blanc",c:"Ski",x:"Station de montagne au pied du plus haut sommet d'Europe de l'Ouest, qui a accueilli les tout premiers Jeux olympiques d'hiver, en 1924, et la descente du Kandahar.",e:"Chamonix-Mont-Blanc se trouve en Haute-Savoie, au pied du mont Blanc, près des frontières italienne et suisse.",p:"Haute-Savoie, France",a:45.9237,o:6.8694},
{t:"Val-d'Isère",c:"Ski",x:"Station de ski au bout d'une haute vallée alpine, où la Coupe du monde ouvre chaque décembre la saison du Critérium de la première neige, et berceau de Jean-Claude Killy.",e:"Elle se trouve au fond de la vallée de la Tarentaise, en Savoie, au pied du col de l'Iseran, près du parc national de la Vanoise.",p:"Savoie, France",a:45.4485,o:6.98},
{t:"Streif",w:"Kitzbühel",c:"Ski",x:"Piste de descente la plus redoutée du ski alpin, avec un saut appelé la Mausefalle et des pentes à 85 %, théâtre chaque janvier de la course du Hahnenkamm.",e:"Elle descend le Hahnenkamm jusqu'à la petite ville de Kitzbühel, dans le Tyrol autrichien.",p:"Kitzbühel, Autriche",a:47.442,o:12.393},
{t:"Wengen",c:"Ski",x:"Village sans voitures, accessible seulement en train à crémaillère, où se court sur le Lauberhorn la plus longue descente de la Coupe du monde, face à la face nord de l'Eiger.",e:"Wengen se trouve dans l'Oberland bernois, au-dessus de la vallée de Lauterbrunnen, en Suisse.",p:"Oberland bernois, Suisse",a:46.6053,o:7.9217},
{t:"Planica",c:"Ski",x:"Vallée alpine des records du monde de vol à ski, où le premier saut au-delà de 100 mètres a été réussi en 1936 et où l'on a dépassé 250 mètres.",e:"Elle se trouve au pied du mont Ponce, près de Kranjska Gora, dans le nord-ouest de la Slovénie, à la frontière italienne.",p:"Kranjska Gora, Slovénie",a:46.4797,o:13.7247},
{t:"Holmenkollen",c:"Ski",x:"Tremplin de saut à ski dominant une capitale, utilisé depuis 1892 et reconstruit en 2010, cœur d'un festival de ski nordique qui attire chaque mars des dizaines de milliers de spectateurs.",e:"Le tremplin se trouve sur les hauteurs au nord-ouest d'Oslo, en Norvège, et offre une vue sur le fjord.",p:"Oslo, Norvège",a:59.964,o:10.668},
/* Golf et sports hippiques */
{t:"Pebble Beach Golf Links",c:"Golf",x:"Parcours de golf public au bord des falaises du Pacifique, dont le trou 7 est un petit par 3 entouré par l'océan, qui a accueilli six fois l'US Open.",e:"Il se trouve sur la péninsule de Monterey, au sud de San Francisco, en Californie, aux États-Unis.",p:"Monterey, Californie, États-Unis",a:36.5681,o:-121.9486},
{t:"Hippodrome de Longchamp",c:"Hippisme",x:"Hippodrome ouvert en 1857 au bord d'un fleuve, dans un grand bois, où se court chaque octobre le Prix de l'Arc de Triomphe, la course de galop la plus riche d'Europe.",e:"Il se trouve dans le bois de Boulogne, à l'ouest de Paris, au bord de la Seine.",p:"Paris, France",a:48.8573,o:2.2339},
{t:"Churchill Downs",c:"Hippisme",x:"Hippodrome aux deux flèches blanches, qui accueille depuis 1875 le Kentucky Derby, « les deux plus belles minutes du sport », le premier samedi de mai.",e:"Il se trouve à Louisville, dans le Kentucky, aux États-Unis, au bord de l'Ohio.",p:"Louisville, États-Unis",a:38.2031,o:-85.7703}
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

