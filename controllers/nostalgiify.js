const { request, response } = require('express');
require('dotenv').config();
const generateRandomString = require('../helpers/generateRandomString');
const querystring = require('querystring');
const axios = require('axios');
const SpotifyApi = require('../api/SpotifyApi');
const getSongs = require('../helpers/getSongs');
const getUris = require('../helpers/getUris');

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = 'http://localhost:5173/callback';

const startPermission = async (req, res = response) => {
    const state = generateRandomString(16);
    const scope =
        'user-read-private user-read-email playlist-modify-public playlist-modify-private playlist-read-collaborative playlist-read-private';

    console.log(`the state is ${state}`);

    res.redirect(
        'https://accounts.spotify.com/authorize?' +
            querystring.stringify({
                response_type: 'code',
                client_id,
                scope: scope,
                redirect_uri,
                state: state,
            })
    );
};

const receiveCallback = async (req = request, res = response) => {
    try {
        const { data } = await axios.post(
            'https://accounts.spotify.com/api/token',
            {
                grant_type: 'authorization_code',
                code: req.body.code,
                redirect_uri,
                client_id,
                client_secret,
            },
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );

        console.log(data);

        const { access_token, refresh_token } = data;

        try {
            const {
                data: { id },
            } = await SpotifyApi(access_token).get('/me');

            res.json({
                ok: true,
                id,
                access_token: access_token,
                refresh_token: refresh_token,
                message: 'Logged In',
            });
        } catch (error) {
            // console.log(error);
            res.status(400).json({
                ok: false,
                message: 'Error getting username',
            });
        }

        return;
    } catch (error) {
        console.log(error.response.data.error);
        res.status(400).json({
            ok: false,
            message: error.response.data.error_description,
        });
        return;
    }
};

const createPlaylist = async (req = request, res = response) => {
    console.log('Create playlist begin!');

    const { access_token, user_id, year, month, day } = req.body;

    const name = `Nostalgiify ${day}/${month}/${year}`;
    const description = `Made with Nostalgiify at `;

    try {
        const songs = await getSongs(year, month, day);

        console.log('Songs fetched!');

        const uris = await getUris(songs, access_token, year);

        console.log('Uris fetched!');

        const {
            data: {
                id,
                external_urls: { spotify },
            },
        } = await SpotifyApi(access_token).post(
            `/users/${user_id}/playlists`,
            {
                name,
                description,
                public: true,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        console.log('Playlist created!');

        await SpotifyApi(access_token).post(
            `/playlists/${id}/tracks`,
            {
                uris,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        console.log('Songs added!');

        res.json({
            ok: true,
            message: 'Playlist created',
            id,
            url: spotify,
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            message: 'Error creating playlist',
        });
    }
};

module.exports = {
    startPermission,
    receiveCallback,
    createPlaylist,
};
