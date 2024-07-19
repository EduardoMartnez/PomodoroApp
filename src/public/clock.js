document.addEventListener('DOMContentLoaded', (event) => {
    let workTime;
    let currentWorkTime;
    let breakTime;
    let currentBreakTime;
    let longTime;
    let currentLongTime;
    let currentCycle;
    let active;
    let workCount;

    async function fetchSettings() {
        const response = await fetch('http://localhost:3000/settings');
        const data = await response.json();
        workTime = data.workTime;
        breakTime = data.breakTime;
        longTime = data.longTime;
        currentCycle = data.currentCycle;
        active = data.active;
        workCount = data.workCount;
        currentWorkTime = workTime;
        currentBreakTime = breakTime;
        currentLongTime = longTime;
        updateDisplay('workTime', currentWorkTime);
        updateDisplay('breakTime', currentBreakTime);
        updateDisplay('longTime', currentLongTime);
    }

    async function updateSettings() {
        await fetch('http://localhost:3000/settings', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                workTime,
                breakTime,
                longTime,
                currentCycle,
                active,
                workCount
            })
        });
    }

    function activateClock() {
        active = !active;
        console.log(active ? "Activated" : "Deactivated");
        updateSettings();
    }

    function decrementClock() {
        if (active) {
            switch(currentCycle) {
                case 0:
                    currentWorkTime--;
                    console.log("Cycle 1");

                    if (currentWorkTime === -1) {
                        currentWorkTime = workTime;
                        workCount++;
                        currentCycle = (workCount === 3) ? 2 : 1;
                    }

                    console.log(currentWorkTime);

                    updateDisplay('workTime', currentWorkTime);
                    break;
                case 1: 
                    currentBreakTime--;
                    console.log("Cycle 2");

                    if (currentBreakTime === -1) {
                        currentBreakTime = breakTime;
                        currentCycle = 0;
                    }

                    updateDisplay('breakTime', currentBreakTime);
                    break;
                case 2:
                    currentLongTime--;
                    console.log("Cycle 3");

                    if (currentLongTime === -1) {
                        currentLongTime = longTime;
                        currentCycle = 0;
                        workCount = 0;
                    }

                    updateDisplay('longTime', currentLongTime);
                    break;
            }
            updateSettings();
        }
    }

    function skipCycle() {
        if (!active) {
            switch(currentCycle) {
                case 0:
                    console.log("Skipped Cycle 1");
                    currentWorkTime = workTime;
                    currentCycle = 1;
                    updateDisplay('workTime', currentWorkTime);
                    break;
                case 1:
                    console.log("Skipped Cycle 2");
                    currentBreakTime = breakTime;
                    currentCycle = (workCount === 3) ? 2 : 0;
                    updateDisplay('breakTime', currentBreakTime);
                    break;
                case 2:
                    console.log("Skipped Cycle 3");
                    currentLongTime = longTime;
                    currentCycle = 0;
                    updateDisplay('longTime', currentLongTime);
                    break;
            }
            activateClock(); // Automatically activate clock after skipping
        }
    }

    function updateDisplay(elementId, timeInSeconds) {
        let minutes = Math.floor(timeInSeconds / 60);
        let seconds = timeInSeconds % 60;
        document.getElementById(elementId).innerText = craftTimeString(minutes, seconds);
    }

    function craftTimeString(minutes, seconds) {
        let minText = minutes < 10 ? "0" + minutes : minutes.toString();
        let secText = seconds < 10 ? "0" + seconds : seconds.toString();
        return minText + ":" + secText;
    }

    function changeTime() {
        if (!active) {
            let newWorkMin = parseInt(document.getElementById('workMinModify').value);
            let newWorkSec = parseInt(document.getElementById('workSecModify').value);

            if (newWorkMin != null && newWorkSec != null) {
                console.log(workTime);
                workTime = (newWorkMin * 60) + newWorkSec;
                console.log(workTime);
            }

            currentWorkTime = workTime;

            let newBreakMin = parseInt(document.getElementById('breakMinModify').value);
            let newBreakSec = parseInt(document.getElementById('breakSecModify').value);

            if (newBreakMin != null && newBreakSec != null) {
                breakTime = (newBreakMin * 60) + newBreakSec;
            }

            currentBreakTime = breakTime;

            let newLongMin = parseInt(document.getElementById('longMinModify').value);
            let newLongSec = parseInt(document.getElementById('longSecModify').value);

            if (newLongMin != null && newLongSec != null) {
                longTime = (newLongMin * 60) + newLongSec;
            }

            currentLongTime = longTime;

            workCount = 0;
            currentCycle = 0;
            updateDisplay('workTime', currentWorkTime);
            updateDisplay('breakTime', currentBreakTime);
            updateDisplay('longTime', currentLongTime);
            updateSettings();
        }
    }

    document.getElementById('activator').addEventListener('click', activateClock);
    document.getElementById('skipper').addEventListener('click', skipCycle);
    document.getElementById('update').addEventListener('click', changeTime);

    setInterval(decrementClock, 1000);

    fetchSettings();
});
