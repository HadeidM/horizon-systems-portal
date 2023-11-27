using System;
using webapi.Models;

namespace webapi.UtilityService
{
    public interface IEmailService
    {
        void SendEmail(EmailModel emailModel);
        void SendOTPEmail(EmailModel emailModel);
    }
}

