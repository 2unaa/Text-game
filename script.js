var game_data;
var current_state;

var stim = 0;
var dope = 0;
var time;


setTimeout(function(){
            $('#splash').hide();
            $('#main').show();
            }, 3000);

$.getJSON( "game.json", function( data ) {
        game_data = data;
        
        current_state = data['start_state'];
        $('#game_text').html( game_data['states'][ data['start_state'] ]['text'] ); 
        
        var textColor = game_data['states'][current_state]['text_color'];
        $('#game_text').css('color', textColor);

        setBackgroundImage()
});

//function to start the timer
function startTimer() {
    var currentStateData = game_data['states'][current_state];
    if (currentStateData && currentStateData['timer']) {
        var timerDuration = currentStateData['timer']; //time in seconds
        var endTime = Date.now() + timerDuration * 1000; //When it expires
        //updates the display
        time = setInterval(function() {
            var remainingTime = Math.max(0, Math.ceil((endTime - Date.now()) / 1000)); //remaining time left
            $('#timer').text(remainingTime); //display it
            //resets the timer
            if (remainingTime <= 0) {
                clearInterval(time); //clear the timer
                next_state("Timer_stim"); //move to the timer end state
            }
        }, 1000);
    }
}



function next_state( state) {
    console.log("Current State = " + current_state + " --> New State= " + state) 
    current_state = state
    console.log("Timer done. " + time) 
    clearInterval(time);

    $('#timer').text('10');

    if (game_data['states'][ current_state ]['text'] != null){
        $('#game_text').html( game_data['states'][ current_state ]['text'] );

        if (game_data['states'][current_state]['text_color']) { //gets the text color
            $('#game_text').css('color', game_data['states'][current_state]['text_color']);
        } else {
            //default color
            $('#game_text').css('color', 'black');
        }
        //if show title is null, hide the title
        if(game_data['states'][ current_state ]['show_title'] == null){
            $('#title').hide();
        }
        //if there is a show lost, show it
        if(game_data['states'][ current_state ]['show_lost'] != null){
            $('#lost').show();
        }
        else
        {
            $('#lost').hide();
        }
        //if there is a show won, show it
        if(game_data['states'][ current_state ]['show_won'] != null){
            $('#won').show();
        }
        else
        {
            $('#won').hide();
        }
        //if there is a show none
        if(game_data['states'][ current_state ]['show_none'] != null){ 
            $('#but_a').hide(); //hide the all three buttons
            $('#but_b').hide();
            $('#but_cont').hide();
        }
        else if (game_data['states'][ current_state ]['show_cont'] != null){ //if there is a show cont
            $('#but_a').hide(); //hide the other two buttons, only show the continue and reset ones
            $('#but_b').hide();
            $('#but_cont').show();
        }
        else
        {
            $('#but_a').show(); //show the other two buttons and hide the continue
            $('#but_b').show();
            $('#but_cont').hide();
        }

        //updates the button texts
        if (game_data['states'][ current_state ]['next_state'] && game_data['states'][ current_state ]['next_state'].length >= 2) { //changes the buttons if it has 2 or more
            $('#but_a').text(game_data['states'][ current_state ]['next_state'][0]['button_text']);
            $('#but_b').text(game_data['states'][ current_state ]['next_state'][1]['button_text']);
        }

        //hides or displays timer depending on the state
        if (game_data['states'][ current_state ]['timer'] == null) {
            $('#timer_container').hide();
        } else {
            $('#timer_container').show();
            startTimer(); //starts the timer (if needed)
        }
    
        setBackgroundImage(); // Call to change background image

    } else {
        console.log("no text");

        if (game_data['states'][ current_state ]['stim_change'] != null){
            console.log("+", game_data['states'][ current_state ]['stim_change'] + " stim") 
            stim += game_data['states'][ current_state ]['stim_change']
        }
        
        if (game_data['states'][ current_state ]['dope_change'] != null){
            console.log("+", game_data['states'][ current_state ]['dope_change'] + " dope" ) 
            dope += game_data['states'][ current_state ]['dope_change']
        }
        next_state(game_data['states'][ current_state ]['next_state']) 

    }
}

//When the user clicks restart
function refreshPage() {
    location.reload(); 
}


//for the background picture
function setBackgroundImage() {
    if (game_data && game_data['states'][current_state] && game_data['states'][current_state]['image_change']) {
        var backgroundImage = game_data['states'][current_state]['image_change'];
        document.body.style.backgroundImage = `url(${backgroundImage})`;
    }
}

//event listener for the music
document.addEventListener("DOMContentLoaded", function() {
    var audio = document.getElementById("bg_music");
    var musicButton = document.getElementById("musicButton");

    function toggleMusic() {
        if (audio.paused) {
            audio.play();
            musicButton.textContent = "Pause Music";
        } else {
            audio.pause();
            musicButton.textContent = "Play Music";
        }
    }
    //attaches the onclick event to the button
    musicButton.addEventListener("click", toggleMusic);
});


function key_input(what_key){
    if (game_data && game_data['states'][current_state] && game_data['states'][current_state]['next_state']) {
    for(i=0; i< game_data['states'][current_state]['next_state'].length; i++){
        if( what_key == game_data['states'][current_state]['next_state'][i]['key_input']) {
            next_state(game_data['states'][current_state]['next_state'][i]['state_name'])
            break;
        } 
    }
}


    console.log(what_key);
}