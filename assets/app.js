$(document).ready(function () {  
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyB0TgVSK2TvmcUuw89Bu8NfweGezeL_t7w",
        authDomain: "rps-multiplayer-v1.firebaseapp.com",
        databaseURL: "https://rps-multiplayer-v1.firebaseio.com",
        projectId: "rps-multiplayer-v1",
        storageBucket: "rps-multiplayer-v1.appspot.com",
        messagingSenderId: "332245113145"
    };
    firebase.initializeApp(config);
    
    var database = firebase.database();
    var connectionsRef = database.ref("/connections");
    var connectedRef = database.ref(".info/connected");
    
    //adding/removing user from connection list
    connectedRef.on("value", function(snap) {
        if (snap.val()) {
            // Add user to the connections list.
            var con = connectionsRef.push(true);
            // Remove user from the connection list when they disconnect.
            con.onDisconnect().remove();
        }
    });
    
    //player data
    var player1 = {
        number: "0",
        name: "",
        wins: 0,
        losses: 0,
        turns: 0,
        choice: ""
    };
    var player2 = {
        number: "0",
        name: "",
        wins: 0,
        losses: 0,
        turns: 0,
        choice: ""
    }
    
    var waiting = false;
    
    var messages = $(".messages");
    var username = $("#playerNameInput");
    
    //adding player name, update to firebase connection
    $("#addPlayerBtn").click(function() {
        player1.name = username.val();
        if (player1.name.length > 0) {
            con.update({
                name: player1.name
            });
        }
        return false;
    });
    
    //click function for choosing move, update to firebase
    $(".move").click(function() {
        var choice = $(this).data("choice");
        var move = $(this).attr("src");
        con.update({
            choice: choice,
            choiceText: move
        });
        $(".moves-" + player1.number).hide();
        $(".choice-" + player1.number).text(move).show();
    });
    
    //game conditions
    function gameLogic(yourMove, otherMove) {
        if (yourMove === otherMove) {
            recordWin();
        }
        if (yourMove === "r" && otherMove === "s") {
            recordWin("1", "2");
        }
        if (yourMove === "r" && otherMove === "p") {
            recordWin("2", "1");
        }
        if (yourMove === "p" && otherMove === "r") {
            recordWin("1","2");
        }
        if (yourMove === "p" && otherMove === "s") {
            recordWin("2", "1");
        }
        if (yourMove === "s" && otherMove === "p") {
            recordWin("1", "2");
        }
        if (yourMove === "s" && otherMove === "r") {
            recordWin("2","1");
        }
    };
    
    //record win function
    function recordWin(winner, loser) {
        player1.turns++;
        connections.child(player1.number).update({
            choice: "",
            turns: player1.turns
        });
        if (winner) {
            if (winner === player1.number) {
                player1.wins++;
                connections.child(winner).update({
                    wins: player1.wins
                });
            }else {
                player1.losses++;
                connections.child(loser).update({
                    losses: player1.losses
                });
            }
            DOMFunctions.showGameResult(winner + " wins!" );
        }else {
            DOMFunctions.showGameResult("It's a Tie!");
        }
    }
    //Pseudocode
    //write function for when player2 connects with firebase -- or do this by managing connections?? Read on connection docu for firebase---

    //this assigns a number to each player--value is 1 or 2 depending on snapshot value
    connections.once("value", function(snapshot) {
        if (Object.keys(snapshot.val()).indexOf("1") === -1) {
            player1.number = "1";
            player2.number = "2";
        }else if(Object.keys(snapshot.val()).indexOf("2") === -1) {
            player1.number = "2";
            player2.number = "1";
        }
            
        if (player1.number !== "0") {
            con = connections.child(player.number);
            con.set(player1);
            con.onDisconnect().remove();
        }else {
            app.delete();
        }
    });
}); //end of documnet.ready()

//pseudocode:
//write a function to record wins/losses
//update what user chooses, and turns
//---update connection child data: connections.child(player1.number).update()
//if you win/loose, increase win/loss count
//show the win in the center display box

//have a function that covers all things related to changing the display of game (dom functions)
//displayPlayer1Join, displayPlayer2Info, updatePlayer1Stats, displayChat, displayGameResult

//write a function to submit chat on button click




