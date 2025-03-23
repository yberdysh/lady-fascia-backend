const { google } = require('googleapis');
const readline = require('readline');

const SCOPES = ['https://www.googleapis.com/auth/gmail.send'];
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

console.log(
  'Authorize this app by visiting this URL:',
  oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  })
);

rl.question('Enter the code from that page here: ', (code) => {
  oAuth2Client.getToken(code, (err, token) => {
    if (err) {
      console.error('Error retrieving access token', err);
      return;
    }
    console.log('Refresh Token:', token.refresh_token);
    rl.close();
  });
});
