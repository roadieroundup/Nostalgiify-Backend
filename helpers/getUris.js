const SpotifyApi = require('../api/SpotifyApi');

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
        console.log(error);
    }
};

const getUris = async (songs, access_token, year) => {
    try {
        const fetchPromises = songs.map(({ song, artist }) =>
            getUri(song, artist, access_token, parseInt(year))
        );
        const results = await Promise.all(fetchPromises);

        const songsUris = results.filter(uri => uri !== undefined);

        return songsUris;
        
    } catch (error) {
        console.error('Error fetching song data:', error);
    }
};

module.exports = getUris;
