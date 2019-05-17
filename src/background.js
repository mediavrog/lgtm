const GIPHY_KEY = "YsXCLQanDTP5are4P6Phch3O4U4WQLGQ";

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
    if (message.action === 'loadLgtm') {
        loadLgtm(function (lgtmResponse) {
            var payload = {action: 'initiate', type: message.type, lgtm: lgtmResponse};
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
    var xhr = new XMLHttpRequest();
    //xhr.open("GET", "http://www.lgtm.in/g?PageSpeed=noscript", true);
    xhr.open("GET", `https://api.giphy.com/v1/gifs/random?api_key=${GIPHY_KEY}&tag=thumbs-up`);
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && callback) {
            var lgtm = {};
            try {
                var lgtmData = JSON.parse(xhr.responseText).data;
                console.log("Received lgtm: ", lgtmData);
                var imageUrl = lgtmData.image_url;
                var smallImageUrl = lgtmData.fixed_height_downsampled_url;
                lgtm = {
                    "markdown": `[![LGTM](${smallImageUrl})](${lgtmData.url})\nPowered By GIPHY`,
                    "imageUrl": smallImageUrl,
                    "actualImageUrl": imageUrl,
                }
            } catch (e) {
                console.warn(e);
            }

            callback(lgtm);
        }
    };
    xhr.send();
}
