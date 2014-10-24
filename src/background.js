// When the extension is installed or upgraded ...
chrome.runtime.onInstalled.addListener(function () {
  // Replace all rules ...
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    // With a new rule ...
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: {hostContains: 'github.', pathContains: 'pull'}
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
  lgtm();
});

function lgtm() {
  chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://www.lgtm.in/g", true);
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4) {
        var data = JSON.parse(xhr.responseText);
        //console.log("Received data: ", data);
        chrome.tabs.sendMessage(tabs[0].id, {"type": "lgtm", "data": data});
      }
    };
    xhr.send();
  });
}