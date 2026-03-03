// backend/utils/mailer.js
// Nodemailer via Gmail — zero cost, just needs a Gmail App Password
const nodemailer = require("nodemailer");

let transporter = null;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,   // your Gmail address
        pass: process.env.GMAIL_PASS,   // Gmail App Password (not your real password)
      },
    });
  }
  return transporter;
}

async function sendOTP(toEmail, username, otp) {
  const t = getTransporter();

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <style>
    body { margin:0; padding:0; background:#050508; font-family:'Segoe UI',sans-serif; }
    .wrap { max-width:500px; margin:40px auto; background:#0a0a14; border:1px solid #1a1200; border-radius:12px; overflow:hidden; }
    .header { background:linear-gradient(135deg,#1a0800,#0a0000); padding:2rem; text-align:center; border-bottom:1px solid #2a1200; }
    .logo { font-size:2.5rem; margin-bottom:0.5rem; }
    .game-title { color:#ffd700; font-size:1.6rem; font-weight:800; letter-spacing:0.15em; text-shadow:0 0 20px rgba(255,215,0,0.4); }
    .game-sub { color:#ff4444; font-size:0.7rem; letter-spacing:0.4em; margin-top:0.2rem; }
    .body { padding:2rem; }
    .greeting { color:#e8d5a3; font-size:1rem; margin-bottom:1rem; }
    .message { color:#666; font-size:0.88rem; line-height:1.7; margin-bottom:1.5rem; }
    .otp-box { background:#0d0d1a; border:2px solid #ffd70044; border-radius:10px; padding:1.5rem; text-align:center; margin:1.5rem 0; }
    .otp-label { color:#888; font-size:0.75rem; letter-spacing:0.2em; margin-bottom:0.5rem; }
    .otp-code { color:#ffd700; font-size:2.8rem; font-weight:800; letter-spacing:0.5em; text-shadow:0 0 30px rgba(255,215,0,0.4); font-family:monospace; }
    .otp-expires { color:#444; font-size:0.72rem; margin-top:0.5rem; }
    .warning { background:rgba(255,68,68,0.06); border:1px solid #ff444422; border-radius:6px; padding:0.75rem 1rem; color:#ff6666; font-size:0.78rem; line-height:1.6; }
    .footer { padding:1rem 2rem; border-top:1px solid #111; text-align:center; color:#333; font-size:0.72rem; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="header">
      <div class="logo">⚔️</div>
      <div class="game-title">DUNGEON ASCENT</div>
      <div class="game-sub">CODE ARENA</div>
    </div>
    <div class="body">
      <div class="greeting">Warrior <strong style="color:#ffd700">${username}</strong>,</div>
      <div class="message">
        You're one step away from entering the Code Arena.<br/>
        Use this OTP to verify your email and begin your ascent from the abyss.
      </div>
      <div class="otp-box">
        <div class="otp-label">YOUR VERIFICATION CODE</div>
        <div class="otp-code">${otp}</div>
        <div class="otp-expires">Expires in 10 minutes</div>
      </div>
      <div class="warning">
        ⚠️ Never share this code with anyone.<br/>
        If you didn't request this, ignore this email — no account will be created.
      </div>
    </div>
    <div class="footer">
      Dungeon Ascent · Code Arena · This is an automated message
    </div>
  </div>
</body>
</html>
  `;

  await t.sendMail({
    from: `"Dungeon Ascent" <${process.env.GMAIL_USER}>`,
    to: toEmail,
    subject: `${otp} — Your Dungeon Ascent Verification Code`,
    html,
    text: `Your Dungeon Ascent OTP is: ${otp}\nExpires in 10 minutes.\nDo not share this code.`,
  });
}

module.exports = { sendOTP };