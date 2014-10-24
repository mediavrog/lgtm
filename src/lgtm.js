// LGTM
chrome.runtime.onMessage.addListener(
    function (message, sender, sendResponse) {
      var input = document.getElementById("new_comment_field");
      input.value += message.data['markdown'];
      console.log('LGTMed! ', message.data['imageUrl']);
    }
);

//chrome.runtime.onMessage.addListener(
//    function (message, sender, sendResponse) {
//      var input = document.getElementById("new_comment_field");
//      input.innerHTML += message.data;
//      console.log('LGTMed!');
//    }
//);
