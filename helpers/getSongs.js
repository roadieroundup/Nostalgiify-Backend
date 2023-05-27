// const { chromium } = require('playwright');
const pw = require('playwright');
require('dotenv').config();

const url = 'https://www.billboard.com/charts/hot-100/';

const mySecret = process.env.BROWSERLESS_SECRET;



const getSongs = async (year, month, day) => {
    // const browser = await chromium.launch();

    

    const browser = await pw.chromium.connectOverCDP(
        'wss://chrome.browserless.io?token=' + mySecret
    );

    const page = await browser.newPage();
    await page.goto(url + `${year}-${month}-${day}/`,{
        options: {
            waitUntil: 'load',
            timeout: 80000,
        }
    });

    //! OPTIMIZE THIS IF POSSIBLE
    const titleAndArtist = await page.$$eval('.a-no-trucate', result => {
        return result.map(elem => elem.innerText);
    });

    const ListOfSongs = [];
    for (let i = 0; i < titleAndArtist.length; i += 2) {
        const song = titleAndArtist[i];
        const artist = titleAndArtist[i + 1];
        ListOfSongs.push({ song, artist });
    }

    // IT RETURNS LIKE 60 TO 80 SONGS, IT SHOULD BE 100
    // console.log(ListOfSongs.length);

    await page.close();
    await browser.close();

    return ListOfSongs;
};


module.exports = getSongs;
