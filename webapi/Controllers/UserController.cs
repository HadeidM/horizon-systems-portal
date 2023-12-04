using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Caching.Memory;
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
using Twilio;
using Twilio.Rest.Api.V2010.Account;
using Twilio.Types;
using OtpNet;
using MimeKit.Encodings;

namespace webapi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : Controller
    {
        private readonly AppDbContext _authContext;
        private readonly IConfiguration _configuration;
        private readonly IEmailService _emailService;
        private IMemoryCache _cache;

        public UserController(AppDbContext appDbContext, IConfiguration configuration, IEmailService emailService, IMemoryCache memoryCache)
        {
            _authContext = appDbContext;
            _configuration = configuration;
            _emailService = emailService;
            _cache = memoryCache;
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
        [HttpGet("get_email/{username}")]
        public async Task<IActionResult> GetEmail(string username)
        {
            var user = await _authContext.Users.FirstOrDefaultAsync(a => a.Username == username);
            if (user is null)
            {
                return NotFound(new
                {
                    StatusCode = 404,
                    Message = "Username does not exist."
                });
            }
            return Ok(new
            {
                StatusCode = 200,
                Message = user.Email
            });
        }
        [HttpGet("get_phone/{username}")]
        public async Task<IActionResult> GetPhone(string username)
        {
            var user = await _authContext.Users.FirstOrDefaultAsync(a => a.Username == username);
            if (user is null)
            {
                return NotFound(new
                {
                    StatusCode = 404,
                    Message = "Username does not exist."
                });
            }
            return Ok(new
            {
                StatusCode = 200,
                Message = user.Phone
            });
        }

        [HttpGet("get_mfaOpt/{username}")]
        public async Task<IActionResult> GetMFAOption(string username)
        {
            var user = await _authContext.Users.FirstOrDefaultAsync(a => a.Username == username);
            if (user is null)
            {
                return NotFound(new
                {
                    StatusCode = 404,
                    Message = "Username does not exist."
                });
            }
            return Ok(new
            {
                StatusCode = 200,
                Message = user.MFAOption
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


        [HttpPost("send_otp/{email}")]
        public async Task<IActionResult> SendOTPEmail(string email)
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

            //  Generate code using otp.net..
            var secretKey = KeyGeneration.GenerateRandomKey(20);
            _cache.Set(user.ID, secretKey, TimeSpan.FromMinutes(5)); 

            var totp = new Totp(secretKey);
            var otp = totp.ComputeTotp();

            var emailModel = new EmailModel(email, "Verification Code", EmailOTPBody.EmailStringBody(otp, emailToken));
            _emailService.SendOTPEmail(emailModel);
            _authContext.Entry(user).State = EntityState.Modified; // update database with new reset password token and the expiry
            await _authContext.SaveChangesAsync();
            return Ok(new
            {
                StatusCode = 200,
                Message = "Email Sent!"
            });
        }

        [HttpPost("send_otp_phone/{phone}")]
        public async Task<IActionResult> SendOTPPhone(string phone)
        {
            var user = await _authContext.Users.FirstOrDefaultAsync(a => a.Phone == phone);
            if (user is null)
            {
                return NotFound(new
                {
                    StatusCode = 404,
                    Message = "Phone Number not found in account or it does not exist."
                });
            }
            //  Generate code using otp.net..
            var secretKey = KeyGeneration.GenerateRandomKey(20);
            _cache.Set(user.ID, secretKey, TimeSpan.FromMinutes(5));
            var totp = new Totp(secretKey);
            var otp = totp.ComputeTotp();
            var accountSid = "SID"; 
            var authToken = "TOKEN";
            
            // send message using twilio
            TwilioClient.Init(accountSid, authToken);
            var messageOptions = new CreateMessageOptions(
              new PhoneNumber(phone));
            messageOptions.From = new PhoneNumber("NUMBER");
            messageOptions.Body = "Secure Login: Your Horizon Systems Portal MFA code is " + otp;
            var message = MessageResource.Create(messageOptions);

            _authContext.Entry(user).State = EntityState.Modified; // update database with new reset password token and the expiry
            await _authContext.SaveChangesAsync();
            return Ok(new
            {
                StatusCode = 200,
                Message = "Code Sent to Phone!"
            });
        }

        [HttpPost("verify_mfa")]
        public async Task<IActionResult> VerifyMFA(MFADto mfaDto)
        {
            byte[] data = Convert.FromBase64String(mfaDto.Username);
            string decodedString = Encoding.UTF8.GetString(data);
            var user = await _authContext.Users.AsNoTracking().FirstOrDefaultAsync(a => decodedString == a.Username);
            if (user is null)
                return NotFound(new
                {
                    StatusCode = 404,
                    Message = "No user found with this username!"
                });
            // Generate code using otp.net and saved secret key from database
           
            if (!_cache.TryGetValue(user.ID, out byte[] secretKey))
            {
                // Secret key not found in cache
                return NotFound(new
                {
                    StatusCode = 400,
                    Message = "Your time to enter the code expired or secret key not found in cache!"
                });
            }

            // Generate the OTP
            var totp = new Totp(secretKey);
            var otp = totp.ComputeTotp();
            bool isCorrect = totp.VerifyTotp(mfaDto.MFAToken, out long timeStepMatched, new VerificationWindow(2, 2));
            if (!isCorrect)
                return NotFound(new
                {
                    StatusCode = 400,
                    Message = "Invalid Code!"
                });
            _cache.Remove(user.ID);
            _authContext.Entry(user).State = EntityState.Modified;
            await _authContext.SaveChangesAsync();
            return Ok(new
            {
                StatusCode = 200,
                Message = "OTP Verified Successfully!"
            });
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
        // [Authorize]
        public async Task<IActionResult> GetProfile([FromHeader(Name = "Username")] string base64Username)
        {
            if (string.IsNullOrEmpty(base64Username))
            {
                return BadRequest(new { Message = "Username header is missing!" });
            }

            var username = Encoding.UTF8.GetString(Convert.FromBase64String(base64Username));

            // Assume that the username is the unique identifier for the user and is stored in the claim after authentication
            // var username = User.Identity.Name;
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
        // [Authorize]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateUserProfileDto userProfileDto, [FromHeader(Name = "Username")] string base64Username)
        {
            if (string.IsNullOrEmpty(base64Username))
            {
                return BadRequest(new { Message = "Username header is missing!" });
            }

            var username = Encoding.UTF8.GetString(Convert.FromBase64String(base64Username));

            // var username = User.Identity.Name; // should implement Authorization first
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


