const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendEmail } = require('./emailService');
const resetPwd  = require('./resetPwd');
const activateTemplate = require('./activationTemplate');
const pool = require('./database');

router.post('/register', async(req, res) => {
    try {
        const { fname, lname, dob, username, email, password, country } = req.body;

        const userCheckQuery = 'SELECT * FROM sentirhy.user WHERE email = $1 OR username = $2';
        const { rows: existingUsers } = await pool.query(userCheckQuery, [email, username]);
        
        if (existingUsers.length > 0) {
            return res.status(400).json({message:"Username or Email already in use."});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const activationToken = crypto.randomBytes(20).toString('hex');
        const activationTokenExpires = new Date(Date.now() + 3600000).toISOString();
        const insertUserQuery = 'INSERT INTO sentirhy.user (fname, lname, dob, username, email, password, activationToken, activationTokenExpires) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)';
        await pool.query(insertUserQuery, [fname, lname, dob, username, email, hashedPassword  , activationToken, activationTokenExpires]);

        const activationLink = `http://localhost:3030/activate?token=${activationToken}`;
        await sendEmail(email, "Account Activation", activateTemplate(username, fname, email, activationLink))
            .then(info => {
                console.log('Email sent successfully');
            })
            .catch(error => {
                console.log("Failed to send email:", error)
            })

        res.status(201).json({ message: "Registration successful. Please check your email to activate your account." });

    } catch (err) {
        console.error("Error in /register route: ", err);
        res.status(500).send("Error registering new user");
    }
});

router.post('/login', async(req, res) => {
    const { identifier, password, rememberMe } = req.body;

    if (!identifier || !password) {
        console.log('Missing identifier or password');
        return res.status(400).json({ message: "Both identifier and password are required" });
    }

    try {
        let user;
        if (identifier.includes("@")) {
            console.log('Fetching user by email');
            user = await pool.query('SELECT * FROM sentirhy.user WHERE email = $1', [identifier]);
        } else {
            console.log('Fetching user by username');
            user = await pool.query('SELECT * FROM sentirhy.user WHERE username = $1', [identifier]);
        }

        if (user.rows.length === 0) {
            console.log('No user found with given identifier');
            return res.status(400).json({ message: "Username or password is incorrect" });
        }

        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        if (!validPassword) {
            console.log('Invalid password');
            return res.status(400).json({ message: "Username or password is incorrect" });
        }

        if (!user.rows[0].isactive) {
            console.log('User account not activated');
            return res.status(400).json({ message: "Please activate your account" });
        }

        const expiresIn = rememberMe ? '7d' : '1h'
        const token = jwt.sign({ userId: user.rows[0].userid }, process.env.JWT_SECRET, { expiresIn });
        res.json({ message: 'Login successful', 
                    user: user.rows[0].username, 
                    token: token, 
                    fname: user.rows[0].fname, 
                    lname: user.rows[0].lname, 
                    email: user.rows[0].email, 
                    imgurl: user.rows[0].imgurl,
                    dob: user.rows[0].dob,
                });
    } catch (err) {
        console.error("Error in /login route: ", err);
        res.status(500).send("Error logging in user");
    }
});


router.post('/request-password-reset', async(req, res) => {
    const { email } = req.body;

    try {
        const userQuery = 'SELECT * FROM sentirhy.user WHERE email = $1';
        const { rows: users} = await pool.query(userQuery, [email]);

        if (users.length > 0) {
            const user = users[0];
            const resetToken = crypto.randomBytes(20).toString('hex');

            const updateQuery = 'UPDATE sentirhy.user SET resetPasswordToken = $1, resetPasswordExpired = $2 WHERE email = $3';
            await pool.query(updateQuery, [resetToken, new Date(Date.now() + 3600000).toISOString(), email]);

            const resetLink = `http://localhost:3030/reset-password?token=${resetToken}`;
            await sendEmail(user.email, "Password Reset", resetPwd(user.username, user.email, resetLink))
                .then(info => {
                    console.log('Email sent successfully');
                })
                .catch(error => {
                    console.log("Failed to send email:", error)
                });

            res.send('If the email is associated with an account, a reset link will be sent.');
        } else {
            res.send('If the email is associated with an account, a reset link will be sent.');
        }
    } catch (err) {
        console.error("Error in /request-password-reset route:", err);
        res.status(500).send("Error processing password reset request.");
    }
});

router.post('/reset-password', async(req, res) => {
    const { token } = req.query;
    const { newPassword } = req.body;

    try {
        const userQuery = 'SELECT * FROM sentirhy.user WHERE resetPasswordToken = $1 AND resetPasswordExpired > $2';
        const { rows: users } = await pool.query(userQuery, [token, new Date(Date.now()).toISOString()]);

        if (users.length === 0) {
            return res.status(400).send("Invalid or expired token.");
        }

        const user = users[0];
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const updateQuery = 'UPDATE sentirhy.user SET password = $1, resetPasswordToken = NULL, resetPasswordExpired = NULL WHERE email = $2';
        await pool.query(updateQuery, [hashedPassword, user.email]);

        res.json({ message: "Password has been reset." });
    } catch (error) {
        console.error("Error resetting password:", error);
        res.status(500).send("Internal Server Error");
    }
});


router.get('/activate', async(req, res) => {
    try {
        const { token } = req.query;

        const userQuery = 'SELECT * FROM sentirhy.user WHERE activationToken = $1';
        const { rows: users } = await pool.query(userQuery, [token]);

        if (users.length === 0) {
            return res.status(400).send("Invalid or expired activation token.");
        }

        const user = users[0];
        const updateQuery = 'UPDATE sentirhy.user SET isActive = true, activationToken = NULL, activationTokenExpires = NULL WHERE email = $1';
        await pool.query(updateQuery, [user.email]);

        res.json({ message: "Account successfully activated." });
    } catch (err) {
        console.error("Error activating account: ", err);
        res.status(500).json({ message: "Error activating account" });
    }
});

router.post('/validate-token', async(req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ valid: false, message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const userQuery = 'SELECT username, email, isActive FROM sentirhy.user WHERE userid = $1';
        const { rows } = await pool.query(userQuery, [decoded.userId]);

        if (rows.length === 0) {
            throw new Error('User not found');
        }

        const user = rows[0];
        res.json({ valid: true, user });
    } catch (err) {
        console.error('Error in /validate-token:', err);
        res.status(400).json({ valid: false, message: 'Invalid token', error: err.message });
    }
});

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId; // Add user id to request
        next();
    } catch (err) {
        console.error('Token verification error:', err);
        res.status(400).json({ message: 'Invalid token', error: err.message });
    }
};

router.post('/update-detail', verifyToken, async(req, res) => {
    const { userId } = req;
    const { fname, lname, email, dob, password } = req.body;

    try {
        const userQuery = 'SELECT * FROM sentirhy.user WHERE userid = $1';
        const userResult = await pool.query(userQuery, [userId]);

        if (userResult.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = userResult.rows[0];
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(400).json({ message: "Incorrect password" });
        }

        let hashedPassword = user.password;

        if (password && password.trim() !== '') {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        const updateQuery = `
            UPDATE sentirhy.user
            SET fname = $1, lname = $2, email = $3, dob = $4
            WHERE userid = $5;
        `;

        const updateResult = await pool.query(updateQuery, [fname, lname, email, dob, userId]);

        if (updateResult.rowCount === 0) {
            return res.status(404).json({ message: 'User not found or data was not changed' });
        }

        res.json({ message: 'User details updated successfully'});

    } catch (err) {
        console.error("Error updating user details:", err);
        res.status(500).json({ message: 'Error updating user details' });
    }
});

module.exports = router;