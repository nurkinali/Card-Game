/* 
  TOPICS:
    With local files: a single fetch request* to access the entire collection of topics
    With server: 3 requests to see the API of the topics to acess the contribution of a subjects
                1) List of topics https://lifap5.univ-lyon1.fr/topics/
                2) Description of topics https://lifap5.univ-lyon1.fr/topic/5ca0d49765461e048d66df4c
                3) Liste of posts https://lifap5.univ-lyon1.fr/topic/5ca0d49765461e048d66df4c/posts
                4) Create a new topic POST /topic/create
                5) Modify an existant topic PUT /topic/:id/update
                6) Change the situation of a topic PUT /topic/:id/clopen
                7) Delete a topic created by the current user DELETE /topic/:id/delete
  USERS:
    1) To see all users https://lifap5.univ-lyon1.fr/users/
    2) To see informations of 11812241 user https://lifap5.univ-lyon1.fr/user/11812241
  POSTS:
    1) Create a new comment POST /topic/:id/post/create
    2) Like a comment PUT /topic/:id/post/:post/like
    3) Dislike a comment PUT /topic/:id/post/:post/dislike
    4) Delete a comment DELETE /topic/:id/post/:post/delete

  *Fetch request is a asynchrone structure because it is based on "promises*".
   Fetch requests return a "response" object which might be a text or a json. 
   Depending on the type of this response, .text(), .json() functions are used.
   These functions are based on promises, so that makes them asynchrone as well.
   Due to promise, to reach the result of an asynchrone structure, "then" is used.

   *The Promise object represents the eventual completion (or failure) of an asynchronous operation, and its resulting value.
   A Promise is a proxy for a value not necessarily known when the promise is created. 
   It allows you to associate handlers with an asynchronous action's eventual success value or failure reason.
*/

"use strict"; // JavaScript code should be executed in strict mode. With strict mode, you can not, for example, use undeclared variables.

// Constantes
const local_server = "http://localhost:8443/";
const lifap5_server = "https://lifap5.univ-lyon1.fr/";
const server = lifap5_server || local_server;

const local_topic = "./Projet-2019-topics.json";
const local_users = "./Projet-2019-users.json";

const content_type_header = "Content-Type";
const content_type_value = "application/json";
const x_api_key_header = "x-api-key";

