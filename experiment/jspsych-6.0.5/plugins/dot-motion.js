/*********************************************************************
two randomly moving dot. one of them can be controlled by the mouse.
**********************************************************************/

jsPsych.plugins["dot-motion"] = (function(){

  var plugin = {};

  plugin.info = {
    name: 'dot-motion',
    description: 'two randomly moving dots. One can controlled by the mouse movement.',
    parameters: {
      controlLevel: {
        type: jsPsych.plugins.parameterType.FLOAT,
        pretty_name: 'Control Level',
        default: undefined,
        description: 'the level of control of mouse over the dot movement'
      },

      trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial duration',
        default: null,
        description: 'How long to show trial before it ends.'
      },
    }
  }

  plugin.trial = function(display_element, trial){
    /***************************************
                dot drawing things
    ****************************************/
    //set up the canvas
    var canvas = document.createElement("canvas");
    display_element.appendChild(canvas);
    var body = document.getElementsByClassName("jspsych-display-element")[0];
    body.style.margin = 0;
    body.style.padding = 0;//??
    body.style.backgroundColor = "lightgrey";//??
    canvas.style.margin = 0;
    canvas.style.padding = 0;

    var ctx = canvas.getContext("2d");

    //control the size of the canvas
    var widthCanvas = canvas.width = 1010;
    var heightCanvas = canvas.height = 600;

    //size of the "half" of the canvas
    var width = (widthCanvas - 10)/2;
    var height = heightCanvas - 100;

    //info of the dot
    var dot = { radius: 8, color: "black"};
    var dot1 = { x: 0, y: 0, angle: 0};
    var dot2 = { x: 0, y: 0, angle: 0};

    /*******The drawing functions******/
    var innerRadius = height/2 - 50;
    function drawInnerBorder(){
      ctx.strokeStyle = 'black';
      ctx.beginPath();
      ctx.arc(0, 0, innerRadius, 0, Math.PI * 2);
      ctx.stroke();
    }

    function drawDot1(){
      //move the origin to the left center
      ctx.translate(width/2, height/2)
      drawInnerBorder();

      ctx.beginPath();
      ctx.arc(dot1.x, dot1.y, dot.radius, 0, Math.PI * 2);
      ctx.fillStyle = dot.color;
      ctx.fill();

      //display A
      ctx.strokeStyle = 'black';
      ctx.beginPath();
      ctx.moveTo(0, innerRadius + 50);
      ctx.lineTo(-10, innerRadius + 80);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, innerRadius + 50);
      ctx.lineTo(10, innerRadius + 80);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-5, innerRadius + 65);
      ctx.lineTo(5, innerRadius + 65);
      ctx.stroke();
    }

    function drawDot2(){
      //move the origin to the right center
      ctx.translate(widthCanvas - width, 0);
      drawInnerBorder();

      ctx.beginPath();
      ctx.arc(dot2.x, dot2.y, dot.radius, 0, Math.PI * 2);
      ctx.fillStyle = dot.color;
      ctx.fill();

      //display B
      ctx.strokeStyle = 'black';
      ctx.beginPath();
      ctx.moveTo(0, innerRadius + 50);
      ctx.lineTo(0, innerRadius + 80);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, innerRadius + 50);
      ctx.lineTo(10, innerRadius + 50);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, innerRadius + 80);
      ctx.lineTo(10, innerRadius + 80);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, innerRadius + 65);
      ctx.lineTo(10, innerRadius + 65);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(10, innerRadius + 57.5, 7.5, Math.PI/(-2), Math.PI/2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(10, innerRadius + 72.5, 7.5, Math.PI/(-2), Math.PI/2);
      ctx.stroke();
    }

    //draw the dot after they are updated
    function draw(){
      //clear the canvas
      ctx.clearRect(0,0, widthCanvas, heightCanvas);

      ctx.strokeStyle = "black";
      drawDot1();
      drawDot2();

      //the color-changing outer boarder - the color of the boarder will change if the mouse hit that wall
      ctx.translate(width/2-widthCanvas, -height/2);
      //left side
      ctx.beginPath();
      ctx.moveTo(20, 20);
      ctx.lineTo(20, heightCanvas - 20);
      if(mouse[0] < 20 && eventListenerStatus == true)
         ctx.strokeStyle = "red";
      else
         ctx.strokeStyle = "black";
      ctx.lineWidth = 5;
      ctx.stroke();

      //right side
      ctx.beginPath();
      ctx.moveTo(widthCanvas - 20, 20);
      ctx.lineTo(widthCanvas - 20, heightCanvas - 20);
      if(mouse[0] >window.innerWidth - 20 && eventListenerStatus == true)
         ctx.strokeStyle = "red";
      else
         ctx.strokeStyle = "black";
      ctx.lineWidth = 5;
      ctx.stroke();

      //top side
      ctx.beginPath();
      ctx.moveTo(20, 20);
      ctx.lineTo(widthCanvas - 20, 20);
      if(mouse[1] < 20 && eventListenerStatus == true)
         ctx.strokeStyle = "red";
      else
         ctx.strokeStyle = "black";
      ctx.lineWidth = 5;
      ctx.stroke();

      //bottom side
      ctx.beginPath();
      ctx.moveTo(20, heightCanvas - 20);
      ctx.lineTo(widthCanvas - 20, heightCanvas - 20);
      if(mouse[1] > window.innerHeight - 20 && eventListenerStatus == true)
         ctx.strokeStyle = "red";
      else
         ctx.strokeStyle = "black";
      ctx.lineWidth = 5;
      ctx.stroke();
      ctx.lineWidth = 1;

      if (firstFrame == null)
        firstFrame = 0;
    }

    /*********The update functions*********/
    //the range of angle, distance of movement
    var range = Math.PI /8;
    var distance;

    //let the dot pop out from the other side
    function distanceToCenter(dotn){
      return Math.pow(dotn.x * dotn.x + dotn.y * dotn.y, 1/2);
    }

    function avoidEdge(dotn){
      //if the dot is on the x-axis
      if(dotn.y == 0){ dotn.angle = Math.PI - dotn.angle;}
      //if the dot is on the y-axis
      else if (dotn.x == 0){dotn.angle = 2*Math.PI - dotn.angle;}
      //other conditions
      else{
        //calculate the slope of the tangent line
        var slopeTan = (-1) * dotn.x / dotn.y;
        //calculate the angle of the tangent line
        var angleOfSlope = Math.atan(slopeTan);
        //change the angle of the dot movement
        dotn.angle = 2 * angleOfSlope - dotn.angle;
        //change the location of the new dot
        newDot.x = dotn.x + distance * Math.cos(dotn.angle);
        newDot.y = dotn.y + distance * Math.sin(dotn.angle);
      }
    }

    //generate new angle and move the dot
    var newDot = {x: 0, y: 0}
    var oldDot = {x: 0, y: 0}
    function newAngle(dotn){
      if (firstFrame == null)
        dotn.angle = Math.random() * 2 * Math.PI;
      else
        dotn.angle = Math.random() * (range + Math.PI / 180) + (dotn.angle - range / 2);

      newDot.x = dotn.x + distance * Math.cos(dotn.angle);
      newDot.y = dotn.y + distance * Math.sin(dotn.angle);

      if (distanceToCenter(newDot) >= (innerRadius - dot.radius)){
        oldDot.x = dotn.x; oldDot.y = dotn.y;
        avoidEdge(dotn);
      }
      else{
        oldDot.x = dotn.x; oldDot.y = dotn.y;
        dotn.x = newDot.x; dotn.y = newDot.y;
      }
    }

    //let the mouse movement influence the trajectory
    var latestDot = {x: 0, y: 0};
    function mouseControl(dotn){
      //calculate the mouse trajectory and move the new dot
      if (mouse[2] !== mouse[0] || mouse[3] !== mouse[1]){
        newDot.x += trial.controlLevel * (mouse[2] - mouse[0]);
        newDot.y += trial.controlLevel * (mouse[3] - mouse[1]);
        //move the dot
        latestDot.x = oldDot.x + (distance * (newDot.x - oldDot.x) / Math.pow( Math.pow(oldDot.x - newDot.x ,2) + Math.pow(oldDot.y - newDot.y ,2),1/2));
        latestDot.y = oldDot.y + (distance * (newDot.y - oldDot.y) / Math.pow( Math.pow(oldDot.x - newDot.x ,2) + Math.pow(oldDot.y - newDot.y ,2),1/2));
        //prevent mouse control from moving the dot outside the circle
        if (distanceToCenter(latestDot)>= (innerRadius - dot.radius)){
          dotn.x = oldDot.x; dotn.y = oldDot.y;
       }
        else{
          dotn.x = latestDot.x; dotn.y = latestDot.y;
       }
      }
    }

    var oldDot = {x: 0, y: 0};
    function updateDot(){
      //record the position of the old dot
      newAngle(dot1);
      if (controlPower == 0){
        mouseControl(dot1);
      }

      newAngle(dot2);
      if (controlPower == 1){
        mouseControl(dot2);
      }
    }

    //to separate the first frame
    var firstFrame;
    //prepare for recording the mouse location relative to the screen
    var mouse = [0, 0, 0, 0]; // 0 = old x, 1 = old y, 2 = new x, 3 = new y
    var mousePos = {x: 0, y: 0};
    var eventListenerStatus = false;
    function oldMouseFunc(){mouse[0] = mousePos.x; mouse[1] = mousePos.y;}
    function newMouseFunc(){mouse[2] = mousePos.x; mouse[3] = mousePos.y;}
    var controlPower;
    function mouseRecorder(e){
      mousePos.x = e.clientX; mousePos.y = e.clientY;
      eventListenerStatus = true;
    }
    function animateDotMotion(){
      var frameRequestID = window.requestAnimationFrame(animate);
      //randomly select the dot that is controlled by the mouse
      controlPower = Math.floor(Math.random() * 2);

      function animate(){
        if(stopDotMotion){
          window.cancelAnimationFrame(frameRequestID);
          //kill event listener
          document.removeEventListener("mousemove", mouseRecorder);
          //display the end_trial questions
          endTrialQuestions();
        }
        else{
          //randomize the speed in each frame
          distance = Math.random() * 2 + 0.5;
          //start mouse movement listener & collect mouse location
          document.addEventListener("mousemove", mouseRecorder);
          newMouseFunc();

          updateDot();
          //collect mouse location
          oldMouseFunc();
          draw();
          frameRequestID = window.requestAnimationFrame(animate);
        }
      }
    }
    animateDotMotion();

    var stopDotMotion = false;
    //end trial according to trial trial_duration
    if (trial.trial_duration !== null){
      jsPsych.pluginAPI.setTimeout(function(){stopDotMotion = true;}, trial.trial_duration)
    }

    /***********************************************
                  End tiral questions
    *************************************************/
    function endTrialQuestions(){
      //display blank screen for 0.5 seconds
      displayBlankScreen();
      function displayBlankScreen(){

        var frameRequestID = window.requestAnimationFrame(blankScreen);

        function blankScreen(){
          if(stopBlankScreen){
            ctx.clearRect(0,0, widthCanvas, heightCanvas);
            window.cancelAnimationFrame(frameRequestID);
            firstQuestion();
          }
          else{
            ctx.clearRect(0,0, widthCanvas, heightCanvas);
            ctx.rect(0, 0, widthCanvas, heightCanvas);
            ctx.fillStyle = "lightgrey";
            ctx.fill();
            frameRequestID = window.requestAnimationFrame(blankScreen);
          }
        }
      }

      var stopBlankScreen = false;
      jsPsych.pluginAPI.setTimeout(function(){stopBlankScreen = true;}, 500) //display the blank screen for 500ms

      var response = {AorB: null, confidenceLevel: null};
      var keyboardListener;
      var timer1 = setTimeout(function(){endFailTrial();}, 2000);
      function firstQuestion(){
        //display the question
        display_element.innerHTML = "<p> Which dots were you better able to control? </p><p> Press Q for dot A. Press R for dot B </p>";
        //start the keyboard listener
        keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
          callback_function: secondQuestion,
          valid_responses: ['q', 'r'],
          persist: false,
          allow_held_key: false
        });
      }

      var timer2 = setTimeout(function(){endFailTrial();}, 4000);
      function secondQuestion(info){
        //kill timer1
        clearTimeout(timer1);
        //collect the data from the first question
        if (response.AorB == null){
          response.AorB = info.key;
        }
        //kill the keyboardListener
        if (typeof keyboardListener !== 'undefined'){
          jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
        }

        //display the second question
        display_element.innerHTML = "<p> How confident are you over your judgment? </p>" +
                                    "<p> 1 2 3 4</p>";
        //start the keyboard listener
        keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
          callback_function: end_trial,
          valid_responses: ['1', '2', '3', '4'],
          persist: false,
          allow_held_key: false
        });
      }

      function endFailTrial(){
        //clean the screen
        display_element.innerHTML = "";
        //kill timer
        clearTimeout(timer1);
        clearTimeout(timer2);
        //kill the keyboardListener
        if (typeof keyboardListener !== 'undefined'){
          jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
        }
        //display the message
        display_element.innerHTML = "<p>No answer in 2 seconds. Trial aborted.</p><p>The next trial will automatically start in 5 seconds</p>"
        //end the trial
        var trial_data = {"controlLevel": -1, "correct": false, "confidenceLevel": -1, "key_press": -1};
        setTimeout(function(){display_element.innerHTML = ""; jsPsych.finishTrial(trial_data);}, 5000);
      }

      function end_trial(info){
        //kill timer2
        clearTimeout(timer2);
        //clean the screen
        display_element.innerHTML = "";
        //collect the data from the second question
        if (response.confidenceLevel == null){
          response.confidenceLevel = info.key;
        }
        //kill the keyboardListener
        if (typeof keyboardListener !== 'undefined'){
          jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
        }

        //check the answer
        var answerChecker = false;
        if (controlPower == 0 && response.AorB == jsPsych.pluginAPI.convertKeyCharacterToKeyCode('q'))
          answerChecker = true;
        if (controlPower == 1 && response.AorB == jsPsych.pluginAPI.convertKeyCharacterToKeyCode('r'))
          answerChecker = true;

        //convert the confidence level
        if (response.confidenceLevel == 52)
          response.confidenceLevel = 4;
        else if (response.confidenceLevel == 51)
          response.confidenceLevel = 3;
        else if (response.confidenceLevel == 50)
          response.confidenceLevel = 2;
        else
          response.confidenceLevel = 1;

        //collect data and end the trial
        var trial_data = {"controlLevel": trial.controlLevel, "correct": answerChecker, "confidenceLevel": response.confidenceLevel, "key_press": response.AorB};
        jsPsych.finishTrial(trial_data);
      }
    }

  };

  return plugin;
})();
