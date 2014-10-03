//var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
//});

//example of using a message handler from the inject scripts
chrome.extension.onMessage.addListener(
    function (request, sender, sendResponse) {
      chrome.pageAction.show(sender.tab.id);
      sendResponse();
    });

// When the extension is installed or upgraded ...
chrome.runtime.onInstalled.addListener(function () {
  // Replace all rules ...
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    // With a new rule ...
    chrome.declarativeContent.onPageChanged.addRules([
      {
        // That fires when a page's URL contains a 'g' ...
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

chrome.commands.onCommand.addListener(function(command) {
  //console.log('Command:', command);
  lgtm();
});

function lgtm() {
  chrome.tabs.executeScript(null, {file: "/src/lgtm.js"});
}