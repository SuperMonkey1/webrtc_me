const https = require("https");

const getIceServers = (req, res) => {
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

    const httpreq = https.request(request_options, function(httpres) {
        let str = "";
        httpres.on("data", function(data){ str += data; });
        httpres.on("error", function(e){ console.log("error: ", e); });
        httpres.on("end", function(){ 
            console.log("ICE List: ", str);
            res.send(str);
        });
    });

    httpreq.on("error", function(e){ console.log("request error: ", e); });
    httpreq.end(bodyString);
};

module.exports = {
    getIceServers
};