import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const { user_email, user_message, token } = await req.json();

    if (!user_email || !user_message || !token) {
      return NextResponse.json(
        { error: "Email, message, and captcha token are required." },
        { status: 400 }
      );
    }

    // 1. Verify Google reCAPTCHA Token
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`;
    const verifyResponse = await fetch(verifyUrl, { method: "POST" });
    const verifyData = await verifyResponse.json();

    if (!verifyData.success) {
      return NextResponse.json(
        { error: "Captcha verification failed. Please try again." },
        { status: 400 }
      );
    }

    // 2. Setup Nodemailer Transporter (using Gmail SMTP)
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // true for port 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER, // Your Gmail address
        pass: process.env.EMAIL_PASS, // Your Gmail App Password
      },
    });

    // 3. Define Email Options
    const mailOptions = {
      from: `"${user_email}" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Send the email to yourself
      replyTo: user_email,
      subject: `New Message from Portfolio Contact Form`,
      text: `You have received a new message from your portfolio contact form.\n\nFrom: ${user_email}\n\nMessage:\n${user_message}`,
      html: `
        <h3>New Contact Form Message</h3>
        <p><strong>From:</strong> ${user_email}</p>
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap;">${user_message}</p>
      `,
    };

    // 4. Send Email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: "Email sent successfully." }, { status: 200 });
  } catch (error) {
    console.error("Error in contact API:", error);
    return NextResponse.json(
      { error: "Failed to send email. Please try again later." },
      { status: 500 }
    );
  }
}
