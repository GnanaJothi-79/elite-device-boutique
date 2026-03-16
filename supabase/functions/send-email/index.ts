import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createTransport } from "npm:nodemailer@6.9.9";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const ADMIN_EMAIL = "gnana07092004@gmail.com";
const GMAIL_USER = "gnana07092004@gmail.com";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, data } = await req.json();
    const gmailPassword = Deno.env.get("GMAIL_APP_PASSWORD");

    if (!gmailPassword) {
      throw new Error("Gmail app password not configured");
    }

    const transporter = createTransport({
      service: "gmail",
      auth: {
        user: GMAIL_USER,
        pass: gmailPassword,
      },
    });

    const emails: { to: string; subject: string; html: string }[] = [];

    if (type === "signup") {
      const { userName, userEmail, signupTime } = data;

      emails.push({
        to: userEmail,
        subject: "Signup Successful",
        html: `<p>Hello,</p><p>Your account has been created successfully.</p><p>Welcome to our platform.</p>`,
      });

      emails.push({
        to: ADMIN_EMAIL,
        subject: "New User Registered",
        html: `<p>A new user has registered.</p><p><strong>User Details:</strong></p><ul><li>Name: ${userName}</li><li>Email: ${userEmail}</li><li>Signup Time: ${signupTime}</li></ul>`,
      });

    } else if (type === "login") {
      const { userEmail, loginTime } = data;

      emails.push({
        to: userEmail,
        subject: "Login Successful",
        html: `<p>Hello,</p><p>You have logged into your account successfully.</p><p>Login Time: ${loginTime}</p><p>If this was not you, please secure your account.</p>`,
      });

      emails.push({
        to: ADMIN_EMAIL,
        subject: "User Login Alert",
        html: `<p>A user has logged into the system.</p><ul><li>User Email: ${userEmail}</li><li>Login Time: ${loginTime}</li></ul>`,
      });

    } else if (type === "order") {
      const { userEmail, orderId, productList, totalAmount, orderDate } = data;

      emails.push({
        to: userEmail,
        subject: "Order Placed Successfully",
        html: `<p>Hello,</p><p>Your order has been placed successfully.</p><p><strong>Order Details:</strong></p><ul><li>Order ID: ${orderId}</li><li>Products: ${productList}</li><li>Total Price: $${totalAmount}</li><li>Order Date: ${orderDate}</li></ul><p>Thank you for shopping with us.</p>`,
      });

      emails.push({
        to: ADMIN_EMAIL,
        subject: "New Order Received",
        html: `<p>A new order has been placed.</p><ul><li>Customer Email: ${userEmail}</li><li>Order ID: ${orderId}</li><li>Products: ${productList}</li><li>Total Price: $${totalAmount}</li><li>Order Date: ${orderDate}</li></ul>`,
      });

    } else {
      throw new Error("Invalid email type");
    }

    await Promise.all(
      emails.map((email) =>
        transporter.sendMail({
          from: `"GadgetHub" <${GMAIL_USER}>`,
          to: email.to,
          subject: email.subject,
          html: email.html,
        })
      )
    );

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: unknown) {
    console.error("Email error:", error);
    const message = error instanceof Error ? error.message : "Failed to send email";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
