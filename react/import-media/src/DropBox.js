import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [accessToken, setAccessToken] = useState('');

  const authenticateDropbox = async () => {
    const { data } = await axios.get('http://localhost:4000/auth/dropbox');
    // click the data.authorizationUrl - >this will send the accessToken back
    setAccessToken(data.accessToken);
  };

  const initPicker = () => {
    const options = {
      linkType: 'preview',
      multiselect: false
    };
    window.Dropbox.choose(options)
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div>
      <button onClick={authenticateDropbox}>Authenticate with Dropbox</button>
      <button onClick={initPicker} disabled={!accessToken}>Select file from Dropbox</button>
    </div>
  );
};

export default App;