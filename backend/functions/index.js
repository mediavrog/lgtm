const functions = require('firebase-functions');
const https = require("https");

const GIPHY_KEY = functions.config().giphy.api_key;
const GIPHY_ENDPOINT = "https://api.giphy.com/v1/gifs/random";

exports.lgtm = functions.https.onRequest((request, response) => {
    return new Promise((resolve, reject) => {
        https.get(`${GIPHY_ENDPOINT}?api_key=${GIPHY_KEY}&tag=thumbs-up&rating=g`, res => {
            res.setEncoding("utf8");
            let body = "";
            res.on("data", data => body += data);
            res.on("end", () => {
                body = JSON.parse(body);
                let lgtmData = body.data;
                let imageUrl = (lgtmData.images.original || {}).url;
                let smallImageUrl = (lgtmData.images.fixed_height_downsampled || {}).url;
                let lgtm = {
                    "markdown": `[![LGTM](${smallImageUrl})](${lgtmData.url})\nPowered By GIPHY`,
                    "imageUrl": smallImageUrl,
                    "actualImageUrl": imageUrl,
                };
                console.log("Sending lgtm: ", lgtm);
                response.send(lgtm);
                resolve()
            });
        });
    });
});
