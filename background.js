currentState = localStorage.kissmetricsdebugger || 2;
states = ["kmdebugger.start()", "kmdebugger.mute()", "kmdebugger.stop()"];
icons = ["icon.png", "icon-mute.png", "icon-disabled.png"];


function updateCurrentStatus(){
    chrome.browserAction.setIcon({path: icons[currentState]});
    localStorage.kissmetricsdebugger = currentState;
}

function toggleState(){
    currentState = (currentState + 1) % states.length;
    chrome.tabs.executeScript(null, {code: inject(states[currentState])});
    updateCurrentStatus();
}

function inject(code){
    return "var s = document.createElement('script');" +
           "s.text = '" + code + ";';" +
           "s.onload = function() { " +
           "this.parentNode.removeChild(this);" +
           "};" +
           "(document.head||document.documentElement).appendChild(s);"
}

updateCurrentStatus();

chrome.browserAction.onClicked.addListener(function(tab) {
    toggleState();
});
