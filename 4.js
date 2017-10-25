//not very important.
var socket= io();
var board,
		  game = new Chess(),
		  statusEl = $('#status'),
		  fenEl = $('#fen'),
		  pgnEl = $('#pgn');
var userId;
var playerC;
var color;
var usersO = [];
var MyuserId;


//when clicket we send info to Server given it the id.		  
function myFunction() {
	userId=document.getElementById("myText").value;
	MyuserId=userId;
	socket.emit('login',userId);
	usersO.push(userId);
	//document.getElementById("userOnlineList").innerHTML="";

	
}
//not important
socket.on('recivedlog', function(msg){
	

});

socket.on("usersList", function(list){
	//alert(MyuserId);
	var z;
	var counter=0;
	list.forEach(function(id){
		//alert("potato0");

		if(id!=MyuserId){
			//alert("donothing");
			z= "#" + id;
		//document.getElementById('userOnlineList').innerHTML = '';
			if($(z).length == 0) {
				//alert("yes");
				$("#userOnlineList").append($("<button>").attr('id',id).text(id).on("click",function(){
					//what we want here is to emit both userID and the id of oppenent to servier.
						var invite = {
							UserID: MyuserId,
							oppId : id
						};
						socket.emit("invite", invite);
						
				}));
				
			}
		}
	});
});


socket.on("ingame",function(inGame){
	var p=inGame.length;
	for(var i=0; i <p;i++){
		if(inGame[i]!=MyuserId){
		console.log(i);
		console.log(inGame[i]);
		document.getElementById(inGame[i]).disabled=true;
		}
	}
});
//getting the opt color from the servier	
socket.on("opColor",function(msg){
		color=msg;
	});
		// do not pick up pieces if the game is over
		// only pick up pieces for the side to move
		//AND DONT MOVE PICES OF OPINIENT
var onDragStart = function(source, piece, position, orientation) {

	
	
	document.getElementById("myText").value=color;
	if (game.game_over() === true ||
        (game.turn() === 'w' && piece.search(/^b/) !== -1) ||
        (game.turn() === 'b' && piece.search(/^w/) !== -1) ||
		(game.turn()==color)){
			return false;
		}
};


//get the move from server and move pices
socket.on("turn",function(msg){
	game.move(msg);
	board.position(game.fen());
});

//moving the pices
var onDrop = function(source, target) {
 // see if the move is legal
	var b;
	var move = game.move({
		from: source,
		to: target,
		promotion: 'q' // NOTE: always promote to a queen for example simplicity
		});
	//we get the value of the userid
	//then we emit it to the server with the move of the player.
	var x= document.getElementById("myText").value;
	var send = {
		player: x,
		move : move
	};
	socket.emit("move",send);
		  // illegal move
		  if (move === null) return 'snapback';
		  b=updateStatus();
	document.getElementById("myText").value=b;
};

		// update the board position after the piece snap 
		// for castling, en passant, pawn promotion
var onSnapEnd = function() {
	board.position(game.fen());
};

//we probably wont use these functions
var updateStatus = function() {
	var status = '';
	var moveColor = 'White';
	if (game.turn() === 'b') {
		moveColor = 'Black';
	}

		  // checkmate?
	if (game.in_checkmate() === true) {
		status = 'Game over, ' + moveColor + ' is in checkmate.';
	}

		  // draw?
	else if (game.in_draw() === true) {
		status = 'Game over, drawn position';
	}

		  // game still on
	else {
		status = moveColor + ' to move';

			// check?
		if (game.in_check() === true) {
			status += ', ' + moveColor + ' is in check';
		}
	}

	statusEl.html(status);
	fenEl.html(game.fen());
	pgnEl.html(game.pgn());
	return status;
};


//the user get their color from the server
socket.on('color',function(msg){
	playerC=msg;


	var cfg = {
		draggable: true,
		orientation: playerC,
		position: 'start',
		showNotation: false,
		onDragStart: onDragStart,
		onDrop: onDrop,
		onSnapEnd: onSnapEnd
};
board = ChessBoard('board', cfg);
});

updateStatus();