var express = require('express');
var request = require('request');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/webhook', function(req, res) {
  if (req.query['hub.mode'] === 'subscribe' &&
      req.query['hub.verify_token'] === 'hello_token') {
    console.log("Validating webhook");
    res.status(200).send(req.query['hub.challenge']);
  } else {
    console.error("Failed validation. Make sure the validation tokens match.");
    res.sendStatus(403);          
  }  
});
// handler receiving messages
router.post('/webhook', function (req, res) {
    var events = req.body.entry[0].messaging;
    for (i = 0; i < events.length; i++) {
        var event = events[i];
        if (event.message && event.message.text) {
        	text=event.message.text;
        	console.log(text);
            sendMessage(event.sender.id, {text: event.message.text +" palm How r u today"});
        }
    }
    res.sendStatus(200);
});
// generic function sending messages
var token="EAACXNKbgnFwBAE93VeAh4e4ZAtK0ZAxTaDV4CZCZBWmn7Tkq5AVoxtLhqmV3t6eZCUVFZBOdqrEFojOjOkYTvwt0gHxzQTxfXHTtE1Mqj5ZARqRKAyBDLw76O3EcXoHb7iC40ZAa2VJV7l4Yb0K2psjCdj6j5HmavzOxicrvpP8mPgZDZD";
function sendMessage(recipientId, message) {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: token},
        method: 'POST',
        json: {
            recipient: {id: recipientId},
            message: message,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
};

module.exports = router;