// Class to manage the current state of the application 
function State(users = [], topics = [], filters = [], sort = "NONE", x_api_key = "c269cec9-9b87-5815-bcf4-205c2e51adea"){ // S’identifier en saisissant sa clef d’API
  this.users      = users;
  this.topics     = topics;
  this.filters    = filters;
  this.sort       = sort; // dateAsc/dateDesc or titreAsc/titreDesc or dateCAsc/dateCDesc
  this.x_api_key  = x_api_key;

  this.tri_topics_date = () =>{ // Trier la liste des sujets de débat par date de création du sujet
    console.log("Trier la liste des sujets de débat par date de création du sujet");
    if(this.sort == "dateAsc"){
      var result = topics.sort((n1, n2) => n1.date < n2.date ? 1 : n1.date > n2.date ? -1 : 0); // The sort() method sorts an array alphabetically.
      this.sort = "dateDesc";
    }
    else{
      var result = topics.sort((n2, n1) => n1.date < n2.date ? 1 : n1.date > n2.date ? -1 : 0);
      this.sort = "dateAsc";
    }
    return result;
  }

  this.tri_topics_titre = () =>{ // Trier la liste des sujets de débat par titre
    console.log("Trier la liste des sujets de débat par titre ");
    if(this.sort == "titreAsc"){
      var result = topics.sort((n1, n2) => n1.topic.toLowerCase() < n2.topic.toLowerCase() ? 1 : n1.topic.toLowerCase() > n2.topic.toLowerCase() ? -1 : 0); // The toLowerCase() method converts a string to lowercase letters.
      this.sort = "titreDesc";
    }
    else{
      var result = topics.sort((n2, n1) => n1.topic.toLowerCase() < n2.topic.toLowerCase() ? 1 : n1.topic.toLowerCase() > n2.topic.toLowerCase() ? -1 : 0);
      this.sort = "titreAsc";
    }
    return result;
  }

  this.get_topic = (topic_id) =>{ // Sélectionner un débat pour en afficher le détail et sa liste des contributions
    console.log("Sélectionner un débat pour en afficher le détail et sa liste des contributions");
    return this.topics.find((o) => o['_id'] === topic_id); // The find() method returns the value of the first element in the array that satisfies the provided testing function. 
  };

  this.delete_topic = (topic_id) => { // Supprimer un débat dont on est l’auteur
    console.log("Supprimer un débat dont on est l’auteur");
    var index = this.topics.findIndex(x => x._id === topic_id); // The findIndex() method returns the index of the first element in the array that satisfies the provided testing function.
    delete this.topics[index];
  };

  this.modif_topic = (topic_id, titre, desc, open, date) => { // Modifier et Clore un débat dont on est l’auteur
    console.log("Modifier et Clore un débat dont on est l’auteur");
    this.topics.find((o) => o['_id'] === topic_id).topic = titre;
    this.topics.find((o) => o['_id'] === topic_id).desc = desc;
    this.topics.find((o) => o['_id'] === topic_id).open = open;
    this.topics.find((o) => o['_id'] === topic_id).date = date;
    
    return this.topics.find((o) => o['_id'] === topic_id)
  };
  
  this.tri_topic_com_auteur = (topic_id, ordre) => { // Trier les contributions d’un débat par ordre alphabétique des auteurs
    console.log("Trier les contributions d’un débat par ordre alphabétique des auteurs");
    var topic = this.topics.find((o) => o['_id'] === topic_id);
    if(ordre == 0){ // Ascendent or descendant
      var result = topic.posts.sort((n1, n2) => n1.user < n2.user ? 1 : n1.user > n2.user ? -1 : 0);
    }
    else{
      var result = topic.posts.sort((n2, n1) => n1.user < n2.user ? 1 : n1.user > n2.user ? -1 : 0);
    }
    return result;
  };

  this.tri_topic_com_auteur = (topic_id, ordre) => { // Trier les contributions d’un débat par dates 
    console.log("Trier les contributions d’un débat par dates");
    var topic = this.topics.find((o) => o['_id'] === topic_id);
    if(ordre == 0){
      var result = topic.posts.sort((n1, n2) => n1.date < n2.date ? 1 : n1.date > n2.date ? -1 : 0);
    }
    else{
      var result = topic.posts.sort((n2, n1) => n1.date < n2.date ? 1 : n1.date > n2.date ? -1 : 0);
    }
    return result;
  };

  this.tri_topic_com_like = (topic_id, ordre) => { // Trier les contributions d’un débat par nombre de likes 
    console.log("Trier les contributions d’un débat par nombre de likes");
    var topic = this.topics.find((o) => o['_id'] === topic_id);
    if(ordre == 0){
      var result = topic.posts.sort((n1, n2) => n1.likers.length < n2.likers.length ? 1 : n1.likers.length > n2.likers.length ? -1 : 0);
    }
    else{
      var result = topic.posts.sort((n2, n1) => n1.likers.length < n2.likers.length ? 1 : n1.likers.length > n2.likers.length ? -1 : 0);
    }
    return result;
  };

  this.tri_topic_com_dislike = (topic_id, ordre) => { // Trier les contributions d’un débat par nombre de dislikes
    console.log("Trier les contributions d’un débat par nombre de dislikes");
    var topic = this.topics.find((o) => o['_id'] === topic_id);
    if(ordre == 0){
      var result = topic.posts.sort((n1, n2) => n1.dislikers.length < n2.dislikers.length ? 1 : n1.dislikers.length > n2.dislikers.length ? -1 : 0);
    }
    else{
      var result = topic.posts.sort((n2, n1) => n1.dislikers.length < n2.dislikers.length ? 1 : n1.dislikers.length > n2.dislikers.length ? -1 : 0);
    }
    return result;
  };

  this.tri_nbc = () => { // Trier la liste des sujets de débat par nombre de contributions
    console.log("Trier la liste des sujets de débat par nombre de contributions");
    if(this.sort == "nbcAsc"){
      var result = topics.sort((n1, n2) => n1.posts.length < n2.posts.length ? 1 : n1.posts.length > n2.posts.length ? -1 : 0);
      this.sort = "nbcDesc";
    }
    else{
      var result = topics.sort((n2, n1) => n1.posts.length < n2.posts.length ? 1 : n1.posts.length > n2.posts.length ? -1 : 0);
      this.sort = "nbcAsc";
    }
    return result;
  };

  this.getRecentComDate = (topicId) => { // Afficher la liste des sujets de débat par date de la dernière contribution
    console.log("Afficher la liste des sujets de débat par date de la dernière contribution");
    var topic = this.get_topic(topicId);
    var result = topic.posts.sort((n1, n2) => n1.date < n2.date ? 1 : n1.date > n2.date ? -1 : 0);
    if(result[0]){
      return result[0].date;
    }
  };

  this.tri_date_contrib = () => { // Trier la liste des sujets de débat par date de la dernière contribution
    console.log("Trier la liste des sujets de débat par date de la dernière contribution");
    if(this.sort == "dateCAsc"){
      var result = topics.sort((n1, n2) => this.getRecentComDate(n1._id) < this.getRecentComDate(n2._id) ? 1 : this.getRecentComDate(n1._id) > this.getRecentComDate(n2._id) ? -1 : 0);
      this.sort = "dateCDesc";
    }
    else{
      var result = topics.sort((n2, n1) => this.getRecentComDate(n1._id) < this.getRecentComDate(n2._id) ? 1 : this.getRecentComDate(n1._id) > this.getRecentComDate(n2._id) ? -1 : 0);
      this.sort = "dateCAsc";
    }
    return result;
  };
}

function clearEventListenerById(id){ // Remove all handlers (and those of his children) by cloning an element
  console.log("Remove all handlers (and those of his children) by cloning an element");
  let elt = document.getElementById(id);
  let clone = elt.cloneNode(true);
  elt.parentNode.replaceChild(clone, elt);
  return id;
}

