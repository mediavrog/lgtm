// LGTM
var lgtmLoadingPlaceholder = "<Loading LGTM..>";
var lgtmNoSubmitType = "lgtm_no_submit";

chrome.runtime.onMessage.addListener(
    function (message, sender, sendResponse) {
        // console.log(message);
        if (message) {
            if (message.lgtm) {
                var markdown = message.lgtm['markdown'] ? message.lgtm['markdown'].replace(message.lgtm['imageUrl'], message.lgtm['actualImageUrl']) : '';
                message.lgtm['summary'] = "\nLGTM!\n" + markdown;
            }
            // message.type = lgtmNoSubmitType; // debug

            var wasSubmitted = submitAsComment(message) || submitAsReview(message);
            if (wasSubmitted && message.lgtm) console.log('LGTMed! with', message.lgtm['imageUrl']);
        }
    }
);

/**
 * Github Plain old comment style
 * @param message
 * @returns {boolean} If the form was actually submitted after entering the LGTM.
 */
function submitAsComment(message) {
    var input = document.getElementById("new_comment_field");
    if (input) {
        var injectedLgtm = handleMessage(input, message);

        if (injectedLgtm && message.type !== lgtmNoSubmitType) {
            var submitBtn = document.querySelector("#partial-new-comment-form-actions .btn-primary");
            if (submitBtn) {
                submitBtn.click();
                return true;
            }
        }
    }

    return false;
}

/**
 * Github new reviews style. Will set the review status to 'approve' before filling in the LGTM.
 * @param message
 * @returns {boolean} If the form was actually submitted after entering the LGTM.
 */
function submitAsReview(message) {
  var reviewToggle = document.querySelector(".js-reviews-toggle");

  if (reviewToggle) {
      reviewToggle.click();
      reviewToggle.open = true;
      // select the 'approve' state
      var approve = document.querySelector('input[name="pull_request_review[event]"][value="approve"]');
      if (approve) approve.click();

      // set lgtm
      var input = document.getElementById("pull_request_review_body");
      var injectedLgtm = handleMessage(input, message);

      // click 'Submit review' button
      if (injectedLgtm && message.type !== lgtmNoSubmitType) {
          var submitBtn = document.querySelector(".form-actions button[type=submit]");
          if (submitBtn) {
              submitBtn.click();
              return true;
          }
      }
  }

  return false;
}

function handleMessage(input, message) {
    if (message.lgtm && message.lgtm['summary']) {
        setLoading(input, false);
        input.value += message.lgtm['summary'];
        return true;
    } else {
        setLoading(input, true);
        loadLgtm(message.type);
        return false;
    }
}

function setLoading(input, isLoading) {
    clearLgtmText(input);
    if (isLoading) input.value += lgtmLoadingPlaceholder;
}

function clearLgtmText(input) {
    input.value = input.value
        .replace(/\sLGTM!\s(\[!\[LGTM\][^\]]*\]).*\s*(\[:(\+|\-)1:\].*\))*\s*/, '')
        .replace(new RegExp(lgtmLoadingPlaceholder, 'g'), '')
    ;
}

function loadLgtm(type) {
    chrome.runtime.sendMessage({ action: 'loadLgtm', type: type });
}
