using System.ComponentModel.DataAnnotations;

namespace planix_api.Models
{
    public class Shift
    {
        [Key]
        public int Id { get; set; }
        public string DayOfWeek { get; set; }
        public DateTime Date { get; set; }
        public int StartTime { get; set; }
        public int EndTime { get; set; }
        public int BreakMinutes { get; set; }
        public int ScheduleId { get; set; }
        public Schedule? Schedule { get; set; }
    }
}
