import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const { user_name, user_email, user_phone, user_message, token } = await req.json();

    if (!user_email || !user_message || !token) {
      return NextResponse.json(
        { error: "Email, message, and captcha token are required." },
        { status: 400 }
      );
    }

    // 1. Verify Google reCAPTCHA Token
    if (!process.env.RECAPTCHA_SECRET_KEY) {
      console.error("Error: RECAPTCHA_SECRET_KEY is not defined in .env.local");
      return NextResponse.json(
        { error: "Server configuration error: RECAPTCHA_SECRET_KEY is missing." },
        { status: 500 }
      );
    }

    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`;
    const verifyResponse = await fetch(verifyUrl, { method: "POST" });
    const verifyData = await verifyResponse.json();

    if (!verifyData.success) {
      console.error("Captcha verification failed:", verifyData);
      return NextResponse.json(
        { error: "Captcha verification failed. Please try again." },
        { status: 400 }
      );
    }

    // 2. Setup Nodemailer Transporter (supports Gmail OAuth2 and App Password)
    const isOAuth2 = Boolean(
      process.env.GMAIL_CLIENT_ID &&
      process.env.GMAIL_CLIENT_SECRET &&
      process.env.GMAIL_REFRESH_TOKEN
    );

    if (!process.env.EMAIL_USER) {
      console.error("Error: EMAIL_USER is not defined in .env.local");
      return NextResponse.json(
        { error: "Server configuration error: EMAIL_USER is missing." },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport(
      isOAuth2
        ? {
            service: "gmail",
            auth: {
              type: "OAuth2",
              user: process.env.EMAIL_USER,
              clientId: process.env.GMAIL_CLIENT_ID,
              clientSecret: process.env.GMAIL_CLIENT_SECRET,
              refreshToken: process.env.GMAIL_REFRESH_TOKEN,
            },
          }
        : {
            service: "gmail",
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS,
            },
          }
    );

    // 3. Define Email Options
    const senderName = user_name || user_email;
    const mailOptions = {
      from: `"${senderName}" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Send the email to yourself
      replyTo: user_email,
      subject: `New Message from ${senderName} (Portfolio Contact)`,
      text: `You have received a new message from your portfolio contact form.\n\nName: ${user_name || "-"}\nEmail: ${user_email}\nPhone: ${user_phone || "-"}\n\nMessage:\n${user_message}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px;">
          <h2 style="color: #2b6cb0; border-bottom: 2px solid #edf2f7; padding-bottom: 10px;">New Contact Form Message</h2>
          <p><strong>Name:</strong> ${user_name || "-"}</p>
          <p><strong>Email:</strong> <a href="mailto:${user_email}">${user_email}</a></p>
          <p><strong>Phone:</strong> ${user_phone || "-"}</p>
          <hr style="border: none; border-top: 1px solid #edf2f7; margin: 15px 0;" />
          <p><strong>Message:</strong></p>
          <div style="background-color: #f7fafc; padding: 15px; border-radius: 6px; border-left: 4px solid #4299e1; white-space: pre-wrap;">${user_message}</div>
        </div>
      `,
    };

    // 4. Send Email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: "Email sent successfully." }, { status: 200 });
  } catch (error) {
    console.error("Error in contact API:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to send email. Please try again later." },
      { status: 500 }
    );
  }
}
