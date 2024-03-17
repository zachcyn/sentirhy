require('dotenv').config()
const express = require('express');
const authRoutes = require('./server/authRoutes');
const recommendRoutes = require('./server/recommendRoutes');
const apiRoutes = require('./server/apiRoutes');
const fileStorage = require('./server/fileStorage');
const cors = require('cors')

const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/api', apiRoutes);
app.use('/recommend', recommendRoutes);
app.use('/file', fileStorage);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));