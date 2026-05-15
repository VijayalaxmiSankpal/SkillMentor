'use strict';

const verifyEmailTemplate = ({ name, verifyUrl }) => `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Verify Your Email</title></head>
<body style="font-family: Arial, sans-serif; background:#f4f6f8; padding:32px;">
  <div style="max-width:560px; margin:0 auto; background:#ffffff; border-radius:8px; padding:32px; box-shadow:0 1px 3px rgba(0,0,0,0.08);">
    <h2 style="color:#0d6efd; margin-top:0;">Welcome to SkillMentor, ${name}! 🚀</h2>
    <p style="color:#333; font-size:15px; line-height:1.6;">
      Thanks for signing up. Please confirm your email address to activate your account and unlock all features.
    </p>
    <div style="text-align:center; margin:32px 0;">
      <a href="${verifyUrl}" 
         style="background:#0d6efd; color:#fff; padding:12px 28px; text-decoration:none; border-radius:6px; font-weight:600; display:inline-block;">
        Verify Email
      </a>
    </div>
    <p style="color:#666; font-size:13px;">
      Or copy this link into your browser:<br/>
      <a href="${verifyUrl}" style="color:#0d6efd; word-break:break-all;">${verifyUrl}</a>
    </p>
    <p style="color:#999; font-size:12px; margin-top:24px;">
      This link expires in 24 hours. If you didn't create an account, you can safely ignore this email.
    </p>
    <hr style="border:none; border-top:1px solid #eee; margin:24px 0;"/>
    <p style="color:#aaa; font-size:11px; text-align:center; margin:0;">
      © ${new Date().getFullYear()} SkillMentor. All rights reserved.
    </p>
  </div>
</body>
</html>
`;

module.exports = verifyEmailTemplate;