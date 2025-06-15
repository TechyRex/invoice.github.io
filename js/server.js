const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Configure your email service (using Gmail as example)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-email-password-or-app-password'
  }
});

app.post('/send-invoice', async (req, res) => {
  try {
    const { toEmail, subject, htmlContent, pdfData } = req.body;

    const mailOptions = {
      from: 'your-email@gmail.com',
      to: toEmail,
      subject: subject || 'Your Invoice',
      html: htmlContent,
      attachments: [{
        filename: 'invoice.pdf',
        content: pdfData.split('base64,')[1],
        encoding: 'base64'
      }]
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});