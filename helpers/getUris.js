const SpotifyApi = require('../api/SpotifyApi');

const MAX_REQUESTS_PER_SECOND = 5; // Maximum number of requests per second
const BATCH_SIZE = 50; // Number of songs to process in each batch

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const getUri = async (title, artist, access_token, year) => {
    try {
        // const { data } = await SpotifyApi(access_token).get(
        //     `/search?q=track:${title}+year:${
        //         year - 1
        //     }-${year}+artist:${artist}&type=track&limit=1&offset=0`
        // );

        //! THIS NEED TO BE FIXED, BY ADDING YEAR RANGE THE RESULTS ARE NOT THE SAME
        const { data } = await SpotifyApi(access_token).get('/search', {
            params: {
                q: `track:${title} artist:${artist}`,
                type: 'track',
            },
        });

        return data.tracks?.items[0]?.uri;
    } catch (error) {
        console.log('uri not found');
    }
};

const getUris = async (songs, access_token, year) => {
    try {
        // const fetchPromises = songs.map(({ song, artist }) =>
        //     getUri(song, artist, access_token, parseInt(year))
        // );
        // const results = await Promise.all(fetchPromises);

        // const songsUris = results.filter(uri => uri !== undefined);

        const songsUris = [];
        const numBatches = Math.ceil(songs.length / BATCH_SIZE);

        for (let i = 0; i < numBatches; i++) {
            const batch = songs.slice(i * BATCH_SIZE, (i + 1) * BATCH_SIZE);
            const fetchPromises = batch.map(({ song, artist }) =>
                getUri(song, artist, access_token)
            );
            const results = await Promise.all(fetchPromises);
            const batchUris = results.filter(uri => uri !== undefined);
            songsUris.push(...batchUris);

            // Delay between batches to comply with rate limiting
            if (i < numBatches - 1) {
                await delay(1000 / MAX_REQUESTS_PER_SECOND);
            }
        }

        return songsUris;
        
    } catch (error) {
        console.error('Error getting uris spotify api');
    }
};

module.exports = getUris;
