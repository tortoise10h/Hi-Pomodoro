const pomodoro = () => {
    const playButton = document.querySelector('#playButton');
    const pauseButton = document.querySelector('#pauseButton');
    const switchModeButton = document.querySelector('#switchModeButton');
    const resetButton = document.querySelector('#resetButton');

    //sound
    const alarmSound = document.querySelector('.alarm-sound');

    //outline circle
    const movingOutline = document.querySelector('.moving-outline circle');
    const trackOutline = document.querySelector('.track-outline circle');
    //time display
    const timeDisplay = document.getElementById('timeDisplay');

    //get the length of the outline
    const movingOutlineLength = movingOutline.getTotalLength(); 

    //get 4 stacks images
    const stacks = document.querySelectorAll('.stack-icon');

    //reset 4 stacks to none when first come
    resetStacks();

    let stackCount = 0;

    //pomodoro first come
    const pomodoroTime = 25 * 60;
    const restTime = 5 * 60;
    const longRestTime = 15 * 60;
    const stacksPerCycle = 4;

    let workCountDownTime = pomodoroTime;
    let restCountDownTime = restTime;

    let is_work = true;

    displayPomodoroTime(pomodoroTime);
    movingOutline.style.strokeDasharray = movingOutlineLength;
    movingOutline.style.strokeDashoffset = movingOutlineLength;

    let countDownVar;
    //when click play button
    playButton.addEventListener('click',() => {
        playButton.style.display = "none";
        pauseButton.style.display = "";
        countDown();
        alarmSound.pause();
        alarmSound.load();
    });
    //when click pause button
    pauseButton.addEventListener('click', () => {
        playButton.style.display = "";
        pauseButton.style.display = "none";
        stopCountDown();
    });

    //when click reset button
    resetButton.addEventListener('click', () => {
        //display play button to click play again
        playButton.style.display = "";
        pauseButton.style.display = "none";

        //set count down time to begin
        workCountDownTime = pomodoroTime;
        displayPomodoroTime(workCountDownTime);

        //stop count down
        stopCountDown();

        //reset moving outline
        movingOutline.style.strokeDasharray = movingOutlineLength;
        movingOutline.style.strokeDashoffset = movingOutlineLength;
    });


    //when click switch mode button
    switchModeButton.addEventListener('click', () => {
        if(is_work == true){
            switchMode(is_work,restTime);
        }else{
            switchMode(is_work,pomodoroTime);
        }
         //stop count down
        stopCountDown();

        //reset moving outline
        movingOutline.style.strokeDasharray = movingOutlineLength;
        movingOutline.style.strokeDashoffset = movingOutlineLength;

    });


    function countDown(){
        if(is_work == true){
            if(workCountDownTime > 0){
                workCountDownTime--;
                displayPomodoroTime(workCountDownTime);
                movingOutlineAnimate(workCountDownTime,pomodoroTime); 
                countDownVar = setTimeout(function(){countDown();},1000);
            }else{ 
                stackCount++;
                displayStack(stackCount);
                if(stackCount == stacksPerCycle){
                    switchMode(is_work,longRestTime); 
                }else{                    
                    switchMode(is_work,restTime); 
                }           
                alarmSound.play();
            }
        }else{
            if(restCountDownTime > 0){
                restCountDownTime--;
                displayPomodoroTime(restCountDownTime);
                if(stackCount == stacksPerCycle){
                    movingOutlineAnimate(restCountDownTime,longRestTime); 
                }else{    
                    movingOutlineAnimate(restCountDownTime,restTime); 
                }
                countDownVar = setTimeout(function(){countDown();},1000);

            }else{ 
                if(stackCount == stacksPerCycle){
                    //enough 4 stacks => reset stack to 0
                    stackCount = 0;
                    resetStacks();
                }
                switchMode(is_work,pomodoroTime);
                alarmSound.play();
            }
        } 
    }

    function stopCountDown(){
        clearTimeout(countDownVar);
    }

    function displayPomodoroTime(time){
        let pomodoroMinutes = (Math.floor(time / 60) < 10) ? "0" + Math.floor(time / 60) : Math.floor(time / 60);
        let pomodoroSeconds = (Math.floor(time % 60) < 10) ? "0" + Math.floor(time % 60) : Math.floor(time % 60);
        //display default time
        timeDisplay.textContent = pomodoroMinutes + ":" + pomodoroSeconds;

        //display time count on title
        document.title = "(" + pomodoroMinutes + ":" + pomodoroSeconds + ")" + " Hi Pomodoro";
    }

    function movingOutlineAnimate(currentTime,baseTime){
        let progress;
        progress = (currentTime / baseTime) * movingOutlineLength;
        movingOutline.style.strokeDashoffset = progress; 
    }

    function switchMode(mode,displayTime){
        //change button when time finish
        playButton.style.display = "";
        pauseButton.style.display = "none";

        //mode == true => work | mode == false => rest
        //reset time to begin and switch mode
        if(mode == true){
            is_work = false;
            displayPomodoroTime(displayTime);
        }else{
            is_work = true;
            displayPomodoroTime(displayTime); 
        }

        //rest time count of previous mode
        if(mode == true){
            restCountDownTime = displayTime;
        }else{
            workCountDownTime = displayTime;
        }

        //reset circle moving outline
        movingOutline.style.strokeDashoffset = movingOutlineLength;
    }

    function displayStack(stackNum){ 
        for(let i = 0; i < stackNum; i++){
            stacks[i].style.display = "";
        }
    }

    function resetStacks(){
        stacks.forEach(stack => {
            stack.style.display = "none";
        });
    }
}


pomodoro();
