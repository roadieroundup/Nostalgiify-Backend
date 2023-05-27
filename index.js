const express = require('express');
const cors = require('cors');

require('dotenv').config();
const PORT = process.env.PORT;

//init app

const app = express();
app.use(cors());

app.use(express.static('public'));

app.use(express.json());

app.use('/api/nostalgiify', require('./routes/nostalgiify'));

app.listen(PORT, () => {
    console.log(`Running on http://localhost:${PORT}/`);
});

