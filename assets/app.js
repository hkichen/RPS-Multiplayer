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

//Initialized connection to firebase
//assign player number as 1 or 2
//remove player when disconnected
connectionsRef.once("value", function(snapshot) {
    if (Object.keys(snapshot.val()).indexOf("1") === -1) {
        player1.number = "1";
        player1.number = "2";
    }else if (Object.keys(snapshot.val()).indexOf("2") === -1) {
        player1.number = "2";
        player2.number = "1";
    }
    if (player1.numner !== "0") {
        var con = connections.child(player1.number);
        con.set(player1);
        con.onDisconnect().remove();
    }else {
        $(".form-inline").remove();
        $(".alert").show();
        app.delete();
    }
});

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

//event listener on firebase side
connections.on("value"), function(snapshot) {
    if(con) {
        if (object.keys(snapshot.val()).indexOf(player2.number) !== -1) {
            player2 = snapshot.val() [player2.number];
            player1 = snapshot.val() [player1.number];
            if (player2.name.length > 0) {
                DONFunctions.showPlayer2Info();
                if (player1.name.length > 0) {
                    var choice1 = snapshot.val() ["1"].choice;
                    var choice2 = snapshot.val() ["2"].choice;
                    var turns1 = snapshot.val() ["1"].turns;

                    if (choice1.length > 0 && choice2.length > 0) {
                        getWinner(choice1, choice2);
                    }else if (choice1.length === 0 && turns1 === 0) {
                        DOMFunctions.showMoveOptions("1");
                    }else if (choice1.length === 0 && choice1.length === 0) {
                        DOMFunctions.showMoveOptions("2");
                    }
                }
            }
        }else if (player2.name.length > 0 && Object.keys(snapshot.val()).indexOf(player2.number) === -1) {
            $(".turn").text("Player left. Please wait for another player...");
            $(".waiting-" + player2.number).show();
            $("#player2Name" + player2.number).empty();
            $()
        }

    }
}