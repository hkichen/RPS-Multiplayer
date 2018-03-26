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

// When first loaded or when the connections list changes...
//connectionsRef.on("value", function(snap) {
    
    // Display the viewer count in the html.
    // The number of online users is the number of children in the connections list.
   // $("#connected-players").text(snap.numChildren());
//});

//gameplay functions
var numOfPlayers = 2
var yourWins = 0;
var yourLosses = 0;
var ties = 0;
var opponentWins = 0;
var opponentLosses = 0;

function mainClickOptions(){
    $("#rock").click(function(){
        gamePlay("rock");
        console.log("rock");
    })
    $("#paper").click(function(){
        gamePlay("paper");
    })
    
    $("#scissor").click(function(){
        gamePlay("scissor");
    })
};

mainClickOptions();

//use switch case, not if/else to shorten code
function gamePlay(yourChoice, opponentChoice) {
    switch(yourchoice) {
        case 'rock':
        switch(opponentChoice) {
            case 'rock':
            return 'tie';
            case 'paper':
            return 'lose';
            case 'scissors':
            return 'win';
        }
        break;
        case 'paper':
        switch(opponentChoice) {
            case 'rock':
            return 'win';
            case 'paper':
            return 'yie';
            case 'scissors':
            return 'lose';
        }
        break;
        case 'scissors':
        switch(opponentChoice) {
            case 'rock':
            return 'lose';
            case 'paper':
            return 'win';
            case 'scissors':
            return 'tie';
        }
        break;
    }
}