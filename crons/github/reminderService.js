const nodemailer = require("nodemailer");

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.sendgrid.net',
      port: 587,
      auth: {
        user: "apikey",
        pass: process.env.pass
      }
    });
  }

  async sendReminderEmail(fromEmail ,email, ccEmails, prUrl) {
    try {
      await this.transporter.sendMail({
        from: fromEmail,
        to: email,
        cc: ccEmails, // Array of CC email addresses
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
