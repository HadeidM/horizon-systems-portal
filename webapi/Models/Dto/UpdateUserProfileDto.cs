using System;
namespace webapi.Models.Dto
{
    public class UpdateUserProfileDto
    {
        public string Email { get; set; }
        public string Password { get; set; } // ideally should pass a hashed password or change it through a different process
        public string Phone { get; set; }
        public string Address { get; set; }
    }
}
