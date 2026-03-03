// backend/utils/mailer.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

async function sendOTPEmail(toEmail, username, otp, type = "signup") {
  const isReset = type === "reset";
  const subject = isReset
    ? otp + " — Reset Your Dungeon Ascent Password"
    : otp + " — Your Dungeon Ascent Verification Code";

  const headline = isReset ? "PASSWORD RESET" : "VERIFY YOUR EMAIL";
  const message  = isReset
    ? "You requested a password reset.<br/>Enter this code to set a new password."
    : "You are one step away from entering the Code Arena.<br/>Enter this code to verify your email.";
  const icon = isReset ? "🔑" : "⚔️";

  await transporter.sendMail({
    from: '"Dungeon Ascent" <' + process.env.GMAIL_USER + '>',
    to: toEmail,
    subject,
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"/>
<style>
  body{margin:0;padding:0;background:#050508;font-family:'Segoe UI',sans-serif;}
  .wrap{max-width:480px;margin:40px auto;background:#0a0a14;border:1px solid #1a1200;border-radius:12px;overflow:hidden;}
  .header{background:linear-gradient(135deg,#1a0800,#0a0000);padding:2rem;text-align:center;border-bottom:1px solid #2a1200;}
  .title{color:#ffd700;font-size:1.5rem;font-weight:800;letter-spacing:.15em;}
  .sub{color:#ff4444;font-size:.7rem;letter-spacing:.4em;margin-top:.3rem;}
  .body{padding:2rem;}
  .greet{color:#e8d5a3;font-size:1rem;margin-bottom:.75rem;}
  .msg{color:#666;font-size:.88rem;line-height:1.7;margin-bottom:1rem;}
  .otp-box{background:#0d0d1a;border:2px solid #ffd70044;border-radius:10px;padding:1.5rem;text-align:center;margin:1.25rem 0;}
  .otp-label{color:#888;font-size:.72rem;letter-spacing:.2em;margin-bottom:.5rem;}
  .otp-code{color:#ffd700;font-size:3rem;font-weight:800;letter-spacing:.5em;font-family:monospace;}
  .otp-exp{color:#444;font-size:.72rem;margin-top:.5rem;}
  .warn{background:rgba(255,68,68,.06);border:1px solid #ff444422;border-radius:6px;padding:.75rem 1rem;color:#ff6666;font-size:.78rem;line-height:1.6;}
  .footer{padding:1rem 2rem;border-top:1px solid #111;text-align:center;color:#333;font-size:.72rem;}
</style></head><body>
<div class="wrap">
  <div class="header">
    <div style="font-size:2rem;margin-bottom:.4rem">${icon}</div>
    <div class="title">DUNGEON ASCENT</div>
    <div class="sub">${headline}</div>
  </div>
  <div class="body">
    <div class="greet">Warrior <strong style="color:#ffd700">${username}</strong>,</div>
    <div class="msg">${message}</div>
    <div class="otp-box">
      <div class="otp-label">YOUR CODE</div>
      <div class="otp-code">${otp}</div>
      <div class="otp-exp">Expires in 10 minutes</div>
    </div>
    <div class="warn">⚠️ Never share this code with anyone.<br/>If you did not request this, ignore this email.</div>
  </div>
  <div class="footer">Dungeon Ascent · Code Arena · Automated message</div>
</div>
</body></html>`,
    text: subject + "\nCode: " + otp + "\nExpires in 10 minutes.",
  });
}

module.exports = { sendOTPEmail };