using System;
namespace webapi.Helpers
{
    public static class EmailOTPBody
    {
        public static string EmailStringBody(string code, string emailToken)
        {
            return $@"<html>
  <head>
  </head>
  <body style=""margin: 0; font-family: Arial, Helvetica, sans-serif;"">
    <div style=""height: auto; background: linear-gradient(to top, #FFA07A 50%, #FF4500 90%) no-repeat;"">
      <div style=""width: 400px; height: auto; padding: 15px; background: #f5f5f5; position: absolute; top: 20%; left: 50%; transform: translate(-50%, -20%);"">
        <div>
          <h1 style=""color: #333;"">Verification Code</h1>
          <hr style=""border: 1px solid #ccc;"">
          <p style=""color: #555;"">Your verification code is <b>{code}</b></p>
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