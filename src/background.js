// When the extension is installed or upgraded ...
chrome.runtime.onInstalled.addListener(function () {
    // Replace all rules ...
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
        // With a new rule ...
        chrome.declarativeContent.onPageChanged.addRules([
            {
                conditions: [
                    new chrome.declarativeContent.PageStateMatcher({
                        pageUrl: {hostContains: 'github.com'}
                    })
                ],
                // And shows the extension's page action.
                actions: [new chrome.declarativeContent.ShowPageAction()]
            }
        ]);
    });
});

chrome.pageAction.onClicked.addListener(function (event) {
    //console.log("Page action:", event);
    lgtm();
});

chrome.commands.onCommand.addListener(function (command) {
    //console.log('Command:', command);
    lgtm(command);
});

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    // console.log("message received", message);
    if (message.action == 'loadLgtm') {
        loadLgtm(function (lgtmResponse) {
            var payload = {action: 'initiate', type: message.type, lgtm: lgtmResponse};
            sendMessage(payload);
        })
    }
});

function lgtm(command) {
    var payload = {action: 'initiate', type: command ? command : 'lgtm'};
    // console.log('sending', payload);
    sendMessage(payload);
}

function sendMessage(payload) {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        if(tabs[0]) chrome.tabs.sendMessage(tabs[0].id, payload);
    });
}

function loadLgtm(callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://www.lgtm.in/g?PageSpeed=noscript", true);
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && callback) {
            var lgtm = {};
            try {
                lgtm = JSON.parse(xhr.responseText);
                //console.log("Received lgtm: ", lgtm);
            } catch (e) {
                console.warn(e);
            }

            callback(lgtm);
        }
    };
    xhr.send();
}
