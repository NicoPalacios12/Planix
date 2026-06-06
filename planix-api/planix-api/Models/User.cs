
using Microsoft.AspNetCore.Identity;
using System;
using System.ComponentModel.DataAnnotations;

namespace planix_api.Models
{
    public class User : IdentityUser
    {
        public string LastName { get; set; }
        public string FirstName { get; set; }
        public string FullName {
            get { return FirstName + " " + LastName; }
        }
        public ICollection<Schedule>? Schedules { get; set; }
        public ICollection<LeaveRequest>? LeaveRequests { get; set; }
    }
}
