function updateTime() {
    const timeElement = document.getElementById('time');
    const dateElement = document.getElementById('date');
    
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const day = now.toLocaleString('default', { weekday: 'long' });
    const date = now.toLocaleDateString();
    
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    hours = hours.toString().padStart(2, '0');
    
    timeElement.textContent = `${hours}:${minutes}:${seconds} ${ampm}`;
    dateElement.textContent = `${day}, ${date}`;
}
setInterval(updateTime, 1000);

let stopwatchTime = 0;
let isRunning = false;
let stopwatchInterval;
let lapCount = 1;

function toggleStopwatch() {
    if (isRunning) {
        clearInterval(stopwatchInterval);
        document.getElementById('startStopwatch').textContent = 'Start';
        document.getElementById('lapStopwatch').style.display = 'none';  
    } else {
        stopwatchInterval = setInterval(updateStopwatch, 1000);
        document.getElementById('startStopwatch').textContent = 'Stop';
        document.getElementById('lapStopwatch').style.display = 'inline-block'; 
    }
    isRunning = !isRunning;
}

function updateStopwatch() {
    stopwatchTime++;
    const minutes = Math.floor(stopwatchTime / 60).toString().padStart(2, '0');
    const seconds = (stopwatchTime % 60).toString().padStart(2, '0');
    document.getElementById('stopwatch-time').textContent = `${minutes}:${seconds}`;
}

function resetStopwatch() {
    clearInterval(stopwatchInterval);
    stopwatchTime = 0;
    lapCount = 1;
    document.getElementById('stopwatch-time').textContent = '00:00';
    document.getElementById('startStopwatch').textContent = 'Start';
    document.getElementById('lapStopwatch').style.display = 'none';
    document.getElementById('laps').innerHTML = '';
    isRunning = false;
}

function recordLap() {
    const minutes = Math.floor(stopwatchTime / 60).toString().padStart(2, '0');
    const seconds = (stopwatchTime % 60).toString().padStart(2, '0');
    const lapTime = `${minutes}:${seconds}`;
    
    const lapElement = document.createElement('div');
    lapElement.classList.add('lap');
    lapElement.textContent = `Lap ${lapCount}: ${lapTime}`;
    document.getElementById('laps').appendChild(lapElement);

    lapCount++;
}

let alarms = []; 
let alarmAudio = new Audio('alarm_audio.mp3.mp3'); 

document.addEventListener(
    'click',
    () => {
        alarmAudio.play().then(() => alarmAudio.pause());
    },
    { once: true }
);

function populateAlarmDropdowns() {
    const hourDropdown = document.getElementById('alarm-hour');
    const minuteDropdown = document.getElementById('alarm-minute');

    for (let i = 1; i <= 12; i++) {
        const option = document.createElement('option');
        option.value = i.toString().padStart(2, '0');
        option.textContent = i.toString().padStart(2, '0');
        hourDropdown.appendChild(option);
    }

    for (let i = 0; i < 60; i++) {
        const option = document.createElement('option');
        option.value = i.toString().padStart(2, '0');
        option.textContent = i.toString().padStart(2, '0');
        minuteDropdown.appendChild(option);
    }
}

populateAlarmDropdowns();

function setAlarm() {
    const alarmHour = document.getElementById('alarm-hour').value;
    const alarmMinute = document.getElementById('alarm-minute').value;
    const alarmAmpm = document.getElementById('alarm-ampm').value;
    const alarmDay = document.getElementById('alarm-day').value;
    const alarmStatus = document.getElementById('alarm-status');

    if (!alarmHour || !alarmMinute || !alarmAmpm || !alarmDay) {
        alarmStatus.textContent = "Please set all fields for the alarm.";
        return;
    }

    const formattedAlarmTime = `${alarmHour}:${alarmMinute} ${alarmAmpm}`;
    alarms.push({ time: formattedAlarmTime, day: alarmDay });

    alarmStatus.textContent = `Alarm set for ${alarmDay} at ${formattedAlarmTime}`;

    if (!window.alarmInterval) {
        window.alarmInterval = setInterval(checkAlarms, 1000); 
    }
}

function checkAlarms() {
    const now = new Date();
    const currentDay = now.toLocaleString('default', { weekday: 'long' });
    const currentTime = formatTime(now); 

    alarms.forEach((alarm, index) => {
        if (alarm.time === currentTime && alarm.day === currentDay) {
            alarmAudio.currentTime = 0; 
            alarmAudio.play();
            alert(`Alarm ringing for ${alarm.day} at ${alarm.time}`);

            alarms.splice(index, 1);
        }
    });

    if (alarms.length === 0) {
        clearInterval(window.alarmInterval);
        window.alarmInterval = null;
    }
}

function formatTime(date) {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12 || 12; 
    return `${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')} ${ampm}`;
}

function toggleTheme() {
    document.body.classList.toggle('dark');
    updateTheme();
}

function updateTheme() {
    const isDark = document.body.classList.contains('dark');
    if (isDark) {
        document.getElementById('theme-status').textContent = "Dark Mode is On";
    } else {
        document.getElementById('theme-status').textContent = "Light Mode is On";
    }
}

window.onload = () => {
    showTime();  
    updateTheme(); 
};


function showTime() {
    document.getElementById('time-section').style.display = 'block';
    document.getElementById('stopwatch-section').style.display = 'none';
    document.getElementById('alarm-section').style.display = 'none';
}

function showStopwatch() {
    document.getElementById('time-section').style.display = 'none';
    document.getElementById('stopwatch-section').style.display = 'block';
    document.getElementById('alarm-section').style.display = 'none';
}

function showAlarm() {
    document.getElementById('time-section').style.display = 'none';
    document.getElementById('stopwatch-section').style.display = 'none';
    document.getElementById('alarm-section').style.display = 'block';

    const alarmStatus = document.getElementById('alarm-status');
    alarmStatus.textContent = ""; 
}
