import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const subscriptionNameLookup = {
  "68380950c659b1a48ce18927": "Sock Emergency",
  "68380992c659b1a48ce18928": "Sock & Roll",
  "683809b3c659b1a48ce18929": "Sock Royalty",
};

const getPlanName = (id: string) => subscriptionNameLookup[id] || "Unknown Plan";

const sendEmail = async (to: string, subject: string, html: string, text: string) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent:", subject);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export const sendConfirmationEmail = async (user) => {
  const plan = getPlanName(user.subscription_id);
  await sendEmail(
    user.email,
    `Subscription Confirmation - ${plan}`,
    `<h1>Thank you for subscribing to ${plan}, ${user.firstname}!</h1><p>We hope you enjoy your experience with us.</p><h2>THIS IS JUST A TEST!</h2>`,
    `Hello ${user.firstname} ${user.lastname}, thanks for your recent purchase of the ${plan} plan.`
  );
};

export const sendChangeEmail = async (email: string, subscriptionId: string) => {
  const plan = getPlanName(subscriptionId);
  await sendEmail(
    email,
    `Subscription Updated - ${plan}`,
    `<h1>Your subscription was changed to ${plan}!</h1><p>Enjoy your new plan!</p><h2>THIS IS JUST A TEST!</h2>`,
    `Thanks for changing to the ${plan} plan.`
  );
};

export const sendFailureEmail = async (user, invoiceUrl) => {
  await sendEmail(
    user.email,
    "Missed Payment",
      `<h1>Hello ${user.firstname}, there was a problem with your latest payment. Please visit: ${invoiceUrl}</h1>`,
      "If you dont pay the outstanding balance within a week your subscription will be terminated"
  );
};

export const sendPaymentSuccesEmail = async (user) => {
  await sendEmail(
    user.email,
    "Payment Succeded",
      `<h1>Hello ${user.firstname}, your latest payment is paid</h1>`,
      "Your subscription will continue as planned"
  );
};