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

export const sendEmail = async (to: string, subject: string, html: string, text: string) => {
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

const logoUrl = "https://raw.githubusercontent.com/Medieinstitutet/fsu24d-systemutveckling-e-handel-f-r-prenumerationer-sevenisheaven/refs/heads/main/frontend/src/assets/logo.png";

const baseStyles = `
  font-family: Arial, sans-serif;
  color: #333;
  padding: 20px;
  line-height: 1.5;
`;

const emailWrapper = (title: string, content: string) => `
  <div style="${baseStyles}">
    <img src="${logoUrl}" alt="Company Logo" style="max-width: 150px; margin-bottom: 20px;" />
    <h1>${title}</h1>
    ${content}
    <p style="margin-top: 40px;">Kind regards,<br>Totally Confused Socks</p>
  </div>
`;

export const sendConfirmationEmail = async (user) => {
  const plan = getPlanName(user.subscription_id);
  const html = emailWrapper(
    "Welcome to " + plan + "!",
    `<p>Hi ${user.firstname},</p>
     <p>Thank you for subscribing to our <strong>${plan}</strong> plan. We're thrilled to have you with us.</p>
     <p>You now have full access to everything included in your plan.</p>
     <p>If you have any questions, feel free to contact us anytime.</p>`
  );

  const text = `Hi ${user.firstname}, thanks for subscribing to the ${plan} plan. We're happy to have you with us!`;

  await sendEmail(user.email, `Subscription Confirmation – ${plan}`, html, text);
};

export const sendChangeEmail = async (email: string, subscriptionId: string) => {
  const plan = getPlanName(subscriptionId);
  const html = emailWrapper(
    "Subscription Updated",
    `<p>Hello!</p>
     <p>Your subscription has been successfully updated to <strong>${plan}</strong>.</p>
     <p>We hope you enjoy your new benefits!</p>`
  );

  const text = `Your subscription has been updated to ${plan}. Enjoy your new plan!`;

  await sendEmail(email, `Subscription Updated – ${plan}`, html, text);
};

export const sendFailureEmail = async (user, invoiceUrl) => {
  const html = emailWrapper(
    "Payment Failed",
    `<p>Hi ${user.firstname},</p>
     <p>Unfortunately, your most recent payment was unsuccessful.</p>
     <p>Please <a href="${invoiceUrl}">click here to update your payment method</a> to avoid service interruption.</p>
     <p>If we don't receive payment within 7 days, your subscription may be cancelled.</p>`
  );

  const text = `Hi ${user.firstname}, your latest payment failed. Please pay here: ${invoiceUrl}`;

  await sendEmail(user.email, "Payment Issue – Action Required", html, text);
};

export const sendPaymentSuccesEmail = async (user) => {
  const html = emailWrapper(
    "Payment Received",
    `<p>Hi ${user.firstname},</p>
     <p>Your latest payment was successfully processed. Your subscription continues as planned.</p>
     <p>Thank you for staying with us!</p>`
  );

  const text = `Hi ${user.firstname}, your payment was successful. Thanks for staying with us!`;

  await sendEmail(user.email, "Payment Confirmation", html, text);
};
