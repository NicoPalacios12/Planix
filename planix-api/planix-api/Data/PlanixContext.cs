using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using planix_api.Models;

namespace planix_api.Data
{
    public class PlanixContext : IdentityDbContext<User>
    {
        public PlanixContext(DbContextOptions<PlanixContext> options) : base(options) { }

        public DbSet<LeaveRequest> LeaveRequests { get; set; } = default!;
        public DbSet<Schedule> Schedules { get; set; } = default!;
        public DbSet<Shift> Shifts { get; set; } = default!;

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<IdentityRole>().HasData(
                new IdentityRole { Id = "1", Name = "Admin", NormalizedName = "ADMIN" },
                new IdentityRole { Id = "2", Name = "Employee", NormalizedName = "EMPLOYEE" }
            );
            PasswordHasher<User> hasher = new PasswordHasher<User>();
            User u1 = new User
            {
                Id = "11111111-1111-1111-1111-111111111111",
                UserName = "Admin",
                Email = "admin@gmail.com",
                NormalizedUserName = "ADMIN",
                NormalizedEmail = "ADMIN@GMAIL.COM",
                FirstName = "Admin",
                LastName = "Planix",
                SecurityStamp = "fixed-security-stamp-planix-admin"
            };
            u1.PasswordHash = hasher.HashPassword(u1, "Planix2026!");
            builder.Entity<User>().HasData(u1);

            builder.Entity<IdentityUserRole<string>>().HasData(
                new IdentityUserRole<string> { UserId = u1.Id, RoleId = "1" }
            );
        }
    }
}
