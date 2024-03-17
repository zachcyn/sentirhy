const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pool = require('./database');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, '/users_profile/');
        fs.existsSync(uploadPath) || fs.mkdirSync(uploadPath);
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueName = Date.now() + '-' + file.originalname;
        cb(null, uniqueName);
    },
});

const upload = multer({ storage: storage });

router.post('/profile-img', upload.single('profilePic'), async (req, res) => {
    const filePath = req.file.path;
    const username = req.body.username;
    const email = req.body.email;

    const query = `
        UPDATE sentirhy.user
        SET imgurl = $1
        WHERE email = $2
        AND username = $3
    `;

    try {
        const result = await pool.query(query, [filePath, email, username]);

        if (result.rowCount === 0) {
            res.status(404).send('User not found');
        } else {
            res.send(`Profile picture updated successfully: ${filePath}`)
        }
    } catch (err) {
        console.error("Error updating user profile picture in database:", err);
        res.status(500).send("Error updating profile picture");
    }
});

module.exports = router;