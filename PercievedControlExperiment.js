function PercievedControlExperiment(jsSheetHandle, jsPsychHandle, survey_code) {
    jsSheetHandle.CreateSession(RunExperiment)

    function RunExperiment(session) {
        // Constants
        const SONA_URL = `https://ufl.sona-systems.com/webstudy_credit.aspx?experiment_id=145&credit_token=9419af749b2c4e79b6a43900be9aec70&survey_code=${survey_code}`

        // Experiments Trials
        let WelcomePage = {
            type: 'html-keyboard-response',
            stimulus: '<p>Welcome to the experiment! Your first task is to review the consent form on the following page.</p><p>Press any key to continue.</p>',
        }

        let ConsentFormTrial = {
            type: 'external-html',
            url: 'https://ufpaclab.github.io/Consent-Forms/Active/Consent.html',
            cont_btn: 'consent-button'
        }

        let GetAgeTrial = {
            type: 'survey-text',
            questions: [{
                name: 'age',
                prompt: 'What is your age?',
                required: true,
                columns: 3
            }]
        }

        let GetSexTrial = {
            type: 'survey-multi-choice',
            questions: [{
                name: 'sex',
                prompt: 'What is your biological sex?',
                options: ['Male', 'Female', 'Other'],
                required: true
            }]
        }

        let MacWarningTrial = {
            type: 'html-keyboard-response',
            stimulus: `
                <p>If you are a <strong>MAC</strong> user, please read the following instructions carefully. (Users of other systems can press any key to continue)</p>
                <p>This experiment requires you to disable the 'Shake mouse pointer to locate' and the 'Hot corners' function. It can be done with several simple steps.</p>
                <p>STEP1: go to the Apple menu and choose 'System Preference', select 'Accessibility'.</p>
                <p>STEP2: go to 'Display', uncheck the box next to 'Shake mouse pointer to locate'. </p>
                <p>STEP3: go back to 'System Preference', go to 'Mission Control' and click on 'Hot Corners' button in the corner of the preference panel</p>
                <p>STEP4: pull down each of the four hot corner submenus and choose '-'</p>
                <p>STEP5: come back to this page and <strong>switch to full-screen mode</strong> by selecting the green circle at the top-left corner of Chrome.</p><p>STEP6: continue to the next page.</p>
                <br><br><br><p>Press any key to continue.</p>`,
            on_finish: () => {
                jsPsychHandle.data.get().addToLast({osAndBrowser: navigator.appVersion})
            }
        }

        let GeneralInstructionsTrial = {
            type: 'html-keyboard-response',
            stimulus: `
                <p><strong>INSTRUCTIONS</strong></p>
                <p>On each trial, you will see two independent moving dots.</p>
                <p>The movement of your mouse can influence the trajectory of one of them.</p>
                <p>The dot that can be controlled by your mouse movement (A or B) will be randomly selected on each trial.</p>
                <p>Your goal is to report which dot are you better able to control and how confident are you on your decision.</p>
                <p>In each trial, you will have 2.5 seconds to interact with the dots.</p><p>After that, you will answer two questions. You have 2 seconds to answer each question.</p>
                <p>If you failed to provide answer to any of the questions, the trial will be aborted.</p>
                <p>The aborted trials will NOT count. Hence, skipping trials will <strong>NOT</strong> help you finish the task.</p>
                <br><br><p>Press any key to continue.</p>`
        }

        let TaskBorderInformationTrial = {
            type: "html-keyboard-response",
            stimulus: `
                <p><strong>BORDER INSTRUCTIONS</strong></p>
                <p>During the experiment, your cursor will be hidden. However, the mouse movement will only be counted as valid when the cursor is moving inside the screen.</p>
                <p>To help you locate the cursor, a RECTANGULAR border will be displayed around the stimuli on the screen.</p>
                <p>When the cursor moves outside of the screen, the corresponding side of the rectangle will turn to red until the cursor is moved back inside the screen.</p>
                <p>Please use this signal to adjust the location of your cursor.</p>
                <p>Press any key to continue.</p>`
        }

        let TaskKeyInputInformationTrial = {
            type: "html-keyboard-response",
            stimulus: `
                <p><strong>KEY-PRESS INSTRUCTIONS</strong></p>
                <p>You will be asked two questions on each trial.</p>
                <p>For the first question, you will be asked to report the label of the dot you were able to control on the current trial.</p>
                <p>Press A for dot A, or B for dot B</p>
                <p></p><p>For the second question, you will be asked to indicate your confidence in the choice you just made about which dot you were able to control.</p>
                <p>Press 1 if the judgment is a mere guess.</p>
                <P>Press 2 if the judgment is better than a mere guess but you are still quite unsure about it.</p>
                <p>Press 3 if you are almost certain.</p>
                <p>Press 4 if you have no doubt in your answer.</p>
                <br><br><p>Press any key to start the practice trials.</p>`
        }

        let FullscreenTrial = {
            type: 'fullscreen',
            fullscreen_mode: true,
            message: '<p>Press the button to enter fullscreen and start the practice trials<p>',
            on_finish: function() {
                document.body.style.cursor = 'none'
            }
        };



        // Start Unmodified Shinyun Code



        var timeline_dot_trajectory = []
        var answerRecorder = true;
        var practiceNum = 0;
        var practiceControl = 0.25;
        var failTrialDetect = false;
        var practice = {
            type: "dot-motion",
            controlLevel: 500,
            trial_duration: jsPsych.timelineVariable('trial_duration'),
            data: {test_part: 'dot_practice'},

            on_start: function(trial){
                trial.controlLevel = practiceControl;
            },
            on_finish: function(data){
                if(data.controlLevel == -1){
                    data.test_part = 'fail_trial';
                    failTrialDetect = true;
                }
                else{
                    answerRecorder = data.correct;
                    practiceNum ++;
                    if (answerRecorder == true)
                        practiceControl -= 0.025;
                    else {
                        practiceControl += 0.075;
                    }
                }
            }
        };

        var practiceWrong = 0;
        var feedback = {
            type: "html-keyboard-response",
            stimulus: function(){
                if (failTrialDetect == true){
                    failTrialDetect = false;
                    return "<p>Remember, you only have 2 seconds to enter your answer for each question.</p><p>The trial you missed will NOT count. Hence, skipping trials will <strong>NOT</strong> help you finish the task.</p><p>Let's try again.</p><br><br><p>Press any key to continue.</p>"
                }
                else if (practiceNum < 5){
                    if (answerRecorder == true)
                        return "<p>your answer is CORRECT</p><p>Press any key to continue</p>"
                    else{
                        practiceWrong++;
                        return "<p>your answer is WRONG</p><p>Press any key to continue</p>"
                    }
                }
                else{
                    if (answerRecorder == true && practiceWrong < 2)
                        return "<p>your answer is CORRECT</p><p>Press any key to continue</p>"
                    else if (answerRecorder == true && practiceWrong > 1)
                        return "<p>your answer is CORRECT</p>" +
                                    "<p>Accuracy = " + (practiceNum - practiceWrong) + "/" + practiceNum + "</p>" +
                                    "<p>Practice trials need to be repeated.</p>" +
                                    "<p>Press any key to continue</p>"
                    else if (answerRecorder == false && practiceWrong < 1){
                        practiceWrong++;
                        return "<p>your answer is WRONG</p><p>Press any key to continue</p>"
                    }
                    else if (answerRecorder == false && practiceWrong > 0){
                        practiceWrong++;
                        return "<p>your answer is WRONG</p>" +
                                    "<p>Accuracy = " + (practiceNum - practiceWrong) + "/" + practiceNum + "</p>" +
                                    "<p>Practice trials need to be repeated.</p>" +
                                    "<p>Press any key to continue</p>"
                    }
                }
            }
        };

        var practice_procedure = {
            timeline: [practice,feedback],
            timeline_variables: [{trial_duration: 2500}],
            loop_function: function(){
                if (practiceNum < 5)
                    return true;
                if (practiceNum == 5 && practiceWrong > 1){
                    practiceControl = 0.25;
                    practiceNum = 0;
                    practiceWrong = 0;
                    return true;
                }
                else {
                    return false;
                }
            }
        };
        timeline_dot_trajectory.push(practice_procedure);

        var start = {
            type: "html-keyboard-response",
            stimulus: "<p>Practice finished. Good job!</p><p>Press any key to start the experiment.</p>"
        };
        timeline_dot_trajectory.push(start);

        /*******************************************************
        staircase stuff: 1 up/1 down, delta-/delta+ = 1/3
        the minimum control level is 0
        ********************************************************/
        var ratioOfSteps = 0.3333;
        var firstSize = 0.005;
        var secondSize = 0.0025;
        var thirdSize = 0.001;
        var fourthSize = 0.0007;
        var maxcontrol = 0.025;
        var criticalReserse = [2, 6, 12, 13] //first three are points where stepsize decrease, the last one is the ending condition
                                                                                    //note: change the last number to 13 before launching
        var stepsize = [firstSize, firstSize/ratioOfSteps, secondSize, secondSize/ratioOfSteps, thirdSize, thirdSize/ratioOfSteps, fourthSize, fourthSize/ratioOfSteps]; //sets of step size
        var staircaseA = {controlLevel: maxcontrol, trialNum: 0, reverseNum: 0, lastChioce: true, stepsizeDown: stepsize[0], stepsizeUp: stepsize[1]};
        var staircaseB = {controlLevel: maxcontrol, trialNum: 0, reverseNum: 0, lastChioce: true, stepsizeDown: stepsize[0], stepsizeUp: stepsize[1]};
        var trialMax = 100;
        var totalTrial = 2 * trialMax;

        /*******************************************************
        stimuli: the dot motion, fixation cross
        ********************************************************/
        //display the dot motion
        var currentStaircase; //0 = A, 1 = B
        var catchGenerator = 0;
        var breakDetect = 0;
        var test = {
            type: "dot-motion",
            controlLevel: 100,
            trial_duration: jsPsych.timelineVariable('trial_duration'),
            data: {test_part: 'dot_stimulus'},

            on_start: function(trial){
                //check if this trial is a catch trial, ps. catch trial when catchGenerator == 1
                catchGenerator = Math.floor(Math.random() * 6);
                if(catchGenerator == 1){
                    trial.controlLevel = 0.25;
                }
                else{
                    //select a staircase
                    if (staircaseA.reverseNum == criticalReserse[3]){currentStaircase = 1;}
                    else if (staircaseB.reverseNum == criticalReserse[3]){currentStaircase = 0;}
                    else{currentStaircase = Math.floor(Math.random() * 2);}

                    //update the current control level
                    if (currentStaircase == 0){trial.controlLevel = staircaseA.controlLevel;}
                    else if (currentStaircase == 1){trial.controlLevel = staircaseB.controlLevel;}
                }
            },
            on_finish: function(data){
                if(data.controlLevel == -1){
                    data.test_part = 'fail_trial';
                }
                else if(catchGenerator == 1){
                    //record test part
                    data.test_part = 'dot_catch_trial';
                }
                else{
                    //record test part
                    data.test_part = 'dot_stimulus';
                    //record which staircase is used
                    data.staircase = currentStaircase;
                    //update the trial number of the staircase
                    if (data.staircase == 0){staircaseA.trialNum ++;}
                    else if (data.staircase == 1){staircaseB.trialNum ++;}

                    data.reverse = false;
                    //record the number of reverse in each staircase
                    if (data.staircase == 0){
                        //record the choice in the first trial
                        if (staircaseA.trialNum == 1){staircaseA.lastChioce = data.correct}
                        //update the number of reverse
                        else{
                            if (data.correct !== staircaseA.lastChioce){staircaseA.reverseNum ++; data.reverse = true;}
                            staircaseA.lastChioce = data.correct;
                        }
                    }
                    else if (data.staircase == 1){
                        //record the choice in the first trial
                        if (staircaseB.trialNum == 1){staircaseB.lastChioce = data.correct}
                        //update the number of reverse
                        else{
                            if (data.correct !== staircaseB.lastChioce){staircaseB.reverseNum ++; data.reverse = true;}
                            staircaseB.lastChioce = data.correct;
                        }
                    }

                    //reduce the step size
                    if (staircaseA.reverseNum >= criticalReserse[0] && data.staircase == 0){staircaseA.stepsizeDown = stepsize[2]; staircaseA.stepsizeUp = stepsize[3];}
                    else if (staircaseB.reverseNum >= criticalReserse[0] && data.staircase == 1){staircaseB.stepsizeDown = stepsize[2]; staircaseB.stepsizeUp = stepsize[3];}
                    if (staircaseA.reverseNum >= criticalReserse[1] && data.staircase == 0){staircaseA.stepsizeDown = stepsize[4]; staircaseA.stepsizeUp = stepsize[5];}
                    else if (staircaseB.reverseNum >= criticalReserse[1] && data.staircase == 1){staircaseB.stepsizeDown = stepsize[4]; staircaseB.stepsizeUp = stepsize[5];}
                    if (staircaseA.reverseNum >= criticalReserse[2] && data.staircase == 0){staircaseA.stepsizeDown = stepsize[6]; staircaseA.stepsizeUp = stepsize[7];}
                    else if (staircaseB.reverseNum >= criticalReserse[2] && data.staircase == 1){staircaseB.stepsizeDown = stepsize[6]; staircaseB.stepsizeUp = stepsize[7];}

                    //update the control level in that staircase
                    if (data.staircase == 0){
                        if (data.correct == false){staircaseA.controlLevel += staircaseA.stepsizeUp;}
                        else if (data.correct == true){
                            staircaseA.controlLevel -= staircaseA.stepsizeDown;
                            if(staircaseA.controlLevel < 0)
                                staircaseA.controlLevel = 0;
                        }
                    }
                    else if (data.staircase == 1){
                        if (data.correct == false){staircaseB.controlLevel += staircaseB.stepsizeUp;}
                        else if (data.correct == true){
                            staircaseB.controlLevel -= staircaseB.stepsizeDown;
                            if(staircaseB.controlLevel < 0)
                                staircaseB.controlLevel = 0;
                        }
                    }
                    //stop the experiment if both staircase reached 10 reverse
                    if (staircaseA.reverseNum == criticalReserse[3] && staircaseB.reverseNum == criticalReserse[3]){
                        jsPsych.endCurrentTimeline();
                    }
                }

                //break session
                if(breakDetect < 2 && staircaseA.reverseNum >= 6 && staircaseB.reverseNum >= 6){ breakDetect++; } //notes: change both numbers to 6 or 7
                if(breakDetect == 1){
                    document.getElementById("jspsych-content").innerHTML = '<p>Good job! You are halfway through the first task.</p><p>Take a break and relax your eyes.</p><p>You will have maximum 5 minutes for this break session, but you can continue the task anytime by pressing C.</p>';
                    jsPsych.pauseExperiment();
                    //start the keyboard listener
                    keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
                        callback_function: break_callback,
                        valid_responses: ['c'],
                        persist: false,
                        allow_held_key: false
                    });

                    var breakEnd = setTimeout(function(){
                        if (typeof keyboardListener !== 'undefined'){
                            jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
                        }
                        document.getElementById("jspsych-content").innerHTML = '';
                        jsPsych.resumeExperiment();
                    }, 300000);

                    function break_callback(){
                        if (typeof keyboardListener !== 'undefined'){
                            jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
                        }
                        clearTimeout(breakEnd);
                        document.getElementById("jspsych-content").innerHTML = '';
                        jsPsych.resumeExperiment();
                    }
                }
            },
        };

        //fixation cross
        var fixation = {
            type: "html-keyboard-response",
            stimulus: '<div style="font-size:60px;">+</div>',
            choices: jsPsych.NO_KEYS,
            trial_duration: 500,
            data: {test_part: 'dot_fixation'},
        };

        /*******************************************************
                                let the experiment begin
        ********************************************************/
        //control the timeline
        var test_procedure = {
            timeline: [fixation, test],
            timeline_variables: [{trial_duration: 2500}],
            repetitions: totalTrial
        };
        timeline_dot_trajectory.push(test_procedure);
        let DotTrajectoryTrials = {timeline: timeline_dot_trajectory}



        // End Unmodified Shinyun Code



        let ExitFullscreenTrial = {
            type: "fullscreen",
            fullscreen_mode: false,
            on_finish: function() {
                document.body.style.cursor = 'default'
            }
        }

        let FinalSurveyTrial = {
            type: 'survey-multi-choice',
            questions: function() {
                let prompts = [
                    `Right now, I am confident that who I think I am is who I really am.`,
                    `Right now, I feel like I have a clear idea of who I am.`,
                    `Right now, I feel conflicted about who I am.`,
                    `Right now, I am not sure I know who I really am.`,
                    `Right now, I feel like all of my self aspects are one consistent whole.`,
                    `Right now, I do not think I can confidently can tell someone what I am like.`,
                    `Right now, I feel like I am the person that I give the impression of being.`,
                    `Right now, I feel like some parts of me do not align with the others.`,
                    `Right now, I feel like it takes time to think about what makes me who I am.`,
                    `Right now, I can quickly tell another person the traits that I possess.`
                ]
                let options = ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
                let questions = []
                for (var i = 0; i < prompts.length; i++) {
                    questions.push({
                        prompt: prompts[i],
                        name: `Q${i}`,
                        options: options,
                        required: true
                    });
                }
                return questions;
            }()
        }

        var ExperimentFinishedTrial = {
            type: 'html-keyboard-response',
            stimulus: `
            <p>The experiment is finished.</p>
            <p>Thank you for your participation! We appreciate your contribution to our research.</p>
            <p>Press any key to exit.</p>`
        }

        // Configure and Start Experiment
        jsPsychHandle.init({
            timeline: [ 
                WelcomePage,
                ConsentFormTrial, 
                GetAgeTrial, 
                GetSexTrial, 
                MacWarningTrial, 
                GeneralInstructionsTrial, 
                TaskBorderInformationTrial, 
                TaskKeyInputInformationTrial,
                FullscreenTrial,
                DotTrajectoryTrials,
                ExitFullscreenTrial,
                FinalSurveyTrial,
                ExperimentFinishedTrial
            ],
            on_trial_finish: session.insert,
            on_finish: function() { window.top.location.href = SONA_URL }
        })
    }
}