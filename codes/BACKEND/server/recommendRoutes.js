const express = require('express');
const pool = require('./database');
const router = express.Router();

async function getTracks(mood){
    const query = 'SELECT t.trackID, t.title, t.spotifyURL, a2.coverArtURL, a3.name FROM sentirhy.tracks t JOIN sentirhy.audiofeats a ON t.trackID = a.trackID JOIN sentirhy.albums a2 ON t.albumID = a2.albumID JOIN sentirhy.artists a3 on t.artistID = a3.artistID WHERE a.combinedemotion = $1;'
    try {
        const { rows } = await pool.query(query, [mood]);
        console.log(rows)
        return rows
    } catch (err) {
        console.error('Error fetching tracks by mood:', err);
        throw err;
    }
}

router.get('/country-categorized', async(req,res) => {
    const userMood = req.query.mood;

    if (!userMood) {
        return res.status(400).send('Missing mood or country parameter');
    }

    try {
        const recommendations = await getTracks(userMood);
        res.json(recommendations);
    } catch (err) {
        console.error('Error getting recommendations:', err.message);
        res.status(500).send('Error getting recommendations');
    }
});

module.exports = router;