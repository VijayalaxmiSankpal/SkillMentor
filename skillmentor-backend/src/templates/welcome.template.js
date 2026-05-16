'use strict';

const welcomeTemplate = ({ name }) => `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Welcome to SkillMentor</title></head>
<body style="font-family: Arial, sans-serif; background:#f4f6f8; padding:32px;">
  <div style="max-width:560px; margin:0 auto; background:#ffffff; border-radius:8px; padding:32px;">
    <h2 style="color:#198754; margin-top:0;">Email Verified! 🎉</h2>
    <p style="color:#333; font-size:15px; line-height:1.6;">
      Hi ${name}, your SkillMentor account is now fully active. You can now access:
    </p>
    <ul style="color:#333; font-size:15px; line-height:1.8;">
      <li>📚 Personalized career roadmaps</li>
      <li>💻 Coding practice tracker</li>
      <li>🤖 AI-powered interview mentor</li>
      <li>📝 Resume reviews & feedback</li>
    </ul>
    <p style="color:#666; font-size:14px; margin-top:24px;">Happy learning!</p>
  </div>
</body>
</html>
`;

module.exports = welcomeTemplate;