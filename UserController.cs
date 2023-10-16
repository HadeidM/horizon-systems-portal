[HttpPost("register")]
public async Task<IActionResult> Register([FromBody] RegisterModel model)
{
    if (!ModelState.IsValid)
    {
        return BadRequest(ModelState);
    }

    var user = new User
    {
        UserName = model.Username,
    };

    var result = await _userManager.CreateAsync(user, model.Password);

    if (result.Succeeded)
    {
        return Ok("Registration successful");
    }

    return BadRequest("Registration failed");
}

[HttpPost("login")]
public async Task<IActionResult> Login([FromBody] LoginModel model)
{
    var user = await _userManager.FindByNameAsync(model.Username);

    if (user == null || !await _userManager.CheckPasswordAsync(user, model.Password))
    {
        return Unauthorized("Invalid username or password");
    }

    // Generate and return an authentication token here
}
