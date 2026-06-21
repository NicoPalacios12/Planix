using Microsoft.AspNetCore.Authorization;
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
                    fullName = user.FullName,
                    userId = user.Id
                });
            }
            else 
            {
                return StatusCode(StatusCodes.Status400BadRequest,
                    new { Message = "Invalid email or password" });
            }
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> CreateEmployee(CreateEmployeeDTO dto)
        {
            string tempPassword = GenerateTempPassword();

            User user = new User()
            {
                UserName = dto.Email,
                Email = dto.Email,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
            };

            IdentityResult identityResult = await _userManager.CreateAsync(user, tempPassword);

            if (!identityResult.Succeeded) 
            {
                return BadRequest(new { Errors = identityResult.Errors });
            }

            await _userManager.AddToRoleAsync(user, "Employee");

            return Ok(new { Message = "Employé créé", tempPassword = tempPassword, Email = user.Email });
        }

        [HttpGet("me")]
        [Authorize]
        public async Task<ActionResult> GetProfil() 
        {
            string? userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            User? user = await _userManager.FindByIdAsync(userId);
            if (user == null) return NotFound();

            return Ok(new
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
            });
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult> ChangePassword(ChangePasswordDTO dto) 
        {
            string? userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            User? user = await _userManager.FindByIdAsync(userId);
            if (user == null) return NotFound();

            if (dto.NewPassword != dto.ConfirmPassword) 
            {
                return BadRequest(new { Message = "Les mots de passe ne correspondent pas" });
            }

            IdentityResult result = await _userManager.ChangePasswordAsync(user, dto.CurrentPassword,dto.NewPassword);

            if (!result.Succeeded) 
            {
                return BadRequest(new { Errors = result.Errors });
            }

            return Ok(new { Message = "Mot de passe changé avec succès" });
        }

        private string GenerateTempPassword() 
        {
            return "Planix" + new Random().Next(1000, 9999) + "$";
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<UserResponseDTO>>> GetUsers() 
        {
            var users = await _userManager.GetUsersInRoleAsync("Employee");
            var result = users.Select(u => new UserResponseDTO
            {
                Id = u.Id,
                FirstName = u.FirstName,
                LastName = u.LastName,
                Email = u.Email!
            }).ToList();
            return Ok(result);
        }
    }
}
