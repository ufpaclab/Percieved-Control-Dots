/**
* jspsych-space-daw-stim
* Wouter Kool
*
* plugin for displaying a space and aliens version of the Daw 2-step task
*
* adapted to jsPsych 6.0 plugin
**/

jsPsych.plugins["space-daw-alien-stim"] = (function() {

		var plugin = {};

		//var score = 0; not sure why we need this

		//var displayColor = '#0738db';
		//var borderColor = '#197bff';
		//var textColor = '#b8fff6';

		plugin.info = {
			name: 'space-daw-alien-stim',
			description: 'plugin for displaying a space and aliens version of the daw 2-step task, jsPsych 6.0 version',
			parameters:{
					choices:{
						type: jsPsych.plugins.parameterType.KEYCODE,
						pretty_name: 'Choices',
						default: jsPsych.NO_KEYS,
						description: 'the choices they can make',
					},

					p:{
						type: jsPsych.plugins.parameterType.INT,
						pretty_name: 'P',
						default: undefined,
						description: 'the subject will be given a treasure when p is 1 and will not receive anything when p is 0',
					},

					state_name:{
						type: jsPsych.plugins.parameterType.STRING,
						pretty_name: 'State name',
						default: 'green',
						description:'the name of the state'
					},

					feedback_time:{
						type: jsPsych.plugins.parameterType.INT,
						pretty_name: 'Feedback time',
						default: 500,
						description:'the time it waits to show the feedback i.e. the treasure',
					},

					ITI:{
						type: jsPsych.plugins.parameterType.INT,
						pretty_name:'Inter-trial interval',
						default: 500,
						description:'inter-trial interval'
					},

					points_time:{
						type: jsPsych.plugins.parameterType.INT,
						pretty_name: 'Points time',
						default: 1000,
						description:'time before clearing the display'
					},
			}
		}

		plugin.trial = function(display_element, trial){

			// if any trial variables are functions
			// this evaluates the function and replaces
			// it with the output of the function

			//trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);

			if (Math.random()<0.5) { // left response
				position = 'left';
				other_position = 'right';
				choices = 'F';
			} else {
				position = 'right';
				other_position = 'left';
				choices = 'J';
			}

			state_name = trial.state_name;
			if (state_name == 'green') {
				var state_color = [35, 63, 39];
			}
			if (state_name == 'yellow') {
				var state_color = [240, 187, 57];
			}

			// store responses
			var setTimeoutHandlers = [];

			var keyboardListener = new Object;

			// function to end trial when it is time
			var end_trial = function() {

				kill_listeners();
				kill_timers();

				//jsPsych.data.write(trial_data);

				var handle_points = setTimeout(function() {
					// clear the display
					display_element.innerHTML = '';
					$('.jspsych-display-element').css('background-image', '');

					// move on to the next trial
					var handle_ITI = setTimeout(function() {
						jsPsych.finishTrial();
					}, trial.ITI);
					setTimeoutHandlers.push(handle_ITI);
				}, trial.points_time);
				setTimeoutHandlers.push(handle_points);
			};

			// function to handle responses by the subject
			var after_response = function(info) {

				kill_listeners();
				kill_timers();

				win = Math.random()<trial.p;

				display_stimuli(2);
				var handle_feedback = setTimeout(function() {
					display_stimuli(3);
					var handle_points = setTimeout(function() {
						end_trial();
					}, trial.points_time);
					setTimeoutHandlers.push(handle_points);
				}, trial.feedback_time);
				setTimeoutHandlers.push(handle_feedback);
			}


		var display_stimuli = function(stage){

			kill_timers();
			kill_listeners();

			//state_name = state_names[state];
			//state_color = state_colors[state];


			if (stage==1) { // choice stage

				display_element.innerHTML = '';

				$('.jspsych-display-element').css({'background-image': 'url("img/'+state_name+'_planet.png")', 'background-repeat': 'no-repeat',
						'background-position': 'center'});

				let newDiv1 = document.createElement("div");
		    newDiv1.setAttribute("id","jspsych-space-daw-top-stim-left");
		    document.getElementById('jspsych-content').appendChild(newDiv1);

				let newDiv2 = document.createElement("div");
    		newDiv2.setAttribute("id","jspsych-space-daw-top-stim-middle");
    		document.getElementById('jspsych-content').appendChild(newDiv2);

				let newDiv3 = document.createElement("div");
    		newDiv3.setAttribute("id","jspsych-space-daw-top-stim-right");
    		document.getElementById('jspsych-content').appendChild(newDiv3);

				let newDiv4 = document.createElement("div");
    		newDiv4.setAttribute("style","clear:both");
    		document.getElementById('jspsych-content').appendChild(newDiv4);

				let newDiv5 = document.createElement("div");
    		newDiv5.setAttribute("id","jspsych-space-daw-bottom-stim-left");
    		document.getElementById('jspsych-content').appendChild(newDiv5);

				let newDiv6 = document.createElement("div");
    		newDiv6.setAttribute("id","jspsych-space-daw-bottom-stim-middle");
    		document.getElementById('jspsych-content').appendChild(newDiv6);

				let newDiv7 = document.createElement("div");
    		newDiv7.setAttribute("id","jspsych-space-daw-bottom-stim-right");
    		document.getElementById('jspsych-content').appendChild(newDiv7);

				$('#jspsych-space-daw-bottom-stim-'+position).css('background-image', 'url(img/'+state_name+'_stim_1.png)');
				$('#jspsych-space-daw-bottom-stim-'+other_position).css('background-image', 'url(img/'+state_name+'_stim_2_deact.png)');
			}

			if (stage==2) { // feedback
				$('#jspsych-space-daw-bottom-stim-'+position).addClass('jspsych-space-daw-bottom-stim-border');
				$('#jspsych-space-daw-bottom-stim-'+position).css('border-color', 'rgba('+state_color[0]+','+state_color[1]+','+state_color[2]+', 1)');
			}

			if (stage==3) { // reward

				if (win==0) {
					$('#jspsych-space-daw-top-stim-'+position).css('background-image', 'url(img/noreward.png)');
					$('#jspsych-space-daw-bottom-stim-'+position).css('background-image', 'url(img/'+state_name+'_stim_1_sad.png)');
				} else {
					$('#jspsych-space-daw-top-stim-'+position).css('background-image', 'url(img/treasure.png)');
					$('#jspsych-space-daw-bottom-stim-'+position).css('background-image', 'url(img/'+state_name+'_stim_1.png)');
				}
			}
		}

		var start_response_listener = function(){
			if(JSON.stringify(trial.choices) != JSON.stringify(["none"])) {
				var keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
					callback_function: after_response,
					valid_responses: choices,
					rt_method: 'date',
					persist: false,
					allow_held_key: false
				});
			}
		}

		var kill_timers = function(){
			for (var i = 0; i < setTimeoutHandlers.length; i++) {
				clearTimeout(setTimeoutHandlers[i]);
			}
		}

		var kill_listeners = function(){
			// kill keyboard listeners
			if(typeof keyboardListener !== 'undefined'){
				jsPsych.pluginAPI.cancelAllKeyboardResponses();
				//jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
			}
		}

		var next_part = function(){

			kill_timers();
			kill_listeners();

			display_stimuli(1);

			start_response_listener();
		}

		next_part();
	};

	return plugin;

})();
