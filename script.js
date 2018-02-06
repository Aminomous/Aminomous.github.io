var currentQuestion;
var currentResource;
var timer;
var score;
var correctNumber;
var questionTimer;
var questionUsed;
var questions;
var choices;
var questionNumber;
var dectimer;
var resources;
printdebug = function (param){
    console.log(param + " Working")
};
setQuestionNumber = function(param){
    // questionNumber = param;
    questionNumber = param;
};

clearCurrentQuestion = function(){
    if(null != currentQuestion){
        $(".question").empty();
        $(".choices").empty();
    }
}

showQuestion = function(){
    
    let n = Math.ceil(Math.random()*100) % 20 + 1;
    for (let q of questionUsed){
        if (q == n){
            showQuestion();
            return;
        }
    }
    questionUsed.push(n)
    for (let i = 0 ; i < questions.length ; i++){
        if (questions[i].id == n){
            currentQuestion = questions[i];
            currentResource = resources[i];
            break;
        }
    }
    let temp;

    $(".question").append("<h2 id='currentQuestion'> " + currentQuestion.question + " </h2>")
    if (currentResource.content == "img"){
        $(".question").append("<img src='" + currentResource.src + "'/>")
    }else if (currentResource.content == "audio"){
        $(".question").append("<audio controls autoplay> <source src='"+ currentResource.src + "' type='audio/mpeg'> </audio>")
    }
    for (let j = 0 ; j < currentQuestion.choices.length ; j++){

        $(".choices").append("<button class='choice' id='c" + (j+1) + "' onclick='answer(" + (j+1) +")'> " + currentQuestion.choices[j].choice + "</button>")
        if (currentResource.choices[j].src != ""){
            $("#c" + (j+1)).css("width", "220px");
            $("#c" + (j+1)).css("height", "220px");
        }
        $("#c" + (j+1)).append("<img src='" + currentResource.choices[j].src + "' onerror='this.style.display=" + '"none"' +"'>")
    }
    if (currentQuestion.choices.length == 0){
        $(".choices").append("<input id='answer'>");
        $(".choices").append("<button class='choice' onclick='answer(" + document.getElementById("answer").value +")'> " + "Answer" + "</button>")        
    }
};
readJSONFile = function(param){
    return $.getJSON(param + ".json", function(data, status){
    });
}

updateScore = function(param){
    score += param;
    $("#score").text("Score " + score)
}

setTimer = function(){
    $("#timer").text("Time taken " + timer);
    $("#questionTimer").text("Remaining time " + questionTimer);
}

countdown = function(param){
    $("#countdown").remove();
    if (param == 0){
        return;
    }
    $(".game-container").append("<p id='countdown' style='font-size:64pt'>" + param +"</p>");
    setTimeout(function(){
    countdown(param-1)
    }, 1000)
}
startGame = function(){
    test = readJSONFile("questions")
    src = readJSONFile("question-src")
    
    setTimeout(test.done(function(json){
        questions = json;
    }), 1000)    
    setTimeout(src.done(function(json){
        resources = json;
    }), 1000)
    currentQuestion = [];
    timer = 0;
    score = 0;
    correctNumber = 0;
    questionTimer = 5;
    questionUsed = [];
    questions = [];
    choices = [];
    countdown(3)
    setTimeout(showQuestion,3000);
    setTimeout(function(){
        dectimer = setInterval(decQuestionTimer, 1000)
    }, 3000)
    updateScore(0)
    setTimer()
};

answer = function(param){
    if (currentQuestion.answer == param){
        correct()
    }else{
        wrong()
    }
    changeQuestion()
}

correct = function(){
    updateScore(100)
}
wrong = function(){
    updateScore(-100)
}

changeQuestion = function(){
    if (questionNumber == questionUsed.length){
        clearCurrentQuestion();
        endGame();
    }else{
        questionTimer = 5;
        clearCurrentQuestion();
        showQuestion();
    }
}

endGame = function(){
    window.clearInterval(dectimer)
    $("#timer").css("font-size", "64pt")
    $("#score").css("font-size", "64pt")
    $("#questionTimer").remove()
    $(".main-content").append("<button onclick='location.reload()' style='width:100px; height:50px; background-color:white;'>" + "Play again?" + "</button>");
}

decQuestionTimer = function(){
    questionTimer -= 1;
    timer += 1;
    if (questionTimer == 0){
        changeQuestion();
    }
    
    setTimer();
}
switchToGame = function(){
    $(".start-menu").hide();
    $(".game-container").show();
    startGame();
};

switchToMenu = function(){
    $(".start-menu").show();
    $(".game-container").hide();
};

$(document).ready(function(){
    $(".game-container").hide()
    
});