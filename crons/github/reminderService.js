const nodemailer = require("nodemailer");

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.sendgrid.net',
      port: 587,
      auth: {
        user: "apikey",
        pass: "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"
      }
    });
  }

  async sendReminderEmail(email, prUrl) {
    try {
      await this.transporter.sendMail({
        from: "arya.aniket@tyreplex.com",
        to: email,
        subject: "Test message subject",
        text: "Reminder: Your Pull Request is still open",
        html: `<b>Your Pull Request (${prUrl}) is still open after 7 days. Please consider reviewing and closing it if necessary.</b>`,
      });
    } catch (error) {
      throw new Error("Error sending email:", error);
    }
  }
}

module.exports = EmailService;
