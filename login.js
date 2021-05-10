var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');

//conexão com o mysql
var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'clube_do_livro'
});

var app = express();
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname + '/login2.html'));
});

app.get('/home', function(request, response) {
	if (request.session.loggedin) {
		response.send('Bem vindo(a), faça o login!');
	} else {
		response.send('Por favor, faça o login!');
	}
	response.end();
});

app.get('/homeapi', function(request, response) {
	response.sendFile(path.join(__dirname + '/index.html'));
});



app.post('/auth', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	if (username && password) {
		connection.query('SELECT * FROM usuarios WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.username = username;
				response.redirect('/homeapi')
				
			} else {
				response.send('Email ou senha incorretos!');
			}			
			response.end();
		});
	} else {
		response.send('Por favor, entre com o seu email e senha!');
		response.end();
	}
});




app.post('/registro', function(request, response) {
	var username = request.body.username;
	var email = request.body.email;
	var password = request.body.password;
		connection.query('INSERT INTO usuarios (username, password) VALUES (?, ?)', [username, password] );
		if (request.body.username == username){
			response.redirect('/home');

		}
		
});

app.listen(5000);
