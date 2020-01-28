using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using roleDemo.Models;

namespace roleDemo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class todoController : ControllerBase
    {
        private readonly TodoContext _context;
        private readonly UserManager<IdentityUser> _userManager;

        public todoController(TodoContext context, UserManager<IdentityUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        public async Task<String> Email()
        {
            var user = await _userManager.GetUserAsync(User);
            return user.Email;
        }

        // GET: api/todo
        [HttpGet]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> GetToDos()
        {
            String email = await Email();
            IEnumerable<ToDo> List =  await _context.ToDos.ToListAsync();
            IEnumerable<ToDo> FilteredList = (from item in List where item.userEmail == email select item);
            return Ok(FilteredList);
        }

        // PUT: api/todo/5
        [HttpPut("{id}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> PutToDo(int id, ToDo toDo)
        {
            if (id != toDo.Id)
            {
                return BadRequest();
            }

            try
            {
                var obj = _context.Find<ToDo>(id);
                obj.Description = toDo.Description;
                obj.IsComplete = toDo.IsComplete;
                obj.Priority = toDo.Priority;
                obj.userEmail = await Email();
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ToDoExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Accepted();
        }

        // POST: api/todo
        [HttpPost]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<ActionResult<ToDo>> PostToDo(ToDo toDo)
        {
            toDo.userEmail = await Email();
            _context.ToDos.Add(toDo);
            await _context.SaveChangesAsync();

            return Ok();
        }

        // DELETE: api/todo/5
        [HttpDelete("{id}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<ActionResult<ToDo>> DeleteToDo(int id)
        {
            String email = await Email();
            var toDo = await _context.ToDos.FindAsync(id);
            if (toDo == null || toDo.userEmail != email)
            {
                return NotFound();
            }

            _context.ToDos.Remove(toDo);
            await _context.SaveChangesAsync();

            return toDo;
        }

        private bool ToDoExists(int id)
        {
            return _context.ToDos.Any(e => e.Id == id);
        }
    }
}
