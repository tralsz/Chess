var express = require('express');
var app = express();
app.use(express.static(__dirname, { index: '4.html' }));
var http = require('http').Server(app);
var port = 3000;
var io = require('socket.io')(http);
var users={}
var counter= 1;
var clients={};
var usersList= [];
var cli={};
var inGame=[];
io.on('connection', function(socket){
	console.log('new connection');
	socket.on('login',function(msg){
		console.log("recived log in")
		console.log(users)
		io.emit("usersList", usersList);
		io.emit("ingame",inGame);
		if( counter> 1){
			
		
		}//going to send list
		if (!users[msg]) {    
			//console.log('creating new user');
			usersList.push(msg);//pushing it to an array of all users id
			users[msg] = socket.id;
			console.log("socketid " +socket.id);
			console.log("socket " + socket);
			cli[socket.id]=msg;

			io.emit("usersList", usersList);
			//console.log(usersList);
		} 
		else {
			//console.log('user found!');
		}
		socket.on("disconnect",function(){
			console.log("dc " + socket.id)
			var DsUser;
			DsUser=cli[socket.id];
			var s=inGame.indexOf(DsUser);
			console.log(inGame);
			inGame.splice(s,1);
			console.log(inGame);
			var x=usersList.indexOf(DsUser);
			console.log("before: "+usersList);
			usersList.splice(x,1);
			console.log("After : "+ usersList);
			io.emit("usersList", usersList);
		});
		//socket.emit("usersList", usersList);
		clients[counter]=msg;
		counter=counter+1
		//console.log("userlist: " + usersList);
		
		//console.log(users[msg]);
		
		//console.log("recived log in1")
		io.to(users[msg]).emit('recivedlog', 'done');
		// if(counter==3){
			
			////console.log(counter);
			// io.to(users[clients[1]]).emit('color','white');
			// io.to(users[clients[1]]).emit('opColor',"b");
		
			// io.to(users[clients[2]]).emit('color','black');
			// io.to(users[clients[2]]).emit('opColor',"w");
		// }
		// socket.on("disconnect",function(){
			// var index = require('indexof');
			// var a = index(users, socket.id);
			////var a = users.indexof(socket.id);
			// console.log(a);
		// });
	});//socket.on connection
	socket.on("invite",function(invite){
		inGame.push(invite.UserID);
		inGame.push(invite.oppId);
		
		
		console.log(invite.UserID);//who ever invited get white.
		console.log(invite.oppId);
		io.to(users[invite.UserID]).emit('color','white');
		io.to(users[invite.UserID]).emit('opColor','b');
	
		
		io.to(users[invite.oppId]).emit('color','black');
		io.to(users[invite.oppId]).emit('opColor','w');
		
		console.log("Game should start bewteen "+ invite.UserID + " and " + invite.oppId);
		console.log(inGame);
		io.emit("ingame",inGame);
	});
	socket.on("move",function(msg){
		//console.log(msg);
		console.log("socket.id : " + socket.id);
		console.log("id of socket: " + cli[socket.id]);
		socket.broadcast.emit('turn',msg.move);
		//io.to(users[clients[2]]).emit("turn",msg.move);
	});
});//io.on


http.listen(port, function() {
    console.log('listening on *: ' + port);
});