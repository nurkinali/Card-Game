const donnes_topics = [
  {
    "_id" : "5ca0d49865461e048d66df40",
    "topic" : "Pour ou contre la compensation par bloc en licence ?",
    "open" : "true",
    "desc" : "le 12/03/19, la CFVU va mettre fin à la compensation automatique entre toutes les UEs d'un semestre de licence, maintenant cela se fera par \"blocs de compétences\" qui n'ont pas encore été définis. Par exemple, si les transversales sont dans un bloc et les autres UEs dans un autre, cela veut dire que le la note de TR ne compensera pas les autres pour aider à avoir le semestre",
    "user" : "albrecht.albert",
    "date" : "2019-03-09T12:32:37.466Z",
    "posts" : [
        {
          "_id" : "5ca0d49865461e048d66df50",
          "user"      : "berenice.bernardin",
          "content"   : "Moi je trouve ça très bien car c'est quand même n'importe quoi de valider le S1 avec 15 en danse et 14 en anglais alors qu'on a 8 en programmation !",
          "date"      : "2019-03-12T11:32:37.466Z",
          "likers"    : ["romuald.thion"],
          "dislikers"  : ["albrecht.albert", "communiste.camarade"]
        },
        {
          "_id" : "5ca0d49865461e048d66df51",
          "user"      : "albrecht.albert",
          "content"   : "@berenice.bernardin mais tu dis trop nawak ! Si tu prends foot c'est trop chaud d'avoir 15 en sport !",
          "date"      : "2019-03-12T12:32:37.466Z",
          "likers"    : ["albrecht.albert", "communiste.camarade","romuald.thion"],
          "dislikers"  : ["berenice.bernardin"]
        }
    ]
  },
  {
    "_id" : "5ca0d49865461e048d66df41",
    "topic" : "Le sens de la licence sans poursuite d'études en master ?",
    "open" : "false",
    "desc" : "L'université cible va séparer la licence (dans un collège universitaire de premier cycle) du master (qui sera dans un autre pôle). Cette séparation nouvelle va introduire une tentation beaucoup plus forte de sélectionner entre les deux. De plus, le projet d'université cible prévoit une licence professionalisante, la poursuite d'étude en master est donc moins garantie ?",
    "user" : "communiste.camarade",
    "date" : "2019-03-12T12:32:37.466Z",
    "posts" : [
      {
        "_id" : "5ca0d49865461e048d66df52",
        "user"      : "albrecht.albert",
        "content"   : "Sélection, sélection, sélection !",
        "date"      : "2019-03-15T12:32:37.466Z",
        "likers"    : ["albrecht.albert", "communiste.camarade","romuald.thion"],
        "dislikers"  : []
      }
    ]
  },
  {
    "_id" : "5ca0d49865461e048d66df42",
    "topic" : "Qui sont nos représentant-e-s ?",
    "date"  : "2019-03-11T12:32:37.466Z",
    "open" : "true",
    "desc" : "Où trouver la liste des élu-e-s étudiant-e-s ? Il y en a t'il en informatique ?",
    "user" : "communiste.camarade",
    "posts" : [
    ]
  },
  {
    "_id" : "5ca0d49865461e048d66df43",
    "topic" : "Topic ouvert par utilisateur inconnu",
    "open" : "true",
    "desc" : "Pour les tests",
    "date" : "2019-03-10T12:32:37.466Z",
    "user" : "unknown.user",
    "posts" : [
      {
        "_id" : "5ca0d49865461e048d66df54",
        "user"      : "unknown.user",
        "content"   : "description de test!",
        "date"      : "2019-03-12T12:32:37.466Z",
        "likers"    : [],
        "dislikers"  : []
      }
    ]
  },
  {
    "_id" : "5ca0d49865461e048d66df44",
    "topic" : "Autre topic fermé par utilisateur inconnu",
    "open" : "true",
    "desc" : "Pour les tests",
    "date" : "2019-03-17T12:32:37.466Z",
    "user" : "unknown.user",
    "posts" : [
      {
        "_id" : "5ca0d49865461e048d66df55",
        "user"      : "unknown.user",
        "content"   : "description de test!",
        "date"      : "2019-03-12T12:32:37.466Z",
        "likers"    : [],
        "dislikers"  : []
      }
    ]
  }
 ]