// All static HTML will be generated from .json collections read locally with fetch API. The functions generating HTML from JSON data that are responsible for updating the web interface when the collection is returned by the server
function afficherSujet(state, bool){ // Consulter la liste de tous les sujets de débat
  console.log("Consulter la liste de tous les sujets de débat");
  let creerSujet = '';
  var user;

  whoami(state)() // state parameter is an inheritance of State.
  .then(data => {
    if(data){
      user = data;
      for (let i in state.topics) {
        let sujet = state.topics[i];
        if(i < 10){
          if(sujet._id){ // Verification of topic ID, if it has been deleted, cannot be visualised.
            creerSujet +=
            '<tr id=' + sujet._id + '><th scope="row" style="width: 45%">' + sujet.topic + '</th>' +
            '<th style="width: 15%" >';
            if(sujet.posts){
              creerSujet += sujet.posts.length;
            } 
            else{
              creerSujet += '0';
            }
            creerSujet += '</td>' +
            '<td style="width: 20%">' + sujet.date.substring(0, 10) + '</td>'; // The substring() method extracts characters from a string.
            if(user.login == sujet.user){ // Addition of icons if the topic has created by the user
              creerSujet += '<td style="width: 15%">' +
                            '<img class="btn-img btn-modif" src="images/modif.png" alt="" />' +
                            '<img class="btn-img ml-2 btn-del" src="images/delete.png" alt="" />' +
                            '</td>';
            }
            else{
              creerSujet += '<td style="width: 15%"></td>';
            }
            creerSujet += '</tr>';
          }
        }
        else if(bool){ // bool is used for "afficher plus" or not
          if(sujet._id){ // Verification of topic ID, if it has been deleted, cannot be visualised.
            creerSujet +=
            '<tr id=' + sujet._id + '><th scope="row" style="width: 45%">' + sujet.topic + '</th>' +
            '<th style="width: 15%" >';
            if(sujet.posts){
              creerSujet += sujet.posts.length;
            } 
            else{
              creerSujet += '0';
            }
            creerSujet += '</td>' +
            '<td style="width: 20%">' + sujet.date.substring(0, 10) + '</td>';
            if(user.login == sujet.user){
              creerSujet += '<td style="width: 15%">' +
                            '<img class="btn-img btn-modif" src="images/modif.png" alt="" />' +
                            '<img class="btn-img ml-2 btn-del" src="images/delete.png" alt="" />' +
                            '</td>';
            }
            else{
              creerSujet += '<td style="width: 15%"></td>';
            }
            creerSujet += '</tr>';
          }
        }
        else{
          document.getElementById("plus").innerHTML = 'Afficher Plus <i class="fas fa-chevron-down fa-fw"> </i>';
          break;
        }
      }
    }
    document.getElementById("table-topics-body").innerHTML = creerSujet;

    return creerSujet;
  })
}

function afficherDetails(state, idTopic){ // Afficher le détail de débat
  console.log("Afficher le détail de débat");
  var topic = state.get_topic(idTopic);
  
  var date = new Date();
  date.setTime(Date.parse(topic.date)); // The JSON.parse() method parses a JSON string, constructing the JavaScript value or object described by the string. 
  
  var options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'};

  document.getElementById("titre-topic").innerHTML = topic.topic ;
  document.getElementById("auteurTopic").innerHTML = topic.user ;
  document.getElementById("dateTopic").innerHTML = date.toLocaleDateString('fr-FR', options); // The toLocaleDateString() method returns a string with a language sensitive representation of the date portion of this date. 
  document.getElementById("descTopic").innerHTML = topic.desc;

  afficherListeCom(state, topic.posts);
}

function afficherListeCom(state, topic){ // Afficher la liste des contributions de débat
  console.log("Afficher la liste des contributions de débat");
  var creerCommentaire = '';
  
  whoami(state)()
  .then(data => {
    if(data){
      var user = data;
      for (let i in topic) {
        var com = topic[i];
        var userLike = false;
        var userDislike = false;
        for(let i = 0; i < com.likers.length; i++){
          if(com.likers[i] == user.login){
            userLike = true;
          }
        }
        for(let i = 0; i < com.dislikers.length; i++){ 
          if(com.dislikers[i] == user.login){
            userDislike = true;
          }
        }
        var date = new Date();
        date.setTime(Date.parse(com.date));
        var options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'};
        creerCommentaire += 
        '<tr id="' + com._id +'" >' +
          '<th scope="row" class="text-center">' + 
            '<br>' +
            '<img class="rounded center" src="https://gazettereview.com/wp-content/uploads/2016/03/facebook-avatar.jpg" width="80px" height="70px"/>' +
            '<br>' +
            '<a class="text-warning" href="" data-toggle="modal" data-target="#user' + com._id + '">' + com.user + '</a>' +
            '<!-- le 2019-03-12 (1 <i class="far fa-thumbs-up"></i>) (2 <i class="far fa-thumbs-down"></i>) -->' +
            '<div class="modal fade" id="user' + com._id + '" tabindex="-1" role="dialog" aria-labelledby="user" aria-hidden="true">' +
              '<div class="modal-dialog form-dark">'+ 
                '<div class="modal-content card card-image" style="background-image: url(\'https://i.imgur.com/MLFUoIj.png\');">' +
                  '<div class="text-white rgba-stylish-strong py-3 px-3 z-depth-3">' +               
                        '<div>' +
                          '<button type="button" class="close white-text" data-dismiss="modal" aria-label="Close">' +
                            '<span aria-hidden="true">&times;</span>' +
                          '</button>' +
                          '<img class="center" src="https://i.imgur.com/bRqWOM1.png">'+
                          '<p align="center">' + com.user + '</p>' + 
                          '<p align="center">ID:</p>'+
                          '<p align="center">Date:</p>' +
                        '</div>' + 
                  '</div>' +
                '</div>' +
              '</div>' +
            '</div>' +
          '</th>' +
          '<td>' + com.content + '<br><br><p class="text-sm-right text-info font-italic" >' + date.toLocaleDateString('fr-FR', options) + '</p>' ;
          if(com.user == user.login){
            creerCommentaire += '<button type="button" class="float-right btn btn-danger delete">Supprimer</button>';
          }
          creerCommentaire += '</td>' +
          '<td class="h5"> <span class="nblike">' + com.likers.length + 
          '</span><i id="btn-like"' +
          'class="';
           if(userLike){ 
            creerCommentaire += 'text-success ';
           }
        creerCommentaire +='ml-2 fas fa-thumbs-up btn-like"></i></td>' +
          '<td class="h5"><span class="nbdislike">' + com.dislikers.length + '</span><i class="';
          if(userDislike){ 
            creerCommentaire += 'text-danger ';
          }
        creerCommentaire +=  'ml-2 fas fa-thumbs-up btn-dislike"></i></td>' +
        '</tr>';
      }
      document.getElementById("listeCommentaire").innerHTML = creerCommentaire
    }
  });
}

