const nodemailer = require('nodemailer');

async function sendVerificationEmail(toEmail, code) {
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // For Gmail
    port: 587,
    secure: false,
    auth: {
      user: "vaghelakishan857@gmail.com", // your email address
      pass: "bufi kbvr sqmb ktdh", // your app password or email password
    },
  });

  const mailOptions = {
    from: `"Your App" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'Verify your email',
    text: `Your verification code is: ${code}`,
    html: `<p>Your verification code is: <b>${code}</b></p>`,
  };

  await transporter.sendMail(mailOptions);
}

module.exports = sendVerificationEmail;
