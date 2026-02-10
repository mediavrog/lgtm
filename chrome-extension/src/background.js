// When the extension is installed or upgraded ...
chrome.runtime.onInstalled.addListener(() => {
    // Replace all rules ...
    chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
        // With a new rule ...
        chrome.declarativeContent.onPageChanged.addRules([
            {
                conditions: [
                    new chrome.declarativeContent.PageStateMatcher({
                        pageUrl: {hostContains: 'github.com'}
                    })
                ],
                // And shows the extension's page action.
                actions: [new chrome.declarativeContent.ShowAction()]
            }
        ]);
    });
});

chrome.action.onClicked.addListener(() => {
    //console.log("Page action:", event);
    lgtm();
});

chrome.commands.onCommand.addListener((command) => {
    //console.log('Command:', command);
    lgtm(command);
});

chrome.runtime.onMessage.addListener((message) => {
    // console.log("message received", message);
    if (message.action === 'loadLgtm') {
        loadLgtm(function (lgtmResponse) {
            var payload = {action: 'initiate', type: message.type, lgtm: lgtmResponse || {}};
            sendMessage(payload);
        })
    }
});

function lgtm(command) {
    var payload = {action: 'initiate', type: command ? command : 'lgtm'};
     console.log('sending', payload);
    sendMessage(payload);
}

function sendMessage(payload) {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        if(tabs[0]) chrome.tabs.sendMessage(tabs[0].id, payload);
    });
}

function loadLgtm(callback) {
    fetch("https://us-central1-lgtm-reloaded.cloudfunctions.net/lgtm", { headers: { Accept: "application/json" } })
      .then((r) => r.json())
      .then((lgtm) => {
         console.log("Received lgtm: ", lgtm);
         if (callback) callback(lgtm);
      })
      .catch((e) => {
        console.warn(e);
        callback(null);
      })
}