// User event management in the HTML interface
function attach_all_handlers(state){
  
  const ids = [   // Starting by emptying everything
    "identifierBouton",
    "search-btn",
    "upload-btn",
    "contrib-btn",
    "tri-date",
    "table-topics-body",
    "tri-auteur",
    "tri-like",
    "tri-dislike",
    "tri-date-com",
    "listeCommentaire",
    "modif-topic-btn",
    "reglage",
    "plus",
  ];
  ids.map(clearEventListenerById);

  document.getElementById("plus") // Rendre l’appli responsive: Si le terminal d’affichage est trop petit la liste des sujets devrait être remplacée par un bouton de menu.
  .addEventListener("click", () => {
    console.log("Afficher la liste des contributions de débat");
    var iconClass = document.getElementById("plus").firstElementChild.classList; // The firstElementChild gets the HTML content of the first child element of an <ul> element. The classList property returns the class name(s) of an element.
    if(iconClass.contains("fa-chevron-down")){ // More subjects on the screen depending on the chevron down or up
      afficherSujet(state, true);
      iconClass.remove("fa-chevron-down");
      iconClass.add("fa-chevron-up");
    }
    else{
      afficherSujet(state, false);
      iconClass.remove("fa-chevron-up");
      iconClass.add("fa-chevron-down");
    }
  })

  document.getElementById("listeCommentaire")
  .addEventListener("click", (e) => { 
    var btn = e.target; // The target gets the element that triggered a specific event.

    if(btn.classList.contains("btn-like")){ // Liker des contributions
      console.log("Liker des contributions");
      var idTopic = document.getElementsByClassName('topic-selected')[0].id;
      var idCom = e.target.parentNode.parentNode.id;
      likeCom(state,idTopic,idCom);
      if(btn.classList.contains("text-success")){ // If a comment is already liked
        e.target.parentNode.firstElementChild.innerHTML--;
        btn.classList.remove("text-success");
      }
      else{
        e.target.parentNode.firstElementChild.innerHTML++;
        btn.classList.add("text-success");
      }
      get_serv_topics(state).then(topicsRefresh => {
        state.topics = topicsRefresh;
      });
    }

    if(btn.classList.contains("btn-dislike")){ // Disliker des contributions
      console.log("Disliker des contributions");
      var idTopic = document.getElementsByClassName('topic-selected')[0].id;
      var idCom = e.target.parentNode.parentNode.id;
      dislikeCom(state,idTopic,idCom);
      if(btn.classList.contains("text-danger")){ // If a comment is already disliked
        e.target.parentNode.firstElementChild.innerHTML--;
        btn.classList.remove("text-danger");
      }
      else{
        btn.classList.add("text-danger");
        e.target.parentNode.firstElementChild.innerHTML++;
      }
      get_serv_topics(state).then(topicsRefresh => {
        state.topics = topicsRefresh;
      });
    }

    if(btn.classList.contains("delete")){ // Supprimer une contribution à un débat
      console.log("Supprimer une contribution à un débat");
      var idCom = e.target.parentNode.parentNode.id;
      var comment = e.target.parentNode.parentNode;
      var idTopic = document.getElementsByClassName('topic-selected')[0].id;
      if (confirm('Etes vous sur de vouloir supprimer ce commentaire ?')) {
        deleteCom(state,idTopic,idCom);
        get_serv_topics(state).then(topicsRefresh => {
          state.topics = topicsRefresh;
          comment.remove();
        });
      }
    }
  })

  document.getElementById("tri-date-com") // Trier les contributions d’un débat par date
  .addEventListener("click", () => {
    console.log("Trier les contributions d’un débat par date");
    var topic_id = document.getElementsByClassName("topic-selected")[0].id;
    var iconClass = document.getElementById("tri-date-com").firstElementChild.classList; // firstElementChild: icon, classList: fa-chevron-down
    if(iconClass.contains("fa-chevron-down")){
      var topic = state.tri_topic_com_auteur(topic_id, 0);
      iconClass.remove("fa-chevron-down");
      iconClass.add("fa-chevron-up");
      afficherListeCom(state, topic);
    }
    else{
      var topic = state.tri_topic_com_auteur(topic_id, 1);
      iconClass.remove("fa-chevron-up");
      iconClass.add("fa-chevron-down");
      afficherListeCom(state, topic);
    }
  })

  document.getElementById("tri-nbc") // Trier les contributions d’un débat par nombre de contributions
  .addEventListener("click", () => {
    console.log("Trier les contributions d’un débat par nombre de contributions");
    var iconClass = document.getElementById("tri-nbc").firstElementChild.classList;
    if(state.sort == "nbcAsc"){
      iconClass.remove("fa-chevron-down");
      iconClass.add("fa-chevron-up");
      state.tri_nbc();
    }
    else{
      iconClass.remove("fa-chevron-up");
      iconClass.add("fa-chevron-down");
      state.tri_nbc();
    }
    afficherSujet(state, false);
  })

  document.getElementById("tri-dislike") // Trier les contributions d’un débat par nombre de dislikes
  .addEventListener("click", () => {
    console.log("Trier les contributions d’un débat par nombre de dislikes");
    var topic_id = document.getElementsByClassName("topic-selected")[0].id;
    var iconClass = document.getElementById("tri-dislike").firstElementChild.classList;
    if(iconClass.contains("fa-chevron-down")){
      var topic = state.tri_topic_com_dislike(topic_id,0);
      iconClass.remove("fa-chevron-down");
      iconClass.add("fa-chevron-up");
      afficherListeCom(state, topic);
    }
    else{
      var topic = state.tri_topic_com_dislike(topic_id,1);
      iconClass.remove("fa-chevron-up");
      iconClass.add("fa-chevron-down");
      afficherListeCom(state, topic);
    }
  })

  document.getElementById("tri-like") // Trier les contributions d’un débat par nombre de likes
  .addEventListener("click", () => {
    console.log("Trier les contributions d’un débat par nombre de likes");
    var topic_id = document.getElementsByClassName("topic-selected")[0].id;
    var iconClass = document.getElementById("tri-like").firstElementChild.classList;
    if(iconClass.contains("fa-chevron-down")){
      var topic = state.tri_topic_com_like(topic_id,0);
      iconClass.remove("fa-chevron-down");
      iconClass.add("fa-chevron-up");
      afficherListeCom(state, topic);
    }
    else{
      var topic = state.tri_topic_com_like(topic_id,1);
      iconClass.remove("fa-chevron-up");
      iconClass.add("fa-chevron-down");
      afficherListeCom(state, topic);
    }
  })

  document.getElementById("tri-auteur") // Trier les contributions d’un débat par ordre alphabétique des auteurs
  .addEventListener("click", () => {
    console.log("Trier les contributions d’un débat par ordre alphabétique des auteurs");
    var topic_id = document.getElementsByClassName("topic-selected")[0].id;
    var iconClass = document.getElementById("tri-auteur").firstElementChild.classList;
    if(iconClass.contains("fa-chevron-down")){
      var topic = state.tri_topic_com_auteur(topic_id, 0);
      iconClass.remove("fa-chevron-down");
      iconClass.add("fa-chevron-up");
      afficherListeCom(state, topic);
    }
    else{
      var topic = state.tri_topic_com_auteur(topic_id, 1);
      iconClass.remove("fa-chevron-up");
      iconClass.add("fa-chevron-down");
      afficherListeCom(state, topic);
    }
  })

  document.getElementById("reglage") // Trier les contributions d’un débat par date de la dernière contribution
  .addEventListener("click", () => {
    console.log("Trier les contributions d’un débat par date de la dernière contribution");
    var iconClass = document.getElementById("reglage").firstChild.firstChild.classList;
    if(state.sort == "dateCAsc"){
      iconClass.remove("fa-chevron-down");
      iconClass.add("fa-chevron-up");
      state.tri_date_contrib();
    }
    else{
      iconClass.remove("fa-chevron-up");
      iconClass.add("fa-chevron-down");
      state.tri_date_contrib();
    }
    afficherSujet(state, false);
  })

  document.getElementById("tri-date") // Trier la liste des sujets de débat par date de création du sujet
  .addEventListener("click", () => {
    console.log("Trier la liste des sujets de débat par date de création du sujet");
    var iconClass = document.getElementById("tri-date").firstElementChild.classList;
    if(state.sort == "dateAsc"){
      iconClass.remove("fa-chevron-down");
      iconClass.add("fa-chevron-up");
      state.tri_topics_date();
    }
    else{
      iconClass.remove("fa-chevron-up");
      iconClass.add("fa-chevron-down");
      state.tri_topics_date();
    }
    afficherSujet(state, false);
  })

  document.getElementById("tri-titre") // Trier la liste des sujets de débat par titre
  .addEventListener("click", () => {
    console.log("Trier la liste des sujets de débat par titre");
    var iconClass = document.getElementById("tri-titre").firstElementChild.classList;
    if(state.sort == "titreAsc"){
      iconClass.remove("fa-chevron-down");
      iconClass.add("fa-chevron-up");
      state.tri_topics_titre();
    }
    else{
      iconClass.remove("fa-chevron-up");
      iconClass.add("fa-chevron-down");
      state.tri_topics_titre();
    }
    afficherSujet(state, false);
  })

  document.getElementById("table-topics-body")
  .addEventListener("click", (e) => {
    var elements = document.getElementsByClassName("topic-selected"); 
    while(elements.length > 0){
      elements[0].classList.remove("topic-selected");
    }
    if(document.getElementById(e.target.parentNode.id) != null){ // Sélectionner un débat pour en afficher le détail et sa liste des contributions
      console.log("Sélectionner un débat pour en afficher le détail et sa liste des contributions");
      var sujet = document.getElementById(e.target.parentNode.id);
      sujet.classList.add("topic-selected");
      var idTopic = e.target.parentNode.id;
      afficherDetails(state, idTopic);
    }
    else{ // Modifier, Supprimer un débat dont on est l’auteur
      console.log("Modifier, Supprimer un débat dont on est l’auteur");
      var btn = e.target; // <img class="btn-img btn-modif" src="images/modif.png" alt="">
      var idTopic = e.target.parentNode.parentNode.id; // 5cd893cae19a9d607118ce33
      if(btn.classList.contains("btn-del")){
        if (confirm('Etes vous sur de vouloir supprimer ce topic ?')) {
          deleteTopic(state,idTopic);
          state.delete_topic(idTopic);
          afficherSujet(state, false);
        }
      }
      else if(btn.classList.contains("btn-modif")){
        var modal = document.getElementById("modal-modif-topic");
        var oldTopic = state.get_topic(idTopic);
        var hidden = document.getElementById("modifId");
        hidden.setAttribute("value",oldTopic._id);
        var titreTopic = document.getElementById("modif-title");
        titreTopic.value = oldTopic.topic;
        var descTopic = document.getElementById("modif-description");
        descTopic.value = oldTopic.desc;
        $('#modal-modif-topic').modal('toggle')
      }
    }
  })

  document.getElementById("identifierBouton") // S’identifier en saisissant sa clef d’API
  .addEventListener("click", () => {
    console.log("S’identifier en saisissant sa clef d’API");
    document.forms['apikey']
    .addEventListener("submit", (e) => {
      e.preventDefault(); // The preventDefault() method cancels the event if it is cancelable.
      var apikey = document.getElementById("APIKEY").value;
      state.x_api_key = apikey;
      whoami(state)()
      .then(data => {
        if(data){
          alert(`Vous êtes ${data.login}`);  
          document.getElementById("login").innerHTML = "Identifiant : " + data.login;
        }
      })
      .catch(console.error);
      $('#identification-link').modal('toggle');

      return attach_all_handlers(state); // Reattach the handlers so that they all use the new state
    }); 

    return attach_all_handlers(state);
  }); 

  document.getElementById("modif-topic-btn") // Modifier un débat dont on est l’auteur
  .addEventListener("click", () => {
    console.log("Modifier un débat dont on est l’auteur");
    var titre = document.getElementById("modif-title").value;
    var description = document.getElementById("modif-description").value;
    var open = document.getElementById("modif-open").value;

    if(titre && description){
      var newTopic = JSON.stringify({
        "topic" : titre,
        "open" : open,
        "desc" : description
      }) 
      var idTopic = document.getElementById("modifId").value;
      var oldTopic = state.get_topic(idTopic);
      document.getElementById(idTopic).remove();
      modifTopic(state,newTopic,idTopic)
      .then(res => res.json())
      .then(sujet => {
        var creerSujet = '';
        creerSujet +=
              '<tr id=' + sujet._id + '><th scope="row" style="width: 45%">' + sujet.topic + '</th>' +
              '<th style="width: 15%" >' + sujet.posts.length + '</td>' +
              '<td style="width: 20%">' + sujet.date.substring(0,10) + '</td>';
        creerSujet += '<td style="width: 15%">' +
                              '<img class="btn-img btn-modif" src="images/modif.png" alt="" />' +
                              '<img class="btn-img ml-2 btn-del" src="images/delete.png" alt="" />' +
                              '</td>';
        creerSujet += '</tr>';
        document.getElementById("table-topics-body").innerHTML += creerSujet;
        state.modif_topic(idTopic, sujet.topic, sujet.desc, sujet.open, sujet.date);
        console.log(state);
      });
    }
    else{
      alert("Vous n'avez pas rempli le champ titre ou description votre sujet n'a pas été posté");
    }
  });

  document.getElementById("upload-btn") // Ajouter un nouveau sujet de débat
  .addEventListener("click", () => {
    console.log("Ajouter un nouveau sujet de débat");
    var titre = document.getElementById("upload-title").value;
    var description = document.getElementById("upload-description").value;
    var open = document.getElementById("upload-open").value;

    var newTopic = JSON.stringify({
      "topic" : titre,
      "open" : open,
      "desc" : description
    }) 
    if(titre && description){
      postTopic(state,newTopic).then(res=>res.json())
      .then(sujet => {
        console.log(sujet);
        var creerSujet = '';
        creerSujet +=
              '<tr id=' + sujet._id + '><th scope="row" style="width: 45%">' + sujet.topic + '</th>' +
              '<th style="width: 15%" >' + sujet.posts.length + '</td>' +
              '<td style="width: 20%">' + sujet.date.substring(0,10) + '</td>';
        creerSujet += '<td style="width: 15%">' +
                              '<img class="btn-img btn-modif" src="images/modif.png" alt="" />' +
                              '<img class="btn-img ml-2 btn-del" src="images/delete.png" alt="" />' +
                              '</td>';
        creerSujet += '</tr>';
        document.getElementById("table-topics-body").innerHTML += creerSujet;
        state.topics[state.topics.length] = sujet;
       
      });
    }
    else{
      alert("Vous n'avez pas rempli le champ titre ou description votre sujet n'a pas été posté");
    }
  });


  document.getElementById("search-btn") // rechercher un mot
  .addEventListener("click", (e) => {
    e.preventDefault;
    recherche()});

  document.getElementById("contrib-btn") // Ajouter une contribution à un débat
  .addEventListener("click", () =>{ 
    console.log("Ajouter une contribution à un débat");
    var content = document.getElementById("contrib-text").value;
    var idTopic = document.getElementsByClassName('topic-selected')[0].id;
    var newCom = JSON.stringify({
      "content" : content,
    });
    postCom(state,newCom,idTopic).then(res => res.json())
    .then(com => {
      var creerCommentaire = '';
      var date = new Date();
      date.setTime(Date.parse(com.date)) ;
      var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
      creerCommentaire += 
      '<tr id="' + com._id +'" >' +
        '<th scope="row" class="text-center">' + 
          '<br>' +
          '<img class="rounded center" src="https://gazettereview.com/wp-content/uploads/2016/03/facebook-avatar.jpg" width="80px" height="70px"/>' +
          '<br>' +
          '<a class="text-warning" href="" data-toggle="modal" data-target="#user' + com._id + '">' + com.user + '</a>' +
          '<!-- le 2019-03-12 (1 <i class="far fa-thumbs-up"></i>) (2 <i class="far fa-thumbs-down"></i>) -->' +
          '<div class="modal fade" id="user' + com._id + '" tabindex="-1" role="dialog" aria-labelledby="user" aria-hidden="true">' +
            '<div class="modal-dialog form-dark">'+ 
              '<div class="modal-content card card-image" style="background-image: url(\'https://i.imgur.com/MLFUoIj.png\');">' +
                '<div class="text-white rgba-stylish-strong py-3 px-3 z-depth-3">' +               
                      '<div>' +
                        '<button type="button" class="close white-text" data-dismiss="modal" aria-label="Close">' +
                          '<span aria-hidden="true">&times;</span>' +
                        '</button>' +
                        '<img class="center" src="https://i.imgur.com/bRqWOM1.png">'+
                        '<p align="center">' + com.user + '</p>' + 
                        '<p align="center">ID:</p>'+
                        '<p align="center">Date:</p>' +
                      '</div>' + 
                '</div>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</th>' +
        '<td>' + com.content + '<br><br><p class="text-sm-right text-info font-italic" >' + date.toLocaleDateString('fr-FR',options) + '</p> <br> <br> <button type="button" class="float-right btn btn-danger delete">Supprimer</button></td>' +
        '<td class="h5"> <span class="nblike">' + 0 + 
        '</span><i id="btn-like"' +
        'class="';
      creerCommentaire +='ml-2 fas fa-thumbs-up btn-like"></i></td>' +
        '<td class="h5"><span class="nbdislike">' + 0 + '</span><i class="';
      creerCommentaire +=  'ml-2 fas fa-thumbs-up btn-dislike"></i></td>' +
      '</tr>';
      document.getElementById("listeCommentaire").innerHTML += creerCommentaire;
    });
    get_serv_topics(state).then(topicsRefresh => {
      state.topics = topicsRefresh;
    });
  });
  return state;
}

