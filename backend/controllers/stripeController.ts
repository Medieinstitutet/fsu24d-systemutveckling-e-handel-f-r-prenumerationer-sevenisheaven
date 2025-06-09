import nodemailer from "nodemailer";
import Stripe from "stripe";
import dotenv from "dotenv";
import User from "../models/User";
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const sendConfirmationEmail = async (user) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: `Subscription Confirmation - ${user.subscription_id}`,
    text: `Hello ${user.firstname}, your order with ID ${user.subscription_id} has been successfully placed. Thank you for shopping with us!`,
    html: `
      <h1>Thank you for your order, ${user.firstname}!</h1>
      <p>Your order with ID <strong>${user.subscription_id}</strong> has been successfully placed and is being processed.</p>
      <p>We will notify you once your order is shipped.</p>
      <h2>THIS IS JUST A TEST!</h2>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Confirmation email sent successfully");
  } catch (error) {
    console.error("Error sending confirmation email:", error);
  }
};
const sendFailureEmail = async (user, hostedInvoiceUrl) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: `Missed Payment`,
    text: `Hello ${user.firstname}, There was a problem with your latest payment`,
    html: `
      <h1>Pay your remaining balance here, ${hostedInvoiceUrl}!</h1>
      <p>Your subscription will be terminated otherwise</p>
      <h2>THIS IS JUST A TEST!</h2>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Failure email sent successfully");
  } catch (error) {
    console.error("Error sending failure email:", error);
  }
};

