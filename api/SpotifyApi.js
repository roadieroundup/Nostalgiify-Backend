const axios = require('axios');

require('dotenv').config();

const SpotifyApi = access_token =>
    axios.create({
        baseURL: 'https://api.spotify.com/v1',
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });

module.exports = SpotifyApi;
