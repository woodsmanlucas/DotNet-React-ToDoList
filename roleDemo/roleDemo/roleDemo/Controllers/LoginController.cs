
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json.Linq;
using roleDemo.Data;
using roleDemo.Repositories;

namespace roleDemo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : Controller
    {
        private readonly SignInManager<IdentityUser> _signInManager;
        private IConfiguration _config;
        private IServiceProvider _serviceProvider;
        private ApplicationDbContext _context;
        private UserManager<IdentityUser> _userManager;

        public LoginController(SignInManager<IdentityUser> signInManager,
                                IConfiguration config,
                                IServiceProvider serviceProvider,
                                ApplicationDbContext context,
                                UserManager<IdentityUser> userManager)
        {
            _signInManager = signInManager;
            _config = config;
            _serviceProvider = serviceProvider;
            _context = context;
            _userManager = userManager;
        }

        [HttpGet]
        [Route("Users")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "Admin,Manager")]
        // Since we have cookie authentication and Jwt authentication we must
        // specify that we want Jwt authentication here.
        public IActionResult Users()
        {
            UserRepo userRepo = new UserRepo(_context);
            var users = userRepo.All();
            return Ok(users);
        }



        [HttpGet]
        [Route("MyRole")]
        // Since we have cookie authentication and Jwt authentication we must
        // specify that we want Jwt authentication here.
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> Role()
        {
            var user = await _userManager.GetUserAsync(User);
            String userName = user.Email;
            UserRoleRepo userRoleRepo = new UserRoleRepo(_serviceProvider);
            var roles = await userRoleRepo.GetUserRoles(userName);
            return Ok(roles);
        }



        [HttpPost]
        public async Task<JsonResult> OnPostAsync([FromBody]LoginVM loginVM)
        {
            dynamic jsonResponse = new JObject();
            if (ModelState.IsValid)
            {
                var result = await
                            _signInManager.PasswordSignInAsync(loginVM.Email.ToUpper(),
                            loginVM.Password, loginVM.RememberMe, lockoutOnFailure: true);
                if (result.Succeeded)
                {
                    var UserManager = _serviceProvider
                        .GetRequiredService<UserManager<IdentityUser>>();
                    var user = await UserManager.FindByEmailAsync(loginVM.Email);

                    if (user != null)
                    {
                        var tokenString = GenerateJSONWebToken(user);
                        jsonResponse.token = tokenString;
                        jsonResponse.status = "OK";
                        return Json(jsonResponse);
                    }
                }
                else if (result.IsLockedOut)
                {
                    jsonResponse.token = "";
                    jsonResponse.status = "Locked Out";
                    return Json(jsonResponse);
                }
            }
            jsonResponse.token = "";
            jsonResponse.status = "Invalid Login";
            return Json(jsonResponse);
        }

        List<Claim> AddUserRoleClaims(List<Claim> claims, string userId)
        {
            // Get current user's roles. 
            var userRoleList = _context.UserRoles.Where(ur => ur.UserId == userId);
            var roleList = from ur in userRoleList
                           from r in _context.Roles
                           where r.Id == ur.RoleId
                           select new { r.Name };

            // Add each of the user's roles to the claims list.
            foreach (var roleItem in roleList)
            {
                claims.Add(new Claim(ClaimTypes.Role, roleItem.Name));
            }
            return claims;
        }

        string GenerateJSONWebToken(IdentityUser user)
        {
            var securityKey
                = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var credentials
                = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
            var claims = new List<Claim> {
                new Claim(JwtRegisteredClaimNames.Sub, user.Email),
                new Claim(JwtRegisteredClaimNames.Jti,
                            Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.NameIdentifier, user.Id)
            };

            claims = AddUserRoleClaims(claims, user.Id);

            var token = new JwtSecurityToken(_config["Jwt:Issuer"],
                _config["Jwt:Issuer"],
                claims,
                expires: DateTime.Now.AddMinutes(120),
                signingCredentials: credentials);
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }

}