// Function to load asynchronous data 

function recherche() // fonction recherche mot 
{

 
  const str = document.getElementById("search-text").value;
  let nbSearch = 0;
  let txt, i, found;
  if (str=="") return false; 
  if ((document.layers)||(window.sidebar)) {
    if (!window.find(str)) {
    while(window.find(str, false, true)) {nbSearch++;}
    } 
    else nbSearch++;
  } 
  if (document.all) {
    txt = window.document.body.createTextRange();
    for (i = 0; i <= nbSearch && (found = txt.findText(str)) != false; i++) {
      txt.moveStart("character", 1);
      txt.moveEnd("textedit");
    }
    if (found) {
      txt.moveStart("character", -1);
      txt.findText(str);
      txt.select();
      txt.scrollIntoView();
      nbSearch++;
    } 
    
   }
   
  return false;
}
function get_local_topic() {
  return fetch(local_topic)
    .then(response => response.json());
}

function get_local_users() {
  return fetch(local_users)
    .then(response => response.json());
}

function likeCom(state,idTopic,idCom) { // Liker des contributions
  console.log("Liker des contributions");
  const url = server + "topic/" + idTopic + "/post/" + idCom + "/like";
  let headers = new Headers();
  headers.set(x_api_key_header, state.x_api_key);
  headers.set(content_type_header, content_type_value);

  return fetch(url, {
    method: 'PUT',
    headers: headers
  }).then(res => console.log(res));
}

