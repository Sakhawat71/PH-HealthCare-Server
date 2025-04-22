const resetPasswordHTML = (resetLink: string): string => `
  <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
    <div style="max-width: 600px; margin: auto; background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
      <h2 style="color: #2E86C1;">🔐 Reset Your Password</h2>
      <p>Hi there,</p>
      <p>You requested to reset your password. Click the button below to set a new one:</p>
      <a href="${resetLink}" target="_blank" style="display: inline-block; padding: 12px 20px; margin: 20px 0; background-color: #2E86C1; color: white; text-decoration: none; border-radius: 5px;">
        Reset Password
      </a>
      <p>If you didn’t request this, you can safely ignore this email.</p>
      <p>Thanks,<br/>PH Health Care Team</p>
      <hr style="margin: 30px 0;">
      <p style="font-size: 12px; color: gray;">
        If the button above doesn't work, copy and paste this link into your browser:<br/>
        <a href="${resetLink}" style="color: #2E86C1;">${resetLink}</a>
      </p>
    </div>
  </div>
`;

export default resetPasswordHTML;