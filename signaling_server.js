const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve "about.html" on root URL
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/controller.html'));
});

// app.get('/iceservers', async (req, res) => {
//   const accountSid = process.env.TWILIO_ACCOUNT_SID;
//   const authToken = process.env.TWILIO_AUTH_TOKEN;
//   const client = require('twilio')(accountSid, authToken);

//   try {
//     let twilio_client_tokens = await client.tokens.create();
//     let myIceServers = twilio_client_tokens.ice_servers;

//     console.log(myIceServers); // This will print the JSON to your server console

//     res.json(myIceServers);
//   } catch (error) {
//     console.error('Error creating Twilio token:', error);
//     res.status(500).send('Error creating Twilio token');
//   }
// });


app.get('/iceservers', (req, res) => {
  let o = {
    format: "urls"
  };
  let https = require("https");
  let bodyString = JSON.stringify(o);
  let options = {
    host: "global.xirsys.net",
    path: "/_turn/freleys",
    method: "PUT",
    headers: {
      "Authorization": "Basic " + Buffer.from(process.env.XIRSYS_CREDENTIAL).toString("base64"),
      "Content-Type": "application/json",
      "Content-Length": bodyString.length
    }
  };
  let httpreq = https.request(options, function(httpres) {
    let str = "";
    httpres.on("data", function(data){ str += data; });
    httpres.on("error", function(e){ console.log("error: ",e); });
    httpres.on("end", function(){ 
      let parsed = JSON.parse(str);
      if (parsed.s === "ok") {
        res.json([parsed.v.iceServers]);  // Send an array of ICE server objects.
      } else {
        console.error('Error fetching ICE servers:', parsed.s);
        res.status(500).send('Error fetching ICE servers');
      }
    });
  });
  httpreq.on("error", function(e){ console.log("request error: ",e); });
  httpreq.end();
});



io.on('connection', socket => {
  console.log('User connected');

  socket.on('offer', (offer) => {
    socket.broadcast.emit('offer', offer);
  });

  socket.on('answer', (answer) => {
    socket.broadcast.emit('answer', answer);
  });

  socket.on('candidate', (candidate) => {
    socket.broadcast.emit('candidate', candidate);
  });
});

//server.listen(3000, '10.64.45.143', () => console.log('Server is running on port 3000'));
//server.listen(3000, () => console.log('Server is running on port 3000'));

const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`Server is running on port ${port}`));