import nodemailer from "nodemailer";

// Environment variables
const publicEmail = process.env.NEXT_PUBLIC_EMAIL_USERNAME;
const password = process.env.NEXT_PUBLIC_EMAIL_PASSWORD;
const personaleEmail = process.env.NEXT_PUBLIC_PERSONAL_EMAIL;

// Configuring nodemailer
export const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com", // hostname
  port: 465, // port for secure SMTP
  secure: true,
  auth: {
    user: publicEmail,
    pass: password,
  },
});

// Mail options
export const mailOptions = {
  from: `"Our customer from hamzavim site" <${publicEmail}>`,
  to: personaleEmail,
};
