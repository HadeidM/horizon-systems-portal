using Google.Authenticator;
using OtpNet;

namespace WebPortal.UtilityService
{
	public class TwoFactorAuthService
	{
        public string GenerateSetupCode(string userEmail)
        {
            TwoFactorAuthenticator tfa = new TwoFactorAuthenticator();
            var totp = KeyGeneration.GenerateRandomKey();
            string secretKey = Google.Authenticator.Base32Encoding.ToString(totp);
            SetupCode setupInfo =  tfa.GenerateSetupCode("HorizonSystems", userEmail, secretKey, false, 300);
            string manualEntrySetupCode = setupInfo.ManualEntryKey;
            return manualEntrySetupCode;
        }

        public bool ValidateTwoFactorPIN(string secretKey, string twoFactorCodeFromUser)
        {
            TwoFactorAuthenticator tfa = new TwoFactorAuthenticator();
            return tfa.ValidateTwoFactorPIN(secretKey, twoFactorCodeFromUser);
        }
    }
}