function dislikeCom(state,idTopic,idCom) { // Disliker des contributions
  console.log("Disliker des contributions");
  const url = server + "topic/" + idTopic + "/post/" + idCom + "/dislike";
  let headers = new Headers();
  headers.set(x_api_key_header, state.x_api_key);
  headers.set(content_type_header, content_type_value);

  return fetch(url, {
    method: 'PUT',
    headers: headers
  }).then(res => console.log(res));
}

function postTopic(state,json) { // Ajouter un nouveau sujet de débat
  console.log("Ajouter un nouveau sujet de débat");
  const url = server + "topics/create";
  let headers = new Headers();
  headers.set(x_api_key_header, state.x_api_key);
  headers.set(content_type_header, content_type_value);

  return fetch(url, {
    method: 'post',
    headers: headers,
    body: json
  });
}

function postCom(state,json,topicId) { // Ajouter une contribution à un débat
  console.log("Ajouter une contribution à un débat");
  const url = server + "topic/" + topicId + "/post/create";
  let headers = new Headers();
  headers.set(x_api_key_header, state.x_api_key);
  headers.set(content_type_header, content_type_value);

  return fetch(url, {
    method: 'post',
    headers: headers,
    body: json
  });
}

function modifTopic(state,json,idTopic) { // Modifier un débat dont on est l’auteur
  console.log("Modifier un débat dont on est l’auteur");
  const url = server + "topic/" + idTopic + "/update";
  let headers = new Headers();
  headers.set(x_api_key_header, state.x_api_key);
  headers.set(content_type_header, content_type_value);

  return fetch(url, {
    method: 'PUT',
    headers: headers,
    body: json
  });
}

