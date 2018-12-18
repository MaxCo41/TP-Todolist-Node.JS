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
    res.redirect('/');
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