'use strict';

const resetPasswordTemplate = ({ name, resetUrl }) => `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Reset Your Password</title></head>
<body style="font-family: Arial, sans-serif; background:#f4f6f8; padding:32px;">
  <div style="max-width:560px; margin:0 auto; background:#ffffff; border-radius:8px; padding:32px; box-shadow:0 1px 3px rgba(0,0,0,0.08);">
    <h2 style="color:#dc3545; margin-top:0;">Password Reset Request</h2>
    <p style="color:#333; font-size:15px; line-height:1.6;">
      Hi ${name}, we received a request to reset your SkillMentor password. Click the button below to set a new one.
    </p>
    <div style="text-align:center; margin:32px 0;">
      <a href="${resetUrl}"
         style="background:#dc3545; color:#fff; padding:12px 28px; text-decoration:none; border-radius:6px; font-weight:600; display:inline-block;">
        Reset Password
      </a>
    </div>
    <p style="color:#666; font-size:13px;">
      Or copy this link into your browser:<br/>
      <a href="${resetUrl}" style="color:#dc3545; word-break:break-all;">${resetUrl}</a>
    </p>
    <p style="color:#999; font-size:12px; margin-top:24px;">
      This link expires in 15 minutes. If you didn't request a reset, ignore this email — your password remains unchanged.
    </p>
    <hr style="border:none; border-top:1px solid #eee; margin:24px 0;"/>
    <p style="color:#aaa; font-size:11px; text-align:center; margin:0;">
      © ${new Date().getFullYear()} SkillMentor. All rights reserved.
    </p>
  </div>
</body>
</html>
`;

module.exports = resetPasswordTemplate;