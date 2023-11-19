﻿using System.ComponentModel.DataAnnotations;

namespace WebPortal.Models
{
	public class User
	{
        [Key]
        public int ID { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Address { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string Role { get; set; }
        public string Token { get; set; }
        public string ResetPasswordToken { get; set; }
        public DateTime ResetPasswordExpiry { get; set; }
        public string TwoFactorSecret { get; set; } // used by 2FA app to generate TOTPs
        public bool IsTwoFactorEnabled { get; set; }
    }
}

