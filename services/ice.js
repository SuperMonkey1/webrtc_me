// src/services/ice.js
const https = require("https");

class IceService {
    static async getIceServers() {
        const options = {
            format: "urls"
        };

        const bodyString = JSON.stringify(options);
        const request_options = {
            host: "global.xirsys.net",
            path: "/_turn/freleys",
            method: "PUT",
            headers: {
                "Authorization": "Basic " + Buffer.from("freleys:95a5e7a4-2cd5-11ee-bd9a-0242ac130003").toString("base64"),
                "Content-Type": "application/json",
                "Content-Length": bodyString.length
            }
        };

        return new Promise((resolve, reject) => {
            const httpreq = https.request(request_options, (httpres) => {
                let str = "";
                httpres.on("data", (data) => { str += data; });
                httpres.on("error", (e) => reject(e));
                httpres.on("end", () => resolve(str));
            });

            httpreq.on("error", (e) => reject(e));
            httpreq.end(bodyString);
        });
    }
}

module.exports = IceService;