function deleteCom(state,idTopic,idCom){ // Supprimer une contribution à un débat
  console.log("Supprimer une contribution à un débat");
  const url = server + "topic/" + idTopic + "/post/" + idCom + "/delete";
  let headers = new Headers();
  headers.set(x_api_key_header, state.x_api_key);
  headers.set(content_type_header, content_type_value);

  fetch(url, {
    method: 'DELETE',
    headers: headers
  }).then(res => res.json())
    .then(res => console.log(res));
}

function deleteTopic(state,id){ // Supprimer un débat dont on est l’auteur
  console.log("Supprimer un débat dont on est l’auteur");
  const url = server + "topic/" + id + "/delete";
  let headers = new Headers();
  headers.set(x_api_key_header, state.x_api_key);
  headers.set(content_type_header, content_type_value);

  fetch(url, {
    method: 'DELETE',
    headers: headers
  }).then(res=>res.json())
    .then(res => console.log(res));
}

function get_serv_topics (state) { // Consulter la liste de tous les sujets de débat
  console.log("Consulter la liste de tous les sujets de débat");
  const url = server + "topics/";
  let headers = new Headers();
  headers.set(x_api_key_header, state.x_api_key);
  headers.set(content_type_header, content_type_value);
  const headMethod = { method : "GET", headers : headers};

  return fetch(url,headMethod)

  .then(topic => topic.json())
  .then(topic_ids => 
    Promise.all(
      topic_ids.map(
        u =>  fetch(url + u._id ,headMethod)
        .then(response => response.json())
      )
    )
  ).then(test => {
    for(let i=0;i<test.length;i++){
      Promise.all([fetch(url + test[i]._id + "/posts",headMethod).then(reponse => reponse.json())])
      .then(rep => test[i].posts = rep[0])
    }
    return test;
  });
}

