const { google } = require('googleapis');
const express = require('express');
const fs = require("fs")
const Axios = require("axios")

const router = express.Router()

// Create OAuth 2.0 credentials (client ID and client secret)
const clientId = '<<Google client ID>>';
const clientSecret = '<<Google client secret>>';
const redirectUri = `http://localhost:4000/api/auth/google/callback`;

// Create an OAuth2 client with the credentials
const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);

// Generate the URL for the Google Sign-In flow
router.get('/api/auth/google', (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/drive.readonly'],
  });
  console.log(url)
  res.send({url: url});
});

// Exchange the authorization code for an access token and refresh token
router.get('/api/auth/google/callback', async (req, res) => {
  let { code } = req.query;
  try {
    code = decodeURI(code)
    const { tokens } = await oauth2Client.getToken(code);
    const access_token = 'Bearer ' +  tokens.access_token;
    console.log("ACCESS_TOKEN:  ", access_token)
  } catch (error) {
    console.error("ERROR:  ", error);
    res.status(500).send('Error');
  }
});

// Use the access token to make API requests to the Google Drive API
router.get('/api/google-drive', async (req, res) => {
  const tokens = "<<Gppgle user token from front end>>";
  const fileId = "<< Google File Id >>";
  const fileName = "<<File Name>>";
  if (!tokens) {
    res.status(401).send('Unauthorized');
    return;
  }
  try {
    oauth2Client.setCredentials(tokens);
    const payload =  { 
        url: "https://www.googleapis.com/drive/v3/files/fileId?alt=media".replace("fileId", fileId),
        responseType: "stream",
        headers: {
            Authorization: "Bearer " + tokens
        }}
    try {
        const mediaData = await Axios(payload);
        fileData = mediaData.data;
        const fstream = fs.createWriteStream(fileName);
        await fileData.pipe(fstream);
    } catch (err) {
       console.log("Error on importing file", err);
    }
    res.send("success");
  } catch (error) {
    console.error(error);
    res.status(500).send('Error');
  }
});

module.exports = router;