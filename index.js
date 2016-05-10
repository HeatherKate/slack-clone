;(function(){
	"use strict";
	
	var PORT = 3000;
	
	var fs = require('fs');
	
	var express = require('express');
	var bodyParser = require('body-parser');
	var cookieParser = require('cookie-parser');
	var expressSession = require('express-session');
	var users = require ('./users.js');
	var config = require('./config.js');
	
	var app = express();
	
	var mongoose = require ('mongoose');
	
	mongoose.connect("mongodb://localhost");
	
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({extended: true}));
	app.use(cookieParser());
	app.use(expressSession({
		secret: config.secret,
		resave: true,
    	saveUninitialized: true
	}));
	
	var Message = mongoose.model("Message",{
		text: String,
		username: String
	});
	
	app.get("/", function(req, res) {
		if (!req.session.username) {
			res.redirect("/login");
			return;
		}
		
		res.sendFile(__dirname + "/public/index.html");
	});
	
	app.get("/messages", function(req, res){
		if (!req.session.username) {
			res.send("[]");
			return;
		}
		
		res.send(JSON.stringify(messages));
	});
	
	app.post("/messages", function(req, res){
		if (!req.session.username) {
			res.send("error");
			return;
		}
		
		if(!req.body.newMessage){
			res.send("error");
			return;
		}
		messages.push(req.body.newMessage);
		res.send("success");
	});
	
	app.get("/login", function(req, res){
		res.sendFile(__dirname + '/public/login.html');
	});
	
	
	function logInUser(username, password, callback) {
		var allUsers = users.getUsers(function(users){
			for (var i=0; i < users.length; i++){
				if (users[i].username == username && users[i].password == password) {
					callback (true);
				} 
			} callback (false);
		});
	}
	
	app.post("/login", function(req, res){
		if(req.body.username && req.body.password){
			if (logInUser(req.body.username, req.body.password, function(success){
					req.session.username = req.body.username;
				res.redirect("/");
				return;
			}));
		} res.redirect("/login");
	});
	
	app.use(express.static('public'));
	
	app.use(function(req, res, next) {
		res.status(404);
		res.send("File not found");
	});
	
	app.listen(PORT, function() {
		console.log("server started on port " + PORT);
	});
	
}());









