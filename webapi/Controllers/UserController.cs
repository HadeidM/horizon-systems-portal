using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using webapi.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using webapi.Helpers;
using webapi.Models.Dto;
using webapi.UtilityService;

namespace webapi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : Controller
    {
        private readonly AppDbContext _authContext;
        private readonly IConfiguration _configuration;
        private readonly IEmailService _emailService;

        public UserController(AppDbContext appDbContext, IConfiguration configuration, IEmailService emailService)
        {
            _authContext = appDbContext;
            _configuration = configuration;
            _emailService = emailService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] User userObj)
        {
            if (userObj == null)
                return BadRequest();

            var user = await _authContext.Users
                .FirstOrDefaultAsync(x => x.Username == userObj.Username && x.Password == userObj.Password);

            if (user == null)
                return NotFound(new { Message = "User not found!" });

            user.Token = CreateJwt(user);
            var newAccessToken = user.Token;

            await _authContext.SaveChangesAsync();

            return Ok(new
            {
                AccessToken = newAccessToken,
                MessageProcessingHandler = "Login Successful!"
            });
        }

        [HttpPost("register")]
        public async Task<IActionResult> RegisterUser([FromBody] User userObj)
        {
            if (userObj == null)
                return BadRequest();

            // Check if username is unique
            if (await CheckUsernameExistAsync(userObj.Username))
            {
                return BadRequest(new { Message = "A user with that username already exists." });
            }

            // Check if email is unique
            if (await CheckEmailExistAsync(userObj.Email))
            {
                return BadRequest(new { Message = "An account with this email address already exists." });
            }

            userObj.Role = "User";
            userObj.Token = "";

            await _authContext.Users.AddAsync(userObj);
            await _authContext.SaveChangesAsync();
            return Ok(new
            {
                Message = "Registration Successful!"
            });
        }

        private async Task<bool> CheckUsernameExistAsync(string username)
        {
            return await _authContext.Users.AnyAsync(x => x.Username == username);
        }

        private async Task<bool> CheckEmailExistAsync(string email)
        {
            return await _authContext.Users.AnyAsync(x => x.Email == email);
        }

        [HttpPost("send_reset_email/{email}")]
        public async Task<IActionResult> SendEmail(string email)
        {
            var user = await _authContext.Users.FirstOrDefaultAsync(a => a.Email == email);
            if (user is null)
            {
                return NotFound(new
                {
                    StatusCode = 404,
                    Message = "Email does not exist."
                });
            }
            var tokenBytes = RandomNumberGenerator.GetBytes(64);
            var emailToken = Convert.ToBase64String(tokenBytes);
            user.ResetPasswordToken = emailToken;
            user.ResetPasswordExpiry = DateTime.Now.AddMinutes(10); // user password link get expired in 10 min
            string from = _configuration["EmailSettings:From"];
            var emailModel = new EmailModel(email, "Reset Password", EmailBody.EmailStringBody(email, emailToken));
            _emailService.SendEmail(emailModel);
            _authContext.Entry(user).State = EntityState.Modified; // update database with new reset password token and the expiry
            await _authContext.SaveChangesAsync();
            return Ok(new
            {
                StatusCode = 200,
                Message = "Email Sent!"
            });
        }

        [HttpPost("reset_password")]
        public async Task<IActionResult> ResetPassword(ResetPasswordDto resetPasswordDto)
        {
            var user = await _authContext.Users.AsNoTracking().FirstOrDefaultAsync(a => resetPasswordDto.Email == a.Email);
            if (user is null)
                return NotFound(new
                {
                    StatusCode = 404,
                    Message = "No user found with this email!"
                });

            var tokenCode = user.ResetPasswordToken;
            DateTime emailTokenExpiry = user.ResetPasswordExpiry;
            if (tokenCode != resetPasswordDto.EmailToken || emailTokenExpiry < DateTime.Now)
                return NotFound(new
                {
                    StatusCode = 400,
                    Message = "Invalid reset link!"
                });

            user.Password = resetPasswordDto.NewPassword;
            _authContext.Entry(user).State = EntityState.Modified;
            await _authContext.SaveChangesAsync();
            return Ok(new
            {
                StatusCode = 200,
                Message = "Password Reset Successfully!"
            });
        }

        [HttpGet("profile")]
        [Authorize]
        public async Task<IActionResult> GetProfile()
        {
            // Assume that the username is the unique identifier for the user and is stored in the claim after authentication
            var username = User.Identity.Name;
            var user = await _authContext.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.Username == username);

            if (user == null)
            {
                return NotFound(new { Message = "User not found!" });
            }

            // Only select the details you want to expose, not the entire user object
            var userProfile = new
            {
                user.Email,
                user.Phone,
                user.Address
            };

            return Ok(userProfile);
        }

        [HttpPut("profile")]
        [Authorize] // Ensure only authenticated users can update their profile
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateUserProfileDto userProfileDto)
        {
            var username = User.Identity.Name; // should implement Authorization first
            var user = await _authContext.Users
                .FirstOrDefaultAsync(u => u.Username == username);

            if (user == null)
            {
                return NotFound(new { Message = "User not found!" });
            }

            // Update the user's profile information
            user.Email = userProfileDto.Email;
            user.Password = userProfileDto.Password; // TODO: hash the password if storing passwords in hashed form
            user.Phone = userProfileDto.Phone;
            user.Address = userProfileDto.Address;

            // Mark the entity as modified
            _authContext.Entry(user).State = EntityState.Modified;

            // Save changes to the database
            await _authContext.SaveChangesAsync();

            return Ok(new { Message = "Profile updated successfully!" });
        }

        private string CreateJwt(User user)
        {
            var jwtTokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes("veryverysceret.....");
            var identity = new ClaimsIdentity(new Claim[]
            {
                new Claim(ClaimTypes.Role, user.Role),
                new Claim(ClaimTypes.Name,$"{user.Username}")
            });

            var credentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = identity,
                // Expires = DateTime.Now.AddSeconds(10), // TODO
                SigningCredentials = credentials
            };
            var token = jwtTokenHandler.CreateToken(tokenDescriptor);
            return jwtTokenHandler.WriteToken(token);
        }
     [HttpGet("preferences")]
    [Authorize]
    public async Task<IActionResult> GetPreferences()
    {
        var username = User.Identity.Name;
        var user = await _authContext.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Username == username);

        if (user == null)
        {
            return NotFound(new { Message = "User not found!" });
        }

        var preferences = new UserPreferencesDto
        {
            PrimaryColor = user.PrimaryColor,
            SecondaryColor = user.SecondaryColor,
            LogoUrl = user.LogoUrl,
            MFAOption = user.MFAOption
        };

        return Ok(preferences);
    }

    [HttpPut("preferences")]
    [Authorize]
    public async Task<IActionResult> UpdatePreferences([FromBody] UserPreferencesDto preferencesDto)
    {
        var username = User.Identity.Name;
        var user = await _authContext.Users
            .FirstOrDefaultAsync(u => u.Username == username);

        if (user == null)
        {
            return NotFound(new { Message = "User not found!" });
        }

        user.PrimaryColor = preferencesDto.PrimaryColor;
        user.SecondaryColor = preferencesDto.SecondaryColor;
        user.LogoUrl = preferencesDto.LogoUrl;
        user.MFAOption = preferencesDto.MFAOption;

        _authContext.Entry(user).State = EntityState.Modified;
        await _authContext.SaveChangesAsync();

        return Ok(new { Message = "Preferences updated successfully!" });
    }
    }
}