function get_serv_users (state) { // Acceder aux users
  console.log("Acceder aux users");
  const url = server + "users/";
  let headers = new Headers();
  headers.set(x_api_key_header, state.x_api_key);
  headers.set(content_type_header, content_type_value);
  const headMethod = { method : "GET", headers : headers};

  return fetch(url,headMethod)

  .then(user => user.json())
  .then(users => {
    return users
  });
}

const whoami = (state) => () => {
  const url = server + "user/whoami";
  let headers = new Headers();
  headers.set(x_api_key_header, state.x_api_key);
  headers.set(content_type_header, content_type_value);
  let response_ok = false;

  return fetch(url, { method: "GET", headers: headers }) // response.json () returns a promise of the body of the HTTP response parsed in JSON. If the request succeeded (response.ok) it contains the information of the authenticated user with his x-api-key. Otherwise (! response.ok) the request contains a code and an error message in JSON.

  .then(response => {
    response_ok= response.ok;
    return response.json();
  })
  .then(data => {
    if (response_ok) {
      return data;
    } else {
      throw(new Error(`Erreur dans la requête ${url}: ${JSON.stringify(data)}`));
    }
  });
};

const echo = (_state) => (data) => {
  const url = server + "echo";
  const body = JSON.stringify(data);
  let headers = new Headers();
  headers.set(content_type_header, content_type_value);

  return fetch(url, { method: "POST", headers: headers, body: body })
  .then(function(response) {
    if (response.ok)
      return response.json();
  })

  .catch(console.error); // / This catch catches both the rejected promises AND the exceptions. We could have written reason => console.error(reason).
};

// Main
document.addEventListener("DOMContentLoaded", function(){
  let state = new State;

  if (document.getElementById("title-test-projet")) {
    Promise.all([get_local_users(),get_local_topic()])
    .then(values => new State(values[0], values[1]))
    .then(attach_all_handlers)
    .then(state => {
      console.log(state) ;
      afficherSujet(state, false);
    })
    .catch(reason => console.error(reason));
  }
  else{
    Promise.all([get_serv_users(state),get_serv_topics(state)])
    .then(values => new State(values[0], values[1]))
    .then(attach_all_handlers)
    .then(state => {
      console.log(state) ;
      afficherSujet(state, false);
    })
    .catch(reason => console.error(reason));
  }
}, false);