const express = require('express');
const Peer = require('simple-peer');
const wrtc = require('wrtc');
const bodyParser = require('body-parser');

const app = express();

const port = 3000;

let offer;

const peer1 = new Peer({ initiator: true, wrtc: wrtc });

peer1.on('signal', data => {
  console.log('SIGNAL', JSON.stringify(data));
  if (data.type === 'offer') {
    offer = JSON.stringify(data);
  }
});

peer1.on('connect', () => {
  console.log('CONNECT');
});

peer1.on('stream', stream => {
  console.log('receiving stream');
});

peer1.on('track', function (track, stream) {
  console.log('receiving track');
});

peer1.on('data', function (chunk) {
  console.log('got a chunk', chunk)
})

app.use(bodyParser.json());

app.get('/offer', (req, res) => res.send(offer));

app.post('/response', (req, res) => {
  console.log(req.body);
  peer1.signal(req.body);
  res.send('success');
});



app.use(express.static('../client'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
