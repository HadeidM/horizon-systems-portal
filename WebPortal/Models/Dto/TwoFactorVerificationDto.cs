namespace WebPortal.Models.Dto
{
    public class TwoFactorVerificationDto
    {
        public string TempToken { get; set; }
        public string TwoFactorCode { get; set; }
    }
}

