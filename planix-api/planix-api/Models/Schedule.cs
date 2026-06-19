using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace planix_api.Models
{
    public class Schedule
    {
        [Key]
        public int Id { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string UserId { get; set; }

        [JsonIgnore]
        public ICollection<Shift>? Shifts { get; set; }
        public User? User { get; set; }
    }
}
