const tf = require('@tensorflow/tfjs-node'); 
const express = require('express');
const multer = require('multer');
const path = require('path');
const pool = require('./database');
const fs = require('fs');
const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, '/user_emotion/');
        fs.existsSync(uploadPath) || fs.mkdirSync(uploadPath);
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueName = Date.now() + '-' + file.originalname;
        cb(null, uniqueName);
    },
});

const upload = multer({ storage: storage });

async function getTracks(mood){
    const query = 'SELECT t.trackID, t.title, t.spotifyURL, a.valence, a2.coverArtURL, a3.name FROM sentirhy.tracks t JOIN sentirhy.audiofeats a ON t.trackID = a.trackID JOIN sentirhy.albums a2 ON t.albumID = a2.albumID JOIN sentirhy.artists a3 on t.artistID = a3.artistID WHERE a.combinedemotion = $1;'
    try {
        const { rows } = await pool.query(query, [mood]);
        return rows
    } catch (err) {
        console.error('Error fetching tracks by mood:', err);
        throw err;
    }
}

function generateProgressivePlaylist(user_emotion_tracks, neutral_tracks, happy_tracks, playlistLength) {

    const allTracks = user_emotion_tracks.concat(neutral_tracks, happy_tracks);
    allTracks.sort((a, b) => a.valence - b.valence);
    const step = Math.floor(allTracks.length / playlistLength);

    const selectedTracks = [];
    for (let i = 0; i < playlistLength && (i * step) < allTracks.length; i++) {
        selectedTracks.push(allTracks[i * step]);
    }

    return selectedTracks;
}

const emotions = ["Angry", "Happy", "Sad", "Neutral"];

async function loadModel() {
    try {
        const modelPath = path.resolve(__dirname, '../models/fer/model.json');
        const model = await tf.loadLayersModel(`file://${modelPath}`);
        return model;
      } catch (error) {
        console.error('Error loading model:', error);
      }
    }

async function predictEmotion(imageFilename) {
    const imagePath = path.join(__dirname, '/user_emotion/', imageFilename);
    const model = await loadModel()
    const imageBuffer = await fs.promises.readFile(imagePath);
    const tensor = tf.node.decodeImage(imageBuffer).resizeBilinear([48, 48]).mean(2).expandDims(-1).expandDims(0).toFloat().div(tf.scalar(255));
    const prediction = model.predict(tensor);
    console.log(prediction);
    const emotionIndex = prediction.argMax(1).dataSync()[0];

    return emotions[emotionIndex];
}
    
router.post('/predict-emotion-for-music', upload.single('image'), async (req, res) => {
    const imageBuffer = req.file.filename;

    try {
        const predictedEmotion = await predictEmotion(imageBuffer);
        const user_emotion_tracks = await getTracks(predictedEmotion);
        const neutral_tracks = await getTracks('Neutral');
        const happy_tracks = await getTracks('Happy');

        const recommendations = generateProgressivePlaylist(user_emotion_tracks, neutral_tracks, happy_tracks, 10);
        res.json({ predictedEmotion, recommendations });
    } catch (err) {
        console.error('Error getting recommendations:', err.message);
        res.status(500).json({ error: "Error message" });
    }
})

module.exports = router;