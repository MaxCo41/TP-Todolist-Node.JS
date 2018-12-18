var app = require('express')();
var session = require('cookie-session'); // Charge le middleware de sessions
var bodyParser = require('body-parser'); // Charge le middleware de gestion des paramètres
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var ent = require('ent');

var todolist = [];





//Affichage de la liste et du formulaire
app.get('/', function(req, res){
    res.render('todo.ejs', {todolist: todolist});
})

// Redirige vers la todolist si page demandée pas trouvé
app.use(function(req, res, next){
    res.redirect('/todo');
})

//echange avec socket.io
io.sockets.on('connection', function(socket){
    /* console.log('User is connected'); */

    // Envoi de la todo en temps réel
    socket.emit('todolist', todolist);

    //ajout d'une todo à la liste
    socket.on('addTodo', function(todo){
        console.log(todo);
        
        todo = ent.encode(todo);
        todolist.push(todo);
        
        index = todolist.length -1;

        //Envoi à tous les users
        socket.broadcast.emit('addTodo', {todo: todo, index:index});
    });

    //Delete Todo
    socket.on('deleteTodo', function(index){
        todolist.splice(index, 1);
        io.sockets.emit('todolist', todolist);
    });
    
});



server.listen(8080);


/* S'il n'y a pas de todolist dans la session,
on en crée une vide sous forme d'array avant la suite */
/* .use(function(req, res, next){
    if (typeof(req.session.todolist) == 'undefined') {
        req.session.todolist = [];
    }
    next();
}) */

/* On affiche la todolist et le formulaire */
/* .get('/todo', function(req, res) { 
    res.render('todo.ejs', {todolist: req.session.todolist});
}) */

/* On ajoute un élément à la todolist */
/* .post('/todo/ajouter/', urlencodedParser, function(req, res) {
    if (req.body.newTodo != '') {
        req.session.todolist.push(req.body.newTodo);
    }
    res.redirect('/todo');
}) */

/* Supprime un élément de la todolist */
/* .get('/todo/supprimer/:id', function(req, res) {
    if (req.params.id != '') {
        req.session.todolist.splice(req.params.id, 1);
    }
    res.redirect('/todo');
}) */

/* On redirige vers la todolist si la page demandée n'est pas trouvée */
/* .use(function(req, res, next){
    res.redirect('/todo');
}) */

