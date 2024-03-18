// npm install twilio
const twilio = require('twilio');

const accountSid = 'your_account_SID'; // Your Account SID from www.twilio.com/console
const authToken = 'your_auth_token';   // Your Auth Token from www.twilio.com/console

const client = new twilio(accountSid, authToken);

client.messages.create({
  body: 'Hello from Node',
  to: '+12345678901',  // Text this number
  from: '+10987654321' // From a valid Twilio number
})
.then((message) => console.log(message.sid));
