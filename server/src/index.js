const express = require('express');
const Peer = require('simple-peer');
const wrtc = require('wrtc');
const bodyParser = require('body-parser');
const { RTCVideoSink, RTCVideoSource, i420ToRgba, rgbaToI420 } = require('wrtc').nonstandard;

const app = express();

const port = 3000;

let signals = [];

const peer1 = new Peer({ initiator: true, wrtc: wrtc });

peer1.on('signal', data => {
  console.log('SIGNAL', JSON.stringify(data));
  signals.push(data);
});

peer1.on('connect', () => {
  console.log('CONNECT');
});

peer1.on('stream', mediaStream => {
  console.log('receiving stream');
  console.log(mediaStream.getAudioTracks());
  console.log(mediaStream.getVideoTracks());
  console.log(peer1._pc);
  console.log(peer1._pc.getReceivers());
  console.log(mediaStream.getVideoTracks()[0].id);
});

peer1.on('track', function (track, stream) {
  console.log('receiving track');
});

peer1.on('data', function (chunk) {
  console.log('got a chunk', chunk)
})

app.use(bodyParser.json());

app.get('/signals', (req, res) => {
  res.send(JSON.stringify(signals));
  signals = [];
});

app.post('/receiveSignal', (req, res) => {
  console.log('recieveSignmal', req.body);
  peer1.signal(req.body);
  res.send('success');
});

app.use(express.static('../client'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
