/**
* jspsych-space-daw-stim
* Wouter Kool
*
* plugin for displaying a space and aliens version of the Daw 2-step task
*
**/

jsPsych.plugins["space-daw-stim"] = (function() {

		var plugin = {};

		var score = 0;

		//var displayColor = '#0738db';
		//var borderColor = '#197bff';
		//var textColor = '#b8fff6';

		plugin.info = {
			name: 'space-daw-stim',
			description: 'plugin for displaying a space and aliens version of the Daw 2-step task, jsPsych 6.0 version',
			parameters:{
				practice:{
					type: jsPsych.plugins.parameterType.INT,
					pretty_name: 'Practice',
					default: 0,
					description: 'determine whether trigger practice trials',
				},

				ps_1:{
					type: jsPsych.plugins.parameterType.INT,
					pretty_name: 'PS 1',
					default: undefined,
					description: 'the first element of ps',
				},

				ps_2:{
					type: jsPsych.plugins.parameterType.INT,
					pretty_name: 'PS 2',
					default: undefined,
					description: 'the second element of ps',
				},

				ps_3:{
					type: jsPsych.plugins.parameterType.INT,
					pretty_name: 'PS 3',
					default: undefined,
					description: 'the third element of ps',
				},

				ps_4:{
					type: jsPsych.plugins.parameterType.INT,
					pretty_name: 'PS 4',
					default: undefined,
					description: 'the fourth element of ps',
				},

				subid:{
					type: jsPsych.plugins.parameterType.INT,
					pretty_name: 'Subject ID',
					default: undefined,
					description: 'Subject ID',
				},

				tr:{
					type: jsPsych.plugins.parameterType.INT,
					pretty_name: 'tr',
					default: 0.7,
					description: 'factor that determines state two',
				},

				feedback_time:{
					type: jsPsych.plugins.parameterType.INT,
					pretty_name: 'Feedback time',
					default: 500,
					description:'',
				},

				ITI:{
					type: jsPsych.plugins.parameterType.INT,
					pretty_name:'Inter-trial interval',
					default: 1000,
					description:'inter-trial interval'
				},

				timeout_time:{
					type: jsPsych.plugins.parameterType.INT,
					pretty_name: 'Timeout time',
					default: 1500,
					description: '',
				},

				timing_response:{
					type: jsPsych.plugins.parameterType.INT,
					pretty_name: 'Timing response',
					default: 2000,
					descriptoin: '',
				},

				score_time:{
					type: jsPsych.plugins.parameterType.INT,
					pretty_name: 'Score time',
					default: 1500,
					descriptoin: '',
				},

				level2_time:{
					type: jsPsych.plugins.parameterType.INT,
					pretty_name: 'Level2 time',
					default: 1000,
					description:'',
				},

				totalscore_time:{
					type: jsPsych.plugins.parameterType.INT,
					pretty_name: 'Totalscore time',
					default: 2000,
					description:'',
				}
			}
		};

		plugin.trial = function(display_element, trial) {

			// if any trial variables are functions
			// this evaluates the function and replaces
			// it with the output of the function

			//trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);
			var ps = [[trial.ps_1, trial.ps_2], [trial.ps_3, trial.ps_4]];

			progress = jsPsych.progress();
			if (progress.current_trial_local == 0) {
				score = 0;
			}

			var stims1 = shuffle([1,2]);
			var stims2 = shuffle([1,2]);
			var stims = stims1;

			var part = -1;
			var choice1 = -1;
			var choice2 = -1;
			var state2 = -1;
			var win = -1;
			var common = -1;

			var points = 0;

			if (trial.practice == 0) {
				var state_names = ["earth","purple","red"];
				var state_colors = [
					[5, 157, 190],
					[115, 34, 130],
					[211, 0, 0]
				];
			} else {
				var state_names = ["earth","green","yellow"];
				var state_colors = [
					[5, 157, 190],
					[35, 63, 39],
					[240, 187, 57]
				];

			}

			// store responses
			var setTimeoutHandlers = [];

			var keyboardListener = new Object;

			var response = new Array(2);
			for (var i = 0; i < 2; i++) {
				response[i] = {rt: -1, key: -1};
			}

			var state = 0;

			var choices = ["F","J"];

			// function to end trial when it is time
			var end_trial = function() {

				kill_listeners();
				kill_timers();

				// gather the data to store for the trial

				var trial_data = {
					"subid": trial.subid,
					"stim_s1_left": stims1[0],
					"stim_s1_right": stims1[1],
					"rt_1": response[0].rt,
					"choice1": choice1,
					"stim_s2_left": stims2[0],
					"stim_s2_right": stims2[1],
					"rt_2": response[1].rt,
					"choice2": choice2,
					"win": win,
					"state2": state2,
					"common": common,
					"score": score,
					"practice": trial.practice,
					"ps1a1": ps[0][0],
					"ps1a2": ps[0][1],
					"ps2a1": ps[1][0],
					"ps2a2": ps[1][1],
				};

				//jsPsych.data.write(trial_data);

				var handle_totalscore = setTimeout(function() {
					// clear the display
					display_element.innerHTML = '';
					$('.jspsych-display-element').css('background-image', '');

					// move on to the next trial
					var handle_ITI = setTimeout(function() {
						jsPsych.finishTrial(trial_data);
					}, trial.ITI);
					setTimeoutHandlers.push(handle_ITI);
				}, trial.totalscore_time);
				setTimeoutHandlers.push(handle_totalscore);

			};

			// function to handle responses by the subject
			var after_response = function(info) {

				kill_listeners();
				kill_timers();

				// only record the first response
				if (response[part].key == -1){
					response[part] = info;
				}

				display_stimuli(2); //feedback

				var extra_time = 0;

				if (state == 0) {
					if (String.fromCharCode(response[part].key)==choices[0]) { // left response
						choice1 = stims[0];
					} else {
						choice1 = stims[1];
					}
					if (choice1==1) {
						if (Math.random()<trial.tr) {
							state2 = 1;
							common = 1;
						} else {
							state2 = 2;
							common = 0;
						}
					} else {
						if (Math.random()<trial.tr) {
							state2 = 2;
							common = 1;
						} else {
							state2 = 1;
							common = 0;
						}
					}
					state = state2;
					stims = stims2;

					var handle_feedback = setTimeout(function() {
						display_element.innerHTML = '';
						next_part();
					}, trial.feedback_time+extra_time);
					setTimeoutHandlers.push(handle_feedback);

				} else {
					if (String.fromCharCode(response[part].key)==choices[0]) { // left response
						choice2 = stims2[0];
					} else {
						choice2 = stims2[1];
					}

					win = Math.random()<ps[state-1][choice2-1];
					score = score + win;

					display_stimuli(2);
					var handle_feedback = setTimeout(function() {
						display_stimuli(3);
						var handle_score = setTimeout(function() {
							display_stimuli(4);
							end_trial();
						}, trial.score_time);
						setTimeoutHandlers.push(handle_score);
					}, trial.feedback_time+extra_time);
					setTimeoutHandlers.push(handle_feedback);
				}
				// show feedback

			};

			var display_stimuli = function(stage){

				kill_timers();
				kill_listeners();

				state_name = state_names[state];
				state_color = state_colors[state];

				if (stage==-1) { // timeout	at first level
					$('#jspsych-space-daw-bottom-stim-left').html('<br><br>X');
					$('#jspsych-space-daw-bottom-stim-right').html('<br><br>X');
					$('#jspsych-space-daw-bottom-stim-left').css('background-image', 'url(img/'+state_name+'_stim_'+stims[0]+'_deact.png)');
					$('#jspsych-space-daw-bottom-stim-right').css('background-image', 'url(img/'+state_name+'_stim_'+stims[1]+'_deact.png)');
				}

				if (stage==1) { // choice stage
					display_element.innerHTML = '';

					$('.jspsych-display-element').css({'background-image': 'url("img/'+state_name+'_planet.png")','background-repeat': 'no-repeat',
							'background-position': 'center'});

					let newDiv1 = document.createElement("div");
			    newDiv1.setAttribute("id","jspsych-space-daw-top-stim-left");
			    document.getElementById('jspsych-content').appendChild(newDiv1);

					if (state>0) {
						let newDiv2 = document.createElement("div");
				    newDiv2.setAttribute("id", "jspsych-space-daw-top-stim-middle");
						newDiv2.setAttribute('style', 'background-image: url(img/earth_stim_'+choice1+'_deact.png)');
				    document.getElementById('jspsych-content').appendChild(newDiv2);
					} else {
						let newDiv2 = document.createElement("div");
				    newDiv2.setAttribute("id", "jspsych-space-daw-top-stim-middle");
				    document.getElementById('jspsych-content').appendChild(newDiv2);
					}
					let newDiv3 = document.createElement("div");
					newDiv3.setAttribute("id", "jspsych-space-daw-top-stim-right");
					document.getElementById('jspsych-content').appendChild(newDiv3);

					let newDiv4 = document.createElement("div");
	    		newDiv4.setAttribute("style","clear:both");
	    		document.getElementById('jspsych-content').appendChild(newDiv4);

					let newDiv5 = document.createElement("div");
	    		newDiv5.setAttribute("id","jspsych-space-daw-bottom-stim-left");
					newDiv5.setAttribute('style', 'background-image: url(img/'+state_name+'_stim_'+stims[0]+'.png)');
	    		document.getElementById('jspsych-content').appendChild(newDiv5);

					let newDiv6 = document.createElement("div");
	    		newDiv6.setAttribute("id","jspsych-space-daw-bottom-stim-middle");
	    		document.getElementById('jspsych-content').appendChild(newDiv6);

					let newDiv7 = document.createElement("div");
	    		newDiv7.setAttribute("id","jspsych-space-daw-bottom-stim-right");
					newDiv7.setAttribute('style', 'background-image: url(img/'+state_name+'_stim_'+stims[1]+'.png)');
	    		document.getElementById('jspsych-content').appendChild(newDiv7);
				}

				if (stage==2) { // feedback
					if (String.fromCharCode(response[part].key)==choices[0]) { // left response
						$('#jspsych-space-daw-bottom-stim-right').css('background-image', 'url(img/'+state_name+'_stim_'+stims[1]+'_deact.png)');
						$('#jspsych-space-daw-bottom-stim-left').addClass('jspsych-space-daw-bottom-stim-border');
						$('#jspsych-space-daw-bottom-stim-left').css('border-color', 'rgba('+state_color[0]+','+state_color[1]+','+state_color[2]+', 1)');
					} else {
						$('#jspsych-space-daw-bottom-stim-left').css('background-image', 'url(img/'+state_name+'_stim_'+stims[0]+'_deact.png)');
						$('#jspsych-space-daw-bottom-stim-right').css('border-color', 'rgba('+state_color[0]+','+state_color[1]+','+state_color[2]+', 1)');
						$('#jspsych-space-daw-bottom-stim-right').addClass('jspsych-space-daw-bottom-stim-border');
					}
				}

				if (stage==3) { // reward
					if (win==1) {
						if (String.fromCharCode(response[part].key)==choices[0]) { // left response
							$('#jspsych-space-daw-top-stim-left').css('background-image', 'url(img/treasure.png)');
						} else {
							$('#jspsych-space-daw-top-stim-right').css('background-image', 'url(img/treasure.png)');
						}
					} else {
						if (String.fromCharCode(response[part].key)==choices[0]) { // left response
							$('#jspsych-space-daw-top-stim-left').css('background-image', 'url(img/noreward.png)');
						} else {
							$('#jspsych-space-daw-top-stim-right').css('background-image', 'url(img/noreward.png)');
						}
					}
				}

				if (stage==4) { //
					display_element.innerHTML = '';

					if (win == 1) {
						picture = 'img/treasure.png';
					} else {
						picture = 'img/noreward.png';
					}

					$('.jspsych-display-element').css({'background-image': 'url("img/earth_planet.png")', 'background-repeat': 'no-repeat',
							'background-position': 'center'});

					let newDiv8 = document.createElement("div");
			    newDiv8.setAttribute("id","jspsych-space-daw-top-rewards");
			    document.getElementById('jspsych-content').appendChild(newDiv8);

					$('#jspsych-space-daw-top-rewards').append($('<div id="jspsych-space-daw-top-rewards-container"><img src="'+picture+'"></div>'))

					if (win==1) {
						$('#jspsych-space-daw-top-rewards').append($('<div id="jspsych-space-daw-top-rewards-text"> = 1</div>'))
					} else {
						$('#jspsych-space-daw-top-rewards').append($('<div id="jspsych-space-daw-top-rewards-text"> = 0</div>'))
					}

					$('#jspsych-space-daw-top-rewards').append($('<div style="clear:both; height:20px"></div>'))
					$('#jspsych-space-daw-top-rewards').append($('<div id="jspsych-space-daw-top-rewards-text">total score: '+score+'</div>'))
				}

			}

			var start_response_listener = function(){

				if(JSON.stringify(choices) != JSON.stringify(["none"])) {
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
					//jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
					jsPsych.pluginAPI.cancelAllKeyboardResponses();
				}
			}

			var next_part = function(){

				part = part + 1;

				kill_timers();
				kill_listeners();

				display_stimuli(1);

				start_response_listener();

				if (trial.timing_response>0) {
					var handle_response = setTimeout(function() {
						kill_listeners();
						display_stimuli(-1);
						var handle_timeout = setTimeout(function() {
							end_trial();
						}, trial.timeout_time);
						setTimeoutHandlers.push(handle_timeout);
					}, trial.timing_response);
					setTimeoutHandlers.push(handle_response);
				}
			}

			next_part();

		};

		return plugin;
})();
