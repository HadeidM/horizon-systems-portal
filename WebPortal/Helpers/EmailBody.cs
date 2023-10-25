using System;
namespace WebPortal.Helpers
{
	public static class EmailBody
	{
		public static string EmailStringBody(string email, string emailToken)
		{
            return $@"<html>
  <head>
  </head>
  <body style=""margin: 0; font-family: Arial, Helvetica, sans-serif;"">
    <div style=""height: auto; background: linear-gradient(to top, #FFA07A 50%, #FF4500 90%) no-repeat;"">
      <div style=""width: 400px; height: auto; padding: 15px; background: #f5f5f5; position: absolute; top: 20%; left: 50%; transform: translate(-50%, -20%);"">
        <div>
          <h1 style=""color: #333;"">Reset your Password</h1>
          <hr style=""border: 1px solid #ccc;"">
          <p style=""color: #555;"">You're receiving this e-mail because you requested a password reset for your account.</p>

          <p style=""color: #555;"">Please tap the button below to choose a new password.</p>

          <a href=""http://localhost:4200/reset?email={email}&code={emailToken}"" target=""_blank"" style=""background: #007BFF; padding: 10px; border: none; color: white; border-radius: 4px; display: block; margin: 0 auto; width: 50%; text-align: center; text-decoration: none;"">Reset Password</a><br>

          <p style=""color: #333;"">Best,<br><br>
          Horizon Systems</p>
        </div>
      </div>
    </div>
  </body>
</html>";
        }
	}
}

