const express = require("express")
const axios = require('axios');
const qs = require('qs');

const router = express.Router()

const clientId = "<<Dropbox app key>>";
const clientSecret = "<<Dropbox client secret>>";

router.get('/auth/dropbox', (req, res) => {
    const redirectUri = `http://localhost:4000/auth/dropbox/callback`;
    const queryParams = {
      response_type: 'code',
      client_id: clientId,
      redirect_uri: redirectUri
    };
    const query = qs.stringify(queryParams);
    const authorizationUrl = `https://www.dropbox.com/oauth2/authorize?${query}`;
    res.send({url: authorizationUrl});
  });
  
router.get('/auth/dropbox/callback', async (req, res) => {
    try {
        const { code } = req.query;
        console.log("Inside callback")
        const redirectUri = `http://localhost:4000/auth/dropbox/callback`;
        const params = {
            code: code,
            grant_type: 'authorization_code',
            client_id: clientId,
            client_secret: clientSecret,
            redirect_uri: redirectUri
        };
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded'
        };
        const tokenUrl = 'https://api.dropboxapi.com/oauth2/token';
        const { data } = await axios.post(tokenUrl, qs.stringify(params), { headers });
        const accessToken = data.access_token;
        console.log(accessToken)
        res.json({ accessToken });
    } catch (err) {
        console.log(err)
    }
  
});  

module.exports = router;