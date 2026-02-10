// LGTM
var lgtmLoadingPlaceholder = "<Loading LGTM..>";
var lgtmNoSubmitType = "lgtm_no_submit";

chrome.runtime.onMessage.addListener(
    function (message, sender, sendResponse) {
        // console.log(message);
        if (message) {
            if (message.lgtm) {
                var markdown = message.lgtm['markdown'] ? message.lgtm['markdown'] : '';
                message.lgtm['summary'] = "\nLGTM :+1:\n" +
                    markdown +
                    " and [LGTM reloaded](https://chrome.google.com/webstore/detail/lgtm-reloaded/hefidgcceobmmaiekccmbjpdcmbjklej).";
            }
            message.type = lgtmNoSubmitType; // debug

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
            var submitBtn = document.querySelector("#partial-new-comment-form-actions button[type=submit]");
            if (submitBtn) {
                submitBtn.click();
                return true;
            }
        }
    }

    return false;
}

function sleepCb(ms, cb) {
  setTimeout(cb, ms);
}

function waitForSelectorCb(selector, opts, cb) {
  opts = opts || {};
  var timeoutMs = typeof opts.timeoutMs === "number" ? opts.timeoutMs : 2000;
  var intervalMs = typeof opts.intervalMs === "number" ? opts.intervalMs : 50;

  var start = Date.now();

  (function poll() {
    var el = document.querySelector(selector);
    if (el) return cb(el);

    if (Date.now() - start >= timeoutMs) return cb(null);

    sleepCb(intervalMs, poll);
  })();
}

/**
 * Github new reviews style. Will set the review status to 'approve' before filling in the LGTM.
 * @param message
 * @returns {boolean} If the form was actually submitted after entering the LGTM.
 */
function submitAsReview(message) {
  var reviewToggle = document.querySelector("button[class*=ReviewMenuButton]");
  var reviewDialog = document.querySelector('[role="dialog"][aria-labelledby="anchored-review-title"]');

  if (reviewToggle) {
      if (reviewDialog == null) {
        reviewToggle.click();
      }

      // wait for the review dialog to open and the textarea to show
      waitForSelectorCb(
          '[role="dialog"][aria-labelledby="anchored-review-title"] textarea',
          { timeoutMs: 3000, intervalMs: 50 },
          function (input) {
            if (!input) return;

          // select the 'approve' state
          var approve = document.querySelector('[role=dialog][aria-labelledby=anchored-review-title] input[name="reviewEvent"][value="approve"]');
          if (approve) approve.click();

          // set lgtm
          //var input = document.querySelector("[role=dialog][aria-labelledby=anchored-review-title] textarea");
          var injectedLgtm = handleMessage(input, message);

          // click 'Submit review' button
          if (injectedLgtm && message.type !== lgtmNoSubmitType) {
              var submitBtn = document.querySelector("[role=dialog][aria-labelledby=anchored-review-title] button[class*=SubmitReview]");
              if (submitBtn) {
                  submitBtn.click();
                  return true;
              }
          }
        }
      )
  }

  return false;
}

function handleMessage(input, message) {
    var result = false;

    if (message.lgtm && message.lgtm['summary']) {
        setLoading(input, false);
        input.value += message.lgtm['summary'];
        result = true;
    } else {
        setLoading(input, true);
        loadLgtm(message.type);
    }

    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));

    return result;
}

function setLoading(input, isLoading) {
    clearLgtmText(input);
    if (isLoading) input.value += lgtmLoadingPlaceholder;
}

function clearLgtmText(input) {
    input.value = input.value
        .replace(/\s*LGTM.*\s\[!\[LGTM.*\sPowered.*\)./, '')
        .replace(new RegExp(lgtmLoadingPlaceholder, 'g'), '')
    ;
}

function loadLgtm(type) {
    chrome.runtime.sendMessage({ action: 'loadLgtm', type: type });
}
