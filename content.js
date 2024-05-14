function attachStopWatch(target) {
    const stopwatchElement = createStopWatchElement();
    const container = target.parentElement.parentElement.parentElement;
    container.classList.add("stopwatch--parent");
    container.append(stopwatchElement);
    target.style.display = "none";
}

function createStopWatchElement() {
    const root = document.createElement("div");
    root.className = "stopwatch--root";
    root.id = "stopwatch";
    root.innerHTML = '<div class="stopwatch--content"><span class="stopwatch--label"></span>&nbsp;&nbsp;<span class="stopwatch--clock"></span></div>';

    const stateNode = root.getElementsByClassName("stopwatch--label")[0];
    const clockNode = root.getElementsByClassName("stopwatch--clock")[0];

    const startCounting = function (startTimeMillis) {
        if (root.intervalId) {
            return;
        }
        localStorage.setItem(getStorageKey(), startTimeMillis);
        root.intervalId = setInterval(clockTick, 500, clockNode, startTimeMillis);
        stateNode.innerText = "Stop";
        clockNode.innerText = toTimeString(getCurrentTimeInMillis() - startTimeMillis);
    }
    const stopCounting = function () {
        clearInterval(root.intervalId);
        root.intervalId = null;
        localStorage.removeItem(getStorageKey());
        stateNode.innerText = "Start";
    }

    const previousRunTime = localStorage.getItem(getStorageKey());
    if (previousRunTime) {
        startCounting(parseInt(previousRunTime));
    } else {
        stateNode.innerText = "Start";
        clockNode.innerText = "00:00:00";
    }

    root.onclick = function () {
        if (root.intervalId) {
            stopCounting();
        } else {
            startCounting(getCurrentTimeInMillis());
        }
    }
    const ONE_MIN = 60*1000;
    setTimeout(function() {startCounting(getCurrentTimeInMillis() - ONE_MIN)}, 2*ONE_MIN);

    return root;
}

function getStorageKey() {
    const path = location.pathname;
    const arr = path.split('/');
    return "stopwatch_" + arr[2];
}

function clockTick(clockNode, startTime) {
    const diff = getCurrentTimeInMillis() - startTime;
    clockNode.innerText = toTimeString(diff);
}

function getCurrentTimeInMillis() {
    return new Date().getTime();
}

function toTimeString(time) {
    const hours = Math.floor(time / (1000 * 60 * 60));
    const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((time % (1000 * 60)) / 1000);
    return pad(hours, 2) + ":" + pad(minutes, 2) + ":" + pad(seconds, 2);
}

function pad(num, size) {
    const s = "000000000" + num;
    return s.substr(s.length - size);
}

function tryAttachStopWatch() {
    if (!window.location.pathname.startsWith('/problems/')) {
        // Not a problem page
        return;
    }
    if (document.getElementById("stopwatch")) {
        // Already attached
        return;
    }
    const target = document.querySelector("#ide-top-btns .flex.flex-none.cursor-pointer.items-center");
    if (!target) {
        // The page has been changed. The target element is not found.
        return;
    }
    attachStopWatch(target);
}
setInterval(tryAttachStopWatch, 1000);

tryAttachStopWatch();