export const checkoutSessionEmbedded = async (req, res) => {
  try {
    const { user, subscription } = req.body;
    console.log("Incoming user:", user, subscription);

    const priceLookup = {
      "68380950c659b1a48ce18927": process.env.PRODUCT_1,
      "68380992c659b1a48ce18928": process.env.PRODUCT_2,
      "683809b3c659b1a48ce18929": process.env.PRODUCT_3,
    };

    const selectedPrice = priceLookup[subscription];
    if (!selectedPrice)
      return res.status(400).json({ error: "Invalid plan ID" });

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      ui_mode: "embedded",
      line_items: [
        {
          price: selectedPrice,
          quantity: 1,
        },
      ],
      customer_email: user.email,
      client_reference_id: subscription,
      return_url: `http://localhost:5173/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
    });

    res.json({ clientSecret: session.client_secret });
  } catch (error) {
    console.error("Stripe session creation error:", error);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
};

export const getSession = async (req, res) => {
  const sessionId = req.params.sessionId;

  if (!sessionId) {
    return res.status(400).json({ error: "Missing session ID" });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    res.json({
      email: session.customer_email,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const testFailedPayment = async (req, res) => {
  const body = {
    id: "evt_1RY1jnRteeBh27q3YFwBHrUr",
    object: "event",
    api_version: "2025-02-24.acacia",
    created: 1749460285,
    data: {
      object: {
        id: "in_1RY1jdRteeBh27q3IIzawn7d",
        object: "invoice",
        account_country: "SE",
        account_name: null,
        account_tax_ids: null,
        amount_due: 2000,
        amount_overpaid: 0,
        amount_paid: 0,
        amount_remaining: 2000,
        amount_shipping: 0,
        application: null,
        application_fee_amount: null,
        attempt_count: 1,
        attempted: true,
        auto_advance: true,
        automatic_tax: {},
        automatically_finalizes_at: null,
        billing_reason: "subscription_cycle",
        charge: "ch_3RY1jhRteeBh27q31UILzM8m",
        collection_method: "charge_automatically",
        created: 1750063247,
        currency: "sek",
        custom_fields: null,
        customer: "cus_SSxASdNDEyWJmC",
        customer_address: {},
        customer_email: "snownicholas2@gmail.com",
        customer_name: "nicholas snow mattsson",
        customer_phone: null,
        customer_shipping: null,
        customer_tax_exempt: "none",
        customer_tax_ids: [],
        default_payment_method: null,
        default_source: null,
        default_tax_rates: [],
        description: null,
        discount: null,
        discounts: [],
        due_date: null,
        effective_at: 1750066847,
        ending_balance: 0,
        footer: null,
        from_invoice: null,
        hosted_invoice_url:
          "https://invoice.stripe.com/i/acct_1R4KznRteeBh27q3/test_YWNjdF8xUjRLem5SdGVlQmgyN3EzLF9TU3hlS3ljbGxZUE9uTk1Ba045Z0tQaGVPR2VvcTdnLDE0MDAwMTA4Nw02009WdZZxUN?s=ap",
        invoice_pdf:
          "https://pay.stripe.com/invoice/acct_1R4KznRteeBh27q3/test_YWNjdF8xUjRLem5SdGVlQmgyN3EzLF9TU3hlS3ljbGxZUE9uTk1Ba045Z0tQaGVPR2VvcTdnLDE0MDAwMTA4Nw02009WdZZxUN/pdf?s=ap",
        issuer: {},
        last_finalization_error: null,
        latest_revision: null,
        lines: {},
        livemode: false,
        metadata: {},
        next_payment_attempt: 1750225235,
        number: "C9B515F2-0007",
        on_behalf_of: null,
        paid: false,
        paid_out_of_band: false,
        parent: {},
        payment_intent: "pi_3RY1jhRteeBh27q31Z7HNBP5",
        payment_settings: {},
        period_end: 1750063247,
        period_start: 1749458447,
        post_payment_credit_notes_amount: 0,
        pre_payment_credit_notes_amount: 0,
        quote: null,
        receipt_number: null,
        rendering: null,
        shipping_cost: null,
        shipping_details: null,
        starting_balance: 0,
        statement_descriptor: null,
        status: "open",
        status_transitions: {},
        subscription: "sub_1RY1GBRteeBh27q3Ewc0IQV1",
        subscription_details: {},
        subtotal: 2000,
        subtotal_excluding_tax: 2000,
        tax: null,
        test_clock: "clock_1RY1jcRteeBh27q3gn5jOtTV",
        total: 2000,
        total_discount_amounts: [],
        total_excluding_tax: 2000,
        total_pretax_credit_amounts: [],
        total_tax_amounts: [],
        total_taxes: [],
        transfer_data: null,
        webhooks_delivered_at: 1750063247,
      },
    },
    livemode: false,
    pending_webhooks: 2,
    request: { id: null, idempotency_key: null },
    type: "invoice.payment_failed",
  };

  console.log("subscription id:", body.data.object.subscription);
  console.log("invoice id:", body.data.object.id);
  console.log("hosted_invoice_url:", body.data.object.hosted_invoice_url);

  res.send({});
};
export const webhook = async (req, res) => {
  const event = req.body;
  console.log(event);

  try {
    if (event.type === "checkout.session.completed") {
      const session = await stripe.checkout.sessions.retrieve(
        event.data.object.id
      );
      const customerEmail = session.customer_email;
      const subscriptionId = session.client_reference_id;
      const stripeSubscriptionId = session.subscription;

      await User.updateOne(
        { email: customerEmail },
        {
          $set: {
            subscription_id: subscriptionId,
            stripe_subscription_id: stripeSubscriptionId,
            subscription_status: "payment_successfull",
          },
        }
      );

      const user = await User.findOne({ email: customerEmail });
      if (user) {
        await sendConfirmationEmail(user);
      }
    } else if (event.type === "invoice.payment_failed") {
      const invoice = event.data.object;

      const subscriptionId = invoice.subscription;
      const email = invoice.customer_email;
      const hostedInvoiceUrl = invoice.hosted_invoice_url;

      const user = await User.findOne({ email });

      if (user) {
        await User.updateOne(
          { email },
          { $set: { subscription_status: "payment_failed" } }
        );

        await sendFailureEmail(user, hostedInvoiceUrl);
      }

      console.log(`Payment failed for subscription ${subscriptionId}`);
    } else if (event.type === "invoice.payment_succeeded") {
      const invoice = event.data.object;
      const email = invoice.customer_email;
      const user = await User.findOne({ email });

      if (user) {
        await User.updateOne(
          { email },
          { $set: { subscription_status: "payment_successfull" } }
        );
        await sendConfirmationEmail(user);
      }
    } else {
      console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
};
