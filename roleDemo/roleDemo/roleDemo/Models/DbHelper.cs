using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace roleDemo.Models
{
    public class DbHelper
    {
    }

    public class ToDo
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public int Priority { get; set; }
        public string Description { get; set; }
        public bool IsComplete { get; set; }
        public string userEmail { get; set; }
    }

    public class TodoContext : DbContext
    {
        public TodoContext(DbContextOptions<TodoContext> options) : base(options) { }
        public DbSet<ToDo> ToDos { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ToDo>().HasData(
                new { Id = 1, Description = "Clean house", Priority = 1, IsComplete = false, userEmail = "woodsman.lucas@gmail.com" },
                new { Id = 2, Description = "Bake cake", Priority = 3, IsComplete = false, userEmail = "woodsman.lucas@gmail.com" }
            );
        }
    }
}
