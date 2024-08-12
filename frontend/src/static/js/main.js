/**
 * Main issue: fetch() commands cannot affect global variables permanently. If a global variable is modified during a fetch(), it will be reset by the end of the command. 
 * Need to figure out how to handle clock features when global variables do not mesh well with fetch()
 */

document.addEventListener('DOMContentLoaded', (event) => {
    let user_id;
    let work_time;
    let current_work_time;
    let break_time;
    let current_break_time;
    let long_time;
    let current_long_time;
    let current_cycle;
    let active;
    let work_count;

    /**
     * fetchUser uses an API call to get the user's database ID from the token that is stored locally in the user's computer.
     * Currently does not work as intended due to fetch() commands not being able to permanently modify global variables
     */
    function fetchUser() {
        fetch("/api/users/current").then(res => {
            // console.log(res.JSON);
            // console.log(res.user);
            if (!res.ok) {
                // If either the token has expired or does not exist, send to login page for authorization
                if (res.status == 401 || res.status == 404) {
                    localStorage.removeItem('user');
                    document.location = '/login';
                    throw new Error("Unauthenticated");
                } else {
                    throw new Error(res.json().error)
                }
            } else {
                res.json().then(user => {
                    // console.log(user);
                    // console.log(user.id);
                    console.log(user.id);
                    user_id =  user.id;
                });
            }
        });
    }

    /**
     * fetchSettings uses an API call to get user settings using an ID value acquired from fetchUser.
     * Currently does not work as intended due to fetch() commands not being able to permanently modify global variables
     */
    function fetchSettings() {
        // console.log(user_id);
        fetch(`/api/users/${user_id}/settings`).then(res => {
            console.log(res);
            res.json().then(settings => {
                console.log(settings);
                console.log(settings.work_time);
                work_time = settings.work_time;
                break_time = settings.break_time;
                long_time = settings.long_time;
                current_cycle = settings.current_cycle;
                active = settings.active;
                work_count = settings.work_count;
            });
        });
        current_work_time = work_time;
        current_break_time = break_time;
        current_long_time = long_time;
        updateDisplay('work_time', current_work_time);
        console.log("Current Work Time: " + current_work_time);
        updateDisplay('break_time', current_break_time);
        updateDisplay('long_time', current_long_time);
    }

    /**
     * updateSettings takes settings that the user has modified and sends them to the database to be stored
     */
    async function updateSettings() {
        fetch(`/api/users/${user_id}/newSettings`, {
            method: 'PUT',
            body: JSON.stringify({
                "work_time": work_time,
                "break_time": break_time,
                "long_time": long_time,
                "current_cycle": current_cycle,
                "active": active,
                "work_count": work_count
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    /**
     * activateClock begins the clock countdown for work, break, or long break.
     * Also updates user's settings; specifically the active, current_cycle, and work_count values.
     */
    function activateClock() {
        active = !active;
        console.log(active ? "Activated" : "Deactivated");
        updateSettings();
    }

    /**
     * decrementCLock handles decreasing the displayed time value for the correct cycle
     */
    function decrementClock() {
        if (active) {
            switch(current_cycle) {
                case 0:
                    current_work_time--;
                    console.log("Cycle 1");

                    if (current_work_time === -1) {
                        current_work_time = work_time;
                        work_count++;
                        current_cycle = (work_count === 3) ? 2 : 1;
                    }

                    console.log(current_work_time);

                    updateDisplay('work_time', current_work_time);
                    break;
                case 1: 
                    current_break_time--;
                    console.log("Cycle 2");

                    if (current_break_time === -1) {
                        current_break_time = break_time;
                        current_cycle = 0;
                    }

                    updateDisplay('break_time', current_break_time);
                    break;
                case 2:
                    current_long_time--;
                    console.log("Cycle 3");

                    if (current_long_time === -1) {
                        current_long_time = long_time;
                        current_cycle = 0;
                        work_count = 0;
                    }

                    updateDisplay('long_time', current_long_time);
                    break;
            }
            updateSettings();
        }
    }

    /**
     * skipCycle allows a user to skip a work, break, or long break cycle to access the next corresponding cycle
     */
    function skipCycle() {
        if (!active) {
            switch(current_cycle) {
                case 0:
                    console.log("Skipped Cycle 1");
                    current_work_time = work_time;
                    current_cycle = 1;
                    updateDisplay('work_time', current_work_time);
                    break;
                case 1:
                    console.log("Skipped Cycle 2");
                    current_break_time = break_time;
                    current_cycle = (work_count === 3) ? 2 : 0;
                    updateDisplay('break_time', current_break_time);
                    break;
                case 2:
                    console.log("Skipped Cycle 3");
                    current_long_time = long_time;
                    current_cycle = 0;
                    updateDisplay('long_time', current_long_time);
                    break;
            }
            activateClock(); // Automatically activate clock after skipping
        }
    }

    /**
     * updateDisplay changes the displayed time value to match the actual time value that has been calculated
     * 
     * @param {*} elementId Name of the element being altered
     * @param {*} timeInSeconds Current amount of time left to reach 0 in seconds
     */
    function updateDisplay(elementId, timeInSeconds) {
        let minutes = Math.floor(timeInSeconds / 60);
        let seconds = timeInSeconds % 60;
        document.getElementById(elementId).innerText = craftTimeString(minutes, seconds);
    }

    /**
     * craftTimeString takes the total time in seconds and splits into minute and seconds for the purpose of displaying them as text
     * @param {*} minutes Current amount of minutes left to reach 0 in minutes
     * @param {*} seconds Current amount of minutes left to reach 0 in seconds
     * @returns a string that matches the "00:00" clock format
     */
    function craftTimeString(minutes, seconds) {
        let minText = minutes < 10 ? "0" + minutes : minutes.toString();
        let secText = seconds < 10 ? "0" + seconds : seconds.toString();
        return minText + ":" + secText;
    }

    /**
     * changeTime is used to modify a user's settings with their own custom values that are provided through the UI
     */
    function changeTime() {
        if (!active) {
            let newWorkMin = parseInt(document.getElementById('work_min').value);
            let newWorkSec = parseInt(document.getElementById('work_sec').value);

            if (newWorkMin != null && newWorkSec != null) {
                console.log(work_time);
                work_time = (newWorkMin * 60) + newWorkSec;
                console.log(work_time);
            }

            current_work_time = work_time;

            let newBreakMin = parseInt(document.getElementById('break_min').value);
            let newBreakSec = parseInt(document.getElementById('break_sec').value);

            if (newBreakMin != null && newBreakSec != null) {
                break_time = (newBreakMin * 60) + newBreakSec;
            }

            current_break_time = break_time;

            let newLongMin = parseInt(document.getElementById('long_min').value);
            let newLongSec = parseInt(document.getElementById('long_sec').value);

            if (newLongMin != null && newLongSec != null) {
                long_time = (newLongMin * 60) + newLongSec;
            }

            current_long_time = long_time;

            work_count = 0;
            current_cycle = 0;
            updateDisplay('work_time', current_work_time);
            updateDisplay('break_time', current_break_time);
            updateDisplay('long_time', current_long_time);
            updateSettings();
        }
    }

    document.getElementById('activator').addEventListener('click', activateClock);
    document.getElementById('skipper').addEventListener('click', skipCycle);
    document.getElementById('update').addEventListener('click', changeTime);

    // Repeatedly run decrementClock every 1 second
    setInterval(decrementClock, 1000);

    // Meant to be where fetchUser and fetchSettings is supposed to run, but needs to be fixed
    user_id = fetchUser();
    fetchSettings();
    console.log(user_id);
    console.log("Current Work Time: " + current_work_time);
});
