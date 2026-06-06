using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using planix_api.DTOs;
using planix_api.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace planix_api.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly IConfiguration _configuration;

        public UsersController(UserManager<User> userManager, IConfiguration configuration) 
        { 
            _userManager = userManager;
            _configuration = configuration;
        }
        [HttpPost]
        public async Task<ActionResult> Register(RegisterDTO register) 
        {
            if (register.Password != register.PasswordConfirm) 
            {
                return StatusCode(StatusCodes.Status400BadRequest,
                new { Message = "Les deux mots de passe spécifiés sont différents." });
            }
            User user = new User()
            {
                UserName = register.Email,
                FirstName = register.FirstName,
                LastName = register.LastName,
                Email = register.Email
            };
            IdentityResult identityResult = await _userManager.CreateAsync(user,register.Password);

            if (!identityResult.Succeeded)
            {
                return StatusCode(StatusCodes.Status400BadRequest,
                    new { Errors = identityResult.Errors });
            }
            else 
            {
                await _userManager.AddToRoleAsync(user, "Employee");
                return Ok(new { Message = "Sign-up successful" });
            }
        }

        [HttpPost]
        public async Task<ActionResult> Login(LoginDTO login) 
        {
            User? user = await _userManager.FindByEmailAsync(login.Email);
            if (user != null && await _userManager.CheckPasswordAsync(user, login.Password))
            {
                IList<String> roles = await _userManager.GetRolesAsync(user);
                List<Claim> authClaims = new List<Claim>();
                foreach (string role in roles)
                {
                    authClaims.Add(new Claim(ClaimTypes.Role, role));
                }
                authClaims.Add(new Claim(ClaimTypes.NameIdentifier, user.Id));
                SymmetricSecurityKey key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
                JwtSecurityToken token = new JwtSecurityToken(
                    issuer: _configuration["Jwt:Issuer"],
                    audience: _configuration["Jwt:Audience"],
                    claims: authClaims,
                    expires: DateTime.Now.AddMinutes(30),
                    signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature)
                );

                return Ok(new
                {
                    token = new JwtSecurityTokenHandler().WriteToken(token),
                    validTo = token.ValidTo,
                    roles = roles,
                    fullName = user.FullName
                });
            }
            else 
            {
                return StatusCode(StatusCodes.Status400BadRequest,
                    new { Message = "Invalid email or password" });
            }
        }
    }
}
