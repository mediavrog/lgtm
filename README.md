# LGTM reloaded

A chrome extension to lighten up your work.

Just click the LGTM button in the address bar or use the shortcut (Alt+L by default) to submit a LGTM, including a random gif to award the PR owner.

Works on github.com pull requests:
* If you are on "Conversation" tab: The plugin will create a comment.
* If you are on "Files changed" review tab: The plugin will "approve" the PR.

If you already have typed some comment into the textarea, the plugin will keep your text and just append the LGTM.
Enjoy your teamwork :)

You can configure the shortcuts in `Chrome` > `More tools` > `Extensions` > `Keyboard Shortcuts`.

## Publishing

- Zip the `chrome-extension` folder
- upload to chrome developer portal https://chrome.google.com/webstore/developer/dashboard
