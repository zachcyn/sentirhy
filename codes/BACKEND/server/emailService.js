const nodemailer = require('nodemailer')

async function sendEmail(to, subject, text) {
    const transporter = nodemailer.createTransport({
        host: "smtp.mail.me.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    let mailOptions = {
        from: '"Sentirhy"<no-reply-sentirhy@zachcyn.com>',
        to: to,
        subject: subject,
        html: text,
        attachments: [
            {
                filename: 'grey-logo.png',
                path: 'assets/grey-logo.png',
                cid: 'grey-logo'
            },
            {
                filename: 'color-logo.png',
                path: 'assets/color-logo.png',
                cid: 'color-logo'
            }
    
        ]
    };

    try {
        let info = await transporter.sendMail(mailOptions);
        console.log("Message sent: %s", info.messageId);
        return info
    } catch (err) {
        console.error("Error sending email:", err);
        throw err;
    }
}

module.exports = { sendEmail };