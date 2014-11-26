// LGTM
chrome.runtime.onMessage.addListener(
    function (message, sender, sendResponse) {
      if (message && message.data) {
        var input = document.getElementById("new_comment_field");

        // input field is present
        if (input) {
          input.value += "LGTM!\n" + message.data['markdown'];

          // also submit directly
          if (message.type != "lgtm_no_submit") {
            console.log('LGTMed! ', message.data['imageUrl']);
            var submitButtonWrap = document.getElementById("partial-new-comment-form-actions");
            if (submitButtonWrap) {
              var submitButtonCandidates = submitButtonWrap.getElementsByClassName("primary");
              if (submitButtonCandidates.length > 0) submitButtonCandidates[0].click()
            }
          }
        }
      }
    }
);

//chrome.runtime.onMessage.addListener(
//    function (message, sender, sendResponse) {
//      var input = document.getElementById("new_comment_field");
//      input.innerHTML += message.data;
//      console.log('LGTMed!');
//    }
//);