const donnes_1_topic = 
[
  {
    "_id" : "5ca0d49865461e048d66df40",
    "topic" : "Pour ou contre la compensation par bloc en licence ?",
    "open" : "true",
    "desc" : "le 12/03/19, la CFVU va mettre fin à la compensation automatique entre toutes les UEs d'un semestre de licence, maintenant cela se fera par \"blocs de compétences\" qui n'ont pas encore été définis. Par exemple, si les transversales sont dans un bloc et les autres UEs dans un autre, cela veut dire que le la note de TR ne compensera pas les autres pour aider à avoir le semestre",
    "user" : "albrecht.albert",
    "date" : "2019-03-09T12:32:37.466Z",
    "posts" : [
        {
          "_id" : "5ca0d49865461e048d66df50",
          "user"      : "berenice.bernardin",
          "content"   : "Moi je trouve ça très bien car c'est quand même n'importe quoi de valider le S1 avec 15 en danse et 14 en anglais alors qu'on a 8 en programmation !",
          "date"      : "2019-03-12T11:32:37.466Z",
          "likers"    : ["romuald.thion"],
          "dislikers"  : ["albrecht.albert", "communiste.camarade"]
        },
        {
          "_id" : "5ca0d49865461e048d66df51",
          "user"      : "albrecht.albert",
          "content"   : "@berenice.bernardin mais tu dis trop nawak ! Si tu prends foot c'est trop chaud d'avoir 15 en sport !",
          "date"      : "2019-03-12T12:32:37.466Z",
          "likers"    : ["albrecht.albert", "communiste.camarade","romuald.thion"],
          "dislikers"  : ["berenice.bernardin"]
        }
    ]
  }
  ]
//let state = new state;
//state.topics=donnes_topics;

document.addEventListener('DOMContentLoaded', function(){
  // initialisation de Mocha
  mocha.setup('tdd');
  
  
  suite("Tests pour la fonction tri_topics_titre",
        function() {
			test("On vérifie l'ordre des topics sur tri sur les données exemple",
				function() {
                 const resultat_attendu = [ "Autre topic fermé par utilisateur inconnu",
											"Le sens de la licence sans poursuite d'études en master ?",
											"Pour ou contre la compensation par bloc en licence ?",
											"Qui sont nos représentant-e-s ?",
											"Topic ouvert par utilisateur inconnu" ];
				const calcul = tri_topics_titre(donnees_exemple).map(n => n.topic);
				chai.assert.deepEqual(calcul, resultat_attendu);});
		});
		
		
	suite("Tests pour la fonction tri_topics_date",
	function() {
			test("On vérifie l'ordre des dates sur tri sur les données exemple",
				function() {
                 const attendu = [ "2019-03-09",
									"2019-03-10",
									"2019-03-11",
									"2019-03-12",
									"2019-03-17" ];
				const calcul = tri_topics_date(donnees_exemple).map(n => n.date);
				chai.assert.deepEqual(calcul, attendu);});
		});
         
	suite("Tests pour la fonction tri_topic_com_auteur ",
	function() {
			test("On vérifie l'ordre des auteurs par contribution sur les données exemple",
				function() {
					const expected = ["albrecht.albert",
									 "berenice.bernardin"];
					const calcul = tri_topics_date(donnees_1_topic).map(n => n.posts);
					chai.assert.deepEqual(calcul, expected);});
		});
		
		suite("Tests pour la fonction tri_topic_com_like ",
	function() {
			test("On vérifie l'ordre des posts par like sur les données exemple",
				function() {
					const result = ["5ca0d49865461e048d66df51",
									"5ca0d49865461e048d66df50"];
					const calcul = tri_topic_com_like(donnees_1_topic).map(n => n.posts.like);
					chai.assert.deepEqual(calcul, result);});
		});
		
		
	suite("Tests pour la fonction tri_topic_com_dislike ",
	function() {
			test("On vérifie l'ordre des posts par dislike sur les données exemple",
				function() {
					const resultat = ["5ca0d49865461e048d66df50",
									   "5ca0d49865461e048d66df51"];
					const calcul = tri_topic_com_dislike(donnees_1_topic).map(n => n.posts.dislike);
					chai.assert.deepEqual(calcul, resultat);});
		});
		
   // Lancement des tests
  mocha.checkLeaks();
  mocha.globals(['jQuery']);
  mocha.run();
  
}, false);