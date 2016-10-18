// LGTM
var lgtmLoadingPlaceholder = "# Loading LGTM.. #";
var lgtmNoSubmitType = "lgtm_no_submit";

chrome.runtime.onMessage.addListener(
    function (message, sender, sendResponse) {
        // console.log(message);
        if (message) {
            if (message.lgtm) message.lgtm['summary'] = "LGTM!\n" + message.lgtm['markdown'];
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
        handleMessage(input, message);

        if (message.type != lgtmNoSubmitType) {
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
    var reviewToggle = document.querySelector(".js-reviews-container > button.js-menu-target");
    if (reviewToggle) {
        // need to open the review
        var expandedAttr = reviewToggle.attributes.getNamedItem('aria-expanded');
        if (!expandedAttr || expandedAttr.nodeValue == 'false') reviewToggle.click();

        // select the 'approve' state
        var approve = document.querySelector("#submit-review[aria-expanded=true] input[value=approve]");
        if (approve) approve.click();

        // set lgtm
        var input = document.getElementById("pull_request_review_body");
        handleMessage(input, message);

        if (message.type != lgtmNoSubmitType) {
            var submitBtn = document.querySelector("#submit-review[aria-expanded=true] [type=submit]");
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
        input.value += message.lgtm['summary']
    } else {
        setLoading(input, true);
        loadLgtm(message.type);
    }
}

function setLoading(input, isLoading) {
    var ph = lgtmLoadingPlaceholder;

    input.value = input.value.replace(new RegExp(ph, 'g'), '');
    if (isLoading) input.value += ph;
}

function loadLgtm(type) {
    chrome.runtime.sendMessage({action: 'loadLgtm', type: type});
}
