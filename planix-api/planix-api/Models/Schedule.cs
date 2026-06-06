using System.ComponentModel.DataAnnotations;

namespace planix_api.Models
{
    public class Schedule
    {
        [Key]
        public int Id { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string UserId { get; set; }
        public ICollection<Shift>? Shifts { get; set; }
        public User? User { get; set; }
    }
}
