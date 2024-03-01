-- CREATE TABLE Artists (
--     artistID VARCHAR(255) SERIAL PRIMARY KEY,
--     name VARCHAR(255) NOT NULL,
-- );

-- CREATE TABLE Albums (
--     albumID SERIAL PRIMARY KEY,
--     title VARCHAR(255) NOT NULL,
--     artistID INTEGER NOT NULL,
--     releaseDate DATE,
--     coverArtURL VARCHAR(255),
--     FOREIGN KEY (artistID) REFERENCES Artists(artistID)
-- );

-- CREATE TABLE Tracks (
--     trackID SERIAL PRIMARY KEY,
--     title VARCHAR(255) NOT NULL,
--     artistID INTEGER,
--     albumID INTEGER,
--     genre VARCHAR(100),
--     duration INTEGER,
--     releaseDate DATE,
--     language VARCHAR(50),
--     spotifyURL VARCHAR(255),
--     youtubeURL VARCHAR(255),
--     FOREIGN KEY (artistID) REFERENCES Artists(artistID),
--     FOREIGN KEY (albumID) REFERENCES Albums(albumID)
-- );

-- CREATE TABLE AudioFeats (
--     trackID INTEGER PRIMARY KEY,
--     tempo FLOAT CHECK (tempo >= 0),
--     key INTEGER,
--     mode INTEGER,
--     valence FLOAT,
--     energy FLOAT,
--     FOREIGN KEY (trackID) REFERENCES Tracks(trackID)
-- );

-- CREATE TABLE UserPref (
--     userID SERIAL PRIMARY KEY,
--     prefLanguage VARCHAR(50),
--     prefGenres TEXT,
--     country VARCHAR(100)
-- );

-- CREATE TABLE UserHist (
--     historyID SERIAL PRIMARY KEY,
--     userID INTEGER NOT NULL,
--     trackID INTEGER NOT NULL,
--     listenDate TIMESTAMP NOT NULL,
--     userMood VARCHAR(100),
--     FOREIGN KEY (userID) REFERENCES UserPref(userID),
--     FOREIGN KEY (trackID) REFERENCES Tracks(trackID)
-- );

-- CREATE TABLE playlistTab (
--     playlistID SERIAL PRIMARY KEY,
--     name VARCHAR(255) NOT NULL,
--     description TEXT,
--     creationDate TIMESTAMP NOT NULL
-- )

-- CREATE TABLE playlistTracks (
--     playlistID INTEGER NOT NULL,
--     trackID INTEGER NOT NULL,
--     PRIMARY KEY (playlistID, trackID),
--     FOREIGN KEY (playlistID) REFERENCES playlistTab(playlistID),
--     FOREIGN KEY (trackID) REFERENCES Tracks(trackID)
-- );

-- ALTER TABLE AudioFeats
-- DROP COLUMN key,
-- DROP COLUMN mode,
-- DROP COLUMN valence,
-- DROP COLUMN energy;

-- ALTER TABLE AudioFeats
-- ADD COLUMN pitches FLOAT[],
-- ADD COLUMN key INTEGER,
-- ADD COLUMN mode INTEGER,
-- ADD COLUMN loudness FLOAT;

-- SELECT * FROM artists

-- SELECT * FROM sentirhy.trackpopularity;

-- CREATE TABLE sentirhy.User (
--     userID SERIAL PRIMARY KEY,
--     fname VARCHAR(255),
--     lname VARCHAR(255),
--     dob DATE,
--     country VARCHAR(255),
--     username VARCHAR(255) UNIQUE NOT NULL,
--     email VARCHAR(255) UNIQUE NOT NULL,
--     password VARCHAR(255) NOT NULL,
--     isActive BOOLEAN DEFAULT false,
--     activationToken VARCHAR(255),
--     activationTokenExpires TIMESTAMP,
--     resetPasswordToken VARCHAR(255),
--     resetPasswordExpired TIMESTAMP
-- );

SELECT * FROM sentirhy.user

-- DELETE FROM sentirhy.user WHERE userid = 4;
