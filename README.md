# PomodoroApp
This is my attempt at creating a Pomodoro style app for helping me focus on work.

## Problem

I have issues focusing on my work. I was once suggested to use the Pomodoro technique to help me focus on my work without getting distracted overtime. The Pomodor technique is to break up work time with occasional breaks to avoid work fatigue. I found some apps that provided such a service, but found the requirement to pay or subscribe to access all features was annoying to me. So, I now plan on creating my own version of a Pomodor web application that I can modify to my needs.

## Objectives

1. Create a web application with the fundamental aspects of a Pomodoro technique, along with modifiable work and break times.
2. Add HTML for basic functionality, and later CSS for clearer user experience.
3. Add Task functionality to keep track of how many Pomodoro cycles I go through to accomplish a Task. Could alternatively create a timeline system that showcases what Tasks were completed during a Pomodoro cycle.

## Requirements

### Use Case 1: Display Menu

Display the Pomodoro Clock with a cycle, and a menu of options for working with the PomodoroApp systems for a user.
#### Main Flow

    A user goes to the PomodoroApp website.
    A user selects one of the following menu options:
        Activate Pomodoro Cycle [UC2]
        Pause Pomodoro Cycle [UC3]
        Change Pomodoro Cycle [UC4]
        Create preset [UC5]
        Delete preset [UC6]
        Skip Pomodoro Cycle [UC7]
        Add Ingredient [UC8]

### Use Case 2: Activate Pomodoro Cycle
#### Preconditions
User selected the Activate option from the menu [UC1]

#### Main Flow

    1. The Pomodoro cycle will begin counting down with the work section, and the Activate will change to Pause.
    2. After the work time reaches 0:00, Pomodoro cycle will automatically switch to the break section.
    3. After break time reaches 0:00, return to Step 1 for 3 additional work cycles.
    4. After the 4th work cycle is complete begin the long break section of the Pomodoro cycle.
    5. Repeat step 1 through 4 until [UC3]

### Use Case 3: Pause Pomodoro Cycle
#### Preconditions
User selected the Edit Cycle option from the menu [UC1]

#### Main Flow

    1. The user clicks deactivated .
    2. The user clicks 'Done', and returns to the main menu.

#### Alternative Flows

    [Invalid Time] The entry for the time is not numerical digits in the appropriate 00:00 format, the value is less than 0:00 or greater than 60:00

### Use Case 4: Change Pomodoro Cycle
#### Preconditions
User selected the Edit Cycle option from the menu [UC1]

#### Main Flow

    1. The user enters their prefered time for both work and break sections of the Pomodoro cycle [Invalid Time][Insufficient Time], or pick an already made preset.
    2. The user clicks 'Done', and returns to the main menu.

#### Alternative Flows

    [Invalid Time] The entry for the time is not numerical digits in the appropriate 00:00 format, the value is less than 0:00 or greater than 60:00
