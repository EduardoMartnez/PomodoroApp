// Working time of 25 minutes in seconds (1500s)
let workTime = 10;

// Actual working time that has passed
let currentWorkTime = 10;

// Break time of 25 minutes in seconds (300s)
let breakTime = 10;

// Actual break time that has passed
let currentBreakTime = 10;

// Amount of times work cycle has been compvared
let workCount = 0;

// Long break time of 20 minutes in seconds (1200)
let longTime = 10;

// Actual long break time that has passed
let currentLongTime = 10;

// Current pomodoro cycle: -1 = just loaded, 0 = work, 1 = break, 2 = long break
let currentCycle = 0;

// Current status of the clock: false = paused, true = active
let active = false;

/**
 * Changes 'active' to be either true if false, and vice versa.
 */
function activateClock() {
    if (active === false) {
        active = true;

        console.log("Activated");
    } else if (active === true) {
        active = false;

        console.log("Deactivated");
    }
}

/**
 * Alters an HTML object with a string indicating the current time left for the corresponding cycle. Can only do so when 'activate' is true.
 */
function decrementClock() {
    if (active === true) {
        switch(currentCycle) {
            case 0:
                currentWorkTime--;
                
                console.log("Cycle 1");

                if (currentWorkTime === -1) {
                    currentWorkTime = workTime;
                    workCount++;

                    if (workCount === 3) {
                        currentCycle = 2;
                    } else {
                        currentCycle = 1;
                    }
                }

                var workMin = Math.floor(currentWorkTime / 60);
                var workSec = currentWorkTime % 60;

                document.getElementById('workTime').innerText = craftTimeString(workMin, workSec);
                break;
            case 1: 
                currentBreakTime--;

                console.log("Cycle 2");

                if (currentBreakTime === -1) {
                    currentBreakTime = breakTime;
                    currentCycle = 1;
                }

                var breakMin = Math.floor(currentBreakTime / 60);
                var breakSec = currentBreakTime % 60;

                document.getElementById('breakTime').innerText = craftTimeString(breakMin, breakSec);
                break;
            case 2:
                currentLongTime--;

                console.log("Cycle 3");

                if (currentLongTime === -1) {
                    currentLongTime = longTime;
                    currentCycle = 0;
                }

                var longMin = Math.floor(currentLongTime / 60);
                var longSec = currentLongTime % 60;

                document.getElementById('longTime').innerText = craftTimeString(longMin, longSec);
                break;
        }
    }
}
setInterval(decrementClock, 1000);

/**
 * Skip either a work or break cycle to enter a new cycle immediately
 */
function skipCycle() {
    if (active === false) {
        switch(currentCycle) {
            case 0:
                console.log("Skipped Cycle 1");

                currentWorkTime = workTime;
                currentCycle = 1;

                var workMin = Math.floor(currentWorkTime / 60);
                var workSec = currentWorkTime % 60;

                active = true;

                document.getElementById('workTime').innerText = craftTimeString(workMin, workSec);
                break;
            case 1:
                console.log("Skipped Cycle 2");

                currentBreakTime = breakTime;
                currentCycle = 0;

                var breakMin = Math.floor(currentBreakTime / 60);
                var breakSec = currentBreakTime % 60;

                active = true;

                document.getElementById('breakTime').innerText = craftTimeString(breakMin, breakSec);
                break;
            case 2:
                console.log("Skipped Cycle 3");

                currentLongTime = longTime;
                currentCycle = 0;

                var longMin = Math.floor(currentLongTime / 60);
                var longSec = currentLongTime % 60;

                active = true;

                document.getElementById('longTime').innerText = craftTimeString(longMin, longSec);
                break;
        }
    }
}

/**
 * Helper method to reduce repetition when creating a string representing the time
 * 
 * @param {*} minutes 
 * @param {*} seconds 
 * @returns string representing seconds translated into minutes:seconds
 */
function craftTimeString(minutes, seconds) {
    var minText = minutes.toString();

    if (minutes < 10) {
        minText = "0" + minText;
    }

    var secText = seconds.toString();

    if (seconds < 10) {
        secText = "0" + secText;
    }

    return minText + ":" + secText;
}