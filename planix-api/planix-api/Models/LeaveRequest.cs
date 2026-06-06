using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace planix_api.Models
{
    public class LeaveRequest
    {
        [Key]
        public int Id { get; set; }
        public DateTime StartDate { get; set; } 
        public DateTime EndDate { get; set; }
        public string Status { get; set; }
        public string UserId { get; set; }
        public User User { get; set; }
    }
}
