using System;
using WebPortal.Models;

namespace WebPortal.UtilityService
{
	public interface IEmailService
	{
		void SendEmail(EmailModel emailModel);
	}
}